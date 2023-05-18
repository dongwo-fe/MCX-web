import { CreateOpsWebApp, CreateAppWebApp } from './fetch';

const request = CreateOpsWebApp();

const appRequest = CreateAppWebApp();

// 获取城市列表
export function cityStationList(prams: any) {
    return request.post<IcityData[]>('/platformOperationOptionConfig/citystationlist', prams);
}

// 获取卖场列表
export function marketsStationList(prams: any) {
    return request.post<ImarketsData[]>('/platformOperationOptionConfig/marketQuery', prams);
}

// 获取卖场详情
export function marketDetail(prams: any) {
    return appRequest.post<ImarketDetail>('/market/getDetailApp', prams);
}

// 获取卖场详情
export function getMarketList(prams: any) {
    return request.post<any>('/market/list', prams);
}

let fullLinkMarketListPromise;
// 获取全链路卖场列表
export function getFullLinkMarketList() {
    if (!fullLinkMarketListPromise) {
        fullLinkMarketListPromise = appRequest.post<any>('/smartApi/floorPage/Reservations/selectQuanLianLuMarket', {});    
    }
    return fullLinkMarketListPromise;
}

export interface IcityData {
    cityName: string;
    cityStationId: string;
}

export interface ImarketsData {
    label?: string;
    value?: string;
    marketId: string;
    marketName: string;
}

export interface ImarketDetail {
    businessTime: string;
    marketAddress: string;
    marketId: string;
    marketName: string;
    marketPhone: string;
    marketPic: string;
    workingday: string;
    workingdayOther: string;
    market_image?: string;
}
