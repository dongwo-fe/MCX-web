import { iEditorBlock, iEditorTagTitle } from '@/store/config';
import React from 'react';

//  标题文本/纯文本的渲染

const Render_Title_Paragraph = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorTagTitle;
    const { paragraphList, title_type, bg_color, title, title_color, title_size, align, title_weight, paragraph_color, paragraph_size } = data;
    // 标题样式
    const tagStyle = {
        color: title_color,
        fontSize: title_size,
        textAlign: align,
        fontWeight: title_weight ? '900' : '400',
        lineHeight: title_size * 0.08
    };
    // 文本样式
    const titleStyle: any = {
        color: paragraph_color,
        fontSize: paragraph_size,
        textAlign: align,
        lineHeight: paragraph_size * 0.1
    };
    // 文本渲染
    const renderParagraph = () => {
        return paragraphList.map((item: string, index: number) => {
            return (
                <div key={index} className="render-paragraph-title" style={titleStyle}>
                    {item}
                </div>
            );
        });
    };

    return (
        <div
            className="render-title-box"
            style={{
                backgroundColor: bg_color,
            }}
        >
            {title_type == 'tagTitle' && (
                <div className="render-title-pd" style={tagStyle}>
                    {title || '大标题大标题大标题'}
                </div>
            )}
            {paragraphList.isEmpty() ? (
                <div className="render-paragraph-title" style={titleStyle}>
                    填写内容
                </div>
            ) : (
                renderParagraph()
            )}
        </div>
    );
};

export default React.memo(Render_Title_Paragraph);
