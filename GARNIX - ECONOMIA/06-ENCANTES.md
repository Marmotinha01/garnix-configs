# 06 — ENCANTES

Classificação dos 15 encantes de mineração por **custo de infraestrutura**, escada de desbloqueio, chances e custos.

> ✅ **APLICADO na Fase 2.** Os 15 arquivos de `GarnixMining/enchants/` estão calibrados. Este documento é o estado final, não uma proposta.

Última atualização: **30/07/2026**

---

## O princípio

**Quanto mais roubado o encante é — mais dinheiro dá e mais custa ao dedicado — mais tarde ele desbloqueia, mais raro ele ativa, e mais caro ele é em gemas.**

Isso protege o TPS e faz o encante caro parecer premium: o jogador vê pouco, mas quando vê, ganha muito. É a mecânica de jackpot aplicada ao encante.

E o corolário que o dono pediu: **os encantes simples e médios vêm liberados cedo ou por padrão.** Ninguém deve precisar de horas de jogo para desbloquear um `explosive`.

---

## Blocos por proc — lidos do código, não estimados

Isto é a base de todo o resto. Os valores vêm de `EnchantEffects.java` e das classes de efeito.

| Encante | Blocos/proc | Mecânica | Fonte |
|---|---|---|---|
`explosive` | **27** | cubo 3×3×3 | `explode()`, raio 1 |
`lighthing` | **38** | **a coluna vertical inteira** (Y 26→64) | `lightning()` |
`rupture` | **59** | **linha nos dois sentidos**, atravessa a região | `rupture()` |
`colapse` | **113** | esfera raio 3 | `collapse()` |
`demolition` | **232** | **asterisco de 8 direções** até a borda | `demolish()` |
`blaze` | **324** | 12 bolas de fogo × cubo raio 1 | `BlazeEffect` |
`snake` | **540** | 60 células × 3×3, **3 simultâneas** | `SnakeEffect` |
`kraken` | **540** | 6 tentáculos × alcance 10 × 3×3 | `KrakenEffect` |
`meteor` | **1.340** | 40 meteoros × esfera raio 2 | `MeteorEffect` |
`wither` | **1.696** | 15 caveiras × esfera raio 3 | `WitherEffect` |
**`annihilation`** | **3.481** | **a camada inteira da mina: 59×59** | `annihilate()` |

⚠️ **Três desses eu havia estimado errado no papel** e a leitura do código corrigiu: `lighthing` (chutei 1, é 38), `rupture` (chutei 1, é 59) e `demolition` (chutei 27, é 232). Isso reclassificou `demolition` de B para C.

---

## Ranking de "roubado"

`roubado` = média entre **quanto dinheiro dá** (blocos extra por bloco manual) e **quanto custa ao servidor** (block updates + entidades × 40 + peso da animação).

| # | Classe | Encante | Chance nv300 | Blocos/proc | Roubado | Unlock |
|---|---|---|---|---|---|---|
1 | **E** | **`annihilation`** | 0,69% | 3.481 | **100** | **240** |
2 | D | `meteor` | 0,67% | 1.340 | 7 | 195 |
3 | D | `wither` | 0,53% | 1.696 | 7 | 135 |
4 | D | `kraken` | 1,67% | 540 | 2 | 165 |
5 | D | `snake` | 1,67% | 540 | 2 | 75 |
6 | D | `blaze` | 2,78% | 324 | 2 | 105 |
7 | C | `demolition` | 3,88% | 232 | ~0 | 25 |
8 | C | `colapse` | 7,96% | 113 | ~0 | 45 |
9 | B | `rupture` | 6,78% | 59 | ~0 | 15 |
10 | B | `lighthing` | 10,53% | 38 | ~0 | 5 |
11 | B | `explosive` | 14,81% | 27 | ~0 | 10 |
12–15 | A | `accelerated` · `blessed` · `fortunate` · `gemmed` | — | 0 | 0 | **0** |

**A ordem de desbloqueio é coerente com o ranking:** quanto mais roubado, mais tarde libera.

---

## Classes de custo de infra

| Classe | Custo | Encantes | Unlock | Peso no throughput |
|---|---|---|---|---|
**A** | nenhum — passivo ou multiplicador puro | `accelerated` · `blessed` · `fortunate` · `gemmed` | **0, liberados por padrão** | 0% |
**B** | poucos updates, partícula estática | `lighthing` 5 · `explosive` 10 · `rupture` 15 | **5–15** (primeiros ~10 min) | 12% |
**C** | área média, muitos updates | `demolition` 25 · `colapse` 45 | 25–45 | 18% |
**D** | **entidades móveis + animação longa** | `snake` 75 · `blaze` 105 · `wither` 135 · `kraken` 165 · `meteor` 195 | 75–195 | 45% |
**E** | **camada inteira da mina** | `annihilation` | **240** | 24% |

**Classe A liberada por padrão e classe B inteira nos primeiros ~10 minutos** — é o que responde à reclamação de "tenho que upar muito para desbloquear encante simples".

---

## 500 níveis por encante — granularidade sem mudar nada

Jogador de RankUP gosta de **muitos** níveis de encante: falsa sensação de evolução, mas visível. E isso é um ganho puro, porque **subir o `max-level` não muda o teto de poder nem o custo total** — muda só a granularidade. Mesmo destino, 5× mais degraus.

As fórmulas do plugin são lineares (`Enchant.java:178-209`), e o `max-level` vem do YAML sem limite no código:

```java
maxLevel         = config.getInt("max-level");
getChance(l)     = baseChance     + (l-1) * increaseChance;
getMultiplier(l) = baseMultiplier + (l-1) * increaseMultiplier;
getCost()        = soma de baseCost + (targetLevel-1) * increaseCost;
```

Então para preservar o teto no novo máximo `M`: `increase = (teto − base) / (M − 1)`. E para preservar o custo total `T` com base em 20% do custo médio: `inc = 1,6·T / (M·(M−1))`.

| | Antes | **Agora** |
|---|---|---|
`max-level` por encante | 100 | **500** |
**Total de níveis de encante** | 1.403 | **7.003** |
Teto de poder de cada um | — | **idêntico** |
Custo total da árvore | 8,08×10⁸ | **7,97×10⁸** (idêntico, ±1% de arredondamento) |

`accelerated` **fica em 3** — é amplificador de `PotionEffectType.SPEED`, nível 500 seria absurdo.

**Níveis por minuto no endgame** (com 1,45×10⁸ gemas/h), que é a sensação que isso entrega:

| Encante | Níveis/min | | Encante | Níveis/min |
|---|---|---|---|---|
`annihilation` | 5 | | `colapse` | 81 |
`meteor` | 8 | | `demolition` | 121 |
`kraken` | 10 | | `rupture` | 202 |
`wither` | 12 | | `explosive` | 303 |
`blaze` | 16 | | `lighthing` | 484 |
`snake` | 20 | | `blessed`/`fortunate`/`gemmed` | ~2.600 |

Os baratos capam cedo; os caros são o grind da temporada. **Sempre tem algo subindo.**

---

## Estado final aplicado

| Encante | Unlock | max | `base-chance` | `increase-chance` | Teto | `base-cost` | `increase-cost` | Custo total |
|---|---|---|---|---|---|---|---|---|
`accelerated` | 0 | 3 | — | — | passivo | 100 | 200 | 9,0×10² |
`blessed` | 0 | 500 | 0.019 | 1.524e-4 | **0,095%** | 160 | 3 | 4,5×10⁵ |
`fortunate` | 0 | 500 | — | `inc-multiplier: 0.02778` | **14,91×** | 200 | 3 | 4,7×10⁵ |
`gemmed` | 0 | 500 | — | `inc-multiplier: 0.003968` | 3,03× | 200 | 3 | 4,7×10⁵ |
`lighthing` | 5 | 500 | 2.11 | 0.01688 | 10,53% | 998 | 16 | 2,5×10⁶ |
`explosive` | 10 | 500 | 2.96 | 0.02381 | 14,84% | 1600 | 25.6 | 4,0×10⁶ |
`rupture` | 15 | 500 | 1.36 | 0.01087 | 6,79% | 2400 | 38.4 | 6,0×10⁶ |
`demolition` | 25 | 500 | 0.776 | 0.00621 | 3,88% | 3990 | 64 | 1,0×10⁷ |
`colapse` | 45 | 500 | 1.59 | 0.01278 | 7,97% | 5980 | 95.9 | 1,5×10⁷ |
`snake` | 75 | 500 | 0.333 | 0.002678 | 1,67% | 23900 | 383 | 6,0×10⁷ |
`blaze` | 105 | 500 | 0.556 | 0.004444 | 2,77% | 29900 | 479 | 7,5×10⁷ |
`wither` | 135 | 500 | 0.106 | 8.511e-4 | 0,53% | 39900 | 640 | 1,0×10⁸ |
`kraken` | 165 | 500 | 0.333 | 0.002678 | 1,67% | 49900 | 800 | 1,25×10⁸ |
`meteor` | 195 | 500 | 0.134 | 0.001077 | 0,67% | 59900 | 960 | 1,5×10⁸ |
**`annihilation`** | **240** | **500** | **0.138** | **0.001105** | **0,69%** | **99800** | **1600** | **2,5×10⁸** |

**O custo cresce monotonicamente com o desbloqueio**, de 9×10² a 2,5×10⁸. Duas correções foram necessárias para isso: `demolition` custava 3,0×10⁷ (mais que o `colapse`, que desbloqueia depois) e `annihilation` custava 7,4×10⁷ (o 4º mais barato da classe D/E, sendo o mais roubado de todos).

---

## O throughput da árvore: de 2.602× para 100×

| | Antes | **Agora** |
|---|---|---|
Soma do throughput da árvore no máximo | **2.602×** | **100×** |
Fatia do `annihilation` | **87%** | **24%** |

O `annihilation` estava com `base-chance: 60` — **60% de chance de destruir a camada inteira já no nível 1**, enquanto todos os irmãos AoE usavam 0,15 a 2,5. Era 87% de todo o throughput da mina.

Distribuição atual dos 99 blocos-extra por bloco manual: **classe B 12% · C 18% · D 45% · E 24%.** Nenhum encante passa de 24%.

**Por que 100× e não mais:** o teto de throughput da mina é uma decisão de projeto, não um limite físico — o `reset-cooldown: 30` é contornável saindo e voltando da mina. 100× sobre os 70.000 blocos/h manuais dá **7×10⁶ blocos/h**, que equivale a limpar ~51 minas/hora e usa **43% da capacidade de reset**. Sobra folga e ninguém precisa do truque. Ver [02-TIERS.md](02-TIERS.md).

---

## Travas de infraestrutura

| Trava | Antes | **Agora** | Por quê |
|---|---|---|---|
**`enchant-animation-budget`** | **0 = ilimitado** | ✅ **10.000** | é o valor que o próprio comentário do arquivo recomenda, após medir 500 mineradores no máximo em 77.000 pacotes/tick |
**`frenzy.blocks-required`** | 1000 | ✅ **3500** | a 19,4 blocos/s medidos, 1.000 blocos enchiam em 51s contra uma janela de 180s → frenzy **permanente**. Com 3.500 o enchimento leva 180s, igual à duração, dando **50% de uptime** = o 1,5× efetivo do orçamento |
`enchant-max-simultaneous-global` (farm) | 80 | validar sob carga | mesma lógica no farm |
**`max-simultaneous` por encante** | só o `snake` (3) | ✅ **nada a fazer — o plugin já resolve** | ver abaixo |

**Detalhe do design existente que vale preservar:** quando o orçamento de animação estoura, o jogador **perde a animação mas recebe o pagamento**. Degradação justa. O comentário do arquivo é explícito: *"o orçamento NÃO deixa os efeitos mais baratos, ele só decide quem ganha um"*.

E a confirmação de que o frenzy funciona como eu supunha, de `FrenzyManager.tryAccumulate()`: *"accumulation **pauses during a frenzy** and **resumes from zero** after it ends"* — o ciclo é `enchimento + duração`, e é por isso que 3.500 dá exatamente 50%.

### O `max-simultaneous` já está resolvido no código

Eu ia adicionar `max-simultaneous` nas classes D e E. **Não é necessário** — o `AnimationRegistry` já implementa três camadas:

```java
register(animation)  →  register(animation, 1);   // blaze, wither, kraken, meteor: 1 por jogador
// snake: o cap vem de snake.yml:max-simultaneous (3) — e o comentario diz que ele
//        e "the ONLY stacking animation"
if (budget > 0 && globalActiveCost() + animation.tickCost() > budget) return false;
```

1. **Cap por jogador de 1** para blaze, wither, kraken e meteor. O `snake` é o único que empilha.
2. **Orçamento global** em unidades de tick-cost — é exatamente o `enchant-animation-budget` que passou de 0 para 10.000. E ele **inclui o custo do próprio candidato**, *"so a kraken cannot slip in on the last few units of a nearly-spent budget"*.
3. **Contagem atômica** por jogador via `compute()`, então threads netty concorrentes não estouram o cap.

A classe E (`annihilation`) é **síncrona**, não é animação — não passa pelo registry e não tem custo de tick.

**Custo real por jogador com a árvore D inteira rodando:**

| Animação | `tickCost` | Cap | Total |
|---|---|---|---|
**`kraken`** | **185** (`tentacles 6 × tentacle-length 20 + 65`) | 1 | **185** |
`wither` | 21 | 1 | 21 |
`blaze` | 18 | 1 | 18 |
`meteor` | 9 | 1 | 9 |
`snake` | 4 (`SEGMENT_COUNT 8 ÷ STEP_PERIOD 2`) | 3 | 12 |
| | | | **245** |

Com o orçamento em 10.000 cabem **~40 mineradores simultâneos** com tudo rodando. Com 100–250 online (a maioria AFK, não minerando), os ativos são ~33–80 — cobre bem em 100 e degrada pela metade em 250, **sempre pagando mesmo sem animação**.

🚩 **O `kraken` é 185 dos 245 — 75% do custo por jogador.** Se o teste de carga L1 acusar, é ele o botão de ajuste, e o multiplicador é o `tentacle-length: 20`.

---

## Os multiplicadores

`fortunate` e `gemmed` são classe A (custo de infra zero) mas são os de maior impacto econômico, porque são os **únicos multiplicativos** da árvore — todo o resto soma.

| Arquivo | Antes | **Agora** | No nível 100 |
|---|---|---|---|
`fortunate.yml` | `increase-multiplier: 1.0` | ✅ **0.14** | **14,91×** (era 100×) |
`gemmed.yml` | `1.0` | ✅ **0.02** | 3,03× — mantém gemas linear |
`GarnixFarm/prosperity.yml` | `0.02` | ✅ **0.14** | 14,91× — pareado com mineração |
`GarnixFarm/fertility.yml` | `0.02` | manter | 3,03× |

**Duas assimetrias corrigidas:** o `fortunate` era **33× mais forte** que o `prosperity` no mesmo slot, e o `gemmed` inflava gemas 100× enquanto o `fertility` inflava sementes 3×.

E o `fortunate` **nunca vai para o site** — é o maior multiplicador do jogo e só se compra com gemas. É a recompensa do jogador dedicado, não do pagante.

---

## Sink da árvore

| Via | Custo | Situação |
|---|---|---|
Mineração (15 encantes) | **8,08×10⁸ gemas** | ✅ **62% da renda de gemas da temporada** (1,30×10⁹) — sink de verdade |
Farm (10 encantes) | **3,96×10⁶ sementes** | ⚠️ **204× mais barata** pelo mesmo slot. Subir na Fase 4 |

> ⚠️ **Correção de uma afirmação minha que estava errada.** Eu havia escrito que a árvore de mineração era *"comprável em minutos"*. **Não é** — a árvore antiga já consumia 49% da renda de gemas da temporada. O erro veio de supor que gemas subiam junto com o tier: elas não sobem. A coluna `gemas` do `levels.yml` é **linear** (0,2 → 3,8) e a renda cresce só por throughput e pelo `gemmed`.

`enchant-refund-percentage: 40.0` nos dois plugins — desencantar devolve 40%. A revisar: é um vazamento controlado, mas 40% é generoso se a árvore é o sink principal.

---

## Farm — os 10 encantes (Fase 4)

Mesma estrutura, moeda `sementes`, `enchant-currency: sementes`.

| Encante | max-level | base/increase | Efeito | Classe |
|---|---|---|---|---|
`prosperity` | 100 | 100 / 50 | **multiplicador de coins** ✅ já em 0.14 | **A** |
`fertility` | 100 | 150 / 60 | multiplicador de sementes | **A** |
`clover` | 50 | 1000 / 400 | → chave `fazenda` ⚠️ ver bug | **A** |
`haste` | **2** | 400 / 400 | poção de speed, passivo | **A** |
`cataclysm` | 50 | 500 / 200 | AoE | B |
`reap` | 50 | 700 / 250 | AoE raio 4 | B/C |
`laser` | 50 | 800 / 300 | AoE | B/C |
`crossroads` | 50 | 800 / 300 | AoE | B/C |
`swarm` | 50 | 1200 / 450 | `bonus-percentage: 10.0`, `increase-bonus: 0.4` | C |
`scarecrow` | 50 | 1500 / 600 | AoE | C/D |

🚩 **`clover` aponta para `key-id: "fazenda"` mas a crate é `farm.yml`.** Provável mismatch — a chave de farm pode não estar sendo entregue. Confirmar antes de orçar o volume de chaves do farm.

---

## O que falta

| # | Item | Fase |
|---|---|---|
1 | ~~`max-simultaneous` nas classes D e E~~ — ✅ **o plugin já resolve**, ver acima | — |
2 | Ler o que `lighthing`, `rupture` e `cataclysm` do farm realmente quebram, e calibrar o farm igual | 4 |
3 | Subir a árvore de farm ~204× | 4 |
4 | Corrigir o `key-id` do `clover` | 4 |
5 | Teste de carga L1 com a árvore no máximo e 250 contas | pré-lançamento |
