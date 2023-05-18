import { iEditorGraphical } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Radio } from 'antd';
import SelectColor from '../../components/selectColor';
import EditorModal from '../banner/editorModal';
import { useState } from 'react';
import ImageTextNav from './navItem';
import { numberToText } from '@/utils/tools';

/**
 * 图文导航编辑
 */
const GraphicaliEditor = ({ data: { id } }: { data: iEditorGraphical }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorGraphical>({ id });
    const { nav_type, image_title_list, title_list, box_color, title_color } = data;
    // 链接弹窗展示
    const [modalVisible, setModalVisible] = useState(false);
    // 记录当前编辑的类型下标
    const [imageIndex, setImageIndex] = useState(0);
    const [textIndex, setTextIndex] = useState(0);

    // 切换导航类型
    const onChangeNav = (e: any) => {
        handleChangeValue('nav_type', e.target.value);
    };

    // 增加图片数量
    const addImageNav = () => {
        const copy = [...image_title_list];
        if (copy.length == 10) return;
        copy.push({
            url: '',
            title_name: '',
            link_data: {
                link_url: '',
                value: '',
            },
        });
        handleChangeValue('image_title_list', copy);
    };

    const addTextNva = () => {
        const copy = [...title_list];
        if (copy.length == 10) return;
        copy.push({
            link_data: {
                link_url: '',
                value: '',
            },
            title_name: `导航${numberToText(copy.length + 1)}`,
        });
        handleChangeValue('title_list', copy);
    };

    // 取消链接弹窗
    const onCancel = () => {
        setModalVisible(false);
    };

    const isImageNav = nav_type == 1;

    // 保存弹窗链接
    const onSave = (item: any) => {
        setModalVisible(false);
        if (isImageNav) {
            const copy = [...image_title_list];
            copy[imageIndex] = Object.assign({}, copy[imageIndex], { link_data: item });
            handleChangeValue('image_title_list', copy);
        } else {
            const copy = [...title_list];
            copy[textIndex] = Object.assign({}, copy[textIndex], { link_data: item });
            handleChangeValue('title_list', copy);
        }
    };

    const modalData = () => {
        if (isImageNav) {
            if (image_title_list.length >= imageIndex) {
                return image_title_list[imageIndex].link_data;
            } else {
                return { link_url: '', value: '' };
            }
        } else {
            if (title_list.length >= textIndex) {
                return title_list[textIndex].link_data;
            } else {
                return { link_url: '', value: '' };
            }
        }
    };

    // 选择颜色的通用样式
    const selectColorCom = (leftTitle: string, value: string, defaultValue: string, typeName: string) => {
        return (
            <div className="item-wrap item-box-sp dis-margin">
                <span style={{ color: '#999' }}>{leftTitle}</span>
                <SelectColor defaultValue={defaultValue} value={value} onChange={(hex) => handleChangeValue(typeName, hex)} />
            </div>
        );
    };
    const renderList = isImageNav ? image_title_list : title_list;
    return (
        <>
            <div className="new-contain-box">
                <div className="item-wrap item-box-sp">
                    <div style={{ color: '#999' }}>选择导航</div>
                    <div>{isImageNav ? '图片样式' : '文字样式'}</div>
                    <div>
                        <Radio.Group onChange={onChangeNav} value={nav_type}>
                            <Radio value={1}>图片导航</Radio>
                            <Radio value={2}>文字导航</Radio>
                        </Radio.Group>
                    </div>
                </div>
                {renderList.map((item, index) => {
                    return (
                        <ImageTextNav key={index} setModalVisible={setModalVisible} setImageIndex={setImageIndex} setTextIndex={setTextIndex} id={id} item={item} index={index} />
                    );
                })}
                {isImageNav ? (
                    <div onClick={addImageNav} className="item-wrap">
                        <div className="add-nav-box">
                            <div style={{ color: image_title_list.length >= 10 ? '#777' : 'rgb(66, 139, 228)', lineHeight: 2 }}>+添加导航({image_title_list.length}/10)</div>
                            <span>导航图片尺寸建议300X300像素或等比例尺寸</span>
                        </div>
                    </div>
                ) : (
                    <div onClick={addTextNva} className="item-wrap">
                        <div className="add-nav-box diff-height">
                            <div style={{ color: title_list.length >= 10 ? '#777' : 'rgb(66, 139, 228)' }}>+添加导航({title_list.length}/10)</div>
                        </div>
                    </div>
                )}
                {selectColorCom('背景颜色', box_color, '#fff', 'box_color')}
                {selectColorCom('文字颜色', title_color, '#000000', 'title_color')}
            </div>
            <EditorModal key={modalVisible} item={modalData()} onCancel={onCancel} onSave={onSave} visible={modalVisible} />
        </>
    );
};

export default GraphicaliEditor;
