<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <InterlinearEditor /> -->
    <!-- <p>{{ test }}</p> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <!-- <icon name="connect" /> -->
    <Tree />
    <Quill />
    <!-- <Canvas :text="text" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue';
// import Icon from '@/components/Icon.vue';
import Tree from '@/components/Tree.vue';
// import InterlinearEditor from '@/components/InterlinearEditor.vue';
// import Canvas from '@/components/Canvas.vue';
import Quill from '@/components/Quill.vue';

export default defineComponent({
  name: 'Home',
  components: {
    // HelloWorld,
    // Icon,
    Tree,
    // InterlinearEditor,
    // Canvas,
    Quill,
  },
  data() {
    return {
      text: 'NP<sub>POS</sub> This is a <b>test</b> <i><b>of</b> the emergency</i> <span style="font-variant: small-caps;">system</span>',
      test: ['mera', 'my'],
    };
  },
});
</script>
