import cn from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// hooks
import { useEnrollmentPendingPaymentsQuery } from '@/data/enrollment-payment';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import AppLayout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import { ArrowUp } from '@/components/icons/arrow-up';
import ErrorMessage from '@/components/ui/error-message';
import { ArrowDown } from '@/components/icons/arrow-down';
import PageHeading from '@/components/common/page-heading';
import EnrollmentPendingPaymentFilter from '@/components/filters/enrollment-pending-payment-filter';
import EnrollmentPendingPaymentList from '@/components/enrollment/enrollment-pending-payment-list';

export default function EnrollmentPendingPayments() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  // states
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [year, setYear] = useState<number | null>(currentYear);
  const [month, setMonth] = useState<number | null>(currentMonth);
  // query
  const { enrollmentPendingPayments, paginatorInfo, loading, error } =
    useEnrollmentPendingPaymentsQuery({
      limit: 20,
      page,
      name: searchTerm,
      ordering,
      language: locale,
      last_payment_month: month ?? currentMonth,
      last_payment_year: year ?? currentYear,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('form:input-label-pending-payments')} />
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <EnrollmentPendingPaymentFilter
              className="w-full"
              onYearFilter={(year: any) => {
                setYear(year?.value!);
                setPage(1);
              }}
              onMonthFilter={(month: any) => {
                setMonth(month?.value!);
                setPage(1);
              }}
              enableYear
              enableMonth
            />
          </div>
        </div>
      </Card>
      <EnrollmentPendingPaymentList
        enrollments={enrollmentPendingPayments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

EnrollmentPendingPayments.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
EnrollmentPendingPayments.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
