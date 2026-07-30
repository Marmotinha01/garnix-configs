# 06 — ENCANTES

Classificação dos 15 encantes de mineração e 10 de farm por **custo de infraestrutura**, e as travas que protegem o TPS com 250 contas.

Última atualização: **29/07/2026**

---

## O princípio

**Quanto mais caro o encante é para o servidor, mais raro ele ativa, mais alto ele fica na hierarquia, e mais recursos ele entrega por ativação.**

Isso protege o dedicado e, ao mesmo tempo, faz o encante caro parecer premium: o jogador vê pouco, mas quando vê, ganha muito. É a mecânica de jackpot, aplicada ao encante.

---

## 🚩 Os configs de hoje fazem o oposto

Extraí os valores reais de `GarnixMining/enchants/*.yml`:

| Encante | `base-chance` | Custo por proc | Veredito |
|---|---|---|---|
`snake` | **2.5** | 60 células × 3×3, **3 simultâneos** | 🚩 chance mais alta do arquivo, custo altíssimo |
`blaze` | **2.5** | 12 bolas de fogo × raio 1 | 🚩 idem |
`kraken` | **2.5** | 6 tentáculos × alcance × domo 1.4 | 🚩 idem |
`meteor` | **2.5** | 40 meteoros × raio 2 | 🚩 idem |
`wither` | **2.5** | 15 caveiras × **raio 3** | 🚩 idem |
`colapse` | 0.20 | esfera raio 3 (~113 blocos) | mais raro sendo mais barato |
`demolition` | 0.15 | — | o mais raro de todos, e um dos mais baratos |
**`annihilation`** | **60** ⚠️ | **camada inteira: 59×59 = 3.481 blocos** | 🚩🚩 **o mais caro do jogo, 60% de chance no nível 1** |

**Os 5 encantes que spawnam entidades móveis com animação longa têm a MAIOR chance do arquivo.** E o `annihilation`, que destrói a camada inteira da mina, dispara 60% das vezes já no nível 1 do desbloqueio (nível 60 de mina) — enquanto todos os irmãos AoE usam 0,15 a 2,5.

Com `increase-chance: 0.05`, o `annihilation` vai de **60% no nível 1 a 64,95% no nível 100**: uma escada de 5 pontos ao longo de 100 níveis, custando 74,75 milhões de gemas. Quase certamente era para ser **`0.60`**.

---

## Classes de custo

Vetores de custo real: block updates + física · pacotes de partícula · spawn de entidade · duração da animação (concorre pelo orçamento de pacotes) · alvos simultâneos.

| Classe | Custo de infra | Encantes | `base-chance` no nível 100 | Blocos/proc | Desbloqueio |
|---|---|---|---|---|---|
**A** | nenhum — passivo ou multiplicador puro | `accelerated` · `fortunate` · `gemmed` · `blessed` | passivo / alto | 1 | nível 0–5 |
**B** | poucos updates, partícula estática | `lighthing` · `rupture` · `explosive` · `demolition` | 3–8% | 1–27 | nível 10–20 |
**C** | esfera raio 3, muitos updates | `colapse` | 1,5–2% | ~113 | nível 30 |
**D** | **entidades móveis + animação longa** | `snake` · `blaze` · `kraken` · `meteor` · `wither` | **0,4–0,8%** | 24–126 | nível 35–50 |
**E** | **camada inteira da mina** | `annihilation` | **0,10–0,15%** | **3.481** | nível 60+ |

### O que muda em cada eixo, de A para E

| Eixo | A → E |
|---|---|
Chance | alta → **muito baixa** (2 ordens de diferença) |
Blocos por proc | 1 → **3.481** |
Custo em gemas | barato → **caro** (a árvore D/E é o último gasto da temporada) |
Nível de desbloqueio | 0 → **60+** |
`max-level` | 100 → **menor nos caros** — não faz sentido ter 100 degraus de algo que custa 3.481 block updates |
`max-simultaneous` | ausente → **obrigatório** (hoje **só o `snake` tem**, com valor 3) |

---

## Como o "paga mais por ativar menos" se realiza

Na maior parte, **de graça, pela própria contagem de blocos.**

```
annihilation a 0,12% × 3.481 blocos = ~4,2 blocos esperados por bloco manual
```

Raro de ver, enorme quando acontece. **É a mecânica de jackpot que o jogador de RankUP adora, e sai sem código novo.** O encante caro não precisa de um campo de bônus especial — ele já paga mais porque quebra mais blocos, e cada bloco paga o valor do tier.

---

## Travas de infraestrutura

| Trava | Hoje | Alvo | Por quê |
|---|---|---|---|
**`enchant-animation-budget`** (`GarnixMining/config.yml`) | **0 = ilimitado** | **10.000** | O comentário do próprio arquivo mede **500 mineradores no nível máximo em 77.000 pacotes/tick** e recomenda 10.000 |
**`enchant-max-simultaneous-global`** (`GarnixFarm/config.yml`) | 80 | validar sob carga | mesma lógica no farm |
**`max-simultaneous` por encante** | só o `snake` (3) | **obrigatório nas classes D e E** | um proc de classe E em 20 jogadores ao mesmo tempo é o pico de carga |
**`reset-cooldown`** (mina) | 30s | **não mexer antes do V5** | é o teto real de throughput: 135.700 blocos ÷ 30s = 1,6×10⁷/h |

**Detalhe correto do design existente que vale preservar:** quando o orçamento de animação estoura, o jogador **perde a animação mas recebe o pagamento**. Degradação justa, não punitiva. O comentário do arquivo é explícito: *"o orçamento NÃO deixa os efeitos mais baratos, ele só decide quem ganha um"*.

---

## O teto que ninguém pode furar

A árvore de AoE hoje soma **~2.600× de throughput** por bloco manual. Mas a mina entrega no máximo **1,6×10⁷ blocos/h**.

```
2.600 × 10.000 blocos manuais/h = 2,6×10⁷  >  1,6×10⁷ = capacidade da mina
```

**Acima do teto, subir chance de AoE não gera coin nenhum e só queima CPU.** As chances das classes C/D/E têm que ser calibradas **contra esse teto**, não contra a sensação.

Isso também explica por que britadeira e bombas podem ficar sem nerf ([03-RANKING-APELOES.md](03-RANKING-APELOES.md)): elas **aceleram até o teto**, não furam o teto.

---

## Os multiplicadores — o que o V3 mudou

`fortunate` e `gemmed` são classe A (custo de infra zero) mas são os encantes de maior impacto econômico, porque são **multiplicativos** — os únicos da árvore que multiplicam em vez de somar.

| Arquivo | Hoje | Alvo | Resultado no nível 100 |
|---|---|---|---|
`fortunate.yml` `increase-multiplier` | **1.0** | **0.14** | **14,91×** (era 100×) |
`gemmed.yml` `increase-multiplier` | **1.0** | **0.02** | 3,03× — mantém gemas linear |
`GarnixFarm/prosperity.yml` | 0.02 | **0.14** | 14,91× — pareado com mineração |
`GarnixFarm/fertility.yml` | 0.02 | manter | 3,03× |

**Duas assimetrias que isso corrige:** hoje o `fortunate` da mineração é **33× mais forte** que o `prosperity` do farm no mesmo slot; e o `gemmed` infla gemas 100× enquanto o `fertility` infla sementes só 3× — que é exatamente por que o sink de gemas evapora.

E o `fortunate` **nunca vai para o site** — é o maior multiplicador do jogo e só se compra com gemas. É a recompensa do jogador dedicado.

---

## Sink da árvore

| Via | Custo total hoje | Problema | Alvo |
|---|---|---|---|
Mineração (15 encantes) | **6,42×10⁸ gemas** | comprável em minutos se gemas subir junto com o tier | ~11h de renda linear de gemas, com **D/E sendo o último gasto da temporada** |
Farm (10 encantes) | **3,96×10⁶ sementes** | **162× mais barata** que a de mineração pelo mesmo slot | subir ~40× |

`enchant-refund-percentage: 40.0` nos dois plugins — o desencantar devolve 40%. A revisar: é um vazamento controlado, mas 40% é generoso se a árvore for o sink principal.

---

## Farm — os 10 encantes

Mesma estrutura, moeda `sementes`, e `enchant-currency: sementes`.

| Encante | max-level | base/increase | Efeito | Classe |
|---|---|---|---|---|
`prosperity` | 100 | 100 / 50 | **multiplicador de coins** | **A** |
`fertility` | 100 | 150 / 60 | multiplicador de sementes | **A** |
`clover` | 50 | 1000 / 400 | → chave `fazenda` ⚠️ ver bug | **A** |
`haste` | **2** | 400 / 400 | poção de speed, passivo | **A** |
`cataclysm` | 50 | 500 / 200 | AoE | B |
`reap` | 50 | 700 / 250 | AoE raio 4 | B/C |
`laser` | 50 | 800 / 300 | AoE | B/C |
`crossroads` | 50 | 800 / 300 | AoE | B/C |
`swarm` | 50 | 1200 / 450 | `bonus-percentage: 10.0`, `increase-bonus: 0.4` | C |
`scarecrow` | 50 | 1500 / 600 | AoE | C/D |

🚩 **`clover` aponta para `key-id: "fazenda"` mas a crate é `farm.yml`.** Provável mismatch — a chave de farm pode não estar sendo entregue hoje. Confirmar antes de orçar o volume de chaves.

---

## Resumo do trabalho na Fase 2

1. Reclassificar os 15 encantes de mineração nas classes A–E e reescrever `base-chance`, `increase-chance`, `max-level`, `mine-level-unlock`, `max-simultaneous` e custo em gemas conforme a classe.
2. `annihilation.yml`: `base-chance: 60 → ~0.12` no nível 100 (classe E).
3. **Baixar as chances de `snake`/`blaze`/`kraken`/`meteor`/`wither`** — hoje são as maiores do arquivo sendo as mais caras (classe D).
4. `fortunate.yml` e `prosperity.yml`: `increase-multiplier → 0.14`. `gemmed.yml`: `→ 0.02`.
5. Recustar as duas árvores; a de farm sobe ~40×.
6. `enchant-animation-budget: 0 → 10.000` e `max-simultaneous` nas classes D/E.
7. Calibrar C/D/E contra o teto de 1,6×10⁷ blocos/h — **depois do V5**.
8. Corrigir o `key-id` do `clover`.
9. Corrigir o platô de XP dos níveis 70–76 do `levels.yml` (cresce 1,2%/nível contra 12% dos vizinhos — 6 níveis quase grátis no meio da escada).
