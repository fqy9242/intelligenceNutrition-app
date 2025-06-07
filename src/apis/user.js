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
// 学生查询饮食记录
export const getDietRecordApi = (studentNumber, onlyToday) => {
    return request({
      url: `/client/user/dietaryRecord/${studentNumber}`,
      data: {
        onlyToday
      }
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
// 获取运动记录
export const getSportRecordApi = (studentNumber, onlyToday) => {
    return request({
      url: `/client/sport/${studentNumber}`,
      data: {
        onlyToday
      }
    })
}
// 添加运动记录
export const addSportRecordApi = (data) => {
    return request({
      url: "/client/sport",
      method: "post",
      data
    });
}
// 获取今日推荐摄入量
export const getTodayRecommendIntakeApi = (studentNumber) => {
  return request({
    url: `/client/user/todayRecommendCalories/${studentNumber}`,
  })
}
// 获取学生本周运动次数
export const getStudentSportCountApi = (studentNumber) => {
  return request({
    url: `/client/sport/totalThisWeekSport/${studentNumber}`,
  });
}
// 获取健康评分
export const getHealthScoreApi = (studentNumber) => {
  return request({
    url: `/client/user/getHealthScore/${studentNumber}`
  })
}

// 获取健康打卡天数
export const getHealthCheckInDaysApi = (studentNumber) => {
  return request({
    url: `/client/user/heathCheckInDays/${studentNumber}`
  });
}

