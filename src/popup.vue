<template>
  <transition :name="`${prefixClass}-zoom-in-${orientation}`">
    <div
      v-if="visible"
      :class="`${prefixClass}-datepicker-main ${prefixClass}-datepicker-popup`"
      :style="{ top, bottom, left, position: 'absolute' }"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { rafThrottle } from './util/throttle';
import { getPopupElementSize, getRelativePosition, getScrollParent } from './util/dom';

const temporaryRect = { width: 250, height: 270 };

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
    horizontalPosition: {
      type: String,
      default: 'right',
    },
  },
  data() {
    return {
      top: '',
      bottom: '',
      left: '',
      orientation: 'down',
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

    // check ofientation
    this.displayPopup();

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
    handleClickOutside(evt) {
      if (!this.visible) return;
      const { target } = evt;
      const el = this.$el;
      if (el && !el.contains(target)) {
        this.$emit('clickoutside', evt);
      }
    },
    displayPopup() {
      const popup = this.$el;
      const relativeElement = this.$parent.$el;
      const { appendToBody, horizontalPosition } = this;
      if (this.visible && !this._popupRect) {
        this._popupRect = getPopupElementSize(popup);
      }
      const { width, height } = this.visible ? this._popupRect : temporaryRect;
      const { left, top, bottom, orientation } = getRelativePosition(
        relativeElement,
        width,
        height,
        appendToBody,
        horizontalPosition
      );
      this.left = left;
      this.orientation = orientation;
      if (orientation === 'up') {
        this.top = '';
        this.bottom = bottom;
      } else {
        this.top = top;
        this.bottom = '';
      }
    },
  },
};
</script>
