import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BaseSchedule } from "src/base/base.schedule";
import { Cache } from "cache-manager";
import { BuildConst, RedisKey } from "./build.config";

/**
 * 建筑用计划入口
 */
@Injectable()
export class BuildSchedule extends BaseSchedule {
  constructor(
    @Inject(CACHE_MANAGER)
    protected readonly cache: Cache,
  ) {
    super(cache);
  }
}