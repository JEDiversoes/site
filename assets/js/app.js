const JE_PHONE = '5511967444383';
const WA_BASE = `https://wa.me/${JE_PHONE}?text=`;

function whats(text){ window.open(WA_BASE + encodeURIComponent(text), '_blank'); }

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-whatsapp]');
  if(btn){ e.preventDefault(); whats(btn.getAttribute('data-whatsapp')); }
});

function getVal(id){ return (document.getElementById(id)?.value || '').trim(); }
function getChecked(name){ return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x => x.value); }
function money(v){ const n = Number(String(v).replace(',','.')) || 0; return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

function bindForm(){
  const form = document.getElementById('clientForm');
  if(!form) return;

  const tvChoice = document.getElementById('tvChoice');
  const tvAlert = document.getElementById('tvAlert');
  if(tvChoice){
    tvChoice.addEventListener('change', () => {
      tvAlert.classList.toggle('hidden', tvChoice.value !== 'TV própria do cliente');
    });
  }

  const out = document.getElementById('clientOutput');
  const internalOut = document.getElementById('internalOutput');
  const internalArea = document.getElementById('internalArea');
  const unlock = document.getElementById('unlockInternal');
  const pass = document.getElementById('internalPass');

  unlock?.addEventListener('click', () => {
    if(pass.value.trim().toUpperCase() === 'JE2026'){
      internalArea.classList.remove('hidden');
      pass.value = '';
    } else {
      alert('Código incorreto.');
    }
  });

  function buildClient(){
    return `*CADASTRO DE LOCAÇÃO - CLIENTE*\n\n`+
      `Nome/Razão social: ${getVal('nome')}\n`+
      `CPF/CNPJ: ${getVal('documento')}\n`+
      `Telefone: ${getVal('telefone')}\n`+
      `E-mail: ${getVal('email')}\n\n`+
      `*EVENTO*\n`+
      `Data: ${getVal('dataEvento')}\n`+
      `Horário de início: ${getVal('horaInicio')}\n`+
      `Horário de retirada: ${getVal('horaRetirada')}\n`+
      `Tipo de evento: ${getVal('tipoEvento')}\n`+
      `Convidados: ${getVal('convidados')}\n`+
      `Endereço de instalação: ${getVal('enderecoInstalacao')}\n`+
      `Endereço de retirada: ${getVal('enderecoRetirada') || 'Mesmo local da instalação'}\n\n`+
      `*ESTRUTURA*\n`+
      `TV: ${getVal('tvChoice')}\n`+
      `Mesa disponível: ${getVal('mesa')}\n`+
      `Tomada 110V próxima: ${getVal('tomada')}\n`+
      `Responsável na entrega: ${getVal('responsavel')}\n\n`+
      `Observações do cliente: ${getVal('obsCliente') || 'Sem observações.'}`;
  }

  function buildInternal(){
    const adicionais = getChecked('adicionais');
    const total = (Number(getVal('valorPacote').replace(',','.'))||0) +
      (Number(getVal('valorAdicionais').replace(',','.'))||0) +
      (Number(getVal('valorFrete').replace(',','.'))||0) -
      (Number(getVal('valorDesconto').replace(',','.'))||0);
    const sinal = Number(getVal('valorSinal').replace(',','.'))||0;
    const restante = total - sinal;
    return buildClient()+`\n\n------------------------------\n*ÁREA INTERNA J.E.*\n\n`+
      `Pacote contratado: ${getVal('pacoteInterno')}\n`+
      `Adicionais: ${adicionais.length ? adicionais.join(', ') : 'Nenhum'}\n`+
      `Valor do pacote: ${money(getVal('valorPacote'))}\n`+
      `Valor dos adicionais: ${money(getVal('valorAdicionais'))}\n`+
      `Frete/deslocamento: ${money(getVal('valorFrete'))}\n`+
      `Desconto: ${money(getVal('valorDesconto'))}\n`+
      `Valor total: ${money(total)}\n`+
      `Sinal: ${money(sinal)}\n`+
      `Restante: ${money(restante)}\n`+
      `Forma de pagamento: ${getVal('pagamento')}\n`+
      `Status: ${getVal('statusInterno')}\n`+
      `Observações internas: ${getVal('obsInterna') || 'Sem observações.'}`;
  }

  document.getElementById('gerarCliente')?.addEventListener('click', () => { out.textContent = buildClient(); });
  document.getElementById('copiarCliente')?.addEventListener('click', async () => { await navigator.clipboard.writeText(out.textContent || buildClient()); alert('Resumo do cliente copiado.'); });
  document.getElementById('enviarCliente')?.addEventListener('click', () => whats(buildClient()));
  document.getElementById('gerarInterno')?.addEventListener('click', () => { internalOut.textContent = buildInternal(); });
  document.getElementById('copiarInterno')?.addEventListener('click', async () => { await navigator.clipboard.writeText(internalOut.textContent || buildInternal()); alert('Resumo interno copiado.'); });
  document.getElementById('enviarInterno')?.addEventListener('click', () => whats(buildInternal()));
}

bindForm();


function bindContractPanel(){
  const panel=document.getElementById('contractPanel');
  if(!panel) return;
  const q=id=>document.getElementById(id);
  const v=id=>(q(id)?.value||'').trim();
  const set=(id,val)=>{ if(q(id) && val) q(id).value=val.trim(); };
  const line=(label,text)=>{ const m=(text||'').match(new RegExp(label+'\\s*:\\s*(.*)','i')); return m?m[1].trim():''; };
  const brDate=d=>{ if(!d) return ''; const [y,m,day]=d.split('-'); return `${day}/${m}/${y}`; };
  const moneyBR=n=>{ const num=Number(String(n||0).replace(',','.'))||0; return num.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); };
  const addList=()=>[...document.querySelectorAll('input[name="cAdicionais"]:checked')].map(x=>x.value);
  q('importarDados')?.addEventListener('click',()=>{
    const t=v('dadosCliente');
    set('cNome', line('Nome/Razão social',t)); set('cDoc', line('CPF/CNPJ',t)); set('cTel', line('Telefone',t)); set('cEmail', line('E-mail',t));
    set('cDataEvento', line('Data',t)); set('cHoraInicio', line('Horário de início',t)); set('cHoraRetirada', line('Horário de retirada',t));
    set('cEndereco', line('Endereço de instalação',t)); set('cRetiradaEndereco', line('Endereço de retirada',t));
    alert('Dados importados. Revise os campos antes de gerar o contrato.');
  });
  function buildContractHTML(){
    const total=(Number(v('cValorPacote'))||0)+(Number(v('cValorAdicionais'))||0)+(Number(v('cValorFrete'))||0)-(Number(v('cDesconto'))||0);
    const sinal=Number(v('cSinal'))||0; const restante=total-sinal; const adicionais=addList();
    const pacote=v('cPacote');
    const itensPacote = pacote==='Bronze' ? '02 microfones, sendo 01 sem fio e 01 com fio; kit completo de funcionamento; caixa de som; cabeamento necessário; fila de músicas; pontuação ao final da canção.' : pacote==='Prata' ? '02 microfones sem fio; kit completo de funcionamento; caixa de som; cabeamento necessário; fila de músicas; pontuação em tempo real e pontuação ao final da canção.' : '02 microfones sem fio; kit completo de funcionamento; caixa de som; cabeamento necessário; fila de músicas; pontuação em tempo real; pontuação ao final da canção; modo Versus com pontuação individual por microfone.';
    return `<div class="contract-title"><h2>CONTRATO DE LOCAÇÃO DE EQUIPAMENTO KARAOKÊ Nº ${v('contratoNumero')||'____/2026'}</h2><p class="muted">J.E. Diversões M.E. - CNPJ 52.053.866/0001-64</p></div>
    <div class="contract-block"><strong>LOCADORA:</strong> J.E. Diversões M.E., CNPJ 52.053.866/0001-64, situada à R. Jequirituba, 401 - Jardim Malia II, São Paulo - SP, 04821-035.</div>
    <div class="contract-block"><strong>LOCATÁRIO(A):</strong> ${v('cNome')||'________________'}, CPF/CNPJ ${v('cDoc')||'________________'}, telefone ${v('cTel')||'________________'}, e-mail ${v('cEmail')||'________________'}, endereço ${v('cEndereco')||'________________'}.</div>
    <h3>CLÁUSULA I - OBJETO, PACOTE E ENCARGOS</h3><div class="contract-block">O presente contrato celebra a locação do <strong>Pacote ${pacote}</strong> para o dia <strong>${brDate(v('cDataEvento'))||'__/__/____'}</strong>, com início às <strong>${v('cHoraInicio')||'__:__'}</strong> e retirada prevista às <strong>${v('cHoraRetirada')||'__:__'}</strong>.</div>
    <div class="contract-block"><strong>Itens do pacote:</strong> ${itensPacote}</div>
    <div class="contract-block"><strong>Adicionais contratados:</strong> ${adicionais.length?adicionais.join(', '):'Nenhum adicional contratado.'}</div>
    <table><tr><th>Descrição</th><th>Valor</th></tr><tr><td>Pacote ${pacote}</td><td>${moneyBR(v('cValorPacote'))}</td></tr><tr><td>Adicionais</td><td>${moneyBR(v('cValorAdicionais'))}</td></tr><tr><td>Frete / deslocamento</td><td>${moneyBR(v('cValorFrete'))}</td></tr><tr><td>Desconto</td><td>${moneyBR(v('cDesconto'))}</td></tr><tr><th>Total</th><th>${moneyBR(total)}</th></tr><tr><td>Sinal / adiantamento</td><td>${moneyBR(sinal)}</td></tr><tr><td>Valor restante</td><td>${moneyBR(restante)}</td></tr><tr><td>Forma de pagamento</td><td>${v('cPagamento')}</td></tr></table>
    <h3>CLÁUSULA II - LOCAL E INSTALAÇÃO</h3><div class="contract-block">Os equipamentos serão instalados no endereço informado pelo(a) Locatário(a): <strong>${v('cEndereco')||'________________'}</strong>. O local deverá estar pronto para instalação, com mesa disponível, tomada 110V próxima e, quando utilizada TV própria, entrada HDMI funcionando.</div><div class="contract-block"><strong>Endereço de retirada:</strong> ${v('cRetiradaEndereco')||'Mesmo local da instalação.'}</div>
    <h3>CLÁUSULA III - RESPONSABILIDADE E CONSERVAÇÃO</h3><div class="contract-block">O equipamento ficará sob responsabilidade do(a) Locatário(a) durante o período de locação, devendo ser utilizado com zelo, sem alteração de configurações, sem exposição a líquidos, quedas, impactos ou uso inadequado dos microfones, cabos, fontes, controles e demais acessórios.</div>
    <h3>CHECKLIST RESUMIDO</h3><div class="contract-block">Pacote: ${pacote}. Adicionais: ${adicionais.length?adicionais.join(', '):'nenhum'}. Observações internas: ${v('cObs')||'sem observações.'}</div>
    <div class="contract-block">São Paulo, ${brDate(v('dataEmissao'))||'__/__/____'}.</div><div class="signatures"><div class="signature-line">J.E. DIVERSÕES<br>Locadora</div><div class="signature-line">${v('cNome')||'LOCATÁRIO(A)'}<br>Locatário(a)</div></div>`;
  }
  function buildPlain(){ const div=document.createElement('div'); div.innerHTML=buildContractHTML().replace(/<br>/g,'\n'); return div.innerText; }
  q('gerarContrato')?.addEventListener('click',()=>{ q('contractPreview').innerHTML=buildContractHTML(); });
  q('copiarContrato')?.addEventListener('click',async()=>{ await navigator.clipboard.writeText(buildPlain()); alert('Texto do contrato copiado.'); });
  q('imprimirContrato')?.addEventListener('click',()=>{ q('contractPreview').innerHTML=buildContractHTML(); window.print(); });
}
bindContractPanel();
