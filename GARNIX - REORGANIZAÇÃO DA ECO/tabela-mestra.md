# GARNIX — Tabela Mestra da Economia

> Escopo: a âncora de onde **todo** valor em coins do servidor deriva. Reescrita em **06/08/2026**.
> Consumida por: `GarnixSpawners`, `GarnixMachines`, `GarnixRankUP`, `GarnixWarehouse`, `GarnixMining`, `GarnixFarm`, `GarnixFishing`, crates, caixas e bosses.

## A fórmula

```
casa/dia no tier N  =  1.500.000 × 6,146^(N-1)
```

| Parâmetro | Valor | De onde vem |
|---|---|---|
Tiers / dias | **20** | tier N = dia N |
Abertura do servidor | **14/08/2026** | dia 1 · o dia 20 cai em **02/09/2026** |
T1 | **1,50×10⁶** | derivado da mineração medida — ver abaixo |
T20 | **1,44×10²¹** | o teto de sextilhões pedido pelo dono |
Crescimento | **6,146×/dia** | `(1,44×10²¹ / 1,5×10⁶)^(1/19)` |

### Por que a âncora é a mineração, e não a "conta ativa"

A versão anterior derivava a casa de *"a conta ativa produz 210.000 em 3h, e ela é 56% da casa"*, chegando a 375.000/dia. Os 210.000 são especificamente **mineração** (70.000 blocos/h medidos × 3h × 1 coin/bloco), e a conta ativa também faz fazenda e eventos — então atribuir tudo à conta inteira misturava as coisas.

Ancorando na via, o número físico fica intacto:

```
mineração = 14% da casa  →  casa/dia(1) = 210.000 / 0,14 = 1.500.000
```

**A consequência prática é grande: o `levels.yml` da mina não precisou ser tocado.** O cobblestone continua valendo **1 coin exato** no T1, que é o que o arquivo já dizia.

## A repartição por via

✅ Decisão do dono (06/08/2026). A anterior punha a conta ativa em 56% da casa — o oposto do arco que ele descreveu, que é *"o jogador quer sair da mina/fazenda, erguer farm de cacto, e depois investir em spawners e máquinas até ficar à vontade no plot só matando mobs"*.

| Via | Fatia | Conta | Rende, por dia |
|---|---|---|---|
**Spawners** | **28,9%** | AFK 2 | 2,06× a mineração |
**Máquinas** | **26,1%** | AFK 2 | 1,86× a mineração |
**Cacto** | **19,0%** | AFK 1 | 1,36× a mineração |
Mineração | 14,0% | ativa | — |
Fazenda | 7,0% | ativa | 0,50× |
Pesca | 3,0% | AFK 1 | 0,21× |
Eventos | 2,0% | ativa | 0,14× |

```
conta ativa 23%  ·  AFK 1 22%  ·  AFK 2 55%
```

### ⚠️ Por que a régua "5 minutos de mina = 1 minuto de cacto" não entrou

O dono pediu essa régua para o cacto. Ela é **impossível de satisfazer** junto com qualquer repartição que feche em 100%, e o motivo é tempo, não calibragem:

```
o cacto roda 24h · a mineração roda 3h        →   8× mais tempo
a régua pede 5× mais taxa por minuto          →  40× mais renda total
a mineração inteira é 14% da casa             →  o cacto pediria 560%
```

A razão `cacto/mineração` é **invariante** à casa/dia — mudar a âncora não move o problema, porque os dois lados escalam junto.

✅ **A saída, decidida pelo dono:** medir a via **por dia**, não por minuto. Numa via AFK o jogador não cronometra — ele abre o jogo e olha quanto entrou. E por dia a hierarquia que ele queria acontece de verdade: cacto > mineração, spawners e máquinas > cacto.

### A margem da máquina sobre o spawner

✅ Decisão do dono: *"seria bom máquinas sempre serem um pouco superior aos spawners desde sempre, pois precisam de combustível"*. A régua saiu do próprio custo:

```
combustível = 8% da renda da máquina  (GarnixMachines/fuels.yml)
máquina rende +20% bruto por bloco
             − 8% de combustível
             = +10% LÍQUIDO a favor da máquina
```

Isso é **por bloco**. Na **fatia total** os spawners lideram, porque são 20 contra 15 — e é o que resolve os dias 1 e 2, quando máquina nenhuma existe ainda.

## Tabela mestra

| T | Dia | Casa/dia | Ativo/h | Spawners | Máquinas | Cacto | Mineração | Fazenda |
|---|---|---|---|---|---|---|---|---|
| T1 | 14/08 | 1,50×10⁶ | 1,15×10⁵ | 4,34×10⁵ | 3,92×10⁵ | 2,85×10⁵ | 2,10×10⁵ | 1,05×10⁵ |
| T2 | 15/08 | 9,22×10⁶ | 7,07×10⁵ | 2,66×10⁶ | 2,41×10⁶ | 1,75×10⁶ | 1,29×10⁶ | 6,45×10⁵ |
| T3 | 16/08 | 5,67×10⁷ | 4,34×10⁶ | 1,64×10⁷ | 1,48×10⁷ | 1,08×10⁷ | 7,93×10⁶ | 3,97×10⁶ |
| T4 | 17/08 | 3,48×10⁸ | 2,67×10⁷ | 1,01×10⁸ | 9,09×10⁷ | 6,62×10⁷ | 4,88×10⁷ | 2,44×10⁷ |
| T5 | 18/08 | 2,14×10⁹ | 1,64×10⁸ | 6,19×10⁸ | 5,59×10⁸ | 4,07×10⁸ | 3,00×10⁸ | 1,50×10⁸ |
| T6 | 19/08 | 1,32×10¹⁰ | 1,01×10⁹ | 3,80×10⁹ | 3,43×10⁹ | 2,50×10⁹ | 1,84×10⁹ | 9,21×10⁸ |
| T7 | 20/08 | 8,08×10¹⁰ | 6,20×10⁹ | 2,34×10¹⁰ | 2,11×10¹⁰ | 1,54×10¹⁰ | 1,13×10¹⁰ | 5,66×10⁹ |
| T8 | 21/08 | 4,97×10¹¹ | 3,81×10¹⁰ | 1,44×10¹¹ | 1,30×10¹¹ | 9,44×10¹⁰ | 6,96×10¹⁰ | 3,48×10¹⁰ |
| T9 | 22/08 | 3,05×10¹² | 2,34×10¹¹ | 8,83×10¹¹ | 7,97×10¹¹ | 5,80×10¹¹ | 4,28×10¹¹ | 2,14×10¹¹ |
| T10 | 23/08 | 1,88×10¹³ | 1,44×10¹² | 5,42×10¹² | 4,90×10¹² | 3,57×10¹² | 2,63×10¹² | 1,31×10¹² |
| T11 | 24/08 | 1,15×10¹⁴ | 8,84×10¹² | 3,33×10¹³ | 3,01×10¹³ | 2,19×10¹³ | 1,62×10¹³ | 8,07×10¹² |
| T12 | 25/08 | 7,09×10¹⁴ | 5,44×10¹³ | 2,05×10¹⁴ | 1,85×10¹⁴ | 1,35×10¹⁴ | 9,93×10¹³ | 4,96×10¹³ |
| T13 | 26/08 | 4,36×10¹⁵ | 3,34×10¹⁴ | 1,26×10¹⁵ | 1,14×10¹⁵ | 8,28×10¹⁴ | 6,10×10¹⁴ | 3,05×10¹⁴ |
| T14 | 27/08 | 2,68×10¹⁶ | 2,05×10¹⁵ | 7,74×10¹⁵ | 6,99×10¹⁵ | 5,09×10¹⁵ | 3,75×10¹⁵ | 1,88×10¹⁵ |
| T15 | 28/08 | 1,65×10¹⁷ | 1,26×10¹⁶ | 4,76×10¹⁶ | 4,30×10¹⁶ | 3,13×10¹⁶ | 2,30×10¹⁶ | 1,15×10¹⁶ |
| T16 | 29/08 | 1,01×10¹⁸ | 7,76×10¹⁶ | 2,92×10¹⁷ | 2,64×10¹⁷ | 1,92×10¹⁷ | 1,42×10¹⁷ | 7,08×10¹⁶ |
| T17 | 30/08 | 6,22×10¹⁸ | 4,77×10¹⁷ | 1,80×10¹⁸ | 1,62×10¹⁸ | 1,18×10¹⁸ | 8,70×10¹⁷ | 4,35×10¹⁷ |
| T18 | 31/08 | 3,82×10¹⁹ | 2,93×10¹⁸ | 1,10×10¹⁹ | 9,97×10¹⁸ | 7,26×10¹⁸ | 5,35×10¹⁸ | 2,68×10¹⁸ |
| T19 | 01/09 | 2,35×10²⁰ | 1,80×10¹⁹ | 6,79×10¹⁹ | 6,13×10¹⁹ | 4,46×10¹⁹ | 3,29×10¹⁹ | 1,64×10¹⁹ |
| **T20** | **02/09** | **1,44×10²¹** | 1,11×10²⁰ | 4,17×10²⁰ | 3,77×10²⁰ | 2,74×10²⁰ | 2,02×10²⁰ | 1,01×10²⁰ |

### As três conferências que fecham

```
T1:  mineração/dia = 210.000        (esperado 210.000)   ✅
T1:  coins por bloco = 1,0000       (esperado 1,0000)    ✅  — levels.yml intacto
T20: casa/dia = 1,4433×10²¹         (alvo 1,44×10²¹)     ✅
```

## Números redondos

✅ Decisão do dono: *"se possível sempre colocar números redondinhos de venda e compra"*. Todos os valores de custo e drop de spawner, máquina e rank são arredondados para **3 algarismos significativos** — `422000000000000000`, não `422447670301418176`. O erro introduzido é de no máximo **0,5%**, muito abaixo da tolerância de ±25% do simulador.

## Documentos derivados

| Sistema | Doc |
|---|---|
Spawners | [spawners.md](spawners.md) |
Máquinas | [maquinas.md](maquinas.md) |
Ranks | [ranks.md](ranks.md) |
Armazém e cacto | [armazem-cacto.md](armazem-cacto.md) |
 Fazenda e pesca | [fazenda-pesca.md](fazenda-pesca.md) |
Crates · Caixas · Bosses | [crates.md](crates.md) · [caixas-misteriosas.md](caixas-misteriosas.md) · [bosses.md](bosses.md) |
