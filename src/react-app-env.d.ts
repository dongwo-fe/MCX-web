/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
    }
}

declare module "react/jsx-runtime" {
    const data: any;
    export default data;
}

declare module '*.avif' {
    const src: string;
    export default src;
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
/**
 * 扩展原生的接口
 */
interface Array<T> {
    /**
     * 判断数组子项是否全部为空，可选参数
     */
    isEmpty: (...x: string[]) => boolean;
    /**
     * 判断是否有一个或子项(子项属性)是空
     */
    hasEmpty: (...x: string[]) => boolean;
}

// interface Object {
//     [index: string]: any;
//     /**
//      * 获取对象的某个属性，可以设置默认值
//      * @param key 属性，例如"a.b.c.d""
//      * @param defaultValue 不存在的时候返回的默认值
//      */
//     getValue: (key: string, defaultValue?: any) => any;
// }
