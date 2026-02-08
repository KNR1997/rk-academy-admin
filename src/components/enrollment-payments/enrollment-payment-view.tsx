import Button from '@/components/ui/button';
import { useModalState } from '@/components/ui/modal/modal.context';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useCreateEnrollmentPaymentMutation } from '@/data/enrollment-payment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type FormValues = {
  payment_month: number;
  amount: number;
};
const addPointsValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('amount must be a number')
    .positive('amount must be positive')
    .required('You must need to set amount'),
});
const EnrollmentPaymentView = () => {
  const { t } = useTranslation();
  const { data } = useModalState();
  const { mutate: createEnrollmentPayment, isLoading } =
    useCreateEnrollmentPaymentMutation();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: data
      ? {
          payment_month: data.month,
        }
      : '',
    //@ts-ignore
    resolver: yupResolver(addPointsValidationSchema),
  });

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
  };

  function onSubmit({ amount }: FormValues) {
    const currentYear = new Date().getFullYear();

    const input = {
      student: data.studentId,
      course_offering: data.courseOfferingId,
      amount: amount,
      payment_month: data.month,
      payment_year: currentYear,
    };
    const mutationOptions = { onError: handleMutationError };

    createEnrollmentPayment(input, mutationOptions);
    // closeModal();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
        <Input
          label="Payment Month"
          {...register('payment_month')}
          value={data.month}
          variant="outline"
          className="mb-4"
          disabled
          error={t(errors.payment_month?.message!)}
        />
        <Input
          label={t('form:input-label-enrollment-payment-fee')}
          {...register('amount')}
          // defaultValue="10"
          variant="outline"
          className="mb-4"
          error={t(errors.amount?.message!)}
        />
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="ms-auto"
        >
          {t('form:button-label-submit')}
        </Button>
      </div>
    </form>
  );
};

export default EnrollmentPaymentView;
