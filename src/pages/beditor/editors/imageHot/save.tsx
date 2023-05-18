import { iEditorImageHot } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveImageHot(data: iEditorImageHot) {
    const { image_url, links } = data;
    if (image_url == '') {
        message.error('请上传热区图片');
        return false;
    }
    if (links.length == 0) {
        message.error('请添加至少一个热区链接');
        return false;
    }
    // if (links.length > 0 && links[0].link_url == '') {
    //     message.error('请添加至少一个热区链接');
    //     return false;
    // }
    return true;
}
export default saveImageHot;
