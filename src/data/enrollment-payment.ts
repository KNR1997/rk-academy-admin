import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  EnrollmentPaymentPaginator,
  EnrollmentPaymentQueryOptions,
  EnrollmentPayment,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { enrollmentPaymentClient } from './client/enrollment-payment';
import { Config } from '@/config';
import { useModalAction } from '@/components/ui/modal/modal.context';

export const useCreateEnrollmentPaymentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useModalAction();

  return useMutation(enrollmentPaymentClient.create, {
    onSuccess: () => {
      Router.push(Routes.enrollmentPayment.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
      closeModal();
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENT_PAYMENTS);
    },
  });
};

export const useDeleteEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(enrollmentPaymentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENT_PAYMENTS);
    },
  });
};

export const useUpdateEnrollmentMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(enrollmentPaymentClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.enrollment.list}`
        : Routes.enrollment.list;
      await router.push(
        `${generateRedirectUrl}/${data?.id}/edit`,
        undefined,
        {
          locale: Config.defaultLanguage,
        }
      );
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENT_PAYMENTS);
    },
  });
};

export const useEnrollmentPaymentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<EnrollmentPayment, Error>(
    [API_ENDPOINTS.ENROLLMENT_PAYMENTS, { slug, language }],
    () => enrollmentPaymentClient.get({ slug, language })
  );

  return {
    enrollmentPayment: data,
    error,
    isLoading,
  };
};

export const useEnrollmentPaymentsQuery = (options: Partial<EnrollmentPaymentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EnrollmentPaymentPaginator, Error>(
    [API_ENDPOINTS.ENROLLMENT_PAYMENTS, options],
    ({ queryKey, pageParam }) =>
      enrollmentPaymentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    enrollmentPayments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
