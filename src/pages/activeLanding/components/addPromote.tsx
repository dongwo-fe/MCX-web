import React, { useImperativeHandle, forwardRef, Fragment, useState, useEffect } from 'react';
import { Modal, Button, Form, message, Row, Col, Input, Select, Table, Space, Tooltip } from 'antd';
import { abandonChannel, addOperActivityChannelCollection, listOperChannelByCondition } from '@/api/activeLandingPage';
import { useNavigate } from 'react-router-dom';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import CitySelect from '@/component/AuthSelects/citySelect';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useUpdate } from "ahooks";
import ShopSelect from '@/component/AuthSelects/shopSelect';
import AddChannelModal from '@/pages/differentChannels/components/addChannelModal';
import { getGuiderList } from "@/api/guiders";
import CombinationSelect from '@/component/comLevelSelect/'
import { getChannelLevel } from "@/api/channel";
import { AuthWrapper } from '@/component/AuthWrapper';

const AddPromote = (props: any, ref: any) => {
	const colWidth = 150;
	const navigate = useNavigate();
	const [formTwo] = Form.useForm();
	const [dataList, setDataList] = useState<any>([]);
	const [activityId, setactivityId] = useState<string>();
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [defaultList, setDefaultList] = useState<string[]>([]);
	const [cityId, setCityId] = useState<string>('');
	const [showAddOperChannel, setShowAddOperChannel] = useState<boolean>(false);
	const update = useUpdate();
	//列表加载
	const [loading, setLoading] = useState(false);
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
		getDataList(pagination);
	}, []);

	useImperativeHandle(ref, () => ({
		showDown: (activityId: string, defaultList: string[]) => {
			console.log('%c [ activityId ]-33', 'font-size:13px; background:pink; color:#bf2c9f;', activityId);
			formTwo.resetFields();
			setactivityId(activityId);
			setDefaultList(defaultList);
		},
	}));
	//点击x
	const handleNo = () => {
		setSelectedRowKeys([]);
		props.handleNo();
	};

	//确定新增
	const handleOk = async () => {
		if (selectedRowKeys && selectedRowKeys.length > 0) {
			const params = selectedRowKeys.map((v) => ({ activityId: activityId || '', channelId: v }));
			try {
				await addOperActivityChannelCollection(params);
				props.handleAdd();
				formTwo.resetFields();
				setSelectedRowKeys([]);
			} catch (error: any) {
				message.error(error.message);
			}
		} else {
			message.warning('请选择渠道链接');
		}
	};

	//点击跳转
	const handleRouter = () => {
		// history.push({
		//     pathname: '/operationManagement/differentChannels'
		// });
		navigate('/differentChannels');
	};
	const onReset = () => {
		setCityId('');
		formTwo.resetFields();
		getDataList(pagination);
	};
	const filterSubmit = () => {
		getDataList(pagination);
	};

	// 表格改变触发
	const handleChange = (page: any) => {
		pagination.current = page.current;
		pagination.pageSize = page.pageSize;
		setPagination({ ...pagination });
		getDataList(pagination);
	};

	// 获取数据
	const getDataList = async (_pagination: any) => {
		setLoading(true);
		const params = {
			page: _pagination.current,
			pageSize: _pagination.pageSize,
		};
		const form = formTwo.getFieldsValue();
		const { cityId, marketId, memberTypeList, guiderIdList } = form;
		try {
			const data = await listOperChannelByCondition({
				...params,
				...form,
				cityIdList: cityId ? [cityId] : [],
				marketIdList: marketId ? [marketId] : [],
				memberTypeList: memberTypeList ? [memberTypeList] : [],
				guiderIdList: guiderIdList ? [guiderIdList] : null,
				status: [0]
			});
			const { list, total } = data;
			setDataList(list);
			setLoading(false);
			const pasd = {
				...pagination,
				total: total,
			};
			setPagination(pasd);
		} catch (error) {
			setLoading(false);
		}
	};

	const columns = [
		{
			title: '编号',
			dataIndex: 'channelId',
			key: 'channelId',
			width: colWidth,
		},
		{
			title: '渠道名称',
			dataIndex: 'channelName',
			key: 'channelName',
			width: colWidth,
		},
		{
			title: '会员类型',
			dataIndex: 'memberName',
			key: 'memberName',
			width: colWidth,
		},
		{
			title: '城市',
			dataIndex: 'cityList',
			key: 'cityList',
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: cityList => (
        <Tooltip placement="topLeft" title={cityList}>
          {cityList}
        </Tooltip>
      ),
			
		},
		{
			title: '卖场名称',
			dataIndex: 'marketList',
			key: 'marketList',
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: marketList => (
        <Tooltip placement="topLeft" title={marketList}>
          {marketList}
        </Tooltip>
      ),
		},
		{
			title: "店铺名称",
			dataIndex: "shopList",
			key: "shopList",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: shopList => (
        <Tooltip placement="topLeft" title={shopList}>
          {shopList}
        </Tooltip>
      ),
		},
		{
			title: "导购名称",
			dataIndex: "guiderList",
			key: "guiderList",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: guiderList => (
        <Tooltip placement="topLeft" title={guiderList}>
          {guiderList}
        </Tooltip>
      ),
		},
		{
			title: "一级渠道",
			dataIndex: "firstLevelName",
			key: "firstLevelName",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: firstLevelName => (
        <Tooltip placement="topLeft" title={firstLevelName}>
          {firstLevelName}
        </Tooltip>
      ),
		},
		{
			title: "二级渠道",
			dataIndex: "secondLevelName",
			key: "secondLevelName",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: secondLevelName => (
        <Tooltip placement="topLeft" title={secondLevelName}>
          {secondLevelName}
        </Tooltip>
      ),
		},
		{
			title: "三级渠道",
			dataIndex: "threeLevelName",
			key: "threeLevelName",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: threeLevelName => (
        <Tooltip placement="topLeft" title={threeLevelName}>
          {threeLevelName}
        </Tooltip>
      ),
		},
		{
			title: "末级渠道",
			dataIndex: "endLevel",
			key: "endLevel",
			ellipsis: {
        showTitle: false,
      },
			width: colWidth,
      render: endLevel => (
        <Tooltip placement="topLeft" title={endLevel}>
          {endLevel}
        </Tooltip>
      ),
		},
		{
			title: "活动链接",
			dataIndex: "activityLink",
			key: "activityLink",
			ellipsis: {
        showTitle: false,
      },
	  width: colWidth,
      render: activityLink => (
        <Tooltip placement="topLeft" title={activityLink}>
          {activityLink}
        </Tooltip>
      ),
		},
		{
			title: '创建人',
			dataIndex: 'creator',
			key: 'creator',
			width: colWidth,
		},
		{
			title: '操作人',
			dataIndex: 'modifier',
			key: 'modifier',
			width: colWidth,
		},
		{
			title: '操作时间',
			dataIndex: 'gmtModified',
			key: 'gmtModified',
			width: colWidth,
		},
		// {
		//     title: '操作',
		//     dataIndex: 'action',
		//     key: 'action',
		//     render: (text, record) => {
		//         return (
		//             <div>
		//                 {!record.abandon ? (
		//                     <a style={{ marginLeft: '8px' }} onClick={() => handlerDel(record)}>
		//                         废弃
		//                     </a>
		//                 ) : (
		//                     <a style={{ marginLeft: '8px', color: '#ccc' }}>废弃</a>
		//                 )}
		//             </div>
		//         );
		//     },
		// },
	];
	const handlerDel = (record: any) => {
		Modal.confirm({
			width: 348,
			content: '确定要废弃该渠道吗？',
			title: '废弃后将影响该渠道正常使用',
			icon: <ExclamationCircleFilled style={{ color: '#FF8741' }} />,
			okText: '确认',
			cancelText: '取消',
			onOk: () => delChannel(record.channelId),
		});
	};
	//调用废弃接口
	const delChannel = async (channelId: string) => {
		try {
			const params = {
				channelId: channelId,
			};
			await abandonChannel(params);
			message.success('操作成功');
			getDataList(pagination);
		} catch (error: any) {
			message.error(error.message);
		}
	};
	const rowSelection: any = {
		type: 'checkbox',
		preserveSelectedRowKeys: true,
		onChange: (selectedRowKeys: string[]) => {
			setSelectedRowKeys(selectedRowKeys);
		},
	};
	const onCityChange = (cityId: any) => {
		const data = {
			cityId: cityId,
			marketId: undefined,
		};
		setCityId(cityId);
		formTwo.setFieldsValue(data);
	};
	return (
		<div>
			<Modal title={'请设置投放渠道名称'} visible={props.addLinkVisible} onCancel={handleNo} footer={false} maskClosable={false} destroyOnClose width="80%">
				<Fragment>
					<Form form={formTwo} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
						<Row>
							<Col span={8}>
								<Form.Item name="channelId" label="渠道编号：">
									<Input allowClear placeholder="请输入" className="search-input" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="channelName" label="渠道名称：">
									<Input allowClear placeholder="请输入" className="search-input" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="memberTypeList" label="会员类型：">
									<Select allowClear placeholder="请选择">
										<Select.Option value="1">洞窝会员</Select.Option>
										<Select.Option value="2">卖场会员</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="cityId" label="城市：">
									<CitySelect type="new" form={formTwo} name="cityId"
										onChange={() => {
											update();
											formTwo.setFieldsValue({
												marketId: undefined,
												shopId: undefined,
												guiderIdList: undefined,
											});
										}} />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="marketId" label="卖场：">
								<MarketSelect
									onChange={() => {
										console.log('卖场变化');
										update();
										formTwo.setFieldsValue({
											shopId: undefined,
											guiderIdList: undefined,
										});
									}}
									type="new"
									params={
										{
											cityStationId: formTwo.getFieldValue("cityId"),
										}
									}
								/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="shopId" label="店铺：">
									<ShopSelect
										type="new"
										onChange={() => {
											update();
											formTwo.setFieldsValue({
												guiderIdList: undefined,
											});
										}}
										params={{
											marketId: formTwo.getFieldValue("marketId"),
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="guiderIdList" label="导购：">
								<CombinationSelect 
									form={formTwo}
									name='guiderName'
									indexkey='guiderId'
									api={getGuiderList}
									propsParms={{
										shopIdList: formTwo.getFieldValue("shopId") && [formTwo.getFieldValue("shopId")],
									}}
									dependence='shopIdList'
									responseName='list'
									titleKey='userName'
									codeKey='guiderId'
									manual={true}
								/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="creator" label="创建人：">
									<Input allowClear placeholder="请输入" className="search-input" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="firstLevelId" label="一级渠道：">
								<CombinationSelect 
									form={formTwo}
									name='channelLevelName'
									indexkey='channelLevelId'
									api={getChannelLevel}
									propsParms={{
										channelLevel: 1,
										channelStatus: 0
									}}
									responseName='list'
									titleKey='channelLevelName'
									codeKey='channelLevelId'
									manual={false}
									onChange={() => {
										update();
										formTwo.setFieldsValue({
											secondLevelId: undefined,
											threeLevelId: undefined
										});
									}}
								/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="secondLevelId" label="二级渠道：">
								<CombinationSelect 
									form={formTwo}
									name='channelLevelName'
									indexkey='channelLevelId'
									api={getChannelLevel}
									propsParms={{
										channelLevel: 2,
										channelStatus: 0,
										channelLevelParent: formTwo.getFieldValue("firstLevelId"),
									}}
									dependence="channelLevelParent"
									responseName='list'
									titleKey='channelLevelName'
									codeKey='channelLevelId'
									manual={true}
									onChange={() => {
										update();
										formTwo.setFieldsValue({
											threeLevelId: undefined
										});
									}}
								/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="threeLevelId" label="三级渠道：">
								<CombinationSelect 
										form={formTwo}
										name='channelLevelName'
										indexkey='channelLevelId'
										api={getChannelLevel}
										propsParms={{
											channelLevel: 3,
											channelStatus: 0,
											channelLevelParent: formTwo.getFieldValue("secondLevelId"),
										}}
										dependence="channelLevelParent"
										responseName='list'
										titleKey='channelLevelName'
										codeKey='channelLevelId'
										manual={true}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Space>
									<Button type="primary" onClick={filterSubmit}>
										查询
									</Button>
									<Button onClick={onReset}>重置</Button>
									<AuthWrapper btnCode='OPERATION_CHANNEL_CREATE'>
										<a style={{ marginLeft: '10px' }} onClick={() => setShowAddOperChannel(true)}>
											新建渠道&gt;
										</a>
									</AuthWrapper>
								</Space>
							</Col>
						</Row>
					</Form>
					{!!activityId && (
						<Table
							rowKey={'channelId'}
							scroll={{ x: 1300, y: 500 }}
							loading={loading}
							columns={columns}
							dataSource={dataList}
							pagination={pagination}
							onChange={handleChange}
							rowSelection={{
								getCheckboxProps: (record: any) => ({
									disabled: (defaultList && defaultList.includes(record.channelId)) || record.abandon, // Column configuration not to be checked
									name: record.name,
								}),
								...rowSelection,
							}}
						/>
					)}

					<div style={{ textAlign: 'center', marginTop: '25px' }}>
						<Button
							style={{
								marginRight: '16px',
							}}
							onClick={handleOk}
							type="primary"
						>
							{' '}
							确认生成投放渠道
						</Button>
					</div>
				</Fragment>
			</Modal>
			{/* 添加渠道 */}
			<AddChannelModal 
				titleModal='新增异业渠道' 
				visible={showAddOperChannel}
				handleVisibel={()=>{setShowAddOperChannel(false)}}
				callbackFn={()=>{
					pagination.current = 1;
					pagination.pageSize = 10;
					setPagination({ ...pagination });
					getDataList(pagination);
				}}
			/>
		</div>
	);
};
export default forwardRef(AddPromote);
