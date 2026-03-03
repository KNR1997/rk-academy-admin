import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useMeQuery } from '@/data/user';
// components
import AppLayout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import EmailUpdateForm from '@/components/auth/email-update-form';
import ProfileUpdateFrom from '@/components/auth/profile-update-form';
import ChangePasswordForm from '@/components/auth/change-password-from';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useMeQuery();
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-profile-settings')}
        </h1>
      </div>
      <EmailUpdateForm me={data} />

      <ProfileUpdateFrom me={data} />
      <ChangePasswordForm />
    </>
  );
}

ProfilePage.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
