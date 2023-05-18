import React, { useEffect } from "react";
import { Select, Space, message } from "antd";
import { SelectProps } from "antd/es/select";
import { useRequest, useControllableValue, useBoolean } from "ahooks";
import { getChannelLevel } from "@/api/channel";
import _ from "lodash";

const { Option } = Select;

export interface CitySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, "options" | "children"> {
  params?: {
    [key: string]: any;
  };
  getDataList?: any;
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

  const {
    loading,
    run,
    data,
    params: fetchParams,
  } = useRequest(
    async (params) => {
      try {
        setTrue();
        if(!params.channelLevel) return []
        const res = await getChannelLevel(params);
        if (res.list) {
          const dataList = res.list.map((val) => ({
            value: val.channelLevelId,
            label: val.channelLevelName,
          }));
          return dataList;
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
      placeholder="请选择渠道"
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
