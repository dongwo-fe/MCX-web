import React, { useEffect, useState } from 'react';
import { Button, Cascader, Col, Form, Input, message, Modal, Row, Select, Table, Tooltip } from "antd";
import './selectGoodsModal.less';
import { ColumnsType } from 'antd/lib/table';
import { queryBrand, queryCategory, queryGoodsList, getSysRecommendWord } from '@/api/shop';
import { debounce } from 'lodash';
import { DefaultOptionType } from 'antd/lib/select';
import SelectGoodsStep from './selectGoodsStep';
import EditRecommendWord from './editRecommendWord';
import { RecommendWord } from "./types"

interface SelectGoodsModalProps {
  /** 弹窗visible */
  visible: boolean,
  /** 关闭弹窗 */
  onClose: () => void,
  /** 获取选中数据回调 */
  callBackSelectRows: (rows: GoodsItem[]) => void,
  /** 选中数据 */
  goodsList: GoodsItem[],
  /** 店铺信息 */
  defaultShop: any;
}

export interface GoodsItem {
  /** 商品id*/
  goodsSkuId: string;
  goodsId: string;
  /** 商品标题 */
  goodsSkuTitle: string;
  goodsTitle: string;
  /** 图片地址 */
  goodsPic: string;
  goodsMainPic: string
  /** 商品规格 */
  standardName: string
  /** 商品价格 */
  goodsPrice: string; //  商品sku价格
  goodsMaxMarketPrice: string; // 划线价
  goodsMaxPrice: string; // 商品价格
  /** 品牌 */
  brandName: string;
  /** 型号 */
  goodsMarque: string;
  /** sku编码 */
  goodsSkuCode: string;
  /** 所属店铺 */
  shopName: string;
  /** 推荐语 */
  recommend?: string;
}

const SelectGoodsModal = ({
  visible,
  onClose,
  callBackSelectRows,
  goodsList,
  defaultShop
}: SelectGoodsModalProps) => {
  const [form] = Form.useForm();

  const columns: ColumnsType<GoodsItem> = [
    {
      title: '商品信息',
      dataIndex: 'goods',
      key: 'goods',
      width: 190,
      render: (_, r: GoodsItem) => (
        <div className='goodsInfo'>
          {r.goodsPic ? <img src={r.goodsPic} alt=""></img> : ''}
          <div style={{ marginLeft: r.goodsSkuTitle ? '8px' : '0px' }}>
            <div
              className='goodsTitle'
            >
              <Tooltip placement="topLeft" title={r.goodsSkuTitle}>
                <span>{r.goodsSkuTitle}</span>
              </Tooltip>
            </div>
            <div
              className='standardName'
            >
              <Tooltip placement="topLeft" title={r.standardName}>
                <span>{r.standardName}</span>
              </Tooltip>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '商品价格(元)',
      dataIndex: 'goodsPrice',
      align: "right",
      key: 'goodsPrice',
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: '型号',
      dataIndex: 'goodsMarque',
      key: 'goodsMarque',
    },
    {
      title: 'SKU ID',
      dataIndex: 'goodsSkuId',
      key: 'goodsSkuId',
      width: 130
    },
    {
      title: '所属店铺',
      dataIndex: 'shopName',
      key: 'shopName',
      render: v => (
        <div className='overflowHiding'>
          <Tooltip placement="topLeft" title={v}>
            <span> {v || '-'} </span>
          </Tooltip>
        </div>
      )
    },
  ]

  /** 所属品牌 */
  const [brandList, setBrandList] = useState<{ label: string, value: string }[]>([]);
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState(0)
  const getBrandList = debounce(async (params?: { brandName: string }) => {
    const query = params ?? {}
    try {
      const res = await queryBrand(query);
      const list = res.map((item) => {
        return {
          label: item.brandName,
          value: item.brandId
        }
      })
      setBrandList(list || []);
    } catch (err: any) {
      message.error(err.message)
    }
  }, 1000)

  /** 所属类目 */
  const [categoryList, setCategoryList] = useState<{ label: string, value: string, children: any[] }[]>([]);
  const getCategoryList = async () => {
    try {
      const res = await queryCategory({});
      setCategoryList(recursionCategory(res || []));
    } catch (err: any) {
      message.error(err.message)
    }

  };

  /** 递归处理类目数据 */
  const recursionCategory = (list) => {
    list.forEach((item) => {
      item.label = item.categoryName
      item.value = item.categoryId
      if (item.childCategoryList) {
        item.children = item.childCategoryList
        recursionCategory(item.childCategoryList);
      }
    })
    return list
  };

  /** tabel */
  const [dataSource, setDataSource] = useState({ data: [], total: 0, page: 1, pageSize: 5 });
  const getTabelList = async (params) => {
    try {
      const res = await queryGoodsList(params)
      setDataSource({
        data: res.list || [],
        total: res.total || 0,
        page: res.pageNum || 0,
        pageSize: res.pageSize,
      })
    } catch (err: any) {
      message.error(err.message)
    }

  };

  /** 翻页 */
  const onChange = (cur, size) => getTabelList({ ...formValue(), page: cur, pageSize: size, shopIds: [defaultShop.shopId] });

  /** 查询 */
  const submit = () => getTabelList({ ...formValue(), page: 1, pageSize: 5, shopIds: [defaultShop.shopId] });
  /** 重置 */
  const reset = () => {
    getTabelList({ page: 1, pageSize: 5, shopIds: [defaultShop.shopId] });
    form.resetFields();
  }

  const formValue = () => {
    const queryParams = {};
    const params = form.getFieldsValue();
    Object.keys(params).forEach((item) => {
      if (params[item]) {
        if (item === 'categoryId') {
          queryParams[item] = params[item].join('/');
        } else if (item === 'goodsSkuTitle' || item === 'goodsSkuId') {
          queryParams[item] = params[item]?.trim();
        } else {
          queryParams[item] = params[item];
        }
      }
    })
    return queryParams;
  }

  /** 选中数据行 */
  const [selectedRows, setSelectRows] = useState<GoodsItem[]>([]);
  /** 选中行key */
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

  /** 单条选中 */
  const onSelect = (item: GoodsItem, check: boolean) => {
    if (check && selectedRows.length === 5) return message.warning('最多可选5条自定义数据');
    if (check) {
      setSelectRows([...selectedRows, item]);
      setSelectedKeys([...selectedKeys, item.goodsSkuId]);
    } else {
      const rows = [...selectedRows].filter((c: GoodsItem) => c.goodsSkuId !== item.goodsSkuId);
      const keys = [...selectedKeys].filter((c: string) => c !== item.goodsSkuId);
      setSelectRows(rows);
      setSelectedKeys(keys);
    }
  };

  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  /** 取消 */
  const cancel = () => {
    //取消时 不保存本次操作
    setSelectRows([...goodsList])
    onClose();
  }
  /** 判断当前选择的条数 */
  const judgeSelectedNum = () => {
    if (!selectedRows.length) {
      message.warning('请至少选择一条商品');
      return false
    }

    if (selectedKeys.length > 5) {
      message.warning('请至少选择一条商品');
      return false
    };

    return true
  }

  /** 确定 */
  const ok = () => {
    if (!judgeSelectedNum()) return
    if (selectedRows.some(x => !x.recommend)) return message.warn("每个商品必须填写一条推荐语")
    callBackSelectRows(selectedRows);
    onClose();
  };

  /** 下一步 */
  const nextStep = () => {
    if (!judgeSelectedNum()) return
    setCurrentStep(currentStep + 1)
  }

  /** 上一步 */
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }


  /** modal按钮操作数组 */
  const btnActionArr = [
    {
      fun: nextStep,
      text: "下一步"
    },
    {
      fun: ok,
      text: "完成"
    }
  ]


  const insertRecommendWord = async (goodsSkuId) => {
    const res: RecommendWord = await getSysRecommendWord()
    //原数组不可被改变 深拷贝
    const newArr = JSON.parse(JSON.stringify(selectedRows))
    newArr.forEach((x) => {
      if (x.goodsSkuId === goodsSkuId) {
        x.recommend = res.recommendContent
      }
    })
    setSelectRows([...newArr])
  }

  const recommendWordChange = (goodsSkuId, value) => {
    selectedRows.forEach((x) => {
      if (x.goodsSkuId === goodsSkuId) {
        x.recommend = value
      }
    })
    setSelectRows([...selectedRows])
  }

  useEffect(() => {
    getBrandList();
    getCategoryList();
    getTabelList({ page: 1, pageSize: 5, shopIds: [defaultShop.shopId] });
    setSelectRows([...goodsList]);
    setSelectedKeys(() => goodsList.map((item) => item.goodsSkuId));
    form.setFieldValue('brandIds', undefined);
  }, [])

  return (
    <Modal
      title='选择商品'
      open={visible}
      width={900}
      onCancel={cancel}
      maskClosable={false}
      className='select-goods-modal'
      footer={
        <>
          <div>
            已选{selectedRows.length}个还可以添加<span style={{ color: '#FF5454' }}>{5 - selectedRows.length}</span>个
            {
              currentStep > 0 ?
                <Button type='ghost' style={{ marginLeft: 16 }} onClick={prevStep}> 上一步 </Button>
                :
                <Button type='ghost' style={{ marginLeft: 16 }} onClick={cancel}> 取消 </Button>
            }
            <Button type='primary' style={{ marginLeft: 16 }} onClick={btnActionArr[currentStep].fun}> {btnActionArr[currentStep].text} </Button>
            {/* <Button type='primary' style={{ marginLeft: 10 }} onClick={ok}> 确定 </Button> */}
          </div>
        </>
      }
    >
      <SelectGoodsStep currentStep={currentStep} />
      {currentStep === 1 ?
        <EditRecommendWord
          selectedGoods={selectedRows.map((x) => ({ ...x, goodsPic: x.goodsMainPic || x.goodsPic }))}
          setSysRecommendWord={debounce(insertRecommendWord, 300)}
          recommendWordChange={recommendWordChange}
        />
        :
        <>
          {/* 表单筛选项  */}
          <Form form={form}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name='goodsSkuTitle'
                  label='商品名称'
                >
                  <Input placeholder='请输入商品名称' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='goodsSkuId'
                  label='SKU ID'
                >
                  <Input placeholder='请输入SKU' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='brandIds'
                  label='所属品牌'
                >
                  <Select
                    placeholder='请选择所属品牌'
                    options={brandList}
                    showSearch
                    mode='multiple'
                    showArrow
                    onSearch={(val) => getBrandList({ brandName: val })}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name='categoryId'
                  label='所属类目'
                >
                  <Cascader
                    placeholder='请选择所属类目'
                    options={categoryList}
                    showSearch={{ filter }}
                  />
                </Form.Item>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type='ghost' onClick={reset} > 重置 </Button>
                <Button type='primary' style={{ marginLeft: 10 }} onClick={submit}> 查询 </Button>
              </Col>
            </Row>

          </Form>
          {/* table */}
          <Table
            columns={columns}
            rowKey='goodsSkuId'
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedKeys,
              onSelect,
              onSelectAll: (selected, rows, changeRow) => {
                if (selected) {
                  if (selectedRows.length) {
                    const flag = selectedRows.every((item: any) => dataSource.data.some((c: any) => c.goodsSkuId === item.goodsSkuId));
                    if (rows.length > 5 || !flag) {
                      message.warning('最多可选5条自定义数据');
                    } else {
                      setSelectRows(rows);
                      setSelectedKeys(() => rows.map((item) => item.goodsSkuId));
                    }
                  } else {
                    if (rows.length > 5) {
                      message.warning('最多可选5条自定义数据');
                    } else {
                      setSelectRows(rows);
                      setSelectedKeys(() => rows.map((item) => item.goodsSkuId));
                    }

                  }
                } else {
                  const list: GoodsItem[] = [];
                  selectedRows.forEach((item) => {
                    const flag = changeRow.find((c) => c.goodsSkuId === item.goodsSkuId);
                    if (!flag) {
                      list.push(item);
                    };
                  })
                  setSelectRows(list);
                  setSelectedKeys(() => list.map((item) => item.goodsSkuId));
                }
              },
            }}
            scroll={{ y: 385 }}
            dataSource={dataSource.data}
            pagination={{
              total: dataSource.total || 0,
              pageSize: dataSource.pageSize,
              current: dataSource.page,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共${total} 条`,
              pageSizeOptions: [5, 10, 15, 20],
              defaultPageSize: 5,
              onChange,
            }}
          />
        </>
      }

    </Modal>
  );
};

export default SelectGoodsModal;
