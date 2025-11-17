import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { InteractiveGlobe } from './InteractiveGlobe';

interface SignupModalProps {
  onClose: () => void;
  onSignupComplete: (userData: any) => void;
}

export function SignupModal({ onClose, onSignupComplete }: SignupModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    // Basic Account Info
    name: '',
    email: '',
    password: '',
    
    // Demographics
    locations: [] as { lat: number; lng: number; label: string }[],
    age: '',
    schoolYear: '',
    prefersSameBackground: false,
    
    // Profile Questions
    goals: '',
    timeframe: '',
    communicationPreference: '' as 'direct' | 'supportive' | 'balanced' | '',
    structurePreference: '' as 'structured' | 'flexible' | 'adaptive' | '',
    motivationLevel: '' as 'exploring' | 'committed' | 'all-in' | '',
    topValues: [] as string[]
  });

  const [customValue, setCustomValue] = useState('');
  const [showGlobeHelper, setShowGlobeHelper] = useState(false);

  const valueOptions = [
    'Integrity', 'Excellence', 'Service', 'Growth Mindset',
    'Accountability', 'Faith-Centered', 'Community', 'Discipline'
  ];

  const toggleValue = (value: string) => {
    if (userData.topValues.includes(value)) {
      setUserData({ ...userData, topValues: userData.topValues.filter(v => v !== value) });
    } else {
      if (userData.topValues.length < 3) {
        setUserData({ ...userData, topValues: [...userData.topValues, value] });
      }
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && !userData.topValues.includes(customValue.trim()) && userData.topValues.length < 3) {
      setUserData({ ...userData, topValues: [...userData.topValues, customValue.trim()] });
      setCustomValue('');
    }
  };

  const handleComplete = () => {
    console.log('Creating account with data:', userData);
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
            Build your profile to get matched with the perfect mentor
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-slate-900">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Let's start with the basics</h3>
                
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
              
              {/* Social Login Options */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      console.log('Sign up with Google');
                      // TODO: Implement Google OAuth
                    }}
                    className="flex items-center justify-center gap-2 bg-white text-slate-900 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors font-medium"
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
                    }}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl hover:bg-slate-900 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!userData.name || !userData.email || !userData.password}
                className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Tell us about your background</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Understanding your cultural and educational background helps us match you with mentors who share similar experiences or can provide relevant guidance. This creates more meaningful connections and better support.
                </p>
                
                {/* Interactive Globe */}
                <div className="mb-6">
                  <label className="block text-slate-300 mb-3">
                    Where are you from? (Click on the globe to add up to 3 locations)
                  </label>
                  <p className="text-slate-400 text-sm mb-3">
                    For mixed heritage or those who've lived in multiple places, you can select up to 3 locations
                  </p>
                  <InteractiveGlobe
                    locations={userData.locations}
                    onAddLocation={(loc) => setUserData({ ...userData, locations: [...userData.locations, loc] })}
                    onRemoveLocation={(index) => setUserData({ ...userData, locations: userData.locations.filter((_, i) => i !== index) })}
                    maxLocations={3}
                  />
                </div>

                {/* Age and School Year */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-slate-300 mb-2">Age</label>
                    <input
                      type="number"
                      value={userData.age}
                      onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      placeholder="Your age"
                      min="13"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2">Year in School</label>
                    <select
                      value={userData.schoolYear}
                      onChange={(e) => setUserData({ ...userData, schoolYear: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="high-school-freshman">High School Freshman</option>
                      <option value="high-school-sophomore">High School Sophomore</option>
                      <option value="high-school-junior">High School Junior</option>
                      <option value="high-school-senior">High School Senior</option>
                      <option value="college-freshman">College Freshman</option>
                      <option value="college-sophomore">College Sophomore</option>
                      <option value="college-junior">College Junior</option>
                      <option value="college-senior">College Senior</option>
                      <option value="graduate-student">Graduate Student</option>
                      <option value="recent-grad">Recent Graduate (0-2 years)</option>
                      <option value="young-professional">Young Professional (3-5 years)</option>
                      <option value="experienced-professional">Experienced Professional (5+ years)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Background Preference */}
                {userData.locations.length > 0 && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userData.prefersSameBackground}
                        onChange={(e) => setUserData({ ...userData, prefersSameBackground: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                      />
                      <div>
                        <span className="text-white block mb-1">I prefer mentors from similar cultural backgrounds</span>
                        <span className="text-slate-400 text-sm">
                          We'll prioritize matching you with mentors who share your cultural heritage or have lived in similar regions
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={userData.locations.length === 0 || !userData.age || !userData.schoolYear}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">What are your main goals?</h3>
                <p className="text-slate-400 mb-4">
                  This helps us match you with mentors who can best support your journey.
                </p>
                <textarea
                  value={userData.goals}
                  onChange={(e) => setUserData({ ...userData, goals: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none min-h-[120px]"
                  placeholder="Describe what you want to achieve..."
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!userData.goals.trim()}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">How much time can you commit weekly?</h3>
                <select
                  value={userData.timeframe}
                  onChange={(e) => setUserData({ ...userData, timeframe: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select your commitment level...</option>
                  <option value="1-2-hours">1-2 hours per week</option>
                  <option value="3-5-hours">3-5 hours per week</option>
                  <option value="5-10-hours">5-10 hours per week</option>
                  <option value="10-plus-hours">10+ hours per week</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  disabled={!userData.timeframe}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">How do you prefer to communicate?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'direct', label: 'Direct', desc: 'Straightforward feedback' },
                    { value: 'supportive', label: 'Supportive', desc: 'Encouraging approach' },
                    { value: 'balanced', label: 'Balanced', desc: 'Mix of both' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserData({ ...userData, communicationPreference: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        userData.communicationPreference === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-white mb-1">{option.label}</div>
                      <div className="text-slate-400 text-xs">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  disabled={!userData.communicationPreference}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">What's your preferred learning structure?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'structured', label: 'Structured', desc: 'Clear curriculum' },
                    { value: 'flexible', label: 'Flexible', desc: 'Adapt to pace' },
                    { value: 'adaptive', label: 'Adaptive', desc: 'Mix of both' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserData({ ...userData, structurePreference: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        userData.structurePreference === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-white mb-1">{option.label}</div>
                      <div className="text-slate-400 text-xs">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  disabled={!userData.structurePreference}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">What best describes your motivation level?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'exploring', label: 'Exploring', desc: 'Testing the waters' },
                    { value: 'committed', label: 'Committed', desc: 'Ready to work' },
                    { value: 'all-in', label: 'All-In', desc: 'Fully dedicated' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setUserData({ ...userData, motivationLevel: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        userData.motivationLevel === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-white mb-1">{option.label}</div>
                      <div className="text-slate-400 text-xs">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  disabled={!userData.motivationLevel}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Select your top values (choose 2-3)</h3>
                <div className="flex flex-wrap gap-2">
                  {valueOptions.map((value) => (
                    <button
                      key={value}
                      onClick={() => toggleValue(value)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        userData.topValues.includes(value)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                    placeholder="Add a custom value"
                  />
                  <button
                    onClick={addCustomValue}
                    disabled={!customValue.trim() || userData.topValues.includes(customValue.trim()) || userData.topValues.length >= 3}
                    className="mt-2 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Value
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={userData.topValues.length < 2}
                  className="flex-1 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {currentStep <= 8 && (
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === currentStep ? 'bg-orange-500' : step < currentStep ? 'bg-orange-500/50' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}