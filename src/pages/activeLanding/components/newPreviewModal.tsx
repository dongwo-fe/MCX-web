import React, { useEffect, useRef } from 'react';
import { message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { topicUrl } from '@/api/hotConfig';
import { ITopicListItem } from '@/api/topicApi';
import './newPreviewModal.less';
import { iTCard } from '@/store/config';
import copy from 'copy-to-clipboard';
import { getminiQrCode } from '@/api/common';
import { listOperActivityChannelByCondition } from '@/api/activeLandingPage';

function NewPreviewModal(props: any, ref: any) {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<null | ITopicListItem>(null); // item数据
    const [ctid, setCtid] = useState<string>(''); // 选中的流量卡ID
    const [qrCodeUrl, setQRCodeUrl] = useState<string>(''); // 小程序二维码
    const [isCreateChannel, setChannel] = useState<boolean>(false); // 是否生成了投放渠道
    const showUrl = useRef<string>(''); // 复制用url

    useImperativeHandle(ref, () => ({
        show: (item: ITopicListItem) => {
            setData(item);
            setVisible(true);
            const tid = (item.data?.tcards && item.data?.tcards[0]?.tid) || item._id;
            setCtid(tid);
        },
    }));
    const urlnp = `${topicUrl}${data?.pageType === 'member' ? '/v/' : '/t/'}${data?._id}`;

    async function initqrcode(jumpUrl) {
        const url = await getminiQrCode({ url: jumpUrl }, 'wish/pages/webView/index');
        setQRCodeUrl(url || '');
    }

    async function getChannel() {
        if (!data?.lid) return;
        try {
            const res = await listOperActivityChannelByCondition({ activityId: data.lid });
            setChannel(!!res?.length);
            if (res && res[0]) {
                const { channelId, channelName } = res[0];
                showUrl.current = `${urlnp}?channelId=${channelId}&channelName=${channelName}`;
                initqrcode(showUrl.current);
            }
        } catch {}
    }
    // 去生成渠道链接
    const createChannel = () => {
        setVisible(false);
        props.handlePromote?.(data);
    }
    // 关闭modal 重置一些状态
    const onCancel = () => {
        showUrl.current = '';
        setQRCodeUrl('');
        setChannel(false);
        setVisible(false);
    }
    useEffect(() => {
        if (visible) {
            getChannel();
        }
    }, [visible]);

    const url = `${urlnp}?deviceOs=wxapp&nologin=1`;
    const handleItemClick = (card: iTCard) => {
        setCtid(card.tid);
    };
    if (!data) return null;
    const tcards = data.data.tcards || [{ tid: data?._id || '', value: 100 }];
    const share = data.data.share || { img: '', title: '', desc: '' };
    const onCopyClick = () => {
        copy(showUrl.current);
        message.success('复制成功');
    };
    return (
        <Modal
            title={data.title}
            open={visible}
            onCancel={onCancel}
            footer={false}
            maskClosable={false}
            destroyOnClose
            width={1100}
        >
            <div id="dw-preview-modal">
                <div className="tcards">
                    {tcards.map((v) => (
                        <div onClick={() => handleItemClick(v)} className={`item ${ctid === v.tid ? 'item-act' : ''}`} key={v.tid}>
                            {v.value}%流量
                        </div>
                    ))}
                </div>
                <iframe className="iframe-box" src={`${url}&tid=${ctid}`}></iframe>
                <div className="right-box">
                    <div className="title">分享图片及文案</div>
                    <div className="share-info">
                        <img src={share.img} />
                        <div>
                            <span>{share.title}</span>
                            <br />
                            <span>{share.desc}</span>
                        </div>
                    </div>
                    {
                        qrCodeUrl && isCreateChannel ? (
                            <>
                                <div className='url'>{showUrl.current}</div>
                                <div className='copy-btn' onClick={onCopyClick}>
                                    复制链接
                                </div>
                                <div className='line' />
                                <div className='qrcode-box'>
                                    <img alt='二维码' src={qrCodeUrl} />
                                    <div>
                                        <div className='title'>小程序二维码</div>
                                        <div
                                            className='desc-txt'>扫描即可在小程序中打开对应的页面。如果需要在短信等场景使用，请使用上面的链接。
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : <div className='create-channel'>
                            <span>还未生成投放链接？</span><span onClick={createChannel}>去生成</span>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    );
}

export default forwardRef(NewPreviewModal);
