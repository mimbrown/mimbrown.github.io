<script lang="ts">
import {
  defineComponent, Fragment, h, PropType, reactive, ref,
} from 'vue';
import {
  buildGridArea, Leaf, NodeJSON, Root, TreeNode, TreeNodeBase,
} from '@/models/Tree';

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<NodeJSON[]>,
      required: true,
    },
  },
  setup(props) {
    const root = Root.fromJSON(props.modelValue);
    const totalLevels = ref(0);

    function updateRoot() {
      totalLevels.value = root.calculateSpatial(root, 0);
    }
    updateRoot();

    return {
      root,
      updateRoot,
      totalLevels,
    };
  },
  methods: {
    done(): void {
      this.$emit('update:modelValue', this.root.toJSON());
    },
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
    for (const child of this.root.render(this.totalLevels, this)) {
      children.push(child);
    }
    // const numAdds = this.root.width / 2 - 1;
    // const totalBlocks = this.root.blockWidth;
    // const level = this.totalLevels * 3;
    // for (let i = 0; i <= totalBlocks; i++) {
    //   children.push(
    //     h('div', {
    //       style: {
    //         gridArea: buildGridArea(
    //           level, 1,
    //           i * 3 + 1, 1,
    //         ),
    //       },
    //     }, h(Icon, { name: 'add', size: 16 })),
    //   );
    // }
    return h(Fragment, [
      h('div', {
        class: 'tree-actions',
      }, [
        h('button', {
          onClick: this.done,
        }, 'Done'),
      ]),
      h('div', {
        class: 'tree-editor',
      }, children),
    ]);
  },
});
</script>

<style>
.tree-editor {
  display: grid;
  align-self: flex-end;
  gap: 2px;
  grid-auto-columns: min-content;
  grid-auto-rows: min-content;
  justify-items: stretch;
  align-items: stretch;
}
.tree-editor .svg-path {
  width: 100%;
  height: 30px;
}
</style>
