import React, { useEffect, useState } from 'react';
import { Input, Row, Button, Form, Col, DatePicker, Select } from 'antd';

import './index.less';
const { Option } = Select;

const RangePicker: any = DatePicker.RangePicker;
const TableSearch = ({ onSearch, onReset, queryParams = {} }: any) => {
    const [form] = Form.useForm();
    const [searchData, setSearchData] = useState({
        searchForm: {
            ...queryParams,
        },
    });
    useEffect(() => {
        form.setFieldsValue({ ...queryParams });
    }, [queryParams]);

    // 表单搜索
    const onFinish = (values: any) => {
        setSearchData({
            ...searchData,
            searchForm: {
                ...values,
            },
        });
        onSearch(values);
    };

    // 表单重置查询
    const onCancel = () => {
        form.resetFields();
        setSearchData({
            ...searchData,
            searchForm: {},
        });
        onReset();
    };

    return (
        <div className="search-form-wrap">
            <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }}>
                <Row>
                    <Col span={12}>
                        <Form.Item name="couponSendStatus" label="发券状态">
                            <Select placeholder="请输入" className="search-input" allowClear>
                                <Option key={2} value={2}>
                                    未生效
                                </Option>
                                <Option key={3} value={3}>
                                    进行中
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="couponValidity" label="发券日期">
                            <RangePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="couponSendName" label="发券名称">
                            <Input placeholder="请输入" className="search-input" maxLength={15} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="couponSendId" label="发券编号">
                            <Input placeholder="请输入" className="search-input" maxLength={30} />
                        </Form.Item>
                    </Col>
                    <Col push={12} span={12} className="form_btns">
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default TableSearch;
