import { iEditorShop } from '@/store/config';
import React from 'react';
import './index.less';

interface IShop {
    data: iEditorShop;
    index: number;
}

function Shop({ data, index }: IShop) {
    return (
        <div key={index} className={'center-shop-goods'} style={{ gridTemplateColumns: `repeat(${data.hurdle},1fr)` }}>
            {data.list.map((item, index: number) => {
                return (
                    <div key={index} className={'item'}>
                        <div className={'img-wrap'}>
                            <img src={item.img} alt="" />
                            <div className="tag">{item.tag}</div>
                        </div>
                        <div className={'desc'}>
                            <div>{item.shopName}</div>
                            <div>商品：{item.count}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Shop;
