import { scenario, assert, By } from './support.js';
import { Key } from 'selenium-webdriver';
async function login(p){
 await p.open();await p.fill('#loginEmail','qa@example.test');await p.fill('#loginPassword','SenhaQA123!');
 await p.click('#btnLogin');await p.waitText('#sideUserName','qa@example.test');
 await p.waitText('#kpiGrid','Total de itens');
}
async function nav(p,page){await p.click('.nav-item[onclick="nav(\''+page+'\',this)"]');}
async function movement(p,quantity,type='entrada',product='Produto QA'){
 await p.click('button[onclick="openMov()"]');
 await p.select('#mItem',product);await p.fill('#mQtd',quantity);await p.fill('#mMotivo','Movimento QA');
 if(type==='saida')await p.click('#btnSaida');
 await p.click('button[onclick="confirmarMov()"]');
}
scenario('login invalido mostra mensagem e libera botao',async p=>{
 await p.open();await p.fill('#loginEmail','qa@example.test');await p.fill('#loginPassword','Errada');
 await p.click('#btnLogin');await p.waitText('#loginError','E-mail ou senha incorretos.');
 assert.equal(await (await p.element('#btnLogin')).isEnabled(),true);
});
scenario('dashboard representa itens ok critico e zerado',async p=>{
 await login(p);
 const values=await p.driver.findElements(By.css('#kpiGrid .kpi-val'));
 assert.deepEqual(await Promise.all(values.map(v=>v.getText())),['3','1','1','1']);
});
scenario('cadastro adiciona produto e grava alteracao',async p=>{
 await login(p);await nav(p,'cadastro');
 await p.fill('#cNome','Novo QA');await p.select('#cCat','Papelaria');await p.fill('#cQtd',4);await p.fill('#cMin',1);
 await p.click('button[onclick="addItem()"]');await p.waitText('#cadTable','Novo QA');
 const data=await p.driver.executeScript('return window.__qaData()');
 assert.equal(data.items.find(i=>i.nome==='Novo QA').qtd,4);
});
scenario('cadastro rejeita nome duplicado sem gravar',async p=>{
 await login(p);await nav(p,'cadastro');
 await p.fill('#cNome','PRODUTO QA');await p.select('#cCat','Papelaria');
 await p.click('button[onclick="addItem()"]');await p.alert(/ja cadastrado/);
 assert.equal(await p.driver.executeScript('return window.__qaWrites.length'),0);
});
scenario('entrada soma saldo e grava historico',async p=>{
 await login(p);await movement(p,5);
 const d=await p.driver.executeScript('return window.__qaData()');
 assert.equal(d.items.find(i=>i.nome==='Produto QA').qtd,15);
 assert.equal(d.hist[0].tipo,'entrada');assert.equal(d.hist[0].qtd,5);
});
scenario('saida subtrai saldo e grava historico',async p=>{
 await login(p);await movement(p,3,'saida');
 const d=await p.driver.executeScript('return window.__qaData()');
 assert.equal(d.items.find(i=>i.nome==='Produto QA').qtd,7);
 assert.equal(d.hist[0].tipo,'saida');
});
scenario('saida superior ao saldo nao altera estoque',async p=>{
 await login(p);await movement(p,11,'saida');await p.alert(/Estoque insuficiente/);
 const d=await p.driver.executeScript('return window.__qaData()');
 assert.equal(d.items.find(i=>i.nome==='Produto QA').qtd,10);
 assert.equal(d.hist.length,0);assert.equal(await p.driver.executeScript('return window.__qaWrites.length'),0);
});
scenario('movimentacao zero exige quantidade positiva',async p=>{
 await login(p);await movement(p,0);await p.alert(/maior que zero/);
 assert.equal(await p.driver.executeScript('return window.__qaWrites.length'),0);
});
scenario('busca de estoque filtra itens',async p=>{
 await login(p);await nav(p,'estoque');await p.fill('#eSearch','Zerado QA');
 const table=await p.text('#estoqueTable');
 assert.match(table,/Zerado QA/);assert.doesNotMatch(table,/Produto QA/);
});

async function rows(p,table){
 const elements=await p.driver.findElements(By.css(table+' tbody tr'));
 return Promise.all(elements.map(e=>e.getText()));
}
async function productNames(p,table,column=1){
 const elements=await p.driver.findElements(By.css(`${table} tbody tr td:nth-child(${column})`));
 return Promise.all(elements.map(e=>e.getText()));
}
async function filterState(p){
 return p.driver.executeScript('return {saved:window.__qaData(),items:window.items,hist:window.hist,writes:window.__qaWrites.length}');
}
async function clearSearch(p,selector){
 // WebDriver.clear() pode não disparar input; apagar por teclas percorre o fluxo do usuário.
 const field=await p.element(selector);
 await field.sendKeys(Key.HOME,Key.chord(Key.SHIFT,Key.END),Key.BACK_SPACE);
 assert.equal(await field.getAttribute('value'),'');
}
scenario('filtros de estoque combinam busca categoria e status sem gravar',async p=>{
 await login(p);await nav(p,'estoque');
 const before=await filterState(p);
 const all=['Produto QA','Critico QA','Zerado QA'];
 await p.select('#eCat','Papelaria');
 assert.deepEqual(await productNames(p,'#estoqueTable'),all.slice(0,2));
 await p.select('#eStatus','repor');
 assert.deepEqual(await productNames(p,'#estoqueTable'),['Critico QA']);
 await p.fill('#eSearch','PRODUTO');
 assert.deepEqual(await rows(p,'#estoqueTable'),[]);
 await p.waitText('#estoqueTable','Nenhum produto encontrado.');
 await p.select('#eStatus','ok');
 assert.deepEqual(await productNames(p,'#estoqueTable'),['Produto QA']);
 await clearSearch(p,'#eSearch');
 await p.select('#eCat','Producao');
 assert.deepEqual(await rows(p,'#estoqueTable'),[]);
 await p.select('#eStatus','zerado');
 assert.deepEqual(await productNames(p,'#estoqueTable'),['Zerado QA']);
 await p.select('#eCat','');await p.select('#eStatus','');
 assert.deepEqual(await productNames(p,'#estoqueTable'),all);
 assert.deepEqual(await filterState(p),before,'filtros não alteram saldos, histórico ou persistência');
});

scenario('historico combina busca e tipo e restaura movimentacoes sem gravar',async p=>{
 await login(p);
 await movement(p,5);await committed(p,1);
 await movement(p,3,'saida');await committed(p,2);
 await movement(p,2,'entrada','Zerado QA');await committed(p,3);
 await nav(p,'movimentacoes');
 const before=await filterState(p);
 const all=await rows(p,'#histTable');
 assert.equal(all.length,3);
 await p.select('#hTipo','saida');
 assert.deepEqual(await productNames(p,'#histTable',2),['Produto QA']);
 assert.match((await rows(p,'#histTable'))[0],/Saida\s+-3/);
 await p.fill('#hSearch','ZERADO');
 assert.deepEqual(await rows(p,'#histTable'),[]);
 await p.waitText('#histTable','Nenhuma movimentacao encontrada.');
 await p.select('#hTipo','entrada');
 assert.deepEqual(await productNames(p,'#histTable',2),['Zerado QA']);
 assert.match((await rows(p,'#histTable'))[0],/Entrada\s+\+2/);
 await clearSearch(p,'#hSearch');
 assert.deepEqual(await productNames(p,'#histTable',2),['Zerado QA','Produto QA']);
 await p.select('#hTipo','');
 assert.deepEqual(await rows(p,'#histTable'),all);
 assert.deepEqual(await filterState(p),before,'consultar histórico não altera dados ou gravações');
});

async function committed(p,count){
 await p.driver.wait(()=>p.driver.executeScript(
  'return window.__qaWrites.length===arguments[0]&&document.getElementById("modalOverlay").style.display==="none"',count),
 10000,'movimentação concluída com uma única gravação');
}
async function kpis(p,expected){
 await p.driver.wait(async()=>JSON.stringify(await p.driver.executeScript(
  'return Array.from(document.querySelectorAll("#kpiGrid .kpi-val"),e=>e.textContent)'))===JSON.stringify(expected),
 10000,'KPIs devem refletir o saldo: '+expected.join(','));
}
scenario('retirada exata e reposicao atravessam estados zerado minimo e ok',async p=>{
 await login(p);
 const original=await p.driver.executeScript('return window.__qaData()');
 await movement(p,10,'saida');await committed(p,1);
 const depleted=await p.driver.executeScript('return window.__qaData()');
 assert.equal(depleted.items.find(i=>i.nome==='Produto QA').qtd,0);
 assert.deepEqual(depleted.hist.map(h=>[h.tipo,h.nome,h.qtd]),[['saida','Produto QA',10]]);
 await kpis(p,['3','0','1','2']);
 await movement(p,2);await committed(p,2);
 assert.equal(await p.driver.executeScript('return window.__qaData().items.find(i=>i.nome==="Produto QA").qtd'),2);
 await kpis(p,['3','0','2','1']);
 await movement(p,0.01);await committed(p,3);
 const restored=await p.driver.executeScript('return window.__qaData()');
 assert.equal(restored.items.find(i=>i.nome==='Produto QA').qtd,2.01);
 assert.deepEqual(restored.hist.map(h=>[h.tipo,h.nome,h.qtd]),[
  ['entrada','Produto QA',0.01],['entrada','Produto QA',2],['saida','Produto QA',10]
 ]);
 assert.deepEqual(restored.items.filter(i=>i.nome!=='Produto QA'),
  original.items.filter(i=>i.nome!=='Produto QA'),'movimentações não devem alterar outros produtos');
 await kpis(p,['3','1','1','1']);
});
scenario('movimentacoes fracionarias conservam saldo e ordem do historico',async p=>{
 await login(p);
 const original=await p.driver.executeScript('return window.__qaData()');
 let writes=0;
 for(const [quantity,type] of [[0.1,'entrada'],[0.2,'entrada'],[0.3,'saida']]){
  await movement(p,quantity,type);await committed(p,++writes);
 }
 const saved=await p.driver.executeScript('return window.__qaData()');
 assert.deepEqual(saved.items,original.items,'0,1 + 0,2 - 0,3 deve preservar o saldo exato');
 assert.deepEqual(saved.hist.map(h=>[h.tipo,h.nome,h.qtd,h.motivo]),[
  ['saida','Produto QA',0.3,'Movimento QA'],
  ['entrada','Produto QA',0.2,'Movimento QA'],
  ['entrada','Produto QA',0.1,'Movimento QA']
 ]);
 await kpis(p,['3','1','1','1']);
});
