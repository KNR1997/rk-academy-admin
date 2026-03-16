import { QueryClient } from 'react-query';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// data
import { studentClient } from '@/data/client/student';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
// components
import AsyncSelectInput from '@/components/ui/async-select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectStudent({
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
      [API_ENDPOINTS.STUDENTS, { text: inputValue, page: 1 }],
      () =>
        studentClient.paginated({
          name: inputValue,
        }),
    );

    return data?.data;
  }

  return (
    <div className="mb-5">
      <AsyncSelectInput
        name="student"
        control={control}
        label={t('form:input-label-student')}
        loadOptions={fetchAsyncOptions}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name} - ${option.current_grade.name}`
        }
        getOptionValue={(option: any) => option.id}
        disabled={disabled}
        required
      />

      <ValidationError message={t(errors.student?.message)} />
    </div>
  );
}
