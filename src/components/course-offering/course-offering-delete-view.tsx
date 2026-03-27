// hooks
import { useDeleteCourseOfferingMutation } from '@/data/course-offering';
// components
import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';

const CourseOfferingDeleteView = () => {
  const { mutate: deleteCourse, isLoading: loading } =
    useDeleteCourseOfferingMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteCourse({
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

export default CourseOfferingDeleteView;
