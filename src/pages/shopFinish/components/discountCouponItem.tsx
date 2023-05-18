import React from "react";
import './discountCouponItem.less'

interface DiscountCouponItemProps {
  item: any
}

const DiscountCouponItem = ({item}: DiscountCouponItemProps) => {
  return (
    <div className='discount-coupon-wrap'>
      <div className="discount-coupon-wrap-name">
        <span>{item.couponName}元</span>
      </div>
      <div className="discount-coupon-wrap-condition">
        <div>
          <span>{item.couponAmount}</span>
          {item.everyUsrEveryDayNum != 1 && `x${item.everyUsrEveryDayNum}张` }
        </div>
        <div>{item.couponAvailableRange}</div>
      </div>
      <div className="discount-coupon-wrap-get">
        <span>领</span>
        <span>取</span>
      </div>
    </div>
  )
};

export default DiscountCouponItem;

