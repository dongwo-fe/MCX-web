interface iTemplateItem {
    title: string;
    content: string;
    id: string;
}

export const ThemeCardClass = {
    '#FFFFFF': 'light-card',
    'rgba(255,255,255,.2)': 'dark-card'
};
export const colorTypes = [
    {
        title: '红色',
        color: 'rgb(242,72,76)'
    },
    {
        title: '蓝色',
        color: 'rgb(81,87,254)'
    },
    {
        title: '绿色',
        color: 'rgb(94,194,138)'
    },

    {
        title: '黄色',
        color: 'rgb(254,182,56)'
    }
];
export const noteTemplateList: Array<iTemplateItem> = [
    {
        title: '抖音h5直播预约门店成功信息',
        content: '【居然之家】恭喜您成功预约${11,23}，稍后我们会有专人联系您，戳https://topic.jrdaimao.com/${11,22}查看，回T退订',
        id: '2c90888986c6191a0186d8cda6b102f4'
    }
];
