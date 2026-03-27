import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// utils
import { useIsRTL } from '@/utils/locals';
// configs
import { Routes } from '@/config/routes';
// types
import { MappedPaginatorInfo } from '@/types';
import { Video, SortOrder, CourseContent } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import ActionButtons from '../common/action-buttons';

export type IProps = {
  videos: Video[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};

const MyVideoList = ({
  videos,
  paginatorInfo,
  onPagination,
  onOrdering,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      const nextSort =
        sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;

      const ordering = nextSort === SortOrder.Desc ? `-${column}` : column;

      onOrdering(ordering);
      setSortingObj({
        sort: nextSort,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'title'
          }
          isActive={sortingObj.column === 'title'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'title',
      key: 'title',
      align: alignLeft,
      width: 150,
      onHeaderCell: () => onHeaderClick('title'),
    },
    {
      title: t('table:table-item-course-offering'),
      className: 'cursor-content',
      dataIndex: 'course_content',
      key: 'course_content',
      align: alignLeft,
      width: 150,
      render: (course_content: CourseContent) => {
        const courseOffering = course_content?.course_offering;
        return (
          <div
            className="overflow-hidden truncate whitespace-nowrap"
            title={courseOffering?.course?.name}
          >
            {courseOffering?.course?.name} {courseOffering?.grade_level?.name} -
            B{courseOffering.batch}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-month'),
      dataIndex: 'course_content',
      key: 'course_content',
      align: alignLeft,
      width: 120,
      render: (course_content: CourseContent) => (
        <div className="overflow-hidden truncate whitespace-nowrap">
          {course_content?.month}
        </div>
      ),
    },
    {
      title: t('table:table-item-watch'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, record: Video) => (
        <ActionButtons
          id={id}
          enablePreviewMode={!!record?.video_url}
          previewUrl={Routes?.watchVideos.details(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={videos}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default MyVideoList;
