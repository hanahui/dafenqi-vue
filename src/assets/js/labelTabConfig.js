// 标签表配置接口api

import service from "./service";

// 标签表列表
export function getLabelTabList() {
  return service.postWithoutProduct(
    "/portal-task/labelDs/list",
    {},
    { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
  );
}

// 标签表详情
export function getLabelTabDetail(params) {
  return service.postWithoutProduct("/portal-task/labelDs/detail", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}

// 标签表删除
export function getLabelTabDelete(params) {
  return service.postWithoutProduct("/portal-task/labelDs/delete", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}

// 标签表修改
export function getLabelTabEdit(params) {
  return service.postWithoutProduct("/portal-task/labelDs/edit", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}
