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
**Máquina de Cash** | **3–8/dia, limite 1 por conta** | 60–160 |
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

⚠️ **A Máquina de Cash é o item mais sensível do servidor.** A 5 cash/dia × 3 contas × 20 dias = 300, **quase o orçamento free inteiro**. Por isso o limite de **1 por conta** não é opcional — é o que impede a máquina de dobrar a economia de cash de quem tem 3 contas.

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

| Faixa | Preço | Quem alcança | Conteúdo |
|---|---|---|---|
**A** | 50–500 | **free chega** | consumíveis, 1 chave, cosmético, booster curto, fly |
**B** | 500–3.000 | free dedicado chega em 1 item | **caixa II**, skin média, +1 limite, autosell |
**C** | 3.000–20.000 | pagante | **booster 3× longo**, **combustível infinito**, máquinas especiais, `pilhagem 3` |
**D** | 20.000–100.000 | whale | VIP, **matadora hk**, bundles de temporada |

**Âncora que vale manter:** o `pacote-lendario` a **500 cash** do `cash-shop/example.yml` = exatamente uma temporada de grind free. É um preço deliberado e bom, e serve de régua para a fronteira entre A e B.

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

Todo produto do site tem rota in-game. A tabela completa com custo em horas fica em [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md), na Fase 7. O padrão:

| Produto | Site | In-game |
|---|---|---|
Combustível infinito | faixa C/D | jackpot da caixa `garnix`, ~0,006%/abertura |
Booster 3× | faixa C, duração longa | jackpot, duração **máx. 1h** |
Caixa II | faixa B | drop beeem raro |
Skin de topo | faixa B/C | forja até a 7ª + caixa 8–10 |
`spawnerslimite` | faixa C | corais com câmbio decrescente + dracmas |
VIP | faixa D | `GarnixFragments` → `tag-vip` temporário |
**Armadura** | ❌ **nunca vendida** | só caixa |
**`fortunate`** | ❌ **nunca vendido** | só gemas |

O padrão: **o site vende velocidade e conveniência; o jogo vende as mesmas coisas por sorte ou por tempo.**

---

## A fazer na Fase 7

| # | Item | Arquivos |
|---|---|---|
1 | Reescrever os 8 dailies | `GarnixDailyRewards/rewards/*.yml` |
2 | **Reescrever os 21 eventos** — a maior correção de cash do projeto (5.000–15.000 → 10–40 num subconjunto) | `GarnixEvents/events/**/*.yml` |
3 | Construir o cash-shop nas 4 faixas | `GarnixServerShops/cash-shop/` |
4 | Reprecificar os upgrades de autosell | `GarnixWarehouse/config.yml` |
5 | Orçar a Máquina de Cash com limite de 1 por conta | `GarnixMachines/machines/` |
6 | Adicionar taxa em Duels e rake no bolão | `GarnixDuels/config.yml`, `events/chat/bolao.yml` |
7 | Escrever a tabela de paridade | `04-PARIDADE-SITE.md` |

⚠️ **Regra técnica que vale para todos:** cash é pequeno (10²–10⁵), então `cash add {player} <valor>` por comando é **seguro** — o problema de precisão de `int`/`double` só morde acima de 2,1×10⁹. Para payouts em **coins** escalados por tier, usar sempre `type: CURRENCY` nativo.
