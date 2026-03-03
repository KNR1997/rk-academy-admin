import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const coordinatorValidationSchema = yup.object().shape({
  // firstname: yup.string().required('form:error-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('form:error-password-required'),
  }),
  // password: yup
  //   .string()
  //   .required('form:error-password-required')
  //   .matches(passwordRules, {
  //     message:
  //       'Please create a stronger password. hint: Min 8 characters, 1 Upper case letter, 1 Lower case letter, 1 Numeric digit.',
  //   }),
});
