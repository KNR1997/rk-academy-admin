import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// types
import { SortOrder } from '@/types';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/teacher';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
// utils
import { teacherOnly } from '@/utils/auth-utils';
// query
import { useTeacherCourseOfferingsQuery } from '@/data/teacher';
import MyCourseOfferingList from '@/components/my/course-offering-list';

export default function MyCourseOfferings() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  // query
  const { courseOfferings, paginatorInfo, loading, error } =
    useTeacherCourseOfferingsQuery({
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
            <PageHeading title={t('form:input-label-course-offerings')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>
        </div>
      </Card>
      <MyCourseOfferingList
        courseOfferings={courseOfferings}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

MyCourseOfferings.authenticate = {
  permissions: teacherOnly,
};
MyCourseOfferings.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
