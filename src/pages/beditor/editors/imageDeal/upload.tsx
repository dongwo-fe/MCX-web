import { message, Modal, notification, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
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
export default function uploadImage ({ onChange, value, imageSize, fileSize, imageType }: { onChange: (obj) => void; value: Array<any>; imageSize?: any; fileSize?: number; imageType?: string }) {
    const [fileList, setFileList] = useState(value);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState();
    const [previewTitle, setPreviewTitle] = useState('');
    useEffect(() => {
        setFileList(value);
    }, [value]);

    const handleChange = (data: any) => {
        if (data.file && data.file.status === 'done') {
            setFileList(data.fileList);
        }
    };

    const handleRemove = () => {
        onChange && onChange([]);
    };
    const handleCustomRequest = async (e: any) => {
        try {
            const imgData: any = await IMGCLIENT.upload(e.file);
            const wh: any = await getImgWH(imgData.url);
            const { key, uid, url } = imgData;
            e.onSuccess({
                name: key,
                status: 'done',
                url: url,
                thumbUrl: url,
                imageHeight: wh.h,
                imageWidth: wh.w,
                uid: uid,
            });

            onChange &&
                onChange([
                    {
                        name: key,
                        status: 'done',
                        url: url,
                        thumbUrl: url,
                        imageHeight: wh.h,
                        imageWidth: wh.w,
                        imageUid: uid,
                    },
                ]);
        } catch (error) {
            e.onError(error);
        }
    };
    // 上传校验
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
                };
            };
        });
    };
    // 获取图片宽高
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
        const commonSize = 2000 * 1024;
        if (commonSize < file.size) {
            message.warning('文件大小超出限制！');
            return false;
        }
        //没有设置图片尺寸直接放行 没有设置提示语句不检测
        if (!target || !target.sizeText) {
            return true;
        }
        const res = await checkImageFileWH(file, target);
        return res;
    };
    return (
        <>
            <Upload
                listType="picture-card"
                accept="image/*"
                fileList={fileList}
                beforeUpload={handleBeforeUpload as any}
                onChange={handleChange}
                onPreview={handlePreview}
                onRemove={handleRemove}
                customRequest={handleCustomRequest}
            >
                {fileList.length < 1 && '+ 上传'}
            </Upload>
            <Modal visible={previewVisible} title={'预览图片'} footer={null} onCancel={handleCancel}>
                <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}
