import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// config
import { Routes } from '@/config/routes';
// utils
import { getEmailVerified } from '@/utils/auth-utils';
// hooks
import {
  useResendVerificationEmail,
  useLogoutMutation,
  useMeQuery,
} from '@/data/user';
// components
import Button from '@/components/ui/button';
import AuthPageLayout from '@/components/layouts/auth-layout';

export default function VerifyEmailActions() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { emailVerified } = getEmailVerified();
  if (emailVerified) {
    router.push(Routes.dashboard);
  }
  // query
  useMeQuery();
  // mutations
  const { mutate: logout, isLoading: isLoading } = useLogoutMutation();
  const { mutate: verifyEmail, isLoading: isVerifying } =
    useResendVerificationEmail();

  return (
    <>
      <AuthPageLayout>
        <h3 className="mt-4 mb-6 text-center text-base italic text-red-500 text-body">
          {t('common:email-not-verified')}
        </h3>
        <div className="w-full space-y-3">
          <Button
            onClick={() => verifyEmail()}
            disabled={isVerifying}
            className="w-full"
          >
            {t('common:text-resend-verification-email')}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            className="w-full"
            onClick={() => logout()}
          >
            {t('common:authorized-nav-item-logout')}
          </Button>
        </div>
      </AuthPageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
