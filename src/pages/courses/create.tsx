import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// components
import Layout from '@/components/layouts/admin';
import CreateOrUpdateCourseForm from '@/components/course/course-form';

export default function CreateCoursePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-course')}
        </h1>
      </div>
      <CreateOrUpdateCourseForm />
    </>
  );
}

CreateCoursePage.authenticate = {
  permissions: adminOnly,
};
CreateCoursePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
