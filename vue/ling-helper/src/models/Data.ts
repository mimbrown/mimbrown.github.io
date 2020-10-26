export interface BaseStyle {
  fontSize: string;
  fontFamily: string;
}

export interface FontStyle extends Partial<BaseStyle> {
  fontStyle?: 'italic';
  fontVariant?: 'small-caps';
  fontWeight?: 'bold';
  color?: string;
}

export interface InlineFontStyle extends FontStyle {
  position?: 'sub';
}

export interface SavedFontStyle extends FontStyle {
  id: string;
}

export interface TreeSettings {
  alignLeaves: boolean;
}

type TreeNode = {
  text: string;
  children: TreeNode[];
} | string[];

export interface TreeItem {
  settings?: Partial<TreeSettings>;
  nodes: TreeNode[];
}

export interface Data {
  baseStyle: BaseStyle;
  styles: SavedFontStyle[];
  trees: {
    settings: TreeSettings;
    items: TreeItem[];
  };
}
