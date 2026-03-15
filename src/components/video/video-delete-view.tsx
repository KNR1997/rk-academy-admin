// hooks
import { useDeleteVideoMutation } from '@/data/video';
// components
import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';

const VideoDeleteView = () => {
  const { mutate: deleteVideo, isLoading: loading } = useDeleteVideoMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteVideo({
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

export default VideoDeleteView;
