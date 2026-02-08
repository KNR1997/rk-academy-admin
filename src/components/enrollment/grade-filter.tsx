import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { ActionMeta } from 'react-select';
import { useGradeLevelsQuery } from '@/data/grade-level';
import { GradeLevel } from '@/types';

type Props = {
  onGradeFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function GradeFilter({ onGradeFilter, className }: Props) {
  const { t } = useTranslation();
  const { gradeLevels } = useGradeLevelsQuery({});

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={gradeLevels}
          //@ts-ignore
          getOptionLabel={(option: GradeLevel) => option.name}
          //@ts-ignore
          getOptionValue={(option: GradeLevel) => option.name}
          placeholder={t('common:filter-by-grade-placeholder')}
          onChange={onGradeFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
