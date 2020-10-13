<template>
  <div class="text-stack-editor">
    <TextEditor
      v-for="(text, index) of stack"
      :key="index"
      v-model="stack[index]"
      specialTab
      class="text-stack-row"
      @next="handleNext(index, $event)"
      @delete="handleDelete(index)"
      @tab="handleTab(index, $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TextEditor from './TextEditor.vue';

export default defineComponent({
  props: {
    classes: {
      type: Array,
      required: true,
    },
    initialStack: Array,
  },
  data(props) {
    return {
      stack: (props.initialStack as string[]) || Array(props.classes.length).fill(''),
    };
  },
  methods: {
    handleNext(index: number, reverse: boolean): void {
      const newIndex = index + (reverse ? -1 : 1);
      if (!this.goTo(newIndex)) {
        this.$emit('next', reverse);
      }
    },
    handleTab(index: number, reverse: boolean): void {
      this.$emit('tab', { index, reverse });
    },
    handleDelete(index: number): void {
      if (this.isEmpty()) {
        this.$emit('delete', index);
      }
    },
    goTo(index: number, toStart?: boolean): boolean {
      const child = this.$el.children[index] as HTMLDivElement | undefined;
      if (child) {
        child.focus();
        const range = document.createRange();
        range.selectNodeContents(child);
        range.collapse(toStart);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      }
      return false;
    },
    isEmpty(): boolean {
      for (const text of this.stack) {
        if (text.length > 0) {
          return false;
        }
      }
      return true;
    },
  },
  components: {
    TextEditor,
  },
});
</script>

<style>
.text-stack-editor {
  margin-left: 10px;
  text-align: start;
}
.text-stack-row {
  min-width: 20px;
}
.text-stack-row:not(:first-child) {
  border-top: none;
}
</style>
