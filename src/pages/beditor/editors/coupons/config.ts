export const getWayTypeToCardStyle: {
    [index: string]: any;
} = {
    single: [
        {
            type: 0,
            title: '左滑样式',
            url: '/image/c_img1.png',
        },
        {
            type: 1,
            title: '列表样式1',
            url: '/image/c_img2.png',
        },
        {
            type: 2,
            title: '列表样式2',
            url: '/image/c_img2.png',
        },
        {
            type: 3,
            title: '列表样式3',
            url: '/image/c_img2.png',
        },
    ],
    all: [
        {
            type: 10,
            title: '左滑样式',
            url: '/image/c_img1.png',
        },
        {
            type: 11,
            title: '列表券包',
            url: '/image/c_img2.png',
        },
        {
            type: 12,
            title: '单图券包',
            url: '/image/c_img3.png',
        },
        {
            type: 13,
            title: '双图券包',
            url: '/image/c_img4.png',
        },
    ],
};
export const cardTypeStr: {
    [index: string]: any;
} = {
    0: {
        title: '左滑样式',
    },
    1: {
        title: '列表样式1',
    },
    2: {
        title: '列表样式2',
    },
    3: {
        title: '列表样式3',
    },
    10: {
        title: '左滑样式',
    },
    11: {
        title: '列表券包',
    },
    12: {
        title: '单图券包',
    },
    13: {
        title: '双图券包',
    },
};
export const colorTypeStr = ['红色', '橘色', '黄色', '白色', '绿色'];
export const colorTypes = [
    {
        title: '红色',
        color: '#F6615E',
        id: 0,
    },
    {
        title: '橘色',
        color: '#F39343',
        id: 1,
    },
    {
        title: '白色',
        color: '#FFFFFF',
        id: 3,
    },

    {
        title: '绿色',
        color: '#4CAC5B',
        id: 4,
    },
    {
        title: '黄色',
        color: '#FFCE27',
        id: 2,
    },
];
interface iTemplateItem {
    title: string;
    content: string;
    id: string;
}
export const onceNoteTemplateList: Array<iTemplateItem> = [
    {
        title: '抖音h5直播领取单张优惠券',
        content: '【居然之家】您在直播间领取${7,14}优惠券，已发放至您的账户，${3,6}后失效。戳https://rfrl.cn/cVmt9J查看，回T退订',
        id: '2c90888986c6191a0186d8ab287d02c2'
    }
];
export const batchNoteTemplateList: Array<iTemplateItem> = [
    {
        title: '抖音h5直播一键领取优惠券',
        content: '【居然之家】您在直播间领取了${0,3}张优惠券，已发放至您的账户，戳https://rfrl.cn/cVmt9J查看，回T退订',
        id: '2c90888986c6191a0186d8a8fd9a02bf'
    }
];
