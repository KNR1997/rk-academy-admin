import dayjs from 'dayjs';
import { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
// utils
import { useIsRTL } from '@/utils/locals';
// types
import { MappedPaginatorInfo } from '@/types';
import { Enrollment, EnrollmentCharge, SortOrder } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';

export type IProps = {
  enrollmentCharges: EnrollmentCharge[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};

const MyEnrollmentChargeList = ({
  enrollmentCharges,
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
    // {
    //   title: t('table:table-item-id'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft,
    //   width: 120,
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-student')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'enrollment__student__user__first_name'
    //       }
    //       isActive={sortingObj.column === 'enrollment__student__user__first_name'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'enrollment',
    //   key: 'enrollment',
    //   align: alignLeft,
    //   width: 250,
    //   ellipsis: true,
    //   onHeaderCell: () => onHeaderClick('enrollment__student__user__first_name'),
    //   render: (
    //     enrollment: Enrollment,
    //     { profile, email }: { profile: any; email: string },
    //   ) => (
    //     <div className="flex items-center">
    //       <Avatar name={email} src={profile?.avatar?.thumbnail} />
    //       <div className="flex flex-col whitespace-nowrap font-medium ms-2">
    //         {enrollment?.student?.user.first_name}{' '}
    //         {enrollment?.student?.user.last_name}
    //         <span className="text-[13px] font-normal text-gray-500/80">
    //           ST No. {enrollment?.student?.student_number}
    //         </span>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: t('table:table-item-course'),
      dataIndex: 'enrollment',
      key: 'enrollment',
      align: alignLeft,
      width: 150,
      render: (enrollment: Enrollment) => {
        const courseOffering = enrollment?.course_offering;
        return (
          <div
            className="overflow-hidden truncate whitespace-nowrap"
            title={courseOffering?.course?.name}
          >
            {courseOffering?.course?.name} - {courseOffering?.grade_level.name}{' '}
            - B{courseOffering?.batch}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-payment-month'),
      dataIndex: 'billing_month',
      key: 'billing_month',
      align: alignLeft,
      width: 150,
      render: (billing_month: number, record: EnrollmentCharge) => (
        <div className="overflow-hidden truncate whitespace-nowrap">
          {record.billing_year}-{billing_month}
        </div>
      ),
    },
    {
      title: t('table:table-item-date'),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      width: 160,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).format('MMM D, YYYY h:mm A')}
          </span>
        );
      },
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
          data={enrollmentCharges}
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

export default MyEnrollmentChargeList;
