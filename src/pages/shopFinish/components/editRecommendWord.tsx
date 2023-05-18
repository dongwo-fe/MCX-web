import { Table, Tooltip, Input, Space, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { GoodsItem } from "./types"

type EditRecommendWordProps = {
    selectedGoods: GoodsItem[],
    setSysRecommendWord: (id) => void,
    recommendWordChange: (id, val) => void,
}

const EditRecommendWord = (props: EditRecommendWordProps) => {
    const columns: ColumnsType<GoodsItem> = [
        {
            title: '商品信息',
            dataIndex: 'goods',
            key: 'goods',
            width: 190,
            render: (_, r: GoodsItem) => (
                <div className='goodsInfo'>
                    {r.goodsPic ? <img src={r.goodsPic} alt=""></img> : ''}
                    <div style={{ marginLeft: r.goodsSkuTitle ? '8px' : '0px' }}>
                        <div
                            className='goodsTitle'
                        >
                            <Tooltip placement="topLeft" title={r.goodsSkuTitle}>
                                <span>{r.goodsSkuTitle}</span>
                            </Tooltip>
                        </div>
                        <div
                            className='standardName'
                        >
                            <Tooltip placement="topLeft" title={r.standardName}>
                                <span>{r.standardName}</span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: <p>推荐语<span className='recommendWordTip'> 可自己编辑或使用系统推荐, 最多12个字</span></p>,
            dataIndex: 'recommend',
            key: 'recommend',
            render: (_, r: GoodsItem) => {
                return <Space>
                    <Input
                        value={r.recommend}
                        placeholder='请输入商品推荐语' maxLength={12}
                        onChange={(e) => props.recommendWordChange(r.goodsSkuId, e.target.value)} />
                    <Button type="link" onClick={() => props.setSysRecommendWord(r.goodsSkuId)}>
                        换个推荐语
                    </Button>
                </Space>

            }
        },
    ]
    return (
        <Space>
            <Table className='recommendWordStep2' key={"goodsId"} dataSource={props.selectedGoods} columns={columns} />
            <img src="https://ossprod.jrdaimao.com/file/168058827208132.png" alt="" style={{ width: '300px', marginTop: '20px' }} />
        </Space>

    )
}

export default React.memo(EditRecommendWord);