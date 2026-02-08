import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import CreateOrUpdateTeacherForm from '@/components/teacher/teacher-form';
import { useTeacherQuery } from '@/data/teacher';

export default function UpdateTeacherPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    teacher,
    isLoading: loading,
    error,
  } = useTeacherQuery({
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
          {t('form:form-title-edit-teacher')}
        </h1>
      </div>

      <CreateOrUpdateTeacherForm initialValues={teacher} />
    </>
  );
}

UpdateTeacherPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
