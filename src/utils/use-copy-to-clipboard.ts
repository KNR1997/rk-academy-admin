import { toast } from 'react-toastify';

export const useCopyToClipboard = () => {
  const copyToClipboard = async (
    text: string,
    successMessage: string = 'Copied to clipboard!',
    errorMessage: string = 'Failed to copy',
  ) => {
    if (!text) {
      toast.warning('No text to copy');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    } catch (err) {
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(successMessage);
        return true;
      } catch (fallbackErr) {
        toast.error(errorMessage);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return { copyToClipboard };
};

// export const useCopyToClipboard = () => {
//   const [copySuccess, setCopySuccess] = useState<string | null>(null);

//   const copyToClipboard = async (
//     text: string,
//     successMessage: string = 'Copied!',
//   ) => {
//     if (!text) {
//       setCopySuccess('No text to copy');
//       setTimeout(() => setCopySuccess(null), 3000);
//       return false;
//     }

//     try {
//       await navigator.clipboard.writeText(text);
//       setCopySuccess(successMessage);
//       setTimeout(() => setCopySuccess(null), 2000);
//       return true;
//     } catch (err) {
//       // Fallback method for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.select();
//       try {
//         document.execCommand('copy');
//         setCopySuccess(successMessage);
//         setTimeout(() => setCopySuccess(null), 2000);
//         return true;
//       } catch (fallbackErr) {
//         setCopySuccess('Failed to copy');
//         setTimeout(() => setCopySuccess(null), 3000);
//         return false;
//       } finally {
//         document.body.removeChild(textArea);
//       }
//     }
//   };

//   return { copySuccess, copyToClipboard };
// };
