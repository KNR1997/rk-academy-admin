import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// form-validations
import { subjectValidationSchema } from './course-validation-schema';
// types
import { Course, Subject } from '@/types';
// utils
import {
  generateCourseCode,
  generateCourseName,
} from '@/utils/use-code-generate';
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '@/data/course';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import SelectSubject from '@/components/subject/select-subject';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

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
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const courseName = generateCourseName(subject?.name);
  const courseCode = generateCourseCode(subject?.code);
  // mutations
  const { mutate: createCourse, isLoading: creating } =
    useCreateCourseMutation();
  const { mutate: updateCourse, isLoading: updating } =
    useUpdateCourseMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      subject: values.subject.id,
      name: courseName,
      code: courseCode,
      slug: courseCode,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
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
        <div className="my-5 sm:my-8">
          <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
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
    </>
  );
}
