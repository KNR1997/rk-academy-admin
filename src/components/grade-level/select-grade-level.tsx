import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// hooks
import { useGradeLevelsQuery } from '@/data/grade-level';
// components
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectGradeLevel({
  control,
  errors,
}: {
  control: Control<any>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { gradeLevels, loading } = useGradeLevelsQuery({ language: locale });
  return (
    <div>
      <SelectInput
        label={t('form:input-label-grade-level')}
        name="grade_level"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={gradeLevels!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.grade_level?.message)} />
    </div>
  );
}
