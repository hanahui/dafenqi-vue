// 我的收藏APi
import service from './service'

// 查询收藏列表
export function getCollectionList(params){
  return service.post('/labelsys-service/label/collectionList', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 收藏群体/标签(群体：type=1; 标签：type=2)
export function collectionGroup(params){
  return service.post('/labelsys-service/myConllection/conllection', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}


// 取消收藏群体/标签
export function cancelCollection(params){
  return service.post('/labelsys-service/myConllection/deleteConllection', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 导出收藏标签
export function exportCollectionLabel(params){
  return service.downloadFile('/labelsys-service/label/conllectionExport', params);
}


