module.exports = {
  globals: {
    fetch: false
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    semi: ['error', 'always'],
    'no-debugger': 'off'
  },
  extends: [
    'standard'
  ],
};
