import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// components
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectExamYear({
  control,
  errors,
}: {
  control: Control<any>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();

  // Generate 10 years starting from current year
  const generateExamYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      years.push({
        label: year.toString(),
        value: year,
      });
    }

    return years;
  };

  const examYearOptions = generateExamYearOptions();

  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-exam-year')}
        name="exam_year"
        control={control}
        options={examYearOptions}
        required
      />
      <ValidationError message={t(errors.grade_level?.message)} />
    </div>
  );
}
