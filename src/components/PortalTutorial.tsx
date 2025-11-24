import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialStep {
  title: string;
  description: string;
  highlight?: string; // Element ID or class to highlight
}

interface PortalTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  role: 'coach' | 'player';
}

export function PortalTutorial({ steps, onComplete, role }: PortalTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Mark tutorial as completed in localStorage
    localStorage.setItem(`iso_tutorial_completed_${role}`, 'true');
    onComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const tutorialContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 10000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-orange-500/20 relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-6 text-white relative rounded-t-3xl">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="pr-12">
                <h2 className="text-white text-2xl font-bold mb-1">
                  Welcome to your {role === 'coach' ? 'Coach' : 'Player'} Portal!
                </h2>
                <p className="text-white/90 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-white text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-orange-500 w-8'
                        : index < currentStep
                        ? 'bg-orange-500/50'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-slate-800 text-slate-300 px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors font-medium"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render to document.body using portal to ensure it's above everything
  if (typeof document !== 'undefined') {
    return createPortal(tutorialContent, document.body);
  }
  
  return null;
}

