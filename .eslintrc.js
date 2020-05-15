module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      "legacyDecorators": true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  globals: { jsdom: true },
  rules: {
    'array-bracket-newline': [ 'error', 'consistent' ],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        arraysInArrays: true,
        objectsInArrays: true,
        singleValue: true,
      },
    ],
    'array-element-newline': [ 'error', 'consistent' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'max-len': [ 'error', { code: 120, ignoreUrls: true } ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    'object-curly-newline': [ 'error', { multiline: true, minProperties: 3 } ],
    'object-curly-spacing': [ 'error', 'always' ],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true },
    ],
    'no-prototype-builtins': 'off',
    indent: [ 'error', 2 ],
    quotes: [ 'error', 'single', { avoidEscape: true } ],
    semi: [ 'error', 'never', { beforeStatementContinuationChars: 'always' } ],
    'vue/no-v-html': 'off',
    'vue/no-template-shadow': 'off',
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      { registeredComponentsOnly: false },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 2,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
      },
    ],
  },
}
