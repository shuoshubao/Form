// https://vitejs.dev/config/
import antdViteImportPlugin from 'antd-vite-import-plugin';

export default ({ mode }) => {
    const isDevelopment = mode === 'development';
    return {
        base: isDevelopment ? '/' : 'https://shuoshubao.github.io/Search',
        server: {
            port: 3001
        },
        plugins: [
            antdViteImportPlugin()
        ]
    };
};
