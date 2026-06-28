const $=id=>document.getElementById(id);
function dados(){
return {
nome:$('nome').value,doc:$('doc').value,telefone:$('telefone').value,email:$('email').value,endereco:$('endereco').value,
data:$('data').value,inicio:$('inicio').value,retirada:$('retirada').value,local:$('local').value,evento:$('evento').value,tv:$('tv').value,obs:$('obs').value
}}
function texto(d){
return `#CADASTRO_JE
Nome: ${d.nome}
CPF/CNPJ: ${d.doc}
Telefone: ${d.telefone}
E-mail: ${d.email}
Endereço: ${d.endereco}
Data do evento: ${d.data}
Horário início: ${d.inicio}
Horário retirada: ${d.retirada}
Local instalação: ${d.local}
Tipo de evento: ${d.evento}
TV: ${d.tv}
Observações: ${d.obs}
#FIM_CADASTRO_JE`}
function gerar(){ $('saida').value=texto(dados()); }
function copiar(){ gerar(); navigator.clipboard.writeText($('saida').value); alert('Dados copiados.'); }
function enviarWhats(){ gerar(); const msg=encodeURIComponent($('saida').value); window.open(`https://wa.me/5511967444383?text=${msg}`,'_blank'); }
