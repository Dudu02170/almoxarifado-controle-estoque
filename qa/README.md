# Regressão do almoxarifado
Node.js 22+, Chrome, JavaScript e Selenium.
```sh
cd qa
npm install
npm test
```
Treze cenários cobrem login, KPIs, criação, duplicata, entrada, saída, saldo insuficiente, quantidade zero, limites e conservação de saldo fracionário, busca de produtos e combinações/restauração dos filtros de estoque e histórico. Os filtros verificam também a preservação dos dados e a ausência de gravações.
O servidor local substitui somente os imports de Firebase e bibliotecas externas por adaptadores de teste. HTML, handlers e cálculos vêm do código real. Banco em memória reinicia a cada navegador.
Dados e credenciais fictícios: qa@example.test / SenhaQA123!. E-mails são bloqueados.
Não valida o serviço Firebase, permissões de produção, concorrência ou entrega de e-mails. Evolução: usar Firebase Emulator para integração.
JUnit e evidências nas falhas em reports/. CI automática nos PRs.
