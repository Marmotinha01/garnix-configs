# GARNIX — Tabela de Recompensas dos Bosses

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
| **Fácil** | Colosso · Inferno | 25k · 50k | recurso de desenvolvimento puro. Sem item raro, sem livro. |
| **Médio** | Arauto · Titã | 75k · 150k | mais recurso bom, entra o Livro de Kill-Stack e a caixa de tier acima. |
| **Difícil** | Devorador | 300k | menos filler, um em cada cinco rolls é item. Única fonte de Caixa Garnix. |

### A grade de faixas

| Faixa | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---:|---:|---:|---:|---:|
| **Azar** | 25 | 25 | 15 | 15 | **8** |
| **Moeda** (coins + dracmas) | 26 | 25 | 21 | 20 | **16** |
| **Recurso** | 28 | 28 | 24 | 22 | 17 |
| **Recurso bom** | 17 | 18 | 28 | 30 | **32** |
| **Raro** | 3 | 3 | 10 | 10 | **22** |
| **Jackpot** | 1 | 1 | 2 | 3 | **5** |
| Abate sem nada (0,azar³) | 1,56% | 1,56% | 0,34% | 0,34% | **0,05%** |
| Nº de recompensas | 29 | 30 | 39 | 40 | 43 |

Do Colosso ao Devorador a **moeda cai pela metade** (26 → 16) e o **raro multiplica por 7** (3 → 22). É essa inversão que faz o boss difícil parecer diferente, não a quantia.

---

## 2. As cinco decisões de fundo

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

Referência: uma abertura de Caixa Recursos entrega ~145 de dracma. O boss **fácil** já passa a caixa mediana — que é a ordem pedida.

### 2.3 O Livro de Kill-Stack passa a cair de boss; a matadora, não

Antes, matar 1.000 Devoradores nunca dropava nada do ecossistema de boss. Agora o livro cai nos médios e no difícil — ele só tem valor para quem **já** mata boss, então não antecipa nada.

| Boss | Kill-Stack |
|---|---|
| Colosso · Inferno | — |
| Arauto | 1,7% (x1) |
| Titã | 2% (x1) |
| Devorador | 4% (x1) + 1,7% (x2) → **0,22 livro por abate** |

**A matadora continua exclusiva** da Caixa Bosses I/II e da crate. É o que mantém motivo para abrir a caixa.

### 2.4 O limite de armazém foi cortado — era o maior vazamento

Os 5 bosses davam **500 de armazém a 4%**, do Colosso ao Devorador. 500 de armazém vale **800 de cash** no shop, e o Colosso é 56% da crate Bosses. A escada nova acompanha a Caixa Recursos e sobe boss a boss:

| | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---|---|---|---|---|
| Armazém | 15 · 30 | 30 · 50 | 50 · 100 · **150** | 100 · 150 · **250** | 150 · 250 · **400** |
| Máquinas | 1 · 2 | 2 · 3 | 3 · 5 · **8** | 5 · 8 · **12** | 8 · 12 · **20** |
| Spawners | 1 | 1 · 2 | 2 · 3 · **5** | 3 · 5 · **8** | 5 · 8 · **12** |
| Por abate (armazém) | 60 → **4,3** | 60 → **7,9** | 60 → **17,4** | 60 → **30,2** | 60 → **41,1** |

O **degrau em negrito vive na faixa `RECURSO BOM`**, não no recheio — 150 de armazém vale 240 de cash e 5 de spawner vale 20.000, isso não é filler. Os três limites seguem a razão **6:3:1** (armazém : máquina : spawner) de sempre.

### 2.5 O azar cai com a dificuldade

25% nos fáceis, 15% nos médios, **8% no difícil** — a menor taxa de "não veio nada" da rede. Um Devorador morto só sai seco em **1 de cada 1.953 abates**.

---

## 3. As tabelas

### 3.1 Colosso — `colosso.yml` · 25.000 · fácil

| Faixa | Conteúdo |
|---|---|
| **Azar 25** | — |
| **Moeda 26** | coins 10,8K · 21,6K · 43,2K (9 · 5,4 · 3,6) — dracmas 500 · 1.000 · 2.000 (4 · 2,4 · 1,6) |
| **Recurso 28** | combustível 2.000L · 4.000L (8 · 4) — armazém 15 · 30 (4,8 · 2,4) — máquinas 1 · 2 (2,4 · 1,2) — spawners 1 (1,2) — Ativador de Baú (2) — Reset de KDR (2) |
| **Recurso bom 17** | as 4 runas x10 (2,5 cada) — Limpador de Terreno (3,5) — chave de boss x3 (3,5) |
| **Raro 3** | Boss Inferno (1,2) — chave x5 (0,8) — Caixa Recursos (0,7) — Boss Arauto (0,3) |
| **Jackpot 1** | Caixa Runas (0,6) — Caixa Bosses I (0,3) — Caixa Chaves (0,1) |

### 3.2 Inferno — `inferno.yml` · 50.000 · fácil

Mesma estrutura, um degrau acima. Combustível 3.000L · 6.000L · armazém 30 · 50 · spawner 1 · 2 · runas x15 · chave x5 e x10 · no raro Boss Arauto e Boss Titã.

### 3.3 Arauto — `arauto.yml` · 75.000 · médio

É aqui que a tabela vira: azar 25 → **15**, moeda 25 → **21**, recurso bom 18 → **28**.

| Faixa | Conteúdo |
|---|---|
| **Recurso bom 28** | as 4 runas x25 (3,5 cada) — chave x10 (3,5) — Limpador (3) — Caixa Recursos (3) — chave x15 (2,5) — armazém 150 / máquina 8 / spawner 5 (1,2 · 0,6 · 0,2) |
| **Raro 10** | Boss Titã (3,3) — **Livro de Kill-Stack (1,7)** — Caixa Runas (1,7) — Caixa Bosses I (1,5) — Boss Devorador (1,3) — chave x25 (0,5) |
| **Jackpot 2** | Caixa Chaves (0,8) — Boosters (0,5) — Bosses II (0,35) — Robôs (0,25) — 100 de cash (0,1) |

### 3.4 Titã — `tita.yml` · 150.000 · médio

Topo da faixa média. Combustível 6.000L · 12.000L e armazém 100 · 150 · 250 **já passam o topo da Caixa Recursos**. Runas x40, kill-stack a 2%, Devorador x1 e x3 no raro, e o jackpot ganha a Caixa Caixas e 250 de cash.

### 3.5 Devorador — `devorador.yml` · 300.000 · difícil

| Faixa | Conteúdo |
|---|---|
| **Azar 8** | a menor da rede |
| **Moeda 16** | coins 1,44×10¹⁷ · 2,88×10¹⁷ · 5,76×10¹⁷ — dracmas 3.000 · 6.000 · 12.000 |
| **Recurso 17** | combustível 8.000L · 16.000L — armazém 150 · 250 — máquinas 8 · 12 — spawners 5 · 8 — Ativador — Reset de KDR |
| **Recurso bom 32** | as 4 runas **x60 (4 cada)** — chave x25 (4) — Caixa Recursos (3,5) — Limpador (3) — chave x50 (2) — armazém 400 (1,5) — Caixa Runas (1) — máquina 20 / spawner 12 (0,7 · 0,3) |
| **Raro 22** | Devorador x3 (5,5) — **Kill-Stack (4)** — Caixa Bosses I (3,2) — Devorador x5 (2,2) — Caixa Chaves (2,2) — **Kill-Stack x2 (1,7)** — Caixa Boosters (1,7) — chave x75 (1,5) |
| **Jackpot 5** | Bosses II (1,5) — Robôs (1,2) — Caixas (1,05) — Máquinas (0,7) — 500 de cash (0,4) — **Caixa Garnix (0,15)** |

**Ele fica abaixo da caixa boa de propósito.** Não dá armadura, skin nem matadora — que é justamente o que a Caixa Tier II vende. O que ele tem de melhor é o **volume**: 3 rolls por abate, quantas vezes o jogador quiser matar.

**A auto-alimentação decai.** Devorador x3 a 5,5% + x5 a 2,2% = 0,275 stack por roll, ou **0,825 por abate** — abaixo de 1, então a corrente sempre morre. Só passaria a se sustentar sozinha se esses dois pesos somassem mais de 33.

---

## 4. O que mudou em números

### 4.1 Coins ficou praticamente igual

A escada x1 · x2 · x4 (peso 50/30/20) entrou, mas o peso da família caiu junto. O resultado é neutro — de propósito, porque coins é a moeda que já estava calibrada contra a banda de renda.

| Boss | Antes / abate | Agora / abate | Δ |
|---|---:|---:|---:|
| Colosso | 9.720 | 11.081 | +14% |
| Inferno | 1,74×10⁷ | 2,01×10⁷ | +15% |
| Arauto | 3,20×10¹⁰ | 3,38×10¹⁰ | +5,5% |
| Titã | 5,87×10¹³ | 6,01×10¹³ | +2,3% |
| Devorador | 1,08×10¹⁷ | 9,85×10¹⁶ | **−9%** |

### 4.2 O que subiu

| Item | Colosso | Inferno | Arauto | Titã | Devorador |
|---|---:|---:|---:|---:|---:|
| **Dracmas** / abate | 45 → 228 | 96 → 342 | 144 → 428 | 192 → 599 | 240 → 684 |
| **Combustível** / abate | 0 → 960L | 0 → 1.440L | 0 → 1.809L | 0 → 2.160L | 0 → 2.256L |
| **Runa** / abate | 0 → 3 | 0 → 4,7 | 0 → 10,5 | 0 → 17,8 | 0 → 28,8 |
| **Chave de boss** / abate | 0,33 → 0,44 | 0,52 → 0,81 | 0,74 → 2,55 | 2,10 → 5,03 | 4,13 → 9,38 |

Combustível, runa, Ativador de Baú, Limpador de Terreno e Reset de KDR **não existiam em boss nenhum** antes.

### 4.3 O que desceu

| Item | Antes | Agora |
|---|---|---|
| **Limite de armazém** | 500 a 4% nos cinco (60 / abate) | 4,3 → 41,1 / abate, escalando com o boss |
| **Limite de máquinas** | 1 a 3,5% nos cinco | escada 1·2 → 8·12·20, na razão 6:3:1 |
| **Limite de spawners** | 1 a 2,5% nos cinco | escada 1 → 5·8·12, com o peso mais baixo da família |
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

1. **A dracma multiplicou por 5** em toda a linha. É o maior salto de faucet desta refatoração e foi deliberado — ela era a moeda que o boss deveria pagar e era a que ele menos pagava. Se virar problema, o ajuste é no **peso da família** (8 · 8 · 6 · 6 · 4), não na quantia.
2. **A chave de boss dobrou** no Titã e no Devorador. O loop chave → crate → boss → chave continua decaindo (a crate tem 33,3% de azar e 56% de Colosso), mas agora bem mais devagar.
3. **O limite de spawner continua desproporcional.** 12 dele no Devorador valem 48.000 de cash. A razão 6:3:1 compensa parte; se virar problema, o caminho é **tirar ele da tabela**, não afinar mais o peso — a mesma nota que já está no `recursos.yml`.
4. **Os 3 bosses engatilhados não seguem esta grade.** Adotar Algoz, Flagelo e Leviatã exige reescrever os três com as mesmas seis faixas antes de subir.
5. **Nenhum boss dá armadura, skin nem booster.** Foi decisão de escopo: esses três são o produto das caixas de via, e boss é superfície de todo mundo. Se um dia entrarem, o lugar é a faixa `RARO` dos médios e do difícil.
