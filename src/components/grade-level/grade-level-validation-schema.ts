import * as yup from 'yup';

export const gradeLevelValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  level: yup.object().required('form:error-level-required'),
});
