import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import NProgress from 'nprogress';
import { longStorageKeys, saveStorage, setSessionStorage, storageKeys } from '@/utils/storageTools';
import { message } from 'antd';
import { queryOperateForUser } from '@/api/system';

// eslint-disable-next-line react/display-name
export default function (props: any) {
    const [load, setLoad] = useState(false);
    //页面进度条
    NProgress.start();

    const [params] = useSearchParams();
    console.log('%c [ params ]-14', 'font-size:13px; background:pink; color:#bf2c9f;', params.getAll('token'))
    const loac = useLocation();
    useLayoutEffect(() => {
        // console.log('路由变化', loac);
        NProgress.done();
    }, [loac]);

    if (params.get('token')) {
        setSessionStorage(longStorageKeys.JWT_TOKEN, params.get('token'));
        setSessionStorage(longStorageKeys.PLATFORM, params.get('platform'));
    }

    useEffect(() => {
        // setSessionStorage(longStorageKeys.JWT_TOKEN, params.get('token'));
        // setSessionStorage(longStorageKeys.PLATFORM, params.get('platform'));
        const str = params.get('platform');
        if (str !== 'seller') {
            queryOperateForUser1();
        } else {
            setLoad(true);
        }
    }, []);

    const queryOperateForUser1 = async () => {
        try {
            const data = await queryOperateForUser();
            const dataCode = data.map((val: any) => {
                return {
                    menuId: val.operateId,
                    buttonCode: val.operateCode,
                    operateName: val.operateName,
                };
            });
            saveStorage(storageKeys.DATA_CODE, dataCode);
            setLoad(true);
        } catch (error) {
            message.warning(error as string);
        }
    };
    if (load) {
        NProgress.done();
        return <Outlet />;
    }
    return null;
}
