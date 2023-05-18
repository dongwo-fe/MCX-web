import { iEditorNotice } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveNotice(data: iEditorNotice) {
    const { text_context } = data;
    if (text_context == '') {
        message.error('请填写公告内容文字');
        return false;
    }
    return true;
}
export default saveNotice;
