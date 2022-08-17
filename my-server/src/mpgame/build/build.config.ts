/**
 * 建筑类型枚举
 */

 export enum BUILDTYPE {
  COMMON = 1,       // 普通类型 1
  HOUSE,            // 房子类型 2
  FUNCTION,         // 功能类型 3
  RESOURCE,         // 资源类型 4
  REPOSITORY,       // 仓储类型 5
  LIBRARY,          // 图书馆   6
  TECHNOLOGY,       // 研究院   7
}

// schedule常量定义
export const BuildConst = {
  BUILD_QUEUE: 'BuildQueue',                   // 队列名

  /////////////////
  // 建造任务
  /////////////////
  BUIlD_CREATED_TASK: 'BuildCreatedTask',    // 建造任务
}


// redis key
export const RedisKey = {
  scheduleSyncBuildCreatedTask: () => {
    return `build.schedule.build_created_task.lastwork`;
  },
}

// mysql select field options
export const BUILD_FIND_OPTIONS = {
  WORK_BUILD: ['typeId', 'type', 'slot', 'open', 'work_time', 'pop', 'farm_time', 'res'],
  FARM_BUILD: ['typeId', 'type', 'slot', 'open', 'pop', 'work_time', 'res', 'point'],
  UPGRADE_BUILD: ['typeId', 'level', 'open', 'typeGrid', 'gridX', 'gridY'],
  MOVE_BUILD: ['typeId', 'open', 'typeGrid', 'gridX', 'gridY'],
  OPEN_BUILD: ['typeId', 'start_time', 'open'],
  ALLOC_BUILD: ['typeId', 'start_time', 'open', 'type', 'slot', 'work_time'],
  CALC_MAX: ['repo_list', 'typeId']
}

export enum TYPE_GRID { //建筑占地类型
  ONE = 1, //1 * 2-_ 3_- 4 -- 5 --__ 6__-- 7 =^=
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN
}