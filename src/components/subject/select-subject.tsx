import { QueryClient } from 'react-query';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors } from 'react-hook-form';
// data
import { subjectClient } from '@/data/client/subject';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
// types
import { Subject } from '@/types';
// components
import AsyncSelectInput from '@/components/ui/async-select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectSubject({
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
      [API_ENDPOINTS.SUBJECTS, { text: inputValue, page: 1 }],
      () =>
        subjectClient.paginated({
          name: inputValue,
        }),
    );

    return data?.data;
  }

  return (
    <div className="mb-5">
      <AsyncSelectInput
        name="subject"
        control={control}
        label={t('form:input-label-subjects')}
        loadOptions={fetchAsyncOptions}
        getOptionLabel={(option: Subject) => option.name}
        getOptionValue={(option: Subject) => option.slug}
        disabled={disabled}
        required
      />

      <ValidationError message={t(errors.subject?.message)} />
    </div>
  );
}
