<template>
  <div class="interlinear-editor">
    <TextStackEditor
      v-for="(item, index) of items"
      :key="item.id"
      :initialStack="item.stack"
      :classes="classes"
      :ref="`stack${index}`"
      @next="handleNext(index, $event)"
      @tab="handleTab(index, $event)"
      @delete="handleDelete(index, $event)"
    />
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent } from 'vue';
import uuid from '@/util/uuid';
import TextStackEditor from './TextStackEditor.vue';

export default defineComponent({
  components: {
    TextStackEditor,
  },
  data() {
    return {
      items: [{
        id: uuid(),
        stack: Array(2).fill('') as string[],
      }],
      classes: ['ok', 'two'],
    };
  },
  methods: {
    buildItem() {
      return {
        id: uuid(),
        stack: Array(this.classes.length).fill(''),
      };
    },
    handleNext(index: number, reverse: boolean): void {
      const newIndex = index + (reverse ? -1 : 1);
      const child = this.$refs[`stack${newIndex}`] as ComponentPublicInstance<typeof TextStackEditor> | undefined;
      if (child) {
        child.goTo(reverse ? this.classes.length - 1 : 0);
      } else {
        this.items[reverse ? 'unshift' : 'push'](this.buildItem());
        this.$nextTick(() => {
          this.handleNext(index, reverse);
        });
      }
    },
    handleTab(stackIndex: number, { index, reverse }: { index: number; reverse: boolean }): void {
      const newIndex = stackIndex + (reverse ? -1 : 1);
      const child = this.$refs[`stack${newIndex}`] as ComponentPublicInstance<typeof TextStackEditor> | undefined;
      if (child) {
        child.goTo(index);
      } else {
        this.items[reverse ? 'unshift' : 'push'](this.buildItem());
        this.$nextTick(() => {
          this.handleTab(stackIndex, { index, reverse });
        });
      }
    },
    handleDelete(stackIndex: number, index: number) {
      if (this.items.length > 1) {
        this.items.splice(stackIndex, 1);
        const child = (this.$refs[`stack${stackIndex - 1}`] || this.$refs.stack0) as ComponentPublicInstance<typeof TextStackEditor>;
        child.goTo(index);
      }
    },
  },
});
</script>

<style>
.interlinear-editor {
  display: flex;
  gap: 5px;
}
</style>
