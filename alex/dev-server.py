#!/usr/bin/env python3
"""Fokus Dev-Server mit Auto-Reload.
Serviert index.html und einen /mtime-Endpoint. Der Client pollt und reloaded bei Änderung."""
import http.server, socketserver, os, json, threading, socket

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(ROOT, 'index.html')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def do_GET(self):
        if self.path.startswith('/mtime'):
            try:
                mt = os.path.getmtime(FILE)
            except OSError:
                mt = 0
            body = json.dumps({'mtime': mt}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
            return
        # index.html immer no-cache
        if self.path in ('/', '/index.html'):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.end_headers()
            with open(FILE, 'rb') as f:
                self.wfile.write(f.read())
            return
        return super().do_GET()
    def log_message(self, *a): pass

def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80)); ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class TS(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    with TS(('0.0.0.0', PORT), Handler) as httpd:
        print(f'Fokus Dev-Server läuft: http://{lan_ip()}:{PORT}/index.html')
        httpd.serve_forever()
