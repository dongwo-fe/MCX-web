import { iDynamicFormEditor } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { Radio, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getFullLinkMarketList } from '@/api/markets';

interface RegistorInfoProps {
    id: string;
    showDoorverse?: boolean
    showMarket?: boolean
}
/**
 * 动态表单编辑
 */
const RegistorInfo = ({ id, showDoorverse = true, showMarket = true }: RegistorInfoProps) => {
    const [data, handleChangeItemValue] = useChangeEditorItemValue<iDynamicFormEditor>({ id });
    const showSyncFullLink = showDoorverse ? data.registerDoorverse : true;
    const [marketList, setMarketList] = useState([]);

    // 查询卖场
    const queryFullLinkMarketList = async () => {
        try {
            const citys = await getFullLinkMarketList();
            if (citys && citys.length) {
                const list = citys.map(city => {
                    const children = (city.marketVOS).map(market => {
                        return {
                            label: market.marketName,
                            value: market.marketId
                        }
                    });

                    return {
                        label: city.cityName,
                        value: city.cityStationId,
                        selectable: false,
                        children
                    };
                })
                setMarketList(list);
            }
        } catch {}
    };

    const handlerChangeMarket = (market) => {
        if (market) {
            handleChangeItemValue('syncFullLinkMarket', {
                marketId: market.value,
                marketName: market.label,
            });
        } else {
            handleChangeItemValue('syncFullLinkMarket', null);
        }
    };

    useEffect(() => {
        queryFullLinkMarketList();
    }, []);
    
    return (
        <div>
            <div className={styles.card_title}>注册信息</div>
            {showDoorverse && <div className={styles.form_row}>
                <div className={styles.title_label}>注册洞窝：</div>
                <div className={styles.item_wrap}>
                    <Radio.Group
                        value={data.registerDoorverse}
                        defaultValue={false}
                        onChange={(e) => {
                            handleChangeItemValue('registerDoorverse', e.target.value);
                            handleChangeItemValue('syncFullLink', null);
                            handleChangeItemValue('syncFullLinkMarket', null);
                        }}
                    >
                        <Radio value={false}>无需注册</Radio>
                        <Radio value={true}>注册</Radio>
                    </Radio.Group>
                </div>
            </div>}
            {showSyncFullLink && <div className={styles.form_row}>
                <div className={styles.title_label}>同步全链路：</div>
                <div className={styles.item_wrap}>
                    <Radio.Group
                        value={data.syncFullLink}
                        defaultValue={false}
                        onChange={(e) => {
                            handleChangeItemValue('syncFullLink', e.target.value);
                            handleChangeItemValue('syncFullLinkMarket', null);
                        }}
                    >
                        <Radio value={false}>否</Radio>
                        <Radio value={true}>是</Radio>
                    </Radio.Group>
                </div>
            </div>}
            {data.syncFullLink && showMarket && <div className={styles.form_row}>
                <div className={styles.title_label}>选择卖场：</div>
                <div className={styles.item_wrap}>
                    <TreeSelect
                        treeExpandAction="click"
                        defaultValue={data.syncFullLinkMarket?.marketId}
                        allowClear
                        labelInValue
                        onChange={handlerChangeMarket}
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        showSearch
                        filterTreeNode={(value, node) => !!node.label?.toString()?.includes(value?.trim())}
                        treeData={marketList}
                    />
                </div>
            </div>}
            {/* <div className={styles.form_row}>
                <div className={styles.title_label}>注册居然会：</div>
                <div className={styles.item_wrap}>
                    <Radio.Group
                        value={data.registerJrVip}
                        onChange={(e) => {
                            handleChangeItemValue('registerJrVip', e.target.value);
                        }}
                    >
                        <Radio value={false}>无需注册</Radio>
                        <Radio value={true}>注册</Radio>
                    </Radio.Group>
                </div>
            </div> */}
        </div>
    );
};

export default RegistorInfo;
