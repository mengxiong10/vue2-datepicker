<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="[
      `${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-icon-${type}`,
      {
        disabled: disabled,
      },
    ]"
    v-on="$listeners"
  >
    <i :class="`${prefixClass}-icon-${type}`"></i>
  </button>
</template>

<script>
export default {
  props: {
    ariaLabel: String,
    type: String,
    disabled: Boolean,
  },
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
};
</script>
