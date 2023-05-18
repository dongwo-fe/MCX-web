import { CreateOpsWebApp, CreateAppWebApp } from './fetch';

const request = CreateOpsWebApp();

const appRequest = CreateAppWebApp();

// 查询店铺列表
export function getShopList(params: iShopSelectPageParams) {
    return request.post<iSelectByShopsAndBrandData>('/platformMarketSaas/selectByShopsAndBrand', params);
}
interface iShopSelectPageParams {
    bizSource?: string;
    page: number;
    pageSize: number;
    shopName?: string;
}
export interface iShopData {
    boothId: string; //'628509571022389248';
    boothName: string | null; //null;
    brandName: string; //'冠珠陶瓷';
    mainKey: string; //'file/1638960038883/picture';
    marketId: string; //'615330757208076288';
    marketName: string; //国门一号;
    shopCode: string; //'0357439842353';
    shopId: string; //"628510334554439680"
    shopName: string; //"冠珠陶瓷（国门一号）"
    status: number;
    cityStationId: '824358401244008410';
    buildingId: '691443028356644864';
    floorId: '691443074238136320';
    merchantId: '699496763148902400';
    merchantName: '北京洞窝数字科技有限公司';
    aliasName: null;
    buildingName: '1';
    floorName: '1';
    cityStationName: '北京北京市';
    shopAddress: '北京';
    address: '居然之家(玉泉营店)';
    brandNames: ['非同'];
    categoryNames: ['沙发'];
    openTime: null;
    entryAppTime: '2022-05-31';
    entryed: 2;
    entryedName: '已入驻';
    holidayed: 2;
    summerWintered: 2;
    summerRange: null;
    winterRange: null;
    workingDay: '00:07-23:07';
    holiday: null;
    workingDayOther: null;
    holidayOther: null;
    businessTime: '00:07-23:07';
    label: '';
    specialService: '';
    statusName: '停用';
    qualityGrade: 0;
    rightsNum: 0;
    modifier: '乔延军';
    gmtModified: '2022-09-06 17:52:47';
    gmtCreated: '2022-05-31 10:37:25';
    attributeName: '洞窝自定义数据';
    attribute: 1;
    logoKey: '';
    goodsQuantity: null;
    leaseEnd: null;
    acCode: null;
    acStatus: null;
    acMerchantCode: null;
    acBoothCode: null;
    contractStatus: null;
    goodCounts: 0;
    predictGoodCounts: 0;
    pendingStatus: null;
    pendingMessage: null;
    pendingAcCode: null;
    pendingAcBoothCode: null;
    pendingAcMerchantCode: null;
    pendingAcBrandCode: null;
    pendingAcMerchantName: null;
    brandAcCode: '00003301';
    acBrandCode: null;
    everyFlatHouse: {
        id: null;
        shopId: null;
        shopLiveActionUrl: null;
        shopLivePic: null;
        shopLivePicUrl: null;
    };
    userOperationId: 643313641922838528;
    userName: '金丹';
    bizSource: null;
    dataSource: null;
    businessLicensePic: null;
    existBusinessLicense: null;
    expireBusinessLicense: null;
    licenseCompanyName: null;
    licenseStartDate: null;
    licenseExpiryDate: null;
    shop_image: string;
}
interface iSelectByShopsAndBrandData extends iBaseListData {
    list: iShopData[];
}
export interface iBaseListData {
    endRow: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    navigateFirstPage: number;
    navigateLastPage: number;
    navigatePages: number;
    navigatepageNums: [];
    nextPage: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    prePage: number;
    size: number;
    startRow: number;
    total: number;
}
