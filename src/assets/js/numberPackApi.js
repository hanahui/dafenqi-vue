//  自助提数-号码包 api 管理

import service from './service'

//  任务保存/修改接口
export function saveTask(params){
  return service.postWithoutProduct('/portal-task/marketing/telnum/edit', params)
}

// 号码包任务详情
export function getTaskInfo(params){
  return service.postWithoutProduct('/portal-task/marketing/telnum/queryTaskById', params)
}

// 上传文件()
export function uploadFile(params){
  return service.uploadFile('/portal-task/marketing/telnum/fileUpload', params)
}

// 下载文件
export function downloadFile(params){
  return service.downloadFile('/portal-task/marketing/telnum/download', params)
}


