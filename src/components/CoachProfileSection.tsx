import { useState, useRef, useEffect, useMemo } from 'react';
import { Save, Edit3, User, Target, MessageSquare, Clock, Camera, X, Move } from 'lucide-react';
import { InteractiveGlobe } from './InteractiveGlobe';
import { CoachPhotoEditorModal } from './CoachPhotoEditorModal';
import { PORTAL_ACCENT, PORTAL_PANEL_BG, PORTAL_PANEL_BORDER } from '../utils/portalTheme';
import { compressImageFile } from '../utils/imageUpload';
import type { CoachPhotoFrame } from '../utils/coachPhotoStorage';
import { DEFAULT_PHOTO_FRAME, loadPhotoFrame, savePhotoFrame } from '../utils/coachPhotoStorage';

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#F2F2F2', marginBottom: 8,
  fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
};

const mutedStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)', fontFamily: "'Barlow', sans-serif", fontSize: 13,
};

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '12px 14px', color: '#F2F2F2', fontFamily: "'Barlow', sans-serif",
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: 120, resize: 'vertical',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, appearance: 'auto' as const, cursor: 'pointer',
};

const tabBtnStyle = (active: boolean, accent: string): React.CSSProperties => ({
  padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
  fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap',
  display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
  ...(active
    ? { background: accent, color: '#fff' }
    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)' }),
});

const pillStyle = (selected: boolean, accent: string): React.CSSProperties => ({
  padding: '8px 16px', borderRadius: 100, fontSize: 13, cursor: 'pointer',
  fontFamily: "'Barlow', sans-serif", border: '1px solid transparent', transition: 'all 0.15s',
  ...(selected
    ? { background: accent, color: '#fff', borderColor: accent }
    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.1)' }),
});

const optionCardStyle = (selected: boolean, accent: string): React.CSSProperties => ({
  padding: 16, borderRadius: 12, textAlign: 'left', cursor: 'pointer', border: '2px solid',
  transition: 'all 0.15s', width: '100%',
  ...(selected
    ? { borderColor: accent, background: `${accent}15` }
    : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }),
});

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface CoachProfile {
  // Basic Info
  bio: string;
  yearsOfExperience: string;
  currentRole: string;
  locations: Location[];
  
  // Expertise Areas
  expertiseAreas: string[];
  specificSkills: string[];
  industryExperience: string[];
  
  // Coaching Style
  coachingStyle: 'hands-on' | 'advisory' | 'balanced' | '';
  communicationStyle: 'direct' | 'supportive' | 'balanced' | '';
  structurePreference: 'structured' | 'flexible' | 'adaptive' | '';
  
  // Availability
  weeklyHoursAvailable: string;
  preferredMeetingTimes: string[];
  maxPlayers: string;
  
  // Player Preferences
  idealPlayerTraits: string[];
  coachingGoals: string;
  successStories: string;
  
  // Values & Approach
  coreValues: string[];
  faithIntegration: string;
  motivations: string;
}

const defaultProfile: CoachProfile = {
  bio: '',
  yearsOfExperience: '',
  currentRole: '',
  locations: [],
  expertiseAreas: [],
  specificSkills: [],
  industryExperience: [],
  coachingStyle: '',
  communicationStyle: '',
  structurePreference: '',
  weeklyHoursAvailable: '',
  preferredMeetingTimes: [],
  maxPlayers: '',
  idealPlayerTraits: [],
  coachingGoals: '',
  successStories: '',
  coreValues: [],
  faithIntegration: '',
  motivations: ''
};

type ProfileTab = 'basic' | 'style' | 'availability' | 'preferences';

type ProfileFieldDef = {
  id: string;
  label: string;
  tab: ProfileTab;
  check: (profile: CoachProfile, photo: string | null) => boolean;
};

const PROFILE_FIELD_DEFS: ProfileFieldDef[] = [
  { id: 'photo', label: 'Profile photo', tab: 'basic', check: (_, photo) => Boolean(photo) },
  { id: 'bio', label: 'Professional bio', tab: 'basic', check: (p) => Boolean(p.bio?.trim()) },
  { id: 'yearsOfExperience', label: 'Years of experience', tab: 'basic', check: (p) => Boolean(p.yearsOfExperience?.trim()) },
  { id: 'currentRole', label: 'Current role', tab: 'basic', check: (p) => Boolean(p.currentRole?.trim()) },
  { id: 'expertiseAreas', label: 'Areas of expertise', tab: 'basic', check: (p) => p.expertiseAreas.length > 0 },
  { id: 'coreValues', label: 'Core values', tab: 'basic', check: (p) => p.coreValues.length > 0 },
  { id: 'coachingStyle', label: 'Coaching approach', tab: 'style', check: (p) => p.coachingStyle !== '' },
  { id: 'communicationStyle', label: 'Communication style', tab: 'style', check: (p) => p.communicationStyle !== '' },
  { id: 'structurePreference', label: 'Structure preference', tab: 'style', check: (p) => p.structurePreference !== '' },
  { id: 'faithIntegration', label: 'Faith integration', tab: 'style', check: (p) => Boolean(p.faithIntegration?.trim()) },
  { id: 'weeklyHoursAvailable', label: 'Weekly hours', tab: 'availability', check: (p) => Boolean(p.weeklyHoursAvailable) },
  { id: 'preferredMeetingTimes', label: 'Meeting times', tab: 'availability', check: (p) => p.preferredMeetingTimes.length > 0 },
  { id: 'maxPlayers', label: 'Max players', tab: 'availability', check: (p) => Boolean(p.maxPlayers) },
  { id: 'idealPlayerTraits', label: 'Ideal player traits', tab: 'preferences', check: (p) => p.idealPlayerTraits.length > 0 },
  { id: 'motivations', label: 'Coaching motivations', tab: 'preferences', check: (p) => Boolean(p.motivations?.trim()) },
];

function getIncompleteFields(profile: CoachProfile, photo: string | null) {
  return PROFILE_FIELD_DEFS.filter(f => !f.check(profile, photo));
}

function fieldWrapStyle(highlight: boolean, accent: string): React.CSSProperties {
  if (!highlight) return {};
  return {
    borderRadius: 12,
    padding: 12,
    margin: '-4px -4px 8px',
    border: `1px solid ${accent}70`,
    background: `${accent}10`,
    boxShadow: `0 0 0 1px ${accent}25`,
  };
}

interface CoachProfileSectionProps {
  onProfileCompletionChange?: (percentage: number) => void;
  onProfilePictureChange?: (image: string | null) => void;
  onPhotoFrameChange?: (frame: CoachPhotoFrame) => void;
  initialProfilePicture?: string | null;
  initialPhotoFrame?: CoachPhotoFrame;
  accentColor?: string;
  highlightIncomplete?: boolean;
  onHighlightDismiss?: () => void;
}

export function CoachProfileSection({
  onProfileCompletionChange,
  onProfilePictureChange,
  onPhotoFrameChange,
  initialProfilePicture = null,
  initialPhotoFrame,
  accentColor = PORTAL_ACCENT,
  highlightIncomplete = false,
  onHighlightDismiss,
}: CoachProfileSectionProps) {
  const [profile, setProfile] = useState<CoachProfile>(() => {
    try {
      const saved = localStorage.getItem('coach_profile_data');
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load coach profile data:', error);
    }
    return defaultProfile;
  });
  const [isEditing, setIsEditing] = useState(true);
  const [activeSection, setActiveSection] = useState<'basic' | 'style' | 'availability' | 'preferences'>('basic');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    const stored = localStorage.getItem('coach_profile_picture');
    if (stored) return stored;
    return initialProfilePicture;
  });
  const [photoFrame, setPhotoFrame] = useState<CoachPhotoFrame>(() => initialPhotoFrame ?? loadPhotoFrame());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'framing' | 'position'>('framing');
  const [pendingSourceImage, setPendingSourceImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSave = () => {
    // In production, this would save to backend
    console.log('Saving coach profile:', profile);
    setIsEditing(false);
  };

  useEffect(() => {
    localStorage.setItem('coach_profile_data', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (profilePicture) {
      localStorage.setItem('coach_profile_picture', profilePicture);
    } else {
      localStorage.removeItem('coach_profile_picture');
    }
    onProfilePictureChange?.(profilePicture);
  }, [profilePicture, onProfilePictureChange]);

  useEffect(() => {
    savePhotoFrame(photoFrame);
    onPhotoFrameChange?.(photoFrame);
  }, [photoFrame, onPhotoFrameChange]);

  useEffect(() => {
    if (initialProfilePicture && !profilePicture) {
      setProfilePicture(initialProfilePicture);
    }
  }, [initialProfilePicture, profilePicture]);

  const expertiseOptions = [
    'Career Transition', 'Interview Prep', 'Resume Building', 'Networking',
    'Leadership Development', 'Technical Skills', 'Entrepreneurship', 
    'Work-Life Balance', 'Faith & Career', 'Personal Development'
  ];

  const valueOptions = [
    'Integrity', 'Excellence', 'Service', 'Growth Mindset', 
    'Accountability', 'Faith-Centered', 'Community', 'Discipline'
  ];

  const playerTraitOptions = [
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

  const completionPercentage = useMemo(() => {
    const checks: Array<boolean> = [
      Boolean(profile.bio?.trim()),
      Boolean(profile.yearsOfExperience?.trim()),
      Boolean(profile.currentRole?.trim()),
      profile.expertiseAreas.length > 0,
      profile.coachingStyle !== '',
      profile.communicationStyle !== '',
      profile.structurePreference !== '',
      Boolean(profile.weeklyHoursAvailable),
      profile.preferredMeetingTimes.length > 0,
      Boolean(profile.maxPlayers),
      profile.idealPlayerTraits.length > 0,
      profile.coreValues.length > 0,
      Boolean(profile.faithIntegration?.trim()),
      Boolean(profile.motivations?.trim()),
      Boolean(profilePicture),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [profile, profilePicture]);

  useEffect(() => {
    onProfileCompletionChange?.(completionPercentage);
    if (completionPercentage >= 100) onHighlightDismiss?.();
  }, [completionPercentage, onProfileCompletionChange, onHighlightDismiss]);

  const incompleteFields = useMemo(
    () => getIncompleteFields(profile, profilePicture),
    [profile, profilePicture],
  );
  const incompleteIds = useMemo(
    () => new Set(incompleteFields.map(f => f.id)),
    [incompleteFields],
  );

  const isFieldIncomplete = (id: string) => incompleteIds.has(id);
  const shouldHighlight = (id: string) => highlightIncomplete && isFieldIncomplete(id);
  const tabHasGaps = (tab: ProfileTab) => incompleteFields.some(f => f.tab === tab);

  useEffect(() => {
    if (!highlightIncomplete || incompleteFields.length === 0) return;
    setIsEditing(true);
    setActiveSection(incompleteFields[0].tab);
  }, [highlightIncomplete]);

  const jumpToField = (field: ProfileFieldDef) => {
    setActiveSection(field.tab);
    setTimeout(() => {
      document.getElementById(`coach-field-${field.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const compressed = await compressImageFile(file);
      setPendingSourceImage(compressed);
      setEditorMode('framing');
      setEditorOpen(true);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to load image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const openPositionEditor = () => {
    if (!profilePicture) return;
    setPendingSourceImage(profilePicture);
    setEditorMode('position');
    setEditorOpen(true);
  };

  const handleEditorSave = ({ photo, frame }: { photo: string; frame: CoachPhotoFrame }) => {
    setProfilePicture(photo);
    setPhotoFrame(frame);
    setEditorOpen(false);
    setPendingSourceImage(null);
  };

  const handleEditorCancel = () => {
    setEditorOpen(false);
    setPendingSourceImage(null);
  };

  const triggerPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setProfilePicture(null);
    setPhotoFrame({ ...DEFAULT_PHOTO_FRAME });
  };

  return (
    <div className="space-y-6" style={{ color: '#F2F2F2' }}>
      {/* Header */}
      <div
        className="rounded-2xl border p-6"
        style={{
          background: PORTAL_PANEL_BG,
          borderColor: shouldHighlight('photo') ? `${accentColor}70` : PORTAL_PANEL_BORDER,
          boxShadow: shouldHighlight('photo') ? `0 0 0 1px ${accentColor}30` : undefined,
        }}
        id="coach-field-photo"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Coach profile"
                  className="w-20 h-20 rounded-2xl object-cover border border-[rgba(255,255,255,0.08)]"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                  <Camera className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
              )}
              {profilePicture && (
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          <div>
              <p style={{ ...mutedStyle, fontWeight: 600, fontSize: 18, color: '#F2F2F2' }}>Coach Profile</p>
              <p style={mutedStyle}>
                {shouldHighlight('photo') ? 'Upload a photo to personalize your coach card — required' : 'Upload a photo to personalize your coach card'}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={triggerPhotoPicker}
                  disabled={isUploading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10, padding: '10px 16px', color: '#F2F2F2',
                    fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer',
                  }}
                >
                  <Camera className="w-4 h-4" />
                  {profilePicture ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={openPositionEditor}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 10, padding: '10px 16px', color: '#F2F2F2',
                      fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    <Move className="w-4 h-4" />
                    Adjust on Card
                  </button>
                )}
                {!profilePicture && !isUploading && (
                  <span style={{ ...mutedStyle, fontSize: 12, alignSelf: 'center' }}>
                    Crop to fit your coach card
                  </span>
                )}
              </div>
              {uploadError && (
                <p className="text-sm text-red-400 mt-2">{uploadError}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: accentColor, color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: accentColor, color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      {highlightIncomplete && incompleteFields.length > 0 && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: 'rgba(249,115,22,0.08)',
            borderColor: 'rgba(249,115,22,0.35)',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase', color: '#f97316', margin: '0 0 6px',
              }}>
                Finish your profile
              </p>
              <p style={{ ...mutedStyle, margin: 0, maxWidth: 520 }}>
                Highlighted fields below still need your input before you can get published on ISO.
              </p>
            </div>
            <button
              type="button"
              onClick={onHighlightDismiss}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '6px 12px', color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Barlow', sans-serif", fontSize: 12, cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {incompleteFields.map(field => (
              <button
                key={field.id}
                type="button"
                onClick={() => jumpToField(field)}
                style={{
                  padding: '6px 12px', borderRadius: 100, cursor: 'pointer',
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 500,
                  color: '#f97316', background: 'rgba(249,115,22,0.12)',
                  border: '1px solid rgba(249,115,22,0.35)',
                }}
              >
                {field.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {([
          { id: 'basic' as const, label: 'Basic Info', Icon: User },
          { id: 'style' as const, label: 'Coaching Style', Icon: MessageSquare },
          { id: 'availability' as const, label: 'Availability', Icon: Clock },
          { id: 'preferences' as const, label: 'Preferences', Icon: Target },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={tabBtnStyle(activeSection === tab.id, accentColor)}
          >
            <tab.Icon className="w-4 h-4" />
            {tab.label}
            {tabHasGaps(tab.id) && (
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: highlightIncomplete ? '#f97316' : accentColor,
                flexShrink: 0,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="rounded-2xl border p-6" style={{ background: PORTAL_PANEL_BG, borderColor: PORTAL_PANEL_BORDER }}>
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <div id="coach-field-bio" style={fieldWrapStyle(shouldHighlight('bio'), accentColor)}>
              <label style={labelStyle}>Professional Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Share your professional background, experience, and what you're passionate about..."
                disabled={!isEditing}
                style={textareaStyle}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="coach-field-yearsOfExperience" style={fieldWrapStyle(shouldHighlight('yearsOfExperience'), accentColor)}>
                <label style={labelStyle}>Years of Experience</label>
                <input
                  type="text"
                  value={profile.yearsOfExperience}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                  placeholder="e.g., 8 years"
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              <div id="coach-field-currentRole" style={fieldWrapStyle(shouldHighlight('currentRole'), accentColor)}>
                <label style={labelStyle}>Current Role</label>
                <input
                  type="text"
                  value={profile.currentRole}
                  onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
            </div>

            <div id="coach-field-expertiseAreas" style={fieldWrapStyle(shouldHighlight('expertiseAreas'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Areas of Expertise</label>
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
                    style={{
                      ...pillStyle(profile.expertiseAreas.includes(option), accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Specific Skills (comma-separated)</label>
              <input
                type="text"
                value={profile.specificSkills.join(', ')}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  specificSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="e.g., Python, React, System Design, Public Speaking"
                disabled={!isEditing}
                style={inputStyle}
              />
            </div>

            <div id="coach-field-coreValues" style={fieldWrapStyle(shouldHighlight('coreValues'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Core Values</label>
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
                    style={{
                      ...pillStyle(profile.coreValues.includes(option), accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Where are you from? (Click on the globe or search to add up to 3 locations)</label>
              <p style={{ ...mutedStyle, marginBottom: 12 }}>
                Share your cultural background and where you're located to help players find coaches in their area or with similar backgrounds.
              </p>
              {isEditing ? (
                <InteractiveGlobe
                  locations={profile.locations}
                  onAddLocation={(loc) => setProfile({ ...profile, locations: [...profile.locations, loc] })}
                  onRemoveLocation={(index) => setProfile({ ...profile, locations: profile.locations.filter((_, i) => i !== index) })}
                  maxLocations={3}
                />
              ) : (
                <div className="space-y-2">
                  {profile.locations.length > 0 ? (
                    profile.locations.map((loc, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] p-3 rounded-xl border border-[rgba(255,255,255,0.08)]">
                        <span style={{ color: '#F2F2F2' }}>{loc.label}</span>
                      </div>
                    ))
                  ) : (
                    <p style={mutedStyle}>No locations added</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coaching Style Section */}
        {activeSection === 'style' && (
          <div className="space-y-6">
            <div id="coach-field-coachingStyle" style={fieldWrapStyle(shouldHighlight('coachingStyle'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Coaching Approach</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'hands-on', label: 'Hands-On', desc: 'Active guidance & frequent check-ins' },
                  { value: 'advisory', label: 'Advisory', desc: 'Strategic guidance & direction' },
                  { value: 'balanced', label: 'Balanced', desc: 'Mix of both approaches' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => isEditing && setProfile({ ...profile, coachingStyle: option.value as any })}
                    disabled={!isEditing}
                    style={{
                      ...optionCardStyle(profile.coachingStyle === option.value, accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ color: '#F2F2F2', marginBottom: 4, fontWeight: 600 }}>{option.label}</div>
                    <div style={mutedStyle}>{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div id="coach-field-communicationStyle" style={fieldWrapStyle(shouldHighlight('communicationStyle'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Communication Style</label>
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
                    style={{
                      ...optionCardStyle(profile.communicationStyle === option.value, accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ color: '#F2F2F2', marginBottom: 4, fontWeight: 600 }}>{option.label}</div>
                    <div style={mutedStyle}>{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div id="coach-field-structurePreference" style={fieldWrapStyle(shouldHighlight('structurePreference'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Structure Preference</label>
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
                    style={{
                      ...optionCardStyle(profile.structurePreference === option.value, accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ color: '#F2F2F2', marginBottom: 4, fontWeight: 600 }}>{option.label}</div>
                    <div style={mutedStyle}>{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div id="coach-field-faithIntegration" style={fieldWrapStyle(shouldHighlight('faithIntegration'), accentColor)}>
              <label style={labelStyle}>Faith Integration Approach</label>
              <textarea
                value={profile.faithIntegration}
                onChange={(e) => setProfile({ ...profile, faithIntegration: e.target.value })}
                placeholder="How do you integrate faith and spirituality into your coaching? Share your approach..."
                disabled={!isEditing}
                style={{ ...textareaStyle, minHeight: 100 }}
              />
            </div>
          </div>
        )}

        {/* Availability Section */}
        {activeSection === 'availability' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="coach-field-weeklyHoursAvailable" style={fieldWrapStyle(shouldHighlight('weeklyHoursAvailable'), accentColor)}>
                <label style={labelStyle}>Weekly Hours Available</label>
                <select
                  value={profile.weeklyHoursAvailable}
                  onChange={(e) => setProfile({ ...profile, weeklyHoursAvailable: e.target.value })}
                  disabled={!isEditing}
                  style={{ ...selectStyle, opacity: !isEditing ? 0.6 : 1 }}
                >
                  <option value="">Select hours...</option>
                  <option value="1-2">1-2 hours</option>
                  <option value="3-5">3-5 hours</option>
                  <option value="5-10">5-10 hours</option>
                  <option value="10+">10+ hours</option>
                </select>
              </div>
              <div id="coach-field-maxPlayers" style={fieldWrapStyle(shouldHighlight('maxPlayers'), accentColor)}>
                <label style={labelStyle}>Max Number of Players</label>
                <select
                  value={profile.maxPlayers}
                  onChange={(e) => setProfile({ ...profile, maxPlayers: e.target.value })}
                  disabled={!isEditing}
                  style={{ ...selectStyle, opacity: !isEditing ? 0.6 : 1 }}
                >
                  <option value="">Select number...</option>
                  <option value="1-2">1-2 players</option>
                  <option value="3-5">3-5 players</option>
                  <option value="6-10">6-10 players</option>
                  <option value="10+">10+ players</option>
                </select>
              </div>
            </div>

            <div id="coach-field-preferredMeetingTimes" style={fieldWrapStyle(shouldHighlight('preferredMeetingTimes'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Preferred Meeting Times</label>
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
                    style={{
                      ...pillStyle(profile.preferredMeetingTimes.includes(time), accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
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
            <div id="coach-field-idealPlayerTraits" style={fieldWrapStyle(shouldHighlight('idealPlayerTraits'), accentColor)}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Ideal Player Traits</label>
              <p style={{ ...mutedStyle, marginBottom: 12 }}>
                What qualities do you look for in players you work best with?
              </p>
              <div className="flex flex-wrap gap-2">
                {playerTraitOptions.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => isEditing && toggleArrayItem(
                      profile.idealPlayerTraits,
                      trait,
                      (val) => setProfile({ ...profile, idealPlayerTraits: val })
                    )}
                    disabled={!isEditing}
                    style={{
                      ...pillStyle(profile.idealPlayerTraits.includes(trait), accentColor),
                      opacity: !isEditing ? 0.6 : 1,
                      cursor: !isEditing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Your Coaching Goals</label>
              <textarea
                value={profile.coachingGoals}
                onChange={(e) => setProfile({ ...profile, coachingGoals: e.target.value })}
                placeholder="What do you hope to achieve through coaching? What impact do you want to make?"
                disabled={!isEditing}
                style={{ ...textareaStyle, minHeight: 100 }}
              />
            </div>

            <div>
              <label style={labelStyle}>Success Stories</label>
              <textarea
                value={profile.successStories}
                onChange={(e) => setProfile({ ...profile, successStories: e.target.value })}
                placeholder="Share 1-2 examples of players you've helped succeed and what made those relationships work..."
                disabled={!isEditing}
                style={textareaStyle}
              />
            </div>

            <div id="coach-field-motivations" style={fieldWrapStyle(shouldHighlight('motivations'), accentColor)}>
              <label style={labelStyle}>What Motivates You to Coach?</label>
              <textarea
                value={profile.motivations}
                onChange={(e) => setProfile({ ...profile, motivations: e.target.value })}
                placeholder="Why do you give your time to coach others? What drives you?"
                disabled={!isEditing}
                style={{ ...textareaStyle, minHeight: 100 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Profile Completeness Indicator */}
      <div className="rounded-2xl border p-6" style={{ background: `${accentColor}10`, borderColor: `${accentColor}30` }}>
        <div className="flex items-center justify-between mb-2">
          <h4 style={{ color: '#F2F2F2', fontFamily: "'Barlow', sans-serif", fontWeight: 600, margin: 0 }}>Profile Completeness</h4>
          <span style={{ color: accentColor, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>
            {completionPercentage}%
          </span>
        </div>
        <div className="rounded-full h-2 overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%`, background: accentColor }}
          />
        </div>
        <p style={mutedStyle}>
          Complete your profile to improve AI matching accuracy and help us connect you with ideal players.
        </p>
      </div>

      {pendingSourceImage && (
        <CoachPhotoEditorModal
          open={editorOpen}
          imageSrc={pendingSourceImage}
          mode={editorMode}
          initialFrame={photoFrame}
          accentColor={accentColor}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
        />
      )}
    </div>
  );
}
