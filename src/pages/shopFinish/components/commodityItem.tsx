import React from "react";
import './commodityItem.less';
import { GoodsItem } from "./selectGoodsModal";

interface CommodityItemProps {
  item: GoodsItem
}

const CommodityItem = ({item}: CommodityItemProps) => {
  return (
    <div className='commodity-wrap'>
      <img src={item.goodsPic || item.goodsMainPic} alt="" />
      <div className='commodity-wrap-content'>
        <div className='commodity-wrap-content-desc'>
          {item.goodsSkuTitle || item.goodsTitle}
        </div>
        {item?.recommend ? (
          <div className='commodity-wrap-content-recommend'>
            {item.recommend || ''}
            <img src="https://ossprod.jrdaimao.com/file/1679365751469405.png" alt="" />
            <img src="https://ossprod.jrdaimao.com/file/1679365768267205.png" alt="" />
          </div>
        ) : <div style={{width: '100%', height: 36, marginBottom: 15}}/>}
        <div className='commodity-wrap-content-price'>
          ¥
          <span
            style={{
              fontSize: '20px',
              fontFamily: 'DINAlternate-Bold, DINAlternate',
              fontWeight: 'bold',
              color: '#FC4B4B',
              margin: '0 4px 0 2px',
            }}
          >
            {item.goodsMaxPrice}
          </span>
          {item.goodsMaxMarketPrice && (
            <span
              style={{
                fontSize: '14px',
                fontFamily: 'PingFangSC-Regular, PingFang SC',
                fontWeight: '400',
                color: '#93979E',
                textDecoration:'line-through'
              }}
            >
              ¥{item.goodsMaxMarketPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommodityItem;