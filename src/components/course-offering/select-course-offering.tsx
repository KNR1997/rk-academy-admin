import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// hooks
import { useCourseOfferingsQuery } from '@/data/course-offering';
// components
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectCourseOffering({
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
  const { courseOfferings, loading } = useCourseOfferingsQuery({
    language: locale,
  });
  return (
    <div className="mb-5">
      <SelectInput
        name="course_offering"
        control={control}
        label={t('form:input-label-course-offering')}
        // @ts-ignore
        getOptionLabel={(option: CourseOffering) =>
          `${option.course.name} ${option.year} - Batch ${option.batch}`
        }
        // @ts-ignore
        getOptionValue={(option: CourseOffering) => option.id}
        options={courseOfferings!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.course_offering?.message)} />
    </div>
  );
}
