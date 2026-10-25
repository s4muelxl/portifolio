"""Dependency-free checks for published pages, links, content and resource budgets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import gzip, re, hashlib

ROOT = Path(__file__).resolve().parent.parent
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.duplicates=[]; self.links=[]; self.assets=[]; self.stack=[]; self.capture=[]; self.content=[]; self.inline_scripts=0; self.main=0; self.h1=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids:self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        if tag=='a':self.links.append(attrs.get('href',''))
        if tag in {'img','script'} and attrs.get('src'):self.assets.append(attrs['src'])
        if tag=='link' and attrs.get('rel') in {'stylesheet','icon'}:self.assets.append(attrs['href'])
        if tag=='script' and not attrs.get('src'):self.inline_scripts+=1
        if tag=='main':self.main+=1
        if tag=='h1':self.h1+=1
        if tag not in VOID:self.stack.append((tag,attrs))
        excluded=any('receipt-preview' in a.get('class','') or a.get('class')=='demo-hint' for _,a in self.stack)
        if tag in {'p','li','h1','h2','h3'} and not excluded:self.capture.append([tag,len(self.stack),[]])
    def handle_endtag(self,tag):
        for capture in self.capture[:]:
            if capture[0]==tag and capture[1]==len(self.stack):
                text=' '.join(''.join(capture[2]).split())
                if text:self.content.append(text)
                self.capture.remove(capture)
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index][0]==tag:self.stack=self.stack[:index];break
    def handle_data(self,data):
        for capture in self.capture:capture[2].append(data)

def run():
    pages={}
    for name in ['index.html','projetos.html']:
        page=Page();page.feed((ROOT/name).read_text());pages[name]=page
    required_copy={
        'index.html':['Samuel Alves','NEXO','Cabeça de Gelo','BMI9','SaberX','Gerador de Recibos','Bacharelado em Engenharia de Software','Universidade São Judas Tadeu (USJT)'],
        'projetos.html':['NEXO','Cabeça de Gelo','BMI9','SaberX','Gerador de Recibos']
    }
    for name,page in pages.items():
        assert not page.duplicates,(name,'IDs repetidos',page.duplicates)
        assert page.main==page.h1==1,(name,'estrutura semântica')
        assert not page.inline_scripts,(name,'script inline incompatível com CSP')
        for text in required_copy[name]:assert any(text in value for value in page.content),(name,'conteúdo essencial ausente',text)
        for asset in page.assets:
            parsed=urlsplit(asset)
            if not parsed.netloc:assert (ROOT/parsed.path.lstrip('/')).is_file(),(name,'recurso ausente',asset)
        for link in page.links:
            parsed=urlsplit(link)
            if parsed.scheme or parsed.netloc:continue
            target=parsed.path.lstrip('/') or name
            assert (ROOT/target).is_file(),(name,'link local ausente',link)
            if parsed.fragment and target in pages:assert unquote(parsed.fragment) in pages[target].ids,(name,'âncora ausente',link)
        print(f'{name}: conteúdo essencial, links, recursos e estrutura válidos.')
    resources=['portfolio.css','portfolio-experience.css','portfolio-premium.css','portfolio.js','portfolio-premium.js','receipt-loader.mjs','receipt-core.mjs','receipt-demo.mjs','data/gallery-data.mjs',*[str(path.relative_to(ROOT)) for path in sorted((ROOT/'interactions').glob('*.mjs'))]]
    # Inspect CSS dependencies too: HTML-only checks miss local fonts and imports.
    for resource in resources:
        if not resource.endswith('.css'): continue
        for asset in re.findall(r'url\([\'"]?([^\)\'\"]+)', (ROOT/resource).read_text()):
            parsed=urlsplit(asset)
            if not parsed.scheme and not parsed.netloc and not asset.startswith('#'):
                assert (ROOT/resource).parent.joinpath(parsed.path).is_file(),('recurso CSS ausente',resource,asset)
    for font in (ROOT/'assets/fonts').glob('*.woff2'):
        assert hashlib.sha256(font.read_bytes()).hexdigest()[:12] in font.name,('fonte sem hash válido',font.name)
        assert font.read_bytes()[:4]==b'wOF2',('fonte WOFF2 inválida',font.name)
    total=sum((ROOT/file).stat().st_size for file in resources)
    assert total<110_000,('orçamento de CSS/JS excedido',total)
    for file in resources:
        data=(ROOT/file).read_bytes()
        print(f'{file}: {len(data)} bytes; gzip estimado {len(gzip.compress(data))} bytes')
    print(f'CSS + JavaScript: {total} bytes de fonte; orçamento 110000 bytes. Isto não mede latência nem Core Web Vitals.')

if __name__=='__main__':run()
