import { changeRenderBlock, delTCardBlock } from '@/store/editor';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, message, Modal } from 'antd';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChangeEditorItem } from '../../hooks/useChangeEditorItemValue';
import CardActionModal from './cardActionModal';
const DropdownButton: any = Dropdown.Button;

const TCard = ({ item, showAction, pi }: any) => {
    const dispatch = useDispatch();
    const EditTCardId = useSelector((state: any) => state.editor.editTCardId);

    const handleButtonClick = (e) => {
        // 流量卡点击
        dispatch(changeRenderBlock({ tid: item.tid }));
    };
    const handleMenuClick = (e) => {
        // 流量卡操作按钮点击
        if (pi === 0 && (e.key === 'delCard' || e.key === 'editCard')) {
            return message.info('第一个流量卡不允许编辑和删除');
        }
        showAction({ type: e.key, ...item });
    };
    const items: any = [
        {
            label: '新增流量卡',
            key: 'addCard',
            icon: <PlusOutlined />,
        },
        {
            label: '编辑流量卡',
            key: 'editCard',
            icon: <EditOutlined />,
        },
        {
            label: '删除流量卡',
            key: 'delCard',
            icon: <DeleteOutlined />,
            danger: true,
        },
    ];
    const menuProps: any = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <div className="render-tcard">
            <DropdownButton type={item.tid === EditTCardId || (pi === 0 && !EditTCardId) ? 'primary' : ''} menu={menuProps} onClick={handleButtonClick}>
                {item.value}%
            </DropdownButton>
        </div>
    );
};

function TCardsList(props: { tcards: any[] }) {
    const CardActionModalRef = useRef<any>();
    const dispatch = useDispatch();
    const [tcards, handleChangeValue] = useChangeEditorItem<any[]>('tcards');

    const showAction = (data) => {
        if (data.type === 'addCard' && props.tcards.length >= 4) {
            message.error('最多不能超过4个流量卡哦');
            return;
        } else if (data.type === 'delCard') {
            Modal.confirm({
                title: `是否删除${data.value}%的流量卡?`,
                okText: '确认',
                onOk: () => {
                    let arr = structuredClone(tcards);
                    arr[0].value += Number(data.value || 0);
                    arr = arr.filter((v) => v.tid !== data.tid);
                    handleChangeValue(arr);
                    dispatch(delTCardBlock({ tid: data.tid }));
                },
            });
            return;
        }
        CardActionModalRef.current.show(data);
    };

    return (
        <div>
            <div className="render-tcards">
                {tcards.map((v, i) => {
                    return <TCard pi={i} item={v} key={v.tid} showAction={showAction} />;
                })}
            </div>
            <CardActionModal manCard={props.tcards[0]} ref={CardActionModalRef} />
        </div>
    );
}

export default TCardsList;
