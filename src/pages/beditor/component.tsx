import { initBlockData, insertOne, setBlockShow } from '@/store/editor';
import { Collapse, message } from 'antd';
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import config, { iConfigItem } from './config';
import { iEditor } from '@/store/config';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

//左侧容器
export default function Component(props: any) {
    const { collapsed, setCollapsed } = props;
    return (
        <div className={`asserts ${collapsed ? 'asserts_hiiden' : ''}`}>
            <div className="content">
                <Collapse defaultActiveKey={[0, 1, 2]} expandIconPosition="end">
                    {config.map((v, i) => (
                        <Panel header={v.title} key={i}>
                            <div className="items">
                                {v.childrens.map((item) => (
                                    <CompontItem key={item.type} item={item} />
                                ))}
                            </div>
                        </Panel>
                    ))}
                </Collapse>
            </div>

            {/* 展开收起按钮 */}
            <div className="toggle" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <RightCircleOutlined style={{ fontSize: '16px' }} /> : <LeftCircleOutlined style={{ fontSize: '16px' }} />}
                <span className="toggle_txt">{collapsed ? '展开组件栏' : '收起组件栏'}</span>
            </div>
        </div>
    );
}

//左侧可拖动的组件
const CompontItem = React.memo(function CompontItem(props: { item: iConfigItem }) {
    const item = props.item;
    const [, drag] = useDrag(() => ({ type: 'box', item: { type: item.type } }));
    const store = useSelector<{ editor: iEditor }, iEditor>((state) => state.editor);
    const dispatch = useDispatch();
    const handleClick = () => {
        if (!initBlockData[item.type]) return console.warn('模块没有初始化方法', item.type);
        if (store.blocks.some((value) => value.type === 'provinceAndCityShop') && item.type === 'provinceAndCityShop') {
            return message.warning('只能有一个预约门店组件');
        }
        const blockData = initBlockData[item.type]();
        dispatch(insertOne({ data: blockData }));
        dispatch(setBlockShow({ id: null }));
        setTimeout(() => {
            dispatch(setBlockShow({ id: blockData.id }));
        }, 100);
    };

    return (
        <div className="item cursor-pointer" ref={drag} onClick={handleClick}>
            <img src={item.logo} />
            <p>{item.title}</p>
        </div>
    );
});
