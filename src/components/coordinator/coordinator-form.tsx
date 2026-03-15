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
import Description from '@/components/ui/description';
import PhoneNumberInput from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/password-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

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
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:form-title-information')}
            details={t('form:coordinator-form-info-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors.email?.message!)}
              required
            />
            {!initialValues && (
              <PasswordInput
                label={t('form:input-label-password')}
                {...register('password')}
                error={t(errors.password?.message!)}
                variant="outline"
                className="mb-4"
                required
              />
            )}
            <Input
              label={t('form:input-label-first-name')}
              {...register('first_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.first_name?.message!)}
            />
            <Input
              label={t('form:input-label-last-name')}
              {...register('last_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.last_name?.message!)}
            />
            <Input
              label={t('form:input-label-display-name')}
              {...register('display_name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.display_name?.message!)}
            />
            <PhoneNumberInput
              label={t('form:input-label-contact')}
              {...register('mobile_number')}
              control={control}
              error={t(errors.mobile_number?.message!)}
            />
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
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
        </StickyFooterPanel>
      </form>
    </>
  );
};

export default CoordinatorCreateForm;
