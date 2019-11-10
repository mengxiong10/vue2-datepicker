<template>
  <div class="container">
    <div class="sidebar">
      <a
        v-for="(menu, i) in menus"
        :key="menu.id"
        :class="{ active: activeIndex === i }"
        :href="`#${menu.id}`"
        >{{ menu.title }}</a
      >
    </div>
    <div ref="main" class="main" @scroll="handleScroll">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menus: Array,
  },
  data() {
    return {
      offset: [],
      activeIndex: 0,
    };
  },
  mounted() {
    const scrollEl = this.$refs.main;
    const els = document.querySelectorAll('.card-title');
    const { top } = scrollEl.getBoundingClientRect();
    const offset = [];
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      offset.push(el.getBoundingClientRect().top - top);
    }
    this.offset = offset;
  },
  methods: {
    handleScroll(evt) {
      const value = evt.currentTarget.scrollTop - 10;
      const index = this.offset.findIndex(v => v > value);
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

.container {
  display: flex;
  height: 100%;
}

@media screen and (max-width: 800px) {
  .sidebar {
    display: none;
  }
}

.sidebar {
  border-right: 1px solid #ebedf0;
  width: 280px;
  overflow: auto;
  a {
    font-size: 14px;
    line-height: 30px;
    display: block;
    padding-left: 16px;
    overflow: hidden;
    color: #314659;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-left: 1px solid transparent;
    transition: all 0.3s ease;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    &:hover {
      color: mix(#fff, #1284e7, 0.8);
    }
    &.active {
      color: #1284e7;
    }
  }
}

.main {
  flex: 1;
  overflow: auto;
  max-width: 100%;
  p {
    margin: 10px 0;
  }
}
.content {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}
</style>
