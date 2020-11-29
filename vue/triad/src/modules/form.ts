import { inject, onMounted, onUnmounted, provide, Ref, ref, registerRuntimeCompiler } from 'vue';

export type Validator<T> = (value?: T) => string | null | undefined;

export interface FormContext {
  register(name: string, validate: () => boolean): void;
  deregister(name: string): void;
  setValue(name: string, value: string | boolean | number): void;
}

export interface FormFieldOptions<T> {
  defaultValue?: T;
  required?: boolean;
  validators?: Validator<T>[];
}

export function useFormContainer() {
  const validators: { [name: string]: () => boolean } = {};
  const values: { [name: string]: string | boolean | number } = {};
  const formContext: FormContext = {
    register(name: string, validate: () => boolean): void {
      validators[name] = validate;
    },
    deregister(name: string) {
      delete validators[name];
    },
    setValue(name: string, value: string | boolean | number) {
      values[name ] = value;
    },
  };
  provide('formContext', formContext);

  const formHasError = ref(false);
  return {
    values,
    formHasError,
    validateForm() {
      let isValid = true;
      for (const name in validators) {
        if (!validators[name]()) {
          isValid = false;
        }
      }
      formHasError.value = !isValid;
      return isValid;
    },
  };
}

export function useFormField<T>(name: string, { defaultValue, required, validators }: FormFieldOptions<T> = {}) {
  const formContext = inject<FormContext>('formContext');
  if (!formContext) {
    throw new Error('Form validation used outside a form');
  }
  const modelValue = ref(defaultValue) as Ref<T | undefined>;
  const errorMessages = ref<string[]>([]);

  function validator() {
    const errors = [];
    if (required && (
      modelValue.value === undefined
      || modelValue.value === null
      || modelValue.value as unknown as string === '')
    ) {
      errors.push('This field is required');
    } else if (validators && validators.length > 0) {
      for (const v of validators) {
        const error = v(modelValue.value as T);
        if (error) {
          errors.push(error);
        }
      }
    }
    errorMessages.value = errors;
    return errors.length === 0;
  }

  onMounted(() => {
    formContext.register(name, validator);
  });
  onUnmounted(() => {
    formContext.deregister(name);
  });
  return {
    updateListener(value: T) {
      modelValue.value = value;
      formContext.setValue(name, value as unknown as string | boolean | number);
    },
    modelValue,
    errorMessages,
    validator,
  };
}