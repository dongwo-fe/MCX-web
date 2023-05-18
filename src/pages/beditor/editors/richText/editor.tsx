import { Checkbox, InputNumber, Slider } from 'antd';
import SelectColor from '../../components/selectColor';
import useChangeEditorItemValue from '../../hooks/useChangeEditorItemValue';
import './index.less';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { DomEditor, IDomEditor, IEditorConfig } from '@wangeditor/editor';
import React, { useEffect, useState } from 'react';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { iEditorRichText } from '@/store/config';
import IMGCLIENT from '@/utils/imgOss';

/**
 * 富文本编辑
 */
interface iP {
    data: iEditorRichText;
}

const RichTextEditor = ({ data }: iP) => {
    const [item, handleChangeValue] = useChangeEditorItemValue<iEditorRichText>({ id: data.id });
    console.log('%c [ item ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', item);
    const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
    useEffect(() => {
        return () => {
            if (editor == null) return;
            editor.destroy();
            setEditor(null);
        };
    }, [editor]);
    const toolbarConfig = {
        excludeKeys: ['fullScreen', 'headerSelect', 'header1', 'header2', 'header3', 'fontFamily', 'code', 'codeSelectLang', 'codeBlock'],
    };
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '',
        scroll: true,
        MENU_CONF: {
            uploadImage: {
                // 自定义上传
                async customUpload(file: File, insertFn: any) {
                    // file 即选中的文件
                    // 自己实现上传，并得到图片 url alt href
                    try {
                        const imgData: any = await IMGCLIENT.upload(file);
                        const { downloadUrl, key, uid, url } = imgData;
                        insertFn(url, key, url);
                    } catch (e) {}
                    // 最后插入图片
                    // insertFn(url, alt, href);
                },
            },
            uploadVideo: {
                // 自定义上传
                async customUpload(file: File, insertFn: any) {
                    // file 即选中的文件
                    // 自己实现上传，并得到视频 url
                    try {
                        const imgData: any = await IMGCLIENT.upload(file);
                        const { downloadUrl, key, uid, url } = imgData;
                        insertFn(url);
                    } catch (e) {}
                    // 最后插入视频
                    // insertFn(url)
                },
            },
        },
    };
    // 修改边距
    const onChangeSilderPadding = (value: number | null) => {
        handleChangeValue('page_padding', value || 0);
    };

    return (
        <div id="rich-text">
            <span className="msg">小程序富文本展示以实际效果为准，左侧预览仅供参考</span>
            <div className="control-group">
                <div className="control-group__title">背景颜色</div>
                <div className="ml-auto" />
                <SelectColor value={item.bg_color} onChange={(hex) => handleChangeValue('bg_color', hex)} />
            </div>
            <div className="control-group">
                <div className="control-group__title">是否全屏显示</div>
                <div>{item.fullscreen ? '全屏显示' : '不全屏显示'}</div>
                <Checkbox checked={item.fullscreen} onChange={(e) => handleChangeValue('fullscreen', e.target.checked)} />
            </div>
            <div className="editor-group cap-richtext">
                <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
                <Editor
                    defaultConfig={editorConfig}
                    value={item.content}
                    onCreated={setEditor}
                    onChange={(editor) => handleChangeValue('content', editor.getHtml())}
                    mode="simple"
                    style={{ height: '400px' }}
                />
            </div>
            {editor ? <div className="tips">字数统计：{editor.getText().replace(/\n|\r/gm, '').length}</div> : null}

            <div className="control-group">
                <span className="control-group__title">页面边距</span>
                <Slider style={{ width: 140 }} min={0} max={30} onChange={onChangeSilderPadding} value={item.page_padding} />
                <div className="ml-auto" />
                <InputNumber size="middle" min={0} max={30} step={1} value={item.page_padding} onChange={onChangeSilderPadding} />
            </div>
        </div>
    );
};

export default RichTextEditor;
