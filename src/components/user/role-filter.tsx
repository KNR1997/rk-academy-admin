import React from 'react';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import { useTranslation } from 'next-i18next';
// constants
import { roleOptions } from '@/constants';
// components
import Select from '@/components/ui/select/select';

type Props = {
  onRoleFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function RoleFilter({ onRoleFilter, className }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={roleOptions}
          //@ts-ignore
          getOptionLabel={(option: any) => option.label}
          //@ts-ignore
          getOptionValue={(option: any) => option.value}
          placeholder={t('common:filter-by-grade-placeholder')}
          onChange={onRoleFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
