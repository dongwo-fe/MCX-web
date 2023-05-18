import React from 'react';
import './index.scss';
import moment from 'moment';
import { iEditorCoupons, iCouponsListItem } from '@/store/config';
interface iProps {
    data: iEditorCoupons;
    index: number;
}

const Coupons = ({ data }: iProps) => {
    return (
        <div id={'coupons-wrap'}>
            {/* 逐张领取 */}
            {data.style === 0 && <ZuoHua data={data} />}
            {data.style === 1 && <List1 data={data} />}
            {data.style === 2 && <List2 data={data} />}
            {data.style === 3 && <List3 data={data} />}
            {/* 一键领取 */}
            {data.style === 10 && <List10 data={data} />}
            {data.style === 11 && <List11 data={data} />}
            {data.style === 12 && <List12 data={data} />}
            {data.style === 13 && <List13 data={data} />}
        </div>
    );
};

const defaultList = [
    {
        bizSource: 0,
        cityNames: null,
        couponAmount: '500',
        couponAutomaticAdd: 0,
        couponBatchNo: '693666995992842240',
        couponCategoryType: 0,
        couponCount: 100000,
        couponDesc: '优惠券描述',
        couponName: '孝坤测试空卖场',
        couponScope: '{"ca": "NO", "cc": "NO"}',
        couponSendCollectStatus: null,
        couponSendId: '693667804948254720',
        couponSendName: '优惠',
        couponShareRule: '{"storePercent": "25", "merchantPercent": "25", "platformPercent": "50"}',
        couponStatus: 4,
        couponTag: '444',
        couponThresholdAmount: '250',
        couponTopicLabel: '订单',
        couponType: 0,
        couponUseDay: 0,
        couponUseDayType: 0,
        couponUsePeriod: 0,
        couponUsePeriodType: 0,
        couponUsedSum: 0,
        couponValidityEnd: '2022-06-08 11:29:57',
        couponValidityStart: '2022-06-06 11:29:56',
        createTime: '2022-06-06 13:51:49',
        creator: '134孝坤测试',
        creatorId: 683839890910818300,
        everyUsrEveryDayNum: '1',
        everyUsrTotalNum: '1',
        holdQuantity: 0,
        id: 2024,
        marketNames: null,
        modifier: null,
        modifierId: null,
        receiveQuantity: 0,
        redisSurplusAmount: null,
        sellerQuantity: 1,
        surplusAmount: null,
        updateTime: '2022-06-08 11:29:57',
        useQuantityPrice: null,
    },
];
const colorTypeToStyle0 = [
    {
        bg: `url(${require('@/img/coupon_1_bg.png')})`,
        color1: '#F7605E', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
        color4: '#F7F4F4', //描述 颜色
        color5: '#FFFFFF', //全品类背景 颜色
    },
    {
        bg: `url(${require('@/img/coupon_2_bg.png')})`,
        color1: '#F39343', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
        color4: '#F7F4F4', //描述 颜色
        color5: '#FFFFFF', //全品类背景 颜色
    },
    {
        bg: `url(${require('@/img/coupon_3_bg.png')})`,
        color1: '#FFCE27', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
        color4: '#F7F4F4', //描述 颜色
        color5: '#FFFFFF', //全品类背景 颜色
    },
    {
        bg: `url(${require('@/img/coupon_4_bg.png')})`,
        color1: '#FFFFFF', //全品类文字 颜色
        color2: '#FF2B2C', //金额 颜色
        color3: '#333333', //满多少可用、领取 颜色
        color4: '#777777', //描述 颜色
        color5: '#FF2B2C', //全品类背景 颜色
    },
    {
        bg: `url(${require('@/img/coupon_5_bg.png')})`,
        color1: '#4CAC5B', //全品类文字 颜色
        color2: '#4CAC5B', //金额 颜色
        color3: '#4CAC5B', //满多少可用、领取 颜色
        color4: '#4CAC5B', //描述 颜色
        color5: '#FFFFFF', //全品类背景 颜色
    },
];
//左滑样式
const ZuoHua = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const styles = colorTypeToStyle0[data.colorType];
    return (
        <div className="zuo-hua-box">
            {list.map((v: iCouponsListItem) => (
                <div key={v.couponBatchNo + v.couponSendId + v.couponSendId} className="zh-item" style={{ backgroundImage: styles.bg, backgroundSize: '100% 100%' }}>
                    {v.couponTag ? (
                        <div
                            className="tag-box"
                            style={{
                                backgroundColor: styles.color5,
                                color: styles.color1,
                            }}
                        >
                            {v.couponTag.length > 4 ? `${v.couponTag.substring(0, 4)}` : v.couponTag}
                        </div>
                    ) : null}
                    <div className="zh-item-left">
                        <span className="txt1" style={{ color: styles.color2 }}>
                            <i>￥</i>
                            {v.couponAmount}
                        </span>
                        <span className="txt2" style={{ color: styles.color3 }}>
                            满{v.couponThresholdAmount}可用
                        </span>
                        <span className="txt3" style={{ color: styles.color4 }}>
                            {v.couponDesc}
                        </span>
                    </div>
                    <div className="zh-item-right" style={{ color: styles.color3 }}>
                        领<br />取
                    </div>
                </div>
            ))}
        </div>
    );
};

const colorTypeToStyle1 = [
    {
        bg: `url(${require('@/img/coupon1_1_bg.png')})`,
        color1: '#F7605E', //按钮背景 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon1_2_bg.png')})`,
        color1: '#F39343', //按钮背景 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon1_3_bg.png')})`,
        color1: '#FFCE27', //按钮背景 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: ``,
        color1: '#F7605E', //按钮背景 颜色
        color2: '#FF2B2C', //金额 颜色
        color3: '#333333', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon1_5_bg.png')})`,
        color1: '#4CAC5B', //按钮背景 颜色
        color2: '#4CAC5B', //金额 颜色
        color3: '#4CAC5B', //满多少可用、领取 颜色
    },
];
const List1 = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const styles = colorTypeToStyle1[data.colorType];
    return (
        <div className="list1-box">
            {list.map((v: iCouponsListItem) => (
                <div
                    key={v.couponBatchNo + v.couponSendId}
                    className="list1-item"
                    style={{ backgroundImage: `url(${require('@/img/coupon1_7_bg.png')})`, backgroundSize: '100% 100%' }}
                >
                    <div className="list1-item-left" style={{ backgroundImage: styles.bg, backgroundSize: '100% 100%' }}>
                        <span className="txt1" style={{ color: styles.color2 }}>
                            <i>￥</i>
                            {v.couponAmount}
                        </span>
                        <span className="txt2" style={{ color: styles.color3 }}>
                            满{v.couponThresholdAmount}可用
                        </span>
                    </div>
                    <div className="list1-item-middle">
                        <div className="coupon-name-box">
                            <div className="coupon-name-box1">
                                <span className="txt1">{v.couponName}</span>
                                <span className="txt2">
                                    {moment(v.couponValidityStart).format('MM-DD HH:mm')}-{moment(v.couponValidityEnd).format('MM-DD HH:mm')}
                                </span>
                            </div>
                        </div>
                        <span className="txt3">{v.couponDesc}</span>
                    </div>
                    <div className="line" />
                    <div className="list1-item-right">
                        <div className="receive-btn" style={{ backgroundColor: styles.color1 }}>
                            领取
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
const colorTypeToStyle2 = [
    {
        bg: `url(${require('@/img/coupon_1_bg.png')})`,
        color1: '#F7605E', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon_2_bg.png')})`,
        color1: '#F39343', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon_3_bg.png')})`,
        color1: '#FFCE27', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon_4_bg.png')})`,
        color1: '#FFFFFF', //全品类文字 颜色
        color2: '#FF2B2C', //金额 颜色
        color3: '#333333', //满多少可用、领取 颜色
    },
    {
        bg: `url(${require('@/img/coupon_5_bg.png')})`,
        color1: '#4CAC5B', //全品类文字 颜色
        color2: '#FFFFFF', //金额 颜色
        color3: '#FDFCFC', //满多少可用、领取 颜色
    },
];
const List2 = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const styles = colorTypeToStyle2[data.colorType];
    return (
        <div className="list2-box">
            {list.map((v: iCouponsListItem) => (
                <div key={v.couponBatchNo + v.couponSendId} className="list2-item" style={{ backgroundColor: styles.color1 }}>
                    <div className="list2-item_left">
                        <span className="txt1" style={{ color: styles.color2 }}>
                            <i>￥</i>
                            {v.couponAmount}
                        </span>
                        <span className="txt2" style={{ color: styles.color3 }}>
                            满{v.couponThresholdAmount}可用
                        </span>
                    </div>
                    <div className="list2-item_right">
                        <span className="txt1">
                            {v.couponTag ? (
                                <span className="tag" style={{ backgroundColor: styles.color1, color: styles.color2 }}>
                                    {v.couponTag}
                                </span>
                            ) : null}
                            {v.couponName}
                        </span>
                        <div className="coupon-time-row">
                            <span className="txt2">
                                {moment(v.couponValidityStart).format('MM-DD HH:mm')}-{moment(v.couponValidityEnd).format('MM-DD HH:mm')}
                            </span>
                            <div className="btn" style={{ backgroundColor: styles.color1, color: styles.color2 }}>
                                立即领取
                            </div>
                        </div>
                        <div className="coupon-desc">
                            <span className="txt3">{v.couponDesc}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const colorTypeToStyle3 = [
    {
        color1: '#F7605E', //全品类背景 颜色
        color2: '#F7605E', //金额 颜色
        color3: '#666666', //满多少可用、领取 颜色
        color4: '#FFFFFF', //全品类文字颜色
    },
    {
        color1: '#F39343', //全品类背景 颜色
        color2: '#F39343', //金额 颜色
        color3: '#666666', //满多少可用、领取 颜色
        color4: '#FFFFFF', //全品类文字颜色
    },
    {
        color1: '#FFCE27', //全品类背景 颜色
        color2: '#FFCE27', //金额 颜色
        color3: '#666666', //满多少可用、领取 颜色
        color4: '#FFFFFF', //全品类文字颜色
    },
    {
        color1: '#FFFFFF', //全品类背景 颜色
        color2: '#FF2B2C', //金额 颜色
        color3: '#666666', //满多少可用、领取 颜色
        color4: '#FF2B2C', //全品类文字颜色
    },
    {
        color1: '#4CAC5B', //全品类背景 颜色
        color2: '#4CAC5B', //金额 颜色
        color3: '#666666', //满多少可用、领取 颜色
        color4: '#FFFFFF', //全品类文字颜色
    },
];
const List3 = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const styles = colorTypeToStyle3[data.colorType];
    return (
        <div className="list3-box">
            {list.map((v: iCouponsListItem) => (
                <div key={v.couponBatchNo + v.couponSendId} className="list3-item">
                    <div className="list3-item-bg1" style={{ background: styles.color1 }}></div>
                    <div className="list3-item-bg2">
                        {v.couponTag ? (
                            <div className="tag">
                                <span style={{ backgroundColor: styles.color1, color: styles.color4 }}>{v.couponTag}</span>
                            </div>
                        ) : null}
                        <div className="list3-item-money-box">
                            <div className="list3-item-money-left">
                                <span className="txt1" style={{ color: styles.color2 }}>
                                    <i>￥</i>
                                    {v.couponAmount}
                                </span>
                                <span className="txt2" style={{ color: styles.color3 }}>
                                    满{v.couponThresholdAmount}可用
                                </span>
                            </div>
                            <div className="line" />

                            <div className="list3-item-money-right">
                                <span className="txt1">{v.couponName}</span>
                                <span className="txt2">
                                    {moment(v.couponValidityStart).format('MM-DD HH:mm')}-{moment(v.couponValidityEnd).format('MM-DD HH:mm')}
                                </span>
                            </div>
                        </div>
                        <div className="line1" />
                        <div className="list3-item-desc">
                            <span className="txt3">{v.couponDesc}</span>
                        </div>
                    </div>
                    <div className="list3-item-bg3" style={{ background: styles.color1, color: styles.color4 }}>
                        立即
                        <br />
                        领取
                    </div>
                </div>
            ))}
        </div>
    );
};

const List10 = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const styles = colorTypeToStyle0[data.colorType];
    return (
        <>
            <div className="zuo-hua-box">
                {list.map((v: iCouponsListItem) => (
                    <div key={v.couponBatchNo + v.couponSendId} className="zh-item" style={{ backgroundImage: styles.bg, backgroundSize: '100% 100%' }}>
                        {v.couponTag ? (
                            <div
                                className="tag-box"
                                style={{
                                    backgroundColor: styles.color5,
                                    color: styles.color1,
                                }}
                            >
                                {v.couponTag.length > 4 ? `${v.couponTag.substring(0, 4)}` : v.couponTag}
                            </div>
                        ) : null}
                        <div className="zh-item-left">
                            <span className="txt1" style={{ color: styles.color2 }}>
                                <i>￥</i>
                                {v.couponAmount}
                            </span>
                            <span className="txt2" style={{ color: styles.color3 }}>
                                满{v.couponThresholdAmount}可用
                            </span>
                            <span className="txt3" style={{ color: styles.color4 }}>
                                {v.couponDesc}
                            </span>
                        </div>
                        <div className="zh-item-right" style={{ color: styles.color3 }}></div>
                    </div>
                ))}
            </div>
            <div className="all-receive-btn" style={{ backgroundColor: styles.color1, color: styles.color5 }}>
                一键领取
            </div>
        </>
    );
};
const List11 = ({ data }: { data: iEditorCoupons }) => {
    const list = data.list.length === 0 ? defaultList : data.list;
    const amount = list.reduce((pre, cur) => pre + Number(cur.couponAmount), 0);
    return (
        <div className="list11-box" style={{ backgroundImage: `url(${require('@/img/coupon11_1_bg.png')})`, backgroundSize: '100% 100%' }}>
            <div className="list11-box-left">
                <div className="txt1">{data.listTitle ? data.listTitle : `¥ ${amount}`}</div>
                <div className="txt2">{data.listTitle2 ? data.listTitle2 : '优惠券大礼包限时领'}</div>
            </div>
        </div>
    );
};
const List12 = ({ data }: { data: iEditorCoupons }) => {
    const img = data.imageUrl[0] || {};
    return (
        <div className="list12-box">
            <img src={img.url} alt="" />
        </div>
    );
};
const List13 = ({ data }: { data: iEditorCoupons }) => {
    console.log('%c [ data.imageUrl ]-370', 'font-size:13px; background:pink; color:#bf2c9f;', data.imageUrl);
    const img = data.imageUrl[0] || {};
    const img2 = (data.imageUrl2 && data.imageUrl2[0]) || {};
    return (
        <div className="list13-box">
            <img src={img.url} alt="" />
            <img src={img2.url} alt="" />
        </div>
    );
};
export default React.memo(Coupons);
