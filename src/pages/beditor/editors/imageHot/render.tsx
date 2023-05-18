import { iEditorBlock, iEditorImageHot } from '@/store/config';
import React from 'react';
import './index.scss';

/**
 * 热区图渲染
 */
const Render_Image_Hot = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorImageHot;
    const { page_padding, image_url, links, image_height } = data;

    const emptyRender = () => {
        return (
            <div className="empty_image_box" style={{ height: 300 }}>
                <img className="empty_module_image" src="/image/image_hot_empty_bg.png" />
            </div>
        );
    };

    const width = (item: any) => {
        if (item.width == '100px' || !item.width) {
            return '100px';
        } else {
            return item.width;
        }
    };

    const heightLink = (item: any) => {
        if (item.height == '100px' || !item.height) {
            return '100px';
        } else {
            return item.height;
        }
    };

    const left = (item: any) => {
        if (!item.x) {
            return 0;
        } else {
            return item.x + 'px';
        }
    };

    const top = (item: any) => {
        if (!item.y) {
            return 0;
        }
        return item.y + 'px';
    };

    return (
        <div className="module_image_box" style={{ paddingLeft: page_padding, paddingRight: page_padding, height: 'auto' }}>
            {image_url == '' ? (
                emptyRender()
            ) : (
                <>
                    <img className="module_image" src={image_url} alt="" />
                    {links.map((item, index) => {
                        return (
                            <div
                                key={index}
                                style={{ position: 'absolute', left: left(item), top: top(item), width: width(item), height: heightLink(item), backgroundColor: '#f002' }}
                            ></div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default React.memo(Render_Image_Hot);
