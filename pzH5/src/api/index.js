import request from '@/utils/request.js'

//登录
export const login = (data) => {
  return request.post('/login', data)
}
//用户首页/Index/index
export const userHome = (params) => {
  return request.get('/Index/index', { params })
}

export default {
  login(data) {
    return request.post('/login', data)
  },
  h5Home() {
    return request.get('/Index/index')
  },
  //陪护师列表/h5/companion
  h5Companion() {
    return request.get('/h5/companion')
  },
  //创建订单/createOrder
  h5CreateOrder(data) {
    return request.post('/createOrder', data)
  },
  //订单列表/order/list
  h5OrderList(params) {
    return request.get('/order/list', { params })
  },
  //订单详情/order/detail
  h5OrderDetail(params) {
    return request.get('/order/detail', { params })
  },
}
