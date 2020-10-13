import { VNode, h } from 'vue';
import Path from '@/components/Path.vue';
import TreeConnector from '@/components/TreeConnector.vue';
import TreeDelinker from '@/components/TreeDelinker.vue';

interface TreeEditor {
  refresh(): void;
  delink(node: TreeNodeBase): void;
}

export function buildGridArea(row: number, height: number, column: number, width: number) {
  return `${row} / ${column} / ${row + height} / ${column + width}`;
}

export abstract class TreeNodeBase {
  level: number | undefined;

  abstract get blockWidth(): number;

  abstract render(
    previousBlocks: number,
    totalLevels: number,
    editor: TreeEditor,
  ): Generator<VNode>;

  calculateSpatial(level: number): number {
    this.level = level;
    return level;
  }

  buildStyle(previousBlocks: number, level?: number) {
    return {
      gridArea: buildGridArea(
        (level || this.level!) * 2, 1,
        (previousBlocks + 1) * 2, this.blockWidth * 2 - 1,
      ),
    };
  }
}

export class Leaf extends TreeNodeBase {
  text: string;

  // eslint-disable-next-line class-methods-use-this
  get blockWidth() { return 1; }

  constructor(text: string) {
    super();
    this.text = text;
  }

  * render(previousBlocks: number, totalLevels: number) {
    yield h('div', {
      style: this.buildStyle(previousBlocks, totalLevels),
    }, this.text);
  }
}

export class TreeNode extends TreeNodeBase {
  text: string;

  children: TreeNodeBase[];

  calculatedWidth: number | undefined;

  constructor(text: string, children: TreeNodeBase[]) {
    super();
    this.text = text;
    this.children = children;
  }

  calculateSpatial(level: number): number {
    super.calculateSpatial(level);
    const nextLevel = level + 1;
    let maxLevel = nextLevel;
    this.calculatedWidth = this.children.reduce((total, current) => {
      maxLevel = Math.max(current.calculateSpatial(nextLevel), maxLevel);
      return total + current.blockWidth;
    }, 0);
    return maxLevel;
  }

  get blockWidth() { return this.calculatedWidth || 0; }

  calculatePath(): string {
    const { length } = this.children;
    if (length === 1) {
      return 'M12,4V20';
    }
    return 'M0,23L12,1L24,23Z';
  }

  * render(previousBlocks: number, totalLevels: number, editor: TreeEditor) {
    yield h('div', {
      style: this.buildStyle(previousBlocks),
    }, this.text);

    yield h('div', {
      style: {
        gridArea: buildGridArea(
          this.level! * 2 + 1, 1,
          (previousBlocks + 1) * 2, this.blockWidth * 2 - 1,
        ),
      },
    }, h(Path, {
      d: this.calculatePath(),
      style: {
        width: '100%',
        height: '24px',
      },
    }));

    let currentBlocks = previousBlocks;
    for (const child of this.children) {
      yield* child.render(currentBlocks, totalLevels, editor);
      if (child === this.children[0]) {
        yield h(TreeDelinker, {
          node: child,
          style: {
            gridArea: buildGridArea(
              this.level! * 2 + 1, 1,
              (currentBlocks + 1) * 2, 1,
            ),
          },
          onDelink: editor.delink,
        });
      }
      currentBlocks += child.blockWidth;
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

export class Root extends TreeNode {
  * render(previousBlocks: number, totalLevels: number, editor: TreeEditor): Generator<VNode> {
    let currentBlocks = previousBlocks;
    let lastChild: TreeNodeBase | undefined;

    for (const child of this.children) {
      yield* child.render(currentBlocks, totalLevels, editor);
      if (lastChild) {
        yield h(TreeConnector, {
          children: [lastChild, child],
          parent: this,
          style: {
            gridArea: buildGridArea(
              Math.min(lastChild.level!, child.level!) * 2 - 1, 1,
              currentBlocks * 2 + 1, 1,
            ),
          },
          onRefresh: editor.refresh,
        });
      }
      lastChild = child;
      if (child instanceof Leaf) {
        yield h(TreeConnector, {
          children: [child],
          parent: this,
          onRefresh: editor.refresh,
          style: {
            gridArea: buildGridArea(
              totalLevels * 2 - 1, 1,
              (currentBlocks + 1) * 2, 1,
            ),
          },
        });
      }
      currentBlocks += child.blockWidth;
    }
  }
}
