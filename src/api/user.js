import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

export function register(data) {
  return request({
    url: "/user/registry",
    method: "post",
    data: {
      ...data,
      checkPassword: data.password,
    },
  });
}

export function getInfo(token) {
  return request({
    url: "/user/currentUser",
    method: "get",
    params: { token },
  });
}

/**
 * 获取列表
 */
export function fetchList() {
  return request({
    url: "/user/list",
    method: "get",
  });
}

/**
 * 删除
 * @param {*} data
 * @returns
 */
export function deleteArticle(data) {
  return request({
    url: "/user/delete",
    method: "post",
    data,
  });
}

// 更新
export function updateArticle(data) {
  return request({
    url: "/user/change",
    method: "post",
    data,
  });
}
