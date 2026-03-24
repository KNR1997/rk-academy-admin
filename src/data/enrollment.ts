import Router from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { mapPaginatorData } from '@/utils/data-mappers';
// client
import { API_ENDPOINTS } from './client/api-endpoints';
import { enrollmentClient } from './client/enrollment';
// types
import {
  GetParams,
  Enrollment,
  EnrollmentPaginator,
  EnrollmentQueryOptions,
  EnrollmentWithMonthsPaginator,
} from '@/types';

export const useCreateEnrollmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(enrollmentClient.create, {
    // onSuccess: () => {
    //   Router.push(Routes.enrollment.list, undefined, {
    //     locale: Config.defaultLanguage,
    //   });
    //   toast.success(t('common:successfully-created'));
    // },
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
  const queryClient = useQueryClient();
  return useMutation(enrollmentClient.update, {
    onSuccess: () => {
      Router.push(Routes.enrollment.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
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