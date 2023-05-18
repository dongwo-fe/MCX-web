import { CreateOpsWebApp } from './fetch';

const request = CreateOpsWebApp();

interface iDownloadTemplateParams {
    template: string;
}

interface iSaveAndUpdateFloorPageInfoParams {
    pageId: string; // 页面id
    pageStartTime: string | undefined; // 页面开始时间
    pageEndTime: string | undefined; // 页面结束时间
    pageModuleStartTime: string | undefined; // 组件开始时间
    pageModuleEndTime: string | undefined; // 组件结束时间
    pageUrl: string; // url
    stock: string; // 库存
}

interface iFloorPageMaretImportResult {
    url:string;
    setVo:Array<iCityItem>
}


// 门店模板下载
export const downloadTemplate = (data: iDownloadTemplateParams) => request.getFile<Blob>('/floorPage/downloadTemplate', data);

// 门店导入
export const floorPageMaretImport = (data?: FormData) => request.post<iFloorPageMaretImportResult>('/floorPage/floorPageMaretImport', data);

// 落地页面信息保存
export const saveAndUpdateFloorPageInfo = (data: iSaveAndUpdateFloorPageInfoParams) => request.post('/floorPage/saveAndUpdateFloorPageInfo', data);
