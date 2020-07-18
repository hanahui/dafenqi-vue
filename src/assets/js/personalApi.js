// 个人画像APi
import service from './service'

// 查询个人画像信息
export function getPersonalInfo(params){
  return service.post('/labelsys-service/userInfo/queryInfo', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}
