import { MenuOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Radio, Space, Table, Tag, Tooltip, Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CommodityItem from './components/commodityItem';
import DiscountCouponItem from './components/discountCouponItem';
import OperationalGuideline from './components/operationalGuideline';
import SelectGoodsModal, { GoodsItem } from './components/selectGoodsModal';
import SelectShopModal from './components/selectShopModal';
import IMGCLIENT from '@/utils/imgOss';
import { publishShop, queryApplyShop, queryEvaluationlist, queryGuideinfo, queryRecommendCommodities, queryShopFinish, queryShopHomepage, recoverDefault, getSysRecommendWord } from '@/api/shop';
import { Container, Draggable } from 'react-smooth-dnd';
import './index.less';
import { pushParent } from '@/utils/tools';
import { RecommendWord } from "./components/types"
import { debounce } from "lodash-es"

interface DataType {
  /** 身份标识 */
  key: string;
  /** 商品 */
  goodsName: any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShopFinishPageProps { };
type Props = ShopFinishPageProps;

const ShopFinishPage: React.FC<Props> = (props: Props) => {

  /** 选中模块 */
  const [selectModule, setSelectModule] = useState<'banner' | 'goods'>('banner');
  /** 自定义、默认 商品 */
  const [radioValue, setRadioValue] = useState<'default' | 'custom'>('default');
  /**推荐商品是不是系统默认 */
  const recommendGoodsTypeRef = useRef(null)
  /**缓存货物 */
  const goodsListRef = useRef<GoodsItem[]>([])
  /** 商品visible */
  const [goodsVisible, setGoodsVisible] = useState<boolean>(false);
  /** 选择商品*/
  const selectGoods = () => setGoodsVisible(true);

  /** 店铺visible */
  const [shopVisible, setShopVisible] = useState<boolean>(false);
  /** 选择店铺 */
  const setSelectGoods = () => setShopVisible(true);


  /** 编辑商品推荐语 弹窗 */
  const [recommendVisible, setRecommendVisibel] = useState<boolean>(false);
  /** 记录当前编辑的商品 */
  const [goodsSkuId, setGoodsSkuId] = useState<string | undefined>('');
  /** 推荐语 */
  const [recommendVal, setRecommendVal] = useState<string | undefined>('');


  const [element, setElement] = useState<any>();
  /** 记录操作步骤 */
  const [currentStep, setCurrentStep] = useState<number>(0);


  /** 操作指引回调 */
  const callBack = (type: 'prev' | 'next' | 'break') => {
    if (type === 'prev') setCurrentStep(currentStep - 1);
    if (type === 'next') setCurrentStep(currentStep + 1);
    if (type === 'break') {
      setCurrentStep(0);
      setElement(null);
      setSelectModule('banner');
      setRadioValue('default');
    }
  };

  /** 上传照片 */
  const [imgUrlList, setImgUrlList] = useState<string[]>([]);

  /** 照片大小校验 */
  const beforeUpload = (file) => {
    console.log(file, 'file');
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('请上传小于5Mb的照片');
      return false;
    }
    return true;
  }

  /** imgChange */
  const imgChange = (data, index?: number) => {
    if (data.file && data.file.status === 'done') {
      if (index) {
        const list = [...imgUrlList];
        list.splice(index - 1, 1, `${data.file.response.textUrl}?x-oss-process=image/crop,w_1920,h_1440,g_center`);
        setImgUrlList(list);
      } else {
        setImgUrlList([...imgUrlList, `${data.file.response.textUrl}?x-oss-process=image/crop,w_1920,h_1440,g_center`,]);
      }
    }
  };

  /** 自定义上传 */
  const handleCustomRequest = async (e: any) => {
    try {
      const imgData: any = await IMGCLIENT.upload(e.file, 'shop');
      const { textUrl, height, width } = imgData;
      // 阿里云最大上传尺寸 2.5亿
      if (width * height >= 250000000 / 2) {
        message.error('当前上传照片尺寸过大,请重新上传');
      } else {
        e.onSuccess({
          textUrl
        });
      }
    } catch (error) {
      e.onError(error);
    }
  };

  /** 删除照片 */
  const deleteImg = (targetIndex: number) => {
    const list = imgUrlList.filter((item, index) => index !== targetIndex);
    setImgUrlList(list);
  };


  /** 商品list */
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);
  /** 删除 */
  const deleteItem = (c: GoodsItem) => {
    const list = goodsList.filter((item: GoodsItem) => item.goodsSkuId !== c.goodsSkuId);
    setGoodsList(list);
  };


  /** 默认选中商品 */
  const [defaultShop, setDefaultShop] = useState<{ shopName: string | undefined, shopId: string | undefined }>({ shopName: undefined, shopId: undefined });
  const getApplyShop = async () => {
    try {
      const res = await queryApplyShop({ page: 1, pageSize: 5 });
      if (res?.list?.length) {
        setDefaultShop({ shopName: res.list[0].shopName, shopId: res.list[0].shopId });
      } else {
        message.info('无有效店铺，请先添加店铺');
      }
    } catch (err: any) {
      message.error(err.message);
    }

  };

  /** 获取店铺信息 */
  const [shopCard, setShopCard] = useState<any>({});
  const getShopHomePage = async (shopId) => {
    try {
      const res = await queryShopHomepage({ shopId });
      setShopCard(res)
    } catch (err: any) {
      message.error(err.message);
    }

  };

  /** 获取店铺装修信息 */
  const [shopFinishInfo, setShopFinishInfo] = useState<any>({});
  const getShopFinish = async (shopId) => {

    try {
      const res = await queryShopFinish({ shopId });
      setShopFinishInfo(res);
      setGoodsList(res.goodsList || []);
      goodsListRef.current = res.goodsList;
      recommendGoodsTypeRef.current = res.recommendGoodsType
      setRadioValue(res.recommendGoodsType === 1 ? 'custom' : 'default');
      res.shopDecoratePic && setImgUrlList([...res.shopDecoratePic]);
      setSubmitLoading(false);
    } catch (err: any) {
      message.error(err.message);
    }
  }

  /** 获取评价列表 */
  const [evaluation, setEvaluation] = useState({ list: [], total: 0 });
  const getEvaluationList = async (shopId) => {
    try {
      const res = await queryEvaluationlist({ shopId });
      if (res?.list?.length) setEvaluation(res);
    } catch (err: any) {
      message.error(err.message);
    }
  }

  /** 获取导购信息 */
  const [guideInfo, setGuideInfo] = useState<any>({});
  const getGuideInfo = async () => {
    try {
      const res = await queryGuideinfo({});
      setGuideInfo(res);
    } catch (err: any) {
      message.error(err.message);
    }
  }

  /** 获取更多商品 */
  const [recommendShopList, setRecommendShopList] = useState([]);
  const getRecommendShopList = async (shopId) => {
    try {
      const res = await queryRecommendCommodities({ shopId });
      if (res?.list?.length) setRecommendShopList(res.list);
    } catch (err: any) {
      message.error(err.message);
    }
  }

  /** 恢复系统默认 */
  const systemDefault = () => {
    Modal.confirm({
      title: '恢复系统默认确认',
      className: 'default-modal',
      content: (
        <div>
          <p>是否确定要按系统默认的方案展示。</p>
        </div>
      ),
      async onOk() {
        if (!defaultShop.shopId) {
          message.info('无有效店铺，请先添加店铺');
        } else {
          try {
            const res = await recoverDefault({ shopId: defaultShop.shopId });
            getShopFinish(defaultShop.shopId);
            Modal.destroyAll();
          } catch (err: any) {
            message.error(err.message);
          }
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /** 发布按钮loading */
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  /** 发布 */
  const submit = () => {
    Modal.confirm({
      title: '发布确认',
      className: 'submit-modal',
      okButtonProps: {
        loading: submitLoading
      },
      content: (
        <div>
          <p>发布后小程序端将按本次修改的设置展示，是否确定发布？</p>
        </div>
      ),
      async onOk() {
        if (!defaultShop.shopId) {
          message.info('无有效店铺，请先添加店铺');
        } else if (radioValue === 'custom' && !goodsList.length) {
          message.warning('请至少选择一条自定义商品');
          setSelectModule('goods');
        } else {
          try {
            setSubmitLoading(true);
            const res = await publishShop({
              shopId: defaultShop.shopId,
              shopDecoratePic: imgUrlList,
              recommendGoodsType: radioValue === 'default' ? 0 : 1,
              shopRecommendGoods: goodsList,
              decorateId: shopFinishInfo.decorateId ?? null
            })
            message.success('保存成功');
            getShopFinish(defaultShop.shopId);
          } catch (err: any) {
            message.error(err.message);
          }
          finally {
            setSubmitLoading(false);
          }
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /** 拖拽 */
  const onDrag = (arr: any[] = [], dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) {
      return arr;
    }
    const result = [...arr];
    let itemToAdd = payload;
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
    return result;
  };

  const onDrop = (dropResult, transferList: any[], type: 'img' | 'goods') => {
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const list = onDrag(transferList, dropResult);
      type === 'img' ? setImgUrlList(list) : setGoodsList(list);
    }
  }

  useEffect(() => {
    if (currentStep === 1) {
      setElement(document.getElementById('change-shop1'));
      document.getElementById('content-preview-wrap1')?.scrollTo(0, 0)
    }
    if (currentStep === 2) {
      setElement(document.getElementById('content-preview-wrap-main1'));
    }
    if (currentStep === 3) {
      const newElement = document.getElementById('content-preview-wrap-main1');
      setElement(newElement);
    };
    if (currentStep === 4) {
      setElement(document.getElementById('submit'));
    }
  }, [currentStep])

  useEffect(() => {
    if (defaultShop.shopId) {
      getShopHomePage(defaultShop.shopId);
      getShopFinish(defaultShop.shopId);
      getEvaluationList(defaultShop.shopId);
      getRecommendShopList(defaultShop.shopId);
    }
  }, [defaultShop])

  // 判断用户是否首次进入店铺装修  设置标识1
  const isFirst = () => {
    const firstFlag = localStorage.getItem('first');
    if (!firstFlag) {
      localStorage.setItem('first', '1');
      setCurrentStep(1);
    }
  }

  const insertRecommendWord = async (goodsSkuId) => {
    const res: RecommendWord = await getSysRecommendWord()
    setRecommendVal(res.recommendContent)
  }

  useEffect(() => {
    getApplyShop();
    isFirst();
    getGuideInfo();
  }, [])

  return (
    <div className='shop-finish-wrap'>
      {/* 头部title */}
      <div className='shop-finish-wrap-title'>
        <div className='title-left'>
          <span> {defaultShop.shopName ?? '--'} </span>
          <div className='change-shop' id='change-shop1'>
            <img src="https://ossprod.jrdaimao.com/file/1679025808236796.png" alt="" />
            <span onClick={() => setSelectGoods()} > 店铺更换 </span>
          </div>
        </div>
        <div className='title-rigth'>
          <span onClick={() => setCurrentStep(1)}> 查看操作指引 </span> |
          <span onClick={() => systemDefault()}> 恢复系统默认 </span>
          <Button type='primary' style={{ color: '#fff' }} id='submit' onClick={submit}> 发布 </Button>
        </div>
      </div>
      {/* 内容区域 */}
      <div className='shop-finish-wrap-content'>
        {/* c端展示区域 */}
        <div className='content-preview'>
          <div className='content-preview-hint'>
            <img src="https://ossprod.jrdaimao.com/file/1679302961329974.png" alt="" />
            如果您没有发布，离开此页面后不会保存您的此次修改
          </div>
          <div className='content-preview-wrap' id='content-preview-wrap1'>
            <div className='content-preview-wrap-main' id='content-preview-wrap-main1'>
              {/* 店铺主图 */}
              <div
                className={`wrap-main-banner ${selectModule === 'banner' ? 'wrap-main-banner-active' : ''}`}
                onClick={() => setSelectModule('banner')}
              >
                <img src={imgUrlList[0]} alt="" />
                <div className='wrap-main-banner-card'>
                  <div className='shop-name'>
                    <span>{shopCard?.shopName ?? '--'}</span>
                    <div>
                      <img src="https://ossprod.jrdaimao.com/file/1679304497657958.png" alt="" />
                      订阅
                    </div>
                  </div>
                  <div className='shop-evaluate'>
                    {shopCard?.score ? (
                      <div className='mark'>
                        {Number.isInteger(shopCard?.score) ? `${shopCard?.score}.0` : shopCard?.score}分
                      </div>
                    ) : null}
                    <div className='evaluate'>
                      {shopCard?.evaluateNum ? (
                        <span>{shopCard.evaluateNum}评价</span>
                      ) : <span></span>}
                      {shopCard?.subscribeNum ? (
                        <span>{shopCard?.subscribeNum} 人</span>
                      ) : null}
                    </div>
                  </div>
                  <div className='shop-time'>
                    <img src="https://ossprod.jrdaimao.com/file/1679305431153707.png" alt="" />
                    <span>{shopCard?.businessTime}</span>
                  </div>
                  <div className='shop-location'>
                    <img src="https://ossprod.jrdaimao.com/file/1679305763767347.png" alt="" />
                    <span>
                      {shopCard?.shopAddressShow ?? '--'}
                    </span>
                  </div>
                </div>
                <div className='wrap-main-banner-btn'>
                  店铺主图
                  <span />
                </div>
              </div>
              {/* 优惠券 */}
              <div className='wrap-main-discounts'>
                <h3>店铺专属优惠</h3>
                <div className='wrap-main-discounts-list'>
                  {shopFinishInfo.couponList && shopFinishInfo.couponList.length ? (
                    shopFinishInfo?.couponList?.map((item, index) => {
                      return <DiscountCouponItem key={index} item={item} />
                    })
                  ) : (
                    <div className='discounts-empty'>
                      <span>您创建的优惠券会展示在这里，用户可以自主领取。</span>
                      <Button
                        type='primary'
                        onClick={() => pushParent('/marketingCenter/couponManage')}
                      >
                        创建优惠券
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {/* 推荐商品 */}
              <div
                className={`wrap-main-recommend ${selectModule === 'goods' ? 'wrap-main-recommend-active' : ''}`}
                id='wrap-main-recommend1'
                onClick={() => {
                  setSelectModule('goods')
                }}
              >
                <div className='wrap-main-recommend-content'>
                  <h3>推荐商品</h3>
                  <div className='wrap-main-recommend-list'>
                    {goodsList.length ? (
                      goodsList.map((item, index) => {
                        return <CommodityItem key={index} item={item} />
                      })
                    ) : (
                      <div className='goods-empty'>
                        <span>您的店铺还没有发布商品，快去发布吧！</span>
                        <Button
                          type='primary'
                          onClick={() => pushParent('/listMitTwo/photography')}
                        >
                          去发布商品
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className='wrap-main-recommend-btn'>
                    推荐商品
                    <span />
                  </div>
                </div>
              </div>
              {/* 用户评价 */}
              {evaluation?.list?.length ? (
                <div className='wrap-main-comment'>
                  <div className='comment-number'>
                    用户评价 ({evaluation?.total})
                  </div>
                  {evaluation.list.map((item: any, index) => {
                    return (
                      <div className='comment-item' key={index}>
                        <div className='comment-item-head'>
                          <img src={item?.avatar} alt="" />
                          <div className='user-name'>
                            <span>{item?.nickname}</span>
                            <span>{item?.gmtCreated}</span>
                          </div>
                          {item.whetherChoiceness && <img className='choiceness' src="https://ossprod.jrdaimao.com/file/168007457126657.png" alt="" />}
                        </div>
                        <div className='comment-icon'>
                          {Array.from({ length: item?.score }, (_, i) => i + 1).map((item, index) => {
                            return <img src="https://ossprod.jrdaimao.com/file/1680057592835653.png" alt="" key={index} />
                          })}
                          <span>{item?.score}</span>
                        </div>
                        <div className='comment-desc'>
                          {item?.content}
                        </div>
                        {item?.accessorys?.length ? (
                          <div className='comment-img'>
                            {item.accessorys.map((item, index) => {
                              return <img src={item.ossUrl} key={index} alt="" />
                            })}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  <div className='comment-all'>
                    查看全部评价
                    <img src="https://ossprod.jrdaimao.com/file/1680059602803448.png" alt="" />
                  </div>
                </div>
              ) : null}
              {/* 逛逛更多商品 */}
              {recommendShopList.length ? (
                <div className='wrap-main-goods'>
                  <div className='wrap-main-goods-title'>
                    <img src="https://ossprod.jrdaimao.com/file/1680071313438527.png" alt="" />
                    <span> 逛逛更多商品 </span>
                    <img className='right' src="https://ossprod.jrdaimao.com/file/1680071313438527.png" alt="" />
                  </div>
                  <div className='wrap-main-goods-btn'>
                    <div className='synthesis'>综合</div>
                    <div>销量</div>
                    <div>
                      价格
                      <img
                        src="https://ossprod.jrdaimao.com/file/168007156835230.png"
                        style={{ width: 7, height: 12 }}
                        alt=""
                      />
                    </div>
                    <div>
                      分类
                      <img
                        src="https://ossprod.jrdaimao.com/file/1680071592642843.png"
                        style={{ width: 12, height: 10 }}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className='wrap-main-goods-list'>
                    {recommendShopList.map((item: any, index) => {
                      return (
                        <div className='wrap-main-goods-list-item' key={index}>
                          <img src={item.goodsMainPic} alt="" />
                          <div className='item-desc'>
                            <div className='item-desc-name'>
                              {/* <span>居家保</span> */}
                              {item?.goodsTitle}
                            </div>
                            {/* <div className='item-desc-tag'>
                              <img src="https://ossprod.jrdaimao.com/file/1680071745306234.png" alt="" />
                              <span style={{color: '#FC4B4B', background: '#fff', border: '1px solid #FC4B4B'}}>迎新春开门红</span>
                              <span style={{color: '#2CC415', background: '#fff', border: '1px solid #2CC415'}}>以旧换新</span>
                            </div> */}
                            <div className='item-desc-price'>
                              ¥ <span>{item?.minGoodsPrice || item?.maxGoodsPrice}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {/* 联系导购 */}
              {guideInfo?.userName ? (
                <div className='wrap-main-relation'>
                  <img src="https://ossprod.jrdaimao.com/file/1680070016515276.png" alt="" />
                  <div className='left'>
                    <img src={guideInfo?.userPhoto || 'https://ossprod.jrdaimao.com/file/1675759035442284.png'} alt="" />
                    <div>{guideInfo?.userName}</div>
                    <span />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* 店铺操作区域 */}
        <div className='content-operation'>
          <div className='content-operation-top'>
            <h3>{selectModule === 'banner' ? '店铺主图' : '推荐商品'}</h3>
            <span>{selectModule === 'banner' ? '店铺形象宣传利器，靠颜值吸引客户' : '设置引流爆品，当季主打，吸引客户到店'} </span>
          </div>
          {/* 店铺主图 */}
          {selectModule === 'banner' && (
            <div className='content-operation-bottom'>
              <div className='bottom-desc'>
                <h4>添加图片</h4>
                <span>建议尺寸：1920*1440，格式限制：png、jpg、jpeg；文件大小不超过5M；最多支持10张，至少需要一张；长按拖动改变排序，默认取店铺基础信息中的店铺主图，删除默认主图不会修改店铺基础信息</span>
              </div>
              <div className='bottom-banner-list'>
                <Container
                  dragClass='drag-item'
                  groupName='bottom-banner-list-container'
                  onDrop={(dropResult) => onDrop(dropResult, imgUrlList, 'img')}
                >
                  {imgUrlList.map((item, index) => {
                    return (
                      <Draggable key={index}>
                        <div
                          className='bottom-list-item'
                        >
                          {index !== 0 ? (
                            <img src="https://ossprod.jrdaimao.com/file/167903679149438.png" alt="" className='drag' />
                          ) : (
                            <span
                              style={{
                                fontSize: '14px',
                                fontFamily: 'PingFangSC-Regular, PingFang SC',
                                fontWeight: 400,
                                color: '#333333',
                                marginRight: 10
                              }}
                            >
                              默认
                            </span>
                          )}
                          <img src={item} alt="" className='shop-img' />
                          <Upload
                            accept='image/png, image/jpeg, image/jpg'
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={(data) => imgChange(data, index + 1)}
                            customRequest={handleCustomRequest}
                          >
                            <span
                              style={{ cursor: 'pointer' }}
                              className='change-img'
                            >
                              更换图片
                            </span>
                          </Upload>
                          {index !== 0 && <div className='cut-off-rule' />}
                          {index !== 0 && <span className='delete-img' onClick={() => deleteImg(index)}>删除</span>}
                        </div>
                      </Draggable>
                    )
                  })}
                </Container>

              </div>
              {imgUrlList.length <= 9 && (
                <Upload
                  accept='image/png, image/jpeg, image/jpg'
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={(data) => imgChange(data)}
                  customRequest={handleCustomRequest}
                >
                  <div className='bottom-btn'>
                    <img src="https://ossprod.jrdaimao.com/file/1680490214528283.png" alt="" />
                    <span>添加图片</span>
                    <span>({imgUrlList.length}/10)</span>
                  </div>
                </Upload>
              )}
            </div>
          )}
          {/* 推荐商品 */}
          {selectModule === 'goods' && (
            <div className='content-operation-bottom'>
              <div className='bottom-radio'>
                <Radio.Group value={radioValue} onChange={(e: any) => {
                  if (e.target.value === "default") {
                    setGoodsList(goodsListRef.current)
                  } else {
                    /**如果系统默认 切换自定义时 不展示默认数据 */
                    if (recommendGoodsTypeRef.current !== 1) {
                      setGoodsList([])
                    }
                  }
                  setRadioValue(e.target.value)
                }}>
                  <Space direction="vertical">
                    <Radio value='default'>
                      <h3>系统默认商品</h3>
                      <span className='explain'>按店铺销量、排序，取前5个</span>
                    </Radio>
                    <Radio value='custom'>
                      <h3>自定义选择</h3>
                      <span className='explain'>最多支持设置5个商品</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              {radioValue === 'custom' && (
                <div className='bottom-shop-list'>
                  {/* 上传数量 */}
                  <div className='upload-quantity'>
                    <span onClick={() => selectGoods()} style={{ cursor: 'pointer' }}>选择商品</span>
                    <span>
                      已上传商品数量：<span className='selected-amount'>{goodsList.length}</span>/5
                    </span>
                  </div>
                  {/* 表头*/}
                  <div className='columns-header'>
                    <span style={{ marginRight: 21 }}>排序</span>
                    <span style={{ marginRight: 188 }}>商品</span>
                    <span>操作</span>
                  </div>
                  {/* item */}
                  <div className='bottom-shop-item-card'>
                    <Container
                      groupName='bottom-shop-item-card-container'
                      dragClass='drag-item'
                      onDrop={(dropResult) => onDrop(dropResult, goodsList, 'goods')}
                    >
                      {goodsList.map((item: GoodsItem, index) => {
                        return (
                          <Draggable key={index}>
                            <div className='item'>
                              <img src="https://ossprod.jrdaimao.com/file/167903679149438.png" style={{ width: 12, height: 12, cursor: 'pointer' }} alt="" />
                              <div className='item-desc'>
                                <img src={item.goodsMainPic || item.goodsPic} style={{ width: 40, height: 40 }} alt="" />
                                <div>
                                  <span>{item.goodsSkuTitle || item.goodsTitle}</span>
                                  <span>{item.standardName}</span>
                                </div>
                              </div>
                              <div className='item-operation'>
                                <span
                                  onClick={() => {
                                    setRecommendVisibel(true)
                                    setGoodsSkuId(item.goodsSkuId)
                                    setRecommendVal(item.recommend ?? '')
                                  }}
                                >
                                  推荐语
                                </span>
                                <span
                                  onClick={() => deleteItem(item)}
                                >
                                  删除
                                </span>
                              </div>
                            </div>
                          </Draggable>

                        )
                      })}
                    </Container>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* 选择商品 */}
      {goodsVisible &&
        <SelectGoodsModal
          visible={goodsVisible}
          onClose={() => setGoodsVisible(false)}
          defaultShop={defaultShop}
          callBackSelectRows={(rows) => {
            setGoodsList(rows);
          }}
          goodsList={goodsList}
        />}
      {/* 更换店铺 */}
      {shopVisible &&
        <SelectShopModal
          visible={shopVisible}
          onClose={() => setShopVisible(false)}
          callBackShop={(row) => setDefaultShop({ shopId: row.shopId, shopName: row.shopName })}
          selectedShopId={defaultShop?.shopId}
        />}
      {/* 操作指引 */}
      {element && (
        <OperationalGuideline
          element={element?.getBoundingClientRect()} // 获取元素
          currentStep={currentStep} // 当前步骤
          callBack={callBack} // 步骤
        />
      )}
      {/* 推荐语弹窗 */}
      <Modal
        open={recommendVisible}
        title='编辑商品推荐语'
        width={530}
        maskClosable={false}
        className='recommend-modal'
        onCancel={() => setRecommendVisibel(false)}
        onOk={() => {
          if (!recommendVal) return message.warning('请至少输入1个字');
          const list = [...goodsList];
          list.forEach((item) => {
            if (item.goodsSkuId === goodsSkuId) item.recommend = recommendVal
          })
          setGoodsList(list);
          setRecommendVisibel(false);
          setRecommendVal('');
        }}
      >
        <div style={{
          display: "flex"
        }}>
          <Input placeholder='请输入商品推荐语' value={recommendVal} maxLength={12} onChange={(e) => setRecommendVal(e.target.value)} />
          <Button type='link' onClick={debounce(insertRecommendWord, 300)}>
            换个推荐语
          </Button>
        </div>
        <p className='recommendWordTip'>
          推荐语可自己编辑或使用系统推荐, 最多12个字
        </p>
        <img src="https://ossprod.jrdaimao.com/file/168058827208132.png" alt="" style={{ width: '100%', marginTop: '13px' }} />
      </Modal>
    </div>
  )
};

export default ShopFinishPage;
