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

Executar `cd qa && npm install && npm test`: 13 cenários Selenium, incluindo a asserção original de QA-EST-001 e duas regressões novas. O resultado da execução remota fica no PR da correção. Não se considera validado antes de conferir o CI.

## Continuidade
Esta entrega depende do PR #1 (`qa/test-automation`), ainda aberto. Revisar a suíte primeiro e depois retargetar a correção para main, sem duplicar commits. Próximo passo: validar sincronização/filtros com Firebase Emulator; não há integração real com Firebase nesta suíte. Os alertas por estoque mínimo e a lista de reposição já existem.
