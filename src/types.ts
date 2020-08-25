export type RNSyntaxHighlighterProps = {
  fontFamily?: string;
  fontSize?: number;
  children: React.ReactNode;
  style?: string;
  language?: string;
  dark?: boolean;
  highlighter: string;
  startingLineNumber?: number;
};
