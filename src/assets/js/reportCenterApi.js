// 报表中心APi
import service from './service'

// 查询热门画像/热门搜索数据
export function getHotPortraitData(params){
  return service.post('/labelsys-service/labelgroup/hot', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 查询系统日志数据
export function getSystemLogData(){
  return service.post('/labelsys-service/labelgroup/log', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

