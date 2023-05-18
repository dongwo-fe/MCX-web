import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RouteConfigs, { iRouteConfig } from './config';
import DocumentPage from '@/pages/document';

/**
 * 组合路由参数
 * @param list 路由列表
 * @returns
 */
function getRoutes(list: iRouteConfig[]) {
    const routes: any[] = [];
    for (let index = 0; index < list.length; index++) {
        const route = list[index];
        let element = route.element;
        if (element && !element.type.name) {
            element = <React.Suspense fallback={<>...</>} children={element}></React.Suspense>;
        }
        const childs: any[] = route.child ? getRoutes(route.child) : [];
        routes.push(<Route key={index} index={index === 0 && childs.length === 0} path={route.path} element={element} children={childs}></Route>);
    }
    return routes;
}

export default () => (
    <Routes>
        <Route path="/" element={<DocumentPage />} children={getRoutes(RouteConfigs)} />
    </Routes>
);
