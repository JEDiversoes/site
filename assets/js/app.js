const phone='5511967444383';
const wa=(msg)=>`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll('[data-whatsapp]').forEach(a=>{a.href=wa(a.getAttribute('data-whatsapp'))});
const form=document.querySelector('#contractForm');
if(form){
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(form);
  const adicionais=[...form.querySelectorAll('input[name="adicionais"]:checked')].map(x=>x.value).join(', ')||'Nenhum';
  const msg=`Olá! Seguem os dados para elaboração do contrato J.E. Diversões:%0A%0A`+
  `Nome/Razão Social: ${fd.get('nome')}%0A`+
  `CPF/CNPJ: ${fd.get('documento')}%0A`+
  `Telefone: ${fd.get('telefone')}%0A`+
  `E-mail: ${fd.get('email')}%0A`+
  `Endereço do cliente: ${fd.get('endereco_cliente')}%0A%0A`+
  `Data do evento: ${fd.get('data_evento')}%0A`+
  `Horário de instalação: ${fd.get('hora_instalacao')}%0A`+
  `Horário de retirada: ${fd.get('hora_retirada')}%0A`+
  `Local de instalação: ${fd.get('local_instalacao')}%0A`+
  `Local de retirada: ${fd.get('local_retirada') || 'Mesmo local da instalação'}%0A%0A`+
  `Pacote: ${fd.get('pacote')}%0A`+
  `Adicionais: ${adicionais}%0A`+
  `Valor combinado: ${fd.get('valor')}%0A`+
  `Sinal/adiantamento: ${fd.get('sinal')}%0A`+
  `Forma de pagamento: ${fd.get('pagamento')}%0A`+
  `Observações: ${fd.get('observacoes') || 'Sem observações'}`;
  window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
 });
}
