/* 群体画像api */
import service from "./service";
// 获取群体画像列表
export function getGroupList(params){
  return service.get('/labelsys-service/labelgroup/groups', params)
}

// 群体删除
export function deleteGroup(id){
  return service.delete('/labelsys-service/labelgroup/group/' + id, {},{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 群体刷新
export function refreshGroup(id,params){
  return service.post('/labelsys-service/labelgroup/group/' + id + '/refresh', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 群体状态查询
export function getGroupStatus(params){
  return service.post('/labelsys-service/labelgroup/group/status', params)
}

//获取标签产品权限
export function getRightOfLabel(){
  return service.post('/portal/sysMgr/product', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 创建新群体
export function createGroup(params){
  return service.post('/labelsys-service/labelgroup/group', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 更新群体
export function updateGroup(params){
  return service.post('/labelsys-service/labelgroup/group',params,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 查询群体详情
export function getGroupDetail(groupId){
  return service.get('/labelsys-service/labelgroup/group/' + groupId, {})
}


// 获取模块列表
export function getModuleList(params){
  return service.post('/labelsys-service/labelgroup/modules', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 保存模块配置
export function saveModuleConfigure(groupId,params){
  return service.post('/labelsys-service/labelgroup/group/' + groupId + '/modules', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}


