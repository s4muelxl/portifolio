"""Build the public one-page resume. Requires reportlab and DejaVu Sans."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Resume', str(FONT_DIR/'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('ResumeBold', str(FONT_DIR/'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='ResumeBold')
styles = {
    'name': ParagraphStyle('name', fontName='ResumeBold', fontSize=24, leading=29, spaceAfter=5),
    'subtitle': ParagraphStyle('subtitle', fontName='Resume', fontSize=10.2, leading=15, spaceAfter=7),
    'contact': ParagraphStyle('contact', fontName='Resume', fontSize=8.5, leading=13, spaceAfter=3),
    'section': ParagraphStyle('section', fontName='ResumeBold', fontSize=10, leading=14, spaceBefore=13, spaceAfter=6),
    'body': ParagraphStyle('body', fontName='Resume', fontSize=9.2, leading=14, spaceAfter=5, alignment=TA_LEFT),
    'project': ParagraphStyle('project', fontName='Resume', fontSize=9.1, leading=13.5, spaceAfter=8),
}
story = []
def paragraph(text, style='body'):
    story.append(Paragraph(text, styles[style]))

paragraph('Samuel Alves', 'name')
paragraph('Estudante de Engenharia de Software | Em busca de estágio ou posição júnior', 'subtitle')
paragraph('São Paulo, SP · (11) 96354-4001 · <link href="mailto:corporativosamuel8877alves@gmail.com">corporativosamuel8877alves@gmail.com</link>', 'contact')
paragraph('<link href="https://www.s4muelxl.com">s4muelxl.com</link> · <link href="https://github.com/s4muelxl">github.com/s4muelxl</link> · <link href="https://www.linkedin.com/in/samuel-alves-277015332">linkedin.com/in/samuel-alves-277015332</link>', 'contact')

paragraph('PERFIL', 'section')
paragraph('Estudante da Universidade São Judas Tadeu, com projetos em aplicações web, automação e comunicação em tempo real. Desenvolvo interfaces e regras de negócio com TypeScript/JavaScript, React e Python, integrando APIs, autenticação e dados com Supabase e PostgreSQL.')

paragraph('PROJETOS SELECIONADOS', 'section')
projects = [
    ('NEXO', 'nexo', 'Expo · React Native Web · TypeScript · Supabase',
     'Aplicação pessoal de treino, refeições, finanças e rotina. Interface, regras de negócio, autenticação e integração de dados; Zustand para estado local e TanStack Query para consultas remotas.'),
    ('Cabeça de Gelo', 'cbcdegelo', 'Next.js · React · TypeScript · WebRTC · LiveKit',
     'Salas de voz e compartilhamento de tela. Fluxo de salas, integração com LiveKit SFU, reconexão, diagnóstico e interfaces para mobile e desktop.'),
    ('BMI9', 'bmi9', 'HTML · CSS · JavaScript · Python/Flask',
     'Site de uma empresa de pisos industriais. Apresentação responsiva e fluxo de orçamento com proposta em PDF e envio de e-mail no servidor.'),
    ('SaberX', 'saberx', 'React · TypeScript · PostgreSQL · Supabase',
     'Sistema de cotações com produtos, fornecedores e histórico. Regras de cálculo e elegibilidade testáveis, autenticação e isolamento por organização via RLS.'),
    ('Gerador de Recibos', 'receipt-generator', 'Python · CLI · UTF-8',
     'Validação de entradas, cálculo de subtotais e total e exportação de recibos em arquivo. Demonstração em JavaScript disponível no portfólio.'),
]
for name, anchor, stack, description in projects:
    paragraph(f'<b>{name}</b> | {stack}<br/>{description} <link href="https://www.s4muelxl.com/projetos.html#{anchor}"><u>Case</u></link>.', 'project')

paragraph('FORMAÇÃO', 'section')
paragraph('<b>Bacharelado em Engenharia de Software</b> - Universidade São Judas Tadeu<br/>2025 - 2028 · Em andamento')

paragraph('BASE TÉCNICA E FORMAÇÃO COMPLEMENTAR', 'section')
paragraph('<b>Prática nos projetos:</b> TypeScript/JavaScript, React, Next.js, HTML/CSS, Python, Flask, APIs, SQL, PostgreSQL, Supabase, Git/GitHub, testes automatizados e WebRTC/LiveKit.')
paragraph('<b>Cursos e estudos:</b> dados e IA com Python (Alura); redes e cibersegurança (Cisco); SQL (FGV EPGE); Big Data (FIAP); Power BI e Excel (Santander/Alura); fundamentos de TI (Fundação Bradesco).')
paragraph('<b>Idiomas:</b> Português nativo · Inglês intermediário (B1).')

output = ROOT/'assets/Curriculo_Samuel_Alves.pdf'
document = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=43, leftMargin=43,
                             topMargin=35, bottomMargin=35, title='Samuel Alves - Currículo',
                             author='Samuel Alves', subject='Estágio e posição júnior em desenvolvimento de software')
document.build(story)
(ROOT/'assets/curriculo_samuel_alves_dev_v2.pdf').write_bytes(output.read_bytes())
(ROOT/'assets/Curriculo_Samuel_Alves_20261025.pdf').write_bytes(output.read_bytes())
print('Currículo atualizado:', output.name)
