import React, { useMemo, useState } from 'react';
import { Button, Modal, Radio, Row, Select, Space, Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import {
    batchNoteTemplateList,
    cardTypeStr,
    colorTypes,
    colorTypeStr,
    getWayTypeToCardStyle,
    onceNoteTemplateList
} from './config';
import Upload from '../banner/upload';
import TableList from './tableList';
import { iEditorCoupons, iCouponsListItem } from '@/store/config';
import RegistorInfo from '../component/registorInfo';
import ShowTypeComp from '../component/showTypeComp';
const { confirm } = Modal;

interface iProps {
    data: iEditorCoupons;
}

const CouponsEditor = ({ data: { id } }: iProps) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<iEditorCoupons>({ id });
    const [imgIndex, setImgIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [activeKey, setActiveKey] = useState('styles');

    const listChange = (bool: boolean) => {
        setVisible(bool);
    };
    const listChange2 = (bool: boolean) => {
        setVisible2(bool);
    };
    const setChoosed = (list: any[]) => {
        handleChangeItemValue('list', list);
    };
    const setChoosed2 = (list: any[]) => {
        handleChangeItemValue('list2', list);
    };

    const uPdownClick = (type: number, index: number, step: number) => {
        if (type === 1) {
            const toIndex = index + step;
            let list = data.list.slice();
            list[toIndex] = list.splice(index, 1, list[toIndex])[0];
            handleChangeItemValue('list', list);
        } else if (type === 2 && data.list2) {
            const toIndex = index - 1;
            let list = data.list2.slice();
            list[toIndex] = list.splice(index, 1, list[toIndex])[0];
            handleChangeItemValue('list2', list);
        }
    };

    // 删除二次确认弹窗
    const showPromiseConfirm = (row: any, type: number, index: number) => {
        confirm({
            title: '确定删除优惠券吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                delRow(row, type, index);
            },
            onCancel() {},
        });
    };

    const delRow = (row: any, type: number, index: number) => {
        if (type === 1) {
            const list = [...data.list];
            list.splice(index, 1);
            handleChangeItemValue('list', list);
        } else if (type === 2 && data.list2) {
            const list = [...data.list2];
            list.splice(index, 1);
            handleChangeItemValue('list2', list);
        }
    };
    const activityColumnsOpt = (type: number) => {
        const list = type === 1 ? data.list : data.list2;
        let activityColumns = [
            {
                title: '优惠券批次号',
                key: 'couponBatchNo',
                dataIndex: 'couponBatchNo',
                width: 100,
            },
            {
                title: '发券名称',
                key: 'couponSendName',
                dataIndex: 'couponSendName',
                width: 88,
            },
            {
                title: '券面金额',
                key: 'couponAmount',
                dataIndex: 'couponAmount',
                width: 88,
                render: (text: any) => {
                    if (text || text === 0) {
                        return `${text}元`;
                    } else {
                        return '';
                    }
                },
            },
            {
                title: '操作',
                width: 110,
                fixed: 'right',
                render: (text: any, row: any, index: number) => {
                    return (
                        <Space>
                            {
                                //上移
                                index !== 0 ? (
                                    <a onClick={() => uPdownClick(type, index, -1)}>
                                        <ArrowUpOutlined />
                                    </a>
                                ) : (
                                    ''
                                )
                            }

                            {
                                //下移
                                index !== (list && list.length - 1) || 0 ? (
                                    <a onClick={() => uPdownClick(type, index, 1)}>
                                        <ArrowDownOutlined />
                                    </a>
                                ) : (
                                    ''
                                )
                            }
                            <a onClick={() => showPromiseConfirm(row, type, index)}>删除</a>
                        </Space>
                    );
                },
            },
        ];
        return activityColumns as any;
    };

    const handleImageChange = (list: any) => {
        console.log('%c [ list ]-121', 'font-size:13px; background:pink; color:#bf2c9f;', list);
        handleChangeItemValue('imageUrl', list);
    };
    const handleImageChange13 = (list: any) => {
        handleChangeItemValue('imageUrl2', list);
    };
    const noteTemplateList = data.getWay === 'single' ? onceNoteTemplateList : batchNoteTemplateList;
    const previewTemplateText = useMemo(() => {
        return noteTemplateList.find(item => item.id === data.msgTemplateId)?.content;
    }, [data.msgTemplateId, noteTemplateList]);
    return (
        <div id="coupons-module">
            <div className="form_editor_tabs">
                <div onClick={() => setActiveKey('styles')} className={`form_editor_tab ${ activeKey === 'styles' ? 'active' : '' }`}>样式<div className="tab_bar"></div></div>
                <div onClick={() => setActiveKey('actions')} className={`form_editor_tab ${ activeKey === 'actions' ? 'active' : '' }`}>交互<div className="tab_bar"></div></div>
            </div>
            {activeKey === 'styles' && <div>
            <ShowTypeComp id={id} />
            <Row align="middle" className="item-wrap">
                <div className={'title-label'}>领取方式</div>
                <Radio.Group
                    value={data.getWay}
                    onChange={(e) => {
                        handleChangeItemValue('getWay', e.target.value);
                        handleChangeItemValue('style', getWayTypeToCardStyle[e.target.value][0].type);
                        const list = e.target.value === 'single' ? onceNoteTemplateList : batchNoteTemplateList;
                        handleChangeItemValue('msgTemplateId', data.sendMessage === 0 ? undefined : list[0].id);
                    }}
                >
                    <Radio value={'single'}>逐张领取</Radio>
                    <Radio value={'all'}>一键领取</Radio>
                </Radio.Group>
            </Row>
            <div className={'item-wrap'}>
                <Row align="middle">
                    <div className={'title-label'}>卡片样式 </div>
                    <div>{cardTypeStr[data.style].title}</div>
                </Row>
                <Row justify="space-around">
                    {getWayTypeToCardStyle[data.getWay].map((v: any) => (
                        <div key={v.type} onClick={(e) => handleChangeItemValue('style', v.type)}>
                            <div className={`coupons-style-item ${data.style === v.type ? 'coupons-style-item_active' : ''}`}>
                                <img alt="" src={v.url} />
                            </div>
                            {v.title}
                        </div>
                    ))}
                </Row>
            </div>
            {![11, 12, 13].includes(data.style) && (
                <Row align="middle" className={'item-wrap coupons-color'}>
                    <Row align="middle">
                        <div className={'title-label'}>颜色</div>
                        <div>{colorTypeStr[data.colorType]}</div>
                    </Row>
                    <div className="coupons-color-row">
                        {colorTypes.map((v) => (
                            <div key={v.id} className={v.id === data.colorType ? 'coupon-color-button_active' : ''}>
                                <div className="coupons-color-button" onClick={() => handleChangeItemValue('colorType', v.id)}>
                                    <div className="coupon-color" style={{ backgroundColor: v.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <Radio.Group value={data.colorType} onChange={(e) => handleChangeItemValue('colorType', e.target.value)}>
                        <Radio className="color0" value={0}></Radio>
                        <Radio className="color1" value={1}></Radio>
                        <Radio className="color2" value={2}></Radio>
                        <Radio className="color3" value={3}></Radio>
                        <Radio className="color4" value={4}></Radio>
                    </Radio.Group> */}
                </Row>
            )}
            {data.style === 12 && (
                <div className="img-box">
                    <div className="img1">宽750像素</div>
                    <Upload value={data.imageUrl || []} onChange={handleImageChange} />
                </div>
            )}
            {data.style === 13 && (
                <div className="img-box">
                    <Row>
                        <div className={`img2 ${imgIndex === 0 ? 'img2_active' : ''}`} onClick={() => setImgIndex(0)}>
                            宽375像素
                        </div>
                        <div className={`img2 ${imgIndex === 1 ? 'img2_active' : ''}`} onClick={() => setImgIndex(1)}>
                            宽375像素
                        </div>
                    </Row>
                    {imgIndex === 0 && <Upload value={data.imageUrl} onChange={handleImageChange} />}
                    {imgIndex === 1 && <Upload value={data.imageUrl2 || []} onChange={handleImageChange13} />}
                </div>
            )}
            <Row align="middle" className="item-wrap">
                <div className={'title-label'}>发送短信</div>
                <Radio.Group
                    value={data.sendMessage}
                    onChange={e => {
                        handleChangeItemValue('sendMessage', e.target.value);
                        handleChangeItemValue('msgTemplateId', e.target.value === 0 ? undefined : noteTemplateList[0].id);
                    }}
                >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                </Radio.Group>
            </Row>
            {
                data.sendMessage ? <Row align="middle" justify="space-between" className="item-wrap">
                    <div className={'title-label'}>短信模板</div>
                    <Select
                        options={noteTemplateList}
                        fieldNames={{
                            label: 'content',
                            value: 'id'
                        }}
                        value={data.msgTemplateId}
                        onChange={(e) => handleChangeItemValue('msgTemplateId', e)}
                        placeholder='请选择短信模板' style={{ width: 200 }}>
                    </Select>
                </Row> : null
            }
            {
                data.msgTemplateId && previewTemplateText ? <div className='form-row' style={{padding: '24px 16px'}}>
                    <div className='preview-template'>
                        <div>短信预览：</div>
                        <p>{previewTemplateText}</p>
                    </div>
                </div> : null
            }
            <div className={'item-wrap'}>
                <div className={'title-label'}>配置优惠券</div>
                {/* <Table scroll={{ x: 500 }} columns={columns} dataSource={[]} /> */}
            </div>
            {data.style === 13 ? ( //双图券包
                <>
                    <div className={'item-wrap'}>
                        <Button style={{ width: '320px', marginLeft: 20, marginBottom: '20px', height: '40px' }} onClick={listChange.bind(this, true)}>
                            <PlusOutlined />
                            添加图1优惠券
                        </Button>
                        {data.list.length > 0 && (
                            <Table
                                rowKey={(record: iCouponsListItem) => {
                                    return record.couponBatchNo + record.couponSendId;
                                }}
                                dataSource={data.list}
                                columns={activityColumnsOpt(1)}
                                scroll={{ x: 375, y: 500 }}
                            />
                        )}
                    </div>
                    <div className={'item-wrap'}>
                        <Button style={{ width: '320px', marginLeft: 20, marginBottom: '20px', height: '40px' }} onClick={listChange2.bind(this, true)}>
                            <PlusOutlined />
                            添加图2优惠券
                        </Button>
                        {data.list2 && data.list2.length > 0 && (
                            <Table
                                rowKey={(record: iCouponsListItem) => {
                                    return record.couponBatchNo + record.couponSendId;
                                }}
                                dataSource={data.list2}
                                columns={activityColumnsOpt(2)}
                                scroll={{ x: 375, y: 500 }}
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className={'item-wrap'}>
                    <Button style={{ width: '320px', marginLeft: 20, marginBottom: '20px', height: '40px' }} onClick={listChange.bind(this, true)}>
                        <PlusOutlined />
                        添加优惠券
                    </Button>
                    {data.list.length > 0 && (
                        <Table
                            rowKey={(record: iCouponsListItem) => {
                                return record.couponBatchNo + record.couponSendId;
                            }}
                            dataSource={data.list}
                            columns={activityColumnsOpt(1)}
                            scroll={{ x: 375, y: 500 }}
                        />
                    )}
                </div>
            )}

            {visible && <TableList visible={visible} listChange={listChange} setChoosed={setChoosed} defaultChecked={data.list} title="选择优惠券" />}
            {visible2 && <TableList visible={visible2} listChange={listChange2} setChoosed={setChoosed2} defaultChecked={data.list2 || []} title="选择优惠券" />}
            </div>}
            {activeKey === 'actions' && <div style={{ marginLeft: 16 }}>
                <RegistorInfo showDoorverse={false} id={id} />
            </div>}
        </div>
    );
};

export default CouponsEditor;
