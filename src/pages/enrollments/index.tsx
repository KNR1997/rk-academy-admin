import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminOnly } from '@/utils/auth-utils';
// types
import { GradeLevel, SortOrder } from '@/types';
// hooks
import { useEnrollmentsWithMonthsQuery } from '@/data/enrollment';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import AnalyticCard from '@/components/widgets/analytic-card';
import BatchFilter from '@/components/enrollment/batch-filter';
import GradeFilter from '@/components/enrollment/grade-filter';
import { EaringIcon } from '@/components/icons/summary/earning';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import { CustomersIcon } from '@/components/icons/summary/customers';
import EnrollmentMonthList from '@/components/enrollment/enrollment-month-list';

export default function Enrollments() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [grade, setGrade] = useState('');
  const [batch, setBatch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  // query
  const { enrollmentsWithMonths, paginatorInfo, loading, error } =
    useEnrollmentsWithMonthsQuery({
      limit: 20,
      page,
      name: searchTerm,
      grade_level: grade,
      batch: batch,
      ordering: orderBy,
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
            <PageHeading title={t('form:input-label-enrollments')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />

            <GradeFilter
              className="md:ms-6"
              onGradeFilter={(grade_level: GradeLevel) => {
                setGrade(grade_level?.name!);
                setPage(1);
              }}
            />

            <BatchFilter
              className="md:ms-6"
              onBatchFilter={(batch: { label: string; value: string }) => {
                setBatch(batch?.value!);
                setPage(1);
              }}
            />

            {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.enrollment.create}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-enrollments')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
          </div>
        </div>
      </Card>
      <Card className="mb-8 flex flex-col">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticCard
            titleTransKey="Total Students"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<CustomersIcon className="h-8 w-8" />}
            color="#1EAE98"
            price={paginatorInfo?.total}
          />
          <AnalyticCard
            titleTransKey="Active Students"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#865DFF"
            price={12}
          />
          <AnalyticCard
            titleTransKey="Growth"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={12}
          />
          <AnalyticCard
            titleTransKey="Income"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#E157A0"
            price={12}
          />
        </div>
      </Card>
      <EnrollmentMonthList
        enrollmentsWithMonths={enrollmentsWithMonths}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Enrollments.authenticate = {
  permissions: adminOnly,
};
Enrollments.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
