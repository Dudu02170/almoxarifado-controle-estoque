# Almoxarifado · Controle de Estoque

Sistema web de almoxarifado para uma indústria controlar materiais de escritório, brindes, informática, limpeza e itens de produção. A equipe registra entradas e saídas, vê o que está acabando e gera o pedido de compra com um clique.

> Versão de portfólio: o nome da empresa, os e-mails e as credenciais foram removidos.

## Funcionalidades

- **Dashboard** com totais, itens críticos, últimas movimentações e gráfico de itens por categoria (Chart.js).
- **Produtos** com busca e filtros por categoria e por situação: **OK**, **Repor** (abaixo do mínimo) e **Zerado**.
- **Movimentações** de entrada e saída com motivo e histórico filtrável por produto, tipo e período (datas inicial/final inclusivas).
- **Reposição:** lista automática dos itens abaixo do estoque mínimo, com quantidade sugerida (dobro do mínimo).
- **Pedido de compra** pronto para imprimir ou enviar por e-mail (EmailJS).
- **Resumo semanal** do almoxarifado enviado por e-mail.
- **Cadastro** de itens e categorias.
- **Sincronização em tempo real** entre computadores com Cloud Firestore e login com Firebase Authentication.

## Como rodar

1. Crie um projeto no [Firebase](https://console.firebase.google.com) com **Authentication (e-mail e senha)** e **Cloud Firestore**.
2. No `index.html`, preencha o objeto `firebaseConfig` com os dados do seu app da Web.
3. Em `EMAILS_DESTINO`, coloque os e-mails que vão receber o pedido de compra e o resumo.
4. Para o envio de e-mail, crie uma conta gratuita no [EmailJS](https://www.emailjs.com/) e informe o Service ID, o Template ID e a Public Key na tela de envio.
5. Abra o `index.html` com um servidor estático (`npx serve .`) ou publique com `firebase deploy --only hosting`.

## Tecnologias

JavaScript (módulos ES) · HTML · CSS · Firebase Authentication · Cloud Firestore · Chart.js · EmailJS

## Autor

**Eduardo Consul** · [LinkedIn](https://www.linkedin.com/in/eduardo-consul/) · [GitHub](https://github.com/Dudu02170)
