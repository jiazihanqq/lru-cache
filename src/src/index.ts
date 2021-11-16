import { LRUCache } from "./lru-cache";
import request from "./request";
import { CacheRequsetStatus } from "./constant";

interface CacheInfos {
  status: CacheRequsetStatus;
  time: number;
  response: null;
  resolves: [];
  rejects: [];
}
const CacheSchema: CacheInfos = {
  status: CacheRequsetStatus.PENDING,
  time: Date.now(),
  response: null,
  resolves: [],
  rejects: [],
};

// 请求和缓存之间的配合
export class CacheRequset extends LRUCache {
  constructor(capacity: number) {
    super(capacity);
  }
  // 暴漏get请求接口
  public get(url: string, cacheKey: string) {
    return this.requset(url, cacheKey);
  }

  private requset(url: string, cacheKey: string) {
    // 没有命中缓存结果，缓存这次请求到cache，并发布真正请求；
    if (!this.hasCache(cacheKey)) {
      const cacheSchema = Object.assign({}, CacheSchema, {
        status: CacheRequsetStatus.PENDING,
      });
      this.putCache(cacheKey, cacheSchema);
      return this._requset(cacheSchema, url);
    }
    // 命中了缓存的结果，resolve一下返回
    const cacheSchema = this.getCache(cacheKey);
    if (cacheSchema.status === CacheRequsetStatus.PENDING) {
      return new Promise((resolve, reject) => {
        cacheSchema.resolves.push(resolve);
        cacheSchema.rejects.push(reject);
      });
    }

    if (cacheSchema.status === CacheRequsetStatus.RESOLVED) {
      return Promise.resolve(cacheSchema.response);
    }

    if (cacheSchema.status === CacheRequsetStatus.REJECTED) {
      // 如果结果是失败的，从新请求一下
      return this._requset(cacheSchema, url);
    }
  }

  // 处理ajax请求的真正逻辑
  private _requset(cacheSchema: CacheInfos, url: string) {
    return request(url).then((data) => {
      const response = Object.assign({}, data, { fromCache: true });
      cacheSchema.time = Date.now();
      cacheSchema.status = CacheRequsetStatus.RESOLVED;
      while (cacheSchema.resolves.length > 0) {
        const resolve = cacheSchema.resolves.shift();
        if (resolve) {
          // @ts-ignore
          resolve(response);
        }
      }

      return Promise.resolve(data);
    });
  }

  deleteCache() {
    for (const key in this.cache) {
      const value = this.cache.get(key);
      if (
        value &&
        value.status !== CacheRequsetStatus.PENDING &&
        this.cache.hasOwnProperty(key)
      ) {
        this.cache.delete(key);
      }
    }
  }
}
