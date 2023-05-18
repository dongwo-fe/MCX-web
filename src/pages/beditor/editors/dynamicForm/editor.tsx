import React, { useEffect, useState } from 'react';
import { iDynamicFormEditor } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Radio, message } from 'antd';
import { formComponentList, createFormItem, createType, iFormListItem, iFormComponentListItem, colorTypes } from './config';
import styles from './editor.module.scss';
import { changeNUmberToChinese } from '@/utils/tools';
const { confirm } = Modal;
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import RegistorInfo from '../component/registorInfo';
import ShowTypeComp from '../component/showTypeComp';

interface iProps {
    data: iDynamicFormEditor;
}

const DragHandleItem: any = SortableHandle(({ index }) => (
    <div className={styles.item_drag}></div>
));

const SortableItem: any = SortableElement((props) => {
    const { pindex, value, onDelClick, onChange } = props;
    return (
        <li className={styles.select_item}>
            <div className={styles.box}>
            <div className={styles.box_left}>
                <DragHandleItem />
                {/* <img className="sortable" src={require('../../../../img/icon_sortable.png')} /> */}
                <span>选项{changeNUmberToChinese(pindex)}</span>
            </div>
                <Input allowClear className={styles.input} value={value} onChange={onChange} bordered={false} showCount maxLength={10} />
            </div>
            <img onClick={onDelClick} className={styles.close} src={require('../../../../img/icon_close.png')} />
        </li>
    );
});

const SortableBody: any = SortableContainer(({ children }) => {
    return <ul>{children}</ul>;
});

const DynamicFormEditor = ({ data: { id } }: iProps) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<iDynamicFormEditor>({ id });
    const [activeKey, setActiveKey] = useState('styles');
    const [typeMap, setTypeMap] = useState({});

    const toastLegth = {
        2: 15,
        3: 30,
        4: 200
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
    //编辑
    const handleEdit = (index: number, obj: any) => {
        const list = data.formList.slice();
        list[index] = Object.assign({}, list[index], obj);
        handleChangeItemValue('formList', list);
    };

    // 计算选中
    const calcTypeSelect = () => {
        const map = data.formList.reduce((sum, item) => {
            sum[item.type] = true;
            return sum
        },{});

        setTypeMap(map);
    }

     // 拖动顺序
     const onSortEnd = ({ oldIndex, newIndex }) => {
        const list = data.formList.slice();
        list[newIndex] = list.splice(oldIndex, 1, list[newIndex])[0];
        handleChangeItemValue('formList', list);
    };

    useEffect(() => {
        calcTypeSelect();
    }, [data.formList]);

    return (
        <div className={`editor-module-wrap ${styles.dynamic_form_editor}`}>
            <div className={styles.dynamic_form_editor_tabs}>
                <div onClick={() => setActiveKey('styles')} className={`${styles.dynamic_form_editor_tab} ${ activeKey === 'styles' ? styles.active : '' }`}>样式<div className={styles.tab_bar}></div></div>
                <div onClick={() => setActiveKey('actions')} className={`${styles.dynamic_form_editor_tab} ${ activeKey === 'actions' ? styles.active : '' }`}>交互<div className={styles.tab_bar}></div></div>
            </div>
            {activeKey === 'styles' && <div>
            <div className={styles.card_title}>
                基础样式
            </div>
            <div className={styles.form_row}>
                <div className={styles.title_label}>卡片样式：</div>
                <div className={styles.item_wrap}>
                    <div className={`${styles.customer_btn} ${ data.cardTheme === 'light' ? styles.active : '' }`} onClick={() => handleChangeItemValue('cardTheme','light')}>
                        浅色模式
                    </div>
                    <div className={`${styles.customer_btn} ${ data.cardTheme === 'dark' ? styles.active : '' }`} onClick={() => handleChangeItemValue('cardTheme','dark')}>
                        深色模式
                    </div>
                </div>
            </div>
            <div className={styles.form_row}>
                <div className={styles.title_label}>按钮文案：</div>
                <div className={styles.item_wrap}>
                    <Input
                        style={{ width: 250 }}
                        maxLength={10}
                        showCount
                        onBlur={(e)=>{
                            if (e.target.value?.trim() === ''){
                                handleChangeItemValue('buttonTextValue', '提交');
                            }
                        }}
                        onChange={(e) => handleChangeItemValue('buttonTextValue', e.target.value)}
                        placeholder={'请输入按钮文案'}
                        value={data.buttonTextValue}
                    />
                </div>
            </div>
            <div className={styles.form_row}>
                <div className={styles.title_label}>按钮颜色：</div>
                <div className={styles.item_wrap}>
                    <Radio.Group value={data.buttonColor}
                                onChange={(e) => handleChangeItemValue('buttonColor', e.target.value)}
                                className={styles.custom_color}>
                        {colorTypes.map((item) => {
                            return (
                                <Radio className={styles.color_radio} key={item.color} style={{ '--radio-color': item.color }} value={item.color}>
                                    {item.title}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </div>
            </div>
            <ShowTypeComp id={id} />
            <div className={styles.card_title}>模块配置</div>
            <div className={styles.form_content}>
                {formComponentList.map((v, i) => (
                    <div className={`${styles.customer_btn} ${typeMap[v.type] ?  styles.active : ''}`} key={v.type + i} onClick={() => handleAddForm(v.type, v)}>
                        {v.title}
                    </div>
                ))}
            </div>
            <div className={styles.form_edit_box}>
                <SortableBody onSortEnd={onSortEnd} useDragHandle>
                {data.formList.map((v, i) => (
                    <EditorItem
                        index={i}
                        pindex={i}
                        key={i}
                        title={v.title}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleChangeItemValue={handleChangeItemValue}
                        editData={v as iFormListItem}
                    />
                ))}
                </SortableBody>
            </div>
        </div>}
            {activeKey === 'actions' && <div>
                <div className={styles.card_title}>提交提示</div>
                <div className={styles.form_row}>
                    <div className={styles.title_label}>提示：</div>
                    <div className={styles.item_wrap}>
                        <Radio.Group
                            value={data.toast}
                            onChange={(e) => {
                                handleChangeItemValue('toastContent', '');
                                handleChangeItemValue('toast', e.target.value);
                            }}
                        >
                            <Radio value={1}>无</Radio>
                            <Radio value={2}>Toast提示</Radio><br />
                            <Radio value={3}>弹框提示</Radio>
                            <Radio value={4}>跳转链接</Radio>
                        </Radio.Group>
                    </div>
                </div>
                {[2, 3, 4].includes(data.toast) && (
                    <div className={styles.form_row}>
                        <div className={styles.title_label}>{data.toast === 4 ? '跳转链接' : '提示内容'}：</div>
                        <div className={styles.item_wrap}>
                            < Input
                                allowClear
                                showCount
                                style={{ width: 280 }}
                                minLength={1}
                                maxLength={toastLegth[data.toast] || 10}
                                value={data.toastContent}
                                placeholder={'请输入链接'}
                                onChange={(e) => {
                                    handleChangeItemValue('toastContent', e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
                <RegistorInfo id={id} />
            </div>}
        </div>
    );
};

const EditorItem: any = SortableElement(
    ({
        editData,
        title,
        handleDelete,
        handleEdit,
        // handleChangeItemValue,
        pindex,
    }: {
        pindex: number;
        isLast: boolean;
        editData: iFormListItem;
        title: string;
        handleEdit(index: number, obj: any): void;
        handleDelete(item: iFormListItem, index: number): void;
        // handleChangeItemValue(name: string, value: any): void;
    }) => {
        const { required, minCount, maxCount, placeholder, codePlaceholder, codeVerify, options, type, customOptions } = editData;

        // 拖动顺序
        const onSortEnd = ({ oldIndex, newIndex }) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list[newIndex] = list.splice(oldIndex, 1, list[newIndex])[0];
                handleEdit(pindex, { customOptions: list });
            }
        };

        // 删除单个选项
        const onDelClick = (optsindex) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list.splice(optsindex, 1);
                handleEdit(pindex, { customOptions: list });
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
                handleEdit(pindex, { customOptions: list });
            }
        };
        const handleCustomOptionsChange = (optsindex, value) => {
            if (Array.isArray(customOptions)) {
                const list = customOptions.slice();
                list[optsindex] = { label: value, value: value };
                handleEdit(pindex, { customOptions: list });
            }
        };
        return (
            <div className={styles.form_edit_item}>
                <div className={styles.form_edit_item_wrap}>
                    <DragHandleItem />
                    <div className={styles.item_title}>{title}</div>
                    <div className={styles.switch}>
                        <div onClick={() => handleEdit(pindex, { required: true })} className={`${styles.switch_item} ${required ? styles.active : ''}`}>必填</div>
                        <div onClick={() => handleEdit(pindex, { required: false })} className={`${styles.switch_item} ${!required ? styles.active : ''}`}>选填</div>
                    </div>
                    <div className={styles.item_del} onClick={() => handleDelete(editData, pindex)}></div>
                </div>
                {['custom', 'customSelect'].includes(type) && (
                    <div className={styles.input_wrap}>
                        <Input
                            allowClear
                            showCount
                            maxLength={10}
                            value={placeholder}
                            className={styles.input}
                            placeholder={'请输入提示文本'}
                            onChange={(e) => {
                                handleEdit(pindex, { placeholder: e.target.value });
                            }}
                        />
                    </div>
                )}
                {/* 自定义下拉选项 */}
                {Array.isArray(customOptions) ? (
                    <div className={styles.select_options}>
                        <Button className={styles.add_btn} type="link" style={{ padding: '0' }} onClick={onAddCustomOptions}>
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

export default DynamicFormEditor;
