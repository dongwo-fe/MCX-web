import { iEditorGraphical } from '@/store/config';
import { getIsEmpty } from '@/utils/tools';
import { message } from 'antd';

// 保存校验
function saveImageTextNav(data: iEditorGraphical) {
    const { nav_type, image_title_list, title_list } = data;
    if (nav_type == 1) {
        if (getIsEmpty(image_title_list, 'url')) {
            message.error('请上传图片导航后重试~');
            return false;
        }
    } else {
        if (getIsEmpty(title_list, 'title_name')) {
            message.error('请填写导航文案~');
            return false;
        }
    }
    return true;
}
export default saveImageTextNav;
