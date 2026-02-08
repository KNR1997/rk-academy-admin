import { useRouter } from 'next/router';
import { animateScroll } from 'react-scroll';
import { useTranslation } from 'next-i18next';
import { Control, FieldErrors, useForm } from 'react-hook-form';
// types
import { CourseOffering, Enrollment, Student } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
// hooks
import { useSettingsQuery } from '@/data/settings';
import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from '@/data/enrollment';
import { useStudentsQuery } from '@/data/student';
import { useCourseOfferingsQuery } from '@/data/course-offering';
// form-validation-schema
import { enrollmentValidationSchema } from './enrollment-validation-schema';
// components
import Label from '@/components/ui/label';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';

function SelectCourseOffering({
  control,
  errors,
  gradeLevel,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  gradeLevel?: string;
}) {
  const { t } = useTranslation();
  const { courseOfferings, loading } = useCourseOfferingsQuery({
    grade_level: gradeLevel,
  });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-courses')}</Label>
      <SelectInput
        name="course_offering"
        control={control}
        getOptionLabel={(option: any) =>
          `${option.course.name} ${option.year} - ${option.grade_level.name} - batch ${option.batch}`
        }
        getOptionValue={(option: any) => option.id}
        options={courseOfferings!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.course_offering?.message)} />
    </div>
  );
}

function SelectStudent({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { t } = useTranslation();
  const { students, paginatorInfo, loading, error } = useStudentsQuery({
    limit: 20,
  });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-student')}</Label>
      <SelectInput
        name="student"
        control={control}
        getOptionLabel={(option: any) =>
          `${option.user.first_name} ${option.user.last_name} - ${option.current_grade.name}`
        }
        getOptionValue={(option: any) => option.id}
        options={students!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.student?.message)} />
    </div>
  );
}

type FormValues = {
  student: Student;
  course_offering: CourseOffering;
};

const defaultValues = {
  student: '',
  course_offering: '',
};

type IProps = {
  initialValues?: Enrollment | undefined;
};
export default function CreateOrUpdateEnrollmentForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const {
    watch,
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
          // ...(isNewTranslation && {
          //   type: null,
          // }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(enrollmentValidationSchema),
  });

  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createEnrollment, isLoading: creating } =
    useCreateEnrollmentMutation();
  const { mutate: updateEnrollment, isLoading: updating } =
    useUpdateEnrollmentMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    animateScroll.scrollToTop();
  };

  const student = watch('student');

  const onSubmit = async (values: FormValues) => {
    const input = {
      student: values.student.id,
      course_offering: values.course_offering.id,
    };
    const mutationOptions = { onError: handleMutationError };

    if (!initialValues) {
      createEnrollment(input, mutationOptions);
    } else {
      updateEnrollment(
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
          } ${t('form:enrollment-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectStudent control={control} errors={errors} />
          <SelectCourseOffering
            control={control}
            errors={errors}
            gradeLevel={student?.current_grade?.name}
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
              ? t('form:button-label-update-enrollment')
              : t('form:button-label-add-enrollment')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
