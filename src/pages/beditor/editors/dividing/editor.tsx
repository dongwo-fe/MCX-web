import useChangeEditorItemValue from '@/pages/beditor/hooks/useChangeEditorItemValue';
import { iEditorDividingLine } from '@/store/config';
import { Slider, InputNumber } from 'antd';
import SelectColor from '../../components/selectColor';

/**
 * 辅助分割编辑
 */
const DividingLineEditor = ({ data: { id } }: { data: iEditorDividingLine }) => {
    const [data, handleChangeValue] = useChangeEditorItemValue<iEditorDividingLine>({ id });
    const { height, bg_color } = data;

    const onChange = (value: number | null) => {
        handleChangeValue('height', value || 0);
    };

    return (
        <div className="editor-module-wrap">
            <div className="item-wrap item-center-spw">
                <span>空白高度</span>
                <Slider style={{ width: 140 }} min={8} max={100} onChange={onChange} value={height} />
                <InputNumber size="middle" min={8} max={100} step={1} value={height} onChange={onChange} />
            </div>
            <div className="item-wrap">
                <div className="item-diff-row">
                    <span>背景颜色</span>
                    <div className="item-row">
                        <SelectColor defaultValue="transparent" value={bg_color} onChange={(hex) => handleChangeValue('bg_color', hex)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DividingLineEditor;
