// SillyTavern Frontend Worker
// Serves static files from the public/ directory
// Proxies /api/* requests to the backend Worker

const DEFAULT_BACKEND_URL = 'https://st-api.520781.xyz';

function proxyRequest(request, backendUrl) {
    const url = new URL(request.url);
    const proxyUrl = new URL(url.pathname + url.search, backendUrl);
    return fetch(new Request(proxyUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
    }));
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const backendUrl = env.BACKEND_URL || DEFAULT_BACKEND_URL;

        // Proxy API and CSRF requests to the backend Worker
        if (path.startsWith('/api/') || path === '/csrf-token') {
            return proxyRequest(request, backendUrl);
        }

        // Serve static files from the site bucket
        return env.ASSETS.fetch(request);
    },
};
