import React, { useMemo } from 'react';
import { iEditorForms } from '@/store/config';
import { Button } from 'antd';
import './render.scss';

interface iProps {
    index: number;
    data: iEditorForms;
}

const FormComponent = ({ data }: iProps) => {
    const memoData = useMemo(() => {
        let isHavePhone = false;
        const { formInputPlaceholderTextColor = '#ccc', buttonBackgroundColor, formInputTextColor } = data;
        const list = data.formList.map((item, index) => {
            if (item.type === 'phone' && item.codeVerify) isHavePhone = true;
            if (item.type === 'gender') {
                return (
                    <div key={index} className={'form-item-sex'}>
                        {item.options?.map((v, i) => (
                            <div
                                style={{ backgroundColor: i === 0 ? `${buttonBackgroundColor}7f` : '', color: i === 0 ? buttonBackgroundColor : formInputTextColor }}
                                className={`sex-item ${i === 0 ? 'sex-item_active' : ''}`}
                                key={i}
                            >
                                {v.label}
                            </div>
                        ))}
                    </div>
                );
            }
            return (
                <>
                    <div className={`form-item ${item.required ? 'required' : ''}`} key={item.id}>
                        <div style={{ color: formInputPlaceholderTextColor }}>{item.placeholder}</div>
                        {item.formType === 'select' && (
                            <i className={'right-fix'}>
                                <img src="/image/icon_tril.png" alt="" />
                            </i>
                        )}
                    </div>
                    {item.codeVerify ? (
                        <div className={`form-item ${item.required ? 'required' : ''}`} key={item.id + 'codeVerify'}>
                            <div style={{ color: formInputPlaceholderTextColor }}>{item.codePlaceholder}</div>
                            <i className={'right-fix'}>
                                <span style={{ color: buttonBackgroundColor || '#3579db' }}>获取验证码</span>
                            </i>
                        </div>
                    ) : null}
                </>
            );
        });

        return {
            list,
            isHavePhone,
        };
    }, [data]);

    return (
        <div className={'form-center'}>
            <div style={{ background: data.formBackgroundColor }}>
                <div className="preview-form">
                    {memoData.list}
                    {memoData.isHavePhone && (
                        <div style={{ color: data.formInputPlaceholderTextColor }} className={'confirm-agreement'}>
                            <i />
                            我已阅读并同意<span style={{ color: data.buttonBackgroundColor }}>《用户条款》</span>和
                            <span style={{ color: data.buttonBackgroundColor }}>《隐私协议》</span>
                        </div>
                    )}
                </div>
                <div className="submit">
                    <Button
                        style={{
                            background: data.buttonBackgroundColor,
                            color: data.buttonTextColor,
                        }}
                    >
                        {data.buttonTextValue}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FormComponent;
