
// 使用map保存缓存请求结果

export class LRUCache {
  private readonly capacity: number;
  public cache: Map<any, any>;
  constructor(capacity = 3) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  hasCache(key: string) {
    return this.cache.has(key);
  }

  getCache(key: string) {
    if (this.hasCache(key)) {
      // 存在即更新
      const temp = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, temp);
      return temp;
    }
    return -1;
  }

  putCache(key: string, value: Object) {
    if (this.hasCache(key)) {
      // 当前存在,删除后加入
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 缓存超过最大值，则移除最近没有使用的
      this.deleteCache();
    }
    // 不存在即直接加入
    this.cache.set(key, value);
  }

  deleteCache() {
    this.cache.delete(this.cache.keys().next().value);
  }
}
