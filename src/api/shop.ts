import { CreateOpsWebApp, CreateSellerWebApp } from './fetch';

const request = CreateSellerWebApp();


// 城市
export function queryCityList(params: any) {
  return request.post<any>('/cityStation/dropDownListPermission', params);
};


// 卖场列表
export function queryShopList(params: any) {
  return request.post<any>('/market/listMarketSelectedShopPermission', params);
};

// 店铺table
export function queryApplyShop(params: any) {
  return request.post<any>('/shop/listShopApplicable', params);
}

// 所属品牌
export function queryBrand(params: any) {
  return request.post<any>('/goods/brand/queryBrandListPermission', params);
}

// 所属类目
export function queryCategory(params: any) {
  return request.post<any>('/goods/listCategoryTreeByShopIds', params);
}

// 商品table
export function queryGoodsList(params: any) {
  return request.post<any>('/goods/listGoodsApplicable', params);
}

// 查询店铺主页信息
export function queryShopHomepage(parmas: any) {
  return request.post<any>('/shopDecorate/getShopHomeDetail', parmas);
};

// 查询店铺装修信息
export function queryShopFinish(params: any) {
  return request.post<any>('/shopDecorate/queryByDecorateId', params);
};

// 恢复系统默认
export function recoverDefault(params: any) {
  return request.post<any>('/shopDecorate/deletedByDecorateId', params);
}

// 获取系统推荐语
export function getSysRecommendWord(): any {
  return request.post('/shopDecorate/sysRecommend');
}


// 发布
export function publishShop(params: any) {
  return request.post<any>('/shopDecorate/saveShopDecorate', params);
};

// 评价列表
export function queryEvaluationlist(params: any) {
  return request.post<any>('/shopDecorate/listShopTalks', params);
}

// 逛逛商品
export function queryRecommendCommodities(params: any) {
  return request.post<any>('/shopDecorate/listShopGoods', params);
}

// 导购信息
export function queryGuideinfo(params: any) {
  return request.post<any>('/shopDecorate/queryGuide', params)
}