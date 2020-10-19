<template>
  <canvas
    :width="actualWidth"
    :height="actualHeight"
    :style="{ width: `${width}px`, height: `${height}px` }"
  ></canvas>
</template>

<script lang="ts">
/* eslint-disable no-param-reassign */

import { defineComponent, PropType } from 'vue';
import {
  buildFont, Font, getTextBaseline, parseRichText, TextFragment,
} from '@/util/parsers';
import { NodeJSON } from '@/models/Tree';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    ctx: CanvasRenderingContext2D;
  }
}

const PIXEL_RATIO = window.devicePixelRatio || 1;
const PADDING = 4;
const DOUBLE_PADDING = PADDING * 2;
const Y_PADDING = 4;
const LEVEL_HEIGHT = 30;
const BASELINE_SKIP = 40;

type Draw = (y: number, ctx: CanvasRenderingContext2D) => void;

interface TextMeasurement {
  ascent: number;
  descent: number;
}

function combineMeasurement(a: TextMeasurement, b?: TextMeasurement) {
  if (!b) {
    return a;
  }
  return {
    ascent: Math.max(a.ascent, b.ascent),
    descent: Math.max(a.descent, b.descent),
  };
}

interface SettingsContext {
  defaultStyle: Font;
  levels: TextMeasurement[];
  pixelRatio: number;
}

interface MeasuredFragment {
  width: number;
  font: string;
  text: string;
}

class Text {
  width: number;

  measurement: TextMeasurement;

  fragments: MeasuredFragment[];

  constructor(text: string, defaultStyle: Font, ctx: CanvasRenderingContext2D) {
    let totalWidth = 0;
    let ascent = 0;
    let descent = 0;
    this.fragments = parseRichText(text, defaultStyle).map((fragment) => {
      const font = buildFont(fragment.style);
      ctx.font = font;
      const {
        width,
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
      } = ctx.measureText(fragment.text);
      ascent = Math.max(ascent, actualBoundingBoxAscent);
      descent = Math.max(descent, actualBoundingBoxDescent);
      totalWidth += width;
      return {
        width,
        font,
        text: fragment.text,
      };
    });
    this.width = totalWidth;
    this.measurement = { ascent, descent };
  }

  draw(x: number, y: number, ctx: CanvasRenderingContext2D) {
    let currentX = x;
    this.fragments.forEach((fragment) => {
      ctx.font = fragment.font;
      ctx.fillText(fragment.text, currentX, y);
      currentX += fragment.width;
    });
  }
}

abstract class TreeNode {
  abstract width: number;

  abstract midpoint: number;

  x: number;

  level: number;

  levels: TextMeasurement[];

  constructor(x: number, level: number, levels: TextMeasurement[]) {
    this.x = x;
    this.level = level;
    this.levels = levels;
  }

  abstract draw(y: number, ctx: CanvasRenderingContext2D): void;
}

class NonLeaf extends TreeNode {
  width: number;

  children: TreeNode[];

  midpoint: number;

  constructor(
    x: number,
    level: number,
    children: NodeJSON[],
    settings: SettingsContext,
    ctx: CanvasRenderingContext2D,
  ) {
    super(x, level, settings.levels);
    let currentX = x;
    let width = 0;
    const childLevel = level + 1;
    this.children = children.map((child) => {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      const newNode = child.children
        ? new InnerNode(currentX, childLevel, child, settings, ctx)
        : new Leaf(currentX, childLevel, child, settings, ctx);
      /* eslint-enable @typescript-eslint/no-use-before-define */
      currentX += newNode.width;
      width += newNode.width;
      return newNode;
    });
    this.width = width;
    const firstChild = this.children[0];
    const lastChild = this.children[this.children.length - 1];
    this.midpoint = (width + firstChild.midpoint - lastChild.midpoint) / 2;
  }

  draw(y: number, ctx: CanvasRenderingContext2D): void {
    this.children.forEach((child) => {
      child.draw(y, ctx);
    });
  }
}

class InnerNode extends NonLeaf {
  text: Text;

  constructor(
    x: number,
    level: number,
    node: NodeJSON,
    settings: SettingsContext,
    ctx: CanvasRenderingContext2D,
  ) {
    super(x, level, node.children!, settings, ctx);
    const text = new Text(node.text, settings.defaultStyle, ctx);
    settings.levels[level] = combineMeasurement(text.measurement, settings.levels[level]);
    const textWidth = text.width + DOUBLE_PADDING;
    if (textWidth > this.width) {
      const shift = (textWidth - this.width) / 2;
      this.width = textWidth;
      this.midpoint = textWidth / 2;
      for (const child of this.children) {
        child.x += shift;
      }
    }
    this.text = text;
    // this.width = Math.max(this.width, this.text.width + DOUBLE_PADDING);
  }

  draw(y: number, ctx: CanvasRenderingContext2D): void {
    const { midpoint } = this;
    const { ascent, descent } = this.levels[this.level];
    const { ascent: ascentChild } = this.levels[this.level + 1];
    const baseline = y + ascent;
    const anchorTop = baseline + descent + Y_PADDING;
    const anchorBottom = baseline + BASELINE_SKIP - ascentChild - Y_PADDING;
    this.text.draw(this.x + this.midpoint - this.text.width / 2, baseline, ctx);
    this.children.forEach((child) => {
      ctx.moveTo(this.x + midpoint, anchorTop);
      ctx.lineTo(child.x + child.midpoint, anchorBottom);
      ctx.stroke();
    });
    super.draw(anchorBottom + Y_PADDING, ctx);
  }
}

class Leaf extends TreeNode {
  width: number;

  midpoint: number;

  text: Text;

  constructor(
    x: number,
    level: number,
    node: NodeJSON,
    settings: SettingsContext,
    ctx: CanvasRenderingContext2D,
  ) {
    super(x, level, settings.levels);
    this.text = new Text(node.text, settings.defaultStyle, ctx);
    settings.levels[level] = combineMeasurement(this.text.measurement, settings.levels[level]);
    this.width = this.text.width + DOUBLE_PADDING;
    this.midpoint = this.width / 2;
  }

  draw(y: number, ctx: CanvasRenderingContext2D): void {
    this.text.draw(this.x + PADDING, y + this.levels[this.level].ascent, ctx);
  }
}

export default defineComponent({
  props: {
    nodes: {
      type: Array as PropType<NodeJSON[]>,
      required: true,
    },
  },
  data() {
    return {
      isMounted: false,
      width: 0,
      height: 0,
    };
  },
  mounted() {
    this.ctx = (this.$el as HTMLCanvasElement).getContext('2d')!;
    this.isMounted = true;
    // const width = 500;
    // const height = 500;
    // this.$el.style.width = `${width}px`;
    // this.$el.style.height = `${height}px`;
    // this.$el.width = width * PIXEL_RATIO;
    // this.$el.height = height * PIXEL_RATIO;

    // const { text } = this;
    // let x = 100;
    // const y = 100;
    // if (text) {
    //   const items = parseRichText(text, {
    //     size: '16px',
    //     family: 'system-ui',
    //   }).map((fragment) => ({
    //     text: fragment.text,
    //     font: buildFont(fragment.style),
    //     textBaseline: getTextBaseline(fragment.style.position),
    //   }));
    //   for (const item of items) {
    //     // console.log(item.font);
    //     // ctx.font = item.font;
    //     // ctx.textBaseline = item.textBaseline;
    //     // const dim = ctx.measureText(item.text);
    //     // ctx.fillText(item.text, x, y);
    //     // x += dim.width;
    //   }
    //   // ctx.moveTo(100, y);
    //   // ctx.lineTo(x, y);
    //   // ctx.stroke();
    // }
  },
  computed: {
    root(): NonLeaf | undefined {
      if (this.isMounted) {
        return new NonLeaf(0, 0, this.nodes, {
          defaultStyle: {
            size: '14px',
            family: 'system-ui',
          },
          levels: [],
          pixelRatio: PIXEL_RATIO,
        }, this.ctx);
      }
      return undefined;
    },
    actualWidth(): number {
      return this.width * PIXEL_RATIO;
    },
    actualHeight(): number {
      return this.height * PIXEL_RATIO;
    },
  },
  watch: {
    root: {
      handler() {
        const { root } = this;
        if (root) {
          this.width = root.width;
          const { levels } = root;
          this.height = (levels.length - 2) * BASELINE_SKIP
            + levels[1].ascent
            + levels[levels.length - 1].descent
            + DOUBLE_PADDING;
          this.$nextTick(() => {
            this.ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
            root.draw(PADDING, this.ctx);
          });
        }
      },
      immediate: true,
    },
  },
});
</script>

<style>

</style>
