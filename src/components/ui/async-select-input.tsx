import AsyncSelect from 'react-select/async';
import { Controller } from 'react-hook-form';
import { selectStyles } from '@/components/ui/select/select.styles';
// components
import TooltipLabel from '@/components/ui/tooltip-label';

interface AsyncSelectInputProps {
  control: any;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  loadOptions: (inputValue: string) => Promise<any[]>;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => string;
}

const AsyncSelectInput = ({
  control,
  name,
  label,
  required,
  disabled,
  loadOptions,
  getOptionLabel,
  getOptionValue,
}: AsyncSelectInputProps) => {
  return (
    <>
      {label && (
        <TooltipLabel htmlFor={name} label={label} required={required} />
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <AsyncSelect
            {...field}
            styles={selectStyles}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isDisabled={disabled}
          />
        )}
      />
    </>
  );
};

export default AsyncSelectInput;
