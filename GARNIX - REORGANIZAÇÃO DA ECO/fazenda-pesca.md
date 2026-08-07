# GARNIX — Fazenda e Pesca

> Escopo: `GarnixFarm/levels.yml` + `GarnixFarm/farms.yml` + `GarnixFishing/rewards.yml`. Reescalados em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).

## O fator de reescala

As duas vias perderam fatia na repartição nova, mas a casa/dia quadruplicou — então o fator **inverte de sinal ao longo da temporada**:

```
fator(N) = [fatia nova × 1.500.000 × 6,146^(N-1)]
           ─────────────────────────────────────────
           [fatia velha ×   375.000 × 6,610^(N-1)]
```

| Via | Fatia velha | Fatia nova | Dia 1 | Dia 20 |
|---|---|---|---|---|
**Fazenda** | 18% | **7%** | **×1,56** | **×0,39** |
**Pesca** | 7% | **3%** | **×1,71** | **×0,43** |
Eventos | 3% | 2% | — | — |

O jogador ganha **mais** nos primeiros dias e **menos** no fim, porque a curva ficou mais suave (6,146 contra 6,61) e a base subiu. É o desenho: as vias ativas passaram a ser o onboarding, não o destino.

⚠️ **A mineração não foi tocada.** A âncora nova foi construída justamente para preservar `1 coin por cobblestone` no T1 — ver [tabela-mestra.md](tabela-mestra.md). O `GarnixMining/levels.yml` segue válido linha por linha.

⚠️ **Os eventos também não.** Os 8 arquivos de evento não pagam coins de propósito: *"evento não tem gate de tier, então um valor fixo"*. A fatia de 2% deles é entregue em outras moedas e itens.

## Pesca — as 44 recompensas de coins

A vara tem **44 níveis** e existem **44 recompensas de coins**, mapeadas 1:1 por `required-level`. Os 44 níveis cobrem os 20 dias, então o tier de cada recompensa é `N = 1 + (L−1) × 19/43`.

| Nível | Antes | Depois | Fator |
|---|---|---|---|
| 1 | 494 | **847** | ×1,71 |
| 22 | 9,46×10⁹ | **8,25×10⁹** | ×0,87 |
| 44 | 1,43×10¹⁷ | **6,15×10¹⁶** | ×0,43 |

O gate 2D da via não mudou: `required-level` é a escada da vara, e o `weight` da recompensa é o teto da skin, de modo que a skin anterior não alcança a recompensa nova. O equipamento compra **acesso**, não valor — a pilha de multiplicadores da pesca empurra `corais`, nunca `coins`.

## Fazenda — o cuidado que ela exigiu

O `payout-multiplier` tem **301 entradas** (níveis 0–300) e, na reescala de 06/08, ainda **resetava a 1 a cada planta nova**, nos níveis **0, 60, 150 e 240**. Aplicar o fator direto sobre ele quebrava isso de duas formas:

```
❌ multiplicador cai abaixo de 1  →  trocar de planta PAGA MENOS
❌ o reset deixa de ser 1         →  a leitura "×3,9 por degrau" some da tela
```

A forma correta separava os dois eixos: o `payout-multiplier` recebia o fator **relativo dentro do bloco** e o `farms.yml → primary` o fator **absoluto do nível em que a planta abria**.

> ⚠️ **Esta seção descreve o desenho até 06/08/2026.** O reset foi eliminado em 07/08 — ver [A curva contínua](#a-curva-contínua--0708) logo abaixo. O que ficou de pé daqui é a lição das conferências.

⚠️ **Um bug de `awk` quase repetiu o erro do 0,82 aqui.** Comparar `lvl < 60` com `lvl` vindo de `gsub` compara **string**, e `"150" < "60"` é verdadeiro — o que jogou o nível 150 no bloco errado e produziu multiplicador `0,483`. Quem for reescalar de novo: force `lvl = lvl + 0` antes de comparar.

## A curva contínua — 07/08

> Escopo: `GarnixFarm/farms.yml`, `GarnixFarm/levels.yml`, `CropKind.java`, `FarmType.java`, `FarmUpgradeService.java`, `FarmTypeManager.java`.

✅ Decisão do dono: *"o requisito das plantações passa a ser apenas coins e sementes"*, mais uma quinta plantação (**girassol**) para o jogador parar de contar quatro ícones.

### Por que o reset tinha que morrer

O requisito de nível não era decoração: era ele que sustentava o serrote. Com o multiplicador resetando a 1 na troca de planta, quem comprasse **Cenoura no nível 0** levava o valor base novo (853) com o multiplicador velho — **206× de renda antecipada**. E como coins entram por spawner, máquina e cacto, o custo sozinho não segurava.

A saída foi tornar as duas escadas **multiplicativas** em vez de alternadas:

```
pagamento = primary(planta) × payout-multiplier(nível)

payout-multiplier   contínua de 0 a 300, +1,5%/nível,
                    salto ×3,0634 a cada múltiplo de 15
                    EXCETO em 60, 120, 180 e 240

primary(planta)     1 · 3,0634 · 3,0634² · 3,0634³ · 3,0634⁴
```

Nos quatro níveis excetuados o salto **não está na curva — ele é a compra da plantação**. Comprar planta e subir 15 níveis passaram a valer exatamente o mesmo degrau. São 20 degraus na temporada, 4 deles comprados.

O teto de quem comprar as 4 plantações no nível 0 é **88× um trigo nível 0** — que é exatamente o que as 4 compras valem. O nível continua valendo todo o resto, então antecipar planta não antecipa renda.

### As cinco plantações

| Planta | Ancora no nível | Tier | `primary` | Sementes/colheita |
|---|---|---|---|---|
Trigo | 0 | — | **4,146** | 1,80 |
**Girassol** | 60 | 4 | **12,70** | 9,01 |
Cenoura | 120 | 8 | **38,91** | 16,21 |
Batata | 180 | 12 | **119,2** | 23,42 |
Fungo | 240 | 16 | **365,1** | 30,63 |

A secundária é linear no nível de ancoragem (`1,80 + 0,12012 × nível`) e os extremos são os de antes — a renda total de sementes da temporada não mudou, só ganhou um degrau a mais no meio.

**O girassol é meio bloco.** Vanilla desenha `DOUBLE_PLANT` em dois blocos; o overlay pinta só a **metade de cima** (data 8), que é a metade com a flor. Dois block-changes por célula dobrariam o custo de render de um campo de 22k células, e um campo com 2 blocos de altura taparia a visão do próprio jogador enquanto ele colhe. O cliente 1.8 só lê a variante do bloco de baixo quando ele também é um double plant — sobre farmland ele mantém a própria, que é a `0`, girassol.

### Os custos

O `require` de nível e de colheitas saiu inteiro. **O preço é o requisito.**

| Evolução | Tier | Coins | Sementes | % do orçamento de encante |
|---|---|---|---|---|
→ Girassol | 4 | **0** | **150.000** | 0,0045% |
→ Cenoura | 8 | **4,97×10¹⁰** | **33.000.000** | 0,99% |
→ Batata | 12 | **7,09×10¹³** | **100.000.000** | 3,0% |
→ Fungo | 16 | **1,01×10¹⁷** | **367.000.000** | 11,0% |

**Coins = 10% da casa/dia no tier de ancoragem** (tier = nível ÷ 15). Os 10% já eram a régua da Cenoura e da Batata; o **Fungo estava em 1,5%** e foi corrigido — a evolução final era relativamente de graça.

**Sementes = 15% do orçamento de encantamento**, que é de **3,333×10⁹** (soma de `base-cost + (L−1)×increase-cost` até o nível 500 nos 10 encantes).

⚠️ **A primeira evolução não custa coins de propósito.** Coins entram por spawner, máquina e cacto — se o girassol custasse coins, dava para evoluir sem nunca ter colhido. Só sementes, e sementes só saem da fazenda. É a mesma lógica da vara de pesca, invertida: lá coins barram a entrada numa via secundária, aqui a secundária barra quem quer pular a via.

### As três conferências

```
entradas do payout abaixo de 1 .......... 0            ✅
quebras de monotonia (0 a 300) .......... 0            ✅  (subir de nível nunca paga menos)
extremo do nível 300 .................... 1,5068×10¹²  ✅  (era 1,5067×10¹²)
```

A segunda é a que importa, e agora vale para a curva **inteira**, não só dentro de cada bloco: o [14-FARM-PESCA.md](../GARNIX%20-%20ECONOMIA/14-FARM-PESCA.md) registra que uma versão anterior produziu multiplicador **0,82** num degrau — *"subir de nível faria o jogador ganhar menos, e é o tipo de coisa que nenhum teste de banda pega, porque as pontas fechavam"*.

Conferência extra desta rodada: o desvio da trajetória pretendida (trigo 0–59, girassol 60–119, …) contra os valores de 06/08 fica em **99,96% em média, pior caso 98,9%** no nível 118. A economia da fazenda não mudou de tamanho — mudou de forma.

### A ordem das plantações saiu do código

`GarnixFarm.FARM_TYPES` era um `String[]` fixo. Agora o `FarmTypeManager` lê a **ordem das chaves do `farms.yml`**, e o array sobrou como socorro para arquivo faltando ou quebrado. Adicionar plantação virou edição de config — e foi assim que o girassol entrou entre o trigo e a cenoura sem recompilar a progressão.

## Os custos de entrada — o que quase passou batido

Reescalar drop e payout não cobre tudo: as duas vias têm **custos em coins** que também derivavam da âncora antiga e não aparecem em nenhuma tabela de recompensa.

Aqui o fator é outro — custo escala com a **casa/dia inteira**, não com a fatia da via:

```
fator do custo = casa_nova(N) / casa_antiga(N) = 4 × 0,92981^(N-1)
```

| Item | Onde | Tier | Antes | Depois |
|---|---|---|---|---|
**Vara de Pesca** | `GarnixFishing/config.yml` → `rod.price` | 1 | 10.000 | **40.000** |
Upgrade para Cenoura | `GarnixFarm/farms.yml` | 4 (nível 60) | 1,08×10⁷ | 3,47×10⁷ → **4,97×10¹⁰ no T8** |
Upgrade para Batata | idem | 10 (nível 150) | 9,03×10¹¹ | 1,88×10¹² → **7,09×10¹³ no T12** |
Upgrade para Fungo | idem | 16 (nível 240) | 1,14×10¹⁶ | 1,53×10¹⁶ → **1,01×10¹⁷** |

A terceira coluna de cada linha da fazenda é a de 06/08; a quarta é a de 07/08, depois que o girassol entrou e reancorou as plantações em T4/T8/T12/T16 e que a régua dos 10% da casa/dia passou a valer para as três.

⚠️ **A vara é comprada em coins mas a via rende corais** — de propósito: comprá-la com corais seria circular, já que corais só vêm de pescar. É a única barreira em moeda principal para entrar numa via secundária.

✅ **Os encantes das duas vias NÃO entram nesta lista.** A fazenda cobra em `sementes` (`enchant-currency`) e a mineração em `gemas` — moedas de **contagem**, que não inflam com a curva. O desenho das quatro vias continua o mesmo — coins pagam a entrada, a secundária paga a profundidade — com uma exceção declarada: a **primeira** evolução da fazenda é 100% secundária, para que ninguém entre na via sem ter jogado a via.
