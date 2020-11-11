<template>
  <button
    type="button"
    :class="`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-icon-${type}`"
  >
    <i :class="`${prefixClass}-icon-${type}`"></i>
  </button>
</template>

<script>
export default {
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    type: String,
  },
};
</script>
