import { CreateOpsWebApp } from './fetch';

const request = CreateOpsWebApp();

//渠道列表
export function listOperContentByCondition(params: any) {
    return request.post<any>('/operation/operContent/listOperContentByCondition', params);
}

//渠道列表
export function listOperChannelByCondition(params: any) {
    return request.post<any>('/operation/operChannel/listOperChannelByCondition', params);
}
//新建渠道
export function addOperChannel(params: any) {
    return request.post<any>('/operation/operChannel/addOperChannel', params);
}
//修改渠道
export function updateOperChannel(params: any) {
    return request.post<any>('/operation/operChannel/updateOperChannel', params);
}

//删除渠道
export function deleteOperChannel(params: any) {
    return request.post<any>('/operation/operChannel/deleteOperChannel', params);
}

//渠道详情
export function queryOperChannelById(params: any) {
    return request.post<any>('/operation/operChannel/queryOperChannelById', params);
}

//为活动添加渠道
export function addOperActivityChannel(params: any) {
    return request.post<any>('/operation/operActivity/addOperActivityChannel', params);
}

//查询所有活动添加渠道 没有分页
export function listOperChannelByConditionWithoutPage(params: any) {
    return request.post<any>('/operation/operChannel/listOperChannelByConditionWithoutPage', params);
}

export function queryByTokenAndMarketId() {
    return request.post<any>('/platformMarketSaas/queryByTokenAndMarketId', {});
}
export function dropDownListDataPermission() {
    return request.post<ICityList[]>('/cityStation/dropDownListDataPermission', {});
}
//渠道废弃
export async function abandonChannel(params: { channelId: any; }) {
    return request.post('/operation/operChannel/abandonChannel', params);
  }
export async function listCity(params) {
    return request.post("/cityStation/dropDownListDataPermission", params);
}

export async function listMarket(params) {
    return request.post("/market/listMarketSelectedDataPermission", params);
  }
  
  export async function listShop(params) {
    return request.post("/shop/listShopSelectedDataPermission", params);
  }
interface IgetUserinfo {
    marketIds: any;
    userId: number;
    userName: string;
    cityIds: any;
}
interface ICityList {
    cityName: string;
    cityNamePinYin: null;
    cityStationId: string;
    districtName: null;
    secondCity: string;
    state: number;
}
