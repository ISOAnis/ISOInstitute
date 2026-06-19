/** Resize/compress images for profile uploads — keeps onboarding responsive */

import type { CoachPhotoFrame } from './coachPhotoStorage';
import { CARD_PHOTO_HEIGHT, CARD_PHOTO_WIDTH } from './coachPhotoStorage';

const DEFAULT_MAX_DIM = 800;
const DEFAULT_QUALITY = 0.82;
const MAX_FILE_BYTES = 12 * 1024 * 1024;
const CARD_EXPORT_SCALE = 2;

export async function compressImageFile(
  file: File,
  maxDim = DEFAULT_MAX_DIM,
  quality = DEFAULT_QUALITY,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Image is too large. Please use a photo under 12 MB.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

export const ONBOARDING_PHOTO_KEY = 'iso-onboarding-photo';

export function persistOnboardingPhoto(photo: string | null | undefined) {
  try {
    if (photo) localStorage.setItem(ONBOARDING_PHOTO_KEY, photo);
    else localStorage.removeItem(ONBOARDING_PHOTO_KEY);
  } catch {
    // Photo stays in memory for this session if storage is full
  }
}

export function loadOnboardingPhoto(): string | null {
  try {
    return localStorage.getItem(ONBOARDING_PHOTO_KEY);
  } catch {
    return null;
  }
}

export interface CardPhotoCropState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/** Initial pan/zoom so image covers the coach card photo area, centered */
export function computeCoverCropState(
  imgWidth: number,
  imgHeight: number,
  frameW = CARD_PHOTO_WIDTH,
  frameH = CARD_PHOTO_HEIGHT,
): CardPhotoCropState {
  const scale = Math.max(frameW / imgWidth, frameH / imgHeight);
  const drawW = imgWidth * scale;
  const drawH = imgHeight * scale;
  return {
    scale,
    offsetX: (frameW - drawW) / 2,
    offsetY: (frameH - drawH) / 2,
  };
}

export function clampCropState(
  state: CardPhotoCropState,
  imgWidth: number,
  imgHeight: number,
  frameW = CARD_PHOTO_WIDTH,
  frameH = CARD_PHOTO_HEIGHT,
): CardPhotoCropState {
  const drawW = imgWidth * state.scale;
  const drawH = imgHeight * state.scale;
  const minOffsetX = frameW - drawW;
  const minOffsetY = frameH - drawH;
  return {
    scale: state.scale,
    offsetX: Math.min(0, Math.max(minOffsetX, state.offsetX)),
    offsetY: Math.min(0, Math.max(minOffsetY, state.offsetY)),
  };
}

/** Render visible card photo region to a JPEG data URL */
export async function renderCardPhotoCrop(
  imageSrc: string,
  crop: CardPhotoCropState,
  quality = 0.88,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const frameW = CARD_PHOTO_WIDTH;
  const frameH = CARD_PHOTO_HEIGHT;
  const clamped = clampCropState(crop, img.width, img.height, frameW, frameH);

  const canvas = document.createElement('canvas');
  canvas.width = frameW * CARD_EXPORT_SCALE;
  canvas.height = frameH * CARD_EXPORT_SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  const srcX = -clamped.offsetX / clamped.scale;
  const srcY = -clamped.offsetY / clamped.scale;
  const srcW = frameW / clamped.scale;
  const srcH = frameH / clamped.scale;

  ctx.drawImage(
    img,
    srcX, srcY, srcW, srcH,
    0, 0, canvas.width, canvas.height,
  );
  return canvas.toDataURL('image/jpeg', quality);
}

/** Render object-position + zoom framing for position-only edits */
export async function renderCardPhotoFrame(
  imageSrc: string,
  frame: CoachPhotoFrame,
  quality = 0.88,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const exportW = CARD_PHOTO_WIDTH * CARD_EXPORT_SCALE;
  const exportH = CARD_PHOTO_HEIGHT * CARD_EXPORT_SCALE;

  const canvas = document.createElement('canvas');
  canvas.width = exportW;
  canvas.height = exportH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  const containerAspect = exportW / exportH;
  const imgAspect = img.width / img.height;
  let drawW: number;
  let drawH: number;

  if (imgAspect > containerAspect) {
    drawH = exportH * frame.zoom;
    drawW = drawH * imgAspect;
  } else {
    drawW = exportW * frame.zoom;
    drawH = drawW / imgAspect;
  }

  const focusX = (frame.x / 100) * drawW;
  const focusY = (frame.y / 100) * drawH;
  const destX = exportW / 2 - focusX;
  const destY = exportH / 2 - focusY;

  ctx.drawImage(img, destX, destY, drawW, drawH);
  return canvas.toDataURL('image/jpeg', quality);
}
