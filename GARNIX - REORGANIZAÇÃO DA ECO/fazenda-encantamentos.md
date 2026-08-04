# GARNIX — Refatoração da Fazenda

> Escopo: `GarnixFarm/enchants/*.yml`, `levels.yml` e `farms.yml`. **Este documento já reflete as mudanças aplicadas.** O retrato de antes está em `fazenda-relatorio-atual.md`.
> Conferido contra `Enchant.java`, `FarmGameplay.java`, `ScarecrowEffect.java`, `SwarmEffect.java` e `EnchantsMenu.java`.
> O equivalente do Mining está em `mineracao-encantamentos.md`, e a comparação entre os dois está na seção 4.

## Como os números saem do YML

As fórmulas do `Enchant.java` do Farm são idênticas às do Mining — lineares em `nível - 1`, com o **nível 1 valendo exatamente a base**:

```
custo do nível L   = base-cost       + (L - 1) * increase-cost      // Enchant.java:185
chance no nível L  = base-chance     + (L - 1) * increase-chance    // Enchant.java:150
multiplicador em L = base-multiplier + (L - 1) * increase-multiplier// Enchant.java:159
bônus do Enxame    = (bonus-percentage + (L-1) * increase-bonus)/100// Enchant.java:168
```

- **Moeda de compra:** `sementes` (`config.yml → enchant-currency`) — que é também a **economia secundária** paga por colheita.
- **Reembolso:** 40% (`config.yml → enchant-refund-percentage`), sobre o preço atual da tabela.
- **Chance é percentual** (0–100), dividida por 100 na hora de rolar.
- **Desbloqueio por nível:** `farm-level-unlock` nos `enchants/*.yml`, espelhando o `mine-level-unlock` do Mining. Os quatro sempre-ativos ficam no 0; os seis de área/companheiro abrem em 5, 30, 60, 105, 165 e 240.
- **Onde a chance rola:** só em planta colhida À MÃO. A exceção é o Trevo, que também rola uma vez por planta derrubada pelos encantamentos de área (`FarmGameplay.rollCloverForAreaCrops`).
- **Enxame e Espantalho são um por jogador**: proc que cai com o companheiro ativo é descartado. Teto global de 80 companheiros no servidor (`enchant-max-simultaneous-global`).
- **Nível máximo da fazenda é 300** (`levels.yml`).

---

## 1. Quadro geral dos encantamentos

| Encantamento | Máx | Custo nv 1 | Custo nv máx | **Total (sementes)** | Valor nv 1 | Valor nv máx |
|---|---:|---:|---:|---:|---:|---:|
| Prosperidade | 500 | 1.250 | 73.605 | **18.713.750** | 1,0500x | 15,0000x |
| Fertilidade | 500 | 1.250 | 73.605 | **18.713.750** | 1,0400x | 21,0000x |
| Agilidade | 2 | 3.000 | 10.000 | **13.000** | Speed I | Speed II |
| Trevo | 500 | 1.000 | 10.356,25 | **2.839.062,5** | 0,1000% | 2,0000% |
| Cataclismo | 500 | 20.105 | 180.877,81 | **50.245.702,5** | 0,8700% | 17,4398% |
| Laser | 500 | 32.032 | 288.183,67 | **80.053.917,5** | 0,5990% | 12,0074% |
| Encruzilhada | 500 | 44.598 | 401.238,29 | **111.459.072,5** | 0,3992% | 8,0023% |
| Ceifa | 500 | 393.000 | 3.535.741,92 | **982.185.480** | 0,1830% | 3,6684% |
| Enxame | 500 | 406.962 | 3.661.355,17 | **1.017.079.292,5** | 0,0265% | 0,5312% |
| Espantalho | 500 | 420.925 | 3.786.974,41 | **1.051.974.852,5** | 0,0345% | 0,6916% |
| **TOTAL** | | | | **3.333.277.880** | | |

| Encantamento | Total (sementes) | % do custo de maxar tudo |
|---|---:|---:|
| Espantalho | 1.051.974.852,5 | 31,56% |
| Enxame | 1.017.079.292,5 | 30,51% |
| Ceifa | 982.185.480 | 29,47% |
| Encruzilhada | 111.459.072,5 | 3,34% |
| Laser | 80.053.917,5 | 2,40% |
| Cataclismo | 50.245.702,5 | 1,51% |
| Prosperidade | 18.713.750 | 0,56% |
| Fertilidade | 18.713.750 | 0,56% |
| Trevo | 2.839.062,5 | 0,09% |
| Agilidade | 13.000 | 0,00% |

---

## 2. Quantas plantações cada efeito colhe

Simulação replicando `FarmGameplay.squareHarvest` / `lineHarvest` / `playerAnchoredHarvest` sobre as **posições reais do `data.yml`**: 22.735 plantações numa caixa de 197 x 202, com **57,1% de densidade** — o campo não é um retângulo cheio. A média é sobre todas as 22.735 posições possíveis de colheita, então já embute as bordas e os buracos.

| Encantamento | Teto teórico | **Medido no campo real** | Aproveitamento | Forma |
|---|---:|---:|---:|---|
| Cataclismo | 80 | **71** | 88,8% | Quadrado 9x9 ao redor da planta quebrada (explosion-radius 4), tolerancia vertical de +-1 |
| Laser | 100 | **73** | 73,0% | 4 linhas cardeais de 25 de comprimento (max-line-radius 25), tolerancia vertical de +-1 |
| Encruzilhada | 160 | **84** | 52,5% | 4 linhas diagonais de 40 de comprimento (max-line-radius 40), tolerancia vertical de +-1 |
| Ceifa | 625 | **514** | 82,2% | Quadrado 25x25 ancorado no JOGADOR (harvest-radius 12) |
| Espantalho | 0 | **2.341** | Infinity% | Companheiro que vive 200 ticks e colhe um disco de raio 20 a cada 2 ticks — 992 plantas por pulso, 100 pulsos |

**Espantalho** fica fora da tabela porque não tem número único, e o motivo importa: ele dá 100 pulsos de um disco de raio 3 (26,5 plantas em campo cheio), mas `regrow-delay-seconds: 20` faz a planta colhida sumir por 400 ticks — o dobro da vida do espantalho. Se o jogador ficar parado, só o **primeiro** pulso rende: os outros 99 varrem terra vazia. Se ele voar em linha reta sobre terreno virgem, rende perto de **2.650**. É o único encantamento da fazenda cujo valor depende inteiramente do comportamento do jogador.

**Enxame** também fica fora: não colhe nada. Dá `+10%` de ganhos no nível 1 e `+209,6%` no nível 500, por 10 segundos.

### Eficiência — o que cada um entrega pelo que custa

Mesma métrica do relatório do Mining: **plantações colhidas a cada 1.000 colhidas à mão, por 1 milhão de sementes investidas**.

| Encantamento | Chance nv 500 | Plantas/proc | Plantas por 1.000 colhidas | Custo total | **Eficiência** |
|---|---:|---:|---:|---:|---:|
| Cataclismo | 17,44% | 71 | 12.382 | 50.245.702,5 | **246,4** |
| Laser | 12,01% | 73 | 8.765 | 80.053.917,5 | **109,5** |
| Encruzilhada | 8,00% | 84 | 6.722 | 111.459.072,5 | **60,3** |
| Ceifa | 3,67% | 514 | 18.855 | 982.185.480 | **19,2** |
| Espantalho | 0,69% | 2.341 | 16.190 | 1.051.974.852,5 | **15,4** |

A curva desce conforme o desbloqueio sobe, encostando na do Mining nas duas pontas: **246,4** contra 246,5 no primeiro, **15,4** contra 15,4 no último. É o mesmo desenho — encantamento de começo é eficiente e barato, o de fim vende poder absoluto e não custo-benefício.

---

## 3. Níveis, plantações e valor por colheita

### 3.1 A curva de XP

`levels.yml` usa fórmula geométrica em vez de listar nível a nível:

```
xp(L) = 11992.1 * 1.02216^(L-1)      max-level: 300
```

| | XP do nível | XP acumulado |
|---|---:|---:|
| Nível 1 | 11.992 | 11.992 |
| Nível 50 | 35.101 | 1.077.925 |
| Nível 100 | 105.018 | 4.302.947 |
| Nível 150 | 314.202 | 13.951.822 |
| Nível 200 | 940.054 | 42.820.095 |
| Nível 250 | 2.812.528 | 129.190.487 |
| Nível 300 | 8.414.744 | 387.600.288 |

São **387.600.288 de XP** para chegar ao nível 300.

### 3.2 As quatro plantações

`farms.yml` — a progressão só avança, nunca volta. O tipo muda qual cultura o jogador vê e colhe; a área física é a mesma.

| Plantação | Desbloqueio | Colheitas exigidas | Custo do upgrade | XP/colheita | Coins/colheita (base) | Sementes/colheita |
|---|---:|---:|---:|---:|---:|---:|
| Trigo | — (inicial) | — | — | 1 | 2,48 | 1,8 |
| Cenoura | nível 60 | 1.105.000 de trigo | 10.800.000 coins | 3 | 682,13 | 9,01 |
| Batata | nível 150 | 5.865.000 de cenoura | 903.000.000.000 coins | 6 | 3.092.622 | 19,82 |
| Fungo do Nether | nível 240 | 22.066.000 de batata | 11.400.000.000.000.000 coins | 12 | 14.103.235.067 | 30,63 |

O valor base de cada plantação é a curva de coins da mina no nível em que ela desbloqueia, multiplicada por **2,1933** — e as sementes são as gemas da mina no mesmo nível, multiplicadas por **1,4413**. A seção 4 explica de onde saem esses dois fatores.

Quanto custa, em colheitas, atravessar cada faixa de nível:

| Faixa | Plantação | XP da faixa | Colheitas necessárias |
|---|---|---:|---:|
| 0–59 | Trigo | 1.430.988 | 1.430.988 |
| 60–149 | Cenoura | 12.162.929 | 4.054.310 |
| 150–239 | Batata | 87.445.516 | 14.574.253 |
| 240–300 | Fungo | 283.943.992 | 23.661.999 |
| | | **384.983.426** | **43.721.550** |

### 3.3 A escada de valor por nível

O `payout-multiplier` do `levels.yml` multiplica **só a moeda primária** (coins). Sementes ficam lineares de propósito, como as gemas na mineração.

Ele agora declara os **301 níveis**, um a um: a escada anda ×4,0885 a cada 15 níveis e **+2% em cada nível intermediário**, exatamente como o `level-reward-growth` do Mining. Antes eram 21 degraus e 14 de cada 15 níveis não pagavam nada a mais.

O reset a 1 nos níveis 60, 150 e 240 acompanha a troca de plantação, e não é rebaixamento — o valor base da nova cultura dá o salto:

| Transição | Último pagamento antes | Primeiro pagamento depois | Salto |
|---|---:|---:|---:|
| Trigo → Cenoura (nv 60) | **220** | **682** | 3.1x |
| Cenoura → Batata (nv 150) | **1.004.246** | **3.092.622** | 3.1x |
| Batata → Fungo (nv 240) | **4.543.701.426** | **14.103.235.067** | 3.1x |

**Coins por colheita ao longo dos 300 níveis:**

| Nível | Plantação | Multiplicador | Coins por colheita |
|---:|---|---:|---:|
| 0 | Trigo | 1 | 2 |
| 15 | Trigo | 4,09 | 10 |
| 30 | Trigo | 16,64 | 41 |
| 45 | Trigo | 67,43 | 167 |
| 59 | Trigo | 88,98 | 220 |
| 60 | Cenoura | 1 | 682 ⟵ troca de plantação |
| 75 | Cenoura | 4,08 | 2.786 |
| 105 | Cenoura | 67,52 | 46.060 |
| 135 | Cenoura | 1.115,76 | 761.093 |
| 149 | Cenoura | 1.472,22 | 1.004.246 |
| 150 | Batata | 1 | 3.092.622 ⟵ troca de plantação |
| 180 | Batata | 16,6 | 51.324.365 |
| 210 | Batata | 274,47 | 848.826.038 |
| 239 | Batata | 1.469,21 | 4.544e+9 |
| 240 | Fungo | 1 | 1.410e+10 ⟵ troca de plantação |
| 270 | Fungo | 16,49 | 2.325e+11 |
| 285 | Fungo | 67,19 | 9.475e+11 |
| 299 | Fungo | 88,65 | 1.250e+12 |
| 300 | Fungo | 273,72 | 3.860e+12 |

Nota: o último segmento para em **273,7**, enquanto os dois anteriores chegaram a 1.472 — a escada do Fungo é truncada porque 300 é o teto de nível.

---

## 4. Farm x Mining lado a lado

A grade numérica agora é a mesma nos dois. O que continua diferente é o que **não dá** para igualar: o campo é 2D.

| | Mining | Farm |
|---|---|---|
| Moeda de compra | gemas | sementes |
| Razão `base-cost / increase-cost` | ~62,4 | **~62,4** |
| Custo do nível cresce (1→500) | 9x | **9x** |
| Razão `base-chance / increase-chance` | ~26,2 | **~26,2** |
| Chance cresce (1→500) | 20x | **20x** |
| Desbloqueio por nível | 0, 5, 10, 15, 25, 45, 75, 105, 135, 165, 195, 240 | **0, 5, 30, 60, 105, 165, 240** |
| Chance máxima | 14,84% (Explosivo) | **17,44%** (Cataclismo) |
| Multiplicador da moeda de compra | Gemado, 21x | **Fertilidade, 21x** |
| Multiplicador de coins | Afortunado, 15x | **Prosperidade, 15x** |
| Chave: chance nv 500 | Abençoado, 2,0% | **Trevo, 2,0%** |
| Custo de maxar tudo | 5.012.757.838 gemas | **3.333.277.880 sementes** |
| **Eventos por ação manual** | **112,2** | **63,9** |
| **Ações manuais para maxar tudo** | **81.053** | **81.078** |
| **Coins por ação manual** | **2,962e15** | **3,700e15 (+25%)** |

As três últimas linhas contam a história inteira: a fazenda dispara **metade** dos eventos por ação que a mina, porque não existe coluna vertical nem camada horizontal para explodir. Os efeitos dela são todos recortes de um plano.

Isso foi compensado no valor por evento, não na frequência. Cada colheita paga **2,19x** o que um bloco da mina paga na mesma altura da progressão — o que, multiplicado pelos 63,9 eventos, fecha exatamente nos +25% de coins por hora que o desenho pedia. O caminho ingênuo (pagar +25% por colheita) teria deixado a fazenda **59% mais pobre** que a mina por hora, não 25% mais rica.

O mesmo raciocínio calibrou as sementes: valem 1,44x as gemas equivalentes, e é isso que faz maxar os dez encantamentos custar as mesmas ~81 mil ações manuais nos dois modos.

---

## 5. Mudanças aplicadas

### 5.1 · A grade inteira foi trocada

Antes: `base-chance == increase-chance` nos sete de chance (razão 1,0) e `base-cost / increase-cost` em ~2,5. A chance crescia **500x** e o custo **200x** do nível 1 ao 500.

Agora os dez seguem a grade do Mining: **62,4** no custo e **26,2** na chance — custo ×9 e chance ×20 ao longo dos 500 níveis.

| Encantamento | Chance nv 500 antes | Depois | Custo total antes | Depois |
|---|---:|---:|---:|---:|
| Cataclismo | 76,750% | **17,440%** | 49.177.825 | **50.245.703** |
| Laser | 63,300% | **12,007%** | 73.821.625 | **80.053.918** |
| Encruzilhada | 63,300% | **8,002%** | 73.821.625 | **111.459.073** |
| Ceifa | 49,850% | **3,668%** | 61.548.525 | **982.185.480** |
| Enxame | 12,800% | **0,531%** | 110.726.450 | **1.017.079.293** |
| Espantalho | 9,350% | **0,692%** | 147.545.750 | **1.051.974.853** |
| Trevo | 0,041% | **2,000%** | 98.355.850 | **2.839.063** |

### 5.2 · Desbloqueio por nível (Java)

`Enchant.java` ganhou `farmLevelUnlock` e `EnchantsMenu.java` passou a trocar o ícone por uma barreira enquanto o nível não chega — o mesmo desenho do `PickaxeMenu` do Mining. O `hoe.yml` recebeu o `locked-enchant-icon`.

Antes os dez abriam no nível 0 e o único gate era o preço.

### 5.3 · Raios muito maiores

Num campo plano o raio é o que separa os tiers, então eles subiram bastante:

| Encantamento | Antes | Depois | Plantas por proc |
|---|---|---|---:|
| Cataclismo | `explosion-radius: 2` | **4** | 22 → **71** |
| Laser | `max-line-radius: 6` | **25** | 21 → **73** |
| Encruzilhada | `max-line-radius: 6` | **40** | 21 → **84** |
| Ceifa | `harvest-radius: 4` | **12** | 72 → **514** |
| Espantalho | `harvest-radius: 3` | **20** | 26 → **992** por pulso |

As linhas saturam: mesmo com alcance 40 a Encruzilhada só chega a 84, porque o campo tem 57% de densidade e a linha atravessa buracos. É por isso que os dois efeitos de linha ficam no meio da escada e não no topo.

### 5.4 · Trevo copiado do Abençoado

`base-cost: 1000`, `increase-cost: 18.75`, `base-chance: 0.1`, `increase-chance: 0.0038076` — os números do Mining, dígito por dígito. Fecha em **2,0%** no nível 500 em vez dos 0,041% de antes, e o custo cai de 98 milhões para 2,8 milhões de sementes.

A chave tinha que ser igualmente fácil nos dois modos, senão um deles vira o único caminho de caixa que vale a pena.

### 5.5 · Fertilidade e Prosperidade

| | Antes | Depois |
|---|---:|---:|
| Prosperidade (coins) | 17,2226x | **15,0000x** (= Afortunado) |
| Fertilidade (sementes) | 3,0300x | **21,0000x** (= Gemado) |

A Fertilidade subiu **6,9x**. Ela mexe na moeda que compra encantamento e era o multiplicador mais fraco do plugin — no Mining a relação é a inversa, e agora nos dois a moeda que financia a progressão tem o multiplicador maior.

### 5.6 · Ganho por nível entre as trocas de plantação

O `payout-multiplier` passou de 21 degraus para **301 níveis declarados**, com +2% por nível entre as trocas — o mesmo efeito do `level-reward-growth` do Mining, sem tocar em Java (o `FarmLevels.payoutMultiplierFor` usa `floorEntry`, então aceita qualquer nível como chave).

Antes o jogador subia 14 níveis sem ver um coin a mais e levava o salto de 292% inteiro no 15º.

### 5.7 · Regeneração 3x mais lenta

`regrow-delay-seconds` foi de **20 para 60**. Este número é o teto de renda do modo inteiro: o campo tem 22.735 plantações, então sustenta `22.735 / regrow` colheitas por segundo, por mais forte que fique o encantamento — 1.137/s antes, **379/s** agora.

Subiu junto com os raios de propósito. Sem isso o campo passaria o tempo todo vazio e os efeitos novos não teriam o que colher, que é o pior dos dois mundos: efeito forte que não acha planta.

### 5.8 · Agilidade

`max-level: 2` já estava certo. Só o preço mudou, para **3.000 / 10.000**, igual ao Acelerado do Mining.

### 5.9 · Comentário defasado removido

O bloco do `payout-multiplier` avisava que a escada seria calibrada na "FASE 4" e citava `base: 100.0, growth: 2.2` — uma fórmula que não existe mais (hoje é `geometric` com `base: 11992.1`).

### 5.10 · Os multiplicadores passaram a aparecer

A Prosperidade e a Fertilidade nunca mostraram o próprio número: o token `{multiplier}` não
existia em nenhuma config da fazenda fora do ícone de booster, e o `EnchantsMenu` não o
substituiria mesmo se existisse — ele só trocava `{display}`, `{level}`, `{max-level}` e
`{chance}`. A lore dos dois terminava no nível.

Agora as duas trazem a linha, e o menu a preenche:

```yaml
lore:
  - "&7Aumenta o multiplicador de"
  - "&7coins ganhos na colheita."
  - ""
  - "&fNível: &a{level}&8/&c{max-level}"
  - "&fMultiplicador: &7{multiplier}x"   # <- novo
```

| | Nível 1 | Nível 2 | Nível 250 | Nível 500 |
|---|---:|---:|---:|---:|
| Prosperidade | 1,05x | 1,08x | 7,99x | **15x** |
| Fertilidade | 1,04x | 1,08x | 11,00x | **21x** |

O `formatMultiplier` usa 2 casas fixas em vez dos 4 dígitos significativos do `formatChance`
porque um multiplicador vive numa faixa estreita (abre em 1,04 e para em 21), então a escala
fixa lê melhor e o passo por nível — 0,04 no máximo — sempre move a segunda casa.

Segue a convenção que o `{chance}` do Farm já usava: no nível 0 o ícone mostra o que o nível 1
daria, para anunciar o que se está comprando.

### 5.11 · Slots reorganizados na ordem de desbloqueio

O menu da enxada seguia uma ordem herdada, com o Trevo no fim da segunda fila e a Ceifa junto dos
sempre-ativos. Agora ele lê como o menu da picareta: **dois multiplicadores, velocidade, chave** e
depois os de área **na ordem em que abrem**.

```
11 Prosperidade   12 Fertilidade   13 Agilidade   14 Trevo   15 Cataclismo (5)
20 Laser (30)     21 Encruzilhada (60)   22 Ceifa (105)   23 Enxame (165)   24 Espantalho (240)
```

Três arquivos mudaram de `icon.slot`: Trevo 22 → 14, Cataclismo 14 → 15 e Ceifa 15 → 22. As duas
filas ocupam os mesmos slots das duas primeiras do Mining, então quem joga os dois modos encontra
cada categoria no mesmo lugar.

---

## 6. Encantamento por encantamento (marcos)

### Prosperidade — `prosperity.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.250 · **increase-cost:** 145
- **base-multiplier:** 1.05 · **increase-multiplier:** 0.02795591 · **provider:** `coins`
- **Efeito:** Multiplica os coins ganhos na colheita. Sempre ativo.
- **Custo total:** 18.713.750 sementes · **reembolso a 40%:** 7.485.500

| Nível | Custo do nível | Custo acumulado | Multiplicador | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.250 | 1.250 | 1,0500x | 1,05x |
| 2 | 1.395 | 2.645 | 1,0780x | 1,08x |
| 3 | 1.540 | 4.185 | 1,1059x | 1,11x |
| 5 | 1.830 | 7.700 | 1,1618x | 1,16x |
| 10 | 2.555 | 19.025 | 1,3016x | 1,3x |
| 25 | 4.730 | 74.750 | 1,7209x | 1,72x |
| 50 | 8.355 | 240.125 | 2,4198x | 2,42x |
| 75 | 11.980 | 496.125 | 3,1187x | 3,12x |
| 100 | 15.605 | 842.750 | 3,8176x | 3,82x |
| 150 | 22.855 | 1.807.875 | 5,2154x | 5,22x |
| 200 | 30.105 | 3.135.500 | 6,6132x | 6,61x |
| 250 | 37.355 | 4.825.625 | 8,0110x | 8,01x |
| 300 | 44.605 | 6.878.250 | 9,4088x | 9,41x |
| 350 | 51.855 | 9.293.375 | 10,8066x | 10,81x |
| 400 | 59.105 | 12.071.000 | 12,2044x | 12,2x |
| 450 | 66.355 | 15.211.125 | 13,6022x | 13,6x |
| 499 | 73.460 | 18.640.145 | 14,9720x | 14,97x |
| 500 | 73.605 | 18.713.750 | 15,0000x | 15x |

### Fertilidade — `fertility.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.250 · **increase-cost:** 145
- **base-multiplier:** 1.04 · **increase-multiplier:** 0.04 · **provider:** `sementes`
- **Efeito:** Multiplica as sementes ganhas na colheita. Sempre ativo.
- **Custo total:** 18.713.750 sementes · **reembolso a 40%:** 7.485.500

| Nível | Custo do nível | Custo acumulado | Multiplicador | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.250 | 1.250 | 1,0400x | 1,04x |
| 2 | 1.395 | 2.645 | 1,0800x | 1,08x |
| 3 | 1.540 | 4.185 | 1,1200x | 1,12x |
| 5 | 1.830 | 7.700 | 1,2000x | 1,2x |
| 10 | 2.555 | 19.025 | 1,4000x | 1,4x |
| 25 | 4.730 | 74.750 | 2,0000x | 2x |
| 50 | 8.355 | 240.125 | 3,0000x | 3x |
| 75 | 11.980 | 496.125 | 4,0000x | 4x |
| 100 | 15.605 | 842.750 | 5,0000x | 5x |
| 150 | 22.855 | 1.807.875 | 7,0000x | 7x |
| 200 | 30.105 | 3.135.500 | 9,0000x | 9x |
| 250 | 37.355 | 4.825.625 | 11,0000x | 11x |
| 300 | 44.605 | 6.878.250 | 13,0000x | 13x |
| 350 | 51.855 | 9.293.375 | 15,0000x | 15x |
| 400 | 59.105 | 12.071.000 | 17,0000x | 17x |
| 450 | 66.355 | 15.211.125 | 19,0000x | 19x |
| 499 | 73.460 | 18.640.145 | 20,9600x | 20,96x |
| 500 | 73.605 | 18.713.750 | 21,0000x | 21x |

### Agilidade — `haste.yml`

- **Nível máximo:** 2 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 3.000 · **increase-cost:** 7.000
- **Efeito:** Velocidade fixa dentro da fazenda (nivel N = Speed N).
- **Custo total:** 13.000 sementes · **reembolso a 40%:** 5.200

| Nível | Custo do nível | Custo acumulado | Efeito |
|---:|---:|---:|---|
| 1 | 3.000 | 3.000 | Speed I |
| 2 | 10.000 | 13.000 | Speed II |

### Trevo — `clover.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.000 · **increase-cost:** 18,75
- **base-chance:** 0.1% · **increase-chance:** 0.0038076%
- **Efeito:** Chave de fazenda por planta. Rola em TODA planta colhida, inclusive as de area. Copia exata do Abencoado do Mining.
- **Custo total:** 2.839.062,5 sementes · **reembolso a 40%:** 1.135.625

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.000 | 1.000 | 0,1000% | 0,1% |
| 2 | 1.018,75 | 2.018,75 | 0,1038% | 0,1038% |
| 3 | 1.037,5 | 3.056,25 | 0,1076% | 0,1076% |
| 5 | 1.075 | 5.187,5 | 0,1152% | 0,1152% |
| 10 | 1.168,75 | 10.843,75 | 0,1343% | 0,1343% |
| 25 | 1.450 | 30.625 | 0,1914% | 0,1914% |
| 50 | 1.918,75 | 72.968,75 | 0,2866% | 0,2866% |
| 75 | 2.387,5 | 127.031,25 | 0,3818% | 0,3818% |
| 100 | 2.856,25 | 192.812,5 | 0,4770% | 0,477% |
| 150 | 3.793,75 | 359.531,25 | 0,6673% | 0,6673% |
| 200 | 4.731,25 | 573.125 | 0,8577% | 0,8577% |
| 250 | 5.668,75 | 833.593,75 | 1,0481% | 1,048% |
| 300 | 6.606,25 | 1.140.937,5 | 1,2385% | 1,238% |
| 350 | 7.543,75 | 1.495.156,25 | 1,4289% | 1,429% |
| 400 | 8.481,25 | 1.896.250 | 1,6192% | 1,619% |
| 450 | 9.418,75 | 2.344.218,75 | 1,8096% | 1,81% |
| 499 | 10.337,5 | 2.828.706,25 | 1,9962% | 1,996% |
| 500 | 10.356,25 | 2.839.062,5 | 2,0000% | 2% |

### Cataclismo — `cataclysm.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 20.105 · **increase-cost:** 322,19
- **base-chance:** 0.87% · **increase-chance:** 0.0332061%
- **Efeito:** Quadrado 9x9 ao redor da planta quebrada (explosion-radius 4), tolerancia vertical de +-1.
- **Plantas por proc:** 71 (teto 80) · **eficiência:** 246,4
- **Custo total:** 50.245.702,5 sementes · **reembolso a 40%:** 20.098.281

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 20.105 | 20.105 | 0,8700% | 0,87% |
| 2 | 20.427,19 | 40.532,19 | 0,9032% | 0,9032% |
| 3 | 20.749,38 | 61.281,57 | 0,9364% | 0,9364% |
| 5 | 21.393,76 | 103.746,9 | 1,0028% | 1,003% |
| 10 | 23.004,71 | 215.548,55 | 1,1689% | 1,169% |
| 25 | 27.837,56 | 599.282 | 1,6669% | 1,667% |
| 50 | 35.892,31 | 1.399.932,75 | 2,4971% | 2,497% |
| 75 | 43.947,06 | 2.401.952,25 | 3,3273% | 3,327% |
| 100 | 52.001,81 | 3.605.340,5 | 4,1574% | 4,157% |
| 150 | 68.111,31 | 6.616.223,25 | 5,8177% | 5,818% |
| 200 | 84.220,81 | 10.432.581 | 7,4780% | 7,478% |
| 250 | 100.330,31 | 15.054.413,75 | 9,1383% | 9,138% |
| 300 | 116.439,81 | 20.481.721,5 | 10,7986% | 10,8% |
| 350 | 132.549,31 | 26.714.504,25 | 12,4589% | 12,46% |
| 400 | 148.658,81 | 33.752.762 | 14,1192% | 14,12% |
| 450 | 164.768,31 | 41.596.494,75 | 15,7795% | 15,78% |
| 499 | 180.555,62 | 50.064.824,69 | 17,4066% | 17,41% |
| 500 | 180.877,81 | 50.245.702,5 | 17,4398% | 17,44% |

### Laser — `laser.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 32.032 · **increase-cost:** 513,33
- **base-chance:** 0.599% · **increase-chance:** 0.0228626%
- **Efeito:** 4 linhas cardeais de 25 de comprimento (max-line-radius 25), tolerancia vertical de +-1.
- **Plantas por proc:** 73 (teto 100) · **eficiência:** 109,5
- **Custo total:** 80.053.917,5 sementes · **reembolso a 40%:** 32.021.567

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 32.032 | 32.032 | 0,5990% | 0,599% |
| 2 | 32.545,33 | 64.577,33 | 0,6219% | 0,6219% |
| 3 | 33.058,66 | 97.635,99 | 0,6447% | 0,6447% |
| 5 | 34.085,32 | 165.293,3 | 0,6905% | 0,6905% |
| 10 | 36.651,97 | 343.419,85 | 0,8048% | 0,8048% |
| 25 | 44.351,92 | 954.799 | 1,1477% | 1,148% |
| 50 | 57.185,17 | 2.230.429,25 | 1,7193% | 1,719% |
| 75 | 70.018,42 | 3.826.890,75 | 2,2908% | 2,291% |
| 100 | 82.851,67 | 5.744.183,5 | 2,8624% | 2,862% |
| 150 | 108.518,17 | 10.541.262,75 | 4,0055% | 4,006% |
| 200 | 134.184,67 | 16.621.667 | 5,1487% | 5,149% |
| 250 | 159.851,17 | 23.985.396,25 | 6,2918% | 6,292% |
| 300 | 185.517,67 | 32.632.450,5 | 7,4349% | 7,435% |
| 350 | 211.184,17 | 42.562.829,75 | 8,5780% | 8,578% |
| 400 | 236.850,67 | 53.776.534 | 9,7212% | 9,721% |
| 450 | 262.517,17 | 66.273.563,25 | 10,8643% | 10,86% |
| 499 | 287.670,34 | 79.765.733,83 | 11,9846% | 11,98% |
| 500 | 288.183,67 | 80.053.917,5 | 12,0074% | 12,01% |

### Encruzilhada — `crossroads.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 44.598 · **increase-cost:** 714,71
- **base-chance:** 0.3992% · **increase-chance:** 0.0152366%
- **Efeito:** 4 linhas diagonais de 40 de comprimento (max-line-radius 40), tolerancia vertical de +-1.
- **Plantas por proc:** 84 (teto 160) · **eficiência:** 60,3
- **Custo total:** 111.459.072,5 sementes · **reembolso a 40%:** 44.583.629

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 44.598 | 44.598 | 0,3992% | 0,3992% |
| 2 | 45.312,71 | 89.910,71 | 0,4144% | 0,4144% |
| 3 | 46.027,42 | 135.938,13 | 0,4297% | 0,4297% |
| 5 | 47.456,84 | 230.137,1 | 0,4601% | 0,4601% |
| 10 | 51.030,39 | 478.141,95 | 0,5363% | 0,5363% |
| 25 | 61.751,04 | 1.329.363 | 0,7649% | 0,7649% |
| 50 | 79.618,79 | 3.105.419,75 | 1,1458% | 1,146% |
| 75 | 97.486,54 | 5.328.170,25 | 1,5267% | 1,527% |
| 100 | 115.354,29 | 7.997.614,5 | 1,9076% | 1,908% |
| 150 | 151.089,79 | 14.676.584,25 | 2,6695% | 2,669% |
| 200 | 186.825,29 | 23.142.329 | 3,4313% | 3,431% |
| 250 | 222.560,79 | 33.394.848,75 | 4,1931% | 4,193% |
| 300 | 258.296,29 | 45.434.143,5 | 4,9549% | 4,955% |
| 350 | 294.031,79 | 59.260.213,25 | 5,7168% | 5,717% |
| 400 | 329.767,29 | 74.873.058 | 6,4786% | 6,479% |
| 450 | 365.502,79 | 92.272.677,75 | 7,2404% | 7,24% |
| 499 | 400.523,58 | 111.057.834,21 | 7,9870% | 7,987% |
| 500 | 401.238,29 | 111.459.072,5 | 8,0023% | 8,002% |

### Ceifa — `reap.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 393.000 · **increase-cost:** 6.298,08
- **base-chance:** 0.183% · **increase-chance:** 0.0069847%
- **Efeito:** Quadrado 25x25 ancorado no JOGADOR (harvest-radius 12). Janela vertical de 25 blocos: funciona voando.
- **Plantas por proc:** 514 (teto 625) · **eficiência:** 19,2
- **Custo total:** 982.185.480 sementes · **reembolso a 40%:** 392.874.192

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 393.000 | 393.000 | 0,1830% | 0,183% |
| 2 | 399.298,08 | 792.298,08 | 0,1900% | 0,19% |
| 3 | 405.596,16 | 1.197.894,24 | 0,1970% | 0,197% |
| 5 | 418.192,32 | 2.027.980,8 | 0,2109% | 0,2109% |
| 10 | 449.682,72 | 4.213.413,6 | 0,2459% | 0,2459% |
| 25 | 544.153,92 | 11.714.424 | 0,3506% | 0,3506% |
| 50 | 701.605,92 | 27.365.148 | 0,5253% | 0,5253% |
| 75 | 859.057,92 | 46.952.172 | 0,6999% | 0,6999% |
| 100 | 1.016.509,92 | 70.475.496 | 0,8745% | 0,8745% |
| 150 | 1.331.413,92 | 129.331.044 | 1,2237% | 1,224% |
| 200 | 1.646.317,92 | 203.931.792 | 1,5730% | 1,573% |
| 250 | 1.961.221,92 | 294.277.740 | 1,9222% | 1,922% |
| 300 | 2.276.125,92 | 400.368.888 | 2,2714% | 2,271% |
| 350 | 2.591.029,92 | 522.205.236 | 2,6207% | 2,621% |
| 400 | 2.905.933,92 | 659.786.784 | 2,9699% | 2,97% |
| 450 | 3.220.837,92 | 813.113.532 | 3,3191% | 3,319% |
| 499 | 3.529.443,84 | 978.649.738,08 | 3,6614% | 3,661% |
| 500 | 3.535.741,92 | 982.185.480 | 3,6684% | 3,668% |

### Enxame — `swarm.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 406.962 · **increase-cost:** 6.521,83
- **base-chance:** 0.0265% · **increase-chance:** 0.0010115%
- **Efeito:** Nao colhe. Invoca 4 abelhas por 200 ticks (10 s) que dao bonus de ganhos sobre tudo que o jogador colher. Uma por jogador.
- **Custo total:** 1.017.079.292,5 sementes · **reembolso a 40%:** 406.831.717

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 406.962 | 406.962 | 0,0265% | 0,0265% |
| 2 | 413.483,83 | 820.445,83 | 0,0275% | 0,02751% |
| 3 | 420.005,66 | 1.240.451,49 | 0,0285% | 0,02852% |
| 5 | 433.049,32 | 2.100.028,3 | 0,0305% | 0,03055% |
| 10 | 465.658,47 | 4.363.102,35 | 0,0356% | 0,0356% |
| 25 | 563.485,92 | 12.130.599 | 0,0508% | 0,05078% |
| 50 | 726.531,67 | 28.337.341,75 | 0,0761% | 0,07606% |
| 75 | 889.577,42 | 48.620.228,25 | 0,1014% | 0,1014% |
| 100 | 1.052.623,17 | 72.979.258,5 | 0,1266% | 0,1266% |
| 150 | 1.378.714,67 | 133.925.750,25 | 0,1772% | 0,1772% |
| 200 | 1.704.806,17 | 211.176.817 | 0,2278% | 0,2278% |
| 250 | 2.030.897,67 | 304.732.458,75 | 0,2784% | 0,2784% |
| 300 | 2.356.989,17 | 414.592.675,5 | 0,3289% | 0,3289% |
| 350 | 2.683.080,67 | 540.757.467,25 | 0,3795% | 0,3795% |
| 400 | 3.009.172,17 | 683.226.834 | 0,4301% | 0,4301% |
| 450 | 3.335.263,67 | 842.000.775,75 | 0,4807% | 0,4807% |
| 499 | 3.654.833,34 | 1.013.417.937,33 | 0,5302% | 0,5302% |
| 500 | 3.661.355,17 | 1.017.079.292,5 | 0,5312% | 0,5312% |

Bônus de ganhos do Enxame por nível (`bonus-percentage: 10.0` + `increase-bonus: 0.4`):

| Nível | Bônus |
|---:|---:|
| 1 | +10,0% |
| 50 | +29,6% |
| 100 | +49,6% |
| 200 | +89,6% |
| 300 | +129,6% |
| 400 | +169,6% |
| 500 | +209,6% |

### Espantalho — `scarecrow.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 420.925 · **increase-cost:** 6.745,59
- **base-chance:** 0.0345% · **increase-chance:** 0.0013168%
- **Efeito:** Companheiro que vive 200 ticks e colhe um disco de raio 20 a cada 2 ticks — 992 plantas por pulso, 100 pulsos. Um por jogador.
- **Plantas por proc:** 2.341 (teto 0) · **eficiência:** 15,4
- **Custo total:** 1.051.974.852,5 sementes · **reembolso a 40%:** 420.789.941

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 420.925 | 420.925 | 0,0345% | 0,0345% |
| 2 | 427.670,59 | 848.595,59 | 0,0358% | 0,03582% |
| 3 | 434.416,18 | 1.283.011,77 | 0,0371% | 0,03713% |
| 5 | 447.907,36 | 2.172.080,9 | 0,0398% | 0,03977% |
| 10 | 481.635,31 | 4.512.801,55 | 0,0464% | 0,04635% |
| 25 | 582.819,16 | 12.546.802 | 0,0661% | 0,0661% |
| 50 | 751.458,91 | 29.309.597,75 | 0,0990% | 0,09902% |
| 75 | 920.098,66 | 50.288.387,25 | 0,1319% | 0,1319% |
| 100 | 1.088.738,41 | 75.483.170,5 | 0,1649% | 0,1649% |
| 150 | 1.426.017,91 | 138.520.718,25 | 0,2307% | 0,2307% |
| 200 | 1.763.297,41 | 218.422.241 | 0,2965% | 0,2965% |
| 250 | 2.100.576,91 | 315.187.738,75 | 0,3624% | 0,3624% |
| 300 | 2.437.856,41 | 428.817.211,5 | 0,4282% | 0,4282% |
| 350 | 2.775.135,91 | 559.310.659,25 | 0,4941% | 0,4941% |
| 400 | 3.112.415,41 | 706.668.082 | 0,5599% | 0,5599% |
| 450 | 3.449.694,91 | 870.889.479,75 | 0,6257% | 0,6257% |
| 499 | 3.780.228,82 | 1.048.187.878,09 | 0,6903% | 0,6903% |
| 500 | 3.786.974,41 | 1.051.974.852,5 | 0,6916% | 0,6916% |

---

## 7. Anexo — tabelas completas, nível por nível

`Exibido na lore` é o texto que o menu da enxada mostra: `EnchantsMenu.formatChance` (4 dígitos significativos) para as chances e `formatMultiplier` (2 casas) para os multiplicadores. Os dois foram feitos para que **todo nível comprado mova um dígito**.

### Anexo — Prosperidade

| Nível | Custo do nível | Custo acumulado | Multiplicador |
|---:|---:|---:|---:|
| 1 | 1.250 | 1.250 | 1,0500x |
| 2 | 1.395 | 2.645 | 1,0780x |
| 3 | 1.540 | 4.185 | 1,1059x |
| 4 | 1.685 | 5.870 | 1,1339x |
| 5 | 1.830 | 7.700 | 1,1618x |
| 6 | 1.975 | 9.675 | 1,1898x |
| 7 | 2.120 | 11.795 | 1,2177x |
| 8 | 2.265 | 14.060 | 1,2457x |
| 9 | 2.410 | 16.470 | 1,2736x |
| 10 | 2.555 | 19.025 | 1,3016x |
| 11 | 2.700 | 21.725 | 1,3296x |
| 12 | 2.845 | 24.570 | 1,3575x |
| 13 | 2.990 | 27.560 | 1,3855x |
| 14 | 3.135 | 30.695 | 1,4134x |
| 15 | 3.280 | 33.975 | 1,4414x |
| 16 | 3.425 | 37.400 | 1,4693x |
| 17 | 3.570 | 40.970 | 1,4973x |
| 18 | 3.715 | 44.685 | 1,5253x |
| 19 | 3.860 | 48.545 | 1,5532x |
| 20 | 4.005 | 52.550 | 1,5812x |
| 21 | 4.150 | 56.700 | 1,6091x |
| 22 | 4.295 | 60.995 | 1,6371x |
| 23 | 4.440 | 65.435 | 1,6650x |
| 24 | 4.585 | 70.020 | 1,6930x |
| 25 | 4.730 | 74.750 | 1,7209x |
| 26 | 4.875 | 79.625 | 1,7489x |
| 27 | 5.020 | 84.645 | 1,7769x |
| 28 | 5.165 | 89.810 | 1,8048x |
| 29 | 5.310 | 95.120 | 1,8328x |
| 30 | 5.455 | 100.575 | 1,8607x |
| 31 | 5.600 | 106.175 | 1,8887x |
| 32 | 5.745 | 111.920 | 1,9166x |
| 33 | 5.890 | 117.810 | 1,9446x |
| 34 | 6.035 | 123.845 | 1,9725x |
| 35 | 6.180 | 130.025 | 2,0005x |
| 36 | 6.325 | 136.350 | 2,0285x |
| 37 | 6.470 | 142.820 | 2,0564x |
| 38 | 6.615 | 149.435 | 2,0844x |
| 39 | 6.760 | 156.195 | 2,1123x |
| 40 | 6.905 | 163.100 | 2,1403x |
| 41 | 7.050 | 170.150 | 2,1682x |
| 42 | 7.195 | 177.345 | 2,1962x |
| 43 | 7.340 | 184.685 | 2,2241x |
| 44 | 7.485 | 192.170 | 2,2521x |
| 45 | 7.630 | 199.800 | 2,2801x |
| 46 | 7.775 | 207.575 | 2,3080x |
| 47 | 7.920 | 215.495 | 2,3360x |
| 48 | 8.065 | 223.560 | 2,3639x |
| 49 | 8.210 | 231.770 | 2,3919x |
| 50 | 8.355 | 240.125 | 2,4198x |
| 51 | 8.500 | 248.625 | 2,4478x |
| 52 | 8.645 | 257.270 | 2,4758x |
| 53 | 8.790 | 266.060 | 2,5037x |
| 54 | 8.935 | 274.995 | 2,5317x |
| 55 | 9.080 | 284.075 | 2,5596x |
| 56 | 9.225 | 293.300 | 2,5876x |
| 57 | 9.370 | 302.670 | 2,6155x |
| 58 | 9.515 | 312.185 | 2,6435x |
| 59 | 9.660 | 321.845 | 2,6714x |
| 60 | 9.805 | 331.650 | 2,6994x |
| 61 | 9.950 | 341.600 | 2,7274x |
| 62 | 10.095 | 351.695 | 2,7553x |
| 63 | 10.240 | 361.935 | 2,7833x |
| 64 | 10.385 | 372.320 | 2,8112x |
| 65 | 10.530 | 382.850 | 2,8392x |
| 66 | 10.675 | 393.525 | 2,8671x |
| 67 | 10.820 | 404.345 | 2,8951x |
| 68 | 10.965 | 415.310 | 2,9230x |
| 69 | 11.110 | 426.420 | 2,9510x |
| 70 | 11.255 | 437.675 | 2,9790x |
| 71 | 11.400 | 449.075 | 3,0069x |
| 72 | 11.545 | 460.620 | 3,0349x |
| 73 | 11.690 | 472.310 | 3,0628x |
| 74 | 11.835 | 484.145 | 3,0908x |
| 75 | 11.980 | 496.125 | 3,1187x |
| 76 | 12.125 | 508.250 | 3,1467x |
| 77 | 12.270 | 520.520 | 3,1746x |
| 78 | 12.415 | 532.935 | 3,2026x |
| 79 | 12.560 | 545.495 | 3,2306x |
| 80 | 12.705 | 558.200 | 3,2585x |
| 81 | 12.850 | 571.050 | 3,2865x |
| 82 | 12.995 | 584.045 | 3,3144x |
| 83 | 13.140 | 597.185 | 3,3424x |
| 84 | 13.285 | 610.470 | 3,3703x |
| 85 | 13.430 | 623.900 | 3,3983x |
| 86 | 13.575 | 637.475 | 3,4263x |
| 87 | 13.720 | 651.195 | 3,4542x |
| 88 | 13.865 | 665.060 | 3,4822x |
| 89 | 14.010 | 679.070 | 3,5101x |
| 90 | 14.155 | 693.225 | 3,5381x |
| 91 | 14.300 | 707.525 | 3,5660x |
| 92 | 14.445 | 721.970 | 3,5940x |
| 93 | 14.590 | 736.560 | 3,6219x |
| 94 | 14.735 | 751.295 | 3,6499x |
| 95 | 14.880 | 766.175 | 3,6779x |
| 96 | 15.025 | 781.200 | 3,7058x |
| 97 | 15.170 | 796.370 | 3,7338x |
| 98 | 15.315 | 811.685 | 3,7617x |
| 99 | 15.460 | 827.145 | 3,7897x |
| 100 | 15.605 | 842.750 | 3,8176x |
| 101 | 15.750 | 858.500 | 3,8456x |
| 102 | 15.895 | 874.395 | 3,8735x |
| 103 | 16.040 | 890.435 | 3,9015x |
| 104 | 16.185 | 906.620 | 3,9295x |
| 105 | 16.330 | 922.950 | 3,9574x |
| 106 | 16.475 | 939.425 | 3,9854x |
| 107 | 16.620 | 956.045 | 4,0133x |
| 108 | 16.765 | 972.810 | 4,0413x |
| 109 | 16.910 | 989.720 | 4,0692x |
| 110 | 17.055 | 1.006.775 | 4,0972x |
| 111 | 17.200 | 1.023.975 | 4,1252x |
| 112 | 17.345 | 1.041.320 | 4,1531x |
| 113 | 17.490 | 1.058.810 | 4,1811x |
| 114 | 17.635 | 1.076.445 | 4,2090x |
| 115 | 17.780 | 1.094.225 | 4,2370x |
| 116 | 17.925 | 1.112.150 | 4,2649x |
| 117 | 18.070 | 1.130.220 | 4,2929x |
| 118 | 18.215 | 1.148.435 | 4,3208x |
| 119 | 18.360 | 1.166.795 | 4,3488x |
| 120 | 18.505 | 1.185.300 | 4,3768x |
| 121 | 18.650 | 1.203.950 | 4,4047x |
| 122 | 18.795 | 1.222.745 | 4,4327x |
| 123 | 18.940 | 1.241.685 | 4,4606x |
| 124 | 19.085 | 1.260.770 | 4,4886x |
| 125 | 19.230 | 1.280.000 | 4,5165x |
| 126 | 19.375 | 1.299.375 | 4,5445x |
| 127 | 19.520 | 1.318.895 | 4,5724x |
| 128 | 19.665 | 1.338.560 | 4,6004x |
| 129 | 19.810 | 1.358.370 | 4,6284x |
| 130 | 19.955 | 1.378.325 | 4,6563x |
| 131 | 20.100 | 1.398.425 | 4,6843x |
| 132 | 20.245 | 1.418.670 | 4,7122x |
| 133 | 20.390 | 1.439.060 | 4,7402x |
| 134 | 20.535 | 1.459.595 | 4,7681x |
| 135 | 20.680 | 1.480.275 | 4,7961x |
| 136 | 20.825 | 1.501.100 | 4,8240x |
| 137 | 20.970 | 1.522.070 | 4,8520x |
| 138 | 21.115 | 1.543.185 | 4,8800x |
| 139 | 21.260 | 1.564.445 | 4,9079x |
| 140 | 21.405 | 1.585.850 | 4,9359x |
| 141 | 21.550 | 1.607.400 | 4,9638x |
| 142 | 21.695 | 1.629.095 | 4,9918x |
| 143 | 21.840 | 1.650.935 | 5,0197x |
| 144 | 21.985 | 1.672.920 | 5,0477x |
| 145 | 22.130 | 1.695.050 | 5,0757x |
| 146 | 22.275 | 1.717.325 | 5,1036x |
| 147 | 22.420 | 1.739.745 | 5,1316x |
| 148 | 22.565 | 1.762.310 | 5,1595x |
| 149 | 22.710 | 1.785.020 | 5,1875x |
| 150 | 22.855 | 1.807.875 | 5,2154x |
| 151 | 23.000 | 1.830.875 | 5,2434x |
| 152 | 23.145 | 1.854.020 | 5,2713x |
| 153 | 23.290 | 1.877.310 | 5,2993x |
| 154 | 23.435 | 1.900.745 | 5,3273x |
| 155 | 23.580 | 1.924.325 | 5,3552x |
| 156 | 23.725 | 1.948.050 | 5,3832x |
| 157 | 23.870 | 1.971.920 | 5,4111x |
| 158 | 24.015 | 1.995.935 | 5,4391x |
| 159 | 24.160 | 2.020.095 | 5,4670x |
| 160 | 24.305 | 2.044.400 | 5,4950x |
| 161 | 24.450 | 2.068.850 | 5,5229x |
| 162 | 24.595 | 2.093.445 | 5,5509x |
| 163 | 24.740 | 2.118.185 | 5,5789x |
| 164 | 24.885 | 2.143.070 | 5,6068x |
| 165 | 25.030 | 2.168.100 | 5,6348x |
| 166 | 25.175 | 2.193.275 | 5,6627x |
| 167 | 25.320 | 2.218.595 | 5,6907x |
| 168 | 25.465 | 2.244.060 | 5,7186x |
| 169 | 25.610 | 2.269.670 | 5,7466x |
| 170 | 25.755 | 2.295.425 | 5,7745x |
| 171 | 25.900 | 2.321.325 | 5,8025x |
| 172 | 26.045 | 2.347.370 | 5,8305x |
| 173 | 26.190 | 2.373.560 | 5,8584x |
| 174 | 26.335 | 2.399.895 | 5,8864x |
| 175 | 26.480 | 2.426.375 | 5,9143x |
| 176 | 26.625 | 2.453.000 | 5,9423x |
| 177 | 26.770 | 2.479.770 | 5,9702x |
| 178 | 26.915 | 2.506.685 | 5,9982x |
| 179 | 27.060 | 2.533.745 | 6,0262x |
| 180 | 27.205 | 2.560.950 | 6,0541x |
| 181 | 27.350 | 2.588.300 | 6,0821x |
| 182 | 27.495 | 2.615.795 | 6,1100x |
| 183 | 27.640 | 2.643.435 | 6,1380x |
| 184 | 27.785 | 2.671.220 | 6,1659x |
| 185 | 27.930 | 2.699.150 | 6,1939x |
| 186 | 28.075 | 2.727.225 | 6,2218x |
| 187 | 28.220 | 2.755.445 | 6,2498x |
| 188 | 28.365 | 2.783.810 | 6,2778x |
| 189 | 28.510 | 2.812.320 | 6,3057x |
| 190 | 28.655 | 2.840.975 | 6,3337x |
| 191 | 28.800 | 2.869.775 | 6,3616x |
| 192 | 28.945 | 2.898.720 | 6,3896x |
| 193 | 29.090 | 2.927.810 | 6,4175x |
| 194 | 29.235 | 2.957.045 | 6,4455x |
| 195 | 29.380 | 2.986.425 | 6,4734x |
| 196 | 29.525 | 3.015.950 | 6,5014x |
| 197 | 29.670 | 3.045.620 | 6,5294x |
| 198 | 29.815 | 3.075.435 | 6,5573x |
| 199 | 29.960 | 3.105.395 | 6,5853x |
| 200 | 30.105 | 3.135.500 | 6,6132x |
| 201 | 30.250 | 3.165.750 | 6,6412x |
| 202 | 30.395 | 3.196.145 | 6,6691x |
| 203 | 30.540 | 3.226.685 | 6,6971x |
| 204 | 30.685 | 3.257.370 | 6,7250x |
| 205 | 30.830 | 3.288.200 | 6,7530x |
| 206 | 30.975 | 3.319.175 | 6,7810x |
| 207 | 31.120 | 3.350.295 | 6,8089x |
| 208 | 31.265 | 3.381.560 | 6,8369x |
| 209 | 31.410 | 3.412.970 | 6,8648x |
| 210 | 31.555 | 3.444.525 | 6,8928x |
| 211 | 31.700 | 3.476.225 | 6,9207x |
| 212 | 31.845 | 3.508.070 | 6,9487x |
| 213 | 31.990 | 3.540.060 | 6,9767x |
| 214 | 32.135 | 3.572.195 | 7,0046x |
| 215 | 32.280 | 3.604.475 | 7,0326x |
| 216 | 32.425 | 3.636.900 | 7,0605x |
| 217 | 32.570 | 3.669.470 | 7,0885x |
| 218 | 32.715 | 3.702.185 | 7,1164x |
| 219 | 32.860 | 3.735.045 | 7,1444x |
| 220 | 33.005 | 3.768.050 | 7,1723x |
| 221 | 33.150 | 3.801.200 | 7,2003x |
| 222 | 33.295 | 3.834.495 | 7,2283x |
| 223 | 33.440 | 3.867.935 | 7,2562x |
| 224 | 33.585 | 3.901.520 | 7,2842x |
| 225 | 33.730 | 3.935.250 | 7,3121x |
| 226 | 33.875 | 3.969.125 | 7,3401x |
| 227 | 34.020 | 4.003.145 | 7,3680x |
| 228 | 34.165 | 4.037.310 | 7,3960x |
| 229 | 34.310 | 4.071.620 | 7,4239x |
| 230 | 34.455 | 4.106.075 | 7,4519x |
| 231 | 34.600 | 4.140.675 | 7,4799x |
| 232 | 34.745 | 4.175.420 | 7,5078x |
| 233 | 34.890 | 4.210.310 | 7,5358x |
| 234 | 35.035 | 4.245.345 | 7,5637x |
| 235 | 35.180 | 4.280.525 | 7,5917x |
| 236 | 35.325 | 4.315.850 | 7,6196x |
| 237 | 35.470 | 4.351.320 | 7,6476x |
| 238 | 35.615 | 4.386.935 | 7,6756x |
| 239 | 35.760 | 4.422.695 | 7,7035x |
| 240 | 35.905 | 4.458.600 | 7,7315x |
| 241 | 36.050 | 4.494.650 | 7,7594x |
| 242 | 36.195 | 4.530.845 | 7,7874x |
| 243 | 36.340 | 4.567.185 | 7,8153x |
| 244 | 36.485 | 4.603.670 | 7,8433x |
| 245 | 36.630 | 4.640.300 | 7,8712x |
| 246 | 36.775 | 4.677.075 | 7,8992x |
| 247 | 36.920 | 4.713.995 | 7,9272x |
| 248 | 37.065 | 4.751.060 | 7,9551x |
| 249 | 37.210 | 4.788.270 | 7,9831x |
| 250 | 37.355 | 4.825.625 | 8,0110x |
| 251 | 37.500 | 4.863.125 | 8,0390x |
| 252 | 37.645 | 4.900.770 | 8,0669x |
| 253 | 37.790 | 4.938.560 | 8,0949x |
| 254 | 37.935 | 4.976.495 | 8,1228x |
| 255 | 38.080 | 5.014.575 | 8,1508x |
| 256 | 38.225 | 5.052.800 | 8,1788x |
| 257 | 38.370 | 5.091.170 | 8,2067x |
| 258 | 38.515 | 5.129.685 | 8,2347x |
| 259 | 38.660 | 5.168.345 | 8,2626x |
| 260 | 38.805 | 5.207.150 | 8,2906x |
| 261 | 38.950 | 5.246.100 | 8,3185x |
| 262 | 39.095 | 5.285.195 | 8,3465x |
| 263 | 39.240 | 5.324.435 | 8,3744x |
| 264 | 39.385 | 5.363.820 | 8,4024x |
| 265 | 39.530 | 5.403.350 | 8,4304x |
| 266 | 39.675 | 5.443.025 | 8,4583x |
| 267 | 39.820 | 5.482.845 | 8,4863x |
| 268 | 39.965 | 5.522.810 | 8,5142x |
| 269 | 40.110 | 5.562.920 | 8,5422x |
| 270 | 40.255 | 5.603.175 | 8,5701x |
| 271 | 40.400 | 5.643.575 | 8,5981x |
| 272 | 40.545 | 5.684.120 | 8,6261x |
| 273 | 40.690 | 5.724.810 | 8,6540x |
| 274 | 40.835 | 5.765.645 | 8,6820x |
| 275 | 40.980 | 5.806.625 | 8,7099x |
| 276 | 41.125 | 5.847.750 | 8,7379x |
| 277 | 41.270 | 5.889.020 | 8,7658x |
| 278 | 41.415 | 5.930.435 | 8,7938x |
| 279 | 41.560 | 5.971.995 | 8,8217x |
| 280 | 41.705 | 6.013.700 | 8,8497x |
| 281 | 41.850 | 6.055.550 | 8,8777x |
| 282 | 41.995 | 6.097.545 | 8,9056x |
| 283 | 42.140 | 6.139.685 | 8,9336x |
| 284 | 42.285 | 6.181.970 | 8,9615x |
| 285 | 42.430 | 6.224.400 | 8,9895x |
| 286 | 42.575 | 6.266.975 | 9,0174x |
| 287 | 42.720 | 6.309.695 | 9,0454x |
| 288 | 42.865 | 6.352.560 | 9,0733x |
| 289 | 43.010 | 6.395.570 | 9,1013x |
| 290 | 43.155 | 6.438.725 | 9,1293x |
| 291 | 43.300 | 6.482.025 | 9,1572x |
| 292 | 43.445 | 6.525.470 | 9,1852x |
| 293 | 43.590 | 6.569.060 | 9,2131x |
| 294 | 43.735 | 6.612.795 | 9,2411x |
| 295 | 43.880 | 6.656.675 | 9,2690x |
| 296 | 44.025 | 6.700.700 | 9,2970x |
| 297 | 44.170 | 6.744.870 | 9,3249x |
| 298 | 44.315 | 6.789.185 | 9,3529x |
| 299 | 44.460 | 6.833.645 | 9,3809x |
| 300 | 44.605 | 6.878.250 | 9,4088x |
| 301 | 44.750 | 6.923.000 | 9,4368x |
| 302 | 44.895 | 6.967.895 | 9,4647x |
| 303 | 45.040 | 7.012.935 | 9,4927x |
| 304 | 45.185 | 7.058.120 | 9,5206x |
| 305 | 45.330 | 7.103.450 | 9,5486x |
| 306 | 45.475 | 7.148.925 | 9,5766x |
| 307 | 45.620 | 7.194.545 | 9,6045x |
| 308 | 45.765 | 7.240.310 | 9,6325x |
| 309 | 45.910 | 7.286.220 | 9,6604x |
| 310 | 46.055 | 7.332.275 | 9,6884x |
| 311 | 46.200 | 7.378.475 | 9,7163x |
| 312 | 46.345 | 7.424.820 | 9,7443x |
| 313 | 46.490 | 7.471.310 | 9,7722x |
| 314 | 46.635 | 7.517.945 | 9,8002x |
| 315 | 46.780 | 7.564.725 | 9,8282x |
| 316 | 46.925 | 7.611.650 | 9,8561x |
| 317 | 47.070 | 7.658.720 | 9,8841x |
| 318 | 47.215 | 7.705.935 | 9,9120x |
| 319 | 47.360 | 7.753.295 | 9,9400x |
| 320 | 47.505 | 7.800.800 | 9,9679x |
| 321 | 47.650 | 7.848.450 | 9,9959x |
| 322 | 47.795 | 7.896.245 | 10,0238x |
| 323 | 47.940 | 7.944.185 | 10,0518x |
| 324 | 48.085 | 7.992.270 | 10,0798x |
| 325 | 48.230 | 8.040.500 | 10,1077x |
| 326 | 48.375 | 8.088.875 | 10,1357x |
| 327 | 48.520 | 8.137.395 | 10,1636x |
| 328 | 48.665 | 8.186.060 | 10,1916x |
| 329 | 48.810 | 8.234.870 | 10,2195x |
| 330 | 48.955 | 8.283.825 | 10,2475x |
| 331 | 49.100 | 8.332.925 | 10,2755x |
| 332 | 49.245 | 8.382.170 | 10,3034x |
| 333 | 49.390 | 8.431.560 | 10,3314x |
| 334 | 49.535 | 8.481.095 | 10,3593x |
| 335 | 49.680 | 8.530.775 | 10,3873x |
| 336 | 49.825 | 8.580.600 | 10,4152x |
| 337 | 49.970 | 8.630.570 | 10,4432x |
| 338 | 50.115 | 8.680.685 | 10,4711x |
| 339 | 50.260 | 8.730.945 | 10,4991x |
| 340 | 50.405 | 8.781.350 | 10,5271x |
| 341 | 50.550 | 8.831.900 | 10,5550x |
| 342 | 50.695 | 8.882.595 | 10,5830x |
| 343 | 50.840 | 8.933.435 | 10,6109x |
| 344 | 50.985 | 8.984.420 | 10,6389x |
| 345 | 51.130 | 9.035.550 | 10,6668x |
| 346 | 51.275 | 9.086.825 | 10,6948x |
| 347 | 51.420 | 9.138.245 | 10,7227x |
| 348 | 51.565 | 9.189.810 | 10,7507x |
| 349 | 51.710 | 9.241.520 | 10,7787x |
| 350 | 51.855 | 9.293.375 | 10,8066x |
| 351 | 52.000 | 9.345.375 | 10,8346x |
| 352 | 52.145 | 9.397.520 | 10,8625x |
| 353 | 52.290 | 9.449.810 | 10,8905x |
| 354 | 52.435 | 9.502.245 | 10,9184x |
| 355 | 52.580 | 9.554.825 | 10,9464x |
| 356 | 52.725 | 9.607.550 | 10,9743x |
| 357 | 52.870 | 9.660.420 | 11,0023x |
| 358 | 53.015 | 9.713.435 | 11,0303x |
| 359 | 53.160 | 9.766.595 | 11,0582x |
| 360 | 53.305 | 9.819.900 | 11,0862x |
| 361 | 53.450 | 9.873.350 | 11,1141x |
| 362 | 53.595 | 9.926.945 | 11,1421x |
| 363 | 53.740 | 9.980.685 | 11,1700x |
| 364 | 53.885 | 10.034.570 | 11,1980x |
| 365 | 54.030 | 10.088.600 | 11,2260x |
| 366 | 54.175 | 10.142.775 | 11,2539x |
| 367 | 54.320 | 10.197.095 | 11,2819x |
| 368 | 54.465 | 10.251.560 | 11,3098x |
| 369 | 54.610 | 10.306.170 | 11,3378x |
| 370 | 54.755 | 10.360.925 | 11,3657x |
| 371 | 54.900 | 10.415.825 | 11,3937x |
| 372 | 55.045 | 10.470.870 | 11,4216x |
| 373 | 55.190 | 10.526.060 | 11,4496x |
| 374 | 55.335 | 10.581.395 | 11,4776x |
| 375 | 55.480 | 10.636.875 | 11,5055x |
| 376 | 55.625 | 10.692.500 | 11,5335x |
| 377 | 55.770 | 10.748.270 | 11,5614x |
| 378 | 55.915 | 10.804.185 | 11,5894x |
| 379 | 56.060 | 10.860.245 | 11,6173x |
| 380 | 56.205 | 10.916.450 | 11,6453x |
| 381 | 56.350 | 10.972.800 | 11,6732x |
| 382 | 56.495 | 11.029.295 | 11,7012x |
| 383 | 56.640 | 11.085.935 | 11,7292x |
| 384 | 56.785 | 11.142.720 | 11,7571x |
| 385 | 56.930 | 11.199.650 | 11,7851x |
| 386 | 57.075 | 11.256.725 | 11,8130x |
| 387 | 57.220 | 11.313.945 | 11,8410x |
| 388 | 57.365 | 11.371.310 | 11,8689x |
| 389 | 57.510 | 11.428.820 | 11,8969x |
| 390 | 57.655 | 11.486.475 | 11,9248x |
| 391 | 57.800 | 11.544.275 | 11,9528x |
| 392 | 57.945 | 11.602.220 | 11,9808x |
| 393 | 58.090 | 11.660.310 | 12,0087x |
| 394 | 58.235 | 11.718.545 | 12,0367x |
| 395 | 58.380 | 11.776.925 | 12,0646x |
| 396 | 58.525 | 11.835.450 | 12,0926x |
| 397 | 58.670 | 11.894.120 | 12,1205x |
| 398 | 58.815 | 11.952.935 | 12,1485x |
| 399 | 58.960 | 12.011.895 | 12,1765x |
| 400 | 59.105 | 12.071.000 | 12,2044x |
| 401 | 59.250 | 12.130.250 | 12,2324x |
| 402 | 59.395 | 12.189.645 | 12,2603x |
| 403 | 59.540 | 12.249.185 | 12,2883x |
| 404 | 59.685 | 12.308.870 | 12,3162x |
| 405 | 59.830 | 12.368.700 | 12,3442x |
| 406 | 59.975 | 12.428.675 | 12,3721x |
| 407 | 60.120 | 12.488.795 | 12,4001x |
| 408 | 60.265 | 12.549.060 | 12,4281x |
| 409 | 60.410 | 12.609.470 | 12,4560x |
| 410 | 60.555 | 12.670.025 | 12,4840x |
| 411 | 60.700 | 12.730.725 | 12,5119x |
| 412 | 60.845 | 12.791.570 | 12,5399x |
| 413 | 60.990 | 12.852.560 | 12,5678x |
| 414 | 61.135 | 12.913.695 | 12,5958x |
| 415 | 61.280 | 12.974.975 | 12,6237x |
| 416 | 61.425 | 13.036.400 | 12,6517x |
| 417 | 61.570 | 13.097.970 | 12,6797x |
| 418 | 61.715 | 13.159.685 | 12,7076x |
| 419 | 61.860 | 13.221.545 | 12,7356x |
| 420 | 62.005 | 13.283.550 | 12,7635x |
| 421 | 62.150 | 13.345.700 | 12,7915x |
| 422 | 62.295 | 13.407.995 | 12,8194x |
| 423 | 62.440 | 13.470.435 | 12,8474x |
| 424 | 62.585 | 13.533.020 | 12,8753x |
| 425 | 62.730 | 13.595.750 | 12,9033x |
| 426 | 62.875 | 13.658.625 | 12,9313x |
| 427 | 63.020 | 13.721.645 | 12,9592x |
| 428 | 63.165 | 13.784.810 | 12,9872x |
| 429 | 63.310 | 13.848.120 | 13,0151x |
| 430 | 63.455 | 13.911.575 | 13,0431x |
| 431 | 63.600 | 13.975.175 | 13,0710x |
| 432 | 63.745 | 14.038.920 | 13,0990x |
| 433 | 63.890 | 14.102.810 | 13,1270x |
| 434 | 64.035 | 14.166.845 | 13,1549x |
| 435 | 64.180 | 14.231.025 | 13,1829x |
| 436 | 64.325 | 14.295.350 | 13,2108x |
| 437 | 64.470 | 14.359.820 | 13,2388x |
| 438 | 64.615 | 14.424.435 | 13,2667x |
| 439 | 64.760 | 14.489.195 | 13,2947x |
| 440 | 64.905 | 14.554.100 | 13,3226x |
| 441 | 65.050 | 14.619.150 | 13,3506x |
| 442 | 65.195 | 14.684.345 | 13,3786x |
| 443 | 65.340 | 14.749.685 | 13,4065x |
| 444 | 65.485 | 14.815.170 | 13,4345x |
| 445 | 65.630 | 14.880.800 | 13,4624x |
| 446 | 65.775 | 14.946.575 | 13,4904x |
| 447 | 65.920 | 15.012.495 | 13,5183x |
| 448 | 66.065 | 15.078.560 | 13,5463x |
| 449 | 66.210 | 15.144.770 | 13,5742x |
| 450 | 66.355 | 15.211.125 | 13,6022x |
| 451 | 66.500 | 15.277.625 | 13,6302x |
| 452 | 66.645 | 15.344.270 | 13,6581x |
| 453 | 66.790 | 15.411.060 | 13,6861x |
| 454 | 66.935 | 15.477.995 | 13,7140x |
| 455 | 67.080 | 15.545.075 | 13,7420x |
| 456 | 67.225 | 15.612.300 | 13,7699x |
| 457 | 67.370 | 15.679.670 | 13,7979x |
| 458 | 67.515 | 15.747.185 | 13,8259x |
| 459 | 67.660 | 15.814.845 | 13,8538x |
| 460 | 67.805 | 15.882.650 | 13,8818x |
| 461 | 67.950 | 15.950.600 | 13,9097x |
| 462 | 68.095 | 16.018.695 | 13,9377x |
| 463 | 68.240 | 16.086.935 | 13,9656x |
| 464 | 68.385 | 16.155.320 | 13,9936x |
| 465 | 68.530 | 16.223.850 | 14,0215x |
| 466 | 68.675 | 16.292.525 | 14,0495x |
| 467 | 68.820 | 16.361.345 | 14,0775x |
| 468 | 68.965 | 16.430.310 | 14,1054x |
| 469 | 69.110 | 16.499.420 | 14,1334x |
| 470 | 69.255 | 16.568.675 | 14,1613x |
| 471 | 69.400 | 16.638.075 | 14,1893x |
| 472 | 69.545 | 16.707.620 | 14,2172x |
| 473 | 69.690 | 16.777.310 | 14,2452x |
| 474 | 69.835 | 16.847.145 | 14,2731x |
| 475 | 69.980 | 16.917.125 | 14,3011x |
| 476 | 70.125 | 16.987.250 | 14,3291x |
| 477 | 70.270 | 17.057.520 | 14,3570x |
| 478 | 70.415 | 17.127.935 | 14,3850x |
| 479 | 70.560 | 17.198.495 | 14,4129x |
| 480 | 70.705 | 17.269.200 | 14,4409x |
| 481 | 70.850 | 17.340.050 | 14,4688x |
| 482 | 70.995 | 17.411.045 | 14,4968x |
| 483 | 71.140 | 17.482.185 | 14,5247x |
| 484 | 71.285 | 17.553.470 | 14,5527x |
| 485 | 71.430 | 17.624.900 | 14,5807x |
| 486 | 71.575 | 17.696.475 | 14,6086x |
| 487 | 71.720 | 17.768.195 | 14,6366x |
| 488 | 71.865 | 17.840.060 | 14,6645x |
| 489 | 72.010 | 17.912.070 | 14,6925x |
| 490 | 72.155 | 17.984.225 | 14,7204x |
| 491 | 72.300 | 18.056.525 | 14,7484x |
| 492 | 72.445 | 18.128.970 | 14,7764x |
| 493 | 72.590 | 18.201.560 | 14,8043x |
| 494 | 72.735 | 18.274.295 | 14,8323x |
| 495 | 72.880 | 18.347.175 | 14,8602x |
| 496 | 73.025 | 18.420.200 | 14,8882x |
| 497 | 73.170 | 18.493.370 | 14,9161x |
| 498 | 73.315 | 18.566.685 | 14,9441x |
| 499 | 73.460 | 18.640.145 | 14,9720x |
| 500 | 73.605 | 18.713.750 | 15,0000x |

### Anexo — Fertilidade

| Nível | Custo do nível | Custo acumulado | Multiplicador |
|---:|---:|---:|---:|
| 1 | 1.250 | 1.250 | 1,0400x |
| 2 | 1.395 | 2.645 | 1,0800x |
| 3 | 1.540 | 4.185 | 1,1200x |
| 4 | 1.685 | 5.870 | 1,1600x |
| 5 | 1.830 | 7.700 | 1,2000x |
| 6 | 1.975 | 9.675 | 1,2400x |
| 7 | 2.120 | 11.795 | 1,2800x |
| 8 | 2.265 | 14.060 | 1,3200x |
| 9 | 2.410 | 16.470 | 1,3600x |
| 10 | 2.555 | 19.025 | 1,4000x |
| 11 | 2.700 | 21.725 | 1,4400x |
| 12 | 2.845 | 24.570 | 1,4800x |
| 13 | 2.990 | 27.560 | 1,5200x |
| 14 | 3.135 | 30.695 | 1,5600x |
| 15 | 3.280 | 33.975 | 1,6000x |
| 16 | 3.425 | 37.400 | 1,6400x |
| 17 | 3.570 | 40.970 | 1,6800x |
| 18 | 3.715 | 44.685 | 1,7200x |
| 19 | 3.860 | 48.545 | 1,7600x |
| 20 | 4.005 | 52.550 | 1,8000x |
| 21 | 4.150 | 56.700 | 1,8400x |
| 22 | 4.295 | 60.995 | 1,8800x |
| 23 | 4.440 | 65.435 | 1,9200x |
| 24 | 4.585 | 70.020 | 1,9600x |
| 25 | 4.730 | 74.750 | 2,0000x |
| 26 | 4.875 | 79.625 | 2,0400x |
| 27 | 5.020 | 84.645 | 2,0800x |
| 28 | 5.165 | 89.810 | 2,1200x |
| 29 | 5.310 | 95.120 | 2,1600x |
| 30 | 5.455 | 100.575 | 2,2000x |
| 31 | 5.600 | 106.175 | 2,2400x |
| 32 | 5.745 | 111.920 | 2,2800x |
| 33 | 5.890 | 117.810 | 2,3200x |
| 34 | 6.035 | 123.845 | 2,3600x |
| 35 | 6.180 | 130.025 | 2,4000x |
| 36 | 6.325 | 136.350 | 2,4400x |
| 37 | 6.470 | 142.820 | 2,4800x |
| 38 | 6.615 | 149.435 | 2,5200x |
| 39 | 6.760 | 156.195 | 2,5600x |
| 40 | 6.905 | 163.100 | 2,6000x |
| 41 | 7.050 | 170.150 | 2,6400x |
| 42 | 7.195 | 177.345 | 2,6800x |
| 43 | 7.340 | 184.685 | 2,7200x |
| 44 | 7.485 | 192.170 | 2,7600x |
| 45 | 7.630 | 199.800 | 2,8000x |
| 46 | 7.775 | 207.575 | 2,8400x |
| 47 | 7.920 | 215.495 | 2,8800x |
| 48 | 8.065 | 223.560 | 2,9200x |
| 49 | 8.210 | 231.770 | 2,9600x |
| 50 | 8.355 | 240.125 | 3,0000x |
| 51 | 8.500 | 248.625 | 3,0400x |
| 52 | 8.645 | 257.270 | 3,0800x |
| 53 | 8.790 | 266.060 | 3,1200x |
| 54 | 8.935 | 274.995 | 3,1600x |
| 55 | 9.080 | 284.075 | 3,2000x |
| 56 | 9.225 | 293.300 | 3,2400x |
| 57 | 9.370 | 302.670 | 3,2800x |
| 58 | 9.515 | 312.185 | 3,3200x |
| 59 | 9.660 | 321.845 | 3,3600x |
| 60 | 9.805 | 331.650 | 3,4000x |
| 61 | 9.950 | 341.600 | 3,4400x |
| 62 | 10.095 | 351.695 | 3,4800x |
| 63 | 10.240 | 361.935 | 3,5200x |
| 64 | 10.385 | 372.320 | 3,5600x |
| 65 | 10.530 | 382.850 | 3,6000x |
| 66 | 10.675 | 393.525 | 3,6400x |
| 67 | 10.820 | 404.345 | 3,6800x |
| 68 | 10.965 | 415.310 | 3,7200x |
| 69 | 11.110 | 426.420 | 3,7600x |
| 70 | 11.255 | 437.675 | 3,8000x |
| 71 | 11.400 | 449.075 | 3,8400x |
| 72 | 11.545 | 460.620 | 3,8800x |
| 73 | 11.690 | 472.310 | 3,9200x |
| 74 | 11.835 | 484.145 | 3,9600x |
| 75 | 11.980 | 496.125 | 4,0000x |
| 76 | 12.125 | 508.250 | 4,0400x |
| 77 | 12.270 | 520.520 | 4,0800x |
| 78 | 12.415 | 532.935 | 4,1200x |
| 79 | 12.560 | 545.495 | 4,1600x |
| 80 | 12.705 | 558.200 | 4,2000x |
| 81 | 12.850 | 571.050 | 4,2400x |
| 82 | 12.995 | 584.045 | 4,2800x |
| 83 | 13.140 | 597.185 | 4,3200x |
| 84 | 13.285 | 610.470 | 4,3600x |
| 85 | 13.430 | 623.900 | 4,4000x |
| 86 | 13.575 | 637.475 | 4,4400x |
| 87 | 13.720 | 651.195 | 4,4800x |
| 88 | 13.865 | 665.060 | 4,5200x |
| 89 | 14.010 | 679.070 | 4,5600x |
| 90 | 14.155 | 693.225 | 4,6000x |
| 91 | 14.300 | 707.525 | 4,6400x |
| 92 | 14.445 | 721.970 | 4,6800x |
| 93 | 14.590 | 736.560 | 4,7200x |
| 94 | 14.735 | 751.295 | 4,7600x |
| 95 | 14.880 | 766.175 | 4,8000x |
| 96 | 15.025 | 781.200 | 4,8400x |
| 97 | 15.170 | 796.370 | 4,8800x |
| 98 | 15.315 | 811.685 | 4,9200x |
| 99 | 15.460 | 827.145 | 4,9600x |
| 100 | 15.605 | 842.750 | 5,0000x |
| 101 | 15.750 | 858.500 | 5,0400x |
| 102 | 15.895 | 874.395 | 5,0800x |
| 103 | 16.040 | 890.435 | 5,1200x |
| 104 | 16.185 | 906.620 | 5,1600x |
| 105 | 16.330 | 922.950 | 5,2000x |
| 106 | 16.475 | 939.425 | 5,2400x |
| 107 | 16.620 | 956.045 | 5,2800x |
| 108 | 16.765 | 972.810 | 5,3200x |
| 109 | 16.910 | 989.720 | 5,3600x |
| 110 | 17.055 | 1.006.775 | 5,4000x |
| 111 | 17.200 | 1.023.975 | 5,4400x |
| 112 | 17.345 | 1.041.320 | 5,4800x |
| 113 | 17.490 | 1.058.810 | 5,5200x |
| 114 | 17.635 | 1.076.445 | 5,5600x |
| 115 | 17.780 | 1.094.225 | 5,6000x |
| 116 | 17.925 | 1.112.150 | 5,6400x |
| 117 | 18.070 | 1.130.220 | 5,6800x |
| 118 | 18.215 | 1.148.435 | 5,7200x |
| 119 | 18.360 | 1.166.795 | 5,7600x |
| 120 | 18.505 | 1.185.300 | 5,8000x |
| 121 | 18.650 | 1.203.950 | 5,8400x |
| 122 | 18.795 | 1.222.745 | 5,8800x |
| 123 | 18.940 | 1.241.685 | 5,9200x |
| 124 | 19.085 | 1.260.770 | 5,9600x |
| 125 | 19.230 | 1.280.000 | 6,0000x |
| 126 | 19.375 | 1.299.375 | 6,0400x |
| 127 | 19.520 | 1.318.895 | 6,0800x |
| 128 | 19.665 | 1.338.560 | 6,1200x |
| 129 | 19.810 | 1.358.370 | 6,1600x |
| 130 | 19.955 | 1.378.325 | 6,2000x |
| 131 | 20.100 | 1.398.425 | 6,2400x |
| 132 | 20.245 | 1.418.670 | 6,2800x |
| 133 | 20.390 | 1.439.060 | 6,3200x |
| 134 | 20.535 | 1.459.595 | 6,3600x |
| 135 | 20.680 | 1.480.275 | 6,4000x |
| 136 | 20.825 | 1.501.100 | 6,4400x |
| 137 | 20.970 | 1.522.070 | 6,4800x |
| 138 | 21.115 | 1.543.185 | 6,5200x |
| 139 | 21.260 | 1.564.445 | 6,5600x |
| 140 | 21.405 | 1.585.850 | 6,6000x |
| 141 | 21.550 | 1.607.400 | 6,6400x |
| 142 | 21.695 | 1.629.095 | 6,6800x |
| 143 | 21.840 | 1.650.935 | 6,7200x |
| 144 | 21.985 | 1.672.920 | 6,7600x |
| 145 | 22.130 | 1.695.050 | 6,8000x |
| 146 | 22.275 | 1.717.325 | 6,8400x |
| 147 | 22.420 | 1.739.745 | 6,8800x |
| 148 | 22.565 | 1.762.310 | 6,9200x |
| 149 | 22.710 | 1.785.020 | 6,9600x |
| 150 | 22.855 | 1.807.875 | 7,0000x |
| 151 | 23.000 | 1.830.875 | 7,0400x |
| 152 | 23.145 | 1.854.020 | 7,0800x |
| 153 | 23.290 | 1.877.310 | 7,1200x |
| 154 | 23.435 | 1.900.745 | 7,1600x |
| 155 | 23.580 | 1.924.325 | 7,2000x |
| 156 | 23.725 | 1.948.050 | 7,2400x |
| 157 | 23.870 | 1.971.920 | 7,2800x |
| 158 | 24.015 | 1.995.935 | 7,3200x |
| 159 | 24.160 | 2.020.095 | 7,3600x |
| 160 | 24.305 | 2.044.400 | 7,4000x |
| 161 | 24.450 | 2.068.850 | 7,4400x |
| 162 | 24.595 | 2.093.445 | 7,4800x |
| 163 | 24.740 | 2.118.185 | 7,5200x |
| 164 | 24.885 | 2.143.070 | 7,5600x |
| 165 | 25.030 | 2.168.100 | 7,6000x |
| 166 | 25.175 | 2.193.275 | 7,6400x |
| 167 | 25.320 | 2.218.595 | 7,6800x |
| 168 | 25.465 | 2.244.060 | 7,7200x |
| 169 | 25.610 | 2.269.670 | 7,7600x |
| 170 | 25.755 | 2.295.425 | 7,8000x |
| 171 | 25.900 | 2.321.325 | 7,8400x |
| 172 | 26.045 | 2.347.370 | 7,8800x |
| 173 | 26.190 | 2.373.560 | 7,9200x |
| 174 | 26.335 | 2.399.895 | 7,9600x |
| 175 | 26.480 | 2.426.375 | 8,0000x |
| 176 | 26.625 | 2.453.000 | 8,0400x |
| 177 | 26.770 | 2.479.770 | 8,0800x |
| 178 | 26.915 | 2.506.685 | 8,1200x |
| 179 | 27.060 | 2.533.745 | 8,1600x |
| 180 | 27.205 | 2.560.950 | 8,2000x |
| 181 | 27.350 | 2.588.300 | 8,2400x |
| 182 | 27.495 | 2.615.795 | 8,2800x |
| 183 | 27.640 | 2.643.435 | 8,3200x |
| 184 | 27.785 | 2.671.220 | 8,3600x |
| 185 | 27.930 | 2.699.150 | 8,4000x |
| 186 | 28.075 | 2.727.225 | 8,4400x |
| 187 | 28.220 | 2.755.445 | 8,4800x |
| 188 | 28.365 | 2.783.810 | 8,5200x |
| 189 | 28.510 | 2.812.320 | 8,5600x |
| 190 | 28.655 | 2.840.975 | 8,6000x |
| 191 | 28.800 | 2.869.775 | 8,6400x |
| 192 | 28.945 | 2.898.720 | 8,6800x |
| 193 | 29.090 | 2.927.810 | 8,7200x |
| 194 | 29.235 | 2.957.045 | 8,7600x |
| 195 | 29.380 | 2.986.425 | 8,8000x |
| 196 | 29.525 | 3.015.950 | 8,8400x |
| 197 | 29.670 | 3.045.620 | 8,8800x |
| 198 | 29.815 | 3.075.435 | 8,9200x |
| 199 | 29.960 | 3.105.395 | 8,9600x |
| 200 | 30.105 | 3.135.500 | 9,0000x |
| 201 | 30.250 | 3.165.750 | 9,0400x |
| 202 | 30.395 | 3.196.145 | 9,0800x |
| 203 | 30.540 | 3.226.685 | 9,1200x |
| 204 | 30.685 | 3.257.370 | 9,1600x |
| 205 | 30.830 | 3.288.200 | 9,2000x |
| 206 | 30.975 | 3.319.175 | 9,2400x |
| 207 | 31.120 | 3.350.295 | 9,2800x |
| 208 | 31.265 | 3.381.560 | 9,3200x |
| 209 | 31.410 | 3.412.970 | 9,3600x |
| 210 | 31.555 | 3.444.525 | 9,4000x |
| 211 | 31.700 | 3.476.225 | 9,4400x |
| 212 | 31.845 | 3.508.070 | 9,4800x |
| 213 | 31.990 | 3.540.060 | 9,5200x |
| 214 | 32.135 | 3.572.195 | 9,5600x |
| 215 | 32.280 | 3.604.475 | 9,6000x |
| 216 | 32.425 | 3.636.900 | 9,6400x |
| 217 | 32.570 | 3.669.470 | 9,6800x |
| 218 | 32.715 | 3.702.185 | 9,7200x |
| 219 | 32.860 | 3.735.045 | 9,7600x |
| 220 | 33.005 | 3.768.050 | 9,8000x |
| 221 | 33.150 | 3.801.200 | 9,8400x |
| 222 | 33.295 | 3.834.495 | 9,8800x |
| 223 | 33.440 | 3.867.935 | 9,9200x |
| 224 | 33.585 | 3.901.520 | 9,9600x |
| 225 | 33.730 | 3.935.250 | 10,0000x |
| 226 | 33.875 | 3.969.125 | 10,0400x |
| 227 | 34.020 | 4.003.145 | 10,0800x |
| 228 | 34.165 | 4.037.310 | 10,1200x |
| 229 | 34.310 | 4.071.620 | 10,1600x |
| 230 | 34.455 | 4.106.075 | 10,2000x |
| 231 | 34.600 | 4.140.675 | 10,2400x |
| 232 | 34.745 | 4.175.420 | 10,2800x |
| 233 | 34.890 | 4.210.310 | 10,3200x |
| 234 | 35.035 | 4.245.345 | 10,3600x |
| 235 | 35.180 | 4.280.525 | 10,4000x |
| 236 | 35.325 | 4.315.850 | 10,4400x |
| 237 | 35.470 | 4.351.320 | 10,4800x |
| 238 | 35.615 | 4.386.935 | 10,5200x |
| 239 | 35.760 | 4.422.695 | 10,5600x |
| 240 | 35.905 | 4.458.600 | 10,6000x |
| 241 | 36.050 | 4.494.650 | 10,6400x |
| 242 | 36.195 | 4.530.845 | 10,6800x |
| 243 | 36.340 | 4.567.185 | 10,7200x |
| 244 | 36.485 | 4.603.670 | 10,7600x |
| 245 | 36.630 | 4.640.300 | 10,8000x |
| 246 | 36.775 | 4.677.075 | 10,8400x |
| 247 | 36.920 | 4.713.995 | 10,8800x |
| 248 | 37.065 | 4.751.060 | 10,9200x |
| 249 | 37.210 | 4.788.270 | 10,9600x |
| 250 | 37.355 | 4.825.625 | 11,0000x |
| 251 | 37.500 | 4.863.125 | 11,0400x |
| 252 | 37.645 | 4.900.770 | 11,0800x |
| 253 | 37.790 | 4.938.560 | 11,1200x |
| 254 | 37.935 | 4.976.495 | 11,1600x |
| 255 | 38.080 | 5.014.575 | 11,2000x |
| 256 | 38.225 | 5.052.800 | 11,2400x |
| 257 | 38.370 | 5.091.170 | 11,2800x |
| 258 | 38.515 | 5.129.685 | 11,3200x |
| 259 | 38.660 | 5.168.345 | 11,3600x |
| 260 | 38.805 | 5.207.150 | 11,4000x |
| 261 | 38.950 | 5.246.100 | 11,4400x |
| 262 | 39.095 | 5.285.195 | 11,4800x |
| 263 | 39.240 | 5.324.435 | 11,5200x |
| 264 | 39.385 | 5.363.820 | 11,5600x |
| 265 | 39.530 | 5.403.350 | 11,6000x |
| 266 | 39.675 | 5.443.025 | 11,6400x |
| 267 | 39.820 | 5.482.845 | 11,6800x |
| 268 | 39.965 | 5.522.810 | 11,7200x |
| 269 | 40.110 | 5.562.920 | 11,7600x |
| 270 | 40.255 | 5.603.175 | 11,8000x |
| 271 | 40.400 | 5.643.575 | 11,8400x |
| 272 | 40.545 | 5.684.120 | 11,8800x |
| 273 | 40.690 | 5.724.810 | 11,9200x |
| 274 | 40.835 | 5.765.645 | 11,9600x |
| 275 | 40.980 | 5.806.625 | 12,0000x |
| 276 | 41.125 | 5.847.750 | 12,0400x |
| 277 | 41.270 | 5.889.020 | 12,0800x |
| 278 | 41.415 | 5.930.435 | 12,1200x |
| 279 | 41.560 | 5.971.995 | 12,1600x |
| 280 | 41.705 | 6.013.700 | 12,2000x |
| 281 | 41.850 | 6.055.550 | 12,2400x |
| 282 | 41.995 | 6.097.545 | 12,2800x |
| 283 | 42.140 | 6.139.685 | 12,3200x |
| 284 | 42.285 | 6.181.970 | 12,3600x |
| 285 | 42.430 | 6.224.400 | 12,4000x |
| 286 | 42.575 | 6.266.975 | 12,4400x |
| 287 | 42.720 | 6.309.695 | 12,4800x |
| 288 | 42.865 | 6.352.560 | 12,5200x |
| 289 | 43.010 | 6.395.570 | 12,5600x |
| 290 | 43.155 | 6.438.725 | 12,6000x |
| 291 | 43.300 | 6.482.025 | 12,6400x |
| 292 | 43.445 | 6.525.470 | 12,6800x |
| 293 | 43.590 | 6.569.060 | 12,7200x |
| 294 | 43.735 | 6.612.795 | 12,7600x |
| 295 | 43.880 | 6.656.675 | 12,8000x |
| 296 | 44.025 | 6.700.700 | 12,8400x |
| 297 | 44.170 | 6.744.870 | 12,8800x |
| 298 | 44.315 | 6.789.185 | 12,9200x |
| 299 | 44.460 | 6.833.645 | 12,9600x |
| 300 | 44.605 | 6.878.250 | 13,0000x |
| 301 | 44.750 | 6.923.000 | 13,0400x |
| 302 | 44.895 | 6.967.895 | 13,0800x |
| 303 | 45.040 | 7.012.935 | 13,1200x |
| 304 | 45.185 | 7.058.120 | 13,1600x |
| 305 | 45.330 | 7.103.450 | 13,2000x |
| 306 | 45.475 | 7.148.925 | 13,2400x |
| 307 | 45.620 | 7.194.545 | 13,2800x |
| 308 | 45.765 | 7.240.310 | 13,3200x |
| 309 | 45.910 | 7.286.220 | 13,3600x |
| 310 | 46.055 | 7.332.275 | 13,4000x |
| 311 | 46.200 | 7.378.475 | 13,4400x |
| 312 | 46.345 | 7.424.820 | 13,4800x |
| 313 | 46.490 | 7.471.310 | 13,5200x |
| 314 | 46.635 | 7.517.945 | 13,5600x |
| 315 | 46.780 | 7.564.725 | 13,6000x |
| 316 | 46.925 | 7.611.650 | 13,6400x |
| 317 | 47.070 | 7.658.720 | 13,6800x |
| 318 | 47.215 | 7.705.935 | 13,7200x |
| 319 | 47.360 | 7.753.295 | 13,7600x |
| 320 | 47.505 | 7.800.800 | 13,8000x |
| 321 | 47.650 | 7.848.450 | 13,8400x |
| 322 | 47.795 | 7.896.245 | 13,8800x |
| 323 | 47.940 | 7.944.185 | 13,9200x |
| 324 | 48.085 | 7.992.270 | 13,9600x |
| 325 | 48.230 | 8.040.500 | 14,0000x |
| 326 | 48.375 | 8.088.875 | 14,0400x |
| 327 | 48.520 | 8.137.395 | 14,0800x |
| 328 | 48.665 | 8.186.060 | 14,1200x |
| 329 | 48.810 | 8.234.870 | 14,1600x |
| 330 | 48.955 | 8.283.825 | 14,2000x |
| 331 | 49.100 | 8.332.925 | 14,2400x |
| 332 | 49.245 | 8.382.170 | 14,2800x |
| 333 | 49.390 | 8.431.560 | 14,3200x |
| 334 | 49.535 | 8.481.095 | 14,3600x |
| 335 | 49.680 | 8.530.775 | 14,4000x |
| 336 | 49.825 | 8.580.600 | 14,4400x |
| 337 | 49.970 | 8.630.570 | 14,4800x |
| 338 | 50.115 | 8.680.685 | 14,5200x |
| 339 | 50.260 | 8.730.945 | 14,5600x |
| 340 | 50.405 | 8.781.350 | 14,6000x |
| 341 | 50.550 | 8.831.900 | 14,6400x |
| 342 | 50.695 | 8.882.595 | 14,6800x |
| 343 | 50.840 | 8.933.435 | 14,7200x |
| 344 | 50.985 | 8.984.420 | 14,7600x |
| 345 | 51.130 | 9.035.550 | 14,8000x |
| 346 | 51.275 | 9.086.825 | 14,8400x |
| 347 | 51.420 | 9.138.245 | 14,8800x |
| 348 | 51.565 | 9.189.810 | 14,9200x |
| 349 | 51.710 | 9.241.520 | 14,9600x |
| 350 | 51.855 | 9.293.375 | 15,0000x |
| 351 | 52.000 | 9.345.375 | 15,0400x |
| 352 | 52.145 | 9.397.520 | 15,0800x |
| 353 | 52.290 | 9.449.810 | 15,1200x |
| 354 | 52.435 | 9.502.245 | 15,1600x |
| 355 | 52.580 | 9.554.825 | 15,2000x |
| 356 | 52.725 | 9.607.550 | 15,2400x |
| 357 | 52.870 | 9.660.420 | 15,2800x |
| 358 | 53.015 | 9.713.435 | 15,3200x |
| 359 | 53.160 | 9.766.595 | 15,3600x |
| 360 | 53.305 | 9.819.900 | 15,4000x |
| 361 | 53.450 | 9.873.350 | 15,4400x |
| 362 | 53.595 | 9.926.945 | 15,4800x |
| 363 | 53.740 | 9.980.685 | 15,5200x |
| 364 | 53.885 | 10.034.570 | 15,5600x |
| 365 | 54.030 | 10.088.600 | 15,6000x |
| 366 | 54.175 | 10.142.775 | 15,6400x |
| 367 | 54.320 | 10.197.095 | 15,6800x |
| 368 | 54.465 | 10.251.560 | 15,7200x |
| 369 | 54.610 | 10.306.170 | 15,7600x |
| 370 | 54.755 | 10.360.925 | 15,8000x |
| 371 | 54.900 | 10.415.825 | 15,8400x |
| 372 | 55.045 | 10.470.870 | 15,8800x |
| 373 | 55.190 | 10.526.060 | 15,9200x |
| 374 | 55.335 | 10.581.395 | 15,9600x |
| 375 | 55.480 | 10.636.875 | 16,0000x |
| 376 | 55.625 | 10.692.500 | 16,0400x |
| 377 | 55.770 | 10.748.270 | 16,0800x |
| 378 | 55.915 | 10.804.185 | 16,1200x |
| 379 | 56.060 | 10.860.245 | 16,1600x |
| 380 | 56.205 | 10.916.450 | 16,2000x |
| 381 | 56.350 | 10.972.800 | 16,2400x |
| 382 | 56.495 | 11.029.295 | 16,2800x |
| 383 | 56.640 | 11.085.935 | 16,3200x |
| 384 | 56.785 | 11.142.720 | 16,3600x |
| 385 | 56.930 | 11.199.650 | 16,4000x |
| 386 | 57.075 | 11.256.725 | 16,4400x |
| 387 | 57.220 | 11.313.945 | 16,4800x |
| 388 | 57.365 | 11.371.310 | 16,5200x |
| 389 | 57.510 | 11.428.820 | 16,5600x |
| 390 | 57.655 | 11.486.475 | 16,6000x |
| 391 | 57.800 | 11.544.275 | 16,6400x |
| 392 | 57.945 | 11.602.220 | 16,6800x |
| 393 | 58.090 | 11.660.310 | 16,7200x |
| 394 | 58.235 | 11.718.545 | 16,7600x |
| 395 | 58.380 | 11.776.925 | 16,8000x |
| 396 | 58.525 | 11.835.450 | 16,8400x |
| 397 | 58.670 | 11.894.120 | 16,8800x |
| 398 | 58.815 | 11.952.935 | 16,9200x |
| 399 | 58.960 | 12.011.895 | 16,9600x |
| 400 | 59.105 | 12.071.000 | 17,0000x |
| 401 | 59.250 | 12.130.250 | 17,0400x |
| 402 | 59.395 | 12.189.645 | 17,0800x |
| 403 | 59.540 | 12.249.185 | 17,1200x |
| 404 | 59.685 | 12.308.870 | 17,1600x |
| 405 | 59.830 | 12.368.700 | 17,2000x |
| 406 | 59.975 | 12.428.675 | 17,2400x |
| 407 | 60.120 | 12.488.795 | 17,2800x |
| 408 | 60.265 | 12.549.060 | 17,3200x |
| 409 | 60.410 | 12.609.470 | 17,3600x |
| 410 | 60.555 | 12.670.025 | 17,4000x |
| 411 | 60.700 | 12.730.725 | 17,4400x |
| 412 | 60.845 | 12.791.570 | 17,4800x |
| 413 | 60.990 | 12.852.560 | 17,5200x |
| 414 | 61.135 | 12.913.695 | 17,5600x |
| 415 | 61.280 | 12.974.975 | 17,6000x |
| 416 | 61.425 | 13.036.400 | 17,6400x |
| 417 | 61.570 | 13.097.970 | 17,6800x |
| 418 | 61.715 | 13.159.685 | 17,7200x |
| 419 | 61.860 | 13.221.545 | 17,7600x |
| 420 | 62.005 | 13.283.550 | 17,8000x |
| 421 | 62.150 | 13.345.700 | 17,8400x |
| 422 | 62.295 | 13.407.995 | 17,8800x |
| 423 | 62.440 | 13.470.435 | 17,9200x |
| 424 | 62.585 | 13.533.020 | 17,9600x |
| 425 | 62.730 | 13.595.750 | 18,0000x |
| 426 | 62.875 | 13.658.625 | 18,0400x |
| 427 | 63.020 | 13.721.645 | 18,0800x |
| 428 | 63.165 | 13.784.810 | 18,1200x |
| 429 | 63.310 | 13.848.120 | 18,1600x |
| 430 | 63.455 | 13.911.575 | 18,2000x |
| 431 | 63.600 | 13.975.175 | 18,2400x |
| 432 | 63.745 | 14.038.920 | 18,2800x |
| 433 | 63.890 | 14.102.810 | 18,3200x |
| 434 | 64.035 | 14.166.845 | 18,3600x |
| 435 | 64.180 | 14.231.025 | 18,4000x |
| 436 | 64.325 | 14.295.350 | 18,4400x |
| 437 | 64.470 | 14.359.820 | 18,4800x |
| 438 | 64.615 | 14.424.435 | 18,5200x |
| 439 | 64.760 | 14.489.195 | 18,5600x |
| 440 | 64.905 | 14.554.100 | 18,6000x |
| 441 | 65.050 | 14.619.150 | 18,6400x |
| 442 | 65.195 | 14.684.345 | 18,6800x |
| 443 | 65.340 | 14.749.685 | 18,7200x |
| 444 | 65.485 | 14.815.170 | 18,7600x |
| 445 | 65.630 | 14.880.800 | 18,8000x |
| 446 | 65.775 | 14.946.575 | 18,8400x |
| 447 | 65.920 | 15.012.495 | 18,8800x |
| 448 | 66.065 | 15.078.560 | 18,9200x |
| 449 | 66.210 | 15.144.770 | 18,9600x |
| 450 | 66.355 | 15.211.125 | 19,0000x |
| 451 | 66.500 | 15.277.625 | 19,0400x |
| 452 | 66.645 | 15.344.270 | 19,0800x |
| 453 | 66.790 | 15.411.060 | 19,1200x |
| 454 | 66.935 | 15.477.995 | 19,1600x |
| 455 | 67.080 | 15.545.075 | 19,2000x |
| 456 | 67.225 | 15.612.300 | 19,2400x |
| 457 | 67.370 | 15.679.670 | 19,2800x |
| 458 | 67.515 | 15.747.185 | 19,3200x |
| 459 | 67.660 | 15.814.845 | 19,3600x |
| 460 | 67.805 | 15.882.650 | 19,4000x |
| 461 | 67.950 | 15.950.600 | 19,4400x |
| 462 | 68.095 | 16.018.695 | 19,4800x |
| 463 | 68.240 | 16.086.935 | 19,5200x |
| 464 | 68.385 | 16.155.320 | 19,5600x |
| 465 | 68.530 | 16.223.850 | 19,6000x |
| 466 | 68.675 | 16.292.525 | 19,6400x |
| 467 | 68.820 | 16.361.345 | 19,6800x |
| 468 | 68.965 | 16.430.310 | 19,7200x |
| 469 | 69.110 | 16.499.420 | 19,7600x |
| 470 | 69.255 | 16.568.675 | 19,8000x |
| 471 | 69.400 | 16.638.075 | 19,8400x |
| 472 | 69.545 | 16.707.620 | 19,8800x |
| 473 | 69.690 | 16.777.310 | 19,9200x |
| 474 | 69.835 | 16.847.145 | 19,9600x |
| 475 | 69.980 | 16.917.125 | 20,0000x |
| 476 | 70.125 | 16.987.250 | 20,0400x |
| 477 | 70.270 | 17.057.520 | 20,0800x |
| 478 | 70.415 | 17.127.935 | 20,1200x |
| 479 | 70.560 | 17.198.495 | 20,1600x |
| 480 | 70.705 | 17.269.200 | 20,2000x |
| 481 | 70.850 | 17.340.050 | 20,2400x |
| 482 | 70.995 | 17.411.045 | 20,2800x |
| 483 | 71.140 | 17.482.185 | 20,3200x |
| 484 | 71.285 | 17.553.470 | 20,3600x |
| 485 | 71.430 | 17.624.900 | 20,4000x |
| 486 | 71.575 | 17.696.475 | 20,4400x |
| 487 | 71.720 | 17.768.195 | 20,4800x |
| 488 | 71.865 | 17.840.060 | 20,5200x |
| 489 | 72.010 | 17.912.070 | 20,5600x |
| 490 | 72.155 | 17.984.225 | 20,6000x |
| 491 | 72.300 | 18.056.525 | 20,6400x |
| 492 | 72.445 | 18.128.970 | 20,6800x |
| 493 | 72.590 | 18.201.560 | 20,7200x |
| 494 | 72.735 | 18.274.295 | 20,7600x |
| 495 | 72.880 | 18.347.175 | 20,8000x |
| 496 | 73.025 | 18.420.200 | 20,8400x |
| 497 | 73.170 | 18.493.370 | 20,8800x |
| 498 | 73.315 | 18.566.685 | 20,9200x |
| 499 | 73.460 | 18.640.145 | 20,9600x |
| 500 | 73.605 | 18.713.750 | 21,0000x |

### Anexo — Agilidade

| Nível | Custo do nível | Custo acumulado | Efeito |
|---:|---:|---:|---|
| 1 | 3.000 | 3.000 | Speed I |
| 2 | 10.000 | 13.000 | Speed II |

### Anexo — Trevo

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.000 | 1.000 | 0,1000% | 0,1% |
| 2 | 1.018,75 | 2.018,75 | 0,1038% | 0,1038% |
| 3 | 1.037,5 | 3.056,25 | 0,1076% | 0,1076% |
| 4 | 1.056,25 | 4.112,5 | 0,1114% | 0,1114% |
| 5 | 1.075 | 5.187,5 | 0,1152% | 0,1152% |
| 6 | 1.093,75 | 6.281,25 | 0,1190% | 0,119% |
| 7 | 1.112,5 | 7.393,75 | 0,1228% | 0,1228% |
| 8 | 1.131,25 | 8.525 | 0,1267% | 0,1267% |
| 9 | 1.150 | 9.675 | 0,1305% | 0,1305% |
| 10 | 1.168,75 | 10.843,75 | 0,1343% | 0,1343% |
| 11 | 1.187,5 | 12.031,25 | 0,1381% | 0,1381% |
| 12 | 1.206,25 | 13.237,5 | 0,1419% | 0,1419% |
| 13 | 1.225 | 14.462,5 | 0,1457% | 0,1457% |
| 14 | 1.243,75 | 15.706,25 | 0,1495% | 0,1495% |
| 15 | 1.262,5 | 16.968,75 | 0,1533% | 0,1533% |
| 16 | 1.281,25 | 18.250 | 0,1571% | 0,1571% |
| 17 | 1.300 | 19.550 | 0,1609% | 0,1609% |
| 18 | 1.318,75 | 20.868,75 | 0,1647% | 0,1647% |
| 19 | 1.337,5 | 22.206,25 | 0,1685% | 0,1685% |
| 20 | 1.356,25 | 23.562,5 | 0,1723% | 0,1723% |
| 21 | 1.375 | 24.937,5 | 0,1762% | 0,1762% |
| 22 | 1.393,75 | 26.331,25 | 0,1800% | 0,18% |
| 23 | 1.412,5 | 27.743,75 | 0,1838% | 0,1838% |
| 24 | 1.431,25 | 29.175 | 0,1876% | 0,1876% |
| 25 | 1.450 | 30.625 | 0,1914% | 0,1914% |
| 26 | 1.468,75 | 32.093,75 | 0,1952% | 0,1952% |
| 27 | 1.487,5 | 33.581,25 | 0,1990% | 0,199% |
| 28 | 1.506,25 | 35.087,5 | 0,2028% | 0,2028% |
| 29 | 1.525 | 36.612,5 | 0,2066% | 0,2066% |
| 30 | 1.543,75 | 38.156,25 | 0,2104% | 0,2104% |
| 31 | 1.562,5 | 39.718,75 | 0,2142% | 0,2142% |
| 32 | 1.581,25 | 41.300 | 0,2180% | 0,218% |
| 33 | 1.600 | 42.900 | 0,2218% | 0,2218% |
| 34 | 1.618,75 | 44.518,75 | 0,2257% | 0,2257% |
| 35 | 1.637,5 | 46.156,25 | 0,2295% | 0,2295% |
| 36 | 1.656,25 | 47.812,5 | 0,2333% | 0,2333% |
| 37 | 1.675 | 49.487,5 | 0,2371% | 0,2371% |
| 38 | 1.693,75 | 51.181,25 | 0,2409% | 0,2409% |
| 39 | 1.712,5 | 52.893,75 | 0,2447% | 0,2447% |
| 40 | 1.731,25 | 54.625 | 0,2485% | 0,2485% |
| 41 | 1.750 | 56.375 | 0,2523% | 0,2523% |
| 42 | 1.768,75 | 58.143,75 | 0,2561% | 0,2561% |
| 43 | 1.787,5 | 59.931,25 | 0,2599% | 0,2599% |
| 44 | 1.806,25 | 61.737,5 | 0,2637% | 0,2637% |
| 45 | 1.825 | 63.562,5 | 0,2675% | 0,2675% |
| 46 | 1.843,75 | 65.406,25 | 0,2713% | 0,2713% |
| 47 | 1.862,5 | 67.268,75 | 0,2751% | 0,2751% |
| 48 | 1.881,25 | 69.150 | 0,2790% | 0,279% |
| 49 | 1.900 | 71.050 | 0,2828% | 0,2828% |
| 50 | 1.918,75 | 72.968,75 | 0,2866% | 0,2866% |
| 51 | 1.937,5 | 74.906,25 | 0,2904% | 0,2904% |
| 52 | 1.956,25 | 76.862,5 | 0,2942% | 0,2942% |
| 53 | 1.975 | 78.837,5 | 0,2980% | 0,298% |
| 54 | 1.993,75 | 80.831,25 | 0,3018% | 0,3018% |
| 55 | 2.012,5 | 82.843,75 | 0,3056% | 0,3056% |
| 56 | 2.031,25 | 84.875 | 0,3094% | 0,3094% |
| 57 | 2.050 | 86.925 | 0,3132% | 0,3132% |
| 58 | 2.068,75 | 88.993,75 | 0,3170% | 0,317% |
| 59 | 2.087,5 | 91.081,25 | 0,3208% | 0,3208% |
| 60 | 2.106,25 | 93.187,5 | 0,3246% | 0,3246% |
| 61 | 2.125 | 95.312,5 | 0,3285% | 0,3285% |
| 62 | 2.143,75 | 97.456,25 | 0,3323% | 0,3323% |
| 63 | 2.162,5 | 99.618,75 | 0,3361% | 0,3361% |
| 64 | 2.181,25 | 101.800 | 0,3399% | 0,3399% |
| 65 | 2.200 | 104.000 | 0,3437% | 0,3437% |
| 66 | 2.218,75 | 106.218,75 | 0,3475% | 0,3475% |
| 67 | 2.237,5 | 108.456,25 | 0,3513% | 0,3513% |
| 68 | 2.256,25 | 110.712,5 | 0,3551% | 0,3551% |
| 69 | 2.275 | 112.987,5 | 0,3589% | 0,3589% |
| 70 | 2.293,75 | 115.281,25 | 0,3627% | 0,3627% |
| 71 | 2.312,5 | 117.593,75 | 0,3665% | 0,3665% |
| 72 | 2.331,25 | 119.925 | 0,3703% | 0,3703% |
| 73 | 2.350 | 122.275 | 0,3741% | 0,3741% |
| 74 | 2.368,75 | 124.643,75 | 0,3780% | 0,378% |
| 75 | 2.387,5 | 127.031,25 | 0,3818% | 0,3818% |
| 76 | 2.406,25 | 129.437,5 | 0,3856% | 0,3856% |
| 77 | 2.425 | 131.862,5 | 0,3894% | 0,3894% |
| 78 | 2.443,75 | 134.306,25 | 0,3932% | 0,3932% |
| 79 | 2.462,5 | 136.768,75 | 0,3970% | 0,397% |
| 80 | 2.481,25 | 139.250 | 0,4008% | 0,4008% |
| 81 | 2.500 | 141.750 | 0,4046% | 0,4046% |
| 82 | 2.518,75 | 144.268,75 | 0,4084% | 0,4084% |
| 83 | 2.537,5 | 146.806,25 | 0,4122% | 0,4122% |
| 84 | 2.556,25 | 149.362,5 | 0,4160% | 0,416% |
| 85 | 2.575 | 151.937,5 | 0,4198% | 0,4198% |
| 86 | 2.593,75 | 154.531,25 | 0,4236% | 0,4236% |
| 87 | 2.612,5 | 157.143,75 | 0,4275% | 0,4275% |
| 88 | 2.631,25 | 159.775 | 0,4313% | 0,4313% |
| 89 | 2.650 | 162.425 | 0,4351% | 0,4351% |
| 90 | 2.668,75 | 165.093,75 | 0,4389% | 0,4389% |
| 91 | 2.687,5 | 167.781,25 | 0,4427% | 0,4427% |
| 92 | 2.706,25 | 170.487,5 | 0,4465% | 0,4465% |
| 93 | 2.725 | 173.212,5 | 0,4503% | 0,4503% |
| 94 | 2.743,75 | 175.956,25 | 0,4541% | 0,4541% |
| 95 | 2.762,5 | 178.718,75 | 0,4579% | 0,4579% |
| 96 | 2.781,25 | 181.500 | 0,4617% | 0,4617% |
| 97 | 2.800 | 184.300 | 0,4655% | 0,4655% |
| 98 | 2.818,75 | 187.118,75 | 0,4693% | 0,4693% |
| 99 | 2.837,5 | 189.956,25 | 0,4731% | 0,4731% |
| 100 | 2.856,25 | 192.812,5 | 0,4770% | 0,477% |
| 101 | 2.875 | 195.687,5 | 0,4808% | 0,4808% |
| 102 | 2.893,75 | 198.581,25 | 0,4846% | 0,4846% |
| 103 | 2.912,5 | 201.493,75 | 0,4884% | 0,4884% |
| 104 | 2.931,25 | 204.425 | 0,4922% | 0,4922% |
| 105 | 2.950 | 207.375 | 0,4960% | 0,496% |
| 106 | 2.968,75 | 210.343,75 | 0,4998% | 0,4998% |
| 107 | 2.987,5 | 213.331,25 | 0,5036% | 0,5036% |
| 108 | 3.006,25 | 216.337,5 | 0,5074% | 0,5074% |
| 109 | 3.025 | 219.362,5 | 0,5112% | 0,5112% |
| 110 | 3.043,75 | 222.406,25 | 0,5150% | 0,515% |
| 111 | 3.062,5 | 225.468,75 | 0,5188% | 0,5188% |
| 112 | 3.081,25 | 228.550 | 0,5226% | 0,5226% |
| 113 | 3.100 | 231.650 | 0,5265% | 0,5265% |
| 114 | 3.118,75 | 234.768,75 | 0,5303% | 0,5303% |
| 115 | 3.137,5 | 237.906,25 | 0,5341% | 0,5341% |
| 116 | 3.156,25 | 241.062,5 | 0,5379% | 0,5379% |
| 117 | 3.175 | 244.237,5 | 0,5417% | 0,5417% |
| 118 | 3.193,75 | 247.431,25 | 0,5455% | 0,5455% |
| 119 | 3.212,5 | 250.643,75 | 0,5493% | 0,5493% |
| 120 | 3.231,25 | 253.875 | 0,5531% | 0,5531% |
| 121 | 3.250 | 257.125 | 0,5569% | 0,5569% |
| 122 | 3.268,75 | 260.393,75 | 0,5607% | 0,5607% |
| 123 | 3.287,5 | 263.681,25 | 0,5645% | 0,5645% |
| 124 | 3.306,25 | 266.987,5 | 0,5683% | 0,5683% |
| 125 | 3.325 | 270.312,5 | 0,5721% | 0,5721% |
| 126 | 3.343,75 | 273.656,25 | 0,5759% | 0,576% |
| 127 | 3.362,5 | 277.018,75 | 0,5798% | 0,5798% |
| 128 | 3.381,25 | 280.400 | 0,5836% | 0,5836% |
| 129 | 3.400 | 283.800 | 0,5874% | 0,5874% |
| 130 | 3.418,75 | 287.218,75 | 0,5912% | 0,5912% |
| 131 | 3.437,5 | 290.656,25 | 0,5950% | 0,595% |
| 132 | 3.456,25 | 294.112,5 | 0,5988% | 0,5988% |
| 133 | 3.475 | 297.587,5 | 0,6026% | 0,6026% |
| 134 | 3.493,75 | 301.081,25 | 0,6064% | 0,6064% |
| 135 | 3.512,5 | 304.593,75 | 0,6102% | 0,6102% |
| 136 | 3.531,25 | 308.125 | 0,6140% | 0,614% |
| 137 | 3.550 | 311.675 | 0,6178% | 0,6178% |
| 138 | 3.568,75 | 315.243,75 | 0,6216% | 0,6216% |
| 139 | 3.587,5 | 318.831,25 | 0,6254% | 0,6254% |
| 140 | 3.606,25 | 322.437,5 | 0,6293% | 0,6293% |
| 141 | 3.625 | 326.062,5 | 0,6331% | 0,6331% |
| 142 | 3.643,75 | 329.706,25 | 0,6369% | 0,6369% |
| 143 | 3.662,5 | 333.368,75 | 0,6407% | 0,6407% |
| 144 | 3.681,25 | 337.050 | 0,6445% | 0,6445% |
| 145 | 3.700 | 340.750 | 0,6483% | 0,6483% |
| 146 | 3.718,75 | 344.468,75 | 0,6521% | 0,6521% |
| 147 | 3.737,5 | 348.206,25 | 0,6559% | 0,6559% |
| 148 | 3.756,25 | 351.962,5 | 0,6597% | 0,6597% |
| 149 | 3.775 | 355.737,5 | 0,6635% | 0,6635% |
| 150 | 3.793,75 | 359.531,25 | 0,6673% | 0,6673% |
| 151 | 3.812,5 | 363.343,75 | 0,6711% | 0,6711% |
| 152 | 3.831,25 | 367.175 | 0,6749% | 0,6749% |
| 153 | 3.850 | 371.025 | 0,6788% | 0,6788% |
| 154 | 3.868,75 | 374.893,75 | 0,6826% | 0,6826% |
| 155 | 3.887,5 | 378.781,25 | 0,6864% | 0,6864% |
| 156 | 3.906,25 | 382.687,5 | 0,6902% | 0,6902% |
| 157 | 3.925 | 386.612,5 | 0,6940% | 0,694% |
| 158 | 3.943,75 | 390.556,25 | 0,6978% | 0,6978% |
| 159 | 3.962,5 | 394.518,75 | 0,7016% | 0,7016% |
| 160 | 3.981,25 | 398.500 | 0,7054% | 0,7054% |
| 161 | 4.000 | 402.500 | 0,7092% | 0,7092% |
| 162 | 4.018,75 | 406.518,75 | 0,7130% | 0,713% |
| 163 | 4.037,5 | 410.556,25 | 0,7168% | 0,7168% |
| 164 | 4.056,25 | 414.612,5 | 0,7206% | 0,7206% |
| 165 | 4.075 | 418.687,5 | 0,7244% | 0,7244% |
| 166 | 4.093,75 | 422.781,25 | 0,7283% | 0,7283% |
| 167 | 4.112,5 | 426.893,75 | 0,7321% | 0,7321% |
| 168 | 4.131,25 | 431.025 | 0,7359% | 0,7359% |
| 169 | 4.150 | 435.175 | 0,7397% | 0,7397% |
| 170 | 4.168,75 | 439.343,75 | 0,7435% | 0,7435% |
| 171 | 4.187,5 | 443.531,25 | 0,7473% | 0,7473% |
| 172 | 4.206,25 | 447.737,5 | 0,7511% | 0,7511% |
| 173 | 4.225 | 451.962,5 | 0,7549% | 0,7549% |
| 174 | 4.243,75 | 456.206,25 | 0,7587% | 0,7587% |
| 175 | 4.262,5 | 460.468,75 | 0,7625% | 0,7625% |
| 176 | 4.281,25 | 464.750 | 0,7663% | 0,7663% |
| 177 | 4.300 | 469.050 | 0,7701% | 0,7701% |
| 178 | 4.318,75 | 473.368,75 | 0,7739% | 0,7739% |
| 179 | 4.337,5 | 477.706,25 | 0,7778% | 0,7778% |
| 180 | 4.356,25 | 482.062,5 | 0,7816% | 0,7816% |
| 181 | 4.375 | 486.437,5 | 0,7854% | 0,7854% |
| 182 | 4.393,75 | 490.831,25 | 0,7892% | 0,7892% |
| 183 | 4.412,5 | 495.243,75 | 0,7930% | 0,793% |
| 184 | 4.431,25 | 499.675 | 0,7968% | 0,7968% |
| 185 | 4.450 | 504.125 | 0,8006% | 0,8006% |
| 186 | 4.468,75 | 508.593,75 | 0,8044% | 0,8044% |
| 187 | 4.487,5 | 513.081,25 | 0,8082% | 0,8082% |
| 188 | 4.506,25 | 517.587,5 | 0,8120% | 0,812% |
| 189 | 4.525 | 522.112,5 | 0,8158% | 0,8158% |
| 190 | 4.543,75 | 526.656,25 | 0,8196% | 0,8196% |
| 191 | 4.562,5 | 531.218,75 | 0,8234% | 0,8234% |
| 192 | 4.581,25 | 535.800 | 0,8273% | 0,8273% |
| 193 | 4.600 | 540.400 | 0,8311% | 0,8311% |
| 194 | 4.618,75 | 545.018,75 | 0,8349% | 0,8349% |
| 195 | 4.637,5 | 549.656,25 | 0,8387% | 0,8387% |
| 196 | 4.656,25 | 554.312,5 | 0,8425% | 0,8425% |
| 197 | 4.675 | 558.987,5 | 0,8463% | 0,8463% |
| 198 | 4.693,75 | 563.681,25 | 0,8501% | 0,8501% |
| 199 | 4.712,5 | 568.393,75 | 0,8539% | 0,8539% |
| 200 | 4.731,25 | 573.125 | 0,8577% | 0,8577% |
| 201 | 4.750 | 577.875 | 0,8615% | 0,8615% |
| 202 | 4.768,75 | 582.643,75 | 0,8653% | 0,8653% |
| 203 | 4.787,5 | 587.431,25 | 0,8691% | 0,8691% |
| 204 | 4.806,25 | 592.237,5 | 0,8729% | 0,8729% |
| 205 | 4.825 | 597.062,5 | 0,8768% | 0,8768% |
| 206 | 4.843,75 | 601.906,25 | 0,8806% | 0,8806% |
| 207 | 4.862,5 | 606.768,75 | 0,8844% | 0,8844% |
| 208 | 4.881,25 | 611.650 | 0,8882% | 0,8882% |
| 209 | 4.900 | 616.550 | 0,8920% | 0,892% |
| 210 | 4.918,75 | 621.468,75 | 0,8958% | 0,8958% |
| 211 | 4.937,5 | 626.406,25 | 0,8996% | 0,8996% |
| 212 | 4.956,25 | 631.362,5 | 0,9034% | 0,9034% |
| 213 | 4.975 | 636.337,5 | 0,9072% | 0,9072% |
| 214 | 4.993,75 | 641.331,25 | 0,9110% | 0,911% |
| 215 | 5.012,5 | 646.343,75 | 0,9148% | 0,9148% |
| 216 | 5.031,25 | 651.375 | 0,9186% | 0,9186% |
| 217 | 5.050 | 656.425 | 0,9224% | 0,9224% |
| 218 | 5.068,75 | 661.493,75 | 0,9262% | 0,9262% |
| 219 | 5.087,5 | 666.581,25 | 0,9301% | 0,9301% |
| 220 | 5.106,25 | 671.687,5 | 0,9339% | 0,9339% |
| 221 | 5.125 | 676.812,5 | 0,9377% | 0,9377% |
| 222 | 5.143,75 | 681.956,25 | 0,9415% | 0,9415% |
| 223 | 5.162,5 | 687.118,75 | 0,9453% | 0,9453% |
| 224 | 5.181,25 | 692.300 | 0,9491% | 0,9491% |
| 225 | 5.200 | 697.500 | 0,9529% | 0,9529% |
| 226 | 5.218,75 | 702.718,75 | 0,9567% | 0,9567% |
| 227 | 5.237,5 | 707.956,25 | 0,9605% | 0,9605% |
| 228 | 5.256,25 | 713.212,5 | 0,9643% | 0,9643% |
| 229 | 5.275 | 718.487,5 | 0,9681% | 0,9681% |
| 230 | 5.293,75 | 723.781,25 | 0,9719% | 0,9719% |
| 231 | 5.312,5 | 729.093,75 | 0,9757% | 0,9757% |
| 232 | 5.331,25 | 734.425 | 0,9796% | 0,9796% |
| 233 | 5.350 | 739.775 | 0,9834% | 0,9834% |
| 234 | 5.368,75 | 745.143,75 | 0,9872% | 0,9872% |
| 235 | 5.387,5 | 750.531,25 | 0,9910% | 0,991% |
| 236 | 5.406,25 | 755.937,5 | 0,9948% | 0,9948% |
| 237 | 5.425 | 761.362,5 | 0,9986% | 0,9986% |
| 238 | 5.443,75 | 766.806,25 | 1,0024% | 1,002% |
| 239 | 5.462,5 | 772.268,75 | 1,0062% | 1,006% |
| 240 | 5.481,25 | 777.750 | 1,0100% | 1,01% |
| 241 | 5.500 | 783.250 | 1,0138% | 1,014% |
| 242 | 5.518,75 | 788.768,75 | 1,0176% | 1,018% |
| 243 | 5.537,5 | 794.306,25 | 1,0214% | 1,021% |
| 244 | 5.556,25 | 799.862,5 | 1,0252% | 1,025% |
| 245 | 5.575 | 805.437,5 | 1,0291% | 1,029% |
| 246 | 5.593,75 | 811.031,25 | 1,0329% | 1,033% |
| 247 | 5.612,5 | 816.643,75 | 1,0367% | 1,037% |
| 248 | 5.631,25 | 822.275 | 1,0405% | 1,04% |
| 249 | 5.650 | 827.925 | 1,0443% | 1,044% |
| 250 | 5.668,75 | 833.593,75 | 1,0481% | 1,048% |
| 251 | 5.687,5 | 839.281,25 | 1,0519% | 1,052% |
| 252 | 5.706,25 | 844.987,5 | 1,0557% | 1,056% |
| 253 | 5.725 | 850.712,5 | 1,0595% | 1,06% |
| 254 | 5.743,75 | 856.456,25 | 1,0633% | 1,063% |
| 255 | 5.762,5 | 862.218,75 | 1,0671% | 1,067% |
| 256 | 5.781,25 | 868.000 | 1,0709% | 1,071% |
| 257 | 5.800 | 873.800 | 1,0747% | 1,075% |
| 258 | 5.818,75 | 879.618,75 | 1,0786% | 1,079% |
| 259 | 5.837,5 | 885.456,25 | 1,0824% | 1,082% |
| 260 | 5.856,25 | 891.312,5 | 1,0862% | 1,086% |
| 261 | 5.875 | 897.187,5 | 1,0900% | 1,09% |
| 262 | 5.893,75 | 903.081,25 | 1,0938% | 1,094% |
| 263 | 5.912,5 | 908.993,75 | 1,0976% | 1,098% |
| 264 | 5.931,25 | 914.925 | 1,1014% | 1,101% |
| 265 | 5.950 | 920.875 | 1,1052% | 1,105% |
| 266 | 5.968,75 | 926.843,75 | 1,1090% | 1,109% |
| 267 | 5.987,5 | 932.831,25 | 1,1128% | 1,113% |
| 268 | 6.006,25 | 938.837,5 | 1,1166% | 1,117% |
| 269 | 6.025 | 944.862,5 | 1,1204% | 1,12% |
| 270 | 6.043,75 | 950.906,25 | 1,1242% | 1,124% |
| 271 | 6.062,5 | 956.968,75 | 1,1281% | 1,128% |
| 272 | 6.081,25 | 963.050 | 1,1319% | 1,132% |
| 273 | 6.100 | 969.150 | 1,1357% | 1,136% |
| 274 | 6.118,75 | 975.268,75 | 1,1395% | 1,139% |
| 275 | 6.137,5 | 981.406,25 | 1,1433% | 1,143% |
| 276 | 6.156,25 | 987.562,5 | 1,1471% | 1,147% |
| 277 | 6.175 | 993.737,5 | 1,1509% | 1,151% |
| 278 | 6.193,75 | 999.931,25 | 1,1547% | 1,155% |
| 279 | 6.212,5 | 1.006.143,75 | 1,1585% | 1,159% |
| 280 | 6.231,25 | 1.012.375 | 1,1623% | 1,162% |
| 281 | 6.250 | 1.018.625 | 1,1661% | 1,166% |
| 282 | 6.268,75 | 1.024.893,75 | 1,1699% | 1,17% |
| 283 | 6.287,5 | 1.031.181,25 | 1,1737% | 1,174% |
| 284 | 6.306,25 | 1.037.487,5 | 1,1776% | 1,178% |
| 285 | 6.325 | 1.043.812,5 | 1,1814% | 1,181% |
| 286 | 6.343,75 | 1.050.156,25 | 1,1852% | 1,185% |
| 287 | 6.362,5 | 1.056.518,75 | 1,1890% | 1,189% |
| 288 | 6.381,25 | 1.062.900 | 1,1928% | 1,193% |
| 289 | 6.400 | 1.069.300 | 1,1966% | 1,197% |
| 290 | 6.418,75 | 1.075.718,75 | 1,2004% | 1,2% |
| 291 | 6.437,5 | 1.082.156,25 | 1,2042% | 1,204% |
| 292 | 6.456,25 | 1.088.612,5 | 1,2080% | 1,208% |
| 293 | 6.475 | 1.095.087,5 | 1,2118% | 1,212% |
| 294 | 6.493,75 | 1.101.581,25 | 1,2156% | 1,216% |
| 295 | 6.512,5 | 1.108.093,75 | 1,2194% | 1,219% |
| 296 | 6.531,25 | 1.114.625 | 1,2232% | 1,223% |
| 297 | 6.550 | 1.121.175 | 1,2270% | 1,227% |
| 298 | 6.568,75 | 1.127.743,75 | 1,2309% | 1,231% |
| 299 | 6.587,5 | 1.134.331,25 | 1,2347% | 1,235% |
| 300 | 6.606,25 | 1.140.937,5 | 1,2385% | 1,238% |
| 301 | 6.625 | 1.147.562,5 | 1,2423% | 1,242% |
| 302 | 6.643,75 | 1.154.206,25 | 1,2461% | 1,246% |
| 303 | 6.662,5 | 1.160.868,75 | 1,2499% | 1,25% |
| 304 | 6.681,25 | 1.167.550 | 1,2537% | 1,254% |
| 305 | 6.700 | 1.174.250 | 1,2575% | 1,258% |
| 306 | 6.718,75 | 1.180.968,75 | 1,2613% | 1,261% |
| 307 | 6.737,5 | 1.187.706,25 | 1,2651% | 1,265% |
| 308 | 6.756,25 | 1.194.462,5 | 1,2689% | 1,269% |
| 309 | 6.775 | 1.201.237,5 | 1,2727% | 1,273% |
| 310 | 6.793,75 | 1.208.031,25 | 1,2765% | 1,277% |
| 311 | 6.812,5 | 1.214.843,75 | 1,2804% | 1,28% |
| 312 | 6.831,25 | 1.221.675 | 1,2842% | 1,284% |
| 313 | 6.850 | 1.228.525 | 1,2880% | 1,288% |
| 314 | 6.868,75 | 1.235.393,75 | 1,2918% | 1,292% |
| 315 | 6.887,5 | 1.242.281,25 | 1,2956% | 1,296% |
| 316 | 6.906,25 | 1.249.187,5 | 1,2994% | 1,299% |
| 317 | 6.925 | 1.256.112,5 | 1,3032% | 1,303% |
| 318 | 6.943,75 | 1.263.056,25 | 1,3070% | 1,307% |
| 319 | 6.962,5 | 1.270.018,75 | 1,3108% | 1,311% |
| 320 | 6.981,25 | 1.277.000 | 1,3146% | 1,315% |
| 321 | 7.000 | 1.284.000 | 1,3184% | 1,318% |
| 322 | 7.018,75 | 1.291.018,75 | 1,3222% | 1,322% |
| 323 | 7.037,5 | 1.298.056,25 | 1,3260% | 1,326% |
| 324 | 7.056,25 | 1.305.112,5 | 1,3299% | 1,33% |
| 325 | 7.075 | 1.312.187,5 | 1,3337% | 1,334% |
| 326 | 7.093,75 | 1.319.281,25 | 1,3375% | 1,337% |
| 327 | 7.112,5 | 1.326.393,75 | 1,3413% | 1,341% |
| 328 | 7.131,25 | 1.333.525 | 1,3451% | 1,345% |
| 329 | 7.150 | 1.340.675 | 1,3489% | 1,349% |
| 330 | 7.168,75 | 1.347.843,75 | 1,3527% | 1,353% |
| 331 | 7.187,5 | 1.355.031,25 | 1,3565% | 1,357% |
| 332 | 7.206,25 | 1.362.237,5 | 1,3603% | 1,36% |
| 333 | 7.225 | 1.369.462,5 | 1,3641% | 1,364% |
| 334 | 7.243,75 | 1.376.706,25 | 1,3679% | 1,368% |
| 335 | 7.262,5 | 1.383.968,75 | 1,3717% | 1,372% |
| 336 | 7.281,25 | 1.391.250 | 1,3755% | 1,376% |
| 337 | 7.300 | 1.398.550 | 1,3794% | 1,379% |
| 338 | 7.318,75 | 1.405.868,75 | 1,3832% | 1,383% |
| 339 | 7.337,5 | 1.413.206,25 | 1,3870% | 1,387% |
| 340 | 7.356,25 | 1.420.562,5 | 1,3908% | 1,391% |
| 341 | 7.375 | 1.427.937,5 | 1,3946% | 1,395% |
| 342 | 7.393,75 | 1.435.331,25 | 1,3984% | 1,398% |
| 343 | 7.412,5 | 1.442.743,75 | 1,4022% | 1,402% |
| 344 | 7.431,25 | 1.450.175 | 1,4060% | 1,406% |
| 345 | 7.450 | 1.457.625 | 1,4098% | 1,41% |
| 346 | 7.468,75 | 1.465.093,75 | 1,4136% | 1,414% |
| 347 | 7.487,5 | 1.472.581,25 | 1,4174% | 1,417% |
| 348 | 7.506,25 | 1.480.087,5 | 1,4212% | 1,421% |
| 349 | 7.525 | 1.487.612,5 | 1,4250% | 1,425% |
| 350 | 7.543,75 | 1.495.156,25 | 1,4289% | 1,429% |
| 351 | 7.562,5 | 1.502.718,75 | 1,4327% | 1,433% |
| 352 | 7.581,25 | 1.510.300 | 1,4365% | 1,436% |
| 353 | 7.600 | 1.517.900 | 1,4403% | 1,44% |
| 354 | 7.618,75 | 1.525.518,75 | 1,4441% | 1,444% |
| 355 | 7.637,5 | 1.533.156,25 | 1,4479% | 1,448% |
| 356 | 7.656,25 | 1.540.812,5 | 1,4517% | 1,452% |
| 357 | 7.675 | 1.548.487,5 | 1,4555% | 1,456% |
| 358 | 7.693,75 | 1.556.181,25 | 1,4593% | 1,459% |
| 359 | 7.712,5 | 1.563.893,75 | 1,4631% | 1,463% |
| 360 | 7.731,25 | 1.571.625 | 1,4669% | 1,467% |
| 361 | 7.750 | 1.579.375 | 1,4707% | 1,471% |
| 362 | 7.768,75 | 1.587.143,75 | 1,4745% | 1,475% |
| 363 | 7.787,5 | 1.594.931,25 | 1,4784% | 1,478% |
| 364 | 7.806,25 | 1.602.737,5 | 1,4822% | 1,482% |
| 365 | 7.825 | 1.610.562,5 | 1,4860% | 1,486% |
| 366 | 7.843,75 | 1.618.406,25 | 1,4898% | 1,49% |
| 367 | 7.862,5 | 1.626.268,75 | 1,4936% | 1,494% |
| 368 | 7.881,25 | 1.634.150 | 1,4974% | 1,497% |
| 369 | 7.900 | 1.642.050 | 1,5012% | 1,501% |
| 370 | 7.918,75 | 1.649.968,75 | 1,5050% | 1,505% |
| 371 | 7.937,5 | 1.657.906,25 | 1,5088% | 1,509% |
| 372 | 7.956,25 | 1.665.862,5 | 1,5126% | 1,513% |
| 373 | 7.975 | 1.673.837,5 | 1,5164% | 1,516% |
| 374 | 7.993,75 | 1.681.831,25 | 1,5202% | 1,52% |
| 375 | 8.012,5 | 1.689.843,75 | 1,5240% | 1,524% |
| 376 | 8.031,25 | 1.697.875 | 1,5279% | 1,528% |
| 377 | 8.050 | 1.705.925 | 1,5317% | 1,532% |
| 378 | 8.068,75 | 1.713.993,75 | 1,5355% | 1,535% |
| 379 | 8.087,5 | 1.722.081,25 | 1,5393% | 1,539% |
| 380 | 8.106,25 | 1.730.187,5 | 1,5431% | 1,543% |
| 381 | 8.125 | 1.738.312,5 | 1,5469% | 1,547% |
| 382 | 8.143,75 | 1.746.456,25 | 1,5507% | 1,551% |
| 383 | 8.162,5 | 1.754.618,75 | 1,5545% | 1,555% |
| 384 | 8.181,25 | 1.762.800 | 1,5583% | 1,558% |
| 385 | 8.200 | 1.771.000 | 1,5621% | 1,562% |
| 386 | 8.218,75 | 1.779.218,75 | 1,5659% | 1,566% |
| 387 | 8.237,5 | 1.787.456,25 | 1,5697% | 1,57% |
| 388 | 8.256,25 | 1.795.712,5 | 1,5735% | 1,574% |
| 389 | 8.275 | 1.803.987,5 | 1,5773% | 1,577% |
| 390 | 8.293,75 | 1.812.281,25 | 1,5812% | 1,581% |
| 391 | 8.312,5 | 1.820.593,75 | 1,5850% | 1,585% |
| 392 | 8.331,25 | 1.828.925 | 1,5888% | 1,589% |
| 393 | 8.350 | 1.837.275 | 1,5926% | 1,593% |
| 394 | 8.368,75 | 1.845.643,75 | 1,5964% | 1,596% |
| 395 | 8.387,5 | 1.854.031,25 | 1,6002% | 1,6% |
| 396 | 8.406,25 | 1.862.437,5 | 1,6040% | 1,604% |
| 397 | 8.425 | 1.870.862,5 | 1,6078% | 1,608% |
| 398 | 8.443,75 | 1.879.306,25 | 1,6116% | 1,612% |
| 399 | 8.462,5 | 1.887.768,75 | 1,6154% | 1,615% |
| 400 | 8.481,25 | 1.896.250 | 1,6192% | 1,619% |
| 401 | 8.500 | 1.904.750 | 1,6230% | 1,623% |
| 402 | 8.518,75 | 1.913.268,75 | 1,6268% | 1,627% |
| 403 | 8.537,5 | 1.921.806,25 | 1,6307% | 1,631% |
| 404 | 8.556,25 | 1.930.362,5 | 1,6345% | 1,634% |
| 405 | 8.575 | 1.938.937,5 | 1,6383% | 1,638% |
| 406 | 8.593,75 | 1.947.531,25 | 1,6421% | 1,642% |
| 407 | 8.612,5 | 1.956.143,75 | 1,6459% | 1,646% |
| 408 | 8.631,25 | 1.964.775 | 1,6497% | 1,65% |
| 409 | 8.650 | 1.973.425 | 1,6535% | 1,654% |
| 410 | 8.668,75 | 1.982.093,75 | 1,6573% | 1,657% |
| 411 | 8.687,5 | 1.990.781,25 | 1,6611% | 1,661% |
| 412 | 8.706,25 | 1.999.487,5 | 1,6649% | 1,665% |
| 413 | 8.725 | 2.008.212,5 | 1,6687% | 1,669% |
| 414 | 8.743,75 | 2.016.956,25 | 1,6725% | 1,673% |
| 415 | 8.762,5 | 2.025.718,75 | 1,6763% | 1,676% |
| 416 | 8.781,25 | 2.034.500 | 1,6802% | 1,68% |
| 417 | 8.800 | 2.043.300 | 1,6840% | 1,684% |
| 418 | 8.818,75 | 2.052.118,75 | 1,6878% | 1,688% |
| 419 | 8.837,5 | 2.060.956,25 | 1,6916% | 1,692% |
| 420 | 8.856,25 | 2.069.812,5 | 1,6954% | 1,695% |
| 421 | 8.875 | 2.078.687,5 | 1,6992% | 1,699% |
| 422 | 8.893,75 | 2.087.581,25 | 1,7030% | 1,703% |
| 423 | 8.912,5 | 2.096.493,75 | 1,7068% | 1,707% |
| 424 | 8.931,25 | 2.105.425 | 1,7106% | 1,711% |
| 425 | 8.950 | 2.114.375 | 1,7144% | 1,714% |
| 426 | 8.968,75 | 2.123.343,75 | 1,7182% | 1,718% |
| 427 | 8.987,5 | 2.132.331,25 | 1,7220% | 1,722% |
| 428 | 9.006,25 | 2.141.337,5 | 1,7258% | 1,726% |
| 429 | 9.025 | 2.150.362,5 | 1,7297% | 1,73% |
| 430 | 9.043,75 | 2.159.406,25 | 1,7335% | 1,733% |
| 431 | 9.062,5 | 2.168.468,75 | 1,7373% | 1,737% |
| 432 | 9.081,25 | 2.177.550 | 1,7411% | 1,741% |
| 433 | 9.100 | 2.186.650 | 1,7449% | 1,745% |
| 434 | 9.118,75 | 2.195.768,75 | 1,7487% | 1,749% |
| 435 | 9.137,5 | 2.204.906,25 | 1,7525% | 1,752% |
| 436 | 9.156,25 | 2.214.062,5 | 1,7563% | 1,756% |
| 437 | 9.175 | 2.223.237,5 | 1,7601% | 1,76% |
| 438 | 9.193,75 | 2.232.431,25 | 1,7639% | 1,764% |
| 439 | 9.212,5 | 2.241.643,75 | 1,7677% | 1,768% |
| 440 | 9.231,25 | 2.250.875 | 1,7715% | 1,772% |
| 441 | 9.250 | 2.260.125 | 1,7753% | 1,775% |
| 442 | 9.268,75 | 2.269.393,75 | 1,7792% | 1,779% |
| 443 | 9.287,5 | 2.278.681,25 | 1,7830% | 1,783% |
| 444 | 9.306,25 | 2.287.987,5 | 1,7868% | 1,787% |
| 445 | 9.325 | 2.297.312,5 | 1,7906% | 1,791% |
| 446 | 9.343,75 | 2.306.656,25 | 1,7944% | 1,794% |
| 447 | 9.362,5 | 2.316.018,75 | 1,7982% | 1,798% |
| 448 | 9.381,25 | 2.325.400 | 1,8020% | 1,802% |
| 449 | 9.400 | 2.334.800 | 1,8058% | 1,806% |
| 450 | 9.418,75 | 2.344.218,75 | 1,8096% | 1,81% |
| 451 | 9.437,5 | 2.353.656,25 | 1,8134% | 1,813% |
| 452 | 9.456,25 | 2.363.112,5 | 1,8172% | 1,817% |
| 453 | 9.475 | 2.372.587,5 | 1,8210% | 1,821% |
| 454 | 9.493,75 | 2.382.081,25 | 1,8248% | 1,825% |
| 455 | 9.512,5 | 2.391.593,75 | 1,8287% | 1,829% |
| 456 | 9.531,25 | 2.401.125 | 1,8325% | 1,832% |
| 457 | 9.550 | 2.410.675 | 1,8363% | 1,836% |
| 458 | 9.568,75 | 2.420.243,75 | 1,8401% | 1,84% |
| 459 | 9.587,5 | 2.429.831,25 | 1,8439% | 1,844% |
| 460 | 9.606,25 | 2.439.437,5 | 1,8477% | 1,848% |
| 461 | 9.625 | 2.449.062,5 | 1,8515% | 1,851% |
| 462 | 9.643,75 | 2.458.706,25 | 1,8553% | 1,855% |
| 463 | 9.662,5 | 2.468.368,75 | 1,8591% | 1,859% |
| 464 | 9.681,25 | 2.478.050 | 1,8629% | 1,863% |
| 465 | 9.700 | 2.487.750 | 1,8667% | 1,867% |
| 466 | 9.718,75 | 2.497.468,75 | 1,8705% | 1,871% |
| 467 | 9.737,5 | 2.507.206,25 | 1,8743% | 1,874% |
| 468 | 9.756,25 | 2.516.962,5 | 1,8781% | 1,878% |
| 469 | 9.775 | 2.526.737,5 | 1,8820% | 1,882% |
| 470 | 9.793,75 | 2.536.531,25 | 1,8858% | 1,886% |
| 471 | 9.812,5 | 2.546.343,75 | 1,8896% | 1,89% |
| 472 | 9.831,25 | 2.556.175 | 1,8934% | 1,893% |
| 473 | 9.850 | 2.566.025 | 1,8972% | 1,897% |
| 474 | 9.868,75 | 2.575.893,75 | 1,9010% | 1,901% |
| 475 | 9.887,5 | 2.585.781,25 | 1,9048% | 1,905% |
| 476 | 9.906,25 | 2.595.687,5 | 1,9086% | 1,909% |
| 477 | 9.925 | 2.605.612,5 | 1,9124% | 1,912% |
| 478 | 9.943,75 | 2.615.556,25 | 1,9162% | 1,916% |
| 479 | 9.962,5 | 2.625.518,75 | 1,9200% | 1,92% |
| 480 | 9.981,25 | 2.635.500 | 1,9238% | 1,924% |
| 481 | 10.000 | 2.645.500 | 1,9276% | 1,928% |
| 482 | 10.018,75 | 2.655.518,75 | 1,9315% | 1,931% |
| 483 | 10.037,5 | 2.665.556,25 | 1,9353% | 1,935% |
| 484 | 10.056,25 | 2.675.612,5 | 1,9391% | 1,939% |
| 485 | 10.075 | 2.685.687,5 | 1,9429% | 1,943% |
| 486 | 10.093,75 | 2.695.781,25 | 1,9467% | 1,947% |
| 487 | 10.112,5 | 2.705.893,75 | 1,9505% | 1,95% |
| 488 | 10.131,25 | 2.716.025 | 1,9543% | 1,954% |
| 489 | 10.150 | 2.726.175 | 1,9581% | 1,958% |
| 490 | 10.168,75 | 2.736.343,75 | 1,9619% | 1,962% |
| 491 | 10.187,5 | 2.746.531,25 | 1,9657% | 1,966% |
| 492 | 10.206,25 | 2.756.737,5 | 1,9695% | 1,97% |
| 493 | 10.225 | 2.766.962,5 | 1,9733% | 1,973% |
| 494 | 10.243,75 | 2.777.206,25 | 1,9771% | 1,977% |
| 495 | 10.262,5 | 2.787.468,75 | 1,9810% | 1,981% |
| 496 | 10.281,25 | 2.797.750 | 1,9848% | 1,985% |
| 497 | 10.300 | 2.808.050 | 1,9886% | 1,989% |
| 498 | 10.318,75 | 2.818.368,75 | 1,9924% | 1,992% |
| 499 | 10.337,5 | 2.828.706,25 | 1,9962% | 1,996% |
| 500 | 10.356,25 | 2.839.062,5 | 2,0000% | 2% |

### Anexo — Cataclismo

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 20.105 | 20.105 | 0,8700% | 0,87% |
| 2 | 20.427,19 | 40.532,19 | 0,9032% | 0,9032% |
| 3 | 20.749,38 | 61.281,57 | 0,9364% | 0,9364% |
| 4 | 21.071,57 | 82.353,14 | 0,9696% | 0,9696% |
| 5 | 21.393,76 | 103.746,9 | 1,0028% | 1,003% |
| 6 | 21.715,95 | 125.462,85 | 1,0360% | 1,036% |
| 7 | 22.038,14 | 147.500,99 | 1,0692% | 1,069% |
| 8 | 22.360,33 | 169.861,32 | 1,1024% | 1,102% |
| 9 | 22.682,52 | 192.543,84 | 1,1356% | 1,136% |
| 10 | 23.004,71 | 215.548,55 | 1,1689% | 1,169% |
| 11 | 23.326,9 | 238.875,45 | 1,2021% | 1,202% |
| 12 | 23.649,09 | 262.524,54 | 1,2353% | 1,235% |
| 13 | 23.971,28 | 286.495,82 | 1,2685% | 1,268% |
| 14 | 24.293,47 | 310.789,29 | 1,3017% | 1,302% |
| 15 | 24.615,66 | 335.404,95 | 1,3349% | 1,335% |
| 16 | 24.937,85 | 360.342,8 | 1,3681% | 1,368% |
| 17 | 25.260,04 | 385.602,84 | 1,4013% | 1,401% |
| 18 | 25.582,23 | 411.185,07 | 1,4345% | 1,435% |
| 19 | 25.904,42 | 437.089,49 | 1,4677% | 1,468% |
| 20 | 26.226,61 | 463.316,1 | 1,5009% | 1,501% |
| 21 | 26.548,8 | 489.864,9 | 1,5341% | 1,534% |
| 22 | 26.870,99 | 516.735,89 | 1,5673% | 1,567% |
| 23 | 27.193,18 | 543.929,07 | 1,6005% | 1,601% |
| 24 | 27.515,37 | 571.444,44 | 1,6337% | 1,634% |
| 25 | 27.837,56 | 599.282 | 1,6669% | 1,667% |
| 26 | 28.159,75 | 627.441,75 | 1,7002% | 1,7% |
| 27 | 28.481,94 | 655.923,69 | 1,7334% | 1,733% |
| 28 | 28.804,13 | 684.727,82 | 1,7666% | 1,767% |
| 29 | 29.126,32 | 713.854,14 | 1,7998% | 1,8% |
| 30 | 29.448,51 | 743.302,65 | 1,8330% | 1,833% |
| 31 | 29.770,7 | 773.073,35 | 1,8662% | 1,866% |
| 32 | 30.092,89 | 803.166,24 | 1,8994% | 1,899% |
| 33 | 30.415,08 | 833.581,32 | 1,9326% | 1,933% |
| 34 | 30.737,27 | 864.318,59 | 1,9658% | 1,966% |
| 35 | 31.059,46 | 895.378,05 | 1,9990% | 1,999% |
| 36 | 31.381,65 | 926.759,7 | 2,0322% | 2,032% |
| 37 | 31.703,84 | 958.463,54 | 2,0654% | 2,065% |
| 38 | 32.026,03 | 990.489,57 | 2,0986% | 2,099% |
| 39 | 32.348,22 | 1.022.837,79 | 2,1318% | 2,132% |
| 40 | 32.670,41 | 1.055.508,2 | 2,1650% | 2,165% |
| 41 | 32.992,6 | 1.088.500,8 | 2,1982% | 2,198% |
| 42 | 33.314,79 | 1.121.815,59 | 2,2315% | 2,231% |
| 43 | 33.636,98 | 1.155.452,57 | 2,2647% | 2,265% |
| 44 | 33.959,17 | 1.189.411,74 | 2,2979% | 2,298% |
| 45 | 34.281,36 | 1.223.693,1 | 2,3311% | 2,331% |
| 46 | 34.603,55 | 1.258.296,65 | 2,3643% | 2,364% |
| 47 | 34.925,74 | 1.293.222,39 | 2,3975% | 2,397% |
| 48 | 35.247,93 | 1.328.470,32 | 2,4307% | 2,431% |
| 49 | 35.570,12 | 1.364.040,44 | 2,4639% | 2,464% |
| 50 | 35.892,31 | 1.399.932,75 | 2,4971% | 2,497% |
| 51 | 36.214,5 | 1.436.147,25 | 2,5303% | 2,53% |
| 52 | 36.536,69 | 1.472.683,94 | 2,5635% | 2,564% |
| 53 | 36.858,88 | 1.509.542,82 | 2,5967% | 2,597% |
| 54 | 37.181,07 | 1.546.723,89 | 2,6299% | 2,63% |
| 55 | 37.503,26 | 1.584.227,15 | 2,6631% | 2,663% |
| 56 | 37.825,45 | 1.622.052,6 | 2,6963% | 2,696% |
| 57 | 38.147,64 | 1.660.200,24 | 2,7295% | 2,73% |
| 58 | 38.469,83 | 1.698.670,07 | 2,7627% | 2,763% |
| 59 | 38.792,02 | 1.737.462,09 | 2,7960% | 2,796% |
| 60 | 39.114,21 | 1.776.576,3 | 2,8292% | 2,829% |
| 61 | 39.436,4 | 1.816.012,7 | 2,8624% | 2,862% |
| 62 | 39.758,59 | 1.855.771,29 | 2,8956% | 2,896% |
| 63 | 40.080,78 | 1.895.852,07 | 2,9288% | 2,929% |
| 64 | 40.402,97 | 1.936.255,04 | 2,9620% | 2,962% |
| 65 | 40.725,16 | 1.976.980,2 | 2,9952% | 2,995% |
| 66 | 41.047,35 | 2.018.027,55 | 3,0284% | 3,028% |
| 67 | 41.369,54 | 2.059.397,09 | 3,0616% | 3,062% |
| 68 | 41.691,73 | 2.101.088,82 | 3,0948% | 3,095% |
| 69 | 42.013,92 | 2.143.102,74 | 3,1280% | 3,128% |
| 70 | 42.336,11 | 2.185.438,85 | 3,1612% | 3,161% |
| 71 | 42.658,3 | 2.228.097,15 | 3,1944% | 3,194% |
| 72 | 42.980,49 | 2.271.077,64 | 3,2276% | 3,228% |
| 73 | 43.302,68 | 2.314.380,32 | 3,2608% | 3,261% |
| 74 | 43.624,87 | 2.358.005,19 | 3,2940% | 3,294% |
| 75 | 43.947,06 | 2.401.952,25 | 3,3273% | 3,327% |
| 76 | 44.269,25 | 2.446.221,5 | 3,3605% | 3,36% |
| 77 | 44.591,44 | 2.490.812,94 | 3,3937% | 3,394% |
| 78 | 44.913,63 | 2.535.726,57 | 3,4269% | 3,427% |
| 79 | 45.235,82 | 2.580.962,39 | 3,4601% | 3,46% |
| 80 | 45.558,01 | 2.626.520,4 | 3,4933% | 3,493% |
| 81 | 45.880,2 | 2.672.400,6 | 3,5265% | 3,526% |
| 82 | 46.202,39 | 2.718.602,99 | 3,5597% | 3,56% |
| 83 | 46.524,58 | 2.765.127,57 | 3,5929% | 3,593% |
| 84 | 46.846,77 | 2.811.974,34 | 3,6261% | 3,626% |
| 85 | 47.168,96 | 2.859.143,3 | 3,6593% | 3,659% |
| 86 | 47.491,15 | 2.906.634,45 | 3,6925% | 3,693% |
| 87 | 47.813,34 | 2.954.447,79 | 3,7257% | 3,726% |
| 88 | 48.135,53 | 3.002.583,32 | 3,7589% | 3,759% |
| 89 | 48.457,72 | 3.051.041,04 | 3,7921% | 3,792% |
| 90 | 48.779,91 | 3.099.820,95 | 3,8253% | 3,825% |
| 91 | 49.102,1 | 3.148.923,05 | 3,8585% | 3,859% |
| 92 | 49.424,29 | 3.198.347,34 | 3,8918% | 3,892% |
| 93 | 49.746,48 | 3.248.093,82 | 3,9250% | 3,925% |
| 94 | 50.068,67 | 3.298.162,49 | 3,9582% | 3,958% |
| 95 | 50.390,86 | 3.348.553,35 | 3,9914% | 3,991% |
| 96 | 50.713,05 | 3.399.266,4 | 4,0246% | 4,025% |
| 97 | 51.035,24 | 3.450.301,64 | 4,0578% | 4,058% |
| 98 | 51.357,43 | 3.501.659,07 | 4,0910% | 4,091% |
| 99 | 51.679,62 | 3.553.338,69 | 4,1242% | 4,124% |
| 100 | 52.001,81 | 3.605.340,5 | 4,1574% | 4,157% |
| 101 | 52.324 | 3.657.664,5 | 4,1906% | 4,191% |
| 102 | 52.646,19 | 3.710.310,69 | 4,2238% | 4,224% |
| 103 | 52.968,38 | 3.763.279,07 | 4,2570% | 4,257% |
| 104 | 53.290,57 | 3.816.569,64 | 4,2902% | 4,29% |
| 105 | 53.612,76 | 3.870.182,4 | 4,3234% | 4,323% |
| 106 | 53.934,95 | 3.924.117,35 | 4,3566% | 4,357% |
| 107 | 54.257,14 | 3.978.374,49 | 4,3898% | 4,39% |
| 108 | 54.579,33 | 4.032.953,82 | 4,4231% | 4,423% |
| 109 | 54.901,52 | 4.087.855,34 | 4,4563% | 4,456% |
| 110 | 55.223,71 | 4.143.079,05 | 4,4895% | 4,489% |
| 111 | 55.545,9 | 4.198.624,95 | 4,5227% | 4,523% |
| 112 | 55.868,09 | 4.254.493,04 | 4,5559% | 4,556% |
| 113 | 56.190,28 | 4.310.683,32 | 4,5891% | 4,589% |
| 114 | 56.512,47 | 4.367.195,79 | 4,6223% | 4,622% |
| 115 | 56.834,66 | 4.424.030,45 | 4,6555% | 4,655% |
| 116 | 57.156,85 | 4.481.187,3 | 4,6887% | 4,689% |
| 117 | 57.479,04 | 4.538.666,34 | 4,7219% | 4,722% |
| 118 | 57.801,23 | 4.596.467,57 | 4,7551% | 4,755% |
| 119 | 58.123,42 | 4.654.590,99 | 4,7883% | 4,788% |
| 120 | 58.445,61 | 4.713.036,6 | 4,8215% | 4,822% |
| 121 | 58.767,8 | 4.771.804,4 | 4,8547% | 4,855% |
| 122 | 59.089,99 | 4.830.894,39 | 4,8879% | 4,888% |
| 123 | 59.412,18 | 4.890.306,57 | 4,9211% | 4,921% |
| 124 | 59.734,37 | 4.950.040,94 | 4,9544% | 4,954% |
| 125 | 60.056,56 | 5.010.097,5 | 4,9876% | 4,988% |
| 126 | 60.378,75 | 5.070.476,25 | 5,0208% | 5,021% |
| 127 | 60.700,94 | 5.131.177,19 | 5,0540% | 5,054% |
| 128 | 61.023,13 | 5.192.200,32 | 5,0872% | 5,087% |
| 129 | 61.345,32 | 5.253.545,64 | 5,1204% | 5,12% |
| 130 | 61.667,51 | 5.315.213,15 | 5,1536% | 5,154% |
| 131 | 61.989,7 | 5.377.202,85 | 5,1868% | 5,187% |
| 132 | 62.311,89 | 5.439.514,74 | 5,2200% | 5,22% |
| 133 | 62.634,08 | 5.502.148,82 | 5,2532% | 5,253% |
| 134 | 62.956,27 | 5.565.105,09 | 5,2864% | 5,286% |
| 135 | 63.278,46 | 5.628.383,55 | 5,3196% | 5,32% |
| 136 | 63.600,65 | 5.691.984,2 | 5,3528% | 5,353% |
| 137 | 63.922,84 | 5.755.907,04 | 5,3860% | 5,386% |
| 138 | 64.245,03 | 5.820.152,07 | 5,4192% | 5,419% |
| 139 | 64.567,22 | 5.884.719,29 | 5,4524% | 5,452% |
| 140 | 64.889,41 | 5.949.608,7 | 5,4856% | 5,486% |
| 141 | 65.211,6 | 6.014.820,3 | 5,5189% | 5,519% |
| 142 | 65.533,79 | 6.080.354,09 | 5,5521% | 5,552% |
| 143 | 65.855,98 | 6.146.210,07 | 5,5853% | 5,585% |
| 144 | 66.178,17 | 6.212.388,24 | 5,6185% | 5,618% |
| 145 | 66.500,36 | 6.278.888,6 | 5,6517% | 5,652% |
| 146 | 66.822,55 | 6.345.711,15 | 5,6849% | 5,685% |
| 147 | 67.144,74 | 6.412.855,89 | 5,7181% | 5,718% |
| 148 | 67.466,93 | 6.480.322,82 | 5,7513% | 5,751% |
| 149 | 67.789,12 | 6.548.111,94 | 5,7845% | 5,785% |
| 150 | 68.111,31 | 6.616.223,25 | 5,8177% | 5,818% |
| 151 | 68.433,5 | 6.684.656,75 | 5,8509% | 5,851% |
| 152 | 68.755,69 | 6.753.412,44 | 5,8841% | 5,884% |
| 153 | 69.077,88 | 6.822.490,32 | 5,9173% | 5,917% |
| 154 | 69.400,07 | 6.891.890,39 | 5,9505% | 5,951% |
| 155 | 69.722,26 | 6.961.612,65 | 5,9837% | 5,984% |
| 156 | 70.044,45 | 7.031.657,1 | 6,0169% | 6,017% |
| 157 | 70.366,64 | 7.102.023,74 | 6,0502% | 6,05% |
| 158 | 70.688,83 | 7.172.712,57 | 6,0834% | 6,083% |
| 159 | 71.011,02 | 7.243.723,59 | 6,1166% | 6,117% |
| 160 | 71.333,21 | 7.315.056,8 | 6,1498% | 6,15% |
| 161 | 71.655,4 | 7.386.712,2 | 6,1830% | 6,183% |
| 162 | 71.977,59 | 7.458.689,79 | 6,2162% | 6,216% |
| 163 | 72.299,78 | 7.530.989,57 | 6,2494% | 6,249% |
| 164 | 72.621,97 | 7.603.611,54 | 6,2826% | 6,283% |
| 165 | 72.944,16 | 7.676.555,7 | 6,3158% | 6,316% |
| 166 | 73.266,35 | 7.749.822,05 | 6,3490% | 6,349% |
| 167 | 73.588,54 | 7.823.410,59 | 6,3822% | 6,382% |
| 168 | 73.910,73 | 7.897.321,32 | 6,4154% | 6,415% |
| 169 | 74.232,92 | 7.971.554,24 | 6,4486% | 6,449% |
| 170 | 74.555,11 | 8.046.109,35 | 6,4818% | 6,482% |
| 171 | 74.877,3 | 8.120.986,65 | 6,5150% | 6,515% |
| 172 | 75.199,49 | 8.196.186,14 | 6,5482% | 6,548% |
| 173 | 75.521,68 | 8.271.707,82 | 6,5814% | 6,581% |
| 174 | 75.843,87 | 8.347.551,69 | 6,6147% | 6,615% |
| 175 | 76.166,06 | 8.423.717,75 | 6,6479% | 6,648% |
| 176 | 76.488,25 | 8.500.206 | 6,6811% | 6,681% |
| 177 | 76.810,44 | 8.577.016,44 | 6,7143% | 6,714% |
| 178 | 77.132,63 | 8.654.149,07 | 6,7475% | 6,747% |
| 179 | 77.454,82 | 8.731.603,89 | 6,7807% | 6,781% |
| 180 | 77.777,01 | 8.809.380,9 | 6,8139% | 6,814% |
| 181 | 78.099,2 | 8.887.480,1 | 6,8471% | 6,847% |
| 182 | 78.421,39 | 8.965.901,49 | 6,8803% | 6,88% |
| 183 | 78.743,58 | 9.044.645,07 | 6,9135% | 6,914% |
| 184 | 79.065,77 | 9.123.710,84 | 6,9467% | 6,947% |
| 185 | 79.387,96 | 9.203.098,8 | 6,9799% | 6,98% |
| 186 | 79.710,15 | 9.282.808,95 | 7,0131% | 7,013% |
| 187 | 80.032,34 | 9.362.841,29 | 7,0463% | 7,046% |
| 188 | 80.354,53 | 9.443.195,82 | 7,0795% | 7,08% |
| 189 | 80.676,72 | 9.523.872,54 | 7,1127% | 7,113% |
| 190 | 80.998,91 | 9.604.871,45 | 7,1460% | 7,146% |
| 191 | 81.321,1 | 9.686.192,55 | 7,1792% | 7,179% |
| 192 | 81.643,29 | 9.767.835,84 | 7,2124% | 7,212% |
| 193 | 81.965,48 | 9.849.801,32 | 7,2456% | 7,246% |
| 194 | 82.287,67 | 9.932.088,99 | 7,2788% | 7,279% |
| 195 | 82.609,86 | 10.014.698,85 | 7,3120% | 7,312% |
| 196 | 82.932,05 | 10.097.630,9 | 7,3452% | 7,345% |
| 197 | 83.254,24 | 10.180.885,14 | 7,3784% | 7,378% |
| 198 | 83.576,43 | 10.264.461,57 | 7,4116% | 7,412% |
| 199 | 83.898,62 | 10.348.360,19 | 7,4448% | 7,445% |
| 200 | 84.220,81 | 10.432.581 | 7,4780% | 7,478% |
| 201 | 84.543 | 10.517.124 | 7,5112% | 7,511% |
| 202 | 84.865,19 | 10.601.989,19 | 7,5444% | 7,544% |
| 203 | 85.187,38 | 10.687.176,57 | 7,5776% | 7,578% |
| 204 | 85.509,57 | 10.772.686,14 | 7,6108% | 7,611% |
| 205 | 85.831,76 | 10.858.517,9 | 7,6440% | 7,644% |
| 206 | 86.153,95 | 10.944.671,85 | 7,6773% | 7,677% |
| 207 | 86.476,14 | 11.031.147,99 | 7,7105% | 7,71% |
| 208 | 86.798,33 | 11.117.946,32 | 7,7437% | 7,744% |
| 209 | 87.120,52 | 11.205.066,84 | 7,7769% | 7,777% |
| 210 | 87.442,71 | 11.292.509,55 | 7,8101% | 7,81% |
| 211 | 87.764,9 | 11.380.274,45 | 7,8433% | 7,843% |
| 212 | 88.087,09 | 11.468.361,54 | 7,8765% | 7,876% |
| 213 | 88.409,28 | 11.556.770,82 | 7,9097% | 7,91% |
| 214 | 88.731,47 | 11.645.502,29 | 7,9429% | 7,943% |
| 215 | 89.053,66 | 11.734.555,95 | 7,9761% | 7,976% |
| 216 | 89.375,85 | 11.823.931,8 | 8,0093% | 8,009% |
| 217 | 89.698,04 | 11.913.629,84 | 8,0425% | 8,043% |
| 218 | 90.020,23 | 12.003.650,07 | 8,0757% | 8,076% |
| 219 | 90.342,42 | 12.093.992,49 | 8,1089% | 8,109% |
| 220 | 90.664,61 | 12.184.657,1 | 8,1421% | 8,142% |
| 221 | 90.986,8 | 12.275.643,9 | 8,1753% | 8,175% |
| 222 | 91.308,99 | 12.366.952,89 | 8,2085% | 8,209% |
| 223 | 91.631,18 | 12.458.584,07 | 8,2418% | 8,242% |
| 224 | 91.953,37 | 12.550.537,44 | 8,2750% | 8,275% |
| 225 | 92.275,56 | 12.642.813 | 8,3082% | 8,308% |
| 226 | 92.597,75 | 12.735.410,75 | 8,3414% | 8,341% |
| 227 | 92.919,94 | 12.828.330,69 | 8,3746% | 8,375% |
| 228 | 93.242,13 | 12.921.572,82 | 8,4078% | 8,408% |
| 229 | 93.564,32 | 13.015.137,14 | 8,4410% | 8,441% |
| 230 | 93.886,51 | 13.109.023,65 | 8,4742% | 8,474% |
| 231 | 94.208,7 | 13.203.232,35 | 8,5074% | 8,507% |
| 232 | 94.530,89 | 13.297.763,24 | 8,5406% | 8,541% |
| 233 | 94.853,08 | 13.392.616,32 | 8,5738% | 8,574% |
| 234 | 95.175,27 | 13.487.791,59 | 8,6070% | 8,607% |
| 235 | 95.497,46 | 13.583.289,05 | 8,6402% | 8,64% |
| 236 | 95.819,65 | 13.679.108,7 | 8,6734% | 8,673% |
| 237 | 96.141,84 | 13.775.250,54 | 8,7066% | 8,707% |
| 238 | 96.464,03 | 13.871.714,57 | 8,7398% | 8,74% |
| 239 | 96.786,22 | 13.968.500,79 | 8,7731% | 8,773% |
| 240 | 97.108,41 | 14.065.609,2 | 8,8063% | 8,806% |
| 241 | 97.430,6 | 14.163.039,8 | 8,8395% | 8,839% |
| 242 | 97.752,79 | 14.260.792,59 | 8,8727% | 8,873% |
| 243 | 98.074,98 | 14.358.867,57 | 8,9059% | 8,906% |
| 244 | 98.397,17 | 14.457.264,74 | 8,9391% | 8,939% |
| 245 | 98.719,36 | 14.555.984,1 | 8,9723% | 8,972% |
| 246 | 99.041,55 | 14.655.025,65 | 9,0055% | 9,005% |
| 247 | 99.363,74 | 14.754.389,39 | 9,0387% | 9,039% |
| 248 | 99.685,93 | 14.854.075,32 | 9,0719% | 9,072% |
| 249 | 100.008,12 | 14.954.083,44 | 9,1051% | 9,105% |
| 250 | 100.330,31 | 15.054.413,75 | 9,1383% | 9,138% |
| 251 | 100.652,5 | 15.155.066,25 | 9,1715% | 9,172% |
| 252 | 100.974,69 | 15.256.040,94 | 9,2047% | 9,205% |
| 253 | 101.296,88 | 15.357.337,82 | 9,2379% | 9,238% |
| 254 | 101.619,07 | 15.458.956,89 | 9,2711% | 9,271% |
| 255 | 101.941,26 | 15.560.898,15 | 9,3043% | 9,304% |
| 256 | 102.263,45 | 15.663.161,6 | 9,3376% | 9,338% |
| 257 | 102.585,64 | 15.765.747,24 | 9,3708% | 9,371% |
| 258 | 102.907,83 | 15.868.655,07 | 9,4040% | 9,404% |
| 259 | 103.230,02 | 15.971.885,09 | 9,4372% | 9,437% |
| 260 | 103.552,21 | 16.075.437,3 | 9,4704% | 9,47% |
| 261 | 103.874,4 | 16.179.311,7 | 9,5036% | 9,504% |
| 262 | 104.196,59 | 16.283.508,29 | 9,5368% | 9,537% |
| 263 | 104.518,78 | 16.388.027,07 | 9,5700% | 9,57% |
| 264 | 104.840,97 | 16.492.868,04 | 9,6032% | 9,603% |
| 265 | 105.163,16 | 16.598.031,2 | 9,6364% | 9,636% |
| 266 | 105.485,35 | 16.703.516,55 | 9,6696% | 9,67% |
| 267 | 105.807,54 | 16.809.324,09 | 9,7028% | 9,703% |
| 268 | 106.129,73 | 16.915.453,82 | 9,7360% | 9,736% |
| 269 | 106.451,92 | 17.021.905,74 | 9,7692% | 9,769% |
| 270 | 106.774,11 | 17.128.679,85 | 9,8024% | 9,802% |
| 271 | 107.096,3 | 17.235.776,15 | 9,8356% | 9,836% |
| 272 | 107.418,49 | 17.343.194,64 | 9,8689% | 9,869% |
| 273 | 107.740,68 | 17.450.935,32 | 9,9021% | 9,902% |
| 274 | 108.062,87 | 17.558.998,19 | 9,9353% | 9,935% |
| 275 | 108.385,06 | 17.667.383,25 | 9,9685% | 9,968% |
| 276 | 108.707,25 | 17.776.090,5 | 10,0017% | 10% |
| 277 | 109.029,44 | 17.885.119,94 | 10,0349% | 10,03% |
| 278 | 109.351,63 | 17.994.471,57 | 10,0681% | 10,07% |
| 279 | 109.673,82 | 18.104.145,39 | 10,1013% | 10,1% |
| 280 | 109.996,01 | 18.214.141,4 | 10,1345% | 10,13% |
| 281 | 110.318,2 | 18.324.459,6 | 10,1677% | 10,17% |
| 282 | 110.640,39 | 18.435.099,99 | 10,2009% | 10,2% |
| 283 | 110.962,58 | 18.546.062,57 | 10,2341% | 10,23% |
| 284 | 111.284,77 | 18.657.347,34 | 10,2673% | 10,27% |
| 285 | 111.606,96 | 18.768.954,3 | 10,3005% | 10,3% |
| 286 | 111.929,15 | 18.880.883,45 | 10,3337% | 10,33% |
| 287 | 112.251,34 | 18.993.134,79 | 10,3669% | 10,37% |
| 288 | 112.573,53 | 19.105.708,32 | 10,4002% | 10,4% |
| 289 | 112.895,72 | 19.218.604,04 | 10,4334% | 10,43% |
| 290 | 113.217,91 | 19.331.821,95 | 10,4666% | 10,47% |
| 291 | 113.540,1 | 19.445.362,05 | 10,4998% | 10,5% |
| 292 | 113.862,29 | 19.559.224,34 | 10,5330% | 10,53% |
| 293 | 114.184,48 | 19.673.408,82 | 10,5662% | 10,57% |
| 294 | 114.506,67 | 19.787.915,49 | 10,5994% | 10,6% |
| 295 | 114.828,86 | 19.902.744,35 | 10,6326% | 10,63% |
| 296 | 115.151,05 | 20.017.895,4 | 10,6658% | 10,67% |
| 297 | 115.473,24 | 20.133.368,64 | 10,6990% | 10,7% |
| 298 | 115.795,43 | 20.249.164,07 | 10,7322% | 10,73% |
| 299 | 116.117,62 | 20.365.281,69 | 10,7654% | 10,77% |
| 300 | 116.439,81 | 20.481.721,5 | 10,7986% | 10,8% |
| 301 | 116.762 | 20.598.483,5 | 10,8318% | 10,83% |
| 302 | 117.084,19 | 20.715.567,69 | 10,8650% | 10,87% |
| 303 | 117.406,38 | 20.832.974,07 | 10,8982% | 10,9% |
| 304 | 117.728,57 | 20.950.702,64 | 10,9314% | 10,93% |
| 305 | 118.050,76 | 21.068.753,4 | 10,9647% | 10,96% |
| 306 | 118.372,95 | 21.187.126,35 | 10,9979% | 11% |
| 307 | 118.695,14 | 21.305.821,49 | 11,0311% | 11,03% |
| 308 | 119.017,33 | 21.424.838,82 | 11,0643% | 11,06% |
| 309 | 119.339,52 | 21.544.178,34 | 11,0975% | 11,1% |
| 310 | 119.661,71 | 21.663.840,05 | 11,1307% | 11,13% |
| 311 | 119.983,9 | 21.783.823,95 | 11,1639% | 11,16% |
| 312 | 120.306,09 | 21.904.130,04 | 11,1971% | 11,2% |
| 313 | 120.628,28 | 22.024.758,32 | 11,2303% | 11,23% |
| 314 | 120.950,47 | 22.145.708,79 | 11,2635% | 11,26% |
| 315 | 121.272,66 | 22.266.981,45 | 11,2967% | 11,3% |
| 316 | 121.594,85 | 22.388.576,3 | 11,3299% | 11,33% |
| 317 | 121.917,04 | 22.510.493,34 | 11,3631% | 11,36% |
| 318 | 122.239,23 | 22.632.732,57 | 11,3963% | 11,4% |
| 319 | 122.561,42 | 22.755.293,99 | 11,4295% | 11,43% |
| 320 | 122.883,61 | 22.878.177,6 | 11,4627% | 11,46% |
| 321 | 123.205,8 | 23.001.383,4 | 11,4960% | 11,5% |
| 322 | 123.527,99 | 23.124.911,39 | 11,5292% | 11,53% |
| 323 | 123.850,18 | 23.248.761,57 | 11,5624% | 11,56% |
| 324 | 124.172,37 | 23.372.933,94 | 11,5956% | 11,6% |
| 325 | 124.494,56 | 23.497.428,5 | 11,6288% | 11,63% |
| 326 | 124.816,75 | 23.622.245,25 | 11,6620% | 11,66% |
| 327 | 125.138,94 | 23.747.384,19 | 11,6952% | 11,7% |
| 328 | 125.461,13 | 23.872.845,32 | 11,7284% | 11,73% |
| 329 | 125.783,32 | 23.998.628,64 | 11,7616% | 11,76% |
| 330 | 126.105,51 | 24.124.734,15 | 11,7948% | 11,79% |
| 331 | 126.427,7 | 24.251.161,85 | 11,8280% | 11,83% |
| 332 | 126.749,89 | 24.377.911,74 | 11,8612% | 11,86% |
| 333 | 127.072,08 | 24.504.983,82 | 11,8944% | 11,89% |
| 334 | 127.394,27 | 24.632.378,09 | 11,9276% | 11,93% |
| 335 | 127.716,46 | 24.760.094,55 | 11,9608% | 11,96% |
| 336 | 128.038,65 | 24.888.133,2 | 11,9940% | 11,99% |
| 337 | 128.360,84 | 25.016.494,04 | 12,0272% | 12,03% |
| 338 | 128.683,03 | 25.145.177,07 | 12,0605% | 12,06% |
| 339 | 129.005,22 | 25.274.182,29 | 12,0937% | 12,09% |
| 340 | 129.327,41 | 25.403.509,7 | 12,1269% | 12,13% |
| 341 | 129.649,6 | 25.533.159,3 | 12,1601% | 12,16% |
| 342 | 129.971,79 | 25.663.131,09 | 12,1933% | 12,19% |
| 343 | 130.293,98 | 25.793.425,07 | 12,2265% | 12,23% |
| 344 | 130.616,17 | 25.924.041,24 | 12,2597% | 12,26% |
| 345 | 130.938,36 | 26.054.979,6 | 12,2929% | 12,29% |
| 346 | 131.260,55 | 26.186.240,15 | 12,3261% | 12,33% |
| 347 | 131.582,74 | 26.317.822,89 | 12,3593% | 12,36% |
| 348 | 131.904,93 | 26.449.727,82 | 12,3925% | 12,39% |
| 349 | 132.227,12 | 26.581.954,94 | 12,4257% | 12,43% |
| 350 | 132.549,31 | 26.714.504,25 | 12,4589% | 12,46% |
| 351 | 132.871,5 | 26.847.375,75 | 12,4921% | 12,49% |
| 352 | 133.193,69 | 26.980.569,44 | 12,5253% | 12,53% |
| 353 | 133.515,88 | 27.114.085,32 | 12,5585% | 12,56% |
| 354 | 133.838,07 | 27.247.923,39 | 12,5918% | 12,59% |
| 355 | 134.160,26 | 27.382.083,65 | 12,6250% | 12,62% |
| 356 | 134.482,45 | 27.516.566,1 | 12,6582% | 12,66% |
| 357 | 134.804,64 | 27.651.370,74 | 12,6914% | 12,69% |
| 358 | 135.126,83 | 27.786.497,57 | 12,7246% | 12,72% |
| 359 | 135.449,02 | 27.921.946,59 | 12,7578% | 12,76% |
| 360 | 135.771,21 | 28.057.717,8 | 12,7910% | 12,79% |
| 361 | 136.093,4 | 28.193.811,2 | 12,8242% | 12,82% |
| 362 | 136.415,59 | 28.330.226,79 | 12,8574% | 12,86% |
| 363 | 136.737,78 | 28.466.964,57 | 12,8906% | 12,89% |
| 364 | 137.059,97 | 28.604.024,54 | 12,9238% | 12,92% |
| 365 | 137.382,16 | 28.741.406,7 | 12,9570% | 12,96% |
| 366 | 137.704,35 | 28.879.111,05 | 12,9902% | 12,99% |
| 367 | 138.026,54 | 29.017.137,59 | 13,0234% | 13,02% |
| 368 | 138.348,73 | 29.155.486,32 | 13,0566% | 13,06% |
| 369 | 138.670,92 | 29.294.157,24 | 13,0898% | 13,09% |
| 370 | 138.993,11 | 29.433.150,35 | 13,1231% | 13,12% |
| 371 | 139.315,3 | 29.572.465,65 | 13,1563% | 13,16% |
| 372 | 139.637,49 | 29.712.103,14 | 13,1895% | 13,19% |
| 373 | 139.959,68 | 29.852.062,82 | 13,2227% | 13,22% |
| 374 | 140.281,87 | 29.992.344,69 | 13,2559% | 13,26% |
| 375 | 140.604,06 | 30.132.948,75 | 13,2891% | 13,29% |
| 376 | 140.926,25 | 30.273.875 | 13,3223% | 13,32% |
| 377 | 141.248,44 | 30.415.123,44 | 13,3555% | 13,36% |
| 378 | 141.570,63 | 30.556.694,07 | 13,3887% | 13,39% |
| 379 | 141.892,82 | 30.698.586,89 | 13,4219% | 13,42% |
| 380 | 142.215,01 | 30.840.801,9 | 13,4551% | 13,46% |
| 381 | 142.537,2 | 30.983.339,1 | 13,4883% | 13,49% |
| 382 | 142.859,39 | 31.126.198,49 | 13,5215% | 13,52% |
| 383 | 143.181,58 | 31.269.380,07 | 13,5547% | 13,55% |
| 384 | 143.503,77 | 31.412.883,84 | 13,5879% | 13,59% |
| 385 | 143.825,96 | 31.556.709,8 | 13,6211% | 13,62% |
| 386 | 144.148,15 | 31.700.857,95 | 13,6543% | 13,65% |
| 387 | 144.470,34 | 31.845.328,29 | 13,6876% | 13,69% |
| 388 | 144.792,53 | 31.990.120,82 | 13,7208% | 13,72% |
| 389 | 145.114,72 | 32.135.235,54 | 13,7540% | 13,75% |
| 390 | 145.436,91 | 32.280.672,45 | 13,7872% | 13,79% |
| 391 | 145.759,1 | 32.426.431,55 | 13,8204% | 13,82% |
| 392 | 146.081,29 | 32.572.512,84 | 13,8536% | 13,85% |
| 393 | 146.403,48 | 32.718.916,32 | 13,8868% | 13,89% |
| 394 | 146.725,67 | 32.865.641,99 | 13,9200% | 13,92% |
| 395 | 147.047,86 | 33.012.689,85 | 13,9532% | 13,95% |
| 396 | 147.370,05 | 33.160.059,9 | 13,9864% | 13,99% |
| 397 | 147.692,24 | 33.307.752,14 | 14,0196% | 14,02% |
| 398 | 148.014,43 | 33.455.766,57 | 14,0528% | 14,05% |
| 399 | 148.336,62 | 33.604.103,19 | 14,0860% | 14,09% |
| 400 | 148.658,81 | 33.752.762 | 14,1192% | 14,12% |
| 401 | 148.981 | 33.901.743 | 14,1524% | 14,15% |
| 402 | 149.303,19 | 34.051.046,19 | 14,1856% | 14,19% |
| 403 | 149.625,38 | 34.200.671,57 | 14,2189% | 14,22% |
| 404 | 149.947,57 | 34.350.619,14 | 14,2521% | 14,25% |
| 405 | 150.269,76 | 34.500.888,9 | 14,2853% | 14,29% |
| 406 | 150.591,95 | 34.651.480,85 | 14,3185% | 14,32% |
| 407 | 150.914,14 | 34.802.394,99 | 14,3517% | 14,35% |
| 408 | 151.236,33 | 34.953.631,32 | 14,3849% | 14,38% |
| 409 | 151.558,52 | 35.105.189,84 | 14,4181% | 14,42% |
| 410 | 151.880,71 | 35.257.070,55 | 14,4513% | 14,45% |
| 411 | 152.202,9 | 35.409.273,45 | 14,4845% | 14,48% |
| 412 | 152.525,09 | 35.561.798,54 | 14,5177% | 14,52% |
| 413 | 152.847,28 | 35.714.645,82 | 14,5509% | 14,55% |
| 414 | 153.169,47 | 35.867.815,29 | 14,5841% | 14,58% |
| 415 | 153.491,66 | 36.021.306,95 | 14,6173% | 14,62% |
| 416 | 153.813,85 | 36.175.120,8 | 14,6505% | 14,65% |
| 417 | 154.136,04 | 36.329.256,84 | 14,6837% | 14,68% |
| 418 | 154.458,23 | 36.483.715,07 | 14,7169% | 14,72% |
| 419 | 154.780,42 | 36.638.495,49 | 14,7501% | 14,75% |
| 420 | 155.102,61 | 36.793.598,1 | 14,7834% | 14,78% |
| 421 | 155.424,8 | 36.949.022,9 | 14,8166% | 14,82% |
| 422 | 155.746,99 | 37.104.769,89 | 14,8498% | 14,85% |
| 423 | 156.069,18 | 37.260.839,07 | 14,8830% | 14,88% |
| 424 | 156.391,37 | 37.417.230,44 | 14,9162% | 14,92% |
| 425 | 156.713,56 | 37.573.944 | 14,9494% | 14,95% |
| 426 | 157.035,75 | 37.730.979,75 | 14,9826% | 14,98% |
| 427 | 157.357,94 | 37.888.337,69 | 15,0158% | 15,02% |
| 428 | 157.680,13 | 38.046.017,82 | 15,0490% | 15,05% |
| 429 | 158.002,32 | 38.204.020,14 | 15,0822% | 15,08% |
| 430 | 158.324,51 | 38.362.344,65 | 15,1154% | 15,12% |
| 431 | 158.646,7 | 38.520.991,35 | 15,1486% | 15,15% |
| 432 | 158.968,89 | 38.679.960,24 | 15,1818% | 15,18% |
| 433 | 159.291,08 | 38.839.251,32 | 15,2150% | 15,22% |
| 434 | 159.613,27 | 38.998.864,59 | 15,2482% | 15,25% |
| 435 | 159.935,46 | 39.158.800,05 | 15,2814% | 15,28% |
| 436 | 160.257,65 | 39.319.057,7 | 15,3147% | 15,31% |
| 437 | 160.579,84 | 39.479.637,54 | 15,3479% | 15,35% |
| 438 | 160.902,03 | 39.640.539,57 | 15,3811% | 15,38% |
| 439 | 161.224,22 | 39.801.763,79 | 15,4143% | 15,41% |
| 440 | 161.546,41 | 39.963.310,2 | 15,4475% | 15,45% |
| 441 | 161.868,6 | 40.125.178,8 | 15,4807% | 15,48% |
| 442 | 162.190,79 | 40.287.369,59 | 15,5139% | 15,51% |
| 443 | 162.512,98 | 40.449.882,57 | 15,5471% | 15,55% |
| 444 | 162.835,17 | 40.612.717,74 | 15,5803% | 15,58% |
| 445 | 163.157,36 | 40.775.875,1 | 15,6135% | 15,61% |
| 446 | 163.479,55 | 40.939.354,65 | 15,6467% | 15,65% |
| 447 | 163.801,74 | 41.103.156,39 | 15,6799% | 15,68% |
| 448 | 164.123,93 | 41.267.280,32 | 15,7131% | 15,71% |
| 449 | 164.446,12 | 41.431.726,44 | 15,7463% | 15,75% |
| 450 | 164.768,31 | 41.596.494,75 | 15,7795% | 15,78% |
| 451 | 165.090,5 | 41.761.585,25 | 15,8127% | 15,81% |
| 452 | 165.412,69 | 41.926.997,94 | 15,8460% | 15,85% |
| 453 | 165.734,88 | 42.092.732,82 | 15,8792% | 15,88% |
| 454 | 166.057,07 | 42.258.789,89 | 15,9124% | 15,91% |
| 455 | 166.379,26 | 42.425.169,15 | 15,9456% | 15,95% |
| 456 | 166.701,45 | 42.591.870,6 | 15,9788% | 15,98% |
| 457 | 167.023,64 | 42.758.894,24 | 16,0120% | 16,01% |
| 458 | 167.345,83 | 42.926.240,07 | 16,0452% | 16,05% |
| 459 | 167.668,02 | 43.093.908,09 | 16,0784% | 16,08% |
| 460 | 167.990,21 | 43.261.898,3 | 16,1116% | 16,11% |
| 461 | 168.312,4 | 43.430.210,7 | 16,1448% | 16,14% |
| 462 | 168.634,59 | 43.598.845,29 | 16,1780% | 16,18% |
| 463 | 168.956,78 | 43.767.802,07 | 16,2112% | 16,21% |
| 464 | 169.278,97 | 43.937.081,04 | 16,2444% | 16,24% |
| 465 | 169.601,16 | 44.106.682,2 | 16,2776% | 16,28% |
| 466 | 169.923,35 | 44.276.605,55 | 16,3108% | 16,31% |
| 467 | 170.245,54 | 44.446.851,09 | 16,3440% | 16,34% |
| 468 | 170.567,73 | 44.617.418,82 | 16,3772% | 16,38% |
| 469 | 170.889,92 | 44.788.308,74 | 16,4105% | 16,41% |
| 470 | 171.212,11 | 44.959.520,85 | 16,4437% | 16,44% |
| 471 | 171.534,3 | 45.131.055,15 | 16,4769% | 16,48% |
| 472 | 171.856,49 | 45.302.911,64 | 16,5101% | 16,51% |
| 473 | 172.178,68 | 45.475.090,32 | 16,5433% | 16,54% |
| 474 | 172.500,87 | 45.647.591,19 | 16,5765% | 16,58% |
| 475 | 172.823,06 | 45.820.414,25 | 16,6097% | 16,61% |
| 476 | 173.145,25 | 45.993.559,5 | 16,6429% | 16,64% |
| 477 | 173.467,44 | 46.167.026,94 | 16,6761% | 16,68% |
| 478 | 173.789,63 | 46.340.816,57 | 16,7093% | 16,71% |
| 479 | 174.111,82 | 46.514.928,39 | 16,7425% | 16,74% |
| 480 | 174.434,01 | 46.689.362,4 | 16,7757% | 16,78% |
| 481 | 174.756,2 | 46.864.118,6 | 16,8089% | 16,81% |
| 482 | 175.078,39 | 47.039.196,99 | 16,8421% | 16,84% |
| 483 | 175.400,58 | 47.214.597,57 | 16,8753% | 16,88% |
| 484 | 175.722,77 | 47.390.320,34 | 16,9085% | 16,91% |
| 485 | 176.044,96 | 47.566.365,3 | 16,9418% | 16,94% |
| 486 | 176.367,15 | 47.742.732,45 | 16,9750% | 16,97% |
| 487 | 176.689,34 | 47.919.421,79 | 17,0082% | 17,01% |
| 488 | 177.011,53 | 48.096.433,32 | 17,0414% | 17,04% |
| 489 | 177.333,72 | 48.273.767,04 | 17,0746% | 17,07% |
| 490 | 177.655,91 | 48.451.422,95 | 17,1078% | 17,11% |
| 491 | 177.978,1 | 48.629.401,05 | 17,1410% | 17,14% |
| 492 | 178.300,29 | 48.807.701,34 | 17,1742% | 17,17% |
| 493 | 178.622,48 | 48.986.323,82 | 17,2074% | 17,21% |
| 494 | 178.944,67 | 49.165.268,49 | 17,2406% | 17,24% |
| 495 | 179.266,86 | 49.344.535,35 | 17,2738% | 17,27% |
| 496 | 179.589,05 | 49.524.124,4 | 17,3070% | 17,31% |
| 497 | 179.911,24 | 49.704.035,64 | 17,3402% | 17,34% |
| 498 | 180.233,43 | 49.884.269,07 | 17,3734% | 17,37% |
| 499 | 180.555,62 | 50.064.824,69 | 17,4066% | 17,41% |
| 500 | 180.877,81 | 50.245.702,5 | 17,4398% | 17,44% |

### Anexo — Laser

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 32.032 | 32.032 | 0,5990% | 0,599% |
| 2 | 32.545,33 | 64.577,33 | 0,6219% | 0,6219% |
| 3 | 33.058,66 | 97.635,99 | 0,6447% | 0,6447% |
| 4 | 33.571,99 | 131.207,98 | 0,6676% | 0,6676% |
| 5 | 34.085,32 | 165.293,3 | 0,6905% | 0,6905% |
| 6 | 34.598,65 | 199.891,95 | 0,7133% | 0,7133% |
| 7 | 35.111,98 | 235.003,93 | 0,7362% | 0,7362% |
| 8 | 35.625,31 | 270.629,24 | 0,7590% | 0,759% |
| 9 | 36.138,64 | 306.767,88 | 0,7819% | 0,7819% |
| 10 | 36.651,97 | 343.419,85 | 0,8048% | 0,8048% |
| 11 | 37.165,3 | 380.585,15 | 0,8276% | 0,8276% |
| 12 | 37.678,63 | 418.263,78 | 0,8505% | 0,8505% |
| 13 | 38.191,96 | 456.455,74 | 0,8734% | 0,8734% |
| 14 | 38.705,29 | 495.161,03 | 0,8962% | 0,8962% |
| 15 | 39.218,62 | 534.379,65 | 0,9191% | 0,9191% |
| 16 | 39.731,95 | 574.111,6 | 0,9419% | 0,9419% |
| 17 | 40.245,28 | 614.356,88 | 0,9648% | 0,9648% |
| 18 | 40.758,61 | 655.115,49 | 0,9877% | 0,9877% |
| 19 | 41.271,94 | 696.387,43 | 1,0105% | 1,011% |
| 20 | 41.785,27 | 738.172,7 | 1,0334% | 1,033% |
| 21 | 42.298,6 | 780.471,3 | 1,0563% | 1,056% |
| 22 | 42.811,93 | 823.283,23 | 1,0791% | 1,079% |
| 23 | 43.325,26 | 866.608,49 | 1,1020% | 1,102% |
| 24 | 43.838,59 | 910.447,08 | 1,1248% | 1,125% |
| 25 | 44.351,92 | 954.799 | 1,1477% | 1,148% |
| 26 | 44.865,25 | 999.664,25 | 1,1706% | 1,171% |
| 27 | 45.378,58 | 1.045.042,83 | 1,1934% | 1,193% |
| 28 | 45.891,91 | 1.090.934,74 | 1,2163% | 1,216% |
| 29 | 46.405,24 | 1.137.339,98 | 1,2392% | 1,239% |
| 30 | 46.918,57 | 1.184.258,55 | 1,2620% | 1,262% |
| 31 | 47.431,9 | 1.231.690,45 | 1,2849% | 1,285% |
| 32 | 47.945,23 | 1.279.635,68 | 1,3077% | 1,308% |
| 33 | 48.458,56 | 1.328.094,24 | 1,3306% | 1,331% |
| 34 | 48.971,89 | 1.377.066,13 | 1,3535% | 1,353% |
| 35 | 49.485,22 | 1.426.551,35 | 1,3763% | 1,376% |
| 36 | 49.998,55 | 1.476.549,9 | 1,3992% | 1,399% |
| 37 | 50.511,88 | 1.527.061,78 | 1,4221% | 1,422% |
| 38 | 51.025,21 | 1.578.086,99 | 1,4449% | 1,445% |
| 39 | 51.538,54 | 1.629.625,53 | 1,4678% | 1,468% |
| 40 | 52.051,87 | 1.681.677,4 | 1,4906% | 1,491% |
| 41 | 52.565,2 | 1.734.242,6 | 1,5135% | 1,514% |
| 42 | 53.078,53 | 1.787.321,13 | 1,5364% | 1,536% |
| 43 | 53.591,86 | 1.840.912,99 | 1,5592% | 1,559% |
| 44 | 54.105,19 | 1.895.018,18 | 1,5821% | 1,582% |
| 45 | 54.618,52 | 1.949.636,7 | 1,6050% | 1,605% |
| 46 | 55.131,85 | 2.004.768,55 | 1,6278% | 1,628% |
| 47 | 55.645,18 | 2.060.413,73 | 1,6507% | 1,651% |
| 48 | 56.158,51 | 2.116.572,24 | 1,6735% | 1,674% |
| 49 | 56.671,84 | 2.173.244,08 | 1,6964% | 1,696% |
| 50 | 57.185,17 | 2.230.429,25 | 1,7193% | 1,719% |
| 51 | 57.698,5 | 2.288.127,75 | 1,7421% | 1,742% |
| 52 | 58.211,83 | 2.346.339,58 | 1,7650% | 1,765% |
| 53 | 58.725,16 | 2.405.064,74 | 1,7879% | 1,788% |
| 54 | 59.238,49 | 2.464.303,23 | 1,8107% | 1,811% |
| 55 | 59.751,82 | 2.524.055,05 | 1,8336% | 1,834% |
| 56 | 60.265,15 | 2.584.320,2 | 1,8564% | 1,856% |
| 57 | 60.778,48 | 2.645.098,68 | 1,8793% | 1,879% |
| 58 | 61.291,81 | 2.706.390,49 | 1,9022% | 1,902% |
| 59 | 61.805,14 | 2.768.195,63 | 1,9250% | 1,925% |
| 60 | 62.318,47 | 2.830.514,1 | 1,9479% | 1,948% |
| 61 | 62.831,8 | 2.893.345,9 | 1,9708% | 1,971% |
| 62 | 63.345,13 | 2.956.691,03 | 1,9936% | 1,994% |
| 63 | 63.858,46 | 3.020.549,49 | 2,0165% | 2,016% |
| 64 | 64.371,79 | 3.084.921,28 | 2,0393% | 2,039% |
| 65 | 64.885,12 | 3.149.806,4 | 2,0622% | 2,062% |
| 66 | 65.398,45 | 3.215.204,85 | 2,0851% | 2,085% |
| 67 | 65.911,78 | 3.281.116,63 | 2,1079% | 2,108% |
| 68 | 66.425,11 | 3.347.541,74 | 2,1308% | 2,131% |
| 69 | 66.938,44 | 3.414.480,18 | 2,1537% | 2,154% |
| 70 | 67.451,77 | 3.481.931,95 | 2,1765% | 2,177% |
| 71 | 67.965,1 | 3.549.897,05 | 2,1994% | 2,199% |
| 72 | 68.478,43 | 3.618.375,48 | 2,2222% | 2,222% |
| 73 | 68.991,76 | 3.687.367,24 | 2,2451% | 2,245% |
| 74 | 69.505,09 | 3.756.872,33 | 2,2680% | 2,268% |
| 75 | 70.018,42 | 3.826.890,75 | 2,2908% | 2,291% |
| 76 | 70.531,75 | 3.897.422,5 | 2,3137% | 2,314% |
| 77 | 71.045,08 | 3.968.467,58 | 2,3366% | 2,337% |
| 78 | 71.558,41 | 4.040.025,99 | 2,3594% | 2,359% |
| 79 | 72.071,74 | 4.112.097,73 | 2,3823% | 2,382% |
| 80 | 72.585,07 | 4.184.682,8 | 2,4051% | 2,405% |
| 81 | 73.098,4 | 4.257.781,2 | 2,4280% | 2,428% |
| 82 | 73.611,73 | 4.331.392,93 | 2,4509% | 2,451% |
| 83 | 74.125,06 | 4.405.517,99 | 2,4737% | 2,474% |
| 84 | 74.638,39 | 4.480.156,38 | 2,4966% | 2,497% |
| 85 | 75.151,72 | 4.555.308,1 | 2,5195% | 2,519% |
| 86 | 75.665,05 | 4.630.973,15 | 2,5423% | 2,542% |
| 87 | 76.178,38 | 4.707.151,53 | 2,5652% | 2,565% |
| 88 | 76.691,71 | 4.783.843,24 | 2,5880% | 2,588% |
| 89 | 77.205,04 | 4.861.048,28 | 2,6109% | 2,611% |
| 90 | 77.718,37 | 4.938.766,65 | 2,6338% | 2,634% |
| 91 | 78.231,7 | 5.016.998,35 | 2,6566% | 2,657% |
| 92 | 78.745,03 | 5.095.743,38 | 2,6795% | 2,679% |
| 93 | 79.258,36 | 5.175.001,74 | 2,7024% | 2,702% |
| 94 | 79.771,69 | 5.254.773,43 | 2,7252% | 2,725% |
| 95 | 80.285,02 | 5.335.058,45 | 2,7481% | 2,748% |
| 96 | 80.798,35 | 5.415.856,8 | 2,7709% | 2,771% |
| 97 | 81.311,68 | 5.497.168,48 | 2,7938% | 2,794% |
| 98 | 81.825,01 | 5.578.993,49 | 2,8167% | 2,817% |
| 99 | 82.338,34 | 5.661.331,83 | 2,8395% | 2,84% |
| 100 | 82.851,67 | 5.744.183,5 | 2,8624% | 2,862% |
| 101 | 83.365 | 5.827.548,5 | 2,8853% | 2,885% |
| 102 | 83.878,33 | 5.911.426,83 | 2,9081% | 2,908% |
| 103 | 84.391,66 | 5.995.818,49 | 2,9310% | 2,931% |
| 104 | 84.904,99 | 6.080.723,48 | 2,9538% | 2,954% |
| 105 | 85.418,32 | 6.166.141,8 | 2,9767% | 2,977% |
| 106 | 85.931,65 | 6.252.073,45 | 2,9996% | 3% |
| 107 | 86.444,98 | 6.338.518,43 | 3,0224% | 3,022% |
| 108 | 86.958,31 | 6.425.476,74 | 3,0453% | 3,045% |
| 109 | 87.471,64 | 6.512.948,38 | 3,0682% | 3,068% |
| 110 | 87.984,97 | 6.600.933,35 | 3,0910% | 3,091% |
| 111 | 88.498,3 | 6.689.431,65 | 3,1139% | 3,114% |
| 112 | 89.011,63 | 6.778.443,28 | 3,1367% | 3,137% |
| 113 | 89.524,96 | 6.867.968,24 | 3,1596% | 3,16% |
| 114 | 90.038,29 | 6.958.006,53 | 3,1825% | 3,182% |
| 115 | 90.551,62 | 7.048.558,15 | 3,2053% | 3,205% |
| 116 | 91.064,95 | 7.139.623,1 | 3,2282% | 3,228% |
| 117 | 91.578,28 | 7.231.201,38 | 3,2511% | 3,251% |
| 118 | 92.091,61 | 7.323.292,99 | 3,2739% | 3,274% |
| 119 | 92.604,94 | 7.415.897,93 | 3,2968% | 3,297% |
| 120 | 93.118,27 | 7.509.016,2 | 3,3196% | 3,32% |
| 121 | 93.631,6 | 7.602.647,8 | 3,3425% | 3,343% |
| 122 | 94.144,93 | 7.696.792,73 | 3,3654% | 3,365% |
| 123 | 94.658,26 | 7.791.450,99 | 3,3882% | 3,388% |
| 124 | 95.171,59 | 7.886.622,58 | 3,4111% | 3,411% |
| 125 | 95.684,92 | 7.982.307,5 | 3,4340% | 3,434% |
| 126 | 96.198,25 | 8.078.505,75 | 3,4568% | 3,457% |
| 127 | 96.711,58 | 8.175.217,33 | 3,4797% | 3,48% |
| 128 | 97.224,91 | 8.272.442,24 | 3,5026% | 3,503% |
| 129 | 97.738,24 | 8.370.180,48 | 3,5254% | 3,525% |
| 130 | 98.251,57 | 8.468.432,05 | 3,5483% | 3,548% |
| 131 | 98.764,9 | 8.567.196,95 | 3,5711% | 3,571% |
| 132 | 99.278,23 | 8.666.475,18 | 3,5940% | 3,594% |
| 133 | 99.791,56 | 8.766.266,74 | 3,6169% | 3,617% |
| 134 | 100.304,89 | 8.866.571,63 | 3,6397% | 3,64% |
| 135 | 100.818,22 | 8.967.389,85 | 3,6626% | 3,663% |
| 136 | 101.331,55 | 9.068.721,4 | 3,6855% | 3,685% |
| 137 | 101.844,88 | 9.170.566,28 | 3,7083% | 3,708% |
| 138 | 102.358,21 | 9.272.924,49 | 3,7312% | 3,731% |
| 139 | 102.871,54 | 9.375.796,03 | 3,7540% | 3,754% |
| 140 | 103.384,87 | 9.479.180,9 | 3,7769% | 3,777% |
| 141 | 103.898,2 | 9.583.079,1 | 3,7998% | 3,8% |
| 142 | 104.411,53 | 9.687.490,63 | 3,8226% | 3,823% |
| 143 | 104.924,86 | 9.792.415,49 | 3,8455% | 3,845% |
| 144 | 105.438,19 | 9.897.853,68 | 3,8684% | 3,868% |
| 145 | 105.951,52 | 10.003.805,2 | 3,8912% | 3,891% |
| 146 | 106.464,85 | 10.110.270,05 | 3,9141% | 3,914% |
| 147 | 106.978,18 | 10.217.248,23 | 3,9369% | 3,937% |
| 148 | 107.491,51 | 10.324.739,74 | 3,9598% | 3,96% |
| 149 | 108.004,84 | 10.432.744,58 | 3,9827% | 3,983% |
| 150 | 108.518,17 | 10.541.262,75 | 4,0055% | 4,006% |
| 151 | 109.031,5 | 10.650.294,25 | 4,0284% | 4,028% |
| 152 | 109.544,83 | 10.759.839,08 | 4,0513% | 4,051% |
| 153 | 110.058,16 | 10.869.897,24 | 4,0741% | 4,074% |
| 154 | 110.571,49 | 10.980.468,73 | 4,0970% | 4,097% |
| 155 | 111.084,82 | 11.091.553,55 | 4,1198% | 4,12% |
| 156 | 111.598,15 | 11.203.151,7 | 4,1427% | 4,143% |
| 157 | 112.111,48 | 11.315.263,18 | 4,1656% | 4,166% |
| 158 | 112.624,81 | 11.427.887,99 | 4,1884% | 4,188% |
| 159 | 113.138,14 | 11.541.026,13 | 4,2113% | 4,211% |
| 160 | 113.651,47 | 11.654.677,6 | 4,2342% | 4,234% |
| 161 | 114.164,8 | 11.768.842,4 | 4,2570% | 4,257% |
| 162 | 114.678,13 | 11.883.520,53 | 4,2799% | 4,28% |
| 163 | 115.191,46 | 11.998.711,99 | 4,3027% | 4,303% |
| 164 | 115.704,79 | 12.114.416,78 | 4,3256% | 4,326% |
| 165 | 116.218,12 | 12.230.634,9 | 4,3485% | 4,348% |
| 166 | 116.731,45 | 12.347.366,35 | 4,3713% | 4,371% |
| 167 | 117.244,78 | 12.464.611,13 | 4,3942% | 4,394% |
| 168 | 117.758,11 | 12.582.369,24 | 4,4171% | 4,417% |
| 169 | 118.271,44 | 12.700.640,68 | 4,4399% | 4,44% |
| 170 | 118.784,77 | 12.819.425,45 | 4,4628% | 4,463% |
| 171 | 119.298,1 | 12.938.723,55 | 4,4856% | 4,486% |
| 172 | 119.811,43 | 13.058.534,98 | 4,5085% | 4,509% |
| 173 | 120.324,76 | 13.178.859,74 | 4,5314% | 4,531% |
| 174 | 120.838,09 | 13.299.697,83 | 4,5542% | 4,554% |
| 175 | 121.351,42 | 13.421.049,25 | 4,5771% | 4,577% |
| 176 | 121.864,75 | 13.542.914 | 4,6000% | 4,6% |
| 177 | 122.378,08 | 13.665.292,08 | 4,6228% | 4,623% |
| 178 | 122.891,41 | 13.788.183,49 | 4,6457% | 4,646% |
| 179 | 123.404,74 | 13.911.588,23 | 4,6685% | 4,669% |
| 180 | 123.918,07 | 14.035.506,3 | 4,6914% | 4,691% |
| 181 | 124.431,4 | 14.159.937,7 | 4,7143% | 4,714% |
| 182 | 124.944,73 | 14.284.882,43 | 4,7371% | 4,737% |
| 183 | 125.458,06 | 14.410.340,49 | 4,7600% | 4,76% |
| 184 | 125.971,39 | 14.536.311,88 | 4,7829% | 4,783% |
| 185 | 126.484,72 | 14.662.796,6 | 4,8057% | 4,806% |
| 186 | 126.998,05 | 14.789.794,65 | 4,8286% | 4,829% |
| 187 | 127.511,38 | 14.917.306,03 | 4,8514% | 4,851% |
| 188 | 128.024,71 | 15.045.330,74 | 4,8743% | 4,874% |
| 189 | 128.538,04 | 15.173.868,78 | 4,8972% | 4,897% |
| 190 | 129.051,37 | 15.302.920,15 | 4,9200% | 4,92% |
| 191 | 129.564,7 | 15.432.484,85 | 4,9429% | 4,943% |
| 192 | 130.078,03 | 15.562.562,88 | 4,9658% | 4,966% |
| 193 | 130.591,36 | 15.693.154,24 | 4,9886% | 4,989% |
| 194 | 131.104,69 | 15.824.258,93 | 5,0115% | 5,011% |
| 195 | 131.618,02 | 15.955.876,95 | 5,0343% | 5,034% |
| 196 | 132.131,35 | 16.088.008,3 | 5,0572% | 5,057% |
| 197 | 132.644,68 | 16.220.652,98 | 5,0801% | 5,08% |
| 198 | 133.158,01 | 16.353.810,99 | 5,1029% | 5,103% |
| 199 | 133.671,34 | 16.487.482,33 | 5,1258% | 5,126% |
| 200 | 134.184,67 | 16.621.667 | 5,1487% | 5,149% |
| 201 | 134.698 | 16.756.365 | 5,1715% | 5,172% |
| 202 | 135.211,33 | 16.891.576,33 | 5,1944% | 5,194% |
| 203 | 135.724,66 | 17.027.300,99 | 5,2172% | 5,217% |
| 204 | 136.237,99 | 17.163.538,98 | 5,2401% | 5,24% |
| 205 | 136.751,32 | 17.300.290,3 | 5,2630% | 5,263% |
| 206 | 137.264,65 | 17.437.554,95 | 5,2858% | 5,286% |
| 207 | 137.777,98 | 17.575.332,93 | 5,3087% | 5,309% |
| 208 | 138.291,31 | 17.713.624,24 | 5,3316% | 5,332% |
| 209 | 138.804,64 | 17.852.428,88 | 5,3544% | 5,354% |
| 210 | 139.317,97 | 17.991.746,85 | 5,3773% | 5,377% |
| 211 | 139.831,3 | 18.131.578,15 | 5,4001% | 5,4% |
| 212 | 140.344,63 | 18.271.922,78 | 5,4230% | 5,423% |
| 213 | 140.857,96 | 18.412.780,74 | 5,4459% | 5,446% |
| 214 | 141.371,29 | 18.554.152,03 | 5,4687% | 5,469% |
| 215 | 141.884,62 | 18.696.036,65 | 5,4916% | 5,492% |
| 216 | 142.397,95 | 18.838.434,6 | 5,5145% | 5,514% |
| 217 | 142.911,28 | 18.981.345,88 | 5,5373% | 5,537% |
| 218 | 143.424,61 | 19.124.770,49 | 5,5602% | 5,56% |
| 219 | 143.937,94 | 19.268.708,43 | 5,5830% | 5,583% |
| 220 | 144.451,27 | 19.413.159,7 | 5,6059% | 5,606% |
| 221 | 144.964,6 | 19.558.124,3 | 5,6288% | 5,629% |
| 222 | 145.477,93 | 19.703.602,23 | 5,6516% | 5,652% |
| 223 | 145.991,26 | 19.849.593,49 | 5,6745% | 5,674% |
| 224 | 146.504,59 | 19.996.098,08 | 5,6974% | 5,697% |
| 225 | 147.017,92 | 20.143.116 | 5,7202% | 5,72% |
| 226 | 147.531,25 | 20.290.647,25 | 5,7431% | 5,743% |
| 227 | 148.044,58 | 20.438.691,83 | 5,7659% | 5,766% |
| 228 | 148.557,91 | 20.587.249,74 | 5,7888% | 5,789% |
| 229 | 149.071,24 | 20.736.320,98 | 5,8117% | 5,812% |
| 230 | 149.584,57 | 20.885.905,55 | 5,8345% | 5,835% |
| 231 | 150.097,9 | 21.036.003,45 | 5,8574% | 5,857% |
| 232 | 150.611,23 | 21.186.614,68 | 5,8803% | 5,88% |
| 233 | 151.124,56 | 21.337.739,24 | 5,9031% | 5,903% |
| 234 | 151.637,89 | 21.489.377,13 | 5,9260% | 5,926% |
| 235 | 152.151,22 | 21.641.528,35 | 5,9488% | 5,949% |
| 236 | 152.664,55 | 21.794.192,9 | 5,9717% | 5,972% |
| 237 | 153.177,88 | 21.947.370,78 | 5,9946% | 5,995% |
| 238 | 153.691,21 | 22.101.061,99 | 6,0174% | 6,017% |
| 239 | 154.204,54 | 22.255.266,53 | 6,0403% | 6,04% |
| 240 | 154.717,87 | 22.409.984,4 | 6,0632% | 6,063% |
| 241 | 155.231,2 | 22.565.215,6 | 6,0860% | 6,086% |
| 242 | 155.744,53 | 22.720.960,13 | 6,1089% | 6,109% |
| 243 | 156.257,86 | 22.877.217,99 | 6,1317% | 6,132% |
| 244 | 156.771,19 | 23.033.989,18 | 6,1546% | 6,155% |
| 245 | 157.284,52 | 23.191.273,7 | 6,1775% | 6,177% |
| 246 | 157.797,85 | 23.349.071,55 | 6,2003% | 6,2% |
| 247 | 158.311,18 | 23.507.382,73 | 6,2232% | 6,223% |
| 248 | 158.824,51 | 23.666.207,24 | 6,2461% | 6,246% |
| 249 | 159.337,84 | 23.825.545,08 | 6,2689% | 6,269% |
| 250 | 159.851,17 | 23.985.396,25 | 6,2918% | 6,292% |
| 251 | 160.364,5 | 24.145.760,75 | 6,3147% | 6,315% |
| 252 | 160.877,83 | 24.306.638,58 | 6,3375% | 6,338% |
| 253 | 161.391,16 | 24.468.029,74 | 6,3604% | 6,36% |
| 254 | 161.904,49 | 24.629.934,23 | 6,3832% | 6,383% |
| 255 | 162.417,82 | 24.792.352,05 | 6,4061% | 6,406% |
| 256 | 162.931,15 | 24.955.283,2 | 6,4290% | 6,429% |
| 257 | 163.444,48 | 25.118.727,68 | 6,4518% | 6,452% |
| 258 | 163.957,81 | 25.282.685,49 | 6,4747% | 6,475% |
| 259 | 164.471,14 | 25.447.156,63 | 6,4976% | 6,498% |
| 260 | 164.984,47 | 25.612.141,1 | 6,5204% | 6,52% |
| 261 | 165.497,8 | 25.777.638,9 | 6,5433% | 6,543% |
| 262 | 166.011,13 | 25.943.650,03 | 6,5661% | 6,566% |
| 263 | 166.524,46 | 26.110.174,49 | 6,5890% | 6,589% |
| 264 | 167.037,79 | 26.277.212,28 | 6,6119% | 6,612% |
| 265 | 167.551,12 | 26.444.763,4 | 6,6347% | 6,635% |
| 266 | 168.064,45 | 26.612.827,85 | 6,6576% | 6,658% |
| 267 | 168.577,78 | 26.781.405,63 | 6,6805% | 6,68% |
| 268 | 169.091,11 | 26.950.496,74 | 6,7033% | 6,703% |
| 269 | 169.604,44 | 27.120.101,18 | 6,7262% | 6,726% |
| 270 | 170.117,77 | 27.290.218,95 | 6,7490% | 6,749% |
| 271 | 170.631,1 | 27.460.850,05 | 6,7719% | 6,772% |
| 272 | 171.144,43 | 27.631.994,48 | 6,7948% | 6,795% |
| 273 | 171.657,76 | 27.803.652,24 | 6,8176% | 6,818% |
| 274 | 172.171,09 | 27.975.823,33 | 6,8405% | 6,84% |
| 275 | 172.684,42 | 28.148.507,75 | 6,8634% | 6,863% |
| 276 | 173.197,75 | 28.321.705,5 | 6,8862% | 6,886% |
| 277 | 173.711,08 | 28.495.416,58 | 6,9091% | 6,909% |
| 278 | 174.224,41 | 28.669.640,99 | 6,9319% | 6,932% |
| 279 | 174.737,74 | 28.844.378,73 | 6,9548% | 6,955% |
| 280 | 175.251,07 | 29.019.629,8 | 6,9777% | 6,978% |
| 281 | 175.764,4 | 29.195.394,2 | 7,0005% | 7,001% |
| 282 | 176.277,73 | 29.371.671,93 | 7,0234% | 7,023% |
| 283 | 176.791,06 | 29.548.462,99 | 7,0463% | 7,046% |
| 284 | 177.304,39 | 29.725.767,38 | 7,0691% | 7,069% |
| 285 | 177.817,72 | 29.903.585,1 | 7,0920% | 7,092% |
| 286 | 178.331,05 | 30.081.916,15 | 7,1148% | 7,115% |
| 287 | 178.844,38 | 30.260.760,53 | 7,1377% | 7,138% |
| 288 | 179.357,71 | 30.440.118,24 | 7,1606% | 7,161% |
| 289 | 179.871,04 | 30.619.989,28 | 7,1834% | 7,183% |
| 290 | 180.384,37 | 30.800.373,65 | 7,2063% | 7,206% |
| 291 | 180.897,7 | 30.981.271,35 | 7,2292% | 7,229% |
| 292 | 181.411,03 | 31.162.682,38 | 7,2520% | 7,252% |
| 293 | 181.924,36 | 31.344.606,74 | 7,2749% | 7,275% |
| 294 | 182.437,69 | 31.527.044,43 | 7,2977% | 7,298% |
| 295 | 182.951,02 | 31.709.995,45 | 7,3206% | 7,321% |
| 296 | 183.464,35 | 31.893.459,8 | 7,3435% | 7,343% |
| 297 | 183.977,68 | 32.077.437,48 | 7,3663% | 7,366% |
| 298 | 184.491,01 | 32.261.928,49 | 7,3892% | 7,389% |
| 299 | 185.004,34 | 32.446.932,83 | 7,4121% | 7,412% |
| 300 | 185.517,67 | 32.632.450,5 | 7,4349% | 7,435% |
| 301 | 186.031 | 32.818.481,5 | 7,4578% | 7,458% |
| 302 | 186.544,33 | 33.005.025,83 | 7,4806% | 7,481% |
| 303 | 187.057,66 | 33.192.083,49 | 7,5035% | 7,504% |
| 304 | 187.570,99 | 33.379.654,48 | 7,5264% | 7,526% |
| 305 | 188.084,32 | 33.567.738,8 | 7,5492% | 7,549% |
| 306 | 188.597,65 | 33.756.336,45 | 7,5721% | 7,572% |
| 307 | 189.110,98 | 33.945.447,43 | 7,5950% | 7,595% |
| 308 | 189.624,31 | 34.135.071,74 | 7,6178% | 7,618% |
| 309 | 190.137,64 | 34.325.209,38 | 7,6407% | 7,641% |
| 310 | 190.650,97 | 34.515.860,35 | 7,6635% | 7,664% |
| 311 | 191.164,3 | 34.707.024,65 | 7,6864% | 7,686% |
| 312 | 191.677,63 | 34.898.702,28 | 7,7093% | 7,709% |
| 313 | 192.190,96 | 35.090.893,24 | 7,7321% | 7,732% |
| 314 | 192.704,29 | 35.283.597,53 | 7,7550% | 7,755% |
| 315 | 193.217,62 | 35.476.815,15 | 7,7779% | 7,778% |
| 316 | 193.730,95 | 35.670.546,1 | 7,8007% | 7,801% |
| 317 | 194.244,28 | 35.864.790,38 | 7,8236% | 7,824% |
| 318 | 194.757,61 | 36.059.547,99 | 7,8464% | 7,846% |
| 319 | 195.270,94 | 36.254.818,93 | 7,8693% | 7,869% |
| 320 | 195.784,27 | 36.450.603,2 | 7,8922% | 7,892% |
| 321 | 196.297,6 | 36.646.900,8 | 7,9150% | 7,915% |
| 322 | 196.810,93 | 36.843.711,73 | 7,9379% | 7,938% |
| 323 | 197.324,26 | 37.041.035,99 | 7,9608% | 7,961% |
| 324 | 197.837,59 | 37.238.873,58 | 7,9836% | 7,984% |
| 325 | 198.350,92 | 37.437.224,5 | 8,0065% | 8,006% |
| 326 | 198.864,25 | 37.636.088,75 | 8,0293% | 8,029% |
| 327 | 199.377,58 | 37.835.466,33 | 8,0522% | 8,052% |
| 328 | 199.890,91 | 38.035.357,24 | 8,0751% | 8,075% |
| 329 | 200.404,24 | 38.235.761,48 | 8,0979% | 8,098% |
| 330 | 200.917,57 | 38.436.679,05 | 8,1208% | 8,121% |
| 331 | 201.430,9 | 38.638.109,95 | 8,1437% | 8,144% |
| 332 | 201.944,23 | 38.840.054,18 | 8,1665% | 8,167% |
| 333 | 202.457,56 | 39.042.511,74 | 8,1894% | 8,189% |
| 334 | 202.970,89 | 39.245.482,63 | 8,2122% | 8,212% |
| 335 | 203.484,22 | 39.448.966,85 | 8,2351% | 8,235% |
| 336 | 203.997,55 | 39.652.964,4 | 8,2580% | 8,258% |
| 337 | 204.510,88 | 39.857.475,28 | 8,2808% | 8,281% |
| 338 | 205.024,21 | 40.062.499,49 | 8,3037% | 8,304% |
| 339 | 205.537,54 | 40.268.037,03 | 8,3266% | 8,327% |
| 340 | 206.050,87 | 40.474.087,9 | 8,3494% | 8,349% |
| 341 | 206.564,2 | 40.680.652,1 | 8,3723% | 8,372% |
| 342 | 207.077,53 | 40.887.729,63 | 8,3951% | 8,395% |
| 343 | 207.590,86 | 41.095.320,49 | 8,4180% | 8,418% |
| 344 | 208.104,19 | 41.303.424,68 | 8,4409% | 8,441% |
| 345 | 208.617,52 | 41.512.042,2 | 8,4637% | 8,464% |
| 346 | 209.130,85 | 41.721.173,05 | 8,4866% | 8,487% |
| 347 | 209.644,18 | 41.930.817,23 | 8,5095% | 8,509% |
| 348 | 210.157,51 | 42.140.974,74 | 8,5323% | 8,532% |
| 349 | 210.670,84 | 42.351.645,58 | 8,5552% | 8,555% |
| 350 | 211.184,17 | 42.562.829,75 | 8,5780% | 8,578% |
| 351 | 211.697,5 | 42.774.527,25 | 8,6009% | 8,601% |
| 352 | 212.210,83 | 42.986.738,08 | 8,6238% | 8,624% |
| 353 | 212.724,16 | 43.199.462,24 | 8,6466% | 8,647% |
| 354 | 213.237,49 | 43.412.699,73 | 8,6695% | 8,669% |
| 355 | 213.750,82 | 43.626.450,55 | 8,6924% | 8,692% |
| 356 | 214.264,15 | 43.840.714,7 | 8,7152% | 8,715% |
| 357 | 214.777,48 | 44.055.492,18 | 8,7381% | 8,738% |
| 358 | 215.290,81 | 44.270.782,99 | 8,7609% | 8,761% |
| 359 | 215.804,14 | 44.486.587,13 | 8,7838% | 8,784% |
| 360 | 216.317,47 | 44.702.904,6 | 8,8067% | 8,807% |
| 361 | 216.830,8 | 44.919.735,4 | 8,8295% | 8,83% |
| 362 | 217.344,13 | 45.137.079,53 | 8,8524% | 8,852% |
| 363 | 217.857,46 | 45.354.936,99 | 8,8753% | 8,875% |
| 364 | 218.370,79 | 45.573.307,78 | 8,8981% | 8,898% |
| 365 | 218.884,12 | 45.792.191,9 | 8,9210% | 8,921% |
| 366 | 219.397,45 | 46.011.589,35 | 8,9438% | 8,944% |
| 367 | 219.910,78 | 46.231.500,13 | 8,9667% | 8,967% |
| 368 | 220.424,11 | 46.451.924,24 | 8,9896% | 8,99% |
| 369 | 220.937,44 | 46.672.861,68 | 9,0124% | 9,012% |
| 370 | 221.450,77 | 46.894.312,45 | 9,0353% | 9,035% |
| 371 | 221.964,1 | 47.116.276,55 | 9,0582% | 9,058% |
| 372 | 222.477,43 | 47.338.753,98 | 9,0810% | 9,081% |
| 373 | 222.990,76 | 47.561.744,74 | 9,1039% | 9,104% |
| 374 | 223.504,09 | 47.785.248,83 | 9,1267% | 9,127% |
| 375 | 224.017,42 | 48.009.266,25 | 9,1496% | 9,15% |
| 376 | 224.530,75 | 48.233.797 | 9,1725% | 9,172% |
| 377 | 225.044,08 | 48.458.841,08 | 9,1953% | 9,195% |
| 378 | 225.557,41 | 48.684.398,49 | 9,2182% | 9,218% |
| 379 | 226.070,74 | 48.910.469,23 | 9,2411% | 9,241% |
| 380 | 226.584,07 | 49.137.053,3 | 9,2639% | 9,264% |
| 381 | 227.097,4 | 49.364.150,7 | 9,2868% | 9,287% |
| 382 | 227.610,73 | 49.591.761,43 | 9,3097% | 9,31% |
| 383 | 228.124,06 | 49.819.885,49 | 9,3325% | 9,333% |
| 384 | 228.637,39 | 50.048.522,88 | 9,3554% | 9,355% |
| 385 | 229.150,72 | 50.277.673,6 | 9,3782% | 9,378% |
| 386 | 229.664,05 | 50.507.337,65 | 9,4011% | 9,401% |
| 387 | 230.177,38 | 50.737.515,03 | 9,4240% | 9,424% |
| 388 | 230.690,71 | 50.968.205,74 | 9,4468% | 9,447% |
| 389 | 231.204,04 | 51.199.409,78 | 9,4697% | 9,47% |
| 390 | 231.717,37 | 51.431.127,15 | 9,4926% | 9,493% |
| 391 | 232.230,7 | 51.663.357,85 | 9,5154% | 9,515% |
| 392 | 232.744,03 | 51.896.101,88 | 9,5383% | 9,538% |
| 393 | 233.257,36 | 52.129.359,24 | 9,5611% | 9,561% |
| 394 | 233.770,69 | 52.363.129,93 | 9,5840% | 9,584% |
| 395 | 234.284,02 | 52.597.413,95 | 9,6069% | 9,607% |
| 396 | 234.797,35 | 52.832.211,3 | 9,6297% | 9,63% |
| 397 | 235.310,68 | 53.067.521,98 | 9,6526% | 9,653% |
| 398 | 235.824,01 | 53.303.345,99 | 9,6755% | 9,675% |
| 399 | 236.337,34 | 53.539.683,33 | 9,6983% | 9,698% |
| 400 | 236.850,67 | 53.776.534 | 9,7212% | 9,721% |
| 401 | 237.364 | 54.013.898 | 9,7440% | 9,744% |
| 402 | 237.877,33 | 54.251.775,33 | 9,7669% | 9,767% |
| 403 | 238.390,66 | 54.490.165,99 | 9,7898% | 9,79% |
| 404 | 238.903,99 | 54.729.069,98 | 9,8126% | 9,813% |
| 405 | 239.417,32 | 54.968.487,3 | 9,8355% | 9,835% |
| 406 | 239.930,65 | 55.208.417,95 | 9,8584% | 9,858% |
| 407 | 240.443,98 | 55.448.861,93 | 9,8812% | 9,881% |
| 408 | 240.957,31 | 55.689.819,24 | 9,9041% | 9,904% |
| 409 | 241.470,64 | 55.931.289,88 | 9,9269% | 9,927% |
| 410 | 241.983,97 | 56.173.273,85 | 9,9498% | 9,95% |
| 411 | 242.497,3 | 56.415.771,15 | 9,9727% | 9,973% |
| 412 | 243.010,63 | 56.658.781,78 | 9,9955% | 9,996% |
| 413 | 243.523,96 | 56.902.305,74 | 10,0184% | 10,02% |
| 414 | 244.037,29 | 57.146.343,03 | 10,0413% | 10,04% |
| 415 | 244.550,62 | 57.390.893,65 | 10,0641% | 10,06% |
| 416 | 245.063,95 | 57.635.957,6 | 10,0870% | 10,09% |
| 417 | 245.577,28 | 57.881.534,88 | 10,1098% | 10,11% |
| 418 | 246.090,61 | 58.127.625,49 | 10,1327% | 10,13% |
| 419 | 246.603,94 | 58.374.229,43 | 10,1556% | 10,16% |
| 420 | 247.117,27 | 58.621.346,7 | 10,1784% | 10,18% |
| 421 | 247.630,6 | 58.868.977,3 | 10,2013% | 10,2% |
| 422 | 248.143,93 | 59.117.121,23 | 10,2242% | 10,22% |
| 423 | 248.657,26 | 59.365.778,49 | 10,2470% | 10,25% |
| 424 | 249.170,59 | 59.614.949,08 | 10,2699% | 10,27% |
| 425 | 249.683,92 | 59.864.633 | 10,2927% | 10,29% |
| 426 | 250.197,25 | 60.114.830,25 | 10,3156% | 10,32% |
| 427 | 250.710,58 | 60.365.540,83 | 10,3385% | 10,34% |
| 428 | 251.223,91 | 60.616.764,74 | 10,3613% | 10,36% |
| 429 | 251.737,24 | 60.868.501,98 | 10,3842% | 10,38% |
| 430 | 252.250,57 | 61.120.752,55 | 10,4071% | 10,41% |
| 431 | 252.763,9 | 61.373.516,45 | 10,4299% | 10,43% |
| 432 | 253.277,23 | 61.626.793,68 | 10,4528% | 10,45% |
| 433 | 253.790,56 | 61.880.584,24 | 10,4756% | 10,48% |
| 434 | 254.303,89 | 62.134.888,13 | 10,4985% | 10,5% |
| 435 | 254.817,22 | 62.389.705,35 | 10,5214% | 10,52% |
| 436 | 255.330,55 | 62.645.035,9 | 10,5442% | 10,54% |
| 437 | 255.843,88 | 62.900.879,78 | 10,5671% | 10,57% |
| 438 | 256.357,21 | 63.157.236,99 | 10,5900% | 10,59% |
| 439 | 256.870,54 | 63.414.107,53 | 10,6128% | 10,61% |
| 440 | 257.383,87 | 63.671.491,4 | 10,6357% | 10,64% |
| 441 | 257.897,2 | 63.929.388,6 | 10,6585% | 10,66% |
| 442 | 258.410,53 | 64.187.799,13 | 10,6814% | 10,68% |
| 443 | 258.923,86 | 64.446.722,99 | 10,7043% | 10,7% |
| 444 | 259.437,19 | 64.706.160,18 | 10,7271% | 10,73% |
| 445 | 259.950,52 | 64.966.110,7 | 10,7500% | 10,75% |
| 446 | 260.463,85 | 65.226.574,55 | 10,7729% | 10,77% |
| 447 | 260.977,18 | 65.487.551,73 | 10,7957% | 10,8% |
| 448 | 261.490,51 | 65.749.042,24 | 10,8186% | 10,82% |
| 449 | 262.003,84 | 66.011.046,08 | 10,8414% | 10,84% |
| 450 | 262.517,17 | 66.273.563,25 | 10,8643% | 10,86% |
| 451 | 263.030,5 | 66.536.593,75 | 10,8872% | 10,89% |
| 452 | 263.543,83 | 66.800.137,58 | 10,9100% | 10,91% |
| 453 | 264.057,16 | 67.064.194,74 | 10,9329% | 10,93% |
| 454 | 264.570,49 | 67.328.765,23 | 10,9558% | 10,96% |
| 455 | 265.083,82 | 67.593.849,05 | 10,9786% | 10,98% |
| 456 | 265.597,15 | 67.859.446,2 | 11,0015% | 11% |
| 457 | 266.110,48 | 68.125.556,68 | 11,0243% | 11,02% |
| 458 | 266.623,81 | 68.392.180,49 | 11,0472% | 11,05% |
| 459 | 267.137,14 | 68.659.317,63 | 11,0701% | 11,07% |
| 460 | 267.650,47 | 68.926.968,1 | 11,0929% | 11,09% |
| 461 | 268.163,8 | 69.195.131,9 | 11,1158% | 11,12% |
| 462 | 268.677,13 | 69.463.809,03 | 11,1387% | 11,14% |
| 463 | 269.190,46 | 69.732.999,49 | 11,1615% | 11,16% |
| 464 | 269.703,79 | 70.002.703,28 | 11,1844% | 11,18% |
| 465 | 270.217,12 | 70.272.920,4 | 11,2072% | 11,21% |
| 466 | 270.730,45 | 70.543.650,85 | 11,2301% | 11,23% |
| 467 | 271.243,78 | 70.814.894,63 | 11,2530% | 11,25% |
| 468 | 271.757,11 | 71.086.651,74 | 11,2758% | 11,28% |
| 469 | 272.270,44 | 71.358.922,18 | 11,2987% | 11,3% |
| 470 | 272.783,77 | 71.631.705,95 | 11,3216% | 11,32% |
| 471 | 273.297,1 | 71.905.003,05 | 11,3444% | 11,34% |
| 472 | 273.810,43 | 72.178.813,48 | 11,3673% | 11,37% |
| 473 | 274.323,76 | 72.453.137,24 | 11,3901% | 11,39% |
| 474 | 274.837,09 | 72.727.974,33 | 11,4130% | 11,41% |
| 475 | 275.350,42 | 73.003.324,75 | 11,4359% | 11,44% |
| 476 | 275.863,75 | 73.279.188,5 | 11,4587% | 11,46% |
| 477 | 276.377,08 | 73.555.565,58 | 11,4816% | 11,48% |
| 478 | 276.890,41 | 73.832.455,99 | 11,5045% | 11,5% |
| 479 | 277.403,74 | 74.109.859,73 | 11,5273% | 11,53% |
| 480 | 277.917,07 | 74.387.776,8 | 11,5502% | 11,55% |
| 481 | 278.430,4 | 74.666.207,2 | 11,5730% | 11,57% |
| 482 | 278.943,73 | 74.945.150,93 | 11,5959% | 11,6% |
| 483 | 279.457,06 | 75.224.607,99 | 11,6188% | 11,62% |
| 484 | 279.970,39 | 75.504.578,38 | 11,6416% | 11,64% |
| 485 | 280.483,72 | 75.785.062,1 | 11,6645% | 11,66% |
| 486 | 280.997,05 | 76.066.059,15 | 11,6874% | 11,69% |
| 487 | 281.510,38 | 76.347.569,53 | 11,7102% | 11,71% |
| 488 | 282.023,71 | 76.629.593,24 | 11,7331% | 11,73% |
| 489 | 282.537,04 | 76.912.130,28 | 11,7559% | 11,76% |
| 490 | 283.050,37 | 77.195.180,65 | 11,7788% | 11,78% |
| 491 | 283.563,7 | 77.478.744,35 | 11,8017% | 11,8% |
| 492 | 284.077,03 | 77.762.821,38 | 11,8245% | 11,82% |
| 493 | 284.590,36 | 78.047.411,74 | 11,8474% | 11,85% |
| 494 | 285.103,69 | 78.332.515,43 | 11,8703% | 11,87% |
| 495 | 285.617,02 | 78.618.132,45 | 11,8931% | 11,89% |
| 496 | 286.130,35 | 78.904.262,8 | 11,9160% | 11,92% |
| 497 | 286.643,68 | 79.190.906,48 | 11,9388% | 11,94% |
| 498 | 287.157,01 | 79.478.063,49 | 11,9617% | 11,96% |
| 499 | 287.670,34 | 79.765.733,83 | 11,9846% | 11,98% |
| 500 | 288.183,67 | 80.053.917,5 | 12,0074% | 12,01% |

### Anexo — Encruzilhada

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 44.598 | 44.598 | 0,3992% | 0,3992% |
| 2 | 45.312,71 | 89.910,71 | 0,4144% | 0,4144% |
| 3 | 46.027,42 | 135.938,13 | 0,4297% | 0,4297% |
| 4 | 46.742,13 | 182.680,26 | 0,4449% | 0,4449% |
| 5 | 47.456,84 | 230.137,1 | 0,4601% | 0,4601% |
| 6 | 48.171,55 | 278.308,65 | 0,4754% | 0,4754% |
| 7 | 48.886,26 | 327.194,91 | 0,4906% | 0,4906% |
| 8 | 49.600,97 | 376.795,88 | 0,5059% | 0,5059% |
| 9 | 50.315,68 | 427.111,56 | 0,5211% | 0,5211% |
| 10 | 51.030,39 | 478.141,95 | 0,5363% | 0,5363% |
| 11 | 51.745,1 | 529.887,05 | 0,5516% | 0,5516% |
| 12 | 52.459,81 | 582.346,86 | 0,5668% | 0,5668% |
| 13 | 53.174,52 | 635.521,38 | 0,5820% | 0,582% |
| 14 | 53.889,23 | 689.410,61 | 0,5973% | 0,5973% |
| 15 | 54.603,94 | 744.014,55 | 0,6125% | 0,6125% |
| 16 | 55.318,65 | 799.333,2 | 0,6277% | 0,6277% |
| 17 | 56.033,36 | 855.366,56 | 0,6430% | 0,643% |
| 18 | 56.748,07 | 912.114,63 | 0,6582% | 0,6582% |
| 19 | 57.462,78 | 969.577,41 | 0,6735% | 0,6735% |
| 20 | 58.177,49 | 1.027.754,9 | 0,6887% | 0,6887% |
| 21 | 58.892,2 | 1.086.647,1 | 0,7039% | 0,7039% |
| 22 | 59.606,91 | 1.146.254,01 | 0,7192% | 0,7192% |
| 23 | 60.321,62 | 1.206.575,63 | 0,7344% | 0,7344% |
| 24 | 61.036,33 | 1.267.611,96 | 0,7496% | 0,7496% |
| 25 | 61.751,04 | 1.329.363 | 0,7649% | 0,7649% |
| 26 | 62.465,75 | 1.391.828,75 | 0,7801% | 0,7801% |
| 27 | 63.180,46 | 1.455.009,21 | 0,7954% | 0,7954% |
| 28 | 63.895,17 | 1.518.904,38 | 0,8106% | 0,8106% |
| 29 | 64.609,88 | 1.583.514,26 | 0,8258% | 0,8258% |
| 30 | 65.324,59 | 1.648.838,85 | 0,8411% | 0,8411% |
| 31 | 66.039,3 | 1.714.878,15 | 0,8563% | 0,8563% |
| 32 | 66.754,01 | 1.781.632,16 | 0,8715% | 0,8715% |
| 33 | 67.468,72 | 1.849.100,88 | 0,8868% | 0,8868% |
| 34 | 68.183,43 | 1.917.284,31 | 0,9020% | 0,902% |
| 35 | 68.898,14 | 1.986.182,45 | 0,9172% | 0,9172% |
| 36 | 69.612,85 | 2.055.795,3 | 0,9325% | 0,9325% |
| 37 | 70.327,56 | 2.126.122,86 | 0,9477% | 0,9477% |
| 38 | 71.042,27 | 2.197.165,13 | 0,9630% | 0,963% |
| 39 | 71.756,98 | 2.268.922,11 | 0,9782% | 0,9782% |
| 40 | 72.471,69 | 2.341.393,8 | 0,9934% | 0,9934% |
| 41 | 73.186,4 | 2.414.580,2 | 1,0087% | 1,009% |
| 42 | 73.901,11 | 2.488.481,31 | 1,0239% | 1,024% |
| 43 | 74.615,82 | 2.563.097,13 | 1,0391% | 1,039% |
| 44 | 75.330,53 | 2.638.427,66 | 1,0544% | 1,054% |
| 45 | 76.045,24 | 2.714.472,9 | 1,0696% | 1,07% |
| 46 | 76.759,95 | 2.791.232,85 | 1,0848% | 1,085% |
| 47 | 77.474,66 | 2.868.707,51 | 1,1001% | 1,1% |
| 48 | 78.189,37 | 2.946.896,88 | 1,1153% | 1,115% |
| 49 | 78.904,08 | 3.025.800,96 | 1,1306% | 1,131% |
| 50 | 79.618,79 | 3.105.419,75 | 1,1458% | 1,146% |
| 51 | 80.333,5 | 3.185.753,25 | 1,1610% | 1,161% |
| 52 | 81.048,21 | 3.266.801,46 | 1,1763% | 1,176% |
| 53 | 81.762,92 | 3.348.564,38 | 1,1915% | 1,192% |
| 54 | 82.477,63 | 3.431.042,01 | 1,2067% | 1,207% |
| 55 | 83.192,34 | 3.514.234,35 | 1,2220% | 1,222% |
| 56 | 83.907,05 | 3.598.141,4 | 1,2372% | 1,237% |
| 57 | 84.621,76 | 3.682.763,16 | 1,2524% | 1,252% |
| 58 | 85.336,47 | 3.768.099,63 | 1,2677% | 1,268% |
| 59 | 86.051,18 | 3.854.150,81 | 1,2829% | 1,283% |
| 60 | 86.765,89 | 3.940.916,7 | 1,2982% | 1,298% |
| 61 | 87.480,6 | 4.028.397,3 | 1,3134% | 1,313% |
| 62 | 88.195,31 | 4.116.592,61 | 1,3286% | 1,329% |
| 63 | 88.910,02 | 4.205.502,63 | 1,3439% | 1,344% |
| 64 | 89.624,73 | 4.295.127,36 | 1,3591% | 1,359% |
| 65 | 90.339,44 | 4.385.466,8 | 1,3743% | 1,374% |
| 66 | 91.054,15 | 4.476.520,95 | 1,3896% | 1,39% |
| 67 | 91.768,86 | 4.568.289,81 | 1,4048% | 1,405% |
| 68 | 92.483,57 | 4.660.773,38 | 1,4201% | 1,42% |
| 69 | 93.198,28 | 4.753.971,66 | 1,4353% | 1,435% |
| 70 | 93.912,99 | 4.847.884,65 | 1,4505% | 1,451% |
| 71 | 94.627,7 | 4.942.512,35 | 1,4658% | 1,466% |
| 72 | 95.342,41 | 5.037.854,76 | 1,4810% | 1,481% |
| 73 | 96.057,12 | 5.133.911,88 | 1,4962% | 1,496% |
| 74 | 96.771,83 | 5.230.683,71 | 1,5115% | 1,511% |
| 75 | 97.486,54 | 5.328.170,25 | 1,5267% | 1,527% |
| 76 | 98.201,25 | 5.426.371,5 | 1,5419% | 1,542% |
| 77 | 98.915,96 | 5.525.287,46 | 1,5572% | 1,557% |
| 78 | 99.630,67 | 5.624.918,13 | 1,5724% | 1,572% |
| 79 | 100.345,38 | 5.725.263,51 | 1,5877% | 1,588% |
| 80 | 101.060,09 | 5.826.323,6 | 1,6029% | 1,603% |
| 81 | 101.774,8 | 5.928.098,4 | 1,6181% | 1,618% |
| 82 | 102.489,51 | 6.030.587,91 | 1,6334% | 1,633% |
| 83 | 103.204,22 | 6.133.792,13 | 1,6486% | 1,649% |
| 84 | 103.918,93 | 6.237.711,06 | 1,6638% | 1,664% |
| 85 | 104.633,64 | 6.342.344,7 | 1,6791% | 1,679% |
| 86 | 105.348,35 | 6.447.693,05 | 1,6943% | 1,694% |
| 87 | 106.063,06 | 6.553.756,11 | 1,7095% | 1,71% |
| 88 | 106.777,77 | 6.660.533,88 | 1,7248% | 1,725% |
| 89 | 107.492,48 | 6.768.026,36 | 1,7400% | 1,74% |
| 90 | 108.207,19 | 6.876.233,55 | 1,7553% | 1,755% |
| 91 | 108.921,9 | 6.985.155,45 | 1,7705% | 1,77% |
| 92 | 109.636,61 | 7.094.792,06 | 1,7857% | 1,786% |
| 93 | 110.351,32 | 7.205.143,38 | 1,8010% | 1,801% |
| 94 | 111.066,03 | 7.316.209,41 | 1,8162% | 1,816% |
| 95 | 111.780,74 | 7.427.990,15 | 1,8314% | 1,831% |
| 96 | 112.495,45 | 7.540.485,6 | 1,8467% | 1,847% |
| 97 | 113.210,16 | 7.653.695,76 | 1,8619% | 1,862% |
| 98 | 113.924,87 | 7.767.620,63 | 1,8772% | 1,877% |
| 99 | 114.639,58 | 7.882.260,21 | 1,8924% | 1,892% |
| 100 | 115.354,29 | 7.997.614,5 | 1,9076% | 1,908% |
| 101 | 116.069 | 8.113.683,5 | 1,9229% | 1,923% |
| 102 | 116.783,71 | 8.230.467,21 | 1,9381% | 1,938% |
| 103 | 117.498,42 | 8.347.965,63 | 1,9533% | 1,953% |
| 104 | 118.213,13 | 8.466.178,76 | 1,9686% | 1,969% |
| 105 | 118.927,84 | 8.585.106,6 | 1,9838% | 1,984% |
| 106 | 119.642,55 | 8.704.749,15 | 1,9990% | 1,999% |
| 107 | 120.357,26 | 8.825.106,41 | 2,0143% | 2,014% |
| 108 | 121.071,97 | 8.946.178,38 | 2,0295% | 2,03% |
| 109 | 121.786,68 | 9.067.965,06 | 2,0448% | 2,045% |
| 110 | 122.501,39 | 9.190.466,45 | 2,0600% | 2,06% |
| 111 | 123.216,1 | 9.313.682,55 | 2,0752% | 2,075% |
| 112 | 123.930,81 | 9.437.613,36 | 2,0905% | 2,09% |
| 113 | 124.645,52 | 9.562.258,88 | 2,1057% | 2,106% |
| 114 | 125.360,23 | 9.687.619,11 | 2,1209% | 2,121% |
| 115 | 126.074,94 | 9.813.694,05 | 2,1362% | 2,136% |
| 116 | 126.789,65 | 9.940.483,7 | 2,1514% | 2,151% |
| 117 | 127.504,36 | 10.067.988,06 | 2,1666% | 2,167% |
| 118 | 128.219,07 | 10.196.207,13 | 2,1819% | 2,182% |
| 119 | 128.933,78 | 10.325.140,91 | 2,1971% | 2,197% |
| 120 | 129.648,49 | 10.454.789,4 | 2,2124% | 2,212% |
| 121 | 130.363,2 | 10.585.152,6 | 2,2276% | 2,228% |
| 122 | 131.077,91 | 10.716.230,51 | 2,2428% | 2,243% |
| 123 | 131.792,62 | 10.848.023,13 | 2,2581% | 2,258% |
| 124 | 132.507,33 | 10.980.530,46 | 2,2733% | 2,273% |
| 125 | 133.222,04 | 11.113.752,5 | 2,2885% | 2,289% |
| 126 | 133.936,75 | 11.247.689,25 | 2,3038% | 2,304% |
| 127 | 134.651,46 | 11.382.340,71 | 2,3190% | 2,319% |
| 128 | 135.366,17 | 11.517.706,88 | 2,3342% | 2,334% |
| 129 | 136.080,88 | 11.653.787,76 | 2,3495% | 2,349% |
| 130 | 136.795,59 | 11.790.583,35 | 2,3647% | 2,365% |
| 131 | 137.510,3 | 11.928.093,65 | 2,3800% | 2,38% |
| 132 | 138.225,01 | 12.066.318,66 | 2,3952% | 2,395% |
| 133 | 138.939,72 | 12.205.258,38 | 2,4104% | 2,41% |
| 134 | 139.654,43 | 12.344.912,81 | 2,4257% | 2,426% |
| 135 | 140.369,14 | 12.485.281,95 | 2,4409% | 2,441% |
| 136 | 141.083,85 | 12.626.365,8 | 2,4561% | 2,456% |
| 137 | 141.798,56 | 12.768.164,36 | 2,4714% | 2,471% |
| 138 | 142.513,27 | 12.910.677,63 | 2,4866% | 2,487% |
| 139 | 143.227,98 | 13.053.905,61 | 2,5019% | 2,502% |
| 140 | 143.942,69 | 13.197.848,3 | 2,5171% | 2,517% |
| 141 | 144.657,4 | 13.342.505,7 | 2,5323% | 2,532% |
| 142 | 145.372,11 | 13.487.877,81 | 2,5476% | 2,548% |
| 143 | 146.086,82 | 13.633.964,63 | 2,5628% | 2,563% |
| 144 | 146.801,53 | 13.780.766,16 | 2,5780% | 2,578% |
| 145 | 147.516,24 | 13.928.282,4 | 2,5933% | 2,593% |
| 146 | 148.230,95 | 14.076.513,35 | 2,6085% | 2,609% |
| 147 | 148.945,66 | 14.225.459,01 | 2,6237% | 2,624% |
| 148 | 149.660,37 | 14.375.119,38 | 2,6390% | 2,639% |
| 149 | 150.375,08 | 14.525.494,46 | 2,6542% | 2,654% |
| 150 | 151.089,79 | 14.676.584,25 | 2,6695% | 2,669% |
| 151 | 151.804,5 | 14.828.388,75 | 2,6847% | 2,685% |
| 152 | 152.519,21 | 14.980.907,96 | 2,6999% | 2,7% |
| 153 | 153.233,92 | 15.134.141,88 | 2,7152% | 2,715% |
| 154 | 153.948,63 | 15.288.090,51 | 2,7304% | 2,73% |
| 155 | 154.663,34 | 15.442.753,85 | 2,7456% | 2,746% |
| 156 | 155.378,05 | 15.598.131,9 | 2,7609% | 2,761% |
| 157 | 156.092,76 | 15.754.224,66 | 2,7761% | 2,776% |
| 158 | 156.807,47 | 15.911.032,13 | 2,7913% | 2,791% |
| 159 | 157.522,18 | 16.068.554,31 | 2,8066% | 2,807% |
| 160 | 158.236,89 | 16.226.791,2 | 2,8218% | 2,822% |
| 161 | 158.951,6 | 16.385.742,8 | 2,8371% | 2,837% |
| 162 | 159.666,31 | 16.545.409,11 | 2,8523% | 2,852% |
| 163 | 160.381,02 | 16.705.790,13 | 2,8675% | 2,868% |
| 164 | 161.095,73 | 16.866.885,86 | 2,8828% | 2,883% |
| 165 | 161.810,44 | 17.028.696,3 | 2,8980% | 2,898% |
| 166 | 162.525,15 | 17.191.221,45 | 2,9132% | 2,913% |
| 167 | 163.239,86 | 17.354.461,31 | 2,9285% | 2,928% |
| 168 | 163.954,57 | 17.518.415,88 | 2,9437% | 2,944% |
| 169 | 164.669,28 | 17.683.085,16 | 2,9589% | 2,959% |
| 170 | 165.383,99 | 17.848.469,15 | 2,9742% | 2,974% |
| 171 | 166.098,7 | 18.014.567,85 | 2,9894% | 2,989% |
| 172 | 166.813,41 | 18.181.381,26 | 3,0047% | 3,005% |
| 173 | 167.528,12 | 18.348.909,38 | 3,0199% | 3,02% |
| 174 | 168.242,83 | 18.517.152,21 | 3,0351% | 3,035% |
| 175 | 168.957,54 | 18.686.109,75 | 3,0504% | 3,05% |
| 176 | 169.672,25 | 18.855.782 | 3,0656% | 3,066% |
| 177 | 170.386,96 | 19.026.168,96 | 3,0808% | 3,081% |
| 178 | 171.101,67 | 19.197.270,63 | 3,0961% | 3,096% |
| 179 | 171.816,38 | 19.369.087,01 | 3,1113% | 3,111% |
| 180 | 172.531,09 | 19.541.618,1 | 3,1266% | 3,127% |
| 181 | 173.245,8 | 19.714.863,9 | 3,1418% | 3,142% |
| 182 | 173.960,51 | 19.888.824,41 | 3,1570% | 3,157% |
| 183 | 174.675,22 | 20.063.499,63 | 3,1723% | 3,172% |
| 184 | 175.389,93 | 20.238.889,56 | 3,1875% | 3,187% |
| 185 | 176.104,64 | 20.414.994,2 | 3,2027% | 3,203% |
| 186 | 176.819,35 | 20.591.813,55 | 3,2180% | 3,218% |
| 187 | 177.534,06 | 20.769.347,61 | 3,2332% | 3,233% |
| 188 | 178.248,77 | 20.947.596,38 | 3,2484% | 3,248% |
| 189 | 178.963,48 | 21.126.559,86 | 3,2637% | 3,264% |
| 190 | 179.678,19 | 21.306.238,05 | 3,2789% | 3,279% |
| 191 | 180.392,9 | 21.486.630,95 | 3,2942% | 3,294% |
| 192 | 181.107,61 | 21.667.738,56 | 3,3094% | 3,309% |
| 193 | 181.822,32 | 21.849.560,88 | 3,3246% | 3,325% |
| 194 | 182.537,03 | 22.032.097,91 | 3,3399% | 3,34% |
| 195 | 183.251,74 | 22.215.349,65 | 3,3551% | 3,355% |
| 196 | 183.966,45 | 22.399.316,1 | 3,3703% | 3,37% |
| 197 | 184.681,16 | 22.583.997,26 | 3,3856% | 3,386% |
| 198 | 185.395,87 | 22.769.393,13 | 3,4008% | 3,401% |
| 199 | 186.110,58 | 22.955.503,71 | 3,4160% | 3,416% |
| 200 | 186.825,29 | 23.142.329 | 3,4313% | 3,431% |
| 201 | 187.540 | 23.329.869 | 3,4465% | 3,447% |
| 202 | 188.254,71 | 23.518.123,71 | 3,4618% | 3,462% |
| 203 | 188.969,42 | 23.707.093,13 | 3,4770% | 3,477% |
| 204 | 189.684,13 | 23.896.777,26 | 3,4922% | 3,492% |
| 205 | 190.398,84 | 24.087.176,1 | 3,5075% | 3,507% |
| 206 | 191.113,55 | 24.278.289,65 | 3,5227% | 3,523% |
| 207 | 191.828,26 | 24.470.117,91 | 3,5379% | 3,538% |
| 208 | 192.542,97 | 24.662.660,88 | 3,5532% | 3,553% |
| 209 | 193.257,68 | 24.855.918,56 | 3,5684% | 3,568% |
| 210 | 193.972,39 | 25.049.890,95 | 3,5836% | 3,584% |
| 211 | 194.687,1 | 25.244.578,05 | 3,5989% | 3,599% |
| 212 | 195.401,81 | 25.439.979,86 | 3,6141% | 3,614% |
| 213 | 196.116,52 | 25.636.096,38 | 3,6294% | 3,629% |
| 214 | 196.831,23 | 25.832.927,61 | 3,6446% | 3,645% |
| 215 | 197.545,94 | 26.030.473,55 | 3,6598% | 3,66% |
| 216 | 198.260,65 | 26.228.734,2 | 3,6751% | 3,675% |
| 217 | 198.975,36 | 26.427.709,56 | 3,6903% | 3,69% |
| 218 | 199.690,07 | 26.627.399,63 | 3,7055% | 3,706% |
| 219 | 200.404,78 | 26.827.804,41 | 3,7208% | 3,721% |
| 220 | 201.119,49 | 27.028.923,9 | 3,7360% | 3,736% |
| 221 | 201.834,2 | 27.230.758,1 | 3,7513% | 3,751% |
| 222 | 202.548,91 | 27.433.307,01 | 3,7665% | 3,766% |
| 223 | 203.263,62 | 27.636.570,63 | 3,7817% | 3,782% |
| 224 | 203.978,33 | 27.840.548,96 | 3,7970% | 3,797% |
| 225 | 204.693,04 | 28.045.242 | 3,8122% | 3,812% |
| 226 | 205.407,75 | 28.250.649,75 | 3,8274% | 3,827% |
| 227 | 206.122,46 | 28.456.772,21 | 3,8427% | 3,843% |
| 228 | 206.837,17 | 28.663.609,38 | 3,8579% | 3,858% |
| 229 | 207.551,88 | 28.871.161,26 | 3,8731% | 3,873% |
| 230 | 208.266,59 | 29.079.427,85 | 3,8884% | 3,888% |
| 231 | 208.981,3 | 29.288.409,15 | 3,9036% | 3,904% |
| 232 | 209.696,01 | 29.498.105,16 | 3,9189% | 3,919% |
| 233 | 210.410,72 | 29.708.515,88 | 3,9341% | 3,934% |
| 234 | 211.125,43 | 29.919.641,31 | 3,9493% | 3,949% |
| 235 | 211.840,14 | 30.131.481,45 | 3,9646% | 3,965% |
| 236 | 212.554,85 | 30.344.036,3 | 3,9798% | 3,98% |
| 237 | 213.269,56 | 30.557.305,86 | 3,9950% | 3,995% |
| 238 | 213.984,27 | 30.771.290,13 | 4,0103% | 4,01% |
| 239 | 214.698,98 | 30.985.989,11 | 4,0255% | 4,026% |
| 240 | 215.413,69 | 31.201.402,8 | 4,0407% | 4,041% |
| 241 | 216.128,4 | 31.417.531,2 | 4,0560% | 4,056% |
| 242 | 216.843,11 | 31.634.374,31 | 4,0712% | 4,071% |
| 243 | 217.557,82 | 31.851.932,13 | 4,0865% | 4,086% |
| 244 | 218.272,53 | 32.070.204,66 | 4,1017% | 4,102% |
| 245 | 218.987,24 | 32.289.191,9 | 4,1169% | 4,117% |
| 246 | 219.701,95 | 32.508.893,85 | 4,1322% | 4,132% |
| 247 | 220.416,66 | 32.729.310,51 | 4,1474% | 4,147% |
| 248 | 221.131,37 | 32.950.441,88 | 4,1626% | 4,163% |
| 249 | 221.846,08 | 33.172.287,96 | 4,1779% | 4,178% |
| 250 | 222.560,79 | 33.394.848,75 | 4,1931% | 4,193% |
| 251 | 223.275,5 | 33.618.124,25 | 4,2083% | 4,208% |
| 252 | 223.990,21 | 33.842.114,46 | 4,2236% | 4,224% |
| 253 | 224.704,92 | 34.066.819,38 | 4,2388% | 4,239% |
| 254 | 225.419,63 | 34.292.239,01 | 4,2541% | 4,254% |
| 255 | 226.134,34 | 34.518.373,35 | 4,2693% | 4,269% |
| 256 | 226.849,05 | 34.745.222,4 | 4,2845% | 4,285% |
| 257 | 227.563,76 | 34.972.786,16 | 4,2998% | 4,3% |
| 258 | 228.278,47 | 35.201.064,63 | 4,3150% | 4,315% |
| 259 | 228.993,18 | 35.430.057,81 | 4,3302% | 4,33% |
| 260 | 229.707,89 | 35.659.765,7 | 4,3455% | 4,345% |
| 261 | 230.422,6 | 35.890.188,3 | 4,3607% | 4,361% |
| 262 | 231.137,31 | 36.121.325,61 | 4,3760% | 4,376% |
| 263 | 231.852,02 | 36.353.177,63 | 4,3912% | 4,391% |
| 264 | 232.566,73 | 36.585.744,36 | 4,4064% | 4,406% |
| 265 | 233.281,44 | 36.819.025,8 | 4,4217% | 4,422% |
| 266 | 233.996,15 | 37.053.021,95 | 4,4369% | 4,437% |
| 267 | 234.710,86 | 37.287.732,81 | 4,4521% | 4,452% |
| 268 | 235.425,57 | 37.523.158,38 | 4,4674% | 4,467% |
| 269 | 236.140,28 | 37.759.298,66 | 4,4826% | 4,483% |
| 270 | 236.854,99 | 37.996.153,65 | 4,4978% | 4,498% |
| 271 | 237.569,7 | 38.233.723,35 | 4,5131% | 4,513% |
| 272 | 238.284,41 | 38.472.007,76 | 4,5283% | 4,528% |
| 273 | 238.999,12 | 38.711.006,88 | 4,5436% | 4,544% |
| 274 | 239.713,83 | 38.950.720,71 | 4,5588% | 4,559% |
| 275 | 240.428,54 | 39.191.149,25 | 4,5740% | 4,574% |
| 276 | 241.143,25 | 39.432.292,5 | 4,5893% | 4,589% |
| 277 | 241.857,96 | 39.674.150,46 | 4,6045% | 4,605% |
| 278 | 242.572,67 | 39.916.723,13 | 4,6197% | 4,62% |
| 279 | 243.287,38 | 40.160.010,51 | 4,6350% | 4,635% |
| 280 | 244.002,09 | 40.404.012,6 | 4,6502% | 4,65% |
| 281 | 244.716,8 | 40.648.729,4 | 4,6654% | 4,665% |
| 282 | 245.431,51 | 40.894.160,91 | 4,6807% | 4,681% |
| 283 | 246.146,22 | 41.140.307,13 | 4,6959% | 4,696% |
| 284 | 246.860,93 | 41.387.168,06 | 4,7112% | 4,711% |
| 285 | 247.575,64 | 41.634.743,7 | 4,7264% | 4,726% |
| 286 | 248.290,35 | 41.883.034,05 | 4,7416% | 4,742% |
| 287 | 249.005,06 | 42.132.039,11 | 4,7569% | 4,757% |
| 288 | 249.719,77 | 42.381.758,88 | 4,7721% | 4,772% |
| 289 | 250.434,48 | 42.632.193,36 | 4,7873% | 4,787% |
| 290 | 251.149,19 | 42.883.342,55 | 4,8026% | 4,803% |
| 291 | 251.863,9 | 43.135.206,45 | 4,8178% | 4,818% |
| 292 | 252.578,61 | 43.387.785,06 | 4,8331% | 4,833% |
| 293 | 253.293,32 | 43.641.078,38 | 4,8483% | 4,848% |
| 294 | 254.008,03 | 43.895.086,41 | 4,8635% | 4,864% |
| 295 | 254.722,74 | 44.149.809,15 | 4,8788% | 4,879% |
| 296 | 255.437,45 | 44.405.246,6 | 4,8940% | 4,894% |
| 297 | 256.152,16 | 44.661.398,76 | 4,9092% | 4,909% |
| 298 | 256.866,87 | 44.918.265,63 | 4,9245% | 4,924% |
| 299 | 257.581,58 | 45.175.847,21 | 4,9397% | 4,94% |
| 300 | 258.296,29 | 45.434.143,5 | 4,9549% | 4,955% |
| 301 | 259.011 | 45.693.154,5 | 4,9702% | 4,97% |
| 302 | 259.725,71 | 45.952.880,21 | 4,9854% | 4,985% |
| 303 | 260.440,42 | 46.213.320,63 | 5,0007% | 5,001% |
| 304 | 261.155,13 | 46.474.475,76 | 5,0159% | 5,016% |
| 305 | 261.869,84 | 46.736.345,6 | 5,0311% | 5,031% |
| 306 | 262.584,55 | 46.998.930,15 | 5,0464% | 5,046% |
| 307 | 263.299,26 | 47.262.229,41 | 5,0616% | 5,062% |
| 308 | 264.013,97 | 47.526.243,38 | 5,0768% | 5,077% |
| 309 | 264.728,68 | 47.790.972,06 | 5,0921% | 5,092% |
| 310 | 265.443,39 | 48.056.415,45 | 5,1073% | 5,107% |
| 311 | 266.158,1 | 48.322.573,55 | 5,1225% | 5,123% |
| 312 | 266.872,81 | 48.589.446,36 | 5,1378% | 5,138% |
| 313 | 267.587,52 | 48.857.033,88 | 5,1530% | 5,153% |
| 314 | 268.302,23 | 49.125.336,11 | 5,1683% | 5,168% |
| 315 | 269.016,94 | 49.394.353,05 | 5,1835% | 5,183% |
| 316 | 269.731,65 | 49.664.084,7 | 5,1987% | 5,199% |
| 317 | 270.446,36 | 49.934.531,06 | 5,2140% | 5,214% |
| 318 | 271.161,07 | 50.205.692,13 | 5,2292% | 5,229% |
| 319 | 271.875,78 | 50.477.567,91 | 5,2444% | 5,244% |
| 320 | 272.590,49 | 50.750.158,4 | 5,2597% | 5,26% |
| 321 | 273.305,2 | 51.023.463,6 | 5,2749% | 5,275% |
| 322 | 274.019,91 | 51.297.483,51 | 5,2901% | 5,29% |
| 323 | 274.734,62 | 51.572.218,13 | 5,3054% | 5,305% |
| 324 | 275.449,33 | 51.847.667,46 | 5,3206% | 5,321% |
| 325 | 276.164,04 | 52.123.831,5 | 5,3359% | 5,336% |
| 326 | 276.878,75 | 52.400.710,25 | 5,3511% | 5,351% |
| 327 | 277.593,46 | 52.678.303,71 | 5,3663% | 5,366% |
| 328 | 278.308,17 | 52.956.611,88 | 5,3816% | 5,382% |
| 329 | 279.022,88 | 53.235.634,76 | 5,3968% | 5,397% |
| 330 | 279.737,59 | 53.515.372,35 | 5,4120% | 5,412% |
| 331 | 280.452,3 | 53.795.824,65 | 5,4273% | 5,427% |
| 332 | 281.167,01 | 54.076.991,66 | 5,4425% | 5,443% |
| 333 | 281.881,72 | 54.358.873,38 | 5,4578% | 5,458% |
| 334 | 282.596,43 | 54.641.469,81 | 5,4730% | 5,473% |
| 335 | 283.311,14 | 54.924.780,95 | 5,4882% | 5,488% |
| 336 | 284.025,85 | 55.208.806,8 | 5,5035% | 5,503% |
| 337 | 284.740,56 | 55.493.547,36 | 5,5187% | 5,519% |
| 338 | 285.455,27 | 55.779.002,63 | 5,5339% | 5,534% |
| 339 | 286.169,98 | 56.065.172,61 | 5,5492% | 5,549% |
| 340 | 286.884,69 | 56.352.057,3 | 5,5644% | 5,564% |
| 341 | 287.599,4 | 56.639.656,7 | 5,5796% | 5,58% |
| 342 | 288.314,11 | 56.927.970,81 | 5,5949% | 5,595% |
| 343 | 289.028,82 | 57.216.999,63 | 5,6101% | 5,61% |
| 344 | 289.743,53 | 57.506.743,16 | 5,6254% | 5,625% |
| 345 | 290.458,24 | 57.797.201,4 | 5,6406% | 5,641% |
| 346 | 291.172,95 | 58.088.374,35 | 5,6558% | 5,656% |
| 347 | 291.887,66 | 58.380.262,01 | 5,6711% | 5,671% |
| 348 | 292.602,37 | 58.672.864,38 | 5,6863% | 5,686% |
| 349 | 293.317,08 | 58.966.181,46 | 5,7015% | 5,702% |
| 350 | 294.031,79 | 59.260.213,25 | 5,7168% | 5,717% |
| 351 | 294.746,5 | 59.554.959,75 | 5,7320% | 5,732% |
| 352 | 295.461,21 | 59.850.420,96 | 5,7472% | 5,747% |
| 353 | 296.175,92 | 60.146.596,88 | 5,7625% | 5,762% |
| 354 | 296.890,63 | 60.443.487,51 | 5,7777% | 5,778% |
| 355 | 297.605,34 | 60.741.092,85 | 5,7930% | 5,793% |
| 356 | 298.320,05 | 61.039.412,9 | 5,8082% | 5,808% |
| 357 | 299.034,76 | 61.338.447,66 | 5,8234% | 5,823% |
| 358 | 299.749,47 | 61.638.197,13 | 5,8387% | 5,839% |
| 359 | 300.464,18 | 61.938.661,31 | 5,8539% | 5,854% |
| 360 | 301.178,89 | 62.239.840,2 | 5,8691% | 5,869% |
| 361 | 301.893,6 | 62.541.733,8 | 5,8844% | 5,884% |
| 362 | 302.608,31 | 62.844.342,11 | 5,8996% | 5,9% |
| 363 | 303.323,02 | 63.147.665,13 | 5,9148% | 5,915% |
| 364 | 304.037,73 | 63.451.702,86 | 5,9301% | 5,93% |
| 365 | 304.752,44 | 63.756.455,3 | 5,9453% | 5,945% |
| 366 | 305.467,15 | 64.061.922,45 | 5,9606% | 5,961% |
| 367 | 306.181,86 | 64.368.104,31 | 5,9758% | 5,976% |
| 368 | 306.896,57 | 64.675.000,88 | 5,9910% | 5,991% |
| 369 | 307.611,28 | 64.982.612,16 | 6,0063% | 6,006% |
| 370 | 308.325,99 | 65.290.938,15 | 6,0215% | 6,022% |
| 371 | 309.040,7 | 65.599.978,85 | 6,0367% | 6,037% |
| 372 | 309.755,41 | 65.909.734,26 | 6,0520% | 6,052% |
| 373 | 310.470,12 | 66.220.204,38 | 6,0672% | 6,067% |
| 374 | 311.184,83 | 66.531.389,21 | 6,0825% | 6,082% |
| 375 | 311.899,54 | 66.843.288,75 | 6,0977% | 6,098% |
| 376 | 312.614,25 | 67.155.903 | 6,1129% | 6,113% |
| 377 | 313.328,96 | 67.469.231,96 | 6,1282% | 6,128% |
| 378 | 314.043,67 | 67.783.275,63 | 6,1434% | 6,143% |
| 379 | 314.758,38 | 68.098.034,01 | 6,1586% | 6,159% |
| 380 | 315.473,09 | 68.413.507,1 | 6,1739% | 6,174% |
| 381 | 316.187,8 | 68.729.694,9 | 6,1891% | 6,189% |
| 382 | 316.902,51 | 69.046.597,41 | 6,2043% | 6,204% |
| 383 | 317.617,22 | 69.364.214,63 | 6,2196% | 6,22% |
| 384 | 318.331,93 | 69.682.546,56 | 6,2348% | 6,235% |
| 385 | 319.046,64 | 70.001.593,2 | 6,2501% | 6,25% |
| 386 | 319.761,35 | 70.321.354,55 | 6,2653% | 6,265% |
| 387 | 320.476,06 | 70.641.830,61 | 6,2805% | 6,281% |
| 388 | 321.190,77 | 70.963.021,38 | 6,2958% | 6,296% |
| 389 | 321.905,48 | 71.284.926,86 | 6,3110% | 6,311% |
| 390 | 322.620,19 | 71.607.547,05 | 6,3262% | 6,326% |
| 391 | 323.334,9 | 71.930.881,95 | 6,3415% | 6,341% |
| 392 | 324.049,61 | 72.254.931,56 | 6,3567% | 6,357% |
| 393 | 324.764,32 | 72.579.695,88 | 6,3719% | 6,372% |
| 394 | 325.479,03 | 72.905.174,91 | 6,3872% | 6,387% |
| 395 | 326.193,74 | 73.231.368,65 | 6,4024% | 6,402% |
| 396 | 326.908,45 | 73.558.277,1 | 6,4177% | 6,418% |
| 397 | 327.623,16 | 73.885.900,26 | 6,4329% | 6,433% |
| 398 | 328.337,87 | 74.214.238,13 | 6,4481% | 6,448% |
| 399 | 329.052,58 | 74.543.290,71 | 6,4634% | 6,463% |
| 400 | 329.767,29 | 74.873.058 | 6,4786% | 6,479% |
| 401 | 330.482 | 75.203.540 | 6,4938% | 6,494% |
| 402 | 331.196,71 | 75.534.736,71 | 6,5091% | 6,509% |
| 403 | 331.911,42 | 75.866.648,13 | 6,5243% | 6,524% |
| 404 | 332.626,13 | 76.199.274,26 | 6,5395% | 6,54% |
| 405 | 333.340,84 | 76.532.615,1 | 6,5548% | 6,555% |
| 406 | 334.055,55 | 76.866.670,65 | 6,5700% | 6,57% |
| 407 | 334.770,26 | 77.201.440,91 | 6,5853% | 6,585% |
| 408 | 335.484,97 | 77.536.925,88 | 6,6005% | 6,6% |
| 409 | 336.199,68 | 77.873.125,56 | 6,6157% | 6,616% |
| 410 | 336.914,39 | 78.210.039,95 | 6,6310% | 6,631% |
| 411 | 337.629,1 | 78.547.669,05 | 6,6462% | 6,646% |
| 412 | 338.343,81 | 78.886.012,86 | 6,6614% | 6,661% |
| 413 | 339.058,52 | 79.225.071,38 | 6,6767% | 6,677% |
| 414 | 339.773,23 | 79.564.844,61 | 6,6919% | 6,692% |
| 415 | 340.487,94 | 79.905.332,55 | 6,7072% | 6,707% |
| 416 | 341.202,65 | 80.246.535,2 | 6,7224% | 6,722% |
| 417 | 341.917,36 | 80.588.452,56 | 6,7376% | 6,738% |
| 418 | 342.632,07 | 80.931.084,63 | 6,7529% | 6,753% |
| 419 | 343.346,78 | 81.274.431,41 | 6,7681% | 6,768% |
| 420 | 344.061,49 | 81.618.492,9 | 6,7833% | 6,783% |
| 421 | 344.776,2 | 81.963.269,1 | 6,7986% | 6,799% |
| 422 | 345.490,91 | 82.308.760,01 | 6,8138% | 6,814% |
| 423 | 346.205,62 | 82.654.965,63 | 6,8290% | 6,829% |
| 424 | 346.920,33 | 83.001.885,96 | 6,8443% | 6,844% |
| 425 | 347.635,04 | 83.349.521 | 6,8595% | 6,86% |
| 426 | 348.349,75 | 83.697.870,75 | 6,8748% | 6,875% |
| 427 | 349.064,46 | 84.046.935,21 | 6,8900% | 6,89% |
| 428 | 349.779,17 | 84.396.714,38 | 6,9052% | 6,905% |
| 429 | 350.493,88 | 84.747.208,26 | 6,9205% | 6,92% |
| 430 | 351.208,59 | 85.098.416,85 | 6,9357% | 6,936% |
| 431 | 351.923,3 | 85.450.340,15 | 6,9509% | 6,951% |
| 432 | 352.638,01 | 85.802.978,16 | 6,9662% | 6,966% |
| 433 | 353.352,72 | 86.156.330,88 | 6,9814% | 6,981% |
| 434 | 354.067,43 | 86.510.398,31 | 6,9966% | 6,997% |
| 435 | 354.782,14 | 86.865.180,45 | 7,0119% | 7,012% |
| 436 | 355.496,85 | 87.220.677,3 | 7,0271% | 7,027% |
| 437 | 356.211,56 | 87.576.888,86 | 7,0424% | 7,042% |
| 438 | 356.926,27 | 87.933.815,13 | 7,0576% | 7,058% |
| 439 | 357.640,98 | 88.291.456,11 | 7,0728% | 7,073% |
| 440 | 358.355,69 | 88.649.811,8 | 7,0881% | 7,088% |
| 441 | 359.070,4 | 89.008.882,2 | 7,1033% | 7,103% |
| 442 | 359.785,11 | 89.368.667,31 | 7,1185% | 7,119% |
| 443 | 360.499,82 | 89.729.167,13 | 7,1338% | 7,134% |
| 444 | 361.214,53 | 90.090.381,66 | 7,1490% | 7,149% |
| 445 | 361.929,24 | 90.452.310,9 | 7,1643% | 7,164% |
| 446 | 362.643,95 | 90.814.954,85 | 7,1795% | 7,179% |
| 447 | 363.358,66 | 91.178.313,51 | 7,1947% | 7,195% |
| 448 | 364.073,37 | 91.542.386,88 | 7,2100% | 7,21% |
| 449 | 364.788,08 | 91.907.174,96 | 7,2252% | 7,225% |
| 450 | 365.502,79 | 92.272.677,75 | 7,2404% | 7,24% |
| 451 | 366.217,5 | 92.638.895,25 | 7,2557% | 7,256% |
| 452 | 366.932,21 | 93.005.827,46 | 7,2709% | 7,271% |
| 453 | 367.646,92 | 93.373.474,38 | 7,2861% | 7,286% |
| 454 | 368.361,63 | 93.741.836,01 | 7,3014% | 7,301% |
| 455 | 369.076,34 | 94.110.912,35 | 7,3166% | 7,317% |
| 456 | 369.791,05 | 94.480.703,4 | 7,3319% | 7,332% |
| 457 | 370.505,76 | 94.851.209,16 | 7,3471% | 7,347% |
| 458 | 371.220,47 | 95.222.429,63 | 7,3623% | 7,362% |
| 459 | 371.935,18 | 95.594.364,81 | 7,3776% | 7,378% |
| 460 | 372.649,89 | 95.967.014,7 | 7,3928% | 7,393% |
| 461 | 373.364,6 | 96.340.379,3 | 7,4080% | 7,408% |
| 462 | 374.079,31 | 96.714.458,61 | 7,4233% | 7,423% |
| 463 | 374.794,02 | 97.089.252,63 | 7,4385% | 7,439% |
| 464 | 375.508,73 | 97.464.761,36 | 7,4537% | 7,454% |
| 465 | 376.223,44 | 97.840.984,8 | 7,4690% | 7,469% |
| 466 | 376.938,15 | 98.217.922,95 | 7,4842% | 7,484% |
| 467 | 377.652,86 | 98.595.575,81 | 7,4995% | 7,499% |
| 468 | 378.367,57 | 98.973.943,38 | 7,5147% | 7,515% |
| 469 | 379.082,28 | 99.353.025,66 | 7,5299% | 7,53% |
| 470 | 379.796,99 | 99.732.822,65 | 7,5452% | 7,545% |
| 471 | 380.511,7 | 100.113.334,35 | 7,5604% | 7,56% |
| 472 | 381.226,41 | 100.494.560,76 | 7,5756% | 7,576% |
| 473 | 381.941,12 | 100.876.501,88 | 7,5909% | 7,591% |
| 474 | 382.655,83 | 101.259.157,71 | 7,6061% | 7,606% |
| 475 | 383.370,54 | 101.642.528,25 | 7,6213% | 7,621% |
| 476 | 384.085,25 | 102.026.613,5 | 7,6366% | 7,637% |
| 477 | 384.799,96 | 102.411.413,46 | 7,6518% | 7,652% |
| 478 | 385.514,67 | 102.796.928,13 | 7,6671% | 7,667% |
| 479 | 386.229,38 | 103.183.157,51 | 7,6823% | 7,682% |
| 480 | 386.944,09 | 103.570.101,6 | 7,6975% | 7,698% |
| 481 | 387.658,8 | 103.957.760,4 | 7,7128% | 7,713% |
| 482 | 388.373,51 | 104.346.133,91 | 7,7280% | 7,728% |
| 483 | 389.088,22 | 104.735.222,13 | 7,7432% | 7,743% |
| 484 | 389.802,93 | 105.125.025,06 | 7,7585% | 7,758% |
| 485 | 390.517,64 | 105.515.542,7 | 7,7737% | 7,774% |
| 486 | 391.232,35 | 105.906.775,05 | 7,7890% | 7,789% |
| 487 | 391.947,06 | 106.298.722,11 | 7,8042% | 7,804% |
| 488 | 392.661,77 | 106.691.383,88 | 7,8194% | 7,819% |
| 489 | 393.376,48 | 107.084.760,36 | 7,8347% | 7,835% |
| 490 | 394.091,19 | 107.478.851,55 | 7,8499% | 7,85% |
| 491 | 394.805,9 | 107.873.657,45 | 7,8651% | 7,865% |
| 492 | 395.520,61 | 108.269.178,06 | 7,8804% | 7,88% |
| 493 | 396.235,32 | 108.665.413,38 | 7,8956% | 7,896% |
| 494 | 396.950,03 | 109.062.363,41 | 7,9108% | 7,911% |
| 495 | 397.664,74 | 109.460.028,15 | 7,9261% | 7,926% |
| 496 | 398.379,45 | 109.858.407,6 | 7,9413% | 7,941% |
| 497 | 399.094,16 | 110.257.501,76 | 7,9566% | 7,957% |
| 498 | 399.808,87 | 110.657.310,63 | 7,9718% | 7,972% |
| 499 | 400.523,58 | 111.057.834,21 | 7,9870% | 7,987% |
| 500 | 401.238,29 | 111.459.072,5 | 8,0023% | 8,002% |

### Anexo — Ceifa

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 393.000 | 393.000 | 0,1830% | 0,183% |
| 2 | 399.298,08 | 792.298,08 | 0,1900% | 0,19% |
| 3 | 405.596,16 | 1.197.894,24 | 0,1970% | 0,197% |
| 4 | 411.894,24 | 1.609.788,48 | 0,2040% | 0,204% |
| 5 | 418.192,32 | 2.027.980,8 | 0,2109% | 0,2109% |
| 6 | 424.490,4 | 2.452.471,2 | 0,2179% | 0,2179% |
| 7 | 430.788,48 | 2.883.259,68 | 0,2249% | 0,2249% |
| 8 | 437.086,56 | 3.320.346,24 | 0,2319% | 0,2319% |
| 9 | 443.384,64 | 3.763.730,88 | 0,2389% | 0,2389% |
| 10 | 449.682,72 | 4.213.413,6 | 0,2459% | 0,2459% |
| 11 | 455.980,8 | 4.669.394,4 | 0,2528% | 0,2528% |
| 12 | 462.278,88 | 5.131.673,28 | 0,2598% | 0,2598% |
| 13 | 468.576,96 | 5.600.250,24 | 0,2668% | 0,2668% |
| 14 | 474.875,04 | 6.075.125,28 | 0,2738% | 0,2738% |
| 15 | 481.173,12 | 6.556.298,4 | 0,2808% | 0,2808% |
| 16 | 487.471,2 | 7.043.769,6 | 0,2878% | 0,2878% |
| 17 | 493.769,28 | 7.537.538,88 | 0,2948% | 0,2948% |
| 18 | 500.067,36 | 8.037.606,24 | 0,3017% | 0,3017% |
| 19 | 506.365,44 | 8.543.971,68 | 0,3087% | 0,3087% |
| 20 | 512.663,52 | 9.056.635,2 | 0,3157% | 0,3157% |
| 21 | 518.961,6 | 9.575.596,8 | 0,3227% | 0,3227% |
| 22 | 525.259,68 | 10.100.856,48 | 0,3297% | 0,3297% |
| 23 | 531.557,76 | 10.632.414,24 | 0,3367% | 0,3367% |
| 24 | 537.855,84 | 11.170.270,08 | 0,3436% | 0,3436% |
| 25 | 544.153,92 | 11.714.424 | 0,3506% | 0,3506% |
| 26 | 550.452 | 12.264.876 | 0,3576% | 0,3576% |
| 27 | 556.750,08 | 12.821.626,08 | 0,3646% | 0,3646% |
| 28 | 563.048,16 | 13.384.674,24 | 0,3716% | 0,3716% |
| 29 | 569.346,24 | 13.954.020,48 | 0,3786% | 0,3786% |
| 30 | 575.644,32 | 14.529.664,8 | 0,3856% | 0,3856% |
| 31 | 581.942,4 | 15.111.607,2 | 0,3925% | 0,3925% |
| 32 | 588.240,48 | 15.699.847,68 | 0,3995% | 0,3995% |
| 33 | 594.538,56 | 16.294.386,24 | 0,4065% | 0,4065% |
| 34 | 600.836,64 | 16.895.222,88 | 0,4135% | 0,4135% |
| 35 | 607.134,72 | 17.502.357,6 | 0,4205% | 0,4205% |
| 36 | 613.432,8 | 18.115.790,4 | 0,4275% | 0,4275% |
| 37 | 619.730,88 | 18.735.521,28 | 0,4344% | 0,4344% |
| 38 | 626.028,96 | 19.361.550,24 | 0,4414% | 0,4414% |
| 39 | 632.327,04 | 19.993.877,28 | 0,4484% | 0,4484% |
| 40 | 638.625,12 | 20.632.502,4 | 0,4554% | 0,4554% |
| 41 | 644.923,2 | 21.277.425,6 | 0,4624% | 0,4624% |
| 42 | 651.221,28 | 21.928.646,88 | 0,4694% | 0,4694% |
| 43 | 657.519,36 | 22.586.166,24 | 0,4764% | 0,4764% |
| 44 | 663.817,44 | 23.249.983,68 | 0,4833% | 0,4833% |
| 45 | 670.115,52 | 23.920.099,2 | 0,4903% | 0,4903% |
| 46 | 676.413,6 | 24.596.512,8 | 0,4973% | 0,4973% |
| 47 | 682.711,68 | 25.279.224,48 | 0,5043% | 0,5043% |
| 48 | 689.009,76 | 25.968.234,24 | 0,5113% | 0,5113% |
| 49 | 695.307,84 | 26.663.542,08 | 0,5183% | 0,5183% |
| 50 | 701.605,92 | 27.365.148 | 0,5253% | 0,5253% |
| 51 | 707.904 | 28.073.052 | 0,5322% | 0,5322% |
| 52 | 714.202,08 | 28.787.254,08 | 0,5392% | 0,5392% |
| 53 | 720.500,16 | 29.507.754,24 | 0,5462% | 0,5462% |
| 54 | 726.798,24 | 30.234.552,48 | 0,5532% | 0,5532% |
| 55 | 733.096,32 | 30.967.648,8 | 0,5602% | 0,5602% |
| 56 | 739.394,4 | 31.707.043,2 | 0,5672% | 0,5672% |
| 57 | 745.692,48 | 32.452.735,68 | 0,5741% | 0,5741% |
| 58 | 751.990,56 | 33.204.726,24 | 0,5811% | 0,5811% |
| 59 | 758.288,64 | 33.963.014,88 | 0,5881% | 0,5881% |
| 60 | 764.586,72 | 34.727.601,6 | 0,5951% | 0,5951% |
| 61 | 770.884,8 | 35.498.486,4 | 0,6021% | 0,6021% |
| 62 | 777.182,88 | 36.275.669,28 | 0,6091% | 0,6091% |
| 63 | 783.480,96 | 37.059.150,24 | 0,6161% | 0,6161% |
| 64 | 789.779,04 | 37.848.929,28 | 0,6230% | 0,623% |
| 65 | 796.077,12 | 38.645.006,4 | 0,6300% | 0,63% |
| 66 | 802.375,2 | 39.447.381,6 | 0,6370% | 0,637% |
| 67 | 808.673,28 | 40.256.054,88 | 0,6440% | 0,644% |
| 68 | 814.971,36 | 41.071.026,24 | 0,6510% | 0,651% |
| 69 | 821.269,44 | 41.892.295,68 | 0,6580% | 0,658% |
| 70 | 827.567,52 | 42.719.863,2 | 0,6649% | 0,6649% |
| 71 | 833.865,6 | 43.553.728,8 | 0,6719% | 0,6719% |
| 72 | 840.163,68 | 44.393.892,48 | 0,6789% | 0,6789% |
| 73 | 846.461,76 | 45.240.354,24 | 0,6859% | 0,6859% |
| 74 | 852.759,84 | 46.093.114,08 | 0,6929% | 0,6929% |
| 75 | 859.057,92 | 46.952.172 | 0,6999% | 0,6999% |
| 76 | 865.356 | 47.817.528 | 0,7069% | 0,7069% |
| 77 | 871.654,08 | 48.689.182,08 | 0,7138% | 0,7138% |
| 78 | 877.952,16 | 49.567.134,24 | 0,7208% | 0,7208% |
| 79 | 884.250,24 | 50.451.384,48 | 0,7278% | 0,7278% |
| 80 | 890.548,32 | 51.341.932,8 | 0,7348% | 0,7348% |
| 81 | 896.846,4 | 52.238.779,2 | 0,7418% | 0,7418% |
| 82 | 903.144,48 | 53.141.923,68 | 0,7488% | 0,7488% |
| 83 | 909.442,56 | 54.051.366,24 | 0,7557% | 0,7557% |
| 84 | 915.740,64 | 54.967.106,88 | 0,7627% | 0,7627% |
| 85 | 922.038,72 | 55.889.145,6 | 0,7697% | 0,7697% |
| 86 | 928.336,8 | 56.817.482,4 | 0,7767% | 0,7767% |
| 87 | 934.634,88 | 57.752.117,28 | 0,7837% | 0,7837% |
| 88 | 940.932,96 | 58.693.050,24 | 0,7907% | 0,7907% |
| 89 | 947.231,04 | 59.640.281,28 | 0,7977% | 0,7977% |
| 90 | 953.529,12 | 60.593.810,4 | 0,8046% | 0,8046% |
| 91 | 959.827,2 | 61.553.637,6 | 0,8116% | 0,8116% |
| 92 | 966.125,28 | 62.519.762,88 | 0,8186% | 0,8186% |
| 93 | 972.423,36 | 63.492.186,24 | 0,8256% | 0,8256% |
| 94 | 978.721,44 | 64.470.907,68 | 0,8326% | 0,8326% |
| 95 | 985.019,52 | 65.455.927,2 | 0,8396% | 0,8396% |
| 96 | 991.317,6 | 66.447.244,8 | 0,8465% | 0,8465% |
| 97 | 997.615,68 | 67.444.860,48 | 0,8535% | 0,8535% |
| 98 | 1.003.913,76 | 68.448.774,24 | 0,8605% | 0,8605% |
| 99 | 1.010.211,84 | 69.458.986,08 | 0,8675% | 0,8675% |
| 100 | 1.016.509,92 | 70.475.496 | 0,8745% | 0,8745% |
| 101 | 1.022.808 | 71.498.304 | 0,8815% | 0,8815% |
| 102 | 1.029.106,08 | 72.527.410,08 | 0,8885% | 0,8885% |
| 103 | 1.035.404,16 | 73.562.814,24 | 0,8954% | 0,8954% |
| 104 | 1.041.702,24 | 74.604.516,48 | 0,9024% | 0,9024% |
| 105 | 1.048.000,32 | 75.652.516,8 | 0,9094% | 0,9094% |
| 106 | 1.054.298,4 | 76.706.815,2 | 0,9164% | 0,9164% |
| 107 | 1.060.596,48 | 77.767.411,68 | 0,9234% | 0,9234% |
| 108 | 1.066.894,56 | 78.834.306,24 | 0,9304% | 0,9304% |
| 109 | 1.073.192,64 | 79.907.498,88 | 0,9373% | 0,9373% |
| 110 | 1.079.490,72 | 80.986.989,6 | 0,9443% | 0,9443% |
| 111 | 1.085.788,8 | 82.072.778,4 | 0,9513% | 0,9513% |
| 112 | 1.092.086,88 | 83.164.865,28 | 0,9583% | 0,9583% |
| 113 | 1.098.384,96 | 84.263.250,24 | 0,9653% | 0,9653% |
| 114 | 1.104.683,04 | 85.367.933,28 | 0,9723% | 0,9723% |
| 115 | 1.110.981,12 | 86.478.914,4 | 0,9793% | 0,9793% |
| 116 | 1.117.279,2 | 87.596.193,6 | 0,9862% | 0,9862% |
| 117 | 1.123.577,28 | 88.719.770,88 | 0,9932% | 0,9932% |
| 118 | 1.129.875,36 | 89.849.646,24 | 1,0002% | 1% |
| 119 | 1.136.173,44 | 90.985.819,68 | 1,0072% | 1,007% |
| 120 | 1.142.471,52 | 92.128.291,2 | 1,0142% | 1,014% |
| 121 | 1.148.769,6 | 93.277.060,8 | 1,0212% | 1,021% |
| 122 | 1.155.067,68 | 94.432.128,48 | 1,0281% | 1,028% |
| 123 | 1.161.365,76 | 95.593.494,24 | 1,0351% | 1,035% |
| 124 | 1.167.663,84 | 96.761.158,08 | 1,0421% | 1,042% |
| 125 | 1.173.961,92 | 97.935.120 | 1,0491% | 1,049% |
| 126 | 1.180.260 | 99.115.380 | 1,0561% | 1,056% |
| 127 | 1.186.558,08 | 100.301.938,08 | 1,0631% | 1,063% |
| 128 | 1.192.856,16 | 101.494.794,24 | 1,0701% | 1,07% |
| 129 | 1.199.154,24 | 102.693.948,48 | 1,0770% | 1,077% |
| 130 | 1.205.452,32 | 103.899.400,8 | 1,0840% | 1,084% |
| 131 | 1.211.750,4 | 105.111.151,2 | 1,0910% | 1,091% |
| 132 | 1.218.048,48 | 106.329.199,68 | 1,0980% | 1,098% |
| 133 | 1.224.346,56 | 107.553.546,24 | 1,1050% | 1,105% |
| 134 | 1.230.644,64 | 108.784.190,88 | 1,1120% | 1,112% |
| 135 | 1.236.942,72 | 110.021.133,6 | 1,1189% | 1,119% |
| 136 | 1.243.240,8 | 111.264.374,4 | 1,1259% | 1,126% |
| 137 | 1.249.538,88 | 112.513.913,28 | 1,1329% | 1,133% |
| 138 | 1.255.836,96 | 113.769.750,24 | 1,1399% | 1,14% |
| 139 | 1.262.135,04 | 115.031.885,28 | 1,1469% | 1,147% |
| 140 | 1.268.433,12 | 116.300.318,4 | 1,1539% | 1,154% |
| 141 | 1.274.731,2 | 117.575.049,6 | 1,1609% | 1,161% |
| 142 | 1.281.029,28 | 118.856.078,88 | 1,1678% | 1,168% |
| 143 | 1.287.327,36 | 120.143.406,24 | 1,1748% | 1,175% |
| 144 | 1.293.625,44 | 121.437.031,68 | 1,1818% | 1,182% |
| 145 | 1.299.923,52 | 122.736.955,2 | 1,1888% | 1,189% |
| 146 | 1.306.221,6 | 124.043.176,8 | 1,1958% | 1,196% |
| 147 | 1.312.519,68 | 125.355.696,48 | 1,2028% | 1,203% |
| 148 | 1.318.817,76 | 126.674.514,24 | 1,2098% | 1,21% |
| 149 | 1.325.115,84 | 127.999.630,08 | 1,2167% | 1,217% |
| 150 | 1.331.413,92 | 129.331.044 | 1,2237% | 1,224% |
| 151 | 1.337.712 | 130.668.756 | 1,2307% | 1,231% |
| 152 | 1.344.010,08 | 132.012.766,08 | 1,2377% | 1,238% |
| 153 | 1.350.308,16 | 133.363.074,24 | 1,2447% | 1,245% |
| 154 | 1.356.606,24 | 134.719.680,48 | 1,2517% | 1,252% |
| 155 | 1.362.904,32 | 136.082.584,8 | 1,2586% | 1,259% |
| 156 | 1.369.202,4 | 137.451.787,2 | 1,2656% | 1,266% |
| 157 | 1.375.500,48 | 138.827.287,68 | 1,2726% | 1,273% |
| 158 | 1.381.798,56 | 140.209.086,24 | 1,2796% | 1,28% |
| 159 | 1.388.096,64 | 141.597.182,88 | 1,2866% | 1,287% |
| 160 | 1.394.394,72 | 142.991.577,6 | 1,2936% | 1,294% |
| 161 | 1.400.692,8 | 144.392.270,4 | 1,3006% | 1,301% |
| 162 | 1.406.990,88 | 145.799.261,28 | 1,3075% | 1,308% |
| 163 | 1.413.288,96 | 147.212.550,24 | 1,3145% | 1,315% |
| 164 | 1.419.587,04 | 148.632.137,28 | 1,3215% | 1,322% |
| 165 | 1.425.885,12 | 150.058.022,4 | 1,3285% | 1,328% |
| 166 | 1.432.183,2 | 151.490.205,6 | 1,3355% | 1,335% |
| 167 | 1.438.481,28 | 152.928.686,88 | 1,3425% | 1,342% |
| 168 | 1.444.779,36 | 154.373.466,24 | 1,3494% | 1,349% |
| 169 | 1.451.077,44 | 155.824.543,68 | 1,3564% | 1,356% |
| 170 | 1.457.375,52 | 157.281.919,2 | 1,3634% | 1,363% |
| 171 | 1.463.673,6 | 158.745.592,8 | 1,3704% | 1,37% |
| 172 | 1.469.971,68 | 160.215.564,48 | 1,3774% | 1,377% |
| 173 | 1.476.269,76 | 161.691.834,24 | 1,3844% | 1,384% |
| 174 | 1.482.567,84 | 163.174.402,08 | 1,3914% | 1,391% |
| 175 | 1.488.865,92 | 164.663.268 | 1,3983% | 1,398% |
| 176 | 1.495.164 | 166.158.432 | 1,4053% | 1,405% |
| 177 | 1.501.462,08 | 167.659.894,08 | 1,4123% | 1,412% |
| 178 | 1.507.760,16 | 169.167.654,24 | 1,4193% | 1,419% |
| 179 | 1.514.058,24 | 170.681.712,48 | 1,4263% | 1,426% |
| 180 | 1.520.356,32 | 172.202.068,8 | 1,4333% | 1,433% |
| 181 | 1.526.654,4 | 173.728.723,2 | 1,4402% | 1,44% |
| 182 | 1.532.952,48 | 175.261.675,68 | 1,4472% | 1,447% |
| 183 | 1.539.250,56 | 176.800.926,24 | 1,4542% | 1,454% |
| 184 | 1.545.548,64 | 178.346.474,88 | 1,4612% | 1,461% |
| 185 | 1.551.846,72 | 179.898.321,6 | 1,4682% | 1,468% |
| 186 | 1.558.144,8 | 181.456.466,4 | 1,4752% | 1,475% |
| 187 | 1.564.442,88 | 183.020.909,28 | 1,4822% | 1,482% |
| 188 | 1.570.740,96 | 184.591.650,24 | 1,4891% | 1,489% |
| 189 | 1.577.039,04 | 186.168.689,28 | 1,4961% | 1,496% |
| 190 | 1.583.337,12 | 187.752.026,4 | 1,5031% | 1,503% |
| 191 | 1.589.635,2 | 189.341.661,6 | 1,5101% | 1,51% |
| 192 | 1.595.933,28 | 190.937.594,88 | 1,5171% | 1,517% |
| 193 | 1.602.231,36 | 192.539.826,24 | 1,5241% | 1,524% |
| 194 | 1.608.529,44 | 194.148.355,68 | 1,5310% | 1,531% |
| 195 | 1.614.827,52 | 195.763.183,2 | 1,5380% | 1,538% |
| 196 | 1.621.125,6 | 197.384.308,8 | 1,5450% | 1,545% |
| 197 | 1.627.423,68 | 199.011.732,48 | 1,5520% | 1,552% |
| 198 | 1.633.721,76 | 200.645.454,24 | 1,5590% | 1,559% |
| 199 | 1.640.019,84 | 202.285.474,08 | 1,5660% | 1,566% |
| 200 | 1.646.317,92 | 203.931.792 | 1,5730% | 1,573% |
| 201 | 1.652.616 | 205.584.408 | 1,5799% | 1,58% |
| 202 | 1.658.914,08 | 207.243.322,08 | 1,5869% | 1,587% |
| 203 | 1.665.212,16 | 208.908.534,24 | 1,5939% | 1,594% |
| 204 | 1.671.510,24 | 210.580.044,48 | 1,6009% | 1,601% |
| 205 | 1.677.808,32 | 212.257.852,8 | 1,6079% | 1,608% |
| 206 | 1.684.106,4 | 213.941.959,2 | 1,6149% | 1,615% |
| 207 | 1.690.404,48 | 215.632.363,68 | 1,6218% | 1,622% |
| 208 | 1.696.702,56 | 217.329.066,24 | 1,6288% | 1,629% |
| 209 | 1.703.000,64 | 219.032.066,88 | 1,6358% | 1,636% |
| 210 | 1.709.298,72 | 220.741.365,6 | 1,6428% | 1,643% |
| 211 | 1.715.596,8 | 222.456.962,4 | 1,6498% | 1,65% |
| 212 | 1.721.894,88 | 224.178.857,28 | 1,6568% | 1,657% |
| 213 | 1.728.192,96 | 225.907.050,24 | 1,6638% | 1,664% |
| 214 | 1.734.491,04 | 227.641.541,28 | 1,6707% | 1,671% |
| 215 | 1.740.789,12 | 229.382.330,4 | 1,6777% | 1,678% |
| 216 | 1.747.087,2 | 231.129.417,6 | 1,6847% | 1,685% |
| 217 | 1.753.385,28 | 232.882.802,88 | 1,6917% | 1,692% |
| 218 | 1.759.683,36 | 234.642.486,24 | 1,6987% | 1,699% |
| 219 | 1.765.981,44 | 236.408.467,68 | 1,7057% | 1,706% |
| 220 | 1.772.279,52 | 238.180.747,2 | 1,7126% | 1,713% |
| 221 | 1.778.577,6 | 239.959.324,8 | 1,7196% | 1,72% |
| 222 | 1.784.875,68 | 241.744.200,48 | 1,7266% | 1,727% |
| 223 | 1.791.173,76 | 243.535.374,24 | 1,7336% | 1,734% |
| 224 | 1.797.471,84 | 245.332.846,08 | 1,7406% | 1,741% |
| 225 | 1.803.769,92 | 247.136.616 | 1,7476% | 1,748% |
| 226 | 1.810.068 | 248.946.684 | 1,7546% | 1,755% |
| 227 | 1.816.366,08 | 250.763.050,08 | 1,7615% | 1,762% |
| 228 | 1.822.664,16 | 252.585.714,24 | 1,7685% | 1,769% |
| 229 | 1.828.962,24 | 254.414.676,48 | 1,7755% | 1,776% |
| 230 | 1.835.260,32 | 256.249.936,8 | 1,7825% | 1,782% |
| 231 | 1.841.558,4 | 258.091.495,2 | 1,7895% | 1,789% |
| 232 | 1.847.856,48 | 259.939.351,68 | 1,7965% | 1,796% |
| 233 | 1.854.154,56 | 261.793.506,24 | 1,8035% | 1,803% |
| 234 | 1.860.452,64 | 263.653.958,88 | 1,8104% | 1,81% |
| 235 | 1.866.750,72 | 265.520.709,6 | 1,8174% | 1,817% |
| 236 | 1.873.048,8 | 267.393.758,4 | 1,8244% | 1,824% |
| 237 | 1.879.346,88 | 269.273.105,28 | 1,8314% | 1,831% |
| 238 | 1.885.644,96 | 271.158.750,24 | 1,8384% | 1,838% |
| 239 | 1.891.943,04 | 273.050.693,28 | 1,8454% | 1,845% |
| 240 | 1.898.241,12 | 274.948.934,4 | 1,8523% | 1,852% |
| 241 | 1.904.539,2 | 276.853.473,6 | 1,8593% | 1,859% |
| 242 | 1.910.837,28 | 278.764.310,88 | 1,8663% | 1,866% |
| 243 | 1.917.135,36 | 280.681.446,24 | 1,8733% | 1,873% |
| 244 | 1.923.433,44 | 282.604.879,68 | 1,8803% | 1,88% |
| 245 | 1.929.731,52 | 284.534.611,2 | 1,8873% | 1,887% |
| 246 | 1.936.029,6 | 286.470.640,8 | 1,8943% | 1,894% |
| 247 | 1.942.327,68 | 288.412.968,48 | 1,9012% | 1,901% |
| 248 | 1.948.625,76 | 290.361.594,24 | 1,9082% | 1,908% |
| 249 | 1.954.923,84 | 292.316.518,08 | 1,9152% | 1,915% |
| 250 | 1.961.221,92 | 294.277.740 | 1,9222% | 1,922% |
| 251 | 1.967.520 | 296.245.260 | 1,9292% | 1,929% |
| 252 | 1.973.818,08 | 298.219.078,08 | 1,9362% | 1,936% |
| 253 | 1.980.116,16 | 300.199.194,24 | 1,9431% | 1,943% |
| 254 | 1.986.414,24 | 302.185.608,48 | 1,9501% | 1,95% |
| 255 | 1.992.712,32 | 304.178.320,8 | 1,9571% | 1,957% |
| 256 | 1.999.010,4 | 306.177.331,2 | 1,9641% | 1,964% |
| 257 | 2.005.308,48 | 308.182.639,68 | 1,9711% | 1,971% |
| 258 | 2.011.606,56 | 310.194.246,24 | 1,9781% | 1,978% |
| 259 | 2.017.904,64 | 312.212.150,88 | 1,9851% | 1,985% |
| 260 | 2.024.202,72 | 314.236.353,6 | 1,9920% | 1,992% |
| 261 | 2.030.500,8 | 316.266.854,4 | 1,9990% | 1,999% |
| 262 | 2.036.798,88 | 318.303.653,28 | 2,0060% | 2,006% |
| 263 | 2.043.096,96 | 320.346.750,24 | 2,0130% | 2,013% |
| 264 | 2.049.395,04 | 322.396.145,28 | 2,0200% | 2,02% |
| 265 | 2.055.693,12 | 324.451.838,4 | 2,0270% | 2,027% |
| 266 | 2.061.991,2 | 326.513.829,6 | 2,0339% | 2,034% |
| 267 | 2.068.289,28 | 328.582.118,88 | 2,0409% | 2,041% |
| 268 | 2.074.587,36 | 330.656.706,24 | 2,0479% | 2,048% |
| 269 | 2.080.885,44 | 332.737.591,68 | 2,0549% | 2,055% |
| 270 | 2.087.183,52 | 334.824.775,2 | 2,0619% | 2,062% |
| 271 | 2.093.481,6 | 336.918.256,8 | 2,0689% | 2,069% |
| 272 | 2.099.779,68 | 339.018.036,48 | 2,0759% | 2,076% |
| 273 | 2.106.077,76 | 341.124.114,24 | 2,0828% | 2,083% |
| 274 | 2.112.375,84 | 343.236.490,08 | 2,0898% | 2,09% |
| 275 | 2.118.673,92 | 345.355.164 | 2,0968% | 2,097% |
| 276 | 2.124.972 | 347.480.136 | 2,1038% | 2,104% |
| 277 | 2.131.270,08 | 349.611.406,08 | 2,1108% | 2,111% |
| 278 | 2.137.568,16 | 351.748.974,24 | 2,1178% | 2,118% |
| 279 | 2.143.866,24 | 353.892.840,48 | 2,1247% | 2,125% |
| 280 | 2.150.164,32 | 356.043.004,8 | 2,1317% | 2,132% |
| 281 | 2.156.462,4 | 358.199.467,2 | 2,1387% | 2,139% |
| 282 | 2.162.760,48 | 360.362.227,68 | 2,1457% | 2,146% |
| 283 | 2.169.058,56 | 362.531.286,24 | 2,1527% | 2,153% |
| 284 | 2.175.356,64 | 364.706.642,88 | 2,1597% | 2,16% |
| 285 | 2.181.654,72 | 366.888.297,6 | 2,1667% | 2,167% |
| 286 | 2.187.952,8 | 369.076.250,4 | 2,1736% | 2,174% |
| 287 | 2.194.250,88 | 371.270.501,28 | 2,1806% | 2,181% |
| 288 | 2.200.548,96 | 373.471.050,24 | 2,1876% | 2,188% |
| 289 | 2.206.847,04 | 375.677.897,28 | 2,1946% | 2,195% |
| 290 | 2.213.145,12 | 377.891.042,4 | 2,2016% | 2,202% |
| 291 | 2.219.443,2 | 380.110.485,6 | 2,2086% | 2,209% |
| 292 | 2.225.741,28 | 382.336.226,88 | 2,2155% | 2,216% |
| 293 | 2.232.039,36 | 384.568.266,24 | 2,2225% | 2,223% |
| 294 | 2.238.337,44 | 386.806.603,68 | 2,2295% | 2,23% |
| 295 | 2.244.635,52 | 389.051.239,2 | 2,2365% | 2,237% |
| 296 | 2.250.933,6 | 391.302.172,8 | 2,2435% | 2,243% |
| 297 | 2.257.231,68 | 393.559.404,48 | 2,2505% | 2,25% |
| 298 | 2.263.529,76 | 395.822.934,24 | 2,2575% | 2,257% |
| 299 | 2.269.827,84 | 398.092.762,08 | 2,2644% | 2,264% |
| 300 | 2.276.125,92 | 400.368.888 | 2,2714% | 2,271% |
| 301 | 2.282.424 | 402.651.312 | 2,2784% | 2,278% |
| 302 | 2.288.722,08 | 404.940.034,08 | 2,2854% | 2,285% |
| 303 | 2.295.020,16 | 407.235.054,24 | 2,2924% | 2,292% |
| 304 | 2.301.318,24 | 409.536.372,48 | 2,2994% | 2,299% |
| 305 | 2.307.616,32 | 411.843.988,8 | 2,3063% | 2,306% |
| 306 | 2.313.914,4 | 414.157.903,2 | 2,3133% | 2,313% |
| 307 | 2.320.212,48 | 416.478.115,68 | 2,3203% | 2,32% |
| 308 | 2.326.510,56 | 418.804.626,24 | 2,3273% | 2,327% |
| 309 | 2.332.808,64 | 421.137.434,88 | 2,3343% | 2,334% |
| 310 | 2.339.106,72 | 423.476.541,6 | 2,3413% | 2,341% |
| 311 | 2.345.404,8 | 425.821.946,4 | 2,3483% | 2,348% |
| 312 | 2.351.702,88 | 428.173.649,28 | 2,3552% | 2,355% |
| 313 | 2.358.000,96 | 430.531.650,24 | 2,3622% | 2,362% |
| 314 | 2.364.299,04 | 432.895.949,28 | 2,3692% | 2,369% |
| 315 | 2.370.597,12 | 435.266.546,4 | 2,3762% | 2,376% |
| 316 | 2.376.895,2 | 437.643.441,6 | 2,3832% | 2,383% |
| 317 | 2.383.193,28 | 440.026.634,88 | 2,3902% | 2,39% |
| 318 | 2.389.491,36 | 442.416.126,24 | 2,3971% | 2,397% |
| 319 | 2.395.789,44 | 444.811.915,68 | 2,4041% | 2,404% |
| 320 | 2.402.087,52 | 447.214.003,2 | 2,4111% | 2,411% |
| 321 | 2.408.385,6 | 449.622.388,8 | 2,4181% | 2,418% |
| 322 | 2.414.683,68 | 452.037.072,48 | 2,4251% | 2,425% |
| 323 | 2.420.981,76 | 454.458.054,24 | 2,4321% | 2,432% |
| 324 | 2.427.279,84 | 456.885.334,08 | 2,4391% | 2,439% |
| 325 | 2.433.577,92 | 459.318.912 | 2,4460% | 2,446% |
| 326 | 2.439.876 | 461.758.788 | 2,4530% | 2,453% |
| 327 | 2.446.174,08 | 464.204.962,08 | 2,4600% | 2,46% |
| 328 | 2.452.472,16 | 466.657.434,24 | 2,4670% | 2,467% |
| 329 | 2.458.770,24 | 469.116.204,48 | 2,4740% | 2,474% |
| 330 | 2.465.068,32 | 471.581.272,8 | 2,4810% | 2,481% |
| 331 | 2.471.366,4 | 474.052.639,2 | 2,4880% | 2,488% |
| 332 | 2.477.664,48 | 476.530.303,68 | 2,4949% | 2,495% |
| 333 | 2.483.962,56 | 479.014.266,24 | 2,5019% | 2,502% |
| 334 | 2.490.260,64 | 481.504.526,88 | 2,5089% | 2,509% |
| 335 | 2.496.558,72 | 484.001.085,6 | 2,5159% | 2,516% |
| 336 | 2.502.856,8 | 486.503.942,4 | 2,5229% | 2,523% |
| 337 | 2.509.154,88 | 489.013.097,28 | 2,5299% | 2,53% |
| 338 | 2.515.452,96 | 491.528.550,24 | 2,5368% | 2,537% |
| 339 | 2.521.751,04 | 494.050.301,28 | 2,5438% | 2,544% |
| 340 | 2.528.049,12 | 496.578.350,4 | 2,5508% | 2,551% |
| 341 | 2.534.347,2 | 499.112.697,6 | 2,5578% | 2,558% |
| 342 | 2.540.645,28 | 501.653.342,88 | 2,5648% | 2,565% |
| 343 | 2.546.943,36 | 504.200.286,24 | 2,5718% | 2,572% |
| 344 | 2.553.241,44 | 506.753.527,68 | 2,5788% | 2,579% |
| 345 | 2.559.539,52 | 509.313.067,2 | 2,5857% | 2,586% |
| 346 | 2.565.837,6 | 511.878.904,8 | 2,5927% | 2,593% |
| 347 | 2.572.135,68 | 514.451.040,48 | 2,5997% | 2,6% |
| 348 | 2.578.433,76 | 517.029.474,24 | 2,6067% | 2,607% |
| 349 | 2.584.731,84 | 519.614.206,08 | 2,6137% | 2,614% |
| 350 | 2.591.029,92 | 522.205.236 | 2,6207% | 2,621% |
| 351 | 2.597.328 | 524.802.564 | 2,6276% | 2,628% |
| 352 | 2.603.626,08 | 527.406.190,08 | 2,6346% | 2,635% |
| 353 | 2.609.924,16 | 530.016.114,24 | 2,6416% | 2,642% |
| 354 | 2.616.222,24 | 532.632.336,48 | 2,6486% | 2,649% |
| 355 | 2.622.520,32 | 535.254.856,8 | 2,6556% | 2,656% |
| 356 | 2.628.818,4 | 537.883.675,2 | 2,6626% | 2,663% |
| 357 | 2.635.116,48 | 540.518.791,68 | 2,6696% | 2,67% |
| 358 | 2.641.414,56 | 543.160.206,24 | 2,6765% | 2,677% |
| 359 | 2.647.712,64 | 545.807.918,88 | 2,6835% | 2,684% |
| 360 | 2.654.010,72 | 548.461.929,6 | 2,6905% | 2,691% |
| 361 | 2.660.308,8 | 551.122.238,4 | 2,6975% | 2,697% |
| 362 | 2.666.606,88 | 553.788.845,28 | 2,7045% | 2,704% |
| 363 | 2.672.904,96 | 556.461.750,24 | 2,7115% | 2,711% |
| 364 | 2.679.203,04 | 559.140.953,28 | 2,7184% | 2,718% |
| 365 | 2.685.501,12 | 561.826.454,4 | 2,7254% | 2,725% |
| 366 | 2.691.799,2 | 564.518.253,6 | 2,7324% | 2,732% |
| 367 | 2.698.097,28 | 567.216.350,88 | 2,7394% | 2,739% |
| 368 | 2.704.395,36 | 569.920.746,24 | 2,7464% | 2,746% |
| 369 | 2.710.693,44 | 572.631.439,68 | 2,7534% | 2,753% |
| 370 | 2.716.991,52 | 575.348.431,2 | 2,7604% | 2,76% |
| 371 | 2.723.289,6 | 578.071.720,8 | 2,7673% | 2,767% |
| 372 | 2.729.587,68 | 580.801.308,48 | 2,7743% | 2,774% |
| 373 | 2.735.885,76 | 583.537.194,24 | 2,7813% | 2,781% |
| 374 | 2.742.183,84 | 586.279.378,08 | 2,7883% | 2,788% |
| 375 | 2.748.481,92 | 589.027.860 | 2,7953% | 2,795% |
| 376 | 2.754.780 | 591.782.640 | 2,8023% | 2,802% |
| 377 | 2.761.078,08 | 594.543.718,08 | 2,8092% | 2,809% |
| 378 | 2.767.376,16 | 597.311.094,24 | 2,8162% | 2,816% |
| 379 | 2.773.674,24 | 600.084.768,48 | 2,8232% | 2,823% |
| 380 | 2.779.972,32 | 602.864.740,8 | 2,8302% | 2,83% |
| 381 | 2.786.270,4 | 605.651.011,2 | 2,8372% | 2,837% |
| 382 | 2.792.568,48 | 608.443.579,68 | 2,8442% | 2,844% |
| 383 | 2.798.866,56 | 611.242.446,24 | 2,8512% | 2,851% |
| 384 | 2.805.164,64 | 614.047.610,88 | 2,8581% | 2,858% |
| 385 | 2.811.462,72 | 616.859.073,6 | 2,8651% | 2,865% |
| 386 | 2.817.760,8 | 619.676.834,4 | 2,8721% | 2,872% |
| 387 | 2.824.058,88 | 622.500.893,28 | 2,8791% | 2,879% |
| 388 | 2.830.356,96 | 625.331.250,24 | 2,8861% | 2,886% |
| 389 | 2.836.655,04 | 628.167.905,28 | 2,8931% | 2,893% |
| 390 | 2.842.953,12 | 631.010.858,4 | 2,9000% | 2,9% |
| 391 | 2.849.251,2 | 633.860.109,6 | 2,9070% | 2,907% |
| 392 | 2.855.549,28 | 636.715.658,88 | 2,9140% | 2,914% |
| 393 | 2.861.847,36 | 639.577.506,24 | 2,9210% | 2,921% |
| 394 | 2.868.145,44 | 642.445.651,68 | 2,9280% | 2,928% |
| 395 | 2.874.443,52 | 645.320.095,2 | 2,9350% | 2,935% |
| 396 | 2.880.741,6 | 648.200.836,8 | 2,9420% | 2,942% |
| 397 | 2.887.039,68 | 651.087.876,48 | 2,9489% | 2,949% |
| 398 | 2.893.337,76 | 653.981.214,24 | 2,9559% | 2,956% |
| 399 | 2.899.635,84 | 656.880.850,08 | 2,9629% | 2,963% |
| 400 | 2.905.933,92 | 659.786.784 | 2,9699% | 2,97% |
| 401 | 2.912.232 | 662.699.016 | 2,9769% | 2,977% |
| 402 | 2.918.530,08 | 665.617.546,08 | 2,9839% | 2,984% |
| 403 | 2.924.828,16 | 668.542.374,24 | 2,9908% | 2,991% |
| 404 | 2.931.126,24 | 671.473.500,48 | 2,9978% | 2,998% |
| 405 | 2.937.424,32 | 674.410.924,8 | 3,0048% | 3,005% |
| 406 | 2.943.722,4 | 677.354.647,2 | 3,0118% | 3,012% |
| 407 | 2.950.020,48 | 680.304.667,68 | 3,0188% | 3,019% |
| 408 | 2.956.318,56 | 683.260.986,24 | 3,0258% | 3,026% |
| 409 | 2.962.616,64 | 686.223.602,88 | 3,0328% | 3,033% |
| 410 | 2.968.914,72 | 689.192.517,6 | 3,0397% | 3,04% |
| 411 | 2.975.212,8 | 692.167.730,4 | 3,0467% | 3,047% |
| 412 | 2.981.510,88 | 695.149.241,28 | 3,0537% | 3,054% |
| 413 | 2.987.808,96 | 698.137.050,24 | 3,0607% | 3,061% |
| 414 | 2.994.107,04 | 701.131.157,28 | 3,0677% | 3,068% |
| 415 | 3.000.405,12 | 704.131.562,4 | 3,0747% | 3,075% |
| 416 | 3.006.703,2 | 707.138.265,6 | 3,0817% | 3,082% |
| 417 | 3.013.001,28 | 710.151.266,88 | 3,0886% | 3,089% |
| 418 | 3.019.299,36 | 713.170.566,24 | 3,0956% | 3,096% |
| 419 | 3.025.597,44 | 716.196.163,68 | 3,1026% | 3,103% |
| 420 | 3.031.895,52 | 719.228.059,2 | 3,1096% | 3,11% |
| 421 | 3.038.193,6 | 722.266.252,8 | 3,1166% | 3,117% |
| 422 | 3.044.491,68 | 725.310.744,48 | 3,1236% | 3,124% |
| 423 | 3.050.789,76 | 728.361.534,24 | 3,1305% | 3,131% |
| 424 | 3.057.087,84 | 731.418.622,08 | 3,1375% | 3,138% |
| 425 | 3.063.385,92 | 734.482.008 | 3,1445% | 3,145% |
| 426 | 3.069.684 | 737.551.692 | 3,1515% | 3,151% |
| 427 | 3.075.982,08 | 740.627.674,08 | 3,1585% | 3,158% |
| 428 | 3.082.280,16 | 743.709.954,24 | 3,1655% | 3,165% |
| 429 | 3.088.578,24 | 746.798.532,48 | 3,1725% | 3,172% |
| 430 | 3.094.876,32 | 749.893.408,8 | 3,1794% | 3,179% |
| 431 | 3.101.174,4 | 752.994.583,2 | 3,1864% | 3,186% |
| 432 | 3.107.472,48 | 756.102.055,68 | 3,1934% | 3,193% |
| 433 | 3.113.770,56 | 759.215.826,24 | 3,2004% | 3,2% |
| 434 | 3.120.068,64 | 762.335.894,88 | 3,2074% | 3,207% |
| 435 | 3.126.366,72 | 765.462.261,6 | 3,2144% | 3,214% |
| 436 | 3.132.664,8 | 768.594.926,4 | 3,2213% | 3,221% |
| 437 | 3.138.962,88 | 771.733.889,28 | 3,2283% | 3,228% |
| 438 | 3.145.260,96 | 774.879.150,24 | 3,2353% | 3,235% |
| 439 | 3.151.559,04 | 778.030.709,28 | 3,2423% | 3,242% |
| 440 | 3.157.857,12 | 781.188.566,4 | 3,2493% | 3,249% |
| 441 | 3.164.155,2 | 784.352.721,6 | 3,2563% | 3,256% |
| 442 | 3.170.453,28 | 787.523.174,88 | 3,2633% | 3,263% |
| 443 | 3.176.751,36 | 790.699.926,24 | 3,2702% | 3,27% |
| 444 | 3.183.049,44 | 793.882.975,68 | 3,2772% | 3,277% |
| 445 | 3.189.347,52 | 797.072.323,2 | 3,2842% | 3,284% |
| 446 | 3.195.645,6 | 800.267.968,8 | 3,2912% | 3,291% |
| 447 | 3.201.943,68 | 803.469.912,48 | 3,2982% | 3,298% |
| 448 | 3.208.241,76 | 806.678.154,24 | 3,3052% | 3,305% |
| 449 | 3.214.539,84 | 809.892.694,08 | 3,3121% | 3,312% |
| 450 | 3.220.837,92 | 813.113.532 | 3,3191% | 3,319% |
| 451 | 3.227.136 | 816.340.668 | 3,3261% | 3,326% |
| 452 | 3.233.434,08 | 819.574.102,08 | 3,3331% | 3,333% |
| 453 | 3.239.732,16 | 822.813.834,24 | 3,3401% | 3,34% |
| 454 | 3.246.030,24 | 826.059.864,48 | 3,3471% | 3,347% |
| 455 | 3.252.328,32 | 829.312.192,8 | 3,3541% | 3,354% |
| 456 | 3.258.626,4 | 832.570.819,2 | 3,3610% | 3,361% |
| 457 | 3.264.924,48 | 835.835.743,68 | 3,3680% | 3,368% |
| 458 | 3.271.222,56 | 839.106.966,24 | 3,3750% | 3,375% |
| 459 | 3.277.520,64 | 842.384.486,88 | 3,3820% | 3,382% |
| 460 | 3.283.818,72 | 845.668.305,6 | 3,3890% | 3,389% |
| 461 | 3.290.116,8 | 848.958.422,4 | 3,3960% | 3,396% |
| 462 | 3.296.414,88 | 852.254.837,28 | 3,4029% | 3,403% |
| 463 | 3.302.712,96 | 855.557.550,24 | 3,4099% | 3,41% |
| 464 | 3.309.011,04 | 858.866.561,28 | 3,4169% | 3,417% |
| 465 | 3.315.309,12 | 862.181.870,4 | 3,4239% | 3,424% |
| 466 | 3.321.607,2 | 865.503.477,6 | 3,4309% | 3,431% |
| 467 | 3.327.905,28 | 868.831.382,88 | 3,4379% | 3,438% |
| 468 | 3.334.203,36 | 872.165.586,24 | 3,4449% | 3,445% |
| 469 | 3.340.501,44 | 875.506.087,68 | 3,4518% | 3,452% |
| 470 | 3.346.799,52 | 878.852.887,2 | 3,4588% | 3,459% |
| 471 | 3.353.097,6 | 882.205.984,8 | 3,4658% | 3,466% |
| 472 | 3.359.395,68 | 885.565.380,48 | 3,4728% | 3,473% |
| 473 | 3.365.693,76 | 888.931.074,24 | 3,4798% | 3,48% |
| 474 | 3.371.991,84 | 892.303.066,08 | 3,4868% | 3,487% |
| 475 | 3.378.289,92 | 895.681.356 | 3,4937% | 3,494% |
| 476 | 3.384.588 | 899.065.944 | 3,5007% | 3,501% |
| 477 | 3.390.886,08 | 902.456.830,08 | 3,5077% | 3,508% |
| 478 | 3.397.184,16 | 905.854.014,24 | 3,5147% | 3,515% |
| 479 | 3.403.482,24 | 909.257.496,48 | 3,5217% | 3,522% |
| 480 | 3.409.780,32 | 912.667.276,8 | 3,5287% | 3,529% |
| 481 | 3.416.078,4 | 916.083.355,2 | 3,5357% | 3,536% |
| 482 | 3.422.376,48 | 919.505.731,68 | 3,5426% | 3,543% |
| 483 | 3.428.674,56 | 922.934.406,24 | 3,5496% | 3,55% |
| 484 | 3.434.972,64 | 926.369.378,88 | 3,5566% | 3,557% |
| 485 | 3.441.270,72 | 929.810.649,6 | 3,5636% | 3,564% |
| 486 | 3.447.568,8 | 933.258.218,4 | 3,5706% | 3,571% |
| 487 | 3.453.866,88 | 936.712.085,28 | 3,5776% | 3,578% |
| 488 | 3.460.164,96 | 940.172.250,24 | 3,5845% | 3,585% |
| 489 | 3.466.463,04 | 943.638.713,28 | 3,5915% | 3,592% |
| 490 | 3.472.761,12 | 947.111.474,4 | 3,5985% | 3,599% |
| 491 | 3.479.059,2 | 950.590.533,6 | 3,6055% | 3,606% |
| 492 | 3.485.357,28 | 954.075.890,88 | 3,6125% | 3,612% |
| 493 | 3.491.655,36 | 957.567.546,24 | 3,6195% | 3,619% |
| 494 | 3.497.953,44 | 961.065.499,68 | 3,6265% | 3,626% |
| 495 | 3.504.251,52 | 964.569.751,2 | 3,6334% | 3,633% |
| 496 | 3.510.549,6 | 968.080.300,8 | 3,6404% | 3,64% |
| 497 | 3.516.847,68 | 971.597.148,48 | 3,6474% | 3,647% |
| 498 | 3.523.145,76 | 975.120.294,24 | 3,6544% | 3,654% |
| 499 | 3.529.443,84 | 978.649.738,08 | 3,6614% | 3,661% |
| 500 | 3.535.741,92 | 982.185.480 | 3,6684% | 3,668% |

### Anexo — Enxame

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 406.962 | 406.962 | 0,0265% | 0,0265% |
| 2 | 413.483,83 | 820.445,83 | 0,0275% | 0,02751% |
| 3 | 420.005,66 | 1.240.451,49 | 0,0285% | 0,02852% |
| 4 | 426.527,49 | 1.666.978,98 | 0,0295% | 0,02953% |
| 5 | 433.049,32 | 2.100.028,3 | 0,0305% | 0,03055% |
| 6 | 439.571,15 | 2.539.599,45 | 0,0316% | 0,03156% |
| 7 | 446.092,98 | 2.985.692,43 | 0,0326% | 0,03257% |
| 8 | 452.614,81 | 3.438.307,24 | 0,0336% | 0,03358% |
| 9 | 459.136,64 | 3.897.443,88 | 0,0346% | 0,03459% |
| 10 | 465.658,47 | 4.363.102,35 | 0,0356% | 0,0356% |
| 11 | 472.180,3 | 4.835.282,65 | 0,0366% | 0,03662% |
| 12 | 478.702,13 | 5.313.984,78 | 0,0376% | 0,03763% |
| 13 | 485.223,96 | 5.799.208,74 | 0,0386% | 0,03864% |
| 14 | 491.745,79 | 6.290.954,53 | 0,0396% | 0,03965% |
| 15 | 498.267,62 | 6.789.222,15 | 0,0407% | 0,04066% |
| 16 | 504.789,45 | 7.294.011,6 | 0,0417% | 0,04167% |
| 17 | 511.311,28 | 7.805.322,88 | 0,0427% | 0,04268% |
| 18 | 517.833,11 | 8.323.155,99 | 0,0437% | 0,0437% |
| 19 | 524.354,94 | 8.847.510,93 | 0,0447% | 0,04471% |
| 20 | 530.876,77 | 9.378.387,7 | 0,0457% | 0,04572% |
| 21 | 537.398,6 | 9.915.786,3 | 0,0467% | 0,04673% |
| 22 | 543.920,43 | 10.459.706,73 | 0,0477% | 0,04774% |
| 23 | 550.442,26 | 11.010.148,99 | 0,0488% | 0,04875% |
| 24 | 556.964,09 | 11.567.113,08 | 0,0498% | 0,04976% |
| 25 | 563.485,92 | 12.130.599 | 0,0508% | 0,05078% |
| 26 | 570.007,75 | 12.700.606,75 | 0,0518% | 0,05179% |
| 27 | 576.529,58 | 13.277.136,33 | 0,0528% | 0,0528% |
| 28 | 583.051,41 | 13.860.187,74 | 0,0538% | 0,05381% |
| 29 | 589.573,24 | 14.449.760,98 | 0,0548% | 0,05482% |
| 30 | 596.095,07 | 15.045.856,05 | 0,0558% | 0,05583% |
| 31 | 602.616,9 | 15.648.472,95 | 0,0568% | 0,05685% |
| 32 | 609.138,73 | 16.257.611,68 | 0,0579% | 0,05786% |
| 33 | 615.660,56 | 16.873.272,24 | 0,0589% | 0,05887% |
| 34 | 622.182,39 | 17.495.454,63 | 0,0599% | 0,05988% |
| 35 | 628.704,22 | 18.124.158,85 | 0,0609% | 0,06089% |
| 36 | 635.226,05 | 18.759.384,9 | 0,0619% | 0,0619% |
| 37 | 641.747,88 | 19.401.132,78 | 0,0629% | 0,06291% |
| 38 | 648.269,71 | 20.049.402,49 | 0,0639% | 0,06393% |
| 39 | 654.791,54 | 20.704.194,03 | 0,0649% | 0,06494% |
| 40 | 661.313,37 | 21.365.507,4 | 0,0659% | 0,06595% |
| 41 | 667.835,2 | 22.033.342,6 | 0,0670% | 0,06696% |
| 42 | 674.357,03 | 22.707.699,63 | 0,0680% | 0,06797% |
| 43 | 680.878,86 | 23.388.578,49 | 0,0690% | 0,06898% |
| 44 | 687.400,69 | 24.075.979,18 | 0,0700% | 0,06999% |
| 45 | 693.922,52 | 24.769.901,7 | 0,0710% | 0,07101% |
| 46 | 700.444,35 | 25.470.346,05 | 0,0720% | 0,07202% |
| 47 | 706.966,18 | 26.177.312,23 | 0,0730% | 0,07303% |
| 48 | 713.488,01 | 26.890.800,24 | 0,0740% | 0,07404% |
| 49 | 720.009,84 | 27.610.810,08 | 0,0751% | 0,07505% |
| 50 | 726.531,67 | 28.337.341,75 | 0,0761% | 0,07606% |
| 51 | 733.053,5 | 29.070.395,25 | 0,0771% | 0,07708% |
| 52 | 739.575,33 | 29.809.970,58 | 0,0781% | 0,07809% |
| 53 | 746.097,16 | 30.556.067,74 | 0,0791% | 0,0791% |
| 54 | 752.618,99 | 31.308.686,73 | 0,0801% | 0,08011% |
| 55 | 759.140,82 | 32.067.827,55 | 0,0811% | 0,08112% |
| 56 | 765.662,65 | 32.833.490,2 | 0,0821% | 0,08213% |
| 57 | 772.184,48 | 33.605.674,68 | 0,0831% | 0,08314% |
| 58 | 778.706,31 | 34.384.380,99 | 0,0842% | 0,08416% |
| 59 | 785.228,14 | 35.169.609,13 | 0,0852% | 0,08517% |
| 60 | 791.749,97 | 35.961.359,1 | 0,0862% | 0,08618% |
| 61 | 798.271,8 | 36.759.630,9 | 0,0872% | 0,08719% |
| 62 | 804.793,63 | 37.564.424,53 | 0,0882% | 0,0882% |
| 63 | 811.315,46 | 38.375.739,99 | 0,0892% | 0,08921% |
| 64 | 817.837,29 | 39.193.577,28 | 0,0902% | 0,09022% |
| 65 | 824.359,12 | 40.017.936,4 | 0,0912% | 0,09124% |
| 66 | 830.880,95 | 40.848.817,35 | 0,0922% | 0,09225% |
| 67 | 837.402,78 | 41.686.220,13 | 0,0933% | 0,09326% |
| 68 | 843.924,61 | 42.530.144,74 | 0,0943% | 0,09427% |
| 69 | 850.446,44 | 43.380.591,18 | 0,0953% | 0,09528% |
| 70 | 856.968,27 | 44.237.559,45 | 0,0963% | 0,09629% |
| 71 | 863.490,1 | 45.101.049,55 | 0,0973% | 0,09731% |
| 72 | 870.011,93 | 45.971.061,48 | 0,0983% | 0,09832% |
| 73 | 876.533,76 | 46.847.595,24 | 0,0993% | 0,09933% |
| 74 | 883.055,59 | 47.730.650,83 | 0,1003% | 0,1003% |
| 75 | 889.577,42 | 48.620.228,25 | 0,1014% | 0,1014% |
| 76 | 896.099,25 | 49.516.327,5 | 0,1024% | 0,1024% |
| 77 | 902.621,08 | 50.418.948,58 | 0,1034% | 0,1034% |
| 78 | 909.142,91 | 51.328.091,49 | 0,1044% | 0,1044% |
| 79 | 915.664,74 | 52.243.756,23 | 0,1054% | 0,1054% |
| 80 | 922.186,57 | 53.165.942,8 | 0,1064% | 0,1064% |
| 81 | 928.708,4 | 54.094.651,2 | 0,1074% | 0,1074% |
| 82 | 935.230,23 | 55.029.881,43 | 0,1084% | 0,1084% |
| 83 | 941.752,06 | 55.971.633,49 | 0,1094% | 0,1094% |
| 84 | 948.273,89 | 56.919.907,38 | 0,1105% | 0,1105% |
| 85 | 954.795,72 | 57.874.703,1 | 0,1115% | 0,1115% |
| 86 | 961.317,55 | 58.836.020,65 | 0,1125% | 0,1125% |
| 87 | 967.839,38 | 59.803.860,03 | 0,1135% | 0,1135% |
| 88 | 974.361,21 | 60.778.221,24 | 0,1145% | 0,1145% |
| 89 | 980.883,04 | 61.759.104,28 | 0,1155% | 0,1155% |
| 90 | 987.404,87 | 62.746.509,15 | 0,1165% | 0,1165% |
| 91 | 993.926,7 | 63.740.435,85 | 0,1175% | 0,1175% |
| 92 | 1.000.448,53 | 64.740.884,38 | 0,1185% | 0,1185% |
| 93 | 1.006.970,36 | 65.747.854,74 | 0,1196% | 0,1196% |
| 94 | 1.013.492,19 | 66.761.346,93 | 0,1206% | 0,1206% |
| 95 | 1.020.014,02 | 67.781.360,95 | 0,1216% | 0,1216% |
| 96 | 1.026.535,85 | 68.807.896,8 | 0,1226% | 0,1226% |
| 97 | 1.033.057,68 | 69.840.954,48 | 0,1236% | 0,1236% |
| 98 | 1.039.579,51 | 70.880.533,99 | 0,1246% | 0,1246% |
| 99 | 1.046.101,34 | 71.926.635,33 | 0,1256% | 0,1256% |
| 100 | 1.052.623,17 | 72.979.258,5 | 0,1266% | 0,1266% |
| 101 | 1.059.145 | 74.038.403,5 | 0,1277% | 0,1277% |
| 102 | 1.065.666,83 | 75.104.070,33 | 0,1287% | 0,1287% |
| 103 | 1.072.188,66 | 76.176.258,99 | 0,1297% | 0,1297% |
| 104 | 1.078.710,49 | 77.254.969,48 | 0,1307% | 0,1307% |
| 105 | 1.085.232,32 | 78.340.201,8 | 0,1317% | 0,1317% |
| 106 | 1.091.754,15 | 79.431.955,95 | 0,1327% | 0,1327% |
| 107 | 1.098.275,98 | 80.530.231,93 | 0,1337% | 0,1337% |
| 108 | 1.104.797,81 | 81.635.029,74 | 0,1347% | 0,1347% |
| 109 | 1.111.319,64 | 82.746.349,38 | 0,1357% | 0,1357% |
| 110 | 1.117.841,47 | 83.864.190,85 | 0,1368% | 0,1368% |
| 111 | 1.124.363,3 | 84.988.554,15 | 0,1378% | 0,1378% |
| 112 | 1.130.885,13 | 86.119.439,28 | 0,1388% | 0,1388% |
| 113 | 1.137.406,96 | 87.256.846,24 | 0,1398% | 0,1398% |
| 114 | 1.143.928,79 | 88.400.775,03 | 0,1408% | 0,1408% |
| 115 | 1.150.450,62 | 89.551.225,65 | 0,1418% | 0,1418% |
| 116 | 1.156.972,45 | 90.708.198,1 | 0,1428% | 0,1428% |
| 117 | 1.163.494,28 | 91.871.692,38 | 0,1438% | 0,1438% |
| 118 | 1.170.016,11 | 93.041.708,49 | 0,1448% | 0,1448% |
| 119 | 1.176.537,94 | 94.218.246,43 | 0,1459% | 0,1459% |
| 120 | 1.183.059,77 | 95.401.306,2 | 0,1469% | 0,1469% |
| 121 | 1.189.581,6 | 96.590.887,8 | 0,1479% | 0,1479% |
| 122 | 1.196.103,43 | 97.786.991,23 | 0,1489% | 0,1489% |
| 123 | 1.202.625,26 | 98.989.616,49 | 0,1499% | 0,1499% |
| 124 | 1.209.147,09 | 100.198.763,58 | 0,1509% | 0,1509% |
| 125 | 1.215.668,92 | 101.414.432,5 | 0,1519% | 0,1519% |
| 126 | 1.222.190,75 | 102.636.623,25 | 0,1529% | 0,1529% |
| 127 | 1.228.712,58 | 103.865.335,83 | 0,1539% | 0,1539% |
| 128 | 1.235.234,41 | 105.100.570,24 | 0,1550% | 0,155% |
| 129 | 1.241.756,24 | 106.342.326,48 | 0,1560% | 0,156% |
| 130 | 1.248.278,07 | 107.590.604,55 | 0,1570% | 0,157% |
| 131 | 1.254.799,9 | 108.845.404,45 | 0,1580% | 0,158% |
| 132 | 1.261.321,73 | 110.106.726,18 | 0,1590% | 0,159% |
| 133 | 1.267.843,56 | 111.374.569,74 | 0,1600% | 0,16% |
| 134 | 1.274.365,39 | 112.648.935,13 | 0,1610% | 0,161% |
| 135 | 1.280.887,22 | 113.929.822,35 | 0,1620% | 0,162% |
| 136 | 1.287.409,05 | 115.217.231,4 | 0,1631% | 0,1631% |
| 137 | 1.293.930,88 | 116.511.162,28 | 0,1641% | 0,1641% |
| 138 | 1.300.452,71 | 117.811.614,99 | 0,1651% | 0,1651% |
| 139 | 1.306.974,54 | 119.118.589,53 | 0,1661% | 0,1661% |
| 140 | 1.313.496,37 | 120.432.085,9 | 0,1671% | 0,1671% |
| 141 | 1.320.018,2 | 121.752.104,1 | 0,1681% | 0,1681% |
| 142 | 1.326.540,03 | 123.078.644,13 | 0,1691% | 0,1691% |
| 143 | 1.333.061,86 | 124.411.705,99 | 0,1701% | 0,1701% |
| 144 | 1.339.583,69 | 125.751.289,68 | 0,1711% | 0,1711% |
| 145 | 1.346.105,52 | 127.097.395,2 | 0,1722% | 0,1722% |
| 146 | 1.352.627,35 | 128.450.022,55 | 0,1732% | 0,1732% |
| 147 | 1.359.149,18 | 129.809.171,73 | 0,1742% | 0,1742% |
| 148 | 1.365.671,01 | 131.174.842,74 | 0,1752% | 0,1752% |
| 149 | 1.372.192,84 | 132.547.035,58 | 0,1762% | 0,1762% |
| 150 | 1.378.714,67 | 133.925.750,25 | 0,1772% | 0,1772% |
| 151 | 1.385.236,5 | 135.310.986,75 | 0,1782% | 0,1782% |
| 152 | 1.391.758,33 | 136.702.745,08 | 0,1792% | 0,1792% |
| 153 | 1.398.280,16 | 138.101.025,24 | 0,1802% | 0,1802% |
| 154 | 1.404.801,99 | 139.505.827,23 | 0,1813% | 0,1813% |
| 155 | 1.411.323,82 | 140.917.151,05 | 0,1823% | 0,1823% |
| 156 | 1.417.845,65 | 142.334.996,7 | 0,1833% | 0,1833% |
| 157 | 1.424.367,48 | 143.759.364,18 | 0,1843% | 0,1843% |
| 158 | 1.430.889,31 | 145.190.253,49 | 0,1853% | 0,1853% |
| 159 | 1.437.411,14 | 146.627.664,63 | 0,1863% | 0,1863% |
| 160 | 1.443.932,97 | 148.071.597,6 | 0,1873% | 0,1873% |
| 161 | 1.450.454,8 | 149.522.052,4 | 0,1883% | 0,1883% |
| 162 | 1.456.976,63 | 150.979.029,03 | 0,1894% | 0,1894% |
| 163 | 1.463.498,46 | 152.442.527,49 | 0,1904% | 0,1904% |
| 164 | 1.470.020,29 | 153.912.547,78 | 0,1914% | 0,1914% |
| 165 | 1.476.542,12 | 155.389.089,9 | 0,1924% | 0,1924% |
| 166 | 1.483.063,95 | 156.872.153,85 | 0,1934% | 0,1934% |
| 167 | 1.489.585,78 | 158.361.739,63 | 0,1944% | 0,1944% |
| 168 | 1.496.107,61 | 159.857.847,24 | 0,1954% | 0,1954% |
| 169 | 1.502.629,44 | 161.360.476,68 | 0,1964% | 0,1964% |
| 170 | 1.509.151,27 | 162.869.627,95 | 0,1974% | 0,1974% |
| 171 | 1.515.673,1 | 164.385.301,05 | 0,1985% | 0,1985% |
| 172 | 1.522.194,93 | 165.907.495,98 | 0,1995% | 0,1995% |
| 173 | 1.528.716,76 | 167.436.212,74 | 0,2005% | 0,2005% |
| 174 | 1.535.238,59 | 168.971.451,33 | 0,2015% | 0,2015% |
| 175 | 1.541.760,42 | 170.513.211,75 | 0,2025% | 0,2025% |
| 176 | 1.548.282,25 | 172.061.494 | 0,2035% | 0,2035% |
| 177 | 1.554.804,08 | 173.616.298,08 | 0,2045% | 0,2045% |
| 178 | 1.561.325,91 | 175.177.623,99 | 0,2055% | 0,2055% |
| 179 | 1.567.847,74 | 176.745.471,73 | 0,2065% | 0,2065% |
| 180 | 1.574.369,57 | 178.319.841,3 | 0,2076% | 0,2076% |
| 181 | 1.580.891,4 | 179.900.732,7 | 0,2086% | 0,2086% |
| 182 | 1.587.413,23 | 181.488.145,93 | 0,2096% | 0,2096% |
| 183 | 1.593.935,06 | 183.082.080,99 | 0,2106% | 0,2106% |
| 184 | 1.600.456,89 | 184.682.537,88 | 0,2116% | 0,2116% |
| 185 | 1.606.978,72 | 186.289.516,6 | 0,2126% | 0,2126% |
| 186 | 1.613.500,55 | 187.903.017,15 | 0,2136% | 0,2136% |
| 187 | 1.620.022,38 | 189.523.039,53 | 0,2146% | 0,2146% |
| 188 | 1.626.544,21 | 191.149.583,74 | 0,2157% | 0,2157% |
| 189 | 1.633.066,04 | 192.782.649,78 | 0,2167% | 0,2167% |
| 190 | 1.639.587,87 | 194.422.237,65 | 0,2177% | 0,2177% |
| 191 | 1.646.109,7 | 196.068.347,35 | 0,2187% | 0,2187% |
| 192 | 1.652.631,53 | 197.720.978,88 | 0,2197% | 0,2197% |
| 193 | 1.659.153,36 | 199.380.132,24 | 0,2207% | 0,2207% |
| 194 | 1.665.675,19 | 201.045.807,43 | 0,2217% | 0,2217% |
| 195 | 1.672.197,02 | 202.718.004,45 | 0,2227% | 0,2227% |
| 196 | 1.678.718,85 | 204.396.723,3 | 0,2237% | 0,2237% |
| 197 | 1.685.240,68 | 206.081.963,98 | 0,2248% | 0,2248% |
| 198 | 1.691.762,51 | 207.773.726,49 | 0,2258% | 0,2258% |
| 199 | 1.698.284,34 | 209.472.010,83 | 0,2268% | 0,2268% |
| 200 | 1.704.806,17 | 211.176.817 | 0,2278% | 0,2278% |
| 201 | 1.711.328 | 212.888.145 | 0,2288% | 0,2288% |
| 202 | 1.717.849,83 | 214.605.994,83 | 0,2298% | 0,2298% |
| 203 | 1.724.371,66 | 216.330.366,49 | 0,2308% | 0,2308% |
| 204 | 1.730.893,49 | 218.061.259,98 | 0,2318% | 0,2318% |
| 205 | 1.737.415,32 | 219.798.675,3 | 0,2328% | 0,2328% |
| 206 | 1.743.937,15 | 221.542.612,45 | 0,2339% | 0,2339% |
| 207 | 1.750.458,98 | 223.293.071,43 | 0,2349% | 0,2349% |
| 208 | 1.756.980,81 | 225.050.052,24 | 0,2359% | 0,2359% |
| 209 | 1.763.502,64 | 226.813.554,88 | 0,2369% | 0,2369% |
| 210 | 1.770.024,47 | 228.583.579,35 | 0,2379% | 0,2379% |
| 211 | 1.776.546,3 | 230.360.125,65 | 0,2389% | 0,2389% |
| 212 | 1.783.068,13 | 232.143.193,78 | 0,2399% | 0,2399% |
| 213 | 1.789.589,96 | 233.932.783,74 | 0,2409% | 0,2409% |
| 214 | 1.796.111,79 | 235.728.895,53 | 0,2419% | 0,2419% |
| 215 | 1.802.633,62 | 237.531.529,15 | 0,2430% | 0,243% |
| 216 | 1.809.155,45 | 239.340.684,6 | 0,2440% | 0,244% |
| 217 | 1.815.677,28 | 241.156.361,88 | 0,2450% | 0,245% |
| 218 | 1.822.199,11 | 242.978.560,99 | 0,2460% | 0,246% |
| 219 | 1.828.720,94 | 244.807.281,93 | 0,2470% | 0,247% |
| 220 | 1.835.242,77 | 246.642.524,7 | 0,2480% | 0,248% |
| 221 | 1.841.764,6 | 248.484.289,3 | 0,2490% | 0,249% |
| 222 | 1.848.286,43 | 250.332.575,73 | 0,2500% | 0,25% |
| 223 | 1.854.808,26 | 252.187.383,99 | 0,2511% | 0,2511% |
| 224 | 1.861.330,09 | 254.048.714,08 | 0,2521% | 0,2521% |
| 225 | 1.867.851,92 | 255.916.566 | 0,2531% | 0,2531% |
| 226 | 1.874.373,75 | 257.790.939,75 | 0,2541% | 0,2541% |
| 227 | 1.880.895,58 | 259.671.835,33 | 0,2551% | 0,2551% |
| 228 | 1.887.417,41 | 261.559.252,74 | 0,2561% | 0,2561% |
| 229 | 1.893.939,24 | 263.453.191,98 | 0,2571% | 0,2571% |
| 230 | 1.900.461,07 | 265.353.653,05 | 0,2581% | 0,2581% |
| 231 | 1.906.982,9 | 267.260.635,95 | 0,2591% | 0,2591% |
| 232 | 1.913.504,73 | 269.174.140,68 | 0,2602% | 0,2602% |
| 233 | 1.920.026,56 | 271.094.167,24 | 0,2612% | 0,2612% |
| 234 | 1.926.548,39 | 273.020.715,63 | 0,2622% | 0,2622% |
| 235 | 1.933.070,22 | 274.953.785,85 | 0,2632% | 0,2632% |
| 236 | 1.939.592,05 | 276.893.377,9 | 0,2642% | 0,2642% |
| 237 | 1.946.113,88 | 278.839.491,78 | 0,2652% | 0,2652% |
| 238 | 1.952.635,71 | 280.792.127,49 | 0,2662% | 0,2662% |
| 239 | 1.959.157,54 | 282.751.285,03 | 0,2672% | 0,2672% |
| 240 | 1.965.679,37 | 284.716.964,4 | 0,2682% | 0,2682% |
| 241 | 1.972.201,2 | 286.689.165,6 | 0,2693% | 0,2693% |
| 242 | 1.978.723,03 | 288.667.888,63 | 0,2703% | 0,2703% |
| 243 | 1.985.244,86 | 290.653.133,49 | 0,2713% | 0,2713% |
| 244 | 1.991.766,69 | 292.644.900,18 | 0,2723% | 0,2723% |
| 245 | 1.998.288,52 | 294.643.188,7 | 0,2733% | 0,2733% |
| 246 | 2.004.810,35 | 296.647.999,05 | 0,2743% | 0,2743% |
| 247 | 2.011.332,18 | 298.659.331,23 | 0,2753% | 0,2753% |
| 248 | 2.017.854,01 | 300.677.185,24 | 0,2763% | 0,2763% |
| 249 | 2.024.375,84 | 302.701.561,08 | 0,2774% | 0,2774% |
| 250 | 2.030.897,67 | 304.732.458,75 | 0,2784% | 0,2784% |
| 251 | 2.037.419,5 | 306.769.878,25 | 0,2794% | 0,2794% |
| 252 | 2.043.941,33 | 308.813.819,58 | 0,2804% | 0,2804% |
| 253 | 2.050.463,16 | 310.864.282,74 | 0,2814% | 0,2814% |
| 254 | 2.056.984,99 | 312.921.267,73 | 0,2824% | 0,2824% |
| 255 | 2.063.506,82 | 314.984.774,55 | 0,2834% | 0,2834% |
| 256 | 2.070.028,65 | 317.054.803,2 | 0,2844% | 0,2844% |
| 257 | 2.076.550,48 | 319.131.353,68 | 0,2854% | 0,2854% |
| 258 | 2.083.072,31 | 321.214.425,99 | 0,2865% | 0,2865% |
| 259 | 2.089.594,14 | 323.304.020,13 | 0,2875% | 0,2875% |
| 260 | 2.096.115,97 | 325.400.136,1 | 0,2885% | 0,2885% |
| 261 | 2.102.637,8 | 327.502.773,9 | 0,2895% | 0,2895% |
| 262 | 2.109.159,63 | 329.611.933,53 | 0,2905% | 0,2905% |
| 263 | 2.115.681,46 | 331.727.614,99 | 0,2915% | 0,2915% |
| 264 | 2.122.203,29 | 333.849.818,28 | 0,2925% | 0,2925% |
| 265 | 2.128.725,12 | 335.978.543,4 | 0,2935% | 0,2935% |
| 266 | 2.135.246,95 | 338.113.790,35 | 0,2945% | 0,2945% |
| 267 | 2.141.768,78 | 340.255.559,13 | 0,2956% | 0,2956% |
| 268 | 2.148.290,61 | 342.403.849,74 | 0,2966% | 0,2966% |
| 269 | 2.154.812,44 | 344.558.662,18 | 0,2976% | 0,2976% |
| 270 | 2.161.334,27 | 346.719.996,45 | 0,2986% | 0,2986% |
| 271 | 2.167.856,1 | 348.887.852,55 | 0,2996% | 0,2996% |
| 272 | 2.174.377,93 | 351.062.230,48 | 0,3006% | 0,3006% |
| 273 | 2.180.899,76 | 353.243.130,24 | 0,3016% | 0,3016% |
| 274 | 2.187.421,59 | 355.430.551,83 | 0,3026% | 0,3026% |
| 275 | 2.193.943,42 | 357.624.495,25 | 0,3037% | 0,3037% |
| 276 | 2.200.465,25 | 359.824.960,5 | 0,3047% | 0,3047% |
| 277 | 2.206.987,08 | 362.031.947,58 | 0,3057% | 0,3057% |
| 278 | 2.213.508,91 | 364.245.456,49 | 0,3067% | 0,3067% |
| 279 | 2.220.030,74 | 366.465.487,23 | 0,3077% | 0,3077% |
| 280 | 2.226.552,57 | 368.692.039,8 | 0,3087% | 0,3087% |
| 281 | 2.233.074,4 | 370.925.114,2 | 0,3097% | 0,3097% |
| 282 | 2.239.596,23 | 373.164.710,43 | 0,3107% | 0,3107% |
| 283 | 2.246.118,06 | 375.410.828,49 | 0,3117% | 0,3117% |
| 284 | 2.252.639,89 | 377.663.468,38 | 0,3128% | 0,3128% |
| 285 | 2.259.161,72 | 379.922.630,1 | 0,3138% | 0,3138% |
| 286 | 2.265.683,55 | 382.188.313,65 | 0,3148% | 0,3148% |
| 287 | 2.272.205,38 | 384.460.519,03 | 0,3158% | 0,3158% |
| 288 | 2.278.727,21 | 386.739.246,24 | 0,3168% | 0,3168% |
| 289 | 2.285.249,04 | 389.024.495,28 | 0,3178% | 0,3178% |
| 290 | 2.291.770,87 | 391.316.266,15 | 0,3188% | 0,3188% |
| 291 | 2.298.292,7 | 393.614.558,85 | 0,3198% | 0,3198% |
| 292 | 2.304.814,53 | 395.919.373,38 | 0,3208% | 0,3208% |
| 293 | 2.311.336,36 | 398.230.709,74 | 0,3219% | 0,3219% |
| 294 | 2.317.858,19 | 400.548.567,93 | 0,3229% | 0,3229% |
| 295 | 2.324.380,02 | 402.872.947,95 | 0,3239% | 0,3239% |
| 296 | 2.330.901,85 | 405.203.849,8 | 0,3249% | 0,3249% |
| 297 | 2.337.423,68 | 407.541.273,48 | 0,3259% | 0,3259% |
| 298 | 2.343.945,51 | 409.885.218,99 | 0,3269% | 0,3269% |
| 299 | 2.350.467,34 | 412.235.686,33 | 0,3279% | 0,3279% |
| 300 | 2.356.989,17 | 414.592.675,5 | 0,3289% | 0,3289% |
| 301 | 2.363.511 | 416.956.186,5 | 0,3300% | 0,33% |
| 302 | 2.370.032,83 | 419.326.219,33 | 0,3310% | 0,331% |
| 303 | 2.376.554,66 | 421.702.773,99 | 0,3320% | 0,332% |
| 304 | 2.383.076,49 | 424.085.850,48 | 0,3330% | 0,333% |
| 305 | 2.389.598,32 | 426.475.448,8 | 0,3340% | 0,334% |
| 306 | 2.396.120,15 | 428.871.568,95 | 0,3350% | 0,335% |
| 307 | 2.402.641,98 | 431.274.210,93 | 0,3360% | 0,336% |
| 308 | 2.409.163,81 | 433.683.374,74 | 0,3370% | 0,337% |
| 309 | 2.415.685,64 | 436.099.060,38 | 0,3380% | 0,338% |
| 310 | 2.422.207,47 | 438.521.267,85 | 0,3391% | 0,3391% |
| 311 | 2.428.729,3 | 440.949.997,15 | 0,3401% | 0,3401% |
| 312 | 2.435.251,13 | 443.385.248,28 | 0,3411% | 0,3411% |
| 313 | 2.441.772,96 | 445.827.021,24 | 0,3421% | 0,3421% |
| 314 | 2.448.294,79 | 448.275.316,03 | 0,3431% | 0,3431% |
| 315 | 2.454.816,62 | 450.730.132,65 | 0,3441% | 0,3441% |
| 316 | 2.461.338,45 | 453.191.471,1 | 0,3451% | 0,3451% |
| 317 | 2.467.860,28 | 455.659.331,38 | 0,3461% | 0,3461% |
| 318 | 2.474.382,11 | 458.133.713,49 | 0,3471% | 0,3471% |
| 319 | 2.480.903,94 | 460.614.617,43 | 0,3482% | 0,3482% |
| 320 | 2.487.425,77 | 463.102.043,2 | 0,3492% | 0,3492% |
| 321 | 2.493.947,6 | 465.595.990,8 | 0,3502% | 0,3502% |
| 322 | 2.500.469,43 | 468.096.460,23 | 0,3512% | 0,3512% |
| 323 | 2.506.991,26 | 470.603.451,49 | 0,3522% | 0,3522% |
| 324 | 2.513.513,09 | 473.116.964,58 | 0,3532% | 0,3532% |
| 325 | 2.520.034,92 | 475.636.999,5 | 0,3542% | 0,3542% |
| 326 | 2.526.556,75 | 478.163.556,25 | 0,3552% | 0,3552% |
| 327 | 2.533.078,58 | 480.696.634,83 | 0,3562% | 0,3562% |
| 328 | 2.539.600,41 | 483.236.235,24 | 0,3573% | 0,3573% |
| 329 | 2.546.122,24 | 485.782.357,48 | 0,3583% | 0,3583% |
| 330 | 2.552.644,07 | 488.335.001,55 | 0,3593% | 0,3593% |
| 331 | 2.559.165,9 | 490.894.167,45 | 0,3603% | 0,3603% |
| 332 | 2.565.687,73 | 493.459.855,18 | 0,3613% | 0,3613% |
| 333 | 2.572.209,56 | 496.032.064,74 | 0,3623% | 0,3623% |
| 334 | 2.578.731,39 | 498.610.796,13 | 0,3633% | 0,3633% |
| 335 | 2.585.253,22 | 501.196.049,35 | 0,3643% | 0,3643% |
| 336 | 2.591.775,05 | 503.787.824,4 | 0,3654% | 0,3654% |
| 337 | 2.598.296,88 | 506.386.121,28 | 0,3664% | 0,3664% |
| 338 | 2.604.818,71 | 508.990.939,99 | 0,3674% | 0,3674% |
| 339 | 2.611.340,54 | 511.602.280,53 | 0,3684% | 0,3684% |
| 340 | 2.617.862,37 | 514.220.142,9 | 0,3694% | 0,3694% |
| 341 | 2.624.384,2 | 516.844.527,1 | 0,3704% | 0,3704% |
| 342 | 2.630.906,03 | 519.475.433,13 | 0,3714% | 0,3714% |
| 343 | 2.637.427,86 | 522.112.860,99 | 0,3724% | 0,3724% |
| 344 | 2.643.949,69 | 524.756.810,68 | 0,3734% | 0,3734% |
| 345 | 2.650.471,52 | 527.407.282,2 | 0,3745% | 0,3745% |
| 346 | 2.656.993,35 | 530.064.275,55 | 0,3755% | 0,3755% |
| 347 | 2.663.515,18 | 532.727.790,73 | 0,3765% | 0,3765% |
| 348 | 2.670.037,01 | 535.397.827,74 | 0,3775% | 0,3775% |
| 349 | 2.676.558,84 | 538.074.386,58 | 0,3785% | 0,3785% |
| 350 | 2.683.080,67 | 540.757.467,25 | 0,3795% | 0,3795% |
| 351 | 2.689.602,5 | 543.447.069,75 | 0,3805% | 0,3805% |
| 352 | 2.696.124,33 | 546.143.194,08 | 0,3815% | 0,3815% |
| 353 | 2.702.646,16 | 548.845.840,24 | 0,3825% | 0,3825% |
| 354 | 2.709.167,99 | 551.555.008,23 | 0,3836% | 0,3836% |
| 355 | 2.715.689,82 | 554.270.698,05 | 0,3846% | 0,3846% |
| 356 | 2.722.211,65 | 556.992.909,7 | 0,3856% | 0,3856% |
| 357 | 2.728.733,48 | 559.721.643,18 | 0,3866% | 0,3866% |
| 358 | 2.735.255,31 | 562.456.898,49 | 0,3876% | 0,3876% |
| 359 | 2.741.777,14 | 565.198.675,63 | 0,3886% | 0,3886% |
| 360 | 2.748.298,97 | 567.946.974,6 | 0,3896% | 0,3896% |
| 361 | 2.754.820,8 | 570.701.795,4 | 0,3906% | 0,3906% |
| 362 | 2.761.342,63 | 573.463.138,03 | 0,3917% | 0,3917% |
| 363 | 2.767.864,46 | 576.231.002,49 | 0,3927% | 0,3927% |
| 364 | 2.774.386,29 | 579.005.388,78 | 0,3937% | 0,3937% |
| 365 | 2.780.908,12 | 581.786.296,9 | 0,3947% | 0,3947% |
| 366 | 2.787.429,95 | 584.573.726,85 | 0,3957% | 0,3957% |
| 367 | 2.793.951,78 | 587.367.678,63 | 0,3967% | 0,3967% |
| 368 | 2.800.473,61 | 590.168.152,24 | 0,3977% | 0,3977% |
| 369 | 2.806.995,44 | 592.975.147,68 | 0,3987% | 0,3987% |
| 370 | 2.813.517,27 | 595.788.664,95 | 0,3997% | 0,3997% |
| 371 | 2.820.039,1 | 598.608.704,05 | 0,4008% | 0,4008% |
| 372 | 2.826.560,93 | 601.435.264,98 | 0,4018% | 0,4018% |
| 373 | 2.833.082,76 | 604.268.347,74 | 0,4028% | 0,4028% |
| 374 | 2.839.604,59 | 607.107.952,33 | 0,4038% | 0,4038% |
| 375 | 2.846.126,42 | 609.954.078,75 | 0,4048% | 0,4048% |
| 376 | 2.852.648,25 | 612.806.727 | 0,4058% | 0,4058% |
| 377 | 2.859.170,08 | 615.665.897,08 | 0,4068% | 0,4068% |
| 378 | 2.865.691,91 | 618.531.588,99 | 0,4078% | 0,4078% |
| 379 | 2.872.213,74 | 621.403.802,73 | 0,4088% | 0,4088% |
| 380 | 2.878.735,57 | 624.282.538,3 | 0,4099% | 0,4099% |
| 381 | 2.885.257,4 | 627.167.795,7 | 0,4109% | 0,4109% |
| 382 | 2.891.779,23 | 630.059.574,93 | 0,4119% | 0,4119% |
| 383 | 2.898.301,06 | 632.957.875,99 | 0,4129% | 0,4129% |
| 384 | 2.904.822,89 | 635.862.698,88 | 0,4139% | 0,4139% |
| 385 | 2.911.344,72 | 638.774.043,6 | 0,4149% | 0,4149% |
| 386 | 2.917.866,55 | 641.691.910,15 | 0,4159% | 0,4159% |
| 387 | 2.924.388,38 | 644.616.298,53 | 0,4169% | 0,4169% |
| 388 | 2.930.910,21 | 647.547.208,74 | 0,4180% | 0,418% |
| 389 | 2.937.432,04 | 650.484.640,78 | 0,4190% | 0,419% |
| 390 | 2.943.953,87 | 653.428.594,65 | 0,4200% | 0,42% |
| 391 | 2.950.475,7 | 656.379.070,35 | 0,4210% | 0,421% |
| 392 | 2.956.997,53 | 659.336.067,88 | 0,4220% | 0,422% |
| 393 | 2.963.519,36 | 662.299.587,24 | 0,4230% | 0,423% |
| 394 | 2.970.041,19 | 665.269.628,43 | 0,4240% | 0,424% |
| 395 | 2.976.563,02 | 668.246.191,45 | 0,4250% | 0,425% |
| 396 | 2.983.084,85 | 671.229.276,3 | 0,4260% | 0,426% |
| 397 | 2.989.606,68 | 674.218.882,98 | 0,4271% | 0,4271% |
| 398 | 2.996.128,51 | 677.215.011,49 | 0,4281% | 0,4281% |
| 399 | 3.002.650,34 | 680.217.661,83 | 0,4291% | 0,4291% |
| 400 | 3.009.172,17 | 683.226.834 | 0,4301% | 0,4301% |
| 401 | 3.015.694 | 686.242.528 | 0,4311% | 0,4311% |
| 402 | 3.022.215,83 | 689.264.743,83 | 0,4321% | 0,4321% |
| 403 | 3.028.737,66 | 692.293.481,49 | 0,4331% | 0,4331% |
| 404 | 3.035.259,49 | 695.328.740,98 | 0,4341% | 0,4341% |
| 405 | 3.041.781,32 | 698.370.522,3 | 0,4351% | 0,4351% |
| 406 | 3.048.303,15 | 701.418.825,45 | 0,4362% | 0,4362% |
| 407 | 3.054.824,98 | 704.473.650,43 | 0,4372% | 0,4372% |
| 408 | 3.061.346,81 | 707.534.997,24 | 0,4382% | 0,4382% |
| 409 | 3.067.868,64 | 710.602.865,88 | 0,4392% | 0,4392% |
| 410 | 3.074.390,47 | 713.677.256,35 | 0,4402% | 0,4402% |
| 411 | 3.080.912,3 | 716.758.168,65 | 0,4412% | 0,4412% |
| 412 | 3.087.434,13 | 719.845.602,78 | 0,4422% | 0,4422% |
| 413 | 3.093.955,96 | 722.939.558,74 | 0,4432% | 0,4432% |
| 414 | 3.100.477,79 | 726.040.036,53 | 0,4442% | 0,4442% |
| 415 | 3.106.999,62 | 729.147.036,15 | 0,4453% | 0,4453% |
| 416 | 3.113.521,45 | 732.260.557,6 | 0,4463% | 0,4463% |
| 417 | 3.120.043,28 | 735.380.600,88 | 0,4473% | 0,4473% |
| 418 | 3.126.565,11 | 738.507.165,99 | 0,4483% | 0,4483% |
| 419 | 3.133.086,94 | 741.640.252,93 | 0,4493% | 0,4493% |
| 420 | 3.139.608,77 | 744.779.861,7 | 0,4503% | 0,4503% |
| 421 | 3.146.130,6 | 747.925.992,3 | 0,4513% | 0,4513% |
| 422 | 3.152.652,43 | 751.078.644,73 | 0,4523% | 0,4523% |
| 423 | 3.159.174,26 | 754.237.818,99 | 0,4534% | 0,4534% |
| 424 | 3.165.696,09 | 757.403.515,08 | 0,4544% | 0,4544% |
| 425 | 3.172.217,92 | 760.575.733 | 0,4554% | 0,4554% |
| 426 | 3.178.739,75 | 763.754.472,75 | 0,4564% | 0,4564% |
| 427 | 3.185.261,58 | 766.939.734,33 | 0,4574% | 0,4574% |
| 428 | 3.191.783,41 | 770.131.517,74 | 0,4584% | 0,4584% |
| 429 | 3.198.305,24 | 773.329.822,98 | 0,4594% | 0,4594% |
| 430 | 3.204.827,07 | 776.534.650,05 | 0,4604% | 0,4604% |
| 431 | 3.211.348,9 | 779.745.998,95 | 0,4614% | 0,4614% |
| 432 | 3.217.870,73 | 782.963.869,68 | 0,4625% | 0,4625% |
| 433 | 3.224.392,56 | 786.188.262,24 | 0,4635% | 0,4635% |
| 434 | 3.230.914,39 | 789.419.176,63 | 0,4645% | 0,4645% |
| 435 | 3.237.436,22 | 792.656.612,85 | 0,4655% | 0,4655% |
| 436 | 3.243.958,05 | 795.900.570,9 | 0,4665% | 0,4665% |
| 437 | 3.250.479,88 | 799.151.050,78 | 0,4675% | 0,4675% |
| 438 | 3.257.001,71 | 802.408.052,49 | 0,4685% | 0,4685% |
| 439 | 3.263.523,54 | 805.671.576,03 | 0,4695% | 0,4695% |
| 440 | 3.270.045,37 | 808.941.621,4 | 0,4705% | 0,4705% |
| 441 | 3.276.567,2 | 812.218.188,6 | 0,4716% | 0,4716% |
| 442 | 3.283.089,03 | 815.501.277,63 | 0,4726% | 0,4726% |
| 443 | 3.289.610,86 | 818.790.888,49 | 0,4736% | 0,4736% |
| 444 | 3.296.132,69 | 822.087.021,18 | 0,4746% | 0,4746% |
| 445 | 3.302.654,52 | 825.389.675,7 | 0,4756% | 0,4756% |
| 446 | 3.309.176,35 | 828.698.852,05 | 0,4766% | 0,4766% |
| 447 | 3.315.698,18 | 832.014.550,23 | 0,4776% | 0,4776% |
| 448 | 3.322.220,01 | 835.336.770,24 | 0,4786% | 0,4786% |
| 449 | 3.328.741,84 | 838.665.512,08 | 0,4797% | 0,4797% |
| 450 | 3.335.263,67 | 842.000.775,75 | 0,4807% | 0,4807% |
| 451 | 3.341.785,5 | 845.342.561,25 | 0,4817% | 0,4817% |
| 452 | 3.348.307,33 | 848.690.868,58 | 0,4827% | 0,4827% |
| 453 | 3.354.829,16 | 852.045.697,74 | 0,4837% | 0,4837% |
| 454 | 3.361.350,99 | 855.407.048,73 | 0,4847% | 0,4847% |
| 455 | 3.367.872,82 | 858.774.921,55 | 0,4857% | 0,4857% |
| 456 | 3.374.394,65 | 862.149.316,2 | 0,4867% | 0,4867% |
| 457 | 3.380.916,48 | 865.530.232,68 | 0,4877% | 0,4877% |
| 458 | 3.387.438,31 | 868.917.670,99 | 0,4888% | 0,4888% |
| 459 | 3.393.960,14 | 872.311.631,13 | 0,4898% | 0,4898% |
| 460 | 3.400.481,97 | 875.712.113,1 | 0,4908% | 0,4908% |
| 461 | 3.407.003,8 | 879.119.116,9 | 0,4918% | 0,4918% |
| 462 | 3.413.525,63 | 882.532.642,53 | 0,4928% | 0,4928% |
| 463 | 3.420.047,46 | 885.952.689,99 | 0,4938% | 0,4938% |
| 464 | 3.426.569,29 | 889.379.259,28 | 0,4948% | 0,4948% |
| 465 | 3.433.091,12 | 892.812.350,4 | 0,4958% | 0,4958% |
| 466 | 3.439.612,95 | 896.251.963,35 | 0,4968% | 0,4968% |
| 467 | 3.446.134,78 | 899.698.098,13 | 0,4979% | 0,4979% |
| 468 | 3.452.656,61 | 903.150.754,74 | 0,4989% | 0,4989% |
| 469 | 3.459.178,44 | 906.609.933,18 | 0,4999% | 0,4999% |
| 470 | 3.465.700,27 | 910.075.633,45 | 0,5009% | 0,5009% |
| 471 | 3.472.222,1 | 913.547.855,55 | 0,5019% | 0,5019% |
| 472 | 3.478.743,93 | 917.026.599,48 | 0,5029% | 0,5029% |
| 473 | 3.485.265,76 | 920.511.865,24 | 0,5039% | 0,5039% |
| 474 | 3.491.787,59 | 924.003.652,83 | 0,5049% | 0,5049% |
| 475 | 3.498.309,42 | 927.501.962,25 | 0,5060% | 0,506% |
| 476 | 3.504.831,25 | 931.006.793,5 | 0,5070% | 0,507% |
| 477 | 3.511.353,08 | 934.518.146,58 | 0,5080% | 0,508% |
| 478 | 3.517.874,91 | 938.036.021,49 | 0,5090% | 0,509% |
| 479 | 3.524.396,74 | 941.560.418,23 | 0,5100% | 0,51% |
| 480 | 3.530.918,57 | 945.091.336,8 | 0,5110% | 0,511% |
| 481 | 3.537.440,4 | 948.628.777,2 | 0,5120% | 0,512% |
| 482 | 3.543.962,23 | 952.172.739,43 | 0,5130% | 0,513% |
| 483 | 3.550.484,06 | 955.723.223,49 | 0,5140% | 0,514% |
| 484 | 3.557.005,89 | 959.280.229,38 | 0,5151% | 0,5151% |
| 485 | 3.563.527,72 | 962.843.757,1 | 0,5161% | 0,5161% |
| 486 | 3.570.049,55 | 966.413.806,65 | 0,5171% | 0,5171% |
| 487 | 3.576.571,38 | 969.990.378,03 | 0,5181% | 0,5181% |
| 488 | 3.583.093,21 | 973.573.471,24 | 0,5191% | 0,5191% |
| 489 | 3.589.615,04 | 977.163.086,28 | 0,5201% | 0,5201% |
| 490 | 3.596.136,87 | 980.759.223,15 | 0,5211% | 0,5211% |
| 491 | 3.602.658,7 | 984.361.881,85 | 0,5221% | 0,5221% |
| 492 | 3.609.180,53 | 987.971.062,38 | 0,5231% | 0,5231% |
| 493 | 3.615.702,36 | 991.586.764,74 | 0,5242% | 0,5242% |
| 494 | 3.622.224,19 | 995.208.988,93 | 0,5252% | 0,5252% |
| 495 | 3.628.746,02 | 998.837.734,95 | 0,5262% | 0,5262% |
| 496 | 3.635.267,85 | 1.002.473.002,8 | 0,5272% | 0,5272% |
| 497 | 3.641.789,68 | 1.006.114.792,48 | 0,5282% | 0,5282% |
| 498 | 3.648.311,51 | 1.009.763.103,99 | 0,5292% | 0,5292% |
| 499 | 3.654.833,34 | 1.013.417.937,33 | 0,5302% | 0,5302% |
| 500 | 3.661.355,17 | 1.017.079.292,5 | 0,5312% | 0,5312% |

### Anexo — Espantalho

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 420.925 | 420.925 | 0,0345% | 0,0345% |
| 2 | 427.670,59 | 848.595,59 | 0,0358% | 0,03582% |
| 3 | 434.416,18 | 1.283.011,77 | 0,0371% | 0,03713% |
| 4 | 441.161,77 | 1.724.173,54 | 0,0385% | 0,03845% |
| 5 | 447.907,36 | 2.172.080,9 | 0,0398% | 0,03977% |
| 6 | 454.652,95 | 2.626.733,85 | 0,0411% | 0,04108% |
| 7 | 461.398,54 | 3.088.132,39 | 0,0424% | 0,0424% |
| 8 | 468.144,13 | 3.556.276,52 | 0,0437% | 0,04372% |
| 9 | 474.889,72 | 4.031.166,24 | 0,0450% | 0,04503% |
| 10 | 481.635,31 | 4.512.801,55 | 0,0464% | 0,04635% |
| 11 | 488.380,9 | 5.001.182,45 | 0,0477% | 0,04767% |
| 12 | 495.126,49 | 5.496.308,94 | 0,0490% | 0,04898% |
| 13 | 501.872,08 | 5.998.181,02 | 0,0503% | 0,0503% |
| 14 | 508.617,67 | 6.506.798,69 | 0,0516% | 0,05162% |
| 15 | 515.363,26 | 7.022.161,95 | 0,0529% | 0,05294% |
| 16 | 522.108,85 | 7.544.270,8 | 0,0543% | 0,05425% |
| 17 | 528.854,44 | 8.073.125,24 | 0,0556% | 0,05557% |
| 18 | 535.600,03 | 8.608.725,27 | 0,0569% | 0,05689% |
| 19 | 542.345,62 | 9.151.070,89 | 0,0582% | 0,0582% |
| 20 | 549.091,21 | 9.700.162,1 | 0,0595% | 0,05952% |
| 21 | 555.836,8 | 10.255.998,9 | 0,0608% | 0,06084% |
| 22 | 562.582,39 | 10.818.581,29 | 0,0622% | 0,06215% |
| 23 | 569.327,98 | 11.387.909,27 | 0,0635% | 0,06347% |
| 24 | 576.073,57 | 11.963.982,84 | 0,0648% | 0,06479% |
| 25 | 582.819,16 | 12.546.802 | 0,0661% | 0,0661% |
| 26 | 589.564,75 | 13.136.366,75 | 0,0674% | 0,06742% |
| 27 | 596.310,34 | 13.732.677,09 | 0,0687% | 0,06874% |
| 28 | 603.055,93 | 14.335.733,02 | 0,0701% | 0,07005% |
| 29 | 609.801,52 | 14.945.534,54 | 0,0714% | 0,07137% |
| 30 | 616.547,11 | 15.562.081,65 | 0,0727% | 0,07269% |
| 31 | 623.292,7 | 16.185.374,35 | 0,0740% | 0,074% |
| 32 | 630.038,29 | 16.815.412,64 | 0,0753% | 0,07532% |
| 33 | 636.783,88 | 17.452.196,52 | 0,0766% | 0,07664% |
| 34 | 643.529,47 | 18.095.725,99 | 0,0780% | 0,07795% |
| 35 | 650.275,06 | 18.746.001,05 | 0,0793% | 0,07927% |
| 36 | 657.020,65 | 19.403.021,7 | 0,0806% | 0,08059% |
| 37 | 663.766,24 | 20.066.787,94 | 0,0819% | 0,0819% |
| 38 | 670.511,83 | 20.737.299,77 | 0,0832% | 0,08322% |
| 39 | 677.257,42 | 21.414.557,19 | 0,0845% | 0,08454% |
| 40 | 684.003,01 | 22.098.560,2 | 0,0859% | 0,08586% |
| 41 | 690.748,6 | 22.789.308,8 | 0,0872% | 0,08717% |
| 42 | 697.494,19 | 23.486.802,99 | 0,0885% | 0,08849% |
| 43 | 704.239,78 | 24.191.042,77 | 0,0898% | 0,08981% |
| 44 | 710.985,37 | 24.902.028,14 | 0,0911% | 0,09112% |
| 45 | 717.730,96 | 25.619.759,1 | 0,0924% | 0,09244% |
| 46 | 724.476,55 | 26.344.235,65 | 0,0938% | 0,09376% |
| 47 | 731.222,14 | 27.075.457,79 | 0,0951% | 0,09507% |
| 48 | 737.967,73 | 27.813.425,52 | 0,0964% | 0,09639% |
| 49 | 744.713,32 | 28.558.138,84 | 0,0977% | 0,09771% |
| 50 | 751.458,91 | 29.309.597,75 | 0,0990% | 0,09902% |
| 51 | 758.204,5 | 30.067.802,25 | 0,1003% | 0,1003% |
| 52 | 764.950,09 | 30.832.752,34 | 0,1017% | 0,1017% |
| 53 | 771.695,68 | 31.604.448,02 | 0,1030% | 0,103% |
| 54 | 778.441,27 | 32.382.889,29 | 0,1043% | 0,1043% |
| 55 | 785.186,86 | 33.168.076,15 | 0,1056% | 0,1056% |
| 56 | 791.932,45 | 33.960.008,6 | 0,1069% | 0,1069% |
| 57 | 798.678,04 | 34.758.686,64 | 0,1082% | 0,1082% |
| 58 | 805.423,63 | 35.564.110,27 | 0,1096% | 0,1096% |
| 59 | 812.169,22 | 36.376.279,49 | 0,1109% | 0,1109% |
| 60 | 818.914,81 | 37.195.194,3 | 0,1122% | 0,1122% |
| 61 | 825.660,4 | 38.020.854,7 | 0,1135% | 0,1135% |
| 62 | 832.405,99 | 38.853.260,69 | 0,1148% | 0,1148% |
| 63 | 839.151,58 | 39.692.412,27 | 0,1161% | 0,1161% |
| 64 | 845.897,17 | 40.538.309,44 | 0,1175% | 0,1175% |
| 65 | 852.642,76 | 41.390.952,2 | 0,1188% | 0,1188% |
| 66 | 859.388,35 | 42.250.340,55 | 0,1201% | 0,1201% |
| 67 | 866.133,94 | 43.116.474,49 | 0,1214% | 0,1214% |
| 68 | 872.879,53 | 43.989.354,02 | 0,1227% | 0,1227% |
| 69 | 879.625,12 | 44.868.979,14 | 0,1240% | 0,124% |
| 70 | 886.370,71 | 45.755.349,85 | 0,1254% | 0,1254% |
| 71 | 893.116,3 | 46.648.466,15 | 0,1267% | 0,1267% |
| 72 | 899.861,89 | 47.548.328,04 | 0,1280% | 0,128% |
| 73 | 906.607,48 | 48.454.935,52 | 0,1293% | 0,1293% |
| 74 | 913.353,07 | 49.368.288,59 | 0,1306% | 0,1306% |
| 75 | 920.098,66 | 50.288.387,25 | 0,1319% | 0,1319% |
| 76 | 926.844,25 | 51.215.231,5 | 0,1333% | 0,1333% |
| 77 | 933.589,84 | 52.148.821,34 | 0,1346% | 0,1346% |
| 78 | 940.335,43 | 53.089.156,77 | 0,1359% | 0,1359% |
| 79 | 947.081,02 | 54.036.237,79 | 0,1372% | 0,1372% |
| 80 | 953.826,61 | 54.990.064,4 | 0,1385% | 0,1385% |
| 81 | 960.572,2 | 55.950.636,6 | 0,1398% | 0,1398% |
| 82 | 967.317,79 | 56.917.954,39 | 0,1412% | 0,1412% |
| 83 | 974.063,38 | 57.892.017,77 | 0,1425% | 0,1425% |
| 84 | 980.808,97 | 58.872.826,74 | 0,1438% | 0,1438% |
| 85 | 987.554,56 | 59.860.381,3 | 0,1451% | 0,1451% |
| 86 | 994.300,15 | 60.854.681,45 | 0,1464% | 0,1464% |
| 87 | 1.001.045,74 | 61.855.727,19 | 0,1477% | 0,1477% |
| 88 | 1.007.791,33 | 62.863.518,52 | 0,1491% | 0,1491% |
| 89 | 1.014.536,92 | 63.878.055,44 | 0,1504% | 0,1504% |
| 90 | 1.021.282,51 | 64.899.337,95 | 0,1517% | 0,1517% |
| 91 | 1.028.028,1 | 65.927.366,05 | 0,1530% | 0,153% |
| 92 | 1.034.773,69 | 66.962.139,74 | 0,1543% | 0,1543% |
| 93 | 1.041.519,28 | 68.003.659,02 | 0,1556% | 0,1556% |
| 94 | 1.048.264,87 | 69.051.923,89 | 0,1570% | 0,157% |
| 95 | 1.055.010,46 | 70.106.934,35 | 0,1583% | 0,1583% |
| 96 | 1.061.756,05 | 71.168.690,4 | 0,1596% | 0,1596% |
| 97 | 1.068.501,64 | 72.237.192,04 | 0,1609% | 0,1609% |
| 98 | 1.075.247,23 | 73.312.439,27 | 0,1622% | 0,1622% |
| 99 | 1.081.992,82 | 74.394.432,09 | 0,1635% | 0,1635% |
| 100 | 1.088.738,41 | 75.483.170,5 | 0,1649% | 0,1649% |
| 101 | 1.095.484 | 76.578.654,5 | 0,1662% | 0,1662% |
| 102 | 1.102.229,59 | 77.680.884,09 | 0,1675% | 0,1675% |
| 103 | 1.108.975,18 | 78.789.859,27 | 0,1688% | 0,1688% |
| 104 | 1.115.720,77 | 79.905.580,04 | 0,1701% | 0,1701% |
| 105 | 1.122.466,36 | 81.028.046,4 | 0,1714% | 0,1714% |
| 106 | 1.129.211,95 | 82.157.258,35 | 0,1728% | 0,1728% |
| 107 | 1.135.957,54 | 83.293.215,89 | 0,1741% | 0,1741% |
| 108 | 1.142.703,13 | 84.435.919,02 | 0,1754% | 0,1754% |
| 109 | 1.149.448,72 | 85.585.367,74 | 0,1767% | 0,1767% |
| 110 | 1.156.194,31 | 86.741.562,05 | 0,1780% | 0,178% |
| 111 | 1.162.939,9 | 87.904.501,95 | 0,1793% | 0,1793% |
| 112 | 1.169.685,49 | 89.074.187,44 | 0,1807% | 0,1807% |
| 113 | 1.176.431,08 | 90.250.618,52 | 0,1820% | 0,182% |
| 114 | 1.183.176,67 | 91.433.795,19 | 0,1833% | 0,1833% |
| 115 | 1.189.922,26 | 92.623.717,45 | 0,1846% | 0,1846% |
| 116 | 1.196.667,85 | 93.820.385,3 | 0,1859% | 0,1859% |
| 117 | 1.203.413,44 | 95.023.798,74 | 0,1872% | 0,1872% |
| 118 | 1.210.159,03 | 96.233.957,77 | 0,1886% | 0,1886% |
| 119 | 1.216.904,62 | 97.450.862,39 | 0,1899% | 0,1899% |
| 120 | 1.223.650,21 | 98.674.512,6 | 0,1912% | 0,1912% |
| 121 | 1.230.395,8 | 99.904.908,4 | 0,1925% | 0,1925% |
| 122 | 1.237.141,39 | 101.142.049,79 | 0,1938% | 0,1938% |
| 123 | 1.243.886,98 | 102.385.936,77 | 0,1951% | 0,1951% |
| 124 | 1.250.632,57 | 103.636.569,34 | 0,1965% | 0,1965% |
| 125 | 1.257.378,16 | 104.893.947,5 | 0,1978% | 0,1978% |
| 126 | 1.264.123,75 | 106.158.071,25 | 0,1991% | 0,1991% |
| 127 | 1.270.869,34 | 107.428.940,59 | 0,2004% | 0,2004% |
| 128 | 1.277.614,93 | 108.706.555,52 | 0,2017% | 0,2017% |
| 129 | 1.284.360,52 | 109.990.916,04 | 0,2031% | 0,2031% |
| 130 | 1.291.106,11 | 111.282.022,15 | 0,2044% | 0,2044% |
| 131 | 1.297.851,7 | 112.579.873,85 | 0,2057% | 0,2057% |
| 132 | 1.304.597,29 | 113.884.471,14 | 0,2070% | 0,207% |
| 133 | 1.311.342,88 | 115.195.814,02 | 0,2083% | 0,2083% |
| 134 | 1.318.088,47 | 116.513.902,49 | 0,2096% | 0,2096% |
| 135 | 1.324.834,06 | 117.838.736,55 | 0,2110% | 0,211% |
| 136 | 1.331.579,65 | 119.170.316,2 | 0,2123% | 0,2123% |
| 137 | 1.338.325,24 | 120.508.641,44 | 0,2136% | 0,2136% |
| 138 | 1.345.070,83 | 121.853.712,27 | 0,2149% | 0,2149% |
| 139 | 1.351.816,42 | 123.205.528,69 | 0,2162% | 0,2162% |
| 140 | 1.358.562,01 | 124.564.090,7 | 0,2175% | 0,2175% |
| 141 | 1.365.307,6 | 125.929.398,3 | 0,2189% | 0,2189% |
| 142 | 1.372.053,19 | 127.301.451,49 | 0,2202% | 0,2202% |
| 143 | 1.378.798,78 | 128.680.250,27 | 0,2215% | 0,2215% |
| 144 | 1.385.544,37 | 130.065.794,64 | 0,2228% | 0,2228% |
| 145 | 1.392.289,96 | 131.458.084,6 | 0,2241% | 0,2241% |
| 146 | 1.399.035,55 | 132.857.120,15 | 0,2254% | 0,2254% |
| 147 | 1.405.781,14 | 134.262.901,29 | 0,2268% | 0,2268% |
| 148 | 1.412.526,73 | 135.675.428,02 | 0,2281% | 0,2281% |
| 149 | 1.419.272,32 | 137.094.700,34 | 0,2294% | 0,2294% |
| 150 | 1.426.017,91 | 138.520.718,25 | 0,2307% | 0,2307% |
| 151 | 1.432.763,5 | 139.953.481,75 | 0,2320% | 0,232% |
| 152 | 1.439.509,09 | 141.392.990,84 | 0,2333% | 0,2333% |
| 153 | 1.446.254,68 | 142.839.245,52 | 0,2347% | 0,2347% |
| 154 | 1.453.000,27 | 144.292.245,79 | 0,2360% | 0,236% |
| 155 | 1.459.745,86 | 145.751.991,65 | 0,2373% | 0,2373% |
| 156 | 1.466.491,45 | 147.218.483,1 | 0,2386% | 0,2386% |
| 157 | 1.473.237,04 | 148.691.720,14 | 0,2399% | 0,2399% |
| 158 | 1.479.982,63 | 150.171.702,77 | 0,2412% | 0,2412% |
| 159 | 1.486.728,22 | 151.658.430,99 | 0,2426% | 0,2426% |
| 160 | 1.493.473,81 | 153.151.904,8 | 0,2439% | 0,2439% |
| 161 | 1.500.219,4 | 154.652.124,2 | 0,2452% | 0,2452% |
| 162 | 1.506.964,99 | 156.159.089,19 | 0,2465% | 0,2465% |
| 163 | 1.513.710,58 | 157.672.799,77 | 0,2478% | 0,2478% |
| 164 | 1.520.456,17 | 159.193.255,94 | 0,2491% | 0,2491% |
| 165 | 1.527.201,76 | 160.720.457,7 | 0,2505% | 0,2505% |
| 166 | 1.533.947,35 | 162.254.405,05 | 0,2518% | 0,2518% |
| 167 | 1.540.692,94 | 163.795.097,99 | 0,2531% | 0,2531% |
| 168 | 1.547.438,53 | 165.342.536,52 | 0,2544% | 0,2544% |
| 169 | 1.554.184,12 | 166.896.720,64 | 0,2557% | 0,2557% |
| 170 | 1.560.929,71 | 168.457.650,35 | 0,2570% | 0,257% |
| 171 | 1.567.675,3 | 170.025.325,65 | 0,2584% | 0,2584% |
| 172 | 1.574.420,89 | 171.599.746,54 | 0,2597% | 0,2597% |
| 173 | 1.581.166,48 | 173.180.913,02 | 0,2610% | 0,261% |
| 174 | 1.587.912,07 | 174.768.825,09 | 0,2623% | 0,2623% |
| 175 | 1.594.657,66 | 176.363.482,75 | 0,2636% | 0,2636% |
| 176 | 1.601.403,25 | 177.964.886 | 0,2649% | 0,2649% |
| 177 | 1.608.148,84 | 179.573.034,84 | 0,2663% | 0,2663% |
| 178 | 1.614.894,43 | 181.187.929,27 | 0,2676% | 0,2676% |
| 179 | 1.621.640,02 | 182.809.569,29 | 0,2689% | 0,2689% |
| 180 | 1.628.385,61 | 184.437.954,9 | 0,2702% | 0,2702% |
| 181 | 1.635.131,2 | 186.073.086,1 | 0,2715% | 0,2715% |
| 182 | 1.641.876,79 | 187.714.962,89 | 0,2728% | 0,2728% |
| 183 | 1.648.622,38 | 189.363.585,27 | 0,2742% | 0,2742% |
| 184 | 1.655.367,97 | 191.018.953,24 | 0,2755% | 0,2755% |
| 185 | 1.662.113,56 | 192.681.066,8 | 0,2768% | 0,2768% |
| 186 | 1.668.859,15 | 194.349.925,95 | 0,2781% | 0,2781% |
| 187 | 1.675.604,74 | 196.025.530,69 | 0,2794% | 0,2794% |
| 188 | 1.682.350,33 | 197.707.881,02 | 0,2807% | 0,2807% |
| 189 | 1.689.095,92 | 199.396.976,94 | 0,2821% | 0,2821% |
| 190 | 1.695.841,51 | 201.092.818,45 | 0,2834% | 0,2834% |
| 191 | 1.702.587,1 | 202.795.405,55 | 0,2847% | 0,2847% |
| 192 | 1.709.332,69 | 204.504.738,24 | 0,2860% | 0,286% |
| 193 | 1.716.078,28 | 206.220.816,52 | 0,2873% | 0,2873% |
| 194 | 1.722.823,87 | 207.943.640,39 | 0,2886% | 0,2886% |
| 195 | 1.729.569,46 | 209.673.209,85 | 0,2900% | 0,29% |
| 196 | 1.736.315,05 | 211.409.524,9 | 0,2913% | 0,2913% |
| 197 | 1.743.060,64 | 213.152.585,54 | 0,2926% | 0,2926% |
| 198 | 1.749.806,23 | 214.902.391,77 | 0,2939% | 0,2939% |
| 199 | 1.756.551,82 | 216.658.943,59 | 0,2952% | 0,2952% |
| 200 | 1.763.297,41 | 218.422.241 | 0,2965% | 0,2965% |
| 201 | 1.770.043 | 220.192.284 | 0,2979% | 0,2979% |
| 202 | 1.776.788,59 | 221.969.072,59 | 0,2992% | 0,2992% |
| 203 | 1.783.534,18 | 223.752.606,77 | 0,3005% | 0,3005% |
| 204 | 1.790.279,77 | 225.542.886,54 | 0,3018% | 0,3018% |
| 205 | 1.797.025,36 | 227.339.911,9 | 0,3031% | 0,3031% |
| 206 | 1.803.770,95 | 229.143.682,85 | 0,3044% | 0,3044% |
| 207 | 1.810.516,54 | 230.954.199,39 | 0,3058% | 0,3058% |
| 208 | 1.817.262,13 | 232.771.461,52 | 0,3071% | 0,3071% |
| 209 | 1.824.007,72 | 234.595.469,24 | 0,3084% | 0,3084% |
| 210 | 1.830.753,31 | 236.426.222,55 | 0,3097% | 0,3097% |
| 211 | 1.837.498,9 | 238.263.721,45 | 0,3110% | 0,311% |
| 212 | 1.844.244,49 | 240.107.965,94 | 0,3123% | 0,3123% |
| 213 | 1.850.990,08 | 241.958.956,02 | 0,3137% | 0,3137% |
| 214 | 1.857.735,67 | 243.816.691,69 | 0,3150% | 0,315% |
| 215 | 1.864.481,26 | 245.681.172,95 | 0,3163% | 0,3163% |
| 216 | 1.871.226,85 | 247.552.399,8 | 0,3176% | 0,3176% |
| 217 | 1.877.972,44 | 249.430.372,24 | 0,3189% | 0,3189% |
| 218 | 1.884.718,03 | 251.315.090,27 | 0,3202% | 0,3202% |
| 219 | 1.891.463,62 | 253.206.553,89 | 0,3216% | 0,3216% |
| 220 | 1.898.209,21 | 255.104.763,1 | 0,3229% | 0,3229% |
| 221 | 1.904.954,8 | 257.009.717,9 | 0,3242% | 0,3242% |
| 222 | 1.911.700,39 | 258.921.418,29 | 0,3255% | 0,3255% |
| 223 | 1.918.445,98 | 260.839.864,27 | 0,3268% | 0,3268% |
| 224 | 1.925.191,57 | 262.765.055,84 | 0,3281% | 0,3281% |
| 225 | 1.931.937,16 | 264.696.993 | 0,3295% | 0,3295% |
| 226 | 1.938.682,75 | 266.635.675,75 | 0,3308% | 0,3308% |
| 227 | 1.945.428,34 | 268.581.104,09 | 0,3321% | 0,3321% |
| 228 | 1.952.173,93 | 270.533.278,02 | 0,3334% | 0,3334% |
| 229 | 1.958.919,52 | 272.492.197,54 | 0,3347% | 0,3347% |
| 230 | 1.965.665,11 | 274.457.862,65 | 0,3360% | 0,336% |
| 231 | 1.972.410,7 | 276.430.273,35 | 0,3374% | 0,3374% |
| 232 | 1.979.156,29 | 278.409.429,64 | 0,3387% | 0,3387% |
| 233 | 1.985.901,88 | 280.395.331,52 | 0,3400% | 0,34% |
| 234 | 1.992.647,47 | 282.387.978,99 | 0,3413% | 0,3413% |
| 235 | 1.999.393,06 | 284.387.372,05 | 0,3426% | 0,3426% |
| 236 | 2.006.138,65 | 286.393.510,7 | 0,3439% | 0,3439% |
| 237 | 2.012.884,24 | 288.406.394,94 | 0,3453% | 0,3453% |
| 238 | 2.019.629,83 | 290.426.024,77 | 0,3466% | 0,3466% |
| 239 | 2.026.375,42 | 292.452.400,19 | 0,3479% | 0,3479% |
| 240 | 2.033.121,01 | 294.485.521,2 | 0,3492% | 0,3492% |
| 241 | 2.039.866,6 | 296.525.387,8 | 0,3505% | 0,3505% |
| 242 | 2.046.612,19 | 298.571.999,99 | 0,3518% | 0,3518% |
| 243 | 2.053.357,78 | 300.625.357,77 | 0,3532% | 0,3532% |
| 244 | 2.060.103,37 | 302.685.461,14 | 0,3545% | 0,3545% |
| 245 | 2.066.848,96 | 304.752.310,1 | 0,3558% | 0,3558% |
| 246 | 2.073.594,55 | 306.825.904,65 | 0,3571% | 0,3571% |
| 247 | 2.080.340,14 | 308.906.244,79 | 0,3584% | 0,3584% |
| 248 | 2.087.085,73 | 310.993.330,52 | 0,3597% | 0,3597% |
| 249 | 2.093.831,32 | 313.087.161,84 | 0,3611% | 0,3611% |
| 250 | 2.100.576,91 | 315.187.738,75 | 0,3624% | 0,3624% |
| 251 | 2.107.322,5 | 317.295.061,25 | 0,3637% | 0,3637% |
| 252 | 2.114.068,09 | 319.409.129,34 | 0,3650% | 0,365% |
| 253 | 2.120.813,68 | 321.529.943,02 | 0,3663% | 0,3663% |
| 254 | 2.127.559,27 | 323.657.502,29 | 0,3677% | 0,3677% |
| 255 | 2.134.304,86 | 325.791.807,15 | 0,3690% | 0,369% |
| 256 | 2.141.050,45 | 327.932.857,6 | 0,3703% | 0,3703% |
| 257 | 2.147.796,04 | 330.080.653,64 | 0,3716% | 0,3716% |
| 258 | 2.154.541,63 | 332.235.195,27 | 0,3729% | 0,3729% |
| 259 | 2.161.287,22 | 334.396.482,49 | 0,3742% | 0,3742% |
| 260 | 2.168.032,81 | 336.564.515,3 | 0,3756% | 0,3756% |
| 261 | 2.174.778,4 | 338.739.293,7 | 0,3769% | 0,3769% |
| 262 | 2.181.523,99 | 340.920.817,69 | 0,3782% | 0,3782% |
| 263 | 2.188.269,58 | 343.109.087,27 | 0,3795% | 0,3795% |
| 264 | 2.195.015,17 | 345.304.102,44 | 0,3808% | 0,3808% |
| 265 | 2.201.760,76 | 347.505.863,2 | 0,3821% | 0,3821% |
| 266 | 2.208.506,35 | 349.714.369,55 | 0,3835% | 0,3835% |
| 267 | 2.215.251,94 | 351.929.621,49 | 0,3848% | 0,3848% |
| 268 | 2.221.997,53 | 354.151.619,02 | 0,3861% | 0,3861% |
| 269 | 2.228.743,12 | 356.380.362,14 | 0,3874% | 0,3874% |
| 270 | 2.235.488,71 | 358.615.850,85 | 0,3887% | 0,3887% |
| 271 | 2.242.234,3 | 360.858.085,15 | 0,3900% | 0,39% |
| 272 | 2.248.979,89 | 363.107.065,04 | 0,3914% | 0,3914% |
| 273 | 2.255.725,48 | 365.362.790,52 | 0,3927% | 0,3927% |
| 274 | 2.262.471,07 | 367.625.261,59 | 0,3940% | 0,394% |
| 275 | 2.269.216,66 | 369.894.478,25 | 0,3953% | 0,3953% |
| 276 | 2.275.962,25 | 372.170.440,5 | 0,3966% | 0,3966% |
| 277 | 2.282.707,84 | 374.453.148,34 | 0,3979% | 0,3979% |
| 278 | 2.289.453,43 | 376.742.601,77 | 0,3993% | 0,3993% |
| 279 | 2.296.199,02 | 379.038.800,79 | 0,4006% | 0,4006% |
| 280 | 2.302.944,61 | 381.341.745,4 | 0,4019% | 0,4019% |
| 281 | 2.309.690,2 | 383.651.435,6 | 0,4032% | 0,4032% |
| 282 | 2.316.435,79 | 385.967.871,39 | 0,4045% | 0,4045% |
| 283 | 2.323.181,38 | 388.291.052,77 | 0,4058% | 0,4058% |
| 284 | 2.329.926,97 | 390.620.979,74 | 0,4072% | 0,4072% |
| 285 | 2.336.672,56 | 392.957.652,3 | 0,4085% | 0,4085% |
| 286 | 2.343.418,15 | 395.301.070,45 | 0,4098% | 0,4098% |
| 287 | 2.350.163,74 | 397.651.234,19 | 0,4111% | 0,4111% |
| 288 | 2.356.909,33 | 400.008.143,52 | 0,4124% | 0,4124% |
| 289 | 2.363.654,92 | 402.371.798,44 | 0,4137% | 0,4137% |
| 290 | 2.370.400,51 | 404.742.198,95 | 0,4151% | 0,4151% |
| 291 | 2.377.146,1 | 407.119.345,05 | 0,4164% | 0,4164% |
| 292 | 2.383.891,69 | 409.503.236,74 | 0,4177% | 0,4177% |
| 293 | 2.390.637,28 | 411.893.874,02 | 0,4190% | 0,419% |
| 294 | 2.397.382,87 | 414.291.256,89 | 0,4203% | 0,4203% |
| 295 | 2.404.128,46 | 416.695.385,35 | 0,4216% | 0,4216% |
| 296 | 2.410.874,05 | 419.106.259,4 | 0,4230% | 0,423% |
| 297 | 2.417.619,64 | 421.523.879,04 | 0,4243% | 0,4243% |
| 298 | 2.424.365,23 | 423.948.244,27 | 0,4256% | 0,4256% |
| 299 | 2.431.110,82 | 426.379.355,09 | 0,4269% | 0,4269% |
| 300 | 2.437.856,41 | 428.817.211,5 | 0,4282% | 0,4282% |
| 301 | 2.444.602 | 431.261.813,5 | 0,4295% | 0,4295% |
| 302 | 2.451.347,59 | 433.713.161,09 | 0,4309% | 0,4309% |
| 303 | 2.458.093,18 | 436.171.254,27 | 0,4322% | 0,4322% |
| 304 | 2.464.838,77 | 438.636.093,04 | 0,4335% | 0,4335% |
| 305 | 2.471.584,36 | 441.107.677,4 | 0,4348% | 0,4348% |
| 306 | 2.478.329,95 | 443.586.007,35 | 0,4361% | 0,4361% |
| 307 | 2.485.075,54 | 446.071.082,89 | 0,4374% | 0,4374% |
| 308 | 2.491.821,13 | 448.562.904,02 | 0,4388% | 0,4388% |
| 309 | 2.498.566,72 | 451.061.470,74 | 0,4401% | 0,4401% |
| 310 | 2.505.312,31 | 453.566.783,05 | 0,4414% | 0,4414% |
| 311 | 2.512.057,9 | 456.078.840,95 | 0,4427% | 0,4427% |
| 312 | 2.518.803,49 | 458.597.644,44 | 0,4440% | 0,444% |
| 313 | 2.525.549,08 | 461.123.193,52 | 0,4453% | 0,4453% |
| 314 | 2.532.294,67 | 463.655.488,19 | 0,4467% | 0,4467% |
| 315 | 2.539.040,26 | 466.194.528,45 | 0,4480% | 0,448% |
| 316 | 2.545.785,85 | 468.740.314,3 | 0,4493% | 0,4493% |
| 317 | 2.552.531,44 | 471.292.845,74 | 0,4506% | 0,4506% |
| 318 | 2.559.277,03 | 473.852.122,77 | 0,4519% | 0,4519% |
| 319 | 2.566.022,62 | 476.418.145,39 | 0,4532% | 0,4532% |
| 320 | 2.572.768,21 | 478.990.913,6 | 0,4546% | 0,4546% |
| 321 | 2.579.513,8 | 481.570.427,4 | 0,4559% | 0,4559% |
| 322 | 2.586.259,39 | 484.156.686,79 | 0,4572% | 0,4572% |
| 323 | 2.593.004,98 | 486.749.691,77 | 0,4585% | 0,4585% |
| 324 | 2.599.750,57 | 489.349.442,34 | 0,4598% | 0,4598% |
| 325 | 2.606.496,16 | 491.955.938,5 | 0,4611% | 0,4611% |
| 326 | 2.613.241,75 | 494.569.180,25 | 0,4625% | 0,4625% |
| 327 | 2.619.987,34 | 497.189.167,59 | 0,4638% | 0,4638% |
| 328 | 2.626.732,93 | 499.815.900,52 | 0,4651% | 0,4651% |
| 329 | 2.633.478,52 | 502.449.379,04 | 0,4664% | 0,4664% |
| 330 | 2.640.224,11 | 505.089.603,15 | 0,4677% | 0,4677% |
| 331 | 2.646.969,7 | 507.736.572,85 | 0,4690% | 0,469% |
| 332 | 2.653.715,29 | 510.390.288,14 | 0,4704% | 0,4704% |
| 333 | 2.660.460,88 | 513.050.749,02 | 0,4717% | 0,4717% |
| 334 | 2.667.206,47 | 515.717.955,49 | 0,4730% | 0,473% |
| 335 | 2.673.952,06 | 518.391.907,55 | 0,4743% | 0,4743% |
| 336 | 2.680.697,65 | 521.072.605,2 | 0,4756% | 0,4756% |
| 337 | 2.687.443,24 | 523.760.048,44 | 0,4769% | 0,4769% |
| 338 | 2.694.188,83 | 526.454.237,27 | 0,4783% | 0,4783% |
| 339 | 2.700.934,42 | 529.155.171,69 | 0,4796% | 0,4796% |
| 340 | 2.707.680,01 | 531.862.851,7 | 0,4809% | 0,4809% |
| 341 | 2.714.425,6 | 534.577.277,3 | 0,4822% | 0,4822% |
| 342 | 2.721.171,19 | 537.298.448,49 | 0,4835% | 0,4835% |
| 343 | 2.727.916,78 | 540.026.365,27 | 0,4848% | 0,4848% |
| 344 | 2.734.662,37 | 542.761.027,64 | 0,4862% | 0,4862% |
| 345 | 2.741.407,96 | 545.502.435,6 | 0,4875% | 0,4875% |
| 346 | 2.748.153,55 | 548.250.589,15 | 0,4888% | 0,4888% |
| 347 | 2.754.899,14 | 551.005.488,29 | 0,4901% | 0,4901% |
| 348 | 2.761.644,73 | 553.767.133,02 | 0,4914% | 0,4914% |
| 349 | 2.768.390,32 | 556.535.523,34 | 0,4927% | 0,4927% |
| 350 | 2.775.135,91 | 559.310.659,25 | 0,4941% | 0,4941% |
| 351 | 2.781.881,5 | 562.092.540,75 | 0,4954% | 0,4954% |
| 352 | 2.788.627,09 | 564.881.167,84 | 0,4967% | 0,4967% |
| 353 | 2.795.372,68 | 567.676.540,52 | 0,4980% | 0,498% |
| 354 | 2.802.118,27 | 570.478.658,79 | 0,4993% | 0,4993% |
| 355 | 2.808.863,86 | 573.287.522,65 | 0,5006% | 0,5006% |
| 356 | 2.815.609,45 | 576.103.132,1 | 0,5020% | 0,502% |
| 357 | 2.822.355,04 | 578.925.487,14 | 0,5033% | 0,5033% |
| 358 | 2.829.100,63 | 581.754.587,77 | 0,5046% | 0,5046% |
| 359 | 2.835.846,22 | 584.590.433,99 | 0,5059% | 0,5059% |
| 360 | 2.842.591,81 | 587.433.025,8 | 0,5072% | 0,5072% |
| 361 | 2.849.337,4 | 590.282.363,2 | 0,5085% | 0,5085% |
| 362 | 2.856.082,99 | 593.138.446,19 | 0,5099% | 0,5099% |
| 363 | 2.862.828,58 | 596.001.274,77 | 0,5112% | 0,5112% |
| 364 | 2.869.574,17 | 598.870.848,94 | 0,5125% | 0,5125% |
| 365 | 2.876.319,76 | 601.747.168,7 | 0,5138% | 0,5138% |
| 366 | 2.883.065,35 | 604.630.234,05 | 0,5151% | 0,5151% |
| 367 | 2.889.810,94 | 607.520.044,99 | 0,5164% | 0,5164% |
| 368 | 2.896.556,53 | 610.416.601,52 | 0,5178% | 0,5178% |
| 369 | 2.903.302,12 | 613.319.903,64 | 0,5191% | 0,5191% |
| 370 | 2.910.047,71 | 616.229.951,35 | 0,5204% | 0,5204% |
| 371 | 2.916.793,3 | 619.146.744,65 | 0,5217% | 0,5217% |
| 372 | 2.923.538,89 | 622.070.283,54 | 0,5230% | 0,523% |
| 373 | 2.930.284,48 | 625.000.568,02 | 0,5243% | 0,5243% |
| 374 | 2.937.030,07 | 627.937.598,09 | 0,5257% | 0,5257% |
| 375 | 2.943.775,66 | 630.881.373,75 | 0,5270% | 0,527% |
| 376 | 2.950.521,25 | 633.831.895 | 0,5283% | 0,5283% |
| 377 | 2.957.266,84 | 636.789.161,84 | 0,5296% | 0,5296% |
| 378 | 2.964.012,43 | 639.753.174,27 | 0,5309% | 0,5309% |
| 379 | 2.970.758,02 | 642.723.932,29 | 0,5323% | 0,5323% |
| 380 | 2.977.503,61 | 645.701.435,9 | 0,5336% | 0,5336% |
| 381 | 2.984.249,2 | 648.685.685,1 | 0,5349% | 0,5349% |
| 382 | 2.990.994,79 | 651.676.679,89 | 0,5362% | 0,5362% |
| 383 | 2.997.740,38 | 654.674.420,27 | 0,5375% | 0,5375% |
| 384 | 3.004.485,97 | 657.678.906,24 | 0,5388% | 0,5388% |
| 385 | 3.011.231,56 | 660.690.137,8 | 0,5402% | 0,5402% |
| 386 | 3.017.977,15 | 663.708.114,95 | 0,5415% | 0,5415% |
| 387 | 3.024.722,74 | 666.732.837,69 | 0,5428% | 0,5428% |
| 388 | 3.031.468,33 | 669.764.306,02 | 0,5441% | 0,5441% |
| 389 | 3.038.213,92 | 672.802.519,94 | 0,5454% | 0,5454% |
| 390 | 3.044.959,51 | 675.847.479,45 | 0,5467% | 0,5467% |
| 391 | 3.051.705,1 | 678.899.184,55 | 0,5481% | 0,5481% |
| 392 | 3.058.450,69 | 681.957.635,24 | 0,5494% | 0,5494% |
| 393 | 3.065.196,28 | 685.022.831,52 | 0,5507% | 0,5507% |
| 394 | 3.071.941,87 | 688.094.773,39 | 0,5520% | 0,552% |
| 395 | 3.078.687,46 | 691.173.460,85 | 0,5533% | 0,5533% |
| 396 | 3.085.433,05 | 694.258.893,9 | 0,5546% | 0,5546% |
| 397 | 3.092.178,64 | 697.351.072,54 | 0,5560% | 0,556% |
| 398 | 3.098.924,23 | 700.449.996,77 | 0,5573% | 0,5573% |
| 399 | 3.105.669,82 | 703.555.666,59 | 0,5586% | 0,5586% |
| 400 | 3.112.415,41 | 706.668.082 | 0,5599% | 0,5599% |
| 401 | 3.119.161 | 709.787.243 | 0,5612% | 0,5612% |
| 402 | 3.125.906,59 | 712.913.149,59 | 0,5625% | 0,5625% |
| 403 | 3.132.652,18 | 716.045.801,77 | 0,5639% | 0,5639% |
| 404 | 3.139.397,77 | 719.185.199,54 | 0,5652% | 0,5652% |
| 405 | 3.146.143,36 | 722.331.342,9 | 0,5665% | 0,5665% |
| 406 | 3.152.888,95 | 725.484.231,85 | 0,5678% | 0,5678% |
| 407 | 3.159.634,54 | 728.643.866,39 | 0,5691% | 0,5691% |
| 408 | 3.166.380,13 | 731.810.246,52 | 0,5704% | 0,5704% |
| 409 | 3.173.125,72 | 734.983.372,24 | 0,5718% | 0,5718% |
| 410 | 3.179.871,31 | 738.163.243,55 | 0,5731% | 0,5731% |
| 411 | 3.186.616,9 | 741.349.860,45 | 0,5744% | 0,5744% |
| 412 | 3.193.362,49 | 744.543.222,94 | 0,5757% | 0,5757% |
| 413 | 3.200.108,08 | 747.743.331,02 | 0,5770% | 0,577% |
| 414 | 3.206.853,67 | 750.950.184,69 | 0,5783% | 0,5783% |
| 415 | 3.213.599,26 | 754.163.783,95 | 0,5797% | 0,5797% |
| 416 | 3.220.344,85 | 757.384.128,8 | 0,5810% | 0,581% |
| 417 | 3.227.090,44 | 760.611.219,24 | 0,5823% | 0,5823% |
| 418 | 3.233.836,03 | 763.845.055,27 | 0,5836% | 0,5836% |
| 419 | 3.240.581,62 | 767.085.636,89 | 0,5849% | 0,5849% |
| 420 | 3.247.327,21 | 770.332.964,1 | 0,5862% | 0,5862% |
| 421 | 3.254.072,8 | 773.587.036,9 | 0,5876% | 0,5876% |
| 422 | 3.260.818,39 | 776.847.855,29 | 0,5889% | 0,5889% |
| 423 | 3.267.563,98 | 780.115.419,27 | 0,5902% | 0,5902% |
| 424 | 3.274.309,57 | 783.389.728,84 | 0,5915% | 0,5915% |
| 425 | 3.281.055,16 | 786.670.784 | 0,5928% | 0,5928% |
| 426 | 3.287.800,75 | 789.958.584,75 | 0,5941% | 0,5941% |
| 427 | 3.294.546,34 | 793.253.131,09 | 0,5955% | 0,5955% |
| 428 | 3.301.291,93 | 796.554.423,02 | 0,5968% | 0,5968% |
| 429 | 3.308.037,52 | 799.862.460,54 | 0,5981% | 0,5981% |
| 430 | 3.314.783,11 | 803.177.243,65 | 0,5994% | 0,5994% |
| 431 | 3.321.528,7 | 806.498.772,35 | 0,6007% | 0,6007% |
| 432 | 3.328.274,29 | 809.827.046,64 | 0,6020% | 0,602% |
| 433 | 3.335.019,88 | 813.162.066,52 | 0,6034% | 0,6034% |
| 434 | 3.341.765,47 | 816.503.831,99 | 0,6047% | 0,6047% |
| 435 | 3.348.511,06 | 819.852.343,05 | 0,6060% | 0,606% |
| 436 | 3.355.256,65 | 823.207.599,7 | 0,6073% | 0,6073% |
| 437 | 3.362.002,24 | 826.569.601,94 | 0,6086% | 0,6086% |
| 438 | 3.368.747,83 | 829.938.349,77 | 0,6099% | 0,6099% |
| 439 | 3.375.493,42 | 833.313.843,19 | 0,6113% | 0,6113% |
| 440 | 3.382.239,01 | 836.696.082,2 | 0,6126% | 0,6126% |
| 441 | 3.388.984,6 | 840.085.066,8 | 0,6139% | 0,6139% |
| 442 | 3.395.730,19 | 843.480.796,99 | 0,6152% | 0,6152% |
| 443 | 3.402.475,78 | 846.883.272,77 | 0,6165% | 0,6165% |
| 444 | 3.409.221,37 | 850.292.494,14 | 0,6178% | 0,6178% |
| 445 | 3.415.966,96 | 853.708.461,1 | 0,6192% | 0,6192% |
| 446 | 3.422.712,55 | 857.131.173,65 | 0,6205% | 0,6205% |
| 447 | 3.429.458,14 | 860.560.631,79 | 0,6218% | 0,6218% |
| 448 | 3.436.203,73 | 863.996.835,52 | 0,6231% | 0,6231% |
| 449 | 3.442.949,32 | 867.439.784,84 | 0,6244% | 0,6244% |
| 450 | 3.449.694,91 | 870.889.479,75 | 0,6257% | 0,6257% |
| 451 | 3.456.440,5 | 874.345.920,25 | 0,6271% | 0,6271% |
| 452 | 3.463.186,09 | 877.809.106,34 | 0,6284% | 0,6284% |
| 453 | 3.469.931,68 | 881.279.038,02 | 0,6297% | 0,6297% |
| 454 | 3.476.677,27 | 884.755.715,29 | 0,6310% | 0,631% |
| 455 | 3.483.422,86 | 888.239.138,15 | 0,6323% | 0,6323% |
| 456 | 3.490.168,45 | 891.729.306,6 | 0,6336% | 0,6336% |
| 457 | 3.496.914,04 | 895.226.220,64 | 0,6350% | 0,635% |
| 458 | 3.503.659,63 | 898.729.880,27 | 0,6363% | 0,6363% |
| 459 | 3.510.405,22 | 902.240.285,49 | 0,6376% | 0,6376% |
| 460 | 3.517.150,81 | 905.757.436,3 | 0,6389% | 0,6389% |
| 461 | 3.523.896,4 | 909.281.332,7 | 0,6402% | 0,6402% |
| 462 | 3.530.641,99 | 912.811.974,69 | 0,6415% | 0,6415% |
| 463 | 3.537.387,58 | 916.349.362,27 | 0,6429% | 0,6429% |
| 464 | 3.544.133,17 | 919.893.495,44 | 0,6442% | 0,6442% |
| 465 | 3.550.878,76 | 923.444.374,2 | 0,6455% | 0,6455% |
| 466 | 3.557.624,35 | 927.001.998,55 | 0,6468% | 0,6468% |
| 467 | 3.564.369,94 | 930.566.368,49 | 0,6481% | 0,6481% |
| 468 | 3.571.115,53 | 934.137.484,02 | 0,6494% | 0,6494% |
| 469 | 3.577.861,12 | 937.715.345,14 | 0,6508% | 0,6508% |
| 470 | 3.584.606,71 | 941.299.951,85 | 0,6521% | 0,6521% |
| 471 | 3.591.352,3 | 944.891.304,15 | 0,6534% | 0,6534% |
| 472 | 3.598.097,89 | 948.489.402,04 | 0,6547% | 0,6547% |
| 473 | 3.604.843,48 | 952.094.245,52 | 0,6560% | 0,656% |
| 474 | 3.611.589,07 | 955.705.834,59 | 0,6573% | 0,6573% |
| 475 | 3.618.334,66 | 959.324.169,25 | 0,6587% | 0,6587% |
| 476 | 3.625.080,25 | 962.949.249,5 | 0,6600% | 0,66% |
| 477 | 3.631.825,84 | 966.581.075,34 | 0,6613% | 0,6613% |
| 478 | 3.638.571,43 | 970.219.646,77 | 0,6626% | 0,6626% |
| 479 | 3.645.317,02 | 973.864.963,79 | 0,6639% | 0,6639% |
| 480 | 3.652.062,61 | 977.517.026,4 | 0,6652% | 0,6652% |
| 481 | 3.658.808,2 | 981.175.834,6 | 0,6666% | 0,6666% |
| 482 | 3.665.553,79 | 984.841.388,39 | 0,6679% | 0,6679% |
| 483 | 3.672.299,38 | 988.513.687,77 | 0,6692% | 0,6692% |
| 484 | 3.679.044,97 | 992.192.732,74 | 0,6705% | 0,6705% |
| 485 | 3.685.790,56 | 995.878.523,3 | 0,6718% | 0,6718% |
| 486 | 3.692.536,15 | 999.571.059,45 | 0,6731% | 0,6731% |
| 487 | 3.699.281,74 | 1.003.270.341,19 | 0,6745% | 0,6745% |
| 488 | 3.706.027,33 | 1.006.976.368,52 | 0,6758% | 0,6758% |
| 489 | 3.712.772,92 | 1.010.689.141,44 | 0,6771% | 0,6771% |
| 490 | 3.719.518,51 | 1.014.408.659,95 | 0,6784% | 0,6784% |
| 491 | 3.726.264,1 | 1.018.134.924,05 | 0,6797% | 0,6797% |
| 492 | 3.733.009,69 | 1.021.867.933,74 | 0,6810% | 0,681% |
| 493 | 3.739.755,28 | 1.025.607.689,02 | 0,6824% | 0,6824% |
| 494 | 3.746.500,87 | 1.029.354.189,89 | 0,6837% | 0,6837% |
| 495 | 3.753.246,46 | 1.033.107.436,35 | 0,6850% | 0,685% |
| 496 | 3.759.992,05 | 1.036.867.428,4 | 0,6863% | 0,6863% |
| 497 | 3.766.737,64 | 1.040.634.166,04 | 0,6876% | 0,6876% |
| 498 | 3.773.483,23 | 1.044.407.649,27 | 0,6889% | 0,6889% |
| 499 | 3.780.228,82 | 1.048.187.878,09 | 0,6903% | 0,6903% |
| 500 | 3.786.974,41 | 1.051.974.852,5 | 0,6916% | 0,6916% |

