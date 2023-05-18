import { ITopicListItem } from '@/api/topicApi';
import React, { useRef } from 'react';
import { message, Rate } from 'antd';
import './activeLandingItem.less';
import icon_empty from '@/img/empty.png';
import icon_preview from '@/img/preview.png';
import icon_trend from '@/img/trend.png';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { AuthWrapper } from '@/component/AuthWrapper';
import { addFavoriteApi, delFavoriteApi } from '@/api/topicApi';

function ActiveLandingItem({
    item,
    handlePromote,
    download,
    handlePreview,
    handleTrend,
    refreshList,
}: {
    item: ITopicListItem;
    handlePromote: (item: ITopicListItem) => void;
    download: (item: ITopicListItem) => void;
    handlePreview: (item: ITopicListItem) => void;
    handleTrend: (item: ITopicListItem) => void;
    refreshList: () => void;
}) {
    const navigate = useNavigate();
    const favoriteLoading = useRef(false);
    const editClick = () => navigate(`/beditor?id=${item._id}&pageType=${item.pageType}`);
    const copyClick = () => navigate(`/beditor?id=${item._id}&pageType=${item.pageType}&copy=1`);
    // 收藏
    const onCollect = async (e) => {
        e.stopPropagation();
        if (favoriteLoading.current) return;
        try {
            favoriteLoading.current = true;
            if (item.favorite) {
                await delFavoriteApi({ id: item._id });
            } else {
                await addFavoriteApi({ id: item._id });
            }
            await refreshList();
            message.success(item.favorite ? '取消收藏' : '收藏成功');
            favoriteLoading.current = false;
        } catch (err: any) {
            favoriteLoading.current = false;
            message.warning(err.message);
        }
    };
    return (
        <div id="active-landing-item" onClick={editClick}>
            <div className="rate-box" onClick={onCollect}>
                <Rate disabled={true} count={1} value={item.favorite ? 1 : 0} tooltips={[item.favorite ? '取消收藏' : '收藏']} />
            </div>
            <div className={item.state === 0 ? 'item-disable' : ''}>
                {item.cover_img ? (
                    <div className="cover-img-box">
                        <img className="cover-img" src={item.cover_img} alt="" />
                    </div>
                ) : (
                    <div className="cover-img-box">
                        <img className="empty-img" src={icon_empty} alt="" />
                    </div>
                )}
            </div>
            <div className="title">{item.title}</div>
            <div className="hover-top">
                <div className="title-box">
                    <div className="id" onClick={(e) => e.stopPropagation()}>
                        活动ID {item._id}
                    </div>
                    {/* <div className="market">{Array.isArray(item.marketnames) ? item.marketnames.join('，') : ''}</div> */}
                </div>

                <div className="btns-row">
                    <div
                        className="btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTrend(item);
                        }}
                    >
                        <img src={icon_trend} alt="" />
                        统计
                    </div>
                    <div
                        className="btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(item);
                        }}
                    >
                        <img src={icon_preview} alt="" />
                        预览
                    </div>
                </div>
            </div>
            <div className="hover-bottom">
                <div className="title2">{item.title}</div>
                <div className="edit-name-row">
                    <span>{item.update_name}</span>
                    <span>{dayjs(item.updated).format('YYYY.MM.DD')}</span>
                </div>
                <div className="action-row">
                    <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_AD_PUT">
                        <div
                            className="btn2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePromote(item);
                            }}
                        >
                            投放
                        </div>
                    </AuthWrapper>

                    <div className="line" />
                    <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_COPY">
                        <div
                            className="btn2"
                            onClick={(e) => {
                                e.stopPropagation();
                                copyClick();
                            }}
                        >
                            复制
                        </div>
                    </AuthWrapper>
                    {item.exportFlag && <div className="line" />}
                    {item.exportFlag && (
                        <AuthWrapper btnCode="NEW_ACTIVITY_LANDING_PAGE_EXPORT">
                            <div
                                className="btn2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    download(item);
                                }}
                            >
                                导出
                            </div>
                        </AuthWrapper>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActiveLandingItem;
