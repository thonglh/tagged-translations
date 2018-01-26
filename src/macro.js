const { translatePath } = require('./translate')
const { createMacro } = require('babel-plugin-macros')

function taggedTranslationsMacro({ references, config, babel: { types } }) {
  references.default.forEach(({ parentPath: path }) => {
    translatePath(path, config, types)
  })
}

module.exports = createMacro(taggedTranslationsMacro, {
  configName: 'taggedTranslations'
})
