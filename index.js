// st-performance-optimizer/index.js
import { LazyLoader } from './lib/LazyLoader.js';
import { DOMBatchScheduler } from './lib/DOMBatchScheduler.js';
import { ResourcePreloader } from './lib/ResourcePreloader.js';
import { MemoryGuard } from './lib/MemoryGuard.js';
import { EventAuditor } from './lib/EventAuditor.js';

(async () => {
  const context = SillyTavern.getContext();
  
  // 1. 立即调度懒加载，拦截同步加载
  context.eventSource.on('app_init_start', () => {
    LazyLoader.install();
  });

  // 2. 应用就绪后安装DOM批量调度和事件审计
  context.eventSource.on(context.event_types.APP_READY, () => {
    DOMBatchScheduler.install(context);
    ResourcePreloader.install(context);
    MemoryGuard.install(context);
    EventAuditor.install(context);
  });
})();