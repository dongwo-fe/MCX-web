import { Select, Slider, InputNumber, Tooltip } from 'antd';
import './index.scss';
import Upload from '../banner/upload';
import useChangeEditorItemValue from '../../hooks/useChangeEditorItemValue';
import { useState } from 'react';
import { createID } from '@/utils/tools';
import EditorModal from './editorModal';
import { useDrag, useDrop } from 'react-dnd';
import React from 'react';
import { iEditorBanner, isBannerItem } from '@/store/config';

/**
 * 轮播图编辑
 */

const BannerEditor = ({ data: { id } }: { data: iEditorBanner }) => {
    const { Option } = Select;
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorBanner>({ id });
    const [modalVisible, setModalVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 选中状态的链接数据 默认是第一个
    const { imgList } = data;
    const selectLinkData = imgList.length > 0 ? imgList[0] : { nav_data: { link_url: '', value: '' } };
    const [itemData, setItemData] = useState(selectLinkData);

    // 尺寸选择
    const handleChangeType = (value: string) => {
        handleChangeValue('size_type', value);
    };

    // 图片更新
    const uploadImage = (value: Array<any>, index: number) => {
        const copy = [...imgList];
        if (value.length == 0) {
            copy[index] = Object.assign({}, copy[index], { url: '', image_height: 0 });
        } else if (value.length > 0) {
            copy[index] = Object.assign({}, copy[index], { url: value[0].url, image_height: value[0].height });
        }
        setTimeout(() => {
            handleChangeValue('imgList', copy);
        }, 200);
    };

    // 添加链接
    const addPushUrl = (index: number) => {
        setModalVisible(true);
        setCurrentIndex(index);
        const copy = Object.assign({}, itemData, imgList[index]);
        setItemData(copy);
    };

    // 添加数量
    const addImageList = () => {
        const copy = [...imgList];
        copy.push({
            nav_data: {
                link_url: '',
                value: '',
            },
            url: '',
            thumb_url: '',
            id: createID(),
            image_height: 0,
        });
        handleChangeValue('imgList', copy);
    };

    // 修改边距
    const onChangeSilderPadding = (value: number | null) => {
        handleChangeValue('page_padding', value || 0);
    };

    // 删除轮播图片数量
    const delateBanner = (index: number) => {
        let copy = imgList.filter((v, i) => i !== index);
        handleChangeValue('imgList', copy);
    };

    // 取消链接弹窗
    const onCancel = () => {
        setModalVisible(false);
    };

    // 保存弹窗链接
    const onSave = (item: any) => {
        setModalVisible(false);
        const copy = [...imgList];
        copy[currentIndex] = Object.assign({}, copy[currentIndex], { nav_data: item });
        handleChangeValue('imgList', copy);
    };

    // 图片比例切换
    const imageSize = () => {
        switch (data.size_type) {
            case 'four_three': // 4:3的比例
                return { type: 6, width: 4, height: 3, sizeText: '建议尺寸750X562,图片比例需要为4:3' };
            case 'three_four': // 3:4的比例
                return { type: 4, width: 3, height: 4, sizeText: '建议尺寸750X1000,图片比例需要为3:4' };
            case 'three_one': // 3:1的比例
                return { type: 4, width: 3, height: 1, sizeText: '建议尺寸750X250,图片比例需要为3:1' };
            case 'customize': // 自定义比例
                return { type: 3 };
        }
    };

    // 拖拽组件的渲染
    const EditImage = React.memo((props: { item: isBannerItem; index: number }) => {
        const { item, index } = props;
        const [, drag] = useDrag(() => ({
            type: 'imageList',
            item: { indexStart: index },
        }));
        const [, drop] = useDrop(
            () => ({
                accept: 'imageList',
                drop(res: any, monitor) {
                    const didDrop = monitor.didDrop();
                    if (didDrop) return;
                    const copy = [...imgList];
                    [copy[res.indexStart], copy[index]] = [copy[index], copy[res.indexStart]];
                    handleChangeValue('imgList', copy);
                },
                collect: (monitor) => ({
                    isOver: monitor.isOver(),
                    isOverCurrent: monitor.isOver({ shallow: true }),
                }),
            }),
            [imgList]
        );

        return (
            <div ref={drop}>
                <div ref={drag}>
                    <div className="image-upload" style={{ marginTop: 16 }}>
                        <div style={{ marginTop: 6 }}>
                            <Upload onChange={(e: any) => uploadImage(e, index)} value={item.url == '' ? [] : [imgList[index]]} imageSize={imageSize()} />
                        </div>
                        <div onClick={(e) => addPushUrl(index)} className="show-input-text">
                            {item.nav_data.value == 'marketList' ? '同城卖场列表页' : item.nav_data.link_url != '' ? item.nav_data.link_url : '添加跳转到的页面(选填)+'}
                        </div>
                        <Tooltip
                            placement="top"
                            overlayClassName="tooltipWidth"
                            title={() => {
                                return (
                                    <>
                                        <span className="dataList-reamrk">
                                            <span> 1. H5 链接，输入完整HTTPS开头的链接地址。</span>
                                            <br />
                                            <span> 2. 商品详情页：输入 “daimao://goodsId=123” 中的123 表示跳转的商品ID </span>
                                            <br />
                                            <span> 3. 店铺详情页：输入“daimao://shopId=123” 中的123 表示跳转的店铺ID</span>
                                            <br />
                                            <span> 4. 卖场详情页：输入“daimao://marketId=123 ”中的123 表示跳转的卖场ID</span>
                                            <br />
                                            <span> 5. 同城卖场列表页：输入“daimao://marketList”</span>
                                            <br />
                                            <span> 6. 搜索关键字：输入“daimao://keyWords=123”，中的123 表示跳转的搜索关键字</span>
                                            <br />
                                            <span> 7. 类目列表：输入“daimao://categoryId=123”，中的123表示跳转的二级类目ID</span>
                                            <br />
                                        </span>
                                    </>
                                );
                            }}
                        >
                            <div className="show-detail-input">?</div>
                        </Tooltip>
                    </div>
                    {imgList.length > 1 && (
                        <div className="set-image-list">
                            <span onClick={(e) => delateBanner(index)}>删除</span>
                        </div>
                    )}
                </div>
            </div>
        );
    });

    const imageSizeData = [
        {
            size: '4:3',
            value: 'four_three',
            adviseSize: '(建议尺寸750X562)',
        },
        {
            size: '3:4',
            value: 'three_four',
            adviseSize: '(建议尺寸750X1000)',
        },
        {
            size: '3:1',
            value: 'three_one',
            adviseSize: '(建议尺寸750X250)',
        },
        {
            size: '自定义比例',
            value: 'customize',
            adviseSize: '',
        },
    ];

    return (
        <>
            <div className="editor-module-wrap">
                <div className="item-wrap">
                    <span>设置图片比例</span>
                    <div style={{ marginTop: 16 }}>
                        <Select value={data.size_type} style={{ width: 300 }} onChange={handleChangeType}>
                            {imageSizeData.map((item, index) => {
                                return (
                                    <Option key={index} label="" value={item.value}>
                                        <span>{item.size}</span>
                                        <span style={{ color: '#999' }}>{item.adviseSize}</span>
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <div style={{ paddingLeft: 20 }}>
                    <div>添加图片</div>
                    {imgList.map((item: isBannerItem, index: number) => {
                        return <EditImage key={item.id} item={item} index={index} />;
                    })}
                </div>
                {data.imgList.length <= 9 && (
                    <div className="item-wrap">
                        <div onClick={addImageList} className="add-nav-box diff-height">
                            <div style={{ color: 'rgb(66, 139, 228)' }}>+添加背景图({data.imgList.length}/10)</div>
                        </div>
                    </div>
                )}
                <div className="item-wrap item-center-spw">
                    <span>页面边距</span>
                    <Slider style={{ width: 140 }} min={0} max={30} onChange={onChangeSilderPadding} value={data.page_padding} />
                    <InputNumber size="middle" min={0} max={30} step={1} value={data.page_padding} onChange={onChangeSilderPadding} />
                </div>
            </div>
            <EditorModal key={modalVisible} item={itemData.nav_data} onCancel={onCancel} onSave={onSave} visible={modalVisible} />
        </>
    );
};

export default BannerEditor;
