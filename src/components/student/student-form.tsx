import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { AcademicYear, GradeLevel, Student } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsQuery } from '@/data/settings';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { studentValidationSchema } from './student-validation-schema';
import Label from '../ui/label';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { useAcademicYearsQuery } from '@/data/academic-year';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import { animateScroll } from 'react-scroll';
import SelectGradeLevel from '@/components/grade-level/select-grade-level';
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from '@/data/student';

function SelectAcademicYear({
  control,
  errors,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const { academicYears, loading } = useAcademicYearsQuery({
    language: locale,
  });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-academic-year')}</Label>
      <SelectInput
        name="academic_year"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={academicYears!}
        isLoading={loading}
        required
      />
      <ValidationError message={t(errors.academic_year?.message)} />
    </div>
  );
}

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  // username: string;
  password: string;
  date_of_birth: string;
  parent_guardian_name: string;
  parent_guardian_phone: string;
  grade_level: GradeLevel;
  academic_year: AcademicYear;
};

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  // username: '',
  password: '',
  date_of_birth: null,
  parent_guardian_name: '',
  parent_guardian_phone: '',
};

type IProps = {
  initialValues?: Student | undefined;
};
export default function CreateOrUpdateStudentForm({ initialValues }: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

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
          grade_level: initialValues.current_grade,
          academic_year: initialValues.current_academic_year,
          ...initialValues,
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(studentValidationSchema),
    context: { isEditMode: !!initialValues },
  });

  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createStudent, isLoading: creating } =
    useCreateStudentMutation();
  const { mutate: updateStudent, isLoading: updating } =
    useUpdateStudentMutation();

  const handleMutationError = (error: any) => {
    Object.keys(error?.response?.data).forEach((field: any) => {
      setError(field, {
        type: 'manual',
        message: error?.response?.data[field],
      });
    });
    setErrorMessage('PICKBAZAR_ERROR.SOMETHING_WENT_WRONG');
    animateScroll.scrollToTop();
  };

  const onSubmit = async (values: FormValues) => {
    const input = {
      // username: values.username,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      date_of_birth: values.date_of_birth == '' ? null : values.date_of_birth,
      // parent_guardian_name: values.parent_guardian_name,
      // parent_guardian_phone: values.parent_guardian_phone,
      current_grade: values.grade_level.id,
      current_academic_year: values.academic_year.id,
    };
    const mutationOptions = { onError: handleMutationError };

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
        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:student-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-first-name')}
              {...register('first_name')}
              error={t(errors.first_name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-last-name')}
              {...register('last_name')}
              error={t(errors.last_name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-email')}
              {...register('email')}
              error={t(errors.email?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            {/* <Input
              label={t('form:input-label-username')}
              {...register('username')}
              error={t(errors.username?.message!)}
              variant="outline"
              className="mb-5"
              required
            /> */}
            {!initialValues && (
              <Input
                label={t('form:input-label-password')}
                type="password"
                {...register('password')}
                error={t(errors.password?.message!)}
                variant="outline"
                className="mb-5"
                required
              />
            )}
            <Input
              label={t('form:input-label-date-of-birth')}
              {...register('date_of_birth')}
              type="date"
              error={t(errors.date_of_birth?.message!)}
              variant="outline"
              className="mb-5"
            />
          </Card>
        </div>

        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:student-guardian-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <SelectGradeLevel control={control} errors={errors} />
            <SelectAcademicYear control={control} errors={errors} />
          </Card>
        </div>

        {/* <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title={t('form:input-label-description')}
            details={`${
              initialValues
                ? t('form:item-description-edit')
                : t('form:item-description-add')
            } ${t('form:student-academic-description-helper-text')}`}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-parent-guardian-name')}
              {...register('parent_guardian_name')}
              error={t(errors.parent_guardian_name?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
            <Input
              label={t('form:input-label-parent-guardian-phone')}
              {...register('parent_guardian_phone')}
              error={t(errors.parent_guardian_phone?.message!)}
              variant="outline"
              className="mb-5"
              required
            />
          </Card>
        </div> */}
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
