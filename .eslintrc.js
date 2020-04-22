module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.vue'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.vue'],
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', 'prettier', 'prettier/vue'],

  plugins: ['vue'],

  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-restricted-globals': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': [2, { ignore: ['vue2-datepicker'] }],
    'import/no-extraneous-dependencies': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-v-html': 'off',
  },
};
