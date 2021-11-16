
// 使用map保存缓存请求结果

export class LRUCache {
  private readonly capacity: number;
  private cache: Map<any, any>;
  constructor(capacity = 3) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  hasCache(key: symbol) {
    return this.cache.has(key);
  }

  getCache(key: symbol) {
    if (this.hasCache(key)) {
      // 存在即更新
      const temp = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, temp);
      return temp;
    }
    return -1;
  }

  putCache(key: symbol, value: Object) {
    if (this.hasCache(key)) {
      // 存在即更新（删除后加入）
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 缓存超过最大值，则移除最近没有使用的
      this.deleteCache();
    }
    // 不存在即加入
    this.cache.set(key, value);
  }

  deleteCache() {
    this.cache.delete(this.cache.keys().next().value);
  }
}

export const deepClone = (target: [] | {}, map = new WeakMap()) => {
  if (!target || typeof target !== "object") return target;
  if (map.get(target)) return map.get(target);
  const result = Array.isArray(target) ? [] : {};
  map.set(target, result);
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      (result as any)[key] = deepClone((target as any)[key], map);
    }
  }
  return result;
};
