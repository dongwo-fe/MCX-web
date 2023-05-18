import { iEditorBlock, iEditorImagePuzzle } from '@/store/config';
import React from 'react';
import './index.scss';

const Render_Image_Puzzle = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorImagePuzzle;
    const { padding, image_padding, sub_entry, show_method } = data;

    // 空数据状态
    const empty = (
        <div className="empty-box">
            <img className="empty-image" src="/image/pazzle_empty_bg.png" />
            <span className="empty-title">点击编辑魔方</span>
        </div>
    );

    // 一张图片的展示
    const oneImage = (
        <div>
            <img className="one-image-contain" style={{ paddingLeft: padding, paddingRight: padding }} src={sub_entry[0].url} />
        </div>
    );

    // 两张-三张-四张
    const twoImage = () => {
        const styleList = ['two-images-contain', 'three-image-contain', 'four-image-contain', 'two-images-contain'];
        const dealStyle = (index: number) => {
            switch (show_method) {
                case 1:
                    return {
                        width: (375 - image_padding - padding * 2) / 2,
                    };
                case 2:
                    return {
                        width: (375 - image_padding - padding * 2) / 3,
                    };
                case 3:
                    return {
                        width: (375 - padding * 2 - image_padding) / 4,
                    };
                case 4:
                    return {
                        width: (375 - padding * 2 - image_padding) / 2,
                        marginBottom: index == 0 || index == 1 ? image_padding : 0,
                    };
                default:
                    break;
            }
        };
        return (
            sub_entry &&
            sub_entry.map((item: any, index: number) => {
                return item.url == '' ? <div key={index}></div> : <img key={index} className={styleList[show_method - 1]} src={item.url} style={dealStyle(index)} />;
            })
        );
    };
    const sixImage = () => {
        const firstImage = sub_entry[0].url;
        const lateImage = sub_entry.slice(1, 3);
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {firstImage != '' ? (
                    <img
                        src={firstImage}
                        style={{
                            width: (375 - padding * 2 - image_padding) / 2,
                            marginRight: image_padding,
                        }}
                    />
                ) : (
                    <div></div>
                )}
                <div className="dis-col">
                    {lateImage.map((item: any, index: number) => {
                        return item.url == '' ? (
                            <div key={index}></div>
                        ) : (
                            <img
                                key={index}
                                src={item.url}
                                style={{
                                    width: (375 - padding * 2 - image_padding * 2) / 2,
                                    marginBottom: index == 0 ? image_padding : 0,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };
    const senveImage = () => {
        const firstImage = sub_entry[0].url;
        const lateImage = sub_entry.slice(1, 3);
        return (
            <div className="dis-col" style={{ width: '100%' }}>
                {firstImage != '' ? (
                    <img
                        src={firstImage}
                        style={{
                            width: 375 - padding * 2,
                            marginBottom: image_padding,
                        }}
                    />
                ) : (
                    <div></div>
                )}
                <div className="dis-row">
                    {lateImage.map((item: any, index: number) => {
                        return item.url == '' ? (
                            <div key={index}></div>
                        ) : (
                            <img
                                key={index}
                                src={item.url}
                                style={{
                                    width: (375 - padding * 2 - image_padding) / 2,
                                    marginRight: index == 0 ? image_padding : 0,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };
    const eightImage = () => {
        const firstImage = sub_entry[0].url;
        const secondImage = sub_entry.length > 1 ? sub_entry[1].url : '';
        const lateImage = sub_entry.slice(2, 4);
        return (
            <div className="dis-row" style={{ width: '100%' }}>
                {firstImage != '' ? (
                    <img
                        src={firstImage}
                        style={{
                            width: (375 - padding * 2 - image_padding) / 2,
                            marginRight: image_padding,
                        }}
                    />
                ) : (
                    <div></div>
                )}
                <div className="dis-col">
                    {secondImage != '' ? (
                        <img
                            src={secondImage}
                            style={{
                                width: (375 - padding * 2 - image_padding) / 2,
                                marginBottom: image_padding,
                            }}
                        />
                    ) : (
                        <div></div>
                    )}
                    <div className="dis-row">
                        {lateImage.map((item: any, index: number) => {
                            return item.url == '' ? (
                                <div key={index}></div>
                            ) : (
                                <img
                                    key={index}
                                    src={item.url}
                                    style={{
                                        width: (375 - padding * 4 - image_padding * 2) / 4,
                                        marginRight: index == 0 ? image_padding : 0,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // 渲染展示
    const showRender = () => {
        if (show_method == 0) {
            return oneImage;
        }
        if (show_method == 1 || show_method == 2 || show_method == 3 || show_method == 4) {
            return twoImage();
        }
        if (show_method == 5) {
            return sixImage();
        }
        if (show_method == 6) {
            return senveImage();
        }
        if (show_method == 7) {
            return eightImage();
        }
    };

    return (
        <div className="pazzle-render-box">
            {sub_entry.isEmpty('url') ? (
                <div>{empty}</div>
            ) : (
                <div className="show-image-box" style={{ flexWrap: show_method == 4 ? 'wrap' : 'nowrap', paddingLeft: padding, paddingRight: padding }}>
                    {showRender()}
                </div>
            )}
        </div>
    );
};

export default React.memo(Render_Image_Puzzle);
