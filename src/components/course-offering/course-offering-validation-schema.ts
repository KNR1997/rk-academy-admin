import * as yup from 'yup';

export const subjectValidationSchema = yup.object().shape({
  batch: yup.string().required('form:error-batch-required'),
  course: yup.object().required('form:error-course-required'),
  grade_level: yup.object().required('form:error-grade-required'),
  teacher: yup.object().required('form:error-teacher-required'),
  fee: yup.string().required('form:error-fee-required'),
  year: yup.string().required('form:error-year-required'),
});
