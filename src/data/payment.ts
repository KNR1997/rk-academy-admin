import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { paymentClient } from './client/payment';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useModalAction } from '@/components/ui/modal/modal.context';

export const useCreatePaymentMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();

  return useMutation(paymentClient.create, {
    onSuccess: () => {
      toast.success(t('common:successfully-created'));
      closeModal();
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.INVOICES);
    },
  });
};
