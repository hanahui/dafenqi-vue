import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SET_TEMPLATE_NAME = 'SET_TEMPLATE_NAME'
const SET_TEMPLATE_TYPE = 'SET_TEMPLATE_TYPE'
const SET_TEMPLATE_CREATOR = 'SET_TEMPLATE_CREATOR'
const SET_TEMPLATE_CREATE_TIME = 'SET_TEMPLATE_CREATE_TIME'
const SET_TEMPLATE_CATEGORY_ID = 'SET_TEMPLATE_CATEGORY_ID'
const SET_TEMPLATE_PAGE_NUM = 'SET_TEMPLATE_PAGE_NUM'
const SET_TEMPLATE_PAGE_SIZE = 'SET_TEMPLATE_PAGE_SIZE'


const state = {
  templateName: sessionStorage.getItem('templateName') || '',
  templateType: sessionStorage.getItem('templateType') || '1',
  templateCreator: sessionStorage.getItem('templateCreator') || '',
  templateCreateTime: sessionStorage.getItem('templateCreateTime') || '',
  templateCategoryId: sessionStorage.getItem('templateCategoryId') || '',
  templatePageNum: Number(sessionStorage.getItem('templatePageNum')) || 1,
  templatePageSize: Number(sessionStorage.getItem('templatePageSize')) || 10,
}

const getters = {
  templateName(state) {
    return sessionStorage.getItem('templateName') || state.templateName
  },
  templateType(state) {
    return sessionStorage.getItem('templateType') || state.templateType
  },
  templateCreator(state) {
    return sessionStorage.getItem('templateCreator') || state.templateCreator
  },
  templateCreateTime(state) {
    return sessionStorage.getItem('templateCreateTime') || state.templateCreateTime
  },
  templateCategoryId(state) {
    return sessionStorage.getItem('templateCategoryId') || state.templateCategoryId
  },
  templatePageNum(state) {
    return Number(sessionStorage.getItem('templatePageNum')) || state.templatePageNum
  },
  templatePageSize(state) {
    return Number(sessionStorage.getItem('templatePageSize')) || state.templatePageSize
  },
}

const actions = {
  setTemplateName(context, name) {
    context.commit('SET_TEMPLATE_NAME', name)
  },
  setTemplateType(context,type) {
    context.commit('SET_TEMPLATE_TYPE',type)
  },
  setTemplateCreator(context,creator) {
    context.commit('SET_TEMPLATE_CREATOR',creator)
  },
  setTemplateCreateTime(context,time) {
    context.commit('SET_TEMPLATE_CREATE_TIME',time)
  },
  setTemplateCategoryId(context,categoryId) {
    context.commit('SET_TEMPLATE_CATEGORY_ID',categoryId)
  },
  setTemplatePageNum(context,pageNum) {
    context.commit('SET_TEMPLATE_PAGE_NUM',pageNum)
  },
  setTemplatePageSize(context,pageSize) {
    context.commit('SET_TEMPLATE_PAGE_SIZE', pageSize)
  },
}

const mutations = {
  [SET_TEMPLATE_NAME](state, name) {
    state.templateName = name
    //sessionStorage.setItem('templateName', name);
  },
  [SET_TEMPLATE_TYPE](state, type) {
    state.templateType = type
    //sessionStorage.setItem('templateType', type);
  },
  [SET_TEMPLATE_CREATOR](state, creator) {
    state.templateCreator = creator
    //sessionStorage.setItem('templateCreator', creator);
  },
  [SET_TEMPLATE_CREATE_TIME](state, time) {
    state.templateCreateTime = time
    //sessionStorage.setItem('templateCreateTime', time);
  },
  [SET_TEMPLATE_CATEGORY_ID](state, categoryId) {
    state.templateCategoryId = categoryId
    //sessionStorage.setItem('templateCategoryId', categoryId);
  },
  [SET_TEMPLATE_PAGE_NUM](state, pageNum) {
    state.templatePageNum = pageNum
    //sessionStorage.setItem('templatePageNum', pageNum);
  },
  [SET_TEMPLATE_PAGE_SIZE](state, pageSize) {
    state.templatePageSize = pageSize
    //sessionStorage.setItem('templatePageSize', pageSize);
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
