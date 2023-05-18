import React from "react";
import { Input } from "antd";

const CombinationInput = (props) => {
  const onChange = (e) => {
    let value = e.target.value;
    if (props.replaceRule) {
      value = value.replace(props.replaceRule, "");
    }
    props.onChange?.(value);
  };
  return <Input {...props} onChange={onChange} />;
};

export default CombinationInput;
