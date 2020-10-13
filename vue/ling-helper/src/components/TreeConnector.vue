<template>
  <div @click="connectNodes">
    <Icon :name="iconName"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TreeNode, TreeNodeBase } from '@/models/Tree';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  components: {
    Icon,
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
    iconName(): string {
      return this.children.length > 1 ? 'connect' : 'connectSingle';
    },
  },
  methods: {
    connectNodes(): void {
      const newNode = new TreeNode('NP', this.children as TreeNodeBase[]);
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

</style>
