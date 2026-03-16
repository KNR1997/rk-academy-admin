import { useState } from 'react';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { studentOnly } from '@/utils/auth-utils';
// hooks
import { useMyEnrollmentVideosPaginatedQuery } from '@/data/user';
// components
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/student';
import Loader from '@/components/ui/loader/loader';
import VideoList from '@/components/video/video-list';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';

export default function MyCoursePage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const { videos, paginatorInfo, loading, error } =
    useMyEnrollmentVideosPaginatedQuery({
      enrollment_id: query.id as string,
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
            <PageHeading title={t('form:input-label-course-videos')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>
        </div>
      </Card>
      <VideoList
        videos={videos}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrdering={setOrdering}
      />
      {/* <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">{course?.name}</h1>
      </div>
      <div className="relative h-[20rem] bg-white lg:h-[37.5rem]">
        <Image
          src={'/course-fallback-cover-photo.png'}
          // fill
          height={600}
          width={1200}
          sizes="(max-width: 768px) 70vw"
          alt={Object(name)}
          className="h-full w-full object-cover"
        />

        <div className="mt-6 space-y-4">
          <Dropdown
            title="Week 05 - Basic Elements of Programming"
            subtitle="(1 September - 7 September)"
          >
            <h3 className="mb-2 text-base font-medium text-purple-600">
              Expressions and Operators – Week 5
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              After completing this lesson, you will be able to use expressions
              and operators in programming.
            </p>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                ✅ Compare statements and expressions
              </li>
              <li className="flex items-center gap-2">
                ✅ Apply different types of operators when you write Python
                programs
              </li>
              <li className="flex items-center gap-2">
                ✅ Define the importance of comments
              </li>
            </ul>
          </Dropdown>
        </div>
      </div> */}
    </>
  );
}

MyCoursePage.authenticate = {
  permissions: studentOnly,
};
MyCoursePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};
