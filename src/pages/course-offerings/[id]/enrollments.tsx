import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// configs
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// hooks
import { useCourseOfferingEnrollmentsQuery } from '@/data/course-offering';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import AppLayout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import CourseOfferingEnrollmentList from '@/components/course-offering/course-offering-enrollment-list';

export default function CourseOfferingEnrollments() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const { enrollments, paginatorInfo, loading, error } =
    useCourseOfferingEnrollmentsQuery({
      limit: 20,
      page,
      course_offering_id: query.id as string,
      name: searchTerm,
      ordering,
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

            {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.courseOffering.create}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-offerings')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
          </div>
        </div>
      </Card>
      <CourseOfferingEnrollmentList
        enrollments={enrollments}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

CourseOfferingEnrollments.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
CourseOfferingEnrollments.Layout = AppLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'table', 'common'])),
  },
});
