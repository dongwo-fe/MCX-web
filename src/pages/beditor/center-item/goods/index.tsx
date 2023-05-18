import { iEditorGoods } from '@/store/config';
import React from 'react';
import './index.less';

interface IGoods {
    data: iEditorGoods;
    index: number;
}

const Goods = ({ data }: IGoods) => {
    return (
        <div className={'center-shop-goods'} style={{ gridTemplateColumns: `repeat(${data.hurdle},1fr)` }}>
            {data.list.map((item, index: number) => {
                return (
                    <div key={index} className={'item'}>
                        <div className={'img-wrap'}>
                            <img src={item.img} alt="" />
                            <div className="tag">{item.sellingTag}</div>
                        </div>
                        <div className={'desc'}>
                            <div>{item.goodsTitle}</div>
                            <div className={'marketing-tag'}>{item.marketingTag}</div>
                            <div className={'goods-price'}>￥{item.price}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Goods;
