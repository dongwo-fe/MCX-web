import React, { useState, useImperativeHandle, forwardRef, Fragment, useRef } from 'react';
import { Modal, Button, Form, Table, Tooltip, message, Space } from 'antd';
import AddPromote from './addPromote';
import { topicUrl } from '@/api/hotConfig';
import { ITopicListItem } from '@/api/topicApi';
import { listOperActivityChannelByCondition, listOperChannelByConditionWithoutPage } from '@/api/activeLandingPage';
import { pushParent } from '@/utils/tools';
import { getSessionStorage, longStorageKeys } from '@/utils/storageTools';

const PromoteModal = (props: any, ref: any) => {
	const isOperation = getSessionStorage(longStorageKeys.PLATFORM) === 'operation';

	//
	const [dataList, setDataList] = useState<any>([]);
	//
	const AddPromoteRef = useRef<any>(null);
	//新建渠道链接弹窗状态
	const [addLinkVisible, setAddLinkVisible] = useState(false);
	//推广链接弹窗 状态
	const [promoteVisible, setPromoteVisible] = useState(false);
	//
	const [dataDetails, setDataDetails] = useState<ITopicListItem>();
	// const [roleLoading, setRoleLoading] = useState(false);
	const [formTwo] = Form.useForm();
	const formItemLayout = {
		labelCol: {
			span: 7,
		},
		wrapperCol: {
			span: 17,
		},
	};
	useImperativeHandle(ref, () => ({
		showModal: (record: ITopicListItem) => {
			formTwo.resetFields();
			setDataDetails(record);
			setPromoteVisible(true);
			handleChand(record.lid);
		},
	}));
	const handleChand = async (activityId: string) => {
		const params = {
			activityId: activityId,
		};
		try {
			const data = await listOperActivityChannelByCondition(params);
			setDataList(data);
		} catch (error) { }
	};
	const columns = [
		{
			title: '序号',
			dataIndex: 'saia',
			width: 50,
			key: 'saia',
			render: (text: string, record: any, index: number) => {
				return <div>{index + 1}</div>;
			},
		},
		{
			title: '渠道名称',
			dataIndex: 'channelName',
			width: 80,
			key: 'channelName',
			render: (text: string) => {
				return <div>{text ? text : <span style={{ color: '#FAAD14' }}>无名称</span>}</div>;
			},
		},
		{
			title: '渠道链接',
			dataIndex: 'channelId',
			width: 200,
			key: 'channelId',
			render: (text: string, record: any) => {
				const urlpath = dataDetails?.pageType === 'member' ? '/v/' : '/t/';
				const url = `${topicUrl}${urlpath}${dataDetails?._id}?channelId=${record.channelId}&activityId=${dataDetails?.lid}&activeName=${dataDetails?.title}&channelName=${record.channelName}`;
				// const url = `${topicUrl}${urlpath}${dataDetails?._id}?channelName=${record.channelName}&channelId=${record.channelId}`;
				return (
					<div
						style={{
							width: '220px',
							wordBreak: 'keep-all',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							lineHeight: '28px',
						}}
					>
						<Tooltip placement="topLeft" title={url}>
							<span id={text}>{url}</span>
						</Tooltip>
					</div>
				);
			},
		},
		{
			title: '操作',
			dataIndex: 'dataSeut',
			width: 100,
			key: 'dataSeut',
			render: (text: string, record: any) => {
				return (
					<Space>
						<a onClick={() => handleCopy(record)}>复制链接</a>
						{isOperation && <a onClick={() => goDeploy(record)}>广告位配置</a>}
					</Space>
				);
			},
		},
	];
	const goDeploy = (record: any) => {
		handleCopy(record);
		const platform = getSessionStorage(longStorageKeys.PLATFORM);
		if (platform === 'operation') {
			pushParent('/marketingCenter/campaignLaunchManagement/operationPosition');
		} else if (platform === 'market') {
			pushParent('/appletManage/operateConfig');
		}
	};
	//点击复制
	const handleCopy = (record: any) => {
		const range = document.createRange();
		const htmlele = document.getElementById(record.channelId);
		if (htmlele) {
			range.selectNode(htmlele); //需要复制的内容
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				selection.removeAllRanges();
			}
			selection && selection.addRange(range);
			document.execCommand('copy');
			message.success('复制成功');
		}
	};
	//取消新增
	const handleCancel = () => {
		setPromoteVisible(false);
		formTwo.resetFields();
		props.goBack && props.goBack();
	};
	//点击新建渠道链接
	const handleAddLink = async () => {
		try {
			// const data = await listOperActivityChannelByCondition({});
			setAddLinkVisible(true);
			const defaultList = dataList.map((v: any) => v.channelId);
			AddPromoteRef.current.showDown(dataDetails?.lid, defaultList);
		} catch (error) { }
	};
	//关闭弹窗
	const handleNo = () => {
		setAddLinkVisible(false);
	};
	//新建渠道链接
	const handleAdd = () => {
		setAddLinkVisible(false);
		handleChand(dataDetails?.lid || '');
	};
	return (
		<div>
			<Modal title={'请生成投放链接'} visible={promoteVisible} onCancel={handleCancel} footer={false} maskClosable={false} destroyOnClose width={800}>
				<Fragment>
					<Form {...formItemLayout} form={formTwo} component={false}>
						<Button onClick={handleAddLink} type="primary" style={{ marginBottom: 10 }}>
							新增渠道链接
						</Button>
						<Table rowKey={(record: any, index) => index + ''} columns={columns} dataSource={dataList} pagination={false} scroll={{ x: 550, y: 400 }} />
						<AddPromote handleAdd={handleAdd} ref={AddPromoteRef} addLinkVisible={addLinkVisible} handleNo={handleNo}></AddPromote>
					</Form>
				</Fragment>
			</Modal>
		</div>
	);
};
export default forwardRef(PromoteModal);
