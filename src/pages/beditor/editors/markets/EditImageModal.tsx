import { getImageUrl } from '@/utils/tools';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import Upload from '../banner/upload';
interface iP {
    showEditImageModal: boolean;
    setShowEditImageModal(show: boolean): void;
    updateMarketImg(url: string): void;
    item: any;
    imageSizeSuggestionType?: string;
    title: string;
}

export default function EditImageModal(props: iP) {
    const { showEditImageModal, setShowEditImageModal, updateMarketImg, item, imageSizeSuggestionType, title } = props;
    const [img, setImg] = useState<string>();
    useEffect(() => {
        let img = '';
        if (imageSizeSuggestionType === 'market') {
            img = item.market_image || '';
        } else if (imageSizeSuggestionType === 'shop') {
            img = item.shop_image || '';
        } else if (imageSizeSuggestionType === 'goods') {
            img = item.good_image || '';
        }
        setImg(img);
    }, [item]);

    const handleChange = (value: any) => {
        const url = value.length == 0 ? '' : value[0].url;
        updateMarketImg(url);
        setImg(url);
        // setItem({ ...citem, market_image: url });
    };
    return (
        <Modal
            width={500}
            title={title}
            visible={showEditImageModal}
            closable={true}
            destroyOnClose={true}
            maskClosable={false}
            footer={null}
            onCancel={() => setShowEditImageModal(false)}
            bodyStyle={{ alignItems: 'center' }}
        >
            <Upload value={img ? [{ url: img, uid: 'marketImg', name: '预览图片' }] : []} onChange={handleChange}></Upload>

            {imageSizeSuggestionType === 'market' && (
                <>
                    <div>默认展示卖场主图，如需更换请删除后重新上传</div>
                    <div>图片建议比例1：1</div>
                </>
            )}
            {imageSizeSuggestionType === 'shop' && (
                <>
                    <div>默认展示店铺主图，如需更换请删除后重新上传</div>
                    <div>上传门店图片，建议图片比例1:1</div>
                </>
            )}
            {imageSizeSuggestionType === 'goods' && (
                <>
                    <div>默认展示商品主图，如需更换请删除后重新上传</div>
                    <div>图片建议比例1：1:1</div>
                </>
            )}
        </Modal>
    );
}
/**
 * <div className="item-sp-market">
                <span style={{ color: '#999' }}>卖场照片</span>
                <div>
                    <Radio.Group defaultValue={image_type} buttonStyle="solid">
                        <Radio.Button onChange={(e) => selectType('default')} value="default">
                            默认图片
                        </Radio.Button>
                        <Radio.Button onChange={(e) => selectType('customise')} value="customise">
                            自定义图片
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            {image_type == 'customise' && (
                <div className="item-wrap margin-top-dis">
                    <Upload
                        imageSize={{ type: 2, width: 1500, height: 480, sizeText: '建议大小为1500*480像素' }}
                        onChange={imageUpload}
                        value={market_image == '' ? [] : [{ url: market_image, uid: market_image }]}
                    />
                    <span style={{ color: '#999' }}>上传外立面图片，建议图片大小1500*480像素</span>
                </div>
            )}
 */
