import { Control, FieldErrors, useForm, useWatch } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { Enrollment, Student } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { animateScroll } from 'react-scroll';
import { useUpdateEnrollmentMutation } from '@/data/enrollment';
import { useStudentEnrollmentsQuery, useStudentsQuery } from '@/data/student';
import { useCreateEnrollmentPaymentMutation } from '@/data/enrollment-payment';
import { enrollmentPaymentValidationSchema } from './enrollment-payment-validation-schema';
import { monthOptions } from '@/constants';
import { useEffect, useRef } from 'react';
import Input from '@/components/ui/input';

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
          `${enrollment.course_offering.course.name} - ${enrollment.course_offering.grade_level.name} - Batch ${enrollment.course_offering.batch} `
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

function SelectStudent({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { students, paginatorInfo, loading, error } = useStudentsQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <SelectInput
        label={t('form:input-label-student')}
        name="student"
        control={control}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name}`
        }
        getOptionValue={(option: any) => option.id}
        options={students!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.student?.message)} />
    </div>
  );
}

type FormValues = {
  student: Student;
  enrollment: Enrollment | null;
  payment_month: { label: string; value: number } | null;
  fee: number | null;
};

const defaultValues = {};

type IProps = {
  initialValues?: Enrollment | undefined;
};
export default function CreateOrUpdateEnrollmentPaymentForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const d = new Date();
  let month = d.getMonth();

  const currentMonthOption = monthOptions.filter(
    (monthOption) => monthOption.value == month + 1,
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(enrollmentPaymentValidationSchema),
  });

  const selectedStudent = useWatch({
    control,
    name: 'student',
  });

  const currentFee = useWatch({
    control,
    name: 'fee',
  });

  const selectedEnrollment = useWatch({
    control,
    name: 'enrollment',
  });

  useEffect(() => {
    if (selectedEnrollment?.course_offering?.fee) {
      setValue('fee', selectedEnrollment.course_offering.fee, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue('fee', 0);
    }
  }, [selectedEnrollment, setValue]);

  const prevStudentIdRef = useRef<string | undefined>();

  // Reset course field when student changes
  useEffect(() => {
    const currentStudentId = selectedStudent?.id;

    if (
      prevStudentIdRef.current &&
      prevStudentIdRef.current !== currentStudentId
    ) {
      setValue('enrollment', null);
      setValue('payment_month', null);
      setValue('fee', null);
    }

    prevStudentIdRef.current = currentStudentId;
  }, [selectedStudent, reset, currentFee]);

  const { mutate: createEnrollmentPayment, isLoading: creating } =
    useCreateEnrollmentPaymentMutation();
  const { mutate: updateEnrollment, isLoading: updating } =
    useUpdateEnrollmentMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const onSubmit = async (values: FormValues) => {
    const currentYear = new Date().getFullYear();

    if (!values.enrollment || !values.payment_month || !values.fee) return;

    const input = {
      student: values.student.id,
      enrollment_id: values.enrollment.id,
      payment_month: values.payment_month.value,
      payment_year: currentYear,
      amount: values.fee,
    };
    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createEnrollmentPayment(input, mutationOptions);
    } else {
      updateEnrollment(
        {
          ...input,
          id: initialValues.id!,
        },
        mutationOptions,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectStudent control={control} errors={errors} />
          <SelectCourse
            control={control}
            errors={errors}
            studentId={selectedStudent?.id}
          />
          <div className="mb-5">
            <SelectInput
              label="Payment Month"
              name="payment_month"
              control={control}
              options={currentMonthOption}
              required
            />
            <ValidationError message={t(errors.payment_month?.message)} />
          </div>
          <Input
            label={t('form:input-label-fee')}
            {...register('fee')}
            type="number"
            variant="outline"
            className="mb-4"
            required
            readOnly
            error={t(errors.fee?.message!)}
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
              ? t('form:button-label-update-enrollment-payment')
              : t('form:button-label-add-enrollment-payment')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
