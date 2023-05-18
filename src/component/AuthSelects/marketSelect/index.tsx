import React, { useEffect, useRef, useState } from 'react';
import { Select, Space, message } from 'antd';
import { SelectProps } from 'antd/es/select';
import { marketsStationList } from '@/api/markets';
import { queryByTokenAndMarketId, listMarket } from '@/api/operChannelApi';
import { saveStorage, storageKeys } from '@/utils/storageTools';

const { Option } = Select;

export interface CitySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
    params?: {
        [key: string]: any;
    };
    needAll?: boolean;
    onChange?: (...arg: any) => void;
    request?: (...arg: any) => void;
    placeholder?: string;
    type?:string
}

interface BaseOptionType {
    key?: string;
    label: React.ReactNode;
    value: string | number;
}

export default function MarketSelect<OptionType extends BaseOptionType | BaseOptionType = BaseOptionType>(props: CitySelectProps) {
    const [value, setValue] = useState<string>();
    const [loaded, setTrue] = useState<boolean>(false);
    const [data, setData] = useState<any[]>();
    const { params = {}, 
            onChange, 
            request = queryByTokenAndMarketId,
            placeholder = "请选择卖场",
            type
         } = props;
    const fetchParams = useRef();

    useEffect(() => {
        if (JSON.stringify(params) !== JSON.stringify(fetchParams.current)) {
            getData(params);
        }
    }, [params]);

    const getData = async (params: any) => {
        try {
            setTrue(true);
            fetchParams.current = params;
            if(type === 'new'){
                console.log(params)
                if(params?.cityStationId !== undefined || params?.cityStationIds?.length > 0){
                    const data = await listMarket(params);
                    if (data && Array.isArray(data)) {
                        const list = data.map((val: { marketId: any; marketName: any; }) => ({
                            value: val.marketId,
                            label: val.marketName,
                        }));
                        setData(list);
                    }
                }else{
                    setData([]);
                }
            }else{
                const data = await queryByTokenAndMarketId();
                saveStorage(storageKeys.MARKETS, data.marketIds);
                if (data && Array.isArray(data.marketIds)) {
                    let templist = [];
                    if (params.cityId && params.cityId !== 'all') {
                        templist = data.marketIds.filter((v: { cityId: any; }) => v.cityId === params.cityId);
                    } else {
                        templist = data.marketIds;
                    }
                    const list = templist.map((val: { marketId: any; marketName: any; }) => ({
                        value: val.marketId,
                        label: val.marketName,
                    }));
                    setData(list);
                }
            }
        } catch (error) {
            message.info('接口请求异样');
        } finally {
            setTrue(false);
        }
    };

    return (
        <Select<string, OptionType>
            allowClear
            showSearch
            filterOption={(input, option: any) => {
                const label = option.label || option.children;
                return label.includes(input);
            }}
            placeholder={placeholder}
            value={value}
            onChange={(value) => {
                setValue(value || '');
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
