<template>
  <transition :name="`${prefixClass}-zoom-in-down`" @after-enter="afterAnimateIn">
    <div
      v-if="visible"
      ref="datePickerContainer"
      role="application"
      tabindex="-1"
      :class="`${prefixClass}-datepicker-main ${prefixClass}-datepicker-popup`"
      :style="{ top, left, position: 'absolute' }"
      @keydown.esc="closePopUp"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { rafThrottle } from './util/throttle';
import { getPopupElementSize, getRelativePosition, getScrollParent } from './util/dom';

export default {
  name: 'Popup',
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      top: '',
      left: '',
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.displayPopup();
          }
        });
      },
    },
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
    this._clickoutEvent = 'ontouchend' in document ? 'touchstart' : 'mousedown';

    document.addEventListener(this._clickoutEvent, this.handleClickOutside);

    // change the popup position when resize or scroll
    const relativeElement = this.$parent.$el;
    this._displayPopup = rafThrottle(() => this.displayPopup());
    this._scrollParent = getScrollParent(relativeElement) || window;
    this._scrollParent.addEventListener('scroll', this._displayPopup);
    window.addEventListener('resize', this._displayPopup);
  },
  beforeDestroy() {
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }

    document.removeEventListener(this._clickoutEvent, this.handleClickOutside);

    this._scrollParent.removeEventListener('scroll', this._displayPopup);
    window.removeEventListener('resize', this._displayPopup);
  },
  methods: {
    afterAnimateIn() {
      this.$refs.datePickerContainer.focus();
    },
    handleClickOutside(evt) {
      if (!this.visible) return;
      const { target } = evt;
      const el = this.$el;
      if (el && !el.contains(target)) {
        this.$emit('clickoutside', evt);
      }
    },
    displayPopup() {
      if (!this.visible) return;
      const popup = this.$el;
      const relativeElement = this.$parent.$el;
      const { appendToBody } = this;
      if (!this._popupRect) {
        this._popupRect = getPopupElementSize(popup);
      }
      const { width, height } = this._popupRect;
      const { left, top } = getRelativePosition(relativeElement, width, height, appendToBody);
      this.left = left;
      this.top = top;
    },
    closePopUp(evt) {
      this.$emit('clickoutside', evt);
    },
  },
};
</script>
