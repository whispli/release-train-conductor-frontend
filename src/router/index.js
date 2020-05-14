import Router from 'vue-router'
import Login from '../views/Login.vue'
// import auth from '@/middleware/auth'

export const routes = () => [
  {
    path: '/',
    name: 'login',
    meta: { anonymous: true },
    component: Login,
  },
  {
    path: '/deploy',
    name: 'deploy',
    meta: { anonymous: false },
    component: () => import(/* webpackChunkName: "deploy" */ '../views/Deploy.vue'),
  },
]

export const createRouter = () => {
  const router = new Router({ mode: 'history' })
  router.addRoutes(routes())

  return router
}

export default (vue, store) => {
  vue.use(Router)

  const router = createRouter()
  router.beforeEach(auth(store))

  return router
}
