// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

import DatePicker from '../src/index';
import '../src/style/index.scss';

import App from './app';

DatePicker.install(Vue);

new Vue({
  render: h => h(App),
}).$mount('#app');
