import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const SET_TASK_ID = 'SET_TASK_ID'
const SET_TASK_NAME = 'SET_TASK_NAME'
const SET_TASK_STATE = 'SET_TASK_STATE'
const SET_TASK_CREATOR = 'SET_TASK_CREATOR'
const SET_TASK_MODE = 'SET_TASK_MODE'
const SET_TASK_TYPE = 'SET_TASK_TYPE'
const SET_TASK_CREATE_TIME = 'SET_TASK_CREATE_TIME'
const SET_TASK_EXECUTION_STIME = 'SET_TASK_EXECUTION_STIME'
const SET_TASK_EXECUTION_ETIME = 'SET_TASK_EXECUTION_ETIME'
const SET_TASK_PAGE_NUM = 'SET_TASK_PAGE_NUM'
const SET_TASK_PAGE_SIZE = 'SET_TASK_PAGE_SIZE'


const state = {
  taskId: '',
  taskName: '',
  taskState: '',
  taskCreator: '',
  taskMode: '',
  taskType: '',
  taskCreateTime: '',
  taskExecutionStime: '',
  taskExecutionEtime: '',
  taskPageNum: 1,
  taskPageSize: 10,
}

const getters = {
  taskId(state) {
    return sessionStorage.getItem('taskId') || state.taskId
  },
  taskName(state) {
    return sessionStorage.getItem('taskName') || state.taskName
  },
  taskState(state) {
    return sessionStorage.getItem('taskState') || state.taskState
  },
  taskCreator(state) {
    return sessionStorage.getItem('taskCreator') || state.taskCreator
  },
  taskMode(state) {
    return sessionStorage.getItem('taskMode') || state.taskMode
  },
  taskType(state) {
    return sessionStorage.getItem('taskType') || state.taskType
  },
  taskCreateTime(state) {
    return sessionStorage.getItem('taskCreateTime') || state.taskCreateTime
  },
  taskExecutionStime(state) {
    return sessionStorage.getItem('taskExecutionStime') || state.taskExecutionStime
  },
  taskExecutionEtime(state) {
    return sessionStorage.getItem('taskExecutionEtime') || state.taskExecutionEtime
  },
  taskPageNum(state) {
    return Number(sessionStorage.getItem('taskPageNum')) || state.taskPageNum
  },
  taskPageSize(state) {
    return Number(sessionStorage.getItem('taskPageSize')) || state.taskPageSize
  },
}

const actions = {
  setTaskId(context, id) {
    context.commit('SET_TASK_ID', id)
  },
  setTaskName(context, name) {
    context.commit('SET_TASK_NAME', name)
  },
  setTaskState(context, state) {
    context.commit('SET_TASK_STATE', state)
  },
  setTaskCreator(context,creator) {
    context.commit('SET_TASK_CREATOR',creator)
  },
  setTaskMode(context,mode) {
    context.commit('SET_TASK_MODE',mode)
  },
  setTaskType(context,type) {
    context.commit('SET_TASK_TYPE',type)
  },
  setTaskCreateTime(context,time) {
    context.commit('SET_TASK_CREATE_TIME',time)
  },
  setTaskExecutionSTime(context,time) {
    context.commit('SET_TASK_EXECUTION_STIME',time)
  },
  setTaskExecutionETime(context,time) {
    context.commit('SET_TASK_EXECUTION_ETIME',time)
  },
  setTaskPageNum(context,pageNum) {
    context.commit('SET_TASK_PAGE_NUM',pageNum)
  },
  setTaskPageSize(context,pageSize) {
    context.commit('SET_TASK_PAGE_SIZE', pageSize)
  },
}

const mutations = {
  [SET_TASK_ID](state, id) {
    state.taskId = id
    //sessionStorage.setItem('taskId', id);
  },
  [SET_TASK_NAME](state, name) {
    state.taskName = name
    //sessionStorage.setItem('taskName', name);
  },
  [SET_TASK_STATE](state, status) {
    state.taskState = status
    //sessionStorage.setItem('taskState', status);
  },
  [SET_TASK_CREATOR](state, creator) {
    state.taskCreator = creator
    //sessionStorage.setItem('taskCreator', creator);
  },
  [SET_TASK_MODE](state, mode) {
    state.taskMode = mode
    //sessionStorage.setItem('taskMode', mode);
  },
  [SET_TASK_TYPE](state, type) {
    state.taskType = type
    //sessionStorage.setItem('taskType', type);
  },
  [SET_TASK_CREATE_TIME](state, time) {
    state.taskCreateTime = time
    //sessionStorage.setItem('taskCreateTime', time);
  },
  [SET_TASK_EXECUTION_STIME](state, time) {
    state.taskExecutionStime = time
    //sessionStorage.setItem('taskExecutionStime', time);
  },
  [SET_TASK_EXECUTION_ETIME](state, time) {
    state.taskExecutionEtime = time
    //sessionStorage.setItem('taskExecutionEtime', time);
  },
  [SET_TASK_PAGE_NUM](state, pageNum) {
    state.taskPageNum = pageNum
    //sessionStorage.setItem('taskPageNum', pageNum);
  },
  [SET_TASK_PAGE_SIZE](state, pageSize) {
    state.taskPageSize = pageSize
    //sessionStorage.setItem('taskPageSize', pageSize);
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
