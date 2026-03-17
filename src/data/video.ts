import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { GetParams, Video, VideoPaginator, VideoQueryOptions } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { videoClient } from './client/video';
import { Config } from '@/config';

export const useVideosQuery = (options: Partial<VideoQueryOptions>) => {
  const { data, error, isLoading } = useQuery<VideoPaginator, Error>(
    [API_ENDPOINTS.VIDEOS, options],
    ({ queryKey, pageParam }) =>
      videoClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    videos: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useVideoQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Video, Error>(
    [API_ENDPOINTS.VIDEOS, { slug }],
    () => videoClient.get({ slug }),
  );

  return {
    video: data,
    error,
    isLoading,
  };
};

export const useCreateVideoMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(videoClient.create, {
    onSuccess: () => {
      Router.push(Routes.video.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.VIDEOS);
    },
  });
};

export const useUpdateVideoMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(videoClient.patch, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.video.list}`
        : Routes.video.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.VIDEOS);
    },
  });
};

export const useDeleteVideoMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(videoClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.VIDEOS);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail);
    },
  });
};
