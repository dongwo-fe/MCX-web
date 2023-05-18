import React, { useEffect, useRef, useState } from 'react';
import { Select, Space, message } from 'antd';
import { SelectProps } from 'antd/es/select';
import { marketsStationList } from '@/api/markets';
import { dropDownListDataPermission, queryByTokenAndMarketId, listCity } from '@/api/operChannelApi';
import { saveStorage, storageKeys } from '@/utils/storageTools';

const { Option } = Select;

export interface CitySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
    params?: {
        [key: string]: any;
    };
    needAll?: boolean;
    form?:any;
    name?:any;
    type?:string; //兼容老接口 new 新街口
    hasPage?:boolean; //是否有分页
    onClear?:(...arg: any)=>void;
}

interface BaseOptionType {
    key?: string;
    label: React.ReactNode;
    value: string | number;
}

export default function CitySelect<OptionType extends BaseOptionType | BaseOptionType = BaseOptionType>(props: CitySelectProps) {
    const [value, setValue] = useState<string>();
    const [loaded, setTrue] = useState<boolean>(false);
    const [data, setData] = useState<any[]>();
    const { params = {}, form, name:_name, type, hasPage=false } = props;
    const fetchParams = useRef();
    useEffect(() => {
        if (!loaded || JSON.stringify(params) !== JSON.stringify(fetchParams.current)) {
            getData(params);
        }
    }, [params]);

    const getData = async (params: any) => {
        try {
            setTrue(true);
            fetchParams.current = params;
            // const data = await dropDownListDataPermission();
            if(type === 'new'){
                const data = await listCity({});
                if (data && Array.isArray(data)) {
                    const list = data.map((val: { cityStationId: any; cityName: any; }) => ({
                        value: val.cityStationId,
                        label: val.cityName,
                    }));
                    setData(list);
                }
            }else{
                const data = await queryByTokenAndMarketId();
                saveStorage(storageKeys.CITY_IDS, data.cityIds);
                if (data.cityIds && Array.isArray(data.cityIds)) {
                    const list = data.cityIds.map((val: { cityStationId: any; cityName: any; }) => ({
                        value: val.cityStationId,
                        label: val.cityName,
                    }));
                    setData(list);
                }
            }
        } catch (error) {
            message.info('接口请求异样');
        }
    };

    return (
        <Select<string, OptionType>
            allowClear
            showSearch
            filterOption={(input, option: any) => {
                if(hasPage){
                    console.log(input)
                    return
                }
                const label = option.label || option.children;
                return label.includes(input);
            }}
            placeholder="请选择城市"
            value={value}
            onChange={(value) => {
                const obj = {};
                obj[_name] = value || '';
                setValue(value || '');
                form.setFieldsValue(obj);
            }}
            {...props}
        >
            {props.needAll && (
                <Option key={'all'} value={'all'}>
                    全部
                </Option>
            )}

            {data?.map((val) => {
                return (
                    <Option key={val.value} value={val.value}>
                        {val.label}
                    </Option>
                );
            })}
        </Select>
    );
}
