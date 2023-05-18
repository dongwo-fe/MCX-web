import { iEditorGraphical } from '@/store/config';
import { numberToText } from '@/utils/tools';
import { Input, Row, Tooltip } from 'antd';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import useChangeEditorItemValue from '../../hooks/useChangeEditorItemValue';
import Upload from '../banner/upload';

const ImageTextNav = React.memo((props: { item: any; index: number; id: string; setModalVisible: Function; setImageIndex: Function; setTextIndex: Function }) => {
    const { item, index, id, setModalVisible, setImageIndex, setTextIndex } = props;
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorGraphical>({ id });
    const { nav_type, image_title_list, title_list } = data;
    // 自定义图片
    const uploadImage = (value: any, index: number) => {
        const copy = [...image_title_list];
        copy[index] = Object.assign({}, copy[index], { url: value.length > 0 ? value[0].url : '' });
        handleChangeValue('image_title_list', copy);
    };
    // 输入文字处理
    const inputImageText = (value: string, index: number) => {
        const copy = [...image_title_list];
        copy[index] = Object.assign({}, copy[index], { title_name: value });
        handleChangeValue('image_title_list', copy);
    };
    // 添加图片跳转链接
    const addImageUrl = (index: number) => {
        setImageIndex(index);
        setTimeout(() => {
            setModalVisible(true);
        }, 200);
    };
    // 删除图片导航数量
    const delateImageNav = (index: number) => {
        const copy = [...image_title_list];
        copy.splice(index, 1);
        handleChangeValue('image_title_list', copy);
    };
    // 文字导航输入
    const inputTextNav = (index: number, name: string) => {
        const copy = [...title_list];
        copy[index] = Object.assign({}, copy[index], { title_name: name });
        handleChangeValue('title_list', copy);
    };
    // 删除文字导航
    const delateTextNav = (index: number) => {
        const copy = [...title_list];
        copy.splice(index, 1);
        handleChangeValue('title_list', copy);
    };
    // 添加文字导航链接
    const addTextUrl = (index: number) => {
        setTextIndex(index);
        setTimeout(() => {
            setModalVisible(true);
        }, 200);
    };
    const changeIndex = (indexStart: number) => {
        const copy = nav_type == 1 ? [...image_title_list] : [...title_list];
        [copy[indexStart], copy[index]] = [copy[index], copy[indexStart]];
        nav_type == 1 ? handleChangeValue('image_title_list', copy) : handleChangeValue('title_list', copy);
    };

    const [, drag] = useDrag(() => ({
        type: 'imageTextNav',
        item: { indexStart: index },
    }));

    const [, drop] = useDrop(
        () => ({
            accept: 'imageTextNav',
            drop(res: any, monitor) {
                const didDrop = monitor.didDrop();
                if (didDrop) return;
                changeIndex(res.indexStart);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                isOverCurrent: monitor.isOver({ shallow: true }),
            }),
        }),
        [nav_type == 1 ? image_title_list : title_list]
    );

    const imageNavRender = () => {
        return (
            <div ref={drop}>
                <div ref={drag} key={index} className="item-wrap item-box-sp item-border">
                    <div>
                        <Upload
                            imageSize={{ type: 4, width: 1, height: 1, sizeText: '导航图片尺寸建议300X300像素或等比例尺寸' }}
                            onChange={(e: any) => uploadImage(e, index)}
                            value={image_title_list[index].url == '' ? [] : [image_title_list[index]]}
                        />
                    </div>
                    <div className="item-col-sp">
                        <Input
                            defaultValue={item.title_name || `导航${numberToText(index + 1)}`}
                            placeholder={`导航${numberToText(index + 1)}（选填）`}
                            allowClear
                            showCount
                            maxLength={5}
                            onChange={(e) => inputImageText(e.target.value, index)}
                        />
                        <div className="add-title" onClick={(e) => addImageUrl(index)}>
                            <div className="show-input-text">
                                {item.link_data.value == 'marketList' ? '同城卖场列表页' : item.link_data.link_url != '' ? item.link_data.link_url : '添加跳转到的页面（选填）'}
                            </div>
                            {showTip()}
                        </div>
                    </div>
                    {image_title_list.length > 3 && (
                        <div style={{ width: 40, marginLeft: 10, marginTop: 50, color: 'rgb(66, 139, 228)' }} onClick={(e) => delateImageNav(index)}>
                            删除
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const textRender = () => {
        return (
            <div ref={drag}>
                <div ref={drop} key={index} className="item-wrap item-border">
                    <Input
                        defaultValue={item.title_name || `导航${numberToText(index + 1)}`}
                        placeholder={`导航${numberToText(index + 1)}`}
                        allowClear
                        showCount
                        maxLength={15}
                        onChange={(e) => inputTextNav(index, e.target.value)}
                    />
                    <Row className="item-box-sp">
                        <div className="add-title" onClick={(e) => addTextUrl(index)}>
                            <div className="show-input-text">
                                {item.link_data.value == 'marketList' ? '同城卖场列表页' : item.link_data.link_url != '' ? item.link_data.link_url : '添加跳转到的页面（选填）'}
                            </div>
                            {showTip()}
                        </div>
                        {title_list.length > 3 && (
                            <div onClick={(e) => delateTextNav(index)} style={{ marginTop: 10, color: 'rgb(66, 139, 228)' }}>
                                删除
                            </div>
                        )}
                    </Row>
                </div>
            </div>
        );
    };
    return nav_type == 1 ? imageNavRender() : textRender();
});

// 提示窗
const showTip = () => {
    return (
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
    );
};

export default ImageTextNav;
