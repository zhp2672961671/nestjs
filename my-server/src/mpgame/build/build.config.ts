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