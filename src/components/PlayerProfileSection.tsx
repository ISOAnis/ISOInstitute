import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Edit3, Save, X, MapPin, User, MessageCircle, Layout, Zap, Heart, Compass, Trophy } from 'lucide-react';
import { InteractiveGlobe } from './InteractiveGlobe';
import {
  getUserGender, saveUserGender, getUserPlan, getAssessedLevel, getActivePathway,
  PLAN_LABELS, LEVEL_LABELS, type UserGender, type MembershipPlan,
} from '../utils/membership';
import { PATHWAY_BY_ID } from '../data/pathways';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface PlayerProfile {
  name: string;
  email: string;
  gender: UserGender | '';
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

const defaultProfile: PlayerProfile = {
  name: '', email: '', gender: '', age: '', schoolYear: '',
  locations: [], prefersSameBackground: false, goals: '', timeframe: '',
  communicationPreference: '', structurePreference: '', motivationLevel: '', topValues: [],
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
  other: 'Other',
};

const communicationLabels = {
  direct: 'Direct & Candid',
  supportive: 'Warm & Supportive',
  balanced: 'Balanced Approach',
};

const structureLabels = {
  structured: 'Highly Structured',
  flexible: 'Flexible & Adaptive',
  adaptive: 'Responsive to My Needs',
};

const motivationLabels = {
  exploring: 'Just Exploring',
  committed: 'Seriously Committed',
  'all-in': 'All In',
};

interface PlayerProfileSectionProps {
  onProfileCompletionChange?: (percentage: number) => void;
  onGenderChange?: (gender: UserGender | null) => void;
  accentColor?: string;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700,
      letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
      display: 'block', marginBottom: 8,
    }}>
      {children}
    </label>
  );
}

function FieldValue({ children, empty }: { children: React.ReactNode; empty?: boolean }) {
  return (
    <p style={{
      fontFamily: "'Barlow', sans-serif", fontSize: 14, margin: 0,
      color: empty ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.75)',
      fontStyle: empty ? 'italic' : 'normal',
    }}>
      {children}
    </p>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color?: string }) {
  const c = color ?? '#f97316';
  return (
    <span style={{
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
      color: c, background: `${c}18`, border: `1px solid ${c}35`,
      borderRadius: 100, padding: '4px 12px', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8, padding: '6px 14px', color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
      fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
    }}>
      <Edit3 size={12} /> EDIT
    </button>
  );
}

function SaveCancel({ onSave, onCancel, accentColor }: { onSave: () => void; onCancel: () => void; accentColor: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
      <button onClick={onSave} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: accentColor, color: '#fff',
        border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer',
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
      }}>
        <Save size={13} /> SAVE
      </button>
      <button onClick={onCancel} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 20px',
        color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
        fontFamily: "'Barlow', sans-serif", fontSize: 13,
      }}>
        <X size={13} /> Cancel
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '11px 14px', color: '#fff', fontFamily: "'Barlow', sans-serif",
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16, padding: '22px 24px', marginBottom: 16,
};

export function PlayerProfileSection({ onProfileCompletionChange, onGenderChange, accentColor = '#f97316' }: PlayerProfileSectionProps) {
  const plan = getUserPlan() as MembershipPlan;
  const assessedLevel = getAssessedLevel();
  const pathwayId = getActivePathway(plan);
  const pathwayName = pathwayId ? PATHWAY_BY_ID[pathwayId as keyof typeof PATHWAY_BY_ID]?.name : null;

  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem('player_profile_data');
      const savedGender = getUserGender();
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultProfile, ...parsed, gender: parsed.gender || savedGender || '' };
      }
      if (savedGender) return { ...defaultProfile, gender: savedGender };
    } catch {}
    return defaultProfile;
  });

  const [editingSection, setEditingSection] = useState<'basics' | 'demographics' | 'preferences' | null>(null);
  const [tempProfile, setTempProfile] = useState<PlayerProfile>(profile);

  const completionPct = useMemo(() => {
    const checks = [
      Boolean(profile.name?.trim()),
      Boolean(profile.email?.trim()),
      Boolean(profile.gender),
      Boolean(profile.goals?.trim()),
      Boolean(profile.timeframe?.trim()),
      Boolean(profile.schoolYear?.trim()) || Boolean(profile.age?.trim()),
      profile.communicationPreference !== '',
      profile.structurePreference !== '',
      profile.motivationLevel !== '',
      profile.topValues.length >= 1,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('player_profile_data', JSON.stringify(profile));
    localStorage.setItem('player_profile_completion', String(completionPct));
  }, [profile, completionPct]);

  useEffect(() => {
    onProfileCompletionChange?.(completionPct);
  }, [completionPct, onProfileCompletionChange]);

  const startEdit = (section: 'basics' | 'demographics' | 'preferences') => {
    setTempProfile({ ...profile });
    setEditingSection(section);
  };

  const saveSection = () => {
    setProfile({ ...tempProfile });
    if (tempProfile.gender === 'male' || tempProfile.gender === 'female') {
      saveUserGender(tempProfile.gender);
      onGenderChange?.(tempProfile.gender);
    }
    setEditingSection(null);
  };

  const cancelEdit = () => {
    setTempProfile({ ...profile });
    setEditingSection(null);
  };

  const display = editingSection ? tempProfile : profile;
  const initials = (profile.name || 'ISO').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ISO';
  const schoolLabel = schoolYearLabels[profile.schoolYear] || profile.schoolYear;

  const RadioOption = ({ name, value, label, field }: { name: string; value: string; label: string; field: keyof PlayerProfile }) => (
    <button
      type="button"
      onClick={() => setTempProfile({ ...tempProfile, [field]: value })}
      style={{
        width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
        background: tempProfile[field] === value ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
        border: tempProfile[field] === value ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.08)',
        color: tempProfile[field] === value ? '#fff' : 'rgba(255,255,255,0.5)',
        fontFamily: "'Barlow', sans-serif", fontSize: 13, marginBottom: 8,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: '#F2F2F2', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, margin: '0 0 6px', letterSpacing: 0.5 }}>My Profile</h2>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Your ISO identity — powers coach matching and your season card
        </p>
      </div>

      {/* Identity card */}
      <div style={{
        ...cardStyle,
        background: `linear-gradient(135deg, ${accentColor}12 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${accentColor}25`,
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 14, flexShrink: 0,
          background: `${accentColor}20`, border: `2px solid ${accentColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: accentColor, letterSpacing: 1,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', letterSpacing: 0.5, lineHeight: 1.1 }}>
            {profile.name || 'Set your name'}
          </div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {profile.email || 'No email set'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <Pill color={accentColor}>{PLAN_LABELS[plan]}</Pill>
            {pathwayName && <Pill color={accentColor}>{pathwayName}</Pill>}
            <Pill color="#a855f7">{LEVEL_LABELS[assessedLevel]}</Pill>
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 100 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: accentColor, lineHeight: 1 }}>
            {completionPct}%
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Complete
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, marginTop: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${completionPct}%`, background: accentColor, borderRadius: 100, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Basics */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={16} style={{ color: accentColor }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#F2F2F2', letterSpacing: 0.5 }}>Basic Info</span>
          </div>
          {editingSection !== 'basics' && <EditBtn onClick={() => startEdit('basics')} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          <div>
            <FieldLabel>Name</FieldLabel>
            {editingSection === 'basics'
              ? <input style={inputStyle} value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} />
              : <FieldValue empty={!profile.name}>{profile.name || 'Not set'}</FieldValue>}
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            {editingSection === 'basics'
              ? <input style={inputStyle} type="email" value={tempProfile.email} onChange={e => setTempProfile({ ...tempProfile, email: e.target.value })} />
              : <FieldValue empty={!profile.email}>{profile.email || 'Not set'}</FieldValue>}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <FieldLabel>Goals</FieldLabel>
          {editingSection === 'basics'
            ? <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={tempProfile.goals} onChange={e => setTempProfile({ ...tempProfile, goals: e.target.value })} placeholder="What are you working toward?" />
            : <FieldValue empty={!profile.goals}>{profile.goals || 'Not set'}</FieldValue>}
        </div>
        <div style={{ marginTop: 16 }}>
          <FieldLabel>Timeframe</FieldLabel>
          {editingSection === 'basics'
            ? (
              <select style={inputStyle} value={tempProfile.timeframe} onChange={e => setTempProfile({ ...tempProfile, timeframe: e.target.value })}>
                <option value="">Select...</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1+ years">1+ years</option>
                {profile.timeframe && !['1-3 months','3-6 months','6-12 months','1+ years'].includes(profile.timeframe) && (
                  <option value={profile.timeframe}>{profile.timeframe}</option>
                )}
              </select>
            )
            : <FieldValue empty={!profile.timeframe}>{profile.timeframe || 'Not set'}</FieldValue>}
        </div>
        {editingSection === 'basics' && <SaveCancel onSave={saveSection} onCancel={cancelEdit} accentColor={accentColor} />}
      </div>

      {/* Demographics */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={16} style={{ color: accentColor }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#F2F2F2', letterSpacing: 0.5 }}>Background</span>
          </div>
          {editingSection !== 'demographics' && <EditBtn onClick={() => startEdit('demographics')} />}
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Gender</FieldLabel>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 10px' }}>
            Matched with coaches of the same gender
          </p>
          {editingSection === 'demographics' ? (
            <div style={{ display: 'flex', gap: 10 }}>
              {(['male', 'female'] as const).map(g => (
                <button key={g} type="button" onClick={() => setTempProfile({ ...tempProfile, gender: g })} style={{
                  flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                  background: tempProfile.gender === g ? accentColor : 'rgba(255,255,255,0.05)',
                  color: tempProfile.gender === g ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: tempProfile.gender === g ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  {g}
                </button>
              ))}
            </div>
          ) : profile.gender
            ? <Pill>{profile.gender}</Pill>
            : <FieldValue empty>Set your gender for coach matching</FieldValue>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <FieldLabel>Age</FieldLabel>
            {editingSection === 'demographics'
              ? <input style={inputStyle} type="number" min={13} max={100} value={tempProfile.age} onChange={e => setTempProfile({ ...tempProfile, age: e.target.value })} />
              : <FieldValue empty={!profile.age}>{profile.age || '—'}</FieldValue>}
          </div>
          <div>
            <FieldLabel>Life Stage</FieldLabel>
            {editingSection === 'demographics' ? (
              <select style={inputStyle} value={tempProfile.schoolYear} onChange={e => setTempProfile({ ...tempProfile, schoolYear: e.target.value })}>
                <option value="">Select...</option>
                {Object.entries(schoolYearLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                {profile.schoolYear && !schoolYearLabels[profile.schoolYear] && (
                  <option value={profile.schoolYear}>{profile.schoolYear}</option>
                )}
              </select>
            ) : <FieldValue empty={!schoolLabel}>{schoolLabel || '—'}</FieldValue>}
          </div>
        </div>

        <FieldLabel>Cultural Background</FieldLabel>
        {editingSection === 'demographics' ? (
          <InteractiveGlobe
            locations={tempProfile.locations}
            onAddLocation={loc => setTempProfile({ ...tempProfile, locations: [...tempProfile.locations, loc] })}
            onRemoveLocation={index => setTempProfile({ ...tempProfile, locations: tempProfile.locations.filter((_, i) => i !== index) })}
            maxLocations={3}
          />
        ) : profile.locations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profile.locations.map((loc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                <MapPin size={13} style={{ color: accentColor, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{loc.label}</span>
              </div>
            ))}
          </div>
        ) : <FieldValue empty>No locations added</FieldValue>}

        {(editingSection === 'demographics' ? tempProfile.locations.length > 0 : profile.locations.length > 0) && (
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 16, cursor: editingSection === 'demographics' ? 'pointer' : 'default' }}>
            <input
              type="checkbox"
              checked={display.prefersSameBackground}
              onChange={e => editingSection === 'demographics' && setTempProfile({ ...tempProfile, prefersSameBackground: e.target.checked })}
              disabled={editingSection !== 'demographics'}
              style={{ marginTop: 3, accentColor }}
            />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              Prefer coaches from similar cultural backgrounds
            </span>
          </label>
        )}
        {editingSection === 'demographics' && <SaveCancel onSave={saveSection} onCancel={cancelEdit} accentColor={accentColor} />}
      </div>

      {/* Coaching preferences */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Heart size={16} style={{ color: accentColor }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#F2F2F2', letterSpacing: 0.5 }}>Coaching Style</span>
          </div>
          {editingSection !== 'preferences' && <EditBtn onClick={() => startEdit('preferences')} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          <div>
            <FieldLabel><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageCircle size={11} /> Communication</span></FieldLabel>
            {editingSection === 'preferences'
              ? Object.entries(communicationLabels).map(([v, l]) => <RadioOption key={v} name="comm" value={v} label={l} field="communicationPreference" />)
              : profile.communicationPreference
                ? <Pill color="#3b82f6">{communicationLabels[profile.communicationPreference]}</Pill>
                : <FieldValue empty>Not set</FieldValue>}
          </div>
          <div>
            <FieldLabel><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Layout size={11} /> Structure</span></FieldLabel>
            {editingSection === 'preferences'
              ? Object.entries(structureLabels).map(([v, l]) => <RadioOption key={v} name="struct" value={v} label={l} field="structurePreference" />)
              : profile.structurePreference
                ? <Pill color="#06b6d4">{structureLabels[profile.structurePreference]}</Pill>
                : <FieldValue empty>Not set</FieldValue>}
          </div>
          <div>
            <FieldLabel><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={11} /> Motivation</span></FieldLabel>
            {editingSection === 'preferences'
              ? Object.entries(motivationLabels).map(([v, l]) => <RadioOption key={v} name="mot" value={v} label={l} field="motivationLevel" />)
              : profile.motivationLevel
                ? <Pill color="#22c55e">{motivationLabels[profile.motivationLevel]}</Pill>
                : <FieldValue empty>Not set</FieldValue>}
          </div>
        </div>

        {profile.topValues.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <FieldLabel><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Compass size={11} /> Top Values</span></FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.topValues.map((v, i) => <Pill key={i} color="#a855f7">{v}</Pill>)}
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '8px 0 0' }}>
              From your assessment — retake assessment to update
            </p>
          </div>
        )}

        {editingSection === 'preferences' && <SaveCancel onSave={saveSection} onCancel={cancelEdit} accentColor={accentColor} />}
      </div>

      {/* Matching note */}
      <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
          <Trophy size={12} style={{ display: 'inline', marginRight: 6, color: accentColor, verticalAlign: 'middle' }} />
          Your profile powers coach matching — gender, background, goals, and coaching style preferences all factor in when you Call an ISO.
        </p>
      </div>
    </div>
  );
}
