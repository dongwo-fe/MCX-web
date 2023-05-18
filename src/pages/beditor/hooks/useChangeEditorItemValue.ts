import { useDispatch, useSelector } from 'react-redux';
import { changeBlockItemValue, changeEditorItem } from '@/store/editor';

export interface IChangeValueParams {
    id: string;
}

export type handleChangeValueType = (propName: string, value: any) => void;

// 修改editor每一项的自定义hooks
// 将id传给它他会给你返回id的对应项和修改value的方法
function useChangeEditorItemValue<T extends { id: string | number }>({ id }: IChangeValueParams): [T, handleChangeValueType] {
    const dispatch = useDispatch();
    const data: T = useSelector((state: any) => state.editor.renderBlocks.find((item: T) => item.id === id));
    const handleChangeValue: handleChangeValueType = (propName, value) => {
        dispatch(
            changeBlockItemValue({
                id,
                value,
                propName,
            })
        );
    };

    return [data, handleChangeValue];
}

export function useChangeEditorItem<T>(key: string) {
    const dispatch = useDispatch();
    const data: T = useSelector((state: any) => state.editor[key]);
    const handleChangeValue: any = (value) => {
        dispatch(
            changeEditorItem({
                key,
                value,
            })
        );
    };
    return [data, handleChangeValue];
}

export default useChangeEditorItemValue;
