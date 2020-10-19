<template>
  <svg class="tree-linker" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 24 24">
    <path :d="d" vector-effect="non-scaling-stroke"></path>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    count: {
      type: Number,
      required: true,
    },
    autoRoof: Boolean,
  },
  computed: {
    d(): string {
      if (this.autoRoof) {
        return 'M0,23L12,1L24,23Z';
      }
      const { count } = this;
      if (count === 1) {
        return 'M12,4V20';
      }
      let path = 'M0,23L12,1L24,23';
      if (count > 2) {
        path += 'Z';
      }
      return path;
    },
  },
});
</script>

<style>
.tree-linker {
  stroke-width: 1px;
  stroke: black;
  fill: none;
  height: 20px;
  width: 100%;
}
</style>
