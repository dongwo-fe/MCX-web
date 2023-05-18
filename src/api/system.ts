import { CreateOpsWebApp } from './fetch';

const request = CreateOpsWebApp();
// 查询登录人操作权限
export async function queryOperateForUser() {
    return request.post<any[]>('/system/menu/queryOperateForUser', {});
}
