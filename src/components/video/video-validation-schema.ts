import * as yup from 'yup';

export const videoValidationSchema = yup.object().shape({
  course_offering: yup.object().required('form:error-course-offering-required'),
  month: yup.object().required('form:error-month-required'),
  title: yup.string().required('form:error-title-required'),
  video_url: yup.string().required('form:error-video-url-required'),
});
