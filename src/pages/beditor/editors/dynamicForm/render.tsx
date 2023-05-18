import React, { useMemo } from 'react';
import { iDynamicFormEditor } from '@/store/config';
import { Button } from 'antd';
import styles from './index.module.scss';

interface iProps {
    index: number;
    data: iDynamicFormEditor;
}

const DynamicFormComponent = ({ data }: iProps) => {
    const { cardTheme } = data;
    const memoData = useMemo(() => {
        const list = data.formList.map((item, index) => {
            return (
                <div className={`${styles.form_item} ${item.required ? styles.required : ''}`} key={item.id}>
                    <div>{item.placeholder}</div>
                    {['gender', 'cityId', 'customSelect', 'birthDay'].includes(item.type) && (
                        <img src='https://ossprod.jrdaimao.com/file/1678176809892901.png' className={styles.arrow} />
                    )}
                </div>
            );
        });

        return {
            list
        };
    }, [data]);

    return (
        <div  className={`${styles.form_center} ${styles[cardTheme]}`}>
            <div>
                <div className={styles.preview_form}>
                    {memoData.list}
                </div>
                <div className={styles.submit}>
                    <Button className={styles.button} style={{ background: data.buttonColor }}>
                        {data.buttonTextValue}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormComponent;