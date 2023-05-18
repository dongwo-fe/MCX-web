import { iEditorBlock, iEditorElevatorNavigation } from '@/store/config';
import { numberToText } from '@/utils/tools';
import React from 'react';
import './index.scss';

const Render_Elevator = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorElevatorNavigation;
    const {
        modalType, // 1: 文字， 2:图片
        bg_color,
        bg_select_color,
        text_select_color,
        text_default_color,
        label_select_type,
        label_list,
    } = data;
    // 是否是文字型
    const isTextType = modalType == 1;

    const height = isTextType ? 46 : 102;

    // 通用样式
    // const common = 'text-item-box';
    // 背景模式的选中UI
    const bgTypeActive = 'text-item-box';
    // 圆框模式选中UI
    const roundTypeActive = 'text-item-box active-round-modal';
    // 方框模式选中UI
    const squareTypeActive = 'text-item-box active-square-modal';
    // 下划线模式选中UI
    const underLineTypeActive = 'text-item-box active-under-modal';

    // 标签选中类型判断
    const laberSelectType = () => {
        if (isTextType) {
            switch (label_select_type) {
                case 'bg':
                    return bgTypeActive;
                case 'round':
                    return roundTypeActive;
                case 'square':
                    return squareTypeActive;
                case 'under':
                    return underLineTypeActive;
            }
        } else {
            return bgTypeActive;
        }
    };

    const itemWidth = () => {
        if (label_list.length == 1) {
            return '100%';
        }
        if (label_list.length == 2) {
            return '50%';
        }
        if (label_list.length == 3) {
            return '33.3%';
        }
        if (label_list.length >= 4) {
            return '25%';
        }
    };

    const activeBgStyle = () => {
        if (label_select_type == 'under') {
            return bg_color;
        } else {
            return bg_select_color;
        }
    };

    const activeStyle = (index: number) => {
        const style = {
            color: index == 0 ? text_select_color : text_default_color,
            backgroundColor: index == 0 ? activeBgStyle() : bg_color,
            width: itemWidth(),
            padding: '0 5px',
        };
        return style;
    };

    // 渲染
    const imageLbaer = (item: any) => {
        return <img className="image-item-render" src={item.image_url || '/image/image_nav_empty.png'} />;
    };

    return (
        <div className="render-elevator-box" style={{ height: height, backgroundColor: bg_color }}>
            {label_list.map((item, index) => {
                return (
                    <div key={index} className={index == 0 ? laberSelectType() : bgTypeActive} style={activeStyle(index)}>
                        {isTextType ? (
                            label_select_type == 'under' ? (
                                <div className="under-render-box">
                                    <span style={{ whiteSpace: 'nowrap' }}>{item.text_input || `标签${numberToText(index + 1)}`}</span>
                                    <div className="under-line-box" style={{ backgroundColor: index == 0 ? bg_select_color : 'transparent' }}></div>
                                </div>
                            ) : (
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textAlign: 'center' }}>{item.text_input || `标签${numberToText(index + 1)}`}</span>
                            )
                        ) : (
                            imageLbaer(item)
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(Render_Elevator);
