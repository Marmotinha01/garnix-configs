# GARNIX — Tabela de Recompensas das Crates

> Escopo: `GarnixCrates/crates/*.yml` (6 crates) + `GarnixCrates/robots/*.yml` (5 robôs).

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml. Ele **não é porcentagem**: o `Crate.java` normaliza pelo total (`Crate.java:100-105`).
- **Base** é o peso convertido em porcentagem real. É a chance na abertura manual **e** com o Robô Comum.
- Os prêmios somam **100 de peso** nos seis arquivos e o `azar` entra com **33,3333** por fora → total **133,3333**, o que faz cada prêmio valer **0,75x** o peso e o azar valer exatamente **25%**.
- `azar` é `type: NONE`: o giro para nele e o jogador **não recebe nada** (`RewardDelivery.java:60`).
- Toda crate é aberta **sem gate de tier** — o jogador do dia 1 e o do dia 30 abrem a mesma tabela.

### Como os robôs mexem na chance

`Crate.java:126-137` — cada robô tem um **teto** (`boost-threshold`, em % de chance real) e um **multiplicador** (`boost-multiplier`):

```
teto em peso  = total do arquivo × threshold ÷ 100
peso final    = peso × multiplicador   se (type != NONE  e  peso <= teto)
                peso                   caso contrário
chance final  = peso final ÷ novo total
```

| Robô | Abre a cada | Teto | Multiplicador | Efeito |
|---|---:|---:|---:|---|
| Comum | 20s | 0% | 1,0x | **nenhum** — tabela idêntica à manual |
| Raro | 10s | 2% | 1,25x | +25% de peso no que está abaixo de 2% |
| Épico | 6s | 3% | 1,5x | +50% de peso no que está abaixo de 3% |
| Lendário | 4s | 3% | 2,0x | +100% de peso no que está abaixo de 3% |
| Mítico | 2s | 3% | 3,0x | +200% de peso no que está abaixo de 3% |

**O azar nunca é turbinado** (`type: NONE` é excluído), então robô melhor = menos azar. Nas crates de profissão ele cai de 25% para **17,5%–18,6%** no Mítico.

> ⚠️ **O teto é 3,999999, não 4.** O total do arquivo é 133,3333 (e não 133,3333…), então `133,3333 × 3 ÷ 100 = 3,999999`. Um prêmio de peso **exatamente 4** ficaria de fora do boost por 0,000001. Por isso o degrau de topo de cada moeda foi fixado em 3,9 / 3,8 / 3,2 — **não arredonde para 4**.

### As duas escadas

Moeda e limite não são mais prêmio único: são escadas com peso **60/30/10** (três degraus) ou **50/30/15/5** (quatro).

| Crate | Coins | Secundária | Limites |
|---|---|---|---|
| Mineração / Farm / Pesca | 250 / 500 / 1.000 | 150 / 300 / 600 | 1 / 3 / 5 |
| VIP | 500 / 1.000 / 2.000 | 300 / 600 / 1.200 dracmas | 5 / 15 / 30 / 50 |
| RankUP | 1.000 / 2.000 / 4.000 | 500 / 1.000 / 2.000 dracmas | 5 / 15 / 30 / 50 |

Entre os três limites o peso é **6:3:1** (armazém : máquinas : spawners), espelhando o cash shop: **800 / 1.500 / 4.000 cash**.

---

## 1. Crate Mineração — `mineracao.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 23,4 | 17,55% | 16,99% | 15,9% | 14,54% | 12,41% | 250 |
| Gemas | comum | 15 | 11,25% | 10,89% | 10,19% | 9,32% | 7,96% | 150 |
| Coins | comum | 11,7 | 8,78% | 8,5% | 7,95% | 7,27% | 6,21% | 500 |
| Combustível | comum | 9,8 | 7,35% | 7,12% | 6,66% | 6,09% | 5,2% | 500L |
| Gemas | comum | 7,5 | 5,63% | 5,45% | 5,1% | 4,66% | 3,98% | 300 |
| Explosivo 2x2 | comum | 5 | 3,75% | 3,63% | 3,4% | 3,11% | 2,65% | 1 |
| Coins | comum | 3,9 | 2,93% | 2,83% | 3,98% | 4,85% | 6,21% | 1.000 |
| Explosivo 4x4 | comum | 3,5 | 2,63% | 2,54% | 3,57% | 4,35% | 5,57% | 1 |
| Gemas | comum | 2,5 | 1,88% | 2,27% | 2,55% | 3,11% | 3,98% | 600 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,96% | 2,75% | 3,36% | 4,3% | 1 |
| Chave de Boss | comum plus | 2 | 1,5% | 1,82% | 2,04% | 2,49% | 3,18% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,36% | 1,53% | 1,86% | 2,39% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,23% | 1,38% | 1,68% | 2,15% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,23% | 1,38% | 1,68% | 2,15% | 1 |
| Chave RankUP | comum plus | 1 | 0,75% | 0,908% | 1,02% | 1,24% | 1,59% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,617% | 0,693% | 0,845% | 1,08% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,408% | 0,459% | 0,559% | 0,716% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,408% | 0,459% | 0,559% | 0,716% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,2% | 0,224% | 0,273% | 0,35% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,2% | 0,224% | 0,273% | 0,35% | 3 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0726% | 0,0816% | 0,0994% | 0,127% | 5 |
| Capacete Mineração [Tier I] | armadura | 0,5 | 0,375% | 0,454% | 0,51% | 0,621% | 0,796% | 1 |
| Peitoral Mineração [Tier I] | armadura | 0,5 | 0,375% | 0,454% | 0,51% | 0,621% | 0,796% | 1 |
| Calça Mineração [Tier I] | armadura | 0,5 | 0,375% | 0,454% | 0,51% | 0,621% | 0,796% | 1 |
| Bota Mineração [Tier I] | armadura | 0,5 | 0,375% | 0,454% | 0,51% | 0,621% | 0,796% | 1 |
| Booster de Mineração — Gemas 2x 5m | mediana | 0,7 | 0,525% | 0,635% | 0,714% | 0,87% | 1,11% | 1 |
| Booster de Mineração — Coins 2x 5m | mediana | 0,7 | 0,525% | 0,635% | 0,714% | 0,87% | 1,11% | 1 |
| Britadeira | mediana | 0,6 | 0,45% | 0,545% | 0,612% | 0,746% | 0,955% | 1 |
| Explosivo 6x6 | mediana | 0,45 | 0,338% | 0,408% | 0,459% | 0,559% | 0,716% | 1 |
| Explosivo 8x8 | mediana | 0,15 | 0,113% | 0,136% | 0,153% | 0,186% | 0,239% | 1 |
| Skin de Pedra | mediana plus | 0,4 | 0,3% | 0,363% | 0,408% | 0,497% | 0,636% | 1 |
| Skin de Ferro | mediana plus | 0,3 | 0,225% | 0,272% | 0,306% | 0,373% | 0,477% | 1 |
| Caixa Mineração [Tier I] | rara | 0,3 | 0,225% | 0,272% | 0,306% | 0,373% | 0,477% | 1 |
| Caixa Recursos | rara | 0,099 | 0,0743% | 0,0899% | 0,101% | 0,123% | 0,158% | 1 |
| Caixa Mineração [Tier II] | jackpot | 0,001 | 0,00075% | 0,00091% | 0,00102% | 0,00124% | 0,00159% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,21% | 22,66% | 20,71% | **17,68%** | — |

---

## 2. Crate Farm — `farm.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 27,6 | 20,7% | 20,18% | 19,04% | 17,63% | 15,36% | 250 |
| Sementes | comum | 16,8 | 12,6% | 12,28% | 11,59% | 10,73% | 9,35% | 150 |
| Coins | comum | 13,5 | 10,13% | 9,87% | 9,31% | 8,62% | 7,51% | 500 |
| Combustível | comum | 10,5 | 7,88% | 7,68% | 7,24% | 6,71% | 5,84% | 500L |
| Sementes | comum | 8,4 | 6,3% | 6,14% | 5,8% | 5,37% | 4,67% | 300 |
| Coins | comum | 3,9 | 2,93% | 2,85% | 4,04% | 4,98% | 6,51% | 1.000 |
| Sementes | comum | 2,8 | 2,1% | 2,05% | 2,9% | 3,58% | 4,67% | 600 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,97% | 2,79% | 3,45% | 4,51% | 1 |
| Chave de Boss | comum plus | 2 | 1,5% | 1,83% | 2,07% | 2,56% | 3,34% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,37% | 1,55% | 1,92% | 2,5% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,23% | 1,4% | 1,72% | 2,25% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,23% | 1,4% | 1,72% | 2,25% | 1 |
| Chave RankUP | comum plus | 1 | 0,75% | 0,914% | 1,03% | 1,28% | 1,67% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,621% | 0,704% | 0,869% | 1,14% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,411% | 0,466% | 0,575% | 0,751% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,411% | 0,466% | 0,575% | 0,751% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,281% | 0,367% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,281% | 0,367% | 3 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0731% | 0,0828% | 0,102% | 0,134% | 5 |
| Capacete Farm [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Peitoral Farm [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Calça Farm [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Bota Farm [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Booster de Fazenda — Sementes 2x 5m | mediana | 0,7 | 0,525% | 0,64% | 0,724% | 0,894% | 1,17% | 1 |
| Booster de Fazenda — Coins 2x 5m | mediana | 0,7 | 0,525% | 0,64% | 0,724% | 0,894% | 1,17% | 1 |
| Skin de Pedra | mediana plus | 0,4 | 0,3% | 0,366% | 0,414% | 0,511% | 0,668% | 1 |
| Skin de Ferro | mediana plus | 0,3 | 0,225% | 0,274% | 0,31% | 0,383% | 0,501% | 1 |
| Caixa Farm [Tier I] | rara | 0,3 | 0,225% | 0,274% | 0,31% | 0,383% | 0,501% | 1 |
| Caixa Recursos | rara | 0,099 | 0,0743% | 0,0905% | 0,102% | 0,126% | 0,165% | 1 |
| Caixa Farm [Tier II] | jackpot | 0,001 | 0,00075% | 0,00091% | 0,00103% | 0,00128% | 0,00167% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,37% | 23% | 21,29% | **18,55%** | — |

---

## 3. Crate Pesca — `pesca.yml`

Estrutura idêntica à Farm; só mudam a secundária, os boosters e as skins.

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 27,6 | 20,7% | 20,18% | 19,04% | 17,63% | 15,36% | 250 |
| Corais | comum | 16,8 | 12,6% | 12,28% | 11,59% | 10,73% | 9,35% | 150 |
| Coins | comum | 13,5 | 10,13% | 9,87% | 9,31% | 8,62% | 7,51% | 500 |
| Combustível | comum | 10,5 | 7,88% | 7,68% | 7,24% | 6,71% | 5,84% | 500L |
| Corais | comum | 8,4 | 6,3% | 6,14% | 5,8% | 5,37% | 4,67% | 300 |
| Coins | comum | 3,9 | 2,93% | 2,85% | 4,04% | 4,98% | 6,51% | 1.000 |
| Corais | comum | 2,8 | 2,1% | 2,05% | 2,9% | 3,58% | 4,67% | 600 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,97% | 2,79% | 3,45% | 4,51% | 1 |
| Chave de Boss | comum plus | 2 | 1,5% | 1,83% | 2,07% | 2,56% | 3,34% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,37% | 1,55% | 1,92% | 2,5% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,23% | 1,4% | 1,72% | 2,25% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,23% | 1,4% | 1,72% | 2,25% | 1 |
| Chave RankUP | comum plus | 1 | 0,75% | 0,914% | 1,03% | 1,28% | 1,67% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,621% | 0,704% | 0,869% | 1,14% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,411% | 0,466% | 0,575% | 0,751% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,411% | 0,466% | 0,575% | 0,751% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,281% | 0,367% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,281% | 0,367% | 3 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0731% | 0,0828% | 0,102% | 0,134% | 5 |
| Capacete Pesca [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Peitoral Pesca [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Calça Pesca [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Bota Pesca [Tier I] | armadura | 0,5 | 0,375% | 0,457% | 0,517% | 0,639% | 0,835% | 1 |
| Booster de Pesca — XP 2x 5m | mediana | 0,7 | 0,525% | 0,64% | 0,724% | 0,894% | 1,17% | 1 |
| Booster de Pesca — Corais 2x 5m | mediana | 0,7 | 0,525% | 0,64% | 0,724% | 0,894% | 1,17% | 1 |
| Skin de Coral | mediana plus | 0,4 | 0,3% | 0,366% | 0,414% | 0,511% | 0,668% | 1 |
| Skin de Escama | mediana plus | 0,3 | 0,225% | 0,274% | 0,31% | 0,383% | 0,501% | 1 |
| Caixa Pesca [Tier I] | rara | 0,3 | 0,225% | 0,274% | 0,31% | 0,383% | 0,501% | 1 |
| Caixa Recursos | rara | 0,099 | 0,0743% | 0,0905% | 0,102% | 0,126% | 0,165% | 1 |
| Caixa Pesca [Tier II] | jackpot | 0,001 | 0,00075% | 0,00091% | 0,00103% | 0,00128% | 0,00167% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,37% | 23% | 21,29% | **18,55%** | — |

---

## 4. Crate Bosses — `bosses.yml`

A escada acompanha a **vida** do boss.

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Boss Colosso (25.000 HP) | comum | 60 | 45% | 44,67% | 44,33% | 43,69% | 42,45% | 1 stack |
| Boss Inferno (50.000 HP) | comum plus | 30 | 22,5% | 22,33% | 22,17% | 21,84% | 21,23% | 1 stack |
| Boss Arauto (75.000 HP) | mediana | 6 | 4,5% | 4,47% | 4,43% | 4,37% | 4,25% | 1 stack |
| Caixa Bosses [Tier I] | mediana | 0,9 | 0,675% | 0,837% | 0,998% | 1,31% | 1,91% | 1 |
| Matadora Bruta | mediana | 0,4 | 0,3% | 0,372% | 0,443% | 0,583% | 0,849% | 1 |
| Boss Titã (150.000 HP) | rara | 2 | 1,5% | 1,86% | 2,22% | 2,91% | 4,25% | 1 stack |
| Caixa Bosses [Tier II] | rara | 0,199 | 0,149% | 0,185% | 0,221% | 0,29% | 0,422% | 1 |
| Boss Devorador (300.000 HP) | raro plus | 0,5 | 0,375% | 0,465% | 0,554% | 0,728% | 1,06% | 1 stack |
| Matadora Sombria | jackpot | 0,001 | 0,00075% | 0,00093% | 0,00111% | 0,00146% | 0,00212% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,81% | 24,63% | 24,27% | **23,58%** | — |

**4,0 de peso** desta crate é elegível ao rate-up (Titã, Devorador, as duas caixas e as duas matadoras). O Titã sai de 1,5% na mão para 4,25% com Robô Mítico.

---

## 5. Crate RankUP — `rankup.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 19,2 | 14,4% | 14% | 13,19% | 12,18% | 10,55% | 1.000 |
| Dracmas | comum | 16,8 | 12,6% | 12,25% | 11,55% | 10,65% | 9,23% | 500 |
| Coins | comum | 9,6 | 7,2% | 7% | 6,6% | 6,09% | 5,27% | 2.000 |
| Limite de Armazém | comum plus | 8,4 | 6,3% | 6,12% | 5,77% | 5,33% | 4,61% | 5 |
| Dracmas | comum | 8,4 | 6,3% | 6,12% | 5,77% | 5,33% | 4,61% | 1.000 |
| Limite de Armazém | comum plus | 5,04 | 3,78% | 3,67% | 3,46% | 3,2% | 2,77% | 15 |
| Limite de Máquinas | comum plus | 4,2 | 3,15% | 3,06% | 2,89% | 2,66% | 2,31% | 5 |
| Chave de Boss | mediana | 4 | 3% | 2,92% | 2,75% | 2,54% | 2,2% | 5 |
| Coins | comum | 3,2 | 2,4% | 2,33% | 3,3% | 4,06% | 5,27% | 4.000 |
| Caixa Runas | mediana | 3 | 2,25% | 2,19% | 3,09% | 3,8% | 4,94% | 1 |
| Dracmas | comum | 2,8 | 2,1% | 2,04% | 2,89% | 3,55% | 4,61% | 2.000 |
| Limite de Armazém | comum plus | 2,52 | 1,89% | 2,3% | 2,6% | 3,2% | 4,15% | 30 |
| Limite de Máquinas | comum plus | 2,52 | 1,89% | 2,3% | 2,6% | 3,2% | 4,15% | 15 |
| Torre de Cacto [5 Andares] | mediana | 2 | 1,5% | 1,82% | 2,06% | 2,54% | 3,3% | 1 |
| Chave de Boss | mediana plus | 1,4 | 1,05% | 1,28% | 1,44% | 1,78% | 2,31% | 10 |
| Limite de Spawners | comum plus | 1,4 | 1,05% | 1,28% | 1,44% | 1,78% | 2,31% | 5 |
| Limite de Máquinas | comum plus | 1,26 | 0,945% | 1,15% | 1,3% | 1,6% | 2,08% | 30 |
| Caixa Chaves | mediana plus | 0,9 | 0,675% | 0,82% | 0,928% | 1,14% | 1,48% | 1 |
| Limite de Armazém | comum plus | 0,84 | 0,63% | 0,765% | 0,866% | 1,07% | 1,38% | 50 |
| Limite de Spawners | comum plus | 0,84 | 0,63% | 0,765% | 0,866% | 1,07% | 1,38% | 15 |
| Limite de Máquinas | comum plus | 0,42 | 0,315% | 0,383% | 0,433% | 0,533% | 0,692% | 50 |
| Limite de Spawners | comum plus | 0,42 | 0,315% | 0,383% | 0,433% | 0,533% | 0,692% | 30 |
| Caixa Boosters | raríssima | 0,4 | 0,3% | 0,365% | 0,412% | 0,507% | 0,659% | 1 |
| Caixa Robôs | raríssima | 0,2 | 0,15% | 0,182% | 0,206% | 0,254% | 0,33% | 1 |
| Limite de Spawners | comum plus | 0,14 | 0,105% | 0,128% | 0,144% | 0,178% | 0,231% | 50 |
| Caixa Caixas | raríssima | 0,099 | 0,0743% | 0,0902% | 0,102% | 0,126% | 0,163% | 1 |
| Cash | jackpot | 0,001 | 0,00075% | 0,00091% | 0,00103% | 0,00127% | 0,00165% | 500 |
| **Azar** | — | 33,3333 | **25%** | 24,3% | 22,91% | 21,14% | **18,31%** | — |

---

## 6. Crate VIP — `vip.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 24,8 | 18,6% | 18,11% | 16,79% | 15,31% | 13% | 500 |
| Dracmas | comum | 22,8 | 17,1% | 16,65% | 15,44% | 14,07% | 11,95% | 300 |
| Coins | comum | 12,3 | 9,23% | 8,98% | 8,33% | 7,59% | 6,45% | 1.000 |
| Dracmas | comum | 11,4 | 8,55% | 8,33% | 7,72% | 7,04% | 5,98% | 600 |
| Coins | comum | 3,9 | 2,93% | 2,85% | 3,96% | 4,81% | 6,13% | 2.000 |
| Dracmas | comum | 3,8 | 2,85% | 2,78% | 3,86% | 4,69% | 5,98% | 1.200 |
| Limite de Armazém | comum plus | 3,6 | 2,7% | 2,63% | 3,66% | 4,44% | 5,66% | 5 |
| Combustível | comum plus | 3 | 2,25% | 2,19% | 3,05% | 3,7% | 4,72% | 500L |
| Chave de Boss | mediana | 2,5 | 1,88% | 2,28% | 2,54% | 3,09% | 3,93% | 3 |
| Limite de Armazém | comum plus | 2,16 | 1,62% | 1,97% | 2,19% | 2,67% | 3,4% | 15 |
| Cacto | comum plus | 2 | 1,5% | 1,83% | 2,03% | 2,47% | 3,15% | 1 |
| Limite de Máquinas | comum plus | 1,8 | 1,35% | 1,64% | 1,83% | 2,22% | 2,83% | 5 |
| Limite de Armazém | comum plus | 1,08 | 0,81% | 0,986% | 1,1% | 1,33% | 1,7% | 30 |
| Limite de Máquinas | comum plus | 1,08 | 0,81% | 0,986% | 1,1% | 1,33% | 1,7% | 15 |
| Limite de Spawners | comum plus | 0,6 | 0,45% | 0,548% | 0,609% | 0,741% | 0,944% | 5 |
| Chave de Boss | mediana plus | 0,6 | 0,45% | 0,548% | 0,609% | 0,741% | 0,944% | 5 |
| Limite de Máquinas | comum plus | 0,54 | 0,405% | 0,493% | 0,548% | 0,667% | 0,849% | 30 |
| Robô Comum | mediana plus | 0,5 | 0,375% | 0,456% | 0,508% | 0,617% | 0,786% | 1 |
| Limite de Armazém | comum plus | 0,36 | 0,27% | 0,329% | 0,366% | 0,444% | 0,566% | 50 |
| Limite de Spawners | comum plus | 0,36 | 0,27% | 0,329% | 0,366% | 0,444% | 0,566% | 15 |
| Robô Raro | rara | 0,3 | 0,225% | 0,274% | 0,305% | 0,37% | 0,472% | 1 |
| Limite de Máquinas | comum plus | 0,18 | 0,135% | 0,164% | 0,183% | 0,222% | 0,283% | 50 |
| Limite de Spawners | comum plus | 0,18 | 0,135% | 0,164% | 0,183% | 0,222% | 0,283% | 30 |
| Limite de Spawners | comum plus | 0,06 | 0,045% | 0,0548% | 0,0609% | 0,0741% | 0,0944% | 50 |
| Caixa Skins [Tier I] | raríssima | 0,028 | 0,021% | 0,0256% | 0,0284% | 0,0346% | 0,044% | 1 |
| Caixa Runas | raríssima | 0,022 | 0,0165% | 0,0201% | 0,0223% | 0,0272% | 0,0346% | 1 |
| Caixa Recursos | raríssima | 0,017 | 0,0128% | 0,0155% | 0,0173% | 0,021% | 0,0267% | 1 |
| Caixa Chaves | raríssima | 0,013 | 0,00975% | 0,0119% | 0,0132% | 0,016% | 0,0204% | 1 |
| Caixa Skins [Tier II] | raríssima | 0,009 | 0,00675% | 0,00822% | 0,00914% | 0,0111% | 0,0142% | 1 |
| Caixa Boosters | raríssima | 0,006 | 0,0045% | 0,00548% | 0,00609% | 0,00741% | 0,00944% | 1 |
| Caixa Caixas | raríssima | 0,004 | 0,003% | 0,00365% | 0,00406% | 0,00494% | 0,00629% | 1 |
| Cash | jackpot | 0,001 | 0,00075% | 0,00091% | 0,00102% | 0,00123% | 0,00157% | 250 |
| **Azar** | — | 33,3333 | **25%** | 24,34% | 22,57% | 20,57% | **17,48%** | — |

---

## 7. Economias entregues pelas crates

| Crate | Coins | Secundária | Cash |
|---|---|---|---:|
| Mineração | 250 / 500 / 1.000 | 150 / 300 / 600 gemas | — |
| Farm | 250 / 500 / 1.000 | 150 / 300 / 600 sementes | — |
| Pesca | 250 / 500 / 1.000 | 150 / 300 / 600 corais | — |
| VIP | 500 / 1.000 / 2.000 | 300 / 600 / 1.200 dracmas | 250 (jackpot) |
| RankUP | 1.000 / 2.000 / 4.000 | 500 / 1.000 / 2.000 dracmas | 500 (jackpot) |
| Bosses | — | — | — |

Dracmas está ancorada na escada de spawners (PIG 22 · WOLF 500 · GUARDIAN 2.200 · WITHER 7.040): os 300 da VIP compram um BAT, os 2.000 da RankUP chegam no GUARDIAN.

---

## 8. Fontes de raridade usadas

| Decisão | Fonte |
|---|---|
| Limites em 6:3:1 | Cash shop: 800 / 1.500 / 4.000 cash |
| Escada de limite 5·15·30 | Loja da /pesca (`GarnixFishing/shop.yml`) |
| Ordem das caixas | `weight` do menu `/caixas` — quanto maior, mais rara |
| Caixa Robôs > Caixa Tier II | Cash shop: 1.200 vs 900 cash |
| Chave de Boss > chave de profissão | Loja da /pesca: 24.000 vs 14.000 corais por 16 |
| Chave RankUP e VIP > Chave de Boss | Nota no `rankup.yml` sobre a Caixa Chaves |
| Escada de dracmas | Preço dos spawners (`GarnixSpawners/spawners/*.yml`) |
| Ordem dos bosses | Vida: 25K · 50K · 75K · 150K · 300K |
| Ordem das matadoras | Pesos na `bosses-i.yml` / `bosses-ii.yml` |

---

## 9. Ponto em aberto

A família de limites da **RankUP vale 28 de peso** — o mesmo que dracmas e quase o mesmo que coins. Nas outras crates ela vale 7,5 (profissão) ou 12 (VIP). Se a regra é "limite é mais raro que moeda", essa é a crate que ainda precisa de uma decisão sobre para onde vai o peso liberado.
