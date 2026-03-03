import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  GetParams,
  Coordinator,
  CoordinatorPaginator,
  CoordinatorQueryOptions,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { coordinatorClient } from './client/coordinator';
import { Config } from '@/config';

export const useCoordinatorsQuery = (
  options: Partial<CoordinatorQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<CoordinatorPaginator, Error>(
    [API_ENDPOINTS.COORDINATORS, options],
    ({ queryKey, pageParam }) =>
      coordinatorClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    coordinators: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCoordinatorQuery = ({ slug }: GetParams) => {
  const { data, error, isLoading } = useQuery<Coordinator, Error>(
    [API_ENDPOINTS.COORDINATORS, { slug }],
    () => coordinatorClient.get({ slug }),
  );

  return {
    coordinator: data,
    error,
    isLoading,
  };
};

export const useCreateCoordinatorMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(coordinatorClient.create, {
    onSuccess: () => {
      Router.push(Routes.coordinator.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COORDINATORS);
    },
  });
};

export const useUpdateCoordinatorMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(coordinatorClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.coordinator.list}`
        : Routes.coordinator.list;
      await router.push(
        `${generateRedirectUrl}/${data?.id}/edit`,
        undefined,
        {
          locale: Config.defaultLanguage,
        },
      );
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COORDINATORS);
    },
  });
};

export const useDeleteCoordinatorMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(coordinatorClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COORDINATORS);
    },
  });
};
