import { iEditorImagePuzzle } from '@/store/config';
import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import './index.scss';
import { Col, InputNumber, Row, Slider, Tooltip } from 'antd';
import React, { useState } from 'react';
import Upload from '../banner/upload';
import EditorModal from '../banner/editorModal';
import { imageData, sizeData, typeName } from './config';

/**
 * 魔方图编辑
 */
const ImagePuzzleEditor = ({ data: { id } }: { data: iEditorImagePuzzle }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorImagePuzzle>({ id });
    const { show_method, sub_entry, image_padding, padding } = data;

    // 初始化的本地数据
    const initImagedata = () => {
        imageData.splice(show_method, 1, sub_entry);
        return imageData;
    };
    // 模版类型
    const [typeIndex, setTypeIndex] = useState(show_method);

    // 缓存的本地数据
    const [imageLocalData, setImageLocalData] = useState(initImagedata());

    // 每个模版--对应的--每个图片的下标
    const [childIndex0, setChildIndex0] = useState(0);
    const [childIndex1, setChildIndex1] = useState(0);
    const [childIndex2, setChildIndex2] = useState(0);
    const [childIndex3, setChildIndex3] = useState(0);
    const [childIndex4, setChildIndex4] = useState(0);
    const [childIndex5, setChildIndex5] = useState(0);
    const [childIndex6, setChildIndex6] = useState(0);
    const [childIndex7, setChildIndex7] = useState(0);

    // 链接弹窗的展示
    const [modalVisible, setModalVisible] = useState(false);

    // 通用样式
    const useName = 'common-box common-sa';

    // 模版切换
    const selectNow = (index: number) => {
        setTypeIndex(index);
        handleChangeValue('sub_entry', imageLocalData[index]);
        handleChangeValue('show_method', index);
    };

    // 上传图片 + 删除图片
    const uploadImage = (value: Array<any>) => {
        const url_image = value.length > 0 ? value[0].url : ''; // 下载的图片链接
        const url_image_height = value.length > 0 ? value[0].height : 0;
        saveSubEntry('url', url_image, 'image_height', url_image_height);
    };

    // 保存弹窗链接
    const onSave = (item: any) => {
        setModalVisible(false);
        saveSubEntry('link_data', item);
    };

    // 数据的组装整合
    const linkList = [childIndex0, childIndex1, childIndex2, childIndex3, childIndex4, childIndex5, childIndex6, childIndex7];
    const saveSubEntry = (name: any, item: any, name2?: any, value?: any) => {
        const currentchildIndex = linkList[typeIndex]; // 当前选择的关联index
        const copy = [...imageLocalData];
        const copyCurrent = [...copy[typeIndex]];
        copyCurrent[currentchildIndex] = Object.assign({}, copyCurrent[currentchildIndex], { [name]: item, [name2]: value });
        copy.splice(typeIndex, 1, copyCurrent);
        setImageLocalData(copy);
        handleChangeValue('sub_entry', copy[typeIndex]);
    };

    // 图片间隙调整
    const onChangeSilderImage = (value: number) => {
        handleChangeValue('image_padding', value);
    };

    // 页面边距的调整
    const onChangeSilderPadding = (value: number | null) => {
        handleChangeValue('padding', value || 0);
    };

    // 处理上传的图片展示
    const upLoadSelect = () => {
        if (imageLocalData[typeIndex][linkList[typeIndex]].url == '') {
            return [];
        } else {
            return [imageLocalData[typeIndex][linkList[typeIndex]]];
        }
    };

    // 添加链接跳转
    const addPushUrl = () => {
        setModalVisible(true);
    };

    // 取消链接弹窗
    const onCancel = () => {
        setModalVisible(false);
    };

    // 链接弹窗反选的数据
    const reMoadlData = () => {
        const modalData = imageLocalData[typeIndex][linkList[typeIndex]];
        return modalData.link_data;
    };

    // 记录每个模版子元素的下标
    const childSelect = (index: number, type: string) => {
        switch (type) {
            case 'one':
                setChildIndex1(index);
                break;
            case 'two':
                setChildIndex2(index);
                break;
            case 'three':
                setChildIndex3(index);
                break;
            case 'four':
                setChildIndex4(index);
                break;
            case 'five':
                setChildIndex5(index);
                break;
            case 'six':
                setChildIndex6(index);
                break;
            case 'senve':
                setChildIndex7(index);
                break;
            default:
                break;
        }
    };

    // 处理链接的展示
    const showLink = () => {
        const modalData = imageLocalData[typeIndex][linkList[typeIndex]];
        const linkUrl = modalData.link_data.link_url;
        if (linkUrl != '') return linkUrl;
        return '添加跳转到的页面(选填)+';
    };
    // 处理比例
    const imageSize = () => {
        if (sizeData[show_method][linkList[show_method]]) {
            return sizeData[show_method][linkList[show_method]];
        }
        return '';
    };

    // 一行一个
    const type0 = () => {
        const isSelect = typeIndex === 0;
        return (
            <div onClick={(e) => selectNow(0)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                <div className={isSelect ? 'one-bg common-bg select-box' : 'one-bg common-bg'} />
            </div>
        );
    };

    // 一行两个
    const type1 = () => {
        const list = [1, 2];
        const isSelect = typeIndex === 1;
        return (
            <div onClick={(e) => selectNow(1)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                {list.map((item) => {
                    return <div key={item} className={isSelect ? 'two-bg common-bg select-box' : 'two-bg common-bg'} />;
                })}
            </div>
        );
    };

    // 一行三个
    const type2 = () => {
        const list = [1, 2, 3];
        const isSelect = typeIndex === 2;
        return (
            <div onClick={(e) => selectNow(2)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                {list.map((item) => {
                    return <div key={item} className={isSelect ? 'three-bg common-bg select-box' : 'three-bg common-bg'} />;
                })}
            </div>
        );
    };

    // 一行四个
    const type3 = () => {
        const list = [1, 2, 3, 4];
        const isSelect = typeIndex === 3;
        return (
            <div onClick={(e) => selectNow(3)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                {list.map((item) => {
                    return <div key={item} className={isSelect ? 'four-bg common-bg select-box' : 'four-bg common-bg'}></div>;
                })}
            </div>
        );
    };

    // 二左二右
    const type4 = () => {
        const list = [1, 2, 3, 4];
        const isSelect = typeIndex === 4;
        return (
            <div onClick={(e) => selectNow(4)} className={isSelect ? 'common-box  common-sa common-warp select-bg' : 'common-box  common-sa common-warp'}>
                {list.map((item) => {
                    return <div key={item} className={isSelect ? 'five-bg common-bg select-box' : 'five-bg common-bg'}></div>;
                })}
            </div>
        );
    };

    // 一左二右
    const type5 = () => {
        const list = [1, 2];
        const isSelect = typeIndex === 5;
        return (
            <div onClick={(e) => selectNow(5)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                <div className={isSelect ? 'two-bg common-bg select-box' : 'two-bg common-bg '}></div>
                <div className="common-col">
                    {list.map((item) => {
                        return <div key={item} className={isSelect ? 'six-bg common-bg select-box' : 'six-bg common-bg'}></div>;
                    })}
                </div>
            </div>
        );
    };

    // 一上二下
    const type6 = () => {
        const list = [1, 2];
        const isSelect = typeIndex === 6;
        return (
            <div onClick={(e) => selectNow(6)} className={isSelect ? 'common-box select-bg' : 'common-box'}>
                <div className={isSelect ? 'senve-bg common-bg select-box' : 'senve-bg common-bg'}></div>
                <div className="common-row">
                    {list.map((item) => {
                        return <div key={item} className={isSelect ? 'diff-six-bg common-bg select-box' : 'diff-six-bg common-bg'}></div>;
                    })}
                </div>
            </div>
        );
    };

    // 一左三右
    const type7 = () => {
        const list = [1, 2];
        const isSelect = typeIndex === 7;
        return (
            <div onClick={(e) => selectNow(7)} className={isSelect ? 'select-bg common-box common-sa' : useName}>
                <div className={isSelect ? 'two-bg common-bg select-box' : 'two-bg common-bg'}></div>
                <div className="common-col common-sa">
                    <div style={{ marginLeft: 1 }} className={isSelect ? 'six-bg common-bg select-box' : 'six-bg common-bg'}></div>
                    <Row>
                        {list.map((item) => {
                            return <div key={item} className={isSelect ? 'eight-bg common-bg select-box' : 'eight-bg common-bg'}></div>;
                        })}
                    </Row>
                </div>
            </div>
        );
    };

    const listTest = [type0, type1, type2, type3, type4, type5, type6, type7];
    const linkType0 = () => {
        const current_image = imageLocalData[typeIndex][childIndex0].url;
        return <div className="one-image-box common-center">{current_image != '' ? <img className="one-image-show" src={current_image} /> : <span>宽750像素</span>}</div>;
    };
    const linkType1 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <div>
                <Row>
                    {current_image.map((item: any, index: number) => {
                        return (
                            <div onClick={(e) => childSelect(index, 'one')} key={index} className={index === childIndex1 ? ' link-bg select-link-bg' : 'link-bg'}>
                                {item.url != '' ? <img className="two-image-show" src={item.url} /> : <span>宽375像素</span>}
                            </div>
                        );
                    })}
                </Row>
            </div>
        );
    };
    const linkType2 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Row>
                {current_image.map((item, index) => {
                    return (
                        <div onClick={(e) => childSelect(index, 'two')} key={index} className={index === childIndex2 ? 'link-three-bg select-link-bg' : 'link-three-bg'}>
                            {item.url != '' ? <img className="three-image-show" src={item.url} /> : <span>宽250像素</span>}
                        </div>
                    );
                })}
            </Row>
        );
    };
    const linkType3 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Row>
                {current_image.map((item, index) => {
                    return (
                        <div onClick={(e) => childSelect(index, 'three')} key={index} className={index === childIndex3 ? 'link-four-bg select-link-bg' : 'link-four-bg'}>
                            {item.url != '' ? <img className="four-image-show" src={item.url} /> : <span>宽188像素</span>}
                        </div>
                    );
                })}
            </Row>
        );
    };
    const linkType4 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Row>
                {current_image.map((item, index) => {
                    return (
                        <div onClick={(e) => childSelect(index, 'four')} key={index} className={index === childIndex4 ? 'link-bg select-link-bg' : 'link-bg'}>
                            {item.url != '' ? (
                                <img className="five-image-show" src={item.url} />
                            ) : (
                                <span className="title-font">
                                    375X375像素
                                    <br />
                                    或同等比例
                                </span>
                            )}
                        </div>
                    );
                })}
            </Row>
        );
    };
    const linkType5 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Row>
                <div onClick={(e) => childSelect(0, 'five')} className={childIndex5 === 0 ? 'linke-five-bg select-link-bg' : 'linke-five-bg'}>
                    {current_image[0].url != '' ? (
                        <img className="six-image-show" src={imageLocalData[typeIndex][0].url} />
                    ) : (
                        <span className="title-font">
                            375X750像素
                            <br />
                            或同等比例
                        </span>
                    )}
                </div>
                <Col>
                    {current_image.map((item: any, index: number) => {
                        return (
                            index > 0 && (
                                <div onClick={(e) => childSelect(index, 'five')} key={index} className={index === childIndex5 ? 'link-bg select-link-bg' : 'link-bg'}>
                                    {item.url != '' ? (
                                        <img className="five-image-show" src={item.url} />
                                    ) : (
                                        <span>
                                            375X375像素
                                            <br />
                                            或同等比例
                                        </span>
                                    )}
                                </div>
                            )
                        );
                    })}
                </Col>
            </Row>
        );
    };
    const linkType6 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Col>
                <div onClick={(e) => childSelect(0, 'six')} className={childIndex6 === 0 ? 'linke-six-bg select-link-bg' : 'linke-six-bg'}>
                    {current_image[0].url != '' ? (
                        <img className="senve-image-show" src={current_image[0].url} />
                    ) : (
                        <span className="title-font">
                            750X375像素
                            <br />
                            或同等比例
                        </span>
                    )}
                </div>
                <Row>
                    {current_image.map((item: any, index: number) => {
                        return (
                            index > 0 && (
                                <div onClick={(e) => childSelect(index, 'six')} key={index} className={index === childIndex6 ? 'link-bg select-link-bg' : 'link-bg'}>
                                    {item.url != '' ? (
                                        <img className="five-image-show" src={item.url} />
                                    ) : (
                                        <span>
                                            375X375像素
                                            <br />
                                            或同等比例
                                        </span>
                                    )}
                                </div>
                            )
                        );
                    })}
                </Row>
            </Col>
        );
    };
    const linkType7 = () => {
        const current_image = imageLocalData[typeIndex] || [];
        return (
            <Row>
                <div onClick={(e) => childSelect(0, 'senve')} className={childIndex7 === 0 ? 'linke-five-bg select-link-bg' : 'linke-five-bg'}>
                    {current_image[0].url != '' ? (
                        <img className="six-image-show" src={current_image[0].url} />
                    ) : (
                        <span className="title-font">
                            375X750像素
                            <br />
                            或同等比例
                        </span>
                    )}
                </div>
                <Col>
                    <div onClick={(e) => childSelect(1, 'senve')} className={1 === childIndex7 ? ' link-bg select-link-bg' : 'link-bg'}>
                        {current_image[1].url != '' ? (
                            <img className="two-image-show" src={current_image[1].url} />
                        ) : (
                            <span>
                                375X375像素
                                <br />
                                或同等比例
                            </span>
                        )}
                    </div>
                    <Row>
                        {current_image.map((item, index) => {
                            return (
                                index > 1 && (
                                    <div
                                        onClick={(e) => childSelect(index, 'senve')}
                                        key={index}
                                        className={index === childIndex7 ? 'link-senve-bg select-link-bg' : 'link-senve-bg'}
                                    >
                                        {item.url != '' ? (
                                            <img className="eight-image-show" src={item.url} />
                                        ) : (
                                            <span>
                                                188X375像素
                                                <br />
                                                或同等比例
                                            </span>
                                        )}
                                    </div>
                                )
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        );
    };

    // 编辑通用样式
    const editStyle = (change: (e: any) => void, value: number, name: string) => {
        return (
            <div className="item-wrap item-center-spw">
                <span>{name}</span>
                <Slider style={{ width: 140 }} min={0} max={30} onChange={(e) => change(e)} value={value} />
                <InputNumber size="middle" min={0} max={30} step={1} value={value} onChange={(e) => change(e)} />
            </div>
        );
    };

    return (
        <>
            <div className="editor-module-wrap">
                <div className="item-wrap">
                    <span>选择模版</span>
                    <span style={{ marginLeft: 20, fontWeight: 600 }}>{typeName[typeIndex]}</span>
                </div>
                <div className="item-wrap">
                    <Row>
                        {listTest.map((item, index) => {
                            return <div key={index}>{item()}</div>;
                        })}
                    </Row>
                </div>
                <div className="item-wrap">
                    {typeIndex == 0 && linkType0()}
                    {typeIndex == 1 && linkType1()}
                    {typeIndex == 2 && linkType2()}
                    {typeIndex == 3 && linkType3()}
                    {typeIndex == 4 && linkType4()}
                    {typeIndex == 5 && linkType5()}
                    {typeIndex == 6 && linkType6()}
                    {typeIndex == 7 && linkType7()}
                </div>
                <div className="item-wrap">
                    <div className="image-upload">
                        <div style={{ marginTop: 6 }}>
                            <Upload imageSize={imageSize()} onChange={uploadImage} value={upLoadSelect()} />
                        </div>
                        <div onClick={addPushUrl} className="show-input-text">
                            {showLink()}
                        </div>
                        <Tooltip
                            placement="top"
                            overlayClassName="tooltipWidth"
                            title={() => {
                                return (
                                    <>
                                        <span className="dataList-reamrk">
                                            <span> 1. H5 链接，输入完整HTTPS开头的链接地址。</span>
                                            <br />
                                            <span> 2. 商品详情页：输入 “daimao://goodsId=123” 中的123 表示跳转的商品ID </span>
                                            <br />
                                            <span> 3. 店铺详情页：输入“daimao://shopId=123” 中的123 表示跳转的店铺ID</span>
                                            <br />
                                            <span> 4. 卖场详情页：输入“daimao://marketId=123 ”中的123 表示跳转的卖场ID</span>
                                            <br />
                                            <span> 5. 同城卖场列表页：输入“daimao://marketList”</span>
                                            <br />
                                            <span> 6. 搜索关键字：输入“daimao://keyWords=123”，中的123 表示跳转的搜索关键字</span>
                                            <br />
                                            <span> 7. 类目列表：输入“daimao://categoryId=123”，中的123表示跳转的二级类目ID</span>
                                            <br />
                                        </span>
                                    </>
                                );
                            }}
                        >
                            <div className="show-detail-input">?</div>
                        </Tooltip>
                    </div>
                </div>
                {editStyle(onChangeSilderImage, image_padding, '图片间隙')}
                {editStyle(onChangeSilderPadding, padding, '页面边距')}
            </div>
            <EditorModal key={modalVisible} item={reMoadlData()} onCancel={onCancel} onSave={onSave} visible={modalVisible} />
        </>
    );
};

export default ImagePuzzleEditor;
