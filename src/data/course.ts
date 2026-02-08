import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Course,
  CoursePaginator,
  CourseQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { courseClient } from './client/course';
import { Config } from '@/config';

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.create, {
    onSuccess: () => {
      Router.push(Routes.course.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useUpdateCourseMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(courseClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.course.list}`
        : Routes.course.list;
      await router.push(
        `${generateRedirectUrl}/${data?.slug}/edit`,
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
      queryClient.invalidateQueries(API_ENDPOINTS.COURSES);
    },
  });
};

export const useCourseQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Course, Error>(
    [API_ENDPOINTS.COURSES, { slug }],
    () => courseClient.get({ slug })
  );

  return {
    course: data,
    error,
    isLoading,
  };
};

export const useCoursesQuery = (options: Partial<CourseQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CoursePaginator, Error>(
    [API_ENDPOINTS.COURSES, options],
    ({ queryKey, pageParam }) =>
      courseClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    courses: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
