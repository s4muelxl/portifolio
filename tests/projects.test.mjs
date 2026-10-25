import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {projects} from '../data/projects.mjs';
import {galleryConfigs} from '../data/gallery-data.mjs';
const root=new URL('../',import.meta.url);

test('os cinco projetos têm estudos de caso e links de origem válidos',async()=>{
  const home=await readFile(new URL('index.html',root),'utf8');
  const cases=await readFile(new URL('projetos.html',root),'utf8');
  assert.equal(projects.length,5);
  assert.equal(new Set(projects.map(p=>p.id)).size,5);
  for(const project of projects){
    assert.ok(home.includes(`id="${project.homeId}"`),project.title);
    assert.ok(cases.includes(`id="${project.id}"`),project.title);
    assert.ok(cases.includes(project.question),project.title);
    assert.equal(new URL(project.source).hostname,'github.com');
    assert.equal(new URL(project.repo).pathname.split('/')[1],'s4muelxl');
  }
});
test('todas as 27 capturas existem e têm uma legenda correspondente',async()=>{
  const files=[];
  for(const gallery of Object.values(galleryConfigs)){
    for(const key of ['desktop','mobile']){
      if(!gallery[key])continue;
      const mode=gallery[key];
      assert.equal(mode.files.length,mode.captions.length);
      for(const file of mode.files){assert.ok(!files.includes(file));files.push(file);await access(new URL(file,root));}
    }
  }
  assert.equal(files.length,27);
});
test('diagramas usam somente nós existentes e têm texto alternativo',()=>{
  const graphs=projects.filter(p=>p.graph);
  assert.equal(graphs.length,3);
  for(const {graph} of graphs){
    const ids=new Set(graph.nodes.map(n=>n.id));
    assert.equal(ids.size,graph.nodes.length);
    assert.ok(graph.label.length>40);
    for(const [from,to] of graph.edges){assert.ok(ids.has(from));assert.ok(ids.has(to));assert.notEqual(from,to);}
  }
});


test('a navegação redundante de projetos não é renderizada',async()=>{
  const home=await readFile(new URL('index.html',root),'utf8');
  const cases=await readFile(new URL('projetos.html',root),'utf8');
  assert.equal(home.includes('project-index'),false);
  assert.equal(cases.includes('project-index'),false);
});

test('hero prioriza proposta, foto e duas ações sem resumo redundante',async()=>{
  const home=await readFile(new URL('index.html',root),'utf8');
  assert.ok(home.includes('Construo aplicações que organizam rotinas, automatizam operações e conectam pessoas.'));
  assert.ok(home.includes('Universidade São Judas Tadeu'));
  assert.equal(home.includes('class="recruiter-signal"'),false);
  assert.equal(home.includes('class="profile-summary'),false);
  assert.equal(home.includes('signal-grid evidence-grid'),false);
  assert.equal((home.match(/class="hero-actions"/g)||[]).length,1);
});
test('cases expõem evidências concretas de reconexão e regra de cotação',async()=>{
  const cases=(await readFile(new URL('projetos.html',root),'utf8')).replace(/\s+/g,' ');
  for (const html of [cases, await readFile(new URL('index.html',root),'utf8')]) {
    assert.doesNotMatch(html, /href="https:\/\/github\.com\/s4muelxl\/(?:nexo|cbcdegelo)(?:["/])/);
    assert.ok(html.includes('Código privado'));
  }
  assert.ok(cases.includes('reconciliação da mídia após reconexão'));
  assert.ok(cases.includes('src/domain/validations.ts'));
  assert.ok(cases.includes('src/domain/calculations.test.ts'));
  assert.ok(cases.includes('R$ 240,00'));
  assert.ok(cases.includes('R$ 3.338,14'));
});
