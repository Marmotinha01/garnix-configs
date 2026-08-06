# GARNIX — Fazenda e Pesca

> Escopo: `GarnixFarm/levels.yml` + `GarnixFarm/farms.yml` + `GarnixFishing/rewards.yml`. Reescalados em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).

## O fator de reescala

As duas vias perderam fatia na repartição nova, mas a casa/dia quadruplicou — então o fator **inverte de sinal ao longo da temporada**:

```
fator(N) = [fatia nova × 1.500.000 × 6,146^(N-1)]
           ─────────────────────────────────────────
           [fatia velha ×   375.000 × 6,610^(N-1)]
```

| Via | Fatia velha | Fatia nova | Dia 1 | Dia 20 |
|---|---|---|---|---|
**Fazenda** | 18% | **7%** | **×1,56** | **×0,39** |
**Pesca** | 7% | **3%** | **×1,71** | **×0,43** |
Eventos | 3% | 2% | — | — |

O jogador ganha **mais** nos primeiros dias e **menos** no fim, porque a curva ficou mais suave (6,146 contra 6,61) e a base subiu. É o desenho: as vias ativas passaram a ser o onboarding, não o destino.

⚠️ **A mineração não foi tocada.** A âncora nova foi construída justamente para preservar `1 coin por cobblestone` no T1 — ver [tabela-mestra.md](tabela-mestra.md). O `GarnixMining/levels.yml` segue válido linha por linha.

⚠️ **Os eventos também não.** Os 8 arquivos de evento não pagam coins de propósito: *"evento não tem gate de tier, então um valor fixo"*. A fatia de 2% deles é entregue em outras moedas e itens.

## Pesca — as 44 recompensas de coins

A vara tem **44 níveis** e existem **44 recompensas de coins**, mapeadas 1:1 por `required-level`. Os 44 níveis cobrem os 20 dias, então o tier de cada recompensa é `N = 1 + (L−1) × 19/43`.

| Nível | Antes | Depois | Fator |
|---|---|---|---|
| 1 | 494 | **847** | ×1,71 |
| 22 | 9,46×10⁹ | **8,25×10⁹** | ×0,87 |
| 44 | 1,43×10¹⁷ | **6,15×10¹⁶** | ×0,43 |

O gate 2D da via não mudou: `required-level` é a escada da vara, e o `weight` da recompensa é o teto da skin, de modo que a skin anterior não alcança a recompensa nova. O equipamento compra **acesso**, não valor — a pilha de multiplicadores da pesca empurra `corais`, nunca `coins`.

## Fazenda — o cuidado que ela exigiu

O `payout-multiplier` tem **301 entradas** (níveis 0–300) e **reseta a 1 a cada planta nova**, nos níveis **0, 60, 150 e 240**. Aplicar o fator direto sobre ele quebra isso de duas formas:

```
❌ multiplicador cai abaixo de 1  →  trocar de planta PAGA MENOS
❌ o reset deixa de ser 1         →  a leitura "×3,9 por degrau" some da tela
```

A forma correta separa os dois eixos:

| Onde | O que recebe |
|---|---|
`payout-multiplier` | o fator **relativo dentro do bloco**: `0,92981^((L − início do bloco)/15)` |
`farms.yml → primary` | o fator **absoluto do nível em que a planta abre** |

Assim o reset continua exatamente em 1, a razão dentro do bloco fica mais suave (a curva nova é 6,146 e não 6,61), e o degrau entre plantas carrega a diferença de tier.

| Planta | Abre no nível | Antes | Depois | Fator |
|---|---|---|---|---|
Trigo | 0 | 2,478 | **4,146** | ×1,673 |
Cenoura | 60 | 682,132 | **853** | ×1,250 |
Batata | 150 | 3.092.622 | **2.499.000** | ×0,806 |
Fungo | 240 | 1,41×10¹⁰ | **7,36×10⁹** | ×0,519 |

### As três conferências

```
entradas do payout abaixo de 1 ......... 0    ✅
resets em 0/60/150/240 ................. 1    ✅  (leitura preservada)
quebras de monotonia dentro dos blocos . 0    ✅  (subir de nível nunca paga menos)
```

A terceira é a que importa: o [14-FARM-PESCA.md](../GARNIX%20-%20ECONOMIA/14-FARM-PESCA.md) registra que uma versão anterior da escada produziu multiplicador **0,82** num degrau — *"subir de nível faria o jogador ganhar menos, e é o tipo de coisa que nenhum teste de banda pega, porque as pontas fechavam"*. Por isso ela é verificada explicitamente a cada reescala.

⚠️ **Um bug de `awk` quase repetiu esse erro aqui.** Comparar `lvl < 60` com `lvl` vindo de `gsub` compara **string**, e `"150" < "60"` é verdadeiro — o que jogou o nível 150 no bloco errado e produziu multiplicador `0,483`. Quem for reescalar de novo: force `lvl = lvl + 0` antes de comparar.

## Os custos de entrada — o que quase passou batido

Reescalar drop e payout não cobre tudo: as duas vias têm **custos em coins** que também derivavam da âncora antiga e não aparecem em nenhuma tabela de recompensa.

Aqui o fator é outro — custo escala com a **casa/dia inteira**, não com a fatia da via:

```
fator do custo = casa_nova(N) / casa_antiga(N) = 4 × 0,92981^(N-1)
```

| Item | Onde | Tier | Antes | Depois |
|---|---|---|---|---|
**Vara de Pesca** | `GarnixFishing/config.yml` → `rod.price` | 1 | 10.000 | **40.000** |
Upgrade para Cenoura | `GarnixFarm/farms.yml` | 4 (nível 60) | 1,08×10⁷ | **3,47×10⁷** |
Upgrade para Batata | idem | 10 (nível 150) | 9,03×10¹¹ | **1,88×10¹²** |
Upgrade para Fungo | idem | 16 (nível 240) | 1,14×10¹⁶ | **1,53×10¹⁶** |

⚠️ **A vara é comprada em coins mas a via rende corais** — de propósito: comprá-la com corais seria circular, já que corais só vêm de pescar. É a única barreira em moeda principal para entrar numa via secundária.

✅ **Os encantes das duas vias NÃO entram nesta lista.** A fazenda cobra em `sementes` (`enchant-currency`) e a mineração em `gemas` — moedas de **contagem**, que não inflam com a curva. É exatamente o desenho das quatro vias: coins pagam a entrada, a secundária paga a profundidade.
