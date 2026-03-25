# Roadmap Frontend do PDV

Este documento registra tudo o que ja foi levantado sobre o frontend do PDV nesta fase do projeto, sem entrar em banco de dados, persistencia real ou arquitetura de rede.

## Objetivo Deste Documento

- concentrar o que ja existe nas telas
- listar tudo o que ainda falta no frontend
- registrar decisoes tomadas durante a conversa
- definir uma ordem pratica de evolucao visual

## O Que Ja Existe

O sistema ja possui base visual para as areas principais:

- Vendas
- Caixa
- Estoque
- Resumo
- Relatorios
- Ajustes

Tambem ja existem elementos importantes de fluxo visual:

- pagamento
- estacionamento de venda
- CPF na nota
- recibo/cupom visual
- TEF visual
- balanca

## Decisoes Ja Alinhadas

- O foco agora e frontend e telas.
- Banco de dados, persistencia e arquitetura local ficam para depois.
- O sistema continua com modo web para acompanhar visualmente e modo desktop para validar o app real.
- Atalhos podem ser provisiorios nesta fase e depois podem ser trocados para combinar com o sistema de referencia.
- Integracoes como impressora podem ter a tela preparada agora, mesmo sem teste real.

## Observacoes Importantes

### Excluir item x Cancelar item

Hoje ja existe a remocao visual do item pelo icone de lixeira na venda.

Neste momento, isso atende bem a necessidade de retirar item da lista.

No futuro, "cancelar item" pode virar algo mais formal do que apenas excluir:

- pedir confirmacao
- pedir motivo
- exigir supervisor em alguns casos
- registrar o cancelamento de forma separada

Conclusao:

- agora: a lixeira atende
- depois: pode evoluir para um fluxo formal de cancelamento

### Consulta de preco

Hoje a busca na venda ja ajuda bastante:

- se pesquisar por codigo, o produto aparece
- se pesquisar por nome, o produto aparece
- o preco ja fica visivel no retorno da busca

Isso ja serve como consulta simples durante desenvolvimento.

Mesmo assim, uma tela ou modal proprio de "Consulta de Preco" pode fazer sentido depois, porque no uso real ela pode:

- evitar adicionar o item na venda por engano
- permitir consulta rapida por operador
- funcionar como modo dedicado para balcao/caixa

Conclusao:

- agora: nao e obrigatoria
- depois: vale considerar como melhoria de usabilidade

### Impressora

- a parte visual pode ser criada agora
- o teste real pode ficar para depois
- a ausencia da impressora configurada nao impede a construcao da tela

### Atalhos

- podem ser criados como quiser nesta fase
- depois voce pode trocar para o padrao do sistema de referencia

## Tudo O Que Ainda Falta No Frontend

## 1. Frente de Caixa / Vendas

Objetivo:

Deixar a tela de venda mais completa e mais proxima de um PDV de verdade.

O que ainda falta:

- editar quantidade do item ja lancado
- aplicar desconto por item
- aplicar desconto no total da venda
- melhorar o fluxo de cancelamento da compra inteira
- ter confirmacao melhor para cancelar compra
- evoluir remocao de item para cancelamento formal no futuro, se necessario
- criar tela ou fluxo de troca/devolucao
- decidir no futuro se havera tela dedicada de consulta de preco
- criar tela ou modal de atalhos do operador
- reforcar navegacao por teclado
- melhorar feedback visual ao lancar produto
- melhorar estados de erro, sucesso e confirmacao
- substituir `alert` por feedback visual melhor
- revisar estados vazios
- revisar estados de erro
- melhorar o uso em resolucoes menores de mercado

Observacao:

- a lixeira atual ja cobre a exclusao simples de item
- consulta de preco dedicada nao e urgente agora

## 2. Estoque / Catalogo / Produto

Objetivo:

Sair da listagem simples e ter um modulo visual de cadastro e edicao de produto.

O que ainda falta:

- modal ou pagina de novo produto
- modal ou pagina de editar produto
- formulario completo de produto
- campos de codigo de barras
- nome do produto
- categoria
- unidade
- preco de custo
- preco de venda
- margem sugerida
- indicador de produto pesavel
- indicador de produto por unidade
- tela de movimentacao de estoque
- tela de inventario
- tela de ajuste manual de estoque

## 3. Ajustes

Objetivo:

Completar a area administrativa visual do sistema.

O que ainda falta:

- identificar caixa/terminal
- tela para escolher modo do sistema
- modo servidor
- modo cliente
- modo servidor + caixa
- area visual para impressora
- area visual para TEF
- configuracao visual do cupom/rodape
- backup
- exportacao
- usuarios
- permissoes

Observacao:

- impressora e TEF podem ter a interface feita agora, mesmo sem teste real

## 4. Resumo

Objetivo:

Deixar a visao de resumo mais util no uso diario.

O que ainda falta:

- mais filtros visuais
- resumo por operador
- resumo por caixa
- mais detalhamento de vendas
- historico visual mais claro
- exportacoes mais explicitas

## 5. Relatorios

Objetivo:

Deixar os relatorios mais operacionais e menos demonstrativos.

O que ainda falta:

- filtros por periodo mais ricos
- detalhamento por venda
- detalhamento por produto
- resumo por operador
- resumo por caixa
- tela de auditoria de movimentos
- exportacao mais clara
- apresentacao mais forte para analise operacional

## 6. Experiencia do Operador

Objetivo:

Melhorar velocidade de uso, clareza e conforto de operacao.

O que ainda falta:

- overlay ou lista de atalhos
- navegacao 100 por cento por teclado
- feedback visual mais forte ao bipar codigo
- modal padrao de confirmacao
- toasts no lugar de `alert`
- estados vazios melhores
- estados de erro melhores
- ajuste fino para telas menores
- revisao de contraste e legibilidade
- revisao de espacamento para uso prolongado

## O Que Nao E Prioridade Agora

Nao entra nesta fase:

- banco de dados
- persistencia real
- rede local
- servidor local
- integracao completa com impressora
- integracao completa com TEF
- regras profundas de auditoria

Esses pontos existem, mas ficam para outra etapa.

## Ordem Recomendada De Trabalho

1. Completar a tela de Vendas
2. Fazer cadastro e edicao de produto
3. Completar Ajustes
4. Refinar Resumo
5. Refinar Relatorios
6. Melhorar experiencia do operador

## Resumo Final

Se a prioridade continuar sendo frontend puro, o melhor caminho agora e:

- fortalecer Vendas
- fechar Estoque com cadastro visual
- completar Ajustes
- melhorar Resumo e Relatorios
- padronizar a experiencia do operador

Assim o sistema fica visualmente muito mais completo antes de entrar na fase de dados e integracoes reais.
