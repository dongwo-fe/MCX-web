export interface GoodsItem {
    /** 商品id*/
    goodsSkuId: string;
    goodsId: string;
    /** 商品标题 */
    goodsSkuTitle: string;
    goodsTitle: string;
    /** 图片地址 */
    goodsPic: string;
    goodsMainPic: string
    /** 商品规格 */
    standardName: string
    /** 商品价格 */
    goodsPrice: string; //  商品sku价格
    goodsMaxMarketPrice: string; // 划线价
    goodsMaxPrice: string; // 商品价格
    /** 品牌 */
    brandName: string;
    /** 型号 */
    goodsMarque: string;
    /** sku编码 */
    goodsSkuCode: string;
    /** 所属店铺 */
    shopName: string;
    /** 推荐语 */
    recommend?: string;
}

export interface RecommendWord {
    /**创建时间 */
    gmtCreated: number,
    /**逻辑主键	 */
    id: number,
    /** 逻辑删除 */
    isDeleted: boolean,
    /** 推荐语内容 */
    recommendContent: string,
    /**推荐语主键*/
    recommendId: number
}