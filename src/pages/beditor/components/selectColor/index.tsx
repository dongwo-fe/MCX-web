import React, { useState } from 'react';
import './index.less';
import { Button, Popover } from 'antd';
import * as Sketch from 'react-color';
import { RedoOutlined } from '@ant-design/icons';

const SketchPicker: any = Sketch.SketchPicker;

interface iSelectColor {
    value: string;
    onChange(hex: string): void;
    defaultValue?: string;
}

const SelectColor = ({ value, defaultValue = '#FFFFFF', onChange }: iSelectColor) => {
    return (
        <div className="select-color">
            <Button style={{ color: '#737373' }} type="text" icon={<RedoOutlined />} className="reset-button" onClick={() => onChange(defaultValue)}>
                重置
            </Button>
            <Popover placement="bottomRight" trigger={'click'} content={<SketchPicker width="300px" onChange={(colors) => onChange(colors.hex)} color={value || defaultValue} />}>
                <div className={'color-lump'} style={{ background: value }} />
            </Popover>
        </div>
    );
};

export default SelectColor;
