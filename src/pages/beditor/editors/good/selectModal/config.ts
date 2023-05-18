export interface iActivityStatusOption {
    value: number;
    title: string;
}

export const activityStatusOptions: Array<iActivityStatusOption> = [
    {
        value: 1,
        title: '草稿',
    },
    {
        value: 2,
        title: '已停用',
    },
    {
        value: 3,
        title: '未开始',
    },
    {
        value: 4,
        title: '进行中',
    },
    {
        value: 5,
        title: '已结束',
    },
];
