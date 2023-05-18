import { Form, InputNumber, Row } from "antd";
import React from "react";
const inputNumTwo = ({ _name, ...props }) => {
  const names = _name.split(",");
  return (
    <Row justify="space-between" align="middle" wrap={false}>
      <Form.Item name={names[0]} style={{ width: "45%", marginBottom: 0 }}>
        <InputNumber style={{ width: "100%" }} min={0} precision={props.precision} max={props.max} />
      </Form.Item>
      <span
        style={{
          display: "block",
          flex: 1,
          height: "1px",
          background: "#000",
          margin: "0px 3px",
        }}
      ></span>
      <Form.Item name={names[1]} style={{ width: "45%", marginBottom: 0 }}>
        <InputNumber style={{ width: "100%" }} min={0} precision={props.precision} max={props.max} />
      </Form.Item>
    </Row>
  );
};
export default inputNumTwo;
