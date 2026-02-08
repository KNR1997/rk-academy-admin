import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { Teacher } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { teacherValidationSchema } from './teacher-validation-schema';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { animateScroll } from 'react-scroll';
import PhoneNumberInput from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/password-input';
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from '@/data/teacher';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
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

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

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

    const mutationOptions = { onError: handleMutationError };

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
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:student-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
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
              // <Input
              //   label={t('form:input-label-password')}
              //   type="password"
              //   // value={passwordSuggest}
              //   {...register('password')}
              //   error={t(errors.password?.message!)}
              //   variant="outline"
              //   className="mb-5"
              //   required
              // />
            )}
            <Input
              label={t('form:input-label-department')}
              {...register('department')}
              error={t(errors.department?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
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
