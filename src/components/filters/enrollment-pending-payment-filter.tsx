import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { ActionMeta } from 'react-select';

type Props = {
  onYearFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onMonthFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  type?: string;
  enableYear?: boolean;
  enableMonth?: boolean;
};

export default function EnrollmentPendingPaymentFilter({
  onYearFilter,
  onMonthFilter,
  className,
  type,
  enableYear,
  enableMonth,
}: Props) {
  const { t } = useTranslation();

const currentYear = new Date().getFullYear();

const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - i;

  return {
    value: year,
    label: year.toString(),
  };
});

const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const monthNumber = i + 1;

  return {
    value: monthNumber,
    label: t(`common:months.${monthNumber}`),
  };
});

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enableYear ? (
        <div className="w-full">
          <Label>{t('common:filter-by-year')}</Label>
          <Select
            options={yearOptions}
            placeholder={t('common:filter-by-year-placeholder')}
            onChange={onYearFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

      {enableMonth ? (
        <div className="w-full">
          <Label>{t('common:filter-by-month')}</Label>
          <Select
            options={monthOptions}
            placeholder={t('common:filter-by-month-placeholder')}
            onChange={onMonthFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
