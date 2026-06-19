import { useState, useLayoutEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { PortalTutorialStep } from '../utils/portalTutorial';
import { getTutorialWelcomeTitle } from '../utils/portalTutorial';

interface PortalTutorialProps {
  steps: PortalTutorialStep[];
  tutorialScope: string;
  role: 'coach' | 'player';
  onComplete: () => void;
  onNavigate?: (section: string) => void;
  onExpandSidebar?: (expanded: boolean) => void;
}

const SPOTLIGHT_PAD = 10;

function isSidebarTarget(target?: string) {
  if (!target) return false;
  return target.includes('-nav-') || target.includes('locker-room') || target.includes('upgrade');
}

export function PortalTutorial({
  steps,
  tutorialScope,
  role,
  onComplete,
  onNavigate,
  onExpandSidebar,
}: PortalTutorialProps) {
  const maskId = useId().replace(/:/g, '');
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const hasTarget = Boolean(step?.target);

  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setSpotlightRect(null);
      return;
    }

    const el = document.querySelector(`[data-tutorial-id="${step.target}"]`);
    if (!el) {
      setSpotlightRect(null);
      return;
    }

    el.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' });
    setSpotlightRect(el.getBoundingClientRect());
  }, [step]);

  useLayoutEffect(() => {
    if (!step) return;
    if (step.section) onNavigate?.(step.section);
    if (isSidebarTarget(step.target)) onExpandSidebar?.(true);

    const timer = window.setTimeout(measureTarget, step.section ? 260 : 100);
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [currentStep, step, measureTarget, onNavigate, onExpandSidebar]);

  if (!steps.length || !step) return null;

  const finish = () => onComplete();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      finish();
    }
  };

  const welcomeTitle = getTutorialWelcomeTitle(role, tutorialScope as never);
  const progressPct = ((currentStep + 1) / steps.length) * 100;

  const spotlightStyle = spotlightRect
    ? {
        top: spotlightRect.top - SPOTLIGHT_PAD,
        left: spotlightRect.left - SPOTLIGHT_PAD,
        width: spotlightRect.width + SPOTLIGHT_PAD * 2,
        height: spotlightRect.height + SPOTLIGHT_PAD * 2,
      }
    : null;

  const tutorialContent = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      {/* Dim overlay with SVG cutout */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          <defs>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              {spotlightStyle && (
                <rect
                  x={spotlightStyle.left}
                  y={spotlightStyle.top}
                  width={spotlightStyle.width}
                  height={spotlightStyle.height}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.78)"
            mask={`url(#${maskId})`}
          />
        </svg>

        {hasTarget && spotlightStyle && (
          <div
            style={{
              position: 'fixed',
              ...spotlightStyle,
              borderRadius: 12,
              border: '2px solid rgba(249, 115, 22, 0.9)',
              boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.25), 0 0 28px rgba(249, 115, 22, 0.35)',
            }}
          />
        )}
      </div>

      {/* Callout — inline styles so it always renders visibly */}
      <div
        style={{
          position: 'fixed',
          left: 'max(16px, env(safe-area-inset-left))',
          right: 'max(16px, env(safe-area-inset-right))',
          bottom: 'max(24px, env(safe-area-inset-bottom))',
          maxWidth: 420,
          marginLeft: 'auto',
          marginRight: 16,
          pointerEvents: 'auto',
          zIndex: 10001,
        }}
      >
        <div style={{
          background: '#0f172a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          <div style={{ height: 4, background: '#1e293b' }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: '#f97316',
              transition: 'width 0.3s ease',
            }} />
          </div>

          <div style={{ padding: '16px 20px 20px' }}>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'rgba(249, 115, 22, 0.9)',
              margin: '0 0 4px',
            }}>
              {currentStep === 0 ? welcomeTitle : `Step ${currentStep + 1} of ${steps.length}`}
            </p>
            <h3 style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 8px',
              lineHeight: 1.3,
            }}>
              {step.title}
            </h3>
            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 14,
              color: 'rgba(203, 213, 225, 0.95)',
              margin: '0 0 20px',
              lineHeight: 1.55,
            }}>
              {step.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={finish}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 12px',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 14,
                  color: 'rgba(148, 163, 184, 0.95)',
                }}
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  flex: 1,
                  minHeight: 44,
                  background: '#f97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {isLastStep ? (
                  <>
                    <CheckCircle2 size={16} />
                    Got it
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(tutorialContent, document.body);
  }

  return null;
}
