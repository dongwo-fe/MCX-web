import { iEditorElevatorNavigation } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import React, { CSSProperties, useRef, useState } from 'react';
import { Input, Modal, Radio, Select } from 'antd';
import Upload from '../banner/upload';
import SelectColor from '../../components/selectColor';
import { numberToText } from '@/utils/tools';
import { useSelector } from 'react-redux';
import { typeNames } from '../../config';
const { Option } = Select;

/**
 * 电梯标签编辑
 */
const ElevatorNavigationiEditor = ({ data: { id } }: { data: iEditorElevatorNavigation }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorElevatorNavigation>({ id });
    const EditorData = useSelector((state: any) => state.editor);
    const { modalType, bg_color, bg_select_color, text_select_color, text_default_color, label_select_type, label_list } = data;

    // 初始化数据
    const initData = [
        {
            image_url: '', // 图片链接
            text_input: '', // 输入的文字
            link_data: {
                link_id: '', // 关联组件的ID
                link_name: '', // 关联组件的名字
                link_number: 0,
            },
        },
        {
            image_url: '',
            text_input: '',
            link_data: {
                link_id: '',
                link_name: '',
                link_number: 0,
            },
        },
        {
            image_url: '',
            text_input: '',
            link_data: {
                link_id: '',
                link_name: '',
                link_number: 0,
            },
        },
        {
            image_url: '',
            text_input: '',
            link_data: {
                link_id: '',
                link_name: '',
                link_number: 0,
            },
        },
    ];

    const [imageList, setImageList] = useState(modalType == 1 ? initData : label_list);
    const [titleList, setTitleList] = useState(modalType == 1 ? label_list : initData);
    const [visible, setVisible] = useState(false);
    const [imageCurrentIndex, setImageCurrentIndex] = useState(0);
    const [textCurrentIndex, setTextCurrentIndex] = useState(0);
    const [currentType, setCurrentType] = useState(modalType);

    const [beforImageData, setBeforImageData] = useState(imageList);
    const [beforTextData, setBeforTextData] = useState(titleList);
    const cI = useRef(EditorData.blocks.findIndex((v: any) => v.id === data.id));
    // 选择模版
    const handleLaberType = (e: any) => {
        setCurrentType(e.target.value);
        handleChangeValue('modalType', e.target.value);
        if (e.target.value == 1) {
            handleChangeValue('label_list', titleList);
        } else {
            handleChangeValue('label_list', imageList);
        }
    };

    const isTextLaber = currentType == 1;

    // 修改标签选中样式类型
    const onChangeLaberStyle = (value: number) => {
        handleChangeValue('label_select_type', value);
    };

    const addLaber = () => {
        const copy = isTextLaber ? [...titleList] : [...imageList];
        if (copy.length == 10) return;
        copy.push({
            image_url: '',
            text_input: '',
            link_data: {
                link_name: '',
                link_id: '',
                link_number: 0,
            },
        });
        if (isTextLaber) {
            setTitleList(copy);
        } else {
            setImageList(copy);
        }
        handleChangeValue('label_list', copy);
    };

    // 删除标签
    const delateLabe = (index: number) => {
        const copy = [...label_list];
        copy.splice(index, 1);
        if (isTextLaber) {
            setTitleList(copy);
        } else {
            setImageList(copy);
        }
        handleChangeValue('label_list', copy);
    };

    // 添加图片
    const handleUpload = (value: any, index: number) => {
        const copy = [...imageList];
        const url = value.length == 0 ? '' : value[0].url;
        copy[index] = Object.assign({}, copy[index], { image_url: url });
        setImageList(copy);
        assembleLabelList(copy);
    };

    // 输入标签
    const inputLaber = (index: number, value: string) => {
        const copy = [...titleList];
        copy[index] = Object.assign({}, copy[index], { text_input: value });
        setTitleList(copy);
        assembleLabelList(copy);
    };

    // 处理渲染端数据
    const assembleLabelList = (copy: any) => {
        handleChangeValue('label_list', copy);
    };
    // 相同样式
    const textColor: CSSProperties = { color: '#999' };

    // 添加图片类型的跳转组件
    const addLinkName = (index: number) => {
        setVisible(true);
        setImageCurrentIndex(index);
        // 保留切换之前的数据
        setBeforImageData(imageList);
    };

    // 添加文字类型的跳转组件
    const addLinkTextName = (index: number) => {
        setVisible(true);
        setTextCurrentIndex(index);
        // 保留切换之前的数据
        setBeforTextData(titleList);
    };

    // 选择组件的回调
    const handleTypeChange = (value: any) => {
        if (value == '' || !value.includes('=')) return;
        const copy = isTextLaber ? [...titleList] : [...imageList];
        const index = isTextLaber ? textCurrentIndex : imageCurrentIndex;
        const list = value.split('=');
        let testShow = 0;
        getSelectData().forEach((item: any, index: number) => {
            if (item.id == list[1]) {
                testShow = cI.current + index + 2;
            }
        });
        copy[index] = Object.assign({}, copy[index], {
            link_data: {
                link_id: list[1],
                link_name: `${typeNames[list[0]]}-${testShow}F`,
                link_number: testShow,
            },
        });
        if (isTextLaber) {
            setTitleList(copy);
        } else {
            setImageList(copy);
        }
    };

    // 弹窗确定
    const handleOk = () => {
        const copy = isTextLaber ? titleList : imageList;
        assembleLabelList(copy);
        setVisible(false);
    };

    // 弹窗取消
    const handleCancel = () => {
        setTitleList(beforTextData);
        setImageList(beforImageData);
        setVisible(false);
    };

    const selectDefault = () => {
        const copy = isTextLaber ? titleList : imageList;
        const index = isTextLaber ? textCurrentIndex : imageCurrentIndex;
        let value = '';
        if (copy[index].link_data.link_name != '') {
            value = getLinkName(copy[index].link_data);
        }
        return value;
    };

    const limitStyle = () => {
        const copy = isTextLaber ? titleList : imageList;
        return copy.length >= 10 ? '#777' : '#005ECA';
    };

    // 组装数据
    const colorDataList: Array<any> = [
        {
            type: 'text_default_color',
            title: '文字颜色-默认状态',
            default_color: '#777',
            value: text_default_color,
        },
        {
            type: 'text_select_color',
            title: '文字颜色-选中状态',
            default_color: '#000',
            value: text_select_color,
        },
        {
            type: 'bg_select_color',
            title: '背景颜色-选中状态',
            default_color: '#005ECA',
            value: bg_select_color,
        },
        {
            type: 'bg_color',
            title: '背景颜色',
            default_color: '#fff',
            value: bg_color,
        },
    ];

    const renderBgList = isTextLaber ? colorDataList : [colorDataList[3]];
    const getSelectData = () => {
        return EditorData.blocks.slice(cI.current + 1);
    };

    const getLinkName = (link_data: any) => {
        const index = EditorData.blocks.findIndex((v: any) => v.id === link_data.link_id);
        if (index == -1) {
            return '未找到该组件';
        }
        const [a, b] = link_data.link_name.split('-');
        return a + '-' + (index + 1) + 'F';
    };
    return (
        <>
            <div className="new-contain-box">
                <div className="item-box-sp">
                    <div style={textColor}>选择模版</div>
                    <span>{isTextLaber ? '文字样式' : '图片样式'}</span>
                    <Radio.Group onChange={handleLaberType} value={currentType}>
                        <Radio value={1}>文字型</Radio>
                        <Radio value={2}>图片型</Radio>
                    </Radio.Group>
                </div>

                {currentType == 2
                    ? imageList.map((item, index) => {
                          return (
                              <div key={index} className="item-border item-box-sp">
                                  <div>
                                      <Upload
                                          onChange={(e: any) => handleUpload(e, index)}
                                          value={item.image_url == '' ? [] : [{ url: item.image_url, uid: '1' }]}
                                          imageSize={{ type: 4, width: 1, height: 1, sizeText: '导航图片尺寸建议300X300像素或等比例尺寸' }}
                                      />
                                  </div>
                                  <div style={{ color: 'rgb(66, 139, 228)' }} onClick={(e) => addLinkName(index)}>
                                      {item.link_data.link_id != '' ? getLinkName(item.link_data) : '添加跳转到的组件'}
                                  </div>
                                  {imageList.length > 1 && <div onClick={(e) => delateLabe(index)}>删除</div>}
                              </div>
                          );
                      })
                    : titleList.map((item, index) => {
                          return (
                              <div key={index} className="item-border">
                                  <Input
                                      value={item.text_input}
                                      placeholder={`标签${numberToText(index + 1)}`}
                                      allowClear
                                      showCount
                                      maxLength={10}
                                      onChange={(e) => inputLaber(index, e.target.value)}
                                  />
                                  <div className="item-box-sp">
                                      <div style={{ color: 'rgb(66, 139, 228)', marginTop: 16 }} onClick={(e) => addLinkTextName(index)}>
                                          {item.link_data.link_id != '' ? getLinkName(item.link_data) : '请选择需要定位组件'}
                                      </div>
                                      {titleList.length > 1 && <div onClick={(e) => delateLabe(index)}>删除</div>}
                                  </div>
                              </div>
                          );
                      })}
                <div onClick={addLaber} className="item-wrap">
                    <div className="add-nav-box diff-height">
                        <div style={{ color: limitStyle() }}>+添加标签({isTextLaber ? titleList.length : imageList.length}/10)</div>
                    </div>
                </div>
                {isTextLaber && (
                    <div className="item-box-sp dis-margin">
                        <span style={textColor}>标签选中样式</span>
                        <Radio.Group
                            size="small"
                            defaultValue={label_select_type}
                            buttonStyle="solid"
                            onChange={(e) => onChangeLaberStyle(e.target.value)}
                            value={label_select_type}
                        >
                            <Radio.Button value="bg">背景模式</Radio.Button>
                            <Radio.Button value="round">圆框</Radio.Button>
                            <Radio.Button value="square">方框</Radio.Button>
                            <Radio.Button value="under">下划线</Radio.Button>
                        </Radio.Group>
                    </div>
                )}
                {renderBgList.map((item, index) => {
                    return (
                        <div key={index} className="item-box-sp dis-margin">
                            <span style={textColor}>{item.type === 'bg_select_color' && label_select_type === 'under' ? '下划线颜色-选中状态' : item.title}</span>
                            <SelectColor defaultValue={item.default_color} value={item.value} onChange={(hex) => handleChangeValue(item.type, hex)} />
                        </div>
                    );
                })}
            </div>
            <Modal
                width={700}
                bodyStyle={{ height: 400 }}
                title="选择需要关联的组件"
                visible={visible}
                closable={false}
                onOk={handleOk}
                okText="确定"
                cancelText="取消"
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Select defaultValue={selectDefault()} onChange={handleTypeChange} placeholder="请选择需要定位的组件" style={{ width: 600 }} size="large">
                    {getSelectData().map((item: any, index: number) => {
                        return (
                            <Option key={index} value={item.type + '=' + item.id}>
                                {typeNames[item.type]}-{cI.current + index + 2}F
                            </Option>
                        );
                    })}
                </Select>
            </Modal>
        </>
    );
};

export default ElevatorNavigationiEditor;
