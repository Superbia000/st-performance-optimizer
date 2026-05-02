// LazyLoader.js
export class LazyLoader {
  static install() {
    // 标记延迟的模块列表（根据实际源码路径调整）
    const lazyModules = [
      './scripts/kai-settings.js',
      './scripts/textgen-settings.js',
      './scripts/nai-settings.js',
      './scripts/horde.js',
      './scripts/tool-calling.js',
      './extensions/stable-diffusion/index.js',
      './extensions/expressions/index.js',
      // 其他非首屏必需模块
    ];

    // 重写导入机制：监测到这些路径时返回空代理对象，实际首次调用时才动态import
    const originalImport = window.importShim;
    window.importShim = async (path) => {
      if (lazyModules.includes(path)) {
        return {
          default: new Proxy({}, {
            get(target, prop) {
              if (!target._loaded) {
                target._loaded = import(path).then(mod => Object.assign(target, mod));
              }
              return target[prop];
            }
          })
        };
      }
      return originalImport(path);
    };
  }
}