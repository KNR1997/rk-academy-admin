import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useCourseOfferingQuery } from '@/data/course-offering';
// components
import Layout from '@/components/layouts/teacher';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import CreateOrUpdateCourseOfferingForm from '@/components/course-offering/course-offering-form';

export default function ViewMyCourseOfferingPage() {
  const { query } = useRouter();
  const { t } = useTranslation();
  // query
  const {
    courseOffering,
    isLoading: loading,
    error,
  } = useCourseOfferingQuery({
    slug: query.id as string,
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
      <CreateOrUpdateCourseOfferingForm initialValues={courseOffering} />
    </>
  );
}

ViewMyCourseOfferingPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
