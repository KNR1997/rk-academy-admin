import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// form-validations
import { videoValidationSchema } from './video-validation-schema';
// types
import { CourseOffering, Video } from '@/types';
// constants
import { monthOptions } from '@/constants';
// hooks
import { useCreateVideoMutation, useUpdateVideoMutation } from '@/data/video';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';
import SelectCourseOffering from '@/components/course-offering/select-course-offering';

type FormValues = {
  title: string;
  video_url: string;
  month: {
    label: string;
    value: number;
  };
  year: number;
  course_offering: CourseOffering;
};

const defaultValues = {
  batch: 1,
};

type IProps = {
  initialValues?: Video | undefined;
};
export default function CreateOrUpdateVideoForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          month: monthOptions.find(
            (option) => option.value == initialValues.course_content.month,
          ),
          year: initialValues.course_content.year,
          course_offering: initialValues.course_content.course_offering,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(videoValidationSchema),
  });

  // mutations
  const { mutate: createVideo, isLoading: creating } = useCreateVideoMutation();
  const { mutate: updateVideo, isLoading: updating } = useUpdateVideoMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      title: values.title,
      video_url: values.video_url,
      month: values.month.value,
      year: values.course_offering.year,
      course_offering_id: values.course_offering.id,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createVideo(input, mutationOptions);
    } else {
      updateVideo(
        {
          ...input,
          id: initialValues.id!,
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
            } ${t('form:course-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <SelectCourseOffering
              control={control}
              errors={errors}
              // disabled={!!initialValues}
            />
            <div className="mb-5">
              <SelectInput
                label="Month"
                name="month"
                control={control}
                options={monthOptions}
                required
              />
              <ValidationError message={t(errors.month?.message)} />
            </div>
            {/* <Input
              label={t('form:input-label-year')}
              {...register('year')}
              error={t(errors.year?.message!)}
              value={yearAutoCompleted}
              variant="outline"
              className="mb-5"
              required
              disabled
            /> */}
            <Input
              label={t('form:input-label-title')}
              {...register('title')}
              error={t(errors.title?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-video-url')}
              {...register('video_url')}
              type="text"
              variant="outline"
              className="mb-4"
              error={t(errors.video_url?.message!)}
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
                ? t('form:button-label-update-video')
                : t('form:button-label-add-video')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
