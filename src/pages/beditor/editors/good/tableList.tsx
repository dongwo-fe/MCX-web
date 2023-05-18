import { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge } from 'antd';
import PlaceSearch from './tableSearch';
import moment from 'moment';
import { queryCampaignList, queryCouponList } from '@/api/goods';

const list = ({ visible = false, closeModal, title, num, comfirmSure, affirm }: any) => {
    // 活动内容列表
    const [dataSource, setDataSource] = useState([]);
    // 选择的活动编号 ID
    const [rowKeys, setRowKeys] = useState(affirm ? [affirm.campaignId || affirm.couponBatchNo] : []);
    // 所选择的活动的详细信息
    const [checked, setChecked] = useState(affirm ? [affirm] : []);
    // 列表加载
    const [loading, setLoading] = useState(false);
    // 记住列表请求参数
    const [queryParams, setQueryParams] = useState<any>({});
    // 分页配置
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total: number) => `共${total}条数据`,
    });

    useEffect(() => {
        if (visible && num != 0) {
            getList(1, 10);
        } else {
            setDataSource([]);
            setChecked([]);
            setRowKeys([]);
        }
    }, [visible]);

    //  搜索条件变化
    useEffect(() => {
        getList(pagination.current, pagination.pageSize);
    }, [queryParams]);

    // 获取筛选类型数据
    const getList = (page: number, pageSize: number) => {
        setLoading(true);
        if (num === 1) {
            // 活动
            queryParams.campaignStartTime = queryParams.time && moment(queryParams.time[0]).format('YYYY-MM-DD HH:mm:ss');
            queryParams.campaignEndTime = queryParams.time && moment(queryParams.time[1]).format('YYYY-MM-DD HH:mm:ss');
            queryCampaignList({ page, pageSize, ...queryParams })
                .then((res: any) => {
                    if (res) {
                        setDataSource(res.rows);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // 优惠券
            queryParams.couponValidityStart = queryParams.time && moment(queryParams.time[0]).format('YYYY-MM-DD HH:mm:ss');
            queryParams.couponValidityEnd = queryParams.time && moment(queryParams.time[1]).format('YYYY-MM-DD HH:mm:ss');
            queryParams.couponStatusList = ['2', '3'];
            queryCouponList({ page, pageSize, ...queryParams })
                .then((res: any) => {
                    if (res) {
                        const { list } = res;
                        list && setDataSource(list);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

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
        // 清空搜索数据
        setQueryParams({});
    };

    // 按钮触发提交
    const onSubmit = (e: any) => {
        console.log('提交', checked, rowKeys);
        if (num === 1) {
            comfirmSure({
                ...checked[0],
                typeName: '活动名称',
            });
            closeModal(false);
        } else {
            comfirmSure({
                ...checked[0],
                typeName: '优惠卷名称',
            });
            closeModal(false);
        }
    };
    const onCancel = () => {
        closeModal(false);
        setDataSource([]);
        setChecked([]);
        setRowKeys([]);
    };

    const rowSelection: any = {
        type: 'radio',
        selectedRowKeys: rowKeys,
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setChecked(selectedRows);
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
    const couponColumns = [
        {
            title: '优惠券编号',
            dataIndex: 'couponBatchNo',
            key: 'couponBatchNo',
            width: 150,
        },
        {
            title: '优惠券名称',
            dataIndex: 'couponName',
            key: 'couponName',
            width: 120,
            ellipsis: true,
        },
        {
            title: '优惠券类型',
            dataIndex: 'couponType',
            key: 'couponType',
            width: 120,
            render: (text: any) => {
                let arr = ['满减券'];
                return <div>{arr[0]}</div>;
            },
        },
        {
            title: '有效期时间',
            dataIndex: 'couponValidityStart',
            key: 'couponValidityStart',
            width: 300,
            render: (text: any, record: any) => {
                return (
                    <div>
                        {record.couponValidityStart} ~ {record.couponValidityEnd}
                    </div>
                );
            },
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 150,
        },
        {
            title: '优惠券状态',
            dataIndex: 'couponStatus',
            key: 'couponStatus',
            width: 150,
            render: (text: number) => {
                let obj = {
                    color: '',
                    str: '',
                };
                switch (text) {
                    case 2:
                        obj = {
                            color: '#FAAD14',
                            str: '未开始',
                        };
                        break;
                    case 3:
                        obj = {
                            color: '#48B313',
                            str: '进行中',
                        };
                        break;
                    default:
                        break;
                }
                return (
                    <div>
                        <span style={{ color: obj.color }}>
                            <Badge color={obj.color} />
                            {obj.str}
                        </span>
                    </div>
                );
            },
        },
    ];

    const activityColumns = [
        {
            title: '活动编号',
            dataIndex: 'campaignId',
            key: 'campaignId',
            width: 200,
        },
        {
            title: '活动名称',
            dataIndex: 'campaignName',
            key: 'campaignName',
            width: 150,
            ellipsis: true,
        },
        {
            title: '活动类型',
            dataIndex: 'campaignType',
            key: 'campaignType',
            width: 100,
            render: (text: number) => {
                let arr = ['满减满折', '抽奖', '秒杀'];
                return <div>{text ? arr[text - 1] : '-'}</div>;
            },
        },
        {
            title: '有效期时间',
            dataIndex: 'campaignStartTime',
            key: 'campaignStartTime',
            width: 350,
            render: (text: any, record: any) => {
                return (
                    <div>
                        {record.campaignStartTime} ~ {record.campaignEndTime}
                    </div>
                );
            },
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            width: 150,
        },
        {
            title: '活动状态',
            dataIndex: 'campaignStatus',
            key: 'campaignStatus',
            width: 150,
            render: (text: number) => {
                let obj = {
                    color: '',
                    str: '',
                };
                switch (text) {
                    case 2:
                        obj = {
                            color: '#FAAD14',
                            str: '未开始',
                        };
                        break;
                    case 3:
                        obj = {
                            color: '#48B313',
                            str: '进行中',
                        };
                        break;
                    default:
                        break;
                }
                return (
                    <div>
                        <span style={{ color: obj.color }}>
                            <Badge color={obj.color} />
                            {obj.str}
                        </span>
                    </div>
                );
            },
        },
    ];

    return (
        <Modal visible={visible} onCancel={onCancel} onOk={onSubmit} title={title} maskClosable={false} width={850}>
            <PlaceSearch onSearch={onSearch} onReset={onReset} queryParams={queryParams} type={num} />
            <div
                style={{
                    fontSize: '14px',
                    color: '#FF4D4F',
                    lineHeight: '22px',
                    marginTop: '-20px',
                    marginBottom: '12px',
                }}
            >
                仅可选择“未开始”或“进行中”活动。若尚未创建活动，请创建后勾选。
            </div>
            <div
                style={{
                    maxWidth: 850,
                    overflow: 'hidden',
                    overflowX: 'scroll',
                }}
            >
                <Table
                    rowSelection={rowSelection}
                    rowKey={(row) => (num === 1 ? row.campaignId : num === 2 ? row.couponBatchNo : [])}
                    dataSource={dataSource}
                    columns={num === 1 ? activityColumns : num === 2 ? couponColumns : []}
                    pagination={pagination}
                    loading={loading}
                    onChange={handleChange}
                />
            </div>
        </Modal>
    );
};
export default list;
