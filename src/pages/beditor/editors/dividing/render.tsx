import { iEditorBlock, iEditorDividingLine } from '@/store/config';
import React, { CSSProperties } from 'react';

const Render_Dividing_Line = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorDividingLine;
    const { height, bg_color } = data;

    const dividingStyle: CSSProperties = {
        height: height + 'px',
        backgroundColor: bg_color,
    };

    return <div style={dividingStyle}></div>;
};

export default React.memo(Render_Dividing_Line);
