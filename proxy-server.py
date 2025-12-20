#!/usr/bin/env python3
"""
Simple CORS Proxy Server for LLM APIs
解决浏览器直接调用 LLM API 的跨域问题

Usage:
    python3 proxy-server.py

Then configure your API base URL to: http://localhost:8888/proxy/
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import urllib.error
import json
import ssl

PORT = 8888

class CORSProxyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version')
        self.send_header('Access-Control-Max-Age', '86400')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        """Proxy POST requests to LLM APIs"""
        if not self.path.startswith('/proxy/'):
            self.send_error(404, 'Use /proxy/{api_url} to proxy requests')
            return

        # Extract target URL
        target_url = self.path[7:]  # Remove '/proxy/'
        if not target_url.startswith('http'):
            target_url = 'https://' + target_url

        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None

            # Build headers (forward relevant ones)
            headers = {}
            for key in ['Content-Type', 'Authorization', 'x-api-key', 'anthropic-version']:
                if key in self.headers:
                    headers[key] = self.headers[key]

            # Create request
            req = urllib.request.Request(target_url, data=body, headers=headers, method='POST')

            # Disable SSL verification for simplicity (not recommended for production)
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

            # Make request
            with urllib.request.urlopen(req, context=ctx, timeout=60) as response:
                response_body = response.read()
                
                self.send_response(response.status)
                self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                self.end_headers()
                self.wfile.write(response_body)

        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_body = e.read()
            self.wfile.write(error_body)

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_GET(self):
        """Serve static files or proxy GET requests"""
        if self.path.startswith('/proxy/'):
            # Proxy GET request
            target_url = self.path[7:]
            if not target_url.startswith('http'):
                target_url = 'https://' + target_url

            try:
                headers = {}
                for key in ['Authorization', 'x-api-key']:
                    if key in self.headers:
                        headers[key] = self.headers[key]

                req = urllib.request.Request(target_url, headers=headers)
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE

                with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
                    response_body = response.read()
                    
                    self.send_response(response.status)
                    self.send_header('Content-Type', response.headers.get('Content-Type', 'application/json'))
                    self.end_headers()
                    self.wfile.write(response_body)

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            # Serve static files
            super().do_GET()

    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[Proxy] {args[0]}")


def main():
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║           LLM API CORS Proxy Server                          ║
╠══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:{PORT}                    ║
║                                                              ║
║  Usage:                                                      ║
║  Instead of: https://api.deepseek.com/v1/chat/completions    ║
║  Use:        http://localhost:{PORT}/proxy/api.deepseek.com/v1/chat/completions
║                                                              ║
║  Supported APIs:                                             ║
║  - DeepSeek: /proxy/api.deepseek.com/...                     ║
║  - OpenAI:   /proxy/api.openai.com/...                       ║
║  - Anthropic:/proxy/api.anthropic.com/...                    ║
║  - Moonshot: /proxy/api.moonshot.cn/...                      ║
║  - Zhipu:    /proxy/open.bigmodel.cn/...                     ║
║                                                              ║
║  Press Ctrl+C to stop                                        ║
╚══════════════════════════════════════════════════════════════╝
""")
    
    server = HTTPServer(('localhost', PORT), CORSProxyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.shutdown()


if __name__ == '__main__':
    main()
