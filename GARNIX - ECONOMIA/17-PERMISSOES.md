# 17 — PERMISSÕES DE BÔNUS E DESCONTO

Onde mora cada vantagem numérica de rank, VIP e influencer — e o que **não está em lugar nenhum do repositório**.

Última atualização: **06/08/2026**

---

## 1. Um número por ator, igual em TODO sistema

✅ **Decisão do dono (06/08/2026):** *"TODOS OS RANKS devem ser seus valores em bonus IGUAIS em todos os sistemas, assim como os vips e os influencers. Se o vip X tem bonus de 20% na mina ele vai ter de 20% nos spawners e nas máquinas também e nos outros igualmente."*

Cada ator tem **um percentual só**, e ele vale nas **cinco** superfícies de bônus: mineração, fazenda, pesca, armazém e os drops de spawner/máquina.

| Ator | Desconto | **Bônus (nos cinco sistemas)** |
|---|---|---|
| `rank N` | — | **N%** — rank 2 = 2% … rank 20 = 20% |
| `celestial` · `miniyt` | 3% | **8%** |
| `imortal` · `yt` · `tiktoker` · `streamer` | 6% | **12%** |
| `supremo` | 10% | **16%** |
| `garnix` | 15% | **20%** |
| **`investidor`** | **20%** | **22%** |

**O investidor é o topo absoluto** — melhor que o garnix nos dois números, em todo sistema. Ele deixou de ser "parceria sem desconto": ganhou 20% de desconto (acima dos 15% do garnix) por decisão do dono.

**Os influenciadores são quatro grupos concretos, não um guarda-chuva.** `yt`, `tiktoker` e `streamer` valem um **imortal** (6% / 12%); `miniyt` vale um **celestial** (3% / 8%). Nenhum deles tem escada própria.

⚠️ **Não existe grupo `influencer` em bônus nem em desconto.** Havia uma entrada guarda-chuva nas três tabelas e ela foi **removida em 06/08/2026** por decisão do dono. Se reaparecer, é engano.

⚠️ **O rank subiu 1 ponto na tabela de spawner/máquina.** Ele estava desalinhado desde sempre: dava 1% no rank 2 ali contra 2% no nó `mining.bonus.2`. Agora os cinco batem.

⚠️ **`farm.bonus` e `warehouse.bonus` passaram a ser concedidos pelos 20 ranks** (06/08/2026). Antes não eram concedidos por ninguém, o que quebrava a regra: o rank 15 dava 15% na mina e na pesca, e 0% na fazenda e no armazém.

### ✅ O desconto do VIP nunca mais expira — desconto e bônus foram separados

Aplicar a regra do número único quebrava o desconto: na tabela de spawner e máquina, desconto e bônus viviam **no mesmo registro**, e o plugin devolvia **um registro só** — o de maior `discount + bonus`. Como as entradas de rank têm `discount: 0`, bastava o bônus do rank passar a soma do VIP para o jogador **perder o desconto que pagou**. Um celestial (3+8=11) no rank 12 (0+12=12) comprava pelo preço cheio, e o nó `vip.celestial` dele nem chegava a ser testado.

**Corrigido no código em 06/08/2026** — uma busca virou duas:

```java
getDiscountRank(player)  // a entrada de MAIOR discount que o jogador alcança
getBonusRank(player)     // a entrada de MAIOR bonus
```

Cada número vem de onde ele é maior e um não cancela o outro. O celestial no rank 12 leva **3% de desconto (do VIP) + 12% de bônus (do rank)**.

| Onde | Usa |
|---|---|
| `MobConfigManager` · `MachineConfigManager` | os dois métodos novos |
| `ShopMenu` (preço e lore) | `getDiscountRank` |
| `DropsMenu` (venda dos drops) | `getBonusRank` |
| `ShopConversation` (compra de máquina) | `getDiscountRank` |

⚠️ O `getRank(player)` antigo **continua existindo, mas só para exibir uma tag única**. Não use para calcular: somar `discount + bonus` trata os dois números como se fossem a mesma moeda, e eles não são — 3% de desconto numa compra não é comparável a 1% a mais na venda de drops. Era essa chave de ordenação que produzia o resultado errado.

### ⚠️ Nas quatro famílias de nó, o rank ULTRAPASSA o VIP — e isso é intencional

O rank vai até 20% e o maior nó vence. Então:

| Tier | Ganhos | Ultrapassado a partir do |
|---|---|---|
| celestial · miniyt | 8% | **rank 9** |
| imortal · yt · tiktoker · streamer | 12% | **rank 13** |
| supremo | 16% | **rank 17** |
| garnix | 20% | nunca é ultrapassado, mas **empata no rank 20** — e empate vale zero |
| investidor | 22% | nunca, e sobra +2 sobre o rank 20 |

Depois disso o nó do VIP é simplesmente ignorado nessas quatro vias. A única volta é o **prestígio**, que desfaz a escada de rank e devolve o jogador ao rank 1 — aí o nó do VIP volta a valer até ele subir de novo.

**Os tiers de influencer espelham um VIP pago, nunca têm escada própria** — decisão do dono. `yt`, `tiktoker` e `streamer` valem um **imortal**; `miniyt` vale um **celestial**. Como os valores são idênticos, ter dois desses grupos ao mesmo tempo não muda nada — que é o comportamento certo.

**Rank é só ganho, nunca desconto.** Desconto é a proposta de valor exclusiva do VIP.

| Rank | Nó | Ganho |
|---|---|---|
| 1 (`coelho`) | — | 0% |
| 2 (`porco`) → 20 (`wither`) | `<via>.bonus.2` … `.20` | **+1% por rank** |

---

## 2. TODA vantagem por permissão do servidor

Varredura completa do código (`grep` por `parseInt(name.substring(PREFIX` e `parseDouble(node.substring(PREFIX`). São **oito nós numéricos** e **três tabelas por `vip.<nome>`** — nada mais.

### Bônus de ganho — 4 nós

| Nó | O que multiplica | Tipo | Concedido hoje por |
|---|---|---|---|
| `mining.bonus.<N>` | payout da mineração | aditivo | ✅ ranks · VIP no LuckPerms |
| `farm.bonus.<N>` | payout da fazenda | aditivo | ✅ ranks · VIP no LuckPerms |
| `fishing.bonus.<N>` | **só os corais** da pesca | aditivo | ✅ ranks · VIP no LuckPerms |
| `warehouse.bonus.<N>` | venda de cacto | aditivo | ✅ ranks · VIP no LuckPerms |

⚠️ **Todos os quatro SOMAM.** Não existe mais nenhum multiplicador por permissão no servidor: o `warehouse.sellmult.<N>`, que ia de 1x a 1.616.000x e era o único, foi removido do código e dos 20 ranks em 06/08/2026. Ver o README, C13.

⚠️ Na pesca o nó toca **só os corais**. Os coins da pesca chegam como payload `type: CURRENCY` das 44 recompensas da escada, e payload não passa por multiplicador nenhum. Ver §4.

### Limites de contagem — 4 nós

| Nó | O que amplia | Padrão sem permissão |
|---|---|---|
| `essentials.homes.limit.<N>` | homes | `GarnixEssentials/config.yml` |
| `echest.rows.<N>` | linhas do ender chest | 3 linhas, teto 6 |
| `auctions.limit.<N>` | itens no leilão | `GarnixAuctions/config.yml` |
| `market.limit.<N>` | itens no mercado | `GarnixMarket/config.yml` |

⚠️ O prefixo do ender chest é **configurável**, não fixo no código: `GarnixChests/config.yml:27 → echest.permission-node: echest.rows`. Mudar essa linha muda o nó que o LuckPerms precisa ter.

**Nenhum dos quatro é concedido por config** — aparecem só no `config.yml` do próprio plugin, documentando o prefixo. Quem concede é o LuckPerms, e é o que a lore dos VIPs já anuncia (homes, echest, leilão, mercado).

### Tabelas por `vip.<nome>` — 3 arquivos

| Arquivo | O que dá |
|---|---|
| `GarnixSpawners/ranks.yml` | desconto na compra + bônus nos drops |
| `GarnixMachines/ranks.yml` | idem, valores idênticos |
| `GarnixServerShops/discounts.yml` | desconto, só no coins-shop |

Não são sufixo numérico: são tabelas indexadas por permissão. Desde 06/08/2026 o desconto e o bônus são resolvidos por **buscas separadas** — cada um vem da entrada onde ele é maior.

### 🚩 Os nós de VIP não existem no repositório

Todo arquivo em `GarnixVips/vips/` tem apenas `lp-group:` — nenhum VIP executa comando de permissão na ativação. Os nós vivem **só no LuckPerms**, então não há como verificar daqui se estão materializados, e não há como um `git diff` mostrar quando alguém mexer neles.

É por isso que esta tabela existe: ela é a fonte da verdade em texto do que tem que estar lá.

---

## 3. Os 45 comandos, prontos para colar

```
# CELESTIAL  —  bonus 8%  ·  desconto 3%
lp group celestial permission set vip.celestial true
lp group celestial permission set mining.bonus.8 true
lp group celestial permission set farm.bonus.8 true
lp group celestial permission set fishing.bonus.8 true
lp group celestial permission set warehouse.bonus.8 true

# IMORTAL  —  bonus 12%  ·  desconto 6%
lp group imortal permission set vip.imortal true
lp group imortal permission set mining.bonus.12 true
lp group imortal permission set farm.bonus.12 true
lp group imortal permission set fishing.bonus.12 true
lp group imortal permission set warehouse.bonus.12 true

# SUPREMO  —  bonus 16%  ·  desconto 10%
lp group supremo permission set vip.supremo true
lp group supremo permission set mining.bonus.16 true
lp group supremo permission set farm.bonus.16 true
lp group supremo permission set fishing.bonus.16 true
lp group supremo permission set warehouse.bonus.16 true

# GARNIX  —  bonus 20%  ·  desconto 15%
lp group garnix permission set vip.garnix true
lp group garnix permission set mining.bonus.20 true
lp group garnix permission set farm.bonus.20 true
lp group garnix permission set fishing.bonus.20 true
lp group garnix permission set warehouse.bonus.20 true

# INVESTIDOR  —  bonus 22%  ·  desconto 20%
lp group investidor permission set vip.investidor true
lp group investidor permission set mining.bonus.22 true
lp group investidor permission set farm.bonus.22 true
lp group investidor permission set fishing.bonus.22 true
lp group investidor permission set warehouse.bonus.22 true

# MINIYT  —  bonus 8%  ·  desconto 3%   (espelha o celestial)
lp group miniyt permission set vip.miniyt true
lp group miniyt permission set mining.bonus.8 true
lp group miniyt permission set farm.bonus.8 true
lp group miniyt permission set fishing.bonus.8 true
lp group miniyt permission set warehouse.bonus.8 true

# YT  —  bonus 12%  ·  desconto 6%   (espelha o imortal)
lp group yt permission set vip.yt true
lp group yt permission set mining.bonus.12 true
lp group yt permission set farm.bonus.12 true
lp group yt permission set fishing.bonus.12 true
lp group yt permission set warehouse.bonus.12 true

# TIKTOKER  —  bonus 12%  ·  desconto 6%   (espelha o imortal)
lp group tiktoker permission set vip.tiktoker true
lp group tiktoker permission set mining.bonus.12 true
lp group tiktoker permission set farm.bonus.12 true
lp group tiktoker permission set fishing.bonus.12 true
lp group tiktoker permission set warehouse.bonus.12 true

# STREAMER  —  bonus 12%  ·  desconto 6%   (espelha o imortal)
lp group streamer permission set vip.streamer true
lp group streamer permission set mining.bonus.12 true
lp group streamer permission set farm.bonus.12 true
lp group streamer permission set fishing.bonus.12 true
lp group streamer permission set warehouse.bonus.12 true
```

Os grupos de staff (`moderador`, `ajudante`) **não entram** — eles não aparecem em nenhuma das tabelas de bônus do servidor.

---

## 4. As quatro armadilhas do LuckPerms

**⚠️ 1 — Os nós NÃO empilham: o maior vence.** Rank e VIP competem pelo mesmo nó. O javadoc é explícito: *"The nodes do not stack: when a player holds several of them only the largest applies."* Então o VIP não *acrescenta* ao rank — ele **substitui por um valor maior**, e por isso todo nó de VIP fica acima de 20, que é o teto do rank. Um celestial no rank 20 tem 24%, não 44%.

**⚠️ 2 — O nó tem que ser materializado exato.** `mining.bonus.*` como wildcard **não concede nada** — o número é lido do sufixo com `Double.parseDouble`, então um curinga não parseia e o jogador fica com 0.

**⚠️ 3 — O bônus não se aplica ao XP.** Nas três vias de progressão (mineração, fazenda, pesca) o `permBonus` levanta o que a ação **paga**, nunca a velocidade com que o nível sobe. É a única contribuição da pilha que fica de fora do XP, e é deliberado.

**⚠️ 4 — Na pesca, o bônus só toca os corais.** Os coins da pesca chegam como payload `type: CURRENCY` das 44 recompensas da escada, e payload **não passa por multiplicador nenhum** (`RewardService.computeCurrency` só escala a renda imediata). Então um garnix ganha +35% de corais e **+0% na escada de coins**. Isso é o desenho da via — na pesca o equipamento e a permissão compram acesso e moeda linear, não amplitude.

---

## 5. Quem aplica o quê

✅ **Divisão acertada com o dono (05/08/2026):**

| Escada | Quem aplica | Onde |
|---|---|---|
| **VIP e influencer** | **o dono, à mão** | LuckPerms — nada disso entra em `.yml` |
| **Rank e prestígio** | **config** | `GarnixRankUP/ranks/*.yml` → `commands`, e o reset em `GarnixRankUP/config.yml` |

Cada rank **concede o nó novo e remove o do rank anterior** — nas escadas onde só o maior conta. `spawner.buy.*` e `machines.buy.*` ficam de fora dessa remoção: aquilo é patrimônio e precisa acumular.

E o reset de prestígio limpa a escada inteira: sem isso quem prestigia voltaria ao rank 1 carregando o bônus do rank 20 para sempre, e a escada de rank viraria decoração a partir da primeira volta.

**Estado hoje:** `mining.bonus` e `fishing.bonus` estão nos 20 arquivos de rank e no reset, com cobertura conferida de 19/19 cada. O `warehouse.sellmult` foi removido dos 21 arquivos.

## 6. Pendências

| # | O que | Estado |
|---|---|---|
| 1 | Os 40 nós do §3 aplicados no LuckPerms | ⛔ **do dono** |
| 2 | `farm.bonus.<N>` não é concedido por ninguém, nem pelos 20 ranks | ⏳ entra na calibragem da fazenda |
| 3 | `warehouse.bonus.<N>` idem. Agora é o ÚNICO bônus da via do cacto, então ele deixou de ser redundante | ⏳ entra na calibragem do armazém |
| ~~4~~ | ~~`vip.influencer` órfão nas tabelas de spawner e máquina~~ | ✅ **resolvido** — a entrada guarda-chuva foi **removida** das três tabelas em 06/08/2026. Os influenciadores são só `yt`, `tiktoker`, `streamer` e `miniyt`. O `daily.influencer` do `GarnixDailyRewards` é outro sistema e continua existindo |
| ~~5~~ | ~~`advantages-icon` para os influencers~~ | ❌ **não vai ser feito** — decisão do dono, os grupos de influencer não têm página de vantagens |

---

Ver [01-ECONOMIA.md](01-ECONOMIA.md#6-orçamento-de-multiplicadores--teto-de-100) para onde o `permBonus` entra no orçamento de 100×, e [03-RANKING-APELOES.md](03-RANKING-APELOES.md) para o peso dele contra as outras vantagens.
