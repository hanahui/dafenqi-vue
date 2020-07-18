//  自助提数-模板模块 api 管理

import service from './service'

//  查询模板列表
export function getTemplateList(params){
  return service.postWithoutProduct('/portal-task/template/getTemplateList', params)
}

// 获取归属分类下拉列表
export function getCategoryList(params){
  return service.postWithoutProduct('/portal-task/manage/queryAuthList', params)
}

// 获取用户下拉列表
export function getUserList(){
  return service.postWithoutProduct('/portal-task/manage/getUserList', {})
}

// 新增/修改模板
export function saveTemplate(params){
  return service.postWithoutProduct('/portal-task/template/saveCustomExtractTemplate', params)
}

// 查看模板详情
export function getTemplateInfo(params){
  return service.postWithoutProduct('/portal-task/template/detail', params)
}

// 修改模板归属人
export function updateTemplateOwner(params){
  return service.postWithoutProduct('/portal-task/template/setTemplateUserName', params)
}

// 删除模板
export function deleteTemplate(params){
  return service.postWithoutProduct('/portal-task/template/deleteTemplate', params)
}

