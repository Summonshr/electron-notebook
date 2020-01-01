import Vue from 'vue'
import PortalVue from 'portal-vue'
Vue.use(PortalVue)
import App from './app.vue'

new Vue({ render: createElement => createElement(App) }).$mount('#app');
