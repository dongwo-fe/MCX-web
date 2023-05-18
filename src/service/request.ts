import axios, { AxiosRequestConfig } from 'axios';
import baseURL from '@/utils/baseUrl';
const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NTYzNzk5Njc1MDAyNTUyMzIiLCJpYXQiOjE2NDc4NTIwMzcsImV4cCI6MTY0Nzg5NTIzN30.oXRuPWMRgWlY8t9536wzMtBGpPiFL_PAOWEDgFFJeqfJEAM0xvNdsNFy8UGhKtwyyis7SugM4Fev96PADm-KWQ'

const http = axios.create({
    baseURL,
    headers:{
        authorization:token
    }
})

class RError extends Error {
    constructor(msg: string, code = 0) {
        super(msg);
        this.code = code;
    }
    code = 0;
}

async function request(url: string, method: 'POST' | 'GET', params?: any, data?: any) {
    try {
        const res = await http({
            url: url,
            method,
            params,
            data
        });
        const body = res.data;
        if (body.code !== 1) throw new RError(body.msg || '请求失败', body.code);
        return body.data;
    } catch (error) {
        console.log(error);
        throw new RError('网络连接失败');
    }
}

export default {
    get(url: string, params?: any) {
        return request(url, 'GET', params);
    },
    post(url: string, data?: any) {
        return request(url, 'POST', undefined, data);
    },
};
