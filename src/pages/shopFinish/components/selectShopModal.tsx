import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table, Tooltip } from "antd";
import './selectShopModal.less';
import { ColumnsType } from 'antd/lib/table';
import { queryApplyShop, queryCityList, queryShopList } from '@/api/shop';
import { debounce } from 'lodash';

interface SelectShopModalProps {
  /** 弹窗visible */
  visible: boolean,
  /** 关闭弹窗 */
  onClose: () => void,
  /** 获取店铺回调 */
  callBackShop: (row: ShopItem) => void,
  /** 选中行  */
  selectedShopId: string | undefined
}

interface ShopItem {
  /** 店铺名称 */
  shopName: string;
  shopId: string | undefined;
  /** 卖场名称 */
  shoppingName: string;
  /** 所在城市 */
  city: string;
}

const SelectShopModal = ({
  visible,
  onClose,
  callBackShop,
  selectedShopId
}: SelectShopModalProps) => {

  const [form] = Form.useForm();

  const columns: ColumnsType<ShopItem> = [
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
    {
      title: '所属卖场',
      dataIndex: 'marketName',
      key: 'marketName',
      render: v => v ?? '--'
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
    },
  ]

  /** 取消 */
  const cancel = () => {
    onClose();
  };

  /** 确定 */
  const ok = () => {
    if (!selectRowKey) {
      message.warning('请先选择店铺');
    } else {
      onClose();
      selectRow && callBackShop(selectRow);
    }
  };

  /** 城市列表 */
  const [cityList, setCityList] = useState<{label: string, value: string}[]>([]);
  const getCityList = async () => {
    try {
      const res = await queryCityList({});
      const list = res.map((item) => { return {label: item.cityName, value: item.cityStationId}})
      setCityList(list);
    } catch (err: any) {
      message.error(err.message);
    }
    
  };

  /** 卖场列表 */
  const [shopList, setShopList] = useState<{label: string, value: string}[]>([]);
  const getShopList = debounce(async (params?: any) => {
    const queryParams = params || {};
    try {
      const res = await queryShopList({...queryParams, nullMarket: true});
      const list = res.map((item) => { return {label: item.marketName, value: item.marketId}})
      setShopList(list);
    } catch (err: any) {
      message.error(err.message);
    }
  }, 1000);

  /** 店铺table */
  const [dataSource, setDataSource] = useState({data: [], total: 0, page: 1, pageSize: 5});
  const [tabelParams, setTabelParams] = useState({page: 1, pageSize:5, shopName: '', marketId: '', cityStationId: ''});
  const getApplyShop = async (params?: any) => {
    try {
      const queryParams = params ?? tabelParams
      const res = await queryApplyShop({...queryParams});
      setDataSource({
        data: res.list || [],
        total: res.total || 0,
        page: res.pageNum || 0,
        pageSize: res.pageSize
      })
    } catch (err: any) {
      message.error(err.message);
    }
    
  };

  /** 选中数据 */
  const [selectRowKey, setSelectRowKey] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<ShopItem>();

  /** 翻页 */
  const onChange = (cur, size) => setTabelParams({ ...tabelParams, page: cur, pageSize: size });
  /** 重置 */
  const reset =  () => {
    form.resetFields();
    getApplyShop({page: 1, pageSize:5, shopName: '', marketId: '', cityStationId: ''});
    setTabelParams({page: 1, pageSize:5, shopName: '', marketId: '', cityStationId: ''});
  };
  /** 查询 */
  const submit = () => {
    const values = form.getFieldsValue();
    const params = {
      page: 1, 
      pageSize:5, 
      shopName: values.shopName?.trim(), 
      marketId: values.shoppingName, 
      cityStationId: values.cityStationId
    }
    getApplyShop(params);
  };

  useEffect(() => {
    getCityList();
    getShopList();
  }, [])

  useEffect(() => {
    setSelectRowKey([selectedShopId]);
  }, [selectedShopId])


  useEffect(() => {
    getApplyShop();
  }, [tabelParams.page, tabelParams.pageSize])





  return (
    <Modal
      title='选择店铺'
      open={visible}
      onCancel={cancel}
      maskClosable={false}
      width={856}
      className='select-goods-modal'
      footer={
        <>
          <div>
            <Button type='ghost' style={{marginLeft: 10}} onClick={cancel}> 取消 </Button>
            <Button type='primary' style={{marginLeft: 10}} onClick={ok}> 确定 </Button>
          </div>
        </>
      }
    > 
      <>
        {/* 表单筛选项  */}
        <Form form={form}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='shopName'
                label='店铺名称'
              >
                <Input
                  placeholder='请输入店铺名称'
                  onChange={(e) => {
                    setTabelParams({...tabelParams, shopName: e.target?.value?.trim() })
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='shoppingName'
                label='卖场名称'
              >
                <Select
                  placeholder='请选择卖场名称' 
                  options={shopList}
                  showSearch
                  onSearch={(val) => getShopList({marketName: val})}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val) => {
                    setTabelParams({...tabelParams, marketId: val})
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='cityStationId'
                label='城市'
              >
                <Select
                  placeholder='请选择城市'
                  options={cityList}
                  onChange={(val) => {
                    setTabelParams({...tabelParams, cityStationId: val})
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} style={{textAlign: 'right', marginBottom: 20}}>
              <Button type='ghost' onClick={reset} > 重置 </Button>
              <Button type='primary' style={{marginLeft: 10}} onClick={submit}> 查询 </Button>
            </Col>
          </Row>

        </Form>
        {/* table */}
        <Table
          columns={columns}
          rowKey='shopId'
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectRowKey,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRows, 'selectedRows');
              setSelectRowKey(selectedRowKeys);
              setSelectRow(selectedRows[0]);
            },
            
          }}
          
          dataSource={dataSource.data}
          pagination={{
            total: dataSource.total || 0,
            pageSize: dataSource.pageSize,
            current: dataSource.page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total} 条`,
            onChange,
            pageSizeOptions: [5, 10, 15, 20],
            defaultPageSize: 5
          }}
          scroll={{y: 385}}
        />
      </>
    </Modal>
  );
};

export default SelectShopModal;
