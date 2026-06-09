import * as yup from 'yup';

export const enrollmentPaymentValidationSchema = yup.object().shape({
  student: yup.object().required('form:error-student-required'),
  enrollment: yup.object().required('form:error-enrollment-required'),
  payment_month: yup.object().required('form:error-month-required'),
  fee: yup.string().required('form:error-fee-required'),
});
