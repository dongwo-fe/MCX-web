import React, { useState } from 'react';
import moment, { Moment } from 'moment';

// 获取N天之前或者之后的时间，返回日期字符串
const fun_date = (num: number): string => {
  const date1 = new Date();
  const date2 = new Date();
  date2.setDate(date1.getDate() + num)
  const time = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`; 
  return time 
}

function usePickDate(m: number, n: number, dateFormat = 'YYYY-MM-DD') {
  const yesterday = fun_date(m);
  const ago7 = fun_date(n);
  const rangedate = [moment(yesterday, dateFormat), moment(ago7, dateFormat)];
  const [rangeDate, setRangeDate] = useState<Moment[]>(rangedate);

  return rangeDate;
}

export default usePickDate;