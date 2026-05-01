import * as yup from 'yup';
import { passwordRules } from '@/utils/constants';

export const coordinatorValidationSchema = yup.object().shape({
  first_name: yup.string().required('form:error-first-name-required'),
  last_name: yup.string().required('form:error-last-name-required'),
  display_name: yup.string().required('form:error-display-name-required'),
  email: yup
    .string()
    .email('form:error-email-format')
    .required('form:error-email-required'),
  password: yup.string().when('$isEditMode', {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required('form:error-password-required'),
  }),
  mobile_number: yup
    .string()
    .nullable()
    .notRequired()
    .matches(/^[0-9]{10}$/, {
      message: 'Mobile number must be exactly 10 digits',
      excludeEmptyString: true,
    }),
});
