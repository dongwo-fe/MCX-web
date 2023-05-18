import { iEditorBanner } from '@/store/config';
import { getIsEmpty } from '@/utils/tools';
import { message } from 'antd';

// 保存校验
function saveBanner(data: iEditorBanner) {
    const { imgList } = data;
    if (getIsEmpty(imgList, 'url')) {
        message.error('请上传轮播图片');
        return false;
    }
    return true;
}
export default saveBanner;
