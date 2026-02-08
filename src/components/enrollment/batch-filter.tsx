import Select from '@/components/ui/select/select';
import React from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { ActionMeta } from 'react-select';

type Props = {
  onBatchFilter: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
};

export default function BatchFilter({ onBatchFilter, className }: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const batchOptions = [
    {
      label: 'Batch 1',
      value: '1',
    },
    {
      label: 'Batch 2',
      value: '2',
    },
  ];

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <Select
          options={batchOptions}
          placeholder={t('common:filter-by-batch-placeholder')}
          onChange={onBatchFilter}
          isClearable={true}
        />
      </div>
    </div>
  );
}
