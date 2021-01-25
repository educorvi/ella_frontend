import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/services/:service',
    name: 'Service',
    component: () => import('../views/Service')
  },
  {
    path: '/load',
    name: "Load",
    component: () => import('../views/Load')
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404')

  }
]

const router = new VueRouter({
  routes
})

export default router
