<template>
  <div class="box">
    <section>
      <date-picker
        v-model="value1"
        type="datetime"
        placeholder="Select datetime"
        :show-time-panel="showTimePanel"
        @close="handleOpenChange"
      >
        <template v-slot:footer>
          <button class="mx-btn mx-btn-text" @click="toggleTimePanel">
            {{ showTimePanel ? 'select date' : 'select time' }}
          </button>
        </template>
      </date-picker>
    </section>
    <section>
      <date-picker
        v-model="value2"
        type="datetime"
        placeholder="Select datetime range"
        range
        :show-time-panel="showTimeRangePanel"
        @close="handleRangeClose"
      >
        <template v-slot:footer>
          <button class="mx-btn mx-btn-text" @click="toggleTimeRangePanel">
            {{ showTimeRangePanel ? 'select date' : 'select time' }}
          </button>
        </template>
      </date-picker>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: null,
      value2: [],
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  methods: {
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose() {
      this.showTimeRangePanel = false;
    },
  },
};
</script>
