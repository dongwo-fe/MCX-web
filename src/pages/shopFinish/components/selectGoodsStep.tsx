import { Steps } from 'antd';
import React from 'react';

type SelectGoodsStepProps = {
    currentStep: number
}

const SelectGoodsStep = (props: SelectGoodsStepProps) => (
    <Steps
        className='selectGoodsStep'
        current={props.currentStep}
        items={[
            {
                title: '选择商品',
            },
            {
                title: '编辑推荐语',
            },
            {
                title: '完成',
            },
        ]}
    />

);

export default React.memo(SelectGoodsStep);