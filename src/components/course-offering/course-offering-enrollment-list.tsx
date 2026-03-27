import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// config
import { Routes } from '@/config/routes';
// utils
import { useIsRTL } from '@/utils/locals';
// types
import { Enrollment, EnrollmentStatusType, SortOrder, Student } from '@/types';
import { MappedPaginatorInfo } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  enrollments: Enrollment[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};
const CourseOfferingEnrollmentList = ({
  enrollments,
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
          title={t('table:table-item-student')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'student',
      key: 'student',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('student'),
      render: (
        student: Student,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          <Avatar name={email} src={profile?.avatar?.thumbnail} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {student?.user.first_name} {student?.user.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              ST No. {student?.student_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-payment-month'),
      dataIndex: 'last_payment_month',
      key: 'last_payment_month',
      align: alignLeft,
      width: 150,
      render: (last_payment_month: number, record: Enrollment) => (
        <div className="overflow-hidden truncate whitespace-nowrap">
          {record.last_payment_year}-{last_payment_month}
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      width: 150,
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      onHeaderCell: () => onHeaderClick('status'),
      render: (status: EnrollmentStatusType) => (
        <Badge
          textKey={status}
          color={
            status == EnrollmentStatusType.ACTIVE
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, record: Enrollment) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          routes={Routes?.enrollment}
          whatsappMessage={
            record.status != EnrollmentStatusType.ACTIVE
              ? record?.student?.parent_guardian_phone
              : ''
          }
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
          data={enrollments}
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

export default CourseOfferingEnrollmentList;
