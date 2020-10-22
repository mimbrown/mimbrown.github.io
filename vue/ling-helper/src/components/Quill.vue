<template>
  <div style="min-width:40px;display: flex;">
    <div ref="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Quill, { QuillOptionsStatic } from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    quill: Quill;
  }
}

const defaultOptions: QuillOptionsStatic = {
  theme: 'snow',
  // boundary: document.body,
  modules: {
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],
    //   ['blockquote', 'code-block'],
    //   [{ header: 1 }, { header: 2 }],
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ script: 'sub' }, { script: 'super' }],
    //   [{ indent: '-1' }, { indent: '+1' }],
    //   [{ direction: 'rtl' }],
    //   [{ size: ['small', false, 'large', 'huge'] }],
    //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //   [{ color: [] }, { background: [] }],
    //   [{ font: [] }],
    //   [{ align: [] }],
    //   ['clean'],
    //   ['link', 'image', 'video'],
    // ],
    toolbar: false,
  },
  placeholder: 'Insert text here ...',
  readOnly: false,
};

// Quill.register

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  mounted() {
    // Instance
    this.quill = new Quill(this.$refs.editor as Element, defaultOptions);

    this.quill.enable(false);
    // Set editor content
    this.quill.pasteHTML(this.modelValue);
    // Disabled editor
    this.quill.enable(true);
    // if (!this.disabled) {
    // }
    // this.quill.getSelection
    // Mark model as touched if editor lost focus
    this.quill.on('selection-change', (range: unknown) => {
      if (!range) {
        this.$emit('blur', this.quill);
      } else {
        this.$emit('focus', this.quill);
      }
    });
    // Update model if text changes
    this.quill.on('text-change', () => {
      let html = (this.$refs.editor as HTMLDivElement).children[0].innerHTML;
      // const text = this.quill.getText()
      if (html === '<p><br></p>') html = '';
      this.$emit('update:modelValue', html);
      // this._content = html
      // this.$emit('input', this._content)
      // this.$emit('change', { html, text, quill })
    });
    // Emit ready event
    // this.$emit('ready', this.quill)
  },
});
</script>

<style>

</style>
