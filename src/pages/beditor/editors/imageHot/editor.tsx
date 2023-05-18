import { iEditorImageHot } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import React, { useState } from 'react';
import { InputNumber, Modal, Slider } from 'antd';
// import Upload from './imageUpload';
import { Rnd } from 'react-rnd';
import EditorModal from '../banner/editorModal';
import Upload from '../banner/upload';

/**
 * 热区图编辑
 */
const ImageHotiEditor = ({ data: { id } }: { data: iEditorImageHot }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorImageHot>({ id });
    const { links, image_url, image_height } = data;
    // 增加热区弹窗
    const [editModal, setEditModal] = useState(false);
    // 增加链接弹窗弹窗
    const [modalVisible, setModalVisible] = useState(false);
    // 链接相关数据
    const [linkList, setLinkList] = useState(links);
    // 记录当前编辑的index
    const [currentEditIndex, setCurrentEditIndex] = useState(0);

    // 图片更新
    const uploadImage = (value: any) => {
        if (value.length == 0) {
            setLinkList([]);
            handleChangeValue('image_url', '');
            handleChangeValue('image_height', '');
            handleChangeValue('links', []);
        } else {
            handleChangeValue('image_url', value[0].url);
            handleChangeValue('image_height', value[0].height);
        }
    };

    // 修改页面边距
    const onChangeSilderPadding = (value: number | null) => {
        handleChangeValue('page_padding', value || 0);
    };

    // 编辑热区图
    const editImageHot = () => {
        setEditModal(true);
    };

    // 增加热区图
    const addEditHotList = () => {
        const copyLink: any = [...linkList];
        copyLink.push({ link_url: '', value: '' });
        setLinkList(copyLink);
    };

    // 增加跳转链接
    const addPushUrl = (index: number) => {
        setCurrentEditIndex(index);
        setModalVisible(true);
    };

    // 删除热区
    const delateUrl = (index: number) => {
        const copyLink: any = [...linkList];
        copyLink.splice(index, 1);
        setLinkList(copyLink);
    };

    // 链接弹窗的取消
    const onCancel = () => {
        setModalVisible(false);
    };

    // 链接弹窗的确定
    const onSave = (item: any) => {
        setModalVisible(false);
        const copy = [...linkList];
        copy[currentEditIndex] = Object.assign({}, copy[currentEditIndex], { link_url: item.link_url, value: item.value });
        setLinkList(copy);
    };

    // 确定
    const handleEditOk = () => {
        setEditModal(false);
        handleChangeValue('links', linkList);
        console.log('%c [ linkList ]-86', 'font-size:13px; background:pink; color:#bf2c9f;', linkList);
    };

    // 取消
    const handleEditCancel = () => {
        setLinkList(links);
        setEditModal(false);
    };

    // 热区结束调整大小的回调
    const handleOnResizeStop = (index: number, e: any, direction: any, ref: any, delta: any, position: any) => {
        const copy = [...linkList];
        copy[index] = Object.assign({}, copy[index], { width: ref.style.width, height: ref.style.height }, position);
        setLinkList(copy);
    };

    // 热区结束拖拽的回调
    const handleOnDragStop = (e: any, d: any, index: number) => {
        const copy = [...linkList];
        copy[index] = Object.assign({}, copy[index], { x: d.x, y: d.y });
        setLinkList(copy);
    };

    return (
        <>
            <div className="new-contain-box">
                <div >
                    <Upload
                        fromBase={'imageHot'}
                        imageSize={{ type: 5, width: 1, height: 3, sizeText: '图片高度不可大于宽的3倍，请检查图片尺寸后重新上传' }}
                        onChange={uploadImage}
                        value={image_url == '' ? [] : [{ response: { url: image_url }, uid: 'upload' }]}
                    />
                </div>
                <div className="item-wrap" >
                    <div onClick={editImageHot} className="add-nav-box diff-height">
                        <div style={{ color: 'rgb(66, 139, 228)' }}>编辑热区</div>
                    </div>
                </div>
                <div className="item-image-hot-padding">
                    <span>页面边距</span>
                    <Slider style={{ width: 140 }} min={0} max={30} onChange={onChangeSilderPadding} value={data.page_padding} />
                    <InputNumber size="middle" min={0} max={30} step={1} value={data.page_padding} onChange={onChangeSilderPadding} />
                </div>
            </div>
            <Modal
                width={900}
                bodyStyle={{
                    height: '60vh',
                }}
                title="编辑热区"
                visible={editModal}
                closable={false}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                destroyOnClose={true}
                maskClosable={false}
            >
                <div className="edit-modal-contain">
                    <div className="edit-modal-box">
                        <div style={{ position: 'relative', paddingLeft: data.page_padding, paddingRight: data.page_padding, height: 'auto' }}>
                            {image_url != '' && <img className="image-contain-box" src={image_url} alt="" />}
                            {linkList.map((item, index) => (
                                <Rnd
                                    onDragStop={(e: any, d: any) => handleOnDragStop(e, d, index)}
                                    onResizeStop={(e, direction, ref, delta, position) => handleOnResizeStop(index, e, direction, ref, delta, position)}
                                    key={index}
                                    default={{ x: item.x || 0, y: item.y || 0, width: item.width || 100, height: item.height || 100 }}
                                    bounds={'.edit-modal-box'}
                                    style={{ backgroundColor: '#FF09' }}
                                >
                                    第{index + 1}个区域
                                </Rnd>
                            ))}
                        </div>
                    </div>
                    <div className="add-edit-setting" style={{ width: 420 }}>
                        <span>热区设置</span>
                        <span style={{ color: '#999' }}>最多可添加10个热区</span>
                        {linkList.map((item, index) => {
                            return (
                                <div key={index} className="hot-list-item">
                                    <span>热区{index + 1}：</span>
                                    <div className="show-input-text" onClick={(e) => addPushUrl(index)}>
                                        {item.value == 'marketList' ? '同城卖场列表页' : item.link_url != '' ? item.link_url : '添加跳转链接'}
                                    </div>
                                    <span onClick={(e) => delateUrl(index)} style={{ color: '#444' }}>
                                        删除
                                    </span>
                                </div>
                            );
                        })}
                        {linkList.length <= 9 && (
                            <div className="item-wrap">
                                <div onClick={addEditHotList} className="add-nav-box diff-height">
                                    <div style={{ color: 'rgb(66, 139, 228)' }}>+添加新热区</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
            <EditorModal key={modalVisible} item={linkList[currentEditIndex] || { link_url: '', value: '' }} onCancel={onCancel} onSave={onSave} visible={modalVisible} />
        </>
    );
};

export default ImageHotiEditor;
