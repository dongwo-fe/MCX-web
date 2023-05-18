import CreateFetch, { CreateOpsWebApp } from './fetch';

const request = CreateFetch();
const requestData = CreateOpsWebApp();

//保存 编辑 落地页数据
export function saveTopicDetail(data: any, id?: string | null) {
    let url = `/api_topic/detail?id=${id}`;
    return request.post<any>(url, data);
}

// 根据id获取落地页详情
export function getTopicDetail(id: string) {
    return request.get<any>('/api_topic/detail', { id });
}

// 获取已保存数据列表
export function getTopicList(pageindex: number, value?: ITopicListFilterData) {
    return request.get<ITopicList>('/api_topic/list', { pageindex, ...value });
}
// 获取已保存数据列表
export function updateTopicState(id: string, state: number) {
    return request.post<any>('/api_topic/use', { state }, { id });
}

// 收藏落地页
export function addFavoriteApi(params: { id: string }) {
    return request.post(`/api_topic/addfavorite?id=${params.id}`);
}
// 取消收藏落地页
export function delFavoriteApi(params: { id: string }) {
    return request.post(`/api_topic/delfavorite?id=${params.id}`);
}

// 落地页导出
export function exportActivityUserInfo(params: any) {
    return requestData.postFile('/operation/applets/operActivity/exportActivityUserInfo', params);
}

// 落地页查看数据
export function queryDataCollect(params: any) {
    return requestData.post('/operation/operActivity/queryDataCollect', params);
}

export interface ITopicListFilterData {
    title: string | undefined;
    state: string | undefined;
    cityId: string | undefined;
    marketId: string | undefined;
    platform: string | undefined;
    pageType: 'custom' | 'member' | undefined;
}
interface ITopicList {
    count: number; //12;
    rows: ITopicListItem[];
}
export interface ITopicListItem {
    _id: string; //'2kbm7w';
    lid: string; //'84733019993118635126';
    title: string; // '';
    date_start: number; //0;
    date_end: number; //0;
    marketid: string; //'';
    state: number; //0;
    create_name: string; //'用户';
    created: number; //1654165664367;
    updated: number; // 1654170243102;
    update_name: string; //'用户';
    pageType: string;
    cover_img?: string;
    data: ITopicListData;
    // 运营页所属卖场列表
    marketnames?: string[];
    exportFlag: boolean;
    favorite: boolean; // 是否收藏
}
export interface ITopicListData {
    tcards?: Itcard[];
    share?: Ishare;
}
export interface Ishare {
    desc: string;
    img: string;
    title: string;
}
export interface Itcard {
    tid: string;
    value: number;
}
