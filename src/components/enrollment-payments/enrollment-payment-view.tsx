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
import { useModalState } from '@/components/ui/modal/modal.context';
import { useCreateEnrollmentPaymentMutation } from '@/data/enrollment-payment';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import SelectInput from '@/components/ui/select-input';

type ModalData = {
  month: number;
  courseOfferingId: string;
  fee: number;
  studentId: string;
  enrollmentId: string;
  alreadyPaidMonthNumbers: number[]; // Array of month numbers that are already paid
};

type FormValues = {
  payment_months: { label: string; value: number }[];
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data } = useModalState();
  const { mutate: createEnrollmentPayment, isLoading } =
    useCreateEnrollmentPaymentMutation();

  // Type assertion for data
  const modalData = data as ModalData;

  // Filter out already paid months from options
  const availableMonthOptions = useMemo(() => {
    if (!modalData?.alreadyPaidMonthNumbers) {
      return monthOptions;
    }

    return monthOptions.filter(
      (option) => !modalData.alreadyPaidMonthNumbers.includes(option.value),
    );
  }, [modalData?.alreadyPaidMonthNumbers]);

  const {
    control,
    handleSubmit,
    setError,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: data
      ? {
          payment_months: [
            monthOptions.find((option) => option.value == data.month),
          ],
          amount: data.fee,
        }
      : {
          payment_months: [],
          amount: 0,
        },
    //@ts-ignore
    resolver: yupResolver(addPointsValidationSchema),
  });

  const selectedMonths = useWatch({
    control,
    name: 'payment_months',
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calculate fee for a single month
  const calculateMonthFee = (month: number, baseFee: number) => {
    if (month >= currentMonth) {
      return { amount: baseFee, reason: 'Current/upcoming month - full fee' };
    } else {
      return { amount: baseFee - 500, reason: 'Past month - discount applied' };
    }
  };

  // Calculate total and breakdown
  const calculatePaymentDetails = (
    months: { label: string; value: number }[],
    baseFee: number,
  ) => {
    if (!months || months.length === 0) {
      return { total: 0, breakdown: [], discount: 0 };
    }

    let total = 0;
    const breakdown = months.map((month) => {
      const monthInfo = monthOptions.find((m) => m.value === month.value);
      const { amount, reason } = calculateMonthFee(month.value, baseFee);
      total += amount;

      return {
        month: month,
        monthName: monthInfo?.label,
        amount: amount,
        originalFee: baseFee,
        discount: month.value < currentMonth ? 500 : 0,
        reason: reason,
      };
    });

    const totalDiscount = breakdown.reduce(
      (sum, item) => sum + item.discount,
      0,
    );

    return { total, breakdown, totalDiscount };
  };

  const {
    total: totalFee,
    breakdown,
    totalDiscount,
  } = calculatePaymentDetails(selectedMonths || [], data?.fee || 0);

  useEffect(() => {
    setValue('amount', totalFee);
  }, [totalFee, setValue]);

  function onSubmit({ payment_months, amount }: FormValues) {
    const payments = payment_months.map((month) => {
      const { amount: monthAmount } = calculateMonthFee(month.value, data.fee);

      return {
        description: `${month.label} ${currentYear} Tuition`,
        billing_month: month.value,
        billing_year: currentYear,
        amount: monthAmount,
        // payment_month: month.value,
        // payment_year: currentYear,
      };
    });

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
  
    const input = {
      student: data.studentId,
      enrollment_id: data.enrollmentId,
      issue_date: formattedDate,
      due_date: formattedDate,
      charges: payments,
      // payments: payments,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    createEnrollmentPayment(input, mutationOptions);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-auto flex w-full max-w-sm flex-col rounded bg-light p-5 sm:w-[24rem]">
          <div className="mb-4">
            <SelectInput
              control={control}
              label="Payment Months"
              name="payment_months"
              placeholder="Select months"
              isMulti={true}
              options={availableMonthOptions}
              isClearable={true}
            />
          </div>

          {selectedMonths && selectedMonths.length > 0 && (
            <div className="mb-4 rounded-md bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">
                Payment Calculation:
              </h3>

              {/* Breakdown table */}
              <div className="mb-3 space-y-2">
                {breakdown.map((item) => (
                  <div
                    key={item.month.value}
                    className="border-b border-gray-200 pb-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {item.monthName}
                      </span>
                      <span className="text-gray-900">${item.amount}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {item.reason}
                      {item.discount > 0 && (
                        <span className="text-green-600">
                          {' '}
                          (Saved ${item.discount})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {totalDiscount && totalDiscount > 0 && (
                <div className="mb-2 flex justify-between text-sm text-green-600">
                  <span>Total savings:</span>
                  <span>-${totalDiscount}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-300 pt-2 font-bold">
                <span>Total to pay:</span>
                <span className="text-lg text-primary">${totalFee}</span>
              </div>

              {/* Info note */}
              <div className="mt-3 text-xs text-gray-500">
                <p>* Current & upcoming months: Full fee (${data?.fee})</p>
                <p>
                  * Past months: ${data?.fee - 500} (${500} discount)
                </p>
              </div>
            </div>
          )}

          <Input
            label={t('form:input-label-enrollment-payment-fee')}
            {...register('amount')}
            value={totalFee}
            variant="outline"
            className="mb-4"
            disabled
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
            loading={isLoading}
            disabled={isLoading || selectedMonths?.length === 0}
            className="ms-auto"
          >
            {t('form:button-label-submit')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default EnrollmentPaymentView;
