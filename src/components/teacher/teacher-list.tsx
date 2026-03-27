import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// utils
import { useIsRTL } from '@/utils/locals';
// config
import { Routes } from '@/config/routes';
// types
import { MappedPaginatorInfo } from '@/types';
import { SortOrder, Teacher, User } from '@/types';
// components
import { Table } from '@/components/ui/table';
import Avatar from '@/components/common/avatar';
import Badge from '@/components/ui/badge/badge';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import ActionButtons from '@/components/common/action-buttons';

export type IProps = {
  teachers: Teacher[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};
const TeacherList = ({
  teachers,
  paginatorInfo,
  onPagination,
  onOrdering,
}: IProps) => {
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

  const onHeaderClick = (column: any | null) => ({
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
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'user__first_name'
          }
          isActive={sortingObj.column === 'user__first_name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'teacher_number',
      key: 'teacher_number',
      align: alignLeft,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('user__first_name'),
      render: (
        teacher_number: string,
        { profile, email, user }: { profile: any; email: string; user: User },
      ) => (
        <div className="flex items-center">
          <Avatar
            name={`${user.first_name} ${user.last_name}`}
            src={profile?.avatar?.thumbnail}
          />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {user.first_name} {user.last_name}
            <span className="text-[13px] font-normal text-gray-500/80">
              {user?.email}
            </span>
          </div>
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
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (
        <Badge
          textKey={is_active ? 'common:text-active' : 'common:text-inactive'}
          color={
            is_active
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
      render: (id: string, record: Teacher) => (
        <ActionButtons
          id={id}
          editUrl={Routes?.teacher.editByIdWithoutLang(record.id)}
          deleteModalView="DELETE_TEACHER"
          deleteBySlug={record.id}
          resetTeacherPasswordButton={true}
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
          data={teachers}
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

export default TeacherList;
