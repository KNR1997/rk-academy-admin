import { Control, FieldErrors } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import { useGradeLevelsQuery } from '@/data/grade-level';
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
    <div className="mb-5">
      <Label>{t('form:input-label-grade-level')}</Label>
      <SelectInput
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
