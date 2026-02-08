import * as yup from 'yup';

export const studentValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  email: yup.string().email().required('form:error-email-required'),
  password: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('form:error-password-required'),
  }),
  // username: yup.string().required('form:error-username-required'),
  // date_of_birth: yup.string().required('form:error-birthday-required'),
  // parent_guardian_name: yup.string().required('form:error-guardian-name-required'),
  // parent_guardian_phone: yup.string().required('form:error-guardian-phone-required'),
  grade_level: yup.object().required('form:error-grade-level-required'),
  academic_year: yup.object().required('form:error-academic-year-required'),
});
