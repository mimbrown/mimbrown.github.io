interface Markup {
  type: 'b' | 'i';
  start: number;
  end: number;
}

function isInRange(a: number, b: number, c: number) {
  return a >= b && a <= c;
}

export interface RichText {
  markup: Markup[];
  text: string;
}

export class RichText {
  constructor(richText?: RichText) {
    this.markup = richText?.markup || [];
    this.text = richText?.text || '';
  }
  apply(markup: Markup) {
    let start: Markup | undefined;
    let end: Markup | undefined;
    let startIndex: number | undefined;
    let endIndex: number | undefined;
    const newMarkup: Markup[] = [];

    for (const own of this.markup) {
      let shouldAdd = true;
      if (markup.type === own.type) {
        if (isInRange(markup.start, own.start, own.end)) {
          start = own;
          shouldAdd = false;
        }
        if (isInRange(markup.end, own.start, own.end)) {
          end = own;
          shouldAdd = false;
        }
        if (markup.start < own.start && markup.end > own.end) {
          // If we are entirely spanned by markup, we just disappear.
          shouldAdd = false;
        }
      }
      if (shouldAdd) {
        newMarkup.push(own);
      }
    }
    if (start && end) {
      if (start === end) {
        // We are inside the same block. Undo formatting.
        // Fragment if we didn't get the whole range.
        if (start.start < markup.start) {
          newMarkup.push({
            type: markup.type,
            start: start.start,
            end: markup.start,
          });
        }
        if (end.end > markup.end) {
          newMarkup.push({
            type: markup.type,
            start: markup.end,
            end: end.end,
          });
        }
      } else {
        // We have different blocks, now joined
        newMarkup.push({
          type: markup.type,
          start: start.start,
          end: end.end,
        });
      }
    } else if (start) {
      // Extend start forwards
      newMarkup.push({
        type: markup.type,
        start: start.start,
        end: markup.end,
      });
    } else if (end) {
      // Extend end backwards
      newMarkup.push({
        type: markup.type,
        start: markup.start,
        end: end.end,
      });
    } else {
      // Brand new fresh
      newMarkup.push(markup);
    }
    this.markup = newMarkup;
  }
}
