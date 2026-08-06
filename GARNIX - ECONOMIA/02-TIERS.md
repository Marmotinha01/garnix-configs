# 02 — TABELA DE TIERS

> 🚩 **SUPERADO EM 06/08/2026.** A âncora e a repartição por via foram reescritas: a casa/dia passou de `375.000 × 6,61^(N-1)` para `1.500.000 × 6,146^(N-1)`, e a conta ativa deixou de ser 56% da renda. **A tabela válida agora é [tabela-mestra.md](../GARNIX%20-%20REORGANIZA%C3%87%C3%83O%20DA%20ECO/tabela-mestra.md).**
>
> Este documento fica pelo **método** — as derivações de throughput, o teto da mina, os 300 níveis e as leis de progressão continuam valendo. Só as duas constantes mudaram. As tabelas de valor abaixo são as antigas.

A tabela mestra. **Todo número de todo `.yml` deriva daqui.** Cada linha é um dia da temporada.

Última atualização: **30/07/2026**

---

## A fórmula

```
renda diária da casa no tier N  =  375.000 × 6,61^(N-1)
```

| Parâmetro | Valor | Por quê |
|---|---|---|
Tiers | **20** | 1:1 com os 20 ranks e os 20 spawners |
Dias | **20** | tier N = dia N, um tier novo por dia |
Crescimento | **6,61× por dia** | derivado das duas pontas, e as duas são medidas |
T1 (dia 1) | **3,75×10⁵** | o que um jogador novo produz só minerando |
T20 (dia 20) | **1,44×10²¹** | sextilhões |

### Por que 6,61× — e as duas correções que me levaram até aqui

O crescimento não é escolhido, é **derivado das duas pontas físicas**.

**Ponta de baixo — o dia 1.** Um jogador **novo** minera **70.000 blocos/hora** (medido in-game) e o bloco inicial vale 1 coin. Numa sessão de 3h são **210.000 coins**. A conta ativa é 56% da casa, então a casa faz `210.000 / 0,56 =` **3,75×10⁵ no dia 1**. Isso não é negociável — é o que a mão do jogador produz.

**Ponta de cima — o dia 20.** O teto pedido é sextilhões.

`(1,44×10²¹ / 3,75×10⁵)^(1/19) = ` **6,61×/dia**

> ⚠️ **Duas versões anteriores estavam erradas, e as duas na mesma direção: eu subestimei o dia 1.**
>
> | Versão | Crescimento | T1 | Erro |
> |---|---|---|---|
> 1ª | 10×/dia | 10² | **100 coins/dia para a casa inteira** — impossível |
> 2ª | 8×/dia | 10⁴ | supondo 3.000 blocos/h manuais |
> **atual** | **6,61×/dia** | **3,75×10⁵** | com os **70.000 blocos/h medidos** |
>
> A medição do V5-A corrigiu 7× de uma vez. Sanidade da âncora: o simulador dá **69.440 coins/h** de renda ativa no T1, contra os **70.000/h medidos** — fecha.

### O que 6,61×/dia garante

- **A fortuna de ontem vale 15% da renda de hoje.** Ninguém entesoura: guardar 25% de um tier é ~4% da renda do tier seguinte. É por isso que sinks de 75% não movem o número da manchete.
- **Ninguém trava.** A renda de amanhã é 6,6× a de hoje; quem gastou demais recupera numa sessão.
- **A lei "nunca compensa ficar parado" continua valendo — e ficou mais forte.**

  ⚠️ **Corrigido na Fase 3d, depois de eu errar duas vezes.** A fórmula real, lida em `MobManager:139-152`:

  ```
  kills/h por bloco = min( spawners no bloco , TETO do mob-stack ) × 3600 / delay
  ```

  **`mob-stack` é TETO, não multiplicador.** Detalhe completo em [13-PASSIVO.md](13-PASSIVO.md).

  | | kills/h por bloco |
  |---|---|
  | bloco **nu** — `min(64, 512) × 3600/10s` | 23.040 |
  | bloco **maxado** — `min(512, ∞) × 3600/4s` | 460.800 |
  | **ganho de maxar um bloco** | **20×** |

  Como `6,61¹ = 6,6 < 20 < 43,7 = 6,61²`, maxar um bloco vale **1,59 tier** — e estar **2 tiers atrás é incompensável**.

  Minhas três versões: `1.536×` ("4 tiers") → `60×` ("3 tiers") → **`20×` ("2 tiers")**. Cada correção **fortaleceu** a lei; a folga real é menor do que eu vinha dizendo.

---

## Tabela mestra

Legenda: **casa** = as 3 contas somadas · **ativo/h** = conta principal · **AFK/h** = por conta AFK · **passivo/h** = alvo de spawners + máquinas, que roda 24h. É **22% da renda** — a fatia da conta AFK 2, não a renda inteira

| T | Dia | Rank / Spawner | Casa/dia | Ativo/h | AFK/h | Passivo/h | Sinks (75%) |
|---|---|---|---|---|---|---|---|
| T1 | 1 | Coelho / RABBIT | 3,75×10⁵ | 6,94×10⁴ | 3,47×10³ | 3,44×10³ | 2,81×10⁵ |
| T2 | 2 | Porco / PIG | 2,48×10⁶ | 4,59×10⁵ | 2,30×10⁴ | 2,27×10⁴ | 1,86×10⁶ |
| T3 | 3 | Ovelha / SHEEP | 1,64×10⁷ | 3,03×10⁶ | 1,52×10⁵ | 1,50×10⁵ | 1,23×10⁷ |
| T4 | 4 | Vaca / COW | 1,08×10⁸ | 2,01×10⁷ | 1,00×10⁶ | 9,93×10⁵ | 8,12×10⁷ |
| T5 | 5 | Morcego / BAT | 7,16×10⁸ | 1,33×10⁸ | 6,63×10⁶ | 6,56×10⁶ | 5,37×10⁸ |
| T6 | 6 | Jaguatirica / OCELOT | 4,73×10⁹ | 8,76×10⁸ | 4,38×10⁷ | 4,34×10⁷ | 3,55×10⁹ |
| T7 | 7 | Lobo / WOLF | 3,13×10¹⁰ | 5,79×10⁹ | 2,90×10⁸ | 2,87×10⁸ | 2,35×10¹⁰ |
| T8 | 8 | Zumbi / ZOMBIE | 2,07×10¹¹ | 3,83×10¹⁰ | 1,91×10⁹ | 1,90×10⁹ | 1,55×10¹¹ |
| T9 | 9 | Esqueleto / SKELETON | 1,37×10¹² | 2,53×10¹¹ | 1,27×10¹⁰ | 1,25×10¹⁰ | 1,02×10¹² |
| T10 | 10 | Aranha / SPIDER | 9,03×10¹² | 1,67×10¹² | 8,36×10¹⁰ | 8,28×10¹⁰ | 6,77×10¹² |
| T11 | 11 | PigZombie | 5,97×10¹³ | 1,11×10¹³ | 5,53×10¹¹ | 5,47×10¹¹ | 4,48×10¹³ |
| T12 | 12 | Slime | 3,95×10¹⁴ | 7,31×10¹³ | 3,65×10¹² | 3,62×10¹² | 2,96×10¹⁴ |
| T13 | 13 | Guardian | 2,61×10¹⁵ | 4,83×10¹⁴ | 2,42×10¹³ | 2,39×10¹³ | 1,96×10¹⁵ |
| T14 | 14 | MagmaCube | 1,72×10¹⁶ | 3,19×10¹⁵ | 1,60×10¹⁴ | 1,58×10¹⁴ | 1,29×10¹⁶ |
| T15 | 15 | Endermite | 1,14×10¹⁷ | 2,11×10¹⁶ | 1,06×10¹⁵ | 1,04×10¹⁵ | 8,55×10¹⁶ |
| T16 | 16 | Bruxa / WITCH | 7,53×10¹⁷ | 1,40×10¹⁷ | 6,98×10¹⁵ | 6,91×10¹⁵ | 5,65×10¹⁷ |
| T17 | 17 | Blaze | 4,98×10¹⁸ | 9,22×10¹⁷ | 4,61×10¹⁶ | 4,57×10¹⁶ | 3,74×10¹⁸ |
| T18 | 18 | Golem / IRON_GOLEM | 3,29×10¹⁹ | 6,10×10¹⁸ | 3,05×10¹⁷ | 3,02×10¹⁷ | 2,47×10¹⁹ |
| T19 | 19 | Ghast | 2,18×10²⁰ | 4,03×10¹⁹ | 2,01×10¹⁸ | 1,99×10¹⁸ | 1,63×10²⁰ |
| **T20** | **20** | Wither | **1,44×10²¹** | 2,66×10²⁰ | 1,33×10¹⁹ | 1,32×10¹⁹ | 1,08×10²¹ |

⚠️ **A restrição "o passivo só começa no T7" caiu na Fase 3b.** Ela existia só porque eu supus que um drop sub-inteiro arredondaria para zero. **Não arredonda:** `MobConfigManager:141` lê `drops.<id>.amount` como `new BigDecimal(getString(...))` e o saldo é `VARCHAR(255)` com clamp de 2 casas para baixo (`AccountRepository:99-105`). Ou seja **valor fracionário é legal** — o T1 paga `0.678` coin por kill e a conta fecha com erro de 0,02%.

Consequência: a coluna **Passivo/h vale nos 20 tiers**, não a partir do T7, e os 20 spawners entregam o alvo com erro máximo de **0,29%** (ver [13-PASSIVO.md](13-PASSIVO.md)). O passivo dos primeiros tiers segue **pequeno em absoluto** — no T1 são 1,56×10⁴/h contra 6,94×10⁴/h da mina — mas isso é o tier falando, não uma exceção de desenho.

---

## Valor-base por unidade

O que **um** bloco / colheita / fisgada paga, **sem multiplicador nenhum**. Cresce **4,07× por tier**.

Ancoragem nas duas pontas:

| Ponta | Valor | De onde vem |
|---|---|---|
T1 | **1 coin** exato | é o que o `levels.yml` já diz para cobblestone |
T20 | **3,81×10¹¹** | `ativo/h ÷ (blocos/h × teto de multiplicador)` = `2,67×10²⁰ ÷ (7×10⁶ × 100)` |

### ⚠️ O teto da mina não existe na prática

Eu havia calculado o teto como `135.759 blocos × 120 resets/h = 1,63×10⁷/h`, a partir do `reset-cooldown: 30`. **A medição in-game mostrou que isso é falso:**

> *"volta 100% resetadinha, mina completinha de blocos novos, e sim o cooldown é aplicado — **porém se o jogador sai da mina e volta, reseta**, porque a mina não guarda estado."*

Sair e voltar contorna o cooldown. Isso não será mudado no código, então **o throughput de mineração não tem teto físico** — ele passa a ser uma **decisão de projeto**, definida pelo multiplicador da árvore de AoE.

**Alvo escolhido: AoE máximo de ~100× sobre o manual.**

| | |
|---|---|
Manual medido | **70.000 blocos/h** (3.500 em 3 min = 19,4/s) |
AoE máximo | **100×** |
Endgame | **7×10⁶ blocos/h** |

Por que 100× e não mais: 7×10⁶/h equivale a limpar **~51 minas por hora** (uma a cada 70s), ou seja usa **43% da capacidade de reset**. Sobra folga e **não exige o truque de sair e voltar**. Com 233× (o número do teto antigo) se usaria 100% do cooldown, sem nenhuma margem — e qualquer jogador que quisesse mais teria que abusar do reset.

**Sobre o manual de 70.000/h:** não é taxa de clique. Com `Efficiency 1000` (`PickaxeItem.java:114`) a quebra é instantânea, então o jogador **segura e arrasta** e o servidor entrega ~1 bloco por tick. Um jogador rápido chega a 80.000/h.

| T | Valor-base | T | Valor-base | T | Valor-base | T | Valor-base |
|---|---|---|---|---|---|---|---|
T1 | 1,00 | T6 | 1,12×10³ | T11 | 1,25×10⁶ | T16 | 1,39×10⁹ |
T2 | 4,07 | T7 | 4,54×10³ | T12 | 5,07×10⁶ | T17 | 5,66×10⁹ |
T3 | 16,6 | T8 | 1,85×10⁴ | T13 | 2,06×10⁷ | T18 | 2,30×10¹⁰ |
T4 | 67,4 | T9 | 7,52×10⁴ | T14 | 8,39×10⁷ | T19 | 9,37×10¹⁰ |
T5 | 274 | T10 | 3,06×10⁵ | T15 | 3,42×10⁸ | T20 | **3,81×10¹¹** |

✅ **APLICADO.** Estes números estão no `GarnixMining/levels.yml`, com erro máximo de **0,023%** contra o alvo.

### A mina tem 300 níveis, não 100

Com 100 níveis, 58h de temporada davam **37 min por nível** na média — e não existe curva que faça o nível 1 rápido, o 95 não-lento, e o total dar 58h. Isso gerava exatamente a reclamação de *"impossível de upar nível na mina"*.

O `maxLevel` é derivado do YAML (`MineBlocks.java:152` → `newLevels.lastKey()`), sem limite no código. Então:

| | Antes | **Agora** |
|---|---|---|
Níveis | 100 | **300** |
Grupos de bloco | 21 (a cada 5) | **21 (a cada 15)** — os mesmos, só reposicionados |
Tempo médio por nível | 37 min | **~12 min** |
Pior nível | 268 min | **21 min** |
Níveis na 1ª sessão de 3h | 59 | 24 |
Níveis por sessão no fim | **0,7** | **9,7** |

**Grupo `15k` = tier `k+1`.** Um grupo = um tier = um dia = ~uma sessão de 3h. Nível novo a cada ~12 min (recompensa frequente), bloco novo a cada ~3h (marco de sessão, e 4,07× de valor).

**A curva de XP tem tempo por nível praticamente plano** (variação de só 1,2× do nível 20 ao 285), porque o XP cresce na mesma taxa que o XP/hora (~2,93%/nível, vindo do AoE e do exp por bloco). Os níveis 1–19 são uma rampa cúbica de onboarding — o nível 1 é instantâneo. E o platô dos níveis 71–76 (1,2%/nível contra 12% dos vizinhos) desapareceu por construção.

Os `mine-level-unlock` dos 15 encantes foram remapeados para a nova escala — ver [06-ENCANTES.md](06-ENCANTES.md).

**A coluna de moeda secundária fica linear**, não exponencial: `gemas 0,2 → 3,8` ao longo dos 100 níveis, como já está no arquivo. Isso é o que mantém gemas/sementes/corais/dracmas em 3–4 ordens.

---

## Custos derivados

⚠️ **Reescrita duas vezes.** A primeira versão (`spawner = 0,5 × renda`, upgrades a `0,2/1,0/4,0×` o preço) somava **3,1× a renda diária**, 9× acima do orçamento. A segunda estava certa na fração mas errada na **unidade**: eu precificava como se **1 compra = 1 bloco**, quando `costs` é o preço de **um item de spawner** e um bloco precisa de até **512 itens** juntados para produzir no máximo. Comprar o conjunto do T20 saía por **2.304 dias** de renda.

**A unidade correta:**

```
preço por ITEM     = 0,15 × casa/dia(N) ÷ itens(N)        itens(N) = blocos(N) × spawner-stack(N)
upgrades por BLOCO = 0,20 × casa/dia(N) ÷ blocos(N)
```

Assim comprar o **conjunto inteiro** do tier N custa exatamente 15% da renda diária, e maxar **todos** os blocos custa exatamente 20% — a soma é os **35%** do [01-ECONOMIA.md](01-ECONOMIA.md), em todos os 20 tiers.

**Estes valores são exatamente o que está nos 20 `GarnixSpawners/spawners/*.yml`.**

=== THROUGHPUT: 1 bloco por TIPO, no maximo 20 ===
  T | s.stack | delay | kills/h do bloco | kills/h TOTAL | blocos "efetivos" p/ coins
  1 |      64 | 10.0s |          2.30e+4 |       2.30e+4 |                      1.000
  2 |      88 |  9.7s |          3.26e+4 |       5.56e+4 |                      1.151
  5 |     158 |  8.7s |          6.52e+4 |       2.17e+5 |                      1.178
 10 |     276 |  7.2s |          1.39e+5 |       7.53e+5 |                      1.178
 15 |     394 |  5.6s |          2.54e+5 |       1.77e+6 |                      1.178
 20 |     512 |  4.0s |          4.61e+5 |       3.61e+6 |                      1.178

  kills/h total no T20: 3.61e+6
  (o modelo anterior dizia 1,38e7 — estava 3.8x alto)
  a 19 CPS (o autoclick e mitigado em 20) com massacre 3 (64/golpe):
    capacidade de abate = 1.216/s
    producao no T20     = 1.002/s   -> DA CONTA

=== COINS: o bloco novo entrega o que FALTA, nao o alvo todo ===
  T | alvo passivo/h | fatia maq | alvo spawners/h | entregue/h | coins/kill | erro
  1 |        3.44e+3 |        0% |         3.44e+3 |    3.44e+3 |    1.49e-1 | 0.00%
  2 |        2.27e+4 |        0% |         2.27e+4 |    2.27e+4 |    4.02e-1 | 0.00%
  3 |        1.50e+5 |        3% |         1.45e+5 |    1.45e+5 |    1.56e+0 | 0.00%
  4 |        9.93e+5 |        6% |         9.31e+5 |    9.31e+5 |    6.64e+0 | 0.00%
  8 |        1.90e+9 |       19% |         1.54e+9 |    1.54e+9 |    3.32e+3 | 0.00%
 12 |       3.62e+12 |       25% |        2.71e+12 |   2.71e+12 |    2.49e+6 | -0.00%
 16 |       6.91e+15 |       25% |        5.18e+15 |   5.18e+15 |    2.30e+9 | 0.00%
 20 |       1.32e+19 |       25% |        9.89e+18 |   9.89e+18 |   2.23e+12 | 0.00%
  pior erro: 0.0000%

=== CUSTOS: 1 bloco por tier ===
  T | itens no bloco | coins/item | conjunto | upgrades do bloco | soma / renda
  1 |             64 |    8.79e+2 |  5.63e+4 |           7.50e+4 | 35.0%
  5 |            158 |    6.78e+5 |  1.07e+8 |           1.43e+8 | 35.0%
 10 |            276 |    4.91e+9 | 1.35e+12 |          1.81e+12 | 35.0%
 15 |            394 |   4.34e+13 | 1.71e+16 |          2.28e+16 | 35.0%
 20 |            512 |   4.21e+17 | 2.16e+20 |          2.88e+20 | 35.0%

=== DRACMAS ===
  T | dracmas/dia | conjunto | maxar bloco | total em dias de kill
  1 |     5.53e+3 |        0 |        1935 |                  0.35
  5 |     1.82e+5 |    36172 |       63570 |                  0.55
 10 |     1.25e+6 |   319559 |      436250 |                  0.61
 15 |     4.48e+6 |  1247525 |     1567955 |                  0.63
 20 |     1.25e+7 |  3606979 |     4381123 |                  0.64

=== CABECAS: quanto o rank deve custar para dar ~3 min ===
  rank | kills/h no rank anterior | 3 min de producao
     2 |                  2.30e+4 |           1.20e+3
     5 |                  1.52e+5 |           7.60e+3
    10 |                  6.14e+5 |           3.10e+4
    15 |                  1.52e+6 |           7.60e+4
    20 |                  3.15e+6 |           1.60e+5
| T | Itens no bloco | Spawner (coins/item) | Spawner (dracmas/item) | Maxar o bloco (coins) | coins/kill |
|---|---|---|---|---|---|
| T1 | 64 | 879 | **0** (bootstrap) | 7,50×10⁴ | 0,149 |
| T2 | 88 | 4,25×10³ | 22,1 | 4,96×10⁵ | 0,402 |
| T3 | 111 | 2,21×10⁴ | 66,6 | 3,28×10⁶ | 1,56 |
| T4 | 135 | 1,21×10⁵ | 135 | 2,17×10⁷ | 6,64 |
| T5 | 158 | 6,78×10⁵ | 228 | 1,43×10⁸ | 29,8 |
| T6 | 182 | 3,90×10⁶ | 349 | 9,46×10⁸ | 140 |
| T7 | 205 | 2,28×10⁷ | 500 | 6,26×10⁹ | 673 |
| T8 | 229 | 1,35×10⁸ | 683 | 4,13×10¹⁰ | 3,32×10³ |
| T9 | 253 | 8,11×10⁸ | 901 | 2,73×10¹¹ | 1,67×10⁴ |
| T10 | 276 | 4,91×10⁹ | 1,16×10³ | 1,81×10¹² | 8,48×10⁴ |
| T11 | 300 | 2,99×10¹⁰ | 1,46×10³ | 1,19×10¹³ | 4,59×10⁵ |
| T12 | 323 | 1,83×10¹¹ | 1,80×10³ | 7,89×10¹³ | 2,49×10⁶ |
| T13 | 347 | 1,13×10¹² | 2,20×10³ | 5,22×10¹⁴ | 1,36×10⁷ |
| T14 | 371 | 6,98×10¹² | 2,65×10³ | 3,45×10¹⁵ | 7,50×10⁷ |
| T15 | 394 | 4,34×10¹³ | 3,17×10³ | 2,28×10¹⁶ | 4,15×10⁸ |
| T16 | 418 | 2,71×10¹⁴ | 3,75×10³ | 1,51×10¹⁷ | 2,30×10⁹ |
| T17 | 441 | 1,69×10¹⁵ | 4,42×10³ | 9,96×10¹⁷ | 1,28×10¹⁰ |
| T18 | 465 | 1,06×10¹⁶ | 5,19×10³ | 6,58×10¹⁸ | 7,16×10¹⁰ |
| T19 | 488 | 6,68×10¹⁶ | 6,05×10³ | 4,35×10¹⁹ | 4,00×10¹¹ |
| T20 | 512 | 4,21×10¹⁷ | 7,04×10³ | 2,88×10²⁰ | 2,23×10¹² |

Demais fórmulas: `dracmas = 0,35 dia de kill` para o conjunto e outros `0,35` para maxar tudo (os 30% que sobram são dos 3 livros da lâmina) · `coins/kill = (casa/dia ÷ 24) ÷ (kills/h × pilha de multiplicadores)`.

A parte em coins do **rank** não está nesta tabela — vive em `GarnixRankUP/ranks/*.yml` e é `0,02 × casa/dia` com teto de 10¹⁸. O gate real do rank são **cabeças**.

✅ **`Long.MAX` deixou de ser problema nos spawners.** Com a unidade corrigida o maior valor dos 20 arquivos é **4,04×10¹⁸**, abaixo dos 9,22×10¹⁸ — nenhum campo estoura, mesmo sem quotes. Os arquivos usam quotes assim mesmo, por segurança. O **C1 fica restrito a `garnix-crates` e `garnix-bosses`**, onde o V2 achou `getDouble`.

Fórmulas: `spawner = 0,5 × casa/dia` · `rank coins = 0,02 × casa/dia` (teto 10¹⁸) · `upgrades = 0,2× / 1,0× / 4,0× o preço do spawner`.

⚠️ = **acima de `Long.MAX` (9,22×10¹⁸)**. Depende de **C1** (aprovado). A parte em coins do rank é travada em 10¹⁸ de propósito, para o rank nunca depender de C1 — o eixo de **cabeças** é que carrega a dificuldade lá em cima.

---

## O que fica em cada tier

| T | Dia | Spawner | Máquina | Boss (banda) | Caixa | Encantes de mina desbloqueados |
|---|---|---|---|---|---|---|
| T1 | 1 | — | — | — | — | `accelerated` `blessed` `fortunate` `gemmed` (0) · `lighthing` (5) · `explosive` (10) |
| T2 | 2 | RABBIT | **A** | Boss 1 | — | — |
| T3 | 3 | PIG | **B** | Boss 1 | mineracao/farm/pesca **I** | `rupture` (15) · `demolition` (25) |
| T4 | 4 | SHEEP | — | Boss 1 | — | — |
| T5 | 5 | COW | **C** | Boss 1 | — | — |
| T6 | 6 | BAT | **D** | Boss 2 | — | — |
| T7 | 7 | OCELOT | **E** | Boss 2 | — | `colapse` (45) |
| T8 | 8 | WOLF | **F** | Boss 2 | caixa **II** | — |
| T9 | 9 | ZOMBIE | **G** | Boss 2 | — | — |
| T10 | 10 | SKELETON | — | Boss 3 | — | — |
| T11 | 11 | SPIDER | **H** | Boss 3 | — | `snake` (75) |
| T12 | 12 | PIG_ZOMBIE | **I** | Boss 3 | — | — |
| T13 | 13 | SLIME | **J** | Boss 3 | — | `blaze` (105) |
| T14 | 14 | GUARDIAN | **K** | Boss 4 | — | — |
| T15 | 15 | MAGMA_CUBE | — | Boss 4 | — | `wither` (135) |
| T16 | 16 | ENDERMITE | **L** | Boss 4 | — | `kraken` (165) |
| T17 | 17 | WITCH | **M** | Boss 4 | — | `meteor` (195) |
| T18 | 18 | BLAZE | **N** | Boss 5 | — | `annihilation` (240) |
| T19 | 19 | IRON_GOLEM | **O** | Boss 5 | — | — |
| T20 | 20 | GHAST, WITHER | — | Boss 5 | **garnix** | — |

**Notas de leitura:**
- O `release:` de cada spawner é escalonado para o dia do seu tier. É o freio de calendário — e o botão de ajuste se a temporada esticar ou encurtar, **sem recalcular valor nenhum**.
- Os spawners estão um tier deslocados dos ranks porque o **rank N libera o spawner N**: você chega ao rank 2 (Porco) no dia 2 e é aí que o RABBIT abre.
- Bandas de boss com **5 bosses** = 4 tiers cada. Ao entrar os **3 engatilhados** (total 8), redistribui para ~2,5 tiers cada — o mapeamento novo tem que estar calculado **antes** do update, não no dia.
- Máquinas em 15 bandas, mais densas em T5–T14, onde o jogador passa mais tempo consciente da progressão.
- **A coluna de encantes mostra o `mine-level-unlock` entre parênteses**, na escala de **300 níveis**. Como grupo `15k` = tier `k+1`, o unlock 45 cai no T4, o 240 no T17. A classe A vem **liberada por padrão** e a classe B inteira nos primeiros ~10 minutos — ver [06-ENCANTES.md](06-ENCANTES.md).

---

## Como verificar esta tabela

O simulador ([sim/](sim/)) lê os YAMLs reais e compara contra estas colunas. **Tolerância ±25%.** Fora disso, a fase não fecha.

Os três testes que podem mover a tabela inteira:

| Teste | Se falhar |
|---|---|
**V1** — o `SUFFIX` renderiza 10²¹? | o teto desce para quintilhão e a tabela recua ~1 tier |
**V3** — `percent: true` soma ou multiplica? | o teto de 100× muda e o valor-base é recalculado |
**V5-A** — a taxa de clique manual | governa o volume de chaves (~4.800/dia) e o uptime do frenzy. O teto da mina já está confirmado por aritmética |

Protocolo em [09-VERIFICACAO.md](09-VERIFICACAO.md), metas de cronometragem em [metrics.csv](metrics.csv).
