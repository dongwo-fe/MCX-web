import React from 'react';
import { Button, Form, Input, Select, Row, Col } from 'antd';
import { useUpdate } from "ahooks";
import { getChannelLevel } from "@/api/channel";
import CitySelect from '@/component/AuthSelects/citySelect';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import ShopSelect from '@/component/AuthSelects/shopSelect';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import CombinationSelect from '@/component/comLevelSelect/'
import { getGuiderList } from "@/api/guiders";

interface propsType {
	searchCb: (...arg: any) => void;
	form: FormInstance
}

const { Option } = Select;

const SearchForm = (props: propsType) => {
	const { searchCb, form } = props;
	const update = useUpdate();

	// 表单搜索
	const filterSubmit = async () => {
		searchCb()
	};

	const onReset = () => {
		form.resetFields();
		searchCb({})
	};

	return (

		<Form
			form={form}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 16 }}
			initialValues={{}}
		>
			<Row>
				<Col span={6}>
					<Form.Item name="channelId" label="渠道编号：">
						<Input placeholder="请输入" className="search-input" allowClear/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="channelName" label="渠道名称：">
						<Input placeholder="请输入" className="search-input" allowClear/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="memberTypeList" label="会员类型：">
						<Select placeholder='请选择会员' allowClear>
							<Select.Option value={1}>洞窝会员</Select.Option>
							<Select.Option value={2}>卖场会员</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="creator" label="创建人：">
						<Input placeholder="请输入" className="search-input" allowClear/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="cityIdList" label="城市：">
						<CitySelect type="new" form={form} name="cityIdList"
							//hasPage={true} 
							onChange={() => {
								update();
								form.setFieldsValue({
									marketIdList: undefined,
									shopIdList: undefined,
									guiderIdList: undefined,

								});
							}} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="marketIdList" label="卖场：">
						<MarketSelect
							onChange={() => {
								update();
								form.setFieldsValue({
									shopIdList: undefined,
									guiderIdList: undefined,
								});
							}}
							type="new"
							params={
								{
									cityStationId: form.getFieldValue("cityIdList"),
								}
							}
						// mode="multiple"
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="shopIdList" label="店铺：">
						<ShopSelect
							type="new"
							onChange={() => {
								update();
								form.setFieldsValue({
									guiderIdList: undefined,
								});
							}}
							params={{
								marketId: form.getFieldValue("marketIdList"),
							}}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="guiderIdList" label="导购：">
						<CombinationSelect 
							form={form}
							name='guiderName'
							indexkey='guiderId'
							api={getGuiderList}
							propsParms={{
								shopIdList: form.getFieldValue("shopIdList") && [form.getFieldValue("shopIdList")],
							}}
							dependence='shopIdList'
							responseName='list'
							titleKey='userName'
							codeKey='guiderId'
							manual={true}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="firstLevelId" label="一级渠道：">
						<CombinationSelect 
							form={form}
							name='channelLevelName'
							indexkey='channelLevelId'
							api={getChannelLevel}
							propsParms={{
								channelLevel: 1,
								channelStatus: 0,
								isDeleted: 1,
							}}
							responseName='list'
							titleKey='channelLevelName'
							codeKey='channelLevelId'
							manual={false}
							onChange={() => {
								update();
								form.setFieldsValue({
									secondLevelId: undefined,
									threeLevelId: undefined
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="secondLevelId" label="二级渠道：">
						<CombinationSelect 
							form={form}
							name='channelLevelName'
							indexkey='channelLevelId'
							api={getChannelLevel}
							propsParms={{
								channelLevel: 2,
								channelStatus: 0,
								channelLevelParent: form.getFieldValue("firstLevelId"),
								isDeleted: 1,
							}}
							dependence="channelLevelParent"
							responseName='list'
							titleKey='channelLevelName'
							codeKey='channelLevelId'
							manual={true}
							onChange={(value) => {
								update();
								form.setFieldsValue({
									threeLevelId: undefined
								});
							}}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="threeLevelId" label="三级渠道：">
						<CombinationSelect 
							form={form}
							name='channelLevelName'
							indexkey='channelLevelId'
							api={getChannelLevel}
							propsParms={{
								channelLevel: 3,
								channelStatus: 0,
								channelLevelParent: form.getFieldValue("secondLevelId"),
								isDeleted: 1,
							}}
							dependence="channelLevelParent"
							responseName='list'
							titleKey='channelLevelName'
							codeKey='channelLevelId'
							manual={true}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name="status" label="状态：">
						<Select placeholder="请选择" allowClear>
							<Select.Option value={0}>正常</Select.Option>
							<Select.Option value={1}>废弃</Select.Option>
						</Select>
					</Form.Item>
				</Col>

				<Col span={24} style={{ textAlign: 'right', paddingRight: 50, marginBottom: 40 }}>
					<Button type="primary" onClick={filterSubmit}>
						查询
					</Button>
					<Button style={{ marginLeft: '10px' }} type="primary" onClick={onReset}>
						重置
					</Button>
				</Col>
			</Row>
		</Form>

	)
}

export default SearchForm;