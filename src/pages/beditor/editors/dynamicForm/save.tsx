import { iEditorForms } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveForm(data: iEditorForms) {
    const { buttonTextValue, formList } = data;
    if (!buttonTextValue || !buttonTextValue.trim()) {
        message.error('请输入按钮文字');
        return false;
    }
    if (formList.length === 0) {
        message.error('您还没有选择表单组件哦');
        return false;
    }

    if (data.toast === 4) {
        if (!data.toastContent || !data.toastContent.startsWith('https://')) {
            message.error('请输入格式正确的表单跳转链接');
            return false;
        }
    }

    let flag = true;
    formList.some((v) => {
        if (v.type === 'customSelect') {
            // 自定义下拉
            const { customOptions } = v;
            const list = customOptions?.filter((item) => item.value);
            if (list?.length === 0) {
                message.error('自定义下拉选项不能为空');
                flag = false;
                return true;
            } else if (list?.length !== customOptions?.length) {
                message.error('自定义下拉选项内容不能为空');
                flag = false;
                return true;
            }
        }
        return false;
    });
    return flag;
}
export default saveForm;
