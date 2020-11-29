<template>
  <IntroduceProject v-if="state === 'intro'" :projectId="projectId" @acknowledged="startProject" />
  <Triad v-else-if="state === 'main'" :project="project" @completed="completeTriads" />
  <ResponseMetadata v-else-if="state === 'metadata'" :projectId="projectId" :data="dataString" @success="submitProject" />
  <ThankYou v-else />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Project } from '@/data/project';
import IntroduceProject from '@/components/IntroduceProject.vue';
import Triad, { ResponseItem } from '@/components/Triad.vue';
import ResponseMetadata from '@/components/ResponseMetadata.vue';
import ThankYou from '@/components/ThankYou.vue';
import { useRoute } from 'vue-router';

type State = 'intro' | 'main' | 'metadata' | 'thankYou';

export default defineComponent({
  components: {
    IntroduceProject,
    Triad,
    ResponseMetadata,
    ThankYou,
  },
  setup() {
    const route = useRoute();
    const projectId = ref((route.params as { id: string }).id);

    const state = ref<State>('intro');
    const project = ref<Project | null>(null);

    const dataString = ref('');

    return {
      startProject(proj: Project) {
        project.value = proj;
        state.value = 'main';
      },
      completeTriads(responses: ResponseItem[]) {
        dataString.value = JSON.stringify(responses);
        state.value = 'metadata';
      },
      submitProject() {
        state.value = 'thankYou';
      },
      dataString,
      project,
      projectId,
      state,
    };
  },
});
</script>

<style>

</style>