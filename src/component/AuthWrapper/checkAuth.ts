import { getSessionStorage, getStorage, longStorageKeys, storageKeys } from '@/utils/storageTools';

/**
 * 校验当前用户是否有功能编码对应的权限
 * @param {string} btnCode
 */
export const checkAuth = (btnCode: string) => {
    if (btnCode) {
        const dataCode = getStorage(storageKeys.DATA_CODE) || [];
        const platform = getSessionStorage(longStorageKeys.PLATFORM);
        let code = btnCode;
        if (platform === 'operation') {
            code = btnCode.replaceAll('MINI_SAAS_', 'MINI_OPERATION_');
        }
        //这边有一个菜单ID-主要是为了兼容复用同一个组件情况
        const functions = code.split(',');
        const flag = functions.some((value) => dataCode.some((func: any) => func.buttonCode === value.trim()));
        return flag;
    } else {
        return false;
    }
};
