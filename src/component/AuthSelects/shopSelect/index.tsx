import React, { useEffect } from "react";
import { Select, Space, message } from "antd";
import { SelectProps } from "antd/es/select";
import { useRequest, useControllableValue, useBoolean } from "ahooks";
import { getShopList } from "@/api/shops";
import { listShop } from '@/api/operChannelApi';
import _ from "lodash";

const { Option } = Select;

export interface CitySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, "options" | "children"> {
  params?: {
    [key: string]: any;
  };
  getDataList?: any;
  type?:string;
  manual?:boolean
}

interface BaseOptionType {
  key?: string;
  label: React.ReactNode;
  value: string | number;
}

export default function Index<OptionType extends BaseOptionType>(props: CitySelectProps) {
  const [value, setValue] = useControllableValue<string>(props);
  const [loaded, { setTrue }] = useBoolean(false);
  const { params = {}, type, manual=true } = props;

  const {
    loading,
    run,
    data,
    params: fetchParams,
  } = useRequest(
    async (params) => {
      try {
        setTrue();
        let dataList:any = [];
        if(type === 'new'){
            console.log(params,'99999999999')
            if(params?.marketId || params?.marketIds?.length > 0){
                const data = await listShop(params);
                if (data && Array.isArray(data)) {
                    dataList = data.map((val) => ({
                        value: val.shopId,
                        label: val.shopName,
                    }));
                }
            }else{
              dataList = [];
            }
        }else{
            const res = await getShopList(params);
            if (res.list) {
                dataList = res.list.map((val) => ({
                    value: val.shopId,
                    label: val.shopName,
                }));
                props.getDataList && props.getDataList(dataList);
            }
        }
        
        return dataList;
      } catch (error) {
        message.info("接口请求异样");
      }
    },
    {
      manual: manual,
    }
  );

  useEffect(() => {
    const { params = {} } = props;
    if (!loaded || !_.isEqual(fetchParams, [params])) {
      run(params);
    }
  }, [params]);

  return (
    <Select<string, OptionType>
      allowClear
      showSearch
      filterOption={(input, option:any) => {
        const label = option.label as string;
        return label.includes(input);
      }}
      placeholder="请选择店铺"
      value={value}
      onChange={(value) => {
        setValue(value || "");
      }}
      {...props}
    >
      {data?.map((val:any) => {
        return (
          <Option key={val.value} value={val.value} {...val}>
            {val.label}
          </Option>
        );
      })}
    </Select>
  );
}
