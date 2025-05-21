import request from '@/utils/request'
export const login = (data) => {
    return request({
        url: '/client/user/login',
        method: 'post',
        data
    })
}