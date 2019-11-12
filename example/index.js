import App from './app';

new window.Vue({
  render: h =>
    h(App, {
      props: {
        changeLocale: window.DatePicker.locale,
      },
    }),
}).$mount('#app');
