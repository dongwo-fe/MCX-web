import { iEditorElevatorNavigation } from '@/store/config';
import { getIsEmpty } from '@/utils/tools';
import { message } from 'antd';

// 保存校验
function saveElevator(data: iEditorElevatorNavigation) {
    const { label_list, modalType } = data;
    if (modalType == 1) {
        if (getIsEmpty(label_list, 'text_input')) {
            message.error('请填写电梯标签内容');
            return false;
        }
    } else {
        if (getIsEmpty(label_list, 'image_url')) {
            message.error('请上传电梯标签图片');
            return false;
        }
    }

    if (getIsEmptyDiff(label_list)) {
        message.error('请选择需要定位的组件');
        return false;
    }

    if (getIsSort(label_list)) {
        message.error('选择的定位组件必须从上到下排序');
        return false;
    }
    return true;
}

// 判断是否为空
const getIsSort = (list: Array<any>) => {
    for (var i = 0; i <= list.length - 2; i++) {
        if (list[i].link_data.link_number >= list[i + 1].link_data.link_number) {
            return true;
        }
    }
    return false;
};

// 判断是否为空
const getIsEmptyDiff = (list: Array<any>) => {
    let num = 0;
    list.forEach((item) => {
        if (item.link_data && item.link_data.link_id == '') {
            num = num + 1;
        }
    });
    if (num != 0) return true;
    return false;
};
export default saveElevator;
