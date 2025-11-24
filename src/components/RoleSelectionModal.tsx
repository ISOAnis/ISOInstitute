import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { User, GraduationCap } from 'lucide-react';

interface RoleSelectionModalProps {
  onClose: () => void;
  onSelectRole: (role: 'coach' | 'player') => void;
  userName: string;
}

export function RoleSelectionModal({ onClose, onSelectRole, userName }: RoleSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-orange-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-white text-2xl font-bold mb-2">Welcome, {userName}!</h2>
          <p className="text-white/90">
            Are you signing up as a coach or as a player?
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 gap-4">
            {/* Player Option */}
            <motion.button
              onClick={() => onSelectRole('player')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 hover:border-orange-500 transition-all text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <User className="w-8 h-8 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-1">Player</h3>
                  <p className="text-slate-400 text-sm">
                    Get matched with coaches, track your progress, and grow with personalized mentorship
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Coach Option */}
            <motion.button
              onClick={() => onSelectRole('coach')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 hover:border-orange-500 transition-all text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <GraduationCap className="w-8 h-8 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold mb-1">Coach</h3>
                  <p className="text-slate-400 text-sm">
                    Share your expertise, mentor the next generation, and build your coaching brand
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

