const tagRegEx = /([^<]+)|<\/([^>]*)>|<([^>]*)>/g;
const spanRegEx = /^span style="font-(\w+):\s*([^;]*);?"$/;
const numRegEx = /\d+(?:\.\d+)?/;

export interface Font {
  style?: string;
  variant?: string;
  weight?: string;
  position?: 'sub' | 'sup';
  size: string;
  family: string;
}

export interface TextFragment {
  text: string;
  style: Font;
}

const styleKeys: (keyof Font)[] = ['style', 'variant', 'weight', 'size', 'family'];

function parseSpan(tag: string) {
  const match = spanRegEx.exec(tag);
  if (match) {
    const [_, key, value] = match;
    return { [key as keyof Font]: value };
  }
  return undefined;
}

function tagToStyle(tag: string) {
  let key: keyof Font;
  let value: string;
  if (tag === 'b') {
    key = 'weight';
    value = 'bold';
  } else if (tag === 'i') {
    key = 'style';
    value = 'italic';
  } else if (tag === 'sub' || tag === 'sup') {
    key = 'position';
    value = tag;
  } else {
    return parseSpan(tag);
  }
  return { [key]: value };
}

export function getTextBaseline(position: string | undefined): CanvasTextBaseline {
  if (position === 'sub') {
    return 'middle';
  }
  if (position === 'sup') {
    return 'top';
  }
  return 'alphabetic';
}

export function buildFont(style: Font) {
  const def = [];
  for (const key of styleKeys) {
    let value = style[key];
    if (value) {
      if (key === 'size' && style.position) {
        value = value.replace(numRegEx, (num) => (parseFloat(num) / 1.2).toString());
      }
      def.push(value);
    }
  }
  return def.join(' ');
}

export function parseRichText(richText: string, defaultStyle: Font) {
  const parsed: TextFragment[] = [];
  const styles = [defaultStyle];
  richText.replace(tagRegEx, (_, text, endTag, startTag) => {
    if (text) {
      parsed.push({
        text,
        style: styles[styles.length - 1],
      });
    } else if (startTag) {
      styles.push({ ...styles[styles.length - 1], ...tagToStyle(startTag) });
    } else if (endTag) {
      styles.pop();
    }
    return '';
  });
  return parsed;
}
