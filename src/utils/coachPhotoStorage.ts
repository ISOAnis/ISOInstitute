/** Coach card photo framing — position/zoom for headshot on trading card */

export interface CoachPhotoFrame {
  /** object-position X (0–100), default center */
  x: number;
  /** object-position Y (0–100), default center */
  y: number;
  /** Extra zoom for fine-tuning (1 = none) */
  zoom: number;
}

export const CARD_PHOTO_WIDTH = 268;
export const CARD_PHOTO_HEIGHT = 160;

export const DEFAULT_PHOTO_FRAME: CoachPhotoFrame = { x: 50, y: 50, zoom: 1 };

export const PHOTO_FRAME_KEY = 'coach_profile_photo_frame';

export function clampFrame(frame: Partial<CoachPhotoFrame>): CoachPhotoFrame {
  return {
    x: Math.min(100, Math.max(0, frame.x ?? 50)),
    y: Math.min(100, Math.max(0, frame.y ?? 50)),
    zoom: Math.min(3, Math.max(1, frame.zoom ?? 1)),
  };
}

export function loadPhotoFrame(): CoachPhotoFrame {
  try {
    const raw = localStorage.getItem(PHOTO_FRAME_KEY);
    if (!raw) return { ...DEFAULT_PHOTO_FRAME };
    return clampFrame(JSON.parse(raw) as CoachPhotoFrame);
  } catch {
    return { ...DEFAULT_PHOTO_FRAME };
  }
}

export function savePhotoFrame(frame: CoachPhotoFrame) {
  try {
    localStorage.setItem(PHOTO_FRAME_KEY, JSON.stringify(clampFrame(frame)));
  } catch {
    // ignore quota errors
  }
}

export function photoFrameToObjectPosition(frame: CoachPhotoFrame): string {
  return `${frame.x}% ${frame.y}%`;
}
