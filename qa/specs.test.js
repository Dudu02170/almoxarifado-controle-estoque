import { scenario, assert, By } from './support.js';
async function login(p){
 await p.open();await p.fill('#loginEmail','qa@example.test');await p.fill('#loginPassword','SenhaQA123!');
 await p.click('#btnLogin');await p.waitText('#sideUserName','qa@example.test');
 await p.waitText('#kpiGrid','Total de itens');
}
async function nav(p,page){await p.click('.nav-item[onclick="nav(\''+page+'\',this)"]');}
async function movement(p,quantity,type='entrada'){
 await p.click('button[onclick="openMov()"]');
 await p.select('#mItem','Produto QA');await p.fill('#mQtd',quantity);await p.fill('#mMotivo','Movimento QA');
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
