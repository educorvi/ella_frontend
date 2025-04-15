import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/About.vue'),
        },
        {
            path: '/html',
            name: 'HTML',
            component: () => import('../views/HTMLResponse.vue'),
        },
        {
            path: '/services/:service',
            name: 'Service',
            component: () => import('../views/Service.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/notFound.vue'),
        },
    ],
    scrollBehavior: () => {
        return { left: 0, top: 0 };
    },
});

export default router;
