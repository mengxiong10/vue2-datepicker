/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';

import DatePicker from '../src/index';

// import '../src/locale/zh-cn';

import '../src/style/index.scss';

import App from './app';

Vue.use(DatePicker);

new Vue({
  render: h => h(App),
}).$mount('#app');
