import dynamic from 'next/dynamic';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils';
import { COORDINATOR, SUPER_ADMIN, TEACHER } from '@/utils/constants';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// components
import AppLayout from '@/components/layouts/app';

const AdminDashboard = dynamic(
  () => import('@/components/dashboard/admin')
);
const TeacherDashboard = dynamic(
  () => import('@/components/dashboard/teacher'),
);
const StudentDashboard = dynamic(
  () => import('@/components/dashboard/student'),
);
const CoordinatorDashboard = dynamic(
  () => import('@/components/dashboard/coordinator'),
);

export default function Dashboard({
  userPermissions,
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SUPER_ADMIN)) {
    return <AdminDashboard />;
  } else if (userPermissions?.includes(TEACHER)) {
    return <TeacherDashboard />;
  } else if (userPermissions?.includes(COORDINATOR)) {
    return <CoordinatorDashboard />;
  } else {
    return <StudentDashboard />;
  }
}

Dashboard.Layout = AppLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  // TODO: Improve it
  const generateRedirectUrl =
    locale !== Config.defaultLanguage
      ? `/${locale}${Routes.login}`
      : Routes.login;
  const { token, permissions } = getAuthCredentials(ctx);
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: generateRedirectUrl,
        permanent: false,
      },
    };
  }
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'form',
          'table',
          'widgets',
        ])),
        userPermissions: permissions,
      },
    };
  }
  return {
    props: {
      userPermissions: permissions,
    },
  };
};
