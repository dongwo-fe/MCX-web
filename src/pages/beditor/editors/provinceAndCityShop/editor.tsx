import { iEditorPage, iProvinceAndCityShop } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Button, Radio, Select, Upload, InputNumber, message, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import './editor.scss';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { colorTypes, noteTemplateList } from './config';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { downloadTemplate, floorPageMaretImport } from '@/api/provinceAndCityShop';
import { useSelector } from 'react-redux';
import RegistorInfo from '../component/registorInfo';
import ShowTypeComp from '../component/showTypeComp';

interface iProps {
    data: iProvinceAndCityShop;
}

/**
 * 预约门店编辑
 */
const ProvinceAndCityShopEditor = ({ data: { id } }: iProps) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<iProvinceAndCityShop>({ id });
    const page = useSelector<{ editor: { page: iEditorPage } }, iEditorPage>((state) => state.editor.page);
    const [activeKey, setActiveKey] = useState('styles');
    // 下载门店模板
    const handleUpload = async () => {
        try {
            const res = await downloadTemplate({
                template: '预约门店信息.xlsx'
            });
            saveAs(res, '预约门店信息.xlsx');
        } catch (err: any) {
            message.warning(err.message);
        }
    };
    // 上传商品模版
    const handleUploadFile = async (info) => {
        const { file } = info;
        const uploadReg = /\.(xls|xlsx)$/;
        if (!uploadReg.test(file.name)) {
            return message.error('仅支持xlsx、xls格式的文件');
        }
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await floorPageMaretImport(formData);
            handleChangeItemValue('shopFile', {
                filename: file.name,
                src: res.url,
                list: res.setVo || [],
                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                errorMessage: null
            });
        } catch (err: any) {
            message.warning(err.message);
            handleChangeItemValue('shopFile', {
                errorMessage: err.message
            });
        }
    };
    const deleteTemplateFile = () => {
        handleChangeItemValue('shopFile', {
            filename: '',
            src: '',
            time: '',
            list: [],
            errorMessage: null
        });
    };
    const previewTemplateText = useMemo(() => {
        return noteTemplateList.find((item) => item.id === data.msgTemplateId)?.content;
    }, [data.msgTemplateId]);
    return (
        <div className='editor-module-wrap province-and-city-shop-editor'>
            <div className="form_editor_tabs">
                <div onClick={() => setActiveKey('styles')} className={`form_editor_tab ${ activeKey === 'styles' ? 'active' : '' }`}>样式<div className="tab_bar"></div></div>
                <div onClick={() => setActiveKey('actions')} className={`form_editor_tab ${ activeKey === 'actions' ? 'active' : '' }`}>交互<div className="tab_bar"></div></div>
            </div>
            {activeKey === 'styles' && <>
                <div className='control-group'>
                    <div className='control-group__title'>上传门店</div>
                    <Button style={{ marginRight: 5 }} onClick={handleUpload}>
                        <CloudDownloadOutlined />
                        下载导入模板
                    </Button>
                    <Upload accept='.xls,.xlsx' showUploadList={false} customRequest={handleUploadFile}>
                        <Button>
                            <CloudUploadOutlined />
                            导入门店
                        </Button>
                    </Upload>
                </div>
                {data.shopFile.filename ? (
                    <div className='form-row'>
                        <div className={'title-label'}>
                            <div className='file-name'>
                                <a download href={data.shopFile.src}>
                                    {data.shopFile.filename}
                                </a>
                            </div>
                        </div>
                        <div onClick={deleteTemplateFile} className={'delete-file'}>
                            删除
                        </div>
                    </div>
                ) : null}
                {data.shopFile.errorMessage ?
                    <div className='form-row file-error'>{data.shopFile.errorMessage}</div> : null}
                <div className='form-row'>
                    <div className={'title-label'}>最大预约人数</div>
                    <div className={'item-wrap'}>
                        <InputNumber
                            disabled={Date.now() > page.startTime && Date.now() < page.endTime}
                            precision={0}
                            value={data.maxMakeCount}
                            onChange={(e) => handleChangeItemValue('maxMakeCount', e)}
                            min={1}
                            max={999999}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className={'title-label'}>发送短信</div>
                    <div className={'item-wrap'}>
                        <Radio.Group
                            value={data.sendMessage}
                            onChange={(e) => {
                                handleChangeItemValue('sendMessage', e.target.value);
                                handleChangeItemValue('msgTemplateId', e.target.value === 0 ? undefined : noteTemplateList[0].id);
                            }}
                        >
                            <Radio value={1}>发送</Radio>
                            <Radio value={0}>不发送</Radio>
                        </Radio.Group>
                    </div>
                </div>
                {data.sendMessage ? (
                    <div className='form-row'>
                        <div className={'title-label'}>短信模板</div>
                        <div className={'item-wrap'}>
                            <Select
                                options={noteTemplateList}
                                fieldNames={{
                                    label: 'content',
                                    value: 'id'
                                }}
                                value={data.msgTemplateId}
                                onChange={(e) => handleChangeItemValue('msgTemplateId', e)}
                                placeholder='请选择短信模板'
                                style={{ width: 200 }}
                            ></Select>
                        </div>
                    </div>
                ) : null}
                {data.msgTemplateId && previewTemplateText ? (
                    <div className='form-row'>
                        <div className='preview-template'>
                            <div>短信预览：</div>
                            <p>{previewTemplateText}</p>
                        </div>
                    </div>
                ) : null}
                <div className='form-row'>
                    <div className={'title-label'}>卡片样式</div>
                    <div className={'item-wrap'}>
                        <Radio.Group className={'theme-radio'} value={data.cardTheme}
                                    onChange={(e) => handleChangeItemValue('cardTheme', e.target.value)}
                                    optionType='button'>
                            <Radio value='#FFFFFF'>浅色模式</Radio>
                            <Radio value='rgba(255,255,255,.2)'>深色模式</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className='form-row'>
                    <div className={'title-label'}>按钮文案</div>
                    <div className={'item-wrap'}>
                        <Input
                            style={{ width: 250 }}
                            maxLength={10}
                            showCount
                            onBlur={(e)=>{
                                if (e.target.value?.trim() === ''){
                                    handleChangeItemValue('buttonTextValue', '立即预约');
                                }
                            }}
                            onChange={(e) => handleChangeItemValue('buttonTextValue', e.target.value)}
                            placeholder={'请输入按钮文案'}
                            value={data.buttonTextValue}
                        />
                    </div>
                </div>
                <div className='form-row'>
                    <div className={'title-label'}>按钮颜色</div>
                    <div className={'item-wrap'}>
                        <Radio.Group value={data.buttonColor}
                                    onChange={(e) => handleChangeItemValue('buttonColor', e.target.value)}
                                    className='custom-color-radio-wrap'>
                            {colorTypes.map((item) => {
                                return (
                                    <Radio key={item.color} value={item.color}>
                                        <div className='custom-color-radio'>
                                            <div>
                                                <div style={{ background: item.color }}></div>
                                            </div>
                                            <div>{item.title}</div>
                                        </div>
                                    </Radio>
                                );
                            })}
                        </Radio.Group>
                    </div>
                </div>
                <ShowTypeComp id={id} />
            </>}
            {activeKey === 'actions' && <div>
                <RegistorInfo showDoorverse={false} id={id} showMarket={false} />
            </div>}
        </div>
    );
};

export default ProvinceAndCityShopEditor;
