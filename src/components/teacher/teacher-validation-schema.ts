import * as yup from 'yup';

export const teacherValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  email: yup.string().email().required('form:error-email-required'),
  password: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('form:error-password-required'),
  }),
  username: yup.string().required('form:error-username-required'),
  // date_of_birth: yup.string().required('form:error-birthday-required'),
  department: yup.string().required('form:error-department-required'),
  mobile_number: yup.string().max(19, 'maximum 19 digit').required('form:error-contact-number-required')
});
