//  整体看板模块 api 管理

import service from './service'

/* 大盘总览模块接口*/
// 获取年龄图表数据
export function getAgeData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/age', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
  // return {"retCode":"0","retDesc":"成功","resultData":{"ageStat":{"4":"27030245","6":"7545711","5":"4172232","3":"3569015","7":"2139155","8":"1013730","1":"892118","2":"699954","9":"515842","null":"368309","10":"356107","11":"211585","0":"29787"}}}
}

// 获取性别图表数据
export function getGenderData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/gender', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取学历图表数据
export function getEducationData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/education', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取省份图表数据
export function getProvinceData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/prov', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取城市图表数据
export function getCityData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/area', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取操作系统数据
export function getOperationData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/os', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取终端品牌数据
export function getTerminalData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/brand', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取会员类型数据
export function getMembershipTypeData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/membercategory', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取会员增长数据
export function getMembershipGrowthData(url){
  return service.post(url || '/labelsys-service/userInfo/baseInfo/common/memberincrease', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}


/* 访问偏好模块接口*/
// 获取访问次数数据
export function getVisitData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/visit', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取时间段占比数据
export function getPeriodRateData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/periodrate', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取平均时长数据
export function getUsedurData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/usedur', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取行为类型数据
export function getActionTypeData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/action', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取社交活跃度数据
export function getActivityData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/activity', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取用户行为数据
export function getUserActionData(url){
  return service.post(url || '/labelsys-service/userInfo/useActionInfo', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}


/* 消费偏好模块接口 */
// 获取消费类型数据
export function getConsumeTypeData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/consume/type', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取消费能力数据
export function getConsumeAbilityData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/consume/ability', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取消费结构-性别数据
export function getConsumeGenderData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/consume/cgender', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取消费结构-年龄数据
export function getConsumeAgeData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/consume/cage', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取消费结构-城市数据
export function getConsumeCityData(url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/consume/ccity', {}, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}



/* 播放偏好模块接口 */
// 获取播放视频数据
export function getVideoData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/video', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取播放次数数据
export function getPlayCountData(params,url){
  return service.post(url || '/labelsys-service/userInfo/actionInfo/use/play', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取播放一级分类数据
export function getCategoryData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/category', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取播放性别偏好数据
export function getPlayGenderData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/gender', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取播放城市偏好数据
export function getPlayCityData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/city', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}


/* 内容偏好模块接口 */
// 获取内容类型偏好数据
export function getTypePreferData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/name', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取内容类型年代偏好数据
export function getYearPreferData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/time', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取内容-任务TOP10数据
export function getPersonTopData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/attribute', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取内容Top10数据
export function getContentTopData(params,url){
  return service.post(url || '/labelsys-service/userInfo/preference/content', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取内容一级分类数据
export function getFirstCategoryData(params,url){
  return service.post(url || '/labelsys-service/userInfo/getClassName', params)
}


/* 热播排行模块接口 */
// 获取热门导演数据
export function getHotDirectorData(params){
  return service.post('/labelsys-service/hotResources/hotRank/director', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取热门演员数据
export function getHotActorData(params){
  return service.post('/labelsys-service/hotResources/hotRank/actor', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取热门电影数据
export function getHotMoviesData(params){
  return service.post('/labelsys-service/hotResources/hotRank/film', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}

// 获取热门电视剧数据
export function getHotTVData(params){
  return service.post('/labelsys-service/hotResources/hotRank/tv', params, {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'})
}







