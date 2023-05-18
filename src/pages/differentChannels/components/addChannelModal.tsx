import React, { useEffect, useRef, useState } from 'react';
import { Select, Form, message, Modal, Button, Input } from 'antd';
import { useUpdate } from "ahooks";
import { getChannelLevel } from "@/api/channel";
import { adChannel } from '@/api/channel';
import { trimValue } from '@/utils/tools';
import { getGuiderList } from "@/api/guiders";
import CitySelect from '@/component/AuthSelects/citySelect';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import ShopSelect from '@/component/AuthSelects/shopSelect';
import CombinationSelect from '@/component/comLevelSelect/'

const AddChannelModal = (props) => {
	const [form] = Form.useForm();
	const update = useUpdate();
	const { visible, titleModal, handleVisibel } = props || {};
	//详情弹窗
	const [flag, setFlag] = useState(false);
	//列表加载
	const [loadingModal, setLoadingModal] = useState(false);
	//详情数据
	const [dataDelate, setDataDelate] = useState();
	// 选中城市 数组对象 格式
	const [selectCity, setSelectCity] = useState([])
	// 选中导购
	const [selectGuider, setSelectGuider] = useState([])
	// 选中卖场
	const [selectMarket, setSelectMarket] = useState([])
	// 选中店铺
	const [selectShop, setSelectShop] = useState([])
	// 一级渠道名
	const [firstLevelName, setFirstLevelName] = useState('')
	// 二级渠道名
	const [secondLevelName, setSecondLevelName] = useState('')
	// 三级渠道名
	const [threeLevelName, setThreeLevelName] = useState('')

	useEffect(() => {
		setFlag(visible)
	}, [visible])

	const formItemLayout = {
		labelCol: {
			span: 5,
		},
		wrapperCol: {
			span: 18,
		},
	};

	const onCancel = () => {
		setFlag(false);
		form.resetFields()
		setLoadingModal(false)
		handleVisibel()
	};
	// 按钮触发提交
	const onSubmit = async () => {
		let date = await form.validateFields();
		date = {
			...date,
			cityIdList: selectCity,
			guiderIdList: selectGuider,
			marketIdList: selectMarket,
			shopIdList: selectShop,
			firstLevelName,
			secondLevelName,
			threeLevelName
		}
		setLoadingModal(true)
		adChannel({ ...date }).then((res) => {
			if (res) {
				message.success('新建成功')
				onCancel()
				props.callbackFn?.()
			} else {
				setLoadingModal(false)
				handleVisibel()
				message.error('新建失败')
			}
		}).catch(err => {
			setLoadingModal(false)
			message.error(err.message)
		})
	};

	// 处理接口需要数组里边对象格式的数据
	const dealArrayObj = (option) => option.map(item => ({name: item.children, id: item.value}))

	return (
		<Modal
			visible={flag}
			onCancel={onCancel}
			onOk={onSubmit}
			title={titleModal}
			maskClosable={false}
			footer={[
				<Button key="back" onClick={onCancel}>
					取消
				</Button>,
				<Button
					key="submit"
					onClick={onSubmit}
					type="primary"
					loading={loadingModal}
				>
					确定
				</Button>,
			]}
		>
			<Form {...formItemLayout} form={form} initialValues={{

			}}>
				<Form.Item
					name="channelName"
					label="渠道名称"
					getValueFromEvent={trimValue}
					rules={[
						{
							required: true,
							validator: (_, value, callback) => {
								const reg = /^[\u4E00-\u9FA5\r\n 0-9a-zA-Z,，.。;；:：”"'’!！`·？?￥《》<>｜、\\|~～{「」【】@#¥%……&*（）——}@#$%^&*()-_+=[\]]+$/;
								if (!value) {
									callback("请输入渠道名称");
								}
								if(value?.length > 255) {
									callback('渠道名称不可超过255个字')
								}
								if (!reg.test(value)) {
									callback("不能输入表情");
								} else {
									callback();
								}
							},
						},
					]}
				>
					<Input placeholder="请输入" />
				</Form.Item>
				<Form.Item rules={[{ required: true }]} name="memberType" label="会员类型：">
					<Select placeholder='请选择会员'>
						<Select.Option value={1}>洞窝会员</Select.Option>
						<Select.Option value={2}>卖场会员</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item rules={[{ required: true }]} name="cityIdList" label="城市：">
					<CitySelect 
						type="new" form={form} 
						name="cityIdList" 
						onChange={(value, option) => {
							update();
							form.setFieldsValue({
								marketIdList: undefined,
								shopIdList: undefined,
								guiderIdList: undefined,
							});
							setSelectCity(dealArrayObj(option))
						}}
						mode="multiple" 
					/>
				</Form.Item>
				<Form.Item rules={[{ required: true }]} name="marketIdList" label="卖场：">
					<MarketSelect
						onChange={(value, option) => {
							update();
							form.setFieldsValue({
								shopIdList: undefined,
								guiderIdList: undefined,
							});
							setSelectMarket(dealArrayObj(option))
						}}
						type="new"
						params={
							{
								cityStationIds: form.getFieldValue("cityIdList"),
							}
						}
						mode="multiple"
					/>
				</Form.Item>
				<Form.Item name="shopIdList" label="店铺：">
					<ShopSelect
						type="new"
						onChange={(value, option) => {
							update();
							form.setFieldsValue({
								guiderIdList: undefined,
							});
							setSelectShop(dealArrayObj(option))
						}}
						params={{
							marketIds: form.getFieldValue("marketIdList"),
						}}
						mode="multiple"
					/>
				</Form.Item>

				<Form.Item name="guiderIdList" label="导购：">
					<CombinationSelect 
						form={form}
						name='guiderName'
						indexkey='guiderId'
						api={getGuiderList}
						propsParms={{
							shopIdList: form.getFieldValue("shopIdList"),
						}}
						dependence='shopIdList'
						responseName='list'
						titleKey='userName'
						codeKey='guiderId'
						manual={true}
						mode="multiple"
						onChange={(value, option) => {
							setSelectGuider(dealArrayObj(option))
						}}
					/>
				</Form.Item>

				<Form.Item name="firstLevelId" label="一级渠道：">
					
					<CombinationSelect 
						form={form}
						name='channelLevelName'
						indexkey='channelLevelId'
						api={getChannelLevel}
						propsParms={{
							channelLevel: 1,
							channelStatus: 0,
							isAbandon: 0,
							isDeleted: 0,
						}}
						responseName='list'
						titleKey='channelLevelName'
						codeKey='channelLevelId'
						manual={false}
						onChange={(value, option) => {
							console.log(option, 'option')
							update();
							form.setFieldsValue({
								secondLevelId: undefined,
								threeLevelId: undefined
							});
							setFirstLevelName(option?.children)
						}}
					/>
				</Form.Item>

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
							isAbandon: 0,
							isDeleted: 0,
						}}
						dependence="channelLevelParent"
						responseName='list'
						titleKey='channelLevelName'
						codeKey='channelLevelId'
						manual={true}
						onChange={(value, option) => {
							update();
							form.setFieldsValue({
								threeLevelId: undefined
							});
							setSecondLevelName(option?.children || '')
						}}
					/>
				</Form.Item>

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
							isAbandon: 0,
							isDeleted: 0,
						}}
						dependence="channelLevelParent"
						responseName='list'
						titleKey='channelLevelName'
						codeKey='channelLevelId'
						manual={true}
						onChange={(value, option) => {
							setThreeLevelName(option.children)
						}}
					/>
				</Form.Item>
				<Form.Item name="endLevel" label="末级渠道：" rules={[
					{
						validator: (_, value, callback) => {
							if (value?.length>100) {
								callback("末级渠道不可超过100个字");
							} else {
								callback();
							}
						},
					},
				]}>
					<Input placeholder="请输入"/>
				</Form.Item>
				<Form.Item name="activityLink" label="活动链接：" rules={[
					{
						validator: (_, value, callback) => {
							if (value?.length>1024) {
								callback("活动链接不可超过1024个字");
							} else {
								callback();
							}
						},
					},
				]}>
					<Input placeholder="请输入" />
				</Form.Item>
			</Form>
		</Modal>
	)
};

export default AddChannelModal;