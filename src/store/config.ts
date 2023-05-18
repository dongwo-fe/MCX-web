import { iGoodsData } from '@/api/goods';
import { iShopData } from '@/api/shops';
import { iFormListItem } from '@/pages/beditor/editors/form/config';
import { createID } from '@/utils/tools';

/**
 * 自定义页面的整体数据结构
 */
export interface iEditor {
    /**
     * 页面数据
     */
    page: iEditorPage;
    /**
     * 分享使用的数据
     */
    share: iEditorShare;
    posterShare: iEditorShare | null;
    /**
     * 模块数据
     */
    blocks: any[];
    editBlockId: string | null; //正在编辑的模块id
    editTCardId?: string | null; //正在编辑的流量卡id
    tcards?: iTCard[]; // 流量卡分配数据
    renderBlocks?: any[]; // 渲染用数据
    tcardBlocks?: iTCardBlocks; //其他流量卡
    editTCardIsMain?: boolean; // 正在编辑的流量是主卡
}

export interface iTCardItem {
    [index: string]: any;

    blocks: any[];
}

export interface iTCardBlocks {
    [index: string]: iTCardItem; // tid:[]
}

// 流量卡流量占比分配数据
export interface iTCard {
    tid: string;
    value: number; // 1-100
}

export interface iEditorPage {
    title: string;
    bgColor: string;
    startTime: number;
    endTime: number;
    cityId: string | undefined;
    cityName: string | undefined;
    marketId: string | undefined;
    marketName: string | undefined;
    exportFlag?: boolean;
    pageType: 'custom' | 'member';
    showType?: 1 | 2; //未领取 已领取
    markets: any[];
    state?: 0 | 1; // 0 未启用 1 已启用
}

export interface iEditorShare {
    title: string;
    img: string;
    desc: string;
    cardTheme?: string;
}

/**
 * 每个模块的基本数据结构
 */
export interface iEditorBlock {
    [index: string]: any;

    type: string;
    id: string;
}

/**
 * 热区图
 */
export interface iEditorImageHot extends iEditorBlock {
    links: iLinks[];
    page_padding: number;
    height: number;
    image_url: string;
    image_height: number;
}

interface iLinks {
    value: string;
    link_url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

// 店铺list每一项
export interface IShopItem {
    id: string;
    tag: string;
    img: string;
    shopName: string;
    count: number;
}

// 店铺
export interface iEditorShop extends iEditorBlock {
    hurdle: number;
    shopName: string;
    list: Array<IShopItem>;
}

// 商品list每一项
export interface IGoodsItem {
    img: string;
    sellingTag: string;
    goodsTitle: string;
    marketingTag: string;
    price: string;
}

// 商品
export interface iEditorGoods extends iEditorBlock {
    goodsName: string;
    hurdle: number;
    more: number;
    list: Array<IGoodsItem>;
    showType: number;
    showMore: boolean;
    goodsType: number;
    inputGoodName: string;
    selectData: any;
    renderGoodList: Array<iGoodsData>;
    faildNum: any;
    redisKey: string;
    fileName: string;
    showMarkingPrice: boolean;
    showMarketingTag: boolean;
    goodBgColor: string;
}

export interface GoodsItem {
    goodsId: string;
    goodsMainPic: string;
    goodsMainPicValue: string;
    goodsMonthSales: number;
    goodsPrice: string;
    goodsSkuId: string;
    goodsSpuSkuTitle: string;
    goodsTotalSales: number;
    sellingPoint: string;
    sellingTag: string;
    sort: number;
}

// 长文本
export interface iEditorLongText extends iEditorBlock {
    value: string;
    color: string;
    size: number;
    alignType: string;
}

//标题
export interface iEditorTitle extends iEditorBlock {
    mainTitleValue: string;
    mainTitleSize: number;
    mainTitleColor: string;
    sideTitleValue: string;
    sideTitleSize: number;
    sideTitleColor: string;
}

// 标题文本 + 纯文本
export interface iEditorTagTitle extends iEditorBlock {
    title_type: string;
    type: string;
    paragraphList: Array<string>;
    align: any;
    bg_color: string;
    title_color: string;
    title_size: number;
    title_weight: boolean;
    paragraph_color: string;
    paragraph_size: number;
}

//下载
export interface iEditorDownload extends iEditorBlock {
    titleValue: string;
    desc: string;
    downloadSrc: string;
    img: string;
}

// 表单
export interface iEditorForms extends iEditorBlock {
    formBackgroundColor: string;
    formInputPlaceholderTextColor: string;
    formInputTextColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonTextValue: string;
    formList: Array<iFormListItem>;
    isWxLogin: boolean; //微信小程序授权登录
    isCodeLogin: boolean;
    isAppLogin: boolean;
    toast: number;
    toastContent: string;
}

// 优惠券列表每一项
export interface iCouponsListItem {
    bizSource: number; //0;
    cityNames: null;
    couponAmount: string; //'40';
    couponAutomaticAdd: number; //0;
    couponBatchNo: string; //'692182046722904064';
    couponCategoryType: number; // 0;
    couponCount: number; //100;
    couponDesc: string; //'afsdfds';
    couponName: string; //'以旧换新';
    couponScope: string; //'{"ca": "NO", "cc": "NO"}';
    couponSendCollectStatus: null;
    couponSendId: string;
    couponSendName: string;
    couponShareRule: string; //'{"storePercent": "30", "merchantPercent": "40", "platformPercent": "30"}';
    couponStatus: number; //3;
    couponTag: string; //'dsfa';
    couponThresholdAmount: string; //'100';
    couponTopicLabel: string; //'0429';
    couponType: number; // 0;
    couponUseDay: number; // 0;
    couponUseDayType: number; //0;
    couponUsePeriod: number; //0;
    couponUsePeriodType: number; // 0;
    couponUsedSum: number; // 1;
    couponValidityEnd: string; //'2022-06-30 11:31:11';
    couponValidityStart: string; //'2022-06-01 11:31:04';
    createTime: string; //'2022-06-02 11:31:10';
    creator: string; // '杨廷双';
    creatorId: number; //603077894268141600;
    everyUsrEveryDayNum: string; // '1';
    everyUsrTotalNum: string; //'1';
    holdQuantity: number; //1;
    id: number; //2009;
    marketNames: null;
    modifier: null;
    modifierId: null;
    receiveQuantity: number; //4;
    redisSurplusAmount: null;
    sellerQuantity: number; //224;
    surplusAmount: null;
    updateTime: string; //'2022-06-07 16:47:00';
    useQuantityPrice: null;
}

// 优惠券
export interface iEditorCoupons extends iEditorBlock {
    list: Array<iCouponsListItem>;
    list2?: Array<iCouponsListItem>; //双图券包2
    imageUrl: any[];
    imageUrl2?: any[];
    getWay: 'single' | 'all';
    style: number;
    colorType: number;
    oneKeyModalTitle?: string; //弹窗主标题
    oneKeyModalTitle2?: string; //弹窗副标题
    listTitle?: string; //一键领取 列表主标题
    listTitle2?: string; //一键领取 列表副标题
    sendMessage: 0;
    msgTemplateId: undefined;
}

// 富文本
export interface iEditorRichText extends iEditorBlock {
    bg_color: string;
    content: string;
    fullscreen: boolean;
    page_padding: number; //页边距
}

// 公告
export interface iEditorNotice extends iEditorBlock {
    notice_img: string;
    bg_color: string;
    text_color: string;
    text_context: string;
    height: number;
}

// 辅助分割
export interface iEditorDividingLine extends iEditorBlock {
    height: number;
    bg_color: string;
}

// 魔方图
export interface iEditorImagePuzzle extends iEditorBlock {
    padding: number; // 页面边距
    image_padding: number; // 图片间隙
    sub_entry: iSubEntry[]; // 图片集合
    show_method: number; //几号模板
}

// 涨粉
export interface iEditorAddBeanVermicelli extends iEditorBlock {
    weChat_nickName: string;
    title: string;
    box_color: string;
    bg_color: string;
    nick_color: string;
    title_color: string;
}

// 卖场
export interface iEditorMarkets extends iEditorBlock {
    city_id: string;
    matket_id: string;
    market_image: string;
    image_type: string;
    market_detail: ImarketDetail;
    market_show_type: 'one' | 'two' | 'three' | 'four'; //· 卖场列表：支持单栏、双栏、三栏、四栏选择
    market_list: any[];
    market_color: string;
}

export interface iEditorShops extends iEditorBlock {
    shop_show_type: 'one' | 'two' | 'three' | 'four'; //· 卖场列表：支持单栏、双栏、三栏、四栏选择
    shop_list: iShopData[];
}

export interface iEditorButton extends iEditorBlock {
    title_type: string;
    type: string;
    btn_height: number;
    btn_width: string;
    btn_radius: number;
    bg_color: string;
    title_color: string;
    title_size: number;
    title_weight: boolean;
}

interface ImarketDetail {
    businessTime: string;
    marketAddress: string;
    marketId: string;
    marketName: string;
    marketPhone: string;
    marketPic: string;
    workingday: string;
    workingdayOther: string;
}

// 视频
export interface iEditorVideo extends iEditorBlock {
    page_padding: number;
    auto_play: boolean;
    cover_type: string;
    video_address: string;
    video_url: string;
    cover_url: string;
    input_video: string;
}

// 图文导航
export interface iEditorGraphical extends iEditorBlock {
    nav_type: number;
    box_color: string;
    title_color: string; // 文字颜色
    image_title_list: isGraphicalImage[];
    title_list: isGraphicalTitle[];
}

// 电梯标签
export interface iEditorElevatorNavigation extends iEditorBlock {
    modalType: number;
    height: number;
    bg_color: string;
    bg_select_color: string;
    text_select_color: string;
    text_default_color: string;
    label_select_type: string;
    label_list: isLaberList[];
}

// 图形处理
export interface iEditorImageDeal extends iEditorBlock {
    imageUrl: string;
    imageHeight: number;
    imageWidth: number;
    size: number;
    rotate: number;
    sizeHeight: number;
    sizeWidth: number;
    posLeft: number;
    posTop: number;
    cropWidth: number;
    cropHeight: number;
    linkData: isLinkData;
}

interface isLaberList {
    image_url: string;
    text_input: string;
    link_data: isLaberLinkData;
}

interface isLaberLinkData {
    link_name: string;
    link_id: string;
    link_number: number;
}

// 轮播图
export interface iEditorBanner extends iEditorBlock {
    page_padding: number;
    size_type: string;
    imgList: isBannerItem[];
}

// 魔方数据最底层图片
interface iSubEntry {
    id: string;
    url: string;
    thumb_url: string;
    image_width: number;
    image_height: number;
    link_data: isLinkData;
    size: any;
}

interface isGraphicalImage {
    url: string;
    title_name: string;
    link_data: isLinkData;
}

interface isGraphicalTitle {
    title_name: string;
    link_data: isLinkData;
}

export interface isBannerItem {
    nav_data: isLinkData;
    url: string;
    thumb_url: string;
    id: string;
    image_height: number;
}

interface isLinkData {
    link_url: string;
    value: string;
}

interface iMakeShopListItem {
    id: number;
    name: string;
    list: Array<iMakeShopListItem> | null;
}

export interface iProvinceAndCityShop {
    type: string;
    buttonTextValue: string;
    cardTheme: string;
    sendMessage: number;
    msgTemplateId: string | undefined;
    maxMakeCount: number;
    buttonColor: string;
    shopFile: {
        filename: string;
        src: string;
        time: string;
        list: Array<iMakeShopListItem>;
        errorMessage: null | string;
    };
    id: string;
}

interface iMarket {
    marketName: string;
    marketId: string;
}
export interface  iDynamicFormEditor {
    type: string;
    buttonTextValue: string;
    cardTheme: string;
    buttonColor: string;
    id: string;
    formList: Array<iFormListItem>;
    toast: number;
    toastContent: string;
    registerDoorverse?: boolean;
    syncFullLink?: boolean;
    registerJrVip?: boolean;
    syncFullLinkMarket?: iMarket;
}