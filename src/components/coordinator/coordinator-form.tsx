import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { Coordinator } from '@/types';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// validation schema
import { coordinatorValidationSchema } from './coordinator-validation-schema';
// hooks
import {
  useCreateCoordinatorMutation,
  useUpdateCoordinatorMutation,
} from '@/data/coordinator';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import FooterPanel from '@/components/ui/footer-panel';
import PhoneNumberInput from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/password-input';

type FormValues = {
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  password: string;
  mobile_number: string;
};

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

type IProps = {
  initialValues?: Coordinator | undefined;
};

const CoordinatorCreateForm = ({ initialValues }: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(coordinatorValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  // mutation
  const { mutate: createCoordinator, isLoading: creating } =
    useCreateCoordinatorMutation();
  const { mutate: updateCoordinator, isLoading: updating } =
    useUpdateCoordinatorMutation();

  async function onSubmit(value: FormValues) {
    const input = {
      first_name: value.first_name,
      last_name: value.last_name,
      display_name: value.display_name,
      email: value.email,
      password: value.password,
      mobile_number: value.mobile_number,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createCoordinator(input, mutationOptions);
    } else {
      updateCoordinator(
        {
          ...input,
          id: initialValues.id!,
        },
        mutationOptions,
      );
    }
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 sm:my-8">
          <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('form:input-label-email')}
                {...register('email')}
                type="email"
                variant="outline"
                error={t(errors.email?.message!)}
                required
              />

              {!initialValues && (
                <PasswordInput
                  label={t('form:input-label-password')}
                  {...register('password')}
                  error={t(errors.password?.message!)}
                  variant="outline"
                  required
                />
              )}

              <Input
                label={t('form:input-label-first-name')}
                {...register('first_name')}
                type="text"
                variant="outline"
                error={t(errors.first_name?.message!)}
                required
              />

              <Input
                label={t('form:input-label-last-name')}
                {...register('last_name')}
                type="text"
                variant="outline"
                error={t(errors.last_name?.message!)}
                required
              />

              <Input
                label={t('form:input-label-display-name')}
                {...register('display_name')}
                type="text"
                variant="outline"
                error={t(errors.display_name?.message!)}
                required
              />

              <PhoneNumberInput
                label={t('form:input-label-contact')}
                {...register('mobile_number')}
                control={control}
                error={t(errors.mobile_number?.message!)}
              />
            </div>
          </Card>
        </div>
        <FooterPanel className="z-0">
          <div className="mb-4 text-end">
            <Button
              loading={creating || updating}
              disabled={creating || updating}
            >
              {initialValues
                ? t('form:button-label-update-coordinator')
                : t('form:button-label-create-coordinator')}
            </Button>
          </div>
        </FooterPanel>
      </form>
    </>
  );
};

export default CoordinatorCreateForm;
