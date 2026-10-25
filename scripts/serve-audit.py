"""Serve static audit fixtures with text gzip, matching production compression behavior."""
import argparse
import gzip
import io
from pathlib import Path
from urllib.parse import urlsplit
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

class AuditHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = Path(self.translate_path(urlsplit(self.path).path))
        if path.is_dir():
            path = path / 'index.html'
        if path.is_file() and path.suffix in {'.html', '.css', '.js', '.mjs', '.json', '.svg'} and 'gzip' in self.headers.get('Accept-Encoding', ''):
            data = gzip.compress(path.read_bytes())
            self.send_response(200)
            self.send_header('Content-Type', self.guess_type(str(path)))
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Vary', 'Accept-Encoding')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'public, max-age=0, must-revalidate')
            self.end_headers()
            return io.BytesIO(data)
        return super().send_head()

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=4173)
parser.add_argument('--directory', default='.')
args = parser.parse_args()
ThreadingHTTPServer(('127.0.0.1', args.port), partial(AuditHandler, directory=args.directory)).serve_forever()
