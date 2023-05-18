import { iEditorButton } from '@/store/config';
import { Input, InputNumber, Radio } from 'antd';
import SelectColor from '@/pages/beditor/components/selectColor';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { useState } from 'react';



const ButtonEditor = ({ data: { id } }: { data: iEditorButton }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorButton>({ id });
    const { title_type, title, bg_color, title_color, title_size, btn_height, btn_radius, btn_width } = data;
    const [headerTitle, setHeaderTitle] = useState('');

    // 标题输入
    const inputTitle = (value: string) => {
        setHeaderTitle(value);
        handleChangeValue('title', value);
    };

    const isTitle = title_type == 'btnTitle';

    // 选择颜色的通用样式
    const selectColorCom = (leftTitle: string, value: string, defaultValue: string, typeName: string) => {
        return (
            <div className="item-wrap">
                <div className="item-diff-row">
                    <span>{leftTitle}</span>
                    <div className="item-row">
                        <SelectColor value={value} defaultValue={defaultValue} onChange={(hex) => handleChangeValue(typeName, hex)} />
                    </div>
                </div>
            </div>
        );
    };
    // 修改文字大小的通用样式
    const changeTextSize = (leftTitle: string, value: number | string, min: number | string, typeName: string) => {
        return (
            <div className="item-wrap">
                <div className="item-diff-row">
                    <span>{leftTitle}</span>
                    <div className="item-row">
                        <InputNumber min={min} onChange={(e) => handleChangeValue(typeName, e)} value={value} />
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className={'editor-module-wrap'}>

            {
                isTitle && <>
                    <div className="item-wrap">
                        <Input value={title} placeholder="请填写按钮内容" allowClear showCount maxLength={20} onChange={(e) => inputTitle(e.target.value)} />
                    </div>


                    <div className="diff-line"></div>
                    {selectColorCom('背景颜色', bg_color, '#fff', 'bg_color')}
                    {/* {changeTextSize('按钮宽度', btn_width, btn_width, 'btn_width')} */}
                    {changeTextSize('按钮高度', btn_height, btn_height, 'btn_height')}
                    {changeTextSize('按钮圆角', btn_radius, btn_radius, 'btn_radius')}
                    {selectColorCom('按钮文字颜色', title_color, '#000000', 'title_color')}
                    {changeTextSize('按钮文字大小', title_size, 12, 'title_size')}
                    <div className="item-wrap">
                        <div className="item-diff-row">
                            <span>按钮文字粗细</span>
                            <div className="item-row">
                                <Radio.Group defaultValue="a" buttonStyle="solid">
                                    <Radio.Button onChange={(e) => handleChangeValue('title_weight', false)} value="a">
                                        T
                                    </Radio.Button>
                                    <Radio.Button onChange={(e) => handleChangeValue('title_weight', true)} value="b">
                                        <span style={{ fontWeight: 900 }}>T</span>
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                </>
            }

        </div>
    );
};

export default ButtonEditor;
