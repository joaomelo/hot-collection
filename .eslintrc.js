module.exports = {
  globals: {
    fetch: false,
    Event: false
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
