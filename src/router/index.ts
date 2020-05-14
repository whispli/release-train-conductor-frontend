import { VueConstructor } from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Login from '../views/Login.vue'
// import auth from '@/middleware/auth'
import { Store } from 'vuex'
import { RootState } from '@/store/types'

export const routes = (): RouteConfig[] => [
  {
    path: '/',
    name: 'login',
    meta: {
      anonymous: true,
    },
    component: Login,
  },
  {
    path: '/deploy',
    name: 'deploy',
    meta: {
      anonymous: false,
    },
    component: () => import(/* webpackChunkName: "deploy" */ '../views/Deploy.vue'),
  },
]

export const createRouter = (): Router => {
  const router = new Router({
    mode: 'history',
  })
  router.addRoutes(routes())

  return router
}

export default (vue: VueConstructor, store: Store<RootState>): Router => {
  vue.use(Router)

  const router = createRouter()
  // router.beforeEach(auth(store))

  return router
}
