import { iEditorButton } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveButton(data: iEditorButton) {
    const { title_type, title } = data;
    if (title_type == 'btnTitle') {
        if (title == '') {
            message.error('请填写按钮内容');
            return false;
        } 
    } 
    return true;
}

export default saveButton;
