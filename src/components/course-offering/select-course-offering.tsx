import { QueryClient } from 'react-query';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// data
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { courseOfferingClient } from '@/data/client/course-offering';
// types
import { CourseOffering } from '@/types';
// components
import AsyncSelectInput from '@/components/ui/async-select-input';
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
  const { t } = useTranslation();

  async function fetchAsyncOptions(inputValue: string) {
    const queryClient = new QueryClient();
    const data = await queryClient.fetchQuery(
      [API_ENDPOINTS.COURSE_OFFERING, { text: inputValue, page: 1 }],
      () =>
        courseOfferingClient.paginated({
          name: inputValue,
        }),
    );

    return data?.data;
  }

  return (
    <div className="mb-5">
      <AsyncSelectInput
        name="course_offering"
        control={control}
        label={t('form:input-label-course-offering')}
        loadOptions={fetchAsyncOptions}
        getOptionLabel={(option: CourseOffering) =>
          `${option.course.name} ${option.year} - Batch ${option.batch}`
        }
        getOptionValue={(option: CourseOffering) => option.id}
        disabled={disabled}
        required
      />
      <ValidationError message={t(errors.course_offering?.message)} />
    </div>
  );
}
