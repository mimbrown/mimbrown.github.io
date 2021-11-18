<template>
  <div class="projects">
    <div class="project-wrap" v-for="project of projects" :key="project.id">
      <ProjectThumb :project="project" @click="goTo(project.id)" />
      <router-link role="button" :to="`/results/${project.id}`">View Results</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import projects from '@/data/project';
import ProjectThumb from '@/components/ProjectThumb.vue';

export default defineComponent({
  components: {
    ProjectThumb,
  },
  setup() {
    const router = useRouter();

    return {
      projects,
      goTo(id: string) {
        router.push(`/project/${id}`);
      }
    };
  },
});
</script>

<style>
.projects {
  display: flex;
  justify-content: center;
  padding: 8px;
}
.project-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
}
</style>
