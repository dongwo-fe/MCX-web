import { message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { RcFile } from 'antd/lib/upload';
import IMGCLIENT from '@/utils/imgOss';

export default function uploadVideo({ onChange, value }: any) {
    const [fileList, setFileList] = useState(value);
    useEffect(() => {
        const fileList = value.map((item: any) => {
            return {
                ...item,
                url: item.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0',
            };
        });
        setFileList(fileList);
    }, [value]);
    const handleRemove = () => {
        onChange && onChange([]);
    };

    const handleBeforeUpload = async (file: RcFile) => {
        // 视频类型
        const [, fileType] = file.type.split('/');
        //文件类型判断
        const typeCorrect = ['mp4'].includes(fileType.toLocaleLowerCase());
        if (!typeCorrect) {
            message.error('仅支持mp4视频类型');
            return false;
        }
        // 视频大小
        const size = file.size / (1024 * 1024);
        if (size > 200) {
            message.error('文件大小不得大于200M!');
            return false;
        }

        return true;
    };
    const handleCustomRequest = async (value: any) => {
        try {
            // 尺寸比例的限制 暂无
            const imgData: any = await IMGCLIENT.upload(value.file);
            const { key, url } = imgData;
            const thumbUrl = url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0';
            value.onSuccess({
                name: key,
                status: 'done',
                url: thumbUrl,
                file: url,
            });
            onChange &&
                onChange([
                    {
                        name: key,
                        status: 'done',
                        url: thumbUrl,
                        file: url,
                    },
                ]);
        } catch (error) {
            value.onError(error);
        }
    };
    return (
        <Upload listType="picture-card" beforeUpload={handleBeforeUpload as any} accept="video/*" fileList={fileList} onRemove={handleRemove} customRequest={handleCustomRequest}>
            {fileList.length < 1 && '+ 上传'}
        </Upload>
    );
}
