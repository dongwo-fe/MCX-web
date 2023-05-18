import { iEditorImageDeal } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { InputNumber, message, Radio, Space, Tooltip } from 'antd';
import { Rnd } from 'react-rnd';
import Upload from './upload';
import EditorModal from '../banner/editorModal';
import React, { useState } from 'react';

/**
 * 自定义图片编辑
 */
const ImageDealiEditor = ({ data: { id } }: { data: iEditorImageDeal }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorImageDeal>({ id });
    const { imageUrl, imageWidth, imageHeight, rotate, sizeWidth, sizeHeight, posLeft, posTop, cropWidth, cropHeight, linkData } = data;
    // 旋转角度数据
    const rotatedata = [{ value: 0 }, { value: 90 }, { value: 180 }, { value: 270 }];
    // 链接弹窗
    const [modalVisible, setModalVisible] = useState(false);

    // 添加链接
    const addPushUrl = () => {
        setModalVisible(true);
    };

    // 取消链接弹窗
    const onCancel = () => {
        setModalVisible(false);
    };

    // 保存弹窗链接
    const onSave = (item: any) => {
        setModalVisible(false);
        handleChangeValue('linkData', item); // 裁剪区域的高度
    };

    // 上传图片
    const uploadImage = (value: any) => {
        if (value.length > 0) {
            const imageData = value[0];
            handleChangeValue('imageUrl', imageData.url);
            handleChangeValue('imageWidth', imageData.imageWidth); // 原始图片宽度
            handleChangeValue('imageHeight', imageData.imageHeight); // 原始图片高度
            handleChangeValue('cropWidth', 375); // 裁剪区域的宽度
            handleChangeValue('cropHeight', (375 * imageData.imageHeight) / imageData.imageWidth); // 裁剪区域的高度
        } else {
            handleChangeValue('posLeft', 0);
            handleChangeValue('posTop', 0);
            handleChangeValue('imageWidth', 0);
            handleChangeValue('imageHeight', 0);
            handleChangeValue('imageUrl', '');
            handleChangeValue('sizeWidth', 0);
            handleChangeValue('sizeHeight', 0);
            handleChangeValue('cropWidth', 375); // 裁剪区域的宽度
            handleChangeValue('cropHeight', 402); // 裁剪区域的高度
            handleChangeValue('rotate', 0); // 裁剪区域的宽度
        }
    };

    // init 编辑初始化图片的高度展示
    const initImageHeight = () => {
        if (imageWidth != 0) {
            return (imageHeight * 375) / imageWidth - 2;
        }
        return 400; // 默认 400
    };

    // 选择旋转角度
    const handleChangeRotate = (e: any) => {
        handleChangeValue('rotate', e.target.value);
    };

    let timerWidth: any = null;
    async function debounceWidth(value: number | null) {
        if (timerWidth) {
            clearTimeout(timerWidth);
        }
        timerWidth = setTimeout(async () => {
            handleImageWidth(value || 0);
        }, 500);
    }

    let timerHeight: any = null;
    async function debounceHeight(value: number | null) {
        if (timerHeight) {
            clearTimeout(timerHeight);
        }
        timerHeight = setTimeout(async () => {
            handleImageHeight(value || 0);
        }, 500);
    }

    // 修改宽度
    const handleImageWidth = (value: number) => {
        handleChangeValue('sizeWidth', value);
        handleChangeValue('posLeft', 0);
        // 如果输入了0 或者是清空宽度
        if (value == 0 || value == null) {
            // 距离左边为0
            if (sizeHeight == null || sizeHeight == 0) {
                // 高度 不存在 此时宽高都不存在
                handleChangeValue('cropWidth', 375);
                handleChangeValue('cropHeight', (375 * imageHeight) / imageWidth);
            } else {
                // 仅宽度不存在 -- 高度存在
                const width = cropHeight > 375 ? 375 : cropHeight;
                handleChangeValue('cropWidth', width);
            }
        } else {
            if (value > imageWidth) {
                message.error('输入宽度不能大于图片原始宽度');
                handleChangeValue('cropWidth', 375);
                handleChangeValue('sizeWidth', imageWidth);
            } else {
                handleChangeValue('cropWidth', (value / imageWidth) * 375);
                handleChangeValue('sizeWidth', value);
            }
            if (sizeHeight == null || sizeHeight == 0) {
                handleChangeValue('cropHeight', (value / imageWidth) * 375);
                // handleChangeValue('sizeHeight', value > imageHeight ? imageHeight : value);
            }
        }
    };

    // 修改高度
    const handleImageHeight = (value: number) => {
        handleChangeValue('sizeHeight', value);
        handleChangeValue('posTop', 0);
        // 如果输入了0 或者是清空高度
        if (value == 0 || value == null) {
            // 距离顶部为0
            if (sizeWidth == null || sizeWidth == 0) {
                // 宽度 不存在 此时宽高都不存在
                handleChangeValue('cropWidth', 375);
                handleChangeValue('cropHeight', (375 * imageHeight) / imageWidth);
            } else {
                // 仅高度不存在 宽度存在
                const newHeight = cropWidth > (375 * imageHeight) / imageWidth ? (375 * imageHeight) / imageWidth : cropWidth;
                handleChangeValue('cropHeight', newHeight);
            }
        } else {
            if (value > imageHeight) {
                message.error('输入高度不能大于图片原始高度');
                handleChangeValue('cropHeight', (imageHeight / imageWidth) * 375);
                handleChangeValue('sizeHeight', imageHeight);
            } else {
                handleChangeValue('cropHeight', (value / imageWidth) * 375);
                handleChangeValue('sizeHeight', value);
            }
            if (sizeWidth == null || sizeWidth == 0) {
                handleChangeValue('cropWidth', (value / imageWidth) * 375 > 375 ? 375 : (value / imageWidth) * 375);
                // handleChangeValue('sizeWidth', value > imageWidth ? imageWidth : value);
            }
        }
    };
    // 图片拖动
    const handleOnDragStop = (e: any, d: any) => {
        handleChangeValue('posLeft', Math.round(d.x));
        handleChangeValue('posTop', Math.round(d.y));
    };

    // 图片拉伸
    const handleOnResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
        handleChangeValue('posTop', position.y);
        handleChangeValue('posLeft', position.x);
        const width = ref.style.width.split('px')[0];
        const height = ref.style.height.split('px')[0];
        handleChangeValue('sizeWidth', width * (imageWidth / 375) >= imageWidth ? imageWidth : Math.round(width * (imageWidth / 375)));
        handleChangeValue('sizeHeight', height * (imageWidth / 375) >= imageHeight ? imageHeight : Math.round(height * (imageWidth / 375)));
        handleChangeValue('cropWidth', Number(width));
        handleChangeValue('cropHeight', Number(height));
    };

    // 裁剪区域大小
    const cropPartHeight = () => {
        return cropHeight == 0 ? 402 : cropHeight;
    };

    // 裁剪区域大小
    const cropPartWidth = () => {
        return cropWidth == 0 ? 375 : cropWidth;
    };

    return (
        <>
            <div className="edit-image-deal-box">
                <span>上传图片：</span>
                <div className="up-context">
                    <div>
                        <Upload onChange={uploadImage} value={imageUrl != '' ? [{ url: imageUrl, uid: '1' }] : []} />
                    </div>
                    <div onClick={(e) => addPushUrl()} className="show-input-text">
                        {linkData.value == 'marketList' ? '同城卖场列表页' : linkData.link_url != '' ? linkData.link_url : '添加跳转页面(选填)+'}
                    </div>
                </div>
                <div className="margin-top-dis">
                    <div className="margin-top-dis">
                        <span>图片旋转角度：</span>
                        <div className="box-change-rotate">
                            <Radio.Group onChange={(e) => handleChangeRotate(e)} defaultValue={rotate} buttonStyle="solid">
                                {rotatedata.map((item: any, index: number) => {
                                    return (
                                        <Space key={index} style={{ marginRight: 20 }}>
                                            <Radio.Button className="select-item" value={item.value}>
                                                {item.value}
                                            </Radio.Button>
                                        </Space>
                                    );
                                })}
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="margin-top-dis">
                        <span>修改图片寸尺：</span>
                        <div className="box-change-image">
                            <div>
                                <span>宽: </span>
                                <InputNumber defaultValue={sizeWidth} value={sizeWidth} onChange={(e) => debounceWidth(e || 0)} min={0} />
                            </div>
                            <div>
                                <span>高: </span>
                                <InputNumber defaultValue={sizeHeight} value={sizeHeight} onChange={(e) => debounceHeight(e || 0)} min={0} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="image-show-box" style={{ height: initImageHeight() }}>
                    <img
                        style={{
                            objectFit: 'fill',
                            width: '375',
                            height: initImageHeight(),
                            display: 'flex',
                        }}
                        src={imageUrl}
                    />
                    <Rnd
                        key={cropHeight + cropWidth + '' + posLeft + posTop}
                        onDragStop={(e: any, d: any) => handleOnDragStop(e, d)}
                        onResizeStop={(e, direction, ref, delta, position) => handleOnResizeStop(e, direction, ref, delta, position)}
                        default={{ x: posLeft || 0, y: posTop || 0, width: cropPartWidth(), height: cropPartHeight() }}
                        bounds={'.image-show-box'}
                        style={{
                            backgroundColor: '#999',
                            opacity: 0.5,
                            border: 'solid 1px red',
                            boxSizing: 'content-box',
                        }}
                    ></Rnd>
                    {imageWidth != 0 && (
                        <div className="image-box-size">
                            原图{imageWidth}X{imageHeight}
                        </div>
                    )}
                </div>
            </div>
            <EditorModal key={modalVisible} item={linkData} onCancel={onCancel} onSave={onSave} visible={modalVisible} />
        </>
    );
};

export default ImageDealiEditor;
