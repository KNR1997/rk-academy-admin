import { useState } from 'react';
import { Routes } from '@/config/routes';
import { useTranslation } from 'next-i18next';
// types
import {
  CourseOffering,
  Enrollment,
  EnrollmentWithMonth,
  MonthData,
  SortOrder,
  Student,
} from '@/types';
import { MappedPaginatorInfo } from '@/types';
// utils
import { useIsRTL } from '@/utils/locals';
// hooks
import { useModalAction } from '@/components/ui/modal/modal.context';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  enrollmentsWithMonths: EnrollmentWithMonth[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const EnrollmentMonthList = ({
  enrollmentsWithMonths,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();
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

  const MONTHS = [
    { key: 'jan', label: 'Jan', number: 1 },
    { key: 'feb', label: 'Feb', number: 2 },
    { key: 'mar', label: 'Mar', number: 3 },
    { key: 'apr', label: 'Apr', number: 4 },
    { key: 'may', label: 'May', number: 5 },
    { key: 'jun', label: 'Jun', number: 6 },
    { key: 'jul', label: 'Jul', number: 7 },
    { key: 'aug', label: 'Aug', number: 8 },
    { key: 'sep', label: 'Sep', number: 9 },
    { key: 'oct', label: 'Oct', number: 10 },
    { key: 'nov', label: 'Nov', number: 11 },
    { key: 'dec', label: 'Dec', number: 12 },
  ];

  const handleMonthClick = (
    month: number,
    courseOfferingId: string,
    studentId: string,
  ) => {
    openModal('ENROLLMENT_PAYMENT_VIEW', {
      month,
      courseOfferingId,
      studentId,
    });
  };

  const monthColumns = MONTHS.map((m) => ({
    title: m.label,
    dataIndex: ['months', m.key],
    key: m.key,
    align: 'center' as const,
    width: 90,
    render: (_month: MonthData, record: EnrollmentWithMonth) => (
      <span>
        {_month?.paid ? (
          '✔️'
        ) : (
          <button
            onClick={() =>
              handleMonthClick(
                m.number,
                record.course_offering.id,
                record.student.id,
              )
            }
            className="text-gray-500 hover:text-blue-600"
          >
            _
          </button>
        )}
      </span>
    ),
  }));

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
          <Avatar
            name={student?.user.first_name}
            src={profile?.avatar?.thumbnail}
          />
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
      title: t('table:table-item-course'),
      dataIndex: 'course_offering',
      key: 'course_offering',
      align: alignLeft,
      width: 120,
      render: (courseOffering: CourseOffering) => (
        <div
          className="flex flex-col whitespace-nowrap font-medium ms-2"
          title={courseOffering?.course?.name}
        >
          {courseOffering?.course?.name} - B{courseOffering?.batch}
          <span className="text-[13px] font-normal text-gray-500/80">
            G{courseOffering?.grade_level.level}
          </span>
        </div>
      ),
    },

    // 🔹 12 MONTH COLUMNS HERE
    ...monthColumns,

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
          deleteModalView="DELETE_ENROLLMENT"
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
          data={enrollmentsWithMonths}
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

export default EnrollmentMonthList;
