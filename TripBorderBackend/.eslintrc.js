module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb-base'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'warn',
    'no-underscore-dangle': 'warn',
    'comma-dangle': 'off',
    'linebreak-style': 'warn',
    'object-curly-newline': 'off',
    'default-case': 'off',
    'object-shorthand': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-return-assign': 'warn',
    'no-unused-vars': 'warn',
    'no-param-reassign': 'warn',
    'padded-blocks': 'warn',
    'no-multiple-empty-lines': 'warn',
    'max-len': ['warn', { code: 150 }],
    'jsx-quotes': ['warn', 'prefer-single'],
    'default-param-last': 'off',
    'no-restricted-globals': 'warn',
    'prefer-destructuring': 'warn',
    'import/no-extraneous-dependencies': 'off'
  }
};
