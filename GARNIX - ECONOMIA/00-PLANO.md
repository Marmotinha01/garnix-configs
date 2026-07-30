# Economia da Temporada — RankUP Heads (Rede Garnix)

> **Este é o documento vivo do plano.** Atualizado a cada decisão nova. Última atualização: **29/07/2026**.
> Índice dos outros arquivos deste diretório em [README.md](README.md).

## Context

O servidor é um **RankUP Heads** de temporada curta de **20 dias**, com reset total ao fim. Todos os 40 plugins são próprios e **100% dos valores atuais são fictícios** — recompensas, níveis, curvas de XP, custos, tudo. Não há economia projetada: hoje existem 9 ordens de magnitude de incoerência entre faucets (máquina paga 5 coins/drop, spawner paga 5.000.000.000/drop), 19 dos 20 ranks têm custo idêntico, 6 de 6 crates têm tabelas byte-idênticas, 7 de 7 caixas misteriosas estão vazias, e o cash está ~100× superdimensionado (eventos pagam 5.000–15.000 contra um daily VIP de 100).

O objetivo é construir a economia inteira do zero, calculada e previsível, com estas metas:

E o buraco maior, que só apareceu na auditoria de itens: dos **~212 itens ativáveis** do servidor, **162 (76%) não têm nenhuma rota de aquisição** e o repo inteiro tem **6 preços de item definidos**. Skins que valem +65% de renda dizem "só sai de caixa", e as 7 caixas retornam nada 100% das vezes.

- **Teto:** jogador dedicado chega a **sextilhões (10²¹ coins)** no **dia 20**, último da temporada. Casual termina em 10¹²–10¹⁵.
- **Cash é raro:** jogador free acumula ~300–500 na temporada inteira. 500K de cash é o exagero absoluto de um whale.
- **P2W consciente:** tudo que se vende no site é obtenível jogando, alguns itens por rotas muito mais difíceis. Nem tudo vai para o site.
- **Progressão constante e visível** — jogador de RankUP quer ver **quantias elevadas e evolução contínua na tela**, mesmo quando o progresso real é pequeno. Volume e frequência são requisitos, não efeitos colaterais. Ver "Lei de projeto: número grande e frequente na tela".
- **Ninguém pode ficar preso num tier baixo** — nunca pode compensar farmar spawner de galinha até o fim da temporada. Isso é garantido por desigualdade matemática, não por boa vontade. Ver "Lei de projeto: nunca pode compensar ficar parado".
- **Escala:** funcionar de 50 a 250 jogadores.

### Decisões já travadas com o dono

| Tema | Decisão |
|---|---|
| Eixo endgame | **Vias paralelas e equivalentes**: Mineração, Farm, Pesca, Passivo (spawners/máquinas) e **Cacto** (armazém + torres) |
| Cacto | Via de primeira classe, **pareada** com as outras. Venda **só em coins**; compra do cacto um pouco difícil; expansão grátis tirando do armazém; item cacto e torre **raros** em recompensa |
| Itens | ⚠️ **~212 itens ativáveis auditados, 162 sem rota.** Nenhum item pode ficar sem rota e sem preço — fase própria (4b) |
| Duração | **20 dias** exatos, reset total ao fim. Tier N = dia N, T20 = dia 20 |
| Alcance do teto | Todo jogador **dedicado** (~3h/dia na conta principal) chega a 10²¹ no dia 20 |
| Faucet de cash | Migalhas. **Daily é a fonte garantida**; eventos e conquistas pagam cash mas são difíceis |
| AFK vs ativo | **1h ativa = 20h de AFK** (banda 15–25×) |
| Cabeças | **Negociáveis livremente** — mercado aberto |
| Código Java | Só o mínimo indispensável. **C1, C2, C6 e C7 aprovados** (tipos BigInteger · tabela de valor por nível no Farm · prestígio por nível · chave só em bloco manual). C3 depende do teste V1; C4/C5/C8 opcionais |
| Entregáveis de controle | **ECONOMY.md + simulador** |
| Kits | ⛔ **Eu nunca edito kit nem base64.** As chaves dos kits serão redefinidas do zero, mas o dono aplica **manualmente no jogo**. Meu entregável é só a especificação: kit → qual chave → quantidade |
| Vínculo Discord | **Primeira vinculação dá VIP Celestial por 3 dias**, 1× por conta de Discord, à prova de unlink/relink. Não se discute remover. Vinculados também ganham recompensa diária permanente |
| Hierarquia VIP | **Celestial é o VIP mais básico**: celestial < imortal < supremo < garnix (investidor/influencer são tags de parceria) |
| Shops | **Por último** (coins-shop e cash-shop) |

### Escopo por plugin

**Com impacto econômico (entram no trabalho):** GarnixCurrencies, GarnixMining, GarnixFarm, GarnixFishing, GarnixSpawners, GarnixMachines, GarnixWarehouse, GarnixCactusTowers, GarnixBosses, GarnixCrates, GarnixMysteryBoxes, GarnixFragments, GarnixRankUP, GarnixVips, GarnixServerShops, GarnixChests, GarnixDailyRewards, GarnixOnTime, GarnixEvents, GarnixMarket, GarnixAuctions, GarnixChestShop, GarnixCoinFlip, GarnixDuels, GarnixEssentials (kits — só auditoria), GarnixStoreActivation, **GarnixDiscordSync**.

**Sem impacto (ignorar):** GarnixCore (só credenciais/DB), **GarnixClans** (puramente social — sem banco compartilhado, sem bônus de renda, por decisão sua), GarnixChat, GarnixScoreboards, GarnixMail, GarnixPunishments, GarnixAntiNuker, GarnixMaintenance, GarnixWorldManager.

**Fora de escopo por decisão:** as permissões de limite (`market.limit.<N>`, `auctions.limit.<N>`, `essentials.homes.limit.<N>`, `echest.rows.<N>`) — **os valores atuais estão certos e não serão tocados.** São exclusivamente vantagem de VIP e nunca entram como recompensa. Único item de `GarnixClearPlot` a tocar: dar rota e preço ao Limpador de Terreno na Fase 4b.

---

## A espinha: 20 tiers de uma década cada

A descoberta que organiza tudo: **RankUP tem exatamente 20 ranks com nomes de mob, e GarnixSpawners tem exatamente os mesmos 20 mobs, na mesma ordem.** E `GarnixRankUP/ranks/*.yml` já aceita custo em `head <MOB> <n>`. Isso é literalmente o tema RankUP Heads codificado na estrutura dos arquivos.

O loop mestre:

```
rank N  →  libera comprar spawner N  →  conta AFK autoclica mob N
        →  cabeças de mob N + coins do tier N  →  rank N+1  →  spawner N+1
```

**Regra única:** o tier de um conteúdo determina todos os seus números.

```
renda diária da casa no tier N  =  10.000 × 8^(N-1)
```

**Um tier por dia, tier N = dia N.** Em 20 dias isso dá T1 = 10⁴ no dia 1 e T20 = 1,44×10²¹ no dia 20. Qualquer número em qualquer YAML deriva de um único inteiro N, e o dia em que ele importa é esse mesmo N.

**O crescimento de 8×/dia não foi escolhido, foi derivado das duas pontas físicas.** Um jogador novo minera ~3.000 blocos/hora à mão a 1 coin/bloco, ou seja ~9.000 coins numa sessão de 3h: **a casa faz ~10⁴ no dia 1 e isso não é negociável** — é o que a mão do jogador produz. O teto pedido é 10²¹. Então `log(10²¹/10⁴) = 17 ordens` em **19 saltos** = 0,895 ordem/dia = **7,94×**, arredondado para 8×.

> ⚠️ Uma versão anterior deste plano usava 10×/dia, o que colocava o T1 em **100 coins/dia para a casa inteira** — duas ordens abaixo do que um jogador novo produz só minerando. O erro ia na direção perigosa: teria feito o valor-base do bloco cair para fração de coin no começo, arredondando para zero.

Tabela completa e todos os valores derivados em [02-TIERS.md](02-TIERS.md).

Consequência que garante a segurança do modelo: **com crescimento de 8×/dia, o saldo final ≈ a renda do último dia, e a fortuna de ontem vale 12,5% da renda de hoje.** Ninguém consegue entesourar, ninguém trava de vez, e sinks agressivos (75%/dia) não movem o número da manchete.

### Modelo de 3 contas por IP

O padrão real do jogador: conta A AFK (pesca + torre de cacto), conta B AFK (farm + autoclick nos spawners), conta C ativa (mina, fazenda, PvP, eventos).

Com ativo = 20× AFK, a renda da **casa** no tier N se reparte assim:

**O captcha não afeta o ganho AFK.** Ele existe só no ato de **comprar** (spawner, máquina, upgrade de armazém), para impedir compra automatizada por macro — e quem compra é a conta principal. As contas AFK seguem com **24h de uptime efetivo**.

| Conta | Tempo efetivo | Peso/h | Unidades/dia | % da casa |
|---|---|---|---|---|
| AFK 1 (pesca + cacto) | 24h | 1× | 24u | 22% |
| AFK 2 (farm + cabeças) | 24h | 1× | 24u | 22% |
| **Ativa** (mina/fazenda/eventos) | 3h | **20×** | 60u | **56%** |
| | | | **108u** | 100% |

Portanto, no tier N (onde `renda(N) = 10.000 × 8^(N-1)`):
- `1u = renda(N) / 108`
- **AFK por hora, por conta = renda(N) / 108**
- **Ativo por hora = renda(N) / 5,4**
- **Passivo por hora = renda(N) / 24** (roda 24h, só a partir do T7)

Sanidade nas duas pontas: no dia 1 (T1) o ativo rende ~1.850 coins/h (≈0,5 bloco/s minerado a 1 coin/bloco) e o AFK ~93/h. No dia 20 (T20) o ativo rende 2,67×10²⁰/h e o AFK 1,33×10¹⁹/h. Ambos plausíveis.

Consequência do captcha ser só na compra: ele **não é uma alavanca econômica**, é anti-macro. Fica como está (30s nos 3 plugins) e sai do orçamento.

### Tabela de tiers (resumida)

> **Esta tabela é a versão resumida. A autoritativa, com todos os valores derivados, é [02-TIERS.md](02-TIERS.md).**

Valor-base do bloco/colheita cresce **×3,9 por tier** (1 → 1,67×10¹¹), que é o que sobra depois de descontar o teto de throughput da mina (1,6×10⁷ blocos/h) e o teto de multiplicadores (100×).

Coluna "custo rank" abaixo é apenas a **parte simbólica em coins** (2% da renda diária). O gate real do rank são **cabeças**, no eixo separado — ver "Dois eixos independentes".

| T | Dia | Rank / Spawner | coins/dia (casa) | ativo/h | AFK/h | valor-base unit. | rank (coins, simbólico) | custo spawner |
|---|---|---|---|---|---|---|---|---|
| T1 | 1 | Coelho / RABBIT | 1,00×10⁴ | 1,85×10³ | 92,6 | 1,00 | grátis | — |
| T2 | 2 | Porco / PIG | 8,00×10⁴ | 1,48×10⁴ | 741 | 3,90 | 1,60×10³ | 4,00×10⁴ |
| T3 | 3 | Ovelha / SHEEP | 6,40×10⁵ | 1,19×10⁵ | 5,93×10³ | 15,2 | 1,28×10⁴ | 3,20×10⁵ |
| T4 | 4 | Vaca / COW | 5,12×10⁶ | 9,48×10⁵ | 4,74×10⁴ | 59,3 | 1,02×10⁵ | 2,56×10⁶ |
| T5 | 5 | Morcego / BAT | 4,10×10⁷ | 7,58×10⁶ | 3,79×10⁵ | 231 | 8,20×10⁵ | 2,05×10⁷ |
| T6 | 6 | Jaguatirica / OCELOT | 3,28×10⁸ | 6,07×10⁷ | 3,03×10⁶ | 907 | 6,56×10⁶ | 1,64×10⁸ |
| T7 | 7 | Lobo / WOLF | 2,62×10⁹ | 4,85×10⁸ | 2,43×10⁷ | 3,54×10³ | 5,25×10⁷ | 1,31×10⁹ |
| T8 | 8 | Zumbi / ZOMBIE | 2,10×10¹⁰ | 3,88×10⁹ | 1,94×10⁸ | 1,38×10⁴ | 4,20×10⁸ | 1,05×10¹⁰ |
| T9 | 9 | Esqueleto / SKELETON | 1,68×10¹¹ | 3,11×10¹⁰ | 1,55×10⁹ | 5,38×10⁴ | 3,36×10⁹ | 8,40×10¹⁰ |
| T10 | 10 | Aranha / SPIDER | 1,34×10¹² | 2,49×10¹¹ | 1,24×10¹⁰ | 2,10×10⁵ | 2,69×10¹⁰ | 6,72×10¹¹ |
| T11 | 11 | PigZombie | 1,07×10¹³ | 1,99×10¹² | 9,94×10¹⁰ | 8,22×10⁵ | 2,15×10¹¹ | 5,37×10¹² |
| T12 | 12 | Slime | 8,59×10¹³ | 1,59×10¹³ | 7,95×10¹¹ | 3,21×10⁶ | 1,72×10¹² | 4,30×10¹³ |
| T13 | 13 | Guardian | 6,87×10¹⁴ | 1,27×10¹⁴ | 6,36×10¹² | 1,25×10⁷ | 1,37×10¹³ | 3,44×10¹⁴ |
| T14 | 14 | MagmaCube | 5,50×10¹⁵ | 1,02×10¹⁵ | 5,09×10¹³ | 4,88×10⁷ | 1,10×10¹⁴ | 2,75×10¹⁵ |
| T15 | 15 | Endermite | 4,40×10¹⁶ | 8,14×10¹⁵ | 4,07×10¹⁴ | 1,90×10⁸ | 8,80×10¹⁴ | 2,20×10¹⁶ |
| T16 | 16 | Bruxa / WITCH | 3,52×10¹⁷ | 6,51×10¹⁶ | 3,26×10¹⁵ | 7,45×10⁸ | 7,04×10¹⁵ | 1,76×10¹⁷ |
| T17 | 17 | Blaze | 2,81×10¹⁸ | 5,21×10¹⁷ | 2,61×10¹⁶ | 2,91×10⁹ | 5,63×10¹⁶ | 1,41×10¹⁸ |
| T18 | 18 | Golem / IRON_GOLEM | 2,25×10¹⁹ | 4,17×10¹⁸ | 2,08×10¹⁷ | 1,13×10¹⁰ | 4,50×10¹⁷ | ⚠️ 1,13×10¹⁹ |
| T19 | 19 | Ghast | 1,80×10²⁰ | 3,33×10¹⁹ | 1,67×10¹⁸ | 4,42×10¹⁰ | 1,00×10¹⁸ (teto) | ⚠️ 9,00×10¹⁹ |
| T20 | **20** | Wither | **1,44×10²¹** | 2,67×10²⁰ | 1,33×10¹⁹ | 1,67×10¹¹ | 1,00×10¹⁸ (teto) | ⚠️ 7,20×10²⁰ |

⚠️ = ultrapassa `Long.MAX` (9,22×10¹⁸). Coberto pelo **C1**, aprovado. A parte em coins do rank é travada em **1×10¹⁸** a partir do rank 19 justamente para o rank nunca depender de C1 — o eixo de cabeças é que carrega a dificuldade lá em cima.

### Arquitetura de moedas — exatamente uma carrega o exponencial

| Moeda | Classe | Amplitude | Papel |
|---|---|---|---|
`coins` | **Exponencial** | 19 ordens | única moeda que chega a sextilhões. Spawners, máquinas, loja, combustível, limites |
`gemas` | Linear | 3–4 ordens | encantes de mineração. Oferta proporcional ao **tempo jogado**, não ao tier |
`sementes` | Linear | 3–4 ordens | encantes de farm (hoje o sink é **162× mais barato** que o de mineração — corrigir) |
`corais` | Linear | 3–4 ordens | progressão de pesca: vara, skins, livros, limites |
`dracmas` | Linear | 3–4 ordens | **secundária dos spawners** — o par que faltava. Paga as 3 trilhas de upgrade do spawner e os livros da espada. Hoje esses upgrades custam `coins` + uma chave `gems` que **nem existe como moeda** (o ID é `gemas`), então essa troca corrige o bug por projeto, não por remendo |
`spawnerslimite` / `maquinaslimite` | Contagem (linear) | inteiros | é o termo de **quantidade** num produto onde o outro termo já é exponencial. Nunca tierar |
`cash` | Premium, mão-fixada | 10²–10⁵ | ver orçamento abaixo |

**Cabeças** não são uma moeda do GarnixCurrencies — são itens, contados por `head <MOB> <n>`. Mercado livre, conforme decidido. **O gate não é a troca, é a produção:** cabeças de mob N só saem do spawner N, que exige rank N. Quem está no rank 12 não encontra ninguém vendendo cabeça de Bruxa em volume, porque quase ninguém chegou lá. A escassez na fronteira se autorregula.

Cabeças são o **gate real do rank** — não os coins. O requisito cresce com o rank e é multiplicado pelo `cost-increase-percent` a cada prestígio, o que faz a escada correr junto com o throughput de kill do jogador (mais spawners, `massacre` maior, `mob-stack` maior) e sustentar centenas de prestígios sem nunca ficar trivial. Ver "Dois eixos independentes" logo abaixo.

### Dois eixos independentes — a decisão estrutural do plano

O servidor tem **duas escadas que não se misturam**, e é isso que faz "sextilhões de coins" e "500 de prestígio" caberem na mesma temporada sem uma quebrar a outra:

| | **Eixo COINS** | **Eixo CABEÇAS** |
|---|---|---|
Natureza | exponencial, 8×/dia | linear no tempo de kill |
Amplitude | 19 ordens, até 10²¹ | contagem, cresce com throughput |
Escada | 20 tiers | 20 ranks → prestígio → 20 ranks → ... |
Onde é gasto | spawners, máquinas, loja, consumíveis, combustível, limites | **rank e prestígio, nada mais** |
Teto | 1,44×10²¹ no dia 20 | centenas de prestígios |
Quem trava | renda | tempo |

**O custo do rank é dominado por cabeças. Coins entram só de forma simbólica** (algo como 2–5% da renda diária do tier, o suficiente para o rankup não ser literalmente grátis, mas longe de ser o gargalo). Consequências:

1. **Riqueza não compra rank.** Um whale com 10²¹ coins não sobe um rank mais rápido que um free — falta tempo de kill. É a resposta mais forte possível ao "jogador foca só em coins e domina tudo".
2. **A escada de rank pode ser reescalada centenas de vezes** sem tocar na curva de coins, porque ela nunca esteve na curva de coins.
3. **É literalmente o tema.** RankUP Heads: cabeça é a moeda do rank. Antes disso o plano tinha rank custando 40% da renda diária, o que fazia de coins o verdadeiro gate e das cabeças um detalhe temático. Invertido, o tema passa a ser a mecânica.
4. **O orçamento de sinks se realoca.** Os 40% que eram do rank vão para spawners, upgrades, combustível e consumíveis — que é onde os coins de fato devem morrer.
5. **Alivia o problema de `Long.MAX`.** Rank não chega mais a 4×10²⁰. Só o preço do spawner nos tiers T19–T20 ainda estoura, então **C1 continua necessário**, mas com uma superfície bem menor.

### Lei de projeto: número grande e frequente na tela

Você repetiu isso de várias formas e é o requisito mais importante de sensação do servidor: **o jogador quer ver quantias elevadas e evolução contínua, mesmo quando o progresso real é pequeno.** Não é firula — é o que faz alguém passar 6 horas no servidor.

A consequência prática é que **volume e frequência são requisitos de projeto, não efeitos colaterais.** Sempre que houver escolha entre "poucos eventos grandes" e "muitos eventos frequentes", o desenho escolhe muitos e frequentes, e a raridade fica na cauda em vez de no corpo.

Como isso se realiza em cada sistema:

| Sistema | Como entrega a sensação |
|---|---|
Coins | 8×/dia significa que o número na tela **muda de casa quase todo dia**. O jogador vê milhão virar bilhão virar trilhão |
Chaves | ~5.000/dia no endgame, com recheio em 92% das aberturas — algo acontece sempre |
**Bosses** | **volume alto e empilhado** — ver ajuste abaixo |
Ranks | +1% por rank, 20 vezes, mais o prestígio infinito — sempre tem o próximo degrau perto |
Prestígio | marcos a cada 10, 25, 50, 100, 250, 500 — nunca falta um alvo visível |
Armadura e skins | 20 trocas de peça por via + 10 degraus de skin = muitos passos pequenos |
Encantes | 100 níveis, com compra em lote de +1/+10/+25/+50 já pronta nos menus |
Cacto | cresce por reinvestimento, então a farm **fica visivelmente maior** a cada sessão |

O contraponto que impede isso de virar inflação: a **escada de raridade** e o teto de 100× de multiplicadores. Os números na tela crescem muito e sempre; o **poder** cresce devagar e com teto. São eixos separados — e é essa separação que permite ser generoso na sensação sem quebrar o balanceamento.

### Bosses: volume alto, não 45/dia

Correção do que eu havia orçado. 45 bosses/dia era consequência de eu ter colocado a chave de boss em 0,9% das aberturas — número baixo demais para o que você quer.

| | Antes | **Alvo** |
|---|---|---|
Chance de chave de boss na crate | 0,9% | **~5%** |
Bosses/dia por jogador no endgame | ~45 | **~250–300** |

E o que torna isso gostoso em vez de repetitivo já existe no plugin: **`boss-stack-radius: 5`** — bosses empilham. O jogador acumula 20–30 chaves, invoca tudo de uma vez no terreno e mata o monte junto, vendo uma cascata de recompensa na tela. São ~10 lotes por dia em vez de 300 invocações chatas. É aqui que a **matadora hit-kill** justifica ser Mítico−: ela transforma um lote de 30 bosses em um golpe.

⚠️ **Isso promove o C8 de opcional para necessário.** 300 bosses/dia × 100 jogadores = ~30.000 spawns/dia, concentrados em lotes. Boss de 25k–75k HP com partícula e AoE em lote de 30 é o pico de carga do servidor. Precisa de `max-simultaneous` global de bosses e entra no teste de carga com prioridade — junto com os encantes de classe D/E, é o que define quantos jogadores o dedicado suporta.

### Lei de projeto: nunca pode compensar ficar parado

O modo mais comum de uma economia de RankUP morrer: o jogador descobre que comprar 400 spawners de galinha rende mais que subir de tier, e passa a temporada inteira no tier 3. Você levantou isso e está certo — **e não pode ser resolvido com "a gente confere depois", tem que ser uma desigualdade matemática que vale para todo N.**

**A regra:** para todo tier N, subir para N+1 tem que ser melhor que qualquer coisa que se possa fazer permanecendo em N.

Quatro travas fazem isso valer, e três delas já estão no desenho:

**1. Escassez de slot.** `spawnerslimite` é linear e cobrado em dracmas (tempo). O jogador não tem 400 slots — ele tem poucos, então **cada slot deve conter o melhor spawner que ele consegue pagar.** Renda = `slots × valor por slot`, e quantidade não é comprável em volume.

**2. O teto de empilhamento é finito e o valor por tier não é.** Este é o número que fecha a questão:

| | Multiplicador máximo |
|---|---|
Empilhamento total de um spawner (`mob-stack 3` × `spawner-stack 512`) | **1.536×** |
Ganho de valor por tier | **8× por tier** |

Como `8³ = 512 < 1.536 < 4.096 = 8⁴`:

> **Empilhar um spawner ao máximo vale ~3,53 tiers. Estar 4 tiers atrás não é compensável por upgrade nenhum.**

Isso é uma folga bem calibrada: investir nos upgrades deixa você "socar 3 tiers acima do seu", o que é uma recompensa real e sentida — mas nunca substitui progredir. E a conta é auditável: qualquer mudança em `mob-stack`/`spawner-stack` muda esse 3, então esses dois campos passam a ser números críticos, não decoração.

**3. O portão de cabeças força a fronteira.** Rank N+1 exige cabeças de **mob N**, e só o spawner N produz cabeça de mob N. Um jogador parado no tier 3 não consegue cabeça de Slime, logo não passa do rank 12 — e sem rank não compra spawner novo. **A progressão não é incentivada, é obrigatória.** Ficar parado não é uma estratégia lenta, é um beco sem saída.

**4. Bônus de rank e prestígio pagam por progredir, não por acumular.** O +1% por rank e os desbloqueios de marco de prestígio são ganhos que **só existem subindo**. Quem fica parado não perde nada hoje, mas para de ganhar coisa nova para sempre — e é exatamente o tipo de progressão constante que o público quer.

**O mesmo vale para as máquinas A–O:** cada máquina vive na sua banda e é superada. A regra é a mesma — a trilha de upgrade de uma máquina vale ~3 bandas, nunca mais que isso.

**A armadilha que o simulador achou: o vale de substituição.** Se os slots forem escassos e **fixos**, o jogador precisa **trocar** um spawner maxado do tier N por um **nu** do tier N+1 no mesmo slot — e isso deixa aquele slot **192× pior** (`1.536 ÷ 8`) até ser re-empilhado.

> **O `spawnerslimite` PRECISA crescer durante a temporada.** O jogador tem que poder **adicionar**, não trocar. Com slots fixos, subir de tier vira punição — exatamente a estagnação que a lei existe para evitar. Isso não contradiz "slots são escassos": seguem escassos **em cada momento**, mas o total cresce ao longo dos 20 dias. Escassez de fluxo, não de estoque.

**Como isso é verificado, e não assumido.** O simulador roda, para **cada tier N de 1 a 19**, a comparação: *"qual a melhor renda possível permanecendo em N com todo o dinheiro investido em quantidade e upgrades, versus a renda subindo para N+1?"*, e reporta o vale de substituição. Se em qualquer N a resposta for "ficar", a curva está errada e a fase não fecha. É o teste mais importante do simulador, porque é o único que pega um erro que só apareceria no dia 15 com o servidor cheio.

### Lei de projeto: coins não pode ditar o servidor

O problema que você descreveu — jogador foca só em coins e domina tudo — não se resolve com preço, se resolve com **estrutura**. A regra: **coins compram a entrada, a moeda secundária compra a profundidade.** Cada via tem uma secundária que coins não compram, então nenhuma quantidade de coins maximiza nada sozinha.

| Via | Entrada (coins) | Profundidade (secundária, coins não compram) |
|---|---|---|
Mineração | acesso à mina, resets | **gemas** → os 15 encantes |
Fazenda | upgrade de planta | **sementes** → os 10 encantes |
Pesca | vara | **corais** → skins, livros, limites |
**Spawners** | preço do spawner | **dracmas** → as 3 trilhas de upgrade e os livros da espada |

E o passo que amarra tudo: **comprar o spawner N exige rank N + coins do tier N + dracmas.** São três portões de naturezas diferentes:

| Portão | Natureza | O que impede |
|---|---|---|
Rank N | permissão | pular a escada |
Coins do tier N | exponencial | comprar antes de ter renda para sustentar |
**Dracmas** | **linear no tempo de kill** | **comprar todos os 20 de uma vez** |

Esse terceiro portão é o mais importante e é o que faltava. Como dracmas só saem de matar mob e acumulam **linearmente com o tempo**, elas não escalam com riqueza. Um jogador que ganhou muito coins — vendendo cabeças, ganhando aposta, comprando no site — **não consegue converter isso em spawners**, porque falta o tempo de kill. É um teto de velocidade que dinheiro não atravessa, e é exatamente por isso que ele deve existir.

Consequência de calibração: **o custo em dracmas do spawner N tem que ser plano ou crescer devagar** (linear, não geométrico). Se crescer junto com o tier, vira um segundo exponencial em cima do primeiro e a curva sai de controle. Alvo: o custo em dracmas do spawner N ≈ **0,8–1,2 dia de kill de uma conta AFK no tier N−1**. Isso é o que faz "um tier por dia" ser verdade por construção, e não por sorte.

Isso também recoloca o `dracmas` como a peça que faltava para as 4 vias serem de fato simétricas: mineração/gemas, fazenda/sementes, pesca/corais, spawners/dracmas.

### Orçamento de cash

| Fonte | Hoje | Alvo |
|---|---|---|
`GarnixDailyRewards/rewards/membro.yml` | `cash add 50` → 900/temporada | **20/dia** → 360 ✅ |
`vinculado.yml` (Discord) | 50 | **+8/dia**, permanente, para todo vinculado |
Dailies VIP | 100–500/dia | **40 (celestial) → 120 (garnix)**, ascendente na hierarquia real |
**21 arquivos de eventos** | `cash add 5000–15000` | prêmio principal em **coins**; cash só num subconjunto difícil, **10–40** |
Conquistas / marcos raros | não existe | 25–100, gate duro |

Total de temporada, conferido no simulador: **free 400**, free vinculado 560, com eventos 860, com a máquina de cash 960, garnix 2.960. Whale compra no site, teto de exagero 500K.

### Vínculo Discord — onboarding e orçamento

A primeira vinculação dá **Celestial (VIP de entrada) por 3 dias**, 1× por conta de Discord. Praticamente todo jogador ativo vai vincular, então na prática **os dias 1–3 da temporada têm o servidor inteiro com o VIP de entrada ativo.** Isso é bom e é intencional — mas tem duas consequências que entram no cálculo:

1. Dias 1–3 são T3–T5, onde a renda diária da casa vai de 10⁴ a 10⁶. O bônus do Celestial aplicado aí custa muito pouco em coins absolutos (~10⁵ no total dos 3 dias) e vale muito em sensação de progresso. **É o melhor lugar possível para dar VIP de graça** — não distorce nada e ensina o valor do VIP na hora em que o jogador está decidindo se fica.
2. O bônus do Celestial **entra no teto de 100× de multiplicadores** como qualquer outro. Como todo mundo tem nos dias 1–3, o valor-base dos tiers T3–T5 deve ser calibrado **com** o bônus ligado, não sem — senão os dias 1–3 vêm inflados e o dia 4 parece uma punição quando o VIP expira.
3. A recompensa diária de vinculado (`vinculado.yml`) é um **faucet permanente de cash para toda a base**, não um bônus de VIP. Orçado em +8/dia = +144 na temporada, o que leva o free vinculado de 360 para ~500.

**Corrigir a inversão da hierarquia VIP.** Hoje três tabelas discordam e só uma está certa dado que celestial é o mais básico:

| Tabela | celestial | imortal | supremo | garnix | veredito |
|---|---|---|---|---|---|
`GarnixServerShops/discounts.yml` | 3 | 5 | 10 | 15 | ✅ **correta** — é a referência |
`GarnixSpawners/ranks.yml` + `GarnixMachines/ranks.yml` | 25 | 20 | 15 | 10 | ❌ **invertida** |
`GarnixVips/vips/*.yml` `weight` | 110 | — | — | menor | ❌ invertida |
`GarnixVips/vips/*.yml` lore | anuncia −10%/+10% em todos | | | | ❌ não corresponde a nenhuma |

Faixas de preço do cash-shop (a definir na Fase 7, mas o esqueleto):

| Faixa | Preço | Alcance | Conteúdo |
|---|---|---|---|
A | 50–500 | free chega | consumíveis, 1 chave, cosmético, booster curto |
B | 500–3.000 | free dedicado chega em 1 item | armadura T-III, skin média, +1 limite |
C | 3.000–20.000 | pagante | armadura T-IV/V, skin de topo, pacote de boosters |
D | 20.000–100.000 | whale | VIP, bundles de temporada |

---

## Ranking Geral de Itens Apelões

Entregável que você pediu, e é ele que decide o que vai para o site. Score = impacto multiplicativo na renda.

| # | Vantagem | Impacto | Onde está | Canal proposto |
|---|---|---|---|---|
| 1 | **`spawnerslimite`** (+1 spawner) | multiplica a única via **sem teto físico**. O item mais apelão do servidor | `GarnixFishing/shop.yml`, comando | Site (faixa C) + rota in-game **lenta**: corais com câmbio decrescente e teto diário |
| 2 | **Booster de coins 2×** | multiplicativo sobre tudo, 3 slots simultâneos | 6 plugins, **hoje só por comando admin** | Site (faixa A/C por duração) + drop raro de crate/boss |
| 2b | **`pilhagem` na espada de spawner** (livro) | multiplicador de drop **2,0× no máximo**, direto na via sem teto | `GarnixSpawners/sword.yml` | Site (faixa C) + drop raro de crate/boss/caixa. **O livro mais apelão do servidor** |
| 3 | **`fortunate` / `prosperity` nível alto** | até **7,98×** após correção | `GarnixMining/enchants/`, `GarnixFarm/enchants/` | 100% in-game (gemas/sementes) — **nunca no site** |
| 3b | **`massacre` / `ceifador`** (livros) | throughput de kill → cabeças **e** coins | `GarnixSpawners/sword.yml` | Misto: níveis 1–3 in-game, 4–5 site + rota difícil |
| 3c | **`speed` / `double` / `luck` da vara** (livros) | dobram o throughput da via **mais estrangulada** do servidor | `GarnixFishing/enchants.yml` | In-game via pesca/caixas de pesca; níveis de topo no site |
| 4 | **Armadura T-V + skin de topo** | +48% + 65% = 2,13× | 60 arquivos `armors/`, 3 `skins.yml` | **Armadura: nunca no site**, só via caixa. **Skin: caixa + forja, e as 3 mais raras também direto no site** |
| 5 | **Bônus VIP** (ganho + desconto) | permanente, aplica em tudo | `GarnixSpawners/ranks.yml`, `GarnixMachines/ranks.yml`, `discounts.yml` — **valores fictícios, a projetar** | Site (VIP) + chave de VIP temporário via `GarnixFragments` + **Celestial 3 dias grátis no vínculo Discord** |
| 5b | **Bônus de rank** (só ganho, sem desconto) | permanente, 20 incrementos pequenos | **não existe ainda** — `GarnixRankUP/config.yml` tem `commands: []` | 100% in-game. É a compensação do jogador sem VIP |
| 1b | **Combustível infinito** | 1 máquina roda sem sink recorrente. Valor = exatamente o custo do combustível comum | `GarnixMachines/fuels.yml` (hoje `default`/`infinite`, **sem preço**) | Site (faixa C/D) + drop raro. Movível, mas **ativo em 1 máquina por vez** — o teto é natural. **O item mais raro do servidor** |
| 1c | **Matadora hit-kill** | converte volume de chave de boss em volume de recompensa. Com ~45 bosses/dia, é um multiplicador de faucet inteiro | `GarnixBosses/swords.yml` (tier `hk`) | Site (faixa D) + jackpot. **Raridade quase no nível do combustível infinito** |
| 6 | **Autosell do galpão** | contorna o `initial-limit: 1500`, que é o gargalo da via do cacto | `GarnixWarehouse/config.yml` (cash 1.000–3.000, **hoje inalcançável para free**) | **Só cash** + drop raro. Reprecificar para 150–800/nível |
| 7 | Chaves de crate | variância, não renda direta | `GarnixCrates` | abundante in-game (~5.000/dia no endgame) |
| 7b | **Caixas misteriosas** | invólucro de score 7, **conteúdo de score 1–4** | `GarnixMysteryBoxes` | Caixa **I** in-game; caixa **II** vendida no site + in-game beeem raro; `garnix` no topo |
| 8 | Kits, homes, linhas de baú, slots de market/leilão | conveniência | `GarnixEssentials`, permissões `.limit.<N>` | ✅ **valores atuais já corretos, não mexer.** São **exclusivamente vantagem de VIP** — nunca distribuídos como recompensa, drop ou prêmio |
| 9 | Tags, cosméticos, preview | **zero** impacto | `GarnixVips`, cash-shop | Site à vontade |

**Princípio de distribuição:** score 1–2 → site + rota in-game deliberadamente sofrida (é aqui que mora a receita). Score 3 → nunca no site (é a recompensa do jogador dedicado). Score 4–6 → misto. Score 7+ → fácil in-game.

---

## Arquitetura de bônus — VIP vs rank

Todos os bônus e descontos de VIP/influencer hoje em config são fictícios e serão reprojetados. E ranks vão passar a dar bônus próprios, **só de ganho, sem desconto**, para compensar quem não paga.

A separação limpa que isso permite:

| | Ganho (+% renda) | Desconto (−% custo) |
|---|---|---|
**Rank** (grátis, 20 degraus) | ✅ sim | ❌ não |
**VIP** (pago) | ✅ sim | ✅ **exclusivo** |

Isso faz o desconto ser a proposta de valor real do VIP — e ranks nunca erodem essa proposta, porque ranks só empurram renda. Um sem-VIP ganha quase o mesmo por hora que um VIP, mas o VIP compra spawner e loja mais barato, o que no fim se traduz em avançar de tier ~meio dia antes. É P2W perceptível e não humilhante.

E o bônus de rank resolve diretamente o que você levantou sobre o jogador de RankUP: **20 ranks × +1% cumulativo = 20 incrementos pequenos e sempre visíveis.** É progressão constante que aparece no actionbar a cada rank, sem nunca ameaçar a curva.

### Onde isso mora tecnicamente

`GarnixSpawners/ranks.yml` e `GarnixMachines/ranks.yml` já são **tabelas indexadas por permissão** (hoje `permission: vip.*`) com campos `discount` e `bonus`. Então ranks entram nas mesmas tabelas com `permission: rankup.rank.<n>`, sem código novo — só entradas novas com `discount: 0`. As permissões de rank saem de `GarnixRankUP/ranks/*.yml` → `commands:` (`lp user {player} permission set rankup.rank.<n> true`). O `commands: []` do prestígio recebe o mesmo tratamento.

### Orçamento de multiplicadores (este é o número que trava tudo)

Teto total: **100×**. Percentuais somam entre si; multiplicadores nomeados multiplicam. Como fica gasto, na via de mineração (referência):

| Fonte | Máximo | Tipo |
|---|---|---|
Armadura T-V (4 peças × 12%) | +48% | somado |
Skin de topo | +65% | somado |
**Bônus de rank 20** | **+20%** | somado |
**Bônus VIP garnix** | **+15%** | somado |
| **subtotal percentual** | **+148% → 2,48×** | |
`fortunate` nível 100 (após correção) | **7,98×** | multiplicativo |
Frenzy (uptime real, não 2,0 nominal) | 1,5× | multiplicativo |
**Booster 3×** (o mais forte que existe) | **3,0×** | multiplicativo |
| **total** | **≈100×** | ✅ exatamente no teto |

⚠️ **O booster de 3× consome o orçamento inteiro.** Como você definiu que existem boosters de 3× (site e, muito raramente, in-game), o teto tem que ser calculado com 3× e não com 2× — e a folga tem que sair de algum lugar. Sai do `fortunate`: `increase-multiplier` **0,07** em vez de 0,13, o que dá **7,98×** no nível 100 em vez de 13,9×. Com 0,08 o total ia a 110× — o simulador pegou, porque o +25% do prestígio 500 também entra na conta. Sem ajuste nenhum o total vai a 155×, e aí o bloco do T1 teria que valer 0,006 coin: arredonda para zero e a primeira hora de jogo não paga nada.

Na via passiva o orçamento é menor de propósito, porque ela roda 24h contra 3h e não tem teto físico:

| Fonte | Máximo | Tipo |
|---|---|---|
Bônus de rank 20 + VIP garnix | +35% → 1,35× | somado |
`pilhagem` 3 (livro) | 2,0× | multiplicativo |
**Booster de drops 3×** | **3,0×** | multiplicativo |
| **total de valor** | **≈8,1×** | ✅ |

(`massacre` e `ceifador` são throughput, não valor — entram no cálculo de cabeças/h, não aqui.)

### Escalas propostas

| VIP | ganho | desconto |
|---|---|---|
celestial (entrada) | +4% | −3% |
imortal | +7% | −6% |
supremo | +11% | −10% |
garnix (topo) | +15% | −15% |

Não acumulam — vale o maior, como o header do `discounts.yml` já documenta. Investidor e influencer são tags de parceria: mesmo ganho do garnix, sem desconto, para não criarem uma via de receita paralela.

| Rank | ganho cumulativo |
|---|---|
1–5 | +1% por rank → +5% |
6–10 | +1% por rank → +10% |
11–15 | +1% por rank → +15% |
16–20 | +1% por rank → **+20%** |

Linear e chato de propósito: previsível, sempre visível, e nunca é a razão pela qual alguém dispara ou trava. **Não tierar o bônus de rank** — se ele crescesse geometricamente junto com o tier, dobraria o exponencial que já está no valor-base e a curva perderia o controle.

### Armaduras e skins — também a projetar

Os valores atuais (1,5/3/5/8/12 por peça e 2→65 nas skins) são fictícios; a consistência entre os 3 plugins é coincidência de copy-paste, não projeto. Ficam com a fatia maior do orçamento percentual porque são a progressão de equipamento que o jogador persegue a temporada inteira.

**Armadura — 5 tiers × 4 peças, por atividade** (`Garnix{Mining,Farm,Fishing}/armors/{helmets,chestplates,leggings,boots}/tier-{i..v}.yml`, 60 arquivos):

| Tier | por peça | conjunto | moeda primária / secundária |
|---|---|---|---|
T-I | +2% | +8% | coins / gemas·sementes·corais |
T-II | +4% | +16% | idem |
T-III | +6,5% | +26% | idem |
T-IV | +9% | +36% | idem |
T-V | **+12%** | **+48%** | idem |

São **20 eventos de upgrade** por atividade (5 tiers × 4 peças) — cada peça trocada é um degrau visível. Manter as 4 peças com o mesmo valor dentro do tier: é o que permite o lore ser idêntico e o jogador entender a conta de cabeça. (Diferenciar por slot daria mais granularidade e uma decisão de prioridade, mas complica a comunicação — fica como opção, não como padrão.) O bônus secundário (gemas/sementes/corais) segue ~⅔ do primário, porque essas moedas são lineares e não devem inflar junto.

**Skins — escada com forja** (`skins.yml` dos 3 plugins, 9–10 tiers): a corrente de forja "7 skins iguais → a próxima" é o loop de grind mais longo do servidor e a skin de topo é o item de status da temporada.

| Faixa | Bônus primário | Rota |
|---|---|---|
Skin 1 (default) | 0% | inicial |
Skins 2–6 | +3% → +25%, degraus crescentes | forjável, drop de crate/caixa |
Skin 7 (teto de forja) | +32% | fim da corrente forjável |
Skins 8–10 | +42% / +53% / **+65%** | só crate/caixa/site, `glow: true` |

O corte no 7 é o que já existe (`forgeable: false`) e é bem colocado: quem só joga chega ao 7; os três últimos exigem sorte, tempo ou site — exatamente a sua regra de "obtenível jogando, mas mais difícil".

**Duas lacunas a resolver junto:** armadura **não tem rota de aquisição nenhuma** em config hoje (sem custo, sem forja, sem produto, sem entrada em crate) e **não existe campo de bônus de conjunto** — as 4 peças só somam (mudança de código C4, opcional). Definir a rota de cada tier de armadura é parte da Fase 5.

---

## Hierarquia de encantamentos por custo de infraestrutura

Princípio: **quanto mais caro o encante é para o servidor, mais raro ele ativa, mais alto ele fica na hierarquia, e mais recursos ele entrega por ativação.** Isso protege o TPS do dedicado com 250 contas e, ao mesmo tempo, faz o encante caro parecer premium — o jogador vê pouco, mas quando vê, ganha muito.

**Os configs de hoje fazem o oposto.** Os 5 encantes mais caros de mineração (`snake`, `blaze`, `kraken`, `meteor`, `wither` — todos spawnam entidades móveis com animação longa) têm `base-chance: 2,5`, que é a **maior** chance do arquivo. Os baratos (`demolition` 0,15, `colapse` 0,20) são os mais raros. E `annihilation` com `base-chance: 60` destrói a camada inteira da mina (59×59 = 3.481 blocos) **60% das vezes já no nível 1**.

### Classes de custo

Os vetores de custo real: block updates + física, pacotes de partícula, spawn de entidade, duração da animação (concorre pelo orçamento de pacotes), e alvos simultâneos.

| Classe | Custo de infra | Encantes de mineração | chance no nível 100 | blocos/proc | Posição na hierarquia |
|---|---|---|---|---|---|
**A** | nenhum — passivo ou multiplicador puro | `accelerated`, `fortunate`, `gemmed`, `blessed` | passivo / alto | 1 | base, desbloqueio nível 0–5 |
**B** | poucos updates, partícula estática | `lighthing`, `rupture`, `explosive`, `demolition` | 3–8% | 1–27 | baixa, nível 10–20 |
**C** | esfera de raio 3, muitos updates | `colapse` | 1,5–2% | ~113 | média, nível 30 |
**D** | **entidades móveis + animação longa** | `snake`, `blaze`, `kraken`, `meteor`, `wither` | **0,4–0,8%** | 24–126 | alta, nível 35–50 |
**E** | **camada inteira da mina** | `annihilation` | **0,10–0,15%** | 3.481 | topo, nível 60 |

### Como o "paga mais por ativar menos" se realiza

Na maior parte, **de graça, pela própria contagem de blocos**: `annihilation` a 0,12% × 3.481 blocos = ~4,2 blocos esperados por bloco manual. Raro de ver, enorme quando acontece. É a mecânica de jackpot que jogador de RankUP adora, e sai sem código novo.

O que muda em cada eixo, por classe:

| Eixo | A → E |
|---|---|
Chance | alta → **muito baixa** (2 ordens de diferença) |
Blocos/recursos por proc | 1 → **3.481** |
Custo em gemas/sementes | barato → **caro** (a árvore de classe D/E deve ser o último gasto da temporada) |
Nível de desbloqueio | 0 → **60+** |
`max-level` | 100 → **menor nos caros**, para não haver 100 degraus de algo que custa 3.481 block updates |
`max-simultaneous` | ausente → **obrigatório** (hoje só `snake` tem, com valor 3) |

### Travas de infraestrutura a definir junto

- **`GarnixMining/config.yml` `enchant-animation-budget: 0`** — hoje **ilimitado**. O próprio comentário do arquivo mede 500 mineradores no nível máximo em 77.000 pacotes/tick e recomenda 10.000. Definir 10.000 e validar com carga real. Detalhe importante e correto do design existente: quando o orçamento estoura, o jogador **perde a animação mas recebe o pagamento** — degradação justa, não punitiva.
- **`GarnixFarm/config.yml` `enchant-max-simultaneous-global: 80`** — mesma lógica no farm; proc bloqueado ainda paga a colheita.
- **`max-simultaneous` por encante** nas classes D e E, não só no `snake`.
- **Teto de throughput da mina** — `reset-cooldown: 30` limita a 1,6×10⁷ blocos/h. Hoje a árvore de AoE soma ~2.600× de throughput, **mais do que a mina consegue entregar**. Acima do teto, subir chance de AoE não gera nada e só queima CPU. As chances das classes C/D/E têm que ser calibradas **contra esse teto**, não contra a sensação.

Isso vira também um item do Ranking de Apelões: um encante de classe E no nível alto é score 3 (nunca no site), mas o **custo de infra** dele é o que decide o teto de jogadores simultâneos que o servidor suporta — ou seja, é a única entrada do ranking que tem custo de hospedagem, e por isso entra no orçamento de verdade e não só no de diversão.

---

## A economia de livros — o terceiro canal

Existem **três sistemas de livro**, todos com a mesma mecânica (item de loot que aplica nível num equipamento), e nenhum deles tem preço em config hoje. São o canal perfeito para a sua regra "tudo do site é obtenível jogando, alguns mais difíceis": um livro é um **item**, então cai de crate/caixa/boss e circula em market/leilão/baú-loja — e ao mesmo tempo pode ser vendido no cash-shop.

| Sistema | Arquivo | Encantes | Efeito econômico |
|---|---|---|---|
**Espada de spawner** | `GarnixSpawners/sword.yml` | `massacre` 1–5 (raio, `value: 2/4/8/16/-1`, sendo −1 = ilimitado), **`pilhagem` 1–3 (`1,25 / 1,5 / 2,0` multiplicador de drop)**, `ceifador` 1–3 (instakill 25/50/75%) | `pilhagem` é multiplicador direto na única via sem teto físico. `massacre` + `ceifador` são throughput de kill → **cabeças**, que é a moeda do rankup |
**Espada de boss** | `GarnixBosses/swords.yml` + `config.yml` `kill-stack-item` | `default` 500 → `sombria` 750 → `ancestral` 1500 → `hk` (**hit-kill**) | controla a taxa de faucet dos bosses. `hk` trivializa os 3 bosses (25k/50k/75k HP) e transforma boss em renda previsível |
**Vara de pesca** | `GarnixFishing/enchants.yml` | `speed` 1–5 (segundos a menos no intervalo), `luck` 15/30/50/75/100% (peso de `rare`), `double` 5/10/18/28/40% | age sobre a via **mais estrangulada** (504 fisgadas/h). `speed` 5 leva o intervalo de 15s para 10s = **1,5× throughput**; `double` 40% = 1,4×. Juntos ~2,1× |

### Regras de projeto para os livros

1. **Livros entram no teto de 100× de multiplicadores.** A espada de spawner no máximo (`pilhagem` 2,0 × `ceifador` 75% × `massacre` ilimitado) somada a bônus VIP e booster já consome boa parte do orçamento da via passiva. O valor-base do drop do spawner tem que ser calibrado **assumindo espada no máximo no fim da temporada**, não espada limpa.
2. **A taxa de faucet de livro é o freio da temporada.** Como livro não tem preço em coins, não existe "ficar caro" — se um livro cai fácil, o multiplicador vem cedo e a curva de tiers desanda. Portanto: chance de drop por banda de tier, e o livro de nível N só cai em crate/caixa/boss da banda N. Isso usa exatamente o gate que já existe.
3. **`pilhagem` é o item de receita.** É o mais apelão dos três e o único cujo efeito é puramente multiplicativo sobre renda. Vai para o site (faixa C) **e** para o drop raro. Ninguém fica sem rota, mas quem paga chega semanas antes — que é o comportamento do "jogador que gema" que você descreveu.
4. **`speed`/`double` da vara não vão para o site nos níveis baixos.** A pesca é a via mais fraca; níveis 1–3 têm que ser acessíveis in-game ou a via inteira fica inviável para quem não paga. Níveis 4–5 no site.
5. **Livros são itens tradeáveis** — vão circular em market/leilão/baú-loja com a taxa de 10%. Isso é bom (cria mercado, dá função ao comércio), mas o simulador precisa checar se com 250 jogadores o preço de livro colapsa e antecipa o multiplicador de todo mundo.
6. **`GarnixFishing/enchants.yml` não tem custo nenhum em config** — é 100% book-only hoje. Confirmar se é intencional; se sim, os 3 encantes de pesca dependem inteiramente das tabelas de loot da Fase 5 e não podem ser esquecidos lá.

---

## Fase 0 — Verificações antes de escrever qualquer número

Nenhum número é seguro até estas 5 respostas existirem, porque cada uma pode mover o teto. Você já disse que quer testar in-game cronometrando — **estes são os primeiros testes.**

| # | Teste | Por quê |
|---|---|---|
| V1 | `/coins set <você> 1000000000000000000000` e ler scoreboard, `/coins ranking` e actionbar da mina | O formatter `SUFFIX` é **hardcoded** — não existe tabela de sufixos em nenhum YAML do repo. Se a tabela para em quintilhão, 10²¹ vira lixo ou estoura exceção no render, que roda a cada tick |
| V2 | Pôr `drops.coins.amount: 10000000000000000000000` num spawner e `costs: ['coins 400000000000000000000']` num rank | Campos de spawner/máquina/crate/shop são **inteiros YAML crus** → teto 9,22×10¹⁸. SnakeYAML promove pra BigInteger e `getLong()` **trunca mod 2⁶⁴ sem log**. T18–T20 estouram |
| V3 | Equipar set T-V sozinho e ler o valor no actionbar; somar skin Mithril; somar `fortunate` 1 | Preciso saber se `percent: true` soma ou multiplica. **Todo o orçamento de multiplicadores pivota nisso** |
| V4 | Matar mob de spawner e ver se `/gema` mexe | Os 20 `spawners/*.yml` usam a chave **`gems`**, mas o ID da moeda é **`gemas`**. Se não é alias, todo drop e todo custo de upgrade em gema está silenciosamente falhando |
| V5 | Cronometrar: blocos/min manual na mina, kills/h de 1 spawner com autoclick, fisgadas/h, colheitas/h | São os 4 tetos de throughput físico. Sem eles a equivalência das 4 vias é chute |
| V6 | Prestigiar numa conta de teste com spawners colocados e ver se **eles param de funcionar** ao perder a permissão de rank | Se pararem, prestigiar é catastrófico e o sistema inteiro precisa de outro desenho. Decide se a proposta de prestígio é viável |
| V7 | Ver se o proc de chave (`blessed`) dispara em bloco quebrado por **AoE** ou só manual | Se dispara em AoE, o volume de chaves é 500× o projetado e a crate inteira vira sem sentido. Define se C7 é necessário |
| V8 | Ler no código do GarnixRankUP se `prestige.cost-increase-percent: 10` é **composto ou linear**, e se o aumento **aparece no `/ranks`** | Composto dá `1,10^500` = 4,9×10²⁰× o custo base — inatingível e estoura o tipo. Linear dá 51× no prestígio 500, viável. Decide se prestígio até 500 é representável |

Tetos que já calculei dos configs, para você conferir contra o cronômetro:

| Via | Teto teórico | Governado por |
|---|---|---|
Mineração | 1,6×10⁷ blocos/h | região da mina (135.700 blocos) ÷ `reset-cooldown: 30` |
Farm | 4,1×10⁶ colheitas/h | 22.735 posições ÷ `regrow-delay-seconds: 20` |
Pesca | ~504 fisgadas/h | `fishing-base-interval-seconds: 15` − speed 5, × `double` 40% |
Passivo | **sem teto** | `s.limite` × `mob-stack` ÷ `delay` |

---

## Fase 1 — Diretório de trabalho, documento mestre e simulador

Todo o material de economia vive em **`GARNIX - ECONOMIA/`**, dentro do repo. É o diretório de trabalho: o plano mora lá e é atualizado conforme decidimos coisas novas, e todo arquivo que criarmos para usar ou revisar vai para lá também.

```
GARNIX - ECONOMIA/
├── 00-PLANO.md              este plano, vivo — atualizado a cada decisão nova
├── 01-ECONOMIA.md           documento mestre (fonte da verdade)
├── 02-TIERS.md              tabela T1–T20 completa e expandida
├── 03-RANKING-APELOES.md    ranking de itens/vantagens + canal de aquisição de cada um
├── 04-PARIDADE-SITE.md      cada produto do site ↔ sua rota in-game e o custo em horas
├── 05-MULTIPLICADORES.md    orçamento de 100× detalhado por via
├── 06-ENCANTES.md           classes A–E de custo de infra, chances, custos, travas
├── 07-LIVROS.md             os 3 sistemas de livro e as tabelas de loot de cada nível
├── 08-CASH.md               orçamento de cash: faucets, sinks, faixas de preço
├── 09-VERIFICACAO.md        protocolo de testes V1–V8 + resultados medidos
├── 10-ITENS.md              os ~212 itens ativáveis: força, rota, preço, tier, raridade
├── 11-CACTO.md              a via do cacto: reinvestimento, freios, paridade
├── metrics.csv              metas de cronometragem por tier vs medido in-game
└── sim/                     simulador (JavaScript)
    ├── sim.js               motor da simulação
    ├── params.js            perfis de jogador, modelo de 3 contas, parâmetros
    ├── index.html           roda no navegador, zero instalação
    └── README.md
```

Os três entregáveis de controle. Nada de YAML muda antes deles.

1. **`01-ECONOMIA.md`** — arquitetura de moedas, renda-alvo por tier/dia/hora/conta, orçamento de sinks, orçamento de cash, e a regra de derivação (`número = f(tier)`). Fonte da verdade: todo YAML editado cita o tier de onde o número saiu.
2. **`sim/`** — simulador em **JavaScript** (sem Python). Lê os YAMLs reais do repo, simula os 20 dias para os 3 perfis (casual 1h, dedicado 3h, hardcore 8h) × modelo de 3 contas, e cospe: riqueza acumulada por dia, renda/h por via, tempo até cada rank, prestígios alcançados, gemas/sementes/corais/dracmas acumulados vs custo da árvore de encantes e dos upgrades, cabeças/h vs custo do próximo rank, volume de chaves/dia, e cash acumulado. Roda com 50 / 100 / 250 jogadores para checar liquidez de mercado, concentração de cash e escassez de cabeças na fronteira.

   Duas formas de rodar, e **`index.html` é a principal**: abre no navegador com dois cliques, sem instalar nada, e mostra as curvas em gráfico. `sim.js` roda no Node se você preferir terminal. Como os valores passam de `Number.MAX_SAFE_INTEGER` (9×10¹⁵) a partir do T15, o simulador usa **`BigInt`** nos coins — o mesmo cuidado que o C1 pede nos plugins.
3. **`metrics.csv`** — por tier, os valores que você mede in-game cronometrando (blocos/min, coins/h ativo, coins/h AFK, cabeças/h, fisgadas/h, colheitas/h), a meta calculada, e a tolerância (±25%). É o arquivo que fecha o loop entre o modelo e o servidor real.

---

## Auditoria de itens — 212 itens, 162 sem rota nenhuma

Você estava certo em insistir nisso, e o resultado é o achado mais importante da auditoria inteira. Varri os 37 diretórios de plugin e ~430 YAMLs procurando **todo item que vai para o inventário do jogador e é ativável ou consumível**.

| Métrica | Valor |
|---|---|
Itens ativáveis distintos (contando cada variante/tier/nível) | **~212** |
Templates de config que os geram | 48 |
Com rota de aquisição em config | ~50 |
**Sem nenhuma rota** — só comando de admin, ou nada | **~162 (76%)** |
**Com efeito econômico e sem custo definido** | **28 grupos** |
**Preços de item definidos no repo inteiro** | **6** |
Caixas misteriosas funcionais | **0 de 7** |
Crates com recompensa real (não-template) | **0 de 6** |
Skins declaradas "só de caixa" e portanto inalcançáveis | **8** |
Subcomandos `give*` de admin | **32** |

As 6 rotas que existem hoje: vara de pesca (10.000 coins), máquina de madeira (1.000 coins), os 20 spawners (5B coins), limite de spawners (1.500 corais), a lâmina (`/lamina`, grátis) e a matadora inicial (`/matadora`, grátis).

### As 3 correntes quebradas mais críticas

1. **Skins de topo → caixas → nada.** 8 skins que valem até **+65% de renda** dizem "só sai de caixa". As 7 caixas retornam `NONE` 100% das vezes, e as 6 crates só dão pedra e diamante de template. A ponta mais forte da progressão de equipamento está apoiada no vazio.
2. **Combustível é o único sink recorrente do jogo e não é vendido em lugar nenhum.** Não existe preço para litro de combustível em nenhum arquivo — então hoje o uptime de máquina é grátis (via admin) ou impossível. E `giveinfinitefuel` remove o sink de vez, também de graça.
3. **Os 7 boosters não têm tabela de valores nem de preços.** Multiplicador e duração são **argumentos livres do comando** — um `2×` de 1h e um `100×` de 30 dias são literalmente o mesmo item de config. Não existe nada para auditar, precificar ou limitar. Isso precisa de tabela antes de qualquer preço.

### Itens de alto impacto hoje com custo zero

| Item | Onde | Por que dói |
|---|---|---|
**Combustível Infinito** | `GarnixMachines/fuels.yml → infinite` | elimina permanentemente o sink recorrente |
**Britadeira** | `GarnixMining/config.yml → drill` | perfura a coluna inteira, 3×3 por nível, **10 simultâneas**, sem cooldown. O maior throughput do jogo |
**Bombas ×4** | `GarnixMining/bombs.yml` | raio 2/4/6/8, 5 simultâneas, sem cooldown. Renda instantânea por área |
**Matadora Hit-Kill** | `GarnixBosses/swords.yml → hk` | ignora o HP de qualquer boss. Boss paga 50k coins + gemas + chave |
**Livro Massacre 5** | `GarnixSpawners/sword.yml` | `value: -1` = dano infinito |
**Livro Pilhagem 1–3** | idem | multiplicador de drop ×1,25 / ×1,5 / **×2,0** |
**60 peças de armadura** | os 3 plugins | set T-V = +48% na moeda primária. Nenhuma tem preço, nenhuma cai de nada |
**3 Forjas de Skin** | os 3 plugins | são o gate de todo o ladder forjável, e o gate custa zero |
**Vaga de Visitante** | `GarnixMining → slot-item` | renda passiva do dono (35% do XP dos visitantes + taxa até 40%), ×5 |
**Venda Automática** | `GarnixWarehouse/items/autosell.yml` | os *upgrades* custam cash, mas a **chave de entrada é grátis** |
**Papel VIP** | `GarnixVips → paper-vip` | item negociável que entrega desconto e bônus permanentes |
**Torre de Cacto** | `GarnixCactusTowers` | ergue farm pronta — horas de trabalho manual |
**Chave VIP** | `GarnixCrates/crates/vip.yml` | item existe, crate existe, **rota zero, nem admin documentado** |

### Bugs e divergências que o audit encontrou

| Achado | Onde | Efeito |
|---|---|---|
`givehandall` **clona o item da mão com NBT para todos os online** | `GarnixEssentials/messages.yml` | duplicação em escala de skin, booster ou matadora hk. Risco operacional sério |
`/crates givekey` e `/caixas give` aceitam **`*` = todos online** | `GarnixCrates`, `GarnixMysteryBoxes` | um comando errado distribui para o servidor inteiro |
`rank`/`order` dos 20 spawners **não têm efeito econômico** | `GarnixSpawners/spawners/*.yml` | o "Rank 20" custa e rende igual ao "Rank 1" |
`clover` aponta para `key-id: "fazenda"` mas a crate é `farm.yml` | `GarnixFarm/enchants/clover.yml` | provável mismatch — chave de farm pode não estar sendo entregue |
A lore do robô promete `Chance em raras: ×2.0` mas o arquivo **não tem `boost-multiplier`** | `GarnixCrates/robots.yml` | a lore mente para o jogador |
`/mina givevaga` (config) vs `/mina giveslot` (messages) | `GarnixMining` | nomes divergentes para o mesmo comando |
`givearmor <coleção>` entrega **o set T-V inteiro de uma vez** | os 3 plugins | atalho de admin que vale +48% |
Comandos econômicos que **só aparecem em mensagem de sucesso, não em nenhum `help`** | `/bosses givesword`, `/spawner givebook`, `/fragmentos give`, `/darfly`, `/darkit`, `/clearplot give` | fáceis de esquecer numa auditoria — inclui a matadora hk e o Massacre 5 |
As 8 moedas têm `aliases: ['give','dar']` no subcomando admin | `GarnixCurrencies/currencies/*.yml` | inclusive `cash` |

### Como isso entra no trabalho

Vira o entregável **`10-ITENS.md`** e uma fase própria (Fase 4b), porque não é um detalhe — é 76% dos itens do servidor. Para cada um dos ~212 itens, a tabela define: **valor/força · rota de aquisição · preço (moeda e quantia) · banda de tier · nível na escada de raridade · se conta no teto de 100× de multiplicadores.**

A regra que fecha o buraco: **nenhum item ativável pode existir sem rota e sem preço.** Se um item não deve ser obtenível pelo jogador, ele é removido do config, não deixado como comando de admin — porque item de admin sem preço é exatamente como economias de servidor vazam.

## Fase 2 — Mineração, a via de referência (commit atômico)

Mineração é calibrada primeiro e as outras três são ajustadas **contra ela**.

- **`GarnixMining/levels.yml`** — o arquivo mais importante do projeto (519 linhas, 21 grupos de bloco nos níveis 0,5,…,100 = T0–T20). Trocar a coluna `coins` de linear (1→12) para a escada exponencial ×3,6 (1 → 1,3×10¹¹). **Manter a coluna `gemas` linear** (0,2→3,8) — ela já está certa e é o que prova a regra "só coins é exponencial". Recalibrar a curva de XP para ~45–50h efetivas (hoje já está perto disso) e **corrigir o platô dos níveis 70–76** (crescimento cai de 12%/nível para 1,2%/nível e volta — 6 níveis quase grátis no meio da escada).
- **`enchants/fortunate.yml`**: `increase-multiplier: 1.0 → 0,07` (7,98× no nível 100). Hoje dá 100× e é 33× mais forte que o equivalente do farm. O valor 0,08 — e não 0,13 — é o que abre espaço para o booster de 3× dentro do teto de 100×. O mesmo vale para `prosperity.yml` do farm, para as duas vias ficarem pareadas.
- **`enchants/gemmed.yml`**: `1.0 → 0,02` (mantém gemas linear; é a razão de o sink de gemas evaporar hoje).
- **Reclassificar os 15 encantes nas classes A–E de custo de infra** e reescrever `base-chance`/`increase-chance`, `max-level`, `mine-level-unlock`, `max-simultaneous` e custo em gemas conforme a classe. Inclui `annihilation.yml` `base-chance: 60 → ~0,12` no nível 100 (classe E) e **baixar as chances de `snake`/`blaze`/`kraken`/`meteor`/`wither`**, que hoje são as maiores do arquivo sendo as mais caras (classe D).
- Recustar a árvore inteira para somar ~11h de renda linear de gemas, **com as classes D/E sendo o último gasto da temporada** (hoje a árvore custa 6,4×10⁸ gemas e é comprável em minutos se gemas subir junto com o tier).
- Definir **`enchant-animation-budget: 0 → 10.000`** (valor recomendado pelo próprio comentário do arquivo) e calibrar as chances de C/D/E contra o teto de 1,6×10⁷ blocos/h da mina.
- **`armors/*/tier-*.yml`** (20 arquivos) e **`skins.yml`**: reescrever com as escadas projetadas (armadura +2%→+12% por peça; skins 0→+65% com corte de forja no 7º). Os valores de hoje são fictícios. Fazer os 3 plugins com a mesma escada para que as 4 vias fiquem equivalentes, variando só a moeda secundária.
- **Teto de multiplicadores: 100× total (≤50× em regime).** A restrição vem de baixo, não de cima: se a pilha vale 1.000×, o bloco do T1 tem que valer 0,001 coin, arredonda pra zero e a primeira hora de jogo não paga nada. Com teto 100×, T1 = 1 coin exato.

Alvo pós-correção: percentuais 2,73× × `fortunate` 7,98× × frenzy 1,5× × booster 3× = **98,0×**, exatamente no teto.

**Frenzy fica no modo `volume`, como está** (1.000 blocos manuais → 2× por 3min), por decisão sua. Ele conta só bloco manual, excluindo encantes, drill e bombas — o que casa direto com a razão ativo:AFK de 20×, porque é um multiplicador que **só quem está de fato jogando consegue**. Uptime real ~50% (1.000 blocos a 5/s levam 200s contra uma janela de 180s), então entra no orçamento valendo 1,5× e não 2,0×. Vale registrar que ele é **perdido em restart do servidor** (é em memória) — se isso incomodar, é candidato a persistência, mas não é economia.

---

## Fase 3 — A escada: ranks, spawners, cabeças

Cada bloco é atômico — meio ladder precificado é pior que nenhum.

- **`GarnixRankUP/ranks/*.yml`** (20 arquivos, hoje 19 idênticos com `coins 15000` + `head COW 100`): custo = `coins 2×10^(N-1)` **com teto de 1×10¹⁸** (parte simbólica) + `head <MOB N-1> <n>`, onde **as cabeças são o gate real**. O requisito de cabeças cresce com o rank e é multiplicado pelo `cost-increase-percent` a cada prestígio — é a trava de ritmo do eixo de cabeças. Corrigir também `crate givevirtualkey` → verificar o alias real (`GarnixCrates/messages.yml` documenta `/crates`, plural) ou os 19 rankups falham silenciosamente ao dar a chave.
- **Bônus de rank** — cada `ranks/*.yml` recebe em `commands:` a concessão da permissão `rankup.rank.<n>`, e `GarnixSpawners/ranks.yml` + `GarnixMachines/ranks.yml` recebem 20 entradas novas com `bonus: <+1% cumulativo>` e `discount: 0`. Sem código novo — as tabelas já são indexadas por permissão.
### Prestígio — o que ele precisa ser para deixar de ser inútil

Hoje `GarnixRankUP/config.yml` tem `prestige.commands: []` e só `cost-increase-percent: 10`. Zero recompensa. A reclamação dos jogadores está correta.

**Sua proposta está certa e é o mínimo necessário:** uma lista de comandos que roda em *qualquer* prestígio (para remover as permissões de rank via LuckPerms) **mais** listas por nível de prestígio, com níveis vazios permitidos (definir 1, 2 e 5 e deixar 3 e 4 sem nada). Isso é a mudança de código **C6** e é a base de tudo o resto.

Mas só isso não resolve o problema de fundo, e vale dizer por quê. **Prestigiar hoje é uma troca ruim de forma estrutural:**

| O que o jogador perde | O que ganha |
|---|---|
os 20 kits cumulativos (~240 chaves/dia) | um número |
acesso a comprar spawners de tier alto | |
o bônus de rank (+20%) | |
os descontos e permissões ligados ao rank | |

Nenhuma recompensa pontual paga isso. O que resolve são três coisas juntas:

**1. Preservar o que dinheiro não compra.** O prestígio deve resetar **só a escada de rank**. Dracmas, cabeças, gemas, sementes, corais, equipamento, skins, livros e armaduras **ficam**. Isso transforma prestigiar de castigo em *volta rápida*: o jogador reescala os 20 ranks em uma fração do tempo porque já tem o estoque de cabeças e o equipamento no máximo. É assim que prestígio bom funciona — cada volta é mais rápida que a anterior.

**2. Bônus permanente pequeno e acumulativo.** Com centenas de prestígios alcançáveis, o bônus por volta tem que ser minúsculo: **+0,05% de ganho por prestígio**, somado. No prestígio 500 dá +25%, que cabe no teto de 100× junto com o resto. O que carrega a sensação de recompensa não é cada volta — são os **marcos**: a cada 10, 25, 50, 100, 250 e 500 prestígios, algo concreto acontece.

**3. Desbloqueio de conteúdo nos marcos.** É o que mais muda a percepção. Prestígio deixa de ser "um número no chat" e passa a ser **a chave de sistemas que só existem lá**. A flexibilidade que você pediu — definir recompensa no 1, no 2 e no 5 deixando 3 e 4 vazios — serve exatamente para isso: a maioria dos níveis dá só o +0,05%, e os marcos dão o conteúdo.

| Marco | Desbloqueia |
|---|---|
1 | trocador de dracmas (converter cabeça de tier baixo em dracma) |
5 | 4º slot de booster |
10 | slot extra de máquina especial |
25 | caixa misteriosa exclusiva de prestígio |
50 | tag/cosmético de prestígio |
100 / 250 / 500 | marcos de status, entrada no ranking e premiação de fim de temporada |

Além disso, prestígio é onde a **lei do número grande e frequente** se sustenta no endgame: quando o jogador já viu todos os 20 ranks, é o contador de prestígio que continua subindo, com marco visível sempre à frente.

**A trava de ritmo: o requisito de cabeças cresce com o prestígio.** É o que faz "centenas de prestígios" ser verdade sem virar farsa. O `cost-increase-percent` aplicado às **cabeças** (não só aos coins) faz cada volta pedir mais que a anterior, e como o throughput de kill do jogador também cresce (mais spawners, `massacre` maior, `mob-stack` maior), as duas curvas correm juntas e o prestígio sobe de forma constante toda a temporada. É o loop de progressão perpétua que o público quer.

**Calibração do `cost-increase-percent`, dependente do teste V8:**

| Se for | Valor a usar | No prestígio 500 |
|---|---|---|
Linear (+X% do base por prestígio) | **10%** | 51× o base |
Composto (`(1+X)^P`) | **1%** | 145× o base |

Com `10` **composto**, `1,10^500` = 4,9×10²⁰ vezes o base — inatingível e estoura o tipo numérico. Por isso V8 não é opcional. E você levantou o ponto certo: o aumento precisa **aparecer no `/ranks`**, senão o jogador paga mais sem entender por quê.

**3. Desbloqueio de conteúdo, não só de números.** Esse é o que mais muda a percepção. Prestígio deixa de ser "um número no chat" e passa a ser **a chave de sistemas que só existem lá**:

| Prestígio | Desbloqueia |
|---|---|
1 | trocador de dracmas (converter cabeça de tier baixo em dracma) |
2 | 4º slot de booster |
3 | slot extra de máquina especial |
4 | acesso à caixa misteriosa exclusiva de prestígio |
5 | tag/cosmético de prestígio + entrada no ranking de prestígio |

A flexibilidade de níveis vazios que você pediu serve exatamente para isso: alguns níveis dão desbloqueio, outros só o bônus de +8%, e você decide onde colocar os marcos sem ter que preencher todos.

**⚠️ A pergunta mecânica que precisa ser respondida antes de tudo:** ao perder a permissão de rank, **os spawners já colocados param de funcionar?** Se pararem, prestigiar é catastrófico e ninguém vai fazer. Se continuarem funcionando e só a *compra* de novos for bloqueada, prestígio fica viável e a proposta acima fecha. Isso decide se o sistema é usável — vale testar antes de desenhar os números.

**Um adendo que casa com a temporada:** como tudo reseta em 20 dias, prestígio é o **critério natural de placar final**. Coins todo mundo zera; prestígio é o que mede quem realmente fez as voltas. Vale ser o critério de desempate do ranking geral e da premiação de fim de temporada.

- **`GarnixRankUP/config.yml`**: implementar o acima — lista global de comandos por prestígio, listas por nível com vazios permitidos, e o `cost-increase-percent: 10` revalidado contra a curva de tiers (10% por prestígio pode ser pouco se o jogador preserva todo o estoque).
- **`GarnixSpawners/ranks.yml` + `GarnixMachines/ranks.yml`** — reprojetar as escalas de VIP (hoje fictícias e invertidas) para celestial +4/−3 → garnix +15/−15, e adicionar as 20 entradas de rank. Fazer os dois arquivos juntos (são idênticos hoje).
- **`GarnixSpawners/spawners/*.yml`** (20 arquivos, hoje todos com custo e drop idênticos): definir **compra = rank N + coins do tier N + dracmas (plano, ~1 dia de kill)**; drop de **coins + dracmas** por mob morto; drop de cabeça; e as 3 trilhas de upgrade custando **coins + dracmas** (não a chave `gems`, que não corresponde a moeda nenhuma). Corrigir `mob-stack` nível 2 e 3 (**ambos têm `value: 3`** — o nível 3 custa 4× e não dá nada, nos 20 arquivos) e o `rank`/`order` divergente em `SLIME.yml`.
- **Escalonar o `release:` dos spawners** — hoje os 20 compartilham `"05/03/2025 13:00"`. **Spawner N libera no dia N** da temporada, alinhado com o tier. É o gate de calendário que impede o hardcore de estourar o teto antes do fim e mantém a banda casual dentro da meta. Também é o botão de ajuste da duração: esticar ou encurtar o calendário sem recalcular valor nenhum.
- **`GarnixSpawners/sword.yml`** — definir os 3 encantes dentro do teto de multiplicadores e travar o `lamina-cooldown: 30`. Calibrar o drop-base do spawner **assumindo `pilhagem` 3 no fim da temporada**, senão o dia 20 vem 2× inflado. A curva de `massacre` (raio 2/4/8/16/ilimitado) define a taxa de cabeças, que é a moeda do rankup — é o número mais sensível da via passiva.
- **Passivo começa no T7–T8, não no T3.** No T3 o jogador tem ~5 spawners; 1.800 drops/h contra alvo de 417/h dá 0,23 coin/drop, sub-inteiro. Estado honesto: os 6 primeiros tiers são obrigatoriamente ativos. Compensar dando ao passivo um alvo de `renda(N)/24` por hora (roda 24h) em vez de `/3`, de modo que quem investe no T8 empata no T11 e termina levemente à frente.
### Máquinas — a projetar do zero (`/maquinas`)

Hoje existem 2 (`WOOD`, `CASH`) com drops copiados um do outro e **nenhuma trilha de upgrade** (`grep upgrade` no plugin retorna vazio). Duas famílias:

#### Máquinas de coins — 15 máquinas, compradas com coins

**15 dá uma máquina nova a cada ~1,2 dia** — drip constante sem competir com o ritmo diário do rank. Podemos criar mais no decorrer do servidor: a estrutura por banda de tier suporta inserir máquina nova sem recalcular as outras, desde que a nova entre numa banda e não acima da última.

**Nomenclatura de trabalho: máquinas A a O.** Você manda os nomes finais depois; até lá tudo no plano, no simulador e nos YAMLs referencia a letra. Isso é melhor que nome provisório: a letra já carrega a ordem, então ninguém confunde qual é mais forte, e trocar por nome no fim é substituição direta.

| Máquina | Tier | Máquina | Tier | Máquina | Tier |
|---|---|---|---|---|---|
**A** | T2 | **F** | T8 | **K** | T14 |
**B** | T3 | **G** | T9 | **L** | T16 |
**C** | T5 | **H** | T11 | **M** | T17 |
**D** | T6 | **I** | T12 | **N** | T18 |
**E** | T7 | **J** | T13 | **O** | T19 |

Distribuição mais densa no meio (T5–T14), onde o jogador passa mais tempo consciente da progressão. Máquina nova criada depois entra numa banda existente sem recalcular as outras — só não pode entrar acima de **O**.

Papel econômico: máquina de coins é **renda de conveniência que complementa, nunca substitui**. Não carrega os 20 tiers (não tem onde guardar o exponencial), então cada máquina vive na sua banda e é superada. `maquinaslimite` é o termo de quantidade e fica linear.

#### Máquinas especiais — poucas, boas, vendidas no site e raríssimas em recompensa

Régua: **cada máquina especial faz algo que nenhuma outra faz.** Máquina que só paga mais é um número; máquina que produz algo que não se compra é conteúdo. E a regra de raridade que você definiu: especiais são raras, **combustível infinito é ainda mais raro.**

| Máquina | Produz | Cuidado no balanceamento |
|---|---|---|
**Máquina de Cash** | cash, muito devagar | **A mais sensível do servidor.** A 5 cash/dia × 3 contas × 20 dias = 300, quase o orçamento free inteiro. Alvo: **3–8 cash/dia, limite de 1 por conta**, e entra explicitamente no orçamento de cash. Excelente produto de site |
**Máquina de Limite** | `spawnerslimite` / `maquinaslimite` devagar | é o score 1 do Ranking de Apelões saindo de graça. Raríssima, teto de produção total, não só de taxa |
**Máquinas de moeda secundária** (dracmas, gemas, sementes, corais) | a secundária de uma via | deixa o minerador conseguir dracmas — o que **arranha a lei "coins não dita tudo"**. Mitigação: produzir **20–30% do que jogar aquela via rende**. Suplemento, nunca substituto |
**Máquina de Combustível** | combustível comum | concorre com o combustível infinito. Deve reduzir o sink, não zerá-lo: ~40–60% do consumo de uma máquina |
**Máquina de Chaves / Caixas** | chave ou caixa devagar | é a rota in-game garantida (mas lenta) para itens do site. Atende direto a sua regra de "obtenível jogando, mais difícil" |
**Máquina de Cabeças** | cabeças | ⚠️ **não recomendo na forma óbvia.** Cabeça é a moeda do rankup e o portão de tempo. Se existir, deve produzir só cabeças de mobs **abaixo** do seu rank atual — inúteis para upar, úteis para vender e converter |

E sim: dá para fazer máquina de qualquer coisa, e caixa que dá máquina. Isso é bom material de site e de crate — a ressalva única é que **toda máquina nova tem que passar pelo orçamento de tier antes de existir**, senão vira a via mais rápida sem ninguém ter decidido isso.

#### `machines/CASH.yml`

Renomear e dar `currency-id: coins` explícito, ou transformar de vez na Máquina de Cash com os números orçados acima. Enquanto o nome for CASH e os drops forem copiados de WOOD, é uma armadilha esperando um typo.

### Combustível — o sink recorrente que dá valor ao item de site

O **combustível infinito** é item raro, vendido no site, conseguível jogando com moderação, movível entre máquinas mas **ativo em uma só por vez**. Você foi enfático: ele não pode ser ruim nem render uma miséria, senão o jogador sente que não compensou. Concordo, e a mecânica que garante isso é uma dependência direta:

> **O valor do combustível infinito é exatamente igual ao custo do combustível comum.** Se o comum for barato, o infinito não vale nada e o jogador se sente enganado. Se for caro demais, o infinito vira obrigatório e o P2W passa de perceptível a punitivo.

Alvo: **combustível comum custa 20–25% da produção da máquina que ele alimenta.** Aí o infinito é +20–25% líquido *para sempre* naquela máquina, mais o alívio de nunca reabastecer — um ganho que se sente na hora e não decai.

E o detalhe do desenho que faz ele valer ainda mais sem quebrar nada: **como só funciona em 1 máquina por vez, o jogador aplica na melhor máquina que tem.** Então o valor do infinito **cresce junto com o jogador** — hoje na Serraria, amanhã no Núcleo Garnix, e o combo natural é colocá-lo na Máquina de Cash. Nunca fica obsoleto, nunca precisa de um segundo, e o teto é automático porque não dá para multiplicar comprando vários. É um dos melhores itens de site do plano justamente por isso.

**Distribuição do combustível comum.** Ele precisa cair em recompensas — não muito, mas o suficiente para ninguém reclamar de máquina parada. A distinção que faz isso funcionar sem matar o infinito:

> **A escassez não é o atrito. O atrito é a tarefa.** O jogador nunca deve ficar bloqueado por falta de combustível; ele deve ficar *incomodado* de ter que ir abastecer.

Isso é mais saudável para o servidor e vende melhor: ninguém sente que foi barrado, mas todo mundo sente a chatice. E permite ser generoso no drop sem desvalorizar o infinito.

| Rota do combustível comum | Papel |
|---|---|
Recompensas (faixa "Bom" da crate, caixas, eventos, ontime) | cobre ~70–80% do uptime que o jogador quer. **Grátis, mas manual** |
Compra em coins no `/loja` | preenche o resto para quem prefere pagar em vez de esperar. É aqui que mora o custo de 20–25% da produção |
**Combustível infinito** | zera **as duas coisas**: o custo e a tarefa |

Assim o valor do infinito é concreto nos dois eixos (economiza 20–25% da produção da melhor máquina **e** elimina o reabastecimento manual para sempre), e nenhum jogador free fica com máquina parada reclamando.

Duas consequências a registrar: combustível comum comprável é um **sink recorrente** (entra no orçamento de 60–75% da Fase 6 como consumível), e o infinito é item de faixa C/D no cash-shop com rota in-game de jackpot — caixa `garnix` e/ou boss de banda alta, **mais raro que as próprias máquinas especiais**.

### Cacto — a sexta via, e a única que cresce por reinvestimento

Você deixou claro que jogadores **gostam MUITO** de subir farm de cacto e que o armazém vai ser muito usado, então a via tem que ser **pareada** com spawners, máquinas, mineração e fazenda — não um apêndice.

E ela tem uma propriedade que nenhuma outra via tem: **o cacto se paga em cacto.** O jogador tira cacto do armazém para plantar mais, o que aumenta a colheita, o que dá mais cacto para plantar. É crescimento composto puro — o exponencial da via não precisa vir de tabela de tier nenhuma, ele já está na mecânica. Isso a torna a via mais elegante de calibrar e a mais perigosa de errar.

| Regra | Decisão |
|---|---|
Venda | **só coins**, conforme você definiu |
Preço de compra do cacto | **um pouco difícil** — é o que decide se o jogador arranca do armazém (grátis, lento) ou compra (rápido, caro). Os dois caminhos ficam viáveis |
Expansão sem comprar | ✅ tirar do armazém para plantar. É a rota grátis e é o coração da via |
Cacto em recompensa | ✅ **item cacto raro** em crates/caixas/eventos, para o jogador montar a farm aos poucos |
Torre automática | `GarnixCactusTowers` — item **raro** que ergue uma torre 3×3 de 4 andares pronta. É um salto de várias horas de trabalho manual |

**O que controla o ritmo da via** (são 4 freios, e nenhum deles é preço de venda):

1. **Limite do armazém** (`initial-limit: 1500`) — o gargalo real. Armazém cheio = colheita perdida.
2. **Velocidade do autosell** (`default-interval: 20`, upgrades em cash) — esvazia o armazém automaticamente, ou seja **contorna o gargalo**. É por isso que ele é legitimamente premium.
3. **Espaço do plot** — teto físico absoluto da via.
4. **Raridade da torre e do item cacto** — decide se o crescimento é linear (plantar à mão) ou salta.

**Alvo de paridade:** a farm de cacto de um jogador dedicado deve **dobrar de tamanho a cada 8h** por reinvestimento — 3 dobras por dia = 2³ = **8×/dia**, exatamente a curva de tiers, sem precisar tocar no `sell-price`. O `sell-price: 10` de hoje é fictício e será derivado dessa conta, não escolhido.

⚠️ **Item cacto e torre entram na lista de itens sem rota** (abaixo) — hoje a Torre de Cacto só sai de `/cactustower give` e o Limite de Armazém só de `/armazem givelimititem`.

### Caixas misteriosas — o faucet de armadura e skin, e produto do site

As 7 caixas estão 100% vazias hoje (`type: NONE`, chance 100%), e são elas que resolvem a corrente quebrada mais crítica: **as 60 peças de armadura e as 28 skins não têm rota nenhuma no repo.** A partir das suas definições, a estrutura fica assim:

| Caixa | Rota | Conteúdo |
|---|---|---|
**mineracao-I / farm-I / pesca-I** | in-game, acessível | piso mais baixo, com azar presente. Armadura T-I a T-III, skins forjáveis (2–6), livros de classe A/B |
**mineracao-II / farm-II / pesca-II** | ✅ **vendida no site** + in-game **beeem raro** | **itens melhores e menos itens piores** — piso mais alto, azar muito menor. Armadura T-III a T-V, skins 6–8, livros de classe C/D |
**garnix** | topo absoluto — jackpot e site | a caixa cruzada. Combustível infinito, matadora hk, `pilhagem` 3, vaga de visitante, máquinas especiais, as skins mais raras |

Regras que caem das suas decisões:

- **Toda skin é obtenível jogando.** As forjáveis pela corrente de forja (7 iguais → a próxima), as de topo pelas caixas. Nenhuma skin fica atrás de paywall.
- **As 3 skins mais raras de cada sistema também são vendidas direto no site** (mina, fazenda, pesca). São: mineração `jade / safira / mithril`, pesca `oceanita / perola / tempestita`.
- **Armadura NUNCA é vendida no site.** Ela existe só via caixa (e o que decidirmos de crate/boss). Isso dá à armadura um papel bonito: é o equipamento que **só quem joga tem completo**, mesmo que a caixa que a contém possa ser comprada. Quem paga compra *chance*, não a peça.
- Caixa II ser comprável e ao mesmo tempo "beeem raro" in-game é exatamente o desenho que você quer: o item existe para os dois públicos, com esforços muito diferentes.

**Assimetria resolvida: criar a 10ª skin de farm.** Mineração tem `jade 38 / safira 50 / mithril 65` e pesca tem `oceanita 38 / perola 50 / tempestita 65` acima do teto de forja — três cada. O farm só tinha `cristal 45 / marfim 65`, porque a terceira (`esmeralda 30`) **é o próprio teto de forja**. Com a 10ª criada, a escada de farm acima da forja fica com três degraus (≈40 / 50 / 65), as 3 vias ficam simétricas, e "vender as 3 mais raras" passa a valer igualmente nos três sistemas. O farm já é a via mais frágil do repo, então é a que menos pode perder conteúdo.

### Escada de raridade — a régua única do servidor

Para tudo ficar consistente, uma só ordem de raridade, do mais raro para o menos:

| Nível | Itens | Rota in-game |
|---|---|---|
**Mítico** | **combustível infinito** | jackpot da caixa `garnix` |
**Mítico −** | **matadora hit-kill**, **vaga de visitante**, livro de `pilhagem` 3, livro `massacre` 5 | jackpot da caixa `garnix` / boss de banda alta |
**Lendário** | máquinas especiais, **booster 3×**, skins de topo (as 3 mais raras), armadura T-V, **caixa II** | jackpot/épico de caixa; caixa II e as 3 skins também no site |
**Épico** | livros de classe C/D, armadura T-III/T-IV, skin média, **booster 2×** | épico de crate e da caixa I |
**Raro** | chave de boss, livros de classe A/B, armadura T-I/T-II, item cacto, torre de cacto | raro de crate, caixa I |
**Comum** | combustível comum, consumíveis, bombas, moedas secundárias | faixa "Bom" de crate, kits |

Os 4 itens de poder ilimitado (britadeira, bombas, `massacre 5`, matadora `hk`) recebem **preço e raridade** em vez de nerf — ver Fase 4b item 3 para a análise de por que isso é seguro.

### Galpão e torres de cacto

Ver a seção **"Cacto — a sexta via"** para o desenho completo da via. Aqui só o que é config de galpão.

O **autosell fica só por cash**, conforme decidido — e a razão é sólida: ele vende e esvazia o armazém automaticamente, ou seja, na prática **contorna o `initial-limit: 1500`**, que é o gargalo da via. Isso o torna legitimamente premium. Rota in-game: item raro de drop, não compra em coins.

Reprecificar, porque hoje não fecha: os 5 níveis custam **1.000–3.000 cash** (total 10.000) e um free acumula 400 na temporada — ele não compra **nem o mais barato**, então na prática hoje é 100% pay-only sem rota nenhuma. Alvo: faixa **150–800 por nível**, de modo que um free que guarde a temporada inteira compre 1 nível, um free vinculado e ativo em eventos chegue a 2, e o resto venha do site ou do drop raro. Assim a regra "obtenível jogando, mas mais difícil" fica verdadeira em vez de nominal.

---

## Fase 4 — Farm e Pesca (paralelo, cada um atômico)

### Pesca — resolvível em YAML, mas exige reenquadrar o que o equipamento faz

Problema real: a pilha de multiplicadores da pesca **não alcança coins**. `armors/*/tier-v.yml` da pesca dá `corais` + `xp`, sem chave `coins` (diferente de mineração e farm). E `config.yml: currency: corais` fixa a renda imediata em corais, então skins (`currency-bonus`) e boosters (`booster-types: corais/xp/both`) só empurram corais.

Não brigar com isso — **transformar em design: na pesca o equipamento compra ACESSO, não multiplicador.**
- `rewards.yml` suporta `type: CURRENCY` + `currency-id:` arbitrário. Autorar **20 recompensas de coins**, uma por tier, cada uma com `required-level: N` (as 20 fisgadas de nível = os 20 tiers) e `weight` calibrado para exigir a skin ⌈N/2⌉ (`max-weight` da vara vai de 3 a 130 e hoje **gate nenhum**, porque `rewards.yml` só usa pesos 1/1/2/4/8 — 40+ de headroom sobrando).
- Valor no campo **`currency:`, que é string entre quotes** (`currency: '100'`), **nunca em `amount:`**, que é inteiro cru. T20 por fisgada = 6,6×10¹⁷, cabe.
- `corais` fica como moeda **linear** de progressão de pesca.
- **`shop.yml` tem exatamente 1 produto e ele é um exploit**: `spawner-limit: cost 1500 corais → spawner givelimite 1500`, conversão 1:1 do item #1 do Ranking de Apelões. Substituir por 6–10 produtos com câmbio decrescente e teto.
- Nota de calibração: pesca tem ~22.500 eventos de renda na temporada inteira (157.500 XP ÷ ~7/fisgada = **44,6h até vara nível 20**) — uma das poucas curvas do repo já certa para 15–20 dias. Opcional: baixar `fishing-base-interval-seconds` de 15 para 6 compra 1,4 ordem de headroom e deixa a pesca menos entediante.

### Farm — com o C2 aprovado

O diagnóstico que motivou o C2: `farms.yml` tem 4 tipos e o comentário diz **"Ordem fixa no código (`GarnixFarm.FARM_TYPES`)"**; `levels.yml` são 16 linhas de fórmula de XP **sem tabela de moeda por nível** — ou seja **nível de farm não aumenta renda nenhuma**, só libera upgrades de planta. Do nível 50 ao 100 o farm não ganha nada, enquanto na mineração o bloco vai de `coins 5.7` a `coins 11.1`. E `prosperity` é **linear no nível** (3,03× no cap), portanto front-loaded — o oposto do que uma escada de tiers precisa. Amplitude total sem C2: 70× × 39× = **2.730× = 3,4 ordens**, contra as **19** necessárias.

**C2 está aprovado**, então o farm ganha os 21 degraus de valor por nível e fica pareado com a mineração. Os 4 tipos de planta continuam existindo como marcos de desbloqueio e variedade visual — só param de ser a única coisa que decide o pagamento. Nada de função-escada.

Também na Fase 4, tudo num commit: `levels.yml` `base: 100.0, growth: 2.2` dá 7,98×10⁷ XP total = **1,7 hora** para o nível 100 (mineração leva 40–50h) — subir para `base: 3000.0` (~2,4×10⁹). `prosperity.yml` `increase-multiplier: 0.02 → 0.07`, para parear com o `fortunate`. Recustar os 10 encantes ~40× para cima — a árvore de farm custa 3,96×10⁶ sementes contra 6,42×10⁸ gemas da mineração, **162× mais barata pelo mesmo slot**. E criar a **10ª skin** (≈+40%), para as 3 vias ficarem simétricas acima do teto de forja.

---

## Fase 4b — Os ~212 itens ativáveis (a fase que não pode ter furo)

Depende das Fases 2–4 (é preciso saber a renda de cada tier para precificar), e **precede a Fase 5**, porque as tabelas de loot só podem ser escritas depois de existir a lista completa de o que pode cair.

Ordem de trabalho, por impacto:

1. **Tabela de boosters** — os 7 tipos precisam de tabela de multiplicador × duração antes de qualquer preço. Hoje não existe nada em config para precificar. Dois multiplicadores, conforme decidido:

   | Multiplicador | In-game | Site |
   |---|---|---|
   **2×** | **comum, mas difícil de conseguir** — faixa Raro/Épico de crate e caixa | não vendido |
   **3×** | **muito difícil** — faixa Lendário/Mítico−, jackpot de caixa e boss | ✅ **é o que o site vende** |

   A separação é boa comercialmente: quem paga não compra "mais do mesmo", compra **a força que quase não sai jogando**. E quem joga muito chega no 3× por jackpot, o que mantém a regra de tudo ser obtenível.

   **A duração é o segundo eixo, e ela separa in-game de site de forma ainda mais nítida:**

   | | Durações |
   |---|---|
   **Recompensa in-game** | **5m · 10m · 15m · 30m · 1h** — e 1h é o teto absoluto |
   **Site** | durações maiores, definidas na Fase 7 |

   Isso é uma trava excelente. Um booster de 3× que dura 15 minutos é uma explosão gostosa de jogar e quase irrelevante no acumulado do dia; o mesmo 3× por 8h é um produto de verdade. Ou seja, **o in-game entrega a sensação e o site entrega o efeito** — sem que nada fique atrás de paywall, porque a força máxima existe nos dois lados.

   ⚠️ **O orçamento de multiplicadores tem que usar a duração do site, não a in-game.** Um 3× de 1h não move a média diária, mas um 3× de 8h move — e é por isso que o teto de 100× foi calculado com 3× cheio.

   **Consequência já aplicada no orçamento:** o teto de multiplicadores passa a ser calculado com **3×**, não 2×, e o `fortunate`/`prosperity` cai de 13,9× para 7,98× para compensar. Ver "Orçamento de multiplicadores".
2. **Combustível** — preço por litro derivado de 20–25% da produção da máquina alimentada, e o infinito posicionado no topo da escada de raridade.
3. **Itens de poder ilimitado — mantidos como estão, controlados por preço e raridade.** Decisão sua: sem nerf mecânico. Britadeira segue com 10 simultâneas, bombas com 5, `massacre 5` com `value: -1` (dano infinito) e a matadora `hk` com hit-kill.

   **A análise que faz essa decisão funcionar:** os três estão limitados por oferta a montante, não por poder próprio.

   | Item | Poder nominal | Teto real que o limita |
   |---|---|---|
   Britadeira (10×, coluna inteira, 3×3) | ilimitado | **`reset-cooldown: 30`** — a mina só regenera 135.700 blocos a cada 30s. A britadeira faz o jogador *bater no teto mais rápido*, não passar dele |
   Bombas (raio 8, 5 simultâneas) | ilimitado | mesmo teto da mina |
   `massacre 5` (`value: -1`) | dano infinito | **taxa de spawn** — `delay` do spawner × `mob-stack`. Matar instantaneamente não cria mob nenhum |
   Matadora `hk` | mata qualquer boss | **oferta de chave de boss** (~45/dia) |

   Ou seja: são itens que **aceleram até o teto**, não que furam o teto. Por isso preço e raridade bastam — e é o que os torna produtos excelentes. A ressalva a registrar: **a curva de tiers passa a depender de a raridade estar certa**, então esses 4 itens são os primeiros a serem conferidos no simulador e nos testes de cronometragem.
4. **Os 60 arquivos de armadura + as 28 skins + os 3 itens de forja** — rota e preço para cada tier, casando com a escada de raridade.
5. **Os 26 livros** (15 de pesca, 11 da lâmina) e as 4 matadoras + kill-stack — rota por banda de tier, com `pilhagem 3`, `massacre 5` e `hk` no topo (Mítico/Mítico−).
6. **Itens de limite e de renda passiva** — limite de máquinas, limite de armazém, venda automática, ativador de baú.

7. **Vaga de visitante — sistema mantido, e a vaga vai para o topo da raridade.** Decisão sua: o sistema de visitantes fica e a vaga ganha preço, com a vaga sendo **tão rara quanto combustível infinito e matadora hk** (nível Mítico−).

   Confirmei nos arquivos de VIP como a coisa se divide, e ela fecha bem:

   | Origem | Vagas |
   |---|---|
   Base (todo jogador) | 0 |
   `celestial` / `imortal` | 0 |
   **`supremo`** | +1 |
   **`garnix`** | +2 |
   `investidor` (tag de parceria) | +3 |
   **Item Mítico− (jackpot)** | as demais, até o teto |
   | **`visitor-slots-max`** | **5** |

   Ou seja: **o VIP pago entrega no máximo 2 das 5 vagas, e as outras 3 só saem de jackpot.** É uma divisão excelente — o pagante tem vantagem real e imediata, mas a mina cheia de 5 visitantes é status de quem jogou. E o dono ganha 35% do XP dos visitantes + taxa de até 40%, então cada vaga é renda passiva composta: o preço da vaga tem que ser derivado disso, não escolhido.

   A escada de vagas por VIP **fica exatamente como está** (celestial 0, imortal 0, supremo 1, garnix 2, investidor 3), por sua decisão.
8. **Itens de construção e conveniência** — torre de cacto, item cacto, limpador de terreno, fly temporário, reset de KDR.
9. **Chave VIP e chave rankup** — implementar as rotas: VIP dispara para todos os online via `GarnixStoreActivation`; rankup entrega no rankup, em volume baixo. Ver "Rotas de cada chave".
10. **Higiene dos comandos de admin** — `givehandall` e o `*` de `givekey`/`caixas give` **ficam como estão por sua decisão**; risco de duplicação em escala registrado em `09-VERIFICACAO.md`. Corrigir só a divergência real de nome `givevaga` vs `giveslot`.

**Critério de conclusão da fase:** rodar a auditoria de novo e a lista (A) — itens sem rota — tem que voltar **vazia**, e a lista (B) — efeito econômico sem custo — também. Nenhum item fica como "só admin". Se um item não deve chegar ao jogador, ele sai do config.

**Como eu garanto que nenhum item escapa.** Você foi enfático e a preocupação é justa, então o controle é mecânico e não depende de memória:

1. `10-ITENS.md` começa com a lista **completa** dos ~212, cada um com um ID e uma linha de status (`sem rota` / `sem preço` / `pronto`).
2. Antes de fechar a fase, rodo a mesma varredura de novo, do zero, e **comparo contagem com contagem**. Se a segunda varredura achar um item que não está no documento, o documento estava errado — não o contrário.
3. Um item só sai de `sem rota` quando tem as 6 colunas preenchidas: força · rota · preço · tier · raridade · conta-no-teto.
4. Nenhuma outra fase pode fechar antes da 4b — porque loot (Fase 5) e loja (Fase 7) precisam saber **o que existe** antes de decidir o que cai e o que vende.

## Fase 5 — Superfícies de recompensa

Tudo aqui depende das Fases 2–4 estarem fechadas. É a parte "progressão constante e visível".

| Arquivo | Estado hoje | Ação |
|---|---|---|
`GarnixCrates/crates/*.yml` | 6 crates, tabelas **byte-idênticas** | 6 identidades distintas, cada uma ancorada na sua via e banda de tier |
`GarnixMysteryBoxes/boxes/*.yml` | 7 caixas, **100% `type: NONE`** | escrever do zero — é o faucet de armadura e skin do servidor. Caixa **I** in-game, caixa **II** no site + beeem rara in-game (piso mais alto, menos azar), `garnix` no topo. Ver "Caixas misteriosas" |
`GarnixBosses/bosses/*.yml` + `swords.yml` | 3 bosses, HP 25k/50k/75k, **recompensas idênticas**; espadas 500/750/1500/hit-kill sem custo | **criar 2 novos (total 5 no lançamento) + 3 engatilhados** — ver "Pipeline de bosses". Escada de espada por livro `kill-stack-item` e taxa de drop por banda |
**Livros de encante** (3 sistemas) | `GarnixFishing/enchants.yml` sem custo; `GarnixSpawners/sword.yml` e `GarnixBosses/swords.yml` sem rota | **cada nível de cada livro precisa de uma linha em alguma tabela de loot desta fase.** É o freio da temporada — nada de livro sem gate de banda |
`GarnixOnTime/rewards/*.yml` | 15 marcos de 1h a **30d**, **todos pagando igual** (1h paga o mesmo que 30d) | reescalar para **1h → 15d**, mantendo o formato atual (horas no começo, dias depois de passar de 12h) e **diferenciando os 15**. Proposta: `1h 2h 3h 4h 6h 12h · 1d 2d 3d 4d 5d 7d 10d 12d 15d` |
`GarnixDailyRewards/rewards/*.yml` | 8 arquivos, cash 50–500 | membro 20, vinculado +8, celestial 40 → garnix 120 (hierarquia real) |
`GarnixDiscordSync` | vínculo dá Celestial 3d + permissão `daily.linked` | validar que é 1×/conta de Discord e à prova de unlink/relink; calibrar T3–T5 **com** o bônus ligado |
`GarnixEvents/events/**/*.yml` | **21 arquivos com `cash add 5000–15000`** | ⏸️ **postergado para a Fase 7, junto com o cash-shop**, por sua decisão. São eventos 4fun: pagam cash e chaves, alguns coins. O prêmio mais desejado depois do cash é a **tag no chat** dos eventos in-person — status puro, zero impacto econômico, alto valor percebido. Continua sendo a maior correção de cash do projeto (5.000–15.000 → 10–40) |
`GarnixCrates/robots.yml` | 1 robô, **sem `boost-threshold`/`boost-multiplier`** | tiers de robô usando o rate-up documentado |
`GarnixFragments/` | 3 fragmentos (`fogo`/`gelo`/`natureza`), nomes **fictícios**, zero faucet, zero sink | sistema aberto: **quantos fragmentos quisermos, com qualquer nome.** Ver a seção própria abaixo |
Kits (`GarnixEssentials`) | itens em base64; entregam **chaves de crate** | ⛔ **eu não edito kit nenhum.** Entrego a especificação (kit → chave → quantidade), o dono aplica in-game |

### A economia de chaves — projetada para volume massivo

Requisito seu: jogadores gostam de **quantidades massivas de chaves**, gostam de ganhar chave minerando e farmando manualmente, e gostam de acumular **muitas chaves de boss para matar muitos bosses**. Isso é um requisito de projeto, não um pedido a ser moderado — e ele define a estrutura inteira da crate.

**Volume real no endgame, por jogador (3 contas):**

| Fonte | Chaves/dia | Onde |
|---|---|---|
Kits cumulativos (20 kits × 4 resgates × 3 contas) | ~240 | `GarnixEssentials` |
Mineração manual (`blessed`) | ~2.700 | `GarnixMining/enchants/blessed.yml` → chave `mineracao` |
Farm manual (`clover`) | ~1.000 | `GarnixFarm/enchants/clover.yml` → chave `fazenda` |
Pesca, eventos, ontime, bosses | ~300 | `rewards.yml`, `GarnixEvents`, `GarnixOnTime` |
| **total endgame** | **~4.000–5.000/dia** | |

**A trava que faz esse volume ser controlável:** o proc de chave tem que contar **blocos manuais**, não blocos quebrados por AoE. `blessed` a 9,21% no nível 100 sobre 1,6×10⁷ blocos/h de AoE daria 1,4 milhão de chaves/hora — absurdo. Sobre ~10.000 blocos manuais/h dá ~900/h, que é massivo e saudável. O plugin já tem esse conceito: o frenzy conta `blocks-required: 1000` **só de blocos manuais, excluindo encantes/drill/bombas**. A mesma regra vale para chave.

**Tabela de crate calibrada para ~5.000 aberturas/dia** (não para 12 — esse é o erro que arruinaria tudo):

| Faixa | Chance | Por dia | Conteúdo |
|---|---|---|---|
Recheio | ~88% | ~4.400 | coins pequeno, XP, material, sucata. É o "algo acontecendo sempre" |
Bom | ~7% | ~350 | consumível, combustível comum, punhado de dracma/gema/semente |
Raro | ~5% | ~250 | **chave de boss** (volume alto de propósito), livro de classe A/B, armadura de tier baixo |
Épico | ~0,09% | ~4,5 | armadura de tier médio-alto, skin média, livro de classe C/D |
**Jackpot** | **~0,006%** | **1 a cada ~3 dias** | livro de `pilhagem`, skin de topo, combustível infinito, máquina especial |

Nota importante: com esse volume, **jackpot a 0,1% seria 5 por dia** — foi por isso que desci para 0,006%. Em volume massivo, a raridade percebida vem da chance minúscula, não do número de aberturas.

### Rotas de cada chave

| Chave | Rota | Volume |
|---|---|---|
`mineracao` | encante `blessed` em bloco manual | massivo |
`fazenda` | encante `clover` em colheita manual | massivo |
`pesca` | recompensa `treasure` de `rewards.yml` | médio |
`bosses` | drop de boss + marcos do OnTime + faixa "Raro" das crates | médio (~45/dia) |
**`vip`** | **toda ativação de VIP entrega chave para TODOS os jogadores online no momento** — qualquer VIP. Também distribuível em outras recompensas, inclusive dentro de outras chaves | depende das vendas |
**`rankup`** | **entregue ao dar rankup**, mais algumas outras recompensas. **Volume deliberadamente muito inferior ao das outras** | baixo |

**A chave VIP é a melhor mecânica comercial do plano.** Cada compra no site vira um evento público que beneficia todo mundo que está online — isso cria pressão social de compra ("alguém comprou e todos ganharam"), premia estar online no momento, e faz o comprador ser aplaudido em vez de invejado. O `GarnixStoreActivation` já tem os templates de anúncio (`messages.yml`, matcher por nome de produto) e o webhook de Discord pronto para isso.

Isso também **reenquadra um item que eu havia marcado como risco**: o `*` de `/crates givekey <crate> * <qtd>` não é um perigo, é o mecanismo. O que ele exige é ser disparado pelo StoreActivation, não digitado à mão.

Duas coisas para orçar: (1) o volume da chave VIP é **proporcional às vendas**, não ao tier — então o conteúdo dela precisa ser bom mas não escalar renda, senão um dia de muitas vendas infla a economia; (2) a chave `rankup` sendo de volume baixo faz dela a chave de **conteúdo mais valioso por abertura** — é a única cuja tabela pode ser generosa.

**`GarnixCrates/upgrades.yml` deixa de ser cosmético e vira infraestrutura.** A escada de 20 → 500 aberturas por clique é obrigatória com 5.000 chaves/dia, e o robô auto-abridor (`robots.yml`, hoje 1 robô a cada 4s **sem os campos de rate-up**) passa a ser um item de valor real. Vale expandir a escada além de 500.

**O loop de boss cai naturalmente disso.** ~45 chaves de boss/dia por jogador atende o "gostam de conseguir bastante bosses para matar", e fecha um ciclo bonito:

```
minerar/farmar manual  →  chaves em massa  →  crates  →  chave de boss (0,9%)
                       →  boss  →  recompensa boa + chave de crate de boss  →  volta
```

E amarra três coisas que já existem: a espada de boss (`hit-kill` no topo) vira um item premium **de verdade**, porque converte volume de chave em volume de recompensa; a crate `bosses` ganha identidade própria (é a única alimentada por combate); e o `reward-rolls: 3` dos bosses passa a ser um número que importa.

⚠️ **Uma consequência de infraestrutura a medir:** 45 bosses/dia × 100 jogadores = ~4.500 spawns de boss/dia no servidor. Boss de 25k–75k HP com partícula e AoE é caro em tick, exatamente como os encantes de classe D/E. Entra no mesmo teste de carga, e provavelmente precisa de um `max-simultaneous` global de bosses.

### Pipeline de bosses — 5 no lançamento, 8 prontos

Decisão sua, e é uma abordagem boa: **criar 2 bosses novos agora (total 5 no ar) e deixar mais 3 completamente prontos e engatilhados (total 8)**, para serem lançados como update aplicando só os `.yml`.

Isso resolve duas coisas ao mesmo tempo. Primeiro, cobre as 20 bandas de tier de forma decente — com 5 bosses são 4 tiers cada, o que é razoável (contra 3 bosses e ~7 tiers cada, que ficaria repetitivo). Segundo, e mais valioso: **dá conteúdo pronto para lançar no meio da temporada** sem trabalho de última hora. Update de conteúdo no dia 8 ou 12 é exatamente o que segura o jogador que já viu tudo.

| | Bosses | Bandas de tier | Quando |
|---|---|---|---|
Lançamento | **5** (`colosso`, `inferno`, `arauto` + 2 novos) | 4 tiers cada | dia 1 |
Engatilhados | **+3** (arquivos completos, fora da pasta ativa) | redistribui para ~2,5 tiers cada | update no meio da temporada |

Os 3 engatilhados ficam versionados em `GARNIX - ECONOMIA/bosses-engatilhados/` com os `.yml` prontos e a nota de qual banda cada um assume ao entrar — porque **adicionar boss redistribui as bandas**, e isso tem que estar calculado antes, não no dia.

Cada boss precisa de: HP por banda, `reward-rolls`, tabela de recompensa derivada do tier, taxa de drop de chave de boss, e a decisão de qual espada (`default`/`sombria`/`ancestral`/`hk`) o mata em quantos golpes — porque é isso que dá sentido à escada de matadoras.

### Fragmentos — o sistema mais flexível que temos

`GarnixFragments` hoje tem 3 tipos (`fogo`, `gelo`, `natureza`), nomes fictícios, **zero faucet e zero sink** — só o comando admin. E o schema aceita **quantos tipos quisermos, com qualquer nome, e custos multi-fragmento** (o `tag-vip` por `fogo 500 + gelo 500 + natureza 500` já demonstra isso).

Isso o torna a peça mais versátil do plano, porque resolve um problema que nenhum outro sistema resolve bem: **como dar uma rota in-game para um item do site sem simplesmente vender esse item por coins.** Coins são exponenciais — qualquer preço em coins fica trivial dois dias depois. Fragmento é contagem: 500 fragmentos são 500 fragmentos no dia 3 e no dia 20.

Três usos que se somam:

| Uso | Como |
|---|---|
**Rota in-game para itens do site** | fragmento cai devagar de boss, evento, caixa e crate; juntar N desbloqueia o item. Preço em fragmento não inflaciona, então o item continua "difícil" a temporada inteira |
**Trocas e conversão** | custo multi-fragmento força coletar de fontes diferentes — não dá para farmar um só lugar. É a mecânica de "junta as 3 cores" |
**Melhorias permanentes** | desbloqueios que sobrevivem ao prestígio, casando com os marcos de prestígio |

Como os nomes são fictícios e a quantidade é livre, a decisão de quantos tipos criar e com que nomes fica com você — e ela **não bloqueia nada**, porque a mecânica é a mesma para 3 ou para 8. Minha única recomendação de projeto: **um fragmento por fonte, não um por tema.** Se cada tipo vem de um lugar diferente (um de boss, um de evento, um de caixa, um de PvP), o custo multi-fragmento passa a exigir naturalmente que o jogador toque em vários sistemas — que é o efeito que você quer. Se os tipos forem só cores sem fonte distinta, viram uma moeda só com passos extras.

### Kits: chave sim, caixa com ressalva

Sua pergunta — dar caixas no kit é burrice? **Não é burrice, mas os dois itens têm papéis diferentes e não devem ir no mesmo lugar.**

| | Chave de crate | Caixa misteriosa |
|---|---|---|
Papel | canal de loot **abundante** — coins, XP, itens, skin de faixa baixa | canal de loot **premium** — armadura de tier alto, skin de topo, livro de `pilhagem`, combustível infinito |
No Ranking de Apelões | score 7 | score 7 no invólucro, **score 1–3 no conteúdo** |
Em kit | ✅ perfeito. Dá recompensa a cada sessão, alimenta a progressão constante, não move a curva | ⚠️ só em kit VIP de cooldown longo (semanal/mensal) |

Se a caixa premium sai de graça a cada 6h, o canal que segura a temporada — a taxa de faucet de livro — arrebenta, e com ele o teto de multiplicadores. Mas caixa em kit VIP semanal é ótimo: é benefício de pagante, previsível, e cabe no orçamento.

**Kits são cumulativos e as 3 contas coletam em paralelo — e isso fica como está.** O rank 20 usa os 20 kits, e só perde ao prestigiar. Números: 20 kits × 4 resgates/dia (6h) × 3 contas = **240 aberturas/dia por jogador no endgame**.

Esse número não é um problema, é **o parâmetro de projeto da crate**. Calibrada para 240 aberturas/dia, a crate deixa de ser "abri e ganhei" e passa a ser caça-níquel:

| Faixa da tabela | Chance | Efeito com 240 aberturas/dia |
|---|---|---|
Recheio (coins pequeno, XP, material) | ~90% | ~216/dia — é o "algo subindo sempre" |
Bom (consumível, chave melhor, skin baixa) | ~9% | ~22/dia |
Raro (livro de classe baixa, armadura de tier médio) | ~0,9% | ~2/dia |
**Jackpot** (livro de `pilhagem`, skin de topo, combustível infinito) | **~0,1%** | **~0,24/dia** — 4 dias de espera média |

É a estrutura que o jogador de RankUP mais gosta: retorno constante e quase imperceptível, com pico raro. O erro seria calibrar para 12 aberturas/dia e depois entregar 240.

Duas consequências: (1) **`GarnixCrates/upgrades.yml` passa a importar de verdade** — a escada de 20→500 aberturas por clique deixa de ser cosmética e vira sink real; (2) o valor por abertura tem que ser derivado do tier da crate, senão 240 aberturas de crate de tier alto viram uma segunda fonte de renda paralela.

Casamento natural que já existe de graça: **kit do rank N dá chave da crate da banda do tier N.** O gate de rank já está no kit, então a chave herda o gate sem config nova. Sugestão para não achatar tudo: chave de crate **em todos** os kits (é o recheio), e **caixa misteriosa só nos kits de marco** (ranks 5, 10, 15, 20) e nos kits VIP semanais/mensais.

Regra técnica dura desta fase: **nunca usar `coins add {player} <valor>` para payout escalado por tier.** `GarnixCore/messages.yml` só declara os tipos `string/int/double/boolean/player/text` — `int` trunca acima de 2,1×10⁹ e `double` perde precisão acima de 9×10¹⁵. Usar sempre o `type: CURRENCY` + `currency-id:` + `amount:` nativo. Comando fica só para chaves, XP, itens e cash (todos pequenos).

---

## Fase 6 — Comércio e anti-exploit (paralelo à Fase 5, não adiar pro lançamento)

`currency-blacklist: []` está **vazio nos 4**: CoinFlip, Duels, Market, Auctions. As 8 moedas circulam livremente, inclusive `cash`.

**Decisão sua: nada de blacklist de moeda. Todas as 8 moedas seguem negociáveis nos 4 plugins; a mitigação é taxa.** Registro os riscos abaixo uma vez, de forma factual, e sigo com o desenho que você escolheu.

| # | Item | Ação |
|---|---|---|
| **E1** | **Duels tem 0% de taxa** — é o único canal de transferência pura entre contas do servidor | ✅ **adicionar taxa.** Recomendo alinhar com os 10% que já existem em todas as moedas, para haver um só número no servidor |
| **E2** | **Bolão entrega 100% do bolo a um vencedor, sem rake**, com moeda escolhida em runtime | ✅ **adicionar rake.** Mesmos 10% |
| E3 | `bet.max-amount: 1.0E63` é um **double**: no T20 o ULP é ~131.072, então apostas de valor alto são **silenciosamente arredondadas** e o jogador vê um número diferente do que digitou | não é decisão de design, é bug de precisão. Registro para corrigir junto com C1 — o valor certo é o teto do tier, não 10⁶³ |
| E4 | **Cash é negociável e vendido por dinheiro real.** Com `send` a 10% + market + leilão + coinflip + duelos, existe um caminho para mover cash entre contas | por sua decisão fica assim. A taxa de 10% é o freio. O simulador vai medir a concentração de cash com 50 e 250 jogadores e eu reporto se virar problema |
| E5 | **`spawnerslimite`/`maquinaslimite` negociáveis** — são capacidade, não riqueza, e alimentam a via sem teto físico | por sua decisão fica assim. Vigiar no simulador: se um jogador concentrar capacidade demais, a saída é C5 (teto por conta), não bloquear a troca |
| E6 | **Cabeças negociáveis** + 3 contas por IP | por sua decisão fica assim. O freio estrutural é a produção: cabeça de mob N só sai do spawner N, que exige rank N. Escassez na fronteira se autorregula |
| E7 | CoinFlip taxa **10% só do lucro**, não do principal | não contar coinflip como sink. Aceitável |
| E8 | **Credenciais vivas no git**: MySQL/MongoDB/Redis/ipinfo em `GarnixCore/config.yml`, token da loja Hyren em `GarnixStoreActivation/config.yml` | fora do escopo econômico, mas **rotacionar antes do lançamento** |

**A taxa de 10% passa a ser o único sink universal do servidor** — vale em `send`, market, leilão, baú-loja, coinflip (do lucro), e agora duelos e bolão. Como está num só campo por moeda (`currencies/<id>.yml → send.tax.percentage`), é um botão só para ajustar liquidez se o simulador mostrar economia inflada.

### Orçamento de sinks

Cada tier absorve **60–75%** da renda de um dia daquele tier:

| Sink | % da renda do tier | Fórmula |
|---|---|---|
**Spawner N + 3 trilhas de upgrade** | **35%** | compra + upgrades em coins **e dracmas** |
**Máquinas A–O + upgrades** | **15%** | máquina da banda + trilha própria |
Limites (s.limite, m.limite, galpão) | 10% | contagem linear, preço na escada |
**Combustível comum** | **8%** | sink recorrente; ~20–25% da produção da máquina alimentada |
Consumíveis (bombas, drill, chaves, boosters) | 5% | |
Rank N+1 (parte em coins) | **2%** | simbólico — o gate real é cabeças, ver "Dois eixos" |
Sobra carregada pro dia seguinte | 25% | = **2,5% da renda de amanhã** — invisível por construção |

**O corolário importa mais que o preço: sink tem que ser GATEADO, não só caro.** Um sink precificado no tier N é 10% de um dia no N+1 e 1% no N+2 — de graça. Todo sink precisa de trava junto do preço: permissão de rank, `mine-level-unlock`, `require: {level, crops}`, `release:` do spawner, `required-level` da recompensa de pesca. O coins-shop de 273 produtos é o exemplo do contrário — **208 deles custam `2500` fixo**, então a loja de blocos inteira é grátis a partir do dia 4. Está tudo bem (é QoL), mas **não conta como sink.**

---

## Fase 7 — Shops (por último, como você pediu)

- **`GarnixServerShops/coins-shop/*.yml`** — 273 produtos em 4 bandas chapadas (1.500 / 2.500 / 5.000 / 15.000). Reprecificar por banda de tier com `release-in`. Tratar como QoL, não como sink.
- **`GarnixServerShops/cash-shop/`** — hoje só existe o `example.yml` de fábrica. Construir as 4 faixas A–D. Âncora que vale manter: o `pacote-lendario` a 500 cash = exatamente uma temporada de grind free. É um preço deliberado e bom.
- **Tabela de paridade site ↔ in-game** — para cada produto do cash-shop, a rota in-game equivalente e o custo em horas. É o que garante a sua regra "tudo do site é obtenível jogando, alguns mais difíceis".
- **`discounts.yml`** — alinhar com a escala projetada (celestial −3 → garnix −15) e com `GarnixSpawners/ranks.yml`. Corrigir também os `weight` em `GarnixVips/vips/*.yml` (hoje invertidos) e o lore dos 4 arquivos, que anuncia −10%/+10% em todos e não corresponde a nenhuma tabela. **Os arquivos de VIP são o último lugar a mexer** porque o lore tem que citar os números finais já validados.

---

## Mudanças de código — aprovadas

Fontes em `Desktop/garnix/sources` (sincronizar `resources/` junto). **C1, C2, C6 e C7 estão aprovados** — são os 4 pré-requisitos. C4, C5 e C8 seguem opcionais, só se o teste ou o simulador pedirem. C3 depende do resultado do V1.

**Nota sobre o C2 e o limite de plantas da 1.8.** A 1.8 só tem 4 plantações usáveis num sistema de plot (trigo, cenoura, batata, nether wart) — é por isso que `FARM_TYPES` tem 4, e é um teto da versão, não do config. Essa limitação **mata a solução alternativa** (expandir para 20 tipos precisaria de 16 plantas que a 1.8 não tem), mas não afeta o C2: com valor por nível, o **mesmo nether wart** paga `coins 350` no nível 50 e `coins 1,3×10¹¹` no nível 100. Há precedente no próprio repo — a mineração também não tem 21 minérios na 1.8 e resolve reusando material com valor maior (`'20': ouro → coins 2.1` vs `'100': bloco_ouro_final → coins 12.0`). Os `_final` do `GarnixMining/levels.yml` são exatamente esse padrão.

| # | Plugin | Mudança | Por que é indispensável | Bloqueia |
|---|---|---|---|---|
**C1** | GarnixCore / GarnixCurrencies + spawners/máquinas/crates/shops | Tipos numéricos para `BigInteger`/`BigDecimal` nos campos `costs`, `drops.amount`, `price`, e no parser de argumento de comando | `Long.MAX` = 9,22×10¹⁸. **T18–T20 estouram e truncam mod 2⁶⁴ sem log nenhum.** Sem isso o teto da temporada é quintilhão, não sextilhão | T18, T19, T20 |
**C2** | GarnixFarm | Tabela opcional de moeda por nível em `levels.yml`, espelhando o schema que **já existe** em `GarnixMining/levels.yml` | Sem ela farm não tem onde guardar 16,5 ordens e as "4 vias equivalentes" não existem | paridade do Farm |
**C3** | GarnixCore / GarnixCurrencies | Tabela de sufixos do formatter `SUFFIX` configurável, até sextilhão+ | Hoje é hardcoded, sem tabela em YAML nenhum. **Confirmar com V1 antes** — pode já funcionar | exibição de 10²¹ |
**C6** | GarnixRankUP | **Prestígio:** lista de comandos global (roda em qualquer prestígio, para remover permissões via LuckPerms) + listas **por nível** de prestígio, com níveis vazios permitidos. Hoje só existe `prestige.commands: []`, chapado | É o que faz o prestígio deixar de ser um número. Sem isso não há como dar recompensa por nível nem limpar as permissões de rank | todo o sistema de prestígio |
**C7** | GarnixMining / GarnixFarm | Garantir que o proc de **chave** conte **blocos/colheitas manuais**, não os quebrados por AoE | `blessed` a 9,21% sobre 1,6×10⁷ blocos/h de AoE = 1,4 milhão de chaves/hora. O conceito já existe no frenzy (`blocks-required` conta só manual) — só precisa valer para chave | toda a economia de chaves |
**C4** *(opcional)* | Mining / Farm / Fishing | Campo de **bônus de conjunto** de armadura | Hoje 4 peças só somam. Se conjunto tem que importar, precisa de campo | nada — nice to have |
**C5** *(opcional)* | Spawners / Machines | Retorno decrescente ou teto diário por conta em drop AFK | Protege a razão ativo:AFK de 20× contra empilhamento de contas | nada — só se o simulador mostrar quebra |
**C8** | GarnixBosses | `max-simultaneous` global de bosses | **~30.000 spawns/dia com 100 jogadores, em lotes de 20–30** (`boss-stack-radius: 5`). É o pico de carga do servidor | estabilidade com 100+ jogadores |

**C1, C2, C6 e C7: aprovados.** **C8 passou a necessário** com o volume alto de bosses (~30.000 spawns/dia em lotes). C3 depende de V1. C4 e C5 só se o teste ou o simulador pedirem.

**Boosters não precisam de código:** por tempo, 3 slots (1 por tipo), sem empilhar multiplicador — é exatamente o que os 6 plugins já implementam. Só falta a rota de compra, que é config da Fase 7.

---

## Verificação

**Portão 0 (antes de qualquer YAML):** V1–V5 respondidos. Se V1 falhar e C3 não for aprovado, o teto desce para quintilhão e a tabela de tiers inteira recua um dia. Se V3 mostrar multiplicadores multiplicativos em vez de somados, o teto de 100× muda e a Fase 2 recalcula.

**Por fase:** rodar o simulador com os YAMLs reais depois de cada fase e conferir contra a tabela de tiers. Tolerância ±25% na renda/h por tier; fora disso, a fase não fecha. Resultado de cada rodada registrado em `GARNIX - ECONOMIA/09-VERIFICACAO.md`.

**Cronometragem in-game (você, como jogador):** para cada tier de amostra (T5, T10, T15, T20) medir os 5 números do `metrics.csv` — blocos/min manual, coins/h ativo, coins/h AFK por conta, cabeças/h, fisgadas/h — e comparar com a coluna alvo. É o que valida se o teto físico calculado dos configs corresponde ao teto real do servidor.

**Teste de carga econômica:** simular 50 e 250 jogadores e checar (a) liquidez de cabeças na fronteira — no rank 16+ tem vendedor suficiente?, (b) se o market/leilão colapsa preço de cabeça e de livro de tier baixo, (c) se a razão ativo:AFK sobrevive a alguém rodando 3 contas de autoclick.

**Teste de carga de infraestrutura (obrigatório antes do lançamento):** com a árvore de encantes no máximo, medir pacotes/tick e TPS com 50, 100 e 250 contas online no perfil real (2 AFK + 1 ativa). É o teste que valida as classes C/D/E e o `enchant-animation-budget`. Se o TPS cair, o ajuste é **baixar a chance da classe alta e subir o payoff por proc** — nunca baixar o payoff, porque isso desmonta a curva de tiers.

**Teste de estagnação (o mais importante do simulador):** para **cada tier N de 1 a 19**, comparar a melhor renda possível permanecendo em N — todo o dinheiro em quantidade e upgrades — contra a renda subindo para N+1. Se em qualquer N a resposta for "ficar", a curva está errada e a fase não fecha. É o único teste que pega um erro que só apareceria no dia 15 com o servidor cheio.

**Teste de banda no fim:** perfil casual (1h/dia) tem que fechar entre 10¹² e 10¹⁵; dedicado (3h/dia) em ~10²¹; hardcore (8h/dia) não mais que ~10²³ — se passar disso, apertar o `release:` escalonado dos spawners, que é o freio de calendário.

---

## Pendências

**Nada bloqueia mais o início.** A Fase 0 são seus testes in-game (V1–V8) e a Fase 1 são os documentos e o simulador.

**Resolvemos no caminho:**

1. **Nomes das 15 máquinas de coins** — trabalhamos com A a O até você mandar os nomes. Substituição direta no fim.
2. **Contas alt e o teto AFK** — o simulador mede se a razão ativo:AFK de 20× sobrevive a 3 contas de autoclick. Se não sobreviver, a saída é C5 (teto diário por conta), e não mexer nas 3 contas, que você já disse que fica como está.
3. **Máquina de Cabeças** — não estava na sua seleção. Se quiser depois, minha recomendação é que só produza cabeça de mob **abaixo** do rank atual, para não furar o eixo de cabeças, que é o gate de tempo de todo o rank e prestígio.
4. **Cash-shop e coins-shop** — Fase 7, por sua decisão.
5. **Especificação das chaves dos kits** — eu produzo a tabela (kit → chave → quantidade), você aplica in-game.
6. **Quantos fragmentos e com que nomes** — mecânica é idêntica para 3 ou 8 tipos, então não bloqueia. Recomendo um tipo por fonte (boss, evento, caixa, PvP) em vez de um por tema.
7. **Recompensas dos 21 eventos** — postergado para a Fase 7 junto com o cash-shop, por sua decisão.
8. **Nome e bônus da 10ª skin de farm** — a criação está decidida; o nome e o valor exato (≈40%) saem na Fase 4.

**Respondidas e já no plano:** auditoria completa dos ~212 itens ativáveis · cacto como via de primeira classe · boosters 2× in-game e **3× no site** (com o teto de multiplicadores recalculado) · itens de poder ilimitado mantidos com preço e raridade · `givehandall` mantido · sistema de visitantes mantido com a vaga no nível Mítico− · caixas I in-game e **II no site** · armadura nunca no site · as 3 skins mais raras no site · 10ª skin de farm criada · vagas de VIP como estão · **chave VIP para todos os online a cada ativação de VIP** · chave rankup no rankup em volume baixo · eventos postergados para a Fase 7 · **C1, C2, C6, C7 aprovados e C8 necessário** · frenzy no modo volume · limites de home/market/leilão/baú intocados e exclusivos de VIP · clãs puramente sociais · captcha é só anti-macro na compra, AFK segue 24h · **5 bosses no lançamento + 3 engatilhados** · **~250–300 bosses/dia, empilhados** · boosters in-game de 5m a 1h no máximo, site com durações maiores · tetos de throughput medidos antes de mexer · temporada de **20 dias** (tier N = dia N) · eixo das 4 vias · alcance do teto · faucet de cash · AFK vs ativo 20× · cabeças negociáveis · código Java mínimo · documento mestre + **simulador em JavaScript** · Discord/Celestial 3 dias · hierarquia VIP real · bônus de rank sem desconto · armaduras e skins a projetar · hierarquia de encantes por custo de infra · livros como terceiro canal · dracmas como secundária dos spawners · dracmas no requisito do spawner · kits cumulativos e eu nunca editando base64 · chaves dos kits redefinidas do zero por especificação · boosters por tempo com 3 slots · 15 máquinas de coins (A–O) · as 6 máquinas especiais · autosell só cash · combustível infinito e comum · volume massivo de chaves · matadora hit-kill · escada de raridade única · prestígio infinito com cabeças travando o rank e coins fora do eixo · **sem blacklist de moeda, taxa em duelos e bolão** · fragmentos como sistema aberto · OnTime reescalado até 15d.
