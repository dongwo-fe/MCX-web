import { iEditorPage, iEditorShare } from '@/store/config';
import { message } from 'antd';
import saveBean from './editors/addBeanVermicelli/save';
import saveBanner from './editors/banner/save';
import saveVideo from './editors/buildvideo/save';
import saveCoupons from './editors/coupons/save';
import saveElevator from './editors/elevator/save';
import saveForm from './editors/form/save';
import saveDynamicForm from './editors/dynamicForm/save';
import saveGoods from './editors/good/save';
import saveImageTextNav from './editors/graphical/save';
import saveImageDeal from './editors/imageDeal/save';
import saveImageHot from './editors/imageHot/save';
import saveMarkets from './editors/markets/save';
import saveNotice from './editors/notice/save';
import saveText from './editors/paragraph/save';
import savePizzle from './editors/puzzle/save';
import saveShops from './editors/shops/save';
import saveButton from './editors/button/save';
import saveProvinceAndCityShop from './editors/provinceAndCityShop/save';

// 保存提交校验
const saveData: any = {
    title_paragraph: saveText,
    rich_text: () => true,
    banner: saveBanner,
    image_puzzle: savePizzle,
    image_hot: saveImageHot,
    image_text_nav: saveImageTextNav,
    elevator_navigation: saveElevator,
    notice: saveNotice,
    video: saveVideo,
    dividing_line: () => true,
    markets: saveMarkets,
    forms: saveForm,
    coupons: saveCoupons,
    addBeanVermicelli: saveBean,
    image_deal: saveImageDeal,
    goods: saveGoods,
    shops: saveShops,
    button: saveButton,
    provinceAndCityShop: saveProvinceAndCityShop,
    dynamicForm: saveDynamicForm
};

export const pageInfoCheck = (data: iEditorPage, share: iEditorShare, posterShare: iEditorShare | null) => {
    const { title, startTime, endTime, cityId, marketId, pageType, markets = [] } = data;
    const { title: shareTitle, desc, img } = share;
    if (!title || !title.trim()) {
        message.error('请输入落地页标题');
        return false;
    }
    if (!cityId) {
        message.error('请选择城市');
        return false;
    }
    if (!marketId && markets.length === 0) {
        message.error('请选择卖场');
        return false;
    }
    if (pageType !== 'member' && (!startTime || !endTime)) {
        message.error('请选择活动有效期');
        return false;
    }
    if (!shareTitle || !shareTitle.trim()) {
        message.error('请输入分享标题');
        return false;
    }
    if (pageType !== 'member' && (!desc || !desc.trim())) {
        message.error('请输入分享描述');
        return false;
    }
    if (!img) {
        message.error('请上传分享图片');
        return false;
    }

    if (posterShare) {
        if (!posterShare.title) {
            message.error('请输入海报分享标题');
            return false;
        }

        if (!posterShare.desc) {
            message.error('请输入海报分享内容');
            return false;
        }

        if (!posterShare.cardTheme) {
            message.error('请选择分海报享按钮');
            return false;
        }

        if (!posterShare.img) {
            message.error('请上传海报底图');
            return false;
        }
    }

    return true;
};

function saveCheck(data: any, type: string) {
    const test = saveData[type](data);
    return test;
}
export default saveCheck;
