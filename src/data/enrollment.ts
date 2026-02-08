import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Enrollment,
  EnrollmentPaginator,
  EnrollmentQueryOptions,
  EnrollmentWithMonthsPaginator,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { enrollmentClient } from './client/enrollment';
import { Config } from '@/config';

export const useCreateEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(enrollmentClient.create, {
    onSuccess: () => {
      Router.push(Routes.enrollment.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
  });
};

export const useDeleteEnrollmentMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(enrollmentClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
  });
};

export const useUpdateEnrollmentMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(enrollmentClient.update, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.ENROLLMENTS);
    },
  });
};

export const useEnrollmentQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Enrollment, Error>(
    [API_ENDPOINTS.ENROLLMENTS, { slug, language }],
    () => enrollmentClient.get({ slug, language })
  );

  return {
    enrollment: data,
    error,
    isLoading,
  };
};

export const useEnrollmentsQuery = (options: Partial<EnrollmentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EnrollmentPaginator, Error>(
    [API_ENDPOINTS.ENROLLMENTS, options],
    ({ queryKey, pageParam }) =>
      enrollmentClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    enrollments: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useEnrollmentsWithMonthsQuery = (options: Partial<EnrollmentQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EnrollmentWithMonthsPaginator, Error>(
    [API_ENDPOINTS.ENROLLMENTS, options],
    ({ queryKey, pageParam }) =>
      enrollmentClient.enrollmentWithMonthPaginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    enrollmentsWithMonths: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};