import request from "@/utils/request";

/**
 * 获取列表
 */
export function fetchList(data) {
  return request({
    url: "/plan/listByPage",
    method: "post",
    data,
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
 * 获取详情
 */

export function fetchDetail(id) {
  return request({
    url: "/plan/detail",
    method: "get",
    params: { planId: id },
  });
}

// 新增考核项目
export function addAssess(data) {
  return request({
    url: "/project/add",
    method: "post",
    data,
  });
}

// 新增考核指标
export function addAssessIndex(data) {
  return request({
    url: "/content/add",
    method: "post",
    data,
  });
}
