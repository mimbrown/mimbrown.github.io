import './FormField.css';
import { defineComponent, Fragment, h, PropType, VNode } from 'vue';
import { useFormField, Validator } from '@/modules/form';

function defaultProps<T>() {
  return {
    name: {
      type: String,
      required: true as true,
    },
    label: {
      type: String,
      required: true as true,
    },
    required: Boolean,
    validators: Array as PropType<Validator<T>[]>,
  };
}

function buildField(label: string, required: boolean, field: VNode, errors: string[]): VNode {
  return h('div', {
    class: 'form-field',
  }, [
    h('label', { class: ['field-label', { 'field-label-required': required }] }, label),
    field,
    h('p', { class: 'field-error' }, errors[0] || ''),
  ]);
}

function postlabel(label: string, node: VNode) {
  return h('label', null, [
    node,
    h('span', { class: 'field-label-post' }, label),
  ]);
}

export const TextField = defineComponent({
  props: defaultProps<string>(),
  setup(props) {
    return useFormField(props.name, {
      required: props.required,
      validators: props.validators,
    });
  },
  render() {
    return buildField(this.label, this.required, h('input', {
        type: 'text',
        name: this.name,
        value: this.modelValue,
        // required: this.required,
        onInput: (event: InputEvent) =>
          this.updateListener((event.target as HTMLInputElement).value),
        ...this.$attrs,
      }), this.errorMessages);
  },
});

interface Option {
  value: string;
  label: string;
}

export const RadioField = defineComponent({
  props: {
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    ...defaultProps<string>(),
  },
  setup(props) {
    return useFormField(props.name, {
      required: props.required,
      validators: props.validators,
    });
  },
  render() {
    return buildField(
      this.label,
      this.required,
      h(Fragment, null, this.options.map(option =>
        postlabel(option.label, h('input', {
          type: 'radio',
          name: this.name,
          value: option.value,
          checked: this.modelValue === option.value,
          onChange: (event: InputEvent) => {
            if ((event.target as HTMLInputElement).checked) {
              this.updateListener(option.value);
            }
          },
          // required: this.required,
          ...this.$attrs,
        })),
      )),
      this.errorMessages,
    );
  },
});
