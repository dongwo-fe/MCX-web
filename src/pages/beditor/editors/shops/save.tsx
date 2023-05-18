import { iEditorShops } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveShops(data: iEditorShops) {
    const { shop_list } = data;
    if (shop_list.length === 0) {
        message.error('请选择店铺');
        return false;
    }
    return true;
}
export default saveShops;
