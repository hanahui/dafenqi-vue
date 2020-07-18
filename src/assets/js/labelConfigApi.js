// 标签配置 api

import service from "./service";

// 标签树
export function getTreeList() {
  return service.postWithoutProduct(
    "/portal-task/labelMain/treeList",
    {},
    { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
  );
}

// 标签详情
export function getLabelDetail(params) {
  return service.postWithoutProduct("/portal-task/labelMain/detail", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}

// 标签编辑
export function getLabelEdit(params) {
  return service.postWithoutProduct("/portal-task/labelMain/edit", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}

// 标签删除
export function deleteLabel(params) {
  return service.postWithoutProduct("/portal-task/labelMain/delete", params, {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  });
}
