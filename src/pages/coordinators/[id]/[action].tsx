import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useCoordinatorQuery } from '@/data/coordinator';
// components
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import CoordinatorCreateForm from '@/components/coordinator/coordinator-form';

export default function UpdateCoordinatorPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  // query
  const {
    coordinator,
    isLoading: loading,
    error,
  } = useCoordinatorQuery({
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
          {t('form:form-title-edit-course')}
        </h1>
      </div>

      <CoordinatorCreateForm initialValues={coordinator} />
    </>
  );
}

UpdateCoordinatorPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
