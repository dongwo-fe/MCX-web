import React, { useState, useEffect, Fragment, useContext, useRef } from 'react';
import { Button, Table, Form, Modal, Input, message, Tooltip } from 'antd';
import type { InputRef } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './index.less';
import { useNavigate } from 'react-router-dom';
import { getChannelList, abandonChannel, updateChannel } from "@/api/channel";
import ChannelLevel from './components/channelLevel';
import AddChannelModal from './components/addChannelModal';
import SearchForm from './components/searchForm';
import { FormInstance } from 'antd/es/form/Form';
import { AuthWrapper } from '@/component/AuthWrapper';
import { DataProvider } from './context'

const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.getFieldsValue();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            validator(rule, value, callback) {
              if (value?.length>1024) {
								callback("活动链接不可超过1024个字");
							} else {
								callback();
							}
            },
          },
        ]}

      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};



const index = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  //详情弹窗
  const [titleModal, setTitleModal] = useState("");
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

  const [dataSource, setDataSource] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    getDataList(pagination);
  }, []);

  // 获取数据
  const getDataList = async (_pagination: { current: number; pageSize: number; }) => {
    try{
      const data = await form.validateFields();
      const { firstLevelId, secondLevelId, threeLevelId, cityIdList, guiderIdList, marketIdList, shopIdList, memberTypeList } = data
      setLoading(true);
      const status =  data.status ?? null
      const params: any = {
        ...data,
        memberTypeList: dealString2Array(memberTypeList),
        cityIdList: dealString2Array(cityIdList),
        firstLevelId: dealString2Array(firstLevelId),
        secondLevelId: dealString2Array(secondLevelId),
        threeLevelId: dealString2Array(threeLevelId),
        guiderIdList: dealString2Array(guiderIdList),
        marketIdList: dealString2Array(marketIdList),
        shopIdList: dealString2Array(shopIdList),
        page: _pagination.current,
        pageSize: _pagination.pageSize,
        status: status !== null ? [status] : null
      }
      getChannelList(params).then((data: { list?: any; total?: number; }) => {
        const { list, total } = data
        setDataSource(list);
        setLoading(false);
        const pasd: any = {
          ...pagination,
          total: total,
        }
        setPagination(pasd)
      })
    }catch(err: any) {
      setLoading(false);
      console.log(err.message)
    }
  };

  // 处理历史数据，之前是多选数组格式，现在变成单选字符串
  const dealString2Array = value => value ? [value] : []

  // 表格改变触发
  const handleChange = (page: any) => {
    pagination.current = page.current;
    pagination.pageSize = page.pageSize;
    setPagination(pagination);
    getDataList(pagination)
  };

  //新增
  const modifyAndNewHandler = (text: string, data: any) => {
    setVisible(true);
    setTitleModal(text);
  };

  //废弃
  const delHandler = (record: { channelId: string; }) => {
    Modal.confirm({
      width: 348,
      content: "确定要废弃该渠道吗？",
      title: "废弃后将影响该渠道正常使用",
      icon: <ExclamationCircleFilled style={{ color: "#FF8741" }} />,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        const params = {
          channelId: record.channelId
        }
        abandonChannel(params).then((res: any) => {
          if (res) {
            message.success('废弃成功')
            setPagination({ ...pagination });
            getDataList(pagination)
          }
        }).catch(err => {
          console.log(err)
        })
      },
    });
  };

  const defaultColumns = [
    {
      title: "编号",
      dataIndex: "channelId",
      width: 250,
      key: "channelId",
    },
    {
      title: "渠道名称",
      dataIndex: "channelName",
      width: 250,
      key: "channelName",
    },
    {
      title: "会员类型",
      dataIndex: "memberName",
      width: 250,
      key: "memberName",
    },
    {
      title: "城市",
      dataIndex: "cityList",
      width: 250,
      key: "cityList",
      ellipsis: {
        showTitle: false,
      },
      render: cityList => (
        <Tooltip placement="topLeft" title={cityList}>
          {cityList}
        </Tooltip>
      ),
    },
    {
      title: "卖场名称",
      dataIndex: "marketList",
      width: 250,
      key: "marketList",
      ellipsis: {
        showTitle: false,
      },
      render: marketList => (
        <Tooltip placement="topLeft" title={marketList}>
          {marketList}
        </Tooltip>
      ),
    },
    {
      title: "店铺名称",
      dataIndex: "shopList",
      width: 250,
      key: "shopList",
      ellipsis: {
        showTitle: false,
      },
      render: shopList => (
        <Tooltip placement="topLeft" title={shopList}>
          {shopList}
        </Tooltip>
      ),
    },
    {
      title: "导购名称",
      dataIndex: "guiderList",
      width: 250,
      key: "guiderList",
      ellipsis: {
        showTitle: false,
      },
      render: guiderList => (
        <Tooltip placement="topLeft" title={guiderList}>
          {guiderList}
        </Tooltip>
      ),
    },
    {
      title: "一级渠道",
      dataIndex: "firstLevelName",
      width: 250,
      key: "firstLevelName",
    },
    {
      title: "二级渠道",
      dataIndex: "secondLevelName",
      width: 250,
      key: "secondLevelName",
    },
    {
      title: "三级渠道",
      dataIndex: "threeLevelName",
      width: 250,
      key: "threeLevelName",
    },
    {
      title: "末级渠道",
      dataIndex: "endLevel",
      width: 250,
      key: "endLevel",
      ellipsis: {
        showTitle: false,
      },
      render: endLevel => (
        <Tooltip placement="topLeft" title={endLevel}>
          {endLevel}
        </Tooltip>
      ),
    },
    {
      title: "活动链接",
      dataIndex: "activityLink",
      width: 500,
      key: "activityLink",
      editable: true,
      ellipsis: {
        showTitle: false,
      },
      render: activityLink => (
        <Tooltip placement="topLeft" title={activityLink}>
          {activityLink}
        </Tooltip>
      ),
    },
    {
      title: "状态",
      dataIndex: "abandon",
      width: 250,
      key: "abandon",
      render: text => <div>{text ? '废弃' : '正常'}</div>
    },
    {
      title: "创建人",
      dataIndex: "creator",
      width: 250,
      key: "creator",
    },
    {
      title: "操作人",
      dataIndex: "modifier",
      width: 250,
      key: "modifier",
    },
    {
      title: "操作时间",
      dataIndex: "gmtModified",
      width: 250,
      key: "gmtModified",
    },
    {
      title: "操作",
      dataIndex: "dataSeut",
      width: 250,
      key: "dataSeut",
      fixed: 'right' as 'right',
      render: (_: any, record: { abandon?: any; channelId?: any; }) => (
        <Fragment>
          <AuthWrapper btnCode='OPERATION_CHANNEL_DATA'>
          <a onClick={() => {
            navigate('/differentChannels/data', { replace: false, state: { channelId: record.channelId } })
          }}>
            数据
          </a>
          </AuthWrapper>

          
          <AuthWrapper btnCode='OPERATION_CHANNEL_ABANDON'>
            {/*//@ts-ignore*/}
          {!record.abandon ? <a style={{ marginLeft: '8px' }} onClick={delHandler.bind(this, record)}>废弃</a> : <a style={{ marginLeft: '8px', color: '#ccc', cursor: 'not-allowed' }}>废弃</a>}
          </AuthWrapper>
        </Fragment>
      )
    },
  ];

  // 修改活动链接 
  const handleSave = async (row: any) => {
    const newData: any = [...dataSource];
    const index = newData.findIndex((item: any) => row.channelId === item.channelId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    try{
      const res = await updateChannel({
        channelId: row.channelId,
        activityLink: row.activityLink
      })
      if(res) {
        message.success('修改成功')
        setPagination({ ...pagination });
        getDataList(pagination)
      }
    }catch(err:any) {
      console.log(err.message)
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onSearch = () => {
    pagination.current = 1
    setPagination({ ...pagination });
    getDataList(pagination);
  };

  return (
    <DataProvider detail={{ showModal: showModal }}>
    <div className="differentChannels-box">
      <div className="differentChannels-header">
        <h2 style={{fontSize: '21px',fontWeight: 500, marginBottom: '0.85em'}}>异业渠道</h2>
        <div className="task-btns">
          <AuthWrapper btnCode='OPERATION_CHANNEL_LEVEL_MANAGERMENT'>
            <Button type="primary"
              onClick={() => setShowModal(true)}>渠道等级管理</Button>
          </AuthWrapper>
          <AuthWrapper btnCode='OPERATION_CHANNEL_CREATE'>
            <Button style={{ marginLeft: '20px' }} type="primary"
              onClick={() => modifyAndNewHandler("新增异业渠道", "")}>+新建</Button>
          </AuthWrapper>
        </div>
      </div>
      <SearchForm form={form} searchCb={onSearch} />

      <Table
        rowKey={(record) => record.channelId}
        scroll={{ x: 1300, y: 1100 }}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleChange}
        components={components}
      />

      {/* 添加渠道 */}
      <AddChannelModal 
        titleModal={titleModal}
        visible={visible} 
        handleVisibel={() => { setVisible(false) }} 
        callbackFn={() => {
          pagination.current = 1;
          pagination.pageSize = 10;
          setPagination(pagination);
          getDataList(pagination);
        }}
      />
      {/* 渠道等级 */}
      <ChannelLevel showModal={showModal} showModalCb={() => setShowModal(false) } />
    </div>
    </DataProvider>
  );
};


export default index;
