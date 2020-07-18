import Vue from 'vue'
import Vuex from 'vuex'
import Template from './module/template'
import TaskList from './module/taskList'

Vue.use(Vuex)

const SHOW_LOADING = 'SHOW_LOADING'
const HIDE_LOADING = 'HIDE_LOADING'
const SET_SYSTEM_THEME = 'SET_SYSTEM_THEME'


const state = {
  loading: false,
  systemTheme: sessionStorage.getItem('theme') ? sessionStorage.getItem('theme') : 'darkTheme'
}

const getters = {
  loading(state) {
    return state.loading
  },
  getSystemtheme(state) {
    return state.systemTheme
  }
}

const actions = {
  showLoading(context) {
    context.commit('SHOW_LOADING')
  },
  hideLoading(context) {
    context.commit('HIDE_LOADING')
  },
  setTheme(context, theme) {
    context.commit('SET_SYSTEM_THEME', theme)
  }
}

const mutations = {
  [SHOW_LOADING](state) {
    state.loading = true
  },
  [HIDE_LOADING](state) {
    state.loading = false
  },
  [SET_SYSTEM_THEME](state, theme) {
    state.systemTheme = theme
  }
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    Template,
    TaskList,
  }
})

export default store
