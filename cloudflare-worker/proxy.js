// Cloudflare Worker - LLM API Proxy
// 部署到 Cloudflare Workers 解决 CORS 问题

const ALLOWED_HOSTS = [
    'api.openai.com',
    'api.anthropic.com', 
    'api.deepseek.com',
    'generativelanguage.googleapis.com',
    'open.bigmodel.cn',
];

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
};

export default {
    async fetch(request) {
        // 处理 OPTIONS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // 只允许 POST
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }

        try {
            const { targetUrl, headers: customHeaders, body } = await request.json();

            if (!targetUrl) {
                return new Response(JSON.stringify({ error: 'Missing targetUrl' }), {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                });
            }

            // 验证目标 URL
            const url = new URL(targetUrl);
            if (!ALLOWED_HOSTS.some(host => url.hostname.includes(host))) {
                return new Response(JSON.stringify({ error: 'Target URL not allowed' }), {
                    status: 403,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                });
            }

            // 转发请求
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...customHeaders,
                },
                body: JSON.stringify(body),
            });

            // 返回响应
            const data = await response.text();
            return new Response(data, {
                status: response.status,
                headers: {
                    ...CORS_HEADERS,
                    'Content-Type': response.headers.get('Content-Type') || 'application/json',
                },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }
    },
};
