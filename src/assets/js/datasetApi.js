/* 数据集管理 api*/
import service from './service'

//  获取数据集列表
export function getDatasetList(params){
  return service.postWithoutProduct('/portal-task/dataset/getDatasetList', params)
}

// 新增数据集（上传文件 form表单提交）
export function addDataset(params){
  return service.uploadFile('/portal-task/dataset/addDataset', params)
}

// 数据集详情
export function getDatasetInfo(params){
  return service.postWithoutProduct('/portal-task/dataset/getDatasetById', params)
}

// 数据集删除
export function deleteDataset(params){
  return service.postWithoutProduct('/portal-task/dataset/deleteDataset', params)
}

// 数据集下载
export function downloadDataset(params){
  service.downloadFile('/portal-task/dataset/downloadFile', params)
}

