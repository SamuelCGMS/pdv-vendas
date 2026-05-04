# Gravity PDV

Projeto desktop para operacao de PDV em Windows, dividido em dois aplicativos:

- `sales`: app do caixa, com abertura de turno, venda, pagamento e fechamento.
- `management`: app de gerenciamento, com estoque e relatorios.

Nesta fase, os dois apps usam dados mockados. Backend, banco de dados, rede local e integracoes reais entram depois que os fluxos de tela estiverem fechados.

## Scripts

```bash
npm run dev:sales
npm run dev:management
npm run dev:web:sales
npm run dev:web:management
npm test
npm run build
```

## Fonte Visual

As telas em `../telas-novas` sao a referencia visual para a nova UI. O objetivo e manter alta fidelidade ao design original, convertendo HTML estatico em React com assets locais e sem dependencia de CDN.
