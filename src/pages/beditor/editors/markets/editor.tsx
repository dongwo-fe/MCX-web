import React from 'react';
import { iEditorMarkets } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Button, message, Radio, RadioChangeEvent, Select, Space, Table } from 'antd';
import Upload from '../banner/upload';
import { useEffect, useRef, useState } from 'react';
import { IcityData, cityStationList, ImarketsData, marketsStationList, marketDetail, getMarketList } from '@/api/markets';
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable, getImageUrl } from '@/utils/tools';
import SelectMarketModal from './SelectMarketModal';
import EditImageModal from './EditImageModal';
import SelectColor from '../../components/selectColor';
const SortableItem: any = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableBody: any = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);
/**
 * 卖场编辑
 */
const MarketsiEditor = ({ data: { id } }: { data: iEditorMarkets }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorMarkets>({ id });
    const { image_type, market_image, city_id, market_show_type = 'one', market_list = [], market_color } = data;
    const [cityList, setCityList] = useState<IcityData[]>([]);
    const [currentCityId, setCurrentCityId] = useState(city_id);
    const [showSelectModal, setShowSelectModal] = useState(false); //选择卖场弹窗
    const [marketList, setMarketList] = useState<ImarketsData[]>([]);
    const [showEditImageModal, setShowEditImageModal] = useState(false); //编辑图片弹窗
    const editImageIndex = useRef<number>();

    useEffect(() => {
        getCityList();
    }, []);

    // 选择城市
    const handleChangeCity = (value: any) => {
        setCurrentCityId(value);
        getMarketsList(value);
    };

    // 选择了卖场
    const handleChangeMarkets = (value: any) => {
        handleChangeValue('matket_id', value);
        getMarketDetail(value);
    };

    // 获取卖场详情
    const getMarketDetail = async (value: string) => {
        try {
            const data = await marketDetail({
                marketId: value,
            });
        } catch (error: any) {
            message.error(error.message);
        }
    };

    //卖场列表展示切换
    const onMarketShowTypeChange = (e: RadioChangeEvent) => {
        handleChangeValue('market_show_type', e.target.value);
    };

    const selectType = (type: string) => {
        handleChangeValue('image_type', type);
    };

    const imageUpload = (value: any) => {
        const url = value.length == 0 ? '' : value[0].url;
        handleChangeValue('market_image', url);
    };

    // 获取城市数据
    const getCityList = async () => {
        try {
            const data = await cityStationList({});
            setCityList(data);
            handleChangeCity(currentCityId || data[0].cityStationId);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    // 获取卖场列表
    const getMarketsList = async (value: string) => {
        try {
            const data = await marketsStationList({
                cityStationId: value,
            });
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    item.label = item.marketName;
                    item.value = item.marketId;
                });
                setMarketList(data);
            } else {
                setMarketList([]);
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };
    //选择卖场确定
    const handleSelectMarketOk = async (checkedList: string[]) => {
        //其他城市已选卖场
        const othrtml = market_list.filter((item: any) => item.cityStationId !== currentCityId);
        //当前城市站已选卖场
        const cml = market_list.filter((item: any) => item.cityStationId === currentCityId);
        const cmi: any = {};
        cml.forEach((v) => {
            cmi[v.marketId] = v.market_image;
        });
        //当前城市已选卖场
        const sml = marketList.filter((item) => checkedList.includes(item.marketId));
        try {
            const data: any = await getMarketList({ marketIds: sml.map((v) => v.marketId) });
            if (data) {
                const { list } = data;
                list.forEach((v: any) => {
                    v.market_image = cmi[v.marketId] || getImageUrl(v.marketPic);
                });
                handleChangeValue('market_list', [...othrtml, ...list]);
                setShowSelectModal(false);
            }
        } catch (e: any) {
            message.error(e.message);
        }
    };
    const DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(market_list.slice(), oldIndex, newIndex);
            handleChangeValue('market_list', newData);
        }
    };
    // tab 分类
    const columns: any = [
        {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
            fixed: 'left',
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            title: '卖场编号',
            dataIndex: 'marketCode',
            className: 'drag-visible',
        },
        {
            title: '卖场',
            dataIndex: 'marketName',
        },

        {
            title: '操作',
            dataIndex: 'action',
            width: 80,
            fixed: 'right',
            render: (_: any, record: any, index: number) => (
                <Space>
                    <a onClick={() => handleDel(record, index)}>删除</a>
                    <a onClick={() => handleEditImage(record, index)}>编辑图片</a>
                </Space>
            ),
        },
    ];
    //删除选中卖场
    const handleDel = (record: any, index: number) => {
        const newData = market_list.slice();
        newData.splice(index, 1);
        handleChangeValue('market_list', newData);
    };
    //编辑图片
    const handleEditImage = (record: any, index: number) => {
        editImageIndex.current = index;
        setShowEditImageModal(true);
    };
    const updateMarketImg = (url: string) => {
        if (editImageIndex.current || editImageIndex.current === 0) {
            const newData = market_list.slice();
            if (newData[editImageIndex.current]) {
                newData[editImageIndex.current] = Object.assign({}, newData[editImageIndex.current], { market_image: url });
            }
            handleChangeValue('market_list', newData);
        }
    };
    const DraggableContainer = (props: SortableContainerProps) => <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />;

    const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = market_list.findIndex((x: any) => x.marketId === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    return (
        <div id="market-editor">
            <div className="control-group">
                <div className="control-group__title">卖场列表</div>
                <div className="ml-auto" />
                <Radio.Group onChange={onMarketShowTypeChange} value={market_show_type}>
                    <Radio value={'one'}>单栏</Radio>
                    <Radio value={'two'}>双栏</Radio>
                    <Radio value={'three'}>三栏</Radio>
                    <Radio value={'four'}>四栏</Radio>
                </Radio.Group>
            </div>
            {['three', 'four'].includes(market_show_type) && (
                <div className="control-group">
                    <div className="control-group__title">卖场名称颜色</div>
                    <div className="ml-auto" />
                    <SelectColor value={market_color || '#303235'} defaultValue="#303235" onChange={(hex) => handleChangeValue('market_color', hex)} />
                </div>
            )}

            <div className="control-group">
                <div className="control-group__title">选择卖场</div>
                <Button icon={<PlusOutlined />} onClick={() => setShowSelectModal(true)}>
                    选择卖场
                </Button>
            </div>

            <Table
                rowKey="marketId"
                style={{ marginTop: 10 }}
                columns={columns}
                bordered
                dataSource={market_list}
                pagination={false}
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                    },
                }}
            />
            {showSelectModal && (
                <SelectMarketModal
                    cityList={cityList}
                    marketList={marketList}
                    showSelectModal={showSelectModal}
                    handleOk={handleSelectMarketOk}
                    handleCancel={() => setShowSelectModal(false)}
                    currentCityId={currentCityId}
                    handleChangeCity={handleChangeCity}
                    defaultCheckedList={market_list.map((v: any) => v.marketId)}
                />
            )}

            {showEditImageModal && (
                <EditImageModal
                    item={((editImageIndex.current || editImageIndex.current === 0) && market_list[editImageIndex.current]) || null}
                    showEditImageModal={showEditImageModal}
                    setShowEditImageModal={setShowEditImageModal}
                    updateMarketImg={updateMarketImg}
                    imageSizeSuggestionType="market"
                    title="编辑卖场图片"
                />
            )}
        </div>
    );
};

export default MarketsiEditor;
