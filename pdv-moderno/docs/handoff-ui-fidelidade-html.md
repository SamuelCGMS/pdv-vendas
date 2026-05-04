# Handoff UI - Fidelidade Aos HTMLs

## Objetivo
Reconstruir a interface do projeto mantendo 2 apps desktop separados:

- `sales`: app de PDV de vendas
- `management`: app de gerenciamento

## Regra Principal
Os arquivos em `D:\pdv-gravity\telas-novas\*\code.html` sao a fonte de verdade visual e estrutural.

Isso significa:

- nao usar os HTMLs apenas como inspiracao
- nao reinterpretar layout
- nao modernizar
- nao simplificar
- nao trocar composicao
- nao inventar outros graficos
- nao alterar hierarquia visual sem necessidade tecnica real

O objetivo e portar com a maior fidelidade possivel os HTMLs para a implementacao atual.

## Estrutura Que Deve Ser Mantida
- manter 2 apps desktop separados
- manter a estrutura atual de `sales` e `management`
- preservar `AGENTS.md`
- preservar `docs`
- preservar o repositorio e a base reconstruida atual, ajustando apenas o necessario

## Escopo Atual
- frontend only
- usar mock data
- nao implementar backend agora
- nao implementar banco de dados agora
- primeiro fechar 100% a UI e os fluxos visuais
- backend e banco ficam para uma etapa posterior

## Pastas Importantes
- Repositorio atual: `D:\pdv-gravity\pdv-moderno`
- HTMLs fonte: `D:\pdv-gravity\telas-novas`

## Telas Do App Sales
- `abertura_de_caixa_foco_em_operadores_v1`
- `vendas_simula_o_de_modal_de_desconto`
- `confirma_o_de_pagamento_valor_esquerda`
- `fechamento_de_caixa_interface_padronizada_final`

## Telas Do App Management
- `estoque_vis_o_geral_consolidada_final`
- `relat_rios_linen_leaf_ajuste_final_de_espa_amento_e_largura`

## Criterios Obrigatorios
Cada tela deve respeitar:

- mesma estrutura visual do HTML
- mesmos blocos e secoes
- mesmos textos
- mesma ordem visual
- mesmos cards
- mesmos graficos
- mesmos alinhamentos
- mesma hierarquia de tamanhos
- espacamentos visualmente equivalentes
- proporcoes equivalentes
- composicao geral equivalente ao `screen.png`

## Regra De Responsividade
### Sales
- `1366x768` e resolucao minima real a ser priorizada
- o fluxo principal nao deve quebrar
- nao deve haver sobreposicao ou degradacao visual arbitraria
- `1920x1080` tambem deve ser validado

### Management
- prioridade total para fidelidade ao HTML original
- se o HTML original comporta scroll natural, isso e aceitavel
- nao compactar agressivamente apenas para caber tudo em uma viewport
- `1920x1080` tambem deve ser validado

## Regra De Implementacao
Antes de alterar qualquer tela:

1. ler o `code.html` da tela
2. comparar com o `screen.png`
3. comparar com a implementacao React atual
4. portar a estrutura do HTML sem reinventar
5. validar visualmente no navegador

## Regra De Conclusao
Uma tela so pode ser considerada pronta quando:

- estiver visualmente muito proxima do `screen.png`
- os elementos do `code.html` estiverem refletidos corretamente
- nao houver mudancas arbitrarias de layout, grafico, spacing ou proporcao

## Prompt Recomendado Para Outra IA
```text
Quero que você continue este projeto mantendo a separação em 2 apps desktop:

1. sales
2. management

Contexto:
- O repositório atual já foi reconstruído parcialmente em React/Electron.
- NÃO quero backend nem banco agora.
- Quero finalizar a UI e as funcionalidades com mock data primeiro.
- AGENTS.md e docs devem ser preservados.

Regra principal e inegociável:
Os arquivos em D:\pdv-gravity\telas-novas\*\code.html são a FONTE DE VERDADE.
Você NÃO deve reinterpretar, modernizar, aproximar, simplificar, inventar ou “melhorar” o layout.
Você deve portar fielmente os HTMLs para a implementação atual.

Exijo fidelidade a:
- estrutura
- espaçamento
- tipografia relativa
- proporções
- gráficos
- cards
- alinhamentos
- textos
- hierarquia visual
- composição geral

Mapeamento das telas:
Sales:
- abertura_de_caixa_foco_em_operadores_v1
- vendas_simula_o_de_modal_de_desconto
- confirma_o_de_pagamento_valor_esquerda
- fechamento_de_caixa_interface_padronizada_final

Management:
- estoque_vis_o_geral_consolidada_final
- relat_rios_linen_leaf_ajuste_final_de_espa_amento_e_largura

Critérios:
- manter os 2 apps separados
- usar mock data
- para sales, 1366x768 deve funcionar sem quebrar o fluxo principal
- para management, prioridade é fidelidade ao HTML; scroll é aceitável se necessário
- validar também em 1920x1080
- não me diga que está “inspirado”; eu quero o mais igual possível aos HTMLs e screen.png

Forma de trabalho:
- leia primeiro os HTMLs originais
- compare com a implementação atual
- ajuste tela por tela
- mostre sempre quais diferenças concretas encontrou
- só considere uma tela pronta quando estiver visualmente muito próxima do HTML original
```
