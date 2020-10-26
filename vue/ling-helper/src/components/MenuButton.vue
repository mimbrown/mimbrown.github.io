<template>
  <div class="menu-button-container">
    <button :class="['menu-button', { active }]" @click="activate" @mouseenter="maybeActivate">
      <slot></slot>
    </button>
    <div v-if="active" class="menu-button-options">
      <slot name="options"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    activateOnHover: Boolean,
    currentSelection: String,
    buttonKey: {
      type: String,
      required: true,
    },
  },
  computed: {
    active(): boolean {
      return this.buttonKey === this.currentSelection;
    },
  },
  methods: {
    activate(event?: Event) {
      if (event) {
        event.stopPropagation();
      }
      this.$emit('activate', this.buttonKey);
    },
    maybeActivate() {
      if (this.activateOnHover && this.currentSelection !== this.buttonKey) {
        this.activate();
      }
    },
  },
});
</script>

<style>
.menu-button.active {
  background-color: #EF5350;
  /* color: black; */
}
.menu-button-container {
  position: relative;
  font-size: 14px;
}
.menu-button-options {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: black;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 200px;
  padding: 4px 0;
}
.menu-button-options button {
  text-align: left;
  padding: 2px 16px;
}
.menu-button-options button:hover {
  background-color: #EF5350;
}
</style>
