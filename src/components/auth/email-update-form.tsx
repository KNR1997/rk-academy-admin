import pick from 'lodash/pick';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import { useUpdateUserEmailMutation } from '@/data/user';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';

type FormValues = {
  email: string;
};

export default function EmailUpdateForm({ me }: any) {
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // mutations
  const { mutate: updateEmail, isLoading: loading } =
    useUpdateUserEmailMutation();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ...(me && pick(me, ['email'])),
    },
  });

  async function onSubmit(values: FormValues) {
    const { email } = values;
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    updateEmail(
      {
        email: email,
      },
      mutationOptions,
    );
  }

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('common:text-email')}
            details={t('form:email-change-helper-text')}
            className="sm:pe-4 md:pe-5 w-full px-0 pb-5 sm:w-4/12 sm:py-8 md:w-1/3"
          />

          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              error={t(errors.email?.message!)}
              variant="outline"
              className="mb-5"
            />
          </Card>

          <div className="text-end w-full">
            <Button loading={loading} disabled={loading}>
              {t('form:button-label-save')}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
