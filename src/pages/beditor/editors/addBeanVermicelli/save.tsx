import { iEditorAddBeanVermicelli } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveBean(data: iEditorAddBeanVermicelli) {
    const { weChat_nickName, weChat_image, code_image } = data;
    if (weChat_nickName == '') {
        message.error('请填写微信昵称');
        return false;
    }
    if (weChat_image == '') {
        message.error('请上传微信头像');
        return false;
    }
    if (code_image == '') {
        message.error('请上传微信二维码');
        return false;
    }
    return true;
}
export default saveBean;
