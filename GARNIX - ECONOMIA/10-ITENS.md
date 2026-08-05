# 10 — ITENS ATIVÁVEIS

Especificação de **todo item que vai para o inventário do jogador** e tem efeito ativável ou consumível.

**A lei:** nenhum item ativável existe sem **rota** e sem **preço**. Se um item não deve chegar ao jogador, ele **sai do config** — não fica como comando de admin. Item de admin sem preço é exatamente como economias de servidor vazam.

Última atualização: **30/07/2026** (Fase 4b)

---

## Estado atual

| Métrica | No começo | **Agora** |
|---|---|---|
Itens ativáveis distintos | ~212 | ~214 (+ `ametista`, + a Máquina de Combustível) |
**Com rota e preço em config** | **6** | **~70** |
Sem rota nenhuma | ~162 (76%) | ~144 — e **cada um tem fase e canal definidos** |

**O que ganhou rota e preço até aqui:**

| | |
|---|---|
20 spawners | rank N + coins do tier N + **dracmas** (o portão de tempo) |
15 máquinas A–O | coins da banda · 3 por rank, 12 por prestígio |
7 máquinas especiais | `shop: false` — rota por loot/site, produção calibrada |
Vara de pesca | 10.000 coins (mantida) |
Coral-shop | 6 produtos, câmbio **1.100 corais = 1 de limite** |
Cacto | `sell-price` derivado + a escada `warehouse.sellmult` |
3 upgrades de planta | coins, nos níveis 60 / 150 / 240 |

As 6 rotas originais eram: vara de pesca (10.000 coins) · máquina de madeira (1.000 coins) · os 20 spawners (5B coins, idênticos) · limite de spawners (1.500 corais, o exploit 1:1) · a lâmina (`/lamina`, grátis) · a matadora inicial (`/matadora`, grátis).

### As 3 correntes quebradas

1. **Skins de topo → caixas → nada.** 8 skins que valem até **+65%** dizem "só sai de caixa". As 7 caixas retornam `NONE` 100% das vezes e as 6 crates só dão pedra e diamante de template.
2. **Combustível não é vendido em lugar nenhum.** Não existe preço de litro em nenhum arquivo — o uptime de máquina hoje é grátis (via admin) ou impossível. E `giveinfinitefuel` remove o sink de vez.
3. **Os 7 boosters não têm tabela.** Multiplicador e duração são **argumentos livres do comando** — um `2×` de 1h e um `100×` de 30 dias são o mesmo item de config. Não há o que precificar antes de criar a tabela.

---

## Como o preço é derivado

Nada é escolhido; tudo sai de uma fórmula ancorada em [02-TIERS.md](02-TIERS.md).

| Classe de item | Moeda | Fórmula |
|---|---|---|
**Consumível de throughput** (bombas, britadeira) | **gemas** | preço fixo em gemas; o limitador real é `max-simultaneous-per-player`, não o preço |
**Combustível comum** | coins | **`0,22 × produção da máquina por ciclo`** — 1 litro = 1 ciclo (`fuelRemaining--`) |
**Limite** (s.limite, m.limite, armazém) | coins **+ dracmas** | coins do tier + dracmas ≈ 1 dia de kill (é o portão de tempo) |
**Booster** | cash (site) / loot (in-game) | por faixa de raridade, ver §Boosters |
**Armadura, skin, livro** | **sem preço** | só caixa, forja e site. Não se compra com moeda de jogo |
**Renda passiva** (vaga de visitante, autosell) | cash / jackpot | nível Mítico− da escada de raridade |
**Conveniência** (fly, limpador, reset KDR) | coins | 1–3h de renda do tier — barato de propósito |

### Por que consumíveis de throughput ficam em gemas

Bomba e britadeira geram valor **exponencial** (blocos × valor do bloco), mas se fossem precificadas em coins, o preço estaria obsoleto em 2 dias. Em **gemas** o custo é real a temporada inteira, porque a renda de gemas tem **teto** (o cap da mina, ~6,1×10⁷ gemas/h) enquanto a de coins cresce 8×/dia para sempre.

E o freio de verdade não é o preço: é o `max-simultaneous-per-player: 5` das bombas e o `max 10` da britadeira, que já existem. O preço só evita spam gratuito no começo.

---

## Catálogo

### GarnixMining — 37 itens, o maior buraco

| Item | Efeito | Rota hoje | **Rota proposta** | Preço | Raridade | Teto |
|---|---|---|---|---|---|---|
`bombs.2x2` | esfera raio 2 (~33 blocos) | ❌ só `/mina givebomb` | loja de gemas + crate | gemas, banda baixa | Comum | throughput |
`bombs.4x4` | raio 4 (~268 blocos) | ❌ | loja de gemas + crate | gemas | Comum | throughput |
`bombs.6x6` | raio 6 (~905 blocos) | ❌ | loja de gemas, gate nível 30 | gemas | Raro | throughput |
`bombs.8x8` | raio 8 (~2.145 blocos) | ❌ | loja de gemas, gate nível 60 | gemas | Épico | throughput |
**`drill`** (Britadeira) | coluna inteira, 3×3 por nível, **10 simultâneas**, sem cooldown | ❌ só `/mina givedrill` | loja de gemas + crate | gemas, caro | Épico | **o maior throughput do jogo** |
`slot-item` (Vaga de Visitante) | +1 vaga, teto 5. Dono ganha 35% do XP + taxa até 40% | ❌ só `/mina givevaga` | **jackpot da caixa `garnix`** + VIP | não vendável | **Mítico −** | renda passiva |
`booster-icon` | 4 tipos: coins, gemas, xp, `both` | ❌ só admin | ver §Boosters | ver §Boosters | Épico/Lendário | **soma +200%** |
`forge-icon` (Forja) | consome 7 skins iguais → sobe um tier | ❌ só `/mina giveforge` | crate, faixa "Bom" | — | Raro | gate de skin |
`skins.yml` ×9 | +2%→+65% coins, +1%→+45% gemas | ❌ só `/mina giveskin` | forja (2–7) · caixa (8–10) · **site (8–10)** | — | Épico→Lendário | soma |
`armors/*/tier-*.yml` ×20 | +2%→+12% por peça | ❌ só `/mina givearmor` | **só caixa** — nunca no site | — | Raro→Lendário | soma |
`pickaxe-icon` | dada ao entrar na mina | ✅ automática | manter | grátis | — | — |
`hotbar.yml` | reset, report, sair | ✅ sessão | manter | grátis | — | — |

⚠️ **`givearmor <coleção>` entrega o set T-V inteiro num comando** — vale +48%. Restringir a permissão.

### GarnixFarm — 31 itens

Espelha a mineração. `booster-icon`, `forge-icon`, 9 skins (`pedra`→`marfim`), 20 peças de armadura — **todos sem rota**. Enxada é de sessão.

➕ **Criar a 10ª skin de farm** (≈+40%), para as 3 vias ficarem simétricas acima do teto de forja. Hoje farm tem 9 e mineração/pesca têm 10.

### GarnixFishing — 45 itens, e a **única** rota de compra real do repo

| Item | Efeito | Rota hoje | **Rota proposta** |
|---|---|---|---|
`rod` (Vara) | toda a progressão vive no NBT | ✅ **`price: 10000` coins** | manter, reprecificar ao tier |
`enchants.yml → *.book` ×15 | `speed` −1s a −5s · `luck` +15%→+100% · `double` 5%→40% | ❌ só `/pesca givebook` | corais (níveis 1–3) · caixa e site (4–5) |
`skins.yml` ×10 | `currency-bonus` 0→65 **e `max-weight` 3→130** | ❌ só `/pesca giveskin` | forja · caixa · site (as 3 últimas) |
`armors/*` ×20 | corais + xp (**sem chave `coins`**) | ❌ | só caixa |
`forge-item` | 7 skins iguais | ❌ | crate |
`booster-item` | xp, corais, `both` | ❌ | ver §Boosters |

🚩 **`max-weight` de 22 a 130 não desbloqueia nada hoje** — `rewards.yml` só usa pesos 1/1/2/4/8. São 40+ de headroom desperdiçado, e é exatamente onde as 20 recompensas de coins por tier vão morar (ver §5 do [01-ECONOMIA.md](01-ECONOMIA.md)).

🚩 **`shop.yml` tem 1 produto e ele é um exploit:** `spawner-limit: cost 1500 corais → spawner givelimite 1500`, conversão 1:1 do item score 1 do ranking. Substituir por 6–10 produtos com câmbio decrescente e teto.

### GarnixSpawners — 14 itens

| Item | Efeito | Rota hoje | **Rota proposta** |
|---|---|---|---|
`spawner-item` ×20 | o motor da via passiva | ✅ loja | **rank N + coins do tier N + dracmas** |
`head-item` ×20 | **a moeda do rankup** | ✅ do próprio spawner | manter — o gate é a produção |
`limit-item` | +N de `s.limite` | ✅ `/spawner givelimite` + loja de corais | coins + **dracmas**, e **precisa crescer na temporada** (ver vale de substituição) |
`sword.yml` (Lâmina) | o item base | ✅ `/lamina`, cooldown 30s | manter grátis |
`sword.yml → *.book` ×11 | `massacre` 1–5 (raio, **nível 5 = `-1` = infinito**) · **`pilhagem` 1–3 (×1,25/×1,5/×2,0 de drop)** · `ceifador` 1–3 (25/50/75% instakill) | ❌ só `/spawner givebook` | dracmas (níveis baixos) · **`pilhagem 3` e `massacre 5` = jackpot + site** |
`booster-items.yml → drops` | multiplicador de drop | ❌ só admin | ver §Boosters |
`booster-items.yml → heads` | multiplicador de cabeça | ❌ só admin | ⚠️ **cuidado: cabeça é o gate de tempo do rank.** Booster de cabeça acelera o eixo que não deveria acelerar com dinheiro. Recomendo **não vender no site** |

🚩 `booster-items.yml` — os dois tipos têm **material, data e display idênticos**: indistinguíveis no inventário. Diferenciar.

### GarnixMachines — 6 itens

| Item | Efeito | Rota hoje | **Rota proposta** |
|---|---|---|---|
`machines/WOOD.yml` | máquina de coins | ✅ `costs.coins: 1000` | vira a **máquina A**, preço do T2 |
`machines/CASH.yml` | `shop: false`, drops copiados de WOOD | ❌ só `/maquina give` | ou vira a **Máquina de Cash** orçada (3–8 cash/dia, 1 por conta), ou é renomeada com `currency-id: coins` explícito |
`fuels.yml → default` | **1 litro = 1 ciclo** (`fuelRemaining--`) | ❌ só `/maquina givefuel` | **loja em coins** a `0,22 × produção/ciclo` + faixa "Bom" da crate |
`fuels.yml → infinite` | zera o sink daquela máquina, movível, **ativo em 1 por vez** | ❌ só `/maquina giveinfinitefuel` | **site (faixa C/D)** + jackpot da caixa `garnix` | **Mítico — o item mais raro do servidor** |
`booster-item.yml` | drops | ❌ | ver §Boosters |
`limit-item.yml` | +N de `m.limite` | ❌ | coins + dracmas |

**Consumo de combustível, agora que sabemos a taxa:** 1 litro/ciclo × `delay 10s` = **360 litros/hora**, 8.640/dia por máquina. É o sink recorrente, e é isso que dá valor ao infinito.

### GarnixWarehouse — 3 itens

| Item | Efeito | Rota hoje | **Rota proposta** |
|---|---|---|---|
`items/autosell.yml` | **contorna o `initial-limit: 1500`**, que é o gargalo da via do cacto | ❌ só `/armazem giveautosell` | **só cash** + drop raro. Upgrades reprecificados de 1.000–3.000 para **150–800/nível** |
`items/limit.yml` | +N de limite do armazém | ❌ | coins + dracmas |
`items/booster.yml` | venda de cacto | ❌ | ver §Boosters |

### GarnixBosses — 7 itens

| Item | Efeito | Rota hoje | **Rota proposta** |
|---|---|---|---|
`boss-icon` ×3 (→5, →8) | invocável, **empilhável (`boss-stack-radius: 5`)** | ❌ nenhuma, nem admin documentado | **chave de boss** (~5% das aberturas de crate) → ~250–300/dia |
`swords.default` (Matadora Inicial) | 250 de dano | ✅ `/matadora` grátis | manter |
**`swords.bruta`** 🆕 | 500 | ❌ | **crate de boss, faixa rara** |
`swords.sombria` | 750 | ❌ só admin | ✅ jackpot da crate de boss + Caixas Bosses I e II |
`swords.ancestral` | 1500 | ❌ | ✅ Caixas Bosses I e II |
**`swords.runica`** 🆕 | 4000 | ❌ | ✅ **Caixa Bosses II** (exclusiva) |
**`swords.abissal`** 🆕 | 9000 | ❌ | ✅ **Caixa Bosses II** (exclusiva) |
**`swords.hk`** | **hit-kill — mata qualquer boss em 1 golpe** | ❌ | **site (faixa D)** + jackpot da Caixa Garnix | **Mítico −** |
`kill-stack-item` | sobe o nível da matadora, nível ilimitado no comando | ❌ | ✅ Caixas Bosses I e II + **abate de Arauto, Titã e Devorador** |

⚠️ **Matadora não cai de boss** (05/08/2026, decisão do dono): a escada inteira de espada fica na Caixa Bosses I/II e na crate. Do abate sai o **Livro de Kill-Stack**, que só tem valor para quem já mata boss. Ver [15-LOOT.md §3](15-LOOT.md).

### GarnixCrates — 3 itens + as 6 chaves

| Chave | Rota | Volume/dia |
|---|---|---|
`mineracao` | ✅ encante `blessed` em **bloco manual** (C7) | ~2.760 |
`fazenda` | ✅ encante `clover` em colheita manual | ~1.500 |
`pesca` | ✅ recompensa `treasure` | médio |
`bosses` | ✅ **~5% das aberturas** + OnTime | ~250 |
**`vip`** | ❌ nenhuma hoje → **toda ativação de VIP entrega para TODOS os online** | por vendas |
**`rankup`** | ✅ ao dar rankup | **baixo de propósito** — é a chave de melhor conteúdo por abertura |

`robots.yml → lendarioI` — abre a cada 4s. ❌ só `/crates giverobot`. **Rota proposta:** site + jackpot. 🚩 A lore promete `Chance em raras: ×2.0` mas o arquivo **não tem `boost-threshold` nem `boost-multiplier`** — a lore mente. Criar tiers de robô usando o rate-up documentado em `robots/example.yml`.

`upgrades.yml` — escada de aberturas por clique (20→500). ✅ tem preço em coins. **Expandir além de 500**: com ~4.800 chaves/dia, 500 por clique ainda são 10 cliques.

### GarnixMysteryBoxes — 7 caixas, 0 recompensas

| Caixa | Rota | Conteúdo |
|---|---|---|
`mineracao-i` · `farm-i` · `pesca-i` | in-game, acessível | armadura T-I a T-III · skins forjáveis 2–6 · livros classe A/B |
`mineracao-ii` · `farm-ii` · `pesca-ii` | ✅ **site** + in-game beeem raro | piso mais alto, menos azar: armadura T-III a T-V · skins 6–8 · livros classe C/D |
**`garnix`** | jackpot + site | combustível infinito · matadora hk · `pilhagem 3` · vaga de visitante · máquinas especiais · skins de topo |

**As caixas são o faucet de armadura e skin do servidor** — é elas que fecham a corrente quebrada nº 1.

### GarnixFragments — sistema aberto

3 tipos hoje (`fogo`, `gelo`, `natureza`), nomes **fictícios**, quantidade livre, **zero faucet**. Recomendação de projeto: **um fragmento por fonte** (boss, evento, caixa, PvP), não um por tema — assim o custo multi-fragmento exige tocar em vários sistemas. Ver a seção de fragmentos no [00-PLANO.md](00-PLANO.md).

### Diversos — 1 por plugin

| Item | Plugin | Efeito | Rota proposta |
|---|---|---|---|
`chest.activator-item` | GarnixChests | +1 baú virtual (teto 10) | coins, barato. Expansão de linhas já tem preço (10k/25k/50k) |
`reset-kdr-item` | GarnixClans | zera abates/mortes | coins, 1–3h de renda |
`item` (Torre de Cacto) | GarnixCactusTowers | ergue torre 3×3 de 4 andares pronta | **raro** em crate/caixa + site |
`item` (Limpador de Terreno) | GarnixClearPlot | limpa o terreno inteiro | coins, conveniência |
`temporary-fly-item` | GarnixEssentials | fly por tempo | cash (faixa A) + crate |
`paper-vip` | GarnixVips | ativa VIP por tempo | **site** — é o produto |
`setup.wand-item` | GarnixEvents | seleção de área | admin, **não econômico** |
`captcha.items` | GarnixCore | ícones de menu 3×3 | **não é item de inventário** |

### Kits — ⛔ eu não edito

Os kits entregam **chaves de crate** e os itens estão em base64. **O dono configura à mão no jogo.** Meu entregável é só a especificação:

| Kit | Chave | Quantidade | Cooldown |
|---|---|---|---|
Kit do rank N (1–20) | chave da crate da banda do tier N | _(a definir)_ | 6h |
Kits de marco (5, 10, 15, 20) | + **1 caixa misteriosa** | 1 | 6h |
Kits VIP | chave premium + caixa | _(a definir)_ | diário/semanal/mensal |

**Números a orçar contra:** kits são **cumulativos** e as 3 contas coletam em paralelo → **240 resgates/dia** no endgame. A crate está calibrada para ~4.800 aberturas/dia, então a chave de kit é uma fatia de 5% desse volume.

---

## Boosters — a tabela definitiva

⚠️ **Ela não pode morar num `.yml`.** Os arquivos de booster (`GarnixMachines/booster-item.yml`, `GarnixSpawners/booster-items.yml`, e os blocos `booster-icon:` dos outros) são **só templates de item**: `{multiplier}` e `{duration}` são placeholders preenchidos pelos **argumentos do comando**. Não existe schema onde declarar valores permitidos.

Então a tabela é uma **convenção**, e ela vale porque só estas combinações são emitidas — pelas tabelas de loot (Fase 5) e pelas lojas (Fase 7). Nenhuma outra existe no servidor.

### Os 7 sistemas e o comando exato de cada um

| # | Sistema | Comando | Tipos |
|---|---|---|---|
1 | Mineração | `/mina givebooster <jogador> <tipo> <mult> <dur> [qtd]` | `coins` · `gemas` · `xp` · `both` |
2 | Fazenda | `/fazenda givebooster <jogador> <tipo> <mult> <dur> [qtd]` | `coins` · `sementes` · `xp` · `both` |
3 | Pesca | `/pesca givebooster <jogador> <tipo> <mult> <dur> [qtd]` | `xp` · `corais` · `both` |
4–5 | Spawners | `/spawner givebooster <jogador> <tipo> <mult> <dur> [qtd]` | `DROPS` · `HEADS` |
6 | Máquinas | `/maquina givebooster <jogador> <mult> <dur> [qtd]` | tipo único |
7 | Armazém | `/armazem givebooster <jogador> <mult> <dur> [qtd]` | tipo único |

### ⚠️ O mesmo booster não vale o mesmo em toda via

Isto é o que mais importa na hora de precificar, e só apareceu lendo o código:

| Via | Como o booster entra | Um 3× vale |
|---|---|---|
Mineração · Fazenda · Pesca | **SOMA** no bloco aditivo (`+200%` dentro do `1 + Σ`) | ~2,2× na prática, porque divide o bloco com skin, armadura e permBonus |
**Spawners · Máquinas** | **MULTIPLICA** (`total.multiply(boosterMultiplier)`) | **exatamente 3×** |
Armazém (cacto) | SOMA, junto com o `sellbonus` | ~depende do `sellmult`, que é multiplicativo e fica fora |

> **Um booster de spawner/máquina é ~1,4× mais forte que o mesmo booster de mineração.** Ele tem que ser proporcionalmente mais raro nas tabelas de loot, ou vira o item mais eficiente do servidor sem ninguém ter decidido isso.

### As combinações permitidas — e nenhuma outra

✅ **Decisão do dono:** *"boosters do site serão vendidos 3× de 1h apenas"* · *"no jogo não vai ter booster de 2× 1h, e de 3× no jogo só terá de 5m e 10m"*.

| Multiplicador | Durações in-game | Site |
|---|---|---|
**2×** | **5m · 10m · 15m · 30m** | não vendido |
**3×** | **5m · 10m** (só jackpot) | **1h — e só isso** |

São **6 combinações in-game** e **1 no site**, × 7 sistemas = **49 itens de booster distintos**.

⚠️ **Estes números são do ITEM — não são teto de duração.** Confirmado em `Booster.java:93-105`:

```java
canStackWith(other)  ->  mesmo provider  E  mesmo multiplicador
extend(millis)       ->  expiresAt += millis        // sem teto
```

> **Dois boosters do mesmo multiplicador SOMAM tempo, indefinidamente.** 24 boosters de 3× 1h dão 24 horas de 3×. Multiplicadores diferentes **não** empilham — um 2× e um 3× do mesmo provider conflitam.

Ou seja: **o multiplicador tem teto (3×), a duração não.** O que limita o tempo de booster de um jogador é a **oferta** — quantos ele consegue no loot ou compra no site — e é aí que o balanceamento mora, não numa trava de duração.

**A separação é limpa e sem paywall:** a força máxima (3×) existe nos dois lados; o que o site vende é **densidade de tempo por item** — 1h contra os 10 minutos do jackpot in-game, ou seja **6× menos itens para o mesmo tempo ligado**.

### 🚩 Isto muda como TODA a economia é calibrada

Como a duração acumula, o booster **não é inerentemente uma rajada** — ele é rajada para quem depende do loot e pode ser permanente para quem compra. Então:

> Se a escada de valor de uma via for calibrada para atingir o alvo **com** o booster ligado, o jogador que não tem booster fica **abaixo do alvo o tempo todo** — e o alvo do tier passa a descrever o pagante, não o jogador normal.

E era exatamente o que a mineração e os spawners faziam. **A regra que unifica as 6 vias:**

| | |
|---|---|
**Teto de pico** | **100×** em toda via — o invariante que já estava no plano |
**Onde a escada é calibrada** | no **SUSTENTADO**: tudo que o jogador tem permanentemente, **sem o booster** |

Assim o alvo do tier descreve o **jogador normal**, e o booster é upside puro — de 1,35× a 3× conforme a via, para quem tem oferta.

**Mecânica que já existe e não precisa de código:** 3 slots simultâneos (1 por tipo, `slots: [11, 13, 15]`), mesmo tipo **estende duração** em vez de compor multiplicador, tipo diferente conflita, e remover antes de 30s devolve item valendo 50% do tempo restante.

**Mecânica que já existe e não precisa de código:** 3 slots simultâneos (1 por tipo, `slots: [11, 13, 15]`), mesmo tipo **estende duração** em vez de compor multiplicador, tipo diferente conflita, e remover antes de 30s devolve item valendo 50% do tempo restante.

---

## Lista A — itens sem rota, e onde cada um fecha

### ⚠️ A descoberta da Fase 4b: quase nenhum destes itens tem onde receber um preço

Eu tinha escrito que a lista A "volta vazia ao fim da Fase 4b". **Não volta, e não é por falta de trabalho** — é porque a maioria destes itens **não tem campo de custo no próprio config**. `bombs.yml` e o bloco `drill:` são definições de item puras: material, lore, raio, cooldown. Nenhum campo de preço. O mesmo vale para armaduras, skins, livros e matadoras.

Ou seja: **"dar preço a um item" quase nunca é editar o arquivo do item.** É criar a linha que o entrega, e essa linha mora em outro lugar:

| Onde a rota mora | Fase | Itens |
|---|---|---|
tabela de **loot** (crate, caixa, boss, ontime, daily) | **5** | armadura, skin, livro, forja, booster, fragmento, chave, robô |
entrada de **loja** (coins-shop, cash-shop) | **7** | bomba, britadeira, combustível, conveniência, papel VIP, máquinas especiais |
**config do próprio item** | ✅ feito | spawner, máquina A–O, vara, limite de spawner/máquina, cacto |

Por isso a Fase 4b entrega **a especificação completa** — classe, moeda, fórmula, raridade e canal de cada item — e as Fases 5 e 7 escrevem as linhas. Inverter essa ordem é que seria errado: não dá para decidir o que cai numa crate antes de saber o que existe.

### O catálogo, por fase que fecha

| # | Grupo | Qtd | Fecha em | Canal |
|---|---|---|---|---|
1 | Bombas (4 tiers) | 4 | **7** | coins-shop, em **gemas** |
2 | Britadeira | 1 | **7** | coins-shop, em **gemas** |
3 | Vaga de Visitante | 1 | **5** | jackpot da caixa `garnix` (Mítico−) |
4 | Boosters | 8 combinações × 7 sistemas | **5** e **7** | 2× e 3×-curto in-game · 3×-longo no site |
5 | Forjas de skin (3) | 3 | **5** | faixa "Bom" da crate |
6 | Skins (10 × 3 vias) | 30 | **5** | forja até a 7ª · caixa nas 3 últimas · site nas 3 mais raras |
7 | Armaduras (3 × 4 × 5) | 60 | **5** | **só caixa. Nunca no site** |
8 | Livros de pesca (3 × 5) | 15 | **5** | caixa de pesca · níveis 4–5 no site |
9 | Livros da lâmina (11) | 11 | **5** | crate/boss · `pilhagem 3` e `massacre 5` no jackpot |
10 | Máquina de Cash | 1 | **7** | ✅ config pronto (`shop: false`) · falta o preço no site |
11 | Combustível comum · infinito | 2 | **7** | comum no coins-shop por banda · infinito no site + jackpot |
12 | Limite de armazém | 1 | **7** | coins + dracmas |
13 | Venda Automática | 1 | **7** | só cash (mantido caro, por decisão) |
14 | Bosses (5 + 3 engatilhados) | 8 | **5** | chave de boss na faixa "Raro" |
15 | Matadoras + kill-stack | 4 | **5** | `hk` no jackpot (Mítico−) |
16 | Chave VIP | 1 | **5** | todos os online a cada ativação de VIP |
17 | Robôs | 2 | **5** e **7** | site + jackpot · ⚠️ a lore mente (promete `×2.0` sem o campo existir) |
18 | Caixas misteriosas | 7 | **5** | I in-game · II site + raro · `garnix` no topo |
19 | Papel VIP | 1 | **7** | é o produto do site |
20 | Fragmentos | 3+ | **5** | um por fonte (boss, evento, caixa, PvP) |
21 | Ativador de baú · Reset KDR · Torre de Cacto · Limpador · Fly | 5 | **7** | coins, faixa de conveniência |

**Critério de conclusão, corrigido:** a lista A volta vazia **ao fim da Fase 7**, não da 4b. O controle continua mecânico — rodo a varredura do zero e comparo contagem com contagem. Se a segunda varredura achar um item que não está aqui, **este documento estava errado**, não o contrário.

### ✅ O que a Fase 4b fechou de fato

| | |
|---|---|
**A tabela de boosters** | 8 combinações in-game + 4 no site, com o comando exato dos 7 sistemas — era o item que bloqueava qualquer preço |
**A descoberta de que o booster não vale o mesmo em toda via** | multiplica em spawner/máquina, soma nas outras. Um 3× de spawner é ~1,4× mais forte que o mesmo de mineração e tem que ser proporcionalmente mais raro |
**A fórmula de preço de cada classe** | ver §Como o preço é derivado |
**O mapa de onde cada rota mora** | a tabela acima — é o que deixa as Fases 5 e 7 serem mecânicas |

---

## Lista B — efeito econômico sem custo definido

Ordenada por dano à economia, com a decisão já tomada.

| # | Item | Decisão |
|---|---|---|
1 | **Combustível Infinito** | Mítico, site faixa C/D + jackpot. O valor dele = o custo do comum |
2 | **Combustível comum** | preço = `0,22 × produção/ciclo`. 360 litros/h por máquina |
3 | **Britadeira** | gemas, caro. **Mantida com 10 simultâneas** — o teto real é o `reset-cooldown: 30` da mina |
4 | **Bombas ×4** | gemas. **Mantidas com 5 simultâneas** — mesmo teto |
5 | **Matadora Hit-Kill** | Mítico−, site faixa D. Teto real = oferta de chave de boss |
6 | **Livro Massacre 5** (`-1`) | Mítico−. **Mantido infinito** — teto real = taxa de spawn |
7 | **Livro Pilhagem 1–3** | ×2,0 no topo. Site faixa C + jackpot |
8 | **Boosters ×7** | ✅ tabela fechada: 8 combinações in-game + 4 no site. ⚠️ multiplica em spawner/máquina e soma nas outras |
9–11 | **Skins de topo** (8 nas 3 vias) | caixa + site (as 3 mais raras de cada) |
12 | **60 peças de armadura** | **só caixa. Nunca no site** |
13 | **3 Forjas de Skin** | crate, faixa "Bom" |
14 | **Limites** | ✅ spawner e máquina aplicados no coral-shop (1.100 corais = 1). Falta o do armazém |
15 | **Venda Automática** | só cash + drop raro |
16 | **Vaga de Visitante** | Mítico−, jackpot + VIP (VIP entrega no máx. 2 das 5) |
17 | **Papel VIP** | é o produto do site |
18 | **Kill-Stack** | crate de boss |
19 | **Robô** | site + jackpot. Corrigir a lore mentirosa |
20 | **Máquina de Cash** | ✅ aplicada: 2 cash/dia, ciclo de 432s, fora da loja de máquinas. ⚠️ o preço no site tem que ser MAIOR que o cash que ela produz na temporada, senão vira desconto na própria loja |
21 | **Chave VIP** | todos os online a cada ativação de VIP |
22 | **7 Caixas** | custo 0 **e** payload 0 → escrever as 7 tabelas |
23–28 | Ativador de baú · Torre de Cacto · Limpador · Fly · Fragmentos · Reset KDR | coins/cash, faixa de conveniência |

---

## Higiene de comandos de admin

**Por decisão do dono, `givehandall`, `giveall` e o `*` de `givekey`/`caixas give` ficam como estão.** O `*` na verdade é o **mecanismo** da chave VIP — só precisa ser disparado pelo `GarnixStoreActivation`, não digitado à mão.

Riscos registrados, não corrigidos:

| Comando | Risco |
|---|---|
`givehandall` | **clona o item da mão com NBT para todos os online** — duplicação em escala de skin, booster ou matadora hk |
`/crates givekey <crate> * <qtd>` · `/caixas give ... *` | entregam para todos os online; perigoso por engano |
`<moeda> give\|dar` (8 moedas) | um staff com `currencies.admin` pode criar cash do nada |
`givearmor <coleção>` | entrega o set T-V (+48%) num comando |
`/pesca giverod` | bypassa os 10.000 coins da vara |
`/spawner give <tipo> [stack]` | stack arbitrário, bypassa o preço |
`/heads set\|add` | **cabeças são a moeda do rankup** — é `give money` disfarçado |
`/darkit <kit>` | kit inteiro, ignorando cooldown |

**A corrigir de fato — divergência real de nome:** `config.yml` chama `/mina givevaga`, `messages.yml` chama `/mina giveslot`.

**Comandos econômicos que só aparecem em mensagem de sucesso e em nenhum `help`** (fáceis de perder numa auditoria, e incluem os dois itens Mítico−): `/bosses givesword`, `/bosses givekillstack`, `/spawner givebook`, `/fragmentos give`, `/darfly`, `/darkit`, `/clearplot give`.
