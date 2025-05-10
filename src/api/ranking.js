import request from "@/utils/request";

/**
 * 获取列表
 */
export function fetchList() {
  return request({
    url: "/rank/getList",
    method: "get",
    params: {
      year: "2025",
    },
  });
}
