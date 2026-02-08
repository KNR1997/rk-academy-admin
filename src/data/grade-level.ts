import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  GradeLevel,
  GradeLevelPaginator,
  GradeLevelQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { gradeLevelClient } from './client/grade-level';
import { Config } from '@/config';

export const useCreateGradeLevelMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(gradeLevelClient.create, {
    onSuccess: () => {
      Router.push(Routes.gradeLevel.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GRADE_LEVEL);
    },
  });
};

export const useDeleteGradeLevelMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(gradeLevelClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GRADE_LEVEL);
    },
  });
};

export const useUpdateGradeLevelMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(gradeLevelClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.gradeLevel.list}`
        : Routes.gradeLevel.list;
      await router.push(
        `${generateRedirectUrl}/${data?.name}/edit`,
        undefined,
        {
          locale: Config.defaultLanguage,
        }
      );
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GRADE_LEVEL);
    },
  });
};

export const useGradeLevelQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<GradeLevel, Error>(
    [API_ENDPOINTS.GRADE_LEVEL, { slug, language }],
    () => gradeLevelClient.get({ slug, language })
  );

  return {
    gradeLevel: data,
    error,
    isLoading,
  };
};

export const useGradeLevelsQuery = (options: Partial<GradeLevelQueryOptions>) => {
  const { data, error, isLoading } = useQuery<GradeLevelPaginator, Error>(
    [API_ENDPOINTS.GRADE_LEVEL, options],
    ({ queryKey, pageParam }) =>
      gradeLevelClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    gradeLevels: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
