<template>
  <svg class="icon" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" stroke="black">
    <path :d="d"></path>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const iconNames: { [key: string]: string } = {
  add: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  connect: 'M1,21L12,1L23,21L21,23L12,5L3,23L1,21Z',
  connectSingle: 'M10.5,1V23H13.5V1Z',
  delete: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
};

export default defineComponent({
  props: {
    path: String,
    name: String,
    size: {
      type: Number,
      default: 24,
    },
  },
  computed: {
    d(): string {
      return this.path || iconNames[this.name || ''] || '';
    },
  },
});
</script>

<style>
/* .icon {
  width: 24px;
  height: 24px;
} */
</style>
