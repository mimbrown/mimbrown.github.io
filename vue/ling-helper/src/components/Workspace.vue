<template>
  <div v-if="open" class="workspace-wrapper">
    <div class="workspace">
      <slot :model="model"></slot>
      <footer>
        <button @click="cancel">Cancel</button>
        <button @click="save">Save</button>
        <button @click="increment">Increment</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseStyle } from '@/models/Data';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    open: Boolean,
    modelValue: Object,
  },
  setup(props, context) {
    const model = ref({ ...props.modelValue });

    const close = () => {
      context.emit('update:open', false);
    };
    const save = () => {
      context.emit('update:modelValue', { ...model.value });
      close();
    };
    return {
      cancel: close,
      save,
      model,
      increment: () => {
        const [num] = (model.value as BaseStyle).fontSize.match(/\d+/) || ['12'];
        (model.value as BaseStyle).fontSize = `${parseInt(num, 10) + 2}px`;
      },
    };
  },
});
</script>

<style>
.workspace-wrapper {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.workspace {
  background-color: white;
  display: flex;
  flex-direction: column;
}
footer {
  display: flex;
  flex-direction: row-reverse;
  background-color: black;
  color: white;
  padding: 8px 16px;
}
</style>
