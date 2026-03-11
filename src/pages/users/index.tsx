import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useUsersQuery } from '@/data/user';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import UserList from '@/components/user/user-list';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';

export default function AllUsersPage() {
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('created_at');
  // query
  const { users, paginatorInfo, loading, error } = useUsersQuery({
    limit: 20,
    page,
    name: searchTerm,
    ordering,
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
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-users')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-2/4">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />
        </div>
      </Card>

      <UserList
        customers={users}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

AllUsersPage.authenticate = {
  permissions: adminOnly,
};
AllUsersPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
