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
// 添加饮食记录
export const addDietRecordApi = (data) => {
    return request({
      url: "/client/user/dietaryRecord",
      method: "post",
      data
    });
}
// 学生查询今日饮食记录
export const getTodayDietRecordApi = (studentNumber) => {
    return request({
      url: `/client/user/dietaryRecord/${studentNumber}`,
    })
}
// 获取饮水记录
export const getWaterRecordApi = (studentNumber, onlyToday) => {
    return request({
      url: "/client/user/drinkingWaterRecord",
      data: {
        studentNumber,
        onlyToday
      }
    })
}
// 添加饮水记录
export const addWaterRecordApi = (data) => {
    return request({
      url: "/client/user/drinkingWaterRecord",
      method: "post",
      data
    })
}