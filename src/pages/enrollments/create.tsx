import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// utils
import { adminAndCoordinatorOnly } from '@/utils/auth-utils';
// stores
import { enrollmentFlowStudentAtom } from '@/store/enrollment.store';
// components
import AppLayout from '@/components/layouts/app';
import CreateOrUpdateEnrollmentForm from '@/components/enrollment/enrollment-form';

export default function CreateEnrollmentPage() {
  const { t } = useTranslation();
  // store states
  const [enrollmentStudent, _] = useAtom(enrollmentFlowStudentAtom);

  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-enrollment')}
        </h1>
      </div>
      <CreateOrUpdateEnrollmentForm
        initialValues={
          enrollmentStudent ? { student: enrollmentStudent } : null
        }
      />
    </>
  );
}

CreateEnrollmentPage.authenticate = {
  permissions: adminAndCoordinatorOnly,
};
CreateEnrollmentPage.Layout = AppLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
