import { iEditorBlock, iEditorVideo } from '@/store/config';
import React from 'react';
import './index.scss';

const Render_Video = (props: { data: iEditorBlock; index: number }) => {
    const data = props.data as iEditorVideo;
    const { page_padding, auto_play, cover_type, video_address, video_url, cover_url, input_video } = data;

    const emptyRender = <img className="video-empty-box" src="/image/video_empty_bg.png" />;

    const videoRender = () => {
        return (
            <video
                key={cover_url + video_url + input_video + auto_play}
                className="video-contain"
                autoPlay={auto_play}
                controls
                muted={true}
                poster={cover_url != '' ? cover_url : undefined}
                src={video_address == 'upload' ? video_url : input_video}
                preload="metadata"
            ></video>
        );
    };

    const isEmpty = () => {
        if (video_url == '' && cover_url == '' && input_video == '') return true;
        return false;
    };

    return (
        <div className="render-video-box" style={{ padding: page_padding }}>
            {isEmpty() ? emptyRender : videoRender()}
        </div>
    );
};

export default React.memo(Render_Video);
