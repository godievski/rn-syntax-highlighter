/**
 * This code is based on:
 * https://github.com/conorhastings/react-native-syntax-highlighter
 */
import React, { useMemo } from "react";
import { Text, Platform, ScrollViewProps, View } from "react-native";
import { Prism } from "react-syntax-highlighter";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as prismStyles from "react-syntax-highlighter/dist/esm/styles/prism";
import * as hljsStyles from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ScrollView } from "react-native-gesture-handler";
import { createStyleObject } from "./utils";
import styles from "./styes";

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

const styleCache = new Map();

const topLevelPropertiesToRemove = [
  "color",
  "textShadow",
  "textAlign",
  "whiteSpace",
  "wordSpacing",
  "wordBreak",
  "wordWrap",
  "lineHeight",
  "MozTabSize",
  "OTabSize",
  "tabSize",
  "WebkitHyphens",
  "MozHyphens",
  "msHyphens",
  "hyphens",
  "fontFamily",
];

/**
 * TODO: improve types
 */

export function generateNewStylesheet({
  stylesheet,
  highlighter,
}: {
  stylesheet: object;
  highlighter: string;
}) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  stylesheet = Array.isArray(stylesheet) ? stylesheet[0] : stylesheet;
  const transformedStyle = Object.entries(stylesheet).reduce(
    (newStylesheet, [className, style]) => {
      newStylesheet[className] = Object.entries(style as object).reduce(
        (newStyle: any, [key, value]) => {
          if (key === "overflowX" || key === "overflow") {
            newStyle.overflow = value === "auto" ? "scroll" : value;
          } else if (value.includes("em")) {
            const [num] = value.split("em");
            newStyle[key] = Number(num) * 16;
          } else if (key === "background") {
            newStyle.backgroundColor = value;
          } else if (key === "display") {
            return newStyle;
          } else {
            newStyle[key] = value;
          }
          return newStyle;
        },
        {}
      );
      return newStylesheet;
    },
    {} as any
  );
  const topLevel =
    highlighter === "prism"
      ? transformedStyle['pre[class*="language-"]']
      : transformedStyle.hljs;
  const defaultColor = (topLevel && topLevel.color) || "#000";
  topLevelPropertiesToRemove.forEach((property) => {
    if (topLevel[property]) {
      delete topLevel[property];
    }
  });
  if (topLevel.backgroundColor === "none") {
    delete topLevel.backgroundColor;
  }
  const codeLevel = transformedStyle['code[class*="language-"]'];
  if (highlighter === "prism" && !!codeLevel) {
    topLevelPropertiesToRemove.forEach((property) => {
      if (codeLevel[property]) {
        delete codeLevel[property];
      }
    });
    if (codeLevel.backgroundColor === "none") {
      delete codeLevel.backgroundColor;
    }
  }
  styleCache.set(stylesheet, { transformedStyle, defaultColor });
  return { transformedStyle, defaultColor };
}

function createChildren({
  stylesheet,
  fontSize,
  fontFamily,
}: {
  stylesheet: object;
  fontSize: number;
  fontFamily: string;
}) {
  let childrenCount = 0;
  return (children: Node[], defaultColor: string) => {
    childrenCount += 1;
    return children.map((child, i) =>
      createNativeElement({
        node: child,
        stylesheet,
        key: `code-segment-${childrenCount}-${i}`,
        defaultColor,
        fontSize,
        fontFamily,
      })
    );
  };
}

type Node = {
  properties: any;
  type: string;
  tagName: object;
  value: any;
  className: object;
  children: Node[];
};
function createNativeElement({
  node,
  stylesheet,
  key,
  defaultColor,
  fontFamily,
  fontSize = 12,
}: {
  node: Node;
  stylesheet: object;
  key: string;
  defaultColor: string;
  fontFamily: string;
  fontSize: number;
}) {
  const { properties, type, tagName: TagName, value } = node;
  const startingStyle = { fontFamily, fontSize, height: fontSize + 5 };
  if (type === "text") {
    return (
      <Text
        key={key}
        style={Object.assign({ color: defaultColor }, startingStyle)}
      >
        {value}
      </Text>
    );
  } else if (TagName) {
    const childrenCreator = createChildren({
      stylesheet,
      fontSize,
      fontFamily,
    });
    const style = createStyleObject(
      properties.className,
      Object.assign({ color: defaultColor }, properties.style, startingStyle),
      stylesheet
    );
    const children = childrenCreator(
      node.children,
      style.color || defaultColor
    );
    return (
      <Text key={key} style={style}>
        {children}
      </Text>
    );
  } else {
    return null;
  }
}

function nativeRenderer({
  defaultColor,
  fontFamily,
  fontSize,
  dark,
  startingLineNumber,
}: {
  defaultColor: string;
  fontFamily: string;
  fontSize: number;
  dark: boolean;
  startingLineNumber: number;
}) {
  return ({ rows, stylesheet }: { rows: Node[]; stylesheet: object }) => {
    const width =
      16 + (1 + Math.floor(Math.log10(rows.length))) * fontSize * 0.75;
    return rows.map((node, i) => {
      return (
        <View
          key={`row-wrapper${i + startingLineNumber}`}
          style={styles.row_container}
        >
          <View
            style={[
              styles.number_container,
              {
                width: width,
                backgroundColor: dark ? "#000" : "#fff",
              },
            ]}
          >
            <Text
              style={[
                styles.number,
                {
                  color: dark ? "#fff" : "#000",
                  fontSize: fontSize,
                },
              ]}
            >
              {`${i + startingLineNumber}`}
            </Text>
          </View>
          <View
            style={[
              styles.text_container,
              {
                paddingLeft: width + 4,
              },
            ]}
          >
            <Text>
              {createNativeElement({
                node,
                stylesheet,
                key: `code-segment-${i}`,
                defaultColor,
                fontFamily,
                fontSize,
              })}
            </Text>
          </View>
        </View>
      );
    });
  };
}

export const PreTag = (props: ScrollViewProps) => {
  return (
    <ScrollView
      {...props}
      horizontal={true}
      contentContainerStyle={styles.pretag}
    />
  );
};

export const CodeTag = (props: ScrollViewProps) => {
  return (
    <ScrollView
      {...props}
      horizontal={false}
      contentContainerStyle={styles.codetag}
    />
  );
};

const fontFamilyDef = Platform.OS == "ios" ? "Menlo-Regular" : "monospace";
const fontSizeDef = 12;
const prismDefaultStyle = prismStyles.atomDark;
const defaultStyle = hljsStyles.agate;

const RNSyntaxHighlighter: React.FC<RNSyntaxHighlighterProps> = ({
  fontFamily = fontFamilyDef,
  fontSize = fontSizeDef,
  children,
  dark = true,
  highlighter = "highlighterjs",
  style = highlighter === "prism" ? prismDefaultStyle : defaultStyle,
  startingLineNumber = 1,
  ...rest
}) => {
  const { transformedStyle, defaultColor } = useMemo(() => {
    return generateNewStylesheet({
      stylesheet: style,
      highlighter,
    });
  }, [style, highlighter]);
  const Highlighter = useMemo(
    () => (highlighter === "prism" ? Prism : SyntaxHighlighter),
    [highlighter]
  );

  const renderer = useMemo(() => {
    return nativeRenderer({
      defaultColor,
      fontFamily,
      fontSize,
      dark,
      startingLineNumber,
    });
  }, [defaultColor, fontFamily, fontSize, dark, startingLineNumber]);

  return (
    <Highlighter
      {...rest}
      PreTag={PreTag}
      CodeTag={CodeTag}
      style={transformedStyle}
      showLineNumbers={false}
      showInlineLineNumbers={false}
      wrapLines={true}
      horizontal={true}
      renderer={renderer}
    >
      {children}
    </Highlighter>
  );
};

export default React.memo(RNSyntaxHighlighter);
