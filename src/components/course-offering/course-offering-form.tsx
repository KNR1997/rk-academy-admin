import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { subjectValidationSchema } from './course-offering-validation-schema';
import SelectCourse from '@/components/course/select-course';
import SelectTeacher from '@/components/teacher/select-teacher';
import SelectGradeLevel from '@/components/grade-level/select-grade-level';
// types
import { Course, CourseOffering, CourseType, GradeLevel, Teacher } from '@/types';
// hooks
import {
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingMutation,
} from '@/data/course-offering';

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
};

type IProps = {
  initialValues?: CourseOffering | undefined;
};
export default function CreateOrUpdateCourseOfferingForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
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
      course: values.course.id,
      teacher: values.teacher.id,
      grade_level: values.grade_level.id,
      year: values.year,
      batch: values.batch,
      fee: values.fee,
    };
    const mutationOptions = { onError: handleMutationError };
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
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
  );
}
