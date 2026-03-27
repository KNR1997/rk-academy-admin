import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// data
import { useResetTeacherPasswordMutation } from '@/data/user';
// utils
import { generatePassword } from '@/utils/generate-password';
// components
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/password-input';

type FormValues = {
  password: string;
};
const defaultValues = {
  password: generatePassword(),
};
const validationSchema = yup.object().shape({
  password: yup.string().required('form:error-password-required'),
});
const ResetTeacherPasswordView = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: defaultValues,
    //@ts-ignore
    resolver: yupResolver(validationSchema),
  });

  const { mutate: resetTeacherPassword, isLoading: loading } =
    useResetTeacherPasswordMutation();
  const { data } = useModalState();

  const { closeModal } = useModalAction();

  async function onSubmit({ password }: FormValues) {
    resetTeacherPassword({
      teacher_id: data,
      password: password,
    });
    closeModal();
  }

  const methods = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
    context: { isEditMode: false },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
        <PasswordInput
          label={t('form:input-label-password')}
          {...register('password')}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
          required
        />
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="ms-auto"
        >
          {t('form:button-label-submit')}
        </Button>
      </div>
    </form>
  );
};

export default ResetTeacherPasswordView;
