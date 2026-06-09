import * as yup from 'yup';

export const enrollmentPaymentValidationSchema = yup.object({
  student: yup.object().required('form:error-student-required'),

  enrollment: yup.object().required('form:error-enrollment-required'),

  payments: yup
    .array()
    .of(
      yup.object({
        payment_month: yup
          .object()
          .nullable()
          .required('form:error-month-required'),

        fee: yup
          .number()
          .typeError('form:error-fee-required')
          .required('form:error-fee-required')
          .positive('form:error-fee-required'),
      }),
    )
    .min(1, 'form:error-month-required')
    .required(),
});
