import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// utils
import { useIsRTL } from '@/utils/locals';
// types
import { MappedPaginatorInfo } from '@/types';
import { Enrollment, EnrollmentPayment, SortOrder } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';

export type IProps = {
  enrollmentPayments: EnrollmentPayment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};

const EnrollmentPaymentList = ({
  enrollmentPayments,
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
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-student')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'enrollment__student__user__first_name'
          }
          isActive={sortingObj.column === 'enrollment__student__user__first_name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'enrollment',
      key: 'enrollment',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('enrollment__student__user__first_name'),
      render: (
        enrollment: Enrollment,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar name={email} src={profile?.avatar?.thumbnail} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {enrollment?.student?.user.first_name}{' '}
            {enrollment?.student?.user.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              ST No. {enrollment?.student?.student_number}
            </span>
          </div>
        </div>
      ),
    },
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
      dataIndex: 'payment_month',
      key: 'payment_month',
      align: alignLeft,
      width: 150,
      render: (payment_month: number, record: EnrollmentPayment) => (
        <div className="overflow-hidden truncate whitespace-nowrap">
          {record.payment_year}-{payment_month}
        </div>
      ),
    },
    // {
    //   title: t('table:table-item-actions'),
    //   dataIndex: 'id',
    //   key: 'actions',
    //   align: alignRight,
    //   width: 120,
    //   render: (id: string, record: EnrollmentPayment) => (
    //     <LanguageSwitcher
    //       slug={id}
    //       record={record}
    //       // deleteModalView="DELETE_ENROLLMENT"
    //       routes={Routes?.enrollmentPayment}
    //     />
    //   ),
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
          data={enrollmentPayments}
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

export default EnrollmentPaymentList;
