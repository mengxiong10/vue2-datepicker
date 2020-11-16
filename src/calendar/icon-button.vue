<template>
  <button
    type="button"
    :class="`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-icon-${type}`"
    v-on="$listeners"
  >
    <i :class="`${prefixClass}-icon-${type}`"></i>
  </button>
</template>

<script>
export default {
  props: {
    type: String,
  },
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
};
</script>
