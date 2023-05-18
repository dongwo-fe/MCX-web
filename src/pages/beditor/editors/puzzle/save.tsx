import { iEditorImagePuzzle } from '@/store/config';
import { message } from 'antd';

// 保存校验
function savePizzle(data: iEditorImagePuzzle) {
    const { sub_entry } = data;
    if (sub_entry.isEmpty('url')) {
        message.error('请添加对应的魔方图片');
        return false;
    }
    return true;
}
export default savePizzle;
