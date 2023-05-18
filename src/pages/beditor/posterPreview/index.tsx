import React from 'react';
import ReactDom from 'react-dom';
import styles from './index.module.scss';
import { iEditor } from '@/store/config';
import { useSelector } from 'react-redux';

interface PosterPreviewProps {
  onClose: () => void;
};

const PosterPreview = (props: PosterPreviewProps) => {
    const container = document.body;
    const EditorData: iEditor = useSelector((state: any) => state.editor);
    if (!container) {
      return <></>;
    }

    return ReactDom.createPortal(
        <div className={styles.posterPreview} onClick={props.onClose}>
          <div className={styles.preview}>
            <img className={styles.img} src={EditorData.posterShare?.img} alt="" />
            <div className={styles.flex}>
              <div className={styles.user_info}>
                <div className={styles.title}>{EditorData.posterShare?.title}</div>
                <div className={styles.des}>{EditorData.posterShare?.desc}</div>
                <div className={styles.user}>
                  <div className={styles.user_logo}></div>
                  <div className={styles.info}>
                    <div className={styles.phone}>189****6789</div>
                    <div className={styles.coments}>为您推荐了一个很棒的活动</div>
                  </div>
                </div>
              </div>
              <div className={styles.code}>
                <div className={styles.qrCode}></div>
                <div className={styles.text}>长按识别查看</div>
              </div>
            </div>
          </div>
          <div className={styles.close}></div>
        </div>,
        container
    );
};

export default PosterPreview;
