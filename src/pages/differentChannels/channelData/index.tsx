import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table, Form, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getChannelData, getChannelDataExport, getChannelDataTotal } from '@/api/channel';
import { useLocation } from 'react-router-dom';
import RangePickDate from '../components/datePicker'
import usePickDate from '../hooks/usePickDate'
import { saveAs } from 'file-saver';
import moment from 'moment';

interface result {
  channelId: string | number,
  data: string,
  count: number,
  PV: number,
  UV: number
}
interface ILocation {
  state: any,
  search: string,
  pathname: string,
  key: string,
  hash: string
}
interface TotalData {
  channelPvCount: string,
  channelUvCount: string,
  registerNumCount: string
}

const index = () => {
  const {state: {channelId}}: ILocation = useLocation();
  
  const [form] = Form.useForm();

  //列表加载
  const [loading, setLoading] = useState(false);
  // 导出按钮加载
  const [btnLoading, setBtnLoading] = useState(false)
  // 分页配置
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
    showTotal: (total: number) => `共${total}条数据`,
  });
  const [totalData, setTotalData] = useState<TotalData>({channelPvCount: '',channelUvCount: '',registerNumCount:''})
  const dateFormat = 'YYYY-MM-DD';
  const initData = usePickDate(-7, -1);
  const [dataSource, setDataSource] = useState([]);
  const [selectData, setSelectData] = useState(initData);

  useEffect(() => {
    getDataList(pagination);
    channelDataTotal()
  }, []);

  // 获取数据
  const getDataList = async (_pagination: { current: number; pageSize: number; }) => {
    setLoading(true);
    const params: any = {
      page: _pagination.current,
      pageSize: _pagination.pageSize,
      channelId: channelId || '',
      startTime: selectData[0].format(dateFormat),
      endTime: selectData[1].format(dateFormat),
    }

    getChannelData(params).then((data: { list?: any; total?: number; }) => {
      const { list, total } = data
      const res = list.map((item,index) => ({
        ...item,
        id: index
      }))
      setDataSource(res);
      setLoading(false);
      const pasd: any = {
        ...pagination,
        total: total,
      }
      setPagination(pasd)
    }).catch(err=>{
      setLoading(false);
      message.error('获取数据失败')
    })
  };

  // 获取总数据
  const channelDataTotal = () => {
    const params: any = {
      channelId: channelId || '',
      startTime: selectData[0].format(dateFormat),
      endTime: selectData[1].format(dateFormat),
    }
    getChannelDataTotal(params).then((res:any) => {
      setTotalData(res)
    }).catch(err => {
      message.error('获取数据失败')
    })
  }

  // 表格改变触发
  const handleChange = (page: any) => {
    pagination.current = page.current;
    pagination.pageSize = page.pageSize;
    setPagination(pagination);
    getDataList(pagination)
  };

  // 选择日期范围变化
  const handleDataChange = value => setSelectData(value);

  const handleSearch = () => {
    pagination.current = 1;
    setPagination(pagination);
    channelDataTotal();
    getDataList(pagination);
  }

  // 导出
  const handleExport = async() => {
    const params = {
      channelId: channelId || '',
      startTime: selectData[0].format(dateFormat),
      endTime: selectData[1].format(dateFormat),
    }
    setBtnLoading(true);
    try{
      const res: any = await getChannelDataExport(params)
      if(res) {
        const now = moment(new Date).format(dateFormat)
        saveAs(res, `渠道数据分析-${now}.xlsx`)
        message.success('导出成功');
        setBtnLoading(false);
      } else {
        setBtnLoading(false);
      }
    }catch(err:any) {
      console.log(err.code,'1111')
    }
    
  }

  const columns = [
    {
      title: "日期",
      dataIndex: "date",
      width: 250,
      key: "date",
    },
    {
      title: "注册用户数",
      dataIndex: "registerNum",
      width: 250,
      key: "registerNum",
    },
    {
      title: "UV",
      dataIndex: "channelUv",
      width: 250,
      key: "channelUv",
    },
    {
      title: "PV",
      dataIndex: "channelPv",
      width: 250,
      key: "channelPv",
    }
  ];

  return (
    <div className="differentChannels-box">
      <h2 style={{fontSize: '21px',fontWeight: 500, marginBottom: '0.85em'}}>数据统计</h2>
      <div className="task-btns" style={{textAlign: 'left'}}>
        <RangePickDate
          value={selectData}
          handleDataChange={(e) => handleDataChange(e)}
        />
         <Button
          type="primary"
          style={{marginRight: 20}}
          onClick={handleSearch} 
        >查询</Button>
        <Button
          loading={btnLoading}
          type="primary"
          onClick={handleExport} 
        >导出</Button>
      </div>


      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleChange}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{totalData.registerNumCount}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{totalData.channelUvCount}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>{totalData.channelPvCount}</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};


export default index;
