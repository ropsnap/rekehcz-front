// Composables
import { createRouter, 
          createWebHistory } from 'vue-router'

const routes = [
  {
    
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      
      {
        path: 'dash',
        name: 'Dash',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "Dash" */ '@/views/Dash.vue'),
      },
      
      {
        path: '',
        name: 'Init',
        component: () => import(/* webpackChunkName: "Init" */ '@/views/Init.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory('#'),
  routes,
})

export default router
