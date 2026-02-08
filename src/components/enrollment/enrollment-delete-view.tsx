import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteEnrollmentMutation } from '@/data/enrollment';

const EnrollmentDeleteView = () => {
  const { mutate: deleteEnrollment, isLoading: loading } =
    useDeleteEnrollmentMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteEnrollment({
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

export default EnrollmentDeleteView;
