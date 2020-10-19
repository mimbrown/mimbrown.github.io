<template>
  <div class="base text-editor" contenteditable @input="onInput" @keydown="handleKey"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Markup {
  type: 'b' | 'i';
  start: number;
  end: number;
}

function isInRange(a: number, b: number, c: number) {
  return a >= b && a <= c;
}

interface RichText {
  markup: Markup[];
  text: string;
}

export default defineComponent({
  props: {
    initialText: String,
    initialMarkup: Array,
    specialTab: Boolean,
    focus: Boolean,
  },
  data(props) {
    return {
      text: props.initialText || '',
      markup: props.initialMarkup || [],
    };
  },
  mounted() {
    this.$el.innerHTML = this.text;
  },
  methods: {
    onInput(e: InputEvent) {
      this.text = (e.target as HTMLDivElement).innerHTML;
      this.$emit('update:modelValue', this.text);
    },
    handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.$emit('next', e.shiftKey);
      } else if (e.key === 'Backspace' && this.text.length === 0) {
        e.preventDefault();
        this.$emit('delete');
      } else if (e.key === 'Tab' && this.specialTab) {
        e.preventDefault();
        this.$emit('tab', e.shiftKey);
      }
    },
    apply(markup: Markup) {
      let start: Markup | undefined;
      let end: Markup | undefined;
      let startIndex: number | undefined;
      let endIndex: number | undefined;
      const newMarkup: Markup[] = [];

      for (const own of this.markup as Markup[]) {
        let shouldAdd = true;
        if (markup.type === own.type) {
          if (isInRange(markup.start, own.start, own.end)) {
            start = own;
            shouldAdd = false;
          }
          if (isInRange(markup.end, own.start, own.end)) {
            end = own;
            shouldAdd = false;
          }
          if (markup.start < own.start && markup.end > own.end) {
            // If we are entirely spanned by markup, we just disappear.
            shouldAdd = false;
          }
        }
        if (shouldAdd) {
          newMarkup.push(own);
        }
      }
      if (start && end) {
        if (start === end) {
          // We are inside the same block. Undo formatting.
          // Fragment if we didn't get the whole range.
          if (start.start < markup.start) {
            newMarkup.push({
              type: markup.type,
              start: start.start,
              end: markup.start,
            });
          }
          if (end.end > markup.end) {
            newMarkup.push({
              type: markup.type,
              start: markup.end,
              end: end.end,
            });
          }
        } else {
          // We have different blocks, now joined
          newMarkup.push({
            type: markup.type,
            start: start.start,
            end: end.end,
          });
        }
      } else if (start) {
        // Extend start forwards
        newMarkup.push({
          type: markup.type,
          start: start.start,
          end: markup.end,
        });
      } else if (end) {
        // Extend end backwards
        newMarkup.push({
          type: markup.type,
          start: markup.start,
          end: end.end,
        });
      } else {
        // Brand new fresh
        newMarkup.push(markup);
      }
      this.markup = newMarkup;
    },
  },
  watch: {
    focus: {
      handler(val?: boolean, oldVal?: boolean) {
        if (!val !== !oldVal) {
          this.$nextTick(() => {
            (this.$el as HTMLDivElement)[val ? 'focus' : 'blur']();
          });
        }
      },
      immediate: true,
    },
  },
});
</script>

<style>
.text-editor {
  border: 1px solid black;
  padding: 2px 6px;
}
</style>
