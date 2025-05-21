const baseUrl = "http://localhost:8080" // 基础url
// 设置请求拦截器
const httpInterceptor = {
    invoke(options) {
      if (!options.url.startsWith("http")) {
        // 不是以http开头 => 拼接
        options.url = baseUrl + options.url;
      }
      // 设置请求超时时间为10s
      options.timeout = 10000;
      // 添加小程序端请求头标识
      options.header = {
        ...options.header,
        "source-client": "miniapp",
      };
      // 添加token请求头标识
    //   const memberStore = useMemberStore();
    //   const token = memberStore.profile?.token;
    //   if (token) {
    //     options.header.Authorization = token;
    //   }
    }
} 

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // token 失效
        //   const memberStore = useMemberStore()
        //   memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data).msg || '请求错误',
          })
          reject(res)
        }
      },
      fail(res) {
        uni.showToast({
          icon: 'none',
          title: '请求错误！',
        })
        reject(res)
      },
    })
  })
}