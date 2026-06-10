import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface SignupModalProps {
  onClose: () => void;
  onSignupComplete: (userData: { name: string; email: string; password: string }) => void;
}

export function SignupModal({ onClose, onSignupComplete }: SignupModalProps) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleComplete = () => {
    if (!userData.name || !userData.email || !userData.password) {
      return;
    }
    onSignupComplete(userData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-orange-500/20"
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
          
          <h2 className="text-white mb-2">Create Your Free Account</h2>
          <p className="text-white/90">
            Get started with ISO in just a few seconds
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-slate-900">
            <div className="space-y-6">
            {/* Social Login Options */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    console.log('Sign up with Google');
                    // TODO: Implement Google OAuth
                    // For now, simulate signup with Google
                    const mockGoogleUser = {
                      name: 'Google User',
                      email: 'user@gmail.com',
                      password: 'oauth-google'
                    };
                    onSignupComplete(mockGoogleUser);
                  }}
                  className="flex items-center justify-center gap-2 bg-white text-slate-900 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors font-medium w-full"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                
                <button
                  onClick={() => {
                    console.log('Sign up with Apple');
                    // TODO: Implement Apple OAuth
                    // For now, simulate signup with Apple
                    const mockAppleUser = {
                      name: 'Apple User',
                      email: 'user@icloud.com',
                      password: 'oauth-apple'
                    };
                    onSignupComplete(mockAppleUser);
                  }}
                  className="flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl transition-colors font-medium w-full"
                  style={{ backgroundColor: '#111111' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">Or continue with email</span>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Create account with email</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2">Password</label>
                    <input
                      type="password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>
              
                <button
                  onClick={handleComplete}
              disabled={!userData.name || !userData.email || !userData.password}
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold"
                >
                  Create Account
                </button>
              </div>
        </div>
      </motion.div>
    </div>
  );
}
