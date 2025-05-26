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
          const result = JSON.parse(uploadRes.data);
          resolve(result);
      },
    });
  });
};