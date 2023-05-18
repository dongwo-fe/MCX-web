import React, { useMemo, useRef } from "react";
import { useRequest, useUpdateEffect } from "ahooks";
import { Select } from "antd";
import { isSingleName } from "../../utils";
const { Option } = Select;
/**
 *
 * @param form form对象
 * @param name 要设置的form value的key
 * @param api 获取options的接口
 * @param codeKey options value item[codeKey]
 * @param titleKey options title  item[titleKey]
 * @param otherProps 剩余props
 * @param manual 是否立即请求数据
 * @param depend 依赖项
 * @param onChange onChange
 * @param responseName
 * @returns {JSX.Element}
 */
const CombinationSelect = ({ form, name, api, depend = [], titleKey = "dicVal", codeKey = "dicCode", indexkey, manual = true, responseName = "data", onChange, ...otherProps }) => {
  const isRequestRef = useRef(false);
  const nameCasheData = sessionStorage[name + "Collection"] ? JSON.parse(sessionStorage[name + "Collection"]) : [];
  const defaultOptions = nameCasheData.map((item) => {
    return (
      <Option name={item[titleKey]} key={indexkey ? item[indexkey] : item[codeKey]} value={item[codeKey]}>
        {item[titleKey]}
      </Option>
    );
  });
  const { data, loading, run, mutate } = useRequest(api, {
    manual: manual,
    loadingDelay: 300,
  });
  // 获取依赖项
  const dependValues = depend.map((name) => form.getFieldValue(name));
  // 当依赖项发生变化时立即置空数据，然后重新发起请求
  useUpdateEffect(() => {
    mutate({ data: [] });
    // form.setFieldsValue({
    //   [name]: undefined
    // })
  }, dependValues);
  //onChange时设置value,onChange是from默认传进来的
  const handleChange = (value) => onChange?.(value);
  // options
  const options = useMemo(() => {
    try {
      if (data) {
        let res = "";
        if (responseName === "data") {
          res = data[responseName];
        } else {
          res = data.data[responseName];
        }
        if (res && Array.isArray(res)) {
          let judgeArr = [...isSingleName, ...["paySource"]];
          if (res.length && judgeArr.indexOf(name) !== -1) {
            sessionStorage[name + "Collection"] = JSON.stringify(res); //存一份，为了链接跳转反显select
          }
          return res
            .filter((item) => item)
            .map((item) => (
              <Option name={item[titleKey]} key={indexkey ? item[indexkey] : item[codeKey]} value={item[codeKey]}>
                {item[titleKey]}
              </Option>
            ));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);
  // 获取焦点时判断是否有缓存数据和是否有from的依赖参数
  // 如果有缓存&&没有依赖项就不发请求了
  const onFocus = () => {
    if (isRequestRef.current && !depend.length) return;
    run(form.getFieldsValue(depend)).then((res) => {
      if (res.code === "200") {
        isRequestRef.current = true;
      }
    });
  };
  // 检索方法
  const search = (input, option) => {
    //  数据中非字符串格式，转义下。
    return ("" + option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  return (
    <Select
      allowClear={true}
      autoClearSearchValue={true}
      placeholder="请选择"
      showArrow={true}
      loading={loading}
      onFocus={onFocus}
      {...otherProps}
      filterOption={search}
      onChange={handleChange}
    >
      {options ? options : defaultOptions}
    </Select>
  );
};

export default CombinationSelect;
