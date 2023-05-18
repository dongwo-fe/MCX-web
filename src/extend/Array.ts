/**
 * 判断某个内容是否为空
 * @param x 判断的值
 * @returns
 */
function isEmpty(x: any) {
    return x === undefined || x === null || x === '';
}

Array.prototype.isEmpty = function (...KeyList: string[]): boolean {
    const isit = !KeyList || KeyList.length === 0;
    return this.every((x: any) => {
        if (isit) return isEmpty(x);
        return KeyList.every((y) => !isEmpty(y) && isEmpty(x[y]));
    });
};

Array.prototype.hasEmpty = function (...KeyList: string[]): boolean {
    const isit = !KeyList || KeyList.length === 0;
    return this.every((x: any) => {
        if (isit) return isEmpty(x);
        return KeyList.every((y) => !isEmpty(y) && isEmpty(x[y]));
    });
};
export default {};
