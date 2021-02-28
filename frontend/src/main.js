import Vue from 'vue';
import App from './App.vue';

// App.vueをエントリとしてレンダリング
new Vue({
  el: '#app',
  render: h => h(App)
}) 