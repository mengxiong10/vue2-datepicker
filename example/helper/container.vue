<template>
  <div class="container">
    <div class="sidebar">
      <a
        v-for="(menu, i) in menus"
        :key="menu.id"
        :class="{ active: activeIndex === i }"
        :href="`#${menu.id}`"
        :title="menu.title"
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
function rafThrottle(fn) {
  let isRunning = false;
  return function fnBinfRaf(...args) {
    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(() => {
      isRunning = false;
      fn.apply(this, args);
    });
  };
}

export default {
  name: 'Container',
  props: {
    menus: Array,
  },
  data() {
    return {
      activeIndex: 0,
      handleScroll: rafThrottle(this.scroll),
    };
  },
  computed: {
    menuIds() {
      return this.menus.map(v => v.id);
    },
  },
  methods: {
    scroll() {
      for (let i = 0; i < this.menuIds.length; i++) {
        const id = this.menuIds[i];
        const el = document.getElementById(id);
        const { top } = el.getBoundingClientRect();
        if (top >= 0) {
          this.activeIndex = i;
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

body {
  overflow: hidden;
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
  padding: 10px 20px;
}
</style>
