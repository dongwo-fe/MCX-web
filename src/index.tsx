import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './extend';
import Routes from './routes';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from '@/store';
import 'nprogress/nprogress.css';
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
// import locale from 'antd/lib/locale/zh_CN';
import zhCN from 'antd/es/locale/zh_CN';
import { SENSOR_URL } from './utils/baseUrl';

var sensors = require('sa-sdk-javascript');

const initSensors = () => {

    sensors.init({
        server_url: SENSOR_URL,
        is_track_single_page: function(){
            return {platforms:"build_blocks_web"}
        }, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        use_client_time: true,
        send_type: 'beacon',
        heatmap: {
        // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
        clickmap: 'default',
        // 是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
        scroll_notice_map: 'default',
        collect_tags: {
            div: {
            max_level: 3, // 默认是 1，即只支持叶子 div。可配置范围是 [1, 2, 3],非该范围配置值，会被当作 1 处理。                 
            }, // 在原来的全埋点（采集 a、button、input 、textarea 标签）基础上新增对 div 标签的采集。                                                  
        },
        },
        // show_log:true
    });
        
    sensors.quick('autoTrack',{platforms:"build_blocks_web"});// 配置后可自动采集$pageview事件。autoTrackSinglePage为手动模式。
    sensors.use('PageLeave', { heartbeat_interval_time: 5 }); // 设置页面浏览时长，上报$PageLeave事件，并设置页面浏览时长心跳记录刷新时间为 5 秒。
    (window as any).sensors = sensors;
};

initSensors();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ConfigProvider locale={zhCN}>
                <Routes />
            </ConfigProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

