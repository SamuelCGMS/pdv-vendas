# Referencia Tecnica: Balanca Web Serial

Este documento preserva o que funcionou na integracao inicial com balanca, sem carregar a UI antiga para a nova base do PDV.

## Escopo

- Comunicacao serial via Web Serial API no renderer.
- Leitura de balancas Toledo usando envio de `ENQ`.
- Suporte aos protocolos `PRT2` e `PRT3`.
- Persistencia local da configuracao em `localStorage`.

## Configuracao Validada

```ts
const DEFAULT_CONFIG = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  flowControl: "none",
  protocol: "PRT2",
};
```

Baud rates previstos: `2400`, `4800`, `9600`, `19200`, `115200`.

## Caracteres De Controle

```ts
const ENQ = 0x05;
const STX = 0x02;
const ETX = 0x03;
```

Fluxo basico:

1. Abrir porta serial selecionada pelo operador.
2. Enviar `ENQ`.
3. Ler resposta ate encontrar `ETX` ou atingir timeout.
4. Interpretar payload conforme protocolo selecionado.

## Protocolo PRT2

Formato esperado:

```text
STX + PPPPP + ETX
```

`PPPPP` contem 5 caracteres ASCII com peso bruto. A implementacao validada interpreta o valor com 3 casas decimais implicitas.

Exemplo:

```text
01525 -> 1.525 kg
```

## Protocolo PRT3

Formato esperado:

```text
STX + S + PPPPP + ETX
```

`S` representa status:

```text
P = peso positivo estavel
I = instavel
N = peso negativo
S = sobrecarga
```

## Observacoes Para A Nova Base

- Nao acoplar a balanca ao fluxo principal agora.
- Recriar a UI de configuracao dentro do novo design system.
- Manter entrada manual de peso como fallback operacional.
- Quando houver backend/local server, decidir se a serial fica no renderer, no processo principal do Electron ou em servico local dedicado.
