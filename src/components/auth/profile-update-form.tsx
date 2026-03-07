import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
// validations
import { profileValidationSchema } from './profile-validation-schema';
// utils
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// hooks
import { useUpdateUserMutation } from '@/data/user';
// components
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import FileInput from '@/components/ui/file-input';
import Description from '@/components/ui/description';
import { yupResolver } from '@hookform/resolvers/yup';
import PhoneNumberInput from '@/components/ui/phone-input';

type FormValues = {
  display_name: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
};

export default function ProfileUpdate({ me }: any) {
  const { t } = useTranslation();
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(profileValidationSchema),
    defaultValues: {
      ...me,
    },
  });

  async function onSubmit(values: FormValues) {
    const input = {
      id: me?.id,
      input: {
        display_name: values.display_name,
        mobile_number: values.mobile_number,
      },
    };
    updateUser({ ...input });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-avatar')}
          details={t('form:avatar-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="profile.avatar" control={control} multiple={false} />
        </Card>
      </div>
      {permission ? (
        <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
          <Description
            title={t('form:form-notification-title')}
            details={t('form:form-notification-description')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
        </div>
      ) : (
        ''
      )}
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:form-title-information')}
          details={t('form:profile-info-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full mb-5 sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-display-name')}
            {...register('display_name')}
            error={t(errors.display_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-first-name')}
            {...register('first_name')}
            error={t(errors.display_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-last-name')}
            {...register('last_name')}
            error={t(errors.display_name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <PhoneNumberInput
            label={t('form:input-label-contact')}
            {...register('mobile_number')}
            control={control}
            error={t(errors.mobile_number?.message!)}
          />
        </Card>
        <div className="w-full text-end">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
