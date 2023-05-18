import { addOperChannel } from '@/api/activeLandingPage';
import CitySelect from '@/component/AuthSelects/citySelect';
import MarketSelect from '@/component/AuthSelects/marketSelect';
import { trimValue } from '@/utils/tools';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import React, { useState } from 'react';
const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 18,
	},
};
export default function AddOperChannel(props: any) {
	const [form1] = Form.useForm();
	const [loadingModal, setLoadingModal] = useState(false);
	const [update, setUpdate] = useState(false);

	const onCancel = () => {
		props.setShowAddOperChannel(false);
		form1.resetFields();
	};
	const onOk = async () => {
		const data = await form1.validateFields();
		setLoadingModal(true);
		const { channelName, modelType, modelCity, modelMasket } = data;
		const params: any = {
			channelName: channelName,
			memberType: modelType,
		};
		if (modelCity.value === 'all') {
			params.cityId = 0;
			params.cityName = '全部';
		} else {
			params.cityId = modelCity.value;
			params.cityName = modelCity.label;
		}
		if (modelMasket.value === 'all') {
			params.marketId = 0;
			params.marketName = '全部';
		} else {
			params.marketId = modelMasket.value;
			params.marketName = modelMasket.label;
		}
		try {
			await addOperChannel(params);
			message.success('添加成功');
			props.setShowAddOperChannel(false);
			props.onRefresh();
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setLoadingModal(false);
		}
	};
	const onCityChange = () => {
		form1.setFieldsValue({ modelMasket: undefined });
		setUpdate(!update);
	};
	return (
		<Modal
			open={props.showAddOperChannel}
			onCancel={onCancel}
			onOk={onOk}
			title={'新增异业渠道'}
			maskClosable={false}
			footer={[
				<Button key="back" onClick={onCancel}>
					取消
				</Button>,
				<Button key="submit" onClick={onOk} type="primary" loading={loadingModal}>
					确定
				</Button>,
			]}
		>
			<Form {...formItemLayout} form={form1}>
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
									callback('请输入渠道名称');
								}
								if (!reg.test(value)) {
									callback('不能输入表情');
								} else {
									callback();
								}
							},
						},
					]}
				>
					<Input placeholder="请输入" maxLength={20} />
				</Form.Item>
				<Form.Item rules={[{ required: true }]} name="modelType" label="会员类型：">
					<Select placeholder="请选择会员">
						<Select.Option value={1}>洞窝会员</Select.Option>
						<Select.Option value={2}>卖场会员</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item rules={[{ required: true }]} name="modelCity" label="城市：">
					<CitySelect labelInValue onChange={onCityChange} needAll />
				</Form.Item>
				<Form.Item dependencies={['modelCity']} rules={[{ required: true }]} name="modelMasket" label="卖场：">
					<MarketSelect labelInValue needAll params={{ cityId: (form1.getFieldValue('modelCity') && form1.getFieldValue('modelCity').value) || undefined }} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
