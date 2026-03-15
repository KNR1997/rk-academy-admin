import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// form-validations
import { customerValidationSchema } from './user-validation-schema';
// hooks
import { useRegisterMutation } from '@/data/user';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// config
import { Routes } from '@/config/routes';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import PasswordInput from '@/components/ui/password-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  name: string;
  email: string;
  password: string;
  // permission: Permission;
};

const defaultValues = {
  email: '',
  password: '',
};

const CustomerCreateForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // mutations
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  async function onSubmit({ name, email, password }: FormValues) {
    registerUser(
      {
        name,
        email,
        password,
        // permission: Permission.StoreOwner,
      },
      {
        onError: (error: any) => {
          handleMutationError(error, setError, setErrorMessage);
        },
        onSuccess: (data) => {
          if (data) {
            router.push(Routes.user.list);
          }
        },
      },
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title={t('form:form-title-information')}
            details={t('form:customer-form-info-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-4"
              error={t(errors.email?.message!)}
              required
            />
            <PasswordInput
              label={t('form:input-label-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-4"
              required
            />
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
          <div className="mb-4 text-end">
            <Button loading={loading} disabled={loading}>
              {t('form:button-label-create-customer')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
};

export default CustomerCreateForm;
