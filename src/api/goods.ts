import { CreateOpsWebApp } from './fetch';
import { iBaseListData } from './shops';
const request = CreateOpsWebApp();

// 活动列表
export function queryCampaignList(prams: Object) {
    return request.post('/campaign/queryCampaignList', prams);
}

// 优惠卷列表
export function queryCouponList(prams: Object) {
    return request.post('/dmCoupon/queryCouponList', prams);
}

// 下载商品模版
export function downloadTemplate(prams: Object) {
    return request.getFile('/operation/operActivity/downloadTemplate', prams);
}

// 落地页上传模版
export function goodsImport(params: Object) {
    return request.postFile('/operation/operActivity/applet/goodsImport', params);
}

// 下载失败模版的商品列表
export function exportErrorGoods(params: Object) {
    return request.getFile('/operation/operActivity/applet/exportErrorGoods', params);
}

//根据条件查询商品列表
export function getListGoodsPage(prams: iListGoodsPageprams) {
    return request.post<iListGoodsPageData>('/goods/listGoodsPage', prams);
}

//类目树
export function listCategoryTree(params: {}) {
    return request.post('/platformMarketSaas/listGoods', params);
}

//新店铺列表
export function listShopIdByLikeName(params: {}) {
    return request.post('/shop/listShopIdByLikeName', params);
}

//新卖场列表
export function listMarketIdByLikeName(params: {}) {
    return request.post('/market/listMarketIdByLikeName', params);
}

//新商品列表
export function listSkuByCondition(params: {}) {
    return request.post('/goods/sku/putawayListSkuByCondition', params);
}
export interface iListGoodsPageprams {
    page: number;
    pageSize: number;
    goodsTitle: string;
}

interface iListGoodsPageData extends iBaseListData {
    list: iGoodsData[];
}

export interface iGoodsData {
    activityNames: null;
    boothName: string; //'1085-1-5-007';
    brandName: string; //'其他类';
    campaignName: null;
    categoryId: string; //'844906997903134720/844911185726935040';
    categoryName: string; //'定制/全屋定制';
    cityId: number; // 589757212166094800;
    cityStationName: null;
    copyGoodsConfirmed: number; // 0;
    copyGoodsConfirmedName: null;
    couponName: null;
    couponNames: null;
    creator: string; //'郜化强';
    gmtCreated: number; // 1663576025000;
    gmtModified: string; // '2022-09-19 18:04:59';
    gmtPublished: string; // '2022-09-19 18:04:52';
    goodsAddress: string; //'';
    goodsCode: string; //'819990301200002';
    goodsDescription: string; // '';
    goodsId: string; // '731756793516662784';
    goodsMainPic: string; // 'iOS/Resources/AAD6F7A2-F65B-4F75-8F9A-BF76C9D6CD34-1663575945523.jpg';
    goodsMainPicUrl: string; //'https://juranapp-test.oss-cn-beijing.aliyuncs.com/iOS/Resources/AAD6F7A2-F65B-4F75-8F9A-BF76C9D6CD34-1663575945523.jpg';
    goodsMarque: string; // '111111';
    goodsMaxMarketPrice: string; //'999';
    goodsMaxPrice: string; //'999';
    goodsMinPrice: string; // '999';
    goodsModel: string; // '111111';
    goodsPic: string; // 'iOS/Resources/AAD6F7A2-F65B-4F75-8F9A-BF76C9D6CD34-1663575945523.jpg';
    goodsPicUrls: null;
    goodsPrice: null;
    goodsQuality: null;
    goodsSkuId: string; //'731781400390299671/731781400411271168/731781400411271169/731781400411271170';
    goodsSkuIds: string; // '731781400390299671/731781400411271168/731781400411271169/731781400411271170';
    goodsStatus: number; //  10;
    goodsStock: null;
    goodsTitle: string; //'领域展开 恶鬼缠身';
    goodsType: number; //  2;
    id: string; //'849578';
    isCanCustom: null;
    isCopyGoods: number; // 0;
    isCustom: number; //  1;
    isEntry: null;
    isFreeMeasure: number; // 1;
    isInstallFee: number; //  0;
    isTransaction: null;
    isUpFee: number; // 0;
    marketId: number; //  589758156146544600;
    marketName: string; //'哈尔滨爱建店';
    merchantId: string; //'592598390917177344';
    merchantName: string; //'吴佳齐';
    miniExplosiveSearchWeightSort: null;
    miniSearchWeightSort: number; // 0;
    modifier: string; //'郜化强';
    originalPrice: null;
    paramValue: null;
    publisher: string; //'郜化强';
    publisherList: null;
    publisherPhone: '';
    qualityGrade: number; // 1;
    relation: null;
    releaseType: number; //  1;
    repeatLabel: number; //  0;
    searchCategoryName: string; //'定制/全屋定制';
    shopAttribute: null;
    shopId: string; // '597244708294066176';
    shopName: string; //'顶层装饰(哈尔滨爱建店)';
    shopRelevance: null;
    good_image: string;
    sellingTag: string; //营销标签
}
