import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// contexts
import { useSettings } from '@/contexts/settings.context';
// client
import { API_ENDPOINTS } from './client/api-endpoints';
import { settingsClient } from './client/settings';
// utils
import { setMaintenanceDetails } from '@/utils/maintenance-utils';
// types
import { Settings } from '@/types';

export const useUpdateSettingsMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateSettings } = useSettings();

  return useMutation(settingsClient.update, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      updateSettings(data?.options);
      setMaintenanceDetails(
        data?.options?.maintenance?.isUnderMaintenance,
        data?.options?.maintenance,
      );
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
    },
  });
};

export const useSettingsQuery = ({ language }: { language: string }) => {
  const { data, error, isLoading } = useQuery<Settings, Error>(
    [API_ENDPOINTS.SETTINGS, { language }],
    () => settingsClient.all({ language }),
    {
      // staleTime: 6 * 60 * 60 * 1000, // 6 hours
      // cacheTime: 6 * 60 * 60 * 1000, // 6 hours
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  );

  return {
    settings: data,
    error,
    loading: isLoading,
  };
};
