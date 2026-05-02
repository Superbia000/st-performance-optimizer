// WorkerProxy.js
export class WorkerProxy {
    static worker = null;

    static install(context) {
        if (!window.Worker) return;

        // 创建专用 Worker
        const workerCode = `
            // 简单的宏替换代理
            self.onmessage = function(e) {
                const { type, payload } = e.data;
                if (type === 'substituteParams') {
                    // 模拟原始 substituteParams 逻辑（简化版）
                    const result = payload.content
                        .replace(/{{user}}/gi, payload.userName)
                        .replace(/{{char}}/gi, payload.charName);
                    self.postMessage({ id: payload.id, result });
                } else if (type === 'tokenize') {
                    // 简单估算token数（不依赖完整tokenizer）
                    const tokens = payload.text.split(/\\s+/).length;
                    self.postMessage({ id: payload.id, tokens });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));

        // 拦截并代理宏替换（如果存在）
        const originalSub = context.substituteParams;
        if (typeof originalSub === 'function') {
            let msgId = 0;
            const pending = new Map();

            context.substituteParams = function(content, userName, charName) {
                return new Promise((resolve) => {
                    msgId++;
                    pending.set(msgId, resolve);
                    WorkerProxy.worker.postMessage({
                        type: 'substituteParams',
                        payload: { id: msgId, content, userName, charName }
                    });
                });
            };

            this.worker.onmessage = (e) => {
                if (e.data.id && pending.has(e.data.id)) {
                    pending.get(e.data.id)(e.data.result);
                    pending.delete(e.data.id);
                }
            };
        }
    }
}