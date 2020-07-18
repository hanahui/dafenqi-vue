/*  标签模块api */
import service from "./service";
// 获取标签树数据
export function getLabelTree(params){
  return service.post('/labelsys-service/labelCategory/treeList', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 根据产品权限获取标签树列表
export function getLabelTreeByProduct(params){
  return service.post('/labelsys-service/labelCategory/treeListByProduct', params)
}

// 获取标签列表
export function getLabelList(params){
  return service.post('/labelsys-service/label/list', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 标签导出
export function exportLabel(params){
  // get
  service.downloadFile('/labelsys-service/label/export', params);
}

// 标签导入
export function importLabel(params){
  return service.uploadFile('/labelsys-service/label/info/import', params)
}


//  获取标签详情
export function getLabelDetail(params){
  return service.post('/labelsys-service/label/detail', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 更新标签详情
export function updateLabel(params){
  return service.post('/labelsys-service/label/edit', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 标签删除
export function deleteLabel(params){
  return service.post('/labelsys-service/label/delete', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

//  获取近期标签表格数据
export function getRecentList(params){
  return service.post('/labelsys-service/label/recentList', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

//自定义标签树
export function getCustomLabelTree(params){
  return service.post('/labelsys-service/labelCategory/treeListCustom', params)
}


// 模糊匹配自定义标签关键字
export function searchCustomLabel(params){
  return service.post('/labelsys-service/label/fuzzyQueryCustom', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 新增/修改自定义标签
export function updateCustomLabel(params){
  return service.post('/labelsys-service/label/editCustom', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}
