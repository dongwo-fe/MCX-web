import { iEditorBlock, iEditorBanner } from '@/store/config';
import { Carousel } from 'antd';
import React from 'react';
import './index.scss';

const Render_Banner = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorBanner;
    const { imgList, page_padding, size_type } = data || {};

    // 自定义比例的时候高度依据第一张图片
    const customizeHeight = () => {
        if (imgList.length > 0 && imgList[0].image_height != 0) {
            return imgList[0].image_height;
        }
        return 300;
    };

    // 模块高度
    const imageHeight = () => {
        switch (size_type) {
            case 'four_three': // 4:3的比例
                return 562 / 2;
            case 'three_four': // 3:4的比例
                return 1000 / 2;
            case 'three_one': // 3:1的比例
                return 250 / 2;
            case 'customize': // 自定义比例
                return customizeHeight();
            default:
                return 300;
        }
    };

    // 空状态渲染
    const empty = (
        <div className="no-image-box" style={{ paddingLeft: page_padding, paddingRight: page_padding, height: imageHeight() - page_padding * 2 }}>
            <img alt="" src="/image/swiper_banner_bg.png" className="default_img" />
            <div className="edit-title">点击编辑图片广告</div>
        </div>
    );

    const width = 375 - page_padding * 2;
    const height = imageHeight() - page_padding * 2;
    return (
        <div className="render-banner-box" style={{ paddingLeft: page_padding, paddingRight: page_padding, height: imageHeight() - page_padding * 2 }}>
            <Carousel autoplay={true}>
                {imgList &&
                    imgList.map((item: any, index: number) => {
                        return item.url ? (
                            <div key={index}>
                                <img className="show-banner-img" style={{ width: width, height: height }} src={item.url} />
                            </div>
                        ) : (
                            <div key={index} style={{ height: imageHeight() - page_padding * 2 }} className="diff-context-center">
                                {empty}
                            </div>
                        );
                    })}
            </Carousel>
        </div>
    );
};
export default React.memo(Render_Banner);
