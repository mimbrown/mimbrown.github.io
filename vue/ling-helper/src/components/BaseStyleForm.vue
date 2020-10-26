<template>
  <form>
    <select v-model="model.fontFamily">
      <option v-for="font of fonts" :key="font" :style="{ fontFamily: font }">{{ font }}</option>
    </select>
    <input v-model="model.fontSize" />
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import { BaseStyle } from '@/models/Data';

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<BaseStyle>,
      required: true,
    },
  },
  setup(props) {
    const model = reactive<BaseStyle>(props.modelValue);
    console.log(model);

    const fonts = [
      'Arial',
      'Bookman',
      'Courier',
      'Courier New',
      'Garamond',
      'Georgia',
      'Palatino',
      'Tahoma',
      'Times',
      'Times New Roman',
      'Trebuchet MS',
      'Verdana',
    ];

    return {
      fonts,
      model,
    };
  },
});
</script>

<style>

</style>
