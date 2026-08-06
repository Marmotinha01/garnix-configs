# GARNIX — Ranks e Prestígio

> Escopo: `GarnixRankUP/ranks/*.yml` (20) + `GarnixRankUP/config.yml`. Reescrito em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).

## O rank tem dois eixos, e o de coins é o fácil

```
custo em coins = 0,02 × casa/dia(N)
custo em cabeças = ~3 minutos de produção do spawner do rank anterior
```

**O gate real do rank são as cabeças.** Os coins são 2% da renda do dia — pagáveis em minutos. Quem segura a escada é o eixo de contagem, que dinheiro não compra: cabeça só sai de matar mob de spawner.

## ✅ O teto de 10¹⁸ foi removido

Os ranks 19 e 20 estavam **cravados em 1.000.000.000.000.000.000**, quebrando a escada nos dois últimos degraus — o rank 20 custava exatamente o mesmo que o 19.

Não era descuido: [02-TIERS.md](../GARNIX%20-%20ECONOMIA/02-TIERS.md) registrava *"a parte em coins do rank é travada em 10¹⁸ de propósito, para o rank nunca depender do C1"*, sendo o C1 o problema de `Long.MAX` (9,22×10¹⁸).

**Mas o motivo técnico não existe:** `RankManager.java:142` lê o custo com `new BigDecimal(parts[2])`, que não tem teto. ✅ Decisão do dono (06/08/2026): tirar o teto. Os dois últimos degraus voltaram a seguir a razão de 6,146×.

```
rank 18 ....    764.000.000.000.000.000
rank 19 ..  4.700.000.000.000.000.000     (era 1e18 — 6,15× agora)
rank 20 .. 28.900.000.000.000.000.000     (era 1e18 — 6,15× agora)
```

## A escada completa

| Rank | Nome | Custo em coins | Cabeça exigida | Libera o spawner | Libera a máquina |
|---|---|---|---|---|---|
| 1 | Coelho | — | — | — | — |
| 2 | Porco | 184.000 | RABBIT ×380 | PIG | — |
| 3 | Ovelha | 1.130.000 | PIG ×930 | SHEEP | **Carvão** |
| 4 | Vaca | 6.960.000 | PIG ×1.600 | COW | **Pedra** |
| 5 | Morcego | 4,28×10⁷ | SHEEP ×2.500 | BAT | **Ferro** |
| 6 | Jaguatirica | 2,63×10⁸ | SHEEP ×3.600 | OCELOT | **Ouro** |
| 7 | Lobo | 1,62×10⁹ | COW ×4.900 | WOLF | **Redstone** |
| 8 | Zumbi | 9,94×10⁹ | COW ×6.400 | ZOMBIE | **Lápis** |
| 9 | Esqueleto | 6,11×10¹⁰ | BAT ×8.200 | SKELETON | **Diamante** |
| 10 | Aranha | 3,75×10¹¹ | BAT ×10.000 | SPIDER | **Esmeralda** |
| 11 | PigZombie | 2,31×10¹² | OCELOT ×13.000 | PIG_ZOMBIE | **Obsidiana** |
| 12 | Slime | 1,42×10¹³ | OCELOT ×15.000 | SLIME | — |
| 13 | Guardian | 8,71×10¹³ | WOLF ×18.000 | GUARDIAN | **Quartzo** |
| 14 | MagmaCube | 5,36×10¹⁴ | WOLF ×21.000 | MAGMA_CUBE | **Titânio** |
| 15 | Endermite | 3,29×10¹⁵ | ZOMBIE ×25.000 | ENDERMITE | — |
| 16 | Bruxa | 2,02×10¹⁶ | ZOMBIE ×30.000 | WITCH | **Rubi** |
| 17 | Blaze | 1,24×10¹⁷ | SKELETON ×34.000 | BLAZE | **Safira** |
| 18 | Golem | 7,64×10¹⁷ | SKELETON ×40.000 | IRON_GOLEM | — |
| 19 | Ghast | 4,70×10¹⁸ | SPIDER ×46.000 | GHAST | **Platina** |
| **20** | **Wither** | **2,89×10¹⁹** | SPIDER ×52.000 | WITHER | **Adamantita** |

### A cadeia de cabeças fecha nos 19 degraus

Para o rank N você precisa da cabeça do mob `⌈N/2⌉`, e o spawner `⌈N/2⌉` exige rank `⌈N/2⌉ ≤ N−1`, que você já tem. Auditado: nenhum degrau exige uma cabeça que ainda não é produzível.

⚠️ **O rank 1 nunca é concedido.** O `coelho.yml` tem `commands: []` e não executa, porque ninguém "sobe" para o rank 1 — por isso o `RABBIT` tem `permissions.buy: ""` e o rank 2 é o primeiro a conceder alguma coisa.

## O prestígio

| | |
|---|---|
Custo | **nenhum** — o preço é a volta inteira dos 20 ranks |
Encarecimento | **+2% por prestígio**, linear, valendo também para os custos em `head` |
Teto da temporada | **~345 prestígios**, a 1 min/rank |
O que reseta | só a escada de rank e as 4 escadas de bônus |
O que **fica** | cabeças, dracmas, equipamento, spawners colocados, `spawner.buy.*`, `machines.buy.*` |

**O que fica é patrimônio.** É isso que transforma prestigiar de castigo em volta rápida — e o V6 confirmou que os spawners colocados continuam produzindo mesmo com o rank zerado.

⚠️ **`permissions.kill` fica aberta nos 20 mobs.** Gatear a morte por rank faria o prestígio virar suicídio: o jogador que prestigiou não conseguiria matar os mobs dos spawners que já tem colocados, e eles continuam produzindo.

### ✅ O prestígio não gateia mais nenhuma máquina

Eram 12 máquinas presas a marcos de prestígio (1 → 320). Saíram todas em 06/08/2026 — ver [maquinas.md](maquinas.md). O bloco `prestige.rewards` ficou só com as duas vagas de visitante (marcos 155 e 245), e os comentários dos marcos ainda vazios (caixas de prestígio, tags, trocador de dracmas) seguem aguardando as Fases 5 e 7.

⚠️ **Os marcos do plano original (1, 5, 10, 25, 50, 100, 250, 500) foram calibrados contra um teto errado** e precisam ser reescalados para os 345 reais.

## A escada de bônus — o VIP substitui o rank, não soma

`MobConfigManager:313` ordena por `desconto + bônus` decrescente e devolve a **primeira** entrada cuja permissão o jogador tem: **o maior vence.** Por isso todo nó de VIP fica acima do teto do rank 20 — senão o VIP não valeria nada para quem chegou lá.

| Quem | Desconto | Bônus | Soma |
|---|---|---|---|
**garnix** (topo) | 15 | 35 | **50** |
supremo | 10 | 31 | 41 |
investidor · influencer | **0** | 35 | 35 |
imortal | 6 | 27 | 33 |
celestial | 3 | 24 | 27 |
**rank 20** (sem VIP) | 0 | 20 | **20** |

**Parceria sem desconto** é deliberado: quem tem desconto compra mais barato e pode revender, o que criaria uma via de receita paralela.

⚠️ **O desconto de VIP não vale nos upgrades** (`UpgradeManager:137`). Como maxar um bloco custa mais que comprá-lo (0,20 contra 0,15 da renda diária), **a maior parte do sink da via passiva é imune ao desconto** — o que limita o P2W nessa via por construção.
