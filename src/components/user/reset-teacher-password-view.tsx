import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useResetTeacherPasswordMutation } from '@/data/user';

const ResetTeacherPasswordView = () => {
  const { mutate: resetTeacherPassword, isLoading: loading } =
    useResetTeacherPasswordMutation();
  const { data } = useModalState();

  const { closeModal } = useModalAction();

  async function handleResetPassword() {
    resetTeacherPassword({
      teacher_id: data,
      password: '1234',
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleResetPassword}
      deleteBtnText="text-yes"
      title="text-reset-password"
      description="text-description-reset-password"
      deleteBtnLoading={loading}
    />
  );
};

export default ResetTeacherPasswordView;
