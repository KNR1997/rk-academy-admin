import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import {
  Course,
  CourseOffering,
  CourseType,
  GradeLevel,
  Teacher,
} from '@/types';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// hooks
import {
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingMutation,
} from '@/data/course-offering';
// form-validations
import { subjectValidationSchema } from './course-offering-validation-schema';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import SelectCourse from '@/components/course/select-course';
import SelectTeacher from '@/components/teacher/select-teacher';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectGradeLevel from '@/components/grade-level/select-grade-level';

type FormValues = {
  name: string;
  slug: string;
  code: string;
  batch: number;
  fee: number;
  year: number;
  course: Course;
  teacher: Teacher;
  grade_level: GradeLevel;
  course_type: { label: string; value: CourseType };
};

const defaultValues = {
  batch: 1,
  year: new Date().getFullYear(),
};

type IProps = {
  initialValues?: CourseOffering | undefined;
};
export default function CreateOrUpdateCourseOfferingForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
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
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(subjectValidationSchema),
  });
  // mutations
  const { mutate: createCourseOffering, isLoading: creating } =
    useCreateCourseOfferingMutation();
  const { mutate: updateCourseOffering, isLoading: updating } =
    useUpdateCourseOfferingMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      course: values.course.id,
      teacher: values.teacher.id,
      grade_level: values.grade_level.id,
      year: values.year,
      batch: values.batch,
      fee: values.fee,
    };
    const mutationOptions = {
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createCourseOffering(input, mutationOptions);
    } else {
      updateCourseOffering(
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
        <div className="my-5 sm:my-8">
          <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectCourse
                control={control}
                errors={errors}
                disabled={!!initialValues}
              />
              <SelectTeacher
                control={control}
                errors={errors}
                disabled={!!initialValues}
              />
              <SelectGradeLevel control={control} errors={errors} />
              <Input
                label={t('form:input-label-year')}
                {...register('year')}
                error={t(errors.year?.message!)}
                variant="outline"
                className="mb-5"
                required
                disabled
              />
              <Input
                label={t('form:input-label-batch')}
                {...register('batch')}
                error={t(errors.batch?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
              <Input
                label={t('form:input-label-fee')}
                {...register('fee')}
                type="number"
                variant="outline"
                className="mb-4"
                required
                error={t(errors.fee?.message!)}
                {...register('fee', {
                  setValueAs: (v) => (v === '' ? null : Number(v)),
                })}
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
                ? t('form:button-label-update-course-offering')
                : t('form:button-label-add-course-offering')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
