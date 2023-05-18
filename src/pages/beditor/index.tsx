import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';
import Component from './component';
import Render from './render';
import './index.scss';
import React, { useEffect, useRef, useState } from 'react';
import { initialMemberState, initialState, resetData, setBlockShow, setEditorData, updatePageData, changeRenderBlock } from '@/store/editor';
import Attrs from './attrs';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, ExclamationCircleOutlined, RiseOutlined, PauseOutlined, SaveOutlined, CheckOutlined, SendOutlined } from '@ant-design/icons';
import { Button, message, Space, Modal, Input } from 'antd';
import { getTopicDetail, saveTopicDetail, updateTopicState } from '@/api/topicApi';
import { defaultFormatFunc, getQueryString } from '@/utils/tools';
import saveCheck, { pageInfoCheck } from './saveCheck';
import { iEditorPage, iEditor, iEditorBlock, iTCard } from '@/store/config';
import PromoteModal from '../activeLanding/components/promoteModal';
import { getSessionStorage, getStorage, saveStorage, setSessionStorage, storageKeys } from '@/utils/storageTools';
import TrendModal from '../activeLanding/components/trendModal';
import { AuthWrapper } from '@/component/AuthWrapper';
import { addOperChannel, addOperActivityChannelCollection } from '@/api/activeLandingPage';
import { saveAndUpdateFloorPageInfo } from '@/api/provinceAndCityShop';

const { confirm } = Modal;

/**
 * 编辑器的主页面
 */
export default function beditor() {
    const AttrsRef: any = useRef(null);
    const TrendModalRef = useRef<any>(null); // 统计弹窗 modal
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useRef(getQueryString('id'));
    const pageType = useRef(getQueryString('pageType'));
    const [publishLoading, setPublishLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const PromoteModalRef = useRef<any>(null);
    const iSNew = useRef<boolean>(false); //是否是新建落地页

    // 当前状态是展开还是收起
    const [collapsed, setCollapsed] = useState(false);

    const PageData: iEditorPage = useSelector((state: any) => state.editor.page);
    const editor: iEditor = useSelector((state: any) => state.editor);

    const getdata = async () => {
        if (id.current) {
            try {
                const data = await getTopicDetail(id.current);
                if (data && data.page) {
                    pageType.current = data.page.pageType;
                    if (data.page.cityId && !data.page.cityName) {
                        const citys = getStorage(storageKeys.CITY_IDS);
                        const item = citys.find((v: iCityItem) => v.cityStationId === data.page.cityId);
                        data.page.cityName = item.cityName;
                    }
                }
                if (getQueryString('copy') === '1') {
                    id.current = '';
                }
                dispatch(setEditorData(data));
            } catch (error: any) {
                message.error(error.message || '获取数据失败');
            }
        } else {
            if (pageType.current === 'member') {
                dispatch(setEditorData(initialMemberState));
            } else {
                dispatch(setEditorData(initialState));
            }
        }
    };
    useEffect(() => {
        dispatch(resetData());
        getdata();
    }, []);

    function showPageAttr() {
        dispatch(setBlockShow({ id: null }));
    }
    function showModuleAttr(blockData: iEditorBlock) {
        if (!editor.editBlockId) {
            dispatch(setBlockShow({ id: blockData.id }));
        } else {
            dispatch(setBlockShow({ id: null }));
            setTimeout(() => {
                dispatch(setBlockShow({ id: blockData.id }));
            }, 200);
        }
    }

    let timer: any = null;
    async function debounce(type: string) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            await handleSave(type);
        }, 1000);
    }

    async function handleSave(type: string) {
        if (type === 'save') {
            setSaveLoading(true);
        }
        try {
            let noLimit = true;
            noLimit = pageInfoCheck(editor.page, editor.share, editor.posterShare);
            if (!noLimit) {
                dispatch(setBlockShow({ id: null }));
                return
            }
            
            if (editor.blocks.length === 0) {
                message.error('活动组件不能为空');
                return false;
            }
            let exportFlag = false; //是否有导出按钮
            editor.blocks.some((item) => {
                if (['dynamicForm', 'forms'].includes(item.type)) {
                    exportFlag = true;
                }
                noLimit = saveCheck(item, item.type);
                if (!noLimit) {
                    dispatch(setBlockShow({ id: item.id }));
                    return true;
                }
                return false;
            });
            // 是否有多个流量卡
            const keys = (editor.tcardBlocks && Object.keys(editor.tcardBlocks)) || [];

            noLimit &&
                keys.some((v) => {
                    // 获取副流量模版
                    const blocks = (editor.tcardBlocks && editor.tcardBlocks[v].blocks) || [];
                    blocks.some((item) => {
                        // 未锁定模版需要检查
                        if (item.isLock != true) {
                            noLimit = saveCheck(item, item.type);
                            if (!noLimit) {
                                dispatch(changeRenderBlock({ tid: v }));
                                dispatch(setBlockShow({ id: item.id }));
                                return true;
                            }
                        }
                        return false;
                    });
                    if (!noLimit) {
                        return true;
                    }
                    return false;
                });
            if (!noLimit) return false;
            const marketids: string[] = [];
            const marketnames: string[] = [];
            let markets = editor.page.markets;
            if (Array.isArray(markets)) {
                editor.page.markets.forEach((v) => {
                    marketids.push(v.value);
                    marketnames.push(v.label);
                });
            } else {
                //兼容老的数据
                markets = [
                    {
                        value: editor.page.marketId,
                        label: editor.page.marketName,
                    },
                ];
                marketids.push(editor.page.marketId || '');
                marketnames.push(editor.page.marketName || '');
            }

            const newPage = Object.assign(
                {},
                { ...editor.page },
                { exportFlag: exportFlag, marketids: marketids, marketnames: marketnames, markets: markets, pageType: editor.page.pageType || 'custom' }
            );
            const newEditor = Object.assign({}, { ...editor }, { page: newPage });
            const makeShopOption = editor.blocks.find((item) => item.type === 'provinceAndCityShop');
            if (makeShopOption && id.current) {
                //修改需要先提交预约门店数量
                await saveAndUpdateFloorPageInfo({
                    pageStartTime: defaultFormatFunc(newPage.startTime),
                    pageEndTime: defaultFormatFunc(newPage.endTime),
                    pageId: id.current,
                    pageModuleEndTime: defaultFormatFunc(makeShopOption.showEndTime),
                    pageModuleStartTime: defaultFormatFunc(makeShopOption.showStartTime),
                    stock: makeShopOption.maxMakeCount,
                    pageUrl: '',
                });
            }
            const data = await saveTopicDetail(newEditor, id.current);
            if (makeShopOption && !id.current && data.lid) {
                // 第一次保存后提交预约门店数量
                await saveAndUpdateFloorPageInfo({
                    pageStartTime: defaultFormatFunc(newPage.startTime),
                    pageEndTime: defaultFormatFunc(newPage.endTime),
                    pageId: data.insertedId,
                    pageModuleEndTime: defaultFormatFunc(makeShopOption.showEndTime),
                    pageModuleStartTime: defaultFormatFunc(makeShopOption.showStartTime),
                    stock: makeShopOption.maxMakeCount,
                    pageUrl: '',
                });
            }
            if (!id.current) {
                iSNew.current = true;
                if (data.lid) {
                    // 返回活动ID
                    addDefaultChannel(data.lid);
                }
            }
            if (type === 'save') {
                message.success('保存成功');
            }
            if (data.insertedId) {
                id.current = data.insertedId;
            }
            return true;
        } catch (error: any) {
            message.error(error.message || '保存失败');
            return false;
        } finally {
            setSaveLoading(false);
        }
    }

    const addDefaultChannel = async (lid) => {
        // 第一次保存时添加新的默认异业渠道 并绑定
        if (!lid) return;
        try {
            const citys = getStorage(storageKeys.CITY_IDS);
            const marketIds = getStorage(storageKeys.MARKETS);
            const market = Array.isArray(marketIds) ? marketIds[0] : null;
            let city: any = null;
            if (market && Array.isArray(citys)) {
                /**
                 * cityId: "824358401244008410"
                    marketAttribute: null
                    marketId: "561083032310087680"
                    marketName: "北京丽泽购物中心"
                 */
                city = citys.find((v) => v.cityStationId == market.cityId);
            }

            if (!market || !city) {
                // 没有找到城市 和卖场
                return;
            }

            const params = {
                channelName: editor.page.title,
                memberType: 1,
                cityIdList: [{ name: city?.cityName, id: market?.cityStationId }],
                marketIdList: [{ name: market?.marketName, id: market?.marketId }],
                shopIdList: [],
                firstLevelName: '',
                secondLevelName: '',
                threeLevelName: '',
            };
            const channelid = await addOperChannel(params);
            if (!channelid) return;
            addOperActivityChannelCollection([{ activityId: lid, channelId: channelid }]);
        } catch (error) {}
    };
    //发布
    const handlePublish = async () => {
        setPublishLoading(true);
        const saveSuccess = await handleSave('publish');
        if (!saveSuccess) {
            return setPublishLoading(false);
        }
        if (!id.current) return setPublishLoading(false);
        try {
            await updateTopicState(id.current, 1);
            message.success('发布成功');
            // const data = await getTopicDetail(id.current);
            // const { lid, title, pageType } = data.page || {};
            // PromoteModalRef.current.showModal({
            //     _id: id.current,
            //     lid,
            //     title,
            //     pageType,
            // });
            if (iSNew.current) {
                setSessionStorage(storageKeys.SHOW_ADVERTISING, id.current);
            }
            navigate(-1);
        } catch (error: any) {
            console.log('%c [ error ]-159', 'font-size:13px; background:pink; color:#bf2c9f;', error.data);
            const { data } = error;
            if (data.code === '601' && data.data.id) {
                Modal.confirm({
                    content: '当前城市站有一个正在进行中的权益页,是否停用该页面,并启用当前选择页面?',
                    cancelText: '取消',
                    okText: '确定',
                    onOk: () => toEnableCurrent(id.current, data.data.id),
                });
            } else {
                message.error(error.message || '发布失败');
            }
        } finally {
            setPublishLoading(false);
        }
    };

    //停用老的 启用新的
    const toEnableCurrent = async (newId: string, oldId: string) => {
        try {
            await updateTopicState(oldId, 0);
            await updateTopicState(newId, 1);
            message.success('启用成功');
            if (iSNew.current) {
                setSessionStorage(storageKeys.SHOW_ADVERTISING, newId);
            }
            navigate(-1);
        } catch (error: any) {
            message.error(error.message || '启用失败');
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    // 编辑提交提示框
    const showConfirm = () => {
        confirm({
            title: '编辑确认',
            icon: <ExclamationCircleOutlined />,
            content: '当前模板发布后立即生效，是否确认提交?',
            onOk() {
                handlePublish();
            },
            onCancel() {
                //
            },
        });
    };

    //设置页面信息
    const setPageData = (data: any) => {
        dispatch(updatePageData(data));
    };

    const handleTrend = () => {
        // 统计按钮点击
        TrendModalRef.current.show({ ...PageData, _id: id.current, data: { tcards: editor.tcards } });
    };

    const onDisableClick = async () => {
        // 禁用 启用
        try {
            const nstate = editor.page?.state === 0 ? 1 : 0;
            await updateTopicState(id.current, nstate);
            setPageData({ state: nstate });
            message.success('操作成功');
        } catch (error) {}
    };

    return (
        <div id="beditor" className="top">
            <div className="header">
                <div className="back-btn" onClick={() => navigate(-1)}>
                    <LeftOutlined />
                    <span>{pageType.current === 'member' ? '会员权益页' : '落地页模板库'}</span>
                </div>
                {/* <span>{PageData.title}</span> */}
                <Input
                    className="header-input"
                    type="text"
                    value={PageData.title}
                    bordered={false}
                    maxLength={30}
                    onChange={(e) => setPageData({ title: e.target.value })}
                    placeholder="洞窝落地页"
                />
                <div className="text-right">
                    <Space>
                        {/* <Button onClick={handlePreview} shape="round">
                            预览
                        </Button> */}
                        {id.current && (
                            <>
                                <Button icon={<RiseOutlined />} type="primary" loading={saveLoading} onClick={handleTrend} shape="round">
                                    统计
                                </Button>
                                <div className="line_vertical" />
                            </>
                        )}
                        {id.current && editor.page?.state === 1 && (
                            <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_ENABLE_STOP">
                                <Button icon={<PauseOutlined />} loading={saveLoading} onClick={onDisableClick} shape="round" danger>
                                    停用
                                </Button>
                            </AuthWrapper>
                        )}
                        {id.current && editor.page?.state === 0 && (
                            <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_ENABLE_STOP">
                                <Button icon={<CheckOutlined />} style={{ borderColor: 'green', color: 'green' }} loading={saveLoading} onClick={onDisableClick} shape="round">
                                    启用
                                </Button>
                            </AuthWrapper>
                        )}

                        <Button style={{ color: '#40a9ff', borderColor: '#40a9ff' }} icon={<SaveOutlined />} loading={saveLoading} onClick={() => debounce('save')} shape="round">
                            保存
                        </Button>
                        <Button
                            style={{ display: 'flex', alignItems: 'center' }}
                            icon={<img className="button_icon" src="https://osstest.jrdaimao.com/file/1678266402137239.png" alt="" />}
                            loading={publishLoading}
                            onClick={showConfirm}
                            shape="round"
                            type="primary"
                        >
                            发布
                        </Button>
                    </Space>
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div>
                    <Component collapsed={collapsed} setCollapsed={setCollapsed}/>
                    <Render collapsed={collapsed} setCollapsed={setCollapsed} showPageAttr={showPageAttr} showModuleAttr={showModuleAttr} />
                    <Attrs ref={AttrsRef} />
                </div>
            </DndProvider>
            {/* 推广链接弹窗 */}
            <PromoteModal ref={PromoteModalRef} goBack={goBack}></PromoteModal>
            {/* 统计 */}
            <TrendModal ref={TrendModalRef} />
        </div>
    );
}
