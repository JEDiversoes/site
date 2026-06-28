let data=JSON.parse(localStorage.getItem('je_manager_data')||'[]');
const $=id=>document.getElementById(id);
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>openPage(b.dataset.page));

function safe(v){return (v===undefined||v===null||v==='') ? '-' : String(v);}
function openPage(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  if($(p)) $(p).classList.add('active');
  document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===p));
  const titles={dashboard:'Dashboard',importar:'Importar Cadastro',locacao:'Nova Locação',clientes:'Clientes',agenda:'Agenda',contratos:'Contratos',financeiro:'Financeiro'};
  if($('pageTitle')) $('pageTitle').textContent=titles[p]||'J.E. Manager';
  render();
}

function parseMsg(txt){
  let obj={};
  txt.split('\n').forEach(l=>{
    let m=l.match(/^([^:]+):\s*(.*)$/);
    if(m)obj[m[1].trim().toLowerCase()]=m[2].trim();
  });
  return obj;
}
function importarCadastro(){
  let o=parseMsg($('textoImportado').value);
  $('nome').value=o['nome']||'';
  $('doc').value=o['cpf/cnpj']||'';
  $('telefone').value=o['telefone']||'';
  $('email').value=o['e-mail']||'';
  $('endereco').value=o['endereço']||'';
  $('data').value=o['data do evento']||'';
  $('inicio').value=o['horário início']||'';
  $('retirada').value=o['horário retirada']||'';
  $('local').value=o['local instalação']||'';
  $('evento').value=o['tipo de evento']||'';
  $('condicoes').value='TV: '+(o['tv']||'')+'\nObservações: '+(o['observações']||'');
  openPage('locacao');
}

function adds(){return Array.from($('adicionais').selectedOptions).map(o=>o.value)}
function baseItems(){
  let p=$('pacote').value;
  let it=['Karaokê','Caixa de som ativa','Controle remoto','Fontes','Cabos HDMI/RCA','Filtro de linha/extensão','Catálogo/lista de músicas'];
  if(p==='Bronze')it.push('Microfone sem fio','Microfone com fio');
  else it.push('Microfone sem fio 1','Microfone sem fio 2','Pontuação em tempo real');
  if(p==='Ouro')it.push('Modo Versus');
  return it.concat(adds());
}
function checklist(){
  if(!$('checklist')) return;
  $('checklist').innerHTML=baseItems().map(i=>'<div>☐ '+i+'</div>').join('');
}
function form(){
  let total=(+$('valorPacote').value||0)+(+$('valorAdicionais').value||0)-(+ $('desconto').value||0);
  let sinal=+$('sinal').value||0;
  return{contrato:$('contrato').value,nome:$('nome').value,doc:$('doc').value,telefone:$('telefone').value,email:$('email').value,endereco:$('endereco').value,data:$('data').value,inicio:$('inicio').value,retirada:$('retirada').value,local:$('local').value,evento:$('evento').value,pacote:$('pacote').value,adicionais:adds(),valorPacote:+$('valorPacote').value||0,valorAdicionais:+$('valorAdicionais').value||0,desconto:+$('desconto').value||0,total,sinal,saldo:total-sinal,pagamento:$('pagamento').value,status:$('status').value,condicoes:$('condicoes').value,checklist:baseItems()}
}
function save(){
  let d=form();
  if(!d.contrato||!d.nome){alert('Preencha contrato e nome.');return}
  data.push(d);
  localStorage.setItem('je_manager_data',JSON.stringify(data));
  alert('Locação salva.');
  render();
  openPage('dashboard');
}
function contractFromForm(){openPrintableContract(form())}
function makeContract(i){openPrintableContract(data[i])}

function contractHtml(d){
  const checklist=(d.checklist||[]).map(i=>`<p class="check">☐ ${safe(i)}</p>`).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Contrato ${safe(d.contrato)}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;background:#eee}
    .wrap{max-width:900px;margin:20px auto;background:#fff;padding:42px}
    h1{text-align:center;font-size:22px;margin:0 0 8px} h2{font-size:17px;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:24px}
    .sub{text-align:center;color:#555;margin-bottom:26px}.box{border:1px solid #bbb;border-radius:8px;padding:12px;margin:8px 0}
    table{width:100%;border-collapse:collapse;margin-top:10px}td,th{border:1px solid #bbb;padding:8px;text-align:left}
    .check{margin:4px 0}.sign{display:flex;justify-content:space-between;margin-top:55px}.sign div{width:42%;text-align:center;border-top:1px solid #111;padding-top:8px}
    .manual li{margin:6px 0}
    @media print{body{background:#fff}.wrap{margin:0;max-width:100%;padding:18mm;box-shadow:none}.no-print{display:none}}
  </style></head><body><div class="wrap">
  <button class="no-print" onclick="window.print()" style="float:right;padding:10px 16px">Imprimir / Salvar PDF</button>
  <h1>CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS<br>J.E. DIVERSÕES</h1>
  <p class="sub"><b>Nº do contrato:</b> ${safe(d.contrato)}</p>
  <h2>1. Resumo da Locação</h2>
  <table>
    <tr><th>Campo</th><th>Informação</th></tr>
    <tr><td>Contratante</td><td>${safe(d.nome)}</td></tr>
    <tr><td>CPF/CNPJ</td><td>${safe(d.doc)}</td></tr>
    <tr><td>Telefone</td><td>${safe(d.telefone)}</td></tr>
    <tr><td>E-mail</td><td>${safe(d.email)}</td></tr>
    <tr><td>Evento</td><td>${safe(d.data)} às ${safe(d.inicio)} | Retirada: ${safe(d.retirada)}</td></tr>
    <tr><td>Local</td><td>${safe(d.local||d.endereco)}</td></tr>
    <tr><td>Pacote</td><td>${safe(d.pacote)}</td></tr>
    <tr><td>Adicionais</td><td>${(d.adicionais||[]).join(', ')||'Não contratado'}</td></tr>
    <tr><td>Financeiro</td><td>Total: ${money(d.total)} | Sinal: ${money(d.sinal)} | Saldo: ${money(d.saldo)} | ${safe(d.pagamento)}</td></tr>
    <tr><td>Condições especiais</td><td>${safe(d.condicoes)}</td></tr>
  </table>
  <h2>2. Cláusulas Contratuais</h2>
  <p><b>Objeto.</b> A LOCADORA disponibiliza ao CONTRATANTE os equipamentos descritos neste contrato exclusivamente para o evento informado.</p>
  <p><b>Instalação.</b> A instalação e retirada serão realizadas pela LOCADORA. O CONTRATANTE deverá disponibilizar mesa, tomada compatível e, quando utilizar TV própria, equipamento em perfeito funcionamento com entrada HDMI disponível antes da chegada da equipe.</p>
  <p><b>Responsabilidade.</b> Após a instalação e teste dos equipamentos, a guarda e conservação passam a ser de responsabilidade do CONTRATANTE até a retirada.</p>
  <p><b>Uso adequado.</b> É proibido abrir equipamentos, alterar configurações, substituir cabos, conectar dispositivos não autorizados, mover o kit de local ou expor os equipamentos a líquidos, chuva, calor excessivo ou uso inadequado.</p>
  <p><b>Danos e ressarcimento.</b> Danos por quedas, impactos, líquidos, ligação elétrica inadequada, furto, roubo, extravio, mau uso ou atos de convidados, crianças, animais ou terceiros serão de responsabilidade do CONTRATANTE, que deverá ressarcir reparo ou substituição.</p>
  <p><b>Energia e equipamentos de terceiros.</b> Falhas, oscilações ou ausência de energia elétrica, bem como defeitos em TV ou equipamentos do cliente, não geram abatimento, indenização ou prorrogação do período contratado.</p>
  <p><b>Cancelamento.</b> O sinal pago reserva a data e não será devolvido em caso de desistência do CONTRATANTE, salvo acordo formal entre as partes.</p>
  <p><b>Conferência.</b> Caso não seja possível testar todos os equipamentos na retirada, a conferência poderá ocorrer em até 24 horas após o retorno à LOCADORA.</p>
  <h2>3. Checklist de Entrega</h2>${checklist}
  <h2>4. Orientações Rápidas ao Cliente</h2>
  <ul class="manual"><li>Deixe mesa, tomada e espaço prontos antes da instalação.</li><li>Se usar TV própria, confirme antes que a entrada HDMI está funcionando.</li><li>Não altere cabos, fontes ou configurações.</li><li>Evite líquidos próximos aos equipamentos.</li><li>Comunique imediatamente qualquer intercorrência.</li></ul>
  <div class="sign"><div>J.E. Diversões<br>LOCADORA</div><div>${safe(d.nome)}<br>CONTRATANTE</div></div>
  </div></body></html>`;
}
function openPrintableContract(d){
  if(!d){ alert('Contrato não encontrado.'); return; }
  const win=window.open('', '_blank');
  if(!win){ alert('O navegador bloqueou a abertura do contrato. Libere pop-ups para este site.'); return; }
  win.document.open();
  win.document.write(contractHtml(d));
  win.document.close();
}

function render(){
  let total=data.reduce((a,b)=>a+(+b.total||0),0),pend=data.reduce((a,b)=>a+(+b.saldo||0),0);
  if($('qtd'))$('qtd').textContent=data.length;
  if($('receita'))$('receita').textContent=money(total);
  if($('pendente'))$('pendente').textContent=money(pend);
  let f={};data.forEach(x=>f[x.pacote]=(f[x.pacote]||0)+1);
  if($('lider'))$('lider').textContent=Object.keys(f).sort((a,b)=>f[b]-f[a])[0]||'-';
  if($('prox'))$('prox').innerHTML=data.slice(-6).reverse().map(card).join('')||'<p class=muted>Nenhuma locação salva.</p>';
  if($('clientesList'))$('clientesList').innerHTML=data.map(x=>`<div class=item><b>${x.nome}</b><br><span class=muted>${x.telefone} | ${x.doc}<br>${x.endereco}</span></div>`).join('')||'<p class=muted>Nenhum cliente.</p>';
  if($('agendaList'))$('agendaList').innerHTML=data.slice().sort((a,b)=>(a.data||'').localeCompare(b.data||'')).map(card).join('')||'<p class=muted>Agenda vazia.</p>';
  if($('contratosList'))$('contratosList').innerHTML=data.map((x,i)=>`<div class=item><b>${x.contrato}</b> - ${x.nome}<br><span class=muted>${x.pacote} | ${money(x.total)}</span><br><button onclick="makeContract(${i})">Abrir contrato</button></div>`).join('')||'<p class=muted>Nenhum contrato.</p>';
  if($('financeiroList'))$('financeiroList').innerHTML=data.map(x=>`<div class=item><b>${x.nome}</b><br>Total ${money(x.total)} | Sinal ${money(x.sinal)} | Saldo ${money(x.saldo)}<br>${x.status}</div>`).join('')||'<p class=muted>Sem financeiro.</p>';
}
function card(x){return`<div class=item><b>${x.data||'sem data'} - ${x.nome}</b><br><span class=muted>${x.pacote} | ${money(x.total)} | ${x.status}</span></div>`}
checklist();render();