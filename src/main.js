import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './styles.scss'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Vue2TouchEvents from "vue2-touch-events";
Vue.use(Vue2TouchEvents);

import {MdSteppers, MdButton} from "vue-material/dist/components"
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(MdSteppers);
Vue.use(MdButton);

import './registerServiceWorker'

import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
