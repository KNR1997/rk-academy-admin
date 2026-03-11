import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// components
import Layout from '@/components/layouts/admin';
import CoordinatorCreateForm from '@/components/coordinator/coordinator-form';

export default function CreateCoordinatorPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-coordinator')}
        </h1>
      </div>
      <CoordinatorCreateForm />
    </>
  );
}

CreateCoordinatorPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
