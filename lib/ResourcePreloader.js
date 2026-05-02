// ResourcePreloader.js
export class ResourcePreloader {
    static install(context) {
        // 根据用户角色列表，在空闲时预取头像缩略图
        const preloadAvatars = () => {
            const characters = context.characters || [];
            const urls = characters
                .map(ch => ch?.avatar)
                .filter(Boolean)
                .slice(0, 12);  // 限制数量
            urls.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                document.head.appendChild(link);
            });
        };

        // 预取常用脚本（如Emoji Picker等非首屏依赖）
        const preloadScripts = () => {
            const scriptPaths = [
                '/scripts/extensions/expressions/index.js',
                '/scripts/extensions/stable-diffusion/index.js',
                // 可扩展更多
            ];
            scriptPaths.forEach(path => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'script';
                link.href = path;
                document.head.appendChild(link);
            });
        };

        // 在空闲时执行
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                preloadAvatars();
                preloadScripts();
            }, { timeout: 2000 });
        } else {
            setTimeout(() => {
                preloadAvatars();
                preloadScripts();
            }, 1000);
        }
    }
}