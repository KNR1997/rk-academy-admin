import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteCoordinatorMutation } from '@/data/coordinator';

const CoordinatorDeleteView = () => {
  const { mutate: deleteCoordinator, isLoading: loading } =
    useDeleteCoordinatorMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteCoordinator({
      id: data,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default CoordinatorDeleteView;
