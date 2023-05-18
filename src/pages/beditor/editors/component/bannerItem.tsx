import { Button } from 'antd';
import './index.less';
import { FormOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const BannertImage = ({
    item,
}: {
    item: {
        height: number;
        name: string;
        status: string;
        uid: string;
        url: string;
        width: number;
    };
}) => {
    if (!item) return <div className="img_box">请添加图片</div>;
    return (
        <div className="img_box">
            <img width="100%" height="100%" src={item.url} />
        </div>
    );
};

const BannerItem = ({ item, onEdit, onDel, onUp, onDown }: any) => {
    const { imgUrl } = item;
    return (
        <div id="banner_item">
            <BannertImage item={imgUrl[0]} />
            <div className="action_row">
                <Button type="primary" ghost onClick={onEdit}>
                    <FormOutlined />
                </Button>

                <Button type="primary" ghost onClick={onDel}>
                    <DeleteOutlined />
                </Button>
                <Button type="primary" ghost onClick={onUp}>
                    <UpOutlined />
                </Button>
                <Button type="primary" ghost onClick={onDown}>
                    <DownOutlined />
                </Button>
            </div>
        </div>
    );
};

export default BannerItem;
