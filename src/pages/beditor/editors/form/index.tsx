/* eslint-disable react/display-name */
import React, { memo, useEffect, useState } from 'react';
import { iEditorForms } from '@/store/config';
import SelectColor from '@/pages/beditor/components/selectColor';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Popover, Modal, Row, Col, Radio, InputNumber, Space, Checkbox, message } from 'antd';
import { formComponentList, createFormItem, createType, iFormListItem, iFormComponentListItem, fclCustomSelect } from './config';
import './index.less';
import { changeNUmberToChinese, isEmpty } from '@/utils/tools';
const { confirm } = Modal;
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { getBlocksPermissions } from '@/api/autoConfig';
import { getStorage, storageKeys } from '@/utils/storageTools';

const DragHandle: any = SortableHandle(({ index }) => (
    <div className="box_left">
        <img className="sortable" src={require('../../../../img/icon_sortable.png')} />
        <span>选项{changeNUmberToChinese(index)}</span>
    </div>
));

const SortableItem: any = SortableElement((props) => {
    const { pindex, value, onDelClick, onChange } = props;
    return (
        <li className="form_custom_options_select_item">
            <div className="box">
                <DragHandle index={pindex} />
                <Input allowClear className="input" value={value} onChange={onChange} bordered={false} showCount maxLength={10} />
            </div>
            <img onClick={onDelClick} className="close" src={require('../../../../img/icon_close.png')} />
        </li>
    );
});

const SortableBody: any = SortableContainer(({ children }) => {
    return <ul>{children}</ul>;
});

const FormEditor = ({ data: { id } }: { data: iEditorForms }) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<iEditorForms>({ id });
    const [fcl, setFCL] = useState(formComponentList);

    useEffect(() => {
        // 获取配置的可以显示下拉列表的手机号
        getBlocksPermissionsPhones();
    }, []);
    const getBlocksPermissionsPhones = async () => {
        try {
            const data = await getBlocksPermissions();
            const { show_customSelect_phons } = data || {};
            if (Array.isArray(show_customSelect_phons)) {
                const ui = getStorage(storageKeys.USER_INFO);
                if (ui.phone) {
                    const hp = show_customSelect_phons.includes(ui.phone);
                    if (hp) {
                        const arr = formComponentList.slice();
                        arr.push(fclCustomSelect);
                        setFCL(arr);
                    }
                }
            }
        } catch (error) {}
    };

    //新增表单项
    const handleAddForm = (type: createType, item: iFormComponentListItem) => {
        const arr = data.formList.filter((v) => v.type === type);
        const formItem = createFormItem(type);
        if (arr.length > 0 && formItem.count === 1) {
            message.error(`已经添加过${item.title}了`);
            return;
        } else if (arr.length >= formItem.count) {
            message.error(`${item.title}最多添加${formItem.count}个哦`);
            return;
        }
        const list = data.formList.concat(formItem as iFormListItem);
        handleChangeItemValue('formList', list);
    };
    //删除
    const handleDelete = (item: iFormListItem) => {
        showDeleteConfirm(item);
    };
    // 删除二次确认弹窗
    const showDeleteConfirm = (item: iFormListItem) => {
        confirm({
            title: '确定要删除此项吗?',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                const list = data.formList.filter((value) => value.id !== item.id);
                handleChangeItemValue('formList', list);
            },
            onCancel() {
                // console.log(first)
            },
        });
    };
    //换位置
    const handleChangeFormLocation = (index: number, num: number) => {
        if ((index === 0 && num === -1) || (index === data.formList.length - 1 && num === 1)) {
            //第一个向上移动
            //最后一个向下移动
            // 返回
            return;
        }
        const toIndex = index + num;
        const list = data.formList.slice();
        list[toIndex] = list.splice(index, 1, list[toIndex])[0];
        handleChangeItemValue('formList', list);
    };
    //编辑
    const handleEdit = (index: number, obj: any) => {
        const list = data.formList.slice();
        list[index] = Object.assign({}, list[index], obj);
        handleChangeItemValue('formList', list);
    };

    return (
        <div className={'form-editor'}>
            <div className="form-action-rows">
                {fcl.map((v, i) => (
                    <Button key={i} onClick={() => handleAddForm(v.type, v)}>
                        +{v.title}
                    </Button>
                ))}
            </div>
            <div className="form-edit-box">
                {data.formList.map((v, i) => (
                    <EditorItem
                        index={i}
                        isLast={data.formList.length === i + 1}
                        key={i}
                        title={v.title}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleChangeFormLocation={handleChangeFormLocation}
                        handleChangeItemValue={handleChangeItemValue}
                        editData={v as iFormListItem}
                        data={data}
                    />
                ))}
            </div>

            <div className="form-row">
                <div className={'title-label'}>卡片背景色</div>
                <div className={'item-wrap'}>
                    <SelectColor defaultValue="#FFFFFF" onChange={(hex) => handleChangeItemValue('formBackgroundColor', hex)} value={data.formBackgroundColor} />
                </div>
            </div>
            <div className="form-row">
                <div className={'title-label'}>提示文字颜色</div>
                <div className={'item-wrap'}>
                    <SelectColor
                        defaultValue="#ccc"
                        onChange={(hex) => handleChangeItemValue('formInputPlaceholderTextColor', hex)}
                        value={data.formInputPlaceholderTextColor || '#ccc'}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className={'title-label'}>输入文字颜色</div>
                <div className={'item-wrap'}>
                    <SelectColor defaultValue="#333" onChange={(hex) => handleChangeItemValue('formInputTextColor', hex)} value={data.formInputTextColor || '#333'} />
                </div>
            </div>
            <div className="form-row">
                <div className={'title-label'}>按钮背景色</div>
                <div className={'item-wrap'}>
                    <SelectColor defaultValue="#2D68EA" onChange={(hex) => handleChangeItemValue('buttonBackgroundColor', hex)} value={data.buttonBackgroundColor} />
                </div>
            </div>
            <div className="form-row">
                <div className={'title-label'}>按钮文字颜色</div>
                <div className={'item-wrap'}>
                    <SelectColor defaultValue="#FFFFFF" onChange={(hex) => handleChangeItemValue('buttonTextColor', hex)} value={data.buttonTextColor} />
                </div>
            </div>
            <div className="form-column">
                <div className={'title-label'}>按钮文字</div>
                <div className={'item-wrap'}>
                    <Input
                        maxLength={10}
                        showCount
                        onChange={(e) => handleChangeItemValue('buttonTextValue', e.target.value)}
                        placeholder={'请输入按钮文本'}
                        value={data.buttonTextValue}
                    />
                </div>
            </div>
            <div className="form-column">
                <div className={'title-label'}>提交后交互</div>
                <div className="form-edit-item-warp">
                    <Radio.Group
                        value={data.toast}
                        onChange={(e) => {
                            handleChangeItemValue('toastContent', '');
                            handleChangeItemValue('toast', e.target.value);
                        }}
                    >
                        <Radio value={1}>无</Radio>
                        <Radio value={2}>Toast提示</Radio>
                        <Radio value={3}>弹框提示</Radio>
                    </Radio.Group>
                </div>
                {data.toast !== 1 && (
                    <div className="form-row" style={{ padding: 0 }}>
                        <div className={'title-label'}>提示内容</div>
                        <div className={'item-wrap'} style={{ flex: 1 }}>
                            <Input.TextArea
                                allowClear
                                showCount
                                minLength={1}
                                maxLength={data.toast === 2 ? 15 : data.toast === 3 ? 30 : 10}
                                value={data.toastContent}
                                placeholder={'请输入提示内容'}
                                onChange={(e) => {
                                    handleChangeItemValue('toastContent', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EditorItem = memo(
    ({
        editData,
        title,
        handleDelete,
        handleChangeFormLocation,
        handleEdit,
        handleChangeItemValue,
        index,
        isLast,
    }: {
        index: number;
        isLast: boolean;
        editData: iFormListItem;
        title: string;
        handleEdit(index: number, obj: any): void;
        handleChangeFormLocation(index: number, num: number): void;
        handleDelete(item: iFormListItem, index: number): void;
        handleChangeItemValue(name: string, value: any): void;
        data: any;
    }) => {
        const { required, minCount, maxCount, placeholder, codePlaceholder, codeVerify, options, type, customOptions } = editData;

        // 拖动顺序
        const onSortEnd = ({ oldIndex, newIndex }) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list[newIndex] = list.splice(oldIndex, 1, list[newIndex])[0];
                handleEdit(index, { customOptions: list });
            }
        };

        // 删除单个选项
        const onDelClick = (optsindex) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list.splice(optsindex, 1);
                handleEdit(index, { customOptions: list });
            }
        };
        // 添加选项
        const onAddCustomOptions = () => {
            if (Array.isArray(customOptions)) {
                if (customOptions.length >= 10) {
                    message.error(`最多添加10个选项`);
                    return;
                }
                const list = customOptions.slice();
                list.push({ label: '', value: '' });
                handleEdit(index, { customOptions: list });
            }
        };
        const handleCustomOptionsChange = (optsindex, value) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list[optsindex] = { label: value, value: value };
                handleEdit(index, { customOptions: list });
            }
        };
        return (
            <div className="form-edit-item">
                <div className="form-edit-item-title-row">
                    <div>{title}</div>
                    <div className="form-edit-action">
                        {index !== 0 && (
                            <Popover content={<span>向上</span>}>
                                <div className="opera_item cursor-pointer" onClick={() => handleChangeFormLocation(index, -1)}>
                                    <i className="fa fa-arrow-circle-up" aria-hidden="true"></i>
                                </div>
                            </Popover>
                        )}
                        {!isLast && (
                            <Popover content={<span>向下</span>}>
                                <div className="opera_item cursor-pointer" onClick={() => handleChangeFormLocation(index, 1)}>
                                    <i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
                                </div>
                            </Popover>
                        )}
                        <Popover content={<span>删除</span>}>
                            <div className="opera_item cursor-pointer" onClick={() => handleDelete(editData, index)}>
                                <i className="fa fa-trash-o text-red-500" aria-hidden="true"></i>
                            </div>
                        </Popover>
                    </div>
                </div>
                {isEmpty(placeholder) && type !== 'gender' && (
                    <div className="form-edit-item-warp">
                        <Input
                            allowClear
                            showCount
                            minLength={minCount || 1}
                            maxLength={10}
                            value={placeholder}
                            placeholder={'请输入提示文本'}
                            onChange={(e) => {
                                handleEdit(index, { placeholder: e.target.value });
                            }}
                        />
                    </div>
                )}
                {codeVerify && (
                    <div className="form-edit-item-warp">
                        <Input
                            allowClear
                            showCount
                            minLength={minCount || 1}
                            maxLength={10}
                            value={codePlaceholder}
                            placeholder={'请输入提示文本'}
                            onChange={(e) => {
                                handleEdit(index, { codePlaceholder: e.target.value });
                            }}
                        />
                    </div>
                )}
                {isEmpty(options) && Array.isArray(options) && (
                    <div className="form-edit-item-warp">
                        <Input
                            allowClear
                            showCount
                            maxLength={3}
                            defaultValue={options && options[0].label}
                            placeholder={'男'}
                            onChange={(e) => {
                                const arr = options.slice();
                                arr[0] = Object.assign({}, arr[0], { label: e.target.value });
                                handleEdit(index, { options: arr });
                            }}
                        />
                        <Input
                            allowClear
                            showCount
                            maxLength={3}
                            style={{ marginTop: 10 }}
                            defaultValue={options && options[1].label}
                            placeholder={'女'}
                            onChange={(e) => {
                                const arr = options.slice();
                                arr[1] = Object.assign({}, arr[1], { label: e.target.value });
                                handleEdit(index, { options: arr });
                            }}
                        />
                    </div>
                )}

                {isEmpty(required) && (
                    <div className="form-edit-item-warp">
                        <Radio.Group
                            value={required}
                            onChange={(e) => {
                                handleEdit(index, { required: e.target.value });
                            }}
                        >
                            <Radio value={1}>必填</Radio>
                            <Radio value={0}>非必填</Radio>
                        </Radio.Group>
                    </div>
                )}
                {isEmpty(codeVerify) && (
                    <div className="form-edit-item-warp">
                        <Checkbox
                            checked={codeVerify}
                            onChange={(e) => {
                                handleEdit(index, { codeVerify: e.target.checked });
                                handleChangeItemValue('isCodeLogin', e.target.checked);
                            }}
                        >
                            使用短信验证码
                        </Checkbox>
                    </div>
                )}
                {/* {isEmpty(data.isWxLogin) && (
                    <div className="form-edit-item-warp">
                        <Checkbox
                            checked={data.isWxLogin}
                            onChange={(e) => {
                                handleChangeItemValue('isWxLogin', e.target.checked)
                            }}
                        >
                            微信内授权登录
                        </Checkbox>
                    </div>
                )} */}
                {minCount !== undefined && maxCount !== undefined && (
                    <>
                        <Col className="form-edit-item-warp" span={14}>
                            <span>用户输入限制字数</span>
                        </Col>
                        <Row className="form-edit-item-warp row-center">
                            <Space>
                                最小
                                <InputNumber
                                    min={1}
                                    max={30}
                                    size="small"
                                    value={minCount}
                                    defaultValue={minCount}
                                    onChange={(value) => {
                                        handleEdit(index, { minCount: value });
                                    }}
                                />
                                ~最大
                                <InputNumber
                                    size="small"
                                    min={minCount}
                                    max={type == 'custom' ? 100 : 30}
                                    defaultValue={maxCount}
                                    onChange={(value) => {
                                        handleEdit(index, { maxCount: value });
                                    }}
                                />
                            </Space>
                        </Row>
                    </>
                )}

                {/* 自定义下拉选项 */}
                {Array.isArray(customOptions) ? (
                    <div>
                        <Button type="text" style={{ padding: '0' }} onClick={onAddCustomOptions}>
                            <PlusCircleOutlined />
                            添加选项
                        </Button>
                        <SortableBody onSortEnd={onSortEnd} useDragHandle>
                            {customOptions.map((item, index) => (
                                <SortableItem
                                    key={`item-${index}`}
                                    index={index}
                                    pindex={index}
                                    value={item.value}
                                    onDelClick={() => onDelClick(index)}
                                    onChange={(e: any) => {
                                        handleCustomOptionsChange(index, e.target.value);
                                    }}
                                />
                            ))}
                        </SortableBody>
                    </div>
                ) : null}
            </div>
        );
    }
);

export default FormEditor;
