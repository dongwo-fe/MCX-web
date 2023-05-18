import { ossUrl } from '@/api/hotConfig';
import { customAlphabet } from 'nanoid';
import moment from 'moment';
const nonaid = customAlphabet('QWERTYUIOPASDFGHJKLZXCVBNM', 5);

//创建基于时间戳的id
const createID = () => {
    return nonaid();
};

const isEmpty = (value: unknown) => {
    return value !== undefined && value !== null;
};

const getQueryString = (name: string) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substring(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return '';
};

// 数字转换汉字 1-10
const numberToText = (num: number) => {
    switch (num) {
        case 0:
            return '零';
        case 1:
            return '一';
        case 2:
            return '二';
        case 3:
            return '三';
        case 4:
            return '四';
        case 5:
            return '五';
        case 6:
            return '六';
        case 7:
            return '七';
        case 8:
            return '八';
        case 9:
            return '九';
        case 10:
            return '十';
    }
};
//去除空格
const trimValue = (e: any) => {
    return e.target.value.replace(/(^\s*)|(\s*$)/g, '');
};

const getIsEmpty = (list: Array<any>, type: string) => {
    let num = 0;
    list.forEach((item) => {
        if (item[type] == '') {
            num = num + 1;
        }
    });
    if (num != 0) return true;
    return false;
};

//数组换位
const arrayMoveImmutable = (arr: any[], oldIndex: number, newIndex: number) => {
    if (!Array.isArray(arr)) return [];
    arr[newIndex] = arr.splice(oldIndex, 1, arr[newIndex])[0];
    return arr;
};

/**
 * 拼接服务器返回的图片路径
 * @param {*} uri
 * @returns
 */
export function getImageUrl(uri: string) {
    if (!uri) return '';
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
        return uri;
    }
    return ossUrl + uri;
}

/**
 * 发送消息
 * message {type,data}
 */
export function postMessageToParent(message: any) {
    window.parent.postMessage(message, '*');
}
/**
 * 跳转父级页面
 * @param pathname
 */
export function pushParent(pathname: string) {
    window.parent.postMessage({ type: 'push', data: { pathname } }, '*');
}
export const defaultFormatFunc = (value: number | undefined, f = 'YYYY-MM-DD HH:mm:ss') => {
    if (!value) return;
    return moment(value).format(f);
};

export { createID, isEmpty, getQueryString, numberToText, trimValue, getIsEmpty, arrayMoveImmutable };

// 阿拉伯数字转中文 一 二 三
const NC = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export function changeNUmberToChinese(index) {
    return NC[index] || index;
}
