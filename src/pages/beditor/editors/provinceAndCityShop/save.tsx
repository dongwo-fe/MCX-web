import { message } from 'antd';

// 保存校验
function saveProvinceAndCityShop(data) {
    if (!data.shopFile.src) {
        message.warning('请上传门店文件');
        return false;
    }
    if (!data.maxMakeCount) {
        message.warning('请输入最大预约人数');
        return false;
    }
    if (data.sendMessage && !data.msgTemplateId) {
        message.warning('请选择短信模板');
        return false;
    }
    if (data.buttonTextValue?.trim() === '') {
        message.warning('请输入按钮文案');
        return false;
    }
    return true;
}

export default saveProvinceAndCityShop;
