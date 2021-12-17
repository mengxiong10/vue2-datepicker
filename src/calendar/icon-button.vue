<template>
  <button
    type="button"
    v-bind="{ disabled }"
    :class="[
      `${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-icon-${type}`,
      {
        [`${prefixClass}-btn-disabled`]: disabled,
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
