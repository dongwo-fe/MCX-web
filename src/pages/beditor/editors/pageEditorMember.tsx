import { updatePageData, updateShareData } from '@/store/editor';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker, Input, Space, Select, Radio, RadioChangeEvent } from 'antd';
import SelectColor from '../components/selectColor';
import moment, { Moment } from 'moment';
import { iEditor } from '@/store/config';
import { getStorage, storageKeys } from '@/utils/storageTools';
import { queryByTokenAndMarketId } from '@/api/operChannelApi';
import Upload from './banner/upload';
import IMGCLIENT from '@/utils/imgOss';
const { TextArea } = Input;
const RangePicker: any = DatePicker.RangePicker;
const { Option } = Select;

//会员权益 页面信息和分享信息编辑
const PageEditorMember = React.memo(function PageEditorMember() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const EditorData: iEditor = useSelector((state: any) => state.editor);
    const [marketList, setMarketList] = useState([]);
    const [listCity, setListCity] = useState([]);
    const allMarketList = useRef([]);
    // 初始化城市、卖场
    useLayoutEffect(() => {
        initCity();
    }, []);

    const initCity = async () => {
        try {
            const data = await queryByTokenAndMarketId();
            const { cityIds, marketIds } = data;
            setListCity(cityIds);
            allMarketList.current = marketIds;
            if (EditorData.page.cityId) {
                const markets = allMarketList.current.filter((market: any) => market.cityId === EditorData.page.cityId);
                setMarketList(markets);
            } else {
                setMarketList(marketIds);
            }
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

    const handleChange = (data: any) => {
        if (data && data[0] && data[0].url) {
            setShareData({ img: data[0].url });
        } else {
            setShareData({ img: '' });
        }
    };

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

    // 卖场改变
    const handleChangeMarket = (value: any) => {
        // dispatch(clearBlocks());
        // const market: any = marketList.find((item: any) => item.marketId === value);
        // setPageData({ marketId: value, marketName: market.marketName });
        setPageData({ markets: value });
    };

    //状态切换 1 未领取 2 已领取
    const onShowTypeChange = (e: RadioChangeEvent) => {
        setPageData({ ...EditorData.page, showType: e.target.value });
    };
    return (
        <div className="attr_item">
            <Space direction="vertical" className="page_item w-full">
                <div className="title">
                    <i className="start">*</i>页面基础信息
                </div>
                <Space direction="vertical" className="form w-full">
                    <div className="row">
                        <span className="label">会员权益</span>
                        <Radio.Group value={1}>
                            <Radio value={1}>居然会</Radio>
                        </Radio.Group>
                    </div>
                    <div className="clo">
                        <span className="label">页面标题（C端展示）</span>
                        <Input
                            type="text"
                            className="form_input"
                            value={EditorData.page.title}
                            maxLength={30}
                            onChange={(e) => setPageData({ title: e.target.value })}
                            placeholder="请输入标题，不超过30字"
                        />
                    </div>
                    <div className="row">
                        <span className="label">选择城市</span>
                        <Select
                            labelInValue
                            placeholder="请选择城市名称"
                            style={{ width: 180 }}
                            value={EditorData.page.cityId ? { value: EditorData.page.cityId || '', label: EditorData.page.cityName || '' } : undefined}
                            onChange={handleChangeCity}
                        >
                            {listCity.map((item: any) => (
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
                            style={{ width: 180 }}
                            labelInValue
                            disabled={!EditorData.page.cityId}
                            mode="multiple"
                            value={
                                EditorData.page.markets
                                    ? EditorData.page.markets
                                    : EditorData.page.marketId
                                    ? [{ value: EditorData.page.marketId || '', label: EditorData.page.marketName || '' }]
                                    : (null as any)
                            }
                            onChange={handleChangeMarket}
                            showSearch
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
                        <span className="label">页面背景色</span>
                        <SelectColor value={EditorData.page.bgColor} defaultValue="#F9F9F9" onChange={(hex) => setPageData({ bgColor: hex })} />
                    </div>
                    <div className="row">
                        <span className="label">状态切换</span>
                        <Radio.Group onChange={onShowTypeChange} value={EditorData.page.showType}>
                            <Radio value={1}>未领取</Radio>
                            <Radio value={2}>已领取</Radio>
                        </Radio.Group>
                    </div>
                </Space>
            </Space>
            <Space direction="vertical" className="page_item w-full">
                <div className="title">
                    <i className="start">*</i>分享基础信息
                </div>
                <Space direction="vertical" className="form w-full">
                    <div className="clo">
                        <span className="label">分享的标题</span>
                        <Input
                            type="text"
                            className="form_input"
                            value={EditorData.share.title}
                            onChange={(e) => setShareData({ title: e.target.value })}
                            placeholder="请输入标题，不超过30字"
                        />
                    </div>
                    <div className="clo">
                        <span className="label">分享图片</span>
                        <Upload imageType=".png,.jpeg,.jpg" value={EditorData.share.img ? [{ url: EditorData.share.img, uid: 'EditorData.share.img', name: '预览图片' }] : []} onChange={handleChange}></Upload>
                        <span>建议图片比列1:1，支持类型：JPG,PNG</span>
                    </div>
                </Space>
            </Space>
        </div>
    );
});
export default PageEditorMember;
