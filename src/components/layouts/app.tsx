import { SUPER_ADMIN, TEACHER } from '@/utils/constants';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const TeacherLayout = dynamic(() => import('@/components/layouts/teacher'));
const StudentLayout = dynamic(() => import('@/components/layouts/student'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminLayout {...props} />;
  } else if (userPermissions?.includes(TEACHER)) {
    return <TeacherLayout {...props} />;
  } else {
    return <StudentLayout {...props} />;
  }
  // return <OwnerLayout {...props} />;
}
