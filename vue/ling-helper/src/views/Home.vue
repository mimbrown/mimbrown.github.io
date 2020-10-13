<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <InterlinearEditor />
    <p>{{ test }}</p>
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <!-- <icon name="connect" /> -->
    <TreeEditor :items="['mera', 'naam', 'Michael', 'hai']" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue';
// import Icon from '@/components/Icon.vue';
import TreeEditor from '@/components/TreeEditor.vue';
import InterlinearEditor from '@/components/InterlinearEditor.vue';

export default defineComponent({
  name: 'Home',
  components: {
    // HelloWorld,
    // Icon,
    TreeEditor,
    InterlinearEditor,
  },
  data() {
    return {
      test: ['mera', 'my'],
    };
  },
});
</script>
