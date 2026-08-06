# GARNIX — Armazém e Cacto

> Escopo: `GarnixWarehouse/*` + `GarnixCactusTowers/*` + o bloco `farm` do `coins-shop`. Reescrito em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).
> Fatia da via: **19,0% da renda diária da casa**.

## A taxa de colheita é MEDIDA, não derivada

✅ Medição do dono (06/08/2026):

```
144.345 cactos colocados  →  50.000 cactos por MINUTO
= 3,00×10⁶ por hora
= 20,8 cactos/h POR CACTO COLOCADO   (0,3464 por minuto)
```

⚠️ **Esta medição derrubou a derivação teórica**, e fica registrado para ninguém refazer a conta errada. Pelos parâmetros do servidor — `randomTickSpeed: 8` e `growth.cactus-modifier: 20000` no `spigot.yml` do PandaSpigot — a conta dava **140,6/h por ponta**:

```
random ticks por bloco = 20 ticks/s × 8 / 4096 = 1 a cada 25,6 s
supondo que o modifier de 200× estoura os 16 estágios de `age` num único
random tick, ou seja que SATURA  →  140,6/h por ponta
```

A medição dá 20,8/h por cacto colocado — **6,8× menos**. Mesmo assumindo colunas de 3 (só o topo cresce, `world.isEmpty(pos.up())`), sobram 62,4/h por ponta, ainda 2,3× abaixo. **O modifier não satura.** Use sempre o número medido, e a unidade "por cacto colocado" — é o que dá para contar no plot sem saber a geometria da farm.

## Os perfis de farm

| Perfil | Cactos plantados | Cactos/min | Quem chega |
|---|---|---|---|
**Dia 1** (3–10%) | 4.330 – 14.435 | 1.500 – 5.000 | com muita motivação |
**Típico de temporada** (40%) | 57.738 | 20.000 | a maioria |
Bom (50%) | 72.173 | 25.000 | alguns |
**Máximo** (100%) | 144.345 | 50.000 | poucos, 2–3 semanas |

⚠️ **A farm cresce ~8× ao longo da temporada, não os 300× que o doc antigo assumia.** Isso muda o ritmo do buff: como a economia cresce 6,146×/dia e a farm 1,115×/dia, o preço tem que carregar a diferença.

### 🚩 O gargalo real da via é logística, não coins

O jogador só tira cacto do armazém **por inventário**, e replanta bloco a bloco:

```
1 viagem = 36 slots × 64 = 2.304 cactos
plantio medido = 5 andares (45 cactos) em ~1,5 min = 30 cactos/min
farm máxima = 144.345 cactos  →  ~80 HORAS de plantio manual
```

É isso que explica as 2–3 semanas e o *"tem que ter muita sanidade"*. Nem preço nem colheita limitam a via — o que limita é o jogador colocando bloco.

## O `sell-price`

```
casa/dia no T1 ......... 1.500.000
cacto = 19% ............   285.000 por dia
farm do dia 1 .......... 2.500 cactos/min = 3.600.000/dia
sell-price ............. 0,0792
escada de buff ......... 5,51×/dia
```

A escada é **derivada, não escolhida**: `6,146 (economia) ÷ 1,115 (farm) = 5,51`. Conferido — no dia 20 a via entrega 2,742×10²⁰ contra o alvo de 2,742×10²⁰.

O `sell-price` é uma **alavanca viva**: ele sobe por update ao longo da temporada. A amplitude da via mora aqui desde que o `warehouse.sellmult` foi removido.

### ⚠️ Por que a régua "5 minutos de mina = 1 minuto de cacto" não entrou

O dono pediu essa régua. Ela é **impossível** junto com qualquer repartição que feche em 100%, e o motivo é tempo:

```
o cacto roda 24h · a mineração roda 3h   →   8× mais tempo
a régua pede 5× de taxa por minuto       →  40× mais renda total
a mineração inteira é 14% da casa        →  o cacto pediria 560%
```

A razão `cacto/mineração` é **invariante** à casa/dia — mudar a âncora não move o problema. ✅ A saída decidida foi medir a via **por dia**: numa via AFK o jogador não cronometra, ele olha quanto entrou. E por dia o cacto rende **1,36× a mineração**, que é a hierarquia que o dono queria.

## O armazém NÃO é parede — é sink

`AutoSellTask.runFor` chama `sellAll(warehouse, ...)`: o ciclo esvazia o armazém **inteiro**, não um lote. Então:

> **perda = 0 sempre que `limite ≥ taxa × intervalo`.**

Com `initial-limit: 3000` e o intervalo padrão de 20s, o armazém aguenta uma farm de ~11.000 cactos sem perder nada. Acima disso o jogador compra limite — que é exatamente o desenho de um sink. **O `initial-limit` fica como está.**

| Onde | O quê |
|---|---|
`AutoSellTask.tick` | só roda para jogadores **online** — a conta AFK precisa estar conectada |
`FarmListener.handleGrow` | cancela o crescimento **mesmo com o armazém cheio**: a perda é real e silenciosa |

### ✅ O autosell premium estava dominado — e foi corrigido

Limite e intervalo são **substitutos**: dá para zerar a perda subindo um ou baixando o outro. E o limite tinha a rota mais barata até dentro da mesma moeda:

| Caminho | Custo | Efeito no dia 20 |
|---|---|---|
Os 5 upgrades de velocidade (20s → 10s) | **10.000 cash** | poupa 3.917 de limite |
Comprar esses 3.917 de limite no cash-shop | **6.400 cash** | idêntico |

Ninguém que fizesse a conta compraria velocidade. ✅ A escada foi para **150 / 275 / 400 / 550 / 800** (total 2.175): o upgrade volta a ser mais barato que o limite equivalente, e um free que guarde os 400 cash da temporada compra o primeiro nível — antes não alcançava nem o mais barato.

## O custo de montar a farm

| Item | Preço | Por quê |
|---|---|---|
**Cacto** (loja) | **150.000** | ✅ decisão do dono. São 2,16 **horas** de renda ativa por unidade. A escada foi 6.000 → 35.000 → 150.000 |
**Areia** (loja) | 5.000 | não cresce, não se replanta, não tem rota grátis — é o único sink linear da via |

O cacto pode ser tão caro porque **comprar nunca é obrigatório**: ele se replanta sozinho e sai de graça do armazém. Comprar é atalho para quem não quer esperar o composto.

## As torres

✅ Decisão do dono: *"nós vamos ter torres de até 30 andares no máximo, sem loucuras, o resto é tudo trabalho manual"*.

| Torre | Cactos | Tempo poupado | Onde sai |
|---|---|---|---|
5 andares | 45 | ~1,5 min | crate Farm (0,10) · caixas Farm I/II · loja de runas |
10 andares | 90 | ~3 min | loja de runas |
15 andares | 135 | ~4,5 min | loja de runas · Caixa Garnix (9) |
30 andares | 270 | ~9 min | Caixa Garnix (2,5) |

Contra as 80 horas de plantio da farm máxima, a maior torre poupa **0,19%** do trabalho. Foi levantado que escalar as torres em ~10× as tornaria o atalho que ataca o gargalo real da via — e a decisão do dono foi manter o teto de 30 andares. **O plantio manual é o desenho.**

## A rota de loot do cacto e da torre

| Onde | Cacto | Torre de 5 andares |
|---|---|---|
Crate VIP | 0,15 | — |
Crate RankUP | — | 0,35 |
**Crate Farm** | **0,05** | **0,10** |
**Caixa Farm [Tier I]** | **0,75** | **0,50** |
**Caixa Farm [Tier II]** | **1,00** | **0,75** |

A escada de facilidade é **caixa TII > caixa TI > crate**, e as caixas só parecem generosas porque o gate delas é a própria caixa: a Caixa Farm I sai da crate a 0,3 de peso, então tirar cacto por essa rota é **22× menos provável** do que tirá-lo direto da crate.

⚠️ **A família CACTO quebra a grade única das caixas Tier I e II** — é a única exceção legítima, porque cacto só existe nesta via. O peso saiu dos boosters nas duas caixas (6,5 → 5,25 e 7 → 5,25) e do combustível na crate (10,45 → 10,30).

⚠️ **É de propósito que na crate eles sejam mais raros que o jackpot**, apesar de valerem menos: a via é reinvestimento composto, então quem recebe cacto de graça não ganha o valor do cacto, ganha a rampa que ele gera.
