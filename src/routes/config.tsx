import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/layout/default';
import Home from '@/pages/home';
import Test from '@/pages/test';
import BEditor from '@/pages/beditor';
import ActiveLanding from '@/pages/activeLanding';
import DifferentChannels from '@/pages/differentChannels';
import ChannelData from '@/pages/differentChannels/channelData'
import ShopFinishPage from '@/pages/shopFinish';

const Page404 = React.lazy(() => import('@/pages/404'));

const list: iRouteConfig[] = [
	{
		path: '/',
		element: <Navigate to={'/activeLanding'} />,
	},
	{
		path: '/',
		title: '积木系统',
		exclude: true,
		// element: <Layout />,
		child: [
			// {
			//     path: '/main/home',
			//     title: 'home',
			//     element: <Home />,
			// },
			// {
			//     path: '/main/test',
			//     title: 'test',
			//     element: <Test />,
			// },
			{
				path: '/activeLanding',
				title: '活动落地页',
				element: <ActiveLanding />,
			},
		],
	},
	{
		path: '/bsLanding',
		title: '落地页模板库',
		exclude: true,
		element: <ActiveLanding />,
	},
	{
		path: '/beditor',
		title: '编辑落地页模板库',
		exclude: true,
		element: <BEditor />,
	},
	{ path: '/differentChannels', title: '渠道管理', exclude: true, element: <DifferentChannels /> },
	{
		path: '/differentChannels/data',
		title: '数据统计',
		exclude: true,
		element: <ChannelData />
	},
	{
		path: '/shop/finish',
		title: '数据统计',
		exclude: true,
		element: <ShopFinishPage />
	},
	{
		path: '*',
		title: '404',
		exclude: true,
		element: <Page404 />,
	},
];

export default list;

export interface iRouteConfig {
	path: string;
	title?: string;
	exclude?: boolean;
	element?: JSX.Element;
	child?: iRouteConfig[];
}
