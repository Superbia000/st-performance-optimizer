// MemoryGuard.js
export class MemoryGuard {
  static install(context) {
    const THIRTY_SECONDS = 30000;
    const MAX_DEPTH = 10; // 限制扩展元数据深度

    setInterval(() => {
      // 检查扩展设置深度并清理
      const pruneDeep = (obj, depth = 0) => {
        if (depth > MAX_DEPTH) return null;
        if (typeof obj !== 'object' || obj === null) return obj;
        for (let key of Object.keys(obj)) {
          obj[key] = pruneDeep(obj[key], depth + 1);
        }
        return obj;
      };
      context.extension_settings = pruneDeep(context.extension_settings);

      // 非活动标签页暂停部分操作
      if (document.hidden) {
        context.saveSettingsDebounced.cancel();
      }
    }, THIRTY_SECONDS);
  }
}