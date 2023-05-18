import { updatePageData, updateShareData, updatePosterShareData } from '@/store/editor';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Input, Space, Select, Button, message, Radio } from 'antd';
import SelectColor from '../components/selectColor';
import moment, { Moment } from 'moment';
import { iEditor } from '@/store/config';
import { getStorage, saveStorage, storageKeys } from '@/utils/storageTools';
import { queryByTokenAndMarketId } from '@/api/operChannelApi';
import Upload from './banner/upload';
import IMGCLIENT from '@/utils/imgOss';
import { getLMComment } from '@/api/ai';
import { RedoOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PosterPreview from '../posterPreview';
const { TextArea } = Input;
const RangePicker: any = DatePicker.RangePicker;
const { Option } = Select;

//页面信息和分享信息编辑
const PageEditor = React.memo(function PageEditor() {
    const dispatch = useDispatch();
    const EditorData: iEditor = useSelector((state: any) => state.editor);
    const [marketList, setMarketList] = useState([]);
    const [listCity, setListCity] = useState([]);
    const allMarketList = useRef([]);
    const [activeKey, setActiveKey] = useState('styles');
    // const [loading, setLoading] = useState(false);
    const [suggestSC, setSuggestSC] = useState(''); // 分享内容 推荐文案
    const lastSuggestC = useRef<string | null>(null); // 上一次请求推荐接口参数
    const [posterVisable, setPosterVisable] = useState(false);
    const [hasPosterShare, setHasPosterShare] = useState(!!EditorData.posterShare);
    const { loading, run } = useRequest(getLMComment, {
        manual: true,
        debounceWait: 2000,
        debounceLeading: true,
        debounceTrailing: false,
        onSuccess: (data: string, params: string[]) => {
            if (data) {
                lastSuggestC.current = params[0];
                setSuggestSC(data);
            }
        },
    });
    const { loading: loading1, run: run1 } = useRequest(getLMComment, {
        manual: true,
        debounceWait: 2000,
        onSuccess: (data: string, params: string[]) => {
            if (data) {
                lastSuggestC.current = params[0];
                setSuggestSC(data);
            }
        },
    });

    // 初始化城市、卖场
    useEffect(() => {
        initCity();
    }, []);

    const initCity = async () => {
        try {
            const data = await queryByTokenAndMarketId();
            const { cityIds, marketIds, phone, userId } = data;
            setListCity(cityIds);
            allMarketList.current = marketIds;
            setMarketList(marketIds);
            saveStorage(storageKeys.MARKETS, marketIds);
            saveStorage(storageKeys.CITY_IDS, cityIds);
            saveStorage(storageKeys.USER_INFO, { phone, userId });
        } catch (error) {}
    };

    //设置页面信息
    function setPageData(data: any) {
        dispatch(updatePageData(data));
    }

    //设置分享的信息
    function setShareData(data: any) {
        dispatch(updateShareData(data));
    }

    //设置分享的信息
    function setPosterShareData(data: any) {
        dispatch(updatePosterShareData(data));
    }

    const handleChange = (data: any) => {
        if (data && data[0] && data[0].url) {
            setShareData({ img: data[0].url });
        } else {
            setShareData({ img: '' });
        }
    };

    const setShowPoster = () => {
        setHasPosterShare(true);
        if (!EditorData.posterShare?.cardTheme) {
            setPosterShareData({ cardTheme: 'light' });
        }
    };

    const handlePosterChange = (data: any) => {
        if (data && data[0] && data[0].url) {
            setShowPoster();
            setPosterShareData({ img: data[0].url + '?x-oss-process=image/format,jpg' });
        } else {
            setPosterShareData({ img: '' });
        }
    }

    const handleRemove = () => {
        setShareData({ img: '' });
    };

    const handleCustomRequest = async (e: any) => {
        try {
            const imgData: any = await IMGCLIENT.upload(e.file);
            const { downloadUrl, key, uid, url } = imgData;

            e.onSuccess({
                name: key,
                status: 'done',
                url: url,
                thumbUrl: url,
            });
            setShareData({ img: url });
        } catch (error) {
            e.onError(error);
        }
    };

    // 城市改变
    const handleChangeCity = (data: { value: string; label: any }) => {
        const markets = allMarketList.current.filter((market: any) => market.cityId === data.value);
        // dispatch(clearBlocks());
        setMarketList(markets);
        setPageData({ cityId: data.value, cityName: data.label, marketId: null, marketName: null, markets: [] });
    };

    const handleChangeTitle = (e: any) => {
        setPageData({ title: e.target.value });
    };

    // 卖场改变
    const handleChangeMarket = (value: any) => {
        // // dispatch(clearBlocks());
        // const market: any = marketList.find((item: any) => item.marketId === value);
        setPageData({ markets: value });
    };

    const handleChangeRSC = async () => {
        // 换一个推荐文案
        const title = EditorData.share.title;
        // 3个字以内不请求
        if (!title) return;
        if (title.trim().length < 4) return message.info('标题字数小于4字，暂无生成文案');
        run(title.trim());
    };
    const handleTitleBlur = (title) => {
        // 3个字以内不请求
        if (!title) return;
        if (title.trim().length < 4) return;
        // 失焦但是没有修改内容
        if (lastSuggestC.current === title) return;
        lastSuggestC.current = title;

        // 分享标题失去焦点
        run1(title.trim());
    };

    const handlerPreviewPoster = () => {
        if (!EditorData.posterShare || !EditorData.posterShare.title) {
            return message.warning('请填写海报分享标题');
        }

        if (!EditorData.posterShare.desc) {
            return message.warning('请填写海报分享内容');
        }

        if (!EditorData.posterShare.cardTheme) {
            return message.warning('请设置分享按钮');
        }

        if (!EditorData.posterShare.img) {
            return message.warning('请上传海报底图');
        }
        setPosterVisable(true);
    };

    return (
        <div className="attr_item">
            {posterVisable && <PosterPreview onClose={() => setPosterVisable(false)} />}
            <div className="attr_editor_tabs">
                <div onClick={() => setActiveKey('styles')} className={`attr_editor_tab ${ activeKey === 'styles' ? 'active' : '' }`}>样式<div className='tab_bar'></div></div>
                <div onClick={() => setActiveKey('share')} className={`attr_editor_tab ${ activeKey === 'share' ? 'active' : '' }`}>分享<div className='tab_bar'></div></div>
            </div>
            { activeKey === 'styles' && <>
                <Space direction="vertical" size="large" className="w-full page_item">
                    <div className="title">
                        页面基础信息<i className="start">*</i>
                    </div>
                    <Space size={10} direction="vertical" className="form w-full">
                        <div className="row">
                            <span className="label">落地页标题</span>
                            <Input allowClear onChange={handleChangeTitle} placeholder='洞窝落地页' value={EditorData.page.title} />
                        </div>

                        <div className="row">
                            <span className="label">选择城市</span>
                            <Select
                                labelInValue
                                placeholder="请选择城市名称"
                                style={{ width: '100%' }}
                                value={EditorData.page.cityId ? { value: EditorData.page.cityId || '', label: EditorData.page.cityName || '' } : undefined}
                                onChange={handleChangeCity}
                            >
                                {listCity &&
                                    listCity.length &&
                                    listCity.map((item: any) => (
                                        <Option key={item.cityStationId} value={item.cityStationId}>
                                            {item.cityName}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className="row">
                            <span className="label">选择卖场</span>
                            <Select
                                placeholder="请选择卖场名称"
                                style={{ width: '100%' }}
                                labelInValue
                                disabled={!EditorData.page.cityId}
                                value={
                                    EditorData.page.markets
                                        ? EditorData.page.markets
                                        : EditorData.page.marketId
                                        ? [{ value: EditorData.page.marketId || '', label: EditorData.page.marketName || '' }]
                                        : (null as any)
                                }
                                onChange={handleChangeMarket}
                                showSearch
                                mode="multiple"
                                filterOption={(input, option: any) => option.children.indexOf(input) >= 0}
                            >
                                {marketList &&
                                    marketList.map((item: any) => (
                                        <Option key={item.marketId} value={item.marketId}>
                                            {item.marketName}
                                        </Option>
                                    ))}
                            </Select>
                        </div>
                        <div className="row">
                            <span className="label">有效时间</span>
                            <RangePicker
                                allowClear
                                showToday
                                showTime
                                style={{
                                    width: '100%'
                                }}
                                placeholder={['开始时间', '结束时间']}
                                defaultValue={EditorData.page.startTime ? [moment(EditorData.page.startTime), moment(EditorData.page.endTime)] : []}
                                value={EditorData.page.startTime ? [moment(EditorData.page.startTime), moment(EditorData.page.endTime)] : []}
                                onChange={(dates: Moment[]) => {
                                    const [sm, em] = dates;
                                    setPageData({ startTime: sm.valueOf(), endTime: em.valueOf() });
                                }}
                            />
                        </div>
                        <div className="row">
                            <span className="label">背景色</span>
                            <SelectColor value={EditorData.page.bgColor} defaultValue="#F9F9F9" onChange={(hex) => setPageData({ bgColor: hex })} />
                        </div>
                    </Space>
                </Space>
            </>}
            {
                activeKey === 'share' && <>
                    <Space direction="vertical" size="large" className="page_item w-full">
                        <div className="title">
                            微信分享设置<i className="start">*</i>
                        </div>
                        <Space direction="vertical" size={20} className="form w-full">
                            <div className="row">
                                <span className="label">分享标题</span>
                                <Input
                                    type="text"
                                    className="form_input"
                                    value={EditorData.share.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        if (title.length <= 30) {
                                            setShareData({ title: title });
                                            handleTitleBlur(title);
                                        }
                                    }}
                                    placeholder="请输入标题，不超过30字"
                                    maxLength={30}
                                    showCount
                                    onBlur={(e) => {
                                        handleTitleBlur(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="line" />
                            <div className="row align_top">
                                <span className="label">分享内容</span>
                                <TextArea
                                    placeholder="请输入分享内容"
                                    rows={4}
                                    className="form_input"
                                    showCount
                                    value={EditorData.share.desc}
                                    onChange={(e) => {
                                        const desc = e.target.value;
                                        if (desc.length <= 200) {
                                            setShareData({ desc: desc });
                                        }
                                    }}
                                    maxLength={200}
                                />
                            </div>
                            {!!suggestSC && (
                                <div className="clo">
                                    <div className="row">
                                        <span className="label1">智能文案</span>
                                        <Button
                                            loading={loading || loading1}
                                            icon={<RedoOutlined />}
                                            type="text"
                                            className="button_row"
                                            style={{ color: '#737373' }}
                                            onClick={handleChangeRSC}
                                        >
                                            换一个
                                        </Button>
                                    </div>
                                    <div className="content_box">
                                        <span>{suggestSC}</span>
                                        <div
                                            className="button_text"
                                            onClick={() => {
                                                setShareData({ desc: suggestSC });
                                            }}
                                        >
                                            使用文案
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="line" />
                            <div className="clo">
                                <span className="label">分享图片</span>
                                <div className="attrs_row mt10">
                                    <div>
                                        <Upload
                                            imageType=".png,.jpeg,.jpg,.webp"
                                            value={EditorData.share.img ? [{ url: EditorData.share.img, uid: 'EditorData.share.img', name: '预览图片' }] : []}
                                            onChange={handleChange}
                                        ></Upload>
                                    </div>

                                    <span className="attrs_desc ml15">
                                        推荐图片比例1:1
                                        <br />
                                        支持格式：PNG、JPG、JPEG、WEBP
                                    </span>
                                </div>
                            </div>
                        </Space>
                    </Space>
                    <Space direction="vertical" size="large" className="page_item w-full">
                        <div className="title">
                            海报分享设置
                        </div>
                        <Space direction="vertical" size={20} className="form w-full">
                            <div className="row">
                                <span className="label">海报分享</span>
                                <Radio.Group onChange={e => {
                                    setHasPosterShare(e.target.value);
                                    if (!e.target.value) {
                                        setPosterShareData(null);
                                    } else {
                                        setShowPoster();
                                    }
                                }} value={hasPosterShare}>
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </Radio.Group>
                            </div>
                            <div className="row">
                                <span className="label">分享标题{hasPosterShare && <span className='require_item'>*</span>}</span>
                                <Input
                                    type="text"
                                    className="form_input"
                                    value={EditorData.posterShare?.title}
                                    onChange={(e) => {
                                        setShowPoster();
                                        const title = e.target.value;
                                        if (title.length <= 30) {
                                            setPosterShareData({ title: title });
                                        }
                                    }}
                                    placeholder="请输入标题，不超过30字"
                                    showCount
                                    maxLength={30}
                                />
                            </div>
                            <div className="line" />
                            <div className="row align_top">
                                <span className="label">分享内容{hasPosterShare && <span className='require_item'>*</span>}</span>
                                <TextArea
                                    placeholder="请输入分享内容"
                                    rows={4}
                                    className="form_input"
                                    value={EditorData.posterShare?.desc}
                                    showCount
                                    onChange={(e) => {
                                        const desc = e.target.value;
                                        setShowPoster();
                                        if (desc.length <= 200) {
                                            setPosterShareData({ desc: desc });
                                        }
                                    }}
                                    maxLength={200}
                                />
                            </div>
                            <div className="line" />
                            <div className="row">
                                <div className="label">分享按钮{hasPosterShare && <span className='require_item'>*</span>}</div>
                                <div className="item_wrap">
                                    <div onClick={() => setPosterShareData({ cardTheme: 'light' })} className={`customer_btn ${ EditorData.posterShare?.cardTheme === 'light' ? 'active' : '' }`}>
                                        浅色模式
                                    </div>
                                    <div onClick={() => setPosterShareData({ cardTheme: 'dark' })} className={`customer_btn ${ EditorData.posterShare?.cardTheme === 'dark' ? 'active' : '' }`}>
                                        深色模式
                                    </div>
                                </div>
                            </div>
                            <div className="line" />
                            <div className="clo">
                                <span className="label">海报底图{hasPosterShare && <span className='require_item'>*</span>}</span>
                                <div className="attrs_row mt10">
                                    <div>
                                        <Upload
                                            imageType=".png,.jpeg,.jpg,.webp"
                                            imageSize={{ type: 4, width: 1, height: 1, sizeText: "推荐图片尺寸比例为1:1，建议620*620，支持格式：PNG、JPG、JPEG、WEBP", }}
                                            value={EditorData?.posterShare?.img ? [{ url: EditorData.posterShare.img, uid: 'EditorData.posterShare.img', name: '预览图片' }] : []}
                                            onChange={handlePosterChange}
                                        ></Upload>
                                    </div>

                                    <span className="attrs_desc ml15">
                                        推荐图片尺寸比例为1:1，建议620*620<br/>支持格式：PNG、JPG、JPEG、WEBP
                                    </span>
                                </div>
                            </div>
                            <Button className='preview_btn' onClick={handlerPreviewPoster} type='primary'>预览海报</Button>
                        </Space>
                    </Space>
                </>
            }
        </div>
    );
});
export default PageEditor;
