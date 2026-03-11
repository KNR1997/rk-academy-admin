import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// components
import AppLayout from '@/components/layouts/app';
import CreateOrUpdateEnrollmentPaymentForm from '@/components/enrollment-payments/enrollment-payment-form';

export default function CreateEnrollmentPaymentPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-enrollment-payment')}
        </h1>
      </div>
      <CreateOrUpdateEnrollmentPaymentForm />
    </>
  );
}

CreateEnrollmentPaymentPage.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
CreateEnrollmentPaymentPage.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
