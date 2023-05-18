import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Input } from 'antd';
import Upload from '../banner/upload';
import SelectColor from '../../components/selectColor';
import React from 'react';
import { iEditorAddBeanVermicelli } from '@/store/config';

/**
 * 涨粉编辑
 */
const AddBeanVermicelliEditor = ({ data: { id } }: { data: iEditorAddBeanVermicelli }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorAddBeanVermicelli>({ id });
    const { weChat_image, code_image, box_color, weChat_nickName, title, bg_color, nick_color, title_color } = data;

    const uploadWeChatImage = (value: any) => {
        const url = value.length > 0 ? value[0].url : '';
        handleChangeValue('weChat_image', url);
    };

    const uploadCodeImage = (value: any) => {
        const url = value.length > 0 ? value[0].url : '';
        handleChangeValue('code_image', url);
    };

    const showUpload = (value: string) => {
        if (value != '') {
            return [{ url: value, uid: 1 }];
        } else {
            return [];
        }
    };

    const editStyle = (leftText: string, defaultValue: string, value: string, type: string) => {
        return (
            <div className="item-wrap item-weChat-row">
                <span>{leftText}</span>
                <SelectColor defaultValue={defaultValue} value={value} onChange={(hex) => handleChangeValue(type, hex)} />
            </div>
        );
    };

    const redStyle = { color: 'red' };
    const blackStyle = { color: 'black' };

    return (
        <div className="editor-module-wrap">
            <div className="item-wrap item-weChat-row">
                <span style={redStyle}>
                    *<span style={blackStyle}>微信昵称</span>
                </span>
                <div>
                    <Input
                        value={weChat_nickName}
                        placeholder="必填，请输入昵称"
                        allowClear
                        showCount
                        maxLength={10}
                        onChange={(e) => handleChangeValue('weChat_nickName', e.target.value)}
                    />
                </div>
            </div>
            <span style={{ color: 'red', marginLeft: 100 }}>请填写微信昵称</span>
            <div className="item-wrap item-weChat-row">
                <span style={blackStyle}>引导文案</span>
                <div>
                    <Input value={title} placeholder="请输入引导文案" allowClear showCount maxLength={15} onChange={(e) => handleChangeValue('title', e.target.value)} />
                </div>
            </div>
            <div className="item-wrap item-weChat-row">
                <div style={redStyle}>
                    *<span style={blackStyle}>微信头像</span>
                </div>
                <div>
                    <Upload onChange={uploadWeChatImage} value={showUpload(weChat_image)} />
                </div>
            </div>
            <div className="item-wrap item-weChat-row">
                <div style={redStyle}>
                    *<span style={blackStyle}>微信二维码</span>
                </div>
                <div>
                    <Upload onChange={uploadCodeImage} value={showUpload(code_image)} />
                </div>
            </div>
            <div className="item-part"></div>
            <div className="item-wrap">
                <span style={{ color: 'black', fontWeight: '600' }}>基础设置</span>
            </div>
            {editStyle('模块背景色', '#EFEFF1', box_color, 'box_color')}
            {editStyle('卡片背景色', '#D5E2F4', bg_color, 'bg_color')}
            {editStyle('昵称文案色', '#000000', nick_color, 'nick_color')}
            {editStyle('引导文案色', '#6c6c6c', title_color, 'title_color')}
        </div>
    );
};

export default React.memo(AddBeanVermicelliEditor);
