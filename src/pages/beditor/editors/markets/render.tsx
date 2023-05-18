import { iEditorBlock, iEditorMarkets } from '@/store/config';
import React from 'react';
import './index.scss';
import { getImageUrl } from '@/utils/tools';
import { ImarketDetail } from '@/api/markets';
// 初始化数据
const initData = {
    marketPic: 'https://osstest.jrdaimao.com/file/1656386868881211.png',
    marketName: '居然之家北四环店',
    marketAddress: '朝阳区北四环东路65号居然之家F3朝阳区北四环东路65号居然之家F3',
    marketPhone: '',
    businessTime: '10:00至22:00(工作日) 10:00至22:00(节假日)',
};
// 卖场渲染
const Render_Markets = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorMarkets;
    const { market_list, market_show_type = 'one', market_detail, market_color } = data;
    let showList:any = [];
    if (!market_list || market_list.length === 0) {
        showList.push(market_detail || initData);
    } else {
        showList = market_list;
    }

    //一栏
    if (market_show_type === 'one') {
        return (
            <div className="render-market-box-one">
                {showList.map((v: any) => (
                    <RenderItemOne key={v.marketId} {...v} />
                ))}
            </div>
        );
    } else if (market_show_type === 'two') {
        return (
            <div className="render-market-box-two">
                {showList.map((v: any) => (
                    <RenderItemTwo key={v.marketId} {...v} />
                ))}
            </div>
        );
    } else if (market_show_type === 'three') {
        return (
            <div className="render-market-box-three">
                {showList.map((v: any) => (
                    <RenderItemThree key={v.marketId} {...v} market_color={market_color} />
                ))}
            </div>
        );
    } else if (market_show_type === 'four') {
        return (
            <div className="render-market-box-four">
                {showList.map((v: any) => (
                    <RenderItemThree key={v.marketId} {...v} market_color={market_color} />
                ))}
            </div>
        );
    }

    return null;
};

const RenderItemOne = (props: { image_type: string; marketPic: string; market_image: string; marketName: string; marketAddress: string; businessTime: string }) => {
    const { marketPic, marketName, marketAddress, businessTime, market_image } = props;
    const showImg = getImageUrl(market_image || marketPic);

    return (
        <div className="render-markets-box">
            {showImg && <img className="market-image-bg" src={showImg} />}
            <div className="markets-message-box">
                <div className="markets-message-contain">
                    <div className="markets-name">{marketName}</div>
                    <div className="markets-address">
                        <img src="/image/markets_address_bg.png" className="address-image" />
                        <div className="address-detail">{marketAddress}</div>
                        <div className="div-part"></div>
                        <img src="/image/markets_phone_bg.png" className="phone-image" />
                    </div>
                    <div className="markets-work-time">
                        <img src="/image/markets_time_bg.png" className="time-image" />
                        <div className="work-time-detail">{businessTime}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RenderItemTwo = (props: { marketPic: string; market_image: string; marketName: string; marketAddress: string; businessTime: string }) => {
    const { marketPic, marketName, marketAddress, businessTime, market_image } = props;
    const showImg = getImageUrl(market_image || marketPic);
    return (
        <div className="render-markets-box">
            {showImg && <img className="market-image-bg" src={showImg} />}
            <div className="markets-message-box">
                <div className="markets-message-contain">
                    <div className="markets-name">{marketName}</div>
                    <div className="markets-address">
                        <img src="/image/markets_address_bg.png" className="address-image" />
                        <div className="address-detail">{marketAddress}</div>
                        <div className="div-part"></div>
                        <img src="/image/markets_phone_bg.png" className="phone-image" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RenderItemThree = (props: any) => {
    const { marketPic, marketName, market_image, market_color } = props;
    const showImg = getImageUrl(market_image || marketPic);
    return (
        <div className="render-shop-box">
            {showImg && <img className="shop-image" src={getImageUrl(showImg)} />}
            <div className="shop-name" style={{ color: market_color || '#303235' }}>
                {marketName}
            </div>
        </div>
    );
};

export default React.memo(Render_Markets);
