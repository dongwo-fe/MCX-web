import React from 'react';
import { Breadcrumb } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import { useLocation } from 'react-router-dom';
import routerList, { iRouteConfig } from '../../routes/config';

const HashCatch = new Map();

const BreadcrumbByRouter = ({ prefixRoutes = [], blacklistNames = [], ...props }) => {
    const location = useLocation();
    const MatchRoutes = dfsFindPath(routerList, location.pathname);
    // '/' 分割  过滤 空地址
    const breadcrumbItems = prefixRoutes.concat(MatchRoutes);

    return (
        <Breadcrumb {...props}>
            {breadcrumbItems
                .filter(Boolean)
                .filter(({ title }) => !blacklistNames.includes(title))
                .map(({ title }, i) => (
                    <Breadcrumb.Item key={i}>{title}</Breadcrumb.Item>
                ))}
        </Breadcrumb>
    );
};

function dfsFindPath(routes: Array<iRouteConfig>, pathname: string) {
    if (HashCatch.has(pathname)) {
        return HashCatch.get(pathname);
    }
    // 分割 过滤空
    const paths = pathname.split('/').filter((path) => path);
    const matchRoutes:any = [];
    let dfsPath = '';
    paths.push('');
    for (let path of paths) {
        // 逐级 路径 比较
        dfsPath = dfsPath + '/' + path;
        const route = findRoute(dfsPath, routes);
        if (route) {
            matchRoutes.push(route);
        }
    }
    HashCatch.set(pathname, [...matchRoutes]);
    return matchRoutes;
}

function findRoute(pathname: string, routes?: iRouteConfig[]): iRouteConfig | null {
    if (!routes || routes.length === 0) return null;
    let result = null;
    for (let index = 0; index < routes.length; index++) {
        const data = pathToRegexp(routes[index].path).test(pathname);
        if (data) return routes[index];
        if (Array.isArray(routes[index].child)) {
            const data2 = findRoute(pathname, routes[index].child);
            if (data2) return data2;
        }
    }
    return result;
}

export default BreadcrumbByRouter;
