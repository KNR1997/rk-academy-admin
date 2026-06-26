import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { invoiceClient } from './client/invoice';
import {
  GetParams,
  Invoice,
  InvoicePaginator,
  InvoiceQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useInvoiceQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Invoice, Error>(
    [API_ENDPOINTS.INVOICES, { slug }],
    () => invoiceClient.get({ slug }),
  );

  return {
    invoice: data,
    error,
    isLoading,
  };
};

export const useInvoicesQuery = (options: Partial<InvoiceQueryOptions>) => {
  const { data, error, isLoading } = useQuery<InvoicePaginator, Error>(
    [API_ENDPOINTS.INVOICES, options],
    ({ queryKey, pageParam }) =>
      invoiceClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    invoices: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useUpdateInvoiceMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(invoiceClient.patch, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INVOICES);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data.detail);
    },
  });
};
