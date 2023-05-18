import { iEditorBlock, iEditorImageDeal } from '@/store/config';
import React from 'react';
import './index.scss';

/**
 * 自定义图片组件渲染
 */
const Render_Image_Deal = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorImageDeal;
    const { imageUrl, imageWidth, rotate, sizeWidth, sizeHeight, posLeft, posTop, cropHeight, cropWidth, imageHeight } = data;

    // 计算图片裁剪
    const computeImage = () => {
        const x = Math.round((posLeft * imageWidth) / 375);
        const y = Math.round((posTop * imageWidth) / 375);
        const w = computeW();
        const h = computeH();
        const useUrl = imageUrl + `?x-oss-process=image/crop,x_${x},y_${y},w_${w},h_${h}`;
        return useUrl;
    };

    // 计算裁剪的宽度
    const computeW = () => {
        if (sizeWidth && sizeWidth != 0) {
            return Math.round(sizeWidth);
        } else {
            if (sizeHeight) {
                if (sizeHeight > imageWidth) {
                    return Math.round(imageWidth);
                } else {
                    return Math.round(sizeHeight);
                }
            } else {
                return Math.round(imageWidth);
            }
        }
    };

    // 计算裁剪的高度
    const computeH = () => {
        if (sizeHeight && sizeHeight != 0) {
            return Math.round(sizeHeight);
        } else {
            if (sizeWidth) {
                if (sizeWidth > imageHeight) {
                    // 大于图片原始高度
                    return Math.round(imageHeight);
                } else {
                    return Math.round(sizeWidth);
                }
            } else {
                return Math.round(imageHeight);
            }
        }
    };

    // 计算渲染高度
    const computeHeight = () => {
        if (rotate == 90 || rotate == 270) {
            return 375;
        } else {
            return cropHeight ? (375 * cropHeight) / cropWidth : 400;
        }
    };
    // 计算渲染宽度
    const computeWidth = () => {
        return 375;
    };
    // 图片渲染
    const imageRender = () => {
        return (
            <div
                style={{
                    overflow: 'hidden',
                    width: 375,
                }}
            >
                <img
                    style={{
                        width: computeWidth(),
                        height: computeHeight(),
                        transform: `rotate(${rotate}deg)`,
                        objectFit: 'fill',
                        verticalAlign: 'middle'
                    }}
                    src={computeImage()}
                />
            </div>
        );
    };
    return <div className="image-deal-box">{imageUrl ? imageRender() : <div style={{ height: 100 }}></div>}</div>;
};

export default React.memo(Render_Image_Deal);
