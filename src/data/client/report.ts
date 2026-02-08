import { PendingPayment, PendingPaymentPaginator, PendingPaymentQueryOptions } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const reportClient = {
  pendingPayments: ({ ...params }: Partial<PendingPaymentQueryOptions>) => {
    return HttpClient.get<PendingPayment[]>(
      `${API_ENDPOINTS.REPORTS}/pending-payments`,
      {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({}),
      },
    );
  },
};
