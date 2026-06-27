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
