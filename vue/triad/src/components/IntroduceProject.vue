<template>
  <div class="acknowledgement">
    <h3>Public Data Notice</h3>
    <p>
      Any responses that you submit through this site are public data and will be publicly viewable. In addition to the triad selections, you will be required to input your age and gender before you can submit your response. All other metadata is encouraged but not required.
    </p>
    <p>
      You may view all the data, including your own responses, in <a href="https://docs.google.com/spreadsheets/d/1_m8_KfPFjZ4wEeNlpyTuG3FStZqzYzdow4BlVTQEKmE/edit#gid=2053338738" target="_blank">this Google Sheet</a>. The data is added to this sheet through an auto-filled Google Form. Aside from the data in the Google Sheet and any data collected internally by Google Forms, no other data is collected on respondents.
    </p>
    <p>
      By clicking BEGIN, you indicate that you have understood the above data policy.
    </p>
    <template v-if="projectOptions.length > 1">
      <h3>Choose a Language</h3>
      <div class="language-options">
        <button
          v-for="(proj, index) of projectOptions"
          :key="proj.name"
          :class="{ lang: true, active: selectedProject === index }"
          :style="{ font: proj.font || null }"
          @click="selectedProject = index"
        >
          {{ proj.name }}
        </button>
      </div>
    </template>
    <p>
      <button :disabled="selectedProject < 0" @click="acknowledge">BEGIN</button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, ref } from 'vue';
import projects from '@/data/project';

export default defineComponent({
  props: {
    projectId: {
      type: String,
      required: true,
    }
  },
  setup(props, { emit }) {
    const project = projects.find(p => p.id === props.projectId);
    if (!project) {
      return () => h('p', `404: Unable to find project with ID '${props.projectId}'`);
    }
    const projectOptions = ref(project.languages);
    const selectedProject = ref(projectOptions.value.length === 1 ? 0 : -1);

    return {
      projectOptions,
      selectedProject,
      acknowledge() {
        emit('acknowledged', project.languages[selectedProject.value]);
      },
    };
  },
});
</script>

<style>
.acknowledgement {
  padding: 0 8px;
  flex: 1;
  overflow-y: auto;
}
.language-options {
  display: flex;
  justify-content: center;
}
.lang {
  display: block;
  margin: 0 8px;
  padding: 8px 12px;
}
.lang.active {
  background-color: lightblue;
}
</style>