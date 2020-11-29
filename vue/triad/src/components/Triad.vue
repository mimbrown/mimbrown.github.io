<template>
  <div class="triad">
    <p>Select the item that is most different from the other two</p>
    <div v-for="id of currentTriad" :key="`${id}-${progress}`" class="card triad-option" @click="differentiate(id)">
      <p class="title">{{ project.items[id] }}</p>
    </div>
    <p style="text-align:center;margin:0">{{ progress }}% complete</p>
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Project } from '@/data/project';

type Triad = [number, number, number];
type Duo = [number, number];
export type ResponseItem = [Duo, number];

function createTriads(items: string[]): Triad[] {
  const triads: Triad[] = [];
  const numItems = items.length;
  for (let i = 0; i < numItems - 2; i++) {
    for (let j = i + 1; j < numItems - 1; j++) {
      for (let k = j + 1; k < numItems; k++) {
        triads.push([i, j, k])
      }
    }
  }
  return triads;
}

function getRandomFrom<T>(array: T[]) {
  const index = Math.floor(Math.random() * array.length);
  const item = array[index];
  array.splice(index, 1);
  return item;
}

function randomizeOrder<T>(array: T[]) {
  return array.sort(() => Math.random() - 0.5);
}

function getNextItem(triad: Triad[]) {
  if (triad.length === 0) {
    return null;
  }
  return randomizeOrder(getRandomFrom(triad)) as Triad;
}

export default defineComponent({
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    }
  },
  setup(props, { emit }) {
    const triads = createTriads(props.project.items);

    const responses: ResponseItem[] = [];

    const progress = ref(0);

    const currentTriad = ref(getNextItem(triads)!);
    const nextTriad = () => {
      const next = getNextItem(triads);
      if (next) {
        currentTriad.value = next;
        progress.value = Math.round(responses.length * 100 / (responses.length + triads.length));
      } else {
        emit('completed', responses);
      }
    }

    return {
      currentTriad,
      progress,
      differentiate: (id: number) => {
        responses.push([
          currentTriad.value.filter(option => option !== id).sort() as Duo,
          id,
        ]);
        nextTriad();
      },
    };
  },
});
</script>

<style>
.triad {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 0 8px;
}
.triad-option {
  max-width: 400px;
  width: 100%;
  margin: 12px auto;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-bar-container {
  margin: 8px 24px;
  height: 8px;
  border-radius: 4px;
  background-color: whitesmoke;
  display: flex;
  overflow: hidden;
}
.progress-bar {
  background-color: lightgreen;
  transition: width 300ms;
}
</style>