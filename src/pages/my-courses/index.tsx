import Layout from '@/components/layouts/student';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, hasAccess, studentOnly } from '@/utils/auth-utils';
import CourseCard from '@/components/course/course-card';
import { isEmpty } from 'lodash';
import { useMyEnrollmentsQuery } from '@/data/user';
import { Enrollment } from '@/types';

export default function MyCourses() {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(studentOnly, permissions);

  const { myEnrollments, loading, error } = useMyEnrollmentsQuery({});

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      {permission ? (
        <div className="mb-5 border-b border-dashed border-border-base pb-5 md:mb-8 md:pb-7 ">
          <h1 className="text-lg font-semibold text-heading">
            {t('common:sidebar-nav-item-my-courses')}
          </h1>
        </div>
      ) : (
        ''
      )}
      {!isEmpty(myEnrollments) ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
          {myEnrollments?.map((enrollment: Enrollment, idx: number) => (
            <CourseCard enrollment={enrollment} key={idx} />
          ))}
        </div>
      ) : (
        ''
      )}
    </>
  );
}

MyCourses.authenticate = {
  permissions: studentOnly,
};
MyCourses.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
