import { VNode, h, ComponentPublicInstance } from 'vue';
import uuid from '@/util/uuid';
import TreeConnector from '@/components/TreeConnector.vue';
import TreeLink from '@/components/TreeLink.vue';
import TextEditor from '@/components/TextEditor.vue';
import Icon from '@/components/Icon.vue';

type TreeEditorInstance = ComponentPublicInstance<
  {}, {}, {}, {}, { refresh(): void; delink(node: TreeNodeBase): void }
>;

export function buildGridArea(row: number, height: number, column: number, width: number) {
  return `${row} / ${column} / ${row + height} / ${column + width}`;
}

function midpoint(a: TreeNodeBase, b: TreeNodeBase): { column: number; width: number } {
  const column = a.column + a.width / 2;
  const width = b.column + b.width / 2 - column;
  return { column, width };
}

export abstract class TreeNodeBase {
  row!: number;

  column!: number;

  width!: number;

  parent!: TreeNodeBase | null;

  blockWidth!: number;

  id: string;

  focus: boolean | undefined;

  constructor() {
    this.id = uuid();
  }

  abstract buildVNode(gridArea: string): VNode;

  abstract getAbsoluteRow(totalLevels: number): number;

  abstract toJSON(): object;

  * render(totalLevels: number, editor: TreeEditorInstance): Generator<VNode> {
    const row = this.getAbsoluteRow(totalLevels);
    yield this.buildVNode(
      buildGridArea(row, 1, this.column, this.width),
    );
    delete this.focus;
    yield h(TreeConnector, {
      children: [this],
      parent: this.parent as TreeNode,
      style: {
        gridArea: buildGridArea(row - 1, 1, this.column, this.width),
      },
      onRefresh: editor.refresh,
    });
  }

  calculateSpatial(parent: TreeNode | null, level: number): number {
    this.parent = parent;
    this.row = level * 3;
    return level;
  }
}

export class Leaf extends TreeNodeBase {
  text: string;

  blockWidth = 1;

  constructor(text: string) {
    super();
    this.text = text;
  }

  buildVNode(gridArea: string): VNode {
    return h(TextEditor, {
      initialText: this.text,
      key: this.id,
      focus: this.focus,
      style: { gridArea },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getAbsoluteRow(totalLevels: number) {
    return totalLevels * 3;
  }

  calculateSpatial(parent: TreeNode, level: number): number {
    super.calculateSpatial(parent, level);
    this.width = 2;
    return level;
  }

  toJSON() {
    return {
      text: this.text,
    };
  }

  * render(totalLevels: number, editor: TreeEditorInstance) {
    yield* super.render(totalLevels, editor);
    const row = this.getAbsoluteRow(totalLevels);
    yield h('div', {
      style: {
        gridArea: buildGridArea(
          row, 1,
          this.column + 2, 2,
        ),
      },
    }, h(Icon, { name: 'add', size: 16 }));
    if (this.column === 3) {
      yield h('div', {
        style: {
          gridArea: buildGridArea(
            row, 1,
            this.column - 2, 2,
          ),
        },
      }, h(Icon, { name: 'add', size: 16 }));
    }
  }
}

export class TreeNode extends TreeNodeBase {
  text: string;

  children: TreeNodeBase[];

  constructor(text: string, children: TreeNodeBase[]) {
    super();
    this.text = text;
    this.children = children;
  }

  buildVNode(gridArea: string): VNode {
    return h(TextEditor, {
      initialText: this.text,
      key: this.id,
      focus: this.focus,
      style: { gridArea },
      'onUpdate:modelValue': (value: string) => {
        this.text = value;
      },
    });
  }

  getAbsoluteRow() {
    return this.row;
  }

  toJSON(): object {
    return {
      text: this.text,
      children: this.children.map((child) => child.toJSON()),
    };
  }

  calculateSpatial(parent: TreeNode, level: number): number {
    super.calculateSpatial(parent, level);
    const nextLevel = level + 1;
    let maxLevel = nextLevel;
    let currentColumn = this.column;
    let totalBlockWidth = 0;
    for (const child of this.children) {
      child.column = currentColumn;
      maxLevel = Math.max(child.calculateSpatial(this, nextLevel), maxLevel);
      currentColumn += child.blockWidth * 4;
      totalBlockWidth += child.blockWidth;
    }
    this.blockWidth = totalBlockWidth;
    const firstChild = this.children[0];
    const lastChild = this.children[this.children.length - 1];
    if (firstChild === lastChild) {
      this.column = firstChild.column;
      this.width = firstChild.width;
    } else {
      const { column, width } = midpoint(firstChild, lastChild);
      this.column = column;
      this.width = width;
    }
    return maxLevel;
  }

  * render(totalLevels: number, editor: TreeEditorInstance) {
    yield* super.render(totalLevels, editor);

    yield h(TreeLink, {
      nodes: this.children,
      autoRoof: this.children.length > 1 && this.children.every((child) => child instanceof Leaf),
      style: {
        gridArea: buildGridArea(
          this.row + 1, 1,
          this.column, this.width,
        ),
      },
      onDelink: editor.delink,
    });

    for (const child of this.children) {
      yield* child.render(totalLevels, editor);
    }
  }

  findNode(node: TreeNodeBase, path: TreeNodeBase[] = []): TreeNodeBase[] | null {
    for (const child of this.children) {
      path.push(child);
      if (child === node) {
        return path;
      }
      if (child instanceof TreeNode) {
        const found = child.findNode(node, path);
        if (found) {
          return found;
        }
      }
      path.pop();
    }
    return null;
  }
}

export interface NodeJSON {
  text: string;
  children?: NodeJSON[];
}

function parseChildren(nodes: NodeJSON[]): TreeNodeBase[] {
  return nodes.map((node) => {
    if (node.children) {
      return new TreeNode(node.text, parseChildren(node.children));
    }
    return new Leaf(node.text);
  });
}

export class Root extends TreeNode {
  static fromJSON(nodes: NodeJSON[]): Root {
    return new Root('', parseChildren(nodes));
  }

  calculateSpatial(parent: TreeNode, level: number): number {
    this.column = 3;
    const toRet = super.calculateSpatial(parent, level);
    this.parent = null;
    return toRet;
  }

  toJSON() {
    return this.children.map((child) => child.toJSON());
  }

  * render(
    totalLevels: number,
    editor: TreeEditorInstance,
  ): Generator<VNode> {
    let lastChild: TreeNodeBase | undefined;

    for (const child of this.children) {
      yield* child.render(totalLevels, editor);
      if (lastChild) {
        const { column, width } = midpoint(lastChild, child);
        yield h(TreeConnector, {
          children: [lastChild, child],
          parent: this,
          style: {
            gridArea: buildGridArea(
              Math.min(
                lastChild.getAbsoluteRow(totalLevels),
                child.getAbsoluteRow(totalLevels),
              ) - 2, 1,
              column, width,
            ),
          },
          onRefresh: editor.refresh,
        });
      }
      lastChild = child;
    }
  }
}
