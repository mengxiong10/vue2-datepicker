<template>
  <div class="card" :class="{ active }">
    <section :id="id" class="card-title" v-html="title"></section>
    <section class="card-description markdown-body" v-html="description"></section>
    <section class="card-demo markdown-body">
      <slot></slot>
    </section>
    <section class="card-actions" @click="handleExpand">
      <img v-if="codeVisible" alt="show code" class="icon-expand" src="../assets/expand.svg" />
      <img v-else alt="hide code" class="icon-expand" src="../assets/collapse.svg" />
    </section>
    <section v-show="codeVisible" class="card-code">
      <highlight-code :value="code"></highlight-code>
    </section>
  </div>
</template>

<script>
import HighlightCode from './highlight-code';

export default {
  name: 'DemoCard',
  components: { HighlightCode },
  props: {
    id: String,
    title: String,
    description: String,
    code: String,
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      codeVisible: false,
    };
  },
  methods: {
    handleExpand() {
      this.codeVisible = !this.codeVisible;
    },
  },
};
</script>

<style lang="scss">
$border-color: #ebedf0;

.card {
  position: relative;
  display: inline-block;
  width: 100%;
  font-size: 14px;
  color: #314659;
  border: 1px solid $border-color;
  border-radius: 4px;
  margin-bottom: 60px;
  margin-top: 20px;
  &.active {
    border-color: #1284e7;
  }
}

.card-demo {
  padding: 30px 24px;
  color: #213649;
  border-top: 1px solid $border-color;
  .box {
    display: flex;
    flex-wrap: wrap;
    > section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.card-title {
  position: absolute;
  margin-top: -10px;
  margin-left: 14px;
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  padding: 0 10px;
  background: #fff;
}

.card-description {
  padding: 12px 24px;
}

.markdown-body {
  font-size: 15px;
  line-height: 1.7;
  p,
  ul,
  ol {
    margin: 10px 0;
  }
  ul,
  ol {
    padding-left: 30px;
  }
  code {
    margin: 0 1px;
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
}

.card-actions {
  position: relative;
  border-top: 1px solid $border-color;
  height: 36px;
  text-align: center;
  color: #d3dce6;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }
}
.icon-expand {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -8px;
  margin-top: -8px;
  width: 16px;
  height: 16px;
  opacity: 0.3;
}

.card-code {
  border-top: 1px solid $border-color;
}
</style>
