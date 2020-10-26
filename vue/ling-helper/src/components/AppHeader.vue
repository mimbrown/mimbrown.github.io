<template>
  <header @click="deselect">
    <MenuButton
      buttonKey="file"
      :currentSelection="currentSelection"
      :activateOnHover="hasActive"
      @activate="activate"
    >
      File
      <template #options>
        <button @click="open">New Document</button>
        <button @click="open">Open...</button>
        <button @click="save">Save</button>
        <button @click="saveAs">Save as...</button>
      </template>
    </MenuButton>
    <MenuButton
      buttonKey="format"
      :currentSelection="currentSelection"
      :activateOnHover="hasActive"
      @activate="activate"
    >
      Format
      <template #options>
        <button @click="open">Document Styles</button>
        <button @click="open">Interlinear Settings</button>
        <button @click="open">Tree Settings</button>
      </template>
    </MenuButton>
    <MenuButton
      buttonKey="view"
      :currentSelection="currentSelection"
      :activateOnHover="hasActive"
      @activate="activate"
    >
      View
      <template #options>
        <button @click="open">New Document</button>
        <button @click="open">Open...</button>
        <button @click="save">Save</button>
        <button @click="saveAs">Save as...</button>
      </template>
    </MenuButton>
    <RelativeTimer :baseDate="Date.now()" />
  </header>
  <div class="mask" v-if="hasActive" @click="deselect"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MenuButton from '@/components/MenuButton.vue';
import RelativeTimer from '@/components/RelativeTimer.vue';

interface FilePickerOptions {
  multiple?: boolean;
  types?: {
    description: string;
    accept: {
      [buttonKey: string]: string[];
    };
  }[];
}

declare global {
  interface Window {
    showOpenFilePicker?: (options?: FilePickerOptions) => Promise<{ getFile(): Blob }[]>;
    showSaveFilePicker?: (options?: FilePickerOptions) => Promise<{ getFile(): Blob }[]>;
  }
}

const types = [{
  description: 'Ling Helper Data',
  accept: {
    'text/json': ['.lhdata'],
  },
}];

export default defineComponent({
  components: {
    MenuButton,
    RelativeTimer,
  },
  data() {
    return {
      currentSelection: null as string | null,
    };
  },
  computed: {
    hasActive(): boolean {
      return !!this.currentSelection;
    },
  },
  methods: {
    activate(buttonKey: string) {
      this.currentSelection = this.currentSelection === buttonKey ? null : buttonKey;
    },
    deselect(): void {
      this.currentSelection = null;
    },
    async open(): Promise<void> {
      if (window.showOpenFilePicker) {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            multiple: false,
            types,
          });
          const file = await fileHandle.getFile();
          const contents = await file.text();
          debugger;
        } catch (e) {
          // Nothing to do here
        }
      }
    },
    async save() {
      if (window.showSaveFilePicker) {
        try {
          const [fileHandle] = await window.showSaveFilePicker({
            types,
          });
          const file = await fileHandle.getFile();
          const contents = await file.text();
          debugger;
        } catch (e) {
          // Nothing to do here
        }
      }
    },
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
  z-index: 10;
  background-color: black;
  color: white;
  display: flex;
  padding: 0 8px;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
}
</style>
