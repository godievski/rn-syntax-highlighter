/**
 * Extracted from
 * https://github.com/react-syntax-highlighter/react-syntax-highlighter
 */
export function createStyleObject(
  classNames: any[],
  elementStyle = {},
  stylesheet: any,
) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...stylesheet[className]};
  }, elementStyle);
}
