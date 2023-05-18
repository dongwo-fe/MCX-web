import { iEditorBlock, iEditorGraphical } from '@/store/config';
import { numberToText } from '@/utils/tools';
import React from 'react';
import './index.scss';

const Render_Image_Text_Nav = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorGraphical;
    const { nav_type, image_title_list, title_list, title_color, box_color } = data || {};
    // const textList = ['导航一', '导航二', '导航三', '导航四'];
    const isImageNav = nav_type == 1;

    const height = isImageNav ? '102px' : '46px';

    const dealImageWidth = () => {
        if (image_title_list.length == 3) {
            return '58px';
        } else if (image_title_list.length > 3) {
            return '50px';
        } else {
            return '50px';
        }
    };

    // 文字导航无数据渲染
    const emptyTitleRender = () => {
        return (
            <div className="empty-title-box">
                {title_list.map((item, index) => {
                    return (
                        <div key={index} className="empty-font-style">
                            {`导航${numberToText(index + 1)}`}
                        </div>
                    );
                })}
            </div>
        );
    };
    // 图文导航无数据渲染
    const emptyImageTitleRender = () => {
        return (
            <div className="empty-title-box" style={{ justifyContent: image_title_list.length <= 2 ? 'space-evenly' : 'space-between' }}>
                {image_title_list.map((item, index) => {
                    return (
                        <div key={index} className="image-box-nav">
                            <img className="image-box-empty" style={{ width: dealImageWidth(), height: dealImageWidth() }} src="/image/image_nav_empty.png" />
                            <div key={index} className="empty-font-style" style={{ marginTop: '12px' }}>
                                {`导航${numberToText(index + 1)}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    if (isImageNav && image_title_list.isEmpty('url') && image_title_list.isEmpty('title_name')) {
        return (
            <div className="render-image-text-nav" style={{ height: height, backgroundColor: box_color }}>
                {emptyImageTitleRender()}
            </div>
        );
    }
    if (!isImageNav && title_list.isEmpty('title_name')) {
        return (
            <div className="render-image-text-nav" style={{ height: height, backgroundColor: box_color }}>
                {emptyTitleRender()}
            </div>
        );
    }

    // 图文
    const itemImageRender = (item: any, index: number) => {
        return (
            <div key={index} className="item-contain-bg" style={{ width: '20%' }}>
                <img className="image-box" style={{ width: dealImageWidth(), height: dealImageWidth() }} src={item.url || '/image/image_nav_empty.png'} />
                <span style={{ color: title_color, whiteSpace: 'nowrap', marginTop: '12px' }}>{item.title_name || `导航${numberToText(index + 1)}`}</span>
            </div>
        );
    };
    //文字
    const itemTextRender = (item: any, index: number) => {
        return (
            <span key={index} className="item-contain-title" style={{ color: title_color, width: '18%', padding: '5px 0', overflow: 'hidden' }}>
                {item.title_name || `导航${numberToText(index + 1)}`}
            </span>
        );
    };
    const rednerList = isImageNav ? image_title_list : title_list;
    return (
        <div className="render-image-text-nav" style={{ backgroundColor: box_color, height: height, justifyContent: rednerList.length <= 3 ? 'space-around' : 'space-between' }}>
            {isImageNav
                ? image_title_list.map((item, index) => {
                      return itemImageRender(item, index);
                  })
                : title_list.map((item, index) => {
                      return itemTextRender(item, index);
                  })}
        </div>
    );
};

export default React.memo(Render_Image_Text_Nav);
