import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'view/:code',
        name: 'document-view',
        component: () => import('pages/IndexPage.vue'), // Placeholder for now
      },
    ],
  },

  // Always leave this as last one - catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('pages/NotFound.vue'),
  },
];

export default routes;
