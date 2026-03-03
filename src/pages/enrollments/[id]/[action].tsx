import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// config
import { Config } from '@/config';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// hooks
import { useEnrollmentQuery } from '@/data/enrollment';
// components
import AppLayout from '@/components/layouts/app';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import CreateOrUpdateEnrollmentForm from '@/components/enrollment/enrollment-form';

export default function UpdateEnrollmentPage() {
  const { t } = useTranslation();
  const { query, locale } = useRouter();
  // queries
  const {
    enrollment,
    isLoading: loading,
    error,
  } = useEnrollmentQuery({
    slug: query.id as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-enrollment')}
        </h1>
      </div>

      <CreateOrUpdateEnrollmentForm initialValues={enrollment} />
    </>
  );
}

UpdateEnrollmentPage.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
UpdateEnrollmentPage.Layout = AppLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
