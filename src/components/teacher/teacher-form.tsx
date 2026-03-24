import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { Teacher } from '@/types';
// form-validations
import { teacherValidationSchema } from './teacher-validation-schema';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from '@/data/teacher';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import PhoneNumberInput from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/password-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  department: string;
  mobile_number: string;
};

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  department: '',
};

type IProps = {
  initialValues?: Teacher | undefined;
};
export default function CreateOrUpdateTeacherForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    watch,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues.user,
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(teacherValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { mutate: createTeacher, isLoading: creating } =
    useCreateTeacherMutation();
  const { mutate: updateTeacher, isLoading: updating } =
    useUpdateTeacherMutation();

  const passwordSuggest = watch('mobile_number');

  const onSubmit = async (values: FormValues) => {
    const input = {
      username: values.username,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      department: values.department,
      mobile_number: values.mobile_number,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createTeacher(input, mutationOptions);
    } else {
      updateTeacher(
        {
          ...input,
          id: initialValues.id!,
        },
        mutationOptions,
      );
    }
  };

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
        <div className="my-5 sm:my-8">
          <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('form:input-label-first-name')}
                {...register('first_name')}
                error={t(errors.first_name?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
              <Input
                label={t('form:input-label-last-name')}
                {...register('last_name')}
                error={t(errors.last_name?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
              <Input
                label={t('form:input-label-email')}
                {...register('email')}
                error={t(errors.email?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
              <Input
                label={t('form:input-label-username')}
                {...register('username')}
                error={t(errors.username?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
              <PhoneNumberInput
                label={t('form:input-label-contact')}
                {...register('mobile_number')}
                control={control}
                error={t(errors.mobile_number?.message!)}
                required
              />
              {!initialValues && (
                <PasswordInput
                  label={t('form:input-label-password')}
                  {...register('password')}
                  error={t(errors?.password?.message!)}
                  variant="outline"
                  className="mb-4"
                  required
                />
              )}
              <Input
                label={t('form:input-label-department')}
                {...register('department')}
                error={t(errors.department?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
            </div>
          </Card>
        </div>

        <StickyFooterPanel className="z-0">
          <div className="text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="text-sm me-4 md:text-base"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}

            <Button
              loading={creating || updating}
              disabled={creating || updating}
              className="text-sm md:text-base"
            >
              {initialValues
                ? t('form:button-label-update-teacher')
                : t('form:button-label-add-teacher')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
