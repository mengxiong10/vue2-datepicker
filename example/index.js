import App from './app';

window.DatePicker.locale('en');

new window.Vue({
  render: h =>
    h(App, {
      props: {
        changeLocale: window.DatePicker.locale,
      },
    }),
}).$mount('#app');
