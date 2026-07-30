# 13 — A VIA PASSIVA: SPAWNERS, LÂMINA E MÁQUINAS

A via que roda **24h** contra as 3h da conta ativa, e a única sem teto físico. Este documento é a especificação da **Fase 3**.

| Bloco | Estado |
|---|---|
**Fase 3a** — os 20 `GarnixRankUP/ranks/*.yml` | ✅ aplicada |
**Fase 3b** — os 20 `GarnixSpawners/spawners/*.yml` | ✅ **aplicada** |
**Fase 3c** — permissões, bônus de rank, escada de VIP | ✅ **aplicada** |
**Fase 3d** — trilhas, custos, `sword.yml`, prestígio e as 15 máquinas | ✅ **aplicada** |
Fase 3d (resto) — máquinas especiais, combustível, galpão e cacto | ⏳ |

---

## 1. A mecânica real, lida no código

Nada aqui é suposição. Cada linha foi lida em `Desktop/garnix/sources/garnix-spawners`.

| Onde | O que diz |
|---|---|
`MobConfigManager:126` | `costs.<id>` → `new BigDecimal(getString(...))` — **moeda livre, BigDecimal** |
`MobConfigManager:141` | `drops.<id>.amount` → idem — **aceita valor fracionário** |
`MobConfigManager:142` | `drops.<id>.chance` → `getDouble`, em porcentagem |
`MobConfigManager:239` | `upgrades.*.costs.<id>` → idem |
`MobConfigManager:252` | `upgrades.*.value` → **`getInt`, só inteiro** |
`MobManager:139-152` | por ciclo o bloco adiciona `spawner.getStackSize()`, **clampado por (teto do `mob-stack` − stack atual)** |
`UpgradeManager:44-56` | `mob-stack` é o **teto**; `value: -1` = **ilimitado** |
`UpgradeManager:63-75` | `spawner-stack` é o teto de **quantos itens de spawner cabem num bloco** |
`SpawnerPlaceListener:136` | esse teto é aplicado ao **juntar** spawners no bloco |
`ShopMenu:333` | `spawnerslimite` é só **comparado**, **nunca debitado** |
`MobConfigManager:238` | moeda inexistente → `continue` — **descartada em silêncio** |
`MobConfigManager:112` | `rank:` → **só texto de lore. Zero efeito econômico** |
`ShopMenu:499` | `permissions.buy` → **gate autoritativo**, rechecado na compra |
`ShopMenu:430` | desconto de VIP → aplicado **na compra do spawner** |
`UpgradeManager:137` | desconto de VIP → **NÃO aplicado nos upgrades** (custo cru) |
`MobManager:712` | `chance` → rolada **1× por golpe**, não por mob |
`MobManager:714` | `total = amount × killCount × pilhagem × boosterDrops` |
`MobManager:719` | booster de drops → **MULTIPLICA** |
`DropsMenu:56` | bônus de rank/VIP → aplicado **na venda**, aditivo, **o maior vence** |
`MobManager:634-641` | 1 cabeça por mob, `ceifador` tem chance de **dobrar** |
`AccountRepository:51,99` | saldo é `VARCHAR(255)`, clamp de **2 casas** para baixo |

### 🚩 Um bloco por TIPO de spawner — no máximo 20

✅ **Confirmado pelo dono:** *"cabe 1 spawner de cada tipo... não posso ter 2 blocos em lugares diferentes de tipos iguais."*

Isso fecha o termo de quantidade que faltava, e desfaz duas suposições minhas:

| | Eu supunha | **Real** |
|---|---|---|
Quantidade de blocos | crescia 1 → 30, limitada por área de plot | **1 por tipo, teto de 20.** No dia N o jogador tem N |
O que cada bloco rende | todos rendiam no valor do tier atual | **um bloco de RABBIT rende drop de RABBIT para sempre** |

A segunda é a que muda a matemática, porque separa as duas somas:

| | Como somar |
|---|---|
**Cabeças e dracmas** (contagem) | todos os blocos contam igual → `Σ killsHora(t)`, t = 1..N |
**Coins** (valor) | o bloco novo domina, porque o valor cresce 6,61×/tier → converge em **1,18 × o bloco do topo** |

Consequência prática: **o bloco do tier N não precisa entregar o alvo do dia — só o que falta** depois do que os N−1 blocos antigos já entregam. `drops.coins.amount` é resolvido por recorrência e o erro fecha em **0,0000%**.

E o total de kills caiu: **3,61×10⁶/h no T20**, contra os 1,38×10⁷ do modelo anterior — que estava **3,8× inflado**.

### ✅ `spawnerslimite` não era bug — era o desenho

Eu tinha reportado como bug o fato de `ShopMenu:333` comparar o saldo sem debitar. **Não é.** Confirmado pelo dono: *"é a quantidade que o jogador PODE comprar ao máximo... ele vai conseguindo limites em recompensas e ativando conforme ganha e vai poder ir comprando cada vez quantias maiores."*

É um **teto de lote por compra**, que cresce com o que cai de recompensa. O código faz exatamente isso. **O C12 está retirado.**

### 🚩 O passivo estava alocado em DOBRO

Achado ao ir calibrar o cacto. O [01-ECONOMIA.md](01-ECONOMIA.md) reparte a renda entre as 3 contas e o total fecha **100%**:

| Conta | Tempo | Peso | % da casa |
|---|---|---|---|
AFK 1 (pesca + cacto) | 24h | 1× | 22% |
AFK 2 (spawners) | 24h | 1× | 22% |
Ativa | 3h | 20× | 56% |

E logo abaixo o mesmo documento definia `Passivo por hora = renda(N) / 24`. Rodando 24h, isso entrega **renda(N) inteira** — ou seja **outros 100%** em cima dos 100% que as contas já somam.

> **Os drops dos spawners e das máquinas saíram 4,55× altos**, e o total do servidor daria ~2× o teto de sextilhões.

A causa: a tabela reparte por **conta-hora** e nunca existiu uma repartição por **via**. Escrevi ela agora ([01-ECONOMIA.md §4](01-ECONOMIA.md)) — cacto 15% + pesca 7% cabem nos 22% da AFK 1, spawners 17% + máquinas 5% cabem nos 22% da AFK 2, mineração 35% + fazenda 18% + eventos 3% cabem nos 56% da ativa.

```
Passivo por hora = renda(N) × 0,22 / 24
```

**A conferência que fecha:** com 22%, o passivo/h fica praticamente igual ao AFK/h de uma conta (3,44×10³ contra 3,47×10³ no T1). Tem que ser assim — a via passiva **é** o que a conta AFK 2 faz.

### 🚩 A fórmula do throughput — eu errei isso duas vezes

```
kills/h por bloco  =  min( spawners no bloco , TETO do mob-stack )  ×  3600 / delay
kills/h total      =  Σ sobre os N blocos (um por tipo), t = 1..N
```

**`mob-stack` não é multiplicador, é TETO.** Duas consequências, e a segunda é um bug real no config que estava lá desde sempre:

**(a) O `1.536×` (= 3 × 512) que eu usava estava errado nas duas pontas.** Tratava um teto como fator, e comparava com um estado (1 mob, 1 bloco) que **não é comprável**.

**(b) Com teto 3, a trilha `spawner-stack` — 4 níveis, a mais cara do arquivo — entregava ZERO.** Pior: usá-la era **armadilha**. 512 itens num bloco rendem `min(512, 3) = 3` por ciclo; os mesmos 512 divididos em 171 blocos de 3 rendem **513** por ciclo. Upgradar `spawner-stack` era ativamente ruim, e nada avisava.

O teto real por bloco era `3 × 3600/4 =` **2.700 kills/h**, não 1.382.400. A correção está na §4.

### Quatro consequências que mudaram o desenho

**1. `chance` é por golpe, não por mob.** O valor esperado é `amount × killCount × chance/100`, mas a **variância é por golpe**. Um golpe que mata 1.536 mobs com `chance: 1` paga 1.536 de uma vez. Isso atende a **lei do número grande e frequente** de graça, e custa **1 sorteio por golpe** em vez de 1.536 — é mais barato para o dedicado, não mais caro.

**2. O booster de drops MULTIPLICA aqui, e SOMA na mineração.** Semânticas diferentes no mesmo servidor (V3 mostrou que no `garnix-mining` o booster entra no bloco aditivo). Não é bug, é implementação independente — mas significa que **o orçamento da via passiva tem que usar booster multiplicativo** e o da mineração não.

**3. Valor fracionário é legal**, então a antiga restrição *"o passivo só começa no T7"* **caiu**. Ela existia só porque eu supus que drop sub-inteiro arredondaria para zero. O T1 paga `0.678` coin por kill e a conta fecha.

**4. O desconto de VIP vale na compra do spawner mas não nos upgrades.** Como maxar um slot custa mais que comprá-lo (0,20 vs 0,15 da renda diária), **a maior parte do sink da via passiva é imune ao desconto de VIP**. Isso limita naturalmente o P2W nessa via — registrado como característica, não como bug.

---

## 2. Os três portões de comprar o spawner N

| Portão | Natureza | O que impede | Onde |
|---|---|---|---|
**`release:` dia N** | calendário | o hardcore estourar o teto antes do fim | `release:` escalonado |
**`spawner.buy.<mob>`** | permissão | pular a escada de rank | concedida pelo rank N (Fase 3c) |
**coins do tier N** | exponencial | comprar antes de ter renda para sustentar | `costs.coins` |
**dracmas** | **linear no tempo de kill** | **comprar todos os 20 de uma vez** | `costs.dracmas` |

O portão de dracmas é o que faltava e é o mais importante: dracma só sai de matar mob e acumula **linearmente com o tempo**. Um jogador que ganhou muito coins — vendendo cabeças, no site, em aposta — **não converte isso em spawners**, porque falta tempo de kill. É um teto de velocidade que dinheiro não atravessa.

### ⚠️ O bootstrap: o spawner 1 não pode custar dracmas

Dracma só sai de matar mob **de spawner**, e o RABBIT é o único spawner comprável no rank 1. Cobrar dracma nele seria **deadlock**: o jogador precisa do item para produzir a moeda que compra o item.

**`RABBIT.yml` custa só coins.** Do spawner 2 em diante o portão vale.

---

## 3. Os números aplicados

Tabela completa em [02-TIERS.md](02-TIERS.md#custos-derivados). O resumo do método:

⚠️ **A unidade dos custos estava errada e foi corrigida na Fase 3d.** `costs` é o preço de **um item de spawner**, e um bloco precisa de até **512 itens** juntados para produzir no máximo. Eu precificava como se 1 compra = 1 bloco — comprar o conjunto do T20 saía por **2.304 dias** de renda. O mesmo nos upgrades, que se aplicam a **um bloco colocado**.

```
preço por ITEM     = 0,15 × casa/dia(N) ÷ itens(N)        itens(N) = blocos(N) × spawner-stack(N)
upgrades por BLOCO = 0,20 × casa/dia(N) ÷ blocos(N)
```

| Campo | Regra | Verificação |
|---|---|---|
`costs.coins` (por **item**) | `0,15 × casa/dia(N) ÷ itens(N)` | comprar o **conjunto** = 15% exato, em todos os 20 tiers |
`costs.dracmas` (por **item**) | `0,35 × dia de kill(N−1) ÷ itens(N)` | 0 no T1 (bootstrap) |
`drops.coins.amount` | `(casa/dia ÷ 24) ÷ (kills/h × pilha)` | erro máximo de arredondamento **0,29%** |
`drops.coins.chance` | `100` | renda previsível; a variância mora nas dracmas |
`drops.dracmas.amount` | `N` (1 → 20) | 20× na temporada — classe linear, não exponencial |
`drops.dracmas.chance` | `1` | esperado 0,01 dracma/kill, com burst visível |
`upgrades` (**10 níveis**, por **bloco**) | `0,20 × casa/dia(N) ÷ blocos(N)` | maxar **todos** os blocos = 20% exato |
`upgrades.*.dracmas` | só no **último nível** de cada trilha, somando `0,35 × dia de kill(N) ÷ blocos(N)` | é o gate de profundidade |

**O termo de quantidade é o número de blocos de spawner no plot**, crescendo **1 no dia 1 → ~30 no dia 20**. Não é `spawnerslimite` (que não é debitado) — é área de plot.

⚠️ **Coincidência que salvou os números:** meu modelo errado era `⌈n/2⌉ × mob-stack(1→3) × spawner-stack × 3600/delay`. Como eu tratava `mob-stack` como fator, o produto `⌈n/2⌉ × (1→3)` é **numericamente idêntico** ao número de blocos do modelo correto (1 → 30). Conferido: **erro de 0,00% em todos os 20 tiers**. Então `drops.coins.amount`, as dracmas e os requisitos de cabeça da Fase 3a **não mudaram** — só a mecânica das trilhas mudou. Isso foi sorte, não projeto, e depende de ~30 blocos ser realista.
`release:` | dia N da temporada | ⚠️ **data-base é placeholder** |
`rank:` | `&c[Rank N]` | corrigido no `SLIME.yml`, que dizia Rank 5 com `order: 12` |

**A pilha de multiplicadores da via passiva** é interpolada de `1,0×` no T1 a `8,10×` no T20 — `(1 + 35% de bônus) × pilhagem 2,0 × booster de drops 3,0`. Calibrar com a pilha máxima em **todo** tier deixaria os primeiros dias 8× menores que a tabela manda; calibrar sem ela deixaria o dia 20 inflado 8×.

### ⚠️ A data de lançamento é placeholder

Os 20 arquivos estão com `release:` de **01/09/2026 20:00** (spawner 1) a **20/09/2026 20:00** (spawner 20).

**O dono define a data real.** Só a data-base muda — os offsets de 1 dia são o desenho, e **nenhum valor é recalculado** quando ela mudar. É também o botão de esticar ou encurtar a temporada.

---

## 4. As três trilhas de upgrade

### Por que não dá para ter dois tetos subindo

Como o throughput é `min(A, B)`, **qualquer desenho com as duas trilhas subindo fica dependente de ordem**: quem compra o teto errado primeiro paga e não ganha nada, e não tem como saber disso pelo menu. Testei intercalar (64/96 → 128/256 → 384/−1) e funciona, mas exige a ordem exata.

**A correção: um teto sobe, o outro nasce no máximo.**

| Trilha | Antes | **Agora** | O que ela é |
|---|---|---|---|
`spawner-stack` | 3 níveis: 128 · 256 · 512 · *(inútil)* | **6 níveis: 96 · 144 · 216 · 288 · 384 · 512** | **a trilha de throughput** — 8× |
`mob-stack` | base 1, 3 níveis: 2 · 3 · **3** ❌ | **base 512, 1 nível: `-1` (ilimitado)** | **anti-perda de produção** |
`speed` | 3 níveis: 8s · 6s · 4s | **igual** | throughput — 2,5× |
| **total** | 9 níveis, 4 deles mortos | **10 níveis, todos úteis** | |

O nível único de `mob-stack` **não aumenta throughput** (o `spawner-stack` já para em 512) — ele acaba com a **perda de produção** de quem não mata rápido: com teto 512 e `delay: 4s`, ficar 8s sem matar joga um ciclo no lixo. Com ilimitado o mob empilha para sempre e o `massacre 5` colhe tudo num golpe.

É o upgrade perfeito para conta AFK, é fácil de explicar, e é **ordem-independente**. `UpgradeManager:55` já suporta `-1`; nada de código.

### A auditoria da lei "nunca compensa ficar parado"

| | kills/h por bloco |
|---|---|
bloco **nu** — `min(64, 512) × 3600/10s` | **23.040** |
bloco **maxado** — `min(512, ∞) × 3600/4s` | **460.800** |
| **ganho de maxar um bloco** | **20×** |

`6,61¹ = 6,6 < 20 < 43,7 = 6,61²` → **maxar um bloco vale 1,59 tiers.**

> **Estar 2 tiers atrás é incompensável por upgrade nenhum.**

⚠️ **Eu errei esse número duas vezes, sempre para cima:** primeiro `1.536×` ("4 tiers"), depois `60×` ("3 tiers"), agora `20×` (**2 tiers**). As duas primeiras versões tratavam `mob-stack` como fator quando ele é teto. Cada correção **fortaleceu** a lei — a folga real é menor do que eu vinha dizendo.

A folga de 1,59 tier ainda é boa: investir nos upgrades deixa o jogador "socar 1,5 tier acima do dele" — recompensa sentida — mas nunca substitui progredir.

### O vale de substituição encolheu de novo

Trocar um bloco maxado do tier N por um nu do N+1 no mesmo lugar: `20 / 6,61 =` **3× pior** (era 192×, depois 9×).

A conclusão de projeto **muda de tom**: com 3× a troca dói pouco, e o freio de quantidade agora é **área de plot**, não `spawnerslimite` (que não é debitado). Continua valendo que o jogador deve **adicionar** blocos em vez de **trocar** — mas isso acontece naturalmente, porque nada limita a contagem além do espaço.

### Onde maxar fica mais atrativo que subir de tier — e por que está certo

| | custo | ganho |
|---|---|---|
maxar 1 bloco (os 10 níveis) | **0,20 dia** de renda | 20× naquele bloco |
comprar o spawner do tier seguinte | **0,99 dia** de renda | 6,61× naquele bloco |

Maxar é **5× mais barato e 3× mais forte**. O caminho ótimo é **maxa o bloco, depois sobe** — e isso é desejável. A lei continua valendo porque maxar **tem teto** (20×, 1,59 tier) e subir **não tem**. Depois de maxar, a única saída é progredir.

---

## 5. A chave `gems` sai por projeto, não por remendo

Os 20 arquivos usavam a chave **`gems`** em `drops` e em 120 posições de `upgrades.*.costs`. **`gems` não é uma moeda** — o ID em `GarnixCurrencies` é `gemas`. E `MobConfigManager:238` faz `continue` quando a moeda não existe: **sem log, sem erro, sem nada.**

Consequência do estado anterior: **os spawners nunca deram gema nenhuma e os upgrades nunca cobraram nada além de coins**, e nada no console avisava.

Trocar por `gemas` seria o remendo errado — gema é a secundária da **mineração**, e dar gema ao spawner quebraria a lei "coins não pode ditar o servidor", que depende de cada via ter a *sua* secundária. Então entra **`dracmas`**, que é a secundária dos spawners e não tinha faucet nenhum. As 4 vias ficam simétricas:

| Via | Entrada (coins) | Profundidade (a secundária, que coins não compram) |
|---|---|---|
Mineração | acesso, resets | **gemas** → os 15 encantes |
Fazenda | upgrade de planta | **sementes** → os 10 encantes |
Pesca | vara | **corais** → skins, livros, limites |
**Spawners** | preço do spawner | **dracmas** → as 3 trilhas e os livros da lâmina |

---

## 6. Fase 3c — as permissões e as tabelas de bônus

### 6.1 O gate de rank passa a existir

Os `ranks/*.yml` da Fase 3a concediam `rankup.rank.<N>` e `mining.bonus.<N>`, mas **não** a permissão de compra do spawner — então o gate de rank não existia e só o `release:` e o preço seguravam. Agora **rank N concede `spawner.buy.<mob N>`**.

**A cadeia fecha nos 19 degraus.** Auditado: para o rank N você precisa de cabeça do mob `⌈N/2⌉` (Fase 3a), e o spawner `⌈N/2⌉` exige rank `⌈N/2⌉ ≤ N−1`, que você já tem.

| rank | precisa da cabeça de | esse spawner exige | tem? |
|---|---|---|---|
| 2 | RABBIT (mob 1) | nada — aberto | ✅ |
| 3 | PIG (mob 2) | rank 2 | ✅ |
| 10 | BAT (mob 5) | rank 5 | ✅ |
| 20 | SPIDER (mob 10) | rank 10 | ✅ |

### 6.2 ⚠️ O RABBIT não tem permissão de compra — pelo mesmo motivo do bootstrap de dracmas

✅ **Confirmado pelo dono:** o coelho é o rank inicial do servidor e o RABBIT é o spawner inicial.

O **rank 1 é o rank inicial**: `coelho.yml` tem `commands: []` e **nunca executa**, porque ninguém "sobe" para o rank 1. Se o RABBIT dependesse de permissão, **ninguém poderia comprar o primeiro spawner** — o mesmo deadlock das dracmas, no mesmo arquivo.

`RABBIT.yml` → `permissions.buy: ""`. O gate dele é **preço + release**, nada mais. É a porta de entrada da via.

### 6.3 ⚠️ `permissions.kill` fica ABERTA nos 20 — senão o prestígio vira suicídio

Todos os 20 declaravam `spawner.kill.<mob>` e **ninguém concedia esse nó** — na prática nenhum mob era matável.

A tentação era gatear por rank, como a compra. **Não pode:** o prestígio zera o rank e o C6 remove os nós. Um jogador que prestigiou não conseguiria matar os mobs dos spawners que **já tem colocados** — e o V6 confirmou que eles **continuam produzindo**. Produzir sem poder matar é pior que não produzir: o prestígio viraria suicídio e ninguém faria, que é exatamente a reclamação que estamos consertando.

`permissions.kill: ""` nos 20. `MobManager:594` só checa o nó quando ele é não-vazio, então custa zero.

### 6.4 A escada de bônus — o VIP substitui o rank, não soma

`GarnixSpawners/ranks.yml` e `GarnixMachines/ranks.yml` (idênticos) reescritos: **6 VIPs + 20 ranks = 26 entradas** em cada.

🚩 **Não somam.** `MobConfigManager:313` ordena por `discount + bonus` decrescente e `:319` devolve a **primeira** entrada cuja permissão o jogador tem — **o maior vence**. Por isso todo nó de VIP fica **acima do teto do rank (20)**, senão o VIP não valeria nada para quem chegou ao rank 20.

| Quem | desconto | bônus | soma (a ordem efetiva) |
|---|---|---|---|
**garnix** (topo) | 15 | **35** | **50** |
supremo | 10 | 31 | 41 |
investidor · influencer (parceria) | **0** | 35 | 35 |
imortal | 6 | 27 | 33 |
celestial (entrada) | 3 | 24 | 27 |
**rank 20** (sem VIP) | **0** | **20** | **20** ← abaixo de todo VIP ✅ |
rank 1 | 0 | 1 | 1 |

Antes estava **invertida** (celestial 25 / garnix 10) — o VIP mais básico dava o maior bônus.

**Parceria sem desconto** é deliberado: quem tem desconto compra mais barato e pode revender, o que criaria uma via de receita paralela. Investidor e influencer ganham o mesmo **ganho** do topo, e nenhum desconto.

Duas notas operacionais:

- **`rankup.rank.1` nunca é concedido** (o `coelho.yml` não executa), então a entrada `rank-1` fica inerte e o jogador novo cai em `getRank() == null` — sem bônus e sem desconto, que é o correto. A escada efetiva começa em **+2%**. Se você quiser o +1% desde o rank 1, o nó tem que entrar no grupo default do LuckPerms — é tarefa de operação, fora do repo.
- **O desconto não vale nos upgrades** (`UpgradeManager:137`). Como maxar um slot custa mais que comprá-lo (0,20 vs 0,15 da renda diária), **a maior parte do sink da via passiva é imune ao desconto de VIP.** Limita o P2W nessa via por construção.

---

## 7. Prestígio e as 15 máquinas

### 7.1 O prestígio custa a volta, não uma cabeça de Wither

O dono perguntou se valeria exigir **cabeça de Wither** para prestigiar. **Não** — e o motivo é de calendário:

> Cabeça de Wither só sai do spawner 20, que exige rank 20 **e** `release:` do **dia 20**. Exigir isso travaria o primeiro prestígio no último dia da temporada, e é ele que abre todos os outros.

É o mesmo problema que a Fase 3a já tinha resolvido ao trocar o requisito de rank de "mob N−1" para "mob ⌈N/2⌉". Detalhe que quase salva a ideia mas não salva: da segunda volta em diante o jogador mantém o spawner de Wither colocado (o V6 provou que spawners não param ao perder o rank), então teria cabeças — mas a **primeira** volta continua travada no dia 20.

**Onde a cabeça de Wither cabe bem:** recompensa de marco de prestígio alto, troféu de ranking, ou entrada de uma troca exclusiva. Como gate de um sistema que roda a temporada inteira, ela é veneno.

Hoje prestigiar **não custa nada** (`RankUPService:143` só checa `isLastRank`; não existe `prestige.costs` no config). O custo é a volta inteira dos 20 ranks, encarecida 2% por prestígio — e o V8 confirmou que o multiplicador vale **também** para os custos em `head`.

### 7.2 ⚠️ Correção: "~610 prestígios" estava errado

Aquele número vinha do modelo de throughput 3,8× inflado. Com a produção real, medi 4 cenários:

| min por rank | pedágio no rank 20 | **prestígios** | volta no dia 20 |
|---|---|---|---|
3 min | 8× | 112 | 36 min |
3 min | — | 181 | 17 min |
1,5 min | — | 274 | 8,3 min |
**1 min** ← escolhido | — | **345** | **5,5 min** |

**500 não cabe:** exigiria ~36 segundos por rank, o que apaga a sensação de degrau. **Decisão do dono: 1 min/rank → ~345 prestígios**, sem pedágio.

O tempo por volta cai ao longo da temporada (24 min no dia 10 → 5,5 min no dia 20), porque a produção de cabeças cresce com os blocos. É o loop clássico de prestígio: **cada volta é mais rápida que a anterior**.

⚠️ **Os marcos de prestígio do plano (1, 5, 10, 25, 50, 100, 250, 500) foram calibrados contra o número errado** e precisam ser reescalados para o teto de 345.

### 7.3 As 15 máquinas A–O — gate de prestígio

**Decisão do dono:** *"podemos requisitar prestígio para comprar máquinas... pelo menos umas 3 requerendo ranks medianos, daí da 4 para cima requerer prestígio, logo as máquinas viriam APÓS os spawners e não juntamente."*

Isso resolve sozinho o problema que eu tinha levantado. Máquina é um **conversor linear de coins em renda**: `stackSize` multiplica (`MachineTickManager:123`), não há teto de stack nem sistema de upgrade, e o combustível é 1 litro por ciclo **por bloco** — empilhar torna o combustível grátis por unidade. Gateando por **prestígio**, que é tempo puro e dinheiro não compra, a máquina herda a lei dos dois eixos: **um whale não compra a máquina O, ele precisa de 320 voltas.**

| Máq | Gate | Dia | Máq | Gate | Dia |
|---|---|---|---|---|---|
**A** | rank 6 | 3 | **I** | prestígio 140 | 14 |
**B** | rank 11 | 6 | **J** | prestígio 170 | 15 |
**C** | rank 16 | 8 | **K** | prestígio 200 | 16 |
**D** | prestígio 1 | 10 | **L** | prestígio 230 | 17 |
**E** | prestígio 20 | 10 | **M** | prestígio 260 | 18 |
**F** | prestígio 50 | 11 | **N** | prestígio 290 | 19 |
**G** | prestígio 80 | 12 | **O** | prestígio 320 | 20 |
**H** | prestígio 110 | 13 | | | |

**Os marcos seguem o ritmo real de prestígio (~30/dia a partir do dia 10), não números redondos.** Marcos tipo 1/5/10/25 não serviriam: o dia 10 sozinho já dá 39 prestígios, então 8 máquinas abririam de uma vez. Assim cai **uma máquina nova por dia** do dia 10 ao 20 — e é o prestígio desbloqueando **conteúdo**, não só um número, que era a reclamação original.

Economia: ciclo de **10s**, stack-alvo de **64 unidades por bloco**, conjunto de 64 = **15% da renda diária da banda** (o orçamento de sinks). O `amount` é resolvido pela mesma recorrência dos spawners, então cada máquina entrega exatamente o que falta para o alvo do dia.

A fatia das máquinas na renda passiva **cresce**: 0% até o T2, rampa até **25%** no T10, e fica lá. Os spawners entregam os outros 75%. Isso é o que faz as máquinas virem *depois* dos spawners, e não junto.

⚠️ **As 12 máquinas D–O dependem do C6** (listas de comando por nível de prestígio). Sem ele, `machines.buy.<x>` não é concedida e essas máquinas não têm rota. As três de rank (A/B/C) já estão concedidas em `jaguatirica.yml`, `pigzombie.yml` e `bruxa.yml`.

### 7.4 Achados nas máquinas

| Achado | Efeito |
|---|---|
`chance` é **fração 0.0–1.0** (`MachineDrop.java:40`), não porcentagem | **convenção oposta à dos spawners** (0–100). `if (chance < 1.0 && ...)` faz qualquer valor ≥ 1 cair **sempre**. A "recompensa especial de 5%" do `WOOD.yml` cai 100% das vezes |
`WOOD.yml` lista os combustíveis `coal` e `blaze` | **não existem** em `fuels.yml`, que só tem `default` e `infinite` |
`CASH.yml` é cópia do `WOOD.yml` | dá `coins: 5` e um item chamado "Cash" com `sell-value: coins 10`. **Não dá cash nenhum.** Vira a Máquina de Cash especial na próxima etapa |
`WOOD.yml` | posto em `shop: false` — sai da economia até virar máquina especial ou ser removido |

### 7.5 O C6 — escrito, aguardando sua revisão

`garnix-rankup/.../RankUPService.java`, **+23 linhas**. `runPrestigeCommands` passa a rodar duas listas: a global e a do nível específico.

```yaml
prestige:
  commands:            # roda em QUALQUER prestígio
  - 'crate givevirtualkey rankup {player} 1'
  rewards:             # marcos — níveis sem entrada são permitidos
    '1':
      commands:
      - 'lp user {player} permission set machines.buy.d true'
```

`getStringList` numa rota inexistente devolve lista vazia, então um config **sem** a seção `rewards` se comporta exatamente como a versão anterior. Retrocompatível.

⚠️ **E uma correção de rumo:** eu ia usar a lista global para **remover** as permissões de rank no prestígio. Dois motivos para não:

1. **Pelo desenho:** o plano diz que o prestígio reseta **só a escada de rank**. Tudo que o jogador acumulou fica — cabeças, dracmas, equipamento, spawners colocados e as permissões `spawner.buy.*` / `machines.buy.*`. É isso que transforma prestigiar de castigo em **volta rápida**, e o V6 já tinha provado que os spawners colocados continuam produzindo.
2. **Pela técnica:** `lp permission unset` **não aceita curinga**. Remover exigiria 60 comandos por prestígio × ~345 prestígios.

A escada de rank vira o sink de cabeças que move o contador — que é exatamente o papel dela no eixo de cabeças.

### 7.6 As 6 máquinas especiais

Todas com `shop: false` — **nenhuma é comprável em `/maquinas`**. A rota é site ou loot.

| Máquina | Ciclo | Produz (1 unidade) | Rota |
|---|---|---|---|
**Cash** | 432 s | **2 cash/dia** | site · jackpot da caixa `garnix` |
**Limite** | 1 h | **24 `spawnerslimite` + 24 `maquinaslimite`/dia** | site · jackpot da caixa `garnix` |
**Dracmas** | 10 s | 25% do que a via passiva rende, num stack de 64 | recompensa rara · caixa II |
Gemas · Sementes · Corais | 10 s | ⏳ calibrar na Fase 4 contra a renda de cada via | recompensa rara · caixa II |

**Máquina de Cash — a decisão do dono e o que ela exige:** *"não vai ter como comprar na loja de máquinas... não vamos limitar em nada ela, porém o consumo não pode ser ruim nem muito bom, precisa ser na medida."*

Como não há limite de quantidade nem teto de stack, **o freio tem que ser a produção por unidade**. Daí saem duas coisas:

- **O ciclo é de 432 s, não de 10 s.** O saldo tem 2 casas decimais (`AccountRepository:99-105`), então `0.01` é o menor valor que sobrevive ao depósito. Com ciclo curto o `amount` cairia abaixo do piso e seria truncado — a máquina pagaria mais do que o projetado, ou nada. `86400 / 432 = 200 ciclos × 0,01 = 2,00 cash/dia` exato.
- ⚠️ **Regra que vai para a Fase 7:** o preço da Máquina de Cash no site tem que ser **maior** que o cash que ela produz até o fim da temporada (~20 por unidade, liberada no dia 10). Senão ela vira um **desconto na própria loja de cash** — comprar a máquina sairia mais barato que comprar o cash direto.

**Máquina de Limite** produz as duas moedas de contagem. 24/dia de cada casa com o desenho que o dono descreveu: *"ele vai conseguindo limites em recompensas e ativando conforme ganha, e vai poder ir comprando cada vez quantias maiores."*

`WOOD.yml` foi para `shop: false` — os drops eram cópia, os combustíveis não existiam e as chances estavam em porcentagem.

## 8. O que ainda está pendente

| # | Pendência | Onde fecha |
|---|---|---|
| 1 | A lore do `ceifador` em `sword.yml` diz *"Chance de abater o mob com um golpe só"*, mas o código (`MobManager:553`) diz que ele **dobra cabeças**. A lore mente | Fase 3d |
| 2 | `pilhagem` e `massacre` precisam ser calibrados **dentro** da pilha de 8,10× que já foi assumida aqui | Fase 3d |
| 3 | O único produto de `spawnerslimite` hoje é o exploit 1:1 de `GarnixFishing/shop.yml` (1.500 corais → 1.500 de limite). Precisa virar uma escada com câmbio decrescente | Fase 4 |
| 4 | Máquinas especiais (cash, limite, secundárias, combustível, chaves) · combustível comum e infinito · galpão e cacto | Fase 3d (resto) |
| 5 | `GarnixVips/vips/*.yml` — os `weight` estão invertidos e a lore anuncia −10%/+10% em todos, o que não corresponde à escada nova | Fase 7 (a lore cita números finais) |
| 6 | O modelo de kills/hora é **interpolação linear** dos upgrades ao longo dos 20 tiers. É a suposição mais frágil da via — e o requisito de cabeças da Fase 3a depende do mesmo modelo. Um erro de 3× move os dois juntos | cronometragem in-game |

### Decisões que estão com você — guardadas aqui

| # | Decisão | O que trava | Default se você não responder |
|---|---|---|---|
| **D1** | **Aprovar o C11** — `total_sold` + `topBySold` + menu no `garnix-warehouse`. Uma coluna, um método, uma query, um menu | os R$ 120 do cacto na premiação, e a única via de farm sem placar | os R$ 120 vão para o prestígio (R$ 370) e o cacto fica sem placar |
| **D2** | **A data real do lançamento** — hoje os 20 `release:` vão de 01/09/2026 a 20/09/2026 | nada agora; é o último ajuste antes de subir | só a data-base muda; **nenhum valor é recalculado** |
| **D3** | O +1% do **rank 1** requer o nó `rankup.rank.1` no grupo default do LuckPerms (tarefa de operação, fora do repo) | nada | a escada efetiva começa em **+2%** |
