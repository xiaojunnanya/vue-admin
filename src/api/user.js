import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/registery',
    method: 'post',
    data: {
      ...data,
      checkPassword: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/currentUser',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
