import request from "@/utils/request";

/**
 * 获取列表
 */
export function fetchList() {
  return request({
    url: "/setting/get",
    method: "get",
  });
}

// 保存
export function saveSetting(data) {
  return request({
    url: "/setting/update",
    method: "post",
    data,
  });
}
