<template>
  <div :class="['tree', { 'edit-mode': isEditing }]">
    <TreeEditor v-if="isEditing" :modelValue="model" @update:modelValue="finishEdit" />
    <template v-else>
      <div class="tree-actions">
        <button @click="isEditing = true">Edit</button>
        <button @click="addSnackbar({ message: 'Exported!' })">Export</button>
        <button>Copy</button>
      </div>
      <TreeCanvas :nodes="model" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NodeJSON } from '@/models/Tree';
import TreeCanvas from '@/components/TreeCanvas.vue';
import TreeEditor from '@/components/TreeEditor.vue';

export default defineComponent({
  components: {
    TreeCanvas,
    TreeEditor,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data(props) {
    let model: NodeJSON[];
    const saved = localStorage.getItem('app-testtree');
    return {
      isEditing: props.edit,
      model: saved ? JSON.parse(saved) as NodeJSON[] : [{ text: '' }],
    };
  },
  inject: ['addSnackbar'],
  methods: {
    finishEdit(model: NodeJSON[]) {
      this.model = model;
      localStorage.setItem('app-testtree', JSON.stringify(model));
      this.isEditing = false;
    },
  },
});
</script>

<style>
.tree {
  display: flex;
}
.tree.edit-mode {
  min-height: 400px;
}
</style>
