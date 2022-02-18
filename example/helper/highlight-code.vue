<template>
  <pre class="highlight-code">
    <code ref="code">{{value}}</code>
  </pre>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/atom-one-light.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

export default {
  props: {
    value: {
      type: String,
    },
  },
  mounted() {
    hljs.highlightBlock(this.$refs.code);
  },
};
</script>

<style lang="scss">
.highlight-code {
  margin: 0;
  background: #fff;
  &::after,
  &::before {
    width: 0;
  }
  // 添加优先级, 覆盖 引入的样式
  code {
    display: block;
    background: #fff;
    color: #314659;
    line-height: 2;
    border: 0;
    box-shadow: none;
    padding: 16px 32px;
    border-radius: 2px;
    font-size: 14px;
  }
}
</style>
