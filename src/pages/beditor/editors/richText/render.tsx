import { iEditorRichText } from '@/store/config';
import './index.less';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import React from 'react';

interface iP {
    data: iEditorRichText;
    index: number;
}
const defaultContent = `<div><p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p><p>还可以在这里加入表格了</p><table><tbody><tr><td width="93" valign="top" style="word-break: break-all;">中奖客户</td><td width="93" valign="top" style="word-break: break-all;">发放奖品</td><td width="93" valign="top" style="word-break: break-all;">备注</td></tr><tr><td width="93" valign="top" style="word-break: break-all;">猪猪</td><td width="93" valign="top" style="word-break: break-all;">内测码</td><td width="93" valign="top" style="word-break: break-all;"><em><span style="color: rgb(255, 0, 0);">已经发放</span></em></td></tr><tr><td width="93" valign="top" style="word-break: break-all;">大麦</td><td width="93" valign="top" style="word-break: break-all;">积分</td><td width="93" valign="top" style="word-break: break-all;"><a href="javascript: void(0);" target="_blank" draggable="false">领取地址</a></td></tr></tbody></table><p style="text-align: left;"><span style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p></div>`;
const RichText = (props: iP) => {
    const { content, fullscreen, bg_color, page_padding } = props.data;

    let pl = fullscreen ? page_padding : page_padding + 10;
    return (
        <div
            data-slate-editor
            className="cap-richtext"
            style={{ backgroundColor: bg_color, padding: fullscreen ? '0' : '10px', paddingLeft: pl + 'px', paddingRight: pl + 'px' }}
            dangerouslySetInnerHTML={{ __html: !content || content === '<p><br></p>' ? defaultContent : content }}
        ></div>
    );
};

export default React.memo(RichText);
