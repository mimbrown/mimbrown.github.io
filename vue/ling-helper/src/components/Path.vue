<template>
  <svg class="svg-path" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 24 24">
    <path :d="d" vector-effect="non-scaling-stroke"></path>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    d: String,
  },
});
</script>

<style>
.svg-path {
  stroke-width: 1px;
  stroke: black;
  fill: none;
}
</style>
