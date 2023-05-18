import { iEditorBlock, iEditorNotice } from '@/store/config';
import './index.scss';
import React, { CSSProperties } from 'react';

const Render_Notice = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorNotice;

    const noticeStyle: CSSProperties = {
        backgroundColor: data.bg_color,
        color: data.text_color,
        overflow: 'hidden',
    };

    const defaultTitle = '请填写内容，如果过长，将会在手机上滚动显示';

    return (
        <div className="render-notice-box">
            <div className="notice-box" style={noticeStyle}>
                <img className="image-show" src={data.notice_img} />
                <div className="context-text">{data.text_context || defaultTitle}</div>
            </div>
        </div>
    );
};

export default React.memo(Render_Notice);
