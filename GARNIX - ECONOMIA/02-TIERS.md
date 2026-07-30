# 02 — TABELA DE TIERS

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
- **A lei "nunca compensa ficar parado" continua valendo.** Empilhamento máximo de um spawner = `mob-stack 3 × spawner-stack 512 = 1.536×`. Como `6,61³ = 289 < 1.536 < 1.909 = 6,61⁴`, empilhar ao máximo vale **~3,88 tiers** — e estar **4 tiers atrás segue incompensável**.

---

## Tabela mestra

Legenda: **casa** = as 3 contas somadas · **ativo/h** = conta principal · **AFK/h** = por conta AFK · **passivo/h** = alvo da via de spawners, que roda 24h (`renda/24`)

| T | Dia | Rank / Spawner | Casa/dia | Ativo/h | AFK/h | Passivo/h | Sinks (75%) |
|---|---|---|---|---|---|---|---|
| T1 | 1 | Coelho / RABBIT | 3,75×10⁵ | 6,94×10⁴ | 3,47×10³ | — | 2,81×10⁵ |
| T2 | 2 | Porco / PIG | 2,48×10⁶ | 4,59×10⁵ | 2,30×10⁴ | — | 1,86×10⁶ |
| T3 | 3 | Ovelha / SHEEP | 1,64×10⁷ | 3,03×10⁶ | 1,52×10⁵ | — | 1,23×10⁷ |
| T4 | 4 | Vaca / COW | 1,08×10⁸ | 2,01×10⁷ | 1,00×10⁶ | — | 8,12×10⁷ |
| T5 | 5 | Morcego / BAT | 7,16×10⁸ | 1,33×10⁸ | 6,63×10⁶ | — | 5,37×10⁸ |
| T6 | 6 | Jaguatirica / OCELOT | 4,73×10⁹ | 8,76×10⁸ | 4,38×10⁷ | — | 3,55×10⁹ |
| T7 | 7 | Lobo / WOLF | 3,13×10¹⁰ | 5,79×10⁹ | 2,90×10⁸ | 1,30×10⁹ | 2,35×10¹⁰ |
| T8 | 8 | Zumbi / ZOMBIE | 2,07×10¹¹ | 3,83×10¹⁰ | 1,91×10⁹ | 8,61×10⁹ | 1,55×10¹¹ |
| T9 | 9 | Esqueleto / SKELETON | 1,37×10¹² | 2,53×10¹¹ | 1,27×10¹⁰ | 5,69×10¹⁰ | 1,02×10¹² |
| T10 | 10 | Aranha / SPIDER | 9,03×10¹² | 1,67×10¹² | 8,36×10¹⁰ | 3,76×10¹¹ | 6,77×10¹² |
| T11 | 11 | PigZombie | 5,97×10¹³ | 1,11×10¹³ | 5,53×10¹¹ | 2,49×10¹² | 4,48×10¹³ |
| T12 | 12 | Slime | 3,95×10¹⁴ | 7,31×10¹³ | 3,65×10¹² | 1,64×10¹³ | 2,96×10¹⁴ |
| T13 | 13 | Guardian | 2,61×10¹⁵ | 4,83×10¹⁴ | 2,42×10¹³ | 1,09×10¹⁴ | 1,96×10¹⁵ |
| T14 | 14 | MagmaCube | 1,72×10¹⁶ | 3,19×10¹⁵ | 1,60×10¹⁴ | 7,19×10¹⁴ | 1,29×10¹⁶ |
| T15 | 15 | Endermite | 1,14×10¹⁷ | 2,11×10¹⁶ | 1,06×10¹⁵ | 4,75×10¹⁵ | 8,55×10¹⁶ |
| T16 | 16 | Bruxa / WITCH | 7,53×10¹⁷ | 1,40×10¹⁷ | 6,98×10¹⁵ | 3,14×10¹⁶ | 5,65×10¹⁷ |
| T17 | 17 | Blaze | 4,98×10¹⁸ | 9,22×10¹⁷ | 4,61×10¹⁶ | 2,08×10¹⁷ | 3,74×10¹⁸ |
| T18 | 18 | Golem / IRON_GOLEM | 3,29×10¹⁹ | 6,10×10¹⁸ | 3,05×10¹⁷ | 1,37×10¹⁸ | 2,47×10¹⁹ |
| T19 | 19 | Ghast | 2,18×10²⁰ | 4,03×10¹⁹ | 2,01×10¹⁸ | 9,07×10¹⁸ | 1,63×10²⁰ |
| **T20** | **20** | Wither | **1,44×10²¹** | 2,66×10²⁰ | 1,33×10¹⁹ | 5,99×10¹⁹ | 1,08×10²¹ |

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

| T | Spawner (compra) | Rank (coins, simbólico) | Upgrade nível 1 | Upgrade nível 2 | Upgrade nível 3 |
|---|---|---|---|---|---|
| T1 | — | grátis | — | — | — |
| T2 | 1,24×10⁶ | 4,96×10⁴ | 2,48×10⁵ | 1,24×10⁶ | 4,96×10⁶ |
| T3 | 8,19×10⁶ | 3,28×10⁵ | 1,64×10⁶ | 8,19×10⁶ | 3,28×10⁷ |
| T4 | 5,42×10⁷ | 2,17×10⁶ | 1,08×10⁷ | 5,42×10⁷ | 2,17×10⁸ |
| T5 | 3,58×10⁸ | 1,43×10⁷ | 7,16×10⁷ | 3,58×10⁸ | 1,43×10⁹ |
| T6 | 2,37×10⁹ | 9,46×10⁷ | 4,73×10⁸ | 2,37×10⁹ | 9,46×10⁹ |
| T7 | 1,56×10¹⁰ | 6,26×10⁸ | 3,13×10⁹ | 1,56×10¹⁰ | 6,26×10¹⁰ |
| T8 | 1,03×10¹¹ | 4,13×10⁹ | 2,07×10¹⁰ | 1,03×10¹¹ | 4,13×10¹¹ |
| T9 | 6,83×10¹¹ | 2,73×10¹⁰ | 1,37×10¹¹ | 6,83×10¹¹ | 2,73×10¹² |
| T10 | 4,52×10¹² | 1,81×10¹¹ | 9,03×10¹¹ | 4,52×10¹² | 1,81×10¹³ |
| T11 | 2,99×10¹³ | 1,19×10¹² | 5,97×10¹² | 2,99×10¹³ | 1,19×10¹⁴ |
| T12 | 1,97×10¹⁴ | 7,89×10¹² | 3,95×10¹³ | 1,97×10¹⁴ | 7,89×10¹⁴ |
| T13 | 1,30×10¹⁵ | 5,22×10¹³ | 2,61×10¹⁴ | 1,30×10¹⁵ | 5,22×10¹⁵ |
| T14 | 8,62×10¹⁵ | 3,45×10¹⁴ | 1,72×10¹⁵ | 8,62×10¹⁵ | 3,45×10¹⁶ |
| T15 | 5,70×10¹⁶ | 2,28×10¹⁵ | 1,14×10¹⁶ | 5,70×10¹⁶ | 2,28×10¹⁷ |
| T16 | 3,77×10¹⁷ | 1,51×10¹⁶ | 7,53×10¹⁶ | 3,77×10¹⁷ | 1,51×10¹⁸ |
| T17 | 2,49×10¹⁸ | 9,96×10¹⁶ | 4,98×10¹⁷ | 2,49×10¹⁸ | ⚠️ 9,96×10¹⁸ |
| T18 | ⚠️ 1,65×10¹⁹ | 6,58×10¹⁷ | 3,29×10¹⁸ | ⚠️ 1,65×10¹⁹ | ⚠️ 6,58×10¹⁹ |
| T19 | ⚠️ 1,09×10²⁰ | 1,00×10¹⁸ (teto) | ⚠️ 2,18×10¹⁹ | ⚠️ 1,09×10²⁰ | ⚠️ 4,35×10²⁰ |
| T20 | ⚠️ 7,19×10²⁰ | 1,00×10¹⁸ (teto) | ⚠️ 1,44×10²⁰ | ⚠️ 7,19×10²⁰ | ⚠️ 2,88×10²¹ |

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
