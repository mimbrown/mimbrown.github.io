<template>
  <form class="metadata-form" @submit.prevent="submit">
    <h2>Response Metadata</h2>
    <TextField required name="entry.49175849" label="Age" :validators="[isNumber]" />
    <RadioField required name="entry.2019476581" label="Gender" :options="[
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
      { label: 'Prefer not to say', value: 'Prefer not to say' },
    ]" />
    <TextField name="entry.838661224" label="First Language" />
    <TextField name="entry.1707578616" label="Second Language(s)" />
    <p>
      <button :disabled="isSubmitting" type="submit">Submit</button>
    </p>
    <p v-if="formHasError" class="field-error" style="text-align:center">
      Please fix the above errors before submitting
    </p>
    <!-- <p v-if="badFormSubmission">
      <textarea v-if="badFormSubmission" :value="'data'"></textarea>
    </p> -->
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useFormContainer } from '@/modules/form';
import { TextField, RadioField } from '@/components/FormField';

function getFillLink(fields: { [key: string]: unknown }) {
  let str = '';
  for (const key in fields) {
    const value = fields[key];
    if (value !== undefined && value !== null && value !== '') {
      str += `&${key}=${value}`;
    }
  }
  return `https://docs.google.com/forms/d/e/1FAIpQLScmkj_dDRRomhiPTTH0JzBAvLCbpDBZxQmMa49FUUKVtf9cBQ/formResponse?usp=pp_url&submit=Submit${str}`;
}

// https://docs.google.com/forms/d/e/1FAIpQLScmkj_dDRRomhiPTTH0JzBAvLCbpDBZxQmMa49FUUKVtf9cBQ/viewform?usp=pp_url&entry.1196390563=sabzi&entry.2019476581=Male&entry.49175849=26&entry.1080730131=%5Bdata%5D&entry.838661224=English&entry.1707578616=Hindi,+Urdu

class BadFormSubmission extends Error {}

export default defineComponent({
  components: {
    TextField,
    RadioField,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const {
      values,
      formHasError,
      validateForm,
    } = useFormContainer();

    const isSubmitting = ref(false);
    // const badFormSubmission = ref(false);

    return {
      formHasError,
      isSubmitting,
      isNumber(text: string): string | undefined {
        const num = parseInt(text, 10);
        if (isNaN(num) || num <= 0) {
          return 'Invalid age';
        }
      },
      async submit() {
        isSubmitting.value = true;
        try {
          if (validateForm()) {
            const link = getFillLink({
              'entry.1196390563': props.projectId,
              'entry.1080730131': props.data,
              ...values,
            });
            const response = await fetch(link, { mode: 'no-cors' });
            if (response.status >= 400) {
              throw new BadFormSubmission(response.statusText);
            }
            emit('success');
          }
        } catch (err) {
          console.error(err);
          // badFormSubmission.value = true;
        } finally {
          isSubmitting.value = false;
        }
      },
    };
  },
});
</script>

<style>
.metadata-form {
  width: 100%;
  max-width: 600px;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
}
</style>
