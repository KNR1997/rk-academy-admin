import dynamic from 'next/dynamic';
// utils
import { getAuthCredentials } from '@/utils/auth-utils';
import { COORDINATOR, SUPER_ADMIN, TEACHER } from '@/utils/constants';
// components
const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const TeacherLayout = dynamic(() => import('@/components/layouts/teacher'));
const StudentLayout = dynamic(() => import('@/components/layouts/student'));
const CoordinatorLayout = dynamic(
  () => import('@/components/layouts/coordinator'),
);

export default function AppLayout(props: any) {
  const { permissions } = getAuthCredentials();

  if (permissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  } else if (permissions?.includes(TEACHER)) {
    return <TeacherLayout {...props} />;
  } else if (permissions?.includes(COORDINATOR)) {
    return <CoordinatorLayout {...props} />;
  } else {
    return <StudentLayout {...props} />;
  }
}
