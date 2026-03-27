import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';

export function useAnalyticsQuery() {
  return useQuery([API_ENDPOINTS.ANALYTICS], dashboardClient.analytics, {
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    cacheTime: 6 * 60 * 60 * 1000, // 6 hours
  });
}
