import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// form-validations
import { studentValidationSchema } from './student-validation-schema';
// types
import { AcademicYear, GradeLevel, Student } from '@/types';
// configs
import { Routes } from '@/config/routes';
// utils
import { generatePassword } from '@/utils/generate-password';
import { handleMutationError } from '@/utils/handle-mutation-error';
// stores
import { enrollmentFlowStudentAtom } from '@/store/enrollment.store';
// hooks
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from '@/data/student';
// components
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import PasswordInput from '@/components/ui/password-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import SelectExamYear from '@/components/exam-year/select-exam-year';
import SelectGradeLevel from '@/components/grade-level/select-grade-level';

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  student_number: string;
  password: string;
  date_of_birth: string;
  parent_guardian_name: string;
  parent_guardian_phone: string;
  grade_level: GradeLevel;
  academic_year: AcademicYear;
  exam_year: {
    label: string;
    value: string;
  };
};

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  // student_number: '',
  password: generatePassword(),
  date_of_birth: null,
  parent_guardian_name: '',
  parent_guardian_phone: '',
};

type IProps = {
  initialValues?: Student | undefined;
};
export default function CreateOrUpdateStudentForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isNewTranslation = router?.query?.action === 'translate';

  // Get the setter for enrollment student atom
  const setEnrollmentStudent = useSetAtom(enrollmentFlowStudentAtom);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues.user,
          ...initialValues,
          grade_level: initialValues.current_grade,
          academic_year: initialValues.current_academic_year,
          exam_year: initialValues?.exam_year
            ? { label: initialValues.exam_year, value: initialValues.exam_year }
            : {},
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(studentValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { mutate: createStudent, isLoading: creating } =
    useCreateStudentMutation();
  const { mutate: updateStudent, isLoading: updating } =
    useUpdateStudentMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      // username: values.username,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      date_of_birth: values.date_of_birth == '' ? null : values.date_of_birth,
      // parent_guardian_name: values.parent_guardian_name,
      parent_guardian_phone: values.parent_guardian_phone,
      current_grade: values.grade_level.id,
      exam_year: values.exam_year.value,
    };
    const mutationOptions = {
      onSuccess: (data: Student) => {
        if (!initialValues) {
          setEnrollmentStudent(data);
          Router.push(Routes.enrollment.create);
        }
      },
      onError: (error: any) =>
        handleMutationError(error, setError, setErrorMessage),
    };
    if (!initialValues) {
      createStudent(input, mutationOptions);
    } else {
      updateStudent(
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
              <Input
                label={t('form:input-label-first-name')}
                {...register('first_name')}
                error={t(errors.first_name?.message!)}
                variant="outline"
                //dimension="small"
                required
              />
              <Input
                label={t('form:input-label-last-name')}
                {...register('last_name')}
                error={t(errors.last_name?.message!)}
                variant="outline"
                //dimension="small"
                required
              />
              <Input
                label={t('form:input-label-contact')}
                {...register('parent_guardian_phone')}
                error={t(errors.parent_guardian_phone?.message!)}
                variant="outline"
                //dimension="small"
                required
              />
              {!initialValues && (
                <PasswordInput
                  label={t('form:input-label-password')}
                  {...register('password')}
                  variant="outline"
                  error={t(errors.password?.message!)}
                  className="mb-5"
                  required
                />
              )}
              <Input
                label={t('form:input-label-email')}
                {...register('email')}
                error={t(errors.email?.message!)}
                variant="outline"
                //dimension="small"
              />
              <Input
                label={t('form:input-label-date-of-birth')}
                {...register('date_of_birth')}
                type="date"
                error={t(errors.date_of_birth?.message!)}
                variant="outline"
                //dimension="small"
              />
              {initialValues && (
                <Input
                  label={t('form:input-label-student-number')}
                  {...register('student_number')}
                  error={t(errors.student_number?.message!)}
                  variant="outline"
                  disabled
                />
              )}
            </div>
          </Card>
        </div>

        <div className="my-5 sm:my-8">
          <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectGradeLevel control={control} errors={errors} />
              <SelectExamYear control={control} errors={errors} />
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
                ? t('form:button-label-update-student')
                : t('form:button-label-add-student')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
}
