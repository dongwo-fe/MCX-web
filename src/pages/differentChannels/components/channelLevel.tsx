import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import ChannelList from './channnelList';
import { getChannelLevel, deleteChannelLevel, abandonChannelLevel } from '@/api/channel'

interface propsType {
	showModal: boolean;
	showModalCb: (...arg: any) => void;
}

interface CategoryId {
	channelLevelId?: string,
	[propName: string]: any
}

type Result = Array<object>

const ChannelLevel = (props: propsType) => {
	const { showModal, showModalCb } = props || false;
	const [loadingModal, setLoadingModal] = useState<boolean>(false);
	const [oneChannel, setOneChannel] = useState<string>('');
	const [twoChannel, setTwoChannel] = useState<string>('');
	// 选中的一级类目
	const [topId, setTopId] = useState<CategoryId>({});
	//选中的二级类目
	const [categoryIdTwo, setCategoryIdTwo] = useState<CategoryId>({});
	//选中的三级类目
	const [categoryIdThree, setCategoryIdThree] = useState<CategoryId>({});
	//一级列表
	const [dataPush, setDataPush] = useState<Result>([]);
	//二级列表
	const [dataPushTwo, setDataPushTwo] = useState<Result>([]);
	//三级列表
	const [dataPushThree, setDataPushThree] = useState<Result>([]);
	// 一级列表是否还有数据
	const [hasNextPage, setHasNextPage] = useState(false);
	const [hasNextPageTwo, setHasNextPageTwo] = useState(false);
	const [hasNextPageThree, setHasNextPageThree] = useState(false);
	// 列表总数据
	const [page, setPage] = useState(1)
	const [pageTwo, setPageTwo] = useState(1)
	const [pageThree, setPageThree] = useState(1)

	useEffect(() => {
		setLoadingModal(showModal)
		// 开启弹框的时候请求接口，关闭不请求
		if (showModal) {
			restData(3)
			handlelistCategory({
				channelLevel: 1,
				page: 1,
				pageSize: 8
			})
		}
	}, [showModal]);

	const onCancel = () => {
		setLoadingModal(false)
		showModalCb(false)
	}

	const restData = (level) => {
		setPageThree(1)
		setCategoryIdThree({});
		setDataPushThree([]);
		if (level < 2) return
		setCategoryIdTwo({});
		setDataPushTwo([]);
		setPageTwo(1)
		if (level < 3) return
		setTopId({});
		setPage(1);
		setDataPush([]);
	}

	const onSubmit = () => {
		setLoadingModal(true)
		showModalCb(false)
	}

	// 获取渠道
	const handlelistCategory = async (params) => {
		try {
			const { list = [], hasNextPage, pageNum } = await getChannelLevel(params);
			setData(list, params.channelLevel, hasNextPage, pageNum);
		} catch (err) {
			console.log(err)
		}
	}

	// 设置渠道列表的数据
	const setData = (data: Array<object>, num, hasNextPage, page) => {
		switch (num) {
			case 1:
				page == 1 ? setDataPush(data) : setDataPush([...dataPush, ...data]);
				setHasNextPage(hasNextPage)
				setPage(page)
				break;
			case 2:
				page == 1 ? setDataPushTwo(data) : setDataPushTwo([...dataPushTwo, ...data]);
				setHasNextPageTwo(hasNextPage)
				setPageTwo(page)
				break;
			case 3:
				page == 1 ? setDataPushThree(data) : setDataPushThree([...dataPushThree, ...data])
				setHasNextPageThree(hasNextPage)
				setPageThree(page)
		}
	}

	// 选中某一渠道
	const handleSelect = (item, type) => {

		if (type === '一级渠道') {
			if (item.channelLevelId && item.channelLevelId !== topId.channelLevelId) {
				setTopId(item);
				restData(2);
				handlelistCategory({
					channelLevel: 2,
					channelLevelParent: item.channelLevelId,
					channelStatus: item.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				});
			}
		} else if (type === '二级渠道') {
			if (item.channelLevelId && item.channelLevelId !== categoryIdTwo.channelLevelId) {
				setCategoryIdTwo(item);
				restData(1)
				handlelistCategory({
					channelLevel: 3,
					channelLevelParent: item.channelLevelId,
					channelStatus: item.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				});
			}
		} else if (type === '三级渠道') {
			if (item.channelLevelId && item.channelLevelId !== categoryIdThree.channelLevelId) {
				setCategoryIdThree(item);
				// handlelistCategory(type, item.categoryId, twoChannel);
			}
		}
	}

	// 删除某一项渠道
	const handleDelete = async (item, type) => {
		const params = {
			channelLevel: item.channelLevel,
			channelLevelId: item.channelLevelId,
			channelLevelParent: item.channelLevelParent || ''
		}
		deleteChannelLevel(params).then(res => {
			message.success('删除成功');
			if (type === '一级渠道') {
				restData(3)
				handlelistCategory({
					channelLevel: 1,
					page: item.page,
					pageSize: item.pageSize
				})
			} else if (type === '二级渠道') {
				restData(2)
				handlelistCategory({
					channelLevel: 2,
					channelLevelParent: topId.channelLevelId,
					channelStatus: topId.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				})
			} else if (type === '三级渠道') {
				restData(1)
				handlelistCategory({
					channelLevel: 3,
					channelLevelParent: categoryIdTwo.channelLevelId,
					channelStatus: categoryIdTwo.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				})
			}
		}).catch(err => {
			message.error(err.message)
		})
	}

	// 改变某一渠道状态
	const handleStatus = (item, type) => {
		const params: any = {
			channelLevel: item.channelLevel,
			channelLevelId: item.channelLevelId,
			channelLevelParent: item.channelLevelParent || '',
			operationType: item.channelStatus === 0 ? 1 : 0,
		}
		if(item.channelStatus == 1) {
			if(type === '二级渠道') {
				params.parentStatus = topId.channelStatus
			} else if(type === '三级渠道') {
				params.parentStatus = categoryIdTwo.channelStatus
			}
		}
		abandonChannelLevel(params).then(res => {
			message.success(`${item.channelStatus == 0 ? '废弃' : '启用'}成功`);
			if (type === '一级渠道') {
				restData(3)
				handlelistCategory({
					channelLevel: 1,
					page: item.page,
					pageSize: item.pageSize
				})
			} else if (type === '二级渠道') {
				restData(2)
				console.log(item, 'item')
				handlelistCategory({
					channelLevel: 2,
					channelLevelParent: topId.channelLevelId,
					channelStatus: topId.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				})
			} else if (type === '三级渠道') {
				restData(1)
				handlelistCategory({
					channelLevel: 3,
					channelLevelParent: categoryIdTwo.channelLevelId,
					channelStatus: categoryIdTwo.channelStatus,
					page: item.page,
					pageSize: item.pageSize
				})
			}
		}).catch(err => {
			message.error(err.message)
		})
	}

	return (
		<Modal
			width={'84%'}
			visible={loadingModal}
			onCancel={onCancel}
			onOk={onSubmit}
			title="渠道等级管理"
			maskClosable={false}
			footer={[]}
		>
			<div className="list-box" style={{width: '100%', overflow: 'auto'}}>
				<ChannelList
					title="一级渠道"
					dataSource={dataPush}
					hasNextPage={hasNextPage}
					handleDelete={handleDelete}
					handleStatus={handleStatus}
					clickCb={(v: any) => {
						setOneChannel(v.channelLevelName);
						handleSelect(v, '一级渠道');
					}}
					cur={topId}
					handlelistCategory={handlelistCategory}
					page={page}
				/>

				{
					topId && topId.channelLevelId ? <>
						<div className="step-box">&nbsp;&gt;</div>
						<ChannelList
							title="二级渠道"
							hasNextPage={hasNextPageTwo}
							dataSource={dataPushTwo}
							clickCb={(v: any) => {
								setTwoChannel(v.channelLevelName);
								handleSelect(v, '二级渠道');
							}}
							handleDelete={handleDelete}
							handleStatus={handleStatus}
							preChannel={oneChannel}
							channelLevelParent={topId}
							cur={categoryIdTwo}
							handlelistCategory={handlelistCategory}
							page={pageTwo}
						/>
					</> : ('')
				}
				{
					categoryIdTwo.channelLevelId ? <>
						<div className="step-box">&nbsp;&gt;</div>
						<ChannelList
							title="三级渠道"
							dataSource={dataPushThree}
							hasNextPage={hasNextPageThree}
							handleDelete={handleDelete}
							handleStatus={handleStatus}
							preChannel={twoChannel}
							channelLevelParent={categoryIdTwo}
							cur={categoryIdTwo}
							handlelistCategory={handlelistCategory}
							page={pageThree} />
					</> : ('')
				}
			</div>
		</Modal>
	)
};

export default ChannelLevel;