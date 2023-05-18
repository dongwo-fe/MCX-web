import React from "react";
import { Row, Form, Input } from "antd";
const inputTwo = ({ _name, ...props }) => {
  const names = _name.split(",");
  return (
    <Row justify="space-between" wrap={false}>
      <Form.Item name={names[0]} style={{ width: "45%", marginBottom: 0 }}>
        <Input
          style={{ width: "100%" }}
          placeholder={props?.placeholderOne}
        />
      </Form.Item>
      <span>---</span>
      <Form.Item name={names[1]} style={{ width: "45%", marginBottom: 0 }}>
        <Input
          style={{ width: "100%" }}
          placeholder={props?.placeholderTwo}
        />
      </Form.Item>
    </Row>
  );
};
export default inputTwo;
