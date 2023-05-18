import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';
import React from 'react';

const RangePicker: any = DatePicker.RangePicker;

const disabledDate: RangePickerProps['disabledDate'] = current => current && (current >= moment().subtract(1, 'day') || current <= moment().subtract(1, 'year'));

const RangePickDate = ({
  value,
  handleDataChange
}) => {
  const onChange = dates => {    
    handleDataChange(dates)
  }

  return (
    <RangePicker
      style={{marginRight: 20}}
      value={value}
      onChange={onChange}
      separator="至"
      disabledDate={disabledDate}
    />
  )
}

export default RangePickDate