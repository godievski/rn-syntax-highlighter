# RN Syntax Highlighter

Syntax highlighting component for `React Native` using <a href='https://github.com/conorhastings/react-syntax-highlighter'> `react-syntax-highlighter`</a>

## Install

`npm install @godievski/rn-syntax-highlighter --save`

## Use

### props

Accepts almost all of the same props as <a href='https://github.com/conorhastings/react-syntax-highlighter'> `react-syntax-highlighter`</a> with some additional props.

- `fontFamily` **(string)** - the font family to use for syntax text.
- `fontSize` **(number)** - the fontSize for syntax text.
- `dark` **(boolean)** - darkmode for the numbers of the lines
- `startingLineNumber` **(number)** - number from the line numbering will start
- `highligter` **(string)** - defaults to rendering with vdom created from highlightjs, but can pass in `prism` as alternate option. You can see more about dealing with the prism highlighter in the docs for <a href='https://github.com/conorhastings/react-syntax-highlighter'>react-syntax-highlighter</a> but one of the main uses would be better support for jsx
