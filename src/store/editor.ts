import { createSlice } from '@reduxjs/toolkit';
import { createFormItem } from '@/pages/beditor/editors/form/config';
import { createID } from '@/utils/tools';
import {
    iEditor,
    iEditorAddBeanVermicelli,
    iEditorBanner,
    iEditorCoupons,
    iEditorDividingLine,
    iEditorElevatorNavigation,
    iEditorForms,
    iEditorGraphical,
    iEditorImageDeal,
    iEditorImageHot,
    iEditorImagePuzzle,
    iEditorMarkets,
    iEditorNotice,
    iEditorRichText,
    iEditorTagTitle,
    iEditorVideo,
    iEditorGoods,
    iEditorShops,
    iEditorButton,
    iProvinceAndCityShop,
    iDynamicFormEditor,
} from './config';

export const initialState: iEditor = {
    blocks: [],
    page: {
        title: '',
        pageType: 'custom',
        bgColor: '#F9F9F9',
        startTime: 0,
        endTime: 0,
        cityId: undefined,
        cityName: undefined,
        markets: [],
        marketId: undefined,
        marketName: undefined,
    },
    share: { title: '', desc: '', img: '' },
    posterShare: null,
    editBlockId: null, // 当前编辑的模块ID
    editTCardId: null, // 当前编辑的流量卡ID
    editTCardIsMain: true, // 当前编辑的流量卡是主卡
    tcards: [{ tid: createID(), value: 100 }], // 流量卡分配数据
    renderBlocks: [], // 渲染用数据
    tcardBlocks: {},
};
//会员权益页默认数据
export const initialMemberState: iEditor = {
    blocks: [],
    page: {
        title: '会员权益页',
        pageType: 'member',
        showType: 1,
        bgColor: '#F9F9F9',
        startTime: 0,
        endTime: 0,
        cityId: undefined,
        cityName: undefined,
        marketId: undefined,
        marketName: undefined,
        markets: [],
    },
    share: {
        title: 'xxx正在邀请你成为居然会会员',
        desc: '',
        img: 'https://ossprod.jrdaimao.com/file/1658921407429803.png',
    },
    posterShare: null,
    editBlockId: null,
    tcards: [{ tid: createID(), value: 100 }], // 流量卡分配数据
    renderBlocks: [], // 渲染用数据
    editTCardIsMain: true,
};

const EditorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        resetData: (state) => {
            state.renderBlocks = [];
            state.page = initialState.page;
        },
        //接口获取的数据
        setEditorData: (state, { payload }) => {
            state.blocks = payload.blocks;
            state.renderBlocks = payload.blocks;
            state.tcardBlocks = payload.tcardBlocks;
            state.page = payload.page;
            state.share = payload.share;
            state.posterShare = payload.posterShare;
            state.tcards = payload.tcards || [{ tid: createID(), value: 100 }];
            state.editTCardId = null;
            state.editTCardIsMain = true;
        },
        insertOne: (state, { payload }) => {
            //插入一个新的模块
            const index = payload.index;
            const blockdata = payload.data;
            const { editTCardId, tcardBlocks } = state;
            if (tcardBlocks && editTCardId && tcardBlocks[editTCardId] && state.tcardBlocks) {
                // 副流量模版
                if (state.tcardBlocks[editTCardId].blocks.length === 0 || index === undefined) {
                    state.tcardBlocks[editTCardId].blocks.push(blockdata);
                } else {
                    state.tcardBlocks[editTCardId].blocks.splice(index, 0, blockdata);
                }
                const arr = state.tcardBlocks[editTCardId].blocks || [];
                state.renderBlocks = arr.map((v) => {
                    if (v.isLock) {
                        const item = state.blocks.find((bv) => bv.id === v.id);
                        return { ...item, isLock: true };
                    } else {
                        return v;
                    }
                });
            } else {
                // 主流量模版
                if (state.blocks.length === 0 || index === undefined) {
                    state.blocks.push(blockdata);
                } else {
                    state.blocks.splice(index, 0, blockdata);
                }
                state.renderBlocks = state.blocks;
            }
        },
        deleteOne: (state, { payload }) => {
            //删除当前模板
            const { editTCardId, tcardBlocks } = state;
            // 副流量模版
            if (tcardBlocks && editTCardId && tcardBlocks[editTCardId] && state.tcardBlocks) {
                state.tcardBlocks[editTCardId].blocks = state.tcardBlocks[editTCardId].blocks.filter((v) => v.id !== payload.id);
                const arr = state.tcardBlocks[editTCardId].blocks || [];
                state.renderBlocks = arr.map((v) => {
                    if (v.isLock) {
                        const item = state.blocks.find((bv) => bv.id === v.id);
                        return { ...item, isLock: true };
                    } else {
                        return v;
                    }
                });
            } else {
                // 主流量模版
                const mainItem = state.blocks.find((v) => v.id === payload.id);
                state.blocks = state.blocks.filter((v) => v.id !== payload.id);
                state.renderBlocks = state.blocks;

                // 主流量模版删除后 解锁子模版
                const keys = (state.tcardBlocks && Object.keys(state.tcardBlocks)) || [];
                keys.forEach((key) => {
                    const list = (state.tcardBlocks && state.tcardBlocks[key].blocks) || [];
                    if (state.tcardBlocks) {
                        state.tcardBlocks[key].blocks = list.map((v) => {
                            if (v.id === payload.id && v.isLock) {
                                return Object.assign({}, v, mainItem, { isLock: undefined });
                            } else {
                                return v;
                            }
                        });
                    }
                });
            }
        },
        changeItemLocation: (state, { payload }) => {
            //模板向下向下移动
            const { editTCardId, tcardBlocks } = state;
            // 副流量模版
            if (tcardBlocks && editTCardId && tcardBlocks[editTCardId] && state.tcardBlocks) {
                state.tcardBlocks[editTCardId].blocks[payload.toindex] = state.tcardBlocks[editTCardId].blocks.splice(
                    payload.index,
                    1,
                    state.tcardBlocks[editTCardId].blocks[payload.toindex]
                )[0];
                const arr = state.tcardBlocks[editTCardId].blocks || [];
                state.renderBlocks = arr.map((v) => {
                    if (v.isLock) {
                        const item = state.blocks.find((bv) => bv.id === v.id);
                        return { ...item, isLock: true };
                    } else {
                        return v;
                    }
                });
            } else {
                // 主流量模版
                state.blocks[payload.toindex] = state.blocks.splice(payload.index, 1, state.blocks[payload.toindex])[0];
                state.renderBlocks = state.blocks;
            }
        },
        //更新页面信息
        updatePageData: (state, { payload }) => {
            state.page = Object.assign({}, state.page, payload);
        },
        //更新分享的信息
        updateShareData: (state, { payload }) => {
            state.share = Object.assign({}, state.share, payload);
        },
        //更新海报分享的信息
        updatePosterShareData: (state, { payload }) => {
            if (payload) {
                state.posterShare = Object.assign({}, state.posterShare, payload);
            } else {
                state.posterShare = null;
            }
        },
        //指示模块显示隐藏，参数id,show
        setBlockShow: (state, { payload }) => {
            state.editBlockId = payload.id;
        },
        changeBlockItemValue: (state, { payload }) => {
            // 更新模块数据
            const { blocks, editTCardId, tcardBlocks } = state;
            const { value, id, propName } = payload;
            let list = blocks;
            // 副流量模版
            if (tcardBlocks && editTCardId && tcardBlocks[editTCardId]) {
                list = tcardBlocks[editTCardId].blocks || [];

                const handleItem = list.find((item) => item.id === id);
                handleItem[propName] = value;
                state.renderBlocks = list.map((v) => {
                    if (v.isLock) {
                        const item = blocks.find((bv) => bv.id === v.id);
                        return { ...item, isLock: true };
                    } else {
                        return v;
                    }
                });
            } else {
                const handleItem = list.find((item) => item.id === id);
                handleItem[propName] = value;
                state.renderBlocks = list;
            }
        },

        changeEditorItem: (state, { payload }) => {
            //替换根节点数据
            state[payload.key] = payload.value;
        },
        addTCardBlock: (state, { payload }) => {
            // 添加流量卡
            if (!state.tcardBlocks) {
                state.tcardBlocks = {};
            }
            if (!state.tcardBlocks[payload.tid]) {
                state.tcardBlocks[payload.tid] = { blocks: [] };
            }
            state.tcardBlocks[payload.tid].blocks = state.blocks.map((v) => ({ id: v.id, isLock: true }));
            // 保存当前流量卡ID
            state.editTCardId = payload.tid;
            state.editTCardIsMain = false;
        },
        delTCardBlock: (state, { payload }) => {
            // 删除流量卡
            if (state.tcardBlocks && state.tcardBlocks[payload.tid]) {
                delete state.tcardBlocks[payload.tid];
                // 删除流量卡后重置渲染数据
                state.renderBlocks = state.blocks;
                state.editTCardId = null;
                state.editTCardIsMain = true;
            }
        },
        changeRenderBlock: (state, { payload }) => {
            // 切换流量卡
            if (state.tcardBlocks && state.tcardBlocks[payload.tid] && state.tcardBlocks[payload.tid].blocks) {
                const arr = state.tcardBlocks[payload.tid].blocks || [];
                state.renderBlocks = arr.map((v) => {
                    if (v.isLock) {
                        const item = state.blocks.find((bv) => bv.id === v.id);
                        return { ...item, isLock: true };
                    } else {
                        return v;
                    }
                });
                state.editTCardIsMain = false;
            } else {
                state.renderBlocks = state.blocks;
                state.editTCardIsMain = true;
            }
            // 保存当前流量卡ID
            state.editTCardId = payload.tid;
        },
        changeLockBlock: (state, { payload }) => {
            // 解锁 锁定 单个模块
            const { isLock, id } = payload;
            const { blocks, editTCardId, tcardBlocks } = state;
            if (!editTCardId || !tcardBlocks || !tcardBlocks[editTCardId]) return;

            const renderItem = blocks.find((v) => v.id === id);
            let list = tcardBlocks[editTCardId].blocks;
            list = list?.map((v) => {
                if (v.id === id) {
                    if (!isLock) {
                        v = Object.assign({}, renderItem, v);
                    }
                    v.isLock = isLock;
                    return v;
                }
                return v;
            });
            tcardBlocks[editTCardId].blocks = list;

            state.renderBlocks = tcardBlocks[editTCardId].blocks?.map((v) => {
                if (v.isLock) {
                    const item = state.blocks.find((bv) => bv.id === v.id);
                    return { ...item, isLock: true };
                } else {
                    return v;
                }
            });
        },
        syncBlock: (state, { payload }) => {
            // 同步单个模块 同步主模块信息
            const { id } = payload;
            const { blocks, editTCardId, tcardBlocks } = state;
            const mainItem = blocks.find((v) => v.id === id);

            if (editTCardId && tcardBlocks && tcardBlocks[editTCardId]) {
                // 副流量卡点击同步
                const index = tcardBlocks[editTCardId].blocks?.findIndex((v) => v.id === id) ?? -1;
                if (index > -1) {
                    const tc = tcardBlocks[editTCardId].blocks[index];
                    tcardBlocks[editTCardId].blocks?.splice(index, 1, { ...tc, ...mainItem, isLock: tc.isLock });
                    state.renderBlocks = tcardBlocks[editTCardId].blocks?.map((v) => {
                        if (v.isLock) {
                            const item = state.blocks.find((bv) => bv.id === v.id);
                            return { ...item, isLock: true };
                        } else {
                            return { ...v, isLock: false };
                        }
                    });
                }
            } else if (tcardBlocks) {
                // 主流量卡点击同步
                const keys = Object.keys(tcardBlocks);
                keys.forEach((k) => {
                    const index = tcardBlocks[k].blocks?.findIndex((v) => v.id === id) ?? -1;
                    if (index > -1 && tcardBlocks[k].blocks && tcardBlocks[k].blocks[index].isLock === false) {
                        tcardBlocks[k].blocks?.splice(index, 1, { ...mainItem, isLock: false });
                    }
                });
            }

            // 点击同步后关闭右侧编辑菜单
            state.editBlockId = null;
        },
    },
});

export const {
    insertOne,
    deleteOne,
    updatePageData,
    updateShareData,
    setBlockShow,
    changeItemLocation,
    changeBlockItemValue,
    setEditorData,
    changeEditorItem,
    addTCardBlock,
    changeRenderBlock,
    delTCardBlock,
    changeLockBlock,
    syncBlock,
    resetData,
    updatePosterShareData,
} = EditorSlice.actions;
export default EditorSlice.reducer;

//初始化模块数据
export const initBlockData: {
    [index: string]: any;
    title_paragraph: () => iEditorTagTitle;
    rich_text: () => iEditorRichText;
    notice: () => iEditorNotice;
    forms: () => iEditorForms;
    dividing_line: () => iEditorDividingLine;
    image_puzzle: () => iEditorImagePuzzle;
    addBeanVermicelli: () => iEditorAddBeanVermicelli;
    markets: () => iEditorMarkets;
    video: () => iEditorVideo;
    image_text_nav: () => iEditorGraphical;
    elevator_navigation: () => iEditorElevatorNavigation;
    banner: () => iEditorBanner;
    image_hot: () => iEditorImageHot;
    coupons: () => iEditorCoupons;
    image_deal: () => iEditorImageDeal;
    goods: () => iEditorGoods;
    shops: () => iEditorShops;
    button: () => iEditorButton;
    provinceAndCityShop: () => iProvinceAndCityShop;
    dynamicForm:() => iDynamicFormEditor;
} = {
    //标题文本
    title_paragraph: () => {
        return {
            title: '', //标题内容
            id: createID(), //唯一id
            type: 'title_paragraph', //type
            paragraphList: [''], //段落集合
            align: 'left', //对齐方式
            bg_color: '#fff', //背景颜色
            title_color: '#000000', //标题文字颜色
            title_size: 16, //标题文字大小
            title_weight: false, //标题是否加粗
            paragraph_color: '#777777', //段落文字颜色
            paragraph_size: 14, //段落文字大小
            title_type: 'tagTitle', // 标题文本:tagTitle ，纯文本: pureTitle
        };
    },
    // 富文本
    rich_text: () => {
        return {
            height: 10,
            type: 'rich_text', //type
            id: createID(), //唯一id
            bg_color: '#FFFFFF', //背景颜色
            content: '', //内容
            fullscreen: false, //全屏显示
            page_padding: 0, // 页面边距
        };
    },
    // 公告
    notice: () => {
        return {
            type: 'notice',
            id: createID(),
            notice_img: '/image/notice_def_bg.png',
            bg_color: '#FFF8E9',
            text_color: '#6F6F6F',
            text_context: '',
            height: 40,
        };
    },
    // 分割线
    dividing_line: () => {
        return {
            type: 'dividing_line',
            id: createID(),
            height: 30,
            bg_color: 'transparent',
        };
    },
    // 魔方图
    image_puzzle: () => {
        return {
            type: 'image_puzzle',
            id: createID(),
            padding: 0, // 页面边距
            image_padding: 0, // 图片间隙
            sub_entry: [
                // 魔方图数据
                {
                    url: '', // 图片链接
                    thumb_url: '',
                    image_width: 0,
                    image_height: 0,
                    link_data: {
                        // 跳转链接数据
                        link_url: '', // 链接
                        value: '', // 类型
                    },
                    size: null,
                    id: createID(),
                },
            ], // 图片集合
            show_method: 0, //几号模板
            height: 50,
        };
    },
    // 涨粉
    addBeanVermicelli: () => {
        return {
            type: 'addBeanVermicelli',
            id: createID(),
            weChat_nickName: '', // 昵称
            title: '', // 引导文案
            weChat_image: '', // 微信头像
            code_image: '', // 二维码图片
            box_color: '#EFEFF1', // 模块背景色
            bg_color: '#D5E2F4', // 卡片背景色
            nick_color: '#000000', // 昵称文案颜色
            title_color: '#6c6c6c', // 引导文案颜色
        };
    },
    // 卖场
    markets: () => {
        return {
            type: 'markets',
            id: createID(),
            city_id: '', // 城市ID
            matket_id: '', // 卖场ID
            market_image: '', // 上传的图片
            image_type: 'default', // 默认图片还是自定义图片
            market_detail: {
                businessTime: '',
                marketAddress: '',
                marketId: '',
                marketName: '',
                marketPhone: '',
                marketPic: '',
                workingday: '',
                workingdayOther: '',
            },
            market_show_type: 'one',
            market_list: [],
            market_color: '#303235',
        };
    },
    // 视频
    video: () => {
        return {
            type: 'video',
            id: createID(),
            page_padding: 0, // 页面边距
            auto_play: false, // 自动播放
            cover_type: 'default', // 封面类型 default|select
            video_address: 'upload', // 视频上传 链接 link
            video_url: '', // 视频地址
            cover_url: '', // 封面地址
            input_video: '', // 输入的地址
        };
    },
    // 图文导航
    image_text_nav: () => {
        return {
            type: 'image_text_nav',
            id: createID(),
            nav_type: 1, // 1.图文导航 2. 文字导航
            box_color: '#fff', // 背景颜色
            title_color: '#000000', // 文字颜色
            height: 10,
            image_title_list: [
                // 图文导航数据
                {
                    url: '',
                    title_name: '',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    url: '',
                    title_name: '',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    url: '',
                    title_name: '',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    url: '',
                    title_name: '',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
            ],
            title_list: [
                // 文字导航数据
                {
                    title_name: '导航一',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    title_name: '导航二',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    title_name: '导航三',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
                {
                    title_name: '导航四',
                    link_data: {
                        link_url: '',
                        value: '',
                    },
                },
            ],
        };
    },
    // 电梯标签
    elevator_navigation: () => {
        return {
            type: 'elevator_navigation',
            id: createID(),
            height: 10,
            modalType: 1, // 1: 文字， 2:图片
            bg_color: '#FFF', // 背景颜色
            bg_select_color: '#005ECA', // 背景颜色选中
            text_select_color: '#000', // 文字颜色选中
            text_default_color: '#777777', // 文字默认颜色
            label_select_type: 'bg', // bg:背景 round: 圆框 square: 方框 under: 下划线
            label_list: [
                {
                    image_url: '', // 图片链接
                    text_input: '', // 输入的文字
                    link_data: {
                        link_id: '', // 关联组件的ID
                        link_name: '', // 关联组件的名字
                        link_number: 0,
                    },
                },
                {
                    image_url: '',
                    text_input: '',
                    link_data: {
                        link_id: '',
                        link_name: '',
                        link_number: 0,
                    },
                },
                {
                    image_url: '',
                    text_input: '',
                    link_data: {
                        link_id: '',
                        link_name: '',
                        link_number: 0,
                    },
                },
                {
                    image_url: '',
                    text_input: '',
                    link_data: {
                        link_id: '',
                        link_name: '',
                        link_number: 0,
                    },
                },
            ],
        };
    },
    // 轮播图
    banner: () => {
        return {
            type: 'banner',
            id: createID(),
            size_type: 'customize',
            height: 10,
            imgList: [
                {
                    nav_data: {
                        link_url: '',
                        value: '',
                    },
                    url: '',
                    thumb_url: '',
                    id: createID(),
                    image_height: 0,
                },
            ],
            page_padding: 0,
        };
    },
    //热区图
    image_hot: () => {
        return {
            type: 'image_hot',
            id: createID(),
            height: 100, // 高度
            links: [],
            image_url: '', // 图片链接
            page_padding: 0, //页面边距
            image_height: 0, // 图片高度
        };
    },
    //表单初始化
    forms: () => ({
        title: '表单',
        type: 'forms',
        id: createID(),
        formBackgroundColor: '#ffffff',
        formInputPlaceholderTextColor: '#ccc',
        formInputTextColor: '#333',
        buttonBackgroundColor: '#3579DB',
        buttonTextColor: '#ffffff',
        buttonTextValue: '提交',
        formList: [],
        isWxLogin: false,
        isCodeLogin: false,
        isAppLogin: false,
        toast: 1,
        toastContent: '',
    }),
    //优惠券初始化
    coupons: () => ({
        title: '优惠券',
        type: 'coupons',
        id: createID(),
        list: [], //券列表
        list2: [], //券列表
        imageUrl: [], //图片列表
        imageUrl2: [], //双图2
        getWay: 'single', //领取方式  single逐张领取 all一键领取
        style: 0, // 0滑动 1列表1 2列表2 3列表3
        colorType: 0, //0红色 1黄色 2白色 3黑色 4绿色
        listTitle: '', //一键领取 列表主标题
        listTitle2: '', //一键领取 列表副标题
        oneKeyModalTitle: '恭喜领取成功！', //弹窗主标题
        oneKeyModalTitle2: '已发放至您的账户', //弹窗副标题
        sendMessage: 0,
        msgTemplateId: undefined,
    }),
    // 自定义图片
    image_deal: () => ({
        title: '自定义图片',
        type: 'image_deal',
        id: createID(),
        imageUrl: '',
        height: 10,
        imageHeight: 0, // 原始图片高
        imageWidth: 0, // 原始图片宽
        sizeHeight: 0, // 修改之后的图片高度
        sizeWidth: 0, // 修改之后的图片宽度
        size: 1, // 比例
        rotate: 0, // 旋转角度
        posLeft: 0, // 距离左边
        posTop: 0, // 距离顶部
        cropWidth: 0, // 裁剪宽度
        cropHeight: 0, // 裁剪高度
        linkData: {
            link_url: '',
            value: '',
        },
    }),
    goods: () => ({
        title: '商品',
        type: 'goods',
        id: createID(),
        showType: 3, // 1 2 3支持单栏、双栏、三栏选择
        goodsName: '',
        hurdle: 1,
        more: 1,
        list: [],
        showMore: false,
        goodsType: 0, // 商品筛选类型 1: 活动 2: 优惠券
        inputGoodName: '', // 活动商品名称
        selectData: {}, // 商品筛选数据
        renderGoodList: [], // 渲染的商品数据
        faildNum: null, // 失败的数据量
        redisKey: '', // 失败下载ID
        fileName: '', // 文件名称
        showMarkingPrice: true, //划线价格
        showMarketingTag: true, //营销标签
        goodBgColor: 'transparent', 
    }),
    //店铺初始化
    shops: () => ({
        title: '店铺',
        type: 'shops',
        id: createID(),
        shop_list: [],
        shop_show_type: 'one',
    }),
    //标题文本
    button: () => {
        return {
            title: '', //标题内容
            id: createID(), //唯一id
            type: 'button', //type
            bg_color: '#fff', //背景颜色
            title_color: '#000000', //标题文字颜色
            title_size: 16, //标题文字大小
            title_weight: false, //标题是否加粗
            title_type: 'btnTitle', // 按钮标题
            btn_height: 50,
            btn_width: '',
            btn_radius: 0,
        };
    },
    // 暂时未用到 -----

    // //商品初始化
    // goods: (len: number = 3) => ({
    //     id: createID(),
    //     title: '商品',
    //     type: 'goods',
    //     goodsName: '',
    //     hurdle: 3,
    //     more: 0,
    //     list: new Array(len).fill({
    //         id: createID(),
    //         sellingTag: '卖点标签',
    //         marketingTag: '营销标签',
    //         img: '/image/default-shop.png',
    //         goodsTitle: '商品标题',
    //         price: '0.00',
    //     }),
    // }),
    //长文本初始化
    longText: () => ({
        title: '长文本',
        id: createID(),
        type: 'longText',
        value: '',
        color: '#333333',
        size: 14,
        alignType: 'left',
    }),
    //标题初始化
    title: () => ({
        title: '标题',
        id: createID(),
        type: 'title',
        mainTitleValue: '',
        mainTitleSize: 18,
        mainTitleColor: '#333333',
        sideTitleValue: '',
        sideTitleSize: 15,
        sideTitleColor: '#333333',
    }),
    //下载初始化
    download: () => ({
        type: 'download',
        title: '下载',
        id: createID(),
        titleValue: '立即下载洞窝APP',
        desc: '1. 长按或扫描二维码立即下载2. 复制下载链接并粘贴至浏览器前往下载',
        downloadSrc: '',
        img: '/image/default-shop.png',
    }),
    label: () => {
        return {
            title: 'label',
            type: 'label',
            id: createID(),
        };
    },
    canvas: () => {
        return {
            title: 'canvas',
            type: 'canvas',
            id: createID(),
        };
    },
    provinceAndCityShop: () => {
        return {
            type: 'provinceAndCityShop',
            sendMessage: 0,
            cardTheme: '#FFFFFF',
            buttonTextValue: '立即预约',
            msgTemplateId: undefined,
            maxMakeCount: 999999,
            buttonColor: 'rgb(242,72,76)',
            shopFile: {
                filename: '',
                src: '',
                time: '',
                list: [],
                errorMessage: null,
            },
            id: createID(),
        };
    },
    dynamicForm: () => {
        return {
            type: 'dynamicForm',
            cardTheme: 'light',
            buttonTextValue: '提交',
            buttonColor: 'rgb(242,72,76)',
            id: createID(),
            formList: [],
            toast: 1,
            toastContent: '',
        };
    },
};