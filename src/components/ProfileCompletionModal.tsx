import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { InteractiveGlobe } from './InteractiveGlobe';

interface ProfileCompletionModalProps {
  onClose: () => void;
  onComplete: (profileData: any) => void;
}

export function ProfileCompletionModal({ onClose, onComplete }: ProfileCompletionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
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

  const valueOptions = [
    'Integrity', 'Excellence', 'Service', 'Growth Mindset',
    'Accountability', 'Faith-Centered', 'Community', 'Discipline'
  ];

  const toggleValue = (value: string) => {
    if (profileData.topValues.includes(value)) {
      setProfileData({ ...profileData, topValues: profileData.topValues.filter(v => v !== value) });
    } else {
      if (profileData.topValues.length < 3) {
        setProfileData({ ...profileData, topValues: [...profileData.topValues, value] });
      }
    }
  };

  const addCustomValue = () => {
    if (customValue.trim() && !profileData.topValues.includes(customValue.trim()) && profileData.topValues.length < 3) {
      setProfileData({ ...profileData, topValues: [...profileData.topValues, customValue.trim()] });
      setCustomValue('');
    }
  };

  const handleComplete = () => {
    onComplete(profileData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={onClose}>
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
          
          <h2 className="text-white mb-2">Complete Your Profile</h2>
          <p className="text-white/90">
            Help us match you with the perfect coach
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-slate-900">
          {currentStep === 1 && (
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
                    locations={profileData.locations}
                    onAddLocation={(loc) => setProfileData({ ...profileData, locations: [...profileData.locations, loc] })}
                    onRemoveLocation={(index) => setProfileData({ ...profileData, locations: profileData.locations.filter((_, i) => i !== index) })}
                    maxLocations={3}
                  />
                </div>

                {/* Age and School Year */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-slate-300 mb-2">Age</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none"
                      placeholder="Your age"
                      min="13"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2">Year in School</label>
                    <select
                      value={profileData.schoolYear}
                      onChange={(e) => setProfileData({ ...profileData, schoolYear: e.target.value })}
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
                {profileData.locations.length > 0 && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.prefersSameBackground}
                        onChange={(e) => setProfileData({ ...profileData, prefersSameBackground: e.target.checked })}
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
                  onClick={onClose}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={profileData.locations.length === 0 || !profileData.age || !profileData.schoolYear}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">What are your main goals?</h3>
                <p className="text-slate-400 mb-4">
                  This helps us match you with mentors who can best support your journey.
                </p>
                <textarea
                  value={profileData.goals}
                  onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-orange-500 focus:outline-none min-h-[120px]"
                  placeholder="Describe what you want to achieve..."
                />
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
                  disabled={!profileData.goals.trim()}
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
                <h3 className="text-white mb-4">How much time can you commit weekly?</h3>
                <select
                  value={profileData.timeframe}
                  onChange={(e) => setProfileData({ ...profileData, timeframe: e.target.value })}
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
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  disabled={!profileData.timeframe}
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
                <h3 className="text-white mb-4">How do you prefer to communicate?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'direct', label: 'Direct', desc: 'Straightforward feedback' },
                    { value: 'supportive', label: 'Supportive', desc: 'Encouraging approach' },
                    { value: 'balanced', label: 'Balanced', desc: 'Mix of both' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileData({ ...profileData, communicationPreference: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        profileData.communicationPreference === option.value
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
                  onClick={() => setCurrentStep(3)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  disabled={!profileData.communicationPreference}
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
                <h3 className="text-white mb-4">What's your preferred learning structure?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'structured', label: 'Structured', desc: 'Clear curriculum' },
                    { value: 'flexible', label: 'Flexible', desc: 'Adapt to pace' },
                    { value: 'adaptive', label: 'Adaptive', desc: 'Mix of both' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileData({ ...profileData, structurePreference: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        profileData.structurePreference === option.value
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
                  disabled={!profileData.structurePreference}
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
                <h3 className="text-white mb-4">What best describes your motivation level?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'exploring', label: 'Exploring', desc: 'Testing the waters' },
                    { value: 'committed', label: 'Committed', desc: 'Ready to work' },
                    { value: 'all-in', label: 'All-In', desc: 'Fully dedicated' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileData({ ...profileData, motivationLevel: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        profileData.motivationLevel === option.value
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
                  disabled={!profileData.motivationLevel}
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
                <h3 className="text-white mb-4">Select your top values (choose 2-3)</h3>
                <div className="flex flex-wrap gap-2">
                  {valueOptions.map((value) => (
                    <button
                      key={value}
                      onClick={() => toggleValue(value)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profileData.topValues.includes(value)
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
                    disabled={!customValue.trim() || profileData.topValues.includes(customValue.trim()) || profileData.topValues.length >= 3}
                    className="mt-2 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Value
                  </button>
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
                  onClick={handleComplete}
                  disabled={profileData.topValues.length < 2}
                  className="flex-1 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {currentStep <= 7 && (
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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

