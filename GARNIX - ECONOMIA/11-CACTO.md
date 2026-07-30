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

## O alvo de paridade

A farm de um jogador dedicado deve **dobrar de tamanho a cada 8 horas** por reinvestimento.

```
3 dobras por dia  =  2³  =  8× por dia
```

Que é **exatamente a curva de tiers** ([02-TIERS.md](02-TIERS.md)), sem precisar tocar no `sell-price`.

**Portanto o `sell-price` é derivado, não escolhido.** O `sell-price: 10` de hoje é fictício. O valor certo sai desta conta:

```
cacto colhido por dia          = tamanho da farm × colheitas/dia
cacto necessário para dobrar   = tamanho da farm
sell-price                      = tal que a renda em coins pague o resto do dia
```

Ou seja: **o jogador reinveste ~1/3 do cacto colhido em expansão e vende os outros 2/3.** Se ele vender tudo, a farm para de crescer; se plantar tudo, não ganha coins. A decisão fica com ele, e é uma decisão interessante.

⚠️ **Números que dependem do teste V5:** quantos cactos caem por colheita, e qual o intervalo de crescimento real. Sem isso, o `sell-price` é chute.

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
