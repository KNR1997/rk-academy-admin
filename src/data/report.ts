import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { reportClient } from './client/report';
import { PendingPayment, PendingPaymentQueryOptions } from '@/types';

export const usePendingPaymentsQuery = (
  options: Partial<PendingPaymentQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<PendingPayment[], Error>(
    [`${API_ENDPOINTS.REPORTS}/pending-payments`, options],
    ({ queryKey, pageParam }) =>
      reportClient.pendingPayments(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    pendingPayments: data ?? [],
    error,
    loading: isLoading,
  };
};
