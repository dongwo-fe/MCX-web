import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRequest, useUpdateEffect, useDebounce } from "ahooks";
import { Select } from "antd";
import { withContext } from '@/pages/differentChannels/context'

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
  propsParms,
  titleKey = "dicVal",
  codeKey = "dicCode",
  indexkey,
  manual = true,
  responseName = "data",
  dependence = '',
  showModal,
  onChange,
  ...otherProps
}) => {
  const dependent = propsParms[dependence]
  const isRequestRef = useRef(false);
  const [scrollPage, setScrollPage] = useState(1); //翻页
  const [hasNextPage, setHasNextPage] = useState(true); //下一页
  const [searchVal, setSearchVal] = useState(""); //检索
  const [data, setData] = useState([]);
  const debouncedValue = useDebounce(searchVal, { wait: 500 });
  const { loading, run, mutate } = useRequest(api, {
    manual: manual,
    debounceWait: 200,
    defaultParams: [
      {
        [name]: "",
        page: 1,
        pageSize: 10,
        ...propsParms,
      },
    ],
    onError: (error) => {
      return [];
    },
    onSuccess: (responce:any) => {
      isRequestRef.current = true;
      let res = [];
      res = responce[responseName];
      if (responce.pageNum === 1) {
        setData(res);
      } else {
        setData([...data, ...res]);
      }
      setHasNextPage(responce.hasNextPage);
      setScrollPage(responce.pageNum);
    },
  });
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
    let { scrollTop, offsetHeight, scrollHeight } = e.target;
    scrollTop = scrollTop + 50;
    if (scrollTop + offsetHeight >= scrollHeight) {
      const nextScrollPage = scrollPage + 1;
      fnSearch(nextScrollPage); // 调用api方法
    }
  };
  const fnSearch = (nextScrollPage) => {
    
    const parms = {
      page: nextScrollPage ? nextScrollPage : scrollPage,
      pageSize: 10,
      ...propsParms,
    };
    if(searchVal) {
      parms[name] = searchVal
    }
    if (hasNextPage) {
      run(parms);
    }
  };
  useUpdateEffect(() => {
    fnSearch(1);
  }, [debouncedValue]);

  useUpdateEffect(() => {
    const params = {
      [name]: "",
      page: 1,
      pageSize: 10,
      ...propsParms,
    }
    if(!showModal) {
      if(name !== 'guiderName') {
        run(params)
      }
    }
  }, [showModal])

  // 上一级变化，下一级根据上一级重新获取数据
  useEffect(() => {
    const params = {
      [name]: "",
      page: 1,
      pageSize: 10,
      ...propsParms,
    }

    // 当请求导购接口数据为数组的时候，会触发两次，做一下判断
    if(name == 'guiderName') {
      if(propsParms?.shopIdList){
        if(Array.isArray(dependent) && dependent[0]) {
          dependent && run(params)
        }
      }else{
        setData([])
      }

    } else {
      if(name === 'channelLevelName' && propsParms?.channelLevelParent){
        dependent && run(params)
      }else{
        setData([])
      }
    }

  }, [dependent])

  // 下拉框值变化的回调
  const handleChange = (value, option) => {
    if(value === undefined) {
      setSearchVal("");
      const parms = {
        page: 1,
        pageSize: 10,
        ...propsParms,
      };
      parms[name] = "";
      run(parms);
    }
    onChange?.(value, option);
  };

  return (
    <Select
      showSearch
      allowClear={true}
      autoClearSearchValue={true}
      placeholder="请选择"
      showArrow={true}
      loading={loading}
      filterOption={(input, option:any) => {
        const label = option.name as string;
        return label.includes(input);
      }}
      onSearch={handleSearch}
      onPopupScroll={onScroll}
      onChange={handleChange}
      {...otherProps}
    >
      {options}
    </Select>
  );
};

export default withContext(CombinationSelect);
