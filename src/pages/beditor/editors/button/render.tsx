import { iEditorBlock, iEditorButton } from '@/store/config';
import React from 'react';

//  标题文本/纯文本的渲染

const Render_Button = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorButton;
    const { title_type, bg_color, title, title_color, title_size,  title_weight, btn_height, btn_radius, btn_width } = data;
    // 标题样式
    const tagStyle = {
        color: title_color,
        fontSize: title_size,
        fontWeight: title_weight ? '900' : '400',
        lineHeight: btn_height+'px',
        height: btn_height,
        width: btn_width ? btn_width : '100%',
        borderRadius: btn_radius
    };

    return (
        <div
            className="render-button-box"
            style={{
                backgroundColor: bg_color,
                ...tagStyle
            }}
        >
            {title || '按钮文案'}
            
        </div>
    );
};

export default React.memo(Render_Button);
