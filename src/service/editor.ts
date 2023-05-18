import http from '@/service/request';

export const downloadShopTemplate = (data?: any) => {
    return http.get('/operation/operActivity/downloadTemplate', data);
};

//落地页上传店铺
export const shopImport = (data?: any) => {
    return http.post('/operation/operActivity/shopImport', data);
};
