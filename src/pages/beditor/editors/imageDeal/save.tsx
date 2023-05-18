import { iEditorImageDeal } from '@/store/config';
import { message } from 'antd';

// 自定义图片保存校验
function saveImageDeal(data: iEditorImageDeal) {
    const { imageUrl, imageWidth, imageHeight, rotate, sizeType, sizeWidth, sizeHeight, posLeft, posTop, cropHeight, cropWidth } = data;
    if (imageUrl == '') {
        message.error('请上传编辑图片');
        return false;
    }
    return true;
}
export default saveImageDeal;
