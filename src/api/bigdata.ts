import CreateFetch, { CreateBDFetch } from './fetch';
import { isLocal } from './hotConfig';

// 大数据提供的接口
const http = CreateBDFetch(isLocal ? '' : process.env.BIGDATA_HOST);

export function getHotZone(params: iHotZoneP) {
    /**
     * {
        topic_page: 'upxspq6',
        sub_topic: 'x',
    }
     */
    // 获取热区图数据
    return http.get('/bigdata/dw/rt/dws/flow/act_page/heatmap?appCode=f85aa0ee76e5456cb2e69bb241393188', params);
}
export function getTopicPvUv(params: iHotZoneP) {
    // 获取pv uv
    return http.get('/bigdata/dw/rt/dws/flow/act_page/basic_stat?appCode=f85aa0ee76e5456cb2e69bb241393188', params);
}
export interface iHotZoneP {
    topic_page: string;
    sub_topic?: string;
}
