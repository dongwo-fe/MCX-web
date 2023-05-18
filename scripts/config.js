/**
 * 所有项目配置集中在文件中修改
 */
//=======================

/**
 * api请求的时候需要使用其他主域
 * 根据服务器传入的SERVE_ENV环境变量选择
 */
module.exports.BASE_HOST_LIST = {
    dev: 'https://gatewaydev.jrdaimao.com',
    dev2: 'https://gatewaydev2.jrdaimao.com',
    dev3: 'https://gatewaydev3.jrdaimao.com',
    dev4: 'https://gatewaydev4.jrdaimao.com',
    sit: 'https://gatewaysit.jrdaimao.com',
    uat: 'https://gatewayuat.jrdaimao.com',
    gray: 'https://gatewaygray.jrdaimao.com',
    production: 'https://gateway.jrdaimao.com',
};
// 大数据url
module.exports.BIGDATA_HOST_LIST = {
    dev: 'https://bigdata.jrdaimao.com',
    dev2: 'https://bigdata.jrdaimao.com',
    dev3: 'https://bigdata.jrdaimao.com',
    dev4: 'https://bigdata.jrdaimao.com',
    sit: 'https://bigdata.jrdaimao.com',
    uat: 'https://bigdata.jrdaimao.com',
    gray: 'https://bigdata.jrdaimao.com',
    production: 'https://bigdata.jrdaimao.com',
};

//sensors的连接地址
module.exports.SENSOR_URL = {
    dev: 'https://ds.jrdaimao.com:8106/sa?project=default',
    dev2: 'https://ds.jrdaimao.com:8106/sa?project=default',
    dev3: 'https://ds.jrdaimao.com:8106/sa?project=default',
    dev4: 'https://ds.jrdaimao.com:8106/sa?project=default',
    sit: 'https://ds.jrdaimao.com:8106/sa?project=default',
    uat: 'https://ds.jrdaimao.com:8106/sa?project=default',
    gray: 'https://ds.jrdaimao.com/sa?project=production',
    production: 'https://ds.jrdaimao.com/sa?project=production',
};

//落地页域名
module.exports.SHARE_URLS = {
    dev: 'https://sharedev.jrdaimao.com',
    dev2: 'https://sharedev2.jrdaimao.com',
    dev3: 'https://sharedev3.jrdaimao.com',
    dev4: 'https://sharedev4.jrdaimao.com',
    sit: 'https://sharesit.jrdaimao.com',
    uat: 'https://shareuat.jrdaimao.com',
    gray: 'https://sharegray.jrdaimao.com',
    production: 'https://share.jrdaimao.com',
};
//积木系统落地页
module.exports.TOPIC_URLS = {
    dev: 'https://topicdev.jrdaimao.com',
    dev2: 'https://topicdev2.jrdaimao.com',
    dev3: 'https://topicdev3.jrdaimao.com',
    dev4: 'https://topicdev4.jrdaimao.com',
    sit: 'https://topicsit.jrdaimao.com',
    uat: 'https://topicuat.jrdaimao.com',
    gray: 'https://topicgray.jrdaimao.com',
    production: 'https://topic.jrdaimao.com',
};
//公共代理参数
//代理的url地址，本地个人代理可以写在根目录的`.local.json`下，格式同下面的proxy节点
module.exports.PROXY_LIST = [
    {
        name: 'dev环境',
        SERVE_ENV: 'dev',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaydev.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaydev.jrdaimao.com',
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaydev.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://acsit.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: 'dev2环境',
        SERVE_ENV: 'dev2',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaydev2.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaydev2.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaydev2.jrdaimao.com',
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://acsit.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: 'dev3环境',
        SERVE_ENV: 'dev3',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaydev3.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaydev3.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaydev3.jrdaimao.com',
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://acsit.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: 'dev4环境',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaydev4.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaydev4.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaydev4.jrdaimao.com',
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: 'sit环境',
        SERVE_ENV: 'sit',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaysit.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaysit.jrdaimao.com',
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaysit.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://acsit.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: 'uat环境',
        SERVE_ENV: 'uat',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewayuat.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewayuat.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewayuat.jrdaimao.com',
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://acsit.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicdev.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topicsit.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topicsit.jrdaimao.com',
            },
        ],
    },
    {
        name: '灰度环境',
        SERVE_ENV: 'gray',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gatewaygray.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gatewaygray.jrdaimao.com',
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gatewaygray.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com/bigdata',
                pathRewrite: { '^/bigdata': '' },
            },
            {
                url: '/api_config',
                target: 'https://ac.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topicgray.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topic.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topic.jrdaimao.com',
            },
        ],
    },
    {
        name: '线上环境',
        SERVE_ENV: 'production',
        proxy: [
            {
                url: '/easyhome-app-application',
                target: 'https://gateway.jrdaimao.com/easyhome-app-application',
                pathRewrite: { '^/easyhome-app-application': '' },
            },
            {
                url: '/easyhome-ops-web-application',
                target: 'https://gateway.jrdaimao.com/easyhome-ops-web-application',
                pathRewrite: { '^/easyhome-ops-web-application': '' },
            },
            {
                url: '/easyhome-b-web-application',
                target: 'https://gateway.jrdaimao.com',
            },
            {
                url: '/bigdata',
                target: 'http://bigdata.jrdaimao.com',
            },
            {
                url: '/api_config',
                target: 'https://ac.jrdaimao.com',
            },
            {
                url: '/api_topic',
                target: 'https://topic.jrdaimao.com',
            },
            {
                url: '/api_link',
                target: 'https://topic.jrdaimao.com',
            },
            {
                url: '/GPT2',
                target: 'https://topic.jrdaimao.com',
            },
        ],
    },
];
