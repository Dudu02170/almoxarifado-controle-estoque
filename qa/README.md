# Regressão do almoxarifado
Node.js 22+, Chrome, JavaScript e Selenium.
```sh
cd qa
npm install
npm test
```
Dezesseis cenários cobrem login, KPIs, criação, duplicata, entrada, saída, saldo insuficiente, quantidade zero, limites e conservação de saldo fracionário, busca de produtos e combinações/restauração dos filtros de estoque e histórico. Os filtros verificam também a preservação dos dados e a ausência de gravações.
O servidor local substitui somente os imports de Firebase e bibliotecas externas por adaptadores de teste. HTML, handlers e cálculos vêm do código real. Banco em memória reinicia a cada navegador.
Dados e credenciais fictícios: qa@example.test / SenhaQA123!. E-mails são bloqueados.
Não valida o serviço Firebase, permissões de produção, concorrência ou entrega de e-mails. Evolução: usar Firebase Emulator para integração.
JUnit e evidências nas falhas em reports/. CI automática nos PRs.

## Histórico por período
Em Movimentações, preencher De e/ou Até limita a consulta por data, incluindo os dois dias. Os limites podem ser usados separadamente e combinados com busca e tipo. Um período invertido mostra uma mensagem; corrigir ou limpar os campos recupera a consulta. Sem datas, o histórico inteiro volta a aparecer, inclusive registros legados sem data reconhecível.

Três novas regressões usam `/?qaHistory=dates`, com seis movimentações fictícias distribuídas entre dezembro/2025, janeiro/2026, fevereiro/2026 e um registro Sem data. O adaptador QA fornece esses dados antes do login; os demais cenários continuam com o histórico vazio original. Os controles nativos de data recebem valores ISO via DOM e eventos input/change para evitar dependência da configuração regional do Chrome. Isso verifica os listeners e a tabela real, sem validar o calendário visual do navegador.

As verificações cobrem bordas inclusivas, mesmo dia, limites independentes, virada de mês/ano, combinação com nome/tipo, resultado vazio, período invertido, recuperação e ausência de gravações ou alterações de saldo/histórico.
