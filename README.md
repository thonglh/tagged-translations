# tagged-translations
[![Build Status](https://travis-ci.org/vinhlh/tagged-translations.svg?branch=master)](https://travis-ci.org/vinhlh/tagged-translations) [![Coverage Status](https://coveralls.io/repos/github/vinhlh/tagged-translations/badge.svg?branch=master)](https://coveralls.io/github/vinhlh/tagged-translations?branch=master) [![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

A dead simple `babel-plugin` for translating texts in React applications.

Input
```js
<Header>
  {t`Hello ${name}!`}
</Header>
```

Output
```js
<Header>
  {`Xin chào ${name} 🤣!`}
</Header>
```

## Features
- Build time translation: build app with minimal footprint.
- Based on ES6 tagged template literals: really helpful for readability/ maintaination/ integrations.
- Translations are configured in a JSON file.

## Usage
Install
`yarn add --dev tagged-translations`

then configure

### Via `.babelrc`

```js
{
  "plugins": [
    ["tagged-translations", {
      "translationFile": "./translation.json",
      "tagName": "t"
    }]
  ]
}
```

- `translationFile`: the location of translation json.
- `tagName`: translation tag name. Default: `t`.

### Via `babel-macros`

```js
{
  "plugins": ["babel-macros"]
}
```

then import the macro and use it.

```js
import t from 'tagged-translations/macro';

const name = 'Vinh Le';

t`Hello ${name}`;
```

## Contributing
- Run all tests
`yarn test:dev`

## Notes
- We don't cover 100% cases: don't support `\n` characters.
