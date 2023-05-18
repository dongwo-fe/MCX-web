import { createID } from '@/utils/tools';

export interface iFormComponentListItem {
    title: string;
    type: createType;
}

export interface iFormListItem {
    type: createType | string;
    id: string;
    title: string;
    required?: number;
    minCount?: number;
    maxCount?: number;
    placeholder?: string;
    codePlaceholder?: string;
    codeVerify?: boolean;
    formType: string;
    options?: Array<any>;
    customOptions?: Array<any>; //自定义下拉选框
    count: number; // 组件数量
}

export const formComponentList: Array<iFormComponentListItem> = [
    {
        title: '手机',
        type: 'phone',
    },
    {
        title: '邀请码',
        type: 'invitationCode',
    },
    {
        title: '姓名',
        type: 'name',
    },
    {
        title: '性别',
        type: 'gender',
    },
    {
        title: '生日',
        type: 'birthDay',
    },
    {
        title: '省市区',
        type: 'cityId',
    },
    // {
    //     title: '小区名称',
    //     type: 'sommunityName',
    // },
    {
        title: '自定义',
        type: 'custom',
    },
];

export const fclCustomSelect: iFormComponentListItem = {
    title: '自定义下拉',
    type: 'customSelect',
};
const formItemOptions = {
    name: () => ({
        type: 'name',
        id: createID(),
        title: '姓名',
        required: 1, //1-必填 0-非必填
        minCount: 2,
        maxCount: 13,
        formType: 'Text',
        placeholder: '请输入姓名',
        count: 1,
    }),
    phone: () => ({
        type: 'phone',
        id: createID(),
        title: '手机号',
        required: 1,
        placeholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        formType: 'PhoneInput',
        maxCount: 11,
        codeVerify: false, //使用短信验证码
        count: 1,
    }),

    sommunityName: () => ({
        type: 'sommunityName',
        id: createID(),
        title: '小区名称',
        required: 1,
        minCount: 1,
        maxCount: 30,
        formType: 'Text',
        placeholder: '请输入小区名称',
        count: 1,
    }),
    gender: () => ({
        type: 'gender',
        id: createID(),
        title: '性别',
        required: 0,
        formType: 'MySelect',
        placeholder: '请选择性别',
        options: [
            { label: '男', value: 1 },
            { label: '女', value: 2 },
        ],
        count: 1,
    }),
    birthDay: () => ({
        type: 'birthDay',
        id: createID(),
        title: '出生日期',
        required: 0,
        formType: 'Date',
        placeholder: '请选择出生日期',
        count: 1,
    }),
    invitationCode: () => ({
        type: 'invitationCode',
        id: createID(),
        title: '邀请码',
        required: 0,
        formType: 'Text',
        placeholder: '请输入邀请码（选填）',
        count: 1,
    }),
    cityId: () => ({
        type: 'cityId',
        id: createID(),
        title: '省市区',
        required: 0,
        formType: 'CitySelect',
        placeholder: '请选择省市区',
        count: 1,
    }),
    custom: () => ({
        type: 'custom',
        id: createID(),
        title: '自定义',
        formType: 'Text',
        placeholder: '请输入自定义文案',
        required: 0,
        minCount: 1,
        maxCount: 30,
        count: 10,
    }),
    customSelect: () => ({
        type: 'customSelect',
        id: createID(),
        title: '自定义下拉',
        formType: 'CustomSelect',
        placeholder: '请选择',
        required: 0,
        customOptions: [],
        count: 10,
    }),
};

export type createType = 'name' | 'phone' | 'sommunityName' | 'gender' | 'birthDay' | 'invitationCode' | 'cityId' | 'custom' | 'customSelect';

export const createFormItem = (type: createType): iFormListItem => {
    return formItemOptions[type]();
};
