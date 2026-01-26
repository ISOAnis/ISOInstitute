import * as React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Dumbbell, Activity, Settings, Rocket, Globe, X, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAccentColor } from './ForPlayers';

type PathwayData = {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  tagline: string;
  color: string;
};

interface PathwaySelectionModalProps {
  onClose: () => void;
  onPathwaySelect: (pathwayId: string) => void;
}

const CARD_SURFACE_BASE = "relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.55)] p-12 cursor-pointer transition-all duration-300";

const pathways: PathwayData[] = [
  {
    id: 'deen',
    icon: Moon,
    name: 'Deen & Purpose',
    description: 'Spiritual development, Islamic knowledge, reflection, and balance between dunya and akhirah. This is the core of all growth — everything flows from this center.',
    tagline: '"Center your faith before your function."',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'health',
    icon: Dumbbell,
    name: 'Health & Fitness',
    description: 'Discipline through the body — physical wellness, gym consistency, mental health, nutrition, and self-discipline.',
    tagline: '"Train your body. Strengthen your mind."',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'medicine',
    icon: Activity,
    name: 'Medicine & Healthcare',
    description: 'Serving through healing — for those exploring pre-med, nursing, public health, or medical professions.',
    tagline: '"Serve through science and compassion."',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'engineering',
    icon: Settings,
    name: 'Engineering & Technology',
    description: 'Building and solving — for innovators in STEM and design who want to leave a real-world impact.',
    tagline: '"Design, build, and solve for tomorrow."',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'entrepreneurship',
    icon: Rocket,
    name: 'Entrepreneurship & Business',
    description: 'For builders, dreamers, and leaders turning ideas into reality — from startups to social ventures.',
    tagline: '"Build something that outlasts you."',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'global',
    icon: Globe,
    name: 'Global Affairs, Law, & Policy',
    description: 'For those navigating global impact — economics, diplomacy, international organizations, and ethical leadership.',
    tagline: '"Lead globally. Move with purpose."',
    color: 'from-cyan-500 to-blue-600',
  },
];

function PathwayCard({ pathway, onClick }: { pathway: PathwayData; onClick: () => void }) {
  const IconComponent = pathway.icon;
  const accentColor = getAccentColor(pathway.color);
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return (
    <motion.div
      className={CARD_SURFACE_BASE}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02, 
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 40px ${hexToRgba(accentColor, 0.4)}, 0 0 80px ${hexToRgba(accentColor, 0.2)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 60px rgba(0,0,0,0.55)';
      }}
    >
      <div 
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ 
          backgroundColor: hexToRgba(accentColor, 0.15),
        }}
      />
      
      <div
        className="absolute left-0 top-0 h-full w-[2px] opacity-60"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex flex-col items-center justify-center gap-6 relative z-10 text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          {IconComponent && <IconComponent className="w-10 h-10 text-white" />}
        </div>
        <h3 
          className="text-white text-3xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {pathway.name}
        </h3>
      </div>
    </motion.div>
  );
}

export function PathwaySelectionModal({ onClose, onPathwaySelect }: PathwaySelectionModalProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handlePathwaySelect = (pathwayId: string) => {
    setIsVisible(false);
    // Mark pathway selection as completed
    localStorage.setItem('iso_pathway_selection_completed', 'true');
    // Store selected pathway
    localStorage.setItem('iso_selected_pathway', pathwayId);
    // Call the callback to show profile completion modal
    onPathwaySelect(pathwayId);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('iso_pathway_selection_completed', 'skipped');
    onClose();
  };

  if (!isVisible) return null;

  const modalContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 10001 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-3xl max-w-6xl w-full shadow-2xl border border-orange-500/20 relative max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-6 text-white relative rounded-t-3xl sticky top-0 z-10">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="pr-12">
                <h2 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  Choose Your Pathway
                </h2>
                <p className="text-white/90 text-base">
                  Select the pathway that aligns with your goals and interests
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pathways.map((pathway) => (
                  <PathwayCard
                    key={pathway.id}
                    pathway={pathway}
                    onClick={() => handlePathwaySelect(pathway.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}

