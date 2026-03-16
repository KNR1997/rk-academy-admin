import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { Subject } from '@/types';
// config
import { Config } from '@/config';
// utils
import { formatSlug } from '@/utils/use-slug';
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from '@/data/subject';
// validations
import { subjectValidationSchema } from './subject-validation-schema';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import { EditIcon } from '@/components/icons/edit';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  name: string;
  slug: string;
  code: string;
};

const defaultValues = {
  name: '',
  slug: '',
  code: '',
};

type IProps = {
  initialValues?: Subject | undefined;
};
export default function CreateOrUpdateSubjectForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(subjectValidationSchema),
  });

  const slugAutoSuggest = formatSlug(watch('name'));

  const { mutate: createSubject, isLoading: creating } =
    useCreateSubjectMutation();
  const { mutate: updateSubject, isLoading: updating } =
    useUpdateSubjectMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      slug: slugAutoSuggest,
      code: values.code,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };

    if (!initialValues) {
      createSubject(input, mutationOptions);
    } else {
      updateSubject(
        {
          ...input,
          id: initialValues.slug!,
        },
        mutationOptions,
      );
    }
  };

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:subject-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-name')}
              {...register('name')}
              error={t(errors.name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />

            {isSlugEditable ? (
              <div className="relative mb-5">
                <Input
                  label={t('form:input-label-slug')}
                  {...register('slug')}
                  error={t(errors.slug?.message!)}
                  variant="outline"
                  disabled={isSlugDisable}
                />
                <button
                  className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                  type="button"
                  title={t('common:text-edit')}
                  onClick={() => setIsSlugDisable(false)}
                >
                  <EditIcon width={14} />
                </button>
              </div>
            ) : (
              <Input
                label={t('form:input-label-slug')}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                value={slugAutoSuggest}
                variant="outline"
                className="mb-5"
                disabled
              />
            )}

            <Input
              label={t('form:input-label-code')}
              {...register('code')}
              error={t(errors.code?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
          </Card>
        </div>
        <StickyFooterPanel className="z-0">
          <div className="text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="text-sm me-4 md:text-base"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}

            <Button
              loading={creating || updating}
              disabled={creating || updating}
              className="text-sm md:text-base"
            >
              {initialValues
                ? t('form:button-label-update-subject')
                : t('form:button-label-add-subject')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
