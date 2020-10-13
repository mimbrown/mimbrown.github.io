<template>
  <header>
    <button @click="setBold"><b>B</b></button>
    <button @click="setItalic"><i>I</i></button>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    applyMarkup(tag: string): void {
      // const selection = getSelection();
      // if (selection) {
      //   const range = selection.getRangeAt(0);
      //   if (range.startContainer === range.endContainer) {
      //   }
      //   const innerElement = range.cloneContents();
      //   const newElement = document.createElement(tag);
      //   newElement.append(innerElement);
      //   range.deleteContents();
      //   range.insertNode(newElement);
      // }
      document.execCommand(tag);
    },
    // is(node: HTMLElement, tag: string): boolean {

    // },
    setBold(): void {
      this.applyMarkup('bold');
    },
    setItalic(): void {
      this.applyMarkup('italic');
    },
  },
});
</script>

<style>
header {
  position: sticky;
  top: 0;
}
</style>
