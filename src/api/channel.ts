import { CreateOpsWebApp } from './fetch';
import { iBaseListData } from './shops';

const request = CreateOpsWebApp();

interface iChannelData {
  channelLevel: number,
  channelLevelId: number,
  channelLevelName: number,
  channelLevelParent: number,
  channelStatus: number,
}
interface iSelectChannelData extends iBaseListData {
  list: iChannelData[];
}
interface iChannelExtendDataList extends iBaseListData {
  list: iChannelExtendData[]
}
interface iChannelExtendData {
  channelId: number,
  channelPv: string,
  channelPvCount: string,
  channelUv: string,
  channelUvCount: string,
  date: string,
  registerNum: string,
  registerNumCount: string,
}

/**
 * 运营中心>异业渠道管理
 * 异业渠道
 */
// 渠道新增
export function adChannel(params) {
  return request.post<any>('/operation/operChannel/addOperChannel', params)
}

// 渠道列表展示
export function getChannelList(params) {
  return request.post<iChannelExtendDataList>('/operation/operChannel/listOperChannelByCondition', params)
}

// table中渠道废弃按钮
export function abandonChannel(params) {
  return request.post('/operation/operChannel/abandonChannel', params)
}

// 渠道修改
export function updateChannel(params) {
  return request.post('//operation/operChannel/updateOperChannel', params)
}


/**
 * 营销中心>活动落地页
 * 多级渠道管理
 */
// 多级渠道查询
export function getChannelLevel(params: any) {
  return request.post<iSelectChannelData>('/operation/channelLevel/query', params)
}

// 多级渠道新增
export function addChannelLevel(params: any) {
  return request.post('/operation/channelLevel/add', params)
}

// 多级渠道废弃
export function abandonChannelLevel(params: any) {
  return request.post('/operation/channelLevel/abandon', params)
}

// 多级渠道删除
export function deleteChannelLevel(params: any) {
  return request.post('/operation/channelLevel/delete', params)
}

// 渠道推广数据查询
export function getChannelData(params: any) {
  return request.post<iChannelExtendDataList>('/operation/operChannel/queryChannelData', params)
}

// 渠道推广数据导出
export function getChannelDataExport(params: any) {
  return request.postFile('/operation/operChannel/channelDataExport', params)
}

// 渠道推广数据汇总
export function getChannelDataTotal(params: any) {
  return request.post('/operation/operChannel/queryChannelDataCount', params)
}