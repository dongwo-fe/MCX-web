/*
 * @文档描述:
 * @author: 詹麟翾
 * @Date: 2021-05-08 14:41:57
 */
import React from 'react';
import PropTypes from 'prop-types';
import { getSessionStorage, getStorage, longStorageKeys, storageKeys } from '@/utils/storageTools';
interface iP {
    btnCode: string;
    children: any;
}
interface iS {
    AuthWrapperStatus: boolean;
}
/**
 * 权限组件封装
 */
export class AuthWrapper extends React.Component<iP, iS> {
    constructor(props: any) {
        super(props);
        this.state = {
            AuthWrapperStatus: false,
        };
    }
    componentDidMount = () => {
        this.checkAuth(this.props.btnCode);
    };
    /**
     * 校验当前用户是否有功能编码对应的权限
     * @param {string} btnCode
     */
    checkAuth = (btnCode: string) => {
        let _this = this;
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
            _this.setState({
                AuthWrapperStatus: flag,
            });
        } else {
            _this.setState({
                AuthWrapperStatus: false,
            });
        }
    };
    render() {
        return this.state.AuthWrapperStatus === true ? this.props.children : null;
    }
}
