import { CreateOpsWebApp } from './fetch';

const request = CreateOpsWebApp();

interface iSelectGuiderData {
  guiderId: string,
  realName: string,
  userName: string,
}

// 导购下拉框分页
export function getGuiderList(params: any) {
  return request.post<iSelectGuiderData[]>('/guider/selectGuiderDropDownOnPage', params)
}