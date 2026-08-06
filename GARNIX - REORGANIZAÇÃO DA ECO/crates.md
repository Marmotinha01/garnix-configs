# GARNIX — Tabela de Recompensas das Crates

> 🚩 **As recompensas em COINS foram reescaladas em 06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md). As tabelas de valor abaixo mostram os números antigos; os pesos, chances e a estrutura continuam válidos.
>
> Fator aplicado — a casa/dia quadruplicou no dia 1 mas a curva ficou mais suave (6,146 contra 6,61), então o fator depende do tier em que cada tabela é aberta:
>
> | Tabela | Tier de referência | Fator |
> |---|---|---|
> | Crates | dia 1 (não têm gate de tier) | **×4,00** |
> | Caixas Tier I | dia 3 | ×3,46 |
> | Caixas Tier II | dia 8 | ×2,39 |
> | Bosses | tier médio da banda | ×3,33 a ×1,07 |
>
> As chaves de cada recompensa foram renomeadas para bater com o novo valor (`coins-250` → `coins-1000`).

> Escopo: `GarnixCrates/crates/*.yml` (6 crates) + `GarnixCrates/robots/*.yml` (5 robôs).

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml. Ele **não é porcentagem**: o `Crate.java` normaliza pelo total (`Crate.java:100-105`).
- **Base** é o peso convertido em porcentagem real. É a chance na abertura manual **e** com o Robô Comum.
- Os prêmios somam **100 de peso** nos seis arquivos e o `azar` entra **por fora** desses 100, então `chance do azar = peso ÷ (100 + peso)`:
  - **Cinco crates** usam azar 33,3333 → total 133,3333, cada prêmio vale **0,75x** o peso e o azar dá exatamente **25%**.
  - **A crate Bosses** usa azar 50 → total 150, cada prêmio vale **0,6667x** o peso e o azar dá **33,3%**.
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

> ⚠️ **Nas cinco crates de total 133,3333 o teto é 3,999999, não 4.** O total é 133,3333 (e não 133,3333…), então `133,3333 × 3 ÷ 100 = 3,999999`. Um prêmio de peso **exatamente 4** ficaria de fora do boost por 0,000001. Por isso o degrau de topo de cada moeda foi fixado em 3,9 / 3,8 / 3,2 — **não arredonde para 4**. Na crate Bosses o teto é **4,5**, porque o total dela é 150.

### As duas escadas

Moeda e limite não são prêmio único: são escadas de três ou quatro degraus.

| Crate | Coins | Secundária | Limites |
|---|---|---|---|
| Mineração / Farm / Pesca | 250 / 500 / 1.000 | 150 / 300 / 600 | 1 / 3 / 5 |
| VIP | 500 / 1.000 / 2.000 | 300 / 600 / 1.200 dracmas | 5 / 15 / 30 / 50 |
| RankUP | 1.000 / 2.000 / 4.000 | 500 / 1.000 / 2.000 dracmas | **15 / 30 / 50 / 100** |

Entre os três limites o peso é **6:3:1** (armazém : máquinas : spawners), espelhando o cash shop: **800 / 1.500 / 4.000 cash**.

Como os degraus se distribuem muda por crate:

- **Profissão** — todos os degraus da mesma escada vivem na mesma faixa, repartidos em 60/30/10.
- **VIP e RankUP** — cada degrau sobe **uma faixa**. Na VIP: 500 no comum, 1.000 no comum plus, 2.000 no comum plus plus, limite de 5 até 50 atravessando quatro faixas. Na RankUP: 1.000 no comum, 2.000 no comum plus, 4.000 no comum plus plus, limite de 15 até 100. É o que separa as crates de topo das de profissão.

A RankUP é a **única sem o degrau de 5** e a única que entrega **limite de 100**.

---

## 1. Crate Mineração — `mineracao.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 25,4 | 19,05% | 18,59% | 17,57% | 16,3% | 14,25% | 250 |
| Gemas | comum | 16,15 | 12,11% | 11,82% | 11,17% | 10,37% | 9,06% | 150 |
| Coins | comum | 12,6 | 9,45% | 9,22% | 8,72% | 8,09% | 7,07% | 500 |
| Combustível | comum | 9,75 | 7,31% | 7,14% | 6,74% | 6,26% | 5,47% | 500L |
| Gemas | comum | 8,05 | 6,04% | 5,89% | 5,57% | 5,17% | 4,52% | 300 |
| Chave de Boss | comum plus | 5,6 | 4,2% | 4,1% | 3,87% | 3,59% | 3,14% | 1 |
| Coins | comum | 3,9 | 2,93% | 2,85% | 4,05% | 5,01% | 6,56% | 1.000 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,98% | 2,8% | 3,47% | 4,54% | 1 |
| Gemas | comum | 2,68 | 2,01% | 1,96% | 2,78% | 3,44% | 4,51% | 600 |
| Explosivo 2x2 | comum | 2 | 1,5% | 1,83% | 2,08% | 2,57% | 3,37% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,37% | 1,56% | 1,93% | 2,52% | 1 |
| Explosivo 4x4 | comum | 1,4 | 1,05% | 1,28% | 1,45% | 1,8% | 2,36% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,24% | 1,4% | 1,73% | 2,27% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,24% | 1,4% | 1,73% | 2,27% | 1 |
| Chave RankUP | comum plus | 0,75 | 0,563% | 0,686% | 0,778% | 0,963% | 1,26% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,622% | 0,706% | 0,873% | 1,14% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,412% | 0,467% | 0,578% | 0,757% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,412% | 0,467% | 0,578% | 0,757% | 1 |
| Caixa Mineração [Tier I] | mediana | 0,3 | 0,225% | 0,274% | 0,311% | 0,385% | 0,505% | 1 |
| Capacete Mineração [Tier I] | armadura | 0,25 | 0,188% | 0,229% | 0,259% | 0,321% | 0,421% | 1 |
| Peitoral Mineração [Tier I] | armadura | 0,25 | 0,188% | 0,229% | 0,259% | 0,321% | 0,421% | 1 |
| Calça Mineração [Tier I] | armadura | 0,25 | 0,188% | 0,229% | 0,259% | 0,321% | 0,421% | 1 |
| Bota Mineração [Tier I] | armadura | 0,25 | 0,188% | 0,229% | 0,259% | 0,321% | 0,421% | 1 |
| Britadeira | mediana | 0,25 | 0,188% | 0,229% | 0,259% | 0,321% | 0,421% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,282% | 0,37% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,201% | 0,228% | 0,282% | 0,37% | 3 |
| Booster de Mineração — Gemas 2x 5m | mediana | 0,21 | 0,158% | 0,192% | 0,218% | 0,27% | 0,353% | 1 |
| Booster de Mineração — Coins 2x 5m | mediana | 0,21 | 0,158% | 0,192% | 0,218% | 0,27% | 0,353% | 1 |
| Skin de Pedra | mediana | 0,2 | 0,15% | 0,183% | 0,208% | 0,257% | 0,337% | 1 |
| Explosivo 6x6 | mediana | 0,18 | 0,135% | 0,165% | 0,187% | 0,231% | 0,303% | 1 |
| Skin de Ferro | mediana | 0,15 | 0,113% | 0,137% | 0,156% | 0,193% | 0,252% | 1 |
| Caixa Recursos | mediana | 0,1 | 0,075% | 0,0915% | 0,104% | 0,128% | 0,168% | 1 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0732% | 0,083% | 0,103% | 0,135% | 5 |
| Explosivo 8x8 | mediana | 0,07 | 0,0525% | 0,064% | 0,0726% | 0,0899% | 0,118% | 1 |
| Caixa Mineração [Tier II] | jackpot | 0,05 | 0,0375% | 0,0457% | 0,0519% | 0,0642% | 0,0842% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,4% | 23,06% | 21,4% | **18,7%** | — |

---

## 2. Crate Farm — `farm.yml`

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 27,17 | 20,38% | 20,03% | 19,05% | 17,88% | 15,93% | 250 |
| Sementes | comum | 16,57 | 12,43% | 12,22% | 11,62% | 10,9% | 9,71% | 150 |
| Coins | comum | 13,3 | 9,98% | 9,8% | 9,32% | 8,75% | 7,8% | 500 |
| Combustível | comum | 10,45 | 7,84% | 7,7% | 7,33% | 6,88% | 6,13% | 500L |
| Sementes | comum | 8,28 | 6,21% | 6,1% | 5,8% | 5,45% | 4,85% | 300 |
| Chave de Boss | comum plus | 5,6 | 4,2% | 4,13% | 3,93% | 3,69% | 3,28% | 1 |
| Coins | comum | 3,9 | 2,93% | 2,88% | 4,1% | 5,13% | 6,86% | 1.000 |
| Sementes | comum | 2,76 | 2,07% | 2,03% | 2,9% | 3,63% | 4,85% | 600 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,99% | 2,84% | 3,55% | 4,75% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,38% | 1,58% | 1,97% | 2,64% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,24% | 1,42% | 1,78% | 2,37% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,24% | 1,42% | 1,78% | 2,37% | 1 |
| Chave RankUP | comum plus | 0,75 | 0,563% | 0,691% | 0,789% | 0,987% | 1,32% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,627% | 0,715% | 0,895% | 1,2% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,415% | 0,473% | 0,592% | 0,791% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,415% | 0,473% | 0,592% | 0,791% | 1 |
| Caixa Farm [Tier I] | mediana | 0,3 | 0,225% | 0,276% | 0,315% | 0,395% | 0,528% | 1 |
| Capacete Farm [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Peitoral Farm [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Calça Farm [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Bota Farm [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,203% | 0,231% | 0,29% | 0,387% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,203% | 0,231% | 0,29% | 0,387% | 3 |
| Booster de Fazenda — Sementes 2x 5m | mediana | 0,21 | 0,158% | 0,194% | 0,221% | 0,276% | 0,369% | 1 |
| Booster de Fazenda — Coins 2x 5m | mediana | 0,21 | 0,158% | 0,194% | 0,221% | 0,276% | 0,369% | 1 |
| Skin de Pedra | mediana | 0,2 | 0,15% | 0,184% | 0,21% | 0,263% | 0,352% | 1 |
| Skin de Ferro | mediana | 0,15 | 0,113% | 0,138% | 0,158% | 0,197% | 0,264% | 1 |
| Caixa Recursos | mediana | 0,1 | 0,075% | 0,0921% | 0,105% | 0,132% | 0,176% | 1 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0737% | 0,0841% | 0,105% | 0,141% | 5 |
| Caixa Farm [Tier II] | jackpot | 0,05 | 0,0375% | 0,0461% | 0,0526% | 0,0658% | 0,0879% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,57% | 23,37% | 21,94% | **19,54%** | — |

---

## 3. Crate Pesca — `pesca.yml`

Estrutura idêntica à Farm; só mudam a secundária, os boosters e as skins.

| Item | Faixa | Peso | Base | Raro | Épico | Lendário | Mítico | Quantia |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Coins | comum | 27,17 | 20,38% | 20,03% | 19,05% | 17,88% | 15,93% | 250 |
| Corais | comum | 16,57 | 12,43% | 12,22% | 11,62% | 10,9% | 9,71% | 150 |
| Coins | comum | 13,3 | 9,98% | 9,8% | 9,32% | 8,75% | 7,8% | 500 |
| Combustível | comum | 10,45 | 7,84% | 7,7% | 7,33% | 6,88% | 6,13% | 500L |
| Corais | comum | 8,28 | 6,21% | 6,1% | 5,8% | 5,45% | 4,85% | 300 |
| Chave de Boss | comum plus | 5,6 | 4,2% | 4,13% | 3,93% | 3,69% | 3,28% | 1 |
| Coins | comum | 3,9 | 2,93% | 2,88% | 4,1% | 5,13% | 6,86% | 1.000 |
| Corais | comum | 2,76 | 2,07% | 2,03% | 2,9% | 3,63% | 4,85% | 600 |
| Limite de Armazém | comum plus | 2,7 | 2,03% | 1,99% | 2,84% | 3,55% | 4,75% | 1 |
| Chave VIP | comum plus | 1,5 | 1,13% | 1,38% | 1,58% | 1,97% | 2,64% | 1 |
| Limite de Armazém | comum plus | 1,35 | 1,01% | 1,24% | 1,42% | 1,78% | 2,37% | 3 |
| Limite de Máquinas | comum plus | 1,35 | 1,01% | 1,24% | 1,42% | 1,78% | 2,37% | 1 |
| Chave RankUP | comum plus | 0,75 | 0,563% | 0,691% | 0,789% | 0,987% | 1,32% | 1 |
| Limite de Máquinas | comum plus | 0,68 | 0,51% | 0,627% | 0,715% | 0,895% | 1,2% | 3 |
| Limite de Armazém | comum plus | 0,45 | 0,338% | 0,415% | 0,473% | 0,592% | 0,791% | 5 |
| Limite de Spawners | comum plus | 0,45 | 0,338% | 0,415% | 0,473% | 0,592% | 0,791% | 1 |
| Caixa Pesca [Tier I] | mediana | 0,3 | 0,225% | 0,276% | 0,315% | 0,395% | 0,528% | 1 |
| Capacete Pesca [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Peitoral Pesca [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Calça Pesca [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Bota Pesca [Tier I] | armadura | 0,25 | 0,188% | 0,23% | 0,263% | 0,329% | 0,44% | 1 |
| Limite de Máquinas | comum plus | 0,22 | 0,165% | 0,203% | 0,231% | 0,29% | 0,387% | 5 |
| Limite de Spawners | comum plus | 0,22 | 0,165% | 0,203% | 0,231% | 0,29% | 0,387% | 3 |
| Booster de Pesca — XP 2x 5m | mediana | 0,21 | 0,158% | 0,194% | 0,221% | 0,276% | 0,369% | 1 |
| Booster de Pesca — Corais 2x 5m | mediana | 0,21 | 0,158% | 0,194% | 0,221% | 0,276% | 0,369% | 1 |
| Skin de Coral | mediana | 0,2 | 0,15% | 0,184% | 0,21% | 0,263% | 0,352% | 1 |
| Skin de Escama | mediana | 0,15 | 0,113% | 0,138% | 0,158% | 0,197% | 0,264% | 1 |
| Caixa Recursos | mediana | 0,1 | 0,075% | 0,0921% | 0,105% | 0,132% | 0,176% | 1 |
| Limite de Spawners | comum plus | 0,08 | 0,06% | 0,0737% | 0,0841% | 0,105% | 0,141% | 5 |
| Caixa Pesca [Tier II] | jackpot | 0,05 | 0,0375% | 0,0461% | 0,0526% | 0,0658% | 0,0879% | 1 |
| **Azar** | — | 33,3333 | **25%** | 24,57% | 23,37% | 21,94% | **19,54%** | — |

---

## 4. Crate Bosses — `bosses.yml`

A escada acompanha a **vida** do boss. É a única crate com total **150** em vez de 133,3333: o azar dela pesa 50, não 33,3333, para render os 333 azares por 1.000 chaves.

| Item | Faixa | Peso | Chance | Em 1.000 | Quantia |
|---|---|---:|---:|---:|---:|
| Boss Colosso (25.000 HP) | comum | 56 | 37,33% | 373 | 1 stack |
| Boss Inferno (50.000 HP) | comum | 28 | 18,67% | 187 | 1 stack |
| Boss Arauto (75.000 HP) | mediano | 11 | 7,33% | 73 | 1 stack |
| Caixa Bosses [Tier I] | mediano plus | 2 | 1,33% | 13,3 | 1 |
| Boss Titã (150.000 HP) | mediano plus | 1,5 | 1% | 10 | 1 stack |
| Matadora Bruta | mediano plus | 0,8 | 0,53% | 5,3 | 1 |
| Boss Devorador (300.000 HP) | raro | 0,4 | 0,27% | 2,7 | 1 stack |
| Caixa Bosses [Tier II] | raro | 0,25 | 0,17% | 1,7 | 1 |
| Matadora Sombria | raro | 0,05 | 0,03% | 0,3 | 1 |
| **Azar** | — | 50 | **33,33%** | **333** | — |

O teto do boost de robô aqui é **4,5** (total 150 × 3 ÷ 100), não 3,999999 como nas crates de profissão — o total é outro. Cai dentro dele toda a cauda: as duas caixas, Titã, Devorador e as duas matadoras, somando 5,0 de peso.

---

## 5. Crate RankUP — `rankup.yml`

A crate de topo. A escada de limite começa em **15** e vai até **100** — é a única sem o degrau de 5 e a única que entrega limite de 100. Em 1.000 chaves:

| Item | Faixa | Peso | Chance | Em 1.000 | Quantia |
|---|---|---:|---:|---:|---:|
| Coins | comum | 22 | 16,5% | 165 | 1.000 |
| Dracmas | comum | 20 | 15% | 150 | 500 |
| Limite de Armazém | comum | 9 | 6,75% | 67,5 | 15 |
| Limite de Máquinas | comum | 4,5 | 3,375% | 33,8 | 15 |
| Caixa Runas | comum | 2 | 1,5% | 15 | 1 |
| Limite de Spawners | comum | 1,5 | 1,125% | 11,3 | 15 |
| Chave de Boss | comum | 1 | 0,75% | 7,5 | 5 |
| Coins | comum plus | 9 | 6,75% | 67,5 | 2.000 |
| Dracmas | comum plus | 8 | 6% | 60 | 1.000 |
| Limite de Armazém | comum plus | 3,6 | 2,7% | 27 | 30 |
| Combustível | comum plus | 3 | 2,25% | 22,5 | 2.000L |
| Limite de Máquinas | comum plus | 1,8 | 1,35% | 13,5 | 30 |
| Chave de Boss | comum plus | 1,2 | 0,9% | 9 | 10 |
| Caixa Chaves | comum plus | 0,8 | 0,6% | 6 | 1 |
| Limite de Spawners | comum plus | 0,6 | 0,45% | 4,5 | 30 |
| Coins | comum plus plus | 3,5 | 2,625% | 26,3 | 4.000 |
| Dracmas | comum plus plus | 3 | 2,25% | 22,5 | 2.000 |
| Limite de Armazém | comum plus plus | 1,8 | 1,35% | 13,5 | 50 |
| Limite de Máquinas | comum plus plus | 0,9 | 0,675% | 6,8 | 50 |
| Caixa Caixas | comum plus plus | 0,5 | 0,375% | 3,8 | 1 |
| Limite de Spawners | comum plus plus | 0,3 | 0,225% | 2,3 | 50 |
| Caixa Boosters | raro | 0,7 | 0,525% | 5,3 | 1 |
| Caixa Robôs | raro | 0,5 | 0,375% | 3,8 | 1 |
| Torre de Cacto [5 Andares] | raro | 0,35 | 0,2625% | 2,6 | 1 |
| Limite de Armazém | raríssimo | 0,24 | 0,18% | 1,8 | 100 |
| Limite de Máquinas | raríssimo | 0,12 | 0,09% | 0,9 | 100 |
| Limite de Spawners | raríssimo | 0,04 | 0,03% | 0,3 | 100 |
| Cash | jackpot | 0,05 | 0,0375% | 0,375 | 500 |
| **Azar** | — | 33,3333 | **25%** | **250** | — |

O combustível de 2.000L e os três limites de 100 são recompensas **novas** — não existiam nesta crate. O limite de 5 saiu.

---

## 6. Crate VIP — `vip.yml`

As escadas de moeda e de limite sobem **uma faixa por degrau** — é isso que separa esta crate das de profissão. Em 1.000 chaves:

| Item | Faixa | Peso | Chance | Em 1.000 | Quantia |
|---|---|---:|---:|---:|---:|
| Coins | comum | 26 | 19,5% | 195 | 500 |
| Dracmas | comum | 24 | 18% | 180 | 300 |
| Limite de Armazém | comum | 6 | 4,5% | 45 | 5 |
| Limite de Máquinas | comum | 3 | 2,25% | 22,5 | 5 |
| Limite de Spawners | comum | 1 | 0,75% | 7,5 | 5 |
| Caixa Chaves | comum | 1 | 0,75% | 7,5 | 1 |
| Caixa Recursos | comum | 1 | 0,75% | 7,5 | 1 |
| Coins | comum plus | 9 | 6,75% | 67,5 | 1.000 |
| Dracmas | comum plus | 8 | 6% | 60 | 600 |
| Combustível | comum plus | 3 | 2,25% | 22,5 | 500L |
| Limite de Armazém | comum plus | 2,4 | 1,8% | 18 | 15 |
| Chave de Boss | comum plus | 2 | 1,5% | 15 | 3 |
| Limite de Máquinas | comum plus | 1,2 | 0,9% | 9 | 15 |
| Chave de Boss | comum plus | 0,6 | 0,45% | 4,5 | 5 |
| Limite de Spawners | comum plus | 0,4 | 0,3% | 3 | 15 |
| Caixa Runas | comum plus | 0,4 | 0,3% | 3 | 1 |
| Coins | comum plus plus | 3,3 | 2,48% | 24,8 | 2.000 |
| Dracmas | comum plus plus | 2,7 | 2,03% | 20,3 | 1.200 |
| Limite de Armazém | comum plus plus | 1,2 | 0,9% | 9 | 30 |
| Limite de Máquinas | comum plus plus | 0,6 | 0,45% | 4,5 | 30 |
| Limite de Spawners | comum plus plus | 0,2 | 0,15% | 1,5 | 30 |
| Robô Comum | raro | 0,8 | 0,6% | 6 | 1 |
| Limite de Armazém | raro | 0,6 | 0,45% | 4,5 | 50 |
| Caixa Boosters | raro | 0,4 | 0,3% | 3 | 1 |
| Limite de Máquinas | raro | 0,3 | 0,225% | 2,25 | 50 |
| Caixa Skins [Tier I] | raro | 0,2 | 0,15% | 1,5 | 1 |
| Limite de Spawners | raro | 0,1 | 0,075% | 0,75 | 50 |
| Caixa Caixas | raro | 0,1 | 0,075% | 0,75 | 1 |
| Robô Raro | raríssimo | 0,2 | 0,15% | 1,5 | 1 |
| Cacto | raríssimo | 0,15 | 0,113% | 1,1 | 1 |
| Caixa Skins [Tier II] | raríssimo | 0,1 | 0,075% | 0,75 | 1 |
| Cash | jackpot | 0,05 | 0,0375% | 0,375 | 250 |
| **Azar** | — | 33,3333 | **25%** | **250** | — |

> **As caixas aqui não seguem o `weight` do menu `/caixas`**, por decisão do dono. Pela ordem oficial a Caixa Skins I (weight 40) seria a mais comum das sete e a Caixa Chaves (weight 80) viria só em 4º; aqui é o inverso. A VIP é crate paga e a chave é o que se quer entregar. Nas outras crates a ordem do menu continua valendo.

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

## 9. Rendimento das crates de profissão em 20.000 aberturas

Os pesos saíram de uma corrida real de 20.000 chaves, não de estimativa.
`esperado = 20.000 × peso ÷ 133,3333`:

| Recompensa | Em 20.000 |
|---|---:|
| Chave de Boss | 840 |
| Chave VIP | 225 |
| Chave RankUP | 112 |
| Explosivo 2x2 | 300 |
| Explosivo 4x4 | 210 |
| Caixa [Tier I] | 45 |
| Armadura (por peça) | 37,5 |
| Britadeira | 37,5 |
| Booster (cada) | 31,5 |
| Skin (a mais comum) | 30 |
| Explosivo 6x6 | 27 |
| Caixa Recursos | 15 |
| Explosivo 8x8 | 10,5 |
| Caixa [Tier II] | 7,5 |

Bomba e britadeira só existem na mineração; o resto vale nas três. Os pesos de coins e da
secundária carregam duas casas decimais porque são eles que absorvem o resto da conta para
o arquivo fechar em 100.

## 10. Ponto em aberto

A família de limites da **RankUP vale 28 de peso** — o mesmo que dracmas e quase o mesmo que coins. Nas outras crates ela vale 7,5 (profissão) ou 12 (VIP). Se a regra é "limite é mais raro que moeda", essa é a crate que ainda precisa de uma decisão sobre para onde vai o peso liberado.
