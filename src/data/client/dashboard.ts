import { HttpClient } from '@/data/client/http-client';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { AnalyticsResponse } from '@/types';

export const dashboardClient = {
  analytics() {
    return HttpClient.get<AnalyticsResponse>(API_ENDPOINTS.ANALYTICS);
  },
};
