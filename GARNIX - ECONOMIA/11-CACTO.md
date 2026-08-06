# 11 — A VIA DO CACTO

A sexta via, e a única que **cresce por reinvestimento**. Jogadores gostam muito de subir farm de cacto e o armazém vai ser muito usado, então ela é **pareada** com as outras — não um apêndice.

Última atualização: **29/07/2026**

---

## O que a torna diferente

**O cacto se paga em cacto.** O jogador tira cacto do armazém para plantar mais, o que aumenta a colheita, o que dá mais cacto para plantar.

É crescimento composto puro — **o exponencial da via já está na mecânica**, não numa tabela de tier. Isso a torna a via mais elegante de calibrar e a mais perigosa de errar, porque o valor de venda **não é escolhido, é derivado** da taxa de reinvestimento.

---

## Decisões travadas

| Regra | Decisão |
|---|---|
Venda | **só coins** |
Preço de compra do cacto | **um pouco difícil** — é o que decide entre arrancar do armazém (grátis, lento) ou comprar (rápido, caro). Os dois caminhos ficam viáveis |
Expansão sem comprar | ✅ tirar do armazém para plantar. **É o coração da via** |
Item cacto em recompensa | ✅ **raro**, em crate/caixa/evento, para montar a farm aos poucos |
Torre automática | `GarnixCactusTowers` — item **raro** que ergue uma torre 3×3 de 4 andares pronta |
Autosell | **só cash** + drop raro. Reprecificar de 1.000–3.000 para **150–800/nível** |

---

## ⚠️ O alvo de paridade — e por que ele NÃO fecha com o config atual

Eu tinha escrito aqui que a farm dobra a cada 8h e que isso, sozinho, dá a curva de tiers "sem precisar tocar no `sell-price`". **Está errado, e o dono deu os números que provam.**

### O teto físico da farm

> *"Tem jogadores que fazem farm de cacto da bedrock até o céu... pode repensar em **25.000~40.000 cactos por plot no máximo**, e para jogadores que não fazem tanto pode estimar 5.000~15.000."*

Então a farm cresce de ~100 no dia 1 para ~30.000 no dia 20. São **~300×** de crescimento, ou **2,5 ordens de grandeza**.

### O que a curva de tiers pede

`6,61¹⁹ = 3,8×10¹⁵` — **15,6 ordens de grandeza.**

| | ordens de grandeza |
|---|---|
O que o tamanho da farm entrega | **2,5** |
O que a curva de tiers pede | **15,6** |
| **falta** | **13,1** |

**O tamanho da farm não pode carregar a via.** Um `sell-price` fixo faz o cacto ser relevante nos primeiros dias e virar pó a partir do dia 4 — o oposto de "bem páreo com spawners, máquinas, mineração e fazenda".

### O que o plugin oferece hoje, e por que não basta

Lido em `SellService.java:50-65`:

```java
base = sellPrice × amount
bonus = getSellBonus(player) + (booster.getMultiplier() − 1.0)
valor = base × (1 + bonus)
```

| Alavanca | Existe? | Serve? |
|---|---|---|
`sell-price` por tipo de plantação | ✅ | ❌ é **um valor fixo**, e `FarmType` só tem `CACTUS` (adicionar tipo exige código) |
`warehouse.sellbonus.<percent>` — nó de permissão, maior vence | ✅ | ⚠️ **aritmeticamente sim, na prática não** — ver abaixo |
Booster do armazém | ✅ | ❌ é temporário, não é escada |

O nó de permissão **funcionaria numericamente**: `Double.parseDouble` engole `warehouse.sellbonus.1280000000000000`. Mas ele é **aditivo**, e aí:

> Com o bônus em 1,28×10¹⁵, somar um booster 2× acrescenta `+1.0` a 10¹⁵. **O booster do armazém e o bônus de VIP passam a valer exatamente zero na via do cacto.**

Ou seja: dá para fazer a via escalar, ao preço de matar dois sistemas nela. Não vale.

### ❌ A saída que foi tentada e REVERTIDA: C13

> **06/08/2026 — o `warehouse.sellmult` foi removido do código e dos 20 ranks, por decisão do dono.** *"Ele me dá arrepios, é melhor deixar sem."*
>
> Três coisas pesaram, e as duas primeiras são o que o dono sentiu antes de eu medir:
>
> 1. **Era o único multiplicador do servidor.** Todo o resto soma percentuais num bloco aditivo. Subir do rank 18 para o 19 multiplicava a renda da via por **4,89× de uma vez** — nenhum outro sistema dá um salto assim.
> 2. **Acoplava os dois eixos com seis ordens de grandeza.** A Lei 1 diz que coins e cabeças são independentes. O `mining.bonus` respeita isso (rank 1→20 vale 1,20×); o `sellmult` valia **1.616.000×**.
> 3. **E ainda assim era insuficiente.** Medido: o alvo de 15% pede `3,84×10¹⁵` do dia 1 ao dia 20; a via entregava `plot 300× × sellmult 1,62×10⁶ = 4,85×10⁸`. **Faltavam 7,9×10⁶.** Um número que parece absurdo e está 8 milhões de vezes curto é sinal de que o alvo está errado, não o número.
>
> ⚠️ **Junto veio um bug real:** o topo da escada (`warehouse.sellmult.1616000`) era concedido pelos ranks 19 e 20 e **nunca removido** — nem por rank (não há rank depois dele), nem pelo reset de prestígio. Quem prestigiasse voltava ao rank 1 carregando 1.616.000× **para sempre**.
>
> **A consequência assumida:** a via do cacto passa a ser limitada pelo tamanho do plot (**2,5 ordens**) contra as 15,6 da curva de tiers. Ela rende nos primeiros dias e satura — os **15% da renda diária** que ela carregava precisam de outro dono, ou a via precisa de outro desenho. Quem for calibrar parte disso, e **não** tenta recolocar a amplitude num multiplicador.

### ✅ A saída adotada: o `sell-price` é uma alavanca VIVA, ajustada por update

✅ **Decisão do dono (06/08/2026):** *"o cacto eu vou reajustando com updates conforme necessário, então ele vai começar nesse valor e eu vou subindo ao decorrer do servidor com buff"*.

As 13 ordens de grandeza que faltam **saem da mão do operador**, não de um mecanismo. Um número só (`farms.CACTUS.sell-price`), sob controle direto, sem acoplar ao rank, sem nó de permissão e sem reset de prestígio para dar errado.

**A régua do buff** — derivada de `renda(d) × 0,15 / 24 ÷ colheita/h(d)`, com a farm crescendo de 100 blocos no dia 1 para 30.000 no dia 20:

| Dia | Farm (blocos) | Cactos/h | Alvo coins/h | `sell-price` |
|---|---|---|---|---|
| 1 | 100 | 4,70×10³ | 2,34×10³ | **0.499** |
| 3 | 182 | 8,57×10³ | 1,02×10⁵ | 11.95 |
| 5 | 332 | 1,56×10⁴ | 4,47×10⁶ | 286.5 |
| 7 | 606 | 2,85×10⁴ | 1,95×10⁸ | 6.867 |
| 10 | 1.491 | 7,01×10⁴ | 5,65×10¹⁰ | 8,06×10⁵ |
| 13 | 3.669 | 1,72×10⁵ | 1,63×10¹³ | 9,46×10⁷ |
| 16 | 9.029 | 4,24×10⁵ | 4,71×10¹⁵ | 1,11×10¹⁰ |
| 20 | 30.000 | 1,41×10⁶ | 8,99×10¹⁸ | **6,38×10¹²** |

**Cadência × tamanho do buff** — o total é 1,28×10¹³, então:

| Buffar | Vezes | Cada buff |
|---|---|---|
| **todo dia** | 19 | **4,90×** |
| a cada 2 dias | 9 | 28,6× |
| a cada 3 dias | 6 | 153× |
| a cada 5 dias | 3 | 2,34×10⁴ |
| a cada 7 dias | 2 | 3,58×10⁶ |

⚠️ **4,90× por dia é a MESMA razão que o `sellmult` usava** (4,89× a cada 2 ranks). O trabalho não mudou de tamanho — mudou de dono.

### ✅ Estocar antes do buff NÃO é exploit — medido

O `sell-price` vale na hora da venda, então a suspeita óbvia é bancar cacto antes de um buff. Não fecha:

```
limite inicial do armazém .... 3.000 cactos
colheita no dia 20 ........... 1,41×10⁶ por hora
tempo para encher ............ 7,6 SEGUNDOS
```

O estoque máximo é irrisório perto da colheita: o ganho de segurar um dia inteiro antes de um buff de 4,9× é **0,007% de uma diária**. Ruído.

### 🚩 E é a mesma medição que levanta a suspeita sobre o armazém

Se o armazém enche em 7,6 segundos, a leitura óbvia é que ele deixou de ser freio e virou parede. Mesmo com o autosell no melhor nível:

```
autosell a 10s, colheita entre duas vendas (dia 20) .... 3.917 cactos
limite do armazém ..................................... 3.000
perda .................................................  23%
```

### ✅ Lido no código, ele NÃO é parede — é sink

`AutoSellTask.runFor` chama `sellAll(warehouse, ...)`: o ciclo esvazia o armazém **inteiro**, não um lote. Então:

> **perda = 0 sempre que `limite ≥ taxa × intervalo`.**

Com o `initial-limit: 3000` e o intervalo padrão de 20s, o armazém aguenta uma farm de **~11.000 cactos sem perder nada**. Acima disso o jogador compra limite — que é exatamente o desenho de um sink, não de um teto. **O `initial-limit` fica como está.**

Dois detalhes do código que valem registro:

| Onde | O quê |
|---|---|
`AutoSellTask.tick` | só roda para jogadores **online** — a conta AFK precisa estar conectada |
`FarmListener.handleGrow` | cancela o crescimento **mesmo com o armazém cheio**, então a perda é real e silenciosa |

### ⚠️ O que estava de fato quebrado: o autosell premium estava dominado

Limite e intervalo são **substitutos** — dá para zerar a perda subindo um ou baixando o outro. E o limite tinha a rota mais barata até dentro da mesma moeda:

| Caminho | Custo | Efeito no dia 20 |
|---|---|---|
Os 5 upgrades de velocidade (20s → 10s) | **10.000 cash** | poupa 3.917 de limite |
Comprar esses 3.917 de limite no cash-shop | **6.400 cash** (8× 500 por 800) | idêntico |

Ninguém que fizesse a conta compraria velocidade. ✅ **Aplicado em 06/08/2026:** a escada foi para **150 / 275 / 400 / 550 / 800** (total 2.175). Isso conserta as duas coisas de uma vez — o upgrade volta a ser mais barato que o limite equivalente, e um free que guarde os 400 cash da temporada compra o primeiro nível, quando antes não alcançava nem o mais barato.

---

O que segue abaixo é o registro de como o C13 foi desenhado, mantido porque a análise do problema continua válida — só a solução foi descartada.

### A saída: C13

Uma escada **multiplicativa**, exatamente no formato do C2 que você já aprovou para o Farm — e pelo mesmo motivo, que é o mesmo problema:

| | Farm (C2) | Cacto (C13) |
|---|---|---|
O que limitava | 4 tipos de plantação (teto da 1.8) | tamanho do plot |
Ordens disponíveis | 3,4 | 2,5 |
Ordens necessárias | 19 | 15,6 |
Solução | `payout-multiplier` por nível | `sell-multiplier` por permissão |

**Spec do C13** — `garnix-warehouse`, ~15 linhas:

```java
// SellService.computeValue
BigDecimal base = farm.getSellPrice()
    .multiply(amount)
    .multiply(sellMultiplier(player));   // ← novo, MULTIPLICATIVO

// nó `warehouse.sellmult.<N>`, o maior vence — mesmo idioma de
// `mining.bonus.<N>` e `warehouse.sellbonus.<N>`, que já existem
```

Por que nó de permissão e não dependência do RankUP: **zero acoplamento novo entre plugins**. O nó é concedido em `GarnixRankUP/ranks/*.yml → commands`, junto com `spawner.buy.*` e `machines.buy.*`, que já estão lá.

E porque é **multiplicativo**, o `sellbonus` aditivo e o booster continuam valendo integralmente:

```
valor = sell-price × quantidade × sellMult × (1 + sellBonus + booster)
```

⏳ **Sem o C13**, a via do cacto fica limitada a ~2,5 ordens e satura no dia 4. A alternativa sem código é usar o `sellbonus` aditivo e aceitar que boosters e VIP não funcionem no cacto.

---

## ✅ O `sell-price` base — âncora nova em 06/08/2026

> **Decisão do dono:** *"o que ele ganha minerando em 5 minutos na mina ou na fazenda ele tem que ganhar em 1 minuto com uma farm de cacto básica, coisa de 20 andares"*.

A âncora antiga era `renda(1) × 0,15 / 24 ÷ colheita/h` e dava **0,499**. A nova compara a via com a renda ATIVA:

```
renda ativa da mina no dia 1 ...... 69.444 coins/h = 1.157 coins/min
5 minutos de mina ................. 5.787 coins
alvo: isso em 1 minuto ............ 347.222 coins/h
farm de 20 andares ................ 180 pontas × 140,6 = 25.313 cactos/h
sell-price ........................ 13,68        (27,4× o anterior)
```

O motivo de o valor unitário ser tão alto **é a lentidão, não exagero**: a mina entrega ~70.000 blocos/h contra 25.313 cactos/h, e cada ponta solta uma unidade a cada 25,6 s. O cacto vale ~14× o bloco de minério porque sai ~14× mais devagar por unidade de renda.

### ✅ E os 141 cactos/h por ponta deixaram de ser estimativa

O dono passou os dois parâmetros do servidor, e eles **derivam** o número em vez de estimá-lo:

```
gamerule randomTickSpeed ......... 8
spigot.yml growth.cactus-modifier  20000   (PandaSpigot 1.8)

random ticks por bloco = 20 ticks/s × 8 / 4096 blocos da seção
                       = 0,0390625/s  =  1 a cada 25,6 s
o cacto pede 16 estágios de `age`, e o modifier de 200× estoura os 16 num
único random tick — ou seja SATURA.
→ 3600 × 0,0390625 = 140,6 cactos/h por ponta
```

| | |
|---|---|
⚠️ O modifier está **12,5× além do necessário** | **1600 já satura.** Acima disso o gargalo é o random tick e subir o número não acelera nada |
⚠️ A única alavanca real de velocidade é o `randomTickSpeed` | e ele é **global** — acelera junto trigo, cenoura, fogo, gelo e folhas. Não há como acelerar só o cacto por config |

O **M2 vira confirmação, não descoberta**. Se ainda assim a taxa medida for k× esta, o `sell-price` divide por k e nada mais muda — ele é razão pura.

### 🚩 O que a âncora nova expõe: a renda da via passou a ser decidida pelo autosell

| Farm de 20 andares, `sell-price` 13,68 | Cactos/dia | Coins/dia |
|---|---|---|
Sem autosell (~3 coletas manuais) | 9.000 | 123.000 — 33% da diária |
**Com autosell** | 609.120 | **8.333.000 — 22× a renda diária da casa** |

**O autosell multiplica a via por 68×.** Um item de **250 de cash** virou, de longe, a maior alavanca do servidor — ele deixou de ser "conveniência que remove desperdício". Enquanto isso não for resolvido (teto por ciclo, teto diário, ou reescrita da tabela de tiers), este é o maior risco aberto da economia.

O reinvestimento continua sendo a decisão interessante da via: **vender tudo faz a farm parar de crescer, plantar tudo não dá coins.** Só que agora ele governa o *ritmo de chegar ao teto do plot*, não a curva de valor.

---

## Os 4 freios da via

Nenhum deles é o preço de venda. É isso que faz a via ser controlável sem ser chata.

| # | Freio | Onde | Efeito |
|---|---|---|---|
**1** | **Limite do armazém** | `GarnixWarehouse/config.yml` → `initial-limit: 1500` | **é o gargalo real.** Armazém cheio = colheita perdida |
**2** | **Velocidade do autosell** | `autosell.default-interval: 20`, upgrades em cash | esvazia o armazém automaticamente, ou seja **contorna o freio nº 1**. É por isso que é legitimamente premium |
**3** | **Espaço do plot** | tamanho do terreno | **teto físico absoluto** da via |
**4** | **Raridade da torre e do item cacto** | `GarnixCactusTowers`, tabelas de loot | decide se o crescimento é linear (plantar à mão) ou salta |

### Por que o autosell é o produto premium correto

Ele não aumenta o valor do cacto nem a velocidade de crescimento. Ele **remove uma perda**: sem autosell, o armazém enche e a colheita além do limite é jogada fora. É conveniência pura convertida em renda, o que faz dele um item de site honesto — quem não paga não fica sem a via, fica com desperdício.

E é por isso que reprecificar importa: hoje os 5 níveis custam **1.000–3.000 cash** (total 10.000) e um free acumula **400** na temporada. Ele não compra **nem o mais barato** — na prática a via inteira é pay-only sem rota. Com **150–800/nível**, um free que guarde a temporada compra 1 nível, um free vinculado e ativo em eventos chega a 2, e o resto vem do site ou do drop raro.

---

## Onde a via se conecta ao resto

| Sistema | Conexão |
|---|---|
`GarnixCactusTowers` | o item que salta várias horas de trabalho manual. **Raro** |
`GarnixWarehouse` | armazém, limite, autosell, booster de venda |
Conta AFK 1 | no modelo de 3 contas, é a conta que fica na **pesca + torre de cacto** |
Máquinas | a **Máquina de Combustível** e as de moeda secundária não competem com o cacto; a de **Chaves** sim, indiretamente |
Booster de armazém | `items/booster.yml` — **+200% aditivo**, mesma tabela dos outros 6 boosters |

---

## A abrir

| # | Item | Depende de |
|---|---|---|
1 | `sell-price` do cacto | **V5** — cactos por colheita e intervalo real |
2 | ~~Preço de compra do cacto~~ | ✅ **6.000 → 35.000** em 06/08/2026 (30 min de renda ativa no dia 1) |
3 | Taxa de drop do item cacto e da torre | tabelas de loot da Fase 5 |
4 | ~~Preço dos 5 níveis de autosell~~ | ✅ **150 / 275 / 400 / 550 / 800** em 06/08/2026 |
5 | Posição da via na tabela de tiers | qual tier a farm de cacto "vale" em cada dia |

---

## Nota de auditoria

`GarnixWarehouse` tem 3 itens ativáveis. **Dois já têm rota; um continua sem:**

| Item | Efeito | Rota hoje |
|---|---|---|
`items/limit.yml` | +N de limite do armazém | ✅ loja da pesca (500/1.500/3.000), cash-shop (500), crates e bosses |
`items/booster.yml` | booster de venda de cacto | ✅ cash-shop e Caixa Boosters |
`items/autosell.yml` | desbloqueia o autosell | ⚠️ só cash-shop (250) — **sem rota in-game nenhuma** |

### ✅ A rota de loot do cacto e da torre — aplicada em 06/08/2026

As duas linhas de "✅ raro em recompensa" das decisões travadas lá em cima passaram a existir. A escada de facilidade é **decisão do dono**, e a crate da via é o degrau mais difícil de todos:

| Onde | Cacto | Torre de 5 andares |
|---|---|---|
Crate VIP | 0,15 | — |
Crate RankUP | — | 0,35 |
**Crate Farm** 🆕 | **0,05** | **0,10** |
**Caixa Farm [Tier I]** 🆕 | **0,75** | **0,50** |
**Caixa Farm [Tier II]** 🆕 | **1,00** | **0,75** |

As caixas parecem generosas ao lado da crate, mas o gate delas é a própria caixa: a Caixa Farm I sai da crate a 0,3 de peso, então tirar cacto por essa rota é **22× menos provável** do que tirá-lo direto da crate. É o que sustenta o *"não é para sair distribuindo muito"*.

⚠️ **A família CACTO quebra a grade única das caixas Tier I e Tier II**, e é a única exceção legítima — cacto só existe nesta via, então mineração e pesca não têm o que espelhar. O peso saiu dos **boosters** nas duas caixas (6,5 → 5,25 na I, 7 → 5,25 na II) e do **combustível** na crate (10,45 → 10,30). As demais famílias seguem idênticas nas três caixas.

⚠️ **É de propósito que na crate eles sejam mais raros que o jackpot**, apesar de valerem menos: a via é reinvestimento composto, então quem recebe cacto de graça não ganha o valor do cacto, ganha a rampa que ele gera.

### A rota do autosell — existe, e é a mais estreita do servidor

Ao contrário do que esta nota dizia antes, `items/autosell.yml` **não é pay-only**: a Venda Automática é um prêmio da **Caixa Garnix**, a 0,5 na faixa RARISSIMO+. O arquivo dela registra que isso foi deliberado — *"é o único jeito de conseguir o item fora do site"*, com os 0,5 tirados das duas máquinas de limite (19,5 → 19,25 cada).

O que torna a rota estreita é o gate da caixa, não o peso dentro dela:

```
Caixa Garnix por abate do Devorador ......... 0,15%
Venda Automática dentro da caixa ............ 0,50%
composto .................................... 0,00075% por abate
```

A Caixa Garnix é a única do servidor que **só** sai do Devorador (ou custa 15.000 cash). Então a rota in-game existe no papel e é, na prática, uma loteria — o que é coerente com o autosell ser o produto premium correto da via, mas vale saber que "tem rota" aqui não significa "é alcançável".
