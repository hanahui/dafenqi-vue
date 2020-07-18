/* 自定义任务 api管理 */

import service from './service'

// 获取自定义任务详情
export function getCustomTaskInfo(params){
  return service.postWithoutProduct('/portal-task/task/auditCustomExtract', params)
}

// 自定义任务另存为模板
export function saveAsTemplate(params){
  return service.postWithoutProduct('/portal-task/task/saveAsTemplate', params)
}
