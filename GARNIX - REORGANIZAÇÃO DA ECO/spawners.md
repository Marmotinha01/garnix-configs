# GARNIX — Spawners

> Escopo: `GarnixSpawners/spawners/*.yml` (20 arquivos). Reescrito em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).
> Fatia da via: **28,9% da renda diária da casa** — a maior do servidor.

## As fórmulas

```
custo por ITEM     = 0,15 × casa/dia(N) ÷ spawner-stack(N)
maxar um BLOCO     = 0,20 × casa/dia(N)          (soma das 10 trilhas)
coins por kill     = (spawners/dia(N) ÷ 24) ÷ (kills/h do bloco × efetivo × pilha)
dracmas por item   = 0,35 × dia de kill(N−1) ÷ itens        (0 no T1, bootstrap)
dracmas por kill   = N        chance 1%
```

⚠️ `costs` é o preço de **um item de spawner**, não de um bloco — um bloco junta até 512 itens. Comprar o **conjunto** do tier N custa exatamente 15% da renda daquele dia.

### Os termos do throughput

```
kills/h por bloco = min( spawner-stack , TETO do mob-stack ) × 3600 / delay
```

**`mob-stack` é TETO, não multiplicador** (`MobManager:139-152`). É por isso que as trilhas não podem subir as duas: `min(A,B)` faz quem comprar na ordem errada pagar sem ganhar nada, e nada avisa. O desenho é **um teto sobe, o outro nasce no máximo**.

| Termo | T1 | T20 | Como interpola |
|---|---|---|---|
`spawner-stack` | 64 | 512 | linear, +23,58/tier |
`delay` | 10s | 4s | linear, −0,316s/tier |
kills/h do bloco | 2,30×10⁴ | 4,61×10⁵ | produto dos dois |
**efetivo** | 1,000 | 1,194 | soma da série `Σ(1/6,146)^k` — o bloco novo domina |
pilha de multiplicadores | 1,00× | 8,10× | `(1+35% bônus) × pilhagem 2,0 × booster 3,0` |

**O "efetivo" é o que faz o bloco novo entregar só o que FALTA.** Um bloco de RABBIT rende drop de RABBIT para sempre; como o valor cresce 6,146× por tier, a soma de todos os blocos antigos converge em **1,194× o bloco do topo**.

## Os valores aplicados

| T | Data | Mob | Custo/item | Dracmas/item | Coins/kill | Dracmas/kill | Maxar o bloco |
|---|---|---|---|---|---|---|---|
| T1 | 14/08 | RABBIT | 3.520 | **0** | 0,78 | 1 | 3,00×10⁵ |
| T2 | 15/08 | PIG | 15.800 | 22 | 2,63 | 2 | 1,84×10⁶ |
| T3 | 16/08 | SHEEP | 76.400 | 67 | 10,8 | 3 | 1,13×10⁷ |
| T4 | 17/08 | COW | 389.000 | 135 | 47,1 | 4 | 6,97×10⁷ |
| T5 | 18/08 | BAT | 2.030.000 | 228 | 213 | 5 | 4,28×10⁸ |
| T6 | 19/08 | OCELOT | 1,08×10⁷ | 349 | 984 | 6 | 2,63×10⁹ |
| T7 | 20/08 | WOLF | 5,89×10⁷ | 500 | 4.610 | 7 | 1,62×10¹⁰ |
| T8 | 21/08 | ZOMBIE | 3,24×10⁸ | 683 | 21.900 | 8 | 9,93×10¹⁰ |
| T9 | 22/08 | SKELETON | 1,81×10⁹ | 901 | 105.000 | 9 | 6,10×10¹¹ |
| T10 | 23/08 | SPIDER | 1,02×10¹⁰ | 1.160 | 506.000 | 10 | 3,75×10¹² |
| T11 | 24/08 | PIG_ZOMBIE | 5,78×10¹⁰ | 1.460 | 2,45×10⁶ | 11 | 2,31×10¹³ |
| T12 | 25/08 | SLIME | 3,29×10¹¹ | 1.800 | 1,19×10⁷ | 12 | 1,42×10¹⁴ |
| T13 | 26/08 | GUARDIAN | 1,89×10¹² | 2.200 | 5,83×10⁷ | 13 | 8,72×10¹⁴ |
| T14 | 27/08 | MAGMA_CUBE | 1,08×10¹³ | 2.650 | 2,85×10⁸ | 14 | 5,35×10¹⁵ |
| T15 | 28/08 | ENDERMITE | 6,27×10¹³ | 3.170 | 1,40×10⁹ | 15 | 3,29×10¹⁶ |
| T16 | 29/08 | WITCH | 3,64×10¹⁴ | 3.750 | 6,85×10⁹ | 16 | 2,02×10¹⁷ |
| T17 | 30/08 | BLAZE | 2,11×10¹⁵ | 4.420 | 3,35×10¹⁰ | 17 | 1,24×10¹⁸ |
| T18 | 31/08 | IRON_GOLEM | 1,23×10¹⁶ | 5.190 | 1,64×10¹¹ | 18 | 7,65×10¹⁸ |
| T19 | 01/09 | GHAST | 7,21×10¹⁶ | 6.050 | 8,01×10¹¹ | 19 | 4,70×10¹⁹ |
| **T20** | **02/09** | WITHER | 4,22×10¹⁷ | 7.040 | 3,90×10¹² | 20 | 2,88×10²⁰ |

## Os quatro portões de comprar o spawner N

| Portão | Natureza | O que impede |
|---|---|---|
`release:` do dia N | calendário | o hardcore estourar o teto antes do fim |
`spawner.buy.<mob>` | permissão | pular a escada de rank (concedida pelo rank N) |
`costs.coins` | exponencial | comprar antes de ter renda para sustentar |
**`costs.dracmas`** | **linear no tempo de kill** | **comprar todos os 20 de uma vez** |

O portão de dracmas é o mais importante: dracma só sai de matar mob e acumula **linearmente com o tempo**. Um jogador que ganhou muito coins — no site, em aposta, vendendo cabeça — **não converte isso em spawners**, porque falta tempo de kill. É um teto de velocidade que dinheiro não atravessa.

⚠️ **O RABBIT não custa dracma** (bootstrap): dracma só sai de mob de spawner, e o RABBIT é o único comprável no rank 1. Cobrar dracma nele seria deadlock. Pelo mesmo motivo ele tem `permissions.buy: ""`.

## As três trilhas de upgrade

**São por MOB, não globais.** `UpgradeType` documenta: *"Each upgrade is configured per-mob in the mob's YAML file and tracked per-spawner instance in the database"*. Ou seja a definição (níveis, valores, custos) vive em `spawners/<MOB>.yml` e o progresso vive no bloco colocado.

| Trilha | Níveis | O que é | Natureza |
|---|---|---|---|
`spawner-stack` | 6 · 96 → 512 | quanto se **produz** por ciclo | teto |
`mob-stack` | 1 · base 512 → `-1` (ilimitado) | **buffer** de acumulação | teto |
`speed` | **3 a 6, por tier** · até 4s | **frequência** dos ciclos | divisor |

### ⚠️ O `mob-stack` é BUFFER, não taxa — a fórmula do doc antigo está mal escrita

`MobManager.java:135-152`: a cada ciclo o bloco adiciona `spawner.getStackSize()` à pilha do mob **vivo**, e o `mob-stack` corta o excedente (`room = cap − currentStack`; se `room ≤ 0`, então `toAdd = 0` e **o ciclo inteiro é perdido**).

```
spawner-stack  = quanto se PRODUZ por ciclo
mob-stack      = BUFFER de quanto acumula sem ser morto
speed (delay)  = frequência dos ciclos
```

O [13-PASSIVO.md](../GARNIX%20-%20ECONOMIA/13-PASSIVO.md) escreve `kills/h = min(spawner-stack, mob-stack) × 3600/delay`. **O número dá certo por acidente**: como `spawner-stack ≤ 512 = mob-stack base`, o `min` nunca morde. Mas ele não é um termo de taxa.

🚩 **E isso torna o `mob-stack` mais importante do que aquele doc diz.** No T20, com `spawner-stack: 512` e `mob-stack: 512`, o buffer enche em **um único ciclo** — se o jogador não matar entre dois ciclos de 4s, tudo do segundo em diante vai para o lixo. O upgrade `-1` não é "anti-perda menor": é o que separa produzir de desperdiçar para qualquer conta que não esteja matando 100% do tempo.

### ✅ A escada de `speed` — aplicada em 06/08/2026

✅ Decisão do dono: *"queremos uma quantia de upgrades maiores e mais significativos e divertidos de evoluir"*, com *"upgrades mais atraentes conforme o tier dos spawners"*.

O `speed` é a única trilha que **multiplica sem armadilha** — os outros dois são tetos que brigam no `min(A,B)`. **Uma restrição do parser define o desenho:** `DurationFormatter:37` usa o regex `(\d+)\s*([dhms])`, ou seja **só segundos inteiros**. Entre o base de 10s e o teto de 4s existem exatamente **6 degraus possíveis**.

| Tiers | Degraus | Escada |
|---|---|---|
T1–T5 | 3 | 8s · 6s · 4s |
T6–T10 | 4 | 8s · 7s · 5s · 4s |
T11–T15 | 5 | 9s · 8s · 6s · 5s · 4s |
**T16–T20** | **6** | 9s · 8s · 7s · 6s · 5s · 4s |

**O teto segue 4s nos 20 — o que cresce é a GRANULARIDADE.** É de propósito: o jogador de tier alto sente progresso mais vezes, e o throughput final não muda, então a calibragem dos drops continua válida. Subir o teto para 3s ou 1s multiplicaria o ganho de maxar e quebraria a lei dos 2 tiers.

O custo total de cada trilha foi **preservado** (a soma dos upgrades continua `0,20 × casa/dia`, erro máximo de 0,3% por arredondamento) e repartido geometricamente, com o último degrau valendo 5× o primeiro. As dracmas seguem só no último nível.

## Os três encantes da lâmina

Os três foram para **10 degraus** em 06/08/2026, por decisão do dono: *"os players pediriam pilhagem infinita pois eles gostam bastante"* e *"os jogadores gostam de bastante níveis"*.

| Encante | Níveis | Escada | Teto hoje | Teto absoluto |
|---|---|---|---|---|
`massacre` | 10 (era 5) | 4 · 8 · 16 · 32 · 64 · 128 · 256 · 512 · 2.048 · ∞ | **∞** | ∞ — não muda |
**`pilhagem`** | 10 (era 3) | geométrica, **+26,8% por degrau** | **11,0×** | 11,0× |
**`ceifador`** | 10 (era 3) | 3% → 25% | **25%** | **50%** por update |

### 🚩 A pilhagem foi de 2,0× para 11,0× — e arrastou os 20 spawners

✅ Decisão do dono: *"a pilhagem não vai ter teto 2x, até porque os players não vão gostar"*.

⚠️ **A escada é geométrica, não +1× por nível.** Com passo fixo de +1×, o primeiro degrau valeria +50% (2→3) e o último +10% (10→11): o jogador sentiria os livros valendo cada vez menos, justamente quando ficam mais difíceis de juntar. Geométrica, todo livro vale os mesmos +26,8%.

```
pilha de multiplicadores da via passiva
  antes  1,35 bônus ×  2,0 pilhagem × 3,0 booster =  8,10×
  agora  1,35 bônus × 11,0 pilhagem × 3,0 booster = 44,55×
```

Os `drops.coins.amount` dos 20 spawners foram recalculados **no mesmo passo**, divididos por `5,5^((N-1)/19)` — **interpolado**, porque a pilha cresce com o tier e não vale cheia desde o T1:

| Tier | Divisor | Drop antes | Drop depois |
|---|---|---|---|
| T1 | 1,00 | 0,78 | 0,78 |
| T8 | 1,87 | 21.900 | 11.700 |
| T14 | 3,21 | 2,85×10⁸ | 8,88×10⁷ |
| T20 | **5,50** | 3,90×10¹² | 7,09×10¹¹ |

⚠️ **E o efeito que não se recalcula:** a distância entre quem tem a lâmina maxada e quem não tem saiu de 2,0× para **11,0×**. Como os drops assumem a pilha cheia, quem ainda não juntou os 10 livros fica 11× abaixo do alvo. É o preço de a pilhagem ser o prêmio grande da via — decisão consciente, não efeito colateral.

### 🚩 O ceifador teve o teto CORTADO, e isso arrastou os 19 ranks

✅ Decisão do dono: *"teto máximo para ceifador 50%, mas não nos níveis iniciais que configurarmos e sim ao longo dos updates para ir aumentando o nível"*.

```
configurado agora ....... 10 degraus, 3% → 25%    fator esperado 1,25×
teto ABSOLUTO da via .... 50%                     fator esperado 1,50×
espaço de update ........ os degraus de 25% a 50%
```

O modelo de cabeças da Fase 3a derivou o custo em `head` dos 19 ranks assumindo **fator 1,75×** (os 75% antigos). Com 25% o fator cai para 1,25×, ou seja **a produção de cabeças cai 28,6%** — e sem acerto a escada de rank ficaria ~40% mais lenta.

**Os custos em `head` dos 19 arquivos foram multiplicados por `1,25/1,75 = 0,714`** no mesmo passo:

| Rank | Antes | Depois |
|---|---|---|
| 2 · Porco | RABBIT ×380 | **×271** |
| 12 · Slime | OCELOT ×15.000 | **×10.700** |
| 20 · Wither | SPIDER ×52.000 | **×37.100** |

### ⚠️ Como subir os tetos depois — e o que cada um arrasta junto

Acrescentar níveis `11`, `12`… é **retrocompatível**: `getMaxLevel` devolve o último declarado, então quem está no 10 continua no 10 e passa a ver o 11. Mas o teto é uma **alavanca viva**, igual ao `sell-price` do cacto — mexe-se nele com o recalculo junto, nunca sozinho:

| Subir | O que arrasta |
|---|---|
`pilhagem` acima de **2,0** | infla a via inteira — subir para 2,5 exige dividir `drops.coins.amount` dos **20 spawners** por 1,25 |
`ceifador` de 25% para o teto de **50%** | leva o fator de 1,25× para 1,50× — o custo em `head` dos **19 ranks** sobe 20% junto (1,50/1,25) |

### ⚠️ O `massacre` virou par do `mob-stack`

Com o upgrade `mob-stack: -1` a pilha cresce **sem teto** enquanto o jogador está fora, e só o Massacre 5 (∞) limpa isso num golpe. Comprar o `mob-stack` ilimitado sem ter Massacre 5 é acumular uma pilha que não se consegue colher — os dois deixaram de ser independentes.

O custo de maxar a lâmina subiu de **11 para 25 livros** (5 + 10 + 10). Os três saem das 6 caixas de via e dos bosses, com os engatilhados dando livros de nível 2 e 3.

### O que o código permite para os próximos updates

| O que dá para fazer | Onde está a permissão |
|---|---|
Número de níveis **livre** | `getMaxLevel` = último nível declarado (`MobConfig.java:136`) |
Escadas **diferentes por mob** | a seção `upgrades` é lida do arquivo do mob |
**Adicionar níveis por update** | retrocompatível — quem está no 4 continua no 4 e vê o 5 novo |

⚠️ **Três restrições:** os níveis têm que ser **contíguos** (1, 2, 3…), porque o upgrade sobe de um em um — um pulo de 5 para 7 deixa o 7 inalcançável para sempre. Só existem **3 tipos de trilha**, que são um `enum`: um quarto tipo (por exemplo um multiplicador de drop) **exige código**. E o `delay` só aceita **segundos inteiros**, então descer abaixo de 4s é a única forma de criar degraus novos nessa trilha.

### A lei "nunca compensa ficar parado"

| | kills/h por bloco |
|---|---|
bloco **nu** — `min(64, 512) × 3600/10s` | 23.040 |
bloco **maxado** — `min(512, ∞) × 3600/4s` | 460.800 |
| **ganho de maxar** | **20×** |

`6,146¹ = 6,1 < 20 < 37,8 = 6,146²` → maxar um bloco vale **1,63 tier**. **Estar 2 tiers atrás é incompensável por upgrade nenhum.**

Maxar custa 0,20 dia de renda e dá 20×; subir de tier custa 0,15 e dá 6,1×. O caminho ótimo é **maxa o bloco, depois sobe** — e está certo, porque maxar **tem teto** e subir **não tem**.
