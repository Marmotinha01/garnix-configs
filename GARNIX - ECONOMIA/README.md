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
| [12-RANKINGS.md](12-RANKINGS.md) | Os 33 placares do servidor + **a distribuição dos R$ 1.000** de fim de temporada | ✅ |
| [13-PASSIVO.md](13-PASSIVO.md) | A via passiva: spawners, lâmina e máquinas. Mecânica lida no código + os números aplicados | ✅ 3a–3d |
| [14-FARM-PESCA.md](14-FARM-PESCA.md) | Fazenda e pesca: o teto físico do farm, o gate 2D da pesca, as skins | ✅ Fase 4 |
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
| **V5-A** | Sua taxa de clique manual (blocos/hora à mão) | ✅ **70.000 blocos/h** medido (3.500 em 3 min). Eu errei por 7× |
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
3 | **O vale de substituição.** Trocar um spawner maxado do tier N por um nu do tier N+1 no mesmo bloco deixa aquele bloco pior até ser re-maxado. Com o throughput correto a perda é **3×** (o simulador dizia 192× com o modelo errado) |

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

Especificação completa em [13-PASSIVO.md](13-PASSIVO.md).

#### ✅ 3a — os 20 `GarnixRankUP/ranks/*.yml` · **APLICADA**

`20 arquivos alterados, 77 inserções, 39 deleções.`

Custo do rank dominado por **cabeças**; coins entram só a 2% da renda do tier, com teto de 10¹⁸. Rank N exige cabeça do mob **⌈N/2⌉** (não N−1): com N−1 o rank 20 pedia GHAST, que só o spawner 19 produz, e isso travava a esteira de prestígio em 3 dias. Com ⌈N/2⌉ o rank 20 pede SPIDER, comprável no dia 10, e sobram 9 dias de esteira. **~3,0 min por rank em qualquer ponto da escada.** `cost-increase-percent: 10 → 2` → ~610 prestígios alcançáveis.

#### ✅ 3b — os 20 `GarnixSpawners/spawners/*.yml` · **APLICADA**

`20 arquivos alterados, 620 inserções, 641 deleções.` Simulador: **MODELO CONSISTENTE**.

| # | O que foi feito |
|---|---|
1 | **Triplo portão** na compra: `release:` do dia N + `spawner.buy.<mob>` + coins do tier N + **dracmas** |
2 | `costs.coins` = **0,15 × renda diária** · maxar = **0,20** → soma **35% exato**. ⚠️ a **unidade** desses custos estava errada e foi corrigida na 3d |
3 | `drops.coins.amount` derivado de `(renda/24) ÷ (kills/h × pilha)` — erro máximo de arredondamento **0,29%** |
4 | **A chave `gems` saiu.** Ela não é uma moeda (o ID é `gemas`) e `MobConfigManager:238` a descartava **em silêncio** — os spawners nunca deram gema e os upgrades nunca cobraram nada além de coins. Entra **`dracmas`**, a secundária que faltava |
5 | As 3 trilhas de upgrade foram refeitas — ver **3d** abaixo, onde o bug de fundo apareceu |
6 | `release:` **escalonado**: spawner N no dia N. ⚠️ a data-base é **placeholder** |
7 | `SLIME.yml` dizia `[Rank 5]` com `order: 12` — corrigido |
8 | ✅ **`Long.MAX` deixou de ser problema nos spawners.** Com a unidade dos custos corrigida (3d) o maior valor dos 20 arquivos é **4,04×10¹⁸** < 9,22×10¹⁸. Os valores vão entre quotes assim mesmo. O **C1 fica restrito a crates e bosses** |

**Duas correções de modelo que a fase trouxe:**

| | Antes | **Certo** |
|---|---|---|
Ganho de maxar um bloco | 1.536× (= 3 × 512) | **20×** — ver **3d**, o número certo só apareceu lá |
Barreira da lei "nunca compensa ficar parado" | 4 tiers | **2 tiers** — a lei ficou **bem mais forte** |
Vale de substituição | 192× pior | **3× pior** |
"O passivo só começa no T7" | restrição | **caiu** — valor fracionário é legal, o T1 paga `0.678`/kill |

#### ✅ 3c — permissões, bônus de rank, escada de VIP · **APLICADA**

`42 arquivos alterados.`

| # | O que foi feito |
|---|---|
1 | **O gate de rank passa a existir**: rank N concede `spawner.buy.<mob N>`. **A cadeia rank → spawner → cabeça fecha nos 19 degraus** (auditada) |
2 | ⚠️ **`RABBIT.yml` sem permissão de compra.** O rank 1 é o rank inicial — `coelho.yml` tem `commands: []` e **nunca executa**. Se o RABBIT exigisse permissão, ninguém compraria o primeiro spawner. Mesmo deadlock das dracmas, mesmo arquivo, mesma solução |
3 | ⚠️ **`permissions.kill: ""` nos 20.** Gatear kill por rank faria o jogador que prestigiou **não conseguir matar os mobs dos spawners que já tem** — e o V6 provou que eles continuam produzindo. Produzir sem poder matar é pior que não produzir: o prestígio viraria suicídio |
4 | `GarnixSpawners/ranks.yml` + `GarnixMachines/ranks.yml` reescritos: **6 VIPs + 20 ranks = 26 entradas**, idênticos. Estavam **invertidos** — o VIP mais básico dava o maior bônus |

🚩 **O VIP substitui o bônus de rank, não soma.** O plugin ordena por `discount + bonus` e devolve a **primeira** entrada que o jogador tem — o maior vence. Por isso todo nó de VIP fica acima do teto do rank: garnix **50** > supremo 41 > parceria 35 > imortal 33 > celestial 27 > **rank 20 = 20**. Parceria (investidor/influencer) tem o ganho do topo e **zero desconto**, para não criar uma via de revenda.


#### ⚠️ Correção grande: o passivo estava alocado em dobro

Achado ao ir calibrar o cacto. O documento mestre reparte a renda entre as 3 contas somando **100%** — e logo abaixo definia `Passivo por hora = renda(N) / 24`, que rodando 24h entrega **outros 100%**.

> Os drops dos spawners e das máquinas saíram **4,55× altos**, e o total do servidor daria ~2× o teto de sextilhões.

A causa é que a repartição existia por **conta-hora** e nunca por **via**. Escrevi a que faltava:

| Conta | % | Vias |
|---|---|---|
AFK 1 | 22% | cacto **15%** + pesca **7%** |
AFK 2 | 22% | **spawners 17%** + **máquinas 5%** |
Ativa | 56% | mineração 35% + fazenda 18% + eventos 3% |

As porcentagens **dentro** de cada conta são escolha de projeto; o total de cada conta **não é** — sai do modelo de 108 unidades.

**A conferência que fecha:** com 22%, o passivo/h fica praticamente igual ao AFK/h de uma conta (3,44×10³ contra 3,47×10³ no T1). Tem que ser assim — a via passiva **é** o que a conta AFK 2 faz.

#### ⏳ 3d — lâmina, máquinas, galpão e cacto

**Primeiro item já aplicado: as 3 trilhas de upgrade**, porque ao ir calibrar a lâmina eu achei o bug de fundo do throughput.

```
kills/h por bloco = min( spawners no bloco , TETO do mob-stack ) × 3600 / delay
```

**`mob-stack` é TETO, não multiplicador** (`MobManager:139-152`). Duas consequências:

| | |
|---|---|
**O número que eu usava estava errado nas duas pontas** | `1.536×` tratava um teto como fator **e** comparava com um estado (1 mob, 1 bloco) que não é comprável |
**A trilha `spawner-stack` entregava ZERO** | com teto 3, `min(512, 3) = 3` por ciclo. Pior: era **armadilha** — 512 num bloco rendem 3/ciclo, e os mesmos 512 em 171 blocos rendem 513/ciclo. Upgradar era ativamente ruim |

O teto real por bloco era **2.700 kills/h**, não 1.382.400.

**A correção** (config, sem código): um teto sobe e o outro nasce no máximo — dois tetos subindo seria **dependente de ordem**, porque throughput é `min(A,B)` e a compra "errada" primeiro não entrega nada.

| Trilha | Agora | Papel |
|---|---|---|
`spawner-stack` | **6 níveis**: 96 · 144 · 216 · 288 · 384 · 512 | a trilha de throughput — **8×** |
`mob-stack` | **base 512, 1 nível: `-1` (ilimitado)** | **anti-perda**: com teto e `delay: 4s`, ficar 8s sem matar joga um ciclo fora. Ilimitado deixa o mob empilhar para sempre e o `massacre 5` colhe num golpe. Perfeito para conta AFK |
`speed` | 3 níveis: 8s · 6s · 4s | throughput — **2,5×** |
| **total** | **10 níveis, todos úteis** (eram 9, com 4 mortos) | |

**Os `drops` mudaram duas vezes.** Primeiro o modelo de blocos (abaixo), depois a fatia da via passiva — ver a nota de correção no fim desta seção.

**Sobre o modelo de blocos:** Meu modelo errado tinha o termo `⌈n/2⌉ × mob-stack(1→3)`, que é **numericamente idêntico** ao número de blocos do modelo correto (1 → 30). Erro de **0,00% nos 20 tiers** — então `drops.coins.amount`, as dracmas e os requisitos de cabeça da 3a seguem válidos. Foi sorte, não projeto.

**Mas a UNIDADE dos custos estava errada.** `costs` é o preço de **um item de spawner**, e um bloco precisa de até **512 itens** juntados para produzir no máximo. Eu precificava como se 1 compra = 1 bloco:

| | conjunto do T20 custava | agora |
|---|---|---|
30 blocos × 512 itens = **15.360 itens** × 2,16×10²⁰ | **2.304 dias** de renda | **15,0%** de um dia |

Corrigido: `preço por item = 0,15 × renda ÷ itens(N)` e `upgrades por bloco = 0,20 × renda ÷ blocos(N)`. A soma volta a ser **35% exato nos 20 tiers**.

**`sword.yml` aplicado:**

| | |
|---|---|
`massacre` | **2/4/8/16 → 4/16/64/256**, `-1` mantido. Tinha a mesma doença do `mob-stack`: o bloco acumula até 512 por ciclo, então 512 mobs a cada 4s exigem 128 abates/s e a 5 cliques/s o nível 4 entregava 80 — **os quatro primeiros níveis eram decorativos** |
`ceifador` | ⚠️ **a lore mentia**: dizia "chance de abater o mob com um golpe só", mas `MobManager:634-641` é chance de **dobrar as cabeças**. Quem abate em um golpe é o `massacre`. Chances 25/50/75% mantidas — é o que o modelo de cabeças da 3a assumiu |
`pilhagem` | valores mantidos (2,0 no máximo é exatamente o que o orçamento de 8,10× assume) + comentário travando o número |

**Falta:** máquinas A–O · máquinas especiais · combustível · galpão e cacto.

⚠️ **Dois achados nas máquinas, antes de desenhá-las:**

| | |
|---|---|
`chance` é **fração 0–1**, não porcentagem (`MachineDrop.java:40`) | os 2 arquivos atuais estão em porcentagem, e `if (chance < 1.0 && ...)` faz **todo drop cair 100% das vezes**. A "recompensa especial de 5%" do `WOOD.yml` cai sempre. **Convenção oposta à dos spawners**, que usam 0–100 |
`stackSize` **multiplica** nas máquinas (`MachineTickManager:123`) | ao contrário do `mob-stack` dos spawners, que é teto. E **não há teto de stack** nem sistema de upgrade. O combustível é **1 litro por ciclo por BLOCO**, não por máquina empilhada — então empilhar torna o combustível grátis por unidade produzida |

#### ⏳ 3d — lâmina, máquinas, galpão e cacto

`sword.yml` (a lore do `ceifador` **mente** — diz instakill, o código diz que dobra cabeças) · máquinas A–O · máquinas especiais · `spawnerslimite` crescente · galpão e cacto.

### ✅ Fase 4 — Farm e Pesca · **APLICADA**

Detalhe em [14-FARM-PESCA.md](14-FARM-PESCA.md). Resumo:

| | Fazenda | Pesca |
|---|---|---|
Fatia da renda | 18% (conta ativa) | 7% (conta AFK) |
O problema | nível não aumentava renda **nenhuma**; nível 100 em 1,7h | a pilha de multiplicadores **não alcança coins** |
A solução | 300 níveis + a escada do **C2**, 3,90× a cada 15 | 20 recompensas com gate 2D: nível × skin da vara |
Teto de throughput | **4,09×10⁶ colheitas/h** — físico e real (regrow por posição) | 504 fisgadas/h — a via mais estrangulada |
Tempo por nível | 10,3 min, plano · nível 300 no dia 20 | 23,9h, plano · nível 20 no dia 19,9 |
Erro contra o alvo | 0,034% | 0,38% |

**Dois erros meus na escada da fazenda**, ambos invisíveis nas pontas: espalhar geometricamente entre T1 e T20 estourava o alvo em **200× no meio**; e ao corrigir, modelar a pilha de multiplicadores como linear fazia o degrau sair com multiplicador **0,82** — ou seja **subir de nível faria ganhar menos**. A forma certa é a da mineração: ancorar nas duas pontas e interpolar geométrico puro.

**A `shop.yml` da pesca era um exploit de uma linha:** `1.500 corais → 1.500 spawnerslimite`, câmbio 1:1 com o item nº 1 do Ranking de Apelões — e a pesca rende 2,19 **milhões** de corais na temporada. Novo câmbio: **1.100 corais = 1 de limite**.

**As skins:** a fazenda tinha 9 e só **2** fora da forja, violando a regra de que as **3 mais raras** não são forjáveis. Criei a 10ª (`opala`, nome provisório) e as três vias ficaram idênticas: 10 skins, a forja alcança a 7ª, **3 fora**.

### ✅ Fase 4b — os ~212 itens · **ESPECIFICAÇÃO FECHADA**

Detalhe em [10-ITENS.md](10-ITENS.md).

⚠️ **Uma correção de rumo:** eu tinha escrito que a lista A (itens sem rota) voltaria vazia ao fim desta fase. Não volta — e não é por falta de trabalho. **Quase nenhum destes itens tem campo de custo no próprio config.** `bombs.yml` e o bloco `drill:` são definições de item puras (material, lore, raio, cooldown); armaduras, skins, livros e matadoras idem.

> **Dar preço a um item quase nunca é editar o arquivo do item.** É criar a linha que o entrega — e essa linha mora numa tabela de loot (Fase 5) ou numa entrada de loja (Fase 7).

Então a 4b entrega a **especificação completa** — classe, moeda, fórmula, raridade e canal de cada um dos ~214 itens — e as Fases 5 e 7 escrevem as linhas. A lista A fecha ao fim da **Fase 7**.

**O que a 4b fechou de fato:**

| | |
|---|---|
**A tabela de boosters** | era o item que bloqueava qualquer preço. Ela **não pode morar num `.yml`**: os arquivos de booster são só templates, e `{multiplier}`/`{duration}` vêm dos argumentos do comando. Virou convenção: **8 combinações in-game + 4 no site**, × 7 sistemas, com o comando exato de cada um |
**Um achado que muda a raridade** | **o booster não vale o mesmo em toda via.** Ele MULTIPLICA em spawner e máquina, e SOMA em mineração, fazenda e pesca. Um 3× de spawner vale exatamente 3×; o mesmo 3× de mineração vale ~2,2×, porque divide o bloco aditivo com skin, armadura e permBonus. **Um booster de spawner é ~1,4× mais forte e tem que ser proporcionalmente mais raro no loot** |
**O mapa de onde cada rota mora** | é o que deixa as Fases 5 e 7 serem mecânicas |


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
**C6** | `garnix-rankup` | prestígio: lista global + listas **por nível** (`prestige.rewards.<n>.commands`) | ✅ **escrito** (+23 linhas em `RankUPService.java`) — aguardando sua revisão |
**C7** | ~~`garnix-mining`, `garnix-farm`~~ | ~~proc de chave conta bloco manual~~ | ❌ **desnecessário** — o V7 mostrou que a chance resolve melhor que código |
**C8** | `garnix-bosses` | `max-simultaneous` global | ✅ necessário (~30.000 spawns/dia em lotes) |
**C9** | `garnix-mining` | `blocks_broken` de `int` para `long` | 🆕 **novo** — `int` estoura em 134h e um hardcore joga 160h |
**C10** | `garnix-crates` | remover os aliases `caixa`/`caixas`, que colidem com o `GarnixMysteryBoxes` | ✅ aprovado |
**C11** | `garnix-warehouse` | `total_sold VARCHAR(64)` + `topBySold` + menu — **o cacto é a única via sem placar** | ⏳ **aguardando aprovação** — ver [12-RANKINGS.md](12-RANKINGS.md#4--c11--o-ranking-do-cacto-precisa-da-sua-aprovação) |
~~C12~~ | ~~`garnix-spawners`~~ | ~~debitar `spawnerslimite` na compra~~ | ❌ **retirado** — não era bug. O dono confirmou que comparar sem debitar **é o desenho**: teto de lote por compra, que cresce com o que cai de recompensa |
C3 | — | tabela de sufixos configurável | ❌ **desnecessário**, o V1 passou |
C4, C5 | — | bônus de conjunto · teto AFK por conta | ⏸️ só se o simulador pedir |

---

## As leis de projeto

Cinco regras que governam qualquer decisão numérica. Detalhe em [01-ECONOMIA.md](01-ECONOMIA.md).

1. **Dois eixos independentes.** Coins fazem os 20 tiers e chegam a sextilhões. Cabeças fazem rank e prestígio, travadas por tempo. Não se misturam.
2. **Coins não pode ditar o servidor.** Coins compram a entrada; a moeda secundária compra a profundidade.
3. **Nunca pode compensar ficar parado.** Maxar um bloco de spawner vale **1,59 tier** (20× de throughput). Estar **2 tiers atrás é incompensável**. Ver a auditoria em [13-PASSIVO.md](13-PASSIVO.md#a-auditoria-da-lei-nunca-compensa-ficar-parado).
4. **Número grande e frequente na tela.** Entre poucos eventos grandes e muitos frequentes, escolher muitos. Raridade fica na cauda, não no corpo.
5. **Nenhum item ativável sem rota e sem preço.** Se não deve chegar ao jogador, sai do config.

---

## Decisões que estão com o dono

Nada bloqueia o trabalho — cada uma tem um default. Detalhe em [13-PASSIVO.md](13-PASSIVO.md#decisões-que-estão-com-você--guardadas-aqui).

| # | Decisão | Default se ficar sem resposta |
|---|---|---|
**D1** | **Aprovar o C11** (`total_sold` no `garnix-warehouse`) | os R$ 120 do cacto vão para o prestígio; o cacto fica sem placar |
**D2** | **A data real do lançamento** (hoje os `release:` vão de 01/09/2026 a 20/09/2026) | só a data-base muda, **nenhum valor é recalculado** |
**D3** | Nó `rankup.rank.1` no grupo default do LuckPerms (operação, fora do repo) | a escada de bônus começa em +2% em vez de +1% |
**D4** | Quais chaves e quantidades cada kit dá — ⛔ **eu entrego só a especificação**, você aplica no jogo | Fase 5 |
**D5** | Nomes finais das máquinas A–O · quantos fragmentos e com que nomes · nome e bônus da 10ª skin de farm | seguem como letra/placeholder até você mandar |

---

## Regras de trabalho

- ⛔ **Kits nunca são editados por aqui.** Os itens estão em base64 e o dono configura à mão no jogo. O entregável é a especificação (kit → chave → quantidade).
- Mudanças de código: ver a tabela acima. Fontes em `Desktop/garnix/sources` — sincronizar `resources/` junto.
- **Escrever valores grandes entre quotes no YAML** (`amount: '1440000000000000000000'`). Com quotes o valor chega como String e não depende de qual resolver o SnakeYAML escolheu.
- Arquivos que **nunca** podem ser commitados pela metade: os 20 `GarnixRankUP/ranks/*.yml`; os 20 `GarnixSpawners/spawners/*.yml`; `GarnixMining/levels.yml` + `fortunate.yml` + `gemmed.yml`; `GarnixFarm/farms.yml` + `levels.yml` + `prosperity.yml`; `GarnixFishing/rewards.yml` + `skins.yml`; os 8 `GarnixCurrencies/currencies/*.yml`.
- Rodar o simulador depois de cada fase. Tolerância ±25% na renda/h por tier. Fora disso, a fase não fecha.
