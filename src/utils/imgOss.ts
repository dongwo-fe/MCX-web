/**
 * 图片上传公共方法
 */
import { IMGOSSQF } from '@dm/img_oss';
import { message } from 'antd';
import { CreateOpsWebApp, CreateSellerWebApp } from '../api/fetch';
import { BUCKET } from '@/api/hotConfig';
const request = CreateOpsWebApp();
const request1 = CreateSellerWebApp();


const IMGCLIENT = {
  upload: async (file: any, val?: any) => {
    const UploadWithQF = new IMGOSSQF(val === 'shop' ? request1 : request, BUCKET, 'build_blocks_web');
    try {
      const IMGCLIENT = await UploadWithQF.getInstance();
      const imgOssData = await val === 'shop' ? IMGCLIENT.upload(file, {}, { maxWidth: 0, maxHeight: 0, maxSize:  0}) : IMGCLIENT.upload(file);
      console.log('-=imgOss=', imgOssData);
      return imgOssData;
    } catch (error: any) {
      let showtxt = '';
      if (error.code === 0) {
        showtxt = error.message;
      }
      message.error(showtxt || '上传失败，请重新上传');
    }
  },
};

export default IMGCLIENT;
