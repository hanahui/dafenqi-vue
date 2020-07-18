//  自助提数-任务 api 管理

import service from './service'

//  查询任务列表
export function getTaskList(params){
  return service.postWithoutProduct('/portal-task/task/indexTaskList', params)
}

// 查询任务一审列表
export function getFirstAuditList(params){
  return service.postWithoutProduct('/portal-task/task/indexTaskFirstList', params)
}

// 查询任务二审列表
export function getSecondAuditList(params){
  return service.postWithoutProduct('/portal-task/task/indexTaskSecondList', params)
}

// 保存自定义任务接口
export function saveCustomTask(params){
  return service.postWithoutProduct('/portal-task/task/saveCustomTask', params)
}

// 任务一审审核接口
export function firstAudit(params){
  return service.postWithoutProduct('/portal-task/task/trial', params)
}

// 任务二审审核接口
export function secondAudit(params){
  return service.postWithoutProduct('/portal-task/task/auditExtractupNew', params)
}

// 任务审核人员列表
export function auditUserList(params){
  return service.postWithoutProduct('/portal-task/check/checkInfos', params)
}

// 编辑更新审核人员邮件发送状态
export function updateCheck(params){
  return service.postWithoutProduct('/portal-task/check/updateCheckInfos', params)
}

// 任务执行历史列表
export function getTaskHistoryList(params){
  return service.postWithoutProduct('/portal-task/taskManage/downExtract', params)
}

// 下载任务执行历史
export function downloadHistory(params){
  return service.downloadFile('/portal-task/taskManage/downloaddata', params)
}

// 任务日志列表
export function getTaskLogList(params){
  return service.postWithoutProduct('/portal-task/taskManage/logList', params)
}

// 下载任务执行历史
export function downloadLog(params){
  return service.downloadFile('/portal-task/taskManage/downloaddata', params)
}

// 任务删除
export function deleteTask(params){
  return service.postWithoutProduct('/portal-task/task/deleteTask', params)
}

// 提交/停止/恢复 任务
export function updateTaskState(params){
  return service.postWithoutProduct('/portal-task/task/updateState', params)
}




