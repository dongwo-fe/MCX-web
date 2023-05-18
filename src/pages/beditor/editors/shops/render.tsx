import { iEditorBlock, iEditorShops } from '@/store/config';
import { getImageUrl } from '@/utils/tools';
import React from 'react';
import './index.scss';
// 初始化数据
const initData = {
    mainKey: 'https://osstest.jrdaimao.com/file/1656386868881211.png',
    shopName: '店铺名称',
};
// 卖场渲染
const Render_Shops = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorShops;
    const { shop_list, shop_show_type } = data;
    let showList:any = [];
    if (shop_list.length === 0) {
        showList.push(initData);
    } else {
        showList = shop_list;
    }

    return (
        <div className={'render-shop-box-' + shop_show_type}>
            {showList.map((v: any) => (
                <RenderItemOne key={v.shopId} {...v} />
            ))}
        </div>
    );
};

const RenderItemOne = (props: { mainKey: string; shopName: string; shop_image: string }) => {
    const { mainKey, shopName, shop_image } = props;
    const showImg = shop_image || mainKey;
    return (
        <div className="render-shop-box">
            {showImg && <img className="shop-image" src={getImageUrl(showImg)} />}
            <div className="shop-name">{shopName}</div>
        </div>
    );
};

export default React.memo(Render_Shops);
