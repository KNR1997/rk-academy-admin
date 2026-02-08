import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useStudentQuery } from '@/data/student';
import CreateOrUpdateStudentForm from '@/components/student/student-form';

export default function UpdateStudentPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    student,
    isLoading: loading,
    error,
  } = useStudentQuery({
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
          {t('form:form-title-edit-student')}
        </h1>
      </div>

      <CreateOrUpdateStudentForm initialValues={student} />
    </>
  );
}

UpdateStudentPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
