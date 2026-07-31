import cn from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// hooks
import { useVideosQuery } from '@/data/video';
// components
import Card from '@/components/common/card';
import AppLayout from '@/components/layouts/app';
import Search from '@/components/common/search';
import Loader from '@/components/ui/loader/loader';
import LinkButton from '@/components/ui/link-button';
import VideoList from '@/components/video/video-list';
import { ArrowUp } from '@/components/icons/arrow-up';
import ErrorMessage from '@/components/ui/error-message';
import VideoFilter from '@/components/video/video-filter';
import { ArrowDown } from '@/components/icons/arrow-down';
import PageHeading from '@/components/common/page-heading';

export default function Videos() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  // states
  const [day, setDay] = useState('');
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState('');
  const [lesson, setLesson] = useState('');
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  // query
  const { videos, paginatorInfo, loading, error } = useVideosQuery({
    limit: 20,
    page,
    name: searchTerm,
    course_content__month: month,
    lesson: lesson,
    day: day,
    ordering,
    language: locale,
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
            <PageHeading title={t('form:input-label-course-videos')} />
          </div>

          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />

            {locale === Config.defaultLanguage && (
              <LinkButton
                href={`${Routes.video.create}`}
                className="h-12 w-full md:w-auto md:ms-6"
              >
                <span className="block md:hidden xl:block">
                  + {t('form:button-label-add-videos')}
                </span>
                <span className="hidden md:block xl:hidden">
                  + {t('form:button-label-add')}
                </span>
              </LinkButton>
            )}
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}
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
            <VideoFilter
              enableLessonFilter
              enableDayFilter
              enableMonthFilter
              onMonthFilter={(data: { label: string; value: string }) => {
                setMonth(data?.value);
                setPage(1);
              }}
              onLessonFilter={(data: { label: string; value: string }) => {
                setLesson(data?.value);
                setPage(1);
              }}
              onDayFilter={(data: { label: string; value: string }) => {
                setDay(data?.value);
                setPage(1);
              }}
              className="w-full"
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
    </>
  );
}

Videos.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
Videos.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
