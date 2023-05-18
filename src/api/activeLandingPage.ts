import { CreateOpsWebApp } from './fetch';

const request = CreateOpsWebApp();

//落地页查发券列表
export async function queryLandingPageCoupons(params = {}) {
    // return {
    //     "code": "200",
    //     "data": {
    //         "list": [
    //             {
    //                 "couponSendEnd": "2021-10-22",
    //                 "couponSendId": 1,
    //                 "couponSendName": "我是发券名",
    //                 "couponSendStart": "2021-10-21",
    //                 "couponSendStatus": 0,
    //                 "coupons": [
    //                     {
    //                         "couponAmount": 10,
    //                         "couponBatchNo": '123123',
    //                         "couponCount": 0,
    //                         "couponDesc": "string",
    //                         "couponName": "地方法规多少地方法规",
    //                         "couponShareRule": "string",
    //                         "couponStatus": 0,
    //                         "couponTag": "string",
    //                         "couponThresholdAmount": 0,
    //                         "couponType": "string",
    //                         "couponUseDay": 0,
    //                         "couponUseDayType": 0,
    //                         "couponUsePeriod": 0,
    //                         "couponUsePeriodType": 0,
    //                         "couponUsedSum": 0,
    //                         "couponValidityEnd": "2021-10-22",
    //                         "couponValidityStart": "2021-10-23",
    //                         "holdQuantity": 0,
    //                         "id": 0,
    //                         "modifier": "string",
    //                         "receiveQuantity": 0,
    //                         "redisSurplusAmount": 0,
    //                         "sellerQuantity": 0,
    //                         "surplusAmount": 0,
    //                         "useQuantityPrice": 0
    //                     },
    //                     {
    //                         "couponAmount": 160,
    //                         "couponBatchNo": '123155323',
    //                         "couponCount": 0,
    //                         "couponDesc": "string",
    //                         "couponName": "发生的是的",
    //                         "couponShareRule": "string",
    //                         "couponStatus": 0,
    //                         "couponTag": "string",
    //                         "couponThresholdAmount": 0,
    //                         "couponType": "string",
    //                         "couponUseDay": 0,
    //                         "couponUseDayType": 0,
    //                         "couponUsePeriod": 0,
    //                         "couponUsePeriodType": 0,
    //                         "couponUsedSum": 0,
    //                         "couponValidityEnd": "2021-10-22",
    //                         "couponValidityStart": "2021-10-23",
    //                         "holdQuantity": 0,
    //                         "id": 0,
    //                         "modifier": "string",
    //                         "receiveQuantity": 0,
    //                         "redisSurplusAmount": 0,
    //                         "sellerQuantity": 0,
    //                         "surplusAmount": 0,
    //                         "useQuantityPrice": 0
    //                     },
    //
    //                 ]
    //             },
    //             {
    //                 "couponSendEnd": "2021-10-22",
    //                 "couponSendId": 2,
    //                 "couponSendName": "我是发券名2",
    //                 "couponSendStart": "2021-10-21",
    //                 "couponSendStatus": 0,
    //                 "coupons": [
    //                     {
    //                         "couponAmount": 80,
    //                         "couponBatchNo": '8754',
    //                         "couponCount": 0,
    //                         "couponDesc": "string",
    //                         "couponName": "说哈哈哈",
    //                         "couponShareRule": "string",
    //                         "couponStatus": 0,
    //                         "couponTag": "string",
    //                         "couponThresholdAmount": 0,
    //                         "couponType": "string",
    //                         "couponUseDay": 0,
    //                         "couponUseDayType": 0,
    //                         "couponUsePeriod": 0,
    //                         "couponUsePeriodType": 0,
    //                         "couponUsedSum": 0,
    //                         "couponValidityEnd": "2021-10-22",
    //                         "couponValidityStart": "2021-10-23",
    //                         "holdQuantity": 0,
    //                         "id": 0,
    //                         "modifier": "string",
    //                         "receiveQuantity": 0,
    //                         "redisSurplusAmount": 0,
    //                         "sellerQuantity": 0,
    //                         "surplusAmount": 0,
    //                         "useQuantityPrice": 0
    //                     },
    //                     {
    //                         "couponAmount": 230,
    //                         "couponBatchNo": '44423',
    //                         "couponCount": 0,
    //                         "couponDesc": "string",
    //                         "couponName": "撒射点是的",
    //                         "couponShareRule": "string",
    //                         "couponStatus": 0,
    //                         "couponTag": "string",
    //                         "couponThresholdAmount": 0,
    //                         "couponType": "string",
    //                         "couponUseDay": 0,
    //                         "couponUseDayType": 0,
    //                         "couponUsePeriod": 0,
    //                         "couponUsePeriodType": 0,
    //                         "couponUsedSum": 0,
    //                         "couponValidityEnd": "2021-10-22",
    //                         "couponValidityStart": "2021-10-23",
    //                         "holdQuantity": 0,
    //                         "id": 0,
    //                         "modifier": "string",
    //                         "receiveQuantity": 0,
    //                         "redisSurplusAmount": 0,
    //                         "sellerQuantity": 0,
    //                         "surplusAmount": 0,
    //                         "useQuantityPrice": 0
    //                     },
    //
    //                 ]
    //             },
    //         ],
    //     }
    // }
    return request.post<any>('/dmCoupon/queryLandingPageCoupons', params);
}
// 查询有权限的卖场列表
export const listMarketSelected = async (params: any) => {
    return request.post<any>('/market/listMarketSelectedDataPermission', params);
};
//查询所有活动添加渠道 没有分页
export function listOperChannelByConditionWithoutPage(params: any) {
    return request.post<any>('/operation/operChannel/listOperChannelByConditionWithoutPage', params);
}
export function listOperChannelByCondition(params: any) {
    return request.post<any>('/operation/operChannel/listOperChannelByCondition', params);
}

//批量获取商品
export function listOperActivityChannelByCondition(params: any) {
    return request.post<any>('/operation/operActivity/listOperActivityChannelByCondition', params);
}
//为活动添加渠道
export function addOperActivityChannel(params: any) {
    return request.post<any>('/operation/operActivity/addOperActivityChannel', params);
}
//为活动添加渠道
export function addOperActivityChannelCollection(params: { activityId: string; channelId: string }[]) {
    return request.post<any>('/operation/operActivity/addOperActivityChannelCollection', params);
}
//渠道废弃
export async function abandonChannel(params: any) {
    return request.post<any>('/operation/operChannel/abandonChannel', params);
}
//新建渠道
export async function addOperChannel(params: any) {
    return request.post<any>('/operation/operChannel/addOperChannel', params);
}
