import { useCallback, useEffect, useState } from 'react';
import { fetchDiscoverableCoaches } from '../services/coaches';
import type { DiscoverableCoach } from '../types/discoverableCoach';
import type { PathwayId } from '../data/pathways';
import { normalizePathwayId } from '../data/pathways';

export function useDiscoverableCoaches(pathwayId?: PathwayId | string | null) {
  const [coaches, setCoaches] = useState<DiscoverableCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const normalized = pathwayId ? normalizePathwayId(pathwayId) ?? pathwayId : undefined;
      const data = await fetchDiscoverableCoaches(normalized ?? undefined);
      setCoaches(data);
    } catch (err) {
      console.error('Failed to load coaches:', err);
      setError(err instanceof Error ? err.message : 'Could not load coaches');
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  }, [pathwayId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { coaches, loading, error, reload };
}
