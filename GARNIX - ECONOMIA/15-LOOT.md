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

## 3. Bosses — de 3 idênticos para 5 em 3 classes

Os 3 tinham blocos `rewards:` **byte-idênticos** (md5 `6ec10abf` nos três). Mesma tabela, mesmo `reward-rolls: 3`, só a vida mudava. Viraram 5, e em 05/08/2026 os 5 foram reescritos em **3 classes**.

> 📄 A tabela completa, com as seis faixas de cada arquivo e os valores esperados por abate, está em **[GARNIX - REORGANIZAÇÃO DA ECO/bosses.md](../GARNIX%20-%20REORGANIZAÇÃO%20DA%20ECO/bosses.md)**. O que segue é só o resumo.

| Boss | Tipo | Banda | Vida | Classe | Coins (base · x2 · x4) | Por abate | Azar |
|---|---|---|---|---|---|---:|---:|
`colosso` | MAGMA_CUBE | T1–T4 | 25.000 | **fácil** | 1.000 · 2.000 · 4.000 | 1.026 | 25% |
`inferno` | BLAZE | T5–T8 | 50.000 | **fácil** | 2.000 · 4.000 · 8.000 | 1.938 | 25% |
`arauto` | ENDERMITE | T9–T12 | 75.000 | **médio** | 4.000 · 8.000 · 16.000 | 3.420 | 15% |
`tita` | IRON_GOLEM | T13–T16 | 150.000 | **médio** | 8.000 · 16.000 · 32.000 | 6.384 | 15% |
`devorador` | WITHER | T17–T20 | 300.000 | **difícil** | 15.000 · 30.000 · 60.000 | 10.260 | **8%** |

### 🚩 O coins do boss recebe o tratamento da crate, não o da banda

A escada anterior era geométrica — **10.800 no Colosso até 1,44×10¹⁷ no Devorador**, ~1.910× por boss — sob a justificativa de que o coins é "0,01% da renda da banda". **Essa justificativa não se sustenta: boss não tem gate de tier.**

Um T1 pega um Devorador da crate (0,4%), da Caixa Bosses I (5,25%) ou de um Titã, mata com a Matadora Inicial em ~1.200 golpes, e leva **a renda inteira de um dia T17**. É exatamente o problema que a crate tem, e a decisão passa a ser a mesma que já vale lá (§1): *coins é relevante no dia 1 e ruído depois*.

A escada nova **dobra a cada boss**, com base 1.000 → 15.000. Referências: a crate paga ~117 coins por abertura e a Caixa Recursos ~350. O Colosso paga **8,8× a crate** por abate, e o Devorador ~10.260.

> **O valor do boss são os ITENS** — runa, combustível, limite, chave, caixa e livro. Se o coins do boss parecer pequeno, o ajuste é nos itens, não em voltar à escada geométrica.

**Boss não é via de renda**, igual à crate — a repartição das 6 vias já soma 100%.

**A moeda do boss é `coins` e `dracmas`, e só.** Gema, semente e coral não saem de boss nenhum, por decisão do dono — elas são o produto da crate, da caixa e da própria profissão.

**Os livros são o freio da temporada, e o gate agora é a classe.** Colosso e Inferno não dão livro nenhum. Do Arauto para cima saem os **6 livros de encantamento** (Ceifador, Massacre, Pilhagem, Cobiça, Maré, Correnteza), sempre **1x e sempre nível 1** — o que escala é só a chance: 0,5% no Arauto, 0,7% no Titã, 1,0% no Devorador. Os níveis 2 e 3 continuam fora do boss.

**A matadora não cai de boss.** A escada de espada é exclusiva da Caixa Bosses I/II e da crate — é o que mantém motivo para abrir a caixa. O que cai de boss é o **Livro de Kill-Stack** (1,7% · 2% · 4% + 1,7% em x2), porque ele só tem valor para quem já mata boss.

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

✅ **C15 (aprovado e escrito).** O ícone é resolvido **campo a campo**, não tudo-ou-nada:

| Campo | De onde vem |
|---|---|
`material` · `data` | da moeda, **quando o config não declara**. Se declarar, manda o config |
`display` | do config se houver; senão o da moeda |
`lore` | sempre do config — é justamente o que se quer acrescentar sem repetir o resto |

Isso vale porque `getItemStack` devolve `null` quando a seção não tem `material`, `texture` nem `owner` — é esse `null` que distingue *"o config não declarou o item"* de *"declarou"*. Ou seja, dá para escrever só isto e funcionar:

```yaml
icon:
  lore:
  - '&7Cai direto na sua conta.'
```

**Cinco sistemas**, não três: `garnix-crates`, `garnix-mystery-boxes`, `garnix-bosses`, `garnix-ontime` e `garnix-fishing`. A varredura por `type: CURRENCY` achou os dois que eu tinha deixado de fora — e o da pesca era o que mais importava, porque lá o ícone **viaja no `mail.sendCurrency`** e é o que o jogador vê na caixa de entrada, não só um enfeite de menu.

O `garnix-machines` ficou de fora **de propósito**: ele já resolve isso, só que na hora de renderizar o menu (`DropsMenu:105` documenta a mesma prioridade). Foi a implementação dele que serviu de referência.

O helper é privado em cada plugin em vez de ir para o `CurrencyHook` do core: pôr o método no core obrigaria a atualizar o `garnix-core-spigot.jar` (26 MB) na pasta `libs/` dos 5 — e foi exatamente um jar desatualizado desses que quebrou a compilação do `garnix-duels` neste mesmo dia. Duplicar 20 linhas sai mais barato, e segue o padrão que o `readAmount` do C1 já estabeleceu.

**Nota sobre materiais na economia.** As tabelas de loot **não têm nenhuma recompensa `type: ITEM`** — tudo é `CURRENCY` ou `COMMAND`. Então nenhum diamante, pedra ou sucata é entregue ao jogador. Onde `DIAMOND_CHESTPLATE` e afins aparecem, é **ícone de preview** de uma armadura ou livro, ou seja figura, não item.

---

## 9. O que falta na Fase 5

| # | Item | Por quê ainda não |
|---|---|---|
| 1 | **Os 3 bosses engatilhados** | ficam em [bosses-engatilhados/](bosses-engatilhados/) para lançar como update no meio da temporada. Adicionar boss **redistribui as bandas**, então tem que estar calculado antes |
| 2 | **Livros de pesca nos níveis 4–5** | são os únicos sem linha de loot. Vão para o site e para a caixa `pesca-ii` na Fase 7 |
| 3 | **O 4º fragmento** | mecânica pronta, falta o nome |
