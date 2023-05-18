export interface iActivityStatusOption {
    value: number;
    title: string;
}
export interface IActivityOriginOption {
    value: string;
    title: string;
}

export const activityStatusOptions: Array<iActivityStatusOption> = [
    {
        value: 0,
        title: '停用',
    },
    {
        value: 1,
        title: '启用',
    },
];
export const activityOriginOptions: Array<IActivityOriginOption> = [
    {
        value: 'operation',
        title: '平台',
    },
    {
        value: 'saas',
        title: '卖场',
    },
];
export const activityPageTypeOptions: Array<IActivityOriginOption> = [
    {
        value: 'custom',
        title: '自定义页面',
    },
    {
        value: 'member',
        title: '会员权益页',
    },
];
