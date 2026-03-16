import { QueryClient } from 'react-query';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// data
import { teacherClient } from '@/data/client/teacher';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
// types
import { Teacher } from '@/types';
// components
import AsyncSelectInput from '@/components/ui/async-select-input';
import ValidationError from '@/components/ui/form-validation-error';

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

  async function fetchAsyncOptions(inputValue: string) {
    const queryClient = new QueryClient();
    const data = await queryClient.fetchQuery(
      [API_ENDPOINTS.TEACHERS, { text: inputValue, page: 1 }],
      () =>
        teacherClient.paginated({
          name: inputValue,
        }),
    );

    return data?.data;
  }

  return (
    <div className="mb-5">
      <AsyncSelectInput
        name="teacher"
        control={control}
        label={t('form:input-label-teacher')}
        loadOptions={fetchAsyncOptions}
        getOptionLabel={(option: Teacher) =>
          `${option.user.first_name} ${option.user.last_name}`
        }
        getOptionValue={(option: Teacher) => option.id}
        disabled={disabled}
        required
      />
      <ValidationError message={t(errors.teacher?.message)} />
    </div>
  );
}
