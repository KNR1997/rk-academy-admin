import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
// constants
import { monthOptions } from '@/constants';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import { useCreatePaymentMutation } from '@/data/payment';
import { useModalState } from '@/components/ui/modal/modal.context';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import SelectInput from '@/components/ui/select-input';

type ModalData = {
  invoiceId: string;
  amount: number;
};

type FormValues = {
  payment_method: { label: string; value: string };
  amount: number;
};

const addPointsValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('amount must be a number')
    .positive('amount must be positive')
    .required('You must need to set amount'),
});

const PaymentView = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data } = useModalState();
  const { mutate: createPayment, isLoading: creatingPayment } =
    useCreatePaymentMutation();

  // Type assertion for data
  const modalData = data as ModalData;

  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: {
      payment_method: {
        label: 'Cash',
        value: 'cash',
      },
      amount: modalData.amount,
    },
    //@ts-ignore
    resolver: yupResolver(addPointsValidationSchema),
  });

  function onSubmit({ payment_method, amount }: FormValues) {
    const input = {
      invoice_id: modalData.invoiceId,
      payment_method: payment_method.value,
      amount: amount,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    createPayment(input, mutationOptions);
  }

  const paymentMethodOptions = [
    {
      label: 'Cash',
      value: 'cash',
    },
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <div className="mb-4">
            <SelectInput
              control={control}
              label="Payment Method"
              name="payment_method"
              placeholder="Select months"
              options={paymentMethodOptions}
              isClearable={true}
            />
          </div>
          <Input
            label={t('form:input-label-enrollment-payment-fee')}
            {...register('amount')}
            variant="outline"
            className="mb-4"
            error={t(errors.amount?.message!)}
          />
          {errorMessage ? (
            <Alert
              message={t(`common:${errorMessage}`)}
              variant="error"
              closeable={true}
              className="flex mb-2"
              onClose={() => setErrorMessage(null)}
            />
          ) : null}
          <Button
            type="submit"
            loading={creatingPayment}
            disabled={creatingPayment}
            className="ms-auto"
          >
            {t('form:button-label-submit')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PaymentView;
