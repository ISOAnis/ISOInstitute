import * as React from 'react';
import { useState } from 'react';
import { Target, CheckCircle2, Circle, Lock, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { getAssessedLevel, LEVEL_LABELS, type AssessedLevel, type MembershipPlan } from '../utils/membership';

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const DEFAULT_GOALS: Goal[] = [
  { id: 'g1', title: 'Complete weekly reflection journal', description: 'Write 3 reflections on your progress this week', completed: true },
  { id: 'g2', title: 'Attend one ISO community session', description: 'Join a Locker Room live session or event', completed: false },
  { id: 'g3', title: 'Set 30-day pathway target', description: 'Define one measurable outcome for your current pathway', completed: false },
];

const GHOST_VARSITY_PROGRESS: Record<AssessedLevel, number> = {
  freshman: 15,
  jv: 35,
  varsity: 55,
  d1: 72,
  professional: 88,
};

const GHOST_TIERS = [
  { id: 'freshman', label: 'Freshman', min: 0 },
  { id: 'jv', label: 'JV', min: 25 },
  { id: 'varsity', label: 'Varsity', min: 50 },
  { id: 'd1', label: 'D1', min: 75 },
  { id: 'professional', label: 'Pro', min: 90 },
];

interface LockerRoomGoalsProps {
  membershipPlan: MembershipPlan;
  onUpgrade: () => void;
  accentColor?: string;
  lockedPathwayId?: string;
  lockedPathwayName?: string;
}

export function LockerRoomGoals({ membershipPlan, onUpgrade, accentColor = '#f97316', lockedPathwayId, lockedPathwayName }: LockerRoomGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('iso_locker_goals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GOALS;
  });

  const assessedLevel = getAssessedLevel();
  const ghostProgress = GHOST_VARSITY_PROGRESS[assessedLevel];
  const completed = goals.filter(g => g.completed).length;

  const toggleGoal = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    localStorage.setItem('iso_locker_goals', JSON.stringify(updated));
  };

  return (
    <div>
      {/* Locked pathway context */}
      {lockedPathwayName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 18px', background: `${accentColor}10`, border: `1px solid ${accentColor}25`, borderRadius: 12 }}>
          <Lock size={16} style={{ color: accentColor, flexShrink: 0 }} />
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Goals scoped to your locked <strong style={{ color: accentColor }}>{lockedPathwayName}</strong> pathway · future AI coaching will assist within this pathway only
          </p>
        </div>
      )}

      {/* Static placement badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}35`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={18} style={{ color: accentColor }} />
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Your Assessment Placement</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: accentColor, letterSpacing: 1 }}>{LEVEL_LABELS[assessedLevel]}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: 400 }}>
          Your placement stays fixed on Locker Room — it reflects where ISO assessed you, not self-guided goal progress.
        </p>
      </div>

      {/* Varsity lead magnet — ghost progress bar */}
      <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px dashed rgba(168,85,247,0.35)', borderRadius: 16, padding: 24, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(168,85,247,0.03) 8px, rgba(168,85,247,0.03) 9px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} style={{ color: '#a855f7' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#a855f7', textTransform: 'uppercase' }}>Varsity Program Preview</span>
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'rgba(255,255,255,0.7)', margin: '0 0 6px', letterSpacing: 0.5 }}>
              This is where you'd be with a dedicated coach
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, maxWidth: 480 }}>
              On Varsity, your coach tracks real progress through games, buckets, and tier advancement. This bar moves when you win with a coach — not on self-guided goals.
            </p>
          </div>
          <button
            onClick={onUpgrade}
            style={{ background: 'rgba(168,85,247,0.8)', color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            UPGRADE TO VARSITY <ArrowRight size={13} />
          </button>
        </div>
        {/* Ghost tier bar */}
        <div style={{ position: 'relative' }}>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ghostProgress}%`, background: 'linear-gradient(90deg, rgba(168,85,247,0.4), rgba(249,115,22,0.4))', borderRadius: 100, opacity: 0.6 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {GHOST_TIERS.map(t => (
              <span key={t.id} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: ghostProgress >= t.min ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.label}</span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(168,85,247,0.45)', fontStyle: 'italic' }}>
            Ghost progress · {ghostProgress}% — illustrative Varsity trajectory only
          </div>
        </div>
      </div>

      {/* Self-guided goals */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F2F2F2', margin: '0 0 4px', letterSpacing: 0.5 }}>My Goals</h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Self-guided tracking · {completed}/{goals.length} complete · does not affect your {LEVEL_LABELS[assessedLevel]} placement
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {goals.map(goal => (
          <div
            key={goal.id}
            style={{
              background: goal.completed ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${goal.completed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
            }}
          >
            <button onClick={() => toggleGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2, flexShrink: 0 }}>
              {goal.completed
                ? <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
                : <Circle size={22} style={{ color: 'rgba(255,255,255,0.25)' }} />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 600, color: goal.completed ? 'rgba(255,255,255,0.4)' : '#F2F2F2', textDecoration: goal.completed ? 'line-through' : 'none', marginBottom: 4 }}>
                {goal.title}
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{goal.description}</div>
            </div>
            <Target size={16} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: 4 }} />
          </div>
        ))}
      </div>

      {membershipPlan === 'locker-room' && (
        <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock size={16} style={{ color: '#f97316', flexShrink: 0 }} />
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Rep your growth with <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Locker Room gear</strong> in the ISO Store — limited drops, not the same prestige as Varsity milestone gear.
          </p>
        </div>
      )}
    </div>
  );
}
