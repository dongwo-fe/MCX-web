import { Button, Form, Input, Row, Col, Table, Modal, Select } from 'antd';
import './index.scss';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ColumnsType } from 'antd/es/table';
import { FormInstance } from 'antd/es/form/Form';
import { getShopList, iShopData } from '@/api/shops';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import CitySelect from '@/component/AuthSelects/citySelect';

interface IFilterData {
    activityId: string | undefined;
    activityStatus: string | undefined;
    date: Array<any>;
    name: string | undefined;
}

const FilterCom = (props: { onSearch?: () => void; onFinish?: () => void; onReset?: () => void; form: FormInstance }) => {
    const [cityId, setCityId] = useState<string>('');
    const onFinish = () => {
        // setCityId(props.form.getFieldValue('cityId'));
        props.onFinish && props.onFinish();
    };
    const onCityChange = (cityId: any) => {
        const data = {
            cityId: cityId,
            marketId: undefined,
        };
        setCityId(cityId);
        props.form.setFieldsValue(data);
    };
    //重置
    const onReset = () => {
        setCityId('');
        props.onReset && props.onReset();
    };

    //查询
    const onSearch = () => {
        props.onSearch && props.onSearch();
    };

    return (
        <Form onValuesChange={onFinish} form={props.form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Row>
                <Col span={8}>
                    <Form.Item label="店铺编号" name="shopCode">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="品牌名称" name="brandName">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="摊位号" name="boothId">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="城市" name="cityId">
                        <CitySelect onChange={onCityChange} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item dependencies={['cityId']} label="卖场名称" name="marketId">
                        <MarketSelect
                            params={{
                                cityId: cityId,
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="店铺名称" name="shopName">
                        <Input placeholder="请输入" />
                        {/* <Select filterOption={true} mode="multiple" placeholder={'请选择'} allowClear>
                            {shopList.map((shop: any) => {
                                return (
                                    <Select.Option key={shop.value} value={shop.shopId}>
                                        {shop.shopName}
                                    </Select.Option>
                                );
                            })}
                        </Select> */}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item>
                        <Button onClick={onSearch} type="primary" style={{ marginRight: 20 }}>
                            查询
                        </Button>
                        <Button onClick={onReset}>重置</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default function SelectShopModal(props: any) {
    const editor = useSelector((state: any) => state.editor);
    const [form] = Form.useForm();
    const { visible, onSave, onCancel, defaultChecked } = props;
    const [rowKeys, setRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<Array<iShopData>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        page: 1,
        toatl: 0,
        pageSize: 10,
    });
    // 选择商品
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            setRowKeys(selectedRowKeys);
        },
        selectedRowKeys: rowKeys,
    };
    //列表数据
    const columns: ColumnsType<iShopData> = [
        {
            title: '店铺编号',
            dataIndex: 'shopCode',
            key: 'shopCode',
            width: 100,
        },
        {
            title: '店铺',
            dataIndex: 'shopName',
            width: 100,
            key: 'shopName',
        },
        {
            title: '卖场',
            dataIndex: 'marketName',
            width: 100,
            key: 'marketName',
        },
        {
            title: '品牌',
            dataIndex: 'brandName',
            key: 'brandName',
            width: 100,
        },
        {
            title: '摊位号',
            dataIndex: 'boothId',
            key: 'boothId',
            width: 100,
        },
    ];
    const queryList = async (params: any) => {
        setLoading(true);
        try {
            const { page, cityId } = params || {};
            const parms = {
                bizSource: '1',
                page: page || 1,
                pageSize: params.pageSize || pagination.pageSize,
                ...params,
                cityStationId: cityId,
            };
            const data = await getShopList(parms);
            if (data) {
                setPagination({ page: page || 1, toatl: data.total, pageSize: parms.pageSize });
                setDataSource(data.list);
            }
        } catch (error) {}
        setLoading(false);
    };

    useEffect(() => {
        queryList({ page: 1 });
        const rowKeys = defaultChecked.map((item: iShopData) => item.shopId);
        setRowKeys(rowKeys);
    }, [visible]);
    // 重置
    const onReset = () => {
        form.resetFields();
        queryList({ page: 1 });
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
        if (rowKeys.length) {
            const data = dataSource.filter((item) => rowKeys.includes(item.shopId));
            onSave(data);
        }
    };

    return (
        <Modal title="选择店铺" okText="确定" cancelText="取消" width={1200} visible={visible} onOk={onSubmit} onCancel={onCancel}>
            <div className={'active-landing'}>
                <div>
                    <div>
                        <FilterCom form={form} onSearch={onSearch} onReset={onReset} />
                    </div>
                    <div className={'table-wrap'}>
                        <Table
                            rowKey="shopId"
                            columns={columns}
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
                </div>
            </div>
        </Modal>
    );
}
