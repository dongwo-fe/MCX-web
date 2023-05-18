import { iEditorBlock, iEditorGoods, GoodsItem } from '@/store/config';
import { getImageUrl } from '@/utils/tools';
import React from 'react';
import './index.scss';

// 商品渲染
const Render_Goods = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorGoods;
    const { showType, showMore, goodsType, inputGoodName, renderGoodList, showMarketingTag, showMarkingPrice, goodBgColor } = data;
    // 数组列表
    const list = [[1, 2], [1, 2], [1, 2, 3], [1, 2, 3]];

    // 基础渲染
    const itemGood = (item: any) => {
        return (
            <div className="base-item-render" style={{ width: dealItemWidth() }}>
                <img className="image-show-box" style={{
                    height: dealItemWidth()
                }} src={item.good_image || getImageUrl(item.goodsMainPic) || '/image/permissionsId.png'} />
                {/* {showMarketingTag && <div className="sale-text-box">{item.sellingPoint || '卖点标签'}</div>} */}
                <div className="goods-detail-box">
                    <div>
                        <div className="good-name">{item.goodsSpuSkuTitle || item.goodsTitle || '商品标题'}</div>
                        {showMarketingTag && <div className="sale-tag-middle-single">{item.sellingTag || '营销标签'}</div>}
                        <div className='money-row'>
                            <span className="money-tag-sin">¥ </span>
                            <span className="money-show-sin">{item.goodsMinPrice || item.goodsPrice || '0.00'}</span>
                            {showMarkingPrice && showType !== 3 && (
                                <div className='ml-20'>
                                    <span className="money-show-sin line-through">¥{item.goodsMaxMarketPrice || item.goodsPrice || '0.00'}</span>
                                </div>
                            )}
                        </div>
                        {showMarkingPrice && showType == 3 && (
                            <div>
                                <span className="money-show line-through">¥{item.goodsMaxMarketPrice || item.goodsPrice || '0.00'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // 单个商品的时候
    const singleGoods = (item: any) => {
        return <div className='single-goods-con'>
            <img className="goods-image-box" src={item.good_image || getImageUrl(item.goodsMainPic) || '/image/permissionsId.png'} />
            <div className='single-detail-box'>
                <div className="good-title-de">{item.goodsSpuSkuTitle || item.goodsTitle || '商品标题'}</div>
                <div style={{ display: 'inline-block', height: 40 }}>
                    {showMarketingTag && <div className="sale-tag-middle-single">{item.sellingTag || '营销标签'}</div>}
                </div>
                <div className='price-box'>
                    <span className="money-tag-sin">¥ </span>
                    <span className="money-show-sin">{item.goodsMinPrice || item.goodsPrice || '0.00'}</span>
                    {showMarkingPrice && <span className="money-show-sin line-through">¥{item.goodsMaxMarketPrice || item.goodsPrice || '0.00'}</span>}
                </div>
            </div>
        </div>
    };

    // 处理展示宽度
    const dealItemWidth = () => {
        switch (showType) {
            case 1:
                return '110px';
            case 2:
                return '170px';
            case 3:
                return '110px';
            case 4:
                return '140px';
            default:
                return '140px';
        }
    };

    // 无数据样式渲染
    const emptyRender = () => {
        return <div className={showType == 1 ? "diff-render-goods-box" : showType == 4 ? "render-horizontal-box" : "render-goods-box"}>
            {list[showType - 1].map((item, index) => {
                return <div key={index}>{showType == 1 ? singleGoods(item) : itemGood(item)}</div>;
            })}
        </div>
    };

    // 竖向的样式渲染
    const commonRender = () => {
        return <div className={showType == 1 ? "diff-render-goods-box" : showType == 4 ? "render-horizontal-box" : "render-goods-box"}>
            {renderGoodList.map((item, index) => {
                return <div key={index}>{showType == 1 ? singleGoods(item) : itemGood(item)}</div>;
            })}
        </div>
    };

    // 横向的数据渲染
    const horizontalRender = () => {
        return <div className="render-horizontal-box">
            {renderGoodList.map((item, index) => {
                return <div key={index}>{itemGood(item)}</div>;
            })}
        </div>
    };

    return (
        <div className="contain-box-render" style={{ backgroundColor: goodBgColor }}>
            {showMore && <div className="check-more-goods">查看更多商品{'>'} </div>}
            {renderGoodList.length > 0 ? showType == 4 ? horizontalRender() : commonRender() : emptyRender()}
        </div>
    );
};

export default React.memo(Render_Goods);
