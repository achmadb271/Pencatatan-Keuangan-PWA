import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/index.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/login.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/auth/register.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/transactions',
        name: 'transactions.index',
        component: () => import('../views/transactions/index.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/transactions/create',
        name: 'transactions.create',
        component: () => import('../views/transactions/create.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/transactions/edit/:id',
        name: 'transactions.edit',
        component: () => import('../views/transactions/edit.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = Cookies.get('token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            return next({ name: 'login' });
        }
    }

    if (to.matched.some(record => record.meta.guestOnly)) {
        if (token) {
            return next({ name: 'dashboard' });
        }
    }

    next();
});

export default router;
