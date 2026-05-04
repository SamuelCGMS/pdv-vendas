# Reconstrucao Em Dois Apps Desktop

Data: 2026-05-03

Este documento registra a mudanca feita no projeto para preservar contexto entre conversas.

## Decisao Principal

O projeto deixou de ser tratado como um unico app desktop e passou a ser uma suite com dois apps Electron + React:

- `sales`: app do PDV de vendas.
- `management`: app de gerenciamento.

Motivo: separar a operacao de caixa da parte administrativa por organizacao, desempenho percebido e clareza de produto.

## Escopo Atual

Fase atual: frontend com dados mockados.

Fora de escopo nesta fase:

- backend
- banco de dados
- rede local
- servidor local
- impressora
- TEF real
- integracoes reais de hardware

Essas partes entram depois que telas e funcionalidades mockadas estiverem fechadas.

## Telas Por App

App `sales`:

- `telas-novas/abertura_de_caixa_foco_em_operadores_v1`
- `telas-novas/vendas_simula_o_de_modal_de_desconto`
- `telas-novas/confirma_o_de_pagamento_valor_esquerda`
- `telas-novas/fechamento_de_caixa_interface_padronizada_final`

App `management`:

- `telas-novas/estoque_vis_o_geral_consolidada_final`
- `telas-novas/relat_rios_linen_leaf_ajuste_final_de_espa_amento_e_largura`

## O Que Foi Preservado

- `AGENTS.md`
- `docs/`
- `skills-lock.json`
- `.env.local`
- fluxo Linear/MCP
- pasta externa `telas-novas/`

## O Que Foi Substituido

A implementacao antiga do produto foi removida/substituida:

- `src/main`
- `src/preload`
- `src/renderer`
- componentes e telas antigas
- mocks antigos
- configs antigas de Vite/Electron
- README antigo de template

## Nova Estrutura

```text
pdv-moderno/
  apps/
    sales/
      electron/
      renderer/
    management/
      electron/
      renderer/
  src/
    shared/
      domain/
      mocks/
      styles/
  docs/
  electron.sales.config.ts
  electron.management.config.ts
  vite.sales.config.ts
  vite.management.config.ts
```

## Arquivos Principais

App de vendas:

- `apps/sales/renderer/src/SalesApp.tsx`
- `apps/sales/renderer/src/sales.css`
- `apps/sales/electron/main.ts`
- `apps/sales/electron/preload.ts`

App de gerenciamento:

- `apps/management/renderer/src/ManagementApp.tsx`
- `apps/management/renderer/src/management.css`
- `apps/management/electron/main.ts`
- `apps/management/electron/preload.ts`

Compartilhado:

- `src/shared/domain/pos.ts`
- `src/shared/domain/pos.test.ts`
- `src/shared/mocks/pos.ts`
- `src/shared/styles/global.css`

## Balanca

A implementacao antiga da balanca nao foi carregada para a nova UI.

Foi preservada como referencia tecnica em:

- `docs/balanca-web-serial-referencia.md`

Resumo:

- usa Web Serial API
- envia `ENQ`
- interpreta `STX` e `ETX`
- possui referencia para protocolos Toledo `PRT2` e `PRT3`
- deve ser reimplementada depois dentro do novo design system

## Dependencias Adicionadas

- `@fontsource/manrope`: fonte local/offline para manter fidelidade visual.
- `lucide-react`: icones locais no lugar de dependencia remota.
- `typescript-eslint`: lint para arquivos TypeScript/TSX.

## Scripts

```bash
npm run dev:web:sales
npm run dev:web:management
npm run dev:sales
npm run dev:management
npm test
npm run lint
npm run typecheck
npm run build
```

As portas ficam fixas nos arquivos de config do Vite. URLs esperadas apos subir os servidores web:

```text
http://localhost:5173
http://localhost:5174
```

Se `localhost` der `404`, encerrar os terminais antigos com `Ctrl+C` e subir os servidores novamente. Com `strictPort`, o Vite nao deve trocar de porta silenciosamente.

## Validacoes Ja Feitas

Passaram:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Tambem foram geradas screenshots com Playwright:

- `out/sales-1366.png`
- `out/management-1366.png`

## Observacao Sobre O Problema Do Localhost

Durante a validacao, o Vite subiu usando `127.0.0.1`.

O navegador do usuario tentou abrir `localhost:5173` e recebeu `HTTP ERROR 404`.

A causa mais provavel e divergencia entre host/porta em uso, especialmente porque o script antigo forcava `--host 127.0.0.1` e os servidores abertos no terminal ainda estavam rodando com o comando antigo.

Foi ajustado o `package.json` para remover o host fixo dos scripts web:

```json
"dev:web:sales": "vite --config vite.sales.config.ts",
"dev:web:management": "vite --config vite.management.config.ts"
```

Tambem foram fixados host e portas nos configs:

- `vite.sales.config.ts`: host `localhost`, porta `5173`, `strictPort`.
- `vite.management.config.ts`: host `localhost`, porta `5174`, `strictPort`.
- `electron.sales.config.ts`: host `localhost`, porta `5173`, `strictPort`.
- `electron.management.config.ts`: host `localhost`, porta `5174`, `strictPort`.

Depois dessas mudancas, os servidores devem ser encerrados com `Ctrl+C` e iniciados novamente. Teste tecnico apos o ajuste:

```text
sales localhost:5173 -> 200 text/html
management localhost:5174 -> 200 text/html
```

## Proximos Passos

1. Reiniciar os dois dev servers.
2. Abrir `http://localhost:5173` e `http://localhost:5174`.
3. Comparar visualmente com os `screen.png` originais em `telas-novas`.
4. Ajustar fidelidade visual tela por tela.
5. Evoluir interacoes mockadas do `sales`.
6. Evoluir interacoes mockadas do `management`.
7. So depois disso iniciar backend, banco e rede local.
