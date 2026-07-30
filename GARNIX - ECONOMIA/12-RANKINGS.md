# 12 — RANKINGS E A PREMIAÇÃO DE FIM DE TEMPORADA

O mérito de fim de temporada mora em **vários rankings de várias economias e ações**, por decisão sua. Este documento levanta o que já existe implementado, o que falta, e como os **R$ 1.000** se distribuem.

**A notícia boa do levantamento: quase tudo que você pediu já está pronto no código.** São **26 dimensões de ranking** implementadas em 14 plugins, com 15 menus `ranking.yml` já em config. Só falta **uma** — a via do cacto — e o dono decidiu que ela **não precisa** de placar.

---

## 1. Inventário — as 26 dimensões que já existem

Cada linha foi lida no código, não inferida. A coluna "evidência" aponta o arquivo e a linha da query.

### Progressão (o eixo de mérito real)

| Plugin | Dimensão | Coluna | Evidência |
|---|---|---|---|
**RankUP** | **prestígio** | `prestige` | `RankUserRepository.java:87` → `topByPrestige` |
RankUP | rank atual | `rank_order` | `RankUserRepository.java:77` → `topByRank` |
**Mining** | **blocos quebrados** | `blocks_broken` | `UserRepository.java:447` → `topByBlocks` |
Mining | nível da mina | `mine_level` | `UserRepository.java:456` → `topByLevel` |
**Farm** | **colheitas** | `harvested_crops` | `UserRepository.java:372` → `topByHarvested` |
Farm | nível da fazenda | `farm_level` | `UserRepository.java:381` → `topByLevel` |
**Fishing** | **recompensas pescadas** | `total_fished` | `UserRepository.java:131` → `topByTotal` |
Fishing | segundos pescando | `time_fished` | `UserRepository.java:136` → `topByTime` |

### Combate e presença

| Plugin | Dimensão | Coluna | Evidência |
|---|---|---|---|
**Bosses** | **bosses abatidos** | `total_kills` | `BossUserRepository.java:135` → `topByKills` |
Bosses | dano total causado | `total_damage_dealt` | `BossUserRepository.java:140` → `topByDamage` |
**OnTime** | **tempo online** | `total_time` (BIGINT) | `OnTimeUserRepository.java:142` → `topByTime` |
**Events** | pontuação por evento | `val` por `event_id` | `EventUserRepository.java:92` → `topByEvent` |
**Events** | **pontuação total** | soma de `val` | `EventUserRepository.java:126` → `topByTotal` |
Duels | vitórias | `wins` | `DuelUserRepository.java:75` → `topByWins` |
Duels | duelos jogados | `wins + losses` | `DuelUserRepository.java:83` → `topByTotal` |
CoinFlip | vitórias | `wins` | `UserRepository.java:48` → `topByWins` |

### Riqueza e consumo

| Plugin | Dimensão | Evidência |
|---|---|---|
**Currencies** | **saldo — uma por moeda, todas as 8** | `AccountRepository.java:202` → `topByBalance`, indexado por `currency-id` |
Spawners | spawners colocados | `SpawnerRepository.java:220` → `topByPlaced` |
Spawners | spawners comprados | `ShopUserRepository.java:132` → `topByBought` |
Spawners | coins gastos em spawner | `ShopUserRepository.java:144` → `topBySpent` |
Machines | máquinas colocadas | `MachineRepository.java:306` → `topByPlaced` |
Machines | máquinas compradas | `ShopUserRepository.java:167` → `topByBought` |
Machines | coins gastos em máquina | `ShopUserRepository.java:179` → `topBySpent` |
Crates | caixas abertas | `UserRepository.java:180` → `topByOpened` |
ChestShop | visitas na loja | `ShopStoreRepository.java:188` → `topByVisits` |
ChestShop | avaliação média | `ShopStoreRepository.java:198` → `topByRating` |

Contando as 8 moedas separadamente, são **33 placares distintos**. Todos leem **do SQL**, não da memória — o comentário `// Rankings (always from SQL → offline included)` aparece em todos os repositórios. Ou seja: **jogador offline entra no ranking**, o que é exatamente o necessário para um placar de fim de temporada.

### A lacuna — o cacto não tem placar

**`GarnixWarehouse` não tem nenhum contador cumulativo e nenhum ranking.** As três tabelas do plugin guardam só **estado atual**:

| Tabela | Colunas | O que guarda |
|---|---|---|
`users` | `sell_interval`, `autosell_enabled`, `autosell_unlocked`, `summary`, `booster_*` | configuração |
`warehouses` | `plot_id`, `owner_*`, `storage_limit` | o limite do galpão |
`farms` | `plot_id`, `farm_type`, **`amount VARCHAR(64)`** | **o estoque no momento** |

`amount` é o que está no galpão **agora**, não o que já foi vendido. Um jogador que vendeu 10¹⁸ de cacto na temporada e esvaziou o galpão aparece com `0`.

`GarnixCactusTowers` não tem banco nenhum.

Consequência: **a via que você disse que os jogadores gostam MUITO é a única que não pode ser premiada.** Exigiria código — o **C11**, que você recusou. Fica registrado no §4.

Um detalhe bom que apareceu de graça: o galpão **já guarda quantidade como `VARCHAR(64)`**, ou seja já é seguro para sextilhões. Enquanto os crates e bosses perdem precisão acima de 9×10¹⁵ (V2), o galpão foi escrito certo desde o começo. O `total_sold` do C11 herda esse padrão.

---

## 2. A regra que governa a premiação em dinheiro

Você vai distribuir **R$ 1.000 reais** entre jogadores que ficarem **top 1** em rankings no fim da temporada. Isso muda a natureza do projeto em um ponto, e é o ponto mais importante deste documento:

> **Dinheiro real atrás de um ranking que dinheiro real pode comprar é cashback disfarçado.**

Se o top 1 de *coins gastos em spawner* ganha R$ 150, o caminho ótimo é comprar R$ 200 de cash no site e recuperar R$ 150 do prêmio. Você paga para o jogador jogar no seu servidor, a loja perde credibilidade, e quem joberou 20 dias assiste um whale levar o prêmio na última hora.

Daí sai o filtro único:

> **Só entra na premiação ranking travado por TEMPO ou HABILIDADE. Nunca por riqueza.**

É a mesma lei dos dois eixos que já governa o plano ([01-ECONOMIA.md](01-ECONOMIA.md)), aplicada agora ao dinheiro de verdade. E ela é o que faz a premiação reforçar o desenho em vez de furá-lo: os rankings premiados são exatamente aqueles que **nem o whale nem o alt conseguem comprar.**

### Os 33 placares, filtrados

| Placar | Premiável | Por quê |
|---|---|---|
**prestígio** | ✅ **o melhor de todos** | gate são cabeças = tempo de kill. Por projeto, dinheiro não compra ([lei dos dois eixos](01-ECONOMIA.md)) |
**bosses abatidos** | ✅ | você pediu explicitamente. Limitado pela oferta de chave de boss, que vem de minerar/farmar à mão |
**blocos quebrados** | ✅ | tempo de mina |
**colheitas** | ✅ | tempo de fazenda |
**recompensas pescadas** | ✅ | tempo de pesca — e é a via mais fraca, então o prêmio dá razão para alguém investir nela |
~~cacto vendido~~ | ❌ **sem placar** | seria premiável, mas o C11 foi recusado — não existe contador cumulativo |
**pontuação total de eventos** | ✅ | presença + habilidade. Evento exige estar online e disputando; não dá para AFK |
tempo online | ⚠️ **com ressalva** | você pediu. Mas top 1 é quem deixou o PC ligado 20 dias, e é a coisa mais fácil de fazer numa alt. Entra com o menor prêmio de todos, ou não entra |
dano em boss | ❌ | com a matadora `hk` (item de loja) dano ≈ kills, e aí é riqueza. Redundante com kills |
segundos pescando | ❌ | relógio de AFK, alt-farmável, premia ficar parado |
nível da mina / da fazenda / rank atual | ❌ | correlacionados com blocos/colheitas/prestígio. Dois prêmios pela mesma coisa. E **rank zera no prestígio** — o top-prestígio aparece com rank baixo |
**saldo de cash** | ❌ **jamais** | comprável com dinheiro real. É literalmente converter reais em reais |
saldo de coins | ❌ | é a manchete da temporada, mas é parcialmente comprada. Ganha prêmio **de status**, não dinheiro |
saldo das 6 secundárias | ❌ | são negociáveis no market. Um whale compra gemas de 20 jogadores com coins comprados |
spawners/máquinas — comprados, gastos, colocados | ❌ | riqueza pura. É o caso do cashback |
caixas abertas | ❌ | chave é comprável e a chave VIP cai para todos os online a cada venda |
duelos — vitórias | ❌ | **taxa 0%** hoje (E1): duas alts trocam vitórias de graça. Nem com taxa vale — win-trading é indetectável |
duelos — jogados | ❌ | trivialmente farmado em duas contas |
coinflip vitórias | ❌ | sorte + conluio |
visitas / avaliação de loja | ❌ | amigos clicando e avaliando |

**7 placares premiáveis + 1 com ressalva.** Sobra exatamente o tamanho certo para R$ 1.000.

---

## 3. A distribuição dos R$ 1.000

O trade-off é só um: **poucos prêmios grandes ou muitos pequenos.** R$ 50 não move ninguém — o jogador olha, acha pouco, e joga como jogaria de qualquer forma. Na faixa de R$ 100–250 ele muda o comportamento e persegue o placar. Então: **8 vencedores, não 20.**

✅ **O dono recusou o C11** (*"placar de cacto n precisa"*), então o cacto fica sem ranking e os R$ 120 dele foram para o prestígio. **7 vencedores.**

| # | Ranking | Prêmio | Papel |
|---|---|---|---|
1 | **Prestígio** | **R$ 370** | o mérito real da temporada. É o único placar que mede "fez as voltas" e o único imune a riqueza. Absorveu os R$ 120 do cacto |
2 | **Bosses abatidos** | **R$ 150** | seu pedido explícito. Ancora o loop minerar → chaves → boss |
3 | **Blocos quebrados** (Mineração) | **R$ 120** | via de referência |
4 | **Colheitas** (Fazenda) | **R$ 120** | paridade com a mineração |
5 | **Recompensas pescadas** | **R$ 120** | a via mais fraca ganha o mesmo prêmio — é o que a torna disputada |
6 | **Pontuação total de eventos** | **R$ 80** | premia quem aparece nos 21 eventos |
7 | **Tempo online** | **R$ 40** | seu pedido. Pequeno de propósito: é um relógio, não uma conquista |
| | **total** | **R$ 1.000** | **7 vencedores** |

As 3 vias de farm com placar (mineração, fazenda, pesca) pagam **igual, R$ 120**. Isso não é simetria decorativa: é a mesma decisão de "vias paralelas e equivalentes" do plano, agora com dinheiro real por trás.

⚠️ **Consequência de recusar o C11, para ficar registrada:** o cacto é uma via de primeira classe no desenho, mas **não tem como medir mérito nela** — o `GarnixWarehouse` guarda só o estoque atual, nunca o total vendido. Quem investir a temporada inteira no cacto não disputa nenhum dos 7 prêmios por essa via. Os R$ 120 foram para o prestígio em vez de para um placar de riqueza, porque abrir a porta do cashback para preencher uma linha da tabela seria pior.

### As 5 regras — publicadas no dia 1, junto com a tabela

**1. Um prêmio por pessoa.** Um jogador que fica top 1 em três placares leva **um** prêmio.

Algoritmo, determinístico e anunciado: percorre os placares **do prêmio maior para o menor**; cada um paga o jogador melhor colocado que **ainda não ganhou nada**. Quem foi top 1 em mineração mas já levou o prestígio cede a mineração para o **2º colocado**.

O efeito é o que interessa: **8 pessoas felizes em vez de 3.** Um hardcore levaria R$ 500 sozinho e a premiação viraria propaganda de que só o topo ganha.

**2. Um prêmio por IP.** Essencial — o servidor **permite 3 contas por IP** e duas delas são AFK. Sem esta regra uma casa leva mineração na principal e tempo online na alt. O `GarnixPunishments` já tem `IpRepository` com `last_seen` por IP (`IpRepository.java:48`), que é a ferramenta certa para conferir.

Não é à prova de VPN nem de dois jogadores de verdade na mesma casa — mas cobre o caso comum, que é o que importa.

**3. Piso mínimo por placar.** Top 1 em pesca com 40 peixes não vale R$ 120. Cada placar tem um piso, publicado no dia 1; se ninguém alcançar, o dinheiro daquele placar **soma ao prestígio**.

| Placar | Piso | De onde sai |
|---|---|---|
Prestígio | **50** | o simulador projeta ~610 alcançáveis |
Bosses abatidos | **1.000** | ~250–300/dia × 20 dias ≈ 5.000 projetados |
Blocos quebrados | **5.000.000** | 70.000/h medidos × 3h × 20 dias = 4,2M **só manual**, e o AoE multiplica |
Tempo online | **120 h** | 6h/dia × 20 dias |
Colheitas · Cacto · Pesca · Eventos | ⏳ | saem da calibração das Fases 3b e 4 — **20% do valor projetado para o perfil dedicado** |

**4. Conta punida está fora.** Ban, mute por macro, uso de cliente irregular ou abuso de bug desclassifica — e o prêmio desce para o próximo colocado.

**5. Snapshot antes do reset.** ⚠️ **Operacionalmente crítico:** o reset de fim de temporada apaga as tabelas. Os placares tiram print e **dump do banco** num horário fixo e anunciado, **antes** de qualquer wipe. Placar não conferido antes do reset é placar perdido — não tem como recuperar.

### O que os placares de riqueza ganham

Coins é a manchete da temporada e não pode ficar sem reconhecimento — ele só não pode pagar em reais. Então:

| Placar | Premiação |
|---|---|
top 1 em coins | tag exclusiva permanente + anúncio + destaque no Discord |
top 1 de cada moeda secundária | tag ou cosmético |
top 3 em spawners/máquinas colocados | cosmético |
top 1 dos 21 eventos individuais | a **tag no chat** dos eventos, que você já disse ser o prêmio mais desejado depois do cash |

Status puro, zero impacto econômico, zero risco de cashback — e é o que o jogador de RankUP mais valoriza depois do número na tela.

### Duas consequências para outras fases

- **Fase 6 fica mais urgente.** Duelos com taxa 0% (E1) e bolão sem rake (E2) já eram brechas de transferência. Com dinheiro real na mesa, deixá-los sem taxa é convite ao win-trading — mesmo que duelos **não** seja um placar premiado, o coins transferido alimenta os placares de riqueza e o mercado.
- **A premiação vira parâmetro do simulador.** Os pisos da regra 3 saem das projeções, então o teste de banda de fim de temporada (casual 10¹²–10¹⁵ · dedicado ~10²¹) passa a ter uma segunda função: definir números que valem R$ 1.000. Se a projeção estiver errada, o piso está errado.

---

## 4. C11 — o ranking do cacto · ❌ RECUSADO

| | |
|---|---|
**Plugin** | `garnix-warehouse` |
**Veredito** | ❌ **recusado pelo dono** — *"placar de cacto n precisa"*. Fica registrado abaixo o que ele custa, para a decisão poder ser revista |
**Tamanho** | uma coluna, um método, uma query, um menu — o menor dos C aprovados até agora |

O que muda:

1. `UserRepository.createSchema()` — uma coluna nova: `total_sold VARCHAR(64) NOT NULL DEFAULT '0'`. **`VARCHAR`, não `BIGINT`** — é o padrão que o próprio plugin já usa em `farms.amount` e `warehouses.storage_limit`, e é o que mantém a via segura acima de 9×10¹⁸ sem precisar do C1.
2. No ponto onde a venda credita coins (autosell e venda manual), somar a quantidade vendida em `total_sold`.
3. `topBySold(int limit)` no mesmo formato dos outros 25 — `WHERE total_sold > 0 ORDER BY ... DESC LIMIT ?`, retornando `Leaderboards.Row`.
4. `GarnixWarehouse/menus/ranking.yml` novo, copiando a estrutura de um dos 15 que já existem.

**Detalhe de projeto:** contar **cacto vendido** (quantidade), não **coins recebidos**. Coins recebidos depende de booster, VIP e do `sell-price` que ainda vamos calibrar — ou seja, seria parcialmente riqueza, e cairia no filtro da seção 2. Quantidade vendida é tempo de farm puro.

**Recusado.** A linha do cacto saiu da tabela e os R$ 120 foram para o prestígio (R$ 370). O efeito colateral é que o cacto — via de primeira classe no desenho — não tem como medir mérito, e quem investir a temporada inteira nele não disputa nenhum dos 7 prêmios por essa via.

---

## 5. Resumo

| | |
|---|---|
Dimensões de ranking já implementadas | **26** (33 contando as 8 moedas separadamente) |
Menus `ranking.yml` já em config | 15 |
Lêem do SQL, incluindo jogador offline | **todos** |
Faltando | **1** — cacto vendido. O C11 foi **recusado**, então segue sem placar |
Placares premiáveis em dinheiro | **7** |
Vencedores | **7** |
Total | **R$ 1.000** |
Regras | 1 prêmio por pessoa · 1 por IP · piso mínimo · punido está fora · snapshot antes do reset |
A lei | **dinheiro real só atrás de placar travado por tempo ou habilidade — nunca por riqueza** |
