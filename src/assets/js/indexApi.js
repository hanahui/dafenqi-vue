//  达芬奇首页 api 管理
import $ from  'jquery'
import service from './service'
const serverconfig = globalConfig;

  //  根据用户菜单权限
  export function getMenuOfUser(systemId){
    return service.postWithoutProduct(serverconfig.portalUrl+'/portal-oauth/subsystem/menu', {subsystemId: systemId})
  }
  // 获取登录用户信息
  export function getLoginUserInfo(callback){
    // return service.getWithoutProduct('/portal-oauth/user/info', {})
    service.getUserInfo(callback)
    // return {"head":{"requestId":"d4eb3ec1-361c-4293-b3bb-fa791c206dc8","respStatus":"00","respCode":"00","respDesc":null},"data":{"id":"24","username":"13592517960","name":"韩阿辉","authorities":[{"authority":"test4"},{"authority":"咪视通"},{"authority":"test2"},{"authority":"test3"},{"authority":"咪咕影院H5"},{"authority":"咪咕TV"},{"authority":"咪咕直播app"},{"authority":"咪咕视频app"},{"authority":"咪咕影院app"},{"authority":"test1"}],"passwordFlag":0,"deptId":"1","deptName":"研发中心","dataAuthority":"","userType":0}}
  }

  // 获取用户产品权限
  export function getProductOfUser(callback){
    // return service.getWithoutProduct('/portal-oauth/getLabelAuth', {})
    // service.getProductOfUser(callback)
  }

  // 快捷保障
  export function reporting(params){
    return service.postWithoutProduct('/biz-services-logger/sdk/logger/quickReporting',params)
  }

