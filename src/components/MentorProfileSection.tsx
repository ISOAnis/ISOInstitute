import { useState } from 'react';
import { Save, Edit3, User, Briefcase, Target, Heart, MessageSquare, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface MentorProfile {
  // Basic Info
  bio: string;
  yearsOfExperience: string;
  currentRole: string;
  
  // Expertise Areas
  expertiseAreas: string[];
  specificSkills: string[];
  industryExperience: string[];
  
  // Mentoring Style
  mentoringStyle: 'hands-on' | 'advisory' | 'balanced' | '';
  communicationStyle: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  
  // Availability
  weeklyHoursAvailable: string;
  preferredMeetingTimes: string[];
  maxMentees: string;
  
  // Mentee Preferences
  idealMenteeTraits: string[];
  mentoringGoals: string;
  successStories: string;
  
  // Values & Approach
  coreValues: string[];
  faithIntegration: string;
  motivations: string;
}

const defaultProfile: MentorProfile = {
  bio: '',
  yearsOfExperience: '',
  currentRole: '',
  expertiseAreas: [],
  specificSkills: [],
  industryExperience: [],
  mentoringStyle: '',
  communicationStyle: '',
  structurePreference: '',
  weeklyHoursAvailable: '',
  preferredMeetingTimes: [],
  maxMentees: '',
  idealMenteeTraits: [],
  mentoringGoals: '',
  successStories: '',
  coreValues: [],
  faithIntegration: '',
  motivations: ''
};

export function MentorProfileSection() {
  const [profile, setProfile] = useState<MentorProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(true);
  const [activeSection, setActiveSection] = useState<'basic' | 'style' | 'availability' | 'preferences'>('basic');

  const handleSave = () => {
    // In production, this would save to backend
    console.log('Saving mentor profile:', profile);
    setIsEditing(false);
  };

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

  const toggleArrayItem = (array: string[], item: string, setter: (val: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2">Coach Profile</h2>
            <p className="text-slate-400">
              Complete your profile to help us match you with the right players
            </p>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSection('basic')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'basic'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Basic Info
        </button>
        <button
          onClick={() => setActiveSection('style')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'style'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Coaching Style
        </button>
        <button
          onClick={() => setActiveSection('availability')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'availability'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Availability
        </button>
        <button
          onClick={() => setActiveSection('preferences')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeSection === 'preferences'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Preferences
        </button>
      </div>

      {/* Content Sections */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Professional Bio</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Share your professional background, experience, and what you're passionate about..."
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={profile.yearsOfExperience}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                  placeholder="e.g., 8 years"
                  disabled={!isEditing}
                  className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Current Role</label>
                <input
                  type="text"
                  value={profile.currentRole}
                  onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  disabled={!isEditing}
                  className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-3">Areas of Expertise</label>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => isEditing && toggleArrayItem(
                      profile.expertiseAreas,
                      option,
                      (val) => setProfile({ ...profile, expertiseAreas: val })
                    )}
                    disabled={!isEditing}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      profile.expertiseAreas.includes(option)
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                value={profile.specificSkills.join(', ')}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  specificSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="e.g., Python, React, System Design, Public Speaking"
                disabled={!isEditing}
                className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-white mb-3">Core Values</label>
              <div className="flex flex-wrap gap-2">
                {valueOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => isEditing && toggleArrayItem(
                      profile.coreValues,
                      option,
                      (val) => setProfile({ ...profile, coreValues: val })
                    )}
                    disabled={!isEditing}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      profile.coreValues.includes(option)
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mentoring Style Section */}
        {activeSection === 'style' && (
          <div className="space-y-6">
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
                    onClick={() => isEditing && setProfile({ ...profile, mentoringStyle: option.value as any })}
                    disabled={!isEditing}
                    className={`p-4 rounded-xl text-left border-2 transition-all ${
                      profile.mentoringStyle === option.value
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    onClick={() => isEditing && setProfile({ ...profile, communicationStyle: option.value as any })}
                    disabled={!isEditing}
                    className={`p-4 rounded-xl text-left border-2 transition-all ${
                      profile.communicationStyle === option.value
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    onClick={() => isEditing && setProfile({ ...profile, structurePreference: option.value as any })}
                    disabled={!isEditing}
                    className={`p-4 rounded-xl text-left border-2 transition-all ${
                      profile.structurePreference === option.value
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                value={profile.faithIntegration}
                onChange={(e) => setProfile({ ...profile, faithIntegration: e.target.value })}
                placeholder="How do you integrate faith and spirituality into your coaching? Share your approach..."
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
          </div>
        )}

        {/* Availability Section */}
        {activeSection === 'availability' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Weekly Hours Available</label>
                <select
                  value={profile.weeklyHoursAvailable}
                  onChange={(e) => setProfile({ ...profile, weeklyHoursAvailable: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none disabled:opacity-50"
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
                  value={profile.maxMentees}
                  onChange={(e) => setProfile({ ...profile, maxMentees: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none disabled:opacity-50"
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
                {[
                  'Weekday Mornings',
                  'Weekday Afternoons',
                  'Weekday Evenings',
                  'Weekend Mornings',
                  'Weekend Afternoons',
                  'Weekend Evenings'
                ].map((time) => (
                  <button
                    key={time}
                    onClick={() => isEditing && toggleArrayItem(
                      profile.preferredMeetingTimes,
                      time,
                      (val) => setProfile({ ...profile, preferredMeetingTimes: val })
                    )}
                    disabled={!isEditing}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      profile.preferredMeetingTimes.includes(time)
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-3">Ideal Player Traits</label>
              <p className="text-slate-400 text-sm mb-3">
                What qualities do you look for in players you work best with?
              </p>
              <div className="flex flex-wrap gap-2">
                {menteeTraitOptions.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => isEditing && toggleArrayItem(
                      profile.idealMenteeTraits,
                      trait,
                      (val) => setProfile({ ...profile, idealMenteeTraits: val })
                    )}
                    disabled={!isEditing}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      profile.idealMenteeTraits.includes(trait)
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Your Coaching Goals</label>
              <Textarea
                value={profile.mentoringGoals}
                onChange={(e) => setProfile({ ...profile, mentoringGoals: e.target.value })}
                placeholder="What do you hope to achieve through coaching? What impact do you want to make?"
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Success Stories</label>
              <Textarea
                value={profile.successStories}
                onChange={(e) => setProfile({ ...profile, successStories: e.target.value })}
                placeholder="Share 1-2 examples of players you've helped succeed and what made those relationships work..."
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-white mb-2">What Motivates You to Coach?</label>
              <Textarea
                value={profile.motivations}
                onChange={(e) => setProfile({ ...profile, motivations: e.target.value })}
                placeholder="Why do you give your time to coach others? What drives you?"
                disabled={!isEditing}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Profile Completeness Indicator */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white">Profile Completeness</h4>
          <span className="text-orange-400">
            {Math.round((
              (profile.bio ? 1 : 0) +
              (profile.yearsOfExperience ? 1 : 0) +
              (profile.expertiseAreas.length > 0 ? 1 : 0) +
              (profile.mentoringStyle ? 1 : 0) +
              (profile.communicationStyle ? 1 : 0) +
              (profile.weeklyHoursAvailable ? 1 : 0) +
              (profile.idealMenteeTraits.length > 0 ? 1 : 0)
            ) / 7 * 100)}%
          </span>
        </div>
        <div className="bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-400 h-full transition-all duration-500"
            style={{
              width: `${Math.round((
                (profile.bio ? 1 : 0) +
                (profile.yearsOfExperience ? 1 : 0) +
                (profile.expertiseAreas.length > 0 ? 1 : 0) +
                (profile.mentoringStyle ? 1 : 0) +
                (profile.communicationStyle ? 1 : 0) +
                (profile.weeklyHoursAvailable ? 1 : 0) +
                (profile.idealMenteeTraits.length > 0 ? 1 : 0)
              ) / 7 * 100)}%`
            }}
          />
        </div>
        <p className="text-slate-400 text-sm">
          Complete your profile to improve AI matching accuracy and help us connect you with ideal players.
        </p>
      </Card>
    </div>
  );
}
