import { getSessionStorage, longStorageKeys } from '@/utils/storageTools';
import { QF } from '@dm/http_request';
import { isLocal } from './hotConfig';
class RError extends Error {
    constructor(msg: string, code = 0, data = {}) {
        super(msg);
        this.data = data;
        this.code = code;
    }
    code = 0;
    data = {};
}

export default function CreateFetch(prePath?: string, type?: number) {
    const RFetch = new QF(prePath);

    RFetch.afterFetch = async function (data) {
        if (data && data.status === 601) {
            throw new RError(data.message || '请求失败', data.code, data);
        }
        //跳转登录
        if (data && (data.code === 401 || data.code === '401')) {
            // window.location.href = '/login';
            window.parent.postMessage({ type: 'loginOut' }, '*');
            throw new Error(data.message);
        }
    };
    //重置head参数
    RFetch.setHeads = async function (fromHead?: any) {
        let authorization = getSessionStorage(longStorageKeys.JWT_TOKEN);
        let platform = getSessionStorage(longStorageKeys.PLATFORM);
        const env = process.env.SERVE_ENV;
        if (isLocal) {
            authorization = new URLSearchParams(location.search).get("token");
            platform = 'operation';
        }

        return Object.assign(
            {
                authorization,
                platform,
                env,
                deviceOs: 'h5',
            },
            fromHead
        );
    };
    return RFetch;
}

export const CreateOpsWebApp = () => CreateFetch(process.env.BASE_HOST + '/easyhome-ops-web-application');

// 卖场详情的前缀
export const CreateAppWebApp = () => CreateFetch(process.env.BASE_HOST + '/easyhome-app-application');

export const CreateSellerWebApp = () => CreateFetch(process.env.BASE_HOST + '/easyhome-b-web-application');

export function CreateBDFetch(prePath?: string) {
    const RFetch: any = new QF(prePath);
    RFetch._checkCode = async function (data) {
        if (data.errCode !== 0) {
            throw new RError(data.message || '请求失败', data.code);
        }
    };
    return RFetch;
}

export function CreateAIFetch(prePath?: string) {
    const RFetch: any = new QF(prePath);

    RFetch.afterFetch = async function (data) {
        return data;
    };
    RFetch._checkCode = async function (data) {
        //
    };
    return RFetch;
}

// 获取配置用的请求
export function CreateACFetch(prePath?: string) {
    const RFetch: any = new QF(prePath);
    RFetch.code = 1;
    return RFetch;
}
