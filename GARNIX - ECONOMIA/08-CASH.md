# 08 — CASH

A moeda mais rara do servidor. Orçamento de faucets, sinks e faixas de preço.

**A regra:** um jogador free acumula **~400 na temporada inteira**. `500.000` é o exagero absoluto de um whale. Tudo que se vende no site é obtenível jogando, alguns por rotas muito mais difíceis.

Última atualização: **29/07/2026**

---

## Estado atual — inflado ~100×

| Fonte | Hoje | Na temporada de 20 dias |
|---|---|---|
`DailyRewards/membro.yml` | `cash add 50` | **1.000** |
Dailies VIP | 100–500/dia | 2.000–10.000 |
**21 arquivos de evento** | **`cash add 5000–15000` por vitória** | **10⁵–10⁶** |

**Um único evento ganho hoje paga o cash shop inteiro dez vezes.** E com 21 eventos rodando várias vezes ao dia, `min-players: 2` e `max-players: 0` (ilimitado), dois amigos farmam 5K por rodada.

Os sinks de cash que existem em config hoje: cash-shop 10–500 (só o `example.yml` de fábrica) e upgrades de autosell 1.000–3.000. **O orçamento inteiro de upgrade premium custa menos que duas vitórias de evento.**

---

## Faucets — alvo

| Fonte | Alvo | Na temporada |
|---|---|---|
`membro.yml` (todo jogador) | **20/dia** | **400** ✅ |
`vinculado.yml` (Discord) | **+8/dia** permanente | +160 |
Daily celestial (VIP entrada) | 40/dia | 800 |
Daily imortal | 60/dia | 1.200 |
Daily supremo | 85/dia | 1.700 |
Daily garnix (topo) | **120/dia** | 2.400 |
Eventos | **10–40**, só num **subconjunto difícil** | +200–400 |
Conquistas / marcos raros | 25–100, gate duro | variável |
**Máquina de Cash** | **2/dia por unidade**, sem teto por conta | 40 por unidade |
`GarnixStoreActivation` | compras reais | — |

### Totais verificados no simulador

| Perfil | Cash na temporada |
|---|---|
free | **400** |
free vinculado | **560** |
free vinculado + ativo em eventos | **860** |
+ máquina de cash | **960** |
garnix (VIP topo) | **2.960** |
whale (site) | teto de exagero **500.000** |

O free chega em 400, dentro da faixa de 300–500. ✅

⚠️ **O limite de 1 por conta foi cancelado em 11/08/2026.** Ele nunca foi pedido pelo dono, e a checagem mostrou que **não existe no plugin**: não há campo de teto por conta em `GarnixMachines/config.yml` nem nos arquivos de máquina. O que existe é a moeda `maquinaslimite`, que é poder de compra na **loja** de máquinas — e as especiais são todas `shop: false`, entrando por `/maquina give`.

O único teto real é **1 bloco de máquina por terreno**, e o jogador tem vários terrenos. A máquina rende **2 cash/dia** por unidade (200 ciclos de 432s × 0,01), o que dá 40 na temporada — modesto o bastante para o teto não ser urgente. Se um dia virar problema, o botão é o `delay` em `GarnixMachines/machines/cash.yml`.

### Ordem dos dailies — corrigida

Hoje a escada está **invertida**: `investidor` paga 500 e `celestial` paga 100. Como **celestial é o VIP mais básico** (hierarquia real: celestial < imortal < supremo < garnix), a escada certa é ascendente: 40 → 60 → 85 → 120. `investidor` e `influencer` são tags de parceria, não degraus da escada.

---

## Vínculo Discord

Primeira vinculação dá **Celestial por 3 dias**, 1× por conta de Discord, à prova de unlink/relink. Praticamente todo jogador ativo vai vincular, então na prática **os dias 1–3 têm o servidor inteiro com o VIP de entrada ativo**.

Duas consequências no cálculo:

1. Dias 1–3 são T1–T3, onde a renda da casa vai de 10⁴ a 6,4×10⁵. O bônus custa quase nada em coins absolutos (~10⁴ nos 3 dias) e vale muito em sensação. **É o melhor lugar possível para dar VIP de graça** — não distorce nada e ensina o valor do VIP na hora em que o jogador está decidindo se fica.
2. **T1–T3 devem ser calibrados COM o bônus ligado**, não sem. Senão os 3 primeiros dias vêm inflados e o dia 4 parece punição quando o VIP expira.

A recompensa diária de vinculado é um **faucet permanente para toda a base**, não um bônus de VIP — leva o free de 400 para 560.

---

## Sinks

| Sink | Moeda | Faixa |
|---|---|---|
Cash-shop | cash | ver faixas abaixo |
Upgrades de autosell do galpão | cash | **150–800/nível** (hoje 1.000–3.000, inalcançável) |
`/cash enviar` | 10% de taxa | é o sink universal |

### Faixas de preço do cash-shop

Reescritas em **11/08/2026** para o catálogo real de 32 produtos, em [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md).

| Faixa | Preço | Quem alcança | Conteúdo |
|---|---|---|---|
**A** | 150–500 | **free chega** | chaves rankup, boosters 3× 1h, torre de cacto, limpador, venda automática, explosivo 2×2 |
**B** | 500–3.000 | free dedicado chega em 1 item | as **caixas II**, limite de armazém e de máquinas, explosivo 4×4 e 6×6, matadora Ancestral |
**C** | 3.000–20.000 | pagante | caixa `caixas`, limite de spawner, explosivo 8×8, britadeira, robô mítico, matadora Rúnica e Abissal |
**D** | 20.000+ | whale | **caixa garnix** (18.750), **máquina de cash** (31.250) |

⚠️ **VIP e matadora hit-kill saíram da faixa D** — os dois viraram exclusivos do site, por decisão do dono. O teto do cash-shop hoje é a Máquina de Cash a 31.250, e não mais os 100.000 do VIP Garnix.

**A âncora mudou de lugar.** O `pacote-lendario` a 500 cash do `example.yml` de fábrica não existe no catálogo real. A régua entre A e B agora é a **Caixa Tier II a 1.125** — o item que um free dedicado alcança em um, guardando a temporada inteira.

---

## Cash é negociável — por decisão do dono

`currency-blacklist: []` fica **vazio** nos 4 plugins (CoinFlip, Duels, Market, Auctions), e o `send` de cash fica habilitado. Registrado como escolha consciente, não como problema a resolver.

| Canal | Taxa |
|---|---|
`/cash enviar`, Market, Leilão, Baú-loja | **10%** |
CoinFlip | 10% **do lucro** |
**Duels** | ❌ **0% hoje** → ✅ **adicionar 10%** |
**Bolão** | ❌ **0% hoje**, 100% do bolo a 1 vencedor → ✅ **adicionar rake de 10%** |

**A taxa de 10% é o único sink universal do servidor** e está num campo por moeda (`currencies/<id>.yml → send.tax.percentage`), então é um botão só para ajustar liquidez se o simulador mostrar concentração.

**O que o simulador vai medir** (teste S3, com 50/100/250 jogadores): concentração de cash entre contas. Se o cash se acumular em poucas mãos além do esperado, a saída é subir a taxa — não bloquear a troca.

---

## Paridade site ↔ in-game

Todo produto pago tem rota in-game. A tabela completa, produto por produto, fica em [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md). O resumo:

| Produto | Canal | In-game |
|---|---|---|
Combustível infinito | **só site**, R$ 59,90 | caixa `garnix`, **0,25%** |
Matadora Hit-Kill | **só site**, R$ 44,90 | caixa `garnix`, **0,25%** |
Skin de topo | **só site**, R$ 19,90 a via | caixa de via II, `skins-ii` e `garnix` (0,5%) — as 3 últimas **não são forjáveis** |
VIP | **só site**, R$ 19,90 a 199,90 | papel na caixa `garnix` (1–3 dias) + 3 dias de Celestial na vinculação de Discord |
Booster 3× | nos dois, 250–313 cash | caixa `boosters` e crates, duração **máx. 10m** |
Caixa II | nos dois, 1.125 cash | crate da via e caixa `caixas` |
`spawnerslimite` | **só cash-shop**, 4.000 | crate, boss e Caixa Recursos — **~27 na temporada** |
**Armadura** | ❌ **nunca vendida** | só caixa |
**`fortunate`** | ❌ **nunca vendido** | só gemas |
**Livros** | ❌ **nunca vendidos** | crate e caixa de banda alta |

⚠️ A linha antiga dizia `VIP → GarnixFragments → tag-vip`. **Isso não existe** — não há nada de VIP na loja de fragmentos. E o `spawnerslimite` não sai mais por corais: a rota é drop, desde 06/08/2026.

O padrão: **o site vende velocidade e conveniência; o jogo vende as mesmas coisas por sorte ou por tempo.**

**A exceção única:** o VIP Investidor não tem rota in-game nenhuma e não recebe `paper-icon`, por decisão do dono. Detalhado em [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md).

---

## A fazer na Fase 7

| # | Item | Arquivos |
|---|---|---|
1 | Reescrever os 8 dailies | `GarnixDailyRewards/rewards/*.yml` |
2 | **Reescrever os 21 eventos** — a maior correção de cash do projeto (5.000–15.000 → 10–40 num subconjunto) | `GarnixEvents/events/**/*.yml` |
3 | ✅ **Feito em 11/08/2026** — cash-shop construído: 5 categorias, 32 produtos | `GarnixServerShops/cash-shop/` |
4 | Reprecificar os upgrades de autosell | `GarnixWarehouse/config.yml` |
5 | ❌ **Cancelado** — o limite de 1 por conta **não existe no plugin** e o dono não o pediu. O único teto real é 1 bloco de máquina por terreno, e o jogador tem vários terrenos | `GarnixMachines/machines/` |
6 | Adicionar taxa em Duels e rake no bolão | `GarnixDuels/config.yml`, `events/chat/bolao.yml` |
7 | ✅ **Feito em 11/08/2026** — tabela reescrita para o catálogo real | `04-PARIDADE-SITE.md` |

⚠️ **Regra técnica que vale para todos:** cash é pequeno (10²–10⁵), então `cash add {player} <valor>` por comando é **seguro** — o problema de precisão de `int`/`double` só morde acima de 2,1×10⁹. Para payouts em **coins** escalados por tier, usar sempre `type: CURRENCY` nativo.
