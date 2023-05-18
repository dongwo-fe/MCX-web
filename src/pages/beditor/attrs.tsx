import { setBlockShow } from '@/store/editor';
import React, { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ParagraphEditor from './editors/paragraph/editor';
import BannerEditor from './editors/banner/banner';
import ShopsEditor from '@/pages/beditor/editors/shops/editor';
import FormEditor from '@/pages/beditor/editors/form';
import CouponsEditor from '@/pages/beditor/editors/coupons/editor';
import { typeNames } from './config';
import RichTextEditor from './editors/richText/editor';
import NoticeEditor from './editors/notice/editor';
import DividingLineEditor from './editors/dividing/editor';
import ImagePuzzleEditor from './editors/puzzle/editor';
import AddBeanVermicelliEditor from './editors/addBeanVermicelli/editor';
import MarketsiEditor from './editors/markets/editor';
import VideoiEditor from './editors/buildvideo/editor';
import GraphicaliEditor from './editors/graphical/editor';
import ElevatoriEditor from './editors/elevator/editor';
import ImageHotiEditor from './editors/imageHot/editor';
import PageEditor from './editors/pageEditor';
import ImageDealiEditor from './editors/imageDeal/editor';
import GoodsiEditor from './editors/good/editor';
import { iEditorPage } from '@/store/config';
import PageEditorMember from './editors/pageEditorMember';
import { DatePicker, Radio } from 'antd';
import moment, { Moment } from 'moment';
import useChangeEditorItemValue from './hooks/useChangeEditorItemValue';
import ProvinceAndCityShopEditor from './editors/provinceAndCityShop/editor';
import DynamicForm from './editors/dynamicForm/editor';
import ShowTypeComp from './editors/component/showTypeComp';
const RangePicker: any = DatePicker.RangePicker;

//渲染区间的宽度是固定500
export const RenderWidht = 500;

const Attrs = forwardRef(function Attrs(props: any, ref: any) {
    const dispatch = useDispatch();
    const editBlockId = useSelector((state: any) => state.editor.editBlockId);
    const [data, handleChangeValue] = useChangeEditorItemValue<any>({ id: editBlockId });

    const PageData: iEditorPage = useSelector((state: any) => state.editor.page);
    const model = useSelector((state: any) => (state.editor.editBlockId ? state.editor.renderBlocks.find((item: any) => item.id === state.editor.editBlockId) : null));
    // const handleSelect = (e) => {
    //     handleChangeValue('showTimeType', e.target.value);
    // };
    // const showType = data?.showTimeType || 0;
    // const startTime = data?.showStartTime;
    // const endTime = data?.showEndTime;
    return (
        <div className={model && model.type === 'rich_text' ? 'atters atters1' : 'atters'}>
            <div className="relative">
                {(!model || model.isLock) && (PageData.pageType === 'member' ? <PageEditorMember /> : <PageEditor />)}
                <div
                    className={
                        model && model.isLock !== true
                            ? 'attr_item attr_item_module'
                            : 'attr_item attr_item_module w-full attr_out'
                    }
                >
                    {model && (
                        <div className="module_attr attr_image">
                            <div className="component-title">
                                <div className="component-title__name">
                                    {typeNames[model.type]}
                                    <span>ID：{model.id}</span>
                                </div>
                                <div className="float-right mx-3 cursor-pointer" onClick={() => dispatch(setBlockShow({ id: null }))}>
                                    <i className="fa fa-close" aria-hidden="true"></i>
                                </div>
                            </div>
                            {!['dynamicForm', 'provinceAndCityShop', 'coupons'].includes(model.type) && <ShowTypeComp id={model.id} />}
                            {/* 正在使用的模块 */}
                            {model.type === 'title_paragraph' && <ParagraphEditor data={model} />}
                            {model.type === 'rich_text' && <RichTextEditor data={model} />}
                            {model.type === 'banner' && <BannerEditor data={model} />}
                            {model.type === 'image_puzzle' && <ImagePuzzleEditor data={model} />}
                            {model.type === 'image_hot' && <ImageHotiEditor data={model} />}
                            {model.type === 'image_text_nav' && <GraphicaliEditor data={model} />}
                            {model.type === 'elevator_navigation' && <ElevatoriEditor data={model} />}
                            {model.type === 'notice' && <NoticeEditor data={model} />}
                            {model.type === 'video' && <VideoiEditor data={model} />}
                            {model.type === 'dividing_line' && <DividingLineEditor data={model} />}
                            {model.type === 'markets' && <MarketsiEditor data={model} />}
                            {model.type === 'forms' && <FormEditor data={model} />}
                            {model.type === 'coupons' && <CouponsEditor data={model} />}
                            {model.type === 'addBeanVermicelli' && <AddBeanVermicelliEditor data={model} />}
                            {model.type === 'image_deal' && <ImageDealiEditor data={model} />}
                            {model.type === 'goods' && <GoodsiEditor data={model} />}
                            {model.type === 'shops' && <ShopsEditor data={model} />}
                            {model.type === 'provinceAndCityShop' && <ProvinceAndCityShopEditor data={model} />}
                            {model.type === 'dynamicForm' && <DynamicForm data={model} /> }
                            {/* 暂时注掉 */}
                            {/* {model.type === 'button' && <ButtonEditor data={model} />} */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Attrs;
