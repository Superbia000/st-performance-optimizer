// DOMBatchScheduler.js
export class DOMBatchScheduler {
  static install(context) {
    const originalAddMessage = context.addOneMessage;
    
    const pendingMessages = [];
    let rafScheduled = false;
    
    context.addOneMessage = function(msg, ...args) {
      pendingMessages.push({msg, args});
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
          const batch = pendingMessages.splice(0);
          const fragment = document.createDocumentFragment();
          batch.forEach(item => {
            // 调用原始 addOneMessage，但操作fragment（如果源码不支持，回退）
            originalAddMessage.call(context, item.msg, ...item.args, fragment);
          });
          context.chatElement.appendChild(fragment);
          rafScheduled = false;
        });
      }
    };

    // 对现有大量消息实现简单虚拟滚动
    // 完整实现需Observer，此处省略详细滚轮计算
  }
}