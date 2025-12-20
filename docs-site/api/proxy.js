// Vercel Serverless Function - API Proxy
// 解决 CORS 问题，让前端可以调用 LLM API

export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { targetUrl, headers: customHeaders, body } = req.body;

        if (!targetUrl) {
            return res.status(400).json({ error: 'Missing targetUrl' });
        }

        // 验证目标 URL 是否是允许的 API
        const allowedHosts = [
            'api.openai.com',
            'api.anthropic.com',
            'api.deepseek.com',
            'generativelanguage.googleapis.com',
            'open.bigmodel.cn',
        ];

        const url = new URL(targetUrl);
        if (!allowedHosts.some(host => url.hostname.includes(host))) {
            return res.status(403).json({ error: 'Target URL not allowed' });
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

        const data = await response.text();

        // 返回响应
        res.status(response.status);
        res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/json');
        return res.send(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: error.message });
    }
}
