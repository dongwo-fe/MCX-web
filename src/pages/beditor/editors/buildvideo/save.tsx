import { iEditorVideo } from '@/store/config';
import { message } from 'antd';

// 保存校验
function saveVideo(data: iEditorVideo) {
    const { video_url, input_video, video_address, cover_type, cover_url } = data;
    if (video_address == 'upload') {
        if (video_url == '') {
            message.error('请上传视频');
            return false;
        }
    } else {
        if (input_video == '') {
            message.error('请填写视频链接并确定');
            return false;
        }
    }
    if (video_address === 'link' && !cover_url) {
        message.error('请上传视频封面');
        return false;
    }
    return true;
}
export default saveVideo;
