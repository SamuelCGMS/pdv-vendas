# Operacao do PDV no Linear

Este documento define como organizar o trabalho do `pdv-moderno` no Linear de forma simples, objetiva e util para execucao real.

O objetivo nao e burocratizar.

O objetivo e:

- deixar claro o que entra agora
- separar o que e operacao do caixa do que e gestao
- facilitar implementacao, revisao e PR
- permitir que eu trabalhe usando o backlog como fonte de verdade

## Estado Atual

A estrutura inicial ja foi criada no Linear.

Use o Linear como fonte de verdade para execucao do backlog.

Projeto:

- `PDV Moderno Frontend`

Team:

- `Pdv-vendas`

Views criadas:

- `PDV - Projeto`
- `PDV - Sprint 1 - Operacao de Caixa`
- `PDV - Backlog`

## Estrutura Recomendada

Use o Linear de forma leve.

### Projeto

- `PDV Moderno Frontend`

### Status

Use apenas estes status:

- `Backlog`
- `Todo`
- `In Progress`
- `In Review`
- `Done`
- `Blocked`

### Labels

Use labels por modulo e tipo:

- `mod:Vendas`
- `mod:Estoque`
- `mod:Relatorios`
- `mod:Gestao`
- `tipo:Bug`
- `tipo:Feature`
- `tipo:Improvement`

### Prioridade

Use esta regra:

- `Urgent`: quebra operacao do caixa
- `High`: melhora diretamente velocidade e uso diario
- `Medium`: agrega valor de gestao ou conferencia
- `Low`: refinamento ou preparo para depois

## Como Vamos Trabalhar

Regra simples:

- tudo que impacta o caixa entra primeiro
- tudo que e visao gerencial entra depois
- tudo que for infraestrutura futura fica bloqueado

Forma de me acionar depois:

- `implemente a issue X`
- `revise a sprint atual`
- `prepare o PR da issue X`
- `quebre esta issue em subtarefas`

Se no futuro voce quiser usar multi-agents comigo, o ideal e que cada issue tenha escopo pequeno e separado.

Exemplo bom:

- uma issue para teclado
- outra para responsividade

Exemplo ruim:

- uma issue gigante chamada "melhorar o sistema inteiro"

## Ordem De Prioridade

Minha ordem recomendada para o momento atual e:

1. navegacao 100 por cento por teclado
2. ajuste fino para telas menores
3. resumo por operador
4. resumo por caixa
5. detalhamento por venda
6. detalhamento por produto
7. tela gerencial de auditoria de movimentos, se ainda fizer sentido
8. separacao entre telas operacionais e telas gerenciais

## Sprints Recomendadas

## Sprint 1 - Operacao de Caixa

Objetivo:

- melhorar velocidade, foco e confianca da operacao no caixa

Issues:

### 1. Implementar navegacao 100 por cento por teclado no PDV

Prioridade:

- `High`

Labels:

- `mod:Vendas`
- `tipo:Feature`

Descricao sugerida:

- Completar a navegacao por teclado da tela de vendas para que o operador consiga executar o fluxo principal com minima dependencia de mouse.

Checklist:

- navegar pela busca de produtos por teclado
- confirmar selecao de produto por teclado
- navegar pelos itens do cupom por teclado
- abrir modais principais por atalho
- fechar modais por teclado
- manter foco coerente ao abrir e fechar modal
- evitar perda de foco durante operacao
- documentar atalhos finais no frontend

Criterios de aceite:

- operador consegue vender sem depender do mouse no fluxo principal
- foco sempre volta para o campo correto
- atalhos nao conflitam com o fluxo atual
- comportamento funciona com dropdown, carrinho e modais

### 2. Ajustar layout do PDV para telas menores

Prioridade:

- `High`

Labels:

- `mod:Vendas`
- `tipo:Improvement`

Descricao sugerida:

- Refinar a tela de vendas para manter boa usabilidade em resolucoes menores de mercado sem quebrar legibilidade e sem comprometer a velocidade do operador.

Checklist:

- revisar largura minima dos paineis
- revisar overflow horizontal
- revisar altura util dos paineis
- revisar modais em resolucoes menores
- revisar busca, carrinho e resumo lateral
- revisar botoes criticos para toque e mouse
- revisar contraste e leitura em uso prolongado

Criterios de aceite:

- tela de vendas permanece utilizavel em resolucoes menores
- nao ha cortes graves de conteudo
- modais continuam acessiveis
- componentes principais nao se sobrepoem

## Sprint 2 - Resumo Operacional

Objetivo:

- dar visao rapida do dia por operador e por caixa

Issues:

### 3. Criar resumo por operador

Prioridade:

- `Medium`

Labels:

- `mod:Gestao`
- `tipo:Feature`

Descricao sugerida:

- Exibir resumo visual por operador com foco em acompanhamento rapido do turno.

Exemplos de indicadores:

- total vendido
- quantidade de vendas
- ticket medio
- descontos aplicados
- cancelamentos

### 4. Criar resumo por caixa

Prioridade:

- `Medium`

Labels:

- `mod:Gestao`
- `tipo:Feature`

Descricao sugerida:

- Exibir resumo visual por caixa para facilitar leitura operacional do turno e comparacao entre caixas.

Exemplos de indicadores:

- total vendido por caixa
- quantidade de vendas
- meios de pagamento
- sangria e suprimento
- diferencas de fechamento, quando essa base existir

## Sprint 3 - Relatorios Operacionais

Objetivo:

- melhorar conferencia e leitura gerencial da operacao

Issues:

### 5. Criar detalhamento por venda

Prioridade:

- `Medium`

Labels:

- `mod:Relatorios`
- `tipo:Feature`

Descricao sugerida:

- Exibir lista detalhada de vendas com filtros e leitura clara para conferencia operacional.

Exemplos de dados:

- horario
- operador
- caixa
- itens
- total
- desconto
- forma de pagamento

### 6. Criar detalhamento por produto

Prioridade:

- `Medium`

Labels:

- `mod:Relatorios`
- `tipo:Feature`
- `estoque`

Descricao sugerida:

- Exibir consolidado por produto para leitura de giro, faturamento e participacao.

Exemplos de dados:

- quantidade vendida
- faturamento
- share
- ticket por produto
- ranking

## Sprint 4 - Gestao Avancada

Objetivo:

- separar melhor operacao e gestao quando o modulo gerencial estiver mais maduro

Issues:

### 7. Criar tela gerencial de auditoria de movimentos

Prioridade:

- `Low`

Labels:

- `mod:Estoque`
- `mod:Gestao`
- `tipo:Improvement`

Descricao sugerida:

- Criar uma visao gerencial para auditoria de movimentos se a visao atual do catalogo nao for suficiente.

Observacao:

- hoje ja existe base parcial no modulo de catalogo com movimentacao, inventario e ajuste manual

### 8. Separar telas operacionais e telas gerenciais

Prioridade:

- `Low`

Labels:

- `mod:Gestao`
- `tipo:Improvement`

Descricao sugerida:

- Reorganizar a navegacao para separar melhor o que e operacao de caixa do que e leitura gerencial, ajudando a manter o app mais leve e mais direto.

## Modelo De Descricao De Issue

Use este formato no Linear:

### Contexto

- qual problema real isso resolve

### Escopo

- o que entra nesta issue

### Fora de escopo

- o que nao entra

### Criterios de aceite

- como validar que terminou

### Referencias

- arquivo
- doc
- screenshot

## Regra De Ouro

Se tiver duvida entre duas tasks, priorize a que melhora o caixa antes da que melhora a gestao.
