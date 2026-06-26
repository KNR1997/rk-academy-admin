// export const extractYoutubeVideoId = (url: string) => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   return match && match[2].length === 11 ? match[2] : null;
// };

export function extractYoutubeVideoId(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtube-nocookie.com')
    ) {
      return parsed.searchParams.get('v');
    }

    return null;
  } catch {
    return null;
  }
}
