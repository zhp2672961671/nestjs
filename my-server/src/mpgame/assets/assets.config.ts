export enum ASSETS_KEY {
  WATER = '1',      //淡水
  STONE = '2',          //矿石
  WOOD = '3',           //木头
  WHEAT = '4',          //小麦
  NAIL = '5',           //钉子
  POPULATION = '6',     //人口上限
  HAPPINESS = '7',      //幸福度
  PRATICE = '8',        //学点
  FREE = '9'            //空闲人口
}

// mysql select field options
export const ASSETS_FIND_OPTIONS = {
  RESOURCE_QUERY: [ASSETS_KEY.WATER, ASSETS_KEY.STONE, ASSETS_KEY.WOOD, ASSETS_KEY.WHEAT, ASSETS_KEY.NAIL, ASSETS_KEY.POPULATION, ASSETS_KEY.HAPPINESS, ASSETS_KEY.PRATICE, ASSETS_KEY.FREE], // 全部资源查询
  LIBRARY_QUERY: [ASSETS_KEY.PRATICE, ASSETS_KEY.FREE], // 图书馆查询
  ALLOC_QUERY: [ASSETS_KEY.FREE],                       // 空闲人口
  HOUSE_QUERY: [ASSETS_KEY.POPULATION, ASSETS_KEY.FREE]  // 房子查询
}