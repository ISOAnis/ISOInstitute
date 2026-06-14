export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getPortalFirstName(role: 'player' | 'coach' = 'player'): string {
  try {
    if (role === 'player') {
      const profile = JSON.parse(localStorage.getItem('player_profile_data') || '{}') as { name?: string };
      const fromProfile = profile.name?.trim().split(/\s+/)[0];
      if (fromProfile) return fromProfile;
    }

    const user = JSON.parse(localStorage.getItem('iso_demo_user') || '{}') as {
      firstName?: string;
      name?: string;
      email?: string;
    };

    if (user.firstName?.trim()) return user.firstName.trim();
    const fromUserName = user.name?.trim().split(/\s+/)[0];
    if (fromUserName) return fromUserName;

    if (user.email) {
      const local = user.email.split('@')[0] ?? '';
      const part = local.replace(/[._-]+/g, ' ').trim().split(/\s+/)[0];
      if (part) return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }
  } catch {}

  return role === 'coach' ? 'Coach' : 'Player';
}
