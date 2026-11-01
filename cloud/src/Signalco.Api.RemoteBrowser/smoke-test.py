"""Exercise the deployed browser process with an off-screen animated fixture."""
import base64
import json
import struct
import sys
import urllib.parse
import urllib.request

html = '''<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width"><style>
body { margin:0; font:18px/27px Arial; color:#123456; background:white; }
section { height:700px; } #reveal { opacity:0; } #reveal.shown { opacity:1; }
</style></head><body><section><h1>Capture fixture</h1><button aria-label="Named action">Action</button></section>
<section id="reveal"><h2>Scroll reveal target</h2><img src="missing.png" width="32" height="32"><input></section>
<script>new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('shown'); })).observe(document.querySelector('#reveal'));</script>
</body></html>'''
query = urllib.parse.urlencode({
    'url': 'data:text/html;base64,' + base64.b64encode(html.encode()).decode(),
    'width': 390, 'height': 500, 'fullPage': 'true', 'scrollThrough': 'true',
    'inspect': 'true', 'mobile': 'true', 'wait': 0,
})
with urllib.request.urlopen(sys.argv[1] + '/api/screenshot?' + query, timeout=50) as response:
    result = json.load(response)
image = base64.b64decode(result['data'].split(',')[1])
assert image[:8] == bytes.fromhex('89504e470d0a1a0a')
width, height = struct.unpack('>II', image[16:24])
assert width == 390 and height >= 1400, (width, height)
assert result['reachedBottom'] is True
inspection = result['inspection']
assert inspection['language'] == 'en'
assert any(s['text'] == 'Scroll reveal target' for s in inspection['styles'])
assert any('Arial' in s['family'] and s['size'] == '18px' for s in inspection['styles'])
checks = {c['label']: c['count'] for c in inspection['checks']}
assert checks['Images missing an alt attribute'] == 1
assert checks['Form fields without a label'] == 1
assert checks['Buttons without an accessible name'] == 0
print(f'Full-page mobile screenshot {width}×{height}, scroll reveal, typography and accessibility checks passed.')
