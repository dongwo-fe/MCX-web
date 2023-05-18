import { iEditorTagTitle } from '@/store/config';
import { Input, InputNumber, Radio } from 'antd';
import SelectColor from '@/pages/beditor/components/selectColor';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import TextArea from 'antd/lib/input/TextArea';
import { useState } from 'react';

/**
 * 标题文本/纯文本编辑
 */
const titleSelectType = [
    { label: '标题文本', value: 'tagTitle' },
    { label: '纯文本', value: 'pureTitle' },
];

const textAliginType = [
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' },
];

const ParagraphEditor = ({ data: { id } }: { data: iEditorTagTitle }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorTagTitle>({ id });
    const { title_type, paragraphList, title, paragraph_size, align, bg_color, title_color, title_size, paragraph_color } = data;
    const initParagrapTitle = title_type == 'tagTitle' ? paragraphList : [''];
    const initParagrapData = title_type == 'pureTitle' ? paragraphList : [''];
    const [headerTitle, setHeaderTitle] = useState('');
    const [paragrapTitle, setParagrapTitle] = useState(initParagrapTitle);
    const [paragrapData, setParagrapData] = useState(initParagrapData);

    // 类型切换
    const changeType = (value: string) => {
        handleChangeValue('title_type', value);
        if (value == 'pureTitle') {
            handleChangeValue('title', '');
            handleChangeValue('paragraphList', paragrapData);
        } else {
            handleChangeValue('title', headerTitle);
            handleChangeValue('paragraphList', paragrapTitle);
        }
    };

    // 标题输入
    const inputTitle = (value: string) => {
        setHeaderTitle(value);
        handleChangeValue('title', value);
    };

    const isTitle = title_type == 'tagTitle';
    // 增加段落

    const handleAdd = () => {
        const copy = isTitle ? [...paragrapTitle] : [...paragrapData];
        copy.push('');
        dealData(copy);
    };

    // 删除段落
    const handleRemove = (index: number) => {
        const copy = isTitle ? [...paragrapTitle] : [...paragrapData];
        copy.splice(index, 1);
        dealData(copy);
    };

    // 文本输入
    const inputParagrap = (index: number, value: string) => {
        const copy = isTitle ? [...paragrapTitle] : [...paragrapData];
        copy.splice(index, 1, value);
        dealData(copy);
    };

    // 整合数据
    const dealData = (copy: Array<string>) => {
        if (isTitle) {
            assembleTitle(copy);
        } else {
            assembleParagrapData(copy);
        }
    };

    // 标题数据整合
    const assembleTitle = (copy: Array<string>) => {
        setParagrapTitle(copy);
        handleChangeValue('paragraphList', copy);
    };

    // 段落数据整合
    const assembleParagrapData = (copy: Array<string>) => {
        setParagrapData(copy);
        handleChangeValue('paragraphList', copy);
    };

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
    const changeTextSize = (leftTitle: string, value: number, min: number, typeName: string) => {
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

    // 实际渲染的段落数据
    const showData = isTitle ? paragrapTitle : paragrapData;

    return (
        <div className={'editor-module-wrap'}>
            <div className="item-wrap">
                <Radio.Group options={titleSelectType} onChange={(e) => changeType(e.target.value)} value={title_type} optionType="button" buttonStyle="solid" />
            </div>
            {isTitle && (
                <div className="item-wrap">
                    <Input value={title} placeholder="请填写内容标题" allowClear showCount maxLength={50} onChange={(e) => inputTitle(e.target.value)} />
                </div>
            )}
            {showData.map((item: string, index: number) => {
                return (
                    <div key={index} className="item-wrap">
                        <TextArea value={item} placeholder="请填写内容文字" showCount allowClear maxLength={500} onChange={(e) => inputParagrap(index, e.target.value)} />
                        {showData.length > 1 && (
                            <div onClick={(e) => handleRemove(index)} className="delate-context">
                                删除
                            </div>
                        )}
                    </div>
                );
            })}
            <div className="item-wrap item-diff-row">
                <span>对齐方式</span>
                <Radio.Group options={textAliginType} onChange={(e) => handleChangeValue('align', e.target.value)} value={align} optionType="button" buttonStyle="solid" />
            </div>
            {paragraphList.length >= 15 ? null : (
                <div className="item-wrap">
                    <div onClick={handleAdd} className="add-context">
                        +添加段落
                    </div>
                </div>
            )}

            <div className="diff-line"></div>
            {selectColorCom('背景颜色', bg_color, '#fff', 'bg_color')}
            {isTitle && (
                <div>
                    {selectColorCom('标题文字颜色', title_color, '#000000', 'title_color')}
                    {changeTextSize('标题文字大小', title_size, 12, 'title_size')}
                    <div className="item-wrap">
                        <div className="item-diff-row">
                            <span>标题粗细</span>
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
                </div>
            )}
            {selectColorCom('文字颜色', paragraph_color, '#777777', 'paragraph_color')}
            {changeTextSize('文字大小', paragraph_size, 10, 'paragraph_size')}
        </div>
    );
};

export default ParagraphEditor;
