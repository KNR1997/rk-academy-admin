import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useEnrollmentQuery } from '@/data/enrollment';
import CreateOrUpdateEnrollmentForm from '@/components/enrollment/enrollment-form';

export default function UpdateEnrollmentPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
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

UpdateEnrollmentPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
