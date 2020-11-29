<template>
  <div class="card project-thumb">
    <div class="title multi-title">
      <div
        v-for="project of project.languages"
        :key="project.name"
        :class="project.name === currentTitle ? 'active' : 'inactive'"
      >
        {{ project.name }}
      </div>
    </div>
    <p class="subtitle">
      {{ numItems }} total items
      <br>
      about {{ timeEstimate }} minutes
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue';
import { ProjectDefinition } from '@/data/project';

function calcTime(numItems: number) {
  return Math.ceil(numItems * (numItems - 1) * (numItems - 2) / 72);
}

export default defineComponent({
  props: {
    project: {
      type: Object as PropType<ProjectDefinition>,
      required: true,
    }
  },
  setup(props) {
    const currentTitle = ref(props.project.languages[0].name);

    if (props.project.languages.length > 1) {
      let currentIndex = 0;
      let timer: number;
      onMounted(() => {
        timer = setInterval(() => {
          currentIndex = (currentIndex + 1) % props.project.languages.length;
          currentTitle.value = props.project.languages[currentIndex].name;
        }, 3000);
      });
      onUnmounted(() => {
        clearInterval(timer);
      });
    }

    const numItems = computed(() => props.project.languages[0].items.length);
    const timeEstimate = computed(() => calcTime(numItems.value));

    return {
      currentTitle,
      numItems,
      timeEstimate,
    };
  },
});
</script>

<style>
.project-thumb {
  margin: 8px;
}
</style>
