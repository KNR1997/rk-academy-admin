import dayjs from 'dayjs';
import { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
// utils
import usePrice from '@/utils/use-price';
import { useIsRTL } from '@/utils/locals';
// types
import { Enrollment, Invoice, SortOrder } from '@/types';
import { MappedPaginatorInfo } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import StatusColor from '@/components/invoice/status-color';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import ActionButtons from '@/components/common/action-buttons';

export type IProps = {
  invoices: Invoice[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};
const InvoiceList = ({
  invoices,
  paginatorInfo,
  onPagination,
  onOrdering,
}: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
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
      title: t('table:table-item-invoice-number'),
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      align: alignLeft,
      width: 200,
    },
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
      dataIndex: 'enrollment',
      key: 'enrollment',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('enrollment'),
      render: (
        enrollment: Enrollment,
        { profile, email }: { profile: any; email: string },
      ) => (
        <div className="flex items-center">
          {/* <Avatar name={email} src={profile?.avatar?.thumbnail} /> */}
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
    // {
    //   title: t('table:table-item-issue-date'),
    //   dataIndex: 'issue_date',
    //   key: 'issue_date',
    //   align: 'center',
    // },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-total')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'total'
          }
          isActive={sortingObj?.column === 'total'}
          className="cursor-pointer"
        />
      ),
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'center',
      width: 120,
      onHeaderCell: () => onHeaderClick('total'),
      render: function Render(value: any) {
        const { price } = usePrice({
          amount: Number(value),
        });
        return <span className="whitespace-nowrap">{price}</span>;
      },
    },
    {
      title: t('table:table-item-status'),
      width: 150,
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <Badge
          text={t(status)}
          color={StatusColor(status)}
          className="capitalize"
        />
      ),
    },
    {
      // title: t("table:table-item-date"),
      title: (
        <TitleWithSort
          title={t('table:table-item-created-at')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
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
      // render: (date: string) => {
      //   dayjs.extend(utc);
      //   dayjs.extend(timezone);
      //   return (
      //     <span className="whitespace-nowrap">
      //       {dayjs.utc(date).tz(dayjs.tz.guess()).format('YYYY-MM-DD HH:mm:ss')}
      //     </span>
      //   );
      // },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, order: Invoice) => {
        return (
          <>
            <ActionButtons id={id} detailsUrl={`${router.asPath}/${id}`} />
          </>
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
          data={invoices}
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

export default InvoiceList;
