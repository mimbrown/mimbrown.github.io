<template>
  <div class="tree-connector" @click="connectNodes">
    <TreeLinkPath :count="children.length" :autoRoof="autoRoof"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Leaf, TreeNode, TreeNodeBase } from '@/models/Tree';
import TreeLinkPath from '@/components/TreeLinkPath.vue';

export default defineComponent({
  components: {
    TreeLinkPath,
  },
  props: {
    children: {
      type: Array,
      required: true,
    },
    parent: {
      type: TreeNode,
      required: true,
    },
  },
  computed: {
    autoRoof(): boolean {
      return this.children.length > 1 && this.children.every((child) => child instanceof Leaf);
    },
  },
  methods: {
    connectNodes(): void {
      const newNode = new TreeNode('', this.children as TreeNodeBase[]);
      newNode.focus = true;
      const newChildren = [];
      let added = false;
      for (const child of this.parent.children) {
        if (!newNode.children.includes(child)) {
          newChildren.push(child);
        } else if (!added) {
          added = true;
          newChildren.push(newNode);
        }
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.parent.children = newChildren;
      this.$emit('refresh');
    },
  },
});
</script>

<style>
.tree-connector {
  opacity: 0.2;
}
.tree-connector:hover {
  opacity: 1;
}
</style>
