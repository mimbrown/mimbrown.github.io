<template>
  <h2>Projects</h2>
  <Projects />
  <!-- <h2>Responses</h2>
  <Responses /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useRouter } from 'vue-router';
// import projects from '@/data/project';
import Projects from '@/components/Projects.vue';
// import Responses from '@/components/Responses.vue';

export default defineComponent({
  components: {
    Projects,
    // Responses,
  },
  // setup() {
  //   const router = useRouter();

  //   return {
  //     projects,
  //     calcTime(numItems: number) {
  //       const seconds = 5 * numItems * (numItems - 1) * (numItems - 2) / 6;
  //       return Math.ceil(seconds / 60);
  //     },
  //     goTo(index: number) {
  //       router.push(`/project/${index}`)
  //     },
  //   };
  // },
});
</script>

<style>

</style>
