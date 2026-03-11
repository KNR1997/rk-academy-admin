import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminOnly } from '@/utils/auth-utils';
// hooks
import { useAdminsQuery } from '@/data/user';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import AdminsList from '@/components/user/user-admin-list';
import PageHeading from '@/components/common/page-heading';

export default function Admins() {
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('created_at');
  // query
  const { admins, paginatorInfo, loading, error } = useAdminsQuery({
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
      <Card className="mb-8 flex items-center">
        <div className="md:w-1/4">
          <PageHeading title={t('text-admins')} />
        </div>
      </Card>

      {loading ? null : (
        <AdminsList
          admins={admins}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrdering={setOrdering}
        />
      )}
    </>
  );
}

Admins.authenticate = {
  permissions: adminOnly,
};
Admins.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
