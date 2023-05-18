import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { insertOne, setBlockShow, deleteOne, changeItemLocation, initBlockData, changeLockBlock, syncBlock } from '@/store/editor';
// import Render_Goods from './center-item/goods';
import Render_Form from './editors/form/render';
import Render_Coupons from './editors/coupons/render';
import { Modal, Popover, message } from 'antd';
import { typeNames } from './config';
import RichText from './editors/richText/render';
import Render_Title_Paragraph from './editors/paragraph/render';
import Render_Notice from './editors/notice/render';
import Render_Dividing_Line from './editors/dividing/render';
import Render_Image_Puzzle from './editors/puzzle/render';
import Render_Add_BeanVermical from './editors/addBeanVermicelli/render';
import Render_Markets from './editors/markets/render';
import Render_Video from './editors/buildvideo/render';
import Render_Image_Text_Nav from './editors/graphical/render';
import Render_Elevator from './editors/elevator/render';
import Render_Banner from './editors/banner/render';
import Render_Image_Hot from './editors/imageHot/render';
import Render_Image_Deal from './editors/imageDeal/render';
import Render_Goods from './editors/good/render';
import Render_Shops from './editors/shops/render';
import ProvinceAndCityShopEditor from '@/pages/beditor/editors/provinceAndCityShop/render';
import DynamicFormEditor from '@/pages/beditor/editors/dynamicForm/render';
import { createID } from '@/utils/tools';
import { iEditorPage, iEditorBlock } from '@/store/config';
import TCardsList from './components/tcardsList/tcardsList';
import { iEditor } from '@/store/config';

//渲染层
export default function Render(props: any) {
    const dispatch = useDispatch();
    const { collapsed } = props;
    const PageData: iEditorPage = useSelector((state: any) => state.editor.page);
    const showPageAttr = props.showPageAttr;
    const showModuleAttr = props.showModuleAttr;
    const store = useSelector<{ editor: iEditor }, iEditor>((state) => state.editor);
    //接收拖拽之后的组件
    const [, drop] = useDrop(
        () => ({
            accept: 'box',
            drop(item: { type: string }, monitor) {
                const didDrop = monitor.didDrop();
                if (didDrop) return;

                // dispatch(insertOne({ type: item.type }));
                if (!initBlockData[item.type]) return console.warn('模块没有初始化方法', item.type);
                if (store.blocks.some((value) => value.type === 'provinceAndCityShop') && item.type === 'provinceAndCityShop') {
                    message.warning('只能有一个预约门店组件');
                    return;
                }
                const blockData = initBlockData[item.type]();
                dispatch(insertOne({ data: blockData }));
                dispatch(setBlockShow({ id: null }));
                setTimeout(() => {
                    dispatch(setBlockShow({ id: blockData.id }));
                }, 100);
            },
        }),
        [store.blocks]
    );

    const EditorData = useSelector((state: any) => state.editor);
        
    // console.log(editorContext)

    return (
        <div className="render" style={{ left: collapsed ? '0' : '260px' }} onClick={showPageAttr}>
            {PageData.pageType !== 'member' && <TCardsList tcards={EditorData.tcards} />}
            <div className="modules mx-auto" style={{ backgroundColor: PageData.bgColor, position: 'relative' }} ref={drop}>
                {PageData.pageType === 'member' && (
                    <div className="vip-box">
                        <div className="city">
                            {PageData.cityName || '请选择城市'}
                            {'>'}
                        </div>
                        {PageData.showType == 1 && <img src={require('../../img/vip1.png')} alt="" />}
                        {PageData.showType == 2 && <img src={require('../../img/vip2.png')} alt="" />}
                    </div>
                )}
                {store.posterShare && <div style={{ left: collapsed ? '0' : '260px' }} className={`poster_share_con ${store.posterShare.cardTheme}`}>
                    <div className='poster_share_btn'>
                        <div className='poster_share_btn_img'></div>
                    </div>
                </div>}
                {EditorData.renderBlocks.map((item: any, index: number) => (
                    <RenderItem key={item.id} item={item} index={index} lastIndex={EditorData.blocks.length - 1} showModuleAttr={showModuleAttr} showPageAttr={showPageAttr} />
                ))}
                <div className="default-context-part">
                    <div className="part-box-show">组件放置区域</div>
                </div>
                {PageData.pageType === 'member' && (
                    <>
                        <div className="vip-footer-box1" />
                        <div className="vip-footer-box">
                            {PageData.showType == 1 && <img src={require('../../img/vip11.png')} alt="" />}
                            {PageData.showType == 2 && <img src={require('../../img/vip22.jpg')} alt="" />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

//渲染基本的模块容器
function RenderItem(props: { item: iEditorBlock; index: number; lastIndex: number; showModuleAttr: Function; showPageAttr: Function }) {
    const blockData = props.item;
    const dispatch = useDispatch();
    const showModuleAttr = props.showModuleAttr;
    const showPageAttr = props.showPageAttr;
    const editBlockId = useSelector((state: any) => state.editor.editBlockId);
    const editTCardIsMain = useSelector((state: any) => state.editor.editTCardIsMain);
    const store = useSelector<{ editor: iEditor }, iEditor>((state) => state.editor);

    const [{ isOver, isOverCurrent }, drop] = useDrop(
        () => ({
            accept: 'box',
            drop(data: any, monitor) {
                const didDrop = monitor.didDrop();
                if (didDrop) return;
                // console.log('Render_Image', data, blockData);
                // dispatch(insertOne({ type: data.type }));
                if (!initBlockData[data.type]) return console.warn('模块没有初始化方法', data.type);
                if (store.blocks.some((value) => value.type === 'provinceAndCityShop') && data.type === 'provinceAndCityShop') {
                    message.warning('只能有一个预约门店组件');
                    return;
                }
                const blockData = initBlockData[data.type]();
                dispatch(insertOne({ data: blockData, index: props.index }));
                dispatch(setBlockShow({ id: null }));
                setTimeout(() => {
                    dispatch(setBlockShow({ id: blockData.id }));
                }, 100);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                isOverCurrent: monitor.isOver({ shallow: true }),
            }),
        }),
        [props.index, store.blocks]
    );
    //弹出属性编辑窗口
    function showPageEditor(event: MouseEvent) {
        event.stopPropagation();
        if (editBlockId !== blockData.id) {
            showModuleAttr(blockData);
        }
    }

    function onDeleteItem(event: MouseEvent) {
        event.stopPropagation();
        showPageAttr();
        dispatch(deleteOne({ id: blockData.id }));
    }
    function handleCopy(event: any) {
        event.stopPropagation();
        if (store.blocks.some((item) => item.type === 'provinceAndCityShop') && blockData.type === 'provinceAndCityShop') {
            return message.warning('只能有一个预约门店组件');
        }
        const id = createID();
        const copyData = Object.assign({}, blockData, { id, isLock: undefined });
        dispatch(insertOne({ data: copyData }));
        dispatch(setBlockShow({ id: null }));
        setTimeout(() => {
            dispatch(setBlockShow({ id: id }));
        }, 100);
    }
    function onItemChangeLocation(event: MouseEvent, num: number) {
        event.stopPropagation();
        if ((props.index === 0 && num === -1) || (props.index === props.lastIndex && num === 1)) {
            return;
        }
        dispatch(changeItemLocation({ index: props.index, toindex: props.index + num }));
    }

    function onLockClick(e: MouseEvent, isLock: boolean) {
        // 解锁 锁定
        e.stopPropagation();
        dispatch(changeLockBlock({ isLock: isLock, id: blockData.id }));
    }

    function onSyncBlockClick(e: MouseEvent) {
        e.stopPropagation();

        Modal.confirm({
            title: editTCardIsMain ? '是否同步此模块到其他流量卡?' : '是否同步此模块在默认流量卡的内容?',
            okText: '确认',
            onOk: () => {
                // 同步主模版
                dispatch(syncBlock({ id: blockData.id }));
            },
        });
    }
    return (
        <div
            ref={drop}
            className="module_item relative"
            onClick={(e: any) => showPageEditor(e)}
            style={{ minHeight: blockData.height || 100, backgroundColor: blockData.backgroundColor || '#0000' }}
        >
            {isOverCurrent && (
                <div className="default-context-part">
                    <div className="part-box-show">组件放置区域</div>
                </div>
            )}
            <div className={`module_item1 ${blockData.id === editBlockId ? 'module_item1_active' : ''}`}>
                {/* 正在使用的模块 */}
                {blockData.type === 'title_paragraph' && <Render_Title_Paragraph data={blockData} index={props.index} />}
                {blockData.type === 'rich_text' && <RichText data={blockData as any} index={props.index} />}
                {blockData.type === 'banner' && <Render_Banner data={blockData} index={props.index} />}
                {blockData.type === 'image_puzzle' && <Render_Image_Puzzle data={blockData} index={props.index} />}
                {blockData.type === 'image_hot' && <Render_Image_Hot data={blockData} index={props.index} />}
                {blockData.type === 'image_text_nav' && <Render_Image_Text_Nav data={blockData} index={props.index} />}
                {blockData.type === 'elevator_navigation' && <Render_Elevator data={blockData} index={props.index} />}
                {blockData.type === 'notice' && <Render_Notice data={blockData} index={props.index} />}
                {blockData.type === 'video' && <Render_Video data={blockData} index={props.index} />}
                {blockData.type === 'dividing_line' && <Render_Dividing_Line data={blockData} index={props.index} />}
                {blockData.type === 'markets' && <Render_Markets data={blockData} index={props.index} />}
                {blockData.type === 'forms' && <Render_Form data={blockData as any} index={props.index} />}
                {blockData.type === 'coupons' && <Render_Coupons data={blockData as any} index={props.index} />}
                {blockData.type === 'addBeanVermicelli' && <Render_Add_BeanVermical data={blockData} index={props.index} />}
                {blockData.type === 'image_deal' && <Render_Image_Deal data={blockData} index={props.index} />}
                {blockData.type === 'goods' && <Render_Goods data={blockData as any} index={props.index} />}
                {blockData.type === 'provinceAndCityShop' && <ProvinceAndCityShopEditor data={blockData} index={props.index} />}
                {blockData.type === 'dynamicForm' && <DynamicFormEditor data={blockData as any} index={props.index} />}
                {/* 先注释隐藏 */}
                {/* {blockData.type === 'button' && <Render_Button data={blockData as any} index={props.index} />} */}

                {/* 2.0 准备增加的组件 */}
                {blockData.type === 'shops' && <Render_Shops data={blockData as any} index={props.index} />}
                {/* {blockData.type === 'goods' && <Render_Goods data={blockData as any} index={props.index} />} */}
                {blockData.isLock && (
                    <div className="module_item1_lock">
                        <i className="fa fa-lock" aria-hidden="true"></i>
                        <div>内容自动同步默认数据</div>
                    </div>
                )}
            </div>

            <div className="floor absolute">
                <div className="floor_txt">
                    {typeNames[blockData.type]}-{props.index + 1}F
                </div>
            </div>
            {blockData.id === editBlockId && (
                <div className="opera absolute">
                    <div className="opera_list">
                        {blockData.isLock === true && (
                            <Popover placement="right" content={<span>解锁</span>}>
                                <div className="opera_item cursor-pointer" onClick={(e: any) => onLockClick(e, false)}>
                                    <i className="fa fa-unlock" aria-hidden="true"></i>
                                </div>
                            </Popover>
                        )}
                        {blockData.isLock === false && (
                            <Popover placement="right" content={<span>锁定</span>}>
                                <div className="opera_item cursor-pointer" onClick={(e: any) => onLockClick(e, true)}>
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                </div>
                            </Popover>
                        )}

                        {!(!editTCardIsMain && blockData.isLock === undefined) && (
                            <Popover placement="right" content={<span>同步</span>}>
                                <div className="opera_item cursor-pointer" onClick={(e: any) => onSyncBlockClick(e)}>
                                    <i className="fa fa-rotate-right" aria-hidden="true"></i>
                                </div>
                            </Popover>
                        )}

                        <Popover placement="right" content={<span>向上</span>}>
                            <div className="opera_item cursor-pointer" onClick={(e: any) => onItemChangeLocation(e, -1)}>
                                <i className="fa fa-arrow-circle-up" aria-hidden="true"></i>
                            </div>
                        </Popover>
                        <Popover placement="right" content={<span>向下</span>}>
                            <div className="opera_item cursor-pointer" onClick={(e: any) => onItemChangeLocation(e, 1)}>
                                <i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
                            </div>
                        </Popover>
                        <Popover placement="right" content={<span>复制</span>}>
                            <div className="opera_item cursor-pointer" onClick={handleCopy}>
                                <i className="fa fa-clone" aria-hidden="true"></i>
                            </div>
                        </Popover>
                        <Popover placement="right" content={<span>删除</span>}>
                            <div className="opera_item cursor-pointer" onClick={(e: any) => onDeleteItem(e)}>
                                <i className="fa fa-trash-o text-red-500" aria-hidden="true"></i>
                            </div>
                        </Popover>
                    </div>
                </div>
            )}
        </div>
    );
}
