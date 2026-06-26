import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { studentOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// hooks
import { useMyEnrollmentChargesPaginatedQuery } from '@/data/user';
// components
import Layout from '@/components/layouts/student';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import MyEnrollmentPaymentList from '@/components/my-enrollment-payments/my-enrollment-payment-list';

export default function MyEnrollmentPayments() {
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const { myEnrollmentCharges, paginatorInfo, loading, error } =
    useMyEnrollmentChargesPaginatedQuery({
      ordering,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <div className="mb-5 border-b border-dashed border-border-base pb-5 md:mb-8 md:pb-7 ">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:sidebar-nav-item-my-enrollment-payments')}
        </h1>
      </div>
      <MyEnrollmentPaymentList
        enrollmentCharges={myEnrollmentCharges}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

MyEnrollmentPayments.authenticate = {
  permissions: studentOnly,
};
MyEnrollmentPayments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
