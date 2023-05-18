// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, message } from 'antd';
import PlaceSearch from './TableSearch';
import moment from 'moment';
import { queryLandingPageCoupons } from '@/api/activeLandingPage';
import { couponSendTypes } from './dataBook';
import { createID } from '@/utils/tools';
const list = ({ visible = false, listChange, title, setChoosed, defaultChecked }: any) => {
    const [dataSource, setDataSource] = useState([]);
    const [rowKeys, setRowKeys] = useState([]);
    const [checked, setChecked] = useState([]);

    //列表加载
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    // 记住列表请求参数
    const [queryParams, setQueryParams] = useState({});
    // 分页配置
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total: string) => `共${total}条数据`,
    });

    useEffect(() => {
        if (visible) {
            getList(1, 10);
            //找出列表里包含的发券id，并去重
            let choosedSendId: any = [];
            defaultChecked.forEach((item: any) => {
                choosedSendId.push(item.couponSendId);
            });
            choosedSendId = [...new Set(choosedSendId)];
            setRowKeys(choosedSendId);
            setChecked(defaultChecked);
        } else {
            setDataSource([]);
            setChecked([]);
            setRowKeys([]);
        }
    }, [visible]);

    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [queryParams]);

    // 表单搜索
    const onSearch = (values: any) => {
        setPagination({
            ...pagination,
            current: 1,
            pageSize: 10,
        });
        setQueryParams({
            ...values,
            page: 1,
            pageSize: pagination.pageSize,
        });
    };

    // 表单重置查询
    const onReset = () => {
        setPagination({
            ...pagination,
            current: 1,
            pageSize: 10,
        });
        setQueryParams({});
    };

    const getList = async (page: number, pageSize: number) => {
        setLoading(true);
        queryParams.couponSendStart = queryParams.couponValidity && moment(queryParams.couponValidity[0]).format('YYYY-MM-DD') + ' 00:00:00';
        queryParams.couponSendEnd = queryParams.couponValidity && moment(queryParams.couponValidity[1]).format('YYYY-MM-DD') + ' 23:59:59';
        // queryParams.couponSendStatusSet = [2,3];
        delete queryParams.couponValidity;
        delete queryParams.page;
        delete queryParams.pageSize;
        try {
            const data = await queryLandingPageCoupons({ page, pageSize, ...queryParams });
            if (data) {
                const { list } = data;
                if (list) {
                    setDataSource(list);
                } else {
                    setDataSource([]);
                }
                setPagination({
                    ...pagination,
                    total: data.total,
                });
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    // 按钮触发提交
    const onSubmit = () => {
        if (rowKeys && rowKeys.length && rowKeys[0]) {
            setBtnLoading(true);
            listChange(false);
            //根据已选的couponSendId 找到下面的券 然后再提交出去
            let arr: any[] = [];
            dataSource.map((item: any) => {
                if (rowKeys.indexOf(item.couponSendId) !== -1) {
                    item.coupons.forEach((item2: any) => {
                        item2.couponSendName = item.couponSendName;
                        item2.couponSendId = item.couponSendId;
                        arr.push(item2);
                    });
                }
            });
            setChoosed(arr);
        } else {
            message.error('请勾选发券');
        }
    };
    const onCancel = () => {
        listChange(false);
        setDataSource([]);
        setChecked([]);
        setRowKeys([]);
    };

    const rowSelection = {
        selectedRowKeys: rowKeys,
        onChange: (selectedRowKeys: any) => {
            // let arr=[];
            // selectedRows.forEach(item=>{
            //   item.coupons.forEach(item2=>{
            //     item2.couponSendName=item.couponSendName;
            //     item2.couponSendId=item.couponSendId;
            //     arr.push(item2)
            //   })
            // })
            // console.log(arr,selectedRows,'rororro');
            // setChecked(arr);
            setRowKeys(selectedRowKeys);
        },
    };
    //分页改变
    const handleChange = (page: any) => {
        pagination.current = page.current;
        pagination.pageSize = page.pageSize;
        pagination.total = page.total;
        setPagination({ ...pagination });
        setQueryParams({
            ...queryParams,
            page: page.current,
            pageSize: page.pageSize,
        });
    };
    const activityColumns = [
        {
            title: '发券编号',
            key: 'couponSendId',
            dataIndex: 'couponSendId',
            width: 130,
        },
        {
            title: '发券名称',
            key: 'couponSendName',
            dataIndex: 'couponSendName',
            width: 120,
        },
        {
            title: '发券时间',
            key: 'couponSendStart',
            dataIndex: 'couponSendStart',
            width: 200,
            render: (text: any, row: any) => {
                return (
                    <div>
                        {text}-{row.couponSendEnd}
                    </div>
                );
            },
        },
        {
            title: '发券状态',
            key: 'couponSendStatus',
            dataIndex: 'couponSendStatus',
            render: (text: any) => {
                return text === 2 ? '未生效' : text === 3 ? '进行中' : '';
            },
        },
        {
            title: '发券类型',
            key: 'couponSendWay',
            dataIndex: 'couponSendWay',
            render: (text: any) => {
                return couponSendTypes.map((item) => {
                    if (text !== null && Number(text) === item.id) {
                        return item.text;
                    }
                });
            },
        },
    ];

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            onOk={onSubmit}
            title={title}
            maskClosable={false}
            width={850}
            footer={[
                <Button key="submit" onClick={onSubmit} type="primary" loading={btnLoading}>
                    确认
                </Button>,
                <Button key="back" onClick={onCancel}>
                    取消
                </Button>,
            ]}
        >
            <PlaceSearch onSearch={onSearch} onReset={onReset} queryParams={queryParams} />

            <Table
                rowSelection={rowSelection}
                rowKey="couponSendId"
                dataSource={dataSource}
                columns={activityColumns}
                pagination={pagination as any}
                loading={loading}
                onChange={handleChange}
                scroll={{ y: 300}}
            />
        </Modal>
    );
};
export default list;
