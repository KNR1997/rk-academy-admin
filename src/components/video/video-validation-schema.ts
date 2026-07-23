import * as yup from 'yup';

export const videoValidationSchema = yup.object().shape({
  course_offering: yup.object().required('form:error-course-offering-required'),
  month: yup.object().required('form:error-month-required'),
  title: yup.string().required('form:error-title-required'),
  video_url: yup.string().required('form:error-video-url-required'),
  video_date: yup.string().required('Video Date is required'),
  lesson: yup
    .number()
    .typeError('Lesson must be a number')
    .transform((value, originalValue) => {
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .optional()
    .nullable()
    .min(1, 'Lesson must be greater than 0')
    .max(15, 'Day must be less than or equal to 15')
    .integer('Lesson must be a whole number'),
  day: yup
    .number()
    .typeError('Day must be a number')
    .transform((value, originalValue) => {
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .optional()
    .nullable()
    .min(1, 'Day must be greater than 0')
    .max(30, 'Day must be less than or equal to 30')
    .integer('Day must be a whole number'),
});
