import { useSetAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
// types
import { Enrollment, Student } from '@/types';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// constants
import { monthOptions } from '@/constants';
// stores
import { clearEnrollmentFlowAtom } from '@/store/enrollment.store';
// hooks
import { useStudentEnrollmentsQuery } from '@/data/student';
import { useCreateEnrollmentPaymentMutation } from '@/data/enrollment-payment';
// form-validations
import { enrollmentPaymentValidationSchema } from './enrollment-payment-validation-schema';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import SelectInput from '@/components/ui/select-input';
import SelectStudent from '@/components/student/select-student';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';

function SelectCourse({
  control,
  errors,
  studentId,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  studentId: string;
}) {
  const { t } = useTranslation();
  const { enrollments, loading } = useStudentEnrollmentsQuery({
    studentId: studentId,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-enrollments')}
        name="enrollment"
        control={control}
        //@ts-ignore
        getOptionLabel={(enrollment: Enrollment) =>
          `${enrollment?.course_offering?.course?.name} - ${enrollment?.course_offering?.grade_level?.name} - Batch ${enrollment?.course_offering?.batch} `
        }
        //@ts-ignore
        getOptionValue={(enrollment: Enrollment) => enrollment.id}
        options={enrollments!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.enrollment?.message)} />
    </div>
  );
}

interface PaymentItem {
  payment_month: { label: string; value: number } | null;
  fee: number | null;
}

type FormValues = {
  student: Student;
  enrollment: Enrollment | null;
  payments: PaymentItem[];
};

const defaultValues = {
  payments: [
    {
      payment_month: null,
      fee: null,
    },
  ],
};

type IProps = {
  initialValues?: {
    id?: string | null;
    student?: Student | null;
    enrollment?: Enrollment | null;
  };
};

export default function CreateOrUpdateEnrollmentPaymentForm({
  initialValues,
}: IProps) {
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // store actions
  const clearFlow = useSetAtom(clearEnrollmentFlowAtom);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(enrollmentPaymentValidationSchema),
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control,
    name: 'payments',
  });

  const selectedStudent = useWatch({
    control,
    name: 'student',
  });

  const selectedEnrollment = useWatch({
    control,
    name: 'enrollment',
  });

  const payments = useWatch({
    control,
    name: 'payments',
  });

  const totalFee =
    payments?.reduce((sum, payment) => sum + (Number(payment?.fee) || 0), 0) ??
    0;

  useEffect(() => {
    const baseFee = selectedEnrollment?.course_offering?.fee;

    if (!baseFee) return;

    payments?.forEach((payment, index) => {
      const month = payment?.payment_month?.value;
      if (!month) return;

      const expectedFee =
        month < new Date().getMonth() + 1 ? baseFee - 500 : baseFee;

      // Prevent unnecessary setValue calls
      if (payment.fee !== expectedFee) {
        setValue(`payments.${index}.fee`, expectedFee, {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
    });
  }, [payments, selectedEnrollment, setValue]);

  // mutations
  const { mutate: createEnrollmentPayment, isLoading: creating } =
    useCreateEnrollmentPaymentMutation();

  const onSubmit = async (values: FormValues) => {
    const currentYear = new Date().getFullYear();

    if (!selectedEnrollment) return;

    const payments = values.payments.map((item) => ({
      payment_month: item.payment_month!.value,
      payment_year: currentYear,
      amount: item.fee!,
    }));

    const input = {
      student: values.student.id,
      enrollment_id: selectedEnrollment?.id,
      payments,
    };

    const mutationOptions = {
      onSuccess: () => {
        clearFlow(null);
      },
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    createEnrollmentPayment(input, mutationOptions);
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
              <SelectStudent control={control} errors={errors} />
              <SelectCourse
                control={control}
                errors={errors}
                studentId={selectedStudent?.id}
              />
              <div className="col-span-full">
                {paymentFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4 mb-4"
                  >
                    <div>
                      <SelectInput
                        label="Payment Month"
                        name={`payments.${index}.payment_month`}
                        control={control}
                        options={monthOptions}
                        required
                      />
                      <ValidationError
                        message={
                          t(
                            errors?.payments?.[index]?.payment_month
                              ?.message as string,
                          ) || ''
                        }
                      />
                    </div>

                    <Input
                      label={t('form:input-label-fee')}
                      {...register(`payments.${index}.fee`)}
                      type="number"
                      variant="outline"
                      error={
                        t(errors?.payments?.[index]?.fee?.message as string) ||
                        ''
                      }
                    />

                    <div className="flex">
                      <button
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                        onClick={() => removePayment(index)}
                        disabled={paymentFields.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedEnrollment}
                  onClick={() =>
                    appendPayment({
                      payment_month: null,
                      fee: selectedEnrollment?.course_offering?.fee ?? 0,
                    })
                  }
                >
                  Add Month
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
          <div className="text-end">
            <Button
              variant="outline"
              className="text-sm me-4 md:text-base"
              type="button"
              disabled
            >
              Total: Rs. {totalFee.toLocaleString()}
            </Button>

            <Button
              loading={creating}
              disabled={creating}
              className="text-sm md:text-base"
            >
              {initialValues?.id
                ? t('form:button-label-update-enrollment-payment')
                : t('form:button-label-add-enrollment-payment')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
