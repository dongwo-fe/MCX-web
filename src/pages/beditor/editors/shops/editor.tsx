import React, { useRef, useState } from 'react';
import { Button, message, Radio, RadioChangeEvent, Select, Space, Table } from 'antd';
import './index.scss';
import { downloadShopTemplate, shopImport } from '@/service/editor';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { initBlockData } from '@/store/editor';
import { iEditorShops } from '@/store/config';
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable, getImageUrl } from '@/utils/tools';
import SelectShopModal from './selectModal';
import { iShopData } from '@/api/shops';
import EditImageModal from '../markets/EditImageModal';
const SortableItem: any = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableBody: any = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);

const ShopsEditor = ({ data: { id } }: { data: iEditorShops }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorShops>({ id });
    const { shop_list, shop_show_type } = data;
    const [isSelectModal, setIsSelectModal] = useState(false);
    const [showEditImageModal, setShowEditImageModal] = useState(false); //编辑图片弹窗
    const editImageIndex = useRef<number>();
    const selectShops = (list: any[]) => {
        const shopIds = shop_list.map((item) => item.shopId);
        const newlist: iShopData[] = [...shop_list];
        list.forEach((v: iShopData) => {
            if (!shopIds.includes(v.shopId)) {
                v.shop_image = getImageUrl(v.mainKey);
                newlist.push(v);
            }
        });

        handleChangeValue('shop_list', newlist);
        setIsSelectModal(false);
    };
    //卖场列表展示切换
    const onShopShowTypeChange = (e: RadioChangeEvent) => {
        handleChangeValue('shop_show_type', e.target.value);
    };

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
            title: '店铺编号',
            dataIndex: 'shopCode',
            className: 'drag-visible',
        },
        {
            title: '店铺',
            dataIndex: 'shopName',
        },

        {
            title: '操作',
            dataIndex: 'action',
            width: 80,
            fixed: 'right',
            render: (_: any, record: any, index: number) => (
                <Space>
                    <a onClick={() => handleDel(record, index)}>删除</a>
                    <a onClick={() => handleEditImage(record, index)}>编辑图片</a>
                </Space>
            ),
        },
    ];
    //删除选中卖场
    const handleDel = (record: any, index: number) => {
        const newData = shop_list.slice();
        newData.splice(index, 1);
        handleChangeValue('shop_list', newData);
    };
    //编辑图片
    const handleEditImage = (record: any, index: number) => {
        editImageIndex.current = index;
        setShowEditImageModal(true);
    };
    const updateMarketImg = (url: string) => {
        if (editImageIndex.current || editImageIndex.current === 0) {
            const newData = shop_list.slice();
            if (newData[editImageIndex.current]) {
                newData[editImageIndex.current] = Object.assign({}, newData[editImageIndex.current], { shop_image: url });
            }
            handleChangeValue('shop_list', newData);
        }
    };
    const DraggableContainer = (props: SortableContainerProps) => <SortableBody useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />;
    const DragHandle: any = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable(shop_list.slice(), oldIndex, newIndex);
            handleChangeValue('shop_list', newData);
        }
    };
    const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
        const index = shop_list.findIndex((x: any) => x.shopId === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    return (
        <div id="shops-editor">
            <div className="control-group">
                <div className="control-group__title">店铺列表</div>
                <div className="ml-auto" />
                <Radio.Group onChange={onShopShowTypeChange} value={shop_show_type}>
                    <Radio value={'one'}>单栏</Radio>
                    <Radio value={'two'}>双栏</Radio>
                    <Radio value={'three'}>三栏</Radio>
                    <Radio value={'four'}>四栏</Radio>
                </Radio.Group>
            </div>
            <div className="control-group">
                <div className="control-group__title">选择店铺</div>
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setIsSelectModal(true);
                    }}
                >
                    选择店铺
                </Button>
            </div>

            <Table
                rowKey="shopId"
                style={{ marginTop: 10 }}
                columns={columns}
                bordered
                dataSource={shop_list}
                pagination={false}
                scroll={{ y: 800, x: 500 }}
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                    },
                }}
            />
            {isSelectModal && <SelectShopModal defaultChecked={shop_list} visible={isSelectModal} onSave={selectShops} onCancel={() => setIsSelectModal(false)} />}
            {showEditImageModal && (
                <EditImageModal
                    item={((editImageIndex.current || editImageIndex.current === 0) && shop_list[editImageIndex.current]) || null}
                    showEditImageModal={showEditImageModal}
                    setShowEditImageModal={setShowEditImageModal}
                    updateMarketImg={updateMarketImg}
                    imageSizeSuggestionType="shop"
                    title="编辑店铺图片"
                />
            )}
        </div>
    );
};

export default ShopsEditor;
