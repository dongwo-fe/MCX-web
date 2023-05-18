import { Modal, Input, Select, Space, message } from 'antd';
import React, { useState } from 'react';
const { Option } = Select;
/**
 *  // 1. H5 链接，输入完整HTTPS开头的链接地址。
// 2. 商品详情页：输入 “daimao://goodsId=123” 将123 替换成跳转的商品ID
// 3. 店铺详情页：输入“daimao://shopId=123” 将123 替换成跳转的店铺ID
// 4. 卖场详情页：输入“daimao://marketId=123 ”将123 替换成跳转的卖场ID
// 5. 同城卖场列表页：输入“daimao://marketList”
// 6. 搜索关键字：输入“daimao://keyWords=123”，将123 替换成跳转的搜索关键字
// 7. 类目列表：输入“daimao://categoryId=123”，将123替换成跳转的二级类目ID
// 8. 评价 evaluation
// 9. 无 nothing
// 10. 图文笔记详情页: 输入“daimao://graphicNotesId=123”，将123替换成内容的ID
// 11. 文章详情页: 输入“daimao://articleDetailId=123”，将123替换成文章笔记的ID      
 */
const URLSTART = ['', '', 'daimao://goodsId=', 'daimao://shopId=', 'daimao://marketId=', 'daimao://marketList=', 'daimao://keyWords=', 'daimao://categoryId='];
const EditorModal = (props: any) => {
    const { item, visible, onSave, onCancel } = props;
    const [typeValue, setTypeValue] = useState(item.value || 'nothing');
    const [inputValue, setInputValue] = useState(item.link_url);
    const SELECTTYPE = [
        { name: '不设置', value: 'nothing' },
        { name: 'H5自定义链接', value: 'h5' },
        { name: '商品详情页', value: 'goodsId' },
        { name: '店铺详情页', value: 'shopId' },
        { name: '卖场详情页', value: 'marketId' },
        { name: '同城卖场列表页', value: 'marketList' },
        { name: '搜索关键字', value: 'keyWords' },
        { name: '类目列表', value: 'categoryId' },
        { name: '图文笔记', value: 'graphicNotesId' },
        { name: '文章详情', value: 'articleDetailId' },
    ];
    // 类型选择
    const handleTypeChange = (value: string) => {
        setTypeValue(value);
        setInputValue('');
    };
    // 输入修改
    const inputChange = (text: string) => {
        setInputValue(text);
    };
    const handleOk = () => {
        const data = {
            link_url: inputValue,
            value: typeValue,
        };
        if (typeValue != 'nothing' && typeValue != 'marketList' && typeValue != '' && inputValue == '') {
            return message.error('请输入正确的链接信息');
        }
        onSave && onSave(data);
    };
    const handleCancel = () => {
        onCancel && onCancel();
    };
    // 输入框展示判断
    const showInputLink = () => {
        let placeholderText = '';
        if (['nothing', 'marketList'].includes(typeValue)) return <div />;
        switch (typeValue) {
            case '':
                placeholderText = '输入正确的地址链接';
                break;
            case 'h5':
                placeholderText = '输入完整HTTPS开头的链接地址';
                break;
            case 'goodsId':
                placeholderText = '输入跳转的商品ID';
                break;
            case 'shopId':
                placeholderText = '输入跳转的店铺ID';
                break;
            case 'marketId':
                placeholderText = '输入跳转的卖场ID';
                break;
            case 'marketList':
                placeholderText = '输入“daimao://marketList';
                break;
            case 'keyWords':
                placeholderText = '输入跳转的搜索关键字';
                break;
            case 'categoryId':
                placeholderText = '输入跳转的二级类目ID';
                break;
            case 'graphicNotesId':
                placeholderText = '输入跳转的图文笔记的详情ID';
                break;
            case 'articleDetailId':
                placeholderText = '输入跳转的文章详情ID';
                break;
        }
        return (
            <Input
                key={typeValue}
                allowClear
                defaultValue={inputValue || ''}
                disabled={typeValue == ''}
                onChange={(e) => inputChange(e.target.value)}
                width={800}
                placeholder={placeholderText}
                size="large"
            />
        );
    };
    return (
        <Modal
            width={700}
            bodyStyle={{ height: 400 }}
            title="设置自定义链接"
            visible={visible}
            closable={false}
            onOk={handleOk}
            okText="确定"
            cancelText="取消"
            onCancel={handleCancel}
        >
            <Select defaultValue={typeValue == '' ? '请选择链接的类型' : typeValue} onChange={handleTypeChange} style={{ width: 600 }} size="large">
                {SELECTTYPE.map((item, index) => {
                    return (
                        <Option key={index} value={item.value}>
                            {item.name}
                        </Option>
                    );
                })}
            </Select>
            <Space size="large" style={{ width: 600 }} direction="vertical">
                <div style={{ marginTop: 20 }}>{showInputLink()}</div>
            </Space>
        </Modal>
    );
};

export default EditorModal;
