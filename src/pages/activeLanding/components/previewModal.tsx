import { Modal } from 'antd';
import './index.less';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { topicUrl } from '@/api/hotConfig';
function PreviewModal(props: any, ref: any) {
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('落地页');
    const [pageType, setPageType] = useState('');

    useImperativeHandle(ref, () => ({
        show: (id: string, title: string, pageType: string) => {
            setId(id);
            setTitle(title);
            setVisible(true);
            setPageType(pageType);
        },
    }));
    const url = `${topicUrl}${pageType === 'member' ? '/v/' : '/t/'}${id}`;
    console.log('%c [ url ]-13', 'font-size:13px; background:pink; color:#bf2c9f;', url);
    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={() => {
                setVisible(false);
            }}
            footer={false}
            maskClosable={false}
            destroyOnClose
            width={500}
        >
            <iframe className="iframe-box" src={url}></iframe>
        </Modal>
    );
}

export default forwardRef(PreviewModal);
