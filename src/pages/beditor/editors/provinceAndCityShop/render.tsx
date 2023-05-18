import { iEditorBlock, iProvinceAndCityShop } from '@/store/config';
import { Button } from 'antd';
import './index.scss';
import React from 'react';
import { ThemeCardClass } from '@/pages/beditor/editors/provinceAndCityShop/config';


const RenderProvinceAndCityShop = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iProvinceAndCityShop;
    return (
        <div
            className={['render-province-and-city-shop', ThemeCardClass[data.cardTheme]].join(' ')}
            style={{ background: data.cardTheme }}
        >
            <div className='module-title'>预约门店</div>
            <div className='form-item'>
                <span>请选择省市</span>
                <span className='arrow'>
                    <img src='https://ossprod.jrdaimao.com/file/1678176809892901.png' alt='' />
                </span>
            </div>
            <div className='form-item'>
                <span>门店名称</span>
                <span className='arrow'>
                    <img src='https://ossprod.jrdaimao.com/file/1678176809892901.png' alt='' />
                </span>
            </div>
            <div className='submit'>
                <Button style={{ background: data.buttonColor }}>
                    {data.buttonTextValue}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(RenderProvinceAndCityShop);
