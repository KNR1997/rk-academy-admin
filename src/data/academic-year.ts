import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  AcademicYear,
  AcademicYearPaginator,
  AcademicYearQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { academicYearClient } from './client/academic-year';
import { Config } from '@/config';

export const useCreateAcademicYearMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(academicYearClient.create, {
    onSuccess: () => {
      Router.push(Routes.subject.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ACADEMIC_YEARS);
    },
  });
};

export const useDeleteAcademicYearMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(academicYearClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ACADEMIC_YEARS);
    },
  });
};

export const useUpdateAcademicYearMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(academicYearClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.subject.list}`
        : Routes.subject.list;
      await router.push(
        `${generateRedirectUrl}/${data?.name}/edit`,
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
      queryClient.invalidateQueries(API_ENDPOINTS.ACADEMIC_YEARS);
    },
  });
};

export const useAcademicYearQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<AcademicYear, Error>(
    [API_ENDPOINTS.ACADEMIC_YEARS, { slug, language }],
    () => academicYearClient.get({ slug, language })
  );

  return {
    academicYear: data,
    error,
    isLoading,
  };
};

export const useAcademicYearsQuery = (options: Partial<AcademicYearQueryOptions>) => {
  const { data, error, isLoading } = useQuery<AcademicYearPaginator, Error>(
    [API_ENDPOINTS.ACADEMIC_YEARS, options],
    ({ queryKey, pageParam }) =>
      academicYearClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    academicYears: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
