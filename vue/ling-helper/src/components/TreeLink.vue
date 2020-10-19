<template>
  <div class="tree-link">
    <TreeLinkPath :count="nodes.length" :autoRoof="autoRoof" />
    <template v-if="nodes.length > 1">
      <button class="delink-node delink-first" @click="delinkNode(false)">
        <Icon name="delete" :size="16"/>
      </button>
      <button class="delink-node delink-last" @click="delinkNode(true)">
        <Icon name="delete" :size="16"/>
      </button>
    </template>
    <button v-else class="delink-node" @click="delinkNode(false)">
      <Icon name="delete" :size="16"/>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  TreeNode, TreeNodeBase, Root, Leaf,
} from '@/models/Tree';
import TreeLinkPath from '@/components/TreeLinkPath.vue';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  components: {
    Icon,
    TreeLinkPath,
  },
  props: {
    nodes: {
      type: Array,
      required: true,
    },
    autoRoof: Boolean,
  },
  methods: {
    delinkNode(isLast: boolean): void {
      this.$emit('delink', this.nodes[isLast ? this.nodes.length - 1 : 0]);
    },
  },
});
</script>

<style>
.tree-link {
  position: relative;
}
.delink-node {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  opacity: 0;
}
.delink-node:hover {
  opacity: 1;
}
.delink-first {
  right: 50%;
}
.delink-last {
  left: 50%;
}
</style>
