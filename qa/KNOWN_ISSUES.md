# Defeito reproduzido pela automação
## QA-EST-001 — Busca de produtos não filtra a tabela
Reprodução em sandbox: entrar com qa@example.test, abrir Produtos e digitar "Zerado QA" em eSearch.
Esperado: somente Zerado QA permanece na tabela.
Obtido: os três produtos continuam visíveis.
Evidência: https://github.com/Dudu02170/almoxarifado-controle-estoque/actions/runs/43980013410
Causa observada no código: oninput="renderEstoque()" está no HTML, mas renderEstoque é uma declaração interna do script type="module", sem exposição ao window. O callback inline não consegue encontrá-la.
A suíte mantém a expectativa funcional e fica vermelha neste cenário. O sandbox não muda escopo dos módulos.
Sugestão de correção: registrar os listeners dentro do módulo; conferir também renderHist e os filtros inline.
Validação das regras reais do Firebase continua fora do escopo.
