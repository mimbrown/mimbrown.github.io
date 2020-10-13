<template>
  <AppHeader />
  <input v-model="fontName" />
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';
import AppHeader from '@/components/AppHeader.vue';

const wrap = (text: string) => (text.includes(' ') ? `'${text}'` : text);

export default defineComponent({
  components: {
    AppHeader,
  },
  setup() {
    const tag = document.createElement('style');
    const fontName = ref('Arial');
    const tagString = computed(
      () => `@font-face {font-family:BaseFont;src:local("${fontName.value}");}.base {font-family:BaseFont;}`,
    );
    watch(tagString, (value) => {
      if (fontName.value) {
        tag.innerText = value;
      }
    }, {
      immediate: true,
    });

    return {
      fontName,
      tag,
    };
  },
  created() {
    // document.head.appendChild(this.tag);
  },
});
</script>

<style>
#app {
  font-family: system-ui;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
