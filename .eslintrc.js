// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    jest: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': ["error", { allow: ["warn", "error"] }],
    'camelcase': ['off', { properties: 'never' }],
    // "vue/max-attributes-per-line": [2, {
    //   "singleline": 1,
    //   "multiline": {
    //     "max": 1,
    //     "allowFirstLine": true
    //   }
    // }],
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "closeBracket": 0,
      "alignAttributesVertically": false,
      "ignores": []
    }]
  }
}
