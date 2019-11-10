<template>
  <div
    class="mx-scrollbar"
    :style="{
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <div
      ref="wrap"
      class="mx-scrollbar-wrap"
      :style="{ overflow: 'hidden scroll', height: '100%', marginRight: `-${scrollbarWidth}px` }"
      @scroll="handleScroll"
    >
      <slot></slot>
    </div>
    <div class="mx-scrollbar-track">
      <div
        ref="thumb"
        class="mx-scrollbar-thumb"
        :style="{ height: thumbHeight, top: thumbTop }"
        @mousedown="handleDragstart"
      ></div>
    </div>
  </div>
</template>

<script>
/* istanbul ignore file */
import getScrollbarWidth from '../util/scrollbar-width';

export default {
  data() {
    return {
      scrollbarWidth: 0,
      thumbTop: '',
      thumbHeight: '',
    };
  },
  created() {
    this.scrollbarWidth = getScrollbarWidth();
    document.addEventListener('mouseup', this.handleDragend);
  },
  beforeDestroy() {
    document.addEventListener('mouseup', this.handleDragend);
  },
  mounted() {
    this.$nextTick(this.getThumbSize);
  },
  methods: {
    getThumbSize() {
      const { wrap } = this.$refs;
      if (!wrap) return;
      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      this.thumbHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
    },
    handleScroll(evt) {
      const el = evt.currentTarget;
      const { scrollHeight, scrollTop } = el;
      this.thumbTop = `${(scrollTop * 100) / scrollHeight}%`;
    },
    handleDragstart(evt) {
      evt.stopImmediatePropagation();
      this._draggable = true;
      const { offsetTop } = this.$refs.thumb;
      this._prevY = evt.clientY - offsetTop;
      document.addEventListener('mousemove', this.handleDraging);
    },
    handleDraging(evt) {
      if (!this._draggable) return;
      const { clientY } = evt;
      const { wrap } = this.$refs;
      const { scrollHeight, clientHeight } = wrap;
      const offsetY = clientY - this._prevY;
      const top = (offsetY * scrollHeight) / clientHeight;
      wrap.scrollTop = top;
    },
    handleDragend() {
      if (this._draggable) {
        this._draggable = false;
        document.removeEventListener('mousemove', this.handleDraging);
      }
    },
  },
};
</script>
