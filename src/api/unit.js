import request from "@/utils/request";

/**
 * 获取列表
 */
export function fetchList() {
  return request({
    url: "/department/list",
    method: "get",
  });
}

/**
 * 创建
 * @param {*} data
 * @returns
 */
export function createArticle(data) {
  return request({
    url: "/department/add",
    method: "post",
    data,
  });
}
/**
 * 更新
 * @param {*} data
 * @returns
 */
export function updateArticle(data) {
  return request({
    url: "/department/update",
    method: "post",
    data,
  });
}

/**
 * 删除
 * @param {*} data
 * @returns
 */
export function deleteArticle(data) {
  return request({
    url: "/department/delete",
    method: "post",
    data,
  });
}
