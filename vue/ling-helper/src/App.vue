<template>
  <AppHeader />
  <!-- <input v-model="fontName" /> -->
  <button @click="editingBaseStyles = true">Edit Document Styles</button>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <p><RelativeTimer :style="baseStyle" :baseDate="Date.now()" /></p>
  <div v-if="snackbars.length > 0" class="snackbar-container">
    <div v-for="snackbar of snackbars" :key="snackbar.message" class="snackbar">
      {{ snackbar.message }}
    </div>
  </div>
  <Workspace v-model:open="editingBaseStyles" v-model="baseStyle" #default="{ model }">
    <!-- <BaseStyleForm v-model="baseStyle" /> -->
    <form style="display:flex;flex-direction:column;padding:10px">
      <h2>Base Styles</h2>
      <input v-model="model.fontFamily" />
      <input v-model="model.fontSize" />
    </form>
    <input :style="model" value="Sample text" />
  </Workspace>
</template>

<script lang="ts">
import {
  computed, defineComponent, provide, ref, watch,
} from 'vue';
import { BaseStyle } from '@/models/Data';
import { Snackbar } from '@/models/Snackbar';
import '@/styles/button.css';
import AppHeader from '@/components/AppHeader.vue';
import BaseStyleForm from '@/components/BaseStyleForm.vue';
import RelativeTimer from '@/components/RelativeTimer.vue';
import Workspace from '@/components/Workspace.vue';

const wrap = (text: string) => (text.includes(' ') ? `'${text}'` : text);

export default defineComponent({
  components: {
    AppHeader,
    RelativeTimer,
    Workspace,
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

    const editingBaseStyles = ref(false);
    const baseStyle = ref<BaseStyle>({
      fontSize: '14px',
      fontFamily: 'Arial',
    });
    provide('baseStyle', baseStyle);

    const snackbars = ref<Snackbar[]>([]);

    provide('addSnackbar', (snackbar: Snackbar) => {
      const { duration } = snackbar;
      snackbars.value.push(snackbar);
      if (duration !== Number.POSITIVE_INFINITY) {
        setTimeout(() => {
          snackbars.value.splice(snackbars.value.indexOf(snackbar), 1);
        }, duration || 4000);
      }
    });

    return {
      baseStyle,
      fontName,
      snackbars,
      tag,
      editingBaseStyles,
    };
  },
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

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

.snackbar-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}
.snackbar {
  margin-top: 10px;
  background-color: black;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  animation: fadein 300ms forwards;
}
</style>
