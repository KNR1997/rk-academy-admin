import Input from '@/components/ui/input';
import { Control, FieldErrors, useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useRouter } from 'next/router';
import { Course } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { gradeLevelValidationSchema } from './grade-level-validation-schema';
import SelectInput from '../ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';
import { animateScroll } from 'react-scroll';
import RichTextEditor from '@/components/ui/wysiwyg-editor/editor';
import {
  useCreateGradeLevelMutation,
  useUpdateGradeLevelMutation,
} from '@/data/grade-level';

function SelectLevel({
  control,
  errors,
  disabled,
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  const levelOptions = [
    {
      label: 'Grade 6',
      value: 6,
    },
    {
      label: 'Grade 7',
      value: 7,
    },
    {
      label: 'Grade 8',
      value: 8,
    },
    {
      label: 'Grade 9',
      value: 9,
    },
    {
      label: 'Grade 10',
      value: 10,
    },
    {
      label: 'Grade 11',
      value: 11,
    },
  ];
  return (
    <div className="mb-5">
      <SelectInput
        name="level"
        control={control}
        label={t('form:input-label-levels')}
        options={levelOptions!}
        required
        disabled={disabled}
      />
      <ValidationError message={t(errors.level?.message)} />
    </div>
  );
}

type FormValues = {
  level: { label: string; value: number };
  name: string;
  description: string;
};

const defaultValues = {
  name: '',
};

type IProps = {
  initialValues?: Course | undefined;
};
export default function CreateOrUpdateGradeLevelForm({
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
    resolver: yupResolver(gradeLevelValidationSchema),
  });

  const { mutate: createGradeLevel, isLoading: creating } =
    useCreateGradeLevelMutation();
  const { mutate: updateGradeLevel, isLoading: updating } =
    useUpdateGradeLevelMutation();

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
      level: values.level.value,
      name: values.name,
      description: values.description,
    };
    const mutationOptions = { onError: handleMutationError };
    if (!initialValues) {
      createGradeLevel(input, mutationOptions);
    } else {
      updateGradeLevel(
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
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <SelectLevel
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
            required
          />
          <RichTextEditor
            title={t('form:input-label-description')}
            control={control}
            name="description"
            error={t(errors?.description?.message)}
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
              ? t('form:button-label-update-grade-level')
              : t('form:button-label-add-grade-level')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
