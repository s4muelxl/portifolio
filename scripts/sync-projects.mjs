import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {projects} from '../data/projects.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const check = process.argv.includes('--check');
const escape = value => value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const positions = {a:[500,60], b:[500,180], c:[180,320], d:[820,320], e:[500,470]};

export function casePanel(project) {
  const graph = project.graph;
  const diagram = graph ? `<figure class="architecture-panel architecture-${project.id}">
    <figcaption><span class="mono-label">ARQUITETURA EM FOCO</span><span>Visão simplificada do fluxo</span></figcaption>
    <div class="architecture-map" role="group" aria-label="${escape(graph.label)}">
      <svg class="architecture-lines" viewBox="0 0 1000 540" preserveAspectRatio="none" aria-hidden="true">${graph.edges.map(([from,to])=>{
        const first=positions[graph.nodes.find(n=>n.id===from).slot];
        const last=positions[graph.nodes.find(n=>n.id===to).slot];
        return `<path d="M ${first[0]} ${first[1]} L ${last[0]} ${last[1]}"/>`;
      }).join('')}</svg>
      ${graph.nodes.map(node=>`<div class="architecture-node slot-${node.slot}"><strong>${escape(node.label)}</strong><span>${escape(node.detail)}</span></div>`).join('\n      ')}
    </div>
  </figure>` : '';
  return `<details class="engineering-panel"${project.id==='nexo'?' open':''}>
    <summary class="engineering-heading"><span><span class="mono-label">DECISÃO DE ENGENHARIA</span><strong>${escape(project.question)}</strong></span><span class="engineering-toggle" aria-hidden="true">+</span></summary>
    <div class="engineering-body">
    <div class="engineering-notes"><div><span>A escolha</span><p>${escape(project.decision)}</p></div><div><span>O cuidado necessário</span><p>${escape(project.tradeoff)}</p></div></div>
    ${diagram}
    <a class="engineering-source" href="${escape(project.source)}" target="_blank" rel="noopener noreferrer">Consultar a base técnica no GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </details>`.replace(/[ \t]+$/gm,'');
}

const files = ['index.html','projetos.html'];
const demo = (await readFile(resolve(root,'components/receipt-demo.html'),'utf8')).trim();
for (const name of files) {
  const path=resolve(root,name);
  const current=await readFile(path,'utf8');
  let next=current.replace(/<!-- receipt-demo:start -->[\s\S]*?<!-- receipt-demo:end -->/g,`<!-- receipt-demo:start -->\n${demo}\n<!-- receipt-demo:end -->`);
  if(name==='projetos.html'){
    for(const project of projects){
      const expression=new RegExp(`<!-- engineering:${project.id}:start -->[\\s\\S]*?<!-- engineering:${project.id}:end -->`);
      next=next.replace(expression,`<!-- engineering:${project.id}:start -->\n${casePanel(project)}\n<!-- engineering:${project.id}:end -->`);
    }
  }
  if(check && next!==current) throw new Error(`${name}: execute node scripts/sync-projects.mjs para sincronizar os componentes.`);
  if(!check && next!==current) await writeFile(path,next);
}
console.log(check?'Componentes e dados editoriais sincronizados.':'Componentes estáticos atualizados.');
