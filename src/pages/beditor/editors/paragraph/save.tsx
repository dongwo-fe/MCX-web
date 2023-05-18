import { iEditorTagTitle } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveText(data: iEditorTagTitle) {
    const { title_type, title, paragraphList } = data;
    if (title_type == 'tagTitle') {
        if (title == '') {
            message.error('请填写内容标题');
            return false;
        } else if (paragraphList.isEmpty()) {
            message.error('请填写内容文字');
            return false;
        }
    } else if (paragraphList.isEmpty()) {
        message.error('请填写内容文本');
        return false;
    }
    return true;
}

export default saveText;
