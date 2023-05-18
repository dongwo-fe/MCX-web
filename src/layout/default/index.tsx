import React from 'react';
import { Layout } from 'antd';
import './index.less';
import MenuComponent from './Menu';
import {Outlet} from 'react-router-dom';
import BreadcrumbComponent from '@/layout/default/Breadcrumb';

const { Header, Content, Sider } = Layout;

class DefaultLayout extends React.Component {
    state = {
        collapsed: false
    };

    onCollapse = (collapsed: boolean) => {
        this.setState({ collapsed });
    };

    render() {
        const { collapsed } = this.state;
        return (
            <Layout className={'default-layout'} style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    <div className='logo' />
                    <MenuComponent />
                </Sider>
                <Layout className='site-layout'>
                    <Header className='site-layout-background'>
                      <BreadcrumbComponent/>
                    </Header>
                    <Content style={{ margin: 16 }}>
                        <div className='site-layout-background' style={{ padding: 24, minHeight: 360 }}>
                           <Outlet/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default DefaultLayout;
