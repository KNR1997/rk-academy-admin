import { Control, FieldErrors, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCoursesQuery } from '@/data/course';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectCourse({
  control,
  errors,
  disabled,
}: {
  control: Control<any>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { courses, loading } = useCoursesQuery({ language: locale });
  return (
    <div className="mb-5">
      <SelectInput
        name="course"
        control={control}
        label={t('form:input-label-courses')}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        options={courses!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.course?.message)} />
    </div>
  );
}
