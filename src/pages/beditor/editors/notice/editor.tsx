import { iEditorNotice } from '@/store/config';
import SelectColor from '@/pages/beditor/components/selectColor';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import TextArea from 'antd/lib/input/TextArea';
import Upload from '../banner/upload';

/**
 * 公告编辑
 */
const NoticeEditor = ({ data: { id } }: { data: iEditorNotice }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorNotice>({ id });
    const { notice_img, text_context, bg_color, text_color } = data;

    //恢复默认
    const setImageDefault = () => {
        handleChangeValue('notice_img', '/image/notice_def_bg.png');
    };

    // 上传图片
    const uploadImage = (value: any) => {
        if (value.length > 0) {
            handleChangeValue('notice_img', value[0].url);
        } else {
            handleChangeValue('notice_img', '/image/notice_def_bg.png');
        }
    };

    // 本地图片和上传图片选择
    const upLoadShow = () => {
        if (notice_img.includes('http')) {
            return [
                {
                    url: notice_img,
                    uid: '1',
                },
            ];
        }
        return [];
    };

    // 通用编辑样式
    const editStyle = (leftTitle: string, value: string, defaultValue: string, typeName: string) => {
        return (
            <div className="item-wrap">
                <div className="item-sp">
                    <span style={{ color: '#999' }}>{leftTitle}</span>
                    <div className="item-row">
                        <SelectColor defaultValue={defaultValue} value={value} onChange={(hex) => handleChangeValue(typeName, hex)} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="editor-module-wrap">
            <div className="item-wrap">
                <div className="item-sp item-bottom-ds">
                    <span>图标样式</span>
                    <div className="item-row">
                        <img className="image-box item-right-ds" src={notice_img} />
                        <div onClick={setImageDefault} className="set-default">
                            恢复默认
                        </div>
                    </div>
                </div>
                <div className="item-sp">
                    <span>上传图标 (建议尺寸88X88像素)</span>
                    <div style={{ width: 100, height: 100 }}>
                        <Upload
                            imageSize={{ type: 4, width: 1, height: 1, sizeText: '导航图片尺寸建议88X88像素或等比例尺寸' }}
                            onChange={uploadImage}
                            value={upLoadShow()}
                        />
                    </div>
                </div>
            </div>

            <div className="item-wrap">
                <TextArea
                    value={text_context}
                    placeholder="请填写公告内容文字"
                    showCount
                    allowClear
                    maxLength={100}
                    onChange={(e) => handleChangeValue('text_context', e.target.value)}
                />
            </div>
            {editStyle('背景颜色', bg_color, '#FFF8E9', 'bg_color')}
            {editStyle('文字颜色', text_color, '#6F6F6F', 'text_color')}
        </div>
    );
};

export default NoticeEditor;
