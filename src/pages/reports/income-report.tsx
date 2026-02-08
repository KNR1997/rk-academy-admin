import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// components
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import IncomeList from '@/components/reports/income-list';
import PageHeading from '@/components/common/page-heading';
// types
import { SortOrder } from '@/types';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useEnrollmentPaymentsQuery } from '@/data/enrollment-payment';

export default function IncomeReport() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  // query
  const { enrollmentPayments, paginatorInfo, loading, error } =
    useEnrollmentPaymentsQuery({
      limit: 20,
      page,
      name: searchTerm,
      orderBy,
      sortedBy,
      language: locale,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

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
            <PageHeading title={t('form:input-label-income-report')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
            <Button className="h-12 w-full md:w-auto md:ms-6">
              Generate Report
            </Button>
          </div>
        </div>
      </Card>
      <IncomeList
        enrollmentPayments={enrollmentPayments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

IncomeReport.authenticate = {
  permissions: adminOnly,
};
IncomeReport.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
