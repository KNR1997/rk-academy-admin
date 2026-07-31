import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// types
import { GradeLevel } from '@/types';
// hooks
import { useStudentsQuery } from '@/data/student';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import AppLayout from '@/components/layouts/app';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import StudentList from '@/components/student/student-list';
import GradeFilter from '@/components/enrollment/grade-filter';

export default function Students() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [grade, setGrade] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // queries
  const { students, paginatorInfo, loading, error } = useStudentsQuery({
    limit: 20,
    page,
    name: searchTerm,
    current_grade__level: grade,
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
            <PageHeading title={t('form:input-label-students')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name-or-student-number')}
            />

            <GradeFilter
              className="md:ms-6"
              onGradeFilter={(grade_level: GradeLevel) => {
                setGrade(grade_level?.level!);
                setPage(1);
              }}
            />

            {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.student.create}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-students')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
          </div>
        </div>
      </Card>
      <StudentList
        students={students}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
    </>
  );
}

Students.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
Students.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
