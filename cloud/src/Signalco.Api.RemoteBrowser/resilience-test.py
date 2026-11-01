"""Local regression: reset a navigation and stall a font beyond the capture budget.

Run against a local browser service. --fixture-host can expose this host's fixture
address to a containerized service (for example the Docker bridge gateway).
"""
import argparse
import base64
import json
import socket
import struct
import threading
import time
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

parser = argparse.ArgumentParser()
parser.add_argument('service')
parser.add_argument('--fixture-host', default='127.0.0.1')
args = parser.parse_args()
counts = {'page': 0, 'font': 0}

class Fixture(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == '/slow.woff2':
            counts['font'] += 1
            time.sleep(20)
            try:
                self.send_response(200)
                self.send_header('Content-Type', 'font/woff2')
                self.end_headers()
                self.wfile.write(b'invalid font')
            except (BrokenPipeError, ConnectionResetError):
                pass
            return
        counts['page'] += 1
        if counts['page'] == 1:
            self.connection.setsockopt(socket.SOL_SOCKET, socket.SO_LINGER, struct.pack('ii', 1, 0))
            self.connection.close()
            return
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        self.wfile.write(b'''<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width">
<style>@font-face { font-family: Delayed; src: url('/slow.woff2'); }
body { font-family: Delayed, Arial; height: 1400px; }</style></head>
<body><h1>Resilient capture</h1></body></html>''')

server = ThreadingHTTPServer(('0.0.0.0', 0), Fixture)
threading.Thread(target=server.serve_forever, daemon=True).start()
try:
    query = urllib.parse.urlencode({
        'url': f'http://{args.fixture_host}:{server.server_port}/page',
        'width': 390, 'height': 500, 'fullPage': 'true', 'scrollThrough': 'true', 'inspect': 'true',
    })
    start = time.monotonic()
    with urllib.request.urlopen(args.service + '/api/screenshot?' + query, timeout=15) as response:
        result = json.load(response)
    elapsed = time.monotonic() - start
    assert elapsed < 12, f'Stalled font delayed capture for {elapsed:.1f}s'
    assert counts['page'] >= 2 and counts['font'] >= 1, counts
    assert any(s['text'] == 'Resilient capture' for s in result['inspection']['styles'])
    image = base64.b64decode(result['data'].split(',')[1])
    assert image[:8] == bytes.fromhex('89504e470d0a1a0a')
    print(f'Reset navigation recovered; stalled font fell back; capture completed in {elapsed:.1f}s.')
finally:
    server.shutdown()
    server.server_close()
