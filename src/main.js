import Vue from 'vue'
import App from './App.vue'

import {CardPlugin, SidebarPlugin, ButtonPlugin, JumbotronPlugin, SpinnerPlugin, NavbarPlugin, BootstrapVue, BIconX, BIconJustify, BIconPlayCircle, BIconPauseCircle} from 'bootstrap-vue'
import './styles.scss'

// Vue.use(BootstrapVue);
Vue.use(CardPlugin);
Vue.use(NavbarPlugin);
Vue.use(SidebarPlugin);
Vue.use(JumbotronPlugin);
Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);
Vue.use(BootstrapVue);
Vue.component("BIconX", BIconX);
Vue.component("BIconJustify", BIconJustify);
Vue.component("BIconPlayCircle", BIconPlayCircle);
Vue.component("BIconPauseCircle", BIconPauseCircle);

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
