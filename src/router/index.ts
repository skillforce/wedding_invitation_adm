import { createRouter, createWebHistory } from 'vue-router'
import { AppChildRoute, AppRoute } from '@/constants/app'

const routes = [
  { path: AppRoute.Login, component: () => import('../views/Login.vue') },
  {
    path: AppRoute.Login,
    component: () => import('../views/AuthorizedLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: AppChildRoute.Guests,
        component: () => import('../views/Guests.vue'),
      },
      {
        path: AppChildRoute.SeatingArrangements,
        component: () => import('../views/SeatingArrangements.vue'),
      },
      {
        path: AppChildRoute.Budget,
        component: () => import('../views/Budget.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: AppRoute.Login },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
