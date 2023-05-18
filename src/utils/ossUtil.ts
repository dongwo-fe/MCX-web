import { BUCKET } from '@/api/hotConfig';
import IMGOSS from '@dm/img_oss';
let instance: IMGOSS;

function SingleWrapper() {
    if (!instance) {
        instance = new IMGOSS(BUCKET, 'build_blocks_web');
    }
    return instance;
}
export const IMGCLIENT = SingleWrapper();
