import request from "@/utils/request";

/**
 * 获取方案列表
 */
export function fetchList(data) {
  return request({
    url: "/plan/listByPage",
    method: "post",
    data,
  });
}

export function fetchArticle(id) {
  return request({
    url: "/vue-element-admin/article/detail",
    method: "get",
    params: { id },
  });
}

export function fetchPv(pv) {
  return request({
    url: "/vue-element-admin/article/pv",
    method: "get",
    params: { pv },
  });
}

/**
 * 创建
 * @param {*} data
 * @returns
 */
export function createArticle(data) {
  return request({
    url: "/plan/add",
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
    url: "/plan/update",
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
    url: "/plan/delete",
    method: "post",
    data,
  });
}

/**
 * 获取方案详情
 */

export function fetchDetail(id) {
  return request({
    url: "/plan/detail",
    method: "get",
    params: { planId: id },
  });
}
