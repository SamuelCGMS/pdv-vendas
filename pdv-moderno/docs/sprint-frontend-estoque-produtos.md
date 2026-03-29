# Sprint Frontend: Estoque e Produtos

Data: 2026-03-29

## Objetivo

Implementar no frontend o que estava pendente no roadmap para o módulo de estoque/produtos, usando dados mock e deixando a estrutura pronta para conexão posterior com backend.

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

## Integração com a Frente de Caixa

- a busca da venda agora usa o catálogo do módulo de estoque
- a frente de caixa passou a aceitar códigos adicionais dos produtos
- o fluxo de pesagem continua funcionando para itens pesáveis

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

## Validação Executada

- teste de domínio do catálogo:
  - `node --experimental-strip-types --experimental-test-isolation=none --test src/renderer/src/features/catalog/catalogModel.test.ts`
- checagem de tipos:
  - `npm run typecheck`
- lint:
  - `npm run lint`
- build:
  - `npm run build`

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
