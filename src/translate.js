const fs = require('fs')
const path = require('path')

const DICTIONARIES = {}
const DEFAULT_TAGNAME = 't'
const DEFAULT_TRANSLATION_FILE = './translations/default.json'

const getParentNode = (path, level = 1) => {
  let current = path
  let count = 0

  while (current && count < level) {
    current = current.parentPath
    count += 1
  }

  return current
}

const mapExpressions = (expressions, t) =>
  expressions.map(exp => {
    if (exp.type === 'Identifier') {
      return t.jSXExpressionContainer(exp)
    }
    // JSXElement
    return exp
  })

const mapQuasis = (quasis, t) => quasis.map(q => t.jSXText(q.value.raw))

const mergeChildren = (tokens, texts) =>
  texts.reduce((res, t, idx) => {
    res.push(t)

    if (tokens[idx]) {
      res.push(tokens[idx])
    }

    return res
  }, [])

const buildJSXElement = (expressions, quasis, types) => {
  const tokens = mapExpressions(expressions, types)
  const texts = mapQuasis(quasis, types)

  const children = mergeChildren(tokens, texts)

  return types.jSXElement(
    types.jSXOpeningElement(types.jSXIdentifier('span'), []),
    null,
    children,
    true
  )
}

const translate = (quasis, dictFile) => {
  const dictionary = getDictionary(dictFile)
  const key = quasis.map(element => element.value.raw).join('%s')

  if (!dictionary[key]) {
    return
  }

  const translatedTexts = dictionary[key].split('%s')
  if (quasis.length !== translatedTexts.length) {
    return
  }

  quasis.forEach((element, index) => {
    element.value.cooked = translatedTexts[index]
    element.value.raw = translatedTexts[index]
  })
}

const getDictionary = file => {
  const filePath = path.resolve(process.cwd(), file)
  const cachedDict = DICTIONARIES[filePath]

  if (cachedDict) {
    // cache hit
    return cachedDict
  }

  // cache miss
  const dictionary = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  DICTIONARIES[filePath] = dictionary

  return dictionary
}

const translatePath = (path, options = {}, types) => {
  const { tag, quasi } = path.node
  const parentNode = getParentNode(path, 2)

  const {
    tagName = DEFAULT_TAGNAME,
    translationFile = DEFAULT_TRANSLATION_FILE
  } = options

  if (tag.name !== tagName) {
    return
  }

  translate(quasi.quasis, translationFile)
  let newNode = quasi

  if (parentNode.type === 'JSXElement') {
    // translate to new jsx element
    newNode = buildJSXElement(quasi.expressions, quasi.quasis, types)
  }

  path.replaceWith(newNode)
}

module.exports = {
  translate,
  translatePath
}
