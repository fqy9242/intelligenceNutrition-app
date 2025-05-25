import { request } from '@/utils/request'
export const loginApi = (data) => {
    return request({
        url: '/client/user/login',
        method: 'post',
        data
    })
}