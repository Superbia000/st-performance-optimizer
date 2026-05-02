// EventAuditor.js
export class EventAuditor {
  static install(context) {
    // 修复侧边栏滚动bug：为drawer事件添加清理
    const originalToggle = context.toggleDrawer;
    context.toggleDrawer = function(id) {
      const drawer = document.getElementById(id);
      if (drawer && !drawer.classList.contains('openDrawer')) {
        originalToggle.call(context, id);
        // 立即为滚动区域添加passive监听
        const scrollable = drawer.querySelector('.scrollable');
        if (scrollable) {
          scrollable.addEventListener('scroll', () => {}, {passive: true});
        }
      } else {
        // 关闭时清除所有挂载事件
        drawer.querySelectorAll('*').forEach(el => {
          el.removeEventListener('scroll', () => {});
          el.removeEventListener('touchmove', () => {});
        });
        originalToggle.call(context, id);
      }
    };

    // 全局被动滚动
    document.addEventListener('touchstart', () => {}, {passive: true});
  }
}