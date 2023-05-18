import React, { memo, useEffect, useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import './index.less';

export enum ActivityReportStepEnum {
    activity_report,
    activity_investment,
    event_creation_and_selection,
    marketing_page_create,
    marketing_page_placement,
}

const stepList: { key: ActivityReportStepEnum; value: string }[] = [
    { key: ActivityReportStepEnum.activity_report, value: '活动提报' },
    { key: ActivityReportStepEnum.activity_investment, value: '活动招商' },
    { key: ActivityReportStepEnum.event_creation_and_selection, value: '活动创建及选品' },
    { key: ActivityReportStepEnum.marketing_page_create, value: '营销页面搭建' },
    { key: ActivityReportStepEnum.marketing_page_placement, value: '营销页面投放' },
];

const ActiveReportStep = (props: { active?: ActivityReportStepEnum }) => {
    const { active = ActivityReportStepEnum.activity_report } = props;
    const [activeStep, setActiveStep] = useState<ActivityReportStepEnum>(ActivityReportStepEnum.activity_report);
    useEffect(() => {
        setActiveStep(active);
    }, [active]);

    return (
        <div className={'step_wrap'}>
            {stepList.map((e, i) => (
                <div className={'step_item'} key={e.key}>
                    <div className={`step_text ${activeStep === e.key ? 'step_text_active' : ''}`}>{e.value}</div>
                    {i === stepList.length - 1 ? null : (
                        <div className={'arrow'}>
                            <ArrowRightOutlined />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default memo(ActiveReportStep);
