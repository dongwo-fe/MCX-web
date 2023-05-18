import CreateFetch from './fetch';
import { env_version, topicUrl } from './hotConfig';

const http = CreateFetch();
export function getShortLinkKey(params: iApiLinkP) {
    return http.post('/api_link/add', params);
}
interface iApiLinkP {
    type: 0 | 1;
    data: any;
}
export async function getminiQrCode(scene, page) {
    try {
        const data: any = await getShortLinkKey({
            type: 1,
            data: scene,
        });
        const s = `s=${data.key}`;
        return `${topicUrl}/page/qrcode/wxapp?scene=${encodeURIComponent(s)}&page=${page}&env_version=${env_version}`;
    } catch (error) {
        console.log('%c [ error ]-21', 'font-size:13px; background:pink; color:#bf2c9f;', error);
        return null;
    }
}
