import React, { useEffect, useState } from "react";
import { Select, Space, message } from "antd";
import { SelectProps } from "antd/es/select";
import { useRequest, useControllableValue, useBoolean } from "ahooks";
import { getGuiderList } from "@/api/guiders";
import _ from "lodash";

const { Option } = Select;

export interface CitySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, "options" | "children"> {
  params?: {
    [key: string]: any;
  };
}

interface BaseOptionType {
  key?: string;
  label: React.ReactNode;
  value: string | number;
}

export default function Index<OptionType extends BaseOptionType>(props: CitySelectProps) {
  const [value, setValue] = useControllableValue<string>(props);
  const [loaded, { setTrue }] = useBoolean(false);
  const { params = {} } = props;
  const [searchValue, setSearchVal] = useState('')

  const {
    loading,
    run,
    data,
    params: fetchParams,
  } = useRequest(
    async (params) => {
      try {
        setTrue();
        if(params?.shopIdList) {
          const data = await getGuiderList(params);
          if (data && Array.isArray(data)) {
            const dataList = data.map((val) => ({
              value: val.guiderId,
              label: val.userName,
            }));
            return dataList;
          }
        }
        return [];
      } catch (error) {
        message.info("接口请求异样");
      }
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    const { params = {} } = props;
    params.guiderName = searchValue;
    console.log(_.isEqual(fetchParams, [params]), 2222222)
    if (!_.isEqual(fetchParams, [params])) {
      run(params);
    }
  }, [params.shopIdList]);

  return (
    <Select<string, OptionType>
      allowClear
      showSearch
      filterOption={(input, option:any) => {
        const label = option.label as string;
        return label.includes(input);
      }}
      placeholder="请选择导购"
      value={value}
      onChange={(value) => {
        setValue(value || "");
      }}
      onSearch={value => {
        setSearchVal(value || "")
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
