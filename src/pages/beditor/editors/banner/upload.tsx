import { message, Modal, notification, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import IMGCLIENT from '@/utils/imgOss';
const { Dragger } = Upload;

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

interface iImageTarget {
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6; //0 限制宽 1 限制高 2 限制宽和高 3 不校验 4 比例 5 图片高度大于宽的3倍 6 比例有5像素的误差
    width: number;
    height: number;
    sizeText: string;
}
export default function upload({
    onChange,
    value,
    fromBase,
    imageSize,
    fileSize,
    imageType,
}: {
    onChange: any;
    value: Array<any>;
    fromBase?: string;
    imageSize?: any;
    fileSize?: number;
    imageType?: string;
}) {
    const [fileList, setFileList] = useState(value);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState();
    const [previewTitle, setPreviewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setFileList(value);
    }, [value]);

    const handleChange = (data: any) => {
        if (data.file && data.file.status === 'done') {
            setFileList(data.fileList);
        }
    };

    const handleRemove = () => {
        // setShareData({ img: '' });
        onChange && onChange([]);
    };
    const handleCustomRequest = async (e: any) => {
        setLoading(true);
        try {
            const imgData: any = await IMGCLIENT.upload(e.file);
            const wh: any = await getImgWH(imgData.url);
            const height = Math.round((wh.h / wh.w) * 375);
            const { downloadUrl, key, uid, url } = imgData;
            e.onSuccess({
                name: key,
                status: 'done',
                url: url,
                thumbUrl: url,
                height: height,
            });

            onChange &&
                onChange([
                    {
                        name: key,
                        status: 'done',
                        url: url,
                        thumbUrl: url,
                        height: height,
                    },
                ]);
            // setShareData({ img: url });
        } catch (error) {
            e.onError(error);
        } finally {
            setLoading(false);
        }
    };
    const checkImageFileWH = (file: any, target: iImageTarget) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const image: any = new Image();
                image.src = reader.result;
                image.onload = () => {
                    if (target.type === 0 && target.width === image.width) {
                        // 限制宽
                        resolve(true);
                    } else if (target.type === 1 && target.height === image.height) {
                        //限制高
                        resolve(true);
                    } else if (
                        //宽和高一致
                        target.type === 2 &&
                        target.width === image.width &&
                        target.height === image.height
                    ) {
                        resolve(true);
                    } else if (target.type === 3) {
                        //不判断
                        resolve(true);
                    } else if (
                        //比例
                        target.type === 4 &&
                        target.width * image.height === image.width * target.height
                    ) {
                        resolve(true);
                    } else if (
                        //图片高度小于宽的3倍
                        target.type === 5 &&
                        target.width * image.height <= image.width * target.height
                    ) {
                        resolve(true);
                    } else if (
                        // 比例有误差范围[-5, 5]
                        target.type === 6 &&
                        target.width * image.height - image.width * target.height >= -5 &&
                        target.width * image.height - image.width * target.height <= 5
                    ) {
                        resolve(true);
                    } else {
                        notification.open({
                            message: '上传图片尺寸不对',
                            description: target.sizeText,
                            icon: <ExclamationCircleOutlined style={{ color: '#F00' }} />,
                            placement: 'top',
                        });
                        reject(false);
                    }
                    //  console.log('beforeUpload img= ',image.width,image.height); //文件像素大小
                };
            };
        });
    };
    function getImgWH(url: string) {
        const img = new Image();
        return new Promise((resolve, reject) => {
            img.src = url;
            img.onload = () => {
                resolve({ w: img.width, h: img.height });
            };
            img.onerror = function (e) {
                reject(e);
            };
        });
    }
    const handleCancel = () => {
        setPreviewVisible(false);
    };
    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleBeforeUpload = async (file: RcFile) => {
        const target = imageSize;
        // 限制图片大小
        const commonSize = fileSize ? fileSize : 10000 * 1024;
        if (commonSize < file.size) {
            message.warning('文件大小超出限制！');
            return false;
        }
        // {
        //   type: 0, // 0 检查宽 1 检查高 2 检查宽和高 3 宽高不限 4 比例
        //   sizeText: "建议尺寸：750*1624px，格式限制：png、jpg、jpeg",
        //   width: 750,
        //   height: 1624,
        // };
        //没有设置图片尺寸直接放行 没有设置提示语句不检测
        if (!target || !target.sizeText) {
            return true;
        }
        const res = await checkImageFileWH(file, target);

        return res;
    };
    const acceptType = imageType ? imageType : '.png,.jpeg,.jpg,.bmp'; // image/*
    return fromBase == 'imageHot' ? (
        <Dragger
            beforeUpload={handleBeforeUpload as any}
            onRemove={handleRemove}
            accept={acceptType}
            fileList={fileList}
            onChange={handleChange}
            maxCount={1}
            customRequest={handleCustomRequest}
        >
            {loading ? (
                <>
                    <LoadingOutlined />
                    <div className="add-image-title">{'图片上传中...'}</div>
                </>
            ) : fileList.length < 1 ? (
                <>
                    <div className="add-tag">+</div>
                    <div className="add-image-title">添加热区图广告图片</div>
                </>
            ) : (
                <div>
                    {fileList.length > 0 && fileList[0].response && (
                        <img className="image-contain-box" style={{ maxHeight: 'auto', objectFit: 'cover' }} src={fileList[0].response.url} />
                    )}
                </div>
            )}
        </Dragger>
    ) : (
        <>
            <Upload
                listType="picture-card"
                accept={acceptType}
                fileList={fileList}
                beforeUpload={handleBeforeUpload as any}
                onChange={handleChange}
                onPreview={handlePreview}
                onRemove={handleRemove}
                customRequest={handleCustomRequest}
            >
                {fileList.length < 1 && '+ 上传'}
            </Upload>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}
