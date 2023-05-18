import { Button, Form, Input, Select, Row, Col, Table, message, Space, Tooltip, Modal, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.less';
import { activityOriginOptions, activityStatusOptions, activityPageTypeOptions } from './config';
import React, { useEffect, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { getTopicList, ITopicListFilterData, ITopicListItem, updateTopicState, exportActivityUserInfo, getTopicDetail } from '@/api/topicApi';
import moment from 'moment';
import PromoteModal from './components/promoteModal';
import { AuthWrapper } from '@/component/AuthWrapper';
import PreviewModal from './components/previewModal';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import { PlusOutlined } from '@ant-design/icons';
import CheckModal from './components/checkModal';
import { saveAs } from 'file-saver';
import { checkAuth } from '@/component/AuthWrapper/checkAuth';
import { getSessionStorage, getStorage, longStorageKeys, setSessionStorage, storageKeys } from '@/utils/storageTools';
import CitySelect from '@/component/AuthSelects/citySelect';
import ActiveReportStep, { ActivityReportStepEnum } from '@/component/activeReportStep';
import ActiveLandingItem from './components/activeLandingItem';
import NewPreviewModal from './components/newPreviewModal';
import TrendModal from './components/trendModal';

const FilterCom = (props: { isOperation: boolean; onFinish?: (values: ITopicListFilterData) => void; onSearch(values: ITopicListFilterData): void; onReset?: () => void }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [cityId, setCityId] = useState(undefined);
    const onFinish = () => {
        // console.log('%c [ values ]-23', 'font-size:13px; background:pink; color:#bf2c9f;', values);
        // props.onFinish && props.onFinish(values);
    };

    //重置
    const onReset = () => {
        form.resetFields();
        props.onReset && props.onReset();
    };

    // const onCityChange = (cityId: any) => {
    //     const data = {
    //         cityId: cityId,
    //         marketId: undefined
    //     };
    //     setCityId(cityId);
    //     form.setFieldsValue(data);
    // };

    return (
        <Form form={form} labelCol={{ span: 5 }}>
            <Row gutter={20}>
                <Col span={8}>
                    <Form.Item label={'活动ID'} name={'code'}>
                        <Input allowClear placeholder={'请输入'} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'标题'} name={'title'}>
                        <Input allowClear placeholder={'请输入'} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'模板来源'} name={'platform'}>
                        <Select allowClear placeholder={'请选择'}>
                            {activityOriginOptions.map((item) => {
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label={'启用状态'} name={'state'}>
                        <Select allowClear placeholder={'请选择'}>
                            {activityStatusOptions.map((item) => {
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="favorite" label="收藏">
                        <Select allowClear placeholder={'请选择'}>
                            <Select.Option key="1">已收藏</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                {/* <Col span={8}>
                    <Form.Item name="cityId" label="所属城市">
                        <CitySelect onChange={onCityChange} />
                    </Form.Item>
                </Col> */}
                {/* <Col span={8}>
                    <Form.Item name="marketId" dependencies={['cityId']} label="所属卖场">
                        <MarketSelect
                            params={{
                                cityId: cityId,
                            }}
                        />
                    </Form.Item>
                </Col> */}
                {/* {props.isOperation && (
                    <Col span={8}>
                        <Form.Item name="pageType" label="页面类型">
                            <Select allowClear placeholder={'请选择'}>
                                {activityPageTypeOptions.map((item) => {
                                    return (
                                        <Select.Option key={item.value} value={item.value}>
                                            {item.title}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                )} */}

                <Col className="form_btns" span={8}>
                    <Space size="large">
                        <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_ADD_GENERAL">
                            <Button icon={<PlusOutlined />} onClick={() => navigate('/beditor')} type="primary">
                                通用落地页
                            </Button>
                        </AuthWrapper>
                        <Button onClick={() => props.onSearch(form.getFieldsValue())} type="primary">
                            查询
                        </Button>
                        <Button onClick={onReset}>重置</Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};

export default function ActiveLanding() {
    const navigate = useNavigate();
    const PromoteModalRef = useRef<any>(null);
    const PreviewModalRef = useRef<any>(null);
    const NewPreviewModalRef = useRef<any>(null);
    const TrendModalRef = useRef<any>(null);
    const CheckUsemodalRef = useRef<any>(null);
    const [dataSource, setDataSource] = useState<Array<ITopicListItem>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterParams, setFilterParams] = useState<any>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        toatl: 0,
    });
    const platform = getSessionStorage(longStorageKeys.PLATFORM);

    // 点击导出
    const download = async (record: any) => {
        try {
            const data = await getTopicDetail(record._id);
            if (data && Array.isArray(data.blocks)) {
                // const item = data.blocks.find((v: any) => v.type === 'forms');
                const formsArr = data.blocks.filter((v: any) => ['forms', 'dynamicForm'].includes(v.type));

                if (formsArr.length > 0) {
                    const formList = formsArr.reduce((a, b) => a.concat(b.formList), []);
                    const userInfo: any = await exportActivityUserInfo({
                        activityId: record.lid,
                        formList: formList,
                    });
                    if (userInfo != null) {
                        saveAs(userInfo, '落地页表单.xls');
                    }
                } else {
                    message.error('没有数据可以导出');
                }
            } else {
                message.error('没有数据可以导出');
            }
        } catch (error: any) {
            message.error(error.message);
        }
    };

    // 查看
    const checkTable = (record: any) => {
        CheckUsemodalRef.current.showModal(record);
    };

    const queryList = async (page?: number, values?: ITopicListFilterData | null) => {
        try {
            const pageindex = page || pagination.page;
            const params: any = values === null ? {} : { ...filterParams, ...values };
            if (platform === 'saas') {
                params.pageType = 'custom';
            }
            const data = await getTopicList(pageindex, params);
            if (data) {
                if (pageindex === 1) {
                    //第一页
                    const code = getSessionStorage(storageKeys.SHOW_ADVERTISING);
                    //编辑页点击发布后保存的id
                    if (code) {
                        const item = data.rows.find((v) => v._id === code);
                        //打开广告投放窗口
                        item && handlePromote(item);
                        //清除保存的数据
                        setSessionStorage(storageKeys.SHOW_ADVERTISING, undefined);
                    }
                }
                setPagination({ page: pageindex, toatl: data.count });
                setDataSource(data.rows);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        queryList();
    }, []);
    // 提交
    const onFinish = (values: ITopicListFilterData) => {
        setFilterParams(values);
        queryList(1, values);
    };
    const onSearch = (values: ITopicListFilterData) => {
        setFilterParams(values);
        queryList(1, values);
    };
    // 重置
    const onReset = () => {
        setFilterParams(null);
        queryList(1, null);
    };
    // 分页切换
    const onChange = (page: number) => {
        queryList(page);
    };
    //停用 启用
    const changeState = async (id: string, state: number) => {
        try {
            await updateTopicState(id, state);
            message.success('状态修改成功');
            dataSource.some((v: ITopicListItem) => {
                if (v._id === id) {
                    v.state = state;
                    return true;
                }
                return false;
            });
            setDataSource(dataSource.slice());
        } catch (error: any) {
            const { data } = error;
            if (data.code === '601' && data.data.id) {
                Modal.confirm({
                    content: '当前城市站有一个正在进行中的权益页,是否停用该页面,并启用当前选择页面?',
                    cancelText: '取消',
                    okText: '确定',
                    onOk: () => toEnableCurrent(id, data.data.id),
                });
            } else {
                message.error(error.message || '操作失败');
            }
        }
    };
    //停用老的 启用新的
    const toEnableCurrent = async (newId: string, oldId: string) => {
        try {
            await updateTopicState(oldId, 0);
            await updateTopicState(newId, 1);
            queryList(1);
            message.success('启用成功');
        } catch (error: any) {
            message.error(error.message || '启用失败');
        }
    };
    const handlePromote = (record: ITopicListItem) => {
        PromoteModalRef.current.showModal(record);
    };

    const handlePreview = (item) => {
        // 预览
        NewPreviewModalRef.current.show(item);
    };

    const handleTrend = (item) => {
        // 统计
        TrendModalRef.current.show(item);
    };

    return (
        <div className={'active-landing'}>
            <div className={'content'}>
                <div className={'table-filter'}>
                    <FilterCom isOperation={platform === 'operation'} onReset={onReset} onFinish={onFinish} onSearch={onSearch} />
                </div>
                <div className={'table-wrap'}>
                    {dataSource.map((v) => (
                        <ActiveLandingItem
                            refreshList={queryList}
                            key={v._id}
                            item={v}
                            handlePromote={handlePromote}
                            download={download}
                            handlePreview={handlePreview}
                            handleTrend={handleTrend}
                        />
                    ))}
                </div>
                <div className="table-pagination">
                    <Pagination
                        defaultCurrent={1}
                        current={pagination.page}
                        pageSize={20}
                        onChange={onChange}
                        showSizeChanger={false}
                        total={pagination.toatl}
                        showTotal={(total: number) => `共 ${total} 条数据`}
                        responsive
                    />
                </div>
            </div>
            {/* 推广链接弹窗 */}
            <PromoteModal ref={PromoteModalRef}></PromoteModal>
            <PreviewModal ref={PreviewModalRef} />
            <CheckModal ref={CheckUsemodalRef}></CheckModal>
            <NewPreviewModal handlePromote={handlePromote} ref={NewPreviewModalRef} />
            <TrendModal ref={TrendModalRef} />
        </div>
    );
}
