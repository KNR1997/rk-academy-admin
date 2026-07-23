import cn from 'classnames';
import { ActionMeta } from 'react-select';
// utils
import { getMonthNameFromArray } from '@/utils/get-month-name';
// components
import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';

type Props = {
  onLessonFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onDayFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onMonthFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  className?: string;
  type?: string;
  enableMonthFilter?: boolean;
  enableLessonFilter?: boolean;
  enableDayFilter?: boolean;
};

export default function VideoFilter({
  onLessonFilter,
  onDayFilter,
  onMonthFilter,
  className,
  enableMonthFilter,
  enableLessonFilter,
  enableDayFilter,
}: Props) {
  // Generate number options
  const generateNumberOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => ({
      label: String(i + 1),
      value: i + 1,
    }));
  };

  // Generate month options using your utility
  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      label: getMonthNameFromArray(i + 1),
      value: i + 1,
    }));
  };

  const lessonOptions = generateNumberOptions(15);
  const dayOptions = generateNumberOptions(30);
  const monthOptions = generateMonthOptions();

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
      {enableMonthFilter && (
        <div className="w-full">
          <Label>Filter By Month</Label>
          <Select
            options={monthOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder="Filter by Month"
            onChange={onMonthFilter}
            isClearable={true}
          />
        </div>
      )}

      {enableLessonFilter && (
        <div className="w-full">
          <Label>Filter By Lesson</Label>
          <Select
            options={lessonOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder="Filter By Lesson"
            onChange={onLessonFilter}
            isClearable={true}
          />
        </div>
      )}

      {enableDayFilter && (
        <div className="w-full">
          <Label>Filter by Day</Label>
          <Select
            options={dayOptions}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            placeholder="Filter by Day"
            onChange={onDayFilter}
            isClearable={true}
          />
        </div>
      )}
    </div>
  );
}