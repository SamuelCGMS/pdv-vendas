# Sprint Frontend: Estoque e Produtos

Data: 2026-03-29

## Uso Deste Documento

Este documento agora serve para dois objetivos:

- orientar revisao tecnica humana ou por IA
- dar contexto suficiente para montar ou subir um PR sem depender de memoria da conversa

## Objetivo

Implementar no frontend o que estava pendente no roadmap para o módulo de estoque/produtos, usando dados mock e deixando a estrutura pronta para conexão posterior com backend.

## Resumo Executivo Do PR

Este PR cria um módulo visual completo de estoque/produtos no frontend e conecta esse catálogo mock à frente de caixa.

Em termos práticos, a entrega substitui a antiga listagem simples de estoque por um fluxo com:

- cadastro e edição visual de produto
- múltiplos códigos de barras
- indicador de produto pesável e por unidade
- movimentações de estoque
- inventário visual
- ajuste manual de estoque

Também passa a usar o mesmo catálogo na busca da venda, reduzindo divergência entre a aba de estoque e a frente de caixa.

## Escopo Entregue

### 1. Módulo visual completo de estoque

- nova área visual de estoque com navegação por abas:
  - Produtos
  - Movimentações
  - Inventário
  - Ajuste Manual
- resumo operacional com indicadores:
  - total de produtos
  - produtos com estoque baixo
  - produtos zerados
  - produtos com estoque negativo
  - valor em custo
  - valor potencial de venda

### 2. Cadastro e edição visual de produto

- criação de modal de novo produto
- criação de modal de edição de produto
- formulário visual com os campos:
  - código principal
  - códigos adicionais
  - nome do produto
  - categoria
  - unidade
  - preço de custo
  - preço de venda
  - margem sugerida
  - estoque mínimo
  - indicador de produto por unidade
  - indicador de produto pesável

### 3. Catálogo mock compartilhado

- criação de um catálogo mock tipado para o módulo de estoque
- compartilhamento do mesmo catálogo com a frente de caixa
- suporte a busca por:
  - nome
  - categoria
  - código principal
  - códigos adicionais

### 4. Movimentação de estoque

- criação de tela de movimentações
- listagem de histórico com:
  - data e hora
  - produto
  - tipo de movimento
  - delta
  - estoque antes
  - estoque depois
  - motivo
  - operador

### 5. Inventário visual

- criação de tela de inventário
- entrada de contagem por produto
- comparação do saldo atual com a contagem informada
- geração de movimentações apenas para divergências

### 6. Ajuste manual de estoque

- criação de tela de ajuste manual
- suporte a três modos:
  - entrada/acréscimo
  - saída/perda
  - definir saldo final
- registro de motivo e operador

## Decisão Arquitetural Principal

O catálogo mock deixou de ficar espalhado entre listagem e venda e passou a ter um fluxo centralizado.

Estratégia adotada:

- o domínio de catálogo/estoque foi isolado em `src/renderer/src/features/catalog`
- o estado do catálogo agora vive em um controller dedicado
- a aba `Estoque` consome esse controller para renderizar a UI
- a frente de caixa recebe os produtos já derivados desse mesmo catálogo

Impacto:

- o frontend continua 100 por cento mockado
- o estado ainda não persiste
- a estrutura ficou pronta para trocar o mock por backend depois, com menor retrabalho

## O Que Mudou Em Termos De Fluxo

Antes:

- `Estoque` era apenas uma listagem simples
- a venda buscava produtos de um mock separado
- não havia cadastro visual de produto
- não havia telas de inventário, movimentação ou ajuste manual

Depois:

- `Estoque` virou um workspace com abas operacionais
- o catálogo passou a ser editável visualmente
- a venda usa o mesmo conjunto de produtos
- códigos adicionais passaram a entrar na busca do PDV
- estoque mínimo, custo, margem e modo de venda passaram a existir no frontend

## Regras e Estrutura Criadas

- tipagem dedicada para o domínio de catálogo/estoque
- helpers de domínio para:
  - normalização de códigos
  - cálculo de margem sugerida
  - cadastro e atualização de produto
  - ajuste manual
  - reconciliação de inventário
  - busca de produtos
  - classificação de status de estoque

## Ordem Recomendada De Leitura Para Revisão

Se a revisão for feita por IA ou por uma pessoa que ainda não conhece a mudança, esta é a ordem mais eficiente:

1. `src/renderer/src/pages/PointOfSale.jsx`
2. `src/renderer/src/features/catalog/useCatalogController.ts`
3. `src/renderer/src/features/catalog/CatalogWorkspace.tsx`
4. `src/renderer/src/features/catalog/CatalogProductModal.tsx`
5. `src/renderer/src/features/catalog/catalogModel.ts`
6. `src/renderer/src/features/sales/usePointOfSaleController.ts`
7. `src/shared/sales.ts`
8. `tsconfig.web.json`

## Arquivos Mais Importantes E Papel De Cada Um

### `src/renderer/src/features/catalog/useCatalogController.ts`

Responsável por:

- manter o estado principal do catálogo
- aplicar filtros
- salvar produto
- aplicar inventário
- aplicar ajuste manual
- expor o catálogo para a frente de caixa

### `src/renderer/src/features/catalog/CatalogWorkspace.tsx`

Responsável por:

- renderizar a interface principal de estoque
- organizar as abas de produtos, movimentações, inventário e ajuste
- acionar os handlers do controller

### `src/renderer/src/features/catalog/CatalogProductModal.tsx`

Responsável por:

- formulário de cadastro/edição
- campos completos do produto
- seleção visual entre produto por unidade e produto pesável

### `src/renderer/src/features/catalog/catalogModel.ts`

Responsável por:

- regras puras do domínio de catálogo
- normalização de códigos de barras
- cálculo de margem
- criação/edição de produto
- ajuste manual
- reconciliação de inventário
- busca no catálogo

### `src/renderer/src/features/sales/usePointOfSaleController.ts`

Responsável por:

- consumir o catálogo compartilhado na frente de caixa
- aceitar códigos principais e adicionais na busca
- manter o fluxo de pesagem ativo para itens pesáveis

### `src/shared/sales.ts`

Responsável por:

- tipo compartilhado `CatalogProduct`
- adição do campo opcional `barcodes`

## Integração com a Frente de Caixa

- a busca da venda agora usa o catálogo do módulo de estoque
- a frente de caixa passou a aceitar códigos adicionais dos produtos
- o fluxo de pesagem continua funcionando para itens pesáveis

## Notas Importantes Para Revisão

### 1. Ainda Não Existe Backend

Tudo continua mockado.

Não foi implementado nesta sprint:

- persistência real
- API
- banco de dados
- sincronização entre sessões
- preload ou IPC de escrita para salvar catálogo

### 2. Alteração Em `tsconfig.web.json`

Foi habilitado `allowImportingTsExtensions`.

Motivo:

- os arquivos novos foram validados também com o runner nativo do Node para TypeScript
- esse runner se comporta melhor com imports explícitos `.ts` e `.tsx`
- o build e o typecheck do projeto precisavam aceitar esse mesmo padrão

### 3. Alteração Em `package-lock.json`

O lockfile foi atualizado porque o ambiente local precisou alinhar as dependências declaradas no projeto para executar:

- `npm run typecheck`
- `npm run build`
- `npm run lint`

Em review, vale apenas confirmar que:

- não houve troca indevida de runtime dependency
- o lockfile acompanha o estado atual do `package.json`

## Checklist De QA Manual

Se alguém quiser validar manualmente antes de subir PR, este é o checklist mínimo:

1. Abrir a aba `Estoque`
2. Confirmar que existem as abas `Produtos`, `Movimentações`, `Inventário` e `Ajuste Manual`
3. Cadastrar um produto novo e verificar:
   - código principal
   - códigos adicionais
   - categoria
   - custo
   - venda
   - margem
   - estoque mínimo
   - indicador de pesável/unidade
4. Editar um produto existente e confirmar atualização visual
5. Aplicar um ajuste manual e verificar geração de movimentação
6. Lançar um inventário com divergência e verificar movimentação criada
7. Ir para `Vendas` e buscar por:
   - nome
   - código principal
   - código adicional
8. Confirmar que itens pesáveis continuam abrindo o fluxo de balança

## Checklist De Revisão Técnica

Pontos que uma IA ou revisor deve conferir:

1. O catálogo compartilhado não duplicou estado desnecessariamente entre `Estoque` e `Vendas`
2. As regras de domínio ficaram no `catalogModel.ts`, não espalhadas na UI
3. O tipo `CatalogProduct` continua compatível com o restante da venda
4. A mudança em `tsconfig.web.json` é intencional e limitada a suportar os imports explícitos
5. Os testes cobrem as regras mais sensíveis:
   - múltiplos códigos
   - produto pesável
   - ajuste manual
   - inventário
   - busca por código adicional

## Riscos E Limitações Conhecidas

- o estado do catálogo é somente em memória
- ao recarregar a aplicação, os dados voltam ao mock inicial
- o inventário e o ajuste manual não possuem auditoria persistente ainda
- o módulo ainda não conversa com backend nem com storage local
- o `package-lock.json` entrou no commit por atualização de ambiente para validação

## Fora De Escopo Nesta Sprint

Não faz parte deste PR:

- integrar banco de dados
- criar endpoints
- salvar dados no Electron via IPC
- sincronizar catálogo entre máquinas
- gerar PR automático
- refatorar relatórios por produto
- implementar permissões de usuário para ajuste de estoque

## Principais Arquivos Criados

- `src/renderer/src/features/catalog/types.ts`
- `src/renderer/src/features/catalog/catalogModel.ts`
- `src/renderer/src/features/catalog/catalogModel.test.ts`
- `src/renderer/src/features/catalog/catalogMock.ts`
- `src/renderer/src/features/catalog/useCatalogController.ts`
- `src/renderer/src/features/catalog/CatalogWorkspace.tsx`
- `src/renderer/src/features/catalog/CatalogProductModal.tsx`

## Principais Arquivos Alterados

- `src/renderer/src/pages/Catalog.jsx`
- `src/renderer/src/pages/PointOfSale.jsx`
- `src/renderer/src/features/sales/usePointOfSaleController.ts`
- `src/shared/sales.ts`
- `tsconfig.web.json`

## Arquivos Tocadas Pelo Commit

- `pdv-moderno/docs/sprint-frontend-estoque-produtos.md`
- `pdv-moderno/package-lock.json`
- `pdv-moderno/src/renderer/src/features/catalog/CatalogProductModal.tsx`
- `pdv-moderno/src/renderer/src/features/catalog/CatalogWorkspace.tsx`
- `pdv-moderno/src/renderer/src/features/catalog/catalogMock.ts`
- `pdv-moderno/src/renderer/src/features/catalog/catalogModel.test.ts`
- `pdv-moderno/src/renderer/src/features/catalog/catalogModel.ts`
- `pdv-moderno/src/renderer/src/features/catalog/types.ts`
- `pdv-moderno/src/renderer/src/features/catalog/useCatalogController.ts`
- `pdv-moderno/src/renderer/src/features/sales/usePointOfSaleController.ts`
- `pdv-moderno/src/renderer/src/pages/Catalog.jsx`
- `pdv-moderno/src/renderer/src/pages/PointOfSale.jsx`
- `pdv-moderno/src/shared/sales.ts`
- `pdv-moderno/tsconfig.web.json`

## Validação Executada

- teste de domínio do catálogo:
  - `node --experimental-strip-types --experimental-test-isolation=none --test src/renderer/src/features/catalog/catalogModel.test.ts`
- checagem de tipos:
  - `npm run typecheck`
- lint:
  - `npm run lint`
- build:
  - `npm run build`

## Texto Base Para Descrição De PR

Sugestão de resumo para usar no PR:

> Este PR implementa o módulo visual de estoque e produtos no frontend do PDV, ainda com dados mock. A entrega inclui cadastro e edição visual de produto, suporte a múltiplos códigos de barras, indicador de produto pesável ou por unidade, tela de movimentações, inventário visual e ajuste manual de estoque. Também integra esse catálogo à frente de caixa, fazendo a busca da venda reutilizar o mesmo conjunto de produtos.

## Estado Final

O sistema agora possui frontend funcional para:

- cadastro visual de produto
- edição visual de produto
- campos completos de produto
- indicador de pesável e por unidade
- movimentação de estoque
- inventário
- ajuste manual de estoque

Tudo isso permanece mockado no frontend, sem backend, mas com a estrutura pronta para integrar persistência e APIs na próxima etapa.
