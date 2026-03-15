import * as yup from 'yup';

export const profileValidationSchema = yup.object().shape({
  display_name: yup.string().required('form:error-name-required'),
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  // profile: yup.object().shape({
  //   contact: yup.string().max(19, 'maximum 19 digit').optional(),
  // }),
});
