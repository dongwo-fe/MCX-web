import { addTCardBlock, changeRenderBlock, delTCardBlock } from '@/store/editor';
import { createID } from '@/utils/tools';
import { Input, message, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useChangeEditorItem } from '../../hooks/useChangeEditorItemValue';
const typeToData = {
    addCard: {
        title: '',
    },
};
function CardActionModal({ manCard }: { manCard: any[] }, ref) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const [type, setType] = useState<string>(''); // addCard editCard delCard
    const [tcardValue, setTCardValue] = useState<string>(); // addCard editCard delCard
    const [tid, setTid] = useState<string>(''); // addCard editCard delCard
    const [tcards, handleChangeValue] = useChangeEditorItem<any[]>('tcards');
    useImperativeHandle(ref, () => ({
        show: (data: any) => {
            setOpen(true);
            setType(data.type);
            setTCardValue(data.type === 'addCard' ? undefined : data.value);
            setTid(data.tid);
        },
    }));
    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onChange = (e) => {
        const v = e.target.value.replace(/[^0-9]/gi, '');
        const nv = Number(v);
        if (v == '') {
            setTCardValue('');
        } else if (!isNaN(nv) && nv > 0 && nv < 100) {
            setTCardValue(v);
        } else {
            setTCardValue(tcardValue);
        }
    };

    const onOk = () => {
        let arr = structuredClone(tcards);
        const tcv = Number(tcardValue || 0);
        if (type === 'addCard') {
            if (tcv < 1) return message.error('请输入1-99之间的数');
            arr[0].value -= tcv;
            if (arr[0].value < 1) {
                message.error(`流量卡总和不能大于100`);
                return;
            }
            const tid = createID();
            arr.push({ tid: tid, value: tcv });
            handleChangeValue(arr);
            dispatch(addTCardBlock({ tid: tid }));
            dispatch(changeRenderBlock({ tid: tid }));
        } else if (type === 'editCard') {
            const ec = arr.find((v) => v.tid === tid);
            arr[0].value -= tcv - ec.value;
            if (arr[0].value < 1) {
                message.error(`流量卡总和不能大于100`);
                return;
            }
            arr.some((v) => {
                if (v.tid === tid) {
                    v.value = tcv;
                    return true;
                }
                return false;
            });
            handleChangeValue(arr);
        } else if (type === 'delCard') {
            arr[0].value += tcv;
            if (arr[0].value < 1) {
                message.error(`流量卡总和不能大于100`);
                return;
            }
            arr = arr.filter((v) => v.tid !== tid);
            handleChangeValue(arr);
            dispatch(delTCardBlock({ tid }));
        }

        hideModal();
    };

    return (
        <Modal width={300} title="" closable={false} open={open} onOk={onOk} onCancel={hideModal} okText="确认" cancelText="取消">
            <div>
                {(type === 'addCard' || type === 'editCard') && (
                    <div>
                        <Input placeholder="请输入1-99的比值" value={tcardValue} onChange={onChange} suffix={<span>%</span>} />
                    </div>
                )}
                {type === 'delCard' && <p>是否删除{tcardValue}%的流量卡?</p>}
            </div>
        </Modal>
    );
}
export default forwardRef(CardActionModal);
