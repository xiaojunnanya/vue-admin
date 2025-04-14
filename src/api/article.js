import request from "@/utils/request";

// 获取方案列表
export function fetchList(query) {
  return request({
    url: "/plan/list",
    method: "post",
    data: {
      name: "",
      status: 0,
    },
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

export function createArticle(data) {
  return request({
    url: "/plan/add",
    method: "post",
    data,
  });
}

export function updateArticle(data) {
  return request({
    url: "/vue-element-admin/article/update",
    method: "post",
    data,
  });
}
