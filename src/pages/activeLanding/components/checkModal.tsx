import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Select, Table } from 'antd';
import { queryDataCollect } from '@/api/topicApi';
import './index.less';
import moment from 'moment';

const { Option } = Select;

/**
 * 列表查看弹窗
 */
const CheckModal = (props: any, ref: any) => {
    const [promoteVisible, setPromoteVisible] = useState(false);
    const [recordData, setCecord] = useState<any>({});
    const [checkModalData, setCheckModalData] = useState<any>(null);
    const [activityId, setActivityId] = useState('');

    useImperativeHandle(ref, () => ({
        showModal: (res: any) => {
            setPromoteVisible(true);
            console.log('---record数据-', res);
            setCecord(res);
            setActivityId(res.lid);
            getCheckData(res.lid, '');
        },
    }));

    // 获取查看全部的数据
    const getCheckData = async (value: string, id: any) => {
        const params = {
            activityId: value,
            channelId: id || null,
        };
        try {
            const checkData = await queryDataCollect(params);
            if (checkData != null) {
                setCheckModalData(checkData);
            }
        } catch (error) {}
    };

    // 关闭
    const handleCancel = () => {
        setPromoteVisible(false);
    };

    // 修改查看数据的方式
    const changeCheckType = (value: any) => {
        getCheckData(activityId, value);
    };

    // 数据组合
    const columns = [
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            className: 'diff-header',
        },
        {
            title: 'PV',
            dataIndex: 'pv',
            key: 'pv',
            className: 'diff-header',
        },
        {
            title: 'UV',
            dataIndex: 'uv',
            key: 'uv',
            className: 'diff-header',
        },
        {
            title: '分享次数',
            key: 'share',
            dataIndex: 'share',
            className: 'diff-header',
        },
        {
            title: '表单提交',
            key: 'submit',
            dataIndex: 'submit',
            className: 'diff-header',
        },
        {
            title: '新用户数',
            key: 'newUser',
            dataIndex: 'newUser',
            className: 'diff-header',
        },
        {
            title: '下单用户',
            key: 'order',
            dataIndex: 'order',
            className: 'diff-header',
        },
        {
            title: '成交金额',
            key: 'money',
            dataIndex: 'money',
            className: 'diff-header',
        },
    ];

    const dealTableData = () => {
        if (checkModalData != null) {
            let firstTable = {};
            firstTable = {
                key: '1',
                time: '小记',
                pv: checkModalData.visitorNumSum || 0,
                uv: checkModalData.uniqueVisitorNumSum || 0,
                share: checkModalData.shareNumSum || 0,
                submit: checkModalData.submitNumSum || 0,
                newUser: checkModalData.registerUserNumSum || 0,
                order: checkModalData.placeOrderUserNumSum || 0,
                money: checkModalData.tradingVolumeSum || 0,
            };

            let list = [firstTable];
            let table: any = {};
            checkModalData.operActivityDataCollectVOList &&
                checkModalData.operActivityDataCollectVOList.forEach((item: any) => {
                    table.time = item.time;
                    table.pv = item.visitorNum;
                    table.uv = item.uniqueVisitorNum;
                    table.share = item.shareNum;
                    table.submit = item.submitNum;
                    table.newUser = item.registerUserNum;
                    table.order = item.placeOrderUserNum;
                    table.money = item.tradingVolume;
                    list.push(table);
                });
            return list;
        }
        return [];
    };

    // 列表渲染
    const tables = () => {
        return (
            <div className="check-modal-contain">
                <div className="title-check">数据汇总</div>
                <div className="title-time">
                    页面有效期{moment(recordData.date_start).format('YYYY-MM-DD')}至{moment(recordData.date_end).format('YYYY-MM-DD')}
                </div>
                {checkModalData == null ? (
                    <div></div>
                ) : (
                    <div className="all-tabs-contain">
                        <Select defaultValue={'全部渠道'} onChange={changeCheckType} size="large" style={{ width: 120 }}>
                            <Option value={''}>全部渠道</Option>
                            {checkModalData.channelList &&
                                checkModalData.channelList.map((item: any, index: number) => {
                                    return item.id !== '' ? (
                                        <Option key={index} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ) : (
                                        <></>
                                    );
                                })}
                        </Select>
                    </div>
                )}
                <div style={{ padding: '0 30px 50px 30px', maxHeight: 500 }}>
                    <Table style={{ marginTop: 20 }} scroll={{ y: 400 }} pagination={false} bordered={true} columns={columns} dataSource={dealTableData()} />
                </div>
            </div>
        );
    };

    return (
        <div>
            <Modal title={'落地页数据'} className="preview-h5" visible={promoteVisible} onCancel={handleCancel} footer={false} maskClosable={false} destroyOnClose width={1000}>
                {tables()}
            </Modal>
        </div>
    );
};
export default forwardRef(CheckModal);
