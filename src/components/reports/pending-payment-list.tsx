import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
// types
import {
  MappedPaginatorInfo,
  Enrollment,
  EnrollmentPayment,
  SortOrder,
  PendingPayment,
  User,
  CourseOffering,
} from '@/types';
// utils
import usePrice from '@/utils/use-price';
import { useIsRTL } from '@/utils/locals';

export type IProps = {
  pendingPayments: PendingPayment[];
  paginatorInfo?: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const PendingPaymentList = ({
  pendingPayments,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
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
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-student')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 180,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('student_number'),
      render: (
        id: string,
        record: PendingPayment,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar
            name={`${record?.student?.user?.first_name} ${record?.student?.user?.last_name}`}
            src={profile?.avatar?.thumbnail}
          />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {record?.student?.user?.first_name}{' '}
            {record?.student?.user?.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              ST No. {record?.student?.student_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-course'),
      dataIndex: 'course_offering',
      key: 'course_offering',
      align: alignLeft,
      width: 150,
      render: (course_offering: CourseOffering) => {
        return (
          <div
            className="overflow-hidden truncate whitespace-nowrap"
            title={course_offering?.course?.name}
          >
            {course_offering?.course?.name}
          </div>
        );
      },
    },
    // {
    //   title: t('table:table-item-payment-month'),
    //   dataIndex: 'payment_month',
    //   key: 'payment_month',
    //   align: alignLeft,
    //   width: 150,
    //   render: (payment_month: number, record: PendingPayment) => (
    //     <div className="overflow-hidden truncate whitespace-nowrap">
    //       {record.payment_year}-{payment_month}
    //     </div>
    //   ),
    // },
    // {
    //   title: t('table:table-item-amount'),
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   align: alignLeft,
    //   width: 150,
    //   render: function Render(value: any) {
    //     const { price } = usePrice({
    //       amount: value,
    //     });
    //     return <span className="whitespace-nowrap">{price}</span>;
    //   },
    // },
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
          data={pendingPayments}
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

export default PendingPaymentList;
