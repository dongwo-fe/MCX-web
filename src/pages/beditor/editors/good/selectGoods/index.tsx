import { Button, Form, Input, Row, Col, Table, Modal, DatePicker, message } from 'antd';
import './index.scss';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ColumnsType } from 'antd/es/table';
import { FormInstance } from 'antd/es/form/Form';
import { useUpdate } from "ahooks";
import CitySelect from '@/component/AuthSelects/citySelect';
import { listSkuByCondition, iGoodsData } from '@/api/goods';
import dayjs from 'dayjs';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import ShopSelect from '@/component/AuthSelects/shopSelect';

interface IFilterData {
    activityId: string | undefined;
    activityStatus: string | undefined;
    date: Array<any>;
    name: string | undefined;
}

const { RangePicker } = DatePicker;

const FilterCom = (props: { onSearch?: () => void; onFinish?: () => void; onReset?: () => void; form: FormInstance }) => {
    const [cityId, setCityId] = useState<string>('');
    const update = useUpdate();

    const onFinish = () => {
        props.onFinish && props.onFinish();
    };

    //重置
    const onReset = () => {
        props.onReset && props.onReset();
    };

    //查询
    const onSearch = () => {
        const { marketId, goodsSkuId } = (props.form && props.form.getFieldsValue()) || {};

        if (goodsSkuId || marketId) {
            props.onSearch && props.onSearch();
            return
        }
        message.warning('请选择卖场')
    };

    // 选项禁用状态
    const isDisable = (name: string) => {
        if (props.form) {
            if (props.form.getFieldValue(name)) {
                return false;
            }
            return true
        }
        return true

    }

    return (
        <Form onValuesChange={onFinish} form={props.form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Row>
                <Col span={11}>
                    <Form.Item name="cityStationId" label="城市：">
                        <CitySelect type="new" form={props.form} name="cityStationId"
                            //hasPage={true} 
                            onChange={() => {
                                update();
                                props.form && props.form.setFieldsValue({
                                    marketId: undefined,
                                    shopId: undefined,
                                    goodsTitle: undefined
                                });
                            }} />
                    </Form.Item>
                </Col>
                <Col span={13}>
                    <Form.Item name="marketId" label="卖场：">
                        <MarketSelect
                            onChange={() => {
                                update();
                                props.form && props.form.setFieldsValue({
                                    shopId: undefined,
                                    goodsTitle: undefined
                                });
                            }}
                            type="new"
                            params={
                                {
                                    cityStationId: props.form && props.form.getFieldValue("cityStationId"),
                                }
                            }
                            disabled={isDisable('cityStationId')}
                        />
                    </Form.Item>
                </Col>
                <Col span={11}>
                    <Form.Item name="shopId" label="店铺：">
                        <ShopSelect
                            type="new"
                            params={{
                                marketId: props.form && props.form.getFieldValue("marketId"),
                            }}
                            onChange={() => {
                                update();
                                props.form && props.form.setFieldsValue({
                                    goodsTitle: undefined,
                                });
                            }}
                            disabled={isDisable('marketId')}
                        />
                    </Form.Item>
                </Col>
                <Col span={13}>
                    <Form.Item label="商品名称" name="goodsTitle">
                        <Input disabled={isDisable('marketId')} placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={17}>
                    <Form.Item label="SKU编码" name="goodsSkuId">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={24} className="btn-right">
                    <Button onClick={onReset}>重置</Button>
                    <Button onClick={onSearch} type="primary" style={{ marginLeft: 20 }}>
                        查询
                    </Button>
                </Col>

            </Row>
        </Form>
    );
};

export default function SelectGoodsModal(props: any) {
    const editor = useSelector((state: any) => state.editor);
    const [form] = Form.useForm();
    const { visible, onSave, onCancel, defaultChecked } = props;
    const [rowKeys, setRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<Array<iGoodsData>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        page: 1,
        toatl: 0,
        pageSize: 10,
    });
    useEffect(() => {
        const rowKeys = defaultChecked.map((item: iGoodsData) => item.goodsId);
        setRowKeys(rowKeys);
    }, [visible]);
    // 选择商品
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            setRowKeys(selectedRowKeys);
        },
        selectedRowKeys: rowKeys,
    };
    //列表数据
    //列表数据
    const columns: ColumnsType<iGoodsData> = [
        {
            title: 'SKU编码',
            dataIndex: 'goodsSkuId',
            key: 'goodsSkuId',
            width: 180,
        },
        {
            title: '商品名称',
            dataIndex: 'goodsTitle',
            width: 240,
            key: 'goodsTitle',
        },
        {
            title: '商品类目',
            dataIndex: 'goodsCategoryName',
            key: 'goodsCategoryName',
            width: 160,
        },
        {
            title: '品牌',
            dataIndex: 'goodsBrandName',
            key: 'goodsBrandName',
            width: 120,
        },
        {
            title: '商品售价(元)',
            dataIndex: 'goodsPrice',
            width: 120,
            key: 'goodsPrice',
        },
        {
            title: '商品状态',
            dataIndex: 'goodsStatus',
            width: 120,
            key: 'goodsStatus',
            render: (text) => (text === 10 ? '上架' : text === 20 ? '下架' : '-'),
        },
        {
            title: '城市站',
            dataIndex: 'cityName',
            width: 200,
            key: 'cityName',
            render: (text) => (text || '-'),
        },
        {
            title: '所属卖场',
            dataIndex: 'marketName',
            width: 200,
            key: 'marketName',
            render: (text) => (text || '-'),
        },
        {
            title: '所属店铺',
            dataIndex: 'shopName',
            width: 200,
            key: 'shopName',
            render: (text) => (text || '-'),
        },
    ];
    const queryList = async (params: any) => {
        setLoading(true);
        try {
            const { page } = params || {};
            const publishedStart = params?.publishedTime?.[0] && dayjs(params.publishedTime[0]).format("YYYY-MM-DD HH:mm:ss");
            const publishedEnd = params?.publishedTime?.[1] && dayjs(params.publishedTime[1]).format("YYYY-MM-DD HH:mm:ss");
            const parms = {
                page: page || 1,
                pageSize: params.pageSize || pagination.pageSize,
                ...params,
                publishedStart,
                publishedEnd
            };
            delete parms.publishedTime;
            const data: any = await listSkuByCondition(parms);
            if (data) {
                setPagination({ page: page || 1, toatl: data.total, pageSize: parms.pageSize });
                setDataSource(data.list);
            }
        } catch (error: any) {
            message.warning(error.message)
        }
        setLoading(false);
    };

    // 重置
    const onReset = () => {
        form.resetFields();
        setPagination({ page: 1, toatl: 0, pageSize: 10 });
        setDataSource([]);
    };
    // 分页切换
    const onChange = (page: number, pageSize: number) => {
        const data = form.getFieldsValue();
        queryList({ page, pageSize, ...data });
    };

    // 分页切换
    const onSearch = () => {
        const data = form.getFieldsValue();
        queryList({ page: 1, ...data });
    };

    const onSubmit = () => {
        onCancel();
        if (rowKeys.length) {
            const data = dataSource.filter((item) => rowKeys.includes(item.goodsSkuId));
            onSave(data);
            console.log('%c [ data ]-251', 'font-size:13px; background:pink; color:#bf2c9f;', data);
        }
    };

    return (
        // title="选择商品" okText="确定" cancelText="取消" width={1200} visible={visible} onOk={onSubmit} onCancel={onCancel}
        <div className='active-landing-two'>
            <div className='active-header-box'>
                <div>选择商品</div>
                <div onClick={onCancel} className='common-flex'>
                    <div className='line-part' />
                    <img className='close-icon' src="https://ossprod.jrdaimao.com/file/1683597684356175.png" />
                </div>
            </div>
            <div className='fliter-box'>
                <FilterCom form={form} onSearch={onSearch} onReset={onReset} />
            </div>
            <div className='table-wrap'>
                <Table
                    rowKey={(record) => record.goodsSkuId}
                    columns={columns}
                    bordered={false}
                    dataSource={dataSource}
                    scroll={{ y: 300 }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.pageSize,
                        total: pagination.toatl,
                        onChange,
                        showSizeChanger: true,
                        showTotal: (total: number) => `共 ${total} 条数据`,
                    }}
                    loading={loading}
                    rowSelection={{
                        type: 'checkbox',
                        preserveSelectedRowKeys: true,
                        ...rowSelection,
                    }}
                />
            </div>
            <Row>
                <Col span={24} className="btn-right">
                    <Button onClick={onSubmit} type="primary" style={{ marginTop: 20 }}>
                        确定
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
