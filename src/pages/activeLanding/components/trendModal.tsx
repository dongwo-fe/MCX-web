import { getHotZone, getTopicPvUv, iHotZoneP } from '@/api/bigdata';
import { topicUrl } from '@/api/hotConfig';
import { ITopicListItem } from '@/api/topicApi';
import { Modal } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './trendModal.less';

function TrendModal(props, ref) {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<null | ITopicListItem>(null);
    useImperativeHandle(ref, () => ({
        show: (item: ITopicListItem) => {
            setData(item);
            setVisible(true);
        },
    }));

    if (!data) return null;
    const tcards = data.data.tcards || [{ tid: '', value: 100 }];
    return (
        <Modal
            title={data.title}
            visible={visible}
            onCancel={() => {
                setVisible(false);
            }}
            footer={false}
            maskClosable={false}
            destroyOnClose
            width={1000}
        >
            <div id="dw-trend-modal">
                {tcards.map((v, i) => (
                    <TCBox key={v.tid} data={data} isMain={tcards.length === 1} item={v} />
                ))}
            </div>
        </Modal>
    );
}

const TCBox = ({ data, item, isMain }: any) => {
    const [pv, setpv] = useState(0);
    const [uv, setuv] = useState(0);
    const url = `${topicUrl}${data?.pageType === 'member' ? '/v/' : '/t/'}${data?._id}?deviceOs=wxapp&nologin=1&tid=${item.tid}&tj=1`;
    useEffect(() => {
        if (item) {
            getPU();
        }
    }, [item]);

    async function getPU() {
        try {
            // 调用大数据接口获取热区数据
            const params: iHotZoneP = { topic_page: data?._id || '' };
            if (!isMain) {
                params.sub_topic = item.tid;
            }
            const res = await getTopicPvUv(params);
            if (Array.isArray(res) || res[0]) {
                const { pv, uv } = res[0];
                setpv(pv);
                setuv(uv);
            }
        } catch (error: any) {}
    }

    async function initData() {
        const tciframe = document.getElementById(`tcard-iframe${item.tid}`) as HTMLIFrameElement;
        const wn = tciframe.contentWindow;

        try {
            // 调用大数据接口获取热区数据
            const params: iHotZoneP = { topic_page: data?._id || '' };
            if (!isMain) {
                params.sub_topic = item.tid;
            }
            const res = await getHotZone(params);
            if (Array.isArray(res) || res[0]) {
                // 发送消息到 iframe
                wn?.postMessage(
                    {
                        type: 'onshowhotmapevent',
                        data: res[0],
                        // { topic_page: 'upxspq6', max: 48, data: '[{"x":1,"y":1,"value":45},{"x":2,"y":1,"value":45},{"x":1,"y":2,"value":4},{"x":1,"y":3,"value":48}]' },
                    },
                    '*'
                );
            }
        } catch (error: any) {}
    }
    const onLoad = () => {
        if (item) {
            initData();
        }
    };
    return (
        <div className="item" key={item.tid}>
            <div className="title">
                {item.value}%流量卡 PV:{pv} UV:{uv}
            </div>

            <iframe loading="lazy" onLoad={onLoad} id={'tcard-iframe' + item.tid} className="iframe-box" src={url}></iframe>
        </div>
    );
};

export default forwardRef(TrendModal);
