import YouTube from 'react-youtube';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { studentOnly } from '@/utils/auth-utils';
import { extractVideoId } from '@/utils/extract-youtube-video-id';
// hooks
import { useMyEnrollmentVideoQuery } from '@/data/user';
// components
import Card from '@/components/common/card';
import Layout from '@/components/layouts/student';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import PageHeading from '@/components/common/page-heading';
import { NoDataFound } from '@/components/icons/no-data-found';

export default function WatchVideo() {
  const { query } = useRouter();
  const { t } = useTranslation();
  // query
  const { video, isLoading, error } = useMyEnrollmentVideoQuery({
    id: query.id as string,
  });

  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  const onPlayerReady = (event: any) => {
    // Access the player instance and control playback
    event.target.pauseVideo();
  };

  const opts = {
    width: '100%',
    height: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const videoId = extractVideoId(video?.video_url);

  const isValidYouTubeId = (id: string) => id && id.length === 11;

  const title = `${video?.course_content?.course_offering?.course?.name} - ${video?.title}`;

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-3/4">
            <PageHeading title={title} />
          </div>
        </div>
      </Card>

      {isValidYouTubeId(videoId) ? (
        <div className="mb-6">
          {/* <Video src="https://www.w3schools.com/html/mov_bbb.mp4" controls  /> */}
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onPlayerReady}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center py-7">
          <NoDataFound className="w-52" />
          <div className="mb-1 pt-6 text-base font-semibold text-heading">
            {t('table:empty-table-data')}
          </div>
          <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
        </div>
      )}
    </>
  );
}

WatchVideo.authenticate = {
  permissions: studentOnly,
};
WatchVideo.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'table', 'common'])),
  },
});
