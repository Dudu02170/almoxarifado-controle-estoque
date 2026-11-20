# QA-EST-001 — Busca e filtros fora do escopo do módulo

## Correção proposta
Os cinco controles de Produtos e Movimentações agora registram `input`/`change` dentro do script module. As funções de renderização continuam locais e os critérios existentes de busca, categoria e status/tipo são preservados.

## Evidência anterior
A versão `590bc31` permanece com 10/11 cenários passando: buscar "Zerado QA" mantém os três produtos visíveis.
GitHub Actions: https://github.com/Dudu02170/almoxarifado-controle-estoque/actions/runs/44330277133
Causa: callbacks inline tentavam chamar `renderEstoque`/`renderHist`, funções internas do módulo.

## Critérios de aceitação e reprodução
- Login com dados fictícios; em Produtos, buscar "Zerado QA" deve mostrar somente esse item.
- Combinar busca, categoria e status deve produzir a interseção dos filtros, inclusive resultado vazio. Limpar os controles restaura os três produtos.
- Em Movimentações, combinar nome e entrada/saída deve filtrar o histórico. Limpar os controles restaura as linhas e sua ordem.
- Filtrar não deve modificar produtos, histórico ou realizar gravações.

Executar `cd qa && npm install && npm test`: 16 cenários Selenium, incluindo a asserção original de QA-EST-001 e duas regressões novas. O resultado da execução remota fica no PR da correção. Não se considera validado antes de conferir o CI.

## Continuidade
Esta entrega depende do PR #1 (`qa/test-automation`), ainda aberto. Revisar a suíte primeiro e depois retargetar a correção para main, sem duplicar commits. Próximo passo: validar sincronização/filtros com Firebase Emulator e conferir os controles de data em outros navegadores; não há integração real com Firebase nesta suíte. Os alertas por estoque mínimo e a lista de reposição já existem.

## Evolução — consulta do histórico por período
A versão anterior só permitia nome e tipo. A entrega acrescenta De/Até com limites inclusivos e independentes, combinados com os filtros existentes. Critérios: janeiro de 2026 inclui 01/01 e 31/01; uma data única limita ao próprio dia; período invertido deve informar erro e remover resultados obsoletos; corrigir/limpar restaura a consulta sem alterar dados ou gravar.

Datas armazenadas continuam em DD/MM/AAAA. A comparação converte somente valores válidos para ISO, sem mudar o armazenamento ou ordenar novamente o histórico. Quando há limite de data, registros sem data reconhecível ficam fora do resultado; sem limites, continuam visíveis. Não há migração nem exclusão de registros.

Validação local: sintaxe e diff --check aprovados; a função real de conversão passou em verificações de virada de ano, ano bissexto, datas impossíveis e valores ausentes. Validação Selenium final e evidências devem ser conferidas no PR #2. A suíte tem 16 casos, incluindo as três novas regressões do período com fixture declarada em qa/sandbox.js.
