import React, { useState, useMemo, useEffect, } from 'react';
import { Button, List, Modal, Input, message, Divider, Skeleton, Form } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CheckOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { addChannelLevel } from '@/api/channel'
import './index.less';

const type = ['一级渠道','二级渠道','三级渠道'];

interface propsType {
  title?: string;
  clickCb?: (...arg: any) => void;
  handleDelete: (item: object, type: string) => void;
  handleStatus: (item: object, type: string) => void;
  preChannel?: string | number;
  dataSource: Array<object>;
  cur: {[propName: string]: any};
  handlelistCategory: (...arg: any) => void;
  channelLevelParent?: {[propName: string]: any};
  hasNextPage: boolean;
  page: number
}
const ChannelList = (props: propsType) => {
  const [form] = Form.useForm();
  const { 
    title = "",
    clickCb, 
    preChannel, 
    handlelistCategory, 
    dataSource: data,
    channelLevelParent = {channelLevelId: ''}, 
    hasNextPage,
    page
  } = props || {};
  const [currentChannelId, setCurrentChannelId] = useState<any>(null);
  const [addChannelFlag, setAddChannelFlag] = useState<boolean>(false);
  const pageSize = 8;

  const scrollableDiv = useMemo(() => {
    return 'scrollableDiv' + type.indexOf(title)
  }, [title])
  
  useEffect(() => {
    setCurrentChannelId(null)
  }, [data])

  const loadMoreData = () => {
    handlelistCategory({
      channelLevel: type.indexOf(title) + 1,
      channelLevelParent: channelLevelParent.channelLevelId || '',
      channelStatus: channelLevelParent?.channelStatus,
      page: page + 1,
      pageSize
    })
  };

  const addChannel = () => {
    setAddChannelFlag(true)
  }

  const headBth = (
    <Button onClick={addChannel} type='primary'>新增{title}</Button>
  );

  // 点击某一项
  const channelItemHandle = (item: any) => {
    item.page = 1
    item.pageSize = pageSize
    clickCb && clickCb(item)
    setCurrentChannelId(item.channelLevelId)
  }

  const onCancel = () => {
    setAddChannelFlag(false)
  }

  // 新建渠道提交
  const onSubmit = async () => {
    const params: any = {}
    if(type.indexOf(title) === 0) {
      params.channelLevel = 1
    } else {
      params.channelLevel = type.indexOf(title) + 1
      params.channelLevelParent = channelLevelParent.channelLevelId
    }
    const data = await form.validateFields();
    addChannelLevel({
      ...data,
      ...params
    }).then(res => {
      message.success('新增成功')
      // 提交成功以后，再调刷新列表的接口
      handlelistCategory({
        channelLevel: type.indexOf(title) + 1,
        channelLevelParent: channelLevelParent.channelLevelId || '',
        channelStatus: channelLevelParent.channelStatus,
        page: 1,
        pageSize
      })
    }).catch(err => {
      message.error(err.message)
    }).finally(() => {
      setAddChannelFlag(false)
      form.resetFields()
    })
  }

  // 删除某一项
  const onDelete = (item, type) => {
    item.page = 1
    item.pageSize = pageSize
    Modal.confirm({
      width: 348,
      content: "确定要删除该渠道吗？",
      title: `${item.channelLevel == 3?'':'删除后若有下级渠道也将全都删除'}`,
      icon: <ExclamationCircleFilled style={{ color: "#FF8741" }} />,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        props.handleDelete(item, type);
      }
    });
  }

  // 修改某一项的启用状态
  const onChangeStatus = (item, type) => {
    item.page = 1
    item.pageSize = pageSize
    const msg = item.channelStatus == 0 ? '废弃' : '启用'
    Modal.confirm({
      width: 348,
      content: `确定要${msg}该渠道吗？`,
      title: item.channelLevel == 3?'':`${msg}后若有下级渠道也将全都${msg}`,
      icon: <ExclamationCircleFilled style={{ color: "#FF8741" }} />,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        props.handleStatus(item, type);
      }
    });
  }

  return (
    <div>
      <h3>{title}</h3>
      <div
        id={scrollableDiv}
        style={{
          width: 400,
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={page * pageSize}
          next={loadMoreData}
          hasMore={hasNextPage}
          loader={<Skeleton paragraph={{ rows: 1 }} active />}
          endMessage=''
          scrollableTarget={scrollableDiv}  >
          <List
            header={headBth}
            dataSource={data}
            renderItem={(item: any) => {
              return (
                <List.Item key={item.channelLevelId} style={{
                  backgroundColor:
                    currentChannelId === item.channelLevelId
                      ? "#E6F7FF"
                      : "#ffffff",
                }} onClick={() => channelItemHandle(item)}>
                  <List.Item.Meta
                    title={item.channelLevelName}
                  // description={item.title}
                  />
                  <div>
                    {
                      item.channelStatus === 1 ? <CheckOutlined className="mr20" onClick={() => {onChangeStatus(item, title)}} /> :
                      <CloseOutlined className="mr20" onClick={() => {onChangeStatus(item, title)}} />
                    }
                    <DeleteOutlined className="none" onClick={() => {onDelete(item, title)}} />
                  </div>
                </List.Item>
              )
            }}
          />
        </InfiniteScroll>
      </div>

      {/* 新增渠道弹框 */}
      <Modal visible={addChannelFlag}
        onCancel={onCancel}
        onOk={onSubmit}
        title={`新增${title}`}
        maskClosable={false}
        footer={[
          <Button key="back"
            onClick={onCancel}
          >
            取消
          </Button>,
          <Button
            key="submit"
            onClick={onSubmit}
            type="primary"
          >
            确定
          </Button>,
        ]}
      >
        <Form form={form} >
          {
            title !== '一级渠道' ? <Form.Item label='上级渠道'>
              {preChannel}
            </Form.Item>
              : ''
          }
          <Form.Item label='渠道名称' name='channelLevelName' rules={[{ required: true, validator: (_, value, callback) => {
            if(!value){
              callback("渠道名称不能为空~");
            }else if (value?.length>32) {
              callback("渠道名称不可超过32个字");
            } else {
              callback();
            }
						}, }]}>
            <Input allowClear placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default ChannelList;