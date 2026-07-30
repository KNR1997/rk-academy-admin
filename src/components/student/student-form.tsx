import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
// form-validations
import { studentValidationSchema } from './student-validation-schema';
// types
import { AcademicYear, GradeLevel, Student } from '@/types';
// configs
import { Routes } from '@/config/routes';
// utils
import { generatePassword } from '@/utils/generate-password';
import { useCopyToClipboard } from '@/utils/use-copy-to-clipboard';
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
import { CopyButton } from '@/components/ui/copy-button';
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
  // date_of_birth: string;
  school: string;
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
  // date_of_birth: null,
  school: '',
  parent_guardian_name: '',
  parent_guardian_phone: '',
};

type IProps = {
  initialValues?: Student | undefined;
};

export default function CreateOrUpdateStudentForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isEditMode = router?.query?.action === 'edit';
  // states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { copyToClipboard } = useCopyToClipboard();

  // Get the setter for enrollment student atom
  const setEnrollmentStudent = useSetAtom(enrollmentFlowStudentAtom);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
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
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(studentValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  // Watch fields
  const firstName = watch('first_name');
  const lastName = watch('last_name');
  const email = watch('email');
  const password = watch('password');
  const studentNumber = watch('student_number');

  // Auto-suggest email when first_name or last_name changes
  useEffect(() => {
    if (!isEditMode && firstName && lastName) {
      const suggestedEmail = `${firstName}.${lastName}@rukshanict.lk`
        .toLowerCase()
        .replace(/\s+/g, '');
      setValue('email', suggestedEmail);
    }
  }, [firstName, lastName, setValue]);

  // Copy handlers
  const handleCopyEmail = () =>
    copyToClipboard(email, t('common:email-copied'), t('common:copy-failed'));

  const handleCopyPassword = () =>
    copyToClipboard(
      password,
      t('common:password-copied'),
      t('common:copy-failed'),
    );

  const handleCopyStudentNumber = () =>
    copyToClipboard(
      studentNumber,
      t('common:student-number-copied'),
      t('common:copy-failed'),
    );

  // mutations
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
      // date_of_birth: values.date_of_birth == '' ? null : values.date_of_birth,
      // parent_guardian_name: values.parent_guardian_name,
      school: values.school,
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
              <Input
                label={t('form:input-label-school')}
                {...register('school')}
                error={t(errors.school?.message!)}
                variant="outline"
              />
              {/* <Input
                label={t('form:input-label-date-of-birth')}
                {...register('date_of_birth')}
                type="date"
                error={t(errors.date_of_birth?.message!)}
                variant="outline"
                //dimension="small"
                required
              /> */}

              {/* Email Field with Copy Button */}
              <div className="relative mb-5">
                <Input
                  label={t('form:input-label-email')}
                  {...register('email')}
                  error={t(errors.email?.message!)}
                  variant="outline"
                  // disabled={!isEditMode}
                  required
                  showCopyToClipboard
                  onCopyToClipboard={handleCopyEmail}
                />
              </div>

              {/* Password Field with Copy Button */}
              {!initialValues && (
                <div className="relative mb-5">
                  <PasswordInput
                    label={t('form:input-label-password')}
                    className="mb-4"
                    {...register('password')}
                    variant="outline"
                    error={t(errors.password?.message!)}
                    required
                    showCopyToClipboard
                    onCopyToClipboard={handleCopyPassword}
                  />
                </div>
              )}

              {/* Student Number Field with Copy Button */}
              {initialValues && (
                <div className="relative mb-5">
                  <Input
                    label={t('form:input-label-student-number')}
                    {...register('student_number')}
                    error={t(errors.student_number?.message!)}
                    variant="outline"
                    disabled
                    showCopyToClipboard
                    onCopyToClipboard={handleCopyStudentNumber}
                  />
                  {/* <CopyButton
                    onClick={handleCopyStudentNumber}
                    title={t('common:copy-student-number')}
                  /> */}
                </div>
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
