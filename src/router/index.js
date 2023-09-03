import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/category/:category_id',
    name: 'Category',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Category.vue')
  },
  {
    path: '/product/:product_id',
    name: 'Product',
    component: () => import('../components/products/Product')
  },
  {
    path: '/compare',
    name: 'Compare',
    component: () => import('../views/Compare')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Authorization')
  },
  {
    path: '/',
    name: 'MainInfo',
    component: () => import('../views/Information')
  },
  {
    path: '/:info_id',
    name: 'Info',
    component: () => import('../views/Information')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
