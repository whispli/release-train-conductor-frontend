import { VueConstructor } from 'vue'
import Vuex, {
  Store, MutationTree, ActionTree, StoreOptions, ModuleTree,
} from 'vuex'
import { resetMixin } from '@/store/utils'
import { RootState } from './types'

const state = (): RootState => ({
  user: {
    email: '',
    token: '',
  },
})

export const mutations: MutationTree<RootState> = {
  ...resetMixin(state),
  setUser(state, payload) {
    state.user = payload
  },
}

export const actions: ActionTree<RootState, RootState> = {
  setUser({ commit }, payload) {
    commit('setUser', payload)
  },
  reset({ commit }) {
    commit('reset')
  },
}

export const modules: ModuleTree<RootState> = {}

export const store: StoreOptions<RootState> = {
  state,
  mutations,
  actions,
  modules,
}

export default (vue: VueConstructor): Store<RootState> => {
  vue.use(Vuex)

  return new Vuex.Store<RootState>(store)
}
