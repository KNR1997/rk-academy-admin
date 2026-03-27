import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
// utils
import { handleMutationError } from '@/utils/handle-mutation-error';
// form-validations
import { enrollmentValidationSchema } from './enrollment-validation-schema';
// constants
import { activeInactiveStatusOptions } from '@/constants';
// configs
import { Routes } from '@/config/routes';
// hooks
import { useSettingsQuery } from '@/data/settings';
import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from '@/data/enrollment';
// stores
import { enrollmentFlowEnrollmentAtom } from '@/store/enrollment.store';
// types
import { CourseOffering, Enrollment, Student } from '@/types';
// components
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import SelectInput from '@/components/ui/select-input';
import SelectStudent from '@/components/student/select-student';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import ValidationError from '@/components/ui/form-validation-error';
import SelectCourseOffering from '@/components/course-offering/select-course-offering';

type FormValues = {
  student: Student;
  course_offering: CourseOffering;
  is_active: { label: string; value: boolean };
};

const defaultValues = {
  is_active: activeInactiveStatusOptions.find((option) => option.value == true),
};

type IProps = {
  initialValues?: {
    id?: string | null;
    student?: Student | null;
    course_offering?: CourseOffering | null;
    is_active?: boolean | null;
  } | null;
};

export default function CreateOrUpdateEnrollmentForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // store actions
  const setEnrollment = useSetAtom(enrollmentFlowEnrollmentAtom);
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
          is_active: activeInactiveStatusOptions.find(
            (option) => option.value == initialValues.is_active,
          ),
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

  // mutations
  const { mutate: createEnrollment, isLoading: creating } =
    useCreateEnrollmentMutation();
  const { mutate: updateEnrollment, isLoading: updating } =
    useUpdateEnrollmentMutation();

  const student = watch('student');

  const onSubmit = async (values: FormValues) => {
    const input = {
      student: values.student.id,
      course_offering: values.course_offering.id,
      is_active: values.is_active.value,
    };
    const mutationOptions = {
      onSuccess: (data: Enrollment) => {
        toast.success(t('common:successfully-created'));
        setEnrollment(data);
        Router.push(Routes.enrollmentPayment.create);
      },
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (initialValues?.id) {
      updateEnrollment(
        {
          is_active: values.is_active.value,
          id: initialValues.id,
        },
        mutationOptions,
      );
    } else {
      createEnrollment(input, mutationOptions);
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
              <SelectStudent
                control={control}
                errors={errors}
                // disabled={!!initialValues}
              />
              <SelectCourseOffering
                control={control}
                errors={errors}
                gradeLevel={student?.current_grade?.name}
              />
              <div className="mb-5">
                <SelectInput
                  label={t('form:input-label-status')}
                  name="is_active"
                  control={control}
                  options={activeInactiveStatusOptions}
                  isClearable={true}
                  required
                />
                <ValidationError message={t(errors.is_active?.message)} />
              </div>
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
              {initialValues?.id
                ? t('form:button-label-update-enrollment')
                : t('form:button-label-add-enrollment')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
