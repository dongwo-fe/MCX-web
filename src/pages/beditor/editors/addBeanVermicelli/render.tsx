import { iEditorBlock, iEditorAddBeanVermicelli } from '@/store/config';
import { Row } from 'antd';
import React from 'react';
import './index.scss';

const Render_Add_BeanVermical = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorAddBeanVermicelli;
    const { box_color, bg_color, weChat_image, weChat_nickName, title, code_image, nick_color, title_color } = data;
    return (
        <div className="render-bean-box" style={{ backgroundColor: box_color }}>
            <div className="bg_box" style={{ backgroundColor: bg_color }}>
                <Row>
                    <img className="weCat-iamge-box" src={weChat_image || '/image/we_chat_image.png'} />
                    <div className="we-title-box">
                        <span className="txt1" style={{ color: nick_color }}>
                            {weChat_nickName || '昵称'}
                        </span>
                        <span className="txt2" style={{ color: title_color }}>
                            {title || '引导文案'}
                        </span>
                    </div>
                </Row>
                <img className="code-iamge-box" src={code_image || '/image/we_chat_code_image.png'} />
            </div>
        </div>
    );
};

export default React.memo(Render_Add_BeanVermical);
