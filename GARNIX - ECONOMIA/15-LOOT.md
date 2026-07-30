# 15 — SUPERFÍCIES DE RECOMPENSA (Fase 5)

Onde os ~144 itens que ainda não tinham rota finalmente ganham uma. Esta fase é a que **fecha a lista A** de [10-ITENS.md](10-ITENS.md), junto com a Fase 7.

| Superfície | Estado |
|---|---|
**6 crates** | ✅ aplicadas |
**7 caixas misteriosas** | ✅ aplicadas |
**Bosses** — 5 no ar | ✅ aplicados · 3 engatilhados ⏳ |
**OnTime** (15 marcos) | ✅ aplicado |
**Dailies** (8 arquivos) | ✅ aplicados |
**Fragmentos** | ✅ fontes definidas · 4º tipo aguarda nome |
**Robôs** | ✅ 4 tiers (era 1) |

---

## 1. As 6 crates

### O estado

As 6 tinham tabelas **byte-idênticas**: pedra, diamante, 5.000 coins e uma armadura de couro vermelha. Zero identidade, zero relação com a economia.

### 🚩 A decisão de fundo: crate não é fonte de renda

Uma crate **não tem gate de tier**. O jogador do dia 1 e o do dia 20 abrem a mesma tabela. Então um prêmio em coins só pode ser:

- **(a)** relevante no dia 1 e ruído depois, ou
- **(b)** quebrado.

**Escolhi (a) de propósito**, e o valor sai disso: **250 coins** por recheio. No dia 1 (renda 3,75×10⁵) umas 200 aberturas dão ~5×10⁴, um empurrão real. No dia 5 as 18.195 aberturas dão 4,5×10⁶ = **0,6% do dia**.

> **O valor de verdade da crate são os ITENS.** É por isso que ela **não entra na repartição das 6 vias**, que já soma 100%.

### As faixas

Calibradas para as **~20.700 aberturas/dia** do servidor inteiro:

| Faixa | Chance | Por dia | Conteúdo |
|---|---|---|---|
**Recheio** | 87,9% | 18.195 | coins 250 · XP · 25 da secundária da via |
**Bom** | 10% | 2.070 | 500 L de combustível · 5 fragmentos · 500 da secundária |
**Raro** | 2% | 414 | **chave de boss** (60% da faixa) · peça de armadura T-II · o extra da crate |
**Épico** | 0,099% | 20,5 | peça de armadura T-IV · skin média · **booster 3× de 10 min** |
**Jackpot** | 0,001% | 1 a cada 5 dias | o item Mítico da crate |

⚠️ `chance` é **peso**, não porcentagem — `Crate.java:100-105` normaliza por `totalChance`. Somar 100 é só legibilidade.

### As 6 identidades

| Crate | Alimentada por | Secundária | Extra (faixa Raro) | **Jackpot** |
|---|---|---|---|---|
`mineracao` | `blessed`, ~15.000/dia | gemas | Explosivo 4x4 | **Vaga de Visitante** (Mítico−) |
`farm` | `clover`, ~5.000/dia | sementes | Forja de Skin | **Skin de Marfim** |
`pesca` | recompensa `treasure` | corais | Livro de Correnteza 3 | **Skin de Tempestita** |
`bosses` | drop de boss | dracmas | Livro de Massacre 3 | **Livro de Pilhagem 3** (Mítico−) |
`rankup` | ao dar rankup | dracmas | Livro de Ceifador 2 | **Máquina de Cash** |
`vip` | toda ativação de VIP, para **todos os online** | gemas | Booster 2× de 30 min | **Combustível Infinito** (Mítico) |

### A `rankup` é a exceção — e tem que ser

Volume deliberadamente baixo (~20 chaves por volta de prestígio, contra 18.000/dia da mineração). É a única cuja tabela pode ser generosa sem inflar nada, então ela é **deslocada para cima**:

| | recheio | bom | raro | épico | jackpot |
|---|---|---|---|---|---|
As outras 5 | 87,9% | 10% | 2% | 0,099% | 0,001% |
**`rankup`** | **60%** | **30%** | **8,5%** | **1,45%** | **0,05%** |

### Dois cuidados que entraram no gerador

**Peça individual, nunca a coleção.** `ArmorManager:52` monta o id como `<arquivo>_<slot>`, e `givearmor tier-v` (sem slot) entrega **o set T-V inteiro** — os +48% num drop só. As crates dão sempre `tier-ii_leggings`, `tier-iv_helmet` e afins.

**A peça é escolhida pelo índice da crate, não sorteada em tempo de geração.** Regerar o arquivo produz sempre o mesmo resultado e o diff fica limpo.

**A pesca não tem provider `coins`.** `booster-types` dela é `xp/corais/both`, então o booster épico da crate de pesca usa `corais`. Um comando com `coins` ali falharia em silêncio.

---

## 2. As 7 caixas misteriosas

### O estado

As 7 retornavam `type: NONE` com chance **100%**. E elas são o **faucet de armadura e skin** do servidor — 60 peças de armadura e 30 skins não tinham outra rota, e a caixa entregava nada, sempre.

### A estrutura

| Caixa | Rota | Azar | Conteúdo |
|---|---|---|---|
`<via>-I` | in-game, acessível | **20%** | armadura T-I a T-III · skin forjável · forja · lote de secundária · booster 2× 15m |
`<via>-II` | **site** + in-game beeem raro | **3%** | armadura T-III a T-V · skins 7 e 8 · livro · booster 3× 10m |
`garnix` | jackpot e site | **0%** | só Mítico e Mítico−, cruzando as 3 vias |

> *"itens melhores e menos itens piores"* — a diferença entre I e II não está só no topo da tabela, está no **piso**. A I tem 20% de azar, a II tem 3%, a `garnix` não tem nenhum.

### A caixa `garnix`

11 recompensas, nenhuma ruim, cruzando as três vias:

| Chance | Prêmio |
|---|---|
20% · 18% | peça de armadura **T-V** (mineração · fazenda) |
14% · 12% · 10% | as **3 skins mais raras** — mithril, marfim, tempestita |
8% | **Livro de Pilhagem 3** (Mítico−) |
6% | **Livro de Massacre 5** (Mítico−) |
5% | **Vaga de Visitante** (Mítico−) |
4% | **Máquina de Limite** |
2% | **Matadora Hit-Kill** (Mítico−) |
1% | **Combustível Infinito** (Mítico) |

### ⚠️ Armadura nunca vai para o site

Ela existe **só via caixa**. E como a caixa II é comprável, **quem paga compra CHANCE, não a peça** — o set completo continua sendo coisa de quem joga. É o que dá à armadura o papel de *"equipamento que só quem joga tem completo"*.

### Um comando que eu ia errar

Eu ia escrever `/bosses givesword {player} hk`. **Não existe.** A raiz é `boss` (singular) e o subcomando é aninhado (`BossCommand:48-73`):

```
/boss give sword <jogador> <variante>
```

Com o nome errado, a Matadora Hit-Kill — um dos itens Mítico− — falharia **em silêncio** no jackpot da caixa mais rara do servidor.

---

## 3. Bosses — de 3 idênticos para 5 por banda

Os 3 tinham blocos `rewards:` **byte-idênticos** (md5 `6ec10abf` nos três). Mesma tabela, mesmo `reward-rolls: 3`, só a vida mudava.

| Boss | Tipo | Banda | Vida | Coins por abate | Livro | Matadora |
|---|---|---|---|---|---|---|
`colosso` | MAGMA_CUBE | T1–T4 | 25.000 | 1,08×10⁴ | Massacre 2 | — |
`inferno` | BLAZE | T5–T8 | 50.000 | 2,07×10⁷ | Massacre 2 | — |
`arauto` | ENDERMITE | T9–T12 | 75.000 | 3,95×10¹⁰ | Ceifador 2 | Sombria |
**`tita`** 🆕 | IRON_GOLEM | T13–T16 | 150.000 | 7,53×10¹³ | Pilhagem 2 | Ancestral |
**`devorador`** 🆕 | WITHER | T17–T20 | 300.000 | 1,44×10¹⁷ | Pilhagem 2 | Ancestral + **Caixa Garnix** |

**Boss não é via de renda**, igual à crate — a repartição das 6 vias já soma 100%. O coins por abate é **0,01% da renda da banda**, o que com ~250 abates/dia dá **~2,5% do dia**: sentido, sem distorcer a curva.

**Os livros são o freio da temporada.** `Massacre 2` na banda baixa, `Pilhagem 2` só a partir da T13 — e `Pilhagem 3` continua exclusivo do jackpot. Livro sem gate de banda antecipa o multiplicador de todo mundo.

---

## 4. OnTime — 1 hora pagava o mesmo que 15 dias

Os 15 marcos eram **byte-idênticos no payload**: 5.000 coins, 8 diamantes e 1 chave de boss, do marco de 1h ao de 15d. E havia um marco de **30 dias** numa temporada de 20 — inalcançável por definição.

⚠️ **Diferente da crate, o OnTime PODE ser tierado**: o marco `<N>d` só é alcançável no dia N, então ele já vem com um gate de calendário de graça.

| Marco | Dia | Coins | Chaves | Extra |
|---|---|---|---|---|
1h | 1 | 7.500 | 2 | Combustível (2.000 L) |
12h | 1 | 37.500 | 2 | Combustível |
1d | 1 | 56.300 | 2 | Combustível |
3d | 3 | 1,64×10⁶ | 5 | Caixa Mineração I |
7d | 7 | 3,75×10⁹ | 11 | Caixa Mineração I |
**10d** (era 30d) | 10 | 1,08×10¹² | 15 | Caixa Mineração II |
15d | 15 | 1,71×10¹⁶ | 23 | Caixa Mineração II |

---

## 5. Dailies — o cash estava 2,5× acima do orçamento

`membro.yml` dava `cash add 50` por dia = **900 na temporada, sozinho**, contra um alvo de 300–500 para o jogador free **inteiro**.

| Arquivo | Cash/dia | Na temporada | Chaves | Caixa |
|---|---|---|---|---|
`membro` | **20** | 400 | 2 | — |
`vinculado` | **+8** | +160 | 1 | — |
`celestial` | 40 | 800 | 4 | mineracao-i |
`imortal` | 60 | 1.200 | 6 | mineracao-i |
`supremo` | 85 | 1.700 | 9 | farm-i |
`garnix` · investidor · influencer | 120 | 2.400 | 12 | mineracao-ii |

O simulador confirma: **free 400 · free + vinculado 560**, dentro do alvo.

⚠️ `vinculado` **não é um VIP** — é um faucet permanente para toda a base que vinculou o Discord. Por isso entra como **acréscimo** (+8), não como degrau da escada.

---

## 6. Robôs — existia um só

`lendarioI`, 4s por abertura, e mais nada. Com **~20.700 chaves/dia** no servidor, o robô não é luxo:

> **Sem robô o jogador não consegue abrir o que ganha.** Ele é infraestrutura da economia de chaves, não um cosmético.

Viraram 4 tiers — e o mais lento é **Comum** de propósito, porque todo mundo precisa de um:

| Robô | Ciclo | Aberturas/dia | Raridade |
|---|---|---|---|
`comumI` | 20s | 4.320 | Comum |
`raroI` | 10s | 8.640 | Raro |
`epicoI` | 6s | 14.400 | Épico |
`lendarioI` | 4s | 21.600 | Lendário |

(A lore do robô **não** promete `×2.0` como o plano dizia — esse achado era de outro arquivo. A lore atual está correta.)

---

## 7. Fragmentos — um tipo por FONTE, não por tema

Os 3 tipos existem com nome e ícone, mas **zero faucet e zero sink**. A recomendação do plano é a que aplico:

| Tipo | Fonte | Por quê |
|---|---|---|
`fogo` | **boss** | já é o único com faucet (entra nas crates e nos bosses) |
`gelo` | **caixa misteriosa** | canal premium, ritmo diferente do boss |
`natureza` | **evento** | obriga a aparecer nos 21 eventos |
⏳ 4º tipo | **PvP** (duelos, bolão) | fecharia o único sistema sem fragmento |

> Se os tipos forem só cores sem fonte distinta, viram **uma moeda só com passos extras**. Com uma fonte cada, o custo multi-fragmento obriga a tocar em vários sistemas — que é o efeito que se quer.

O **nome** do 4º tipo é seu; a mecânica é idêntica para 3 ou 4.

---

## 8. O ícone da recompensa de moeda

Você perguntou se dá para confiar num ícone automatizado nas recompensas `type: CURRENCY`. **Ele existe, mas não está ligado no loot** — e a checagem achou os 31 blocos errados.

**O que existe.** Cada moeda declara o próprio ícone em `GarnixCurrencies/currencies/<id>.yml`:

| moeda | ícone |
|---|---|
`coins` | `INK_SACK:10` (verde-limão) |
`gemas` | `INK_SACK:9` · `dracmas` `INK_SACK:11` · `corais` `INK_SACK:6` · `sementes` `INK_SACK:5` |
`cash` | `GOLD_INGOT` |
`spawnerslimite` | `INK_SACK:12` · `maquinaslimite` `INK_SACK:4` |

E o `CurrencyHook.getCurrencyIcon(id)` serve esse ícone pronto.

**O que não existe.** `garnix-crates`, `garnix-mystery-boxes` e `garnix-bosses` **não chamam esse método**. Os três leem `icon:` do bloco da recompensa e, se faltar, caem em `BARRIER` (`CrateManager.java:312`). Ou seja: hoje o ícone é obrigatório escrever à mão, e escrever errado não dá erro nenhum — só aparece feio no jogo.

**O que estava errado, nos 31 blocos.** Duas heranças do template do *first commit*:

| Problema | Alcance |
|---|---|
`coins` com `material: DOUBLE_PLANT` | 11 blocos — planta, não moeda |
`INK_SACK` **sem `data:`** nas secundárias | 20 blocos — `data` 0 é **tinta preta**, então gemas, dracmas, corais e sementes apareciam todas com o mesmo ícone preto |

✅ **Corrigido**: os 31 agora derivam material e data do ícone que a própria moeda declara. O `display:` de cada um foi preservado.

⏳ **C15 (proposto).** Fazer o `type: CURRENCY` sem `icon:` cair em `getCurrencyIcon(currencyId)` em vez de `BARRIER`. São ~3 linhas em cada um dos 3 plugins e transforma o ícone da moeda em fonte única da verdade: trocar o ícone de `coins` passa a atualizar toda crate, caixa e boss de uma vez, e some a chance de errar de novo em 31 lugares. **Sem o C15 nada quebra** — os blocos escritos à mão estão corretos hoje.

**Nota sobre materiais na economia.** As tabelas de loot **não têm nenhuma recompensa `type: ITEM`** — tudo é `CURRENCY` ou `COMMAND`. Então nenhum diamante, pedra ou sucata é entregue ao jogador. Onde `DIAMOND_CHESTPLATE` e afins aparecem, é **ícone de preview** de uma armadura ou livro, ou seja figura, não item.

---

## 9. O que falta na Fase 5

| # | Item | Por quê ainda não |
|---|---|---|
| 1 | **Os 3 bosses engatilhados** | ficam em [bosses-engatilhados/](bosses-engatilhados/) para lançar como update no meio da temporada. Adicionar boss **redistribui as bandas**, então tem que estar calculado antes |
| 2 | **Livros de pesca nos níveis 4–5** | são os únicos sem linha de loot. Vão para o site e para a caixa `pesca-ii` na Fase 7 |
| 3 | **O 4º fragmento** | mecânica pronta, falta o nome |
