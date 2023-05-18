import { iEditorMarkets } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveMarkets(data: iEditorMarkets) {
    const { market_list } = data;
    if (market_list.length === 0) {
        message.error('请选择卖场');
        return false;
    }
    return true;
}
export default saveMarkets;
