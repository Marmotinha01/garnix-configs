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

## O `sell-price` base

Depende de **uma** medição (M2 em [TESTES-IN-GAME.md](TESTES-IN-GAME.md)): quantos cactos por hora uma farm de tamanho conhecido colhe.

```
sell-price = renda(1) × 0,15 / 24 ÷ colheita_por_hora_no_dia_1
```

Minha estimativa a confirmar, a partir do `randomTickSpeed: 8` e do `growth.cactus-modifier: 20000` que você passou: cada ponta de cacto cresce a cada ~2 s, o que dá ~141 colheitas/h por coluna. Com colunas de 3, uma farm de 30.000 blocos tem 10.000 pontas → **1,41×10⁶ cactos/h**.

⚠️ **É exatamente o tipo de estimativa que já errei por 7× na mineração.** Por isso é uma constante única: quando o M2 chegar, se a taxa real for k× a minha, o `sell-price` divide por k e nada mais muda.

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
2 | Preço de compra do cacto | V5, e da decisão de quão "um pouco difícil" |
3 | Taxa de drop do item cacto e da torre | tabelas de loot da Fase 5 |
4 | Preço dos 5 níveis de autosell | faixa 150–800, a fechar na Fase 7 com o cash-shop |
5 | Posição da via na tabela de tiers | qual tier a farm de cacto "vale" em cada dia |

---

## Nota de auditoria

`GarnixWarehouse` tem 3 itens ativáveis e **os 3 estão sem rota** hoje:

| Item | Efeito | Rota hoje |
|---|---|---|
`items/autosell.yml` | desbloqueia o autosell | ❌ só `/armazem giveautosell` |
`items/limit.yml` | +N de limite do armazém | ❌ só `/armazem givelimititem` |
`items/booster.yml` | booster de venda de cacto | ❌ só `/armazem givebooster` |

E o `farms.CACTUS.sell-price: 10` com `currency: coins` é o único número econômico do plugin — fictício, a derivar. Ver [10-ITENS.md](10-ITENS.md).
