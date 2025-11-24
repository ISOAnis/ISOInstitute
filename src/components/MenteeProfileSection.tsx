import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Edit3, Save, X, MapPin, User, Calendar, GraduationCap, Globe2, Heart, MessageCircle, Layout, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { InteractiveGlobe } from './InteractiveGlobe';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface MenteeProfile {
  name: string;
  email: string;
  age: string;
  schoolYear: string;
  locations: Location[];
  prefersSameBackground: boolean;
  goals: string;
  timeframe: string;
  communicationPreference: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  motivationLevel: 'exploring' | 'committed' | 'all-in' | '';
  topValues: string[];
}

const defaultProfile: MenteeProfile = {
  name: '',
  email: '',
  age: '',
  schoolYear: '',
  locations: [],
  prefersSameBackground: false,
  goals: '',
  timeframe: '',
  communicationPreference: '',
  structurePreference: '',
  motivationLevel: '',
  topValues: []
};

const schoolYearLabels: Record<string, string> = {
  'high-school-freshman': 'High School Freshman',
  'high-school-sophomore': 'High School Sophomore',
  'high-school-junior': 'High School Junior',
  'high-school-senior': 'High School Senior',
  'college-freshman': 'College Freshman',
  'college-sophomore': 'College Sophomore',
  'college-junior': 'College Junior',
  'college-senior': 'College Senior',
  'graduate-student': 'Graduate Student',
  'recent-grad': 'Recent Graduate (0-2 years)',
  'young-professional': 'Young Professional (3-5 years)',
  'experienced-professional': 'Experienced Professional (5+ years)',
  'other': 'Other'
};

const communicationLabels = {
  direct: 'Direct & Candid',
  supportive: 'Warm & Supportive',
  balanced: 'Balanced Approach'
};

const structureLabels = {
  structured: 'Highly Structured',
  flexible: 'Flexible & Adaptive',
  adaptive: 'Responsive to My Needs'
};

const motivationLabels = {
  exploring: 'Just Exploring',
  committed: 'Seriously Committed',
  'all-in': 'All In - Ready to Transform'
};

interface MenteeProfileSectionProps {
  onProfileCompletionChange?: (percentage: number) => void;
}

export function MenteeProfileSection({ onProfileCompletionChange }: MenteeProfileSectionProps) {
  const [profile, setProfile] = useState<MenteeProfile>(() => {
    try {
      const saved = localStorage.getItem('player_profile_data');
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load player profile data:', error);
    }
    return defaultProfile;
  });
  const [isEditingBasics, setIsEditingBasics] = useState(false);
  const [isEditingDemographics, setIsEditingDemographics] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [tempProfile, setTempProfile] = useState<MenteeProfile>(() => profile);

  useEffect(() => {
    localStorage.setItem('player_profile_data', JSON.stringify(profile));
  }, [profile]);

  const completionPercentage = useMemo(() => {
    const checks: Array<boolean> = [
      Boolean(profile.name?.trim()),
      Boolean(profile.email?.trim()),
      Boolean(profile.age?.trim()),
      Boolean(profile.schoolYear?.trim()),
      profile.locations.length > 0,
      profile.prefersSameBackground !== null,
      Boolean(profile.goals?.trim()),
      Boolean(profile.timeframe?.trim()),
      profile.communicationPreference !== '',
      profile.structurePreference !== '',
      profile.motivationLevel !== '',
      profile.topValues.length >= 2,
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [profile]);

  useEffect(() => {
    onProfileCompletionChange?.(completionPercentage);
  }, [completionPercentage, onProfileCompletionChange]);

  const startEditBasics = () => {
    setTempProfile({ ...profile });
    setIsEditingBasics(true);
  };

  const saveBasics = () => {
    setProfile({ ...tempProfile });
    setIsEditingBasics(false);
  };

  const cancelEditBasics = () => {
    setTempProfile({ ...profile });
    setIsEditingBasics(false);
  };

  const startEditDemographics = () => {
    setTempProfile({ ...profile });
    setIsEditingDemographics(true);
  };

  const saveDemographics = () => {
    setProfile({ ...tempProfile });
    setIsEditingDemographics(false);
  };

  const cancelEditDemographics = () => {
    setTempProfile({ ...profile });
    setIsEditingDemographics(false);
  };

  const startEditPreferences = () => {
    setTempProfile({ ...profile });
    setIsEditingPreferences(true);
  };

  const savePreferences = () => {
    setProfile({ ...tempProfile });
    setIsEditingPreferences(false);
  };

  const cancelEditPreferences = () => {
    setTempProfile({ ...profile });
    setIsEditingPreferences(false);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Globe2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white mb-2">How Your Profile Helps Matching</h4>
            <p className="text-slate-300 text-sm mb-3">
              Your profile information helps our AI matching system pair you with the best coaches:
            </p>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Demographics</strong> help us match you with coaches who understand your cultural background and life stage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Goals & Timeframe</strong> ensure your coach can help you achieve what you're aiming for</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Communication & Structure</strong> preferences match you with coaches whose style resonates with you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span><strong>Values</strong> align you with coaches who share what matters most to you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            <h3 className="text-white">Basic Information</h3>
          </div>
          {!isEditingBasics && (
            <Button onClick={startEditBasics} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Name</label>
            {isEditingBasics ? (
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
              />
            ) : (
              <p className="text-white">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Email</label>
            {isEditingBasics ? (
              <input
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
              />
            ) : (
              <p className="text-white">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Your Goals</label>
            {isEditingBasics ? (
              <Textarea
                value={tempProfile.goals}
                onChange={(e) => setTempProfile({ ...tempProfile, goals: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none min-h-[100px]"
                placeholder="What do you hope to achieve through coaching?"
              />
            ) : (
              <p className="text-white">{profile.goals}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Desired Timeframe</label>
            {isEditingBasics ? (
              <select
                value={tempProfile.timeframe}
                onChange={(e) => setTempProfile({ ...tempProfile, timeframe: e.target.value })}
                className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
              >
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1+ years">1+ years</option>
              </select>
            ) : (
              <p className="text-white">{profile.timeframe}</p>
            )}
          </div>

          {isEditingBasics && (
            <div className="flex gap-3 pt-4">
              <Button onClick={saveBasics} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={cancelEditBasics} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h3 className="text-white">Demographics & Background</h3>
          </div>
          {!isEditingDemographics && (
            <Button onClick={startEditDemographics} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Age and School Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Age</label>
              {isEditingDemographics ? (
                <input
                  type="number"
                  value={tempProfile.age}
                  onChange={(e) => setTempProfile({ ...tempProfile, age: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                  min="13"
                  max="100"
                />
              ) : (
                <p className="text-white">{profile.age}</p>
              )}
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Year in School</label>
              {isEditingDemographics ? (
                <select
                  value={tempProfile.schoolYear}
                  onChange={(e) => setTempProfile({ ...tempProfile, schoolYear: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:border-orange-500 focus:outline-none"
                >
                  {Object.entries(schoolYearLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white">{schoolYearLabels[profile.schoolYear] || profile.schoolYear}</p>
              )}
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-slate-400 text-sm mb-3">Cultural Background (Locations)</label>
            {isEditingDemographics ? (
              <div className="mb-4">
                <InteractiveGlobe
                  locations={tempProfile.locations}
                  onAddLocation={(loc) => setTempProfile({ ...tempProfile, locations: [...tempProfile.locations, loc] })}
                  onRemoveLocation={(index) => setTempProfile({ ...tempProfile, locations: tempProfile.locations.filter((_, i) => i !== index) })}
                  maxLocations={3}
                />
              </div>
            ) : (
              <div className="space-y-2">
                {profile.locations.map((loc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-white">{loc.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Background Preference */}
          {(isEditingDemographics ? tempProfile.locations.length > 0 : profile.locations.length > 0) && (
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditingDemographics ? tempProfile.prefersSameBackground : profile.prefersSameBackground}
                  onChange={(e) => isEditingDemographics && setTempProfile({ ...tempProfile, prefersSameBackground: e.target.checked })}
                  disabled={!isEditingDemographics}
                  className="mt-1 w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                />
                <div>
                  <span className="text-white block mb-1">I prefer coaches from similar cultural backgrounds</span>
                  <span className="text-slate-400 text-sm">
                    We'll prioritize matching you with coaches who share your cultural heritage or have lived in similar regions
                  </span>
                </div>
              </label>
            </div>
          )}

          {isEditingDemographics && (
            <div className="flex gap-3 pt-4">
              <Button onClick={saveDemographics} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={cancelEditDemographics} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-500" />
            <h3 className="text-white">Coaching Preferences</h3>
          </div>
          {!isEditingPreferences && (
            <Button onClick={startEditPreferences} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Communication Style */}
          <div>
            <label className="block text-slate-400 text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Communication Style
            </label>
            {isEditingPreferences ? (
              <div className="space-y-2">
                {Object.entries(communicationLabels).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer hover:border-orange-500/50 transition-colors">
                    <input
                      type="radio"
                      name="communication"
                      value={value}
                      checked={tempProfile.communicationPreference === value}
                      onChange={(e) => setTempProfile({ ...tempProfile, communicationPreference: e.target.value as any })}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-white">{label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {communicationLabels[profile.communicationPreference as keyof typeof communicationLabels]}
              </Badge>
            )}
          </div>

          {/* Structure Preference */}
          <div>
            <label className="block text-slate-400 text-sm mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Coaching Structure
            </label>
            {isEditingPreferences ? (
              <div className="space-y-2">
                {Object.entries(structureLabels).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer hover:border-orange-500/50 transition-colors">
                    <input
                      type="radio"
                      name="structure"
                      value={value}
                      checked={tempProfile.structurePreference === value}
                      onChange={(e) => setTempProfile({ ...tempProfile, structurePreference: e.target.value as any })}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-white">{label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {structureLabels[profile.structurePreference as keyof typeof structureLabels]}
              </Badge>
            )}
          </div>

          {/* Motivation Level */}
          <div>
            <label className="block text-slate-400 text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Motivation Level
            </label>
            {isEditingPreferences ? (
              <div className="space-y-2">
                {Object.entries(motivationLabels).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer hover:border-orange-500/50 transition-colors">
                    <input
                      type="radio"
                      name="motivation"
                      value={value}
                      checked={tempProfile.motivationLevel === value}
                      onChange={(e) => setTempProfile({ ...tempProfile, motivationLevel: e.target.value as any })}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-white">{label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {motivationLabels[profile.motivationLevel as keyof typeof motivationLabels]}
              </Badge>
            )}
          </div>

          {/* Top Values */}
          <div>
            <label className="block text-slate-400 text-sm mb-3">Top Values (What Matters Most)</label>
            <div className="flex flex-wrap gap-2">
              {profile.topValues.map((value, index) => (
                <Badge key={index} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {value}
                </Badge>
              ))}
            </div>
          </div>

          {isEditingPreferences && (
            <div className="flex gap-3 pt-4">
              <Button onClick={savePreferences} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={cancelEditPreferences} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
