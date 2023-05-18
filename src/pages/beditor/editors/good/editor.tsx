import { iEditorGoods } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Radio, Select, Button, Alert, Table, Upload, message, RadioChangeEvent, Space, Popover } from 'antd';
import React, { useRef, useState } from 'react';
import { MenuOutlined, DownloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import TableList from './tableList';
import { saveAs } from 'file-saver';
import { downloadTemplate, goodsImport, exportErrorGoods, iGoodsData } from '@/api/goods';
import { arrayMoveImmutable, getImageUrl } from '@/utils/tools';
import { SortableContainer, SortableContainerProps, SortableElement, SortableHandle, SortEnd } from 'react-sortable-hoc';
import SelectGoodsModal from './selectModal';
import EditImageModal from '../markets/EditImageModal';
import SelectColor from '../../components/selectColor';
import SelectGoods from './selectGoods'; // 新版的UI样式
const { Option } = Select;
const SortableItem: any = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableBody: any = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);
/**
 * 商品信息编辑
 */
const GoodsiEditor = ({ data: { id } }: { data: iEditorGoods }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorGoods>({ id });
    // showType: 商品栏类型
    // showMore: 是否展示更多
    // goodsType: 展示更多的类型
    // inputGoodName: 输入的活动名称
    // selectData: 更多商品类型选择的数据
    // renderGoodList: 渲染的商品列表数据
    const { showMarkingPrice, showMarketingTag, showType, showMore, goodsType, inputGoodName, selectData, renderGoodList, faildNum, redisKey, fileName, goodBgColor } = data;

    // 当前state
    const [showClick, setShowClick] = useState(false); // 是否可以下载
    const [visible, setVisible] = useState(false); // 更多商品筛选
    const [fileList, setFileList] = useState<Array<any>>([]);
    // const [goodsList, setGoodsList] = useState<Array<any>>(renderGoodList);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的商品key
    const [selectedRows, setSelectedRows] = useState([]); // 对应的选择的数据
    const [faildNumValue, setFaildNum] = useState(faildNum); // 上传商品失败的数量

    const [showEditImageModal, setShowEditImageModal] = useState(false); //编辑图片弹窗
    const editImageIndex = useRef<number>();
    const [isSelectModal, setIsSelectModal] = useState(false); //选择商品弹窗
    const [isSlectType, setIsSelect] = useState(showType);

    // tab 分类
    const columns: any = [
        {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
            fixed: 'left',
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            title: '商品',
            width: 200,
            dataIndex: 'goodsSkuId',
            render: (text: string, record: any) => <div className='goods_table_con'>
                <img className='goods_pic-box' src={getImageUrl(record.good_image)} />
                <div className='goods_detail-box'>
                    <div className='title-box'>{record.goodsSpuSkuTitle || record.goodsTitle}</div>
                    <div className='sku_title'>{record.goodsSkuId}</div>
                </div>
            </div>,
        },
        // {
        //     title: '商品名称',
        //     // dataIndex: 'goodsTitle',
        //     dataIndex: 'goodsSpuSkuTitle',
        //     render: (text: string, record: any) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{text || record.goodsTitle}</div>,
        // },
        {
            title: '营销标签',
            dataIndex: 'sellingTag',
            editable: true,
            width: 110,
            render: (text: string, record: any, index: number) => {
                return <input onBlur={(e) => handleChangeTag(e.target.value, index)} minLength={0} maxLength={8} className="input-text" defaultValue={text} />;
            },
        },
        // {
        //     title: '卖点文案',
        //     dataIndex: 'sellingPoint',
        //     editable: true,
        //     render: (text: string, record: any, index: number) => {
        //         return <input onChange={(e) => handleChangePoint(e.target.value, index)} minLength={0} maxLength={10} className="input-text" defaultValue={text} />;
        //     },
        // },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 60,
            render: (_: any, record: any, index: number) => (
                <div style={{ color: '#1B66FF', textAlign: 'center', cursor: "pointer" }}>
                    <div onClick={() => handleEditImage(record, index)}>更换主图</div>
                    <div onClick={() => handleDel(record, index)}>删除商品</div>
                </div>
            ),
        },
    ];

    const DraggableContainer = (props: SortableContainerProps) => <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />;
    // const DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const DragHandle: any = SortableHandle(() => <img style={{ width: 16, height: 16, cursor: 'grab', marginLeft: 10 }} src='https://ossprod.jrdaimao.com/file/1683525350385466.png' />);
    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(renderGoodList.slice(), oldIndex, newIndex);
            handleChangeValue('renderGoodList', newData);
        }
    };
    const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
        const index = renderGoodList.findIndex((x: any) => x.goodsSkuId === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    //删除选中卖场
    const handleDel = (record: any, index: number) => {
        const newData = renderGoodList.slice();
        newData.splice(index, 1);
        handleChangeValue('renderGoodList', newData);
    };
    //编辑图片
    const handleEditImage = (record: any, index: number) => {
        editImageIndex.current = index;
        setShowEditImageModal(true);
    };
    const updateMarketImg = (url: string) => {
        if (editImageIndex.current || editImageIndex.current === 0) {
            const newData = renderGoodList.slice();
            if (newData[editImageIndex.current]) {
                newData[editImageIndex.current] = Object.assign({}, newData[editImageIndex.current], { good_image: url });
            }
            handleChangeValue('renderGoodList', newData);
        }
    };

    // 修改营销标签内容
    const handleChangeTag = (value: any, index: number) => {
        const copy: any = [...renderGoodList];
        copy[index] = Object.assign({}, copy[index], { sellingTag: value });
        handleChangeValue('renderGoodList', copy);
    };

    // 修改买点文案
    const handleChangePoint = (value: string, index: number) => {
        const copy: any = [...renderGoodList];
        copy[index] = Object.assign({}, copy[index], { sellingPoint: value });
        handleChangeValue('renderGoodList', copy);
    };

    // 选择栏目
    const handleSelect = (val: number) => {
        handleChangeValue('showType', val);
        setIsSelect(val);
    };

    // 划线价格
    const handleShowMarkingPrice = (e: RadioChangeEvent) => {
        handleChangeValue('showMarkingPrice', e.target.value);
    };

    // 划线价格
    const handleShowMarketingTag = (e: RadioChangeEvent) => {
        handleChangeValue('showMarketingTag', e.target.value);
    };

    // 选择是否展示更多商品
    const handleRadio = (e: any) => {
        handleChangeValue('showMore', e.target.value);
    };

    // 活动筛选 优惠券筛选
    const handleGoodsType = (e: any) => {
        handleChangeValue('goodsType', e);
        setVisible(true);
    };

    // 输入商品活动名称
    const handleInputGoodName = (e: any) => {
        handleChangeValue('inputGoodName', e);
    };

    // 关闭弹窗
    const closeModal = () => {
        setVisible(false);
    };

    // 确定
    const comfirmSure = (value: any) => {
        handleChangeValue('selectData', value);
    };

    // 下载商品模版
    const handleUpload = async () => {
        try {
            const res: any = await downloadTemplate({
                template: '商品导入模版.xlsx',
            });
            saveAs(res, '商品导入模版.xlsx');
        } catch (error) {
            console.log('fail--', error);
        }
    };
    // 上传商品模版
    const handleUploadFile = async (uploadFile: any) => {
        console.log(uploadFile);
        const uploadReg = /\.(xls|xlsx)$/;
        if (!uploadReg.test(uploadFile.file.name)) {
            message.error('仅支持xlsx、xls格式的图片');
            return;
        }
        const size = uploadFile.file.size / (1024 * 1024);
        if (size > 5) {
            message.error('文件大小不得大于5M!');
            return;
        }
        const filedata = new FormData();
        filedata.append('file', uploadFile.file);
        const fileDetail = uploadFile.file;
        handleChangeValue('fileName', fileDetail.name || '');
        try {
            const res: any = await goodsImport(filedata);
            const blobReader = new Response(res).json();
            blobReader.then((res) => {
                if (res) {
                    const data = res.data;
                    const list = [
                        {
                            key: fileDetail.uid,
                            uid: fileDetail.uid,
                            name: uploadFile.file.name,
                            status: 'done',
                            dataList: data.operActivityGoodsVOS,
                            redisKey: data.redisKey,
                            faildNum: data.faildNum || 0, // 上传失败的数量
                        },
                    ];

                    if (Array.isArray(data.operActivityGoodsVOS)) {
                        data.operActivityGoodsVOS.forEach((v: any) => {
                            v.goodsTitle = v.goodsSpuSkuTitle;
                            v.good_image = getImageUrl(v.goodsMainPic) || '';
                        });
                    }

                    // setGoodsList(data.operActivityGoodsVOS);
                    handleChangeValue('renderGoodList', data.operActivityGoodsVOS || []);
                    setFaildNum(data.faildNum);
                    handleChangeValue('faildNum', data.faildNum);
                    handleChangeValue('redisKey', data.redisKey);
                    setFileList(list);
                }
            });
        } catch (error) {
            console.log('--上传失败--', error);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
    };

    // 下载失败数据列表
    const handleExportError = async () => {
        try {
            const res: any = await exportErrorGoods({
                importId: redisKey,
            });
            saveAs(res, '商品批量导入失败条.xlsx');
        } catch (error) {
            console.log('---', error);
        }
    };

    // 批量删除
    const delateSome = () => {
        if (selectedRows.length == 0) {
            return message.error('请选择要删除的商品');
        }
        let newList = renderGoodList;
        selectedRows.map((item: any) => {
            newList = newList.filter((res) => {
                return res.goodsSkuId !== item.goodsSkuId;
            });
        });
        // 更新数据
        // setGoodsList(newList);
        handleChangeValue('renderGoodList', newList);
        setSelectedRowKeys([]);
    };

    //选择商品回调
    const selectGoods = (list: any[]) => {
        const shopIds = renderGoodList.map((item) => item.goodsSkuId);
        const newlist: iGoodsData[] = [...renderGoodList];
        list.forEach((item: iGoodsData) => {
            if (!shopIds.includes(item.goodsSkuId)) {
                item.good_image = getImageUrl(item.goodsMainPic) || 'https://ossprod.jrdaimao.com/file/167291212548127.png';
                newlist.push(item);
            }
        });

        handleChangeValue('renderGoodList', newlist);
        setIsSelectModal(false);
    };

    // 修改商品背景颜色
    const handleGoodBgColor = (e: any) => {
        handleChangeValue('goodBgColor', e);
    };


    return (
        <div id="goods-editor" className="editor-module-box">
            <div className="control-group">
                <div className="control-group__title">商品布局：</div>
            </div>
            <div className="control-group">
                <Button className={isSlectType != 1 ? 'goods-types-item' : 'active_types_item'} onClick={() => handleSelect(1)}>
                    <img className='button-img' src={isSlectType == 1 ? 'https://ossprod.jrdaimao.com/file/1683514237817866.png' : 'https://ossprod.jrdaimao.com/file/1683513805603859.png'} />
                    单列
                </Button>
                <Button className={isSlectType != 2 ? 'goods-types-item' : 'active_types_item'} onClick={() => handleSelect(2)}>
                    <img className='button-img' src={isSlectType == 2 ? 'https://ossprod.jrdaimao.com/file/1683514258545290.png' : 'https://ossprod.jrdaimao.com/file/1683513848195590.png'} />
                    双列
                </Button>
                <Button className={isSlectType != 3 ? 'goods-types-item' : 'active_types_item'} onClick={() => handleSelect(3)}>
                    <img className='button-img' src={isSlectType == 3 ? 'https://ossprod.jrdaimao.com/file/1683514273584382.png' : 'https://ossprod.jrdaimao.com/file/16835140225638.png'} />
                    三列
                </Button>
                <Button className={isSlectType != 4 ? 'goods-types-item' : 'active_types_item'} onClick={() => handleSelect(4)}>
                    <img className='button-img' src={isSlectType == 4 ? 'https://ossprod.jrdaimao.com/file/168351428923711.png' : 'https://ossprod.jrdaimao.com/file/1683513928855376.png'} />
                    横滑
                </Button>
            </div>
            <div className="control-group">
                <div className="control-group__title">划线价格：</div>
                <Radio.Group onChange={handleShowMarkingPrice} value={showMarkingPrice}>
                    <Radio value={true}>显示</Radio>
                    <Radio value={false}>不显示</Radio>
                </Radio.Group>
            </div>
            <div className="control-group">
                <div className="control-group__title">营销标签：</div>
                <Radio.Group onChange={handleShowMarketingTag} value={showMarketingTag}>
                    <Radio value={true}>显示</Radio>
                    <Radio value={false}>不显示</Radio>
                </Radio.Group>
            </div>
            <div className="control-group">
                <div className="control-group__title">背景颜色：</div>
                <SelectColor value={goodBgColor} defaultValue="transparent" onChange={handleGoodBgColor} />
            </div>
            <div className="control-group">
                <div className="control-group__title">选择商品：</div>
            </div>
            <div className="control-group">
                <Button
                    style={{ flex: 2, borderRadius: 8, border: '1px dashed #F05233', color: '#1B66FF' }}
                    onClick={() => {
                        setIsSelectModal(true);
                    }}
                >
                    手动添加选择商品({renderGoodList.length})
                </Button>
                <Popover placement="bottom" content={<div>
                    <div>
                        <Button onClick={() => handleUpload()} style={{ flex: 1, borderRadius: 8, }}>
                            <DownloadOutlined />
                            下载导入模板
                        </Button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <Upload fileList={fileList} name="file" style={{ flex: 1 }} showUploadList={false} customRequest={(e) => handleUploadFile(e)}>
                            <Button style={{ flex: 1, borderRadius: 8, }}>
                                <DatabaseOutlined />
                                表格导入商品
                            </Button>
                        </Upload>
                    </div>
                </div>} >
                    <Button
                        style={{ flex: 1, marginLeft: 8, borderRadius: 8 }}
                    >
                        表格导入商品
                    </Button>
                </Popover>
            </div>
            <div className="item-base-box">
                {renderGoodList.length > 0 && <div>已上传文件：{fileName}</div>}
                {faildNumValue > 0 && (
                    <Alert
                        onMouseEnter={() => {
                            setShowClick(true);
                        }}
                        onMouseLeave={() => {
                            setShowClick(false);
                        }}
                        message={
                            <>
                                共{faildNumValue}条上传失败 <a onClick={() => handleExportError()}>点击下载失败列表</a>
                            </>
                        }
                        type={showClick ? 'info' : 'error'}
                        showIcon
                    />
                )}
                {/* <div className="delate-box">
                    <Button onClick={() => delateSome()}>批量删除</Button>
                </div> */}
            </div>

            {/* 商品列表 */}
            <div className="control-group">
                <Table
                    rowKey="goodsSkuId"
                    scroll={{ y: 700, x: 520 }}
                    columns={columns}
                    bordered={false}
                    dataSource={renderGoodList}
                    pagination={false}
                    components={{
                        body: {
                            wrapper: DraggableContainer,
                            row: DraggableBodyRow,
                        },
                    }}
                />
            </div>

            {/* 筛选弹窗 */}
            {visible ? (
                <TableList visible={visible} affirm={selectData ? selectData : {}} closeModal={closeModal} comfirmSure={comfirmSure} num={goodsType} title="更多商品条件" />
            ) : null}
            {isSelectModal && <SelectGoodsModal defaultChecked={renderGoodList} visible={isSelectModal} onSave={selectGoods} onCancel={() => setIsSelectModal(false)} />}
            {/* {isSelectModal && <div className='select-goods-contain'>
                {<SelectGoods defaultChecked={renderGoodList} onSave={selectGoods} onCancel={() => setIsSelectModal(false)} />}
            </div>} */}
            {showEditImageModal && (
                <EditImageModal
                    item={((editImageIndex.current || editImageIndex.current === 0) && renderGoodList[editImageIndex.current]) || null}
                    showEditImageModal={showEditImageModal}
                    setShowEditImageModal={setShowEditImageModal}
                    updateMarketImg={updateMarketImg}
                    imageSizeSuggestionType="goods"
                    title="编辑商品图片"
                />
            )}
        </div>
    );
};

export default GoodsiEditor;
