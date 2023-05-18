import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { DatePicker, Radio } from 'antd';
import React, { ReactNode } from 'react';
import styles from './index.module.scss';
import moment, { Moment } from 'moment';

const RangePicker: any = DatePicker.RangePicker;
/**
 * 动态表单编辑
 */
const  RegistorInfo = ({ id }: any) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<any>({ id });
    const showType = data?.showTimeType || 0;
    const startTime = data?.showStartTime;
    const endTime = data?.showEndTime;

    const handleSelect = (e) => {
        handleChangeItemValue('showTimeType', e.target.value);
    };

    return (
        <div className={styles.component_row_wrap}>
            <div className={styles.title_base}>基础样式</div>
            <div className={styles.component_row}>
                <span className={styles.component_row_title}>生效方式：</span>
                <div className={styles.component_row_right}>
                    <Radio.Group onChange={handleSelect} value={showType}>
                        <Radio value={1}>限制时间</Radio>
                        <Radio value={0}>不限时间</Radio>
                    </Radio.Group>
                </div>
            </div>
            {showType === 1 && (
                <div className={styles.component_row}>
                    <span className={styles.component_row_title}>生效时间：</span>
                    <div className={styles.component_row_right}>
                        <RangePicker                            
                            allowClear
                            showToday
                            showTime
                            placeholder={['开始时间', '结束时间']}
                            defaultValue={startTime && endTime ? [moment(startTime), moment(endTime)] : []}
                            value={startTime && endTime ? [moment(startTime), moment(endTime)] : []}
                            onChange={(dates: Moment[]) => {
                                const [sm, em] = dates;
                                handleChangeItemValue('showStartTime', sm.valueOf());
                                handleChangeItemValue('showEndTime', em.valueOf());
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistorInfo;
