import { iEditorGoods } from '@/store/config';
import { message } from 'antd';

// 商品配置保存校验
function saveGoods(data: iEditorGoods) {
    const { renderGoodList, showMarketingTag } = data;
    if (renderGoodList.length == 0) {
        message.error('上传至少一条商品数据');
        return false;
    }
    if (showMarketingTag) {
        let needSellingTag = false;
        renderGoodList.some((v) => {
            if (!v.sellingTag) {
                needSellingTag = true;
                return true;
            }
            return false;
        });
        if (needSellingTag) {
            message.error('商品营销标签未填写完全');
            return false;
        }
    }
    return true;
}
export default saveGoods;
