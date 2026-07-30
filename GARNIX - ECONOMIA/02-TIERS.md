# 02 — TABELA DE TIERS

A tabela mestra. **Todo número de todo `.yml` deriva daqui.** Cada linha é um dia da temporada.

Última atualização: **29/07/2026**

---

## A fórmula

```
renda diária da casa no tier N  =  10.000 × 8^(N-1)
```

| Parâmetro | Valor | Por quê |
|---|---|---|
Tiers | **20** | 1:1 com os 20 ranks e os 20 spawners |
Dias | **20** | tier N = dia N, um tier novo por dia |
Crescimento | **8× por dia** | ancorado nas duas pontas físicas — ver abaixo |
T1 (dia 1) | **10⁴** | teto físico de um jogador novo |
T20 (dia 20) | **1,44×10²¹** | sextilhões |
Acumulado ao fim | **~1,65×10²¹** | |

### Por que 8× e não 10×

O crescimento não é escolhido, é **derivado das duas pontas**, e as duas são físicas:

**Ponta de baixo — o dia 1.** Um jogador novo minera ~3.000 blocos/hora à mão, e o bloco inicial vale 1 coin. Numa sessão de 3h são ~9.000 coins, mais o pouco que as 2 contas AFK rendem sem spawner. **A casa faz ~10⁴ no dia 1, e isso não é negociável** — é o que a mão do jogador produz.

**Ponta de cima — o dia 20.** O teto pedido é sextilhões, 10²¹.

`log(10²¹ / 10⁴) = 17 ordens` distribuídas em **19 saltos** (do dia 1 ao dia 20) = **0,895 ordem/dia = 7,94×/dia**, arredondado para **8×**.

> ⚠️ Uma versão anterior deste plano usava 10×/dia com `tier N = dia N`, o que colocava o T1 em **100 coins/dia para a casa inteira** — duas ordens abaixo do que um jogador novo produz só minerando. O erro foi na direção perigosa: teria feito o dia 1 parecer quebrado e o valor-base do bloco cair para fração de coin, arredondando para zero.

### O que 8×/dia garante

- **A fortuna de ontem vale 12,5% da renda de hoje.** Ninguém consegue entesourar: guardar 25% de um tier é 3% da renda do tier seguinte. É por isso que sinks de 75% não movem o número da manchete.
- **Ninguém trava.** A renda de amanhã é 8× a de hoje; quem gastou demais recupera numa sessão. Não existe espiral.
- **A lei "nunca compensa ficar parado" continua valendo.** Empilhamento máximo de um spawner = `mob-stack 3 × spawner-stack 512 = 1.536×`. Como `8³ = 512 < 1.536 < 4.096 = 8⁴`, empilhar ao máximo vale **~3,53 tiers** — e estar **4 tiers atrás segue incompensável**.

---

## Tabela mestra

Legenda: **casa** = as 3 contas somadas · **ativo/h** = conta principal · **AFK/h** = por conta AFK · **passivo/h** = alvo da via de spawners, que roda 24h (`renda/24`)

| T | Dia | Rank / Spawner | Casa/dia | Ativo/h | AFK/h | Passivo/h | Sinks (75%) |
|---|---|---|---|---|---|---|---|
| T1 | 1 | Coelho / RABBIT | 1,00×10⁴ | 1,85×10³ | 92,6 | — | 7,50×10³ |
| T2 | 2 | Porco / PIG | 8,00×10⁴ | 1,48×10⁴ | 741 | — | 6,00×10⁴ |
| T3 | 3 | Ovelha / SHEEP | 6,40×10⁵ | 1,19×10⁵ | 5,93×10³ | — | 4,80×10⁵ |
| T4 | 4 | Vaca / COW | 5,12×10⁶ | 9,48×10⁵ | 4,74×10⁴ | — | 3,84×10⁶ |
| T5 | 5 | Morcego / BAT | 4,10×10⁷ | 7,58×10⁶ | 3,79×10⁵ | — | 3,07×10⁷ |
| T6 | 6 | Jaguatirica / OCELOT | 3,28×10⁸ | 6,07×10⁷ | 3,03×10⁶ | — | 2,46×10⁸ |
| T7 | 7 | Lobo / WOLF | 2,62×10⁹ | 4,85×10⁸ | 2,43×10⁷ | 1,09×10⁸ | 1,97×10⁹ |
| T8 | 8 | Zumbi / ZOMBIE | 2,10×10¹⁰ | 3,88×10⁹ | 1,94×10⁸ | 8,74×10⁸ | 1,57×10¹⁰ |
| T9 | 9 | Esqueleto / SKELETON | 1,68×10¹¹ | 3,11×10¹⁰ | 1,55×10⁹ | 6,99×10⁹ | 1,26×10¹¹ |
| T10 | 10 | Aranha / SPIDER | 1,34×10¹² | 2,49×10¹¹ | 1,24×10¹⁰ | 5,59×10¹⁰ | 1,01×10¹² |
| T11 | 11 | PigZombie | 1,07×10¹³ | 1,99×10¹² | 9,94×10¹⁰ | 4,47×10¹¹ | 8,05×10¹² |
| T12 | 12 | Slime | 8,59×10¹³ | 1,59×10¹³ | 7,95×10¹¹ | 3,58×10¹² | 6,44×10¹³ |
| T13 | 13 | Guardian | 6,87×10¹⁴ | 1,27×10¹⁴ | 6,36×10¹² | 2,86×10¹³ | 5,15×10¹⁴ |
| T14 | 14 | MagmaCube | 5,50×10¹⁵ | 1,02×10¹⁵ | 5,09×10¹³ | 2,29×10¹⁴ | 4,12×10¹⁵ |
| T15 | 15 | Endermite | 4,40×10¹⁶ | 8,14×10¹⁵ | 4,07×10¹⁴ | 1,83×10¹⁵ | 3,30×10¹⁶ |
| T16 | 16 | Bruxa / WITCH | 3,52×10¹⁷ | 6,51×10¹⁶ | 3,26×10¹⁵ | 1,47×10¹⁶ | 2,64×10¹⁷ |
| T17 | 17 | Blaze | 2,81×10¹⁸ | 5,21×10¹⁷ | 2,61×10¹⁶ | 1,17×10¹⁷ | 2,11×10¹⁸ |
| T18 | 18 | Golem / IRON_GOLEM | 2,25×10¹⁹ | 4,17×10¹⁸ | 2,08×10¹⁷ | 9,38×10¹⁷ | 1,69×10¹⁹ |
| T19 | 19 | Ghast | 1,80×10²⁰ | 3,33×10¹⁹ | 1,67×10¹⁸ | 7,50×10¹⁸ | 1,35×10²⁰ |
| T20 | **20** | Wither | **1,44×10²¹** | 2,67×10²⁰ | 1,33×10¹⁹ | 6,00×10¹⁹ | 1,08×10²¹ |

O passivo só começa no **T7** — antes disso o jogador não tem capital para spawner e a conta daria valor de drop sub-inteiro. Ver §5 do [01-ECONOMIA.md](01-ECONOMIA.md).

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

Estes são os números que vão para as colunas `currencies:` de `GarnixMining/levels.yml` e (via **C2**) de `GarnixFarm/levels.yml`, nos 21 grupos de nível (0, 5, 10, … 100). O grupo de nível de mina `5×(N−1)` recebe o valor do tier N.

**A coluna de moeda secundária fica linear**, não exponencial: `gemas 0,2 → 3,8` ao longo dos 100 níveis, como já está no arquivo. Isso é o que mantém gemas/sementes/corais/dracmas em 3–4 ordens.

---

## Custos derivados

| T | Spawner (compra) | Rank (coins, simbólico) | Upgrade nível 1 | Upgrade nível 2 | Upgrade nível 3 |
|---|---|---|---|---|---|
| T1 | — | grátis | — | — | — |
| T2 | 4,00×10⁴ | 1,60×10³ | 8,00×10³ | 4,00×10⁴ | 1,60×10⁵ |
| T3 | 3,20×10⁵ | 1,28×10⁴ | 6,40×10⁴ | 3,20×10⁵ | 1,28×10⁶ |
| T4 | 2,56×10⁶ | 1,02×10⁵ | 5,12×10⁵ | 2,56×10⁶ | 1,02×10⁷ |
| T5 | 2,05×10⁷ | 8,20×10⁵ | 4,10×10⁶ | 2,05×10⁷ | 8,20×10⁷ |
| T6 | 1,64×10⁸ | 6,56×10⁶ | 3,28×10⁷ | 1,64×10⁸ | 6,56×10⁸ |
| T7 | 1,31×10⁹ | 5,25×10⁷ | 2,62×10⁸ | 1,31×10⁹ | 5,25×10⁹ |
| T8 | 1,05×10¹⁰ | 4,20×10⁸ | 2,10×10⁹ | 1,05×10¹⁰ | 4,20×10¹⁰ |
| T9 | 8,40×10¹⁰ | 3,36×10⁹ | 1,68×10¹⁰ | 8,40×10¹⁰ | 3,36×10¹¹ |
| T10 | 6,72×10¹¹ | 2,69×10¹⁰ | 1,34×10¹¹ | 6,72×10¹¹ | 2,69×10¹² |
| T11 | 5,37×10¹² | 2,15×10¹¹ | 1,07×10¹² | 5,37×10¹² | 2,15×10¹³ |
| T12 | 4,30×10¹³ | 1,72×10¹² | 8,59×10¹² | 4,30×10¹³ | 1,72×10¹⁴ |
| T13 | 3,44×10¹⁴ | 1,37×10¹³ | 6,87×10¹³ | 3,44×10¹⁴ | 1,37×10¹⁵ |
| T14 | 2,75×10¹⁵ | 1,10×10¹⁴ | 5,50×10¹⁴ | 2,75×10¹⁵ | 1,10×10¹⁶ |
| T15 | 2,20×10¹⁶ | 8,80×10¹⁴ | 4,40×10¹⁵ | 2,20×10¹⁶ | 8,80×10¹⁶ |
| T16 | 1,76×10¹⁷ | 7,04×10¹⁵ | 3,52×10¹⁶ | 1,76×10¹⁷ | 7,04×10¹⁷ |
| T17 | 1,41×10¹⁸ | 5,63×10¹⁶ | 2,81×10¹⁷ | 1,41×10¹⁸ | ⚠️ 5,63×10¹⁸ |
| T18 | ⚠️ 1,13×10¹⁹ | 4,50×10¹⁷ | 2,25×10¹⁸ | ⚠️ 1,13×10¹⁹ | ⚠️ 4,50×10¹⁹ |
| T19 | ⚠️ 9,00×10¹⁹ | 1,00×10¹⁸ (teto) | ⚠️ 1,80×10¹⁹ | ⚠️ 9,00×10¹⁹ | ⚠️ 3,60×10²⁰ |
| T20 | ⚠️ 7,20×10²⁰ | 1,00×10¹⁸ (teto) | ⚠️ 1,44×10²⁰ | ⚠️ 7,20×10²⁰ | ⚠️ 2,88×10²¹ |

Fórmulas: `spawner = 0,5 × casa/dia` · `rank coins = 0,02 × casa/dia` (teto 10¹⁸) · `upgrades = 0,2× / 1,0× / 4,0× o preço do spawner`.

⚠️ = **acima de `Long.MAX` (9,22×10¹⁸)**. Depende de **C1** (aprovado). A parte em coins do rank é travada em 10¹⁸ de propósito, para o rank nunca depender de C1 — o eixo de **cabeças** é que carrega a dificuldade lá em cima.

---

## O que fica em cada tier

| T | Dia | Spawner | Máquina | Boss (banda) | Caixa | Encantes de mina desbloqueados |
|---|---|---|---|---|---|---|
| T1 | 1 | — | — | — | — | `accelerated`, `blessed` |
| T2 | 2 | RABBIT | **A** | Boss 1 | — | — |
| T3 | 3 | PIG | **B** | Boss 1 | mineracao/farm/pesca **I** | `fortunate`, `gemmed` |
| T4 | 4 | SHEEP | — | Boss 1 | — | — |
| T5 | 5 | COW | **C** | Boss 1 | — | `lighthing` |
| T6 | 6 | BAT | **D** | Boss 2 | — | — |
| T7 | 7 | OCELOT | **E** | Boss 2 | — | `explosive` |
| T8 | 8 | WOLF | **F** | Boss 2 | caixa **II** | — |
| T9 | 9 | ZOMBIE | **G** | Boss 2 | — | `rupture` |
| T10 | 10 | SKELETON | — | Boss 3 | — | — |
| T11 | 11 | SPIDER | **H** | Boss 3 | — | `colapse` |
| T12 | 12 | PIG_ZOMBIE | **I** | Boss 3 | — | `snake` |
| T13 | 13 | SLIME | **J** | Boss 3 | — | `blaze`, `demolition` |
| T14 | 14 | GUARDIAN | **K** | Boss 4 | — | — |
| T15 | 15 | MAGMA_CUBE | — | Boss 4 | — | `wither` |
| T16 | 16 | ENDERMITE | **L** | Boss 4 | — | `kraken` |
| T17 | 17 | WITCH | **M** | Boss 4 | — | `meteor` |
| T18 | 18 | BLAZE | **N** | Boss 5 | — | `annihilation` |
| T19 | 19 | IRON_GOLEM | **O** | Boss 5 | — | — |
| T20 | 20 | GHAST, WITHER | — | Boss 5 | **garnix** | — |

**Notas de leitura:**
- O `release:` de cada spawner é escalonado para o dia do seu tier. É o freio de calendário — e o botão de ajuste se a temporada esticar ou encurtar, **sem recalcular valor nenhum**.
- Os spawners estão um tier deslocados dos ranks porque o **rank N libera o spawner N**: você chega ao rank 2 (Porco) no dia 2 e é aí que o RABBIT abre.
- Bandas de boss com **5 bosses** = 4 tiers cada. Ao entrar os **3 engatilhados** (total 8), redistribui para ~2,5 tiers cada — o mapeamento novo tem que estar calculado **antes** do update, não no dia.
- Máquinas em 15 bandas, mais densas em T5–T14, onde o jogador passa mais tempo consciente da progressão.
- Os encantes de mina seguem as classes de custo de infra A–E: os baratos abrem cedo, os caros (classe D/E) só no fim. `annihilation` (classe E, camada inteira da mina) abre no T18.

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
