# GARNIX — Tabela de Recompensas dos Bosses

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

> Escopo: `GarnixBosses/bosses/*.yml` — 5 bosses. **Refatoração aplicada** em 05/08/2026.
> Os 3 engatilhados (`Algoz` 35k · `Flagelo` 62k · `Leviatã` 110k) continuam fora do ar, em
> [GARNIX - ECONOMIA/bosses-engatilhados/](../GARNIX%20-%20ECONOMIA/bosses-engatilhados/), e **não** seguem esta grade ainda.

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml. O `RewardManager` usa `RandomSelector.weighted` e normaliza pelo total.
- **Os 5 arquivos somam exatamente 100 de peso**, então aqui **peso = porcentagem real**. Isso não é só legibilidade: o menu `/boss > recompensas` imprime o peso cru como porcentagem (`BossRewardsMenu.java:136`), então só é verdade porque soma 100.
- **`reward-rolls: 3` nos cinco** — cada abate sorteia **3 vezes** nesta tabela, de forma independente.
- As recompensas caem no **correio**, com o total já agregado (3 rolls em dracmas viram uma linha só).

---

## 1. As três classes

Os 5 bosses viraram **3 classes**, e o que separa uma da outra é o **piso**, não só o topo — o mesmo eixo das caixas Tier I e Tier II.

| Classe | Bosses | Vida | Ideia |
|---|---|---|---|
| **Fácil** | Colosso · Inferno | 25k · 50k | recurso de desenvolvimento puro. Sem livro nenhum, sem utilitário de topo. |
| **Médio** | Arauto · Titã | 75k · 150k | entram os 6 livros de encantamento, o Kill-Stack e a caixa de tier acima. |
| **Difícil** | Devorador | 300k | menos filler, mais de um em cada quatro rolls é item. Única fonte de Caixa Garnix. |

### A grade de faixas

| Faixa | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---:|---:|---:|---:|---:|
| **Azar** | 25 | 25 | 15 | 15 | **8** |
| **Moeda** (coins + dracmas) | 26 | 25 | 21 | 20 | **16** |
| **Recurso** | 26 | 26 | 24 | 22 | 17 |
| **Recurso bom** | 19 | 20 | 25 | 26 | 26 |
| **Raro** | 3 | 3 | 13 | 14 | **28** |
| **Jackpot** | 1 | 1 | 2 | 3 | **5** |
| Abate sem nada (azar³) | 1,56% | 1,56% | 0,34% | 0,34% | **0,05%** |
| Nº de recompensas | 29 | 29 | 45 | 47 | 50 |

Do Colosso ao Devorador a **moeda cai pela metade** (26 → 16) e o **raro multiplica por 9** (3 → 28). É essa inversão que faz o boss difícil parecer diferente, não a quantia.

### A escada de utilitário — o que entra em que classe

| | Colosso | Inferno | Arauto | Titã | Devorador |
|---|:---:|:---:|:---:|:---:|:---:|
| Ativador de Baú | ✅ | ✅ | ✅ | ✅ | ✅ |
| Reset de KDR | — | — | ✅ | ✅ | ✅ |
| Limpador de Terreno | — | — | — | ✅ | ✅ |
| Livro de Kill-Stack | — | — | ✅ | ✅ | ✅ |
| 6 livros de encantamento | — | — | ✅ | ✅ | ✅ |
| Cash | — | — | ✅ | ✅ | ✅ |

---

## 2. As sete decisões de fundo

### 2.1 Boss não paga gema, semente nem coral

Decisão do dono. As três secundárias de via saem de crate, de caixa e da própria profissão. **A moeda do boss é `coins` e `dracmas`, e só.** O peso liberado (era 16-17 de gemas em cada arquivo) **não virou mais moeda** — foi para `RECURSO` e `RECURSO BOM`, que é onde o valor do boss deve estar.

### 2.2 A dracma é a secundária do boss

Ela era a moeda que o boss menos pagava e deveria ser a única que ele paga. Ganhou escada de 3 degraus e o maior salto da refatoração:

| Boss | Antes | Agora | Por abate (antes → agora) |
|---|---|---|---|
| Colosso | 100 fixo, peso 15 | 500 · 1.000 · 2.000, peso 8 | 45 → **228** |
| Inferno | 200 fixo, peso 16 | 750 · 1.500 · 3.000, peso 8 | 96 → **342** |
| Arauto | 300 fixo, peso 16 | 1.250 · 2.500 · 5.000, peso 6 | 144 → **428** |
| Titã | 400 fixo, peso 16 | 1.750 · 3.500 · 7.000, peso 6 | 192 → **599** |
| Devorador | 500 fixo, peso 16 | 3.000 · 6.000 · 12.000, peso 4 | 240 → **684** |

Referência: uma abertura de Caixa Recursos entrega ~145 de dracma. O boss **fácil** já passa a caixa mediana.

### 2.3 Os 6 livros de encantamento entram a partir do Arauto

Sempre **1x**, sempre **nível 1**, e o que muda de boss para boss é **só a chance**. As duas famílias com o mesmo peso, porque boss é superfície de todo mundo e não pode privilegiar uma via.

| Livro | Comando | Arauto | Titã | Devorador |
|---|---|---:|---:|---:|
| Ceifador · Massacre · Pilhagem | `lamina givebook` | 0,5 cada | 0,7 cada | 1,0 cada |
| Cobiça · Maré · Correnteza | `pesca givebook` | 0,5 cada | 0,7 cada | 1,0 cada |
| **Total da faixa** | | **3%** | **4,2%** | **6%** |
| **Abates com livro** | | **9%** | **12,6%** | **18%** |

Colosso e Inferno não têm livro nenhum — é o gate da classe.

### 2.4 O Kill-Stack cai de boss; a matadora, não

Antes, matar 1.000 Devoradores nunca dropava nada do ecossistema de boss. O livro só tem valor para quem **já** mata boss, então não antecipa nada.

| Boss | Kill-Stack |
|---|---|
| Colosso · Inferno | — |
| Arauto | 1,7% (x1) |
| Titã | 2% (x1) |
| Devorador | 4% (x1) + 1,7% (x2) → **0,22 livro por abate** |

**A matadora continua exclusiva** da Caixa Bosses I/II e da crate. É o que mantém motivo para abrir a caixa.

### 2.5 O cash é mais topo que os limites

Decisão do dono: o cash tem que ser **mais raro que qualquer degrau de limite** do mesmo arquivo. Ele fica no jackpot, e só a Caixa Garnix passa por cima dele.

| Boss | Cash | Peso | Limite mais raro do arquivo | Por abate |
|---|---:|---:|---|---:|
| Arauto | 100 | 0,05 | spawner 75 → 0,1 | 0,15 |
| Titã | 250 | 0,05 | spawner 100 → 0,08 | 0,375 |
| Devorador | 500 | 0,1 | spawner 150 → 0,2 | 1,5 |

⚠️ Se algum limite ficar mais raro que o cash num ajuste futuro, a hierarquia inverte — o cash tem que descer junto.

### 2.6 O limite de armazém foi cortado; o de spawner subiu

Os 5 bosses davam **500 de armazém a 4%**, do Colosso ao Devorador — 800 de cash no shop, no boss que é 56% da crate. A escada nova acompanha a Caixa Recursos:

| | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---|---|---|---|---|
| Armazém | 15 · 30 | 30 · 50 | 50 · 100 · **150** | 100 · 150 · **250** | 150 · 250 · **400** |
| Máquinas | 1 · 2 | 2 · 3 | 3 · 5 · **8** | 5 · 8 · **12** | 8 · 12 · **20** |
| **Spawners** | 10 · 20 · 30 | 20 · 30 · 50 | 20 · 30 · **50 · 75** | 25 · 50 · **75 · 100** | 50 · 75 · **100 · 150** |
| Armazém / abate | 60 → **4,3** | 60 → **7,9** | 60 → **17,4** | 60 → **26,4** | 60 → **37,5** |
| Spawner / abate | 0,08 → **0,61** | 0,08 → **1,04** | 0,08 → **1,22** | 0,08 → **1,41** | 0,08 → **3,30** |

O **degrau em negrito vive na faixa `RECURSO BOM`**, não no recheio. Os três limites seguem a razão **6:3:1** (armazém : máquina : spawner) nos pesos.

### 2.7 O azar cai com a dificuldade

25% nos fáceis, 15% nos médios, **8% no difícil** — a menor taxa de "não veio nada" da rede. Um Devorador morto só sai seco em **1 de cada 1.953 abates**.

---

## 3. As tabelas

### 3.1 Colosso — `colosso.yml` · 25.000 · fácil

| Faixa | Conteúdo |
|---|---|
| **Azar 25** | — |
| **Moeda 26** | coins 1.000 · 2.000 · 4.000 (9 · 5,4 · 3,6) — dracmas 500 · 1.000 · 2.000 (4 · 2,4 · 1,6) |
| **Recurso 26** | combustível 500L · 1.000L (8 · 4) — armazém 15 · 30 (4,8 · 2,4) — máquinas 1 · 2 (2,4 · 1,2) — spawners 10 · 20 · 30 (0,6 · 0,36 · 0,24) — Ativador de Baú (2) |
| **Recurso bom 19** | as 4 runas x10 (3,5 cada) — chave de boss x3 (5) |
| **Raro 3** | Boss Inferno (1,2) — chave x5 (0,8) — Caixa Recursos (0,7) — Boss Arauto (0,3) |
| **Jackpot 1** | Caixa Runas (0,6) — Caixa Bosses I (0,3) — Caixa Chaves (0,1) |

### 3.2 Inferno — `inferno.yml` · 50.000 · fácil

Mesma estrutura, um degrau acima: combustível 750L · 1.500L · armazém 30 · 50 · máquinas 2 · 3 · spawners 20 · 30 · 50 · runas x15 (3,6 cada) · chave x5 (5,6) · no raro Boss Arauto e Boss Titã.

### 3.3 Arauto — `arauto.yml` · 75.000 · médio

É aqui que a tabela vira: azar 25 → **15**, moeda 25 → **21**, raro 3 → **13**.

| Faixa | Conteúdo |
|---|---|
| **Recurso 24** | combustível 1.000L · 2.000L — armazém 50 · 100 — máquinas 3 · 5 — spawners 20 · 30 — Ativador (2) — **Reset de KDR (2)** |
| **Recurso bom 25** | as 4 runas x25 (3,5 cada) — chave x10 (3,5) — Caixa Recursos (3) — chave x15 (2,4) — armazém 150 / máquina 8 / spawner 50 e 75 (1,2 · 0,6 · 0,2 · 0,1) |
| **Raro 13** | Boss Titã (3,3) — **Kill-Stack (1,7)** — Caixa Runas (1,7) — Caixa Bosses I (1,5) — Boss Devorador (1,3) — **os 6 livros (0,5 cada)** — chave x25 (0,5) |
| **Jackpot 2** | Caixa Chaves (0,8) — Boosters (0,5) — Bosses II (0,35) — Robôs (0,3) — **100 de cash (0,05)** |

### 3.4 Titã — `tita.yml` · 150.000 · médio

Topo da faixa média e o primeiro com **Limpador de Terreno**. Combustível 1.500L · 3.000L · armazém 100 · 150 · 250 · spawners 25 · 50 · 75 · 100 · runas x40 (3,2 cada) · Kill-Stack a 2% · os 6 livros a 0,7 · Devorador x1 e x3 no raro · jackpot com Caixa Caixas e 250 de cash (0,05).

### 3.5 Devorador — `devorador.yml` · 300.000 · difícil

| Faixa | Conteúdo |
|---|---|
| **Azar 8** | a menor da rede |
| **Moeda 16** | coins 15.000 · 30.000 · 60.000 — dracmas 3.000 · 6.000 · 12.000 |
| **Recurso 17** | combustível 2.000L · 4.000L — armazém 150 · 250 — máquinas 8 · 12 — spawners 50 · 75 — Ativador — Reset de KDR |
| **Recurso bom 26** | as 4 runas **x60 (3,2 cada)** — chave x25 (3,2) — Caixa Recursos (2,8) — Limpador (2,4) — chave x50 (1,6) — armazém 400 (1,2) — Caixa Runas (0,8) — máquina 20 / spawner 100 e 150 (0,6 · 0,4 · 0,2) |
| **Raro 28** | Devorador x3 (5,5) — **Kill-Stack (4)** — Caixa Bosses I (3,2) — Devorador x5 (2,2) — Caixa Chaves (2,2) — **Kill-Stack x2 (1,7)** — Caixa Boosters (1,7) — chave x75 (1,5) — **os 6 livros (1,0 cada)** |
| **Jackpot 5** | Bosses II (1,5) — Robôs (1,3) — Caixas (1,15) — Máquinas (0,9) — **500 de cash (0,1)** — **Caixa Garnix (0,05)** |

**Ele fica abaixo da caixa boa de propósito.** Não dá armadura, skin nem matadora — que é justamente o que a Caixa Tier II vende. O que ele tem de melhor é o **volume**: 3 rolls por abate, quantas vezes o jogador quiser matar.

**A auto-alimentação decai.** Devorador x3 a 5,5% + x5 a 2,2% = 0,275 stack por roll, ou **0,825 por abate** — abaixo de 1, então a corrente sempre morre. Só passaria a se sustentar sozinha se esses dois pesos somassem mais de 33.

---

## 4. O que mudou em números

### 4.1 Coins deixou de ser geométrico

A escada antiga ia de 10.800 a **1,44×10¹⁷**, multiplicando ~1.910× por boss. A justificativa registrada era que o coins é "0,01% da renda da banda" — mas **boss não tem gate de tier**, então nada obriga o jogador a matar o boss da banda dele. Um T1 que consegue um Devorador (crate 0,4% · Caixa Bosses I 5,25% · drop de Titã) e o mata com a Matadora Inicial leva a renda inteira de um dia T17.

É o mesmo problema da crate, e a decisão passa a ser a mesma: **coins é empurrão no dia 1 e ruído depois.** A escada nova dobra a cada boss.

| Boss | Antes (base) | Agora (base · x2 · x4) | Antes / abate | Agora / abate |
|---|---:|---|---:|---:|
| Colosso | 10.800 | 1.000 · 2.000 · 4.000 | 9.720 | **1.026** |
| Inferno | 2,07×10⁷ | 2.000 · 4.000 · 8.000 | 1,74×10⁷ | **1.938** |
| Arauto | 3,95×10¹⁰ | 4.000 · 8.000 · 16.000 | 3,20×10¹⁰ | **3.420** |
| Titã | 7,53×10¹³ | 8.000 · 16.000 · 32.000 | 5,87×10¹³ | **6.384** |
| Devorador | 1,44×10¹⁷ | 15.000 · 30.000 · 60.000 | 1,08×10¹⁷ | **10.260** |

Referências: a crate paga ~117 coins por abertura e a Caixa Recursos ~350. O Colosso paga **8,8× a crate** por abate.

> **O valor do boss são os ITENS** — runa, combustível, limite, chave, caixa e livro. Se o coins parecer pequeno, o ajuste é nos itens, não em voltar à escada geométrica.

### 4.2 O que subiu

| Item / abate | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---:|---:|---:|---:|---:|
| **Dracmas** | 45 → 228 | 96 → 342 | 144 → 428 | 192 → 599 | 240 → 684 |
| **Combustível** | 0 → 240L | 0 → 360L | 0 → 402L | 0 → 540L | 0 → 564L |
| **Runa** | 0 → 4,2 | 0 → 6,5 | 0 → 10,5 | 0 → 15,4 | 0 → 23,0 |
| **Chave de boss** | 0,33 → 0,57 | 0,52 → 1,08 | 0,74 → 2,51 | 2,10 → 4,22 | 4,13 → 8,18 |
| **Limite de spawner** | 0,08 → 0,61 | 0,08 → 1,04 | 0,08 → 1,22 | 0,08 → 1,41 | 0,08 → 3,30 |

Combustível, runa, Ativador de Baú, Limpador de Terreno, Reset de KDR e os 6 livros de encantamento **não existiam em boss nenhum** antes.

### 4.3 O que desceu

| Item | Antes | Agora |
|---|---|---|
| **Limite de armazém** | 500 a 4% nos cinco (60 / abate) | 4,3 → 37,5 / abate, escalando com o boss |
| **Limite de máquinas** | 1 a 3,5% nos cinco | escada 1·2 → 8·12·20, na razão 6:3:1 |
| **Cash** | 0,02% · 0,05% · 0,1% | 0,05% · 0,05% · 0,1% — agora sempre abaixo do limite mais raro |
| **Coins do Devorador** | 1,08×10¹⁷ | 9,85×10¹⁶ (−9%) |

---

## 5. De onde vem cada boss

| Boss | Fontes |
|---|---|
| Colosso | Crate Bosses (56%) · Caixa Bosses I |
| Inferno | Crate Bosses (28%) · **Colosso (1,2%)** · Caixa Bosses I |
| Arauto | Crate Bosses (11%) · Colosso (0,3%) · **Inferno (1,2%)** · Caixas Bosses I e II |
| Titã | Crate Bosses (1,5%) · Inferno (0,4%) · **Arauto (3,3%)** · Caixas Bosses I e II |
| Devorador | Crate Bosses (0,4%) · Arauto (1,3%) · Titã (3% x1 e 1,2% x3) · **Devorador (5,5% x3 e 2,2% x5)** · Caixas Bosses I e II |

---

## 6. Pontos em aberto

1. **🚩 As três colunas de limite deixaram de ser comparáveis.** A razão 6:3:1 de peso foi desenhada para quando os três saem na MESMA quantia — é assim na Caixa Recursos e na RankUP. Com o spawner em 50-150 e a máquina em 8-20, ela **amplifica** em vez de compensar. No Devorador: spawner rende 3,30 por abate a 4.000 de cash a unidade = **13.200 de valor**, contra 0,95 de máquina a 1.500 = 1.425. Nove vezes de diferença. Dois caminhos: **subir a escada da máquina** para a mesma faixa do spawner, ou **cortar o peso do spawner** bem abaixo do 6:3:1.
2. **O spawner do Devorador (3,30 / abate) passa a Caixa Recursos** (0,79 por abertura) em 4,2x. Nos outros quatro bosses ele fica entre 0,6 e 1,4 — na mesma ordem de grandeza da caixa.
3. **A dracma multiplicou por 5** em toda a linha. Foi deliberado — ela era a moeda que o boss deveria pagar e era a que ele menos pagava. Se virar problema, o ajuste é no **peso da família** (8 · 8 · 6 · 6 · 4), não na quantia.
4. **A chave de boss dobrou** no Titã e no Devorador. O loop chave → crate → boss → chave continua decaindo (a crate tem 33,3% de azar e 56% de Colosso), mas agora bem mais devagar.
5. **Os 3 bosses engatilhados não seguem esta grade.** Adotar Algoz, Flagelo e Leviatã exige reescrever os três com as mesmas seis faixas antes de subir — e eles já usam `lamina givebook` em níveis 2 e 3, que nenhum boss no ar usa.
6. **Nenhum boss dá armadura, skin nem booster.** Decisão de escopo: esses três são o produto das caixas de via. Se um dia entrarem, o lugar é a faixa `RARO` dos médios e do difícil.
