const babel = require('babel-core')
const fs = require('fs')
const path = require('path')


const runTests = (dir, presets = ['react', 'es2015']) => {
  const configs = {
    presets,
    plugins: [
      [
        require('../src'),
        {
          translation: './tests/translation.json',
          tagName: 't'
        }
      ]
    ]
  }

  fs
    .readdirSync(dir)
    .filter(
      fileName => !fileName.endsWith('tests.js') && fileName.endsWith('.js')
    )
    .forEach(fileName => {
      test(`test ${fileName}`, done => {
        fs.readFile(`${dir}/${fileName}`, (err, data) => {
          if (err) {
            throw err
          }

          const input = data.toString()
          const output = babel.transform(input, configs)

          expect(output.code).toMatchSnapshot()
          done()
        })
      })
    })
}

global.runTests = runTests