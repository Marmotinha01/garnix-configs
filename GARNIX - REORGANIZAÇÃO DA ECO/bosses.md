# GARNIX — Tabela de Recompensas dos Bosses

> Escopo: `GarnixBosses/bosses/*.yml` — 5 bosses. Levantamento do estado **atual**, sem alteração aplicada.
> Base para (1) reajustar a chance conforme a raridade do item e (2) corrigir as quantias de economia.

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml. O `RewardManager` usa `RandomSelector.weighted` e normaliza pelo total.
- **Os 5 arquivos somam exatamente 100 de peso**, então aqui **peso = porcentagem real**. Isso não é só legibilidade: o menu `/boss > recompensas` imprime o peso cru como porcentagem (`BossRewardsMenu.java:136`), então só é verdade porque soma 100.
- **`reward-rolls: 3` nos cinco** — cada abate sorteia **3 vezes** nesta tabela, de forma independente.
- `azar` é `type: NONE` e vale **25% por sorteio** nos cinco. Com 3 rolls, a chance de um abate não render **nada** é `0,25³ = 1,5625%`.
- As recompensas caem no **correio**, com o total já agregado (3 rolls em dracmas viram uma linha só).

### Panorama

| # | Boss | Arquivo | Vida | Azar | Coins | Gemas | Dracmas | Cash |
|---:|---|---|---:|---:|---:|---:|---:|---:|
| 1 | Colosso | `colosso.yml` | 25.000 | 25% | 10.800 | 200 | 100 | — |
| 2 | Inferno | `inferno.yml` | 50.000 | 25% | 20.700.000 | 400 | 200 | — |
| 3 | Arauto | `arauto.yml` | 75.000 | 25% | 39.500.000.000 | 600 | 300 | 100 |
| 4 | Titã | `tita.yml` | 150.000 | 25% | 75.300.000.000.000 | 800 | 400 | 250 |
| 5 | Devorador | `devorador.yml` | 300.000 | 25% | 144.000.000.000.000.000 | 1.000 | 500 | 500 |

### De onde vem cada boss

| Boss | Fontes |
|---|---|
| Colosso | Crate Bosses (45%) · Caixa Bosses I |
| Inferno | Crate Bosses (22,5%) · Colosso (0,6%) · Caixa Bosses I |
| Arauto | Crate Bosses (4,5%) · Colosso (0,2%) · Inferno (1,2%) · Caixas Bosses I e II |
| Titã | Crate Bosses (1,5%) · Inferno (0,4%) · Arauto (2%) · Caixas Bosses I e II |
| Devorador | Crate Bosses (0,375%) · Arauto (0,45%) · Titã (3,5% x1 e 0,6% x5) · **Devorador (3% x3)** · Caixas Bosses I e II |

O Devorador se auto-sustenta: 3% de chance por roll de dropar 3 stacks dele mesmo. Com 3 rolls por abate, o retorno esperado é **0,27 stack por abate** — abaixo de 1, então a cadeia decai, mas devagar.

---

## 1. Boss Colosso — `colosso.yml`

Vida **25.000** · 3 sorteios por abate.

| Item | Faixa | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| **Azar** | comum | 25 | **25%** | — |
| Coins | comum | 30 | 30% | 10.800 |
| Gemas | comum | 17 | 17% | 200 |
| Dracmas | comum | 15 | 15% | 100 |
| Limite de Armazém | comum plus | 4 | 4% | 500 |
| Limite de Máquinas | comum plus | 3,5 | 3,5% | 1 |
| Limite de Spawners | comum plus | 2,5 | 2,5% | 1 |
| Chave de Boss | incomum | 2 | 2% | 5 |
| Boss Inferno | semi raro | 0,6 | 0,6% | 1 stack |
| Boss Arauto | raro | 0,2 | 0,2% | 1 stack |
| Caixa Runas | raro | 0,1 | 0,1% | 1 |
| Chave de Boss | raro plus | 0,09 | 0,09% | 10 |
| Caixa Boosters | jackpot | 0,006 | 0,006% | 1 |
| Caixa Caixas | jackpot | 0,004 | 0,004% | 1 |

---

## 2. Boss Inferno — `inferno.yml`

Vida **50.000** · 3 sorteios por abate.

| Item | Faixa | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| **Azar** | comum | 25 | **25%** | — |
| Coins | comum | 28 | 28% | 20.700.000 |
| Gemas | comum | 17 | 17% | 400 |
| Dracmas | comum | 16 | 16% | 200 |
| Limite de Armazém | comum plus | 4 | 4% | 500 |
| Limite de Máquinas | comum plus | 3,5 | 3,5% | 1 |
| Limite de Spawners | comum plus | 2,5 | 2,5% | 1 |
| Chave de Boss | comum plus | 2 | 2% | 10 |
| Boss Arauto | semi raro | 1,2 | 1,2% | 1 stack |
| Boss Titã | raro | 0,4 | 0,4% | 1 stack |
| Caixa Runas | raro | 0,2 | 0,2% | 1 |
| Chave de Boss | raro plus | 0,1 | 0,1% | 15 |
| Caixa Boosters | raro plus | 0,05 | 0,05% | 1 |
| Caixa Robôs | raro plus | 0,04 | 0,04% | 1 |
| Caixa Caixas | jackpot | 0,01 | 0,01% | 1 |

---

## 3. Boss Arauto — `arauto.yml`

Vida **75.000** · 3 sorteios por abate.

| Item | Faixa | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| **Azar** | comum | 25 | **25%** | — |
| Coins | comum | 27 | 27% | 39.500.000.000 |
| Gemas | comum | 17 | 17% | 600 |
| Dracmas | comum | 16 | 16% | 300 |
| Limite de Armazém | comum plus | 4 | 4% | 500 |
| Limite de Máquinas | comum plus | 3,5 | 3,5% | 1 |
| Limite de Spawners | comum plus | 2,5 | 2,5% | 1 |
| Chave de Boss | comum plus | 2 | 2% | 10 |
| Boss Titã | semi raro | 2 | 2% | 1 stack |
| Boss Devorador | raro | 0,45 | 0,45% | 1 stack |
| Caixa Runas | raro | 0,25 | 0,25% | 1 |
| Chave de Boss | raro plus | 0,12 | 0,12% | 15 |
| Caixa Boosters | raro plus | 0,07 | 0,07% | 1 |
| Caixa Robôs | raro plus | 0,05 | 0,05% | 1 |
| Caixa Caixas | raro plus | 0,04 | 0,04% | 1 |
| Cash | jackpot | 0,02 | 0,02% | 100 |

---

## 4. Boss Titã — `tita.yml`

Vida **150.000** · 3 sorteios por abate.

| Item | Faixa | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| **Azar** | comum | 25 | **25%** | — |
| Coins | comum | 26 | 26% | 75.300.000.000.000 |
| Gemas | comum | 16 | 16% | 800 |
| Dracmas | comum | 16 | 16% | 400 |
| Limite de Armazém | comum plus | 4 | 4% | 500 |
| Limite de Máquinas | comum plus | 3,5 | 3,5% | 1 |
| Limite de Spawners | comum plus | 2,5 | 2,5% | 1 |
| Chave de Boss | comum plus | 2 | 2% | 25 |
| Boss Devorador | semi raro | 3,5 | 3,5% | 1 stack |
| Boss Devorador | raro | 0,6 | 0,6% | 5 stacks |
| Caixa Runas | raro | 0,4 | 0,4% | 1 |
| Chave de Boss | raro plus | 0,2 | 0,2% | 50 |
| Caixa Boosters | raro plus | 0,1 | 0,1% | 1 |
| Caixa Robôs | raro plus | 0,08 | 0,08% | 1 |
| Caixa Caixas | raro plus | 0,07 | 0,07% | 1 |
| Cash | jackpot | 0,05 | 0,05% | 250 |

---

## 5. Boss Devorador — `devorador.yml`

Vida **300.000** · 3 sorteios por abate. É o único que dropa a Caixa Garnix e a Caixa Máquinas.

| Item | Faixa | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| **Azar** | comum | 25 | **25%** | — |
| Coins | comum | 25 | 25% | 144.000.000.000.000.000 |
| Gemas | comum | 16 | 16% | 1.000 |
| Dracmas | comum | 16 | 16% | 500 |
| Limite de Armazém | comum plus | 4 | 4% | 500 |
| Limite de Máquinas | comum plus | 3,5 | 3,5% | 1 |
| Limite de Spawners | comum plus | 2,5 | 2,5% | 1 |
| Chave de Boss | comum plus | 2 | 2% | 50 |
| Boss Devorador | raro | 3 | 3% | 3 stacks |
| Caixa Runas | raro | 1,5 | 1,5% | 1 |
| Chave de Boss | raro plus | 0,5 | 0,5% | 75 |
| Caixa Boosters | raro plus | 0,3 | 0,3% | 1 |
| Caixa Robôs | raro plus | 0,25 | 0,25% | 1 |
| Caixa Caixas | raro plus | 0,2 | 0,2% | 1 |
| Caixa Máquinas | raro plus | 0,1 | 0,1% | 1 |
| Caixa Garnix | raro plus | 0,05 | 0,05% | 1 |
| Cash | jackpot | 0,1 | 0,1% | 500 |

---

## 6. Economias entregues pelos bosses

### 6.1 Quantia por sorteio

| Boss | Vida | Coins | Gemas | Dracmas | Cash |
|---|---:|---:|---:|---:|---:|
| Colosso | 25.000 | 10.800 | 200 | 100 | — |
| Inferno | 50.000 | 20.700.000 | 400 | 200 | — |
| Arauto | 75.000 | 39.500.000.000 | 600 | 300 | 100 |
| Titã | 150.000 | 75.300.000.000.000 | 800 | 400 | 250 |
| Devorador | 300.000 | 144.000.000.000.000.000 | 1.000 | 500 | 500 |
| **Escala total** | **12x** | **13.333.333.333.333x** | **5x** | **5x** | **5x** |

### 6.2 Salto de um boss para o seguinte

| Passo | Vida | Coins | Gemas | Dracmas |
|---|---:|---:|---:|---:|
| Colosso → Inferno | 2,0x | **1.917x** | 2,0x | 2,0x |
| Inferno → Arauto | 1,5x | **1.908x** | 1,5x | 1,5x |
| Arauto → Titã | 2,0x | **1.906x** | 1,33x | 1,33x |
| Titã → Devorador | 2,0x | **1.912x** | 1,25x | 1,25x |

### 6.3 Moeda por ponto de vida

| Boss | Coins / HP | Gemas / HP | Dracmas / HP |
|---|---:|---:|---:|
| Colosso | 0,43 | 0,0080 | 0,0040 |
| Inferno | 414 | 0,0080 | 0,0040 |
| Arauto | 526.667 | 0,0080 | 0,0040 |
| Titã | 502.000.000 | **0,0053** | **0,0027** |
| Devorador | 480.000.000.000 | **0,0033** | **0,0017** |

### 6.4 Ganho esperado por abate (3 rolls)

| Boss | Coins | Gemas | Dracmas | Cash |
|---|---:|---:|---:|---:|
| Colosso | 9.720 | 102 | 45 | — |
| Inferno | 17.388.000 | 204 | 96 | — |
| Arauto | 31.995.000.000 | 306 | 144 | 0,06 |
| Titã | 58.734.000.000.000 | 384 | 192 | 0,375 |
| Devorador | 108.000.000.000.000.000 | 480 | 240 | 1,5 |

Pontos para a refatoração:

1. **Coins é a única moeda com progressão geométrica.** Ela multiplica por **~1.910x** a cada boss (uma constante deliberada), enquanto gemas e dracmas multiplicam por 1,25x a 2x. Do Colosso ao Devorador: coins **×1,33 × 10¹³**, gemas ×5.
2. **Gemas e dracmas ficam mais baratas quanto mais forte o boss.** Do Arauto para o Devorador a vida quadruplica e a gema só sobe 67% — matar Devorador rende **menos da metade** das gemas por ponto de dano que matar Colosso.
3. **Colosso dá 10.800 coins** — o valor mais simbólico da lista. Equivale a ~43 prêmios de coins da crate de mineração (250 cada).
4. **Cash só existe em 3 dos 5 bosses** e sempre no jackpot. O ganho esperado do Devorador é **1,5 de cash por abate**; o do Arauto, **0,06** — ou seja, ~17 abates para 1 de cash.
5. **Os três limites repetem a mesma quantia nos 5 bosses**: armazém 500, máquinas 1, spawners 1 — sem escalar com o boss e sem coerência entre si.
6. **As chaves de boss são a única recompensa que escala com o boss**: 5 → 10 → 10 → 25 → 50 na faixa comum plus e 10 → 15 → 15 → 50 → 75 na raro plus.
7. **O azar é 25% fixo nos cinco.** O boss mais forte do jogo tem a mesma taxa de "não recebeu nada" que o mais fraco.
