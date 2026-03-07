import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { allowedRoles } from '@/utils/auth-utils';
// components
import AppLayout from '@/components/layouts/app';
import MessagePageIndex from '@/components/message/index';

export default function MessagePage() {
  return (
    <>
      <MessagePageIndex />
    </>
  );
}

MessagePage.authenticate = {
  permissions: allowedRoles,
};

MessagePage.Layout = AppLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
