import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Button, Col, Input, InputNumber, Modal, Radio, Row, Slider, Switch } from 'antd';
import Upload from '../banner/upload';
import React, { useState } from 'react';
import UploadVideo from './uploadVideo';
import { iEditorVideo } from '@/store/config';

/**
 * 视频编辑
 */
const VideoiEditor = ({ data: { id } }: { data: iEditorVideo }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorVideo>({ id });
    const { page_padding, auto_play, cover_type, video_address, video_url, cover_url, input_video } = data;
    const [editModal, setEditModal] = useState(false); // 弹窗展示
    const [whitchModal, setWhitchModal] = useState('video'); // 判断是那种类型
    const [inputValue, setInputValue] = useState(input_video); // 输入视频地址的链接
    const [catchVideoUrl, setCatchVideoUrl] = useState(video_url); // 上传视频的链接本地缓存
    const [catchCoverImg, setCatchCoverImg] = useState(cover_url); // 封面图片的本地缓存

    // 上传弹窗的 确定
    const handleOk = () => {
        setEditModal(false);
    };

    //  上传弹窗的 取消
    const handleCancel = () => {
        setEditModal(false);
        if (whitchModal == 'image') {
            imageUpload(catchCoverImg == '' ? [] : [{ url: catchCoverImg }]);
        } else {
            videoUpload(video_url == '' ? [] : [{ file: video_url }]);
        }
    };

    // 视频链接类型
    const selectVideoType = (type: string) => {
        handleChangeValue('video_address', type);
        if (type == 'link') {
            selectImageType('select');
        } else {
            selectImageType('default');
        }
    };

    // 上传图片
    const imageUpload = (value: any) => {
        const isClean = value.length == 0;
        const url = isClean ? '' : value[0].url;
        setCatchCoverImg(cover_url); // 缓存上次的图片
        handleChangeValue('cover_url', url);
    };

    // 上传视频
    const videoUpload = (value: any) => {
        const isClean = value.length == 0;
        const url = isClean ? '' : value[0].file;
        const urlImage = isClean ? '' : value[0].url;
        handleChangeValue('cover_url', urlImage);
        setCatchCoverImg(urlImage); // 缓存上次的图片
        setCatchVideoUrl(video_url); // 缓存视频的数据
        handleChangeValue('video_url', url);
    };

    // 封面类型
    const selectImageType = (type: string) => {
        handleChangeValue('cover_type', type);
    };

    // 页面边距
    const onChangeSilderPadding = (value: number | null) => {
        handleChangeValue('page_padding', value || 0);
    };

    // 自动播放
    const onChangeSwitch = (value: boolean) => {
        handleChangeValue('auto_play', value);
    };

    // 弹框
    const modalTap = (type: string) => {
        setWhitchModal(type);
        setEditModal(true);
    };

    // 输入地址确认
    const sureInput = () => {
        handleChangeValue('input_video', inputValue);
    };

    // 输入框数据变化
    const handleInput = (value: string) => {
        setInputValue(value);
        if (value == '') {
            handleChangeValue('input_video', '');
        }
    };

    const textColor = { color: '#999' };

    return (
        <>
            <div className="editor-module-wrap">
                <div className="item-sp-market">
                    <span style={textColor}>视频</span>
                    <div>
                        <Radio.Group defaultValue={video_address} buttonStyle="solid">
                            <Radio.Button onChange={(e) => selectVideoType('upload')} value="upload">
                                上传视频
                            </Radio.Button>
                            <Radio.Button onChange={(e) => selectVideoType('link')} value="link">
                                视频地址
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                {video_address == 'upload' ? (
                    <div className="item-wrap">
                        <div onClick={(e) => modalTap('video')} className="add-video-box">
                            <span style={{ fontSize: 14, color: '#4677D5' }}>{video_url != '' ? '更新' : '+'}</span>
                        </div>
                        <span style={textColor}>建议上传清晰度在720P以上的视频</span>
                    </div>
                ) : (
                    <div className="margin-top-dis">
                        <Input.Group style={{ marginTop: 40 }}>
                            <Input style={{ width: 292 }} value={inputValue} placeholder="请输入视频地址" allowClear onChange={(e) => handleInput(e.target.value)} />
                            <Button type="primary" onClick={sureInput}>
                                确定
                            </Button>
                        </Input.Group>
                        <span style={{ color: 'red', lineHeight: 4 }}>(仅支持MP4格式视频，点击确认才能生效)</span>
                    </div>
                )}
                <div className="item-sp-market margin-top-dis">
                    <span style={textColor}>封面</span>
                    {video_address != 'link' && (
                        <div>
                            <Radio.Group value={cover_type} buttonStyle="solid">
                                <Radio.Button onChange={(e) => selectImageType('default')} value="default">
                                    默认
                                </Radio.Button>
                                <Radio.Button onChange={(e) => selectImageType('select')} value="select">
                                    选择图片
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    )}
                </div>
                <div className="item-wrap">
                    <div className="image-box-video">
                        <video
                            // 封面图 视频链接 自动播放变化的时候都更新
                            key={cover_url + video_url + input_video + auto_play + '1'}
                            className="image-box-video"
                            autoPlay={auto_play}
                            controls
                            muted={true}
                            poster={cover_url != '' ? cover_url : ''}
                            src={video_address == 'upload' ? video_url : input_video}
                            preload="metadata"
                        ></video>
                    </div>
                    {cover_type == 'select' && (
                        <Row>
                            <div onClick={(e) => modalTap('image')} className="add-video-box" style={{ width: 300 }}>
                                {cover_url == '' ? <span>+</span> : <img className="cover-image-bg" src={cover_url} />}
                                <div className="change-image-style">
                                    <img className="image-change" src="/image/change-video-bg.png" />
                                </div>
                            </div>
                            <div style={textColor}>建议图片宽高比例与视频宽高比例一致</div>
                        </Row>
                    )}
                </div>
                <div className="item-sp-ev" style={{ padding: '10px 0' }}>
                    <Row>
                        <span style={textColor}>自动播放</span>
                        <span style={{ marginLeft: 20 }}>{auto_play ? '已开启' : '已关闭'}</span>
                    </Row>
                    <Switch checked={auto_play} onChange={onChangeSwitch} />
                </div>
                <div style={textColor}>小程序暂不支持视频自动播放</div>

                <div className="item-center-spw" style={{ padding: '20px 0' }}>
                    <span>页面边距</span>
                    <Slider style={{ width: 140 }} min={0} max={30} onChange={onChangeSilderPadding} value={page_padding} />
                    <InputNumber size="middle" min={0} max={30} step={1} value={page_padding} onChange={onChangeSilderPadding} />
                </div>
            </div>
            <Modal width={800} title={whitchModal == 'video' ? '上传视频' : '上传封面'} visible={editModal} onOk={handleOk} onCancel={handleCancel}>
                {whitchModal == 'video' ? (
                    <Row>
                        <span>本地视频:</span>
                        <Col style={{ marginLeft: 10, marginBottom: 30 }}>
                            <UploadVideo onChange={videoUpload} value={video_url != '' ? [{ url: video_url, uid: '1' }] : []} />
                            <div>视频大小不超过200MB,建议时长五分钟以内，支持上传16:9/9:16/3:4寸尺视频，支持视频文件类型：mp4</div>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <span>视频封面:</span>
                        <Col style={{ marginLeft: 10, marginBottom: 30, maxWidth: 600 }}>
                            <Upload imageType=".png,.gif,.bmp,.jpg,.jpeg,.webp" onChange={imageUpload} value={cover_url != '' ? [{ url: cover_url }] : []} />
                            <div>建议图片宽高比例与视频宽高比例一致，支持jpg,gif,png,bmp,webp 大小不超过10M。 如果不添加封面，系统会默认截取视频的第一个画面作为封面</div>
                        </Col>
                    </Row>
                )}
            </Modal>
        </>
    );
};

export default VideoiEditor;
