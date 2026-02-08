import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  CourseOfferingPaginator,
  CourseQueryOptions,
  GetParams,
  Teacher,
  TeacherPaginator,
  TeacherQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { teacherClient } from './client/teacher';
import { Config } from '@/config';

export const useCreateTeacherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(teacherClient.create, {
    onSuccess: () => {
      Router.push(Routes.teacher.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TEACHERS);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};

export const useDeleteTeacherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(teacherClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TEACHERS);
    },
  });
};

export const useUpdateTeacherMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(teacherClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.teacher.list}`
        : Routes.teacher.list;
      await router.push(`${generateRedirectUrl}/${data?.id}/edit`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.TEACHERS);
    },
    // onError: (error: any) => {
    //   console.log('error: ', error)
    //   toast.error(error?.response?.data?.error)
    // }
  });
};

export const useTeacherQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Teacher, Error>(
    [API_ENDPOINTS.TEACHERS, { slug, language }],
    () => teacherClient.get({ slug, language }),
  );

  return {
    teacher: data,
    error,
    isLoading,
  };
};

export const useTeachersQuery = (options: Partial<TeacherQueryOptions>) => {
  const { data, error, isLoading } = useQuery<TeacherPaginator, Error>(
    [API_ENDPOINTS.TEACHERS, options],
    ({ queryKey, pageParam }) =>
      teacherClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    teachers: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useTeacherCourseOfferingsQuery = (
  options: Partial<CourseQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CourseOfferingPaginator, Error>(
    [API_ENDPOINTS.TEACHERS, options],
    ({ queryKey, pageParam }) =>
      teacherClient.myCourseOfferingsPaginated(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
    },
  );

  return {
    courseOfferings: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useTeacherCourseOfferingQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Teacher, Error>(
    [API_ENDPOINTS.TEACHERS, { slug, language }],
    () => teacherClient.get({ slug, language }),
  );

  return {
    courseOffering: data,
    error,
    isLoading,
  };
};
