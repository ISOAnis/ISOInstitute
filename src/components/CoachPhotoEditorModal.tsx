import * as React from 'react';
import { X, ZoomIn, Move, Crop } from 'lucide-react';
import {
  CARD_PHOTO_HEIGHT,
  CARD_PHOTO_WIDTH,
  DEFAULT_PHOTO_FRAME,
  type CoachPhotoFrame,
  clampFrame,
  photoFrameToObjectPosition,
} from '../utils/coachPhotoStorage';
import {
  clampCropState,
  computeCoverCropState,
  loadImage,
  renderCardPhotoCrop,
  type CardPhotoCropState,
} from '../utils/imageUpload';

export type CoachPhotoEditorMode = 'framing' | 'position';

export interface CoachPhotoEditorResult {
  photo: string;
  frame: CoachPhotoFrame;
}

interface CoachPhotoEditorModalProps {
  open: boolean;
  imageSrc: string;
  mode: CoachPhotoEditorMode;
  initialFrame?: CoachPhotoFrame;
  accentColor?: string;
  onSave: (result: CoachPhotoEditorResult) => void;
  onCancel: () => void;
}

const PREVIEW_SCALE = 1.65;
const PREVIEW_W = Math.round(CARD_PHOTO_WIDTH * PREVIEW_SCALE);
const PREVIEW_H = Math.round(CARD_PHOTO_HEIGHT * PREVIEW_SCALE);

export function CoachPhotoEditorModal({
  open,
  imageSrc,
  mode,
  initialFrame = DEFAULT_PHOTO_FRAME,
  accentColor = '#10b981',
  onSave,
  onCancel,
}: CoachPhotoEditorModalProps) {
  const [imgSize, setImgSize] = React.useState({ w: 0, h: 0 });
  const [crop, setCrop] = React.useState<CardPhotoCropState | null>(null);
  const [baseCoverScale, setBaseCoverScale] = React.useState(1);
  const [frame, setFrame] = React.useState<CoachPhotoFrame>(() => clampFrame(initialFrame));
  const [saving, setSaving] = React.useState(false);
  const dragRef = React.useRef<{ startX: number; startY: number; baseOffsetX: number; baseOffsetY: number } | null>(null);
  const posDragRef = React.useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  React.useEffect(() => {
    if (!open || !imageSrc) return;
    let cancelled = false;
    loadImage(imageSrc).then(img => {
      if (cancelled) return;
      setImgSize({ w: img.width, h: img.height });
      const cover = computeCoverCropState(img.width, img.height);
      setCrop(cover);
      setBaseCoverScale(cover.scale);
      setFrame(clampFrame(initialFrame));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [open, imageSrc, initialFrame, mode]);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleZoomCrop = (multiplier: number) => {
    if (!crop || !imgSize.w) return;
    const newScale = baseCoverScale * multiplier;
    const frameCx = CARD_PHOTO_WIDTH / 2;
    const frameCy = CARD_PHOTO_HEIGHT / 2;
    const imgCx = (frameCx - crop.offsetX) / crop.scale;
    const imgCy = (frameCy - crop.offsetY) / crop.scale;
    setCrop(clampCropState({
      scale: newScale,
      offsetX: frameCx - imgCx * newScale,
      offsetY: frameCy - imgCy * newScale,
    }, imgSize.w, imgSize.h));
  };

  const handleFramingPointerDown = (e: React.PointerEvent) => {
    if (!crop) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseOffsetX: crop.offsetX,
      baseOffsetY: crop.offsetY,
    };
  };

  const handleFramingPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !crop || !imgSize.w) return;
    const dx = (e.clientX - dragRef.current.startX) / PREVIEW_SCALE;
    const dy = (e.clientY - dragRef.current.startY) / PREVIEW_SCALE;
    setCrop(clampCropState({
      scale: crop.scale,
      offsetX: dragRef.current.baseOffsetX + dx,
      offsetY: dragRef.current.baseOffsetY + dy,
    }, imgSize.w, imgSize.h));
  };

  const handleFramingPointerUp = () => {
    dragRef.current = null;
  };

  const handlePositionPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    posDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: frame.x,
      baseY: frame.y,
    };
  };

  const handlePositionPointerMove = (e: React.PointerEvent) => {
    if (!posDragRef.current) return;
    const dx = (e.clientX - posDragRef.current.startX) * 0.15;
    const dy = (e.clientY - posDragRef.current.startY) * 0.15;
    setFrame(clampFrame({
      ...frame,
      x: posDragRef.current.baseX - dx,
      y: posDragRef.current.baseY - dy,
    }));
  };

  const handlePositionPointerUp = () => {
    posDragRef.current = null;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'framing' && crop) {
        const photo = await renderCardPhotoCrop(imageSrc, crop);
        onSave({ photo, frame: { ...DEFAULT_PHOTO_FRAME } });
      } else {
        onSave({ photo: imageSrc, frame: clampFrame(frame) });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const cropZoomValue = crop && baseCoverScale > 0 ? crop.scale / baseCoverScale : 1;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          background: '#0c0c14', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '24px 24px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#F2F2F2',
              margin: 0, letterSpacing: 0.5,
            }}>
              {mode === 'framing' ? 'Frame Your Coach Card Photo' : 'Adjust Photo Position'}
            </h2>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)',
              margin: '6px 0 0', lineHeight: 1.5,
            }}>
              {mode === 'framing'
                ? 'Drag to center your face. This is exactly how players will see your card.'
                : 'Drag to fine-tune placement on your coach card.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Card preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            border: `2px solid ${accentColor}50`,
            borderRadius: 10, padding: 3,
            boxShadow: `0 0 24px ${accentColor}20`,
          }}>
            {mode === 'framing' && crop ? (
              <div
                style={{
                  width: PREVIEW_W, height: PREVIEW_H, overflow: 'hidden',
                  position: 'relative', background: '#060610', borderRadius: 6,
                  cursor: 'grab', touchAction: 'none',
                }}
                onPointerDown={handleFramingPointerDown}
                onPointerMove={handleFramingPointerMove}
                onPointerUp={handleFramingPointerUp}
                onPointerCancel={handleFramingPointerUp}
              >
                <img
                  src={imageSrc}
                  alt=""
                  draggable={false}
                  style={{
                    position: 'absolute',
                    left: crop.offsetX * PREVIEW_SCALE,
                    top: crop.offsetY * PREVIEW_SCALE,
                    width: imgSize.w * crop.scale * PREVIEW_SCALE,
                    height: imgSize.h * crop.scale * PREVIEW_SCALE,
                    maxWidth: 'none',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                }} />
              </div>
            ) : (
              <div
                style={{
                  width: PREVIEW_W, height: PREVIEW_H, overflow: 'hidden',
                  position: 'relative', background: '#060610', borderRadius: 6,
                  cursor: 'grab', touchAction: 'none',
                }}
                onPointerDown={handlePositionPointerDown}
                onPointerMove={handlePositionPointerMove}
                onPointerUp={handlePositionPointerUp}
                onPointerCancel={handlePositionPointerUp}
              >
                <img
                  src={imageSrc}
                  alt=""
                  draggable={false}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: photoFrameToObjectPosition(frame),
                    transform: frame.zoom > 1 ? `scale(${frame.zoom})` : undefined,
                    transformOrigin: photoFrameToObjectPosition(frame),
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          {mode === 'framing' ? <Crop size={14} style={{ color: accentColor }} /> : <Move size={14} style={{ color: accentColor }} />}
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', flex: 1 }}>
            {mode === 'framing' ? 'Drag photo · Zoom below' : 'Drag to reposition'}
          </span>
          <ZoomIn size={14} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.02}
            value={mode === 'framing' ? cropZoomValue : frame.zoom}
            onChange={e => {
              const v = Number(e.target.value);
              if (mode === 'framing') handleZoomCrop(v);
              else setFrame(clampFrame({ ...frame, zoom: v }));
            }}
            style={{ width: 120, accentColor }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 18px', color: 'rgba(255,255,255,0.6)',
              fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || (mode === 'framing' && !crop)}
            style={{
              background: accentColor, border: 'none', borderRadius: 10,
              padding: '10px 20px', color: '#fff',
              fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
