import { iEditorCoupons } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveCoupons(data: iEditorCoupons) {
    const { list, style, list2 } = data;

    if (list.length === 0) {
        message.error('请选择优惠券');
        return false;
    }
    if (style === 13 && list2?.length === 0) {
        message.error('请选择优惠券');
        return false;
    }
    if (data.sendMessage && !data.msgTemplateId){
        message.error('请选择短信模板');
        return false;
    }
    return true;
}
export default saveCoupons;
