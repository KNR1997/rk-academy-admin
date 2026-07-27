import dayjs from 'dayjs';
import { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
// utils
import usePrice from '@/utils/use-price';
import { useIsRTL } from '@/utils/locals';
import { getMonthNameFromArray } from '@/utils/get-month-name';
// types
import { SortOrder } from '@/types';
import { EnrollmentCharge, MappedPaginatorInfo } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination';
import { NoDataFound } from '@/components/icons/no-data-found';

export type IProps = {
  enrollmentCharges: EnrollmentCharge[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};

const EnrollmentChargesList = ({
  enrollmentCharges,
  paginatorInfo,
  onPagination,
  onOrdering,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
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
      title: t('table:table-item-month'),
      dataIndex: 'billing_month',
      key: 'billing_month',
      align: alignLeft,
      width: 120,
      render: (billing_month: number) => {
        const monthName = getMonthNameFromArray(billing_month);
        return (
          <div className="overflow-hidden truncate whitespace-nowrap">
            {monthName}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: alignLeft,
      width: 150,
      render: function Render(value: number, record: EnrollmentCharge) {
        const { price } = usePrice({
          amount: Number(value),
        });
        return (
          <span className="whitespace-nowrap" title={price}>
            {price}
          </span>
        );
      },
    },
    {
      title: 'Payment Date',
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
            {dayjs.utc(date).tz(dayjs.tz.guess()).format('MMM D, YYYY')}
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

export default EnrollmentChargesList;
