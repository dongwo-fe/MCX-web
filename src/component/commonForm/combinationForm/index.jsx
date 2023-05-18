import CombinationInput from "@/pages/clearingSettlement/components/combinationInput";
import CombinationSelect from "@/pages/clearingSettlement/components/combinationSelect";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import React, { forwardRef, useImperativeHandle } from "react";
import InputNumTwo from "../inputNumberTwo";
import InputTwo from "../inputTwo";
import { isSingleName } from "./../../utils";
import "./index.less";

const { Option } = Select;

// 组件枚举 对应配置文件的type类型
const typesCom = {
  input: Input,
  select: Select,
  datePicker: DatePicker,
  rangePicker: DatePicker.RangePicker,
  inputTwo: InputTwo,
  inputNumTwo: InputNumTwo,
  combinationSelect: CombinationSelect,
  combinationInput: CombinationInput,
};

// 默认props
const DefaultProps = {
  input: {
    placeholder: "请输入",
  },
  combinationInput: {
    placeholder: "请输入",
  },
  select: {
    showArrow: true,
    placeholder: "请选择",
  },
};
// 合并组件的props
const createDefaultProps = (p = {}, type) => {
  const otherProps = DefaultProps[type] ?? {};
  return {
    ...otherProps,
    ...p,
  };
};
//默认格式化日期的方法 默认格式到天
const defaultFormatDateFunc = (value, define) => {
  if (define) {
    return moment(value).format("YYYY-MM-DD HH:mm:ss");
  } else {
    return moment(value).format("YYYY-MM-DD");
  }
};

//处理表单数据
export function formatFormData(values = {}, formatDateFunc = defaultFormatDateFunc) {
  const keys = Object.keys(values);
  const needTransNum = ["paySource"];
  const createDate = "orderCreatedStart,orderCreatedEnd";
  for (let i = 0, len = keys.length; i < len; i++) {
    const joinKeyArr = keys[i].split(",");
    const itemKey = keys[i];
    const itemValue = values[itemKey];
    if (!itemValue) {
      if (typeof itemValue !== "number") values[itemKey] = undefined;
      continue;
    }
    if (joinKeyArr.length <= 1) continue;
    joinKeyArr.forEach((key, index) => {
      values[key] = Array.isArray(itemValue) ? formatDateFunc(values[itemKey][index], itemKey === createDate ? false : true) : undefined;
    });
    delete values[itemKey];
  }
  isSingleName.forEach((element) => {
    if (typeof values[element] === "number") {
      values[element] = [values[element]];
    }
  });

  return values;
}

const CombinationForm = (props, ref) => {
  const { formList, formSubmit, onSearch, formProps, span = 6, onValuesChange = () => {}, customFormatDateFunc = defaultFormatDateFunc } = props;
  const keys = Object.keys(formList);
  const [form] = Form.useForm();
  // 向外面暴露自己的方法
  useImperativeHandle(ref, () => {
    return {
      form,
    };
  });
  // 提交
  const onFinish = (values) => {
    formatFormData(values, customFormatDateFunc);
    onSearch(values);
  };
  return (
    <Form className={"combination_form"} form={form} onFinish={onFinish} {...formProps} onValuesChange={onValuesChange}>
      <Row>
        {keys.map((name, index) => {
          const item = formList[name];
          const FormItemCom = typesCom[item.type];
          const props = createDefaultProps({ ...item.props, name }, item.type);
          if (item.props?.isHide) return "";
          return (
            <Col key={index} span={span}>
              <Form.Item {...item.formProps} label={item.labelName} name={name}>
                <FormItemCom form={form} {...props} _name={name}>
                  {Array.isArray(item.options)
                    ? item.options.map((item) => {
                        return (
                          <Option name={item.name} value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : null}
                </FormItemCom>
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      {formSubmit}
    </Form>
  );
};

export default forwardRef(CombinationForm);
