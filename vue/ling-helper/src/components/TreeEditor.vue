<script lang="ts">
import {
  defineComponent, h, reactive, ref,
} from 'vue';
import {
  buildGridArea, Leaf, Root, TreeNode, TreeNodeBase,
} from '@/models/Tree';
import Icon from './Icon.vue';

export default defineComponent({
  props: {
    items: Array,
  },
  setup(props) {
    const root = new Root(
      '',
      (props.items as string[]).map((text) => new Leaf(text)),
    );
    const totalLevels = ref(0);

    function updateRoot() {
      totalLevels.value = root.calculateSpatial(0);
    }
    updateRoot();

    return {
      root,
      updateRoot,
      totalLevels,
    };
  },
  methods: {
    refresh(): void {
      this.updateRoot();
      this.$forceUpdate();
    },
    delink(node: TreeNodeBase): void {
      const path = this.root.findNode(node);
      if (!path) {
        return;
      }
      path.pop();
      const parent = path.pop() as TreeNode;
      const grandparent = path.pop() || this.root;
      if (parent.children[0] === node) {
        parent.children.shift();
        const insert = (grandparent as TreeNode).children.indexOf(parent);
        (grandparent as TreeNode).children.splice(
          insert,
          parent.children.length === 0 ? 1 : 0,
          node,
        );
      } else if (parent.children[parent.children.length - 1] === node) {
        parent.children.pop();
        let insert = (grandparent as TreeNode).children.indexOf(parent);
        let toDelete;
        if (parent.children.length === 0) {
          toDelete = 1;
        } else {
          toDelete = 0;
          insert += 1;
        }
        (grandparent as TreeNode).children.splice(
          insert,
          toDelete,
          node,
        );
      }
      this.refresh();
    },
  },
  render() {
    const children = [];
    for (const child of this.root.render(0, this.totalLevels, this)) {
      children.push(child);
    }
    const totalBlocks = this.root.blockWidth;
    const level = this.totalLevels * 2;
    for (let i = 0; i <= totalBlocks; i++) {
      children.push(
        h('div', {
          style: {
            gridArea: buildGridArea(
              level, 1,
              i * 2 + 1, 1,
            ),
          },
        }, h(Icon, { name: 'add', size: 16 })),
      );
    }
    return h('div', {
      class: 'tree-builder',
    }, h('div', {
      class: 'tree-editor',
    }, children));
  },
});
</script>

<style>
.tree-builder {
  display: flex;
  min-height: 400px;
  align-items: flex-end;
}
.tree-editor {
  display: grid;
  gap: 1px 5px;
  grid-auto-columns: min-content;
  grid-auto-rows: min-content;
  align-items: center;
}
</style>
