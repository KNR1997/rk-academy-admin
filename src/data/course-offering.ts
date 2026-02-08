import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  CourseQueryOptions,
  CourseOfferingPaginator,
  CourseOffering,
  CourseOfferingQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { courseOfferingClient } from './client/course-offering';
import { Config } from '@/config';

export const useCreateCourseOfferingMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseOfferingClient.create, {
    onSuccess: () => {
      Router.push(Routes.courseOffering.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSE_OFFERING);
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(courseOfferingClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COURSE_OFFERING);
    },
  });
};

export const useUpdateCourseOfferingMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(courseOfferingClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.courseOffering.list}`
        : Routes.courseOffering.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.COURSE_OFFERING);
    },
  });
};

export const useCourseOfferingQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<CourseOffering, Error>(
    [API_ENDPOINTS.COURSE_OFFERING, { slug }],
    () => courseOfferingClient.get({ slug })
  );

  return {
    courseOffering: data,
    error,
    isLoading,
  };
};

export const useCourseOfferingsQuery = (options: Partial<CourseOfferingQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CourseOfferingPaginator, Error>(
    [API_ENDPOINTS.COURSE_OFFERING, options],
    ({ queryKey, pageParam }) =>
      courseOfferingClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    courseOfferings: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
