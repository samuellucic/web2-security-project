import { ChangeEvent, useCallback, useState } from 'react';

export interface FormInputError {
  message?: string;
  isValid: boolean;
}

export interface FormInputProps {
  initialValue: string;
  validate?: (value: string) => FormInputError;
}

const useFormInput = ({
  initialValue,
  validate,
}: FormInputProps): [
  string,
  (e: ChangeEvent<HTMLInputElement>) => void,
  string | undefined,
] => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string>();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      if (validate) {
        const identifier = setTimeout(() => {
          const { message, isValid } = validate(value);
          if (!isValid) {
            if (message) {
              setError(message);
            }
          } else {
            setError(undefined);
          }
        }, 500);

        return () => {
          clearTimeout(identifier);
        };
      }
    },
    [validate]
  );

  return [value, handleChange, error];
};

export default useFormInput;
