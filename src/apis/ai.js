/**
 * ai接口
 **/
import { request } from "@/utils/request.js"
// ai识别食物热量
export const RecognizeFoodApi = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: '/api/ai/getFoodRecognitionResult', // 使用与request.js相同的url处理逻辑
      filePath: tempFilePath,
      name: 'image', // 与后端参数名保持一致
      success: (uploadRes) => {
        try {
          const result = JSON.parse(uploadRes.data);
          resolve(result);
        } catch (e) {
          reject(new Error('解析结果失败'));
        }
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
};