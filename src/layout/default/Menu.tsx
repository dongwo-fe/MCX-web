import React, { useMemo } from 'react';
import { Menu } from 'antd';
import routes, { iRouteConfig } from '@/routes/config';
import { NavLink } from 'react-router-dom';

function flat(list: Array<iRouteConfig> = [], result: Array<iRouteConfig> = []) {
    list.forEach(item => {
        if (item.child?.length) flat(item.child, result);
        if (item.exclude) return;
        if (item.title) result.push(item);
    });
    return result;
}

const MenuComponent = () => {
    const navList = useMemo(() => {
        return flat(routes);
    }, [routes]);

    return <Menu theme='dark' mode='inline'>
        {
            navList.map((item, index) => {
                return <Menu.Item key={index}>
                    <NavLink to={item.path}>{item.title}</NavLink>
                </Menu.Item>;
            })
        }
    </Menu>;
};

export default MenuComponent;
