import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { useTeachersQuery } from '@/data/teacher';

export default function SelectTeacher({
  control,
  errors,
  disabled,
}: {
  control: Control<any>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { teachers, paginatorInfo, loading, error } = useTeachersQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <SelectInput
        name="teacher"
        control={control}
        label={t('form:input-label-teacher')}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name}`
        }
        getOptionValue={(option: any) => option.id}
        options={teachers!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.teacher?.message)} />
    </div>
  );
}
