import StoreNoticeDeleteView from '@/components/store-notice/store-notice-delete-view';
import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
import EnrollmentPaymentView from '@/components/enrollment-payments/enrollment-payment-view';

const SubjectDeleteView = dynamic(
  () => import('@/components/subject/subject-delete-view'),
);
const CourseDeleteView = dynamic(
  () => import('@/components/course/course-delete-view'),
);
const EnrollmentDeleteView = dynamic(
  () => import('@/components/enrollment/enrollment-delete-view'),
);
const TeacherDeleteView = dynamic(
  () => import('@/components/teacher/teacher-delete-view'),
);
const BanCustomerView = dynamic(
  () => import('@/components/user/user-ban-view'),
);
const UserWalletPointsAddView = dynamic(
  () => import('@/components/user/user-wallet-points-add-view'),
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view'),
);
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal'),
);
const QuestionReplyView = dynamic(
  () => import('@/components/question/question-reply-view'),
);
const QuestionDeleteView = dynamic(
  () => import('@/components/question/question-delete-view'),
);
const ReviewDeleteView = dynamic(
  () => import('@/components/reviews/review-delete-view'),
);

const AcceptAbuseReportView = dynamic(
  () => import('@/components/reviews/acccpt-report-confirmation'),
);

const DeclineAbuseReportView = dynamic(
  () => import('@/components/reviews/decline-report-confirmation'),
);
const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));

const SearchModal = dynamic(
  () => import('@/components/layouts/topbar/search-modal'),
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_SUBJECT':
      return <SubjectDeleteView />;
    case 'DELETE_COURSE':
      return <CourseDeleteView />;
    case 'DELETE_ENROLLMENT':
      return <EnrollmentDeleteView />;
    case 'DELETE_TEACHER':
      return <TeacherDeleteView />;
    case 'ENROLLMENT_PAYMENT_VIEW':
      return <EnrollmentPaymentView />;
    case 'DELETE_STORE_NOTICE':
      return <StoreNoticeDeleteView />;
    case 'BAN_CUSTOMER':
      return <BanCustomerView />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'ADD_WALLET_POINTS':
      return <UserWalletPointsAddView />;
    case 'REPLY_QUESTION':
      return <QuestionReplyView />;
    case 'DELETE_QUESTION':
      return <QuestionDeleteView />;
    case 'DELETE_REVIEW':
      return <ReviewDeleteView />;
    case 'ACCEPT_ABUSE_REPORT':
      return <AcceptAbuseReportView />;
    case 'DECLINE_ABUSE_REPORT':
      return <DeclineAbuseReportView />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'ABUSE_REPORT':
    case 'SEARCH_VIEW':
      return <SearchModal />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
