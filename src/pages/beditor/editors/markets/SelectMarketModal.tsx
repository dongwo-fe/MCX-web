import { Checkbox, Modal, Select } from 'antd';
import React, { useState } from 'react';
import './index.scss';
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

//选择卖场 modal
export default function SelectMarketModal(props: {
    cityList: any[];
    marketList: any[];
    currentCityId: string;
    showSelectModal: boolean;
    handleOk: (checkedList: string[]) => void;
    handleCancel: () => void;
    handleChangeCity: (cityid: string) => void;
    defaultCheckedList: string[];
}) {
    const { cityList, marketList, showSelectModal, handleOk, handleCancel, handleChangeCity, currentCityId, defaultCheckedList } = props;
    const [checkedList, setCheckedList] = useState<any[]>(defaultCheckedList);
    const onChange = (list: any[]) => {
        setCheckedList(list);
    };

    const handleEditCancel = () => {};
    const handleChangeMarkets = () => {};

    return (
        <Modal
            width={500}
            bodyStyle={{
                height: '60vh',
            }}
            title="选择卖场"
            visible={showSelectModal}
            closable={false}
            onOk={() => handleOk(checkedList)}
            onCancel={handleCancel}
            destroyOnClose={true}
            maskClosable={false}
        >
            <div className="margin-top-dis">
                <Select
                    style={{ width: 300 }}
                    defaultValue={currentCityId}
                    showSearch
                    filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
                    onChange={handleChangeCity}
                    placeholder="选择城市"
                >
                    {cityList.map((item, index) => {
                        return (
                            <Option key={index} value={item.cityStationId}>
                                {item.cityName}
                            </Option>
                        );
                    })}
                </Select>
            </div>
            <div className="city-box">
                <CheckboxGroup style={{ display: 'flex', flexDirection: 'column' }} options={marketList} value={checkedList} onChange={onChange} />
            </div>

            {/* <div>
                <Select
                    defaultValue={matket_id || null}
                    style={{ width: 300 }}
                    onChange={handleChangeMarkets}
                    disabled={!city_id}
                    showSearch
                    key={matket_id}
                    filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
                    placeholder="选择卖场"
                >
                    {marketList.map((item, index) => {
                        return (
                            <Option key={index} value={item.marketId}>
                                {item.marketName}
                            </Option>
                        );
                    })}
                </Select>
            </div> */}
        </Modal>
    );
}
