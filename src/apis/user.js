import { request } from '@/utils/request'
export const loginApi = (data) => {
    return request({
        url: '/client/user/login',
        method: 'post',
        data
    })
}
// 获取下一次体检计划
export const getNextCheckPlanApi = () => {
    return request({
      url: "/client/user/physicalExaminationPlan",
    });
}
// 获取学生的历史健康数据
export const getHealthHistoryApi = (studentNumber) => {
    return request({
        url: "/client/user/historyHealthData",
        data: {
            studentNumber
        }
    })
}