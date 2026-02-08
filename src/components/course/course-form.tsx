import { useRouter } from 'next/router';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, FieldErrors, useForm } from 'react-hook-form';
// components
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';
// form-validations
import { subjectValidationSchema } from './course-validation-schema';
// types
import { Course, Subject } from '@/types';
// utils
import {
  generateCourseCode,
  generateCourseName,
} from '@/utils/use-code-generate';
// hooks
import { useSubjectsQuery } from '@/data/subject';
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/data/course';

function SelectSubject({
  control,
  errors,
  disabled,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { subjects, loading } = useSubjectsQuery({ language: locale });
  return (
    <div className="mb-5">
      <SelectInput
        name="subject"
        control={control}
        label={t('form:input-label-subjects')}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        options={subjects!}
        isLoading={loading}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.subject?.message)} />
    </div>
  );
}

type FormValues = {
  name: string;
  slug: string;
  code: string;
  subject: Subject;
};

const defaultValues = {
  batch: 1,
};

type IProps = {
  initialValues?: Course | undefined;
};
export default function CreateOrUpdateCourseForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(subjectValidationSchema),
  });

  const subject = watch('subject');

  const courseName = generateCourseName(
    subject?.name,
  );
  const courseCode = generateCourseCode(
    subject?.code,
  );
  // mutations
  const { mutate: createCourse, isLoading: creating } =
    useCreateCourseMutation();
  const { mutate: updateCourse, isLoading: updating } =
    useUpdateCourseMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const onSubmit = async (values: FormValues) => {
    const input = {
      subject: values.subject.id,
      name: courseName,
      code: courseCode,
      slug: courseCode,
    };
    const mutationOptions = { onError: handleMutationError };
    if (!initialValues) {
      createCourse(input, mutationOptions);
    } else {
      updateCourse(
        {
          ...input,
          id: initialValues.slug!,
        },
        mutationOptions,
      );
    }
  };

  return (
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
          <SelectSubject
            control={control}
            errors={errors}
            disabled={!!initialValues}
          />
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            disabled
            value={courseName}
          />
          <Input
            label={t('form:input-label-code')}
            {...register('code')}
            type="text"
            variant="outline"
            className="mb-4"
            error={t(errors.code?.message!)}
            disabled
            value={courseCode}
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
              ? t('form:button-label-update-course')
              : t('form:button-label-add-course')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
