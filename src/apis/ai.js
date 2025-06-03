/**
 * ai接口
 **/
import { request, getFullUrl } from "@/utils/request.js";
// ai识别食物热量
export const RecognizeFoodApi = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: getFullUrl('/api/ai/getFoodRecognitionResult'),
      filePath: tempFilePath,
      name: 'image', 
      success: (uploadRes) => {
        try {
          console.log('上传响应:', uploadRes);
          if (uploadRes.statusCode === 200) {
            const result = JSON.parse(uploadRes.data);
            console.log('解析后的结果:', result);
            resolve(result);
          } else {
            reject(new Error('上传失败，状态码：' + uploadRes.statusCode));
          }
        } catch (error) {
          console.error('解析响应数据失败:', error);
          reject(error);
        }
      },
      fail: (error) => {
        console.error('上传文件失败:', error);
        reject(error);
      }
    });
  });
};
// 获取健康建议
export const getHealthAdviceApi = (studentNumber) => {
  return request({
    url: `/client/user/healthAdvise/${studentNumber}`,
  });
}