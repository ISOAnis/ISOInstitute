import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { InteractiveGlobe } from './InteractiveGlobe';
import { Textarea } from './ui/textarea';

interface CoachProfileCompletionModalProps {
  onClose: () => void;
  onComplete: (profileData: any) => void;
}

export function CoachProfileCompletionModal({ onClose, onComplete }: CoachProfileCompletionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    locations: [] as { lat: number; lng: number; label: string }[],
    bio: '',
    yearsOfExperience: '',
    currentRole: '',
    expertiseAreas: [] as string[],
    specificSkills: '',
    coreValues: [] as string[],
    mentoringStyle: '' as 'hands-on' | 'advisory' | 'balanced' | '',
    communicationStyle: '' as 'direct' | 'supportive' | 'balanced' | '',
    structurePreference: '' as 'structured' | 'flexible' | 'adaptive' | '',
    faithIntegration: '',
    weeklyHoursAvailable: '',
    preferredMeetingTimes: [] as string[],
    maxMentees: '',
    idealMenteeTraits: [] as string[],
    mentoringGoals: '',
    successStories: '',
    motivations: '',
  });

  const expertiseOptions = [
    'Career Transition', 'Interview Prep', 'Resume Building', 'Networking',
    'Leadership Development', 'Technical Skills', 'Entrepreneurship', 
    'Work-Life Balance', 'Faith & Career', 'Personal Development'
  ];

  const valueOptions = [
    'Integrity', 'Excellence', 'Service', 'Growth Mindset',
    'Accountability', 'Faith-Centered', 'Community', 'Discipline'
  ];

  const menteeTraitOptions = [
    'Highly Motivated', 'Open to Feedback', 'Consistent', 'Self-Starter',
    'Goal-Oriented', 'Action-Taker', 'Reflective', 'Coachable'
  ];

  const meetingTimeOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings'
  ];

  const toggleExpertise = (expertise: string) => {
    if (profileData.expertiseAreas.includes(expertise)) {
      setProfileData({ ...profileData, expertiseAreas: profileData.expertiseAreas.filter(e => e !== expertise) });
    } else {
      setProfileData({ ...profileData, expertiseAreas: [...profileData.expertiseAreas, expertise] });
    }
  };

  const toggleValue = (value: string) => {
    if (profileData.coreValues.includes(value)) {
      setProfileData({ ...profileData, coreValues: profileData.coreValues.filter(v => v !== value) });
    } else {
      setProfileData({ ...profileData, coreValues: [...profileData.coreValues, value] });
    }
  };

  const toggleMeetingTime = (time: string) => {
    if (profileData.preferredMeetingTimes.includes(time)) {
      setProfileData({ ...profileData, preferredMeetingTimes: profileData.preferredMeetingTimes.filter(t => t !== time) });
    } else {
      setProfileData({ ...profileData, preferredMeetingTimes: [...profileData.preferredMeetingTimes, time] });
    }
  };

  const toggleMenteeTrait = (trait: string) => {
    if (profileData.idealMenteeTraits.includes(trait)) {
      setProfileData({ ...profileData, idealMenteeTraits: profileData.idealMenteeTraits.filter(t => t !== trait) });
    } else {
      setProfileData({ ...profileData, idealMenteeTraits: [...profileData.idealMenteeTraits, trait] });
    }
  };

  const handleComplete = () => {
    // Get existing coach profile data
    const existingData = localStorage.getItem('coach_profile_data');
    let coachProfileData: any = {};
    
    if (existingData) {
      try {
        coachProfileData = JSON.parse(existingData);
      } catch (error) {
        console.warn('Failed to parse existing coach profile data:', error);
      }
    }
    
    // Merge profile data into existing coach profile data
    const updatedProfileData = {
      ...coachProfileData,
      locations: profileData.locations,
      bio: profileData.bio,
      yearsOfExperience: profileData.yearsOfExperience,
      currentRole: profileData.currentRole,
      expertiseAreas: profileData.expertiseAreas,
      specificSkills: profileData.specificSkills.split(',').map(s => s.trim()).filter(Boolean),
      coreValues: profileData.coreValues,
      mentoringStyle: profileData.mentoringStyle,
      communicationStyle: profileData.communicationStyle,
      structurePreference: profileData.structurePreference,
      faithIntegration: profileData.faithIntegration,
      weeklyHoursAvailable: profileData.weeklyHoursAvailable,
      preferredMeetingTimes: profileData.preferredMeetingTimes,
      maxMentees: profileData.maxMentees,
      idealMenteeTraits: profileData.idealMenteeTraits,
      mentoringGoals: profileData.mentoringGoals,
      successStories: profileData.successStories,
      motivations: profileData.motivations
    };
    
    onComplete(updatedProfileData);
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return profileData.locations.length > 0;
    }
    if (currentStep === 2) {
      return profileData.bio.trim() !== '' && 
             profileData.yearsOfExperience.trim() !== '' && 
             profileData.currentRole.trim() !== '';
    }
    if (currentStep === 3) {
      return profileData.mentoringStyle !== '' && 
             profileData.communicationStyle !== '' && 
             profileData.structurePreference !== '';
    }
    if (currentStep === 4) {
      return profileData.weeklyHoursAvailable !== '' && 
             profileData.maxMentees !== '' &&
             profileData.preferredMeetingTimes.length > 0;
    }
    return true;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's start by learning about your background";
      case 2: return "Tell us about your professional experience";
      case 3: return "Describe your coaching style";
      case 4: return "Set your availability";
      case 5: return "Share your preferences and goals";
      default: return "Complete Your Coach Profile";
    }
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
          
          <h2 className="text-white mb-2">Complete Your Coach Profile</h2>
          <p className="text-white/90">
            {getStepTitle()}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-slate-900">
          {/* Step 1: Locations */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Tell us about your background</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Understanding your background helps players find coaches who share similar experiences or are located in their area. This creates more meaningful connections.
                </p>
                
                {/* Interactive Globe */}
                <div className="mb-6">
                  <label className="block text-slate-300 mb-3">
                    Where are you from? (Click on the globe or search to add up to 3 locations)
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
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Professional Information</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Share your professional background and expertise to help players understand what you can offer.
                </p>
              </div>

              <div>
                <label className="block text-white mb-2">Professional Bio</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Share your professional background, experience, and what you're passionate about..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Years of Experience</label>
                  <input
                    type="text"
                    value={profileData.yearsOfExperience}
                    onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: e.target.value })}
                    placeholder="e.g., 8 years"
                    className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Current Role</label>
                  <input
                    type="text"
                    value={profileData.currentRole}
                    onChange={(e) => setProfileData({ ...profileData, currentRole: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-3">Areas of Expertise</label>
                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleExpertise(option)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profileData.expertiseAreas.includes(option)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Specific Skills (comma-separated)</label>
                <input
                  type="text"
                  value={profileData.specificSkills}
                  onChange={(e) => setProfileData({ ...profileData, specificSkills: e.target.value })}
                  placeholder="e.g., Python, React, System Design, Public Speaking"
                  className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-3">Core Values</label>
                <div className="flex flex-wrap gap-2">
                  {valueOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleValue(option)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profileData.coreValues.includes(option)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
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
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Coaching Style */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Coaching Style</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Help players understand your coaching approach and how you work with them.
                </p>
              </div>

              <div>
                <label className="block text-white mb-3">Coaching Approach</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'hands-on', label: 'Hands-On', desc: 'Active guidance & frequent check-ins' },
                    { value: 'advisory', label: 'Advisory', desc: 'Strategic guidance & direction' },
                    { value: 'balanced', label: 'Balanced', desc: 'Mix of both approaches' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileData({ ...profileData, mentoringStyle: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        profileData.mentoringStyle === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-white mb-1">{option.label}</div>
                      <div className="text-slate-400 text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-3">Communication Style</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'direct', label: 'Direct', desc: 'Clear, straightforward feedback' },
                    { value: 'supportive', label: 'Supportive', desc: 'Encouraging & empathetic' },
                    { value: 'balanced', label: 'Balanced', desc: 'Adapts to player needs' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setProfileData({ ...profileData, communicationStyle: option.value as any })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        profileData.communicationStyle === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-white mb-1">{option.label}</div>
                      <div className="text-slate-400 text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-3">Structure Preference</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'structured', label: 'Structured', desc: 'Clear curriculum & milestones' },
                    { value: 'flexible', label: 'Flexible', desc: 'Adapt to player\'s pace' },
                    { value: 'adaptive', label: 'Adaptive', desc: 'Mix of structure & flexibility' }
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
                      <div className="text-slate-400 text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Faith Integration Approach</label>
                <Textarea
                  value={profileData.faithIntegration}
                  onChange={(e) => setProfileData({ ...profileData, faithIntegration: e.target.value })}
                  placeholder="How do you integrate faith and spirituality into your coaching? Share your approach..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
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
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Availability */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Availability</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Let players know when you're available and how many players you can work with.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Weekly Hours Available</label>
                  <select
                    value={profileData.weeklyHoursAvailable}
                    onChange={(e) => setProfileData({ ...profileData, weeklyHoursAvailable: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select hours...</option>
                    <option value="1-2">1-2 hours</option>
                    <option value="3-5">3-5 hours</option>
                    <option value="5-10">5-10 hours</option>
                    <option value="10+">10+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Max Number of Players</label>
                  <select
                    value={profileData.maxMentees}
                    onChange={(e) => setProfileData({ ...profileData, maxMentees: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select number...</option>
                    <option value="1-2">1-2 players</option>
                    <option value="3-5">3-5 players</option>
                    <option value="6-10">6-10 players</option>
                    <option value="10+">10+ players</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-3">Preferred Meeting Times</label>
                <div className="flex flex-wrap gap-2">
                  {meetingTimeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => toggleMeetingTime(time)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profileData.preferredMeetingTimes.includes(time)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {time}
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
                  disabled={!canProceedToNextStep()}
                  className="flex-1 bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-4">Preferences & Goals</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Share what you're looking for in players and what drives you as a coach.
                </p>
              </div>

              <div>
                <label className="block text-white mb-3">Ideal Player Traits</label>
                <p className="text-slate-400 text-sm mb-3">
                  What qualities do you look for in players you work best with?
                </p>
                <div className="flex flex-wrap gap-2">
                  {menteeTraitOptions.map((trait) => (
                    <button
                      key={trait}
                      onClick={() => toggleMenteeTrait(trait)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        profileData.idealMenteeTraits.includes(trait)
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Your Coaching Goals</label>
                <Textarea
                  value={profileData.mentoringGoals}
                  onChange={(e) => setProfileData({ ...profileData, mentoringGoals: e.target.value })}
                  placeholder="What do you hope to achieve through coaching? What impact do you want to make?"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Success Stories</label>
                <Textarea
                  value={profileData.successStories}
                  onChange={(e) => setProfileData({ ...profileData, successStories: e.target.value })}
                  placeholder="Share 1-2 examples of players you've helped succeed and what made those relationships work..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-white mb-2">What Motivates You to Coach?</label>
                <Textarea
                  value={profileData.motivations}
                  onChange={(e) => setProfileData({ ...profileData, motivations: e.target.value })}
                  placeholder="Why do you give your time to coach others? What drives you?"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-slate-700 text-white px-8 py-3 rounded-full hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === currentStep ? 'bg-orange-500' : step < currentStep ? 'bg-orange-500/50' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
