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
                    salto ×3,0611 a cada múltiplo de 15
                    EXCETO em 45, 105, 150, 195 e 255

primary(planta)     1 · 3,0611 · 3,0611² · 3,0611³ · 3,0611⁴ · 3,0611⁵
```

Nas cinco costuras o salto **não está na curva — ele é a compra da plantação**. Comprar planta e subir 15 níveis passaram a valer exatamente o mesmo degrau. São 20 degraus na temporada, 5 deles comprados.

⚠️ **Adicionar plantação não encolhe o degrau — aumenta quantas vezes ele acontece.** Uma leitura intuitiva (e errada) diz que repartir o mesmo span entre mais plantas faria o `J` cair. Não cai: o span total é `r²⁸⁵ × J²⁰` e os 20 saltos são fixos, então acrescentar uma planta apenas **converte um salto de curva num salto de compra**. Sair de 4 para 5 compras mexeu o `J` de 3,0634 para 3,0611 — 0,08%. O que muda é a frequência da recompensa, que é exatamente o objetivo.

O teto de quem comprar as 5 plantações no nível 0 é **269× um trigo nível 0** — que é exatamente o que as 5 compras valem (3,0611⁵). O nível continua valendo todo o resto, então antecipar planta não antecipa renda.

### As seis plantações

As costuras saem de `300 ÷ 6 = 50` níveis por faixa, cada fronteira arredondada ao múltiplo de 15 mais próximo.

| Planta | `crop` | Ancora no nível | Tier | `primary` | Sementes/colheita |
|---|---|---|---|---|---|
Trigo | `WHEAT` | 0 | — | **4,146** | 1,80 |
**Girassol** | `SUNFLOWER` | 45 | 3 | **12,69** | 6,89 |
Cenoura | `CARROT` | 105 | 7 | **38,85** | 13,67 |
Batata | `POTATO` | 150 | 10 | **118,9** | 18,76 |
**Algodão** | `COTTON` | 195 | 13 | **364,0** | 23,85 |
Fungo | `NETHER_WART` | 255 | 17 | **1.114** | 30,63 |

A secundária é linear no nível de ancoragem (`1,80 + 0,11306 × nível`) e os extremos são os de sempre — a renda total de sementes da temporada não mudou, só ganhou degraus no meio.

### O girassol e o algodão são o mesmo bloco, ao contrário um do outro

Os dois são `DOUBLE_PLANT`, e a diferença vem de onde o 1.8 guarda a variante.

⚠️ **Uma tentativa anterior pintou só a metade de cima do girassol (data 8) e o campo saiu de peônias rosa.** O motivo está no cliente: `BlockDoublePlant.getStateFromMeta` guarda a variante **apenas na metade de baixo**; uma metade de cima é decodificada para um sentinela fixo (`PAEONIA`), e a variante real só é recuperada depois, em `getActualState`, lendo o bloco **abaixo** — e só quando esse bloco também é um double plant. Sobre farmland nunca é.

Ou seja: **uma metade de cima sozinha é sempre peônia**, para qualquer variante. Isso deixa exatamente duas saídas honestas, e a fazenda usa as duas:

| | Como é pintado | Custo |
|---|---|---|
**Girassol** | 2 blocos: metade de baixo na célula (carrega a variante) + metade de cima acima | +1 block-change por célula |
**Algodão** | 1 bloco: a metade de cima sozinha, ou seja, a peônia — **de propósito** | nenhum |

O algodão não é um remendo: a flor do algodoeiro abre branca e **vira rosa-roxa** antes do capulho, então a textura combina com o nome em vez de brigar com ele. Uma limitação do cliente virou plantação.

**A planta de 2 blocos está toda dentro do `FakeCropService`.** Cada envio emite o bloco companheiro em `y+1` e cada buraco limpa os dois; quem chama continua passando células e nunca sabe que a planta tem dois blocos — por isso o `FarmGameplay` não mudou uma linha. O companheiro cai sempre na mesma coluna de chunk, então ele pega carona no pacote daquele chunk e o agrupamento fica intacto.

Dois ajustes a mais que a planta alta exigiu:

- **O dig normaliza o clique.** A planta nasce no chão onde o jogador pisa, então a célula fica na altura do pé e a mira acerta a cabeça. O `CropPacketListener` tenta um bloco abaixo antes de desistir. A tentativa é inequívoca porque **nenhuma célula fica diretamente acima de outra** — conferido contra o `data.yml`: 22.735 células, zero empilhadas.
- **O scan virou máscara de bits.** Ele mapeava material → data de crescido, e com duas culturas em `DOUBLE_PLANT` (data 0 e 8) uma sobrescrevia a outra silenciosamente. Agora cada material carrega um bitmask de datas aceitas.

### Os custos

O `require` de nível e de colheitas saiu inteiro. **O preço é o requisito.**

| Evolução | Tier | Coins | Sementes | % do orçamento de encante |
|---|---|---|---|---|
→ Girassol | 3 | **0** | **150.000** | 0,0045% |
→ Cenoura | 7 | **8,08×10⁹** | **16.700.000** | 0,50% |
→ Batata | 10 | **1,88×10¹²** | **50.000.000** | 1,5% |
→ Algodão | 13 | **4,36×10¹⁴** | **133.000.000** | 4,0% |
→ Fungo | 17 | **6,22×10¹⁷** | **300.000.000** | 9,0% |

**Coins = 10% da casa/dia no tier de ancoragem** (tier = nível ÷ 15). Os 10% já eram a régua da Cenoura e da Batata; o **Fungo estava em 1,5%** e foi corrigido — a evolução final era relativamente de graça.

**Sementes = 15% do orçamento de encantamento**, que é de **3,333×10⁹** (soma de `base-cost + (L−1)×increase-cost` até o nível 500 nos 10 encantes).

⚠️ **A primeira evolução não custa coins de propósito.** Coins entram por spawner, máquina e cacto — se o girassol custasse coins, dava para evoluir sem nunca ter colhido. Só sementes, e sementes só saem da fazenda. É a mesma lógica da vara de pesca, invertida: lá coins barram a entrada numa via secundária, aqui a secundária barra quem quer pular a via.

### As conferências

```
entradas do payout abaixo de 1 .......... 0            ✅
quebras de monotonia (0 a 300) .......... 0            ✅  (subir de nível nunca paga menos)
extremo do nível 300 .................... 1,5061×10¹²  ✅  (baseline 1,5067×10¹²)
ruído de float nas 301 entradas ......... 0            ✅
```

A segunda é a que importa, e agora vale para a curva **inteira**, não só dentro de cada bloco: o [14-FARM-PESCA.md](../GARNIX%20-%20ECONOMIA/14-FARM-PESCA.md) registra que uma versão anterior produziu multiplicador **0,82** num degrau — *"subir de nível faria o jogador ganhar menos, e é o tipo de coisa que nenhum teste de banda pega, porque as pontas fechavam"*.

**A conferência que fecha a economia** é comparar a renda por colheita da grade nova contra a trajetória pretendida da grade de 06/08 (commit `b92d2b1`, o serrote com 4 plantas), nível a nível:

```
desvio médio ............................ 99,99%
pior caso ............................... 98,7%  (nível 101)
soma dos 301 níveis ..................... 100,4% da grade antiga
```

A fazenda não mudou de tamanho — mudou de forma.

⚠️ **Duas armadilhas de ferramenta apareceram aqui, e as duas produzem um "resultado" que parece válido.**

A primeira: arredondar a 4 algarismos com `Math.round(x * 10**p) / 10**p` reintroduz ruído binário quando `p` é negativo — `24.850.000` virava `24850000.000000004` no YAML. Use `Number(x.toPrecision(4))`.

A segunda é pior porque não quebra nada: conferir a grade nova relendo o `levels.yml` **já sobrescrito** compara o arquivo consigo mesmo e imprime um desvio plausível e sem sentido. O baseline tem que vir do `git show <commit>:GarnixFarm/levels.yml`, e vale checar que ele é mesmo o serrote (`'60': 1`) antes de confiar no número.

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
Upgrade para Cenoura | `GarnixFarm/farms.yml` | 4 → **7** | 1,08×10⁷ | 3,47×10⁷ → **8,08×10⁹** |
Upgrade para Batata | idem | 10 | 9,03×10¹¹ | 1,88×10¹² → **1,88×10¹²** |
Upgrade para Fungo | idem | 16 → **17** | 1,14×10¹⁶ | 1,53×10¹⁶ → **6,22×10¹⁷** |

A quarta coluna de cada linha da fazenda é a de 06/08; a quinta é a de 07/08, depois que o girassol e o algodão entraram e reancoraram as plantações em T3/T7/T10/T13/T17 (as costuras `nível ÷ 15`) e que a régua dos **10% da casa/dia** passou a valer para todas. O fungo estava em 1,5% — a evolução final era relativamente de graça; é daí que vem o salto de 1,53×10¹⁶ para 6,22×10¹⁷.

As duas evoluções novas — Girassol (T3, **0 coins**) e Algodão (T13, **4,36×10¹⁴**) — não têm coluna "antes" porque não existiam.

⚠️ **A vara é comprada em coins mas a via rende corais** — de propósito: comprá-la com corais seria circular, já que corais só vêm de pescar. É a única barreira em moeda principal para entrar numa via secundária.

✅ **Os encantes das duas vias NÃO entram nesta lista.** A fazenda cobra em `sementes` (`enchant-currency`) e a mineração em `gemas` — moedas de **contagem**, que não inflam com a curva. O desenho das quatro vias continua o mesmo — coins pagam a entrada, a secundária paga a profundidade — com uma exceção declarada: a **primeira** evolução da fazenda é 100% secundária, para que ninguém entre na via sem ter jogado a via.
