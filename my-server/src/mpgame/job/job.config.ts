// Job常量定义
export const JobConst = {
  ETH_QUEUE: 'EthQueue',                        // 队列名

  /////////////////
  // 订单创建任务
  /////////////////
  SYNC_EVENT_MINT: 'SyncEventMint',           // 同步mint合约里的事件

  /////////////////
  // 订单提交任务
  /////////////////
  SYNC_HANDLE_MINT: 'SyncHandleMint',         // 同步一下未提交的订单

  /////////////////
  // mp任务
  /////////////////
  SYNC_EVENT_MP: 'SyncEventMp',               // 同步mp合约里的事件
}

// redis key
export const RedisKey = {
  // schedule : sync event mint
  scheduleSyncEventMint: () => {
    return `eth.schedule.sync_event_mint.lastwork`;
  }, 

  // schedule : sync handle mint
  scheduleSyncHandleMint: () => {
    return `eth.schedule.sync_handle_mint.lastwork`;
  },

  // schedule : sync event mp
  scheduleSyncEventMp: () => {
    return `eth.schedule.sync_event_mp.lastwork`;
  },
}