# GARNIX — ECONOMIA

Diretório de trabalho da economia da temporada. Todo material de projeto, cálculo e verificação vive aqui.

**Regra:** nenhum valor entra num `.yml` de plugin sem estar derivado de um número deste diretório. Todo YAML editado cita o tier de onde o número saiu.

---

## Índice

| Arquivo | O que é | Status |
|---|---|---|
| [00-PLANO.md](00-PLANO.md) | O plano completo. **Documento vivo** — atualizado a cada decisão | ✅ |
| [01-ECONOMIA.md](01-ECONOMIA.md) | Documento mestre: moedas, eixos, leis de projeto, orçamentos | ✅ |
| [02-TIERS.md](02-TIERS.md) | Tabela T1–T20 expandida, com todos os números derivados | ✅ |
| [03-RANKING-APELOES.md](03-RANKING-APELOES.md) | Ranking de poder de cada vantagem + canal de aquisição | ✅ |
| [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md) | Cada produto do site ↔ sua rota in-game e custo em horas | ⏳ Fase 7, com o cash-shop |
| [05-MULTIPLICADORES.md](05-MULTIPLICADORES.md) | O orçamento de 100× detalhado por via | ✅ está em [01](01-ECONOMIA.md#6-orçamento-de-multiplicadores--teto-de-100) |
| [06-ENCANTES.md](06-ENCANTES.md) | Classes A–E de custo de infra, chances, custos, travas | ✅ |
| [07-LIVROS.md](07-LIVROS.md) | Os 3 sistemas de livro e as tabelas de loot de cada nível | ⏳ Fase 5, com as tabelas de loot |
| [08-CASH.md](08-CASH.md) | Orçamento de cash: faucets, sinks, faixas de preço | ✅ |
| [09-VERIFICACAO.md](09-VERIFICACAO.md) | Protocolo de testes V1–V8 + resultados medidos | ✅ |
| [10-ITENS.md](10-ITENS.md) | Os ~212 itens ativáveis: força, rota, preço, tier, raridade | ✅ |
| [11-CACTO.md](11-CACTO.md) | A via do cacto: reinvestimento, freios, paridade | ✅ |
| [TESTES-IN-GAME.md](TESTES-IN-GAME.md) | **Checklist do que testar no jogo** — deixe aberto do lado enquanto testa | ✅ |
| [metrics.csv](metrics.csv) | Metas de cronometragem por tier vs medido in-game | ✅ |
| [sim/](sim/) | Simulador em JavaScript — abre `sim/index.html` no navegador | ✅ |
| [bosses-engatilhados/](bosses-engatilhados/) | Os 3 bosses prontos para lançar como update no meio da temporada | ⏳ |

---

## Resultado da verificação

Protocolo completo e evidências em [09-VERIFICACAO.md](09-VERIFICACAO.md).

| Teste | O que descobre | Status |
|---|---|---|
| **V1** | O formatter `SUFFIX` tem sufixo para sextilhão? | ✅ **PASSA** — tabela vai a 10⁶³, sextilhão é `S` |
| **V2** | Campos de spawner/crate/shop truncam acima de `Long.MAX`? | ✅ **spawners/máquinas/rankup seguros** · ⚠️ crates e bosses perdem precisão acima de 9×10¹⁵ |
| **V3** | `percent: true` **soma ou multiplica**? | ✅ **SOMAM** — e o **booster também soma**. Rank e VIP **competem** pelo mesmo nó |
| **V4** | A chave `gems` dos spawners funciona, sendo que o ID da moeda é `gemas`? | ✅ **é bug** — auditoria de moedas limpa exceto `gems` (120×), que sai por projeto |
| **V5-B** | O teto da mina em blocos/hora | ⚠️ **não existe** — sair e voltar reseta. Virou decisão de projeto: **7×10⁶/h** |
| **V5-A** | Sua taxa de clique manual (blocos/hora à mão) | ⏳ **o único que falta, 3 minutos in-game** |
| **V6** | Prestigiar quebra os spawners já colocados? | ✅ **não** — continuam produzindo |
| **V7** | O proc de chave dispara em bloco de AoE ou só manual? | ✅ **em todo bloco de área**. **C7 desnecessário** |
| **V8** | `cost-increase-percent` é composto ou linear? | ✅ **LINEAR** — resolvido no código |

**Os 8 testes estão fechados** — 4 resolvidos lendo o código, 4 medidos in-game. **A Fase 2 está liberada.**

O **V8** trouxe três notícias boas: os custos do RankUP já são `BigDecimal` (essa parte do C1 está pronta), o multiplicador de prestígio **se aplica também aos custos em `head`** — então a trava de ritmo do eixo de cabeças funciona sem código novo — e o `/ranks` **já mostra o custo ajustado**. Usar `cost-increase-percent: 10`; prestígio 500 custa 51× o base.

E o **V3** foi a descoberta maior: a fórmula real é `base × fortunate × (1 + booster% + skin% + armadura% + permBonus%) × frenzy`. O **booster soma** (`multiplicador − 1,0`), não multiplica — o que liberou orçamento e deixou o `fortunate` ir a `increase-multiplier: 0.14` (14,91×), o dobro do que eu havia orçado. E **o bônus de rank e o de VIP competem pelo mesmo nó `mining.bonus.<N>`: o maior vence, não somam** — então a escada de VIP foi redesenhada para *substituir* o bônus de rank por um valor maior.

Também ficou fechado que **não há economia escondida fora do repo de configs**: `garnix-battle-pass`, `garnix-dungeons`, `garnix-tags` e `garnix-logger` são pastas vazias (zero `.java`, zero `.yml`), e `queues`/`lobby`/`proxy` são infraestrutura de rede.

## O simulador

`sim/index.html` no navegador, ou `node sim/sim.js` no terminal. Estado atual: **MODELO CONSISTENTE**.

Ele já corrigiu três coisas que estavam erradas no papel:

| # | O que ele pegou |
|---|---|
1 | **O crescimento de 10×/dia era impossível.** Dava T1 = 100 coins/dia para a casa inteira, duas ordens abaixo do que um jogador novo produz só minerando à mão. O correto é **8×/dia**, derivado das duas pontas físicas |
2 | **O prestígio estourava o teto de multiplicadores.** Pegou primeiro com o modelo antigo (110× contra o teto de 100×). Depois que o V3 revelou a fórmula real, o mesmo teste reajustou o `fortunate` para `increase-multiplier: 0.14` → total fecha em **100,2×** |
3 | **O vale de substituição.** Trocar um spawner maxado do tier N por um nu do tier N+1 no mesmo slot deixa aquele slot **192× pior**. Conclusão nova: **o `s.limite` precisa crescer durante a temporada**, para o jogador *adicionar* em vez de *trocar* |

---

## Os passos — onde estamos

### ✅ Fase 0 — verificação · **FECHADA**

Os 8 testes respondidos. Só os testes de carga (L1, L2) ficam para antes do lançamento.

**As 5 consequências grandes** estão em [09-VERIFICACAO.md](09-VERIFICACAO.md) — a mais importante é que o **manual é 70.000 blocos/h**, 7× minha suposição, o que mudou o valor-base dos 20 tiers e quadruplicou o volume de chaves.

### ✅ Fase 1 — documentos e simulador · **fechada**

12 documentos + simulador rodando. `MODELO CONSISTENTE`.

### ✅ Fase 2 — mineração, a via de referência · **APLICADA**

`16 arquivos alterados, 716 inserções, 316 deleções.` Simulador: **MODELO CONSISTENTE**.

| # | Arquivo | O que foi feito |
|---|---|---|
1 | `GarnixMining/levels.yml` | ✅ **300 níveis** (era 100), 21 grupos de bloco a cada 15 níveis, escada de coins **1 → 4,12×10¹¹** com erro de **0,023%** vs o alvo. Coluna `gemas` mantida linear. Curva de XP com **tempo por nível plano** (variação de 1,2×) e o platô 71–76 eliminado |
2 | `enchants/fortunate.yml` | ✅ `increase-multiplier → 0.02778` (teto **14,91×** preservado com 500 níveis) |
3 | `enchants/gemmed.yml` | ✅ `→ 0.003968` (3,03×, mantém gemas linear) |
4 | `enchants/blessed.yml` | ✅ **0,095%** no nível 500 (era 9,21%) — com a chance antiga seriam **1,93 milhão** de chaves/dia |
5 | `enchants/annihilation.yml` | ✅ `base-chance: 60 → 0.138`, teto **0,69%** |
6 | `enchants/*.yml` (15) | ✅ escada de desbloqueio redesenhada (**classe A por padrão, classe B nos primeiros 10 min**), chances calibradas para a árvore somar **100×** (somava 2.602×), custos monotônicos com o unlock |
7 | `config.yml` → frenzy | ✅ `blocks-required: 1000 → 3500` — devolve o uptime a **50%**, o 1,5× do orçamento |
8 | `config.yml` | ✅ `enchant-animation-budget: 0 → 10.000` |
9 | `armors/*` + `skins.yml` | ✅ **verificados, sem mudança** — as escadas já terminavam exatamente no orçamento (armadura T-V 12%/peça = conjunto 48%; skin topo 65%) |
10 | `enchants/*.yml` | ✅ **`max-level: 100 → 500`** — 7.003 níveis de encante em vez de 1.403, com **teto de poder e custo total idênticos**. Só granularidade |

**Fase 2 completa.** O último item pendente — `max-simultaneous` nas classes D e E — **não era necessário**: o `AnimationRegistry` já capa cada animação em 1 por jogador (o `snake` em 3) e o orçamento global de 10.000 que ativei é a terceira camada. Custo por jogador com tudo rodando: **245**, dos quais o `kraken` é 185.

### ⏳ Fase 3 — a escada: ranks, spawners, cabeças

20 `GarnixRankUP/ranks/*.yml` (atômico) · 20 `GarnixSpawners/spawners/*.yml` (atômico) · `release:` escalonado por dia · bônus de rank via `mining.bonus.<N>` · `sword.yml` · máquinas A–O · galpão e cacto.

### ⏳ Fase 4 — Farm e Pesca

Farm com o **C2** (tabela de valor por nível) + 10ª skin. Pesca com as 20 recompensas de coins gateadas por `required-level` e `max-weight`.

### ⏳ Fase 4b — os ~212 itens

Especificação pronta em [10-ITENS.md](10-ITENS.md). Critério de conclusão: as listas A e B voltam **vazias** numa varredura do zero.

### ⏳ Fase 5 — superfícies de recompensa

6 crates · 7 caixas · bosses (5 + 3 engatilhados) · OnTime · dailies · fragmentos · [07-LIVROS.md](07-LIVROS.md).

### ⏳ Fase 6 — comércio

Taxa nos duelos e rake no bolão. Sem blacklist de moeda, por decisão.

### ⏳ Fase 7 — shops · **por último, por sua decisão**

coins-shop (273 produtos) · cash-shop nas 4 faixas · os 21 eventos · [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md).

---

## Mudanças de código

| # | Plugin | O que | Status |
|---|---|---|---|
**C1** | `garnix-crates`, `garnix-bosses` | trocar `getDouble` por `getString` + `new BigDecimal` — **6 linhas** (3 em cada) | ✅ aprovado, escopo reduzido pelo V2 |
**C2** | `garnix-farm` | tabela de valor por nível no `levels.yml`, espelhando o `GarnixMining` | ✅ aprovado |
**C6** | `garnix-rankup` | prestígio: lista global + listas **por nível** com vazios permitidos | ✅ aprovado |
**C7** | ~~`garnix-mining`, `garnix-farm`~~ | ~~proc de chave conta bloco manual~~ | ❌ **desnecessário** — o V7 mostrou que a chance resolve melhor que código |
**C8** | `garnix-bosses` | `max-simultaneous` global | ✅ necessário (~30.000 spawns/dia em lotes) |
**C9** | `garnix-mining` | `blocks_broken` de `int` para `long` | 🆕 **novo** — `int` estoura em 134h e um hardcore joga 160h |
C3 | — | tabela de sufixos configurável | ❌ **desnecessário**, o V1 passou |
C4, C5 | — | bônus de conjunto · teto AFK por conta | ⏸️ só se o simulador pedir |

---

## As leis de projeto

Cinco regras que governam qualquer decisão numérica. Detalhe em [01-ECONOMIA.md](01-ECONOMIA.md).

1. **Dois eixos independentes.** Coins fazem os 20 tiers e chegam a sextilhões. Cabeças fazem rank e prestígio, travadas por tempo. Não se misturam.
2. **Coins não pode ditar o servidor.** Coins compram a entrada; a moeda secundária compra a profundidade.
3. **Nunca pode compensar ficar parado.** Empilhar um spawner vale ~3,5 tiers. Estar 4 tiers atrás é incompensável.
4. **Número grande e frequente na tela.** Entre poucos eventos grandes e muitos frequentes, escolher muitos. Raridade fica na cauda, não no corpo.
5. **Nenhum item ativável sem rota e sem preço.** Se não deve chegar ao jogador, sai do config.

---

## Regras de trabalho

- ⛔ **Kits nunca são editados por aqui.** Os itens estão em base64 e o dono configura à mão no jogo. O entregável é a especificação (kit → chave → quantidade).
- Mudanças de código: ver a tabela acima. Fontes em `Desktop/garnix/sources` — sincronizar `resources/` junto.
- **Escrever valores grandes entre quotes no YAML** (`amount: '1440000000000000000000'`). Com quotes o valor chega como String e não depende de qual resolver o SnakeYAML escolheu.
- Arquivos que **nunca** podem ser commitados pela metade: os 20 `GarnixRankUP/ranks/*.yml`; os 20 `GarnixSpawners/spawners/*.yml`; `GarnixMining/levels.yml` + `fortunate.yml` + `gemmed.yml`; `GarnixFarm/farms.yml` + `levels.yml` + `prosperity.yml`; `GarnixFishing/rewards.yml` + `skins.yml`; os 8 `GarnixCurrencies/currencies/*.yml`.
- Rodar o simulador depois de cada fase. Tolerância ±25% na renda/h por tier. Fora disso, a fase não fecha.
