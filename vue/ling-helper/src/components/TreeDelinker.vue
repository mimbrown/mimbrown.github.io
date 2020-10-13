<template>
  <div class="delink-node" @click="delinkNode">
    <Icon name="delete" :size="16"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  TreeNode, TreeNodeBase, Root, Leaf,
} from '@/models/Tree';
import Icon from '@/components/Icon.vue';

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    node: {
      required: true,
    },
  },
  methods: {
    delinkNode(): void {
      this.$emit('delink', this.node);
    },
  },
});
</script>

<style>
.delink-node {
  opacity: 0;
}
.delink-node:hover {
  opacity: 1;
}
</style>
