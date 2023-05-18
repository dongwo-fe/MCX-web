//key
export const storageKeys = {
    USER_INFO: 'user_info',
    USER_MESSAGE: 'user_message',
    CUSTOMFORM_HASPHONE: 'customform_hashone',
    JWT_TOKEN: 'jwtToken',
    PLATFORM: 'platform',
    DATA_CODE: 'DataCode', //权限列表
    CITY_IDS: 'cityIds', //城市列表
    MARKETS: 'markets', //卖场列表
    SHOW_ADVERTISING: 'showadvertising', //显示广告投放
};
//长久存储的key
export const longStorageKeys = {
    USER_INFO: storageKeys.USER_INFO,
    JWT_TOKEN: storageKeys.JWT_TOKEN,
    PLATFORM: storageKeys.PLATFORM,
};
//保存数据
export const saveStorage = (key: string, value: any) => {
    if (!key) {
        return;
    }
    window.localStorage.setItem(key, JSON.stringify({ v: value }));
};
//获取存储的数据
export const getStorage = (key: string) => {
    if (!key) {
        return null;
    }
    const data = window.localStorage.getItem(key);
    try {
        const value = JSON.parse(data || '');
        return value.v;
    } catch (error) {
        return null;
    }
};
export function setSessionStorage(key: string, value: any) {
    if (!key) {
        return;
    }
    window.sessionStorage.setItem(key, JSON.stringify({ v: value }));
}
export function getSessionStorage(key: string) {
    if (!key) {
        return null;
    }
    const data = window.sessionStorage.getItem(key);
    try {
        const value = JSON.parse(data || '');
        return value.v;
    } catch (error) {
        return null;
    }
}

//删除单个key
export const delStorageKey = (key: string) => {
    if (!key) {
        return;
    }
    key = key.toString();
    window.localStorage.removeItem(key);
};
// 清除长久存储数据之外的数据
export const incompletionClearStorage = () => {
    let long_keys = Object.values(longStorageKeys);
    let local_keys = Object.values(window.localStorage);
    local_keys.forEach((key) => {
        if (!long_keys.includes(key)) {
            window.localStorage.removeItem(key);
        }
    });
    return;
};
//清除所哟储存的数据
export const clearStorage = () => {
    window.localStorage.clear();
};
