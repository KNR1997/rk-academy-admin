import cn from 'classnames';
import { useState } from 'react';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { studentOnly } from '@/utils/auth-utils';
// hooks
import { useEnrollmentQuery } from '@/data/enrollment';
import { useMyEnrollmentChargesPaginatedQuery } from '@/data/user';
// components
import Layout from '@/components/layouts/student';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import MyCoursePageHeader from '@/components/my-course/my-coruse-page-header';
import EnrollmentChargesList from '@/components/my-course/enrollment-charge-list';

export default function MyCoursePayments() {
  const { query } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const {
    enrollment,
    isLoading: enrollmentLoading,
    error: EnrollmentGetError,
  } = useEnrollmentQuery({
    slug: query.id as string,
  });
  const { enrollmentCharges, paginatorInfo, loading, error } =
    useMyEnrollmentChargesPaginatedQuery({
      enrollment_id: query.id as string,
      page: page,
      ordering: ordering,
    });

  if (loading || enrollmentLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <MyCoursePageHeader
        pageTitle={`${enrollment?.course_offering.subject?.name} ${enrollment?.course_offering?.grade_level?.name} - B${enrollment?.course_offering?.batch}`}
        enrollmentId={query.id as string}
      />
      <EnrollmentChargesList
        enrollmentCharges={enrollmentCharges}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

MyCoursePayments.authenticate = {
  permissions: studentOnly,
};
MyCoursePayments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
