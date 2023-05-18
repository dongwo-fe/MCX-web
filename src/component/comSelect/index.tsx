import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRequest, useUpdateEffect, useDebounce } from "ahooks";
import { Select } from "antd";
const { Option } = Select;
/**
 *
 * @param form form对象
 * @param name 要设置的form value的key
 * @param api 获取options的接口
 * @param codeKey options value item[codeKey]
 * @param titleKey options title  item[titleKey]
 * @param manual 是否立即请求数据
 * @param propsParms 额外参数
 * @param onChange onChange
 * @param responseName
 * @returns {JSX.Element}
 */
const CombinationSelect = ({
  form,
  name,
  api,
  propsParms = {},
  titleKey = "dicVal",
  codeKey = "dicCode",
  indexkey,
  manual = true,
  responseName = "data",
  onChange,
  ...otherProps
}) => {
  const isRequestRef = useRef(false);
  const [scrollPage, setScrollPage] = useState(1); //翻页
  const [hasNextPage, setHasNextPage] = useState(true); //下一页
  const [searchVal, setSearchVal] = useState(""); //检索
  const [data, setData] = useState([]);
  const debouncedValue = useDebounce(searchVal, { wait: 800 });
  const nameCasheData = sessionStorage[name + "Collection"] ? JSON.parse(sessionStorage[name + "Collection"]) : [];

  const { loading, run, mutate } = useRequest(api, {
    manual: manual,
    debounceWait: 200,
    defaultParams: [
      {
        [name]: "",
        page: 1,
        pageSize: 50,
        ...propsParms,
      },
    ],
    onError: (error) => {
      console.log(error);
      return [];
    },
    onSuccess: (responce:any) => {
      isRequestRef.current = true;
      let res = [];
      let pageNum = 0;
      let hasNextPage = true;
      if (responseName === "data") {
        res = responce[responseName];
      } else {
        if(Array.isArray(responce[responseName])){
          res = responce[responseName];
          pageNum = responce.pageNum;
          hasNextPage = responce.hasNextPage;
        }else{
          res = responce.data[responseName];
          pageNum = responce.data.pageNum;
          hasNextPage = responce.data.hasNextPage;
        }
      }

      if (pageNum === 1) {
        setData(res);
      } else {
        setData([...data, ...res]);
      }
      setHasNextPage(hasNextPage);
    },
  });
  //onChange时设置value,onChange是from默认传进来的
  const handleChange = (value) => onChange?.(value);
  // options
  const options = useMemo(() => {
    try {
      if (data) {
        if (data && Array.isArray(data)) {
          return data.map((item) => (
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
  //店铺列表
  const handleSearch = (newValue) => {
    setScrollPage(1);
    setSearchVal(newValue);
    setHasNextPage(true);
  };
  //店铺滚动加载
  const onScroll = (e) => {
    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const nextScrollPage = scrollPage + 1;
      setScrollPage(nextScrollPage);
      fnSearch(nextScrollPage); // 调用api方法
    }
  };
  const fnSearch = (nextScrollPage) => {
    const parms = {
      [name]: debouncedValue,
      page: nextScrollPage ? nextScrollPage : scrollPage,
      pageSize: 50,
      ...propsParms,
    };
    if(searchVal) {
      parms[name] = searchVal
    }
    if (hasNextPage) {
      run(parms);
    }
  };
  useEffect(() => {
    fnSearch(1);
  }, [debouncedValue]);
  return (
    <Select
      allowClear={true}
      autoClearSearchValue={true}
      placeholder="请选择"
      showArrow={true}
      loading={loading}
      onSearch={handleSearch}
      onPopupScroll={onScroll}
      {...otherProps}
      onChange={handleChange}
    >
      {options}
    </Select>
  );
};

export default CombinationSelect;
