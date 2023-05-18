import React, { useEffect, useState } from 'react';
import { Input, Row, Button, Form, Col, DatePicker, Select } from 'antd';

import './index.scss';
const { Option } = Select;

const { RangePicker }: any = DatePicker;
const TableSearch = ({ onSearch, onReset, type, queryParams = {} }: any) => {
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
            <Form form={form} onFinish={onFinish} labelCol={{ span: 7 }} wrapperCol={{ span: 16 }}>
                <Row>
                    {type === 1 ? (
                        <>
                            <Col span={12}>
                                <Form.Item name="campaignType" label="活动类型：">
                                    <Select placeholder="请输入" className="search-input">
                                        <Option value={1}>满减满折</Option>
                                        <Option value={2}>抽奖</Option>
                                        <Option value={3}>秒杀</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="time" label="活动日期：">
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="campaignName" label="活动名称：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="campaignId" label="活动编号：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="creator" label="活动创建人：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                        </>
                    ) : type === 2 ? (
                        <>
                            <Col span={12}>
                                <Form.Item name="time" label="优惠券有效期：">
                                    <RangePicker />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="couponName" label="优惠券名称：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="couponBatchNo" label="优惠券编号：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="creator" label="优惠券创建人：">
                                    <Input placeholder="请输入" className="search-input" />
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        ''
                    )}

                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                                重置
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default TableSearch;
