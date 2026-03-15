import { animateScroll } from 'react-scroll';

export const handleMutationError = (
  error: any,
  setError: any,
  setErrorMessage: (msg: string) => void,
) => {
  Object.keys(error?.response?.data || {}).forEach((field: any) => {
    setError(field, {
      type: 'manual',
      message: error?.response?.data[field],
    });
  });

  setErrorMessage('PICKBAZAR_ERROR.SOMETHING_WENT_WRONG');
  animateScroll.scrollToTop();
};
