/**
 * 所有可使用组件的配置
 */
export const typeNames: { [index: string]: any } = {
    title_paragraph: '标题文本',
    rich_text: '富文本',
    banner: '轮播图',
    image_puzzle: '魔方图',
    image_hot: '热区图',
    image_text_nav: '图文导航',
    elevator_navigation: '电梯标签',
    notice: '公告',
    video: '视频',
    dividing_line: '辅助分割',
    forms: '表单',
    coupons: '优惠券',
    addBeanVermicelli: '涨粉',
    markets: '卖场',
    image_deal: '自定义图片',
    goods: '商品',
    shops: '店铺',
    button: '按钮',
    provinceAndCityShop: '预约门店',
    dynamicForm: '动态表单',
};
//基础组件
const baseConfigs: iConfigItem[] = [
    {
        title: '标题文本',
        type: 'title_paragraph',
        logo: '/image/com_bt.png',
        Render: '',
    },
    {
        title: '富文本',
        type: 'rich_text',
        logo: '/image/com_fwb.png',
        Render: '',
    },
    {
        title: '轮播图',
        type: 'banner',
        logo: '/image/com_lb.png',
        Render: '',
    },
    {
        title: '魔方图',
        type: 'image_puzzle',
        logo: '/image/com_mf.png',
        Render: '',
    },
    {
        title: '热区图',
        type: 'image_hot',
        logo: '/image/com_rq.png',
        Render: '',
    },
    {
        title: '图文导航',
        type: 'image_text_nav',
        logo: '/image/com_tw.png',
        Render: '',
    },
    {
        title: '电梯标签',
        type: 'elevator_navigation',
        logo: '/image/com_dt.png',
        Render: '',
    },
    {
        title: '公告',
        type: 'notice',
        logo: '/image/com_gg.png',
        Render: '',
    },
    {
        title: '视频',
        type: 'video',
        logo: '/image/com_video.png',
        Render: '',
    },
    {
        title: '自定义图片',
        type: 'image_deal',
        logo: './image/com_pic.png',
        Render: '',
    },
    {
        title: '辅助分割',
        type: 'dividing_line',
        logo: '/image/com_fgx.png',
        Render: '',
    },
    // {
    //     title: '登录按钮',  //先注释掉
    //     type: 'button',
    //     logo: '/image/com_btn.png',
    //     Render: '',
    // },
];
//业务组件
const businessConfigs: iConfigItem[] = [
    {
        title: '卖场',
        type: 'markets',
        logo: '/image/com_markets.png',
        Render: '',
    },
    {
        title: '店铺',
        type: 'shops',
        logo: '/image/com_dp.png',
        Render: '',
    },
    {
        title: '商品',
        type: 'goods',
        logo: '/image/com_sp.png',
        Render: '',
    },
    {
        title: '表单',
        type: 'forms',
        logo: '/image/com_bd.png',
        Render: '',
    },
    {
        title: '动态表单',
        type: 'dynamicForm',
        logo: '/image/com_bd.png',
        Render: '',
    },
    {
        title: '预约门店',
        type: 'provinceAndCityShop',
        logo: '/image/com_ssmd.png',
        Render: '',
    },
];
//营销组件
const marketingConfigs: iConfigItem[] = [
    {
        title: '优惠券',
        type: 'coupons',
        logo: '/image/com_yhq.png',
        Render: '',
    },
    {
        title: '涨粉',
        type: 'addBeanVermicelli',
        logo: '/image/com_zf.png',
        Render: '',
    },
];
const configs = [
    {
        title: '基础组件',
        childrens: baseConfigs,
    },
    {
        title: '业务组件',
        childrens: businessConfigs,
    },
    {
        title: '营销组件',
        childrens: marketingConfigs,
    },
];
export default configs;

export interface iConfigItem {
    title: string;
    logo: string;
    type: string;
    Render: any;
}
