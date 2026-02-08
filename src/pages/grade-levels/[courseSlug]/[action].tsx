import Layout from '@/components/layouts/admin';
import { useRouter } from 'next/router';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useCourseQuery } from '@/data/course';
import CreateOrUpdateCourseForm from '@/components/course/course-form';

export default function UpdateCoursePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const {
    course,
    isLoading: loading,
    error,
  } = useCourseQuery({
    slug: query.courseSlug as string,
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

      <CreateOrUpdateCourseForm initialValues={course} />
    </>
  );
}

UpdateCoursePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
