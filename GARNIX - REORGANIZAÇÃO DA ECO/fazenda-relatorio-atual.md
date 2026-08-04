# GARNIX — Relatório da Fazenda (estado atual)

> Escopo: `GarnixFarm/enchants/*.yml`, `levels.yml` e `farms.yml`. **Levantamento do que existe hoje** — nada foi alterado.
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
- **Nenhum encantamento tem desbloqueio por nível.** Os 10 estão disponíveis desde o nível 0 — não existe o `mine-level-unlock` do Mining.
- **Onde a chance rola:** só em planta colhida À MÃO. A exceção é o Trevo, que também rola uma vez por planta derrubada pelos encantamentos de área (`FarmGameplay.rollCloverForAreaCrops`).
- **Enxame e Espantalho são um por jogador**: proc que cai com o companheiro ativo é descartado. Teto global de 80 companheiros no servidor (`enchant-max-simultaneous-global`).
- **Nível máximo da fazenda é 300** (`levels.yml`).

---

## 1. Quadro geral dos encantamentos

| Encantamento | Máx | Custo nv 1 | Custo nv máx | **Total (sementes)** | Valor nv 1 | Valor nv máx |
|---|---:|---:|---:|---:|---:|---:|
| Prosperidade | 500 | 195,2 | 48.887,62 | **12.270.705** | 1,0500x | 17,2226x |
| Fertilidade | 500 | 292,7 | 58.725,6 | **14.754.575** | 1,0500x | 3,0300x |
| Agilidade | 2 | 780,6 | 1.561,2 | **2.341,8** | Speed I | Speed II |
| Cataclismo | 500 | 975,8 | 195.735,5 | **49.177.825** | 0,1535% | 76,7500% |
| Laser | 500 | 1.561 | 293.725,5 | **73.821.625** | 0,1266% | 63,3000% |
| Encruzilhada | 500 | 1.561 | 293.725,5 | **73.821.625** | 0,1266% | 63,3000% |
| Ceifa | 500 | 1.366 | 244.828,1 | **61.548.525** | 0,0997% | 49,8500% |
| Enxame | 500 | 2.342 | 440.563,8 | **110.726.450** | 0,0256% | 12,8000% |
| Espantalho | 500 | 2.927 | 587.256 | **147.545.750** | 0,0187% | 9,3500% |
| Trevo | 500 | 1.952 | 391.471,4 | **98.355.850** | 0,0001% | 0,0408% |
| **TOTAL** | | | | **642.025.271,8** | | |

| Encantamento | Total (sementes) | % do custo de maxar tudo |
|---|---:|---:|
| Espantalho | 147.545.750 | 22,98% |
| Enxame | 110.726.450 | 17,25% |
| Trevo | 98.355.850 | 15,32% |
| Laser | 73.821.625 | 11,50% |
| Encruzilhada | 73.821.625 | 11,50% |
| Ceifa | 61.548.525 | 9,59% |
| Cataclismo | 49.177.825 | 7,66% |
| Fertilidade | 14.754.575 | 2,30% |
| Prosperidade | 12.270.705 | 1,91% |
| Agilidade | 2.341,8 | 0,00% |

---

## 2. Quantas plantações cada efeito colhe

Simulação replicando `FarmGameplay.squareHarvest` / `lineHarvest` / `playerAnchoredHarvest` sobre as **posições reais do `data.yml`**: 22.735 plantações numa caixa de 197 x 202, com **57,1% de densidade** — o campo não é um retângulo cheio. A média é sobre todas as 22.735 posições possíveis de colheita, então já embute as bordas e os buracos.

| Encantamento | Teto teórico | **Medido no campo real** | Aproveitamento | Forma |
|---|---:|---:|---:|---|
| Cataclismo | 24 | **21,9** | 91,3% | Quadrado 5x5 ao redor da planta quebrada (`explosion-radius: 2`), com tolerância vertical de ±1 |
| Laser | 24 | **21,4** | 89,2% | 4 linhas cardeais de 6 de comprimento (`max-line-radius: 6`), tolerância vertical de ±1 |
| Encruzilhada | 24 | **20,9** | 87,1% | 4 linhas diagonais de 6 de comprimento (`max-line-radius: 6`), tolerância vertical de ±1 |
| Ceifa | 81 | **72** | 88,9% | Quadrado 9x9 ancorado no JOGADOR (`harvest-radius: 4`) |

**Espantalho** fica fora da tabela porque não tem número único, e o motivo importa: ele dá 100 pulsos de um disco de raio 3 (26,5 plantas em campo cheio), mas `regrow-delay-seconds: 20` faz a planta colhida sumir por 400 ticks — o dobro da vida do espantalho. Se o jogador ficar parado, só o **primeiro** pulso rende: os outros 99 varrem terra vazia. Se ele voar em linha reta sobre terreno virgem, rende perto de **2.650**. É o único encantamento da fazenda cujo valor depende inteiramente do comportamento do jogador.

**Enxame** também fica fora: não colhe nada. Dá `+10%` de ganhos no nível 1 e `+209,6%` no nível 500, por 10 segundos.

### Eficiência — o que cada um entrega pelo que custa

Mesma métrica do relatório do Mining: **plantações colhidas a cada 1.000 colhidas à mão, por 1 milhão de sementes investidas**.

| Encantamento | Chance nv 500 | Plantas/proc | Plantas por 1.000 colhidas | Custo total | **Eficiência** |
|---|---:|---:|---:|---:|---:|
| Ceifa | 49,85% | 72 | 35.892 | 61.548.525 | **583,1** |
| Cataclismo | 76,75% | 21,9 | 16.808 | 49.177.825 | **341,8** |
| Laser | 63,30% | 21,4 | 13.546 | 73.821.625 | **183,5** |
| Encruzilhada | 63,30% | 20,9 | 13.230 | 73.821.625 | **179,2** |

Como não existe desbloqueio por nível no Farm, não há uma ordem de progressão contra a qual medir essa curva — os quatro competem entre si desde o nível 0. A **Ceifa entrega 3,3x mais que a Encruzilhada** custando 17% menos.

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
| Trigo | — (inicial) | — | — | 1 | 0,5 | 10 |
| Cenoura | nível 60 | 1.105.000 de trigo | 10.800.000 coins | 3 | 119 | 20 |
| Batata | nível 150 | 5.865.000 de cenoura | 903.000.000.000 coins | 6 | 436.000 | 30 |
| Fungo do Nether | nível 240 | 22.066.000 de batata | 11.400.000.000.000.000 coins | 12 | 1.600.000.000 | 40 |

Quanto custa, em colheitas, atravessar cada faixa de nível:

| Faixa | Plantação | XP da faixa | Colheitas necessárias |
|---|---|---:|---:|
| 0–59 | Trigo | 1.430.988 | 1.430.988 |
| 60–149 | Cenoura | 12.162.929 | 4.054.310 |
| 150–239 | Batata | 87.445.516 | 14.574.253 |
| 240–300 | Fungo | 283.943.992 | 23.661.999 |
| | | **387.600.288** | **43.721.550** |

### 3.3 A escada de valor por nível

O `payout-multiplier` do `levels.yml` multiplica **só a moeda primária** (coins). Sementes ficam lineares de propósito, como as gemas na mineração. A escada sobe **x3,927 a cada 15 níveis** e **reseta a 1 em cada troca de plantação** — 60, 150 e 240.

O reset parece rebaixamento mas não é, porque o valor base da nova plantação dá o salto:

| Transição | Último pagamento antes | Primeiro pagamento depois | Salto |
|---|---:|---:|---:|
| Trigo → Cenoura (nv 60) | 0,5 x 60,57 = **30,29** | 119 x 1 = **119** | 3,9x |
| Cenoura → Batata (nv 150) | 119 x 934,3 = **111.181,70** | 436.000 x 1 = **436.000** | 3,9x |
| Batata → Fungo (nv 240) | 436.000 x 934,3 = **407.354.800** | 1.600.000.000 x 1 = **1.600.000.000** | 3,9x |

Os três saltos dão exatamente o mesmo 3,9x do degrau normal da escada, o que confirma que os resets são calibrados e não copiar-e-colar.

**Coins por colheita ao longo dos 300 níveis:**

| Nível | Plantação | Multiplicador | Coins por colheita |
|---:|---|---:|---:|
| 0 | Trigo | 1 | 0,5 |
| 15 | Trigo | 3,93 | 1,96 |
| 30 | Trigo | 15,42 | 7,71 |
| 45 | Trigo | 60,57 | 30,29 |
| 60 | Cenoura | 1 | 119 ⟵ troca de plantação |
| 75 | Cenoura | 3,93 | 467,31 |
| 90 | Cenoura | 15,42 | 1.834,98 |
| 105 | Cenoura | 60,57 | 7.207,83 |
| 120 | Cenoura | 237,9 | 28.310,1 |
| 135 | Cenoura | 934,3 | 111.181,7 |
| 150 | Batata | 1 | 436.000 ⟵ troca de plantação |
| 165 | Batata | 3,93 | 1.712.172 |
| 180 | Batata | 15,42 | 6.723.120 |
| 195 | Batata | 60,57 | 26.408.520 |
| 210 | Batata | 237,9 | 103.724.400 |
| 225 | Batata | 934,3 | 407.354.800 |
| 240 | Fungo | 1 | 1.600.000.000 ⟵ troca de plantação |
| 255 | Fungo | 3,93 | 6.283.200.000 |
| 270 | Fungo | 15,42 | 24.672.000.000 |
| 285 | Fungo | 60,57 | 96.912.000.000 |
| 300 | Fungo | 237,9 | 380.640.000.000 |

Nota: o último segmento para em **237,9**, enquanto os dois anteriores chegaram a 934,3 — a escada do Fungo é truncada porque 300 é o teto de nível.

---

## 4. Farm x Mining lado a lado

É aqui que está a diferença estrutural, e ela não é de valores — é de **desenho**.

| | Mining | Farm |
|---|---|---|
| Moeda de compra | gemas | sementes |
| Razão `base-cost / increase-cost` | **~62,4** em todos | **~2,5** em todos |
| Custo do nível cresce (1→500) | **9x** | **~200x** |
| Razão `base-chance / increase-chance` | **~26,2** em todos | **1,0** em todos |
| Chance cresce (1→500) | **20x** | **500x** |
| Desbloqueio por nível | 0, 5, 10, 15, 25, 45, 75, 105, 135, 165, 195, 240 | **nenhum** — os 10 abrem no nível 0 |
| Chance máxima | 14,84% (Explosivo) | **76,75%** (Cataclismo) |
| Multiplicador da moeda de compra | Gemado, **21x** | Fertilidade, **3,03x** |
| Multiplicador de coins | Afortunado, **15x** | Prosperidade, **17,22x** |
| Multiplicador aparece na lore | sim | **não** |
| Custo de maxar tudo | 5.012.757.837,5 gemas | 642.025.271,8 sementes |

A consequência prática do `base-chance == increase-chance`: a chance no Farm é simplesmente **`base x nível`**. No nível 500 o Cataclismo dispara em **3 de cada 4 colheitas**, o Laser e a Encruzilhada em quase 2 de 3, e a Ceifa em 1 de 2. No Mining o encantamento mais comum no nível 500 dispara em 1 de cada 7 quebras.

---

## 5. Achados

### 5.1 · Laser e Encruzilhada são o mesmo encantamento duas vezes

| | Laser | Encruzilhada |
|---|---:|---:|
| base-cost / increase-cost | 1561 / 585.5 | 1561 / 585.5 |
| base-chance / increase-chance | 0.1266 / 0.1266 | 0.1266 / 0.1266 |
| max-line-radius | 6 | 6 |
| Custo total | 73.821.625 | 73.821.625 |
| Plantas por proc | 21,4 | 20,9 |
| Eficiência | 183,4 | 179,1 |

Cada valor numérico dos dois arquivos é idêntico. A única diferença é `CARDINALS` contra `DIAGONALS` no `lineHarvest`, e os 0,5 planta de diferença vêm só do formato do campo. É o mesmo caso do Kraken/Serpente que apareceu no Mining, só que aqui é literal: dois encantamentos, um efeito.

### 5.2 · Ceifa domina os outros três

| Encantamento | Custo total | Plantas/proc | Eficiência |
|---|---:|---:|---:|
| **Ceifa** | **61.548.525** | **72,0** | **583,2** |
| Cataclismo | 49.177.825 | 21,9 | 341,7 |
| Laser | 73.821.625 | 21,4 | 183,4 |
| Encruzilhada | 73.821.625 | 20,9 | 179,1 |

A Ceifa colhe **3,3x mais** que o Laser e a Encruzilhada e ainda custa **17% menos** que eles. Dois motivos somados: o `harvest-radius: 4` vira um quadrado 9x9 (o código diz explicitamente que arredondar para disco "encolheria o encantamento em silêncio"), e ela é ancorada no jogador com janela vertical de 25 blocos — ou seja, **funciona voando**, enquanto as linhas e o quadrado do Cataclismo ficam presos à tolerância de ±1 da planta quebrada.

### 5.3 · Fertilidade multiplica a moeda de compra e é o multiplicador mais fraco

| | Fertilidade | Prosperidade |
|---|---:|---:|
| Moeda | **sementes** (a que compra encantamento) | coins |
| increase-multiplier | 0.003968 | 0.03241 |
| Multiplicador nv 500 | **3,0300x** | **17,2226x** |
| Custo total | 14.754.575 | 12.270.705 |

A Fertilidade custa **20% mais** que a Prosperidade para entregar **5,7x menos** multiplicador. E ela mexe justamente na moeda que destrava todo o resto da progressão.

No Mining a relação é a inversa: o Gemado (gemas, a moeda de compra) dá 21x e o Afortunado (coins) dá 15x — a moeda que financia os encantamentos tem o multiplicador **maior**, não menor.

### 5.4 · Os multiplicadores nunca aparecem para o jogador

O token `{multiplier}` não existe em `prosperity.yml`, em `fertility.yml`, nem em lugar nenhum das configs do Farm fora do ícone de booster. E o `EnchantsMenu` não o substituiria mesmo se existisse — ele só troca `{display}`, `{level}`, `{max-level}` e `{chance}`.

As lores dos dois terminam no nível:

```yaml
lore:
  - "&7Aumenta o multiplicador de"
  - "&7coins ganhos na colheita."
  - ""
  - "&fNível: &a{level}&8/&c{max-level}"     # <- acaba aqui
```

O jogador não tem como saber que a Prosperidade chegou a 17,22x. No Mining as duas equivalentes mostram ` &fMultiplicador: &c{multiplier}x`.

### 5.5 · O Enxame vira um buff permanente no fim da curva

No nível 500 o Enxame tem **12,8% de chance** e dura **10 segundos**. Colhendo a um ritmo normal, isso significa um proc a cada poucos segundos — e como só existe um enxame por jogador, os procs excedentes são descartados, mas o buff praticamente **nunca cai**. Na prática o nível 500 do Enxame é um `+209,6%` permanente, não um evento.

Vale decidir se é isso mesmo que se quer: como evento raro e forte ele tem graça; como buff permanente ele é só um multiplicador escondido atrás de uma animação de abelha.

### 5.6 · Trevo é 15% do custo total de tudo

| | Trevo (Farm) | Abençoado (Mining) |
|---|---:|---:|
| Chance nv 500 | **0,0408%** | 2,0000% |
| Custo total | 98.355.850 sementes | 2.839.062,5 gemas |
| % do custo de maxar tudo | **15,32%** | 0,06% |

O Trevo é 49x mais raro que o equivalente do Mining e come 15% de todo o orçamento de encantamento da fazenda. O contrapeso é que ele rola em cada planta de área — e com a Ceifa maxada são ~36.000 plantas de área por 1.000 colheitas manuais, o que dá cerca de **15 chaves por 1.000 colheitas**. O comentário no `clover.yml` diz que o alvo da Fase 5 era ~1.000 chaves/dia.

### 5.7 · Comentário defasado no levels.yml

O bloco do `payout-multiplier` traz:

```
# ⏳ A escada em si é calibrada na FASE 4, junto com a curva de XP (hoje
#    `base: 100.0, growth: 2.2` dá 1,7 h para o nível 100 ...)
```

A fórmula não é mais essa — hoje é `geometric` com `base: 11992.1` e `growth: 1.02216`. O aviso descreve uma curva que não existe mais.

### 5.8 · Agilidade já está no formato certo

`max-level: 2`, Speed I e Speed II, custo 780,6 e 1.561,2 — total 2.341,8 sementes, ou 0,0004% do custo de maxar tudo. É exatamente o desenho que o Acelerado do Mining acabou de receber. Nada a fazer aqui além de decidir se o preço acompanha o resto quando os outros forem reescalados.

---

## 6. Encantamento por encantamento (marcos)

### Prosperidade — `prosperity.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 195,2 · **increase-cost:** 97,58
- **base-multiplier:** 1.05 · **increase-multiplier:** 0.03241 · **provider:** `coins`
- **Efeito:** Multiplica os coins ganhos na colheita. Sempre ativo.
- **Custo total:** 12.270.705 sementes · **reembolso a 40%:** 4.908.282

| Nível | Custo do nível | Custo acumulado | Multiplicador | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 195,2 | 195,2 | 1,0500x | — |
| 2 | 292,78 | 487,98 | 1,0824x | — |
| 3 | 390,36 | 878,34 | 1,1148x | — |
| 5 | 585,52 | 1.951,8 | 1,1796x | — |
| 10 | 1.073,42 | 6.343,1 | 1,3417x | — |
| 25 | 2.537,12 | 34.154 | 1,8278x | — |
| 50 | 4.976,62 | 129.295,5 | 2,6381x | — |
| 75 | 7.416,12 | 285.424,5 | 3,4483x | — |
| 100 | 9.855,62 | 502.541 | 4,2586x | — |
| 150 | 14.734,62 | 1.119.736,5 | 5,8791x | — |
| 200 | 19.613,62 | 1.980.882 | 7,4996x | — |
| 250 | 24.492,62 | 3.085.977,5 | 9,1201x | — |
| 300 | 29.371,62 | 4.435.023 | 10,7406x | — |
| 350 | 34.250,62 | 6.028.018,5 | 12,3611x | — |
| 400 | 39.129,62 | 7.864.964 | 13,9816x | — |
| 450 | 44.008,62 | 9.945.859,5 | 15,6021x | — |
| 499 | 48.790,04 | 12.221.817,38 | 17,1902x | — |
| 500 | 48.887,62 | 12.270.705 | 17,2226x | — |

### Fertilidade — `fertility.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 292,7 · **increase-cost:** 117,1
- **base-multiplier:** 1.05 · **increase-multiplier:** 0.003968 · **provider:** `sementes`
- **Efeito:** Multiplica as sementes ganhas na colheita. Sempre ativo.
- **Custo total:** 14.754.575 sementes · **reembolso a 40%:** 5.901.830

| Nível | Custo do nível | Custo acumulado | Multiplicador | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 292,7 | 292,7 | 1,0500x | — |
| 2 | 409,8 | 702,5 | 1,0540x | — |
| 3 | 526,9 | 1.229,4 | 1,0579x | — |
| 5 | 761,1 | 2.634,5 | 1,0659x | — |
| 10 | 1.346,6 | 8.196,5 | 1,0857x | — |
| 25 | 3.103,1 | 42.447,5 | 1,1452x | — |
| 50 | 6.030,6 | 158.082,5 | 1,2444x | — |
| 75 | 8.958,1 | 346.905 | 1,3436x | — |
| 100 | 11.885,6 | 608.915 | 1,4428x | — |
| 150 | 17.740,6 | 1.352.497,5 | 1,6412x | — |
| 200 | 23.595,6 | 2.388.830 | 1,8396x | — |
| 250 | 29.450,6 | 3.717.912,5 | 2,0380x | — |
| 300 | 35.305,6 | 5.339.745 | 2,2364x | — |
| 350 | 41.160,6 | 7.254.327,5 | 2,4348x | — |
| 400 | 47.015,6 | 9.461.660 | 2,6332x | — |
| 450 | 52.870,6 | 11.961.742,5 | 2,8316x | — |
| 499 | 58.608,5 | 14.695.849,4 | 3,0261x | — |
| 500 | 58.725,6 | 14.754.575 | 3,0300x | — |

### Agilidade — `haste.yml`

- **Nível máximo:** 2 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 780,6 · **increase-cost:** 780,6
- **Efeito:** Velocidade fixa dentro da fazenda (nível N = Speed N).
- **Custo total:** 2.341,8 sementes · **reembolso a 40%:** 936,72

| Nível | Custo do nível | Custo acumulado | Efeito |
|---:|---:|---:|---|
| 1 | 780,6 | 780,6 | Speed I |
| 2 | 1.561,2 | 2.341,8 | Speed II |

### Cataclismo — `cataclysm.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 975,8 · **increase-cost:** 390,3
- **base-chance:** 0.1535% · **increase-chance:** 0.1535%
- **Efeito:** Quadrado 5x5 ao redor da planta quebrada (`explosion-radius: 2`), com tolerância vertical de ±1.
- **Plantas por proc:** 21,9 (teto 24) · **eficiência:** 341,8
- **Custo total:** 49.177.825 sementes · **reembolso a 40%:** 19.671.130

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 975,8 | 975,8 | 0,1535% | 0,1535% |
| 2 | 1.366,1 | 2.341,9 | 0,3070% | 0,307% |
| 3 | 1.756,4 | 4.098,3 | 0,4605% | 0,4605% |
| 5 | 2.537 | 8.782 | 0,7675% | 0,7675% |
| 10 | 4.488,5 | 27.321,5 | 1,5350% | 1,535% |
| 25 | 10.343 | 141.485 | 3,8375% | 3,838% |
| 50 | 20.100,5 | 526.907,5 | 7,6750% | 7,675% |
| 75 | 29.858 | 1.156.267,5 | 11,5125% | 11,51% |
| 100 | 39.615,5 | 2.029.565 | 15,3500% | 15,35% |
| 150 | 59.130,5 | 4.507.972,5 | 23,0250% | 23,03% |
| 200 | 78.645,5 | 7.962.130 | 30,7000% | 30,7% |
| 250 | 98.160,5 | 12.392.037,5 | 38,3750% | 38,38% |
| 300 | 117.675,5 | 17.797.695 | 46,0500% | 46,05% |
| 350 | 137.190,5 | 24.179.102,5 | 53,7250% | 53,73% |
| 400 | 156.705,5 | 31.536.260 | 61,4000% | 61,4% |
| 450 | 176.220,5 | 39.869.167,5 | 69,0750% | 69,07% |
| 499 | 195.345,2 | 48.982.089,5 | 76,5965% | 76,6% |
| 500 | 195.735,5 | 49.177.825 | 76,7500% | 76,75% |

### Laser — `laser.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.561 · **increase-cost:** 585,5
- **base-chance:** 0.1266% · **increase-chance:** 0.1266%
- **Efeito:** 4 linhas cardeais de 6 de comprimento (`max-line-radius: 6`), tolerância vertical de ±1.
- **Plantas por proc:** 21,4 (teto 24) · **eficiência:** 183,5
- **Custo total:** 73.821.625 sementes · **reembolso a 40%:** 29.528.650

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.561 | 1.561 | 0,1266% | 0,1266% |
| 2 | 2.146,5 | 3.707,5 | 0,2532% | 0,2532% |
| 3 | 2.732 | 6.439,5 | 0,3798% | 0,3798% |
| 5 | 3.903 | 13.660 | 0,6330% | 0,633% |
| 10 | 6.830,5 | 41.957,5 | 1,2660% | 1,266% |
| 25 | 15.613 | 214.675 | 3,1650% | 3,165% |
| 50 | 30.250,5 | 795.287,5 | 6,3300% | 6,33% |
| 75 | 44.888 | 1.741.837,5 | 9,4950% | 9,495% |
| 100 | 59.525,5 | 3.054.325 | 12,6600% | 12,66% |
| 150 | 88.800,5 | 6.777.112,5 | 18,9900% | 18,99% |
| 200 | 118.075,5 | 11.963.650 | 25,3200% | 25,32% |
| 250 | 147.350,5 | 18.613.937,5 | 31,6500% | 31,65% |
| 300 | 176.625,5 | 26.727.975 | 37,9800% | 37,98% |
| 350 | 205.900,5 | 36.305.762,5 | 44,3100% | 44,31% |
| 400 | 235.175,5 | 47.347.300 | 50,6400% | 50,64% |
| 450 | 264.450,5 | 59.852.587,5 | 56,9700% | 56,97% |
| 499 | 293.140 | 73.527.899,5 | 63,1734% | 63,17% |
| 500 | 293.725,5 | 73.821.625 | 63,3000% | 63,3% |

### Encruzilhada — `crossroads.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.561 · **increase-cost:** 585,5
- **base-chance:** 0.1266% · **increase-chance:** 0.1266%
- **Efeito:** 4 linhas diagonais de 6 de comprimento (`max-line-radius: 6`), tolerância vertical de ±1.
- **Plantas por proc:** 20,9 (teto 24) · **eficiência:** 179,2
- **Custo total:** 73.821.625 sementes · **reembolso a 40%:** 29.528.650

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.561 | 1.561 | 0,1266% | 0,1266% |
| 2 | 2.146,5 | 3.707,5 | 0,2532% | 0,2532% |
| 3 | 2.732 | 6.439,5 | 0,3798% | 0,3798% |
| 5 | 3.903 | 13.660 | 0,6330% | 0,633% |
| 10 | 6.830,5 | 41.957,5 | 1,2660% | 1,266% |
| 25 | 15.613 | 214.675 | 3,1650% | 3,165% |
| 50 | 30.250,5 | 795.287,5 | 6,3300% | 6,33% |
| 75 | 44.888 | 1.741.837,5 | 9,4950% | 9,495% |
| 100 | 59.525,5 | 3.054.325 | 12,6600% | 12,66% |
| 150 | 88.800,5 | 6.777.112,5 | 18,9900% | 18,99% |
| 200 | 118.075,5 | 11.963.650 | 25,3200% | 25,32% |
| 250 | 147.350,5 | 18.613.937,5 | 31,6500% | 31,65% |
| 300 | 176.625,5 | 26.727.975 | 37,9800% | 37,98% |
| 350 | 205.900,5 | 36.305.762,5 | 44,3100% | 44,31% |
| 400 | 235.175,5 | 47.347.300 | 50,6400% | 50,64% |
| 450 | 264.450,5 | 59.852.587,5 | 56,9700% | 56,97% |
| 499 | 293.140 | 73.527.899,5 | 63,1734% | 63,17% |
| 500 | 293.725,5 | 73.821.625 | 63,3000% | 63,3% |

### Ceifa — `reap.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.366 · **increase-cost:** 487,9
- **base-chance:** 0.0997% · **increase-chance:** 0.0997%
- **Efeito:** Quadrado 9x9 ancorado no JOGADOR (`harvest-radius: 4`). É quadrado e não disco — está escrito no código que foi de propósito. Janela vertical enorme: funciona voando.
- **Plantas por proc:** 72 (teto 81) · **eficiência:** 583,1
- **Custo total:** 61.548.525 sementes · **reembolso a 40%:** 24.619.410

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.366 | 1.366 | 0,0997% | 0,0997% |
| 2 | 1.853,9 | 3.219,9 | 0,1994% | 0,1994% |
| 3 | 2.341,8 | 5.561,7 | 0,2991% | 0,2991% |
| 5 | 3.317,6 | 11.709 | 0,4985% | 0,4985% |
| 10 | 5.757,1 | 35.615,5 | 0,9970% | 0,997% |
| 25 | 13.075,6 | 180.520 | 2,4925% | 2,492% |
| 50 | 25.273,1 | 665.977,5 | 4,9850% | 4,985% |
| 75 | 37.470,6 | 1.456.372,5 | 7,4775% | 7,478% |
| 100 | 49.668,1 | 2.551.705 | 9,9700% | 9,97% |
| 150 | 74.063,1 | 5.657.182,5 | 14,9550% | 14,96% |
| 200 | 98.458,1 | 9.982.410 | 19,9400% | 19,94% |
| 250 | 122.853,1 | 15.527.387,5 | 24,9250% | 24,92% |
| 300 | 147.248,1 | 22.292.115 | 29,9100% | 29,91% |
| 350 | 171.643,1 | 30.276.592,5 | 34,8950% | 34,89% |
| 400 | 196.038,1 | 39.480.820 | 39,8800% | 39,88% |
| 450 | 220.433,1 | 49.904.797,5 | 44,8650% | 44,86% |
| 499 | 244.340,2 | 61.303.696,9 | 49,7503% | 49,75% |
| 500 | 244.828,1 | 61.548.525 | 49,8500% | 49,85% |

### Enxame — `swarm.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 2.342 · **increase-cost:** 878,2
- **base-chance:** 0.0256% · **increase-chance:** 0.0256%
- **Efeito:** Não colhe nada. Invoca 4 abelhas por 200 ticks (10 s) que dão um bônus de ganhos sobre tudo que o jogador colher. Uma por jogador — proc que cai com o enxame ativo é descartado.
- **Custo total:** 110.726.450 sementes · **reembolso a 40%:** 44.290.580

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 2.342 | 2.342 | 0,0256% | 0,0256% |
| 2 | 3.220,2 | 5.562,2 | 0,0512% | 0,0512% |
| 3 | 4.098,4 | 9.660,6 | 0,0768% | 0,0768% |
| 5 | 5.854,8 | 20.492 | 0,1280% | 0,128% |
| 10 | 10.245,8 | 62.939 | 0,2560% | 0,256% |
| 25 | 23.418,8 | 322.010 | 0,6400% | 0,64% |
| 50 | 45.373,8 | 1.192.895 | 1,2800% | 1,28% |
| 75 | 67.328,8 | 2.612.655 | 1,9200% | 1,92% |
| 100 | 89.283,8 | 4.581.290 | 2,5600% | 2,56% |
| 150 | 133.193,8 | 10.165.185 | 3,8400% | 3,84% |
| 200 | 177.103,8 | 17.944.580 | 5,1200% | 5,12% |
| 250 | 221.013,8 | 27.919.475 | 6,4000% | 6,4% |
| 300 | 264.923,8 | 40.089.870 | 7,6800% | 7,68% |
| 350 | 308.833,8 | 54.455.765 | 8,9600% | 8,96% |
| 400 | 352.743,8 | 71.017.160 | 10,2400% | 10,24% |
| 450 | 396.653,8 | 89.774.055 | 11,5200% | 11,52% |
| 499 | 439.685,6 | 110.285.886,2 | 12,7744% | 12,77% |
| 500 | 440.563,8 | 110.726.450 | 12,8000% | 12,8% |

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
- **base-cost:** 2.927 · **increase-cost:** 1.171
- **base-chance:** 0.0187% · **increase-chance:** 0.0187%
- **Efeito:** Companheiro que vive 200 ticks e colhe um disco de raio 3 a cada 2 ticks — 100 pulsos. Um por jogador.
- **Custo total:** 147.545.750 sementes · **reembolso a 40%:** 59.018.300

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 2.927 | 2.927 | 0,0187% | 0,0187% |
| 2 | 4.098 | 7.025 | 0,0374% | 0,0374% |
| 3 | 5.269 | 12.294 | 0,0561% | 0,0561% |
| 5 | 7.611 | 26.345 | 0,0935% | 0,0935% |
| 10 | 13.466 | 81.965 | 0,1870% | 0,187% |
| 25 | 31.031 | 424.475 | 0,4675% | 0,4675% |
| 50 | 60.306 | 1.580.825 | 0,9350% | 0,935% |
| 75 | 89.581 | 3.469.050 | 1,4025% | 1,403% |
| 100 | 118.856 | 6.089.150 | 1,8700% | 1,87% |
| 150 | 177.406 | 13.524.975 | 2,8050% | 2,805% |
| 200 | 235.956 | 23.888.300 | 3,7400% | 3,74% |
| 250 | 294.506 | 37.179.125 | 4,6750% | 4,675% |
| 300 | 353.056 | 53.397.450 | 5,6100% | 5,61% |
| 350 | 411.606 | 72.543.275 | 6,5450% | 6,545% |
| 400 | 470.156 | 94.616.600 | 7,4800% | 7,48% |
| 450 | 528.706 | 119.617.425 | 8,4150% | 8,415% |
| 499 | 586.085 | 146.958.494 | 9,3313% | 9,331% |
| 500 | 587.256 | 147.545.750 | 9,3500% | 9,35% |

### Trevo — `clover.yml`

- **Nível máximo:** 500 · **desbloqueio:** nenhum (disponível no nível 0)
- **base-cost:** 1.952 · **increase-cost:** 780,6
- **base-chance:** 0.0000815% · **increase-chance:** 0.0000815%
- **Efeito:** Chave de fazenda por planta. Rola em TODA planta colhida, inclusive as derrubadas pelos encantamentos de área.
- **Custo total:** 98.355.850 sementes · **reembolso a 40%:** 39.342.340

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.952 | 1.952 | 0,0001% | 0,0000815% |
| 2 | 2.732,6 | 4.684,6 | 0,0002% | 0,000163% |
| 3 | 3.513,2 | 8.197,8 | 0,0002% | 0,0002445% |
| 5 | 5.074,4 | 17.566 | 0,0004% | 0,0004075% |
| 10 | 8.977,4 | 54.647 | 0,0008% | 0,000815% |
| 25 | 20.686,4 | 282.980 | 0,0020% | 0,002038% |
| 50 | 40.201,4 | 1.053.835 | 0,0041% | 0,004075% |
| 75 | 59.716,4 | 2.312.565 | 0,0061% | 0,006113% |
| 100 | 79.231,4 | 4.059.170 | 0,0082% | 0,00815% |
| 150 | 118.261,4 | 9.016.005 | 0,0122% | 0,01223% |
| 200 | 157.291,4 | 15.924.340 | 0,0163% | 0,0163% |
| 250 | 196.321,4 | 24.784.175 | 0,0204% | 0,02038% |
| 300 | 235.351,4 | 35.595.510 | 0,0245% | 0,02445% |
| 350 | 274.381,4 | 48.358.345 | 0,0285% | 0,02853% |
| 400 | 313.411,4 | 63.072.680 | 0,0326% | 0,0326% |
| 450 | 352.441,4 | 79.738.515 | 0,0367% | 0,03668% |
| 499 | 390.690,8 | 97.964.378,6 | 0,0407% | 0,04067% |
| 500 | 391.471,4 | 98.355.850 | 0,0408% | 0,04075% |

---

## 7. Anexo — tabelas completas, nível por nível

`Exibido na lore` é o texto que o menu da enxada mostra (`EnchantsMenu.formatChance`, 4 dígitos significativos). Os multiplicadores saem como `—` porque hoje não são exibidos em lugar nenhum (achado 5.4).

### Anexo — Prosperidade

| Nível | Custo do nível | Custo acumulado | Multiplicador |
|---:|---:|---:|---:|
| 1 | 195,2 | 195,2 | 1,0500x |
| 2 | 292,78 | 487,98 | 1,0824x |
| 3 | 390,36 | 878,34 | 1,1148x |
| 4 | 487,94 | 1.366,28 | 1,1472x |
| 5 | 585,52 | 1.951,8 | 1,1796x |
| 6 | 683,1 | 2.634,9 | 1,2121x |
| 7 | 780,68 | 3.415,58 | 1,2445x |
| 8 | 878,26 | 4.293,84 | 1,2769x |
| 9 | 975,84 | 5.269,68 | 1,3093x |
| 10 | 1.073,42 | 6.343,1 | 1,3417x |
| 11 | 1.171 | 7.514,1 | 1,3741x |
| 12 | 1.268,58 | 8.782,68 | 1,4065x |
| 13 | 1.366,16 | 10.148,84 | 1,4389x |
| 14 | 1.463,74 | 11.612,58 | 1,4713x |
| 15 | 1.561,32 | 13.173,9 | 1,5037x |
| 16 | 1.658,9 | 14.832,8 | 1,5362x |
| 17 | 1.756,48 | 16.589,28 | 1,5686x |
| 18 | 1.854,06 | 18.443,34 | 1,6010x |
| 19 | 1.951,64 | 20.394,98 | 1,6334x |
| 20 | 2.049,22 | 22.444,2 | 1,6658x |
| 21 | 2.146,8 | 24.591 | 1,6982x |
| 22 | 2.244,38 | 26.835,38 | 1,7306x |
| 23 | 2.341,96 | 29.177,34 | 1,7630x |
| 24 | 2.439,54 | 31.616,88 | 1,7954x |
| 25 | 2.537,12 | 34.154 | 1,8278x |
| 26 | 2.634,7 | 36.788,7 | 1,8603x |
| 27 | 2.732,28 | 39.520,98 | 1,8927x |
| 28 | 2.829,86 | 42.350,84 | 1,9251x |
| 29 | 2.927,44 | 45.278,28 | 1,9575x |
| 30 | 3.025,02 | 48.303,3 | 1,9899x |
| 31 | 3.122,6 | 51.425,9 | 2,0223x |
| 32 | 3.220,18 | 54.646,08 | 2,0547x |
| 33 | 3.317,76 | 57.963,84 | 2,0871x |
| 34 | 3.415,34 | 61.379,18 | 2,1195x |
| 35 | 3.512,92 | 64.892,1 | 2,1519x |
| 36 | 3.610,5 | 68.502,6 | 2,1844x |
| 37 | 3.708,08 | 72.210,68 | 2,2168x |
| 38 | 3.805,66 | 76.016,34 | 2,2492x |
| 39 | 3.903,24 | 79.919,58 | 2,2816x |
| 40 | 4.000,82 | 83.920,4 | 2,3140x |
| 41 | 4.098,4 | 88.018,8 | 2,3464x |
| 42 | 4.195,98 | 92.214,78 | 2,3788x |
| 43 | 4.293,56 | 96.508,34 | 2,4112x |
| 44 | 4.391,14 | 100.899,48 | 2,4436x |
| 45 | 4.488,72 | 105.388,2 | 2,4760x |
| 46 | 4.586,3 | 109.974,5 | 2,5084x |
| 47 | 4.683,88 | 114.658,38 | 2,5409x |
| 48 | 4.781,46 | 119.439,84 | 2,5733x |
| 49 | 4.879,04 | 124.318,88 | 2,6057x |
| 50 | 4.976,62 | 129.295,5 | 2,6381x |
| 51 | 5.074,2 | 134.369,7 | 2,6705x |
| 52 | 5.171,78 | 139.541,48 | 2,7029x |
| 53 | 5.269,36 | 144.810,84 | 2,7353x |
| 54 | 5.366,94 | 150.177,78 | 2,7677x |
| 55 | 5.464,52 | 155.642,3 | 2,8001x |
| 56 | 5.562,1 | 161.204,4 | 2,8326x |
| 57 | 5.659,68 | 166.864,08 | 2,8650x |
| 58 | 5.757,26 | 172.621,34 | 2,8974x |
| 59 | 5.854,84 | 178.476,18 | 2,9298x |
| 60 | 5.952,42 | 184.428,6 | 2,9622x |
| 61 | 6.050 | 190.478,6 | 2,9946x |
| 62 | 6.147,58 | 196.626,18 | 3,0270x |
| 63 | 6.245,16 | 202.871,34 | 3,0594x |
| 64 | 6.342,74 | 209.214,08 | 3,0918x |
| 65 | 6.440,32 | 215.654,4 | 3,1242x |
| 66 | 6.537,9 | 222.192,3 | 3,1566x |
| 67 | 6.635,48 | 228.827,78 | 3,1891x |
| 68 | 6.733,06 | 235.560,84 | 3,2215x |
| 69 | 6.830,64 | 242.391,48 | 3,2539x |
| 70 | 6.928,22 | 249.319,7 | 3,2863x |
| 71 | 7.025,8 | 256.345,5 | 3,3187x |
| 72 | 7.123,38 | 263.468,88 | 3,3511x |
| 73 | 7.220,96 | 270.689,84 | 3,3835x |
| 74 | 7.318,54 | 278.008,38 | 3,4159x |
| 75 | 7.416,12 | 285.424,5 | 3,4483x |
| 76 | 7.513,7 | 292.938,2 | 3,4808x |
| 77 | 7.611,28 | 300.549,48 | 3,5132x |
| 78 | 7.708,86 | 308.258,34 | 3,5456x |
| 79 | 7.806,44 | 316.064,78 | 3,5780x |
| 80 | 7.904,02 | 323.968,8 | 3,6104x |
| 81 | 8.001,6 | 331.970,4 | 3,6428x |
| 82 | 8.099,18 | 340.069,58 | 3,6752x |
| 83 | 8.196,76 | 348.266,34 | 3,7076x |
| 84 | 8.294,34 | 356.560,68 | 3,7400x |
| 85 | 8.391,92 | 364.952,6 | 3,7724x |
| 86 | 8.489,5 | 373.442,1 | 3,8049x |
| 87 | 8.587,08 | 382.029,18 | 3,8373x |
| 88 | 8.684,66 | 390.713,84 | 3,8697x |
| 89 | 8.782,24 | 399.496,08 | 3,9021x |
| 90 | 8.879,82 | 408.375,9 | 3,9345x |
| 91 | 8.977,4 | 417.353,3 | 3,9669x |
| 92 | 9.074,98 | 426.428,28 | 3,9993x |
| 93 | 9.172,56 | 435.600,84 | 4,0317x |
| 94 | 9.270,14 | 444.870,98 | 4,0641x |
| 95 | 9.367,72 | 454.238,7 | 4,0965x |
| 96 | 9.465,3 | 463.704 | 4,1290x |
| 97 | 9.562,88 | 473.266,88 | 4,1614x |
| 98 | 9.660,46 | 482.927,34 | 4,1938x |
| 99 | 9.758,04 | 492.685,38 | 4,2262x |
| 100 | 9.855,62 | 502.541 | 4,2586x |
| 101 | 9.953,2 | 512.494,2 | 4,2910x |
| 102 | 10.050,78 | 522.544,98 | 4,3234x |
| 103 | 10.148,36 | 532.693,34 | 4,3558x |
| 104 | 10.245,94 | 542.939,28 | 4,3882x |
| 105 | 10.343,52 | 553.282,8 | 4,4206x |
| 106 | 10.441,1 | 563.723,9 | 4,4531x |
| 107 | 10.538,68 | 574.262,58 | 4,4855x |
| 108 | 10.636,26 | 584.898,84 | 4,5179x |
| 109 | 10.733,84 | 595.632,68 | 4,5503x |
| 110 | 10.831,42 | 606.464,1 | 4,5827x |
| 111 | 10.929 | 617.393,1 | 4,6151x |
| 112 | 11.026,58 | 628.419,68 | 4,6475x |
| 113 | 11.124,16 | 639.543,84 | 4,6799x |
| 114 | 11.221,74 | 650.765,58 | 4,7123x |
| 115 | 11.319,32 | 662.084,9 | 4,7447x |
| 116 | 11.416,9 | 673.501,8 | 4,7771x |
| 117 | 11.514,48 | 685.016,28 | 4,8096x |
| 118 | 11.612,06 | 696.628,34 | 4,8420x |
| 119 | 11.709,64 | 708.337,98 | 4,8744x |
| 120 | 11.807,22 | 720.145,2 | 4,9068x |
| 121 | 11.904,8 | 732.050 | 4,9392x |
| 122 | 12.002,38 | 744.052,38 | 4,9716x |
| 123 | 12.099,96 | 756.152,34 | 5,0040x |
| 124 | 12.197,54 | 768.349,88 | 5,0364x |
| 125 | 12.295,12 | 780.645 | 5,0688x |
| 126 | 12.392,7 | 793.037,7 | 5,1013x |
| 127 | 12.490,28 | 805.527,98 | 5,1337x |
| 128 | 12.587,86 | 818.115,84 | 5,1661x |
| 129 | 12.685,44 | 830.801,28 | 5,1985x |
| 130 | 12.783,02 | 843.584,3 | 5,2309x |
| 131 | 12.880,6 | 856.464,9 | 5,2633x |
| 132 | 12.978,18 | 869.443,08 | 5,2957x |
| 133 | 13.075,76 | 882.518,84 | 5,3281x |
| 134 | 13.173,34 | 895.692,18 | 5,3605x |
| 135 | 13.270,92 | 908.963,1 | 5,3929x |
| 136 | 13.368,5 | 922.331,6 | 5,4253x |
| 137 | 13.466,08 | 935.797,68 | 5,4578x |
| 138 | 13.563,66 | 949.361,34 | 5,4902x |
| 139 | 13.661,24 | 963.022,58 | 5,5226x |
| 140 | 13.758,82 | 976.781,4 | 5,5550x |
| 141 | 13.856,4 | 990.637,8 | 5,5874x |
| 142 | 13.953,98 | 1.004.591,78 | 5,6198x |
| 143 | 14.051,56 | 1.018.643,34 | 5,6522x |
| 144 | 14.149,14 | 1.032.792,48 | 5,6846x |
| 145 | 14.246,72 | 1.047.039,2 | 5,7170x |
| 146 | 14.344,3 | 1.061.383,5 | 5,7495x |
| 147 | 14.441,88 | 1.075.825,38 | 5,7819x |
| 148 | 14.539,46 | 1.090.364,84 | 5,8143x |
| 149 | 14.637,04 | 1.105.001,88 | 5,8467x |
| 150 | 14.734,62 | 1.119.736,5 | 5,8791x |
| 151 | 14.832,2 | 1.134.568,7 | 5,9115x |
| 152 | 14.929,78 | 1.149.498,48 | 5,9439x |
| 153 | 15.027,36 | 1.164.525,84 | 5,9763x |
| 154 | 15.124,94 | 1.179.650,78 | 6,0087x |
| 155 | 15.222,52 | 1.194.873,3 | 6,0411x |
| 156 | 15.320,1 | 1.210.193,4 | 6,0736x |
| 157 | 15.417,68 | 1.225.611,08 | 6,1060x |
| 158 | 15.515,26 | 1.241.126,34 | 6,1384x |
| 159 | 15.612,84 | 1.256.739,18 | 6,1708x |
| 160 | 15.710,42 | 1.272.449,6 | 6,2032x |
| 161 | 15.808 | 1.288.257,6 | 6,2356x |
| 162 | 15.905,58 | 1.304.163,18 | 6,2680x |
| 163 | 16.003,16 | 1.320.166,34 | 6,3004x |
| 164 | 16.100,74 | 1.336.267,08 | 6,3328x |
| 165 | 16.198,32 | 1.352.465,4 | 6,3652x |
| 166 | 16.295,9 | 1.368.761,3 | 6,3976x |
| 167 | 16.393,48 | 1.385.154,78 | 6,4301x |
| 168 | 16.491,06 | 1.401.645,84 | 6,4625x |
| 169 | 16.588,64 | 1.418.234,48 | 6,4949x |
| 170 | 16.686,22 | 1.434.920,7 | 6,5273x |
| 171 | 16.783,8 | 1.451.704,5 | 6,5597x |
| 172 | 16.881,38 | 1.468.585,88 | 6,5921x |
| 173 | 16.978,96 | 1.485.564,84 | 6,6245x |
| 174 | 17.076,54 | 1.502.641,38 | 6,6569x |
| 175 | 17.174,12 | 1.519.815,5 | 6,6893x |
| 176 | 17.271,7 | 1.537.087,2 | 6,7218x |
| 177 | 17.369,28 | 1.554.456,48 | 6,7542x |
| 178 | 17.466,86 | 1.571.923,34 | 6,7866x |
| 179 | 17.564,44 | 1.589.487,78 | 6,8190x |
| 180 | 17.662,02 | 1.607.149,8 | 6,8514x |
| 181 | 17.759,6 | 1.624.909,4 | 6,8838x |
| 182 | 17.857,18 | 1.642.766,58 | 6,9162x |
| 183 | 17.954,76 | 1.660.721,34 | 6,9486x |
| 184 | 18.052,34 | 1.678.773,68 | 6,9810x |
| 185 | 18.149,92 | 1.696.923,6 | 7,0134x |
| 186 | 18.247,5 | 1.715.171,1 | 7,0458x |
| 187 | 18.345,08 | 1.733.516,18 | 7,0783x |
| 188 | 18.442,66 | 1.751.958,84 | 7,1107x |
| 189 | 18.540,24 | 1.770.499,08 | 7,1431x |
| 190 | 18.637,82 | 1.789.136,9 | 7,1755x |
| 191 | 18.735,4 | 1.807.872,3 | 7,2079x |
| 192 | 18.832,98 | 1.826.705,28 | 7,2403x |
| 193 | 18.930,56 | 1.845.635,84 | 7,2727x |
| 194 | 19.028,14 | 1.864.663,98 | 7,3051x |
| 195 | 19.125,72 | 1.883.789,7 | 7,3375x |
| 196 | 19.223,3 | 1.903.013 | 7,3700x |
| 197 | 19.320,88 | 1.922.333,88 | 7,4024x |
| 198 | 19.418,46 | 1.941.752,34 | 7,4348x |
| 199 | 19.516,04 | 1.961.268,38 | 7,4672x |
| 200 | 19.613,62 | 1.980.882 | 7,4996x |
| 201 | 19.711,2 | 2.000.593,2 | 7,5320x |
| 202 | 19.808,78 | 2.020.401,98 | 7,5644x |
| 203 | 19.906,36 | 2.040.308,34 | 7,5968x |
| 204 | 20.003,94 | 2.060.312,28 | 7,6292x |
| 205 | 20.101,52 | 2.080.413,8 | 7,6616x |
| 206 | 20.199,1 | 2.100.612,9 | 7,6940x |
| 207 | 20.296,68 | 2.120.909,58 | 7,7265x |
| 208 | 20.394,26 | 2.141.303,84 | 7,7589x |
| 209 | 20.491,84 | 2.161.795,68 | 7,7913x |
| 210 | 20.589,42 | 2.182.385,1 | 7,8237x |
| 211 | 20.687 | 2.203.072,1 | 7,8561x |
| 212 | 20.784,58 | 2.223.856,68 | 7,8885x |
| 213 | 20.882,16 | 2.244.738,84 | 7,9209x |
| 214 | 20.979,74 | 2.265.718,58 | 7,9533x |
| 215 | 21.077,32 | 2.286.795,9 | 7,9857x |
| 216 | 21.174,9 | 2.307.970,8 | 8,0182x |
| 217 | 21.272,48 | 2.329.243,28 | 8,0506x |
| 218 | 21.370,06 | 2.350.613,34 | 8,0830x |
| 219 | 21.467,64 | 2.372.080,98 | 8,1154x |
| 220 | 21.565,22 | 2.393.646,2 | 8,1478x |
| 221 | 21.662,8 | 2.415.309 | 8,1802x |
| 222 | 21.760,38 | 2.437.069,38 | 8,2126x |
| 223 | 21.857,96 | 2.458.927,34 | 8,2450x |
| 224 | 21.955,54 | 2.480.882,88 | 8,2774x |
| 225 | 22.053,12 | 2.502.936 | 8,3098x |
| 226 | 22.150,7 | 2.525.086,7 | 8,3422x |
| 227 | 22.248,28 | 2.547.334,98 | 8,3747x |
| 228 | 22.345,86 | 2.569.680,84 | 8,4071x |
| 229 | 22.443,44 | 2.592.124,28 | 8,4395x |
| 230 | 22.541,02 | 2.614.665,3 | 8,4719x |
| 231 | 22.638,6 | 2.637.303,9 | 8,5043x |
| 232 | 22.736,18 | 2.660.040,08 | 8,5367x |
| 233 | 22.833,76 | 2.682.873,84 | 8,5691x |
| 234 | 22.931,34 | 2.705.805,18 | 8,6015x |
| 235 | 23.028,92 | 2.728.834,1 | 8,6339x |
| 236 | 23.126,5 | 2.751.960,6 | 8,6664x |
| 237 | 23.224,08 | 2.775.184,68 | 8,6988x |
| 238 | 23.321,66 | 2.798.506,34 | 8,7312x |
| 239 | 23.419,24 | 2.821.925,58 | 8,7636x |
| 240 | 23.516,82 | 2.845.442,4 | 8,7960x |
| 241 | 23.614,4 | 2.869.056,8 | 8,8284x |
| 242 | 23.711,98 | 2.892.768,78 | 8,8608x |
| 243 | 23.809,56 | 2.916.578,34 | 8,8932x |
| 244 | 23.907,14 | 2.940.485,48 | 8,9256x |
| 245 | 24.004,72 | 2.964.490,2 | 8,9580x |
| 246 | 24.102,3 | 2.988.592,5 | 8,9905x |
| 247 | 24.199,88 | 3.012.792,38 | 9,0229x |
| 248 | 24.297,46 | 3.037.089,84 | 9,0553x |
| 249 | 24.395,04 | 3.061.484,88 | 9,0877x |
| 250 | 24.492,62 | 3.085.977,5 | 9,1201x |
| 251 | 24.590,2 | 3.110.567,7 | 9,1525x |
| 252 | 24.687,78 | 3.135.255,48 | 9,1849x |
| 253 | 24.785,36 | 3.160.040,84 | 9,2173x |
| 254 | 24.882,94 | 3.184.923,78 | 9,2497x |
| 255 | 24.980,52 | 3.209.904,3 | 9,2821x |
| 256 | 25.078,1 | 3.234.982,4 | 9,3146x |
| 257 | 25.175,68 | 3.260.158,08 | 9,3470x |
| 258 | 25.273,26 | 3.285.431,34 | 9,3794x |
| 259 | 25.370,84 | 3.310.802,18 | 9,4118x |
| 260 | 25.468,42 | 3.336.270,6 | 9,4442x |
| 261 | 25.566 | 3.361.836,6 | 9,4766x |
| 262 | 25.663,58 | 3.387.500,18 | 9,5090x |
| 263 | 25.761,16 | 3.413.261,34 | 9,5414x |
| 264 | 25.858,74 | 3.439.120,08 | 9,5738x |
| 265 | 25.956,32 | 3.465.076,4 | 9,6062x |
| 266 | 26.053,9 | 3.491.130,3 | 9,6387x |
| 267 | 26.151,48 | 3.517.281,78 | 9,6711x |
| 268 | 26.249,06 | 3.543.530,84 | 9,7035x |
| 269 | 26.346,64 | 3.569.877,48 | 9,7359x |
| 270 | 26.444,22 | 3.596.321,7 | 9,7683x |
| 271 | 26.541,8 | 3.622.863,5 | 9,8007x |
| 272 | 26.639,38 | 3.649.502,88 | 9,8331x |
| 273 | 26.736,96 | 3.676.239,84 | 9,8655x |
| 274 | 26.834,54 | 3.703.074,38 | 9,8979x |
| 275 | 26.932,12 | 3.730.006,5 | 9,9303x |
| 276 | 27.029,7 | 3.757.036,2 | 9,9628x |
| 277 | 27.127,28 | 3.784.163,48 | 9,9952x |
| 278 | 27.224,86 | 3.811.388,34 | 10,0276x |
| 279 | 27.322,44 | 3.838.710,78 | 10,0600x |
| 280 | 27.420,02 | 3.866.130,8 | 10,0924x |
| 281 | 27.517,6 | 3.893.648,4 | 10,1248x |
| 282 | 27.615,18 | 3.921.263,58 | 10,1572x |
| 283 | 27.712,76 | 3.948.976,34 | 10,1896x |
| 284 | 27.810,34 | 3.976.786,68 | 10,2220x |
| 285 | 27.907,92 | 4.004.694,6 | 10,2544x |
| 286 | 28.005,5 | 4.032.700,1 | 10,2869x |
| 287 | 28.103,08 | 4.060.803,18 | 10,3193x |
| 288 | 28.200,66 | 4.089.003,84 | 10,3517x |
| 289 | 28.298,24 | 4.117.302,08 | 10,3841x |
| 290 | 28.395,82 | 4.145.697,9 | 10,4165x |
| 291 | 28.493,4 | 4.174.191,3 | 10,4489x |
| 292 | 28.590,98 | 4.202.782,28 | 10,4813x |
| 293 | 28.688,56 | 4.231.470,84 | 10,5137x |
| 294 | 28.786,14 | 4.260.256,98 | 10,5461x |
| 295 | 28.883,72 | 4.289.140,7 | 10,5785x |
| 296 | 28.981,3 | 4.318.122 | 10,6110x |
| 297 | 29.078,88 | 4.347.200,88 | 10,6434x |
| 298 | 29.176,46 | 4.376.377,34 | 10,6758x |
| 299 | 29.274,04 | 4.405.651,38 | 10,7082x |
| 300 | 29.371,62 | 4.435.023 | 10,7406x |
| 301 | 29.469,2 | 4.464.492,2 | 10,7730x |
| 302 | 29.566,78 | 4.494.058,98 | 10,8054x |
| 303 | 29.664,36 | 4.523.723,34 | 10,8378x |
| 304 | 29.761,94 | 4.553.485,28 | 10,8702x |
| 305 | 29.859,52 | 4.583.344,8 | 10,9026x |
| 306 | 29.957,1 | 4.613.301,9 | 10,9351x |
| 307 | 30.054,68 | 4.643.356,58 | 10,9675x |
| 308 | 30.152,26 | 4.673.508,84 | 10,9999x |
| 309 | 30.249,84 | 4.703.758,68 | 11,0323x |
| 310 | 30.347,42 | 4.734.106,1 | 11,0647x |
| 311 | 30.445 | 4.764.551,1 | 11,0971x |
| 312 | 30.542,58 | 4.795.093,68 | 11,1295x |
| 313 | 30.640,16 | 4.825.733,84 | 11,1619x |
| 314 | 30.737,74 | 4.856.471,58 | 11,1943x |
| 315 | 30.835,32 | 4.887.306,9 | 11,2267x |
| 316 | 30.932,9 | 4.918.239,8 | 11,2592x |
| 317 | 31.030,48 | 4.949.270,28 | 11,2916x |
| 318 | 31.128,06 | 4.980.398,34 | 11,3240x |
| 319 | 31.225,64 | 5.011.623,98 | 11,3564x |
| 320 | 31.323,22 | 5.042.947,2 | 11,3888x |
| 321 | 31.420,8 | 5.074.368 | 11,4212x |
| 322 | 31.518,38 | 5.105.886,38 | 11,4536x |
| 323 | 31.615,96 | 5.137.502,34 | 11,4860x |
| 324 | 31.713,54 | 5.169.215,88 | 11,5184x |
| 325 | 31.811,12 | 5.201.027 | 11,5508x |
| 326 | 31.908,7 | 5.232.935,7 | 11,5833x |
| 327 | 32.006,28 | 5.264.941,98 | 11,6157x |
| 328 | 32.103,86 | 5.297.045,84 | 11,6481x |
| 329 | 32.201,44 | 5.329.247,28 | 11,6805x |
| 330 | 32.299,02 | 5.361.546,3 | 11,7129x |
| 331 | 32.396,6 | 5.393.942,9 | 11,7453x |
| 332 | 32.494,18 | 5.426.437,08 | 11,7777x |
| 333 | 32.591,76 | 5.459.028,84 | 11,8101x |
| 334 | 32.689,34 | 5.491.718,18 | 11,8425x |
| 335 | 32.786,92 | 5.524.505,1 | 11,8749x |
| 336 | 32.884,5 | 5.557.389,6 | 11,9074x |
| 337 | 32.982,08 | 5.590.371,68 | 11,9398x |
| 338 | 33.079,66 | 5.623.451,34 | 11,9722x |
| 339 | 33.177,24 | 5.656.628,58 | 12,0046x |
| 340 | 33.274,82 | 5.689.903,4 | 12,0370x |
| 341 | 33.372,4 | 5.723.275,8 | 12,0694x |
| 342 | 33.469,98 | 5.756.745,78 | 12,1018x |
| 343 | 33.567,56 | 5.790.313,34 | 12,1342x |
| 344 | 33.665,14 | 5.823.978,48 | 12,1666x |
| 345 | 33.762,72 | 5.857.741,2 | 12,1990x |
| 346 | 33.860,3 | 5.891.601,5 | 12,2315x |
| 347 | 33.957,88 | 5.925.559,38 | 12,2639x |
| 348 | 34.055,46 | 5.959.614,84 | 12,2963x |
| 349 | 34.153,04 | 5.993.767,88 | 12,3287x |
| 350 | 34.250,62 | 6.028.018,5 | 12,3611x |
| 351 | 34.348,2 | 6.062.366,7 | 12,3935x |
| 352 | 34.445,78 | 6.096.812,48 | 12,4259x |
| 353 | 34.543,36 | 6.131.355,84 | 12,4583x |
| 354 | 34.640,94 | 6.165.996,78 | 12,4907x |
| 355 | 34.738,52 | 6.200.735,3 | 12,5231x |
| 356 | 34.836,1 | 6.235.571,4 | 12,5556x |
| 357 | 34.933,68 | 6.270.505,08 | 12,5880x |
| 358 | 35.031,26 | 6.305.536,34 | 12,6204x |
| 359 | 35.128,84 | 6.340.665,18 | 12,6528x |
| 360 | 35.226,42 | 6.375.891,6 | 12,6852x |
| 361 | 35.324 | 6.411.215,6 | 12,7176x |
| 362 | 35.421,58 | 6.446.637,18 | 12,7500x |
| 363 | 35.519,16 | 6.482.156,34 | 12,7824x |
| 364 | 35.616,74 | 6.517.773,08 | 12,8148x |
| 365 | 35.714,32 | 6.553.487,4 | 12,8472x |
| 366 | 35.811,9 | 6.589.299,3 | 12,8797x |
| 367 | 35.909,48 | 6.625.208,78 | 12,9121x |
| 368 | 36.007,06 | 6.661.215,84 | 12,9445x |
| 369 | 36.104,64 | 6.697.320,48 | 12,9769x |
| 370 | 36.202,22 | 6.733.522,7 | 13,0093x |
| 371 | 36.299,8 | 6.769.822,5 | 13,0417x |
| 372 | 36.397,38 | 6.806.219,88 | 13,0741x |
| 373 | 36.494,96 | 6.842.714,84 | 13,1065x |
| 374 | 36.592,54 | 6.879.307,38 | 13,1389x |
| 375 | 36.690,12 | 6.915.997,5 | 13,1713x |
| 376 | 36.787,7 | 6.952.785,2 | 13,2038x |
| 377 | 36.885,28 | 6.989.670,48 | 13,2362x |
| 378 | 36.982,86 | 7.026.653,34 | 13,2686x |
| 379 | 37.080,44 | 7.063.733,78 | 13,3010x |
| 380 | 37.178,02 | 7.100.911,8 | 13,3334x |
| 381 | 37.275,6 | 7.138.187,4 | 13,3658x |
| 382 | 37.373,18 | 7.175.560,58 | 13,3982x |
| 383 | 37.470,76 | 7.213.031,34 | 13,4306x |
| 384 | 37.568,34 | 7.250.599,68 | 13,4630x |
| 385 | 37.665,92 | 7.288.265,6 | 13,4954x |
| 386 | 37.763,5 | 7.326.029,1 | 13,5279x |
| 387 | 37.861,08 | 7.363.890,18 | 13,5603x |
| 388 | 37.958,66 | 7.401.848,84 | 13,5927x |
| 389 | 38.056,24 | 7.439.905,08 | 13,6251x |
| 390 | 38.153,82 | 7.478.058,9 | 13,6575x |
| 391 | 38.251,4 | 7.516.310,3 | 13,6899x |
| 392 | 38.348,98 | 7.554.659,28 | 13,7223x |
| 393 | 38.446,56 | 7.593.105,84 | 13,7547x |
| 394 | 38.544,14 | 7.631.649,98 | 13,7871x |
| 395 | 38.641,72 | 7.670.291,7 | 13,8195x |
| 396 | 38.739,3 | 7.709.031 | 13,8520x |
| 397 | 38.836,88 | 7.747.867,88 | 13,8844x |
| 398 | 38.934,46 | 7.786.802,34 | 13,9168x |
| 399 | 39.032,04 | 7.825.834,38 | 13,9492x |
| 400 | 39.129,62 | 7.864.964 | 13,9816x |
| 401 | 39.227,2 | 7.904.191,2 | 14,0140x |
| 402 | 39.324,78 | 7.943.515,98 | 14,0464x |
| 403 | 39.422,36 | 7.982.938,34 | 14,0788x |
| 404 | 39.519,94 | 8.022.458,28 | 14,1112x |
| 405 | 39.617,52 | 8.062.075,8 | 14,1436x |
| 406 | 39.715,1 | 8.101.790,9 | 14,1761x |
| 407 | 39.812,68 | 8.141.603,58 | 14,2085x |
| 408 | 39.910,26 | 8.181.513,84 | 14,2409x |
| 409 | 40.007,84 | 8.221.521,68 | 14,2733x |
| 410 | 40.105,42 | 8.261.627,1 | 14,3057x |
| 411 | 40.203 | 8.301.830,1 | 14,3381x |
| 412 | 40.300,58 | 8.342.130,68 | 14,3705x |
| 413 | 40.398,16 | 8.382.528,84 | 14,4029x |
| 414 | 40.495,74 | 8.423.024,58 | 14,4353x |
| 415 | 40.593,32 | 8.463.617,9 | 14,4677x |
| 416 | 40.690,9 | 8.504.308,8 | 14,5002x |
| 417 | 40.788,48 | 8.545.097,28 | 14,5326x |
| 418 | 40.886,06 | 8.585.983,34 | 14,5650x |
| 419 | 40.983,64 | 8.626.966,98 | 14,5974x |
| 420 | 41.081,22 | 8.668.048,2 | 14,6298x |
| 421 | 41.178,8 | 8.709.227 | 14,6622x |
| 422 | 41.276,38 | 8.750.503,38 | 14,6946x |
| 423 | 41.373,96 | 8.791.877,34 | 14,7270x |
| 424 | 41.471,54 | 8.833.348,88 | 14,7594x |
| 425 | 41.569,12 | 8.874.918 | 14,7918x |
| 426 | 41.666,7 | 8.916.584,7 | 14,8243x |
| 427 | 41.764,28 | 8.958.348,98 | 14,8567x |
| 428 | 41.861,86 | 9.000.210,84 | 14,8891x |
| 429 | 41.959,44 | 9.042.170,28 | 14,9215x |
| 430 | 42.057,02 | 9.084.227,3 | 14,9539x |
| 431 | 42.154,6 | 9.126.381,9 | 14,9863x |
| 432 | 42.252,18 | 9.168.634,08 | 15,0187x |
| 433 | 42.349,76 | 9.210.983,84 | 15,0511x |
| 434 | 42.447,34 | 9.253.431,18 | 15,0835x |
| 435 | 42.544,92 | 9.295.976,1 | 15,1159x |
| 436 | 42.642,5 | 9.338.618,6 | 15,1484x |
| 437 | 42.740,08 | 9.381.358,68 | 15,1808x |
| 438 | 42.837,66 | 9.424.196,34 | 15,2132x |
| 439 | 42.935,24 | 9.467.131,58 | 15,2456x |
| 440 | 43.032,82 | 9.510.164,4 | 15,2780x |
| 441 | 43.130,4 | 9.553.294,8 | 15,3104x |
| 442 | 43.227,98 | 9.596.522,78 | 15,3428x |
| 443 | 43.325,56 | 9.639.848,34 | 15,3752x |
| 444 | 43.423,14 | 9.683.271,48 | 15,4076x |
| 445 | 43.520,72 | 9.726.792,2 | 15,4400x |
| 446 | 43.618,3 | 9.770.410,5 | 15,4725x |
| 447 | 43.715,88 | 9.814.126,38 | 15,5049x |
| 448 | 43.813,46 | 9.857.939,84 | 15,5373x |
| 449 | 43.911,04 | 9.901.850,88 | 15,5697x |
| 450 | 44.008,62 | 9.945.859,5 | 15,6021x |
| 451 | 44.106,2 | 9.989.965,7 | 15,6345x |
| 452 | 44.203,78 | 10.034.169,48 | 15,6669x |
| 453 | 44.301,36 | 10.078.470,84 | 15,6993x |
| 454 | 44.398,94 | 10.122.869,78 | 15,7317x |
| 455 | 44.496,52 | 10.167.366,3 | 15,7641x |
| 456 | 44.594,1 | 10.211.960,4 | 15,7966x |
| 457 | 44.691,68 | 10.256.652,08 | 15,8290x |
| 458 | 44.789,26 | 10.301.441,34 | 15,8614x |
| 459 | 44.886,84 | 10.346.328,18 | 15,8938x |
| 460 | 44.984,42 | 10.391.312,6 | 15,9262x |
| 461 | 45.082 | 10.436.394,6 | 15,9586x |
| 462 | 45.179,58 | 10.481.574,18 | 15,9910x |
| 463 | 45.277,16 | 10.526.851,34 | 16,0234x |
| 464 | 45.374,74 | 10.572.226,08 | 16,0558x |
| 465 | 45.472,32 | 10.617.698,4 | 16,0882x |
| 466 | 45.569,9 | 10.663.268,3 | 16,1207x |
| 467 | 45.667,48 | 10.708.935,78 | 16,1531x |
| 468 | 45.765,06 | 10.754.700,84 | 16,1855x |
| 469 | 45.862,64 | 10.800.563,48 | 16,2179x |
| 470 | 45.960,22 | 10.846.523,7 | 16,2503x |
| 471 | 46.057,8 | 10.892.581,5 | 16,2827x |
| 472 | 46.155,38 | 10.938.736,88 | 16,3151x |
| 473 | 46.252,96 | 10.984.989,84 | 16,3475x |
| 474 | 46.350,54 | 11.031.340,38 | 16,3799x |
| 475 | 46.448,12 | 11.077.788,5 | 16,4123x |
| 476 | 46.545,7 | 11.124.334,2 | 16,4447x |
| 477 | 46.643,28 | 11.170.977,48 | 16,4772x |
| 478 | 46.740,86 | 11.217.718,34 | 16,5096x |
| 479 | 46.838,44 | 11.264.556,78 | 16,5420x |
| 480 | 46.936,02 | 11.311.492,8 | 16,5744x |
| 481 | 47.033,6 | 11.358.526,4 | 16,6068x |
| 482 | 47.131,18 | 11.405.657,58 | 16,6392x |
| 483 | 47.228,76 | 11.452.886,34 | 16,6716x |
| 484 | 47.326,34 | 11.500.212,68 | 16,7040x |
| 485 | 47.423,92 | 11.547.636,6 | 16,7364x |
| 486 | 47.521,5 | 11.595.158,1 | 16,7689x |
| 487 | 47.619,08 | 11.642.777,18 | 16,8013x |
| 488 | 47.716,66 | 11.690.493,84 | 16,8337x |
| 489 | 47.814,24 | 11.738.308,08 | 16,8661x |
| 490 | 47.911,82 | 11.786.219,9 | 16,8985x |
| 491 | 48.009,4 | 11.834.229,3 | 16,9309x |
| 492 | 48.106,98 | 11.882.336,28 | 16,9633x |
| 493 | 48.204,56 | 11.930.540,84 | 16,9957x |
| 494 | 48.302,14 | 11.978.842,98 | 17,0281x |
| 495 | 48.399,72 | 12.027.242,7 | 17,0605x |
| 496 | 48.497,3 | 12.075.740 | 17,0930x |
| 497 | 48.594,88 | 12.124.334,88 | 17,1254x |
| 498 | 48.692,46 | 12.173.027,34 | 17,1578x |
| 499 | 48.790,04 | 12.221.817,38 | 17,1902x |
| 500 | 48.887,62 | 12.270.705 | 17,2226x |

### Anexo — Fertilidade

| Nível | Custo do nível | Custo acumulado | Multiplicador |
|---:|---:|---:|---:|
| 1 | 292,7 | 292,7 | 1,0500x |
| 2 | 409,8 | 702,5 | 1,0540x |
| 3 | 526,9 | 1.229,4 | 1,0579x |
| 4 | 644 | 1.873,4 | 1,0619x |
| 5 | 761,1 | 2.634,5 | 1,0659x |
| 6 | 878,2 | 3.512,7 | 1,0698x |
| 7 | 995,3 | 4.508 | 1,0738x |
| 8 | 1.112,4 | 5.620,4 | 1,0778x |
| 9 | 1.229,5 | 6.849,9 | 1,0817x |
| 10 | 1.346,6 | 8.196,5 | 1,0857x |
| 11 | 1.463,7 | 9.660,2 | 1,0897x |
| 12 | 1.580,8 | 11.241 | 1,0936x |
| 13 | 1.697,9 | 12.938,9 | 1,0976x |
| 14 | 1.815 | 14.753,9 | 1,1016x |
| 15 | 1.932,1 | 16.686 | 1,1056x |
| 16 | 2.049,2 | 18.735,2 | 1,1095x |
| 17 | 2.166,3 | 20.901,5 | 1,1135x |
| 18 | 2.283,4 | 23.184,9 | 1,1175x |
| 19 | 2.400,5 | 25.585,4 | 1,1214x |
| 20 | 2.517,6 | 28.103 | 1,1254x |
| 21 | 2.634,7 | 30.737,7 | 1,1294x |
| 22 | 2.751,8 | 33.489,5 | 1,1333x |
| 23 | 2.868,9 | 36.358,4 | 1,1373x |
| 24 | 2.986 | 39.344,4 | 1,1413x |
| 25 | 3.103,1 | 42.447,5 | 1,1452x |
| 26 | 3.220,2 | 45.667,7 | 1,1492x |
| 27 | 3.337,3 | 49.005 | 1,1532x |
| 28 | 3.454,4 | 52.459,4 | 1,1571x |
| 29 | 3.571,5 | 56.030,9 | 1,1611x |
| 30 | 3.688,6 | 59.719,5 | 1,1651x |
| 31 | 3.805,7 | 63.525,2 | 1,1690x |
| 32 | 3.922,8 | 67.448 | 1,1730x |
| 33 | 4.039,9 | 71.487,9 | 1,1770x |
| 34 | 4.157 | 75.644,9 | 1,1809x |
| 35 | 4.274,1 | 79.919 | 1,1849x |
| 36 | 4.391,2 | 84.310,2 | 1,1889x |
| 37 | 4.508,3 | 88.818,5 | 1,1928x |
| 38 | 4.625,4 | 93.443,9 | 1,1968x |
| 39 | 4.742,5 | 98.186,4 | 1,2008x |
| 40 | 4.859,6 | 103.046 | 1,2048x |
| 41 | 4.976,7 | 108.022,7 | 1,2087x |
| 42 | 5.093,8 | 113.116,5 | 1,2127x |
| 43 | 5.210,9 | 118.327,4 | 1,2167x |
| 44 | 5.328 | 123.655,4 | 1,2206x |
| 45 | 5.445,1 | 129.100,5 | 1,2246x |
| 46 | 5.562,2 | 134.662,7 | 1,2286x |
| 47 | 5.679,3 | 140.342 | 1,2325x |
| 48 | 5.796,4 | 146.138,4 | 1,2365x |
| 49 | 5.913,5 | 152.051,9 | 1,2405x |
| 50 | 6.030,6 | 158.082,5 | 1,2444x |
| 51 | 6.147,7 | 164.230,2 | 1,2484x |
| 52 | 6.264,8 | 170.495 | 1,2524x |
| 53 | 6.381,9 | 176.876,9 | 1,2563x |
| 54 | 6.499 | 183.375,9 | 1,2603x |
| 55 | 6.616,1 | 189.992 | 1,2643x |
| 56 | 6.733,2 | 196.725,2 | 1,2682x |
| 57 | 6.850,3 | 203.575,5 | 1,2722x |
| 58 | 6.967,4 | 210.542,9 | 1,2762x |
| 59 | 7.084,5 | 217.627,4 | 1,2801x |
| 60 | 7.201,6 | 224.829 | 1,2841x |
| 61 | 7.318,7 | 232.147,7 | 1,2881x |
| 62 | 7.435,8 | 239.583,5 | 1,2920x |
| 63 | 7.552,9 | 247.136,4 | 1,2960x |
| 64 | 7.670 | 254.806,4 | 1,3000x |
| 65 | 7.787,1 | 262.593,5 | 1,3040x |
| 66 | 7.904,2 | 270.497,7 | 1,3079x |
| 67 | 8.021,3 | 278.519 | 1,3119x |
| 68 | 8.138,4 | 286.657,4 | 1,3159x |
| 69 | 8.255,5 | 294.912,9 | 1,3198x |
| 70 | 8.372,6 | 303.285,5 | 1,3238x |
| 71 | 8.489,7 | 311.775,2 | 1,3278x |
| 72 | 8.606,8 | 320.382 | 1,3317x |
| 73 | 8.723,9 | 329.105,9 | 1,3357x |
| 74 | 8.841 | 337.946,9 | 1,3397x |
| 75 | 8.958,1 | 346.905 | 1,3436x |
| 76 | 9.075,2 | 355.980,2 | 1,3476x |
| 77 | 9.192,3 | 365.172,5 | 1,3516x |
| 78 | 9.309,4 | 374.481,9 | 1,3555x |
| 79 | 9.426,5 | 383.908,4 | 1,3595x |
| 80 | 9.543,6 | 393.452 | 1,3635x |
| 81 | 9.660,7 | 403.112,7 | 1,3674x |
| 82 | 9.777,8 | 412.890,5 | 1,3714x |
| 83 | 9.894,9 | 422.785,4 | 1,3754x |
| 84 | 10.012 | 432.797,4 | 1,3793x |
| 85 | 10.129,1 | 442.926,5 | 1,3833x |
| 86 | 10.246,2 | 453.172,7 | 1,3873x |
| 87 | 10.363,3 | 463.536 | 1,3912x |
| 88 | 10.480,4 | 474.016,4 | 1,3952x |
| 89 | 10.597,5 | 484.613,9 | 1,3992x |
| 90 | 10.714,6 | 495.328,5 | 1,4032x |
| 91 | 10.831,7 | 506.160,2 | 1,4071x |
| 92 | 10.948,8 | 517.109 | 1,4111x |
| 93 | 11.065,9 | 528.174,9 | 1,4151x |
| 94 | 11.183 | 539.357,9 | 1,4190x |
| 95 | 11.300,1 | 550.658 | 1,4230x |
| 96 | 11.417,2 | 562.075,2 | 1,4270x |
| 97 | 11.534,3 | 573.609,5 | 1,4309x |
| 98 | 11.651,4 | 585.260,9 | 1,4349x |
| 99 | 11.768,5 | 597.029,4 | 1,4389x |
| 100 | 11.885,6 | 608.915 | 1,4428x |
| 101 | 12.002,7 | 620.917,7 | 1,4468x |
| 102 | 12.119,8 | 633.037,5 | 1,4508x |
| 103 | 12.236,9 | 645.274,4 | 1,4547x |
| 104 | 12.354 | 657.628,4 | 1,4587x |
| 105 | 12.471,1 | 670.099,5 | 1,4627x |
| 106 | 12.588,2 | 682.687,7 | 1,4666x |
| 107 | 12.705,3 | 695.393 | 1,4706x |
| 108 | 12.822,4 | 708.215,4 | 1,4746x |
| 109 | 12.939,5 | 721.154,9 | 1,4785x |
| 110 | 13.056,6 | 734.211,5 | 1,4825x |
| 111 | 13.173,7 | 747.385,2 | 1,4865x |
| 112 | 13.290,8 | 760.676 | 1,4904x |
| 113 | 13.407,9 | 774.083,9 | 1,4944x |
| 114 | 13.525 | 787.608,9 | 1,4984x |
| 115 | 13.642,1 | 801.251 | 1,5024x |
| 116 | 13.759,2 | 815.010,2 | 1,5063x |
| 117 | 13.876,3 | 828.886,5 | 1,5103x |
| 118 | 13.993,4 | 842.879,9 | 1,5143x |
| 119 | 14.110,5 | 856.990,4 | 1,5182x |
| 120 | 14.227,6 | 871.218 | 1,5222x |
| 121 | 14.344,7 | 885.562,7 | 1,5262x |
| 122 | 14.461,8 | 900.024,5 | 1,5301x |
| 123 | 14.578,9 | 914.603,4 | 1,5341x |
| 124 | 14.696 | 929.299,4 | 1,5381x |
| 125 | 14.813,1 | 944.112,5 | 1,5420x |
| 126 | 14.930,2 | 959.042,7 | 1,5460x |
| 127 | 15.047,3 | 974.090 | 1,5500x |
| 128 | 15.164,4 | 989.254,4 | 1,5539x |
| 129 | 15.281,5 | 1.004.535,9 | 1,5579x |
| 130 | 15.398,6 | 1.019.934,5 | 1,5619x |
| 131 | 15.515,7 | 1.035.450,2 | 1,5658x |
| 132 | 15.632,8 | 1.051.083 | 1,5698x |
| 133 | 15.749,9 | 1.066.832,9 | 1,5738x |
| 134 | 15.867 | 1.082.699,9 | 1,5777x |
| 135 | 15.984,1 | 1.098.684 | 1,5817x |
| 136 | 16.101,2 | 1.114.785,2 | 1,5857x |
| 137 | 16.218,3 | 1.131.003,5 | 1,5896x |
| 138 | 16.335,4 | 1.147.338,9 | 1,5936x |
| 139 | 16.452,5 | 1.163.791,4 | 1,5976x |
| 140 | 16.569,6 | 1.180.361 | 1,6016x |
| 141 | 16.686,7 | 1.197.047,7 | 1,6055x |
| 142 | 16.803,8 | 1.213.851,5 | 1,6095x |
| 143 | 16.920,9 | 1.230.772,4 | 1,6135x |
| 144 | 17.038 | 1.247.810,4 | 1,6174x |
| 145 | 17.155,1 | 1.264.965,5 | 1,6214x |
| 146 | 17.272,2 | 1.282.237,7 | 1,6254x |
| 147 | 17.389,3 | 1.299.627 | 1,6293x |
| 148 | 17.506,4 | 1.317.133,4 | 1,6333x |
| 149 | 17.623,5 | 1.334.756,9 | 1,6373x |
| 150 | 17.740,6 | 1.352.497,5 | 1,6412x |
| 151 | 17.857,7 | 1.370.355,2 | 1,6452x |
| 152 | 17.974,8 | 1.388.330 | 1,6492x |
| 153 | 18.091,9 | 1.406.421,9 | 1,6531x |
| 154 | 18.209 | 1.424.630,9 | 1,6571x |
| 155 | 18.326,1 | 1.442.957 | 1,6611x |
| 156 | 18.443,2 | 1.461.400,2 | 1,6650x |
| 157 | 18.560,3 | 1.479.960,5 | 1,6690x |
| 158 | 18.677,4 | 1.498.637,9 | 1,6730x |
| 159 | 18.794,5 | 1.517.432,4 | 1,6769x |
| 160 | 18.911,6 | 1.536.344 | 1,6809x |
| 161 | 19.028,7 | 1.555.372,7 | 1,6849x |
| 162 | 19.145,8 | 1.574.518,5 | 1,6888x |
| 163 | 19.262,9 | 1.593.781,4 | 1,6928x |
| 164 | 19.380 | 1.613.161,4 | 1,6968x |
| 165 | 19.497,1 | 1.632.658,5 | 1,7008x |
| 166 | 19.614,2 | 1.652.272,7 | 1,7047x |
| 167 | 19.731,3 | 1.672.004 | 1,7087x |
| 168 | 19.848,4 | 1.691.852,4 | 1,7127x |
| 169 | 19.965,5 | 1.711.817,9 | 1,7166x |
| 170 | 20.082,6 | 1.731.900,5 | 1,7206x |
| 171 | 20.199,7 | 1.752.100,2 | 1,7246x |
| 172 | 20.316,8 | 1.772.417 | 1,7285x |
| 173 | 20.433,9 | 1.792.850,9 | 1,7325x |
| 174 | 20.551 | 1.813.401,9 | 1,7365x |
| 175 | 20.668,1 | 1.834.070 | 1,7404x |
| 176 | 20.785,2 | 1.854.855,2 | 1,7444x |
| 177 | 20.902,3 | 1.875.757,5 | 1,7484x |
| 178 | 21.019,4 | 1.896.776,9 | 1,7523x |
| 179 | 21.136,5 | 1.917.913,4 | 1,7563x |
| 180 | 21.253,6 | 1.939.167 | 1,7603x |
| 181 | 21.370,7 | 1.960.537,7 | 1,7642x |
| 182 | 21.487,8 | 1.982.025,5 | 1,7682x |
| 183 | 21.604,9 | 2.003.630,4 | 1,7722x |
| 184 | 21.722 | 2.025.352,4 | 1,7761x |
| 185 | 21.839,1 | 2.047.191,5 | 1,7801x |
| 186 | 21.956,2 | 2.069.147,7 | 1,7841x |
| 187 | 22.073,3 | 2.091.221 | 1,7880x |
| 188 | 22.190,4 | 2.113.411,4 | 1,7920x |
| 189 | 22.307,5 | 2.135.718,9 | 1,7960x |
| 190 | 22.424,6 | 2.158.143,5 | 1,8000x |
| 191 | 22.541,7 | 2.180.685,2 | 1,8039x |
| 192 | 22.658,8 | 2.203.344 | 1,8079x |
| 193 | 22.775,9 | 2.226.119,9 | 1,8119x |
| 194 | 22.893 | 2.249.012,9 | 1,8158x |
| 195 | 23.010,1 | 2.272.023 | 1,8198x |
| 196 | 23.127,2 | 2.295.150,2 | 1,8238x |
| 197 | 23.244,3 | 2.318.394,5 | 1,8277x |
| 198 | 23.361,4 | 2.341.755,9 | 1,8317x |
| 199 | 23.478,5 | 2.365.234,4 | 1,8357x |
| 200 | 23.595,6 | 2.388.830 | 1,8396x |
| 201 | 23.712,7 | 2.412.542,7 | 1,8436x |
| 202 | 23.829,8 | 2.436.372,5 | 1,8476x |
| 203 | 23.946,9 | 2.460.319,4 | 1,8515x |
| 204 | 24.064 | 2.484.383,4 | 1,8555x |
| 205 | 24.181,1 | 2.508.564,5 | 1,8595x |
| 206 | 24.298,2 | 2.532.862,7 | 1,8634x |
| 207 | 24.415,3 | 2.557.278 | 1,8674x |
| 208 | 24.532,4 | 2.581.810,4 | 1,8714x |
| 209 | 24.649,5 | 2.606.459,9 | 1,8753x |
| 210 | 24.766,6 | 2.631.226,5 | 1,8793x |
| 211 | 24.883,7 | 2.656.110,2 | 1,8833x |
| 212 | 25.000,8 | 2.681.111 | 1,8872x |
| 213 | 25.117,9 | 2.706.228,9 | 1,8912x |
| 214 | 25.235 | 2.731.463,9 | 1,8952x |
| 215 | 25.352,1 | 2.756.816 | 1,8992x |
| 216 | 25.469,2 | 2.782.285,2 | 1,9031x |
| 217 | 25.586,3 | 2.807.871,5 | 1,9071x |
| 218 | 25.703,4 | 2.833.574,9 | 1,9111x |
| 219 | 25.820,5 | 2.859.395,4 | 1,9150x |
| 220 | 25.937,6 | 2.885.333 | 1,9190x |
| 221 | 26.054,7 | 2.911.387,7 | 1,9230x |
| 222 | 26.171,8 | 2.937.559,5 | 1,9269x |
| 223 | 26.288,9 | 2.963.848,4 | 1,9309x |
| 224 | 26.406 | 2.990.254,4 | 1,9349x |
| 225 | 26.523,1 | 3.016.777,5 | 1,9388x |
| 226 | 26.640,2 | 3.043.417,7 | 1,9428x |
| 227 | 26.757,3 | 3.070.175 | 1,9468x |
| 228 | 26.874,4 | 3.097.049,4 | 1,9507x |
| 229 | 26.991,5 | 3.124.040,9 | 1,9547x |
| 230 | 27.108,6 | 3.151.149,5 | 1,9587x |
| 231 | 27.225,7 | 3.178.375,2 | 1,9626x |
| 232 | 27.342,8 | 3.205.718 | 1,9666x |
| 233 | 27.459,9 | 3.233.177,9 | 1,9706x |
| 234 | 27.577 | 3.260.754,9 | 1,9745x |
| 235 | 27.694,1 | 3.288.449 | 1,9785x |
| 236 | 27.811,2 | 3.316.260,2 | 1,9825x |
| 237 | 27.928,3 | 3.344.188,5 | 1,9864x |
| 238 | 28.045,4 | 3.372.233,9 | 1,9904x |
| 239 | 28.162,5 | 3.400.396,4 | 1,9944x |
| 240 | 28.279,6 | 3.428.676 | 1,9984x |
| 241 | 28.396,7 | 3.457.072,7 | 2,0023x |
| 242 | 28.513,8 | 3.485.586,5 | 2,0063x |
| 243 | 28.630,9 | 3.514.217,4 | 2,0103x |
| 244 | 28.748 | 3.542.965,4 | 2,0142x |
| 245 | 28.865,1 | 3.571.830,5 | 2,0182x |
| 246 | 28.982,2 | 3.600.812,7 | 2,0222x |
| 247 | 29.099,3 | 3.629.912 | 2,0261x |
| 248 | 29.216,4 | 3.659.128,4 | 2,0301x |
| 249 | 29.333,5 | 3.688.461,9 | 2,0341x |
| 250 | 29.450,6 | 3.717.912,5 | 2,0380x |
| 251 | 29.567,7 | 3.747.480,2 | 2,0420x |
| 252 | 29.684,8 | 3.777.165 | 2,0460x |
| 253 | 29.801,9 | 3.806.966,9 | 2,0499x |
| 254 | 29.919 | 3.836.885,9 | 2,0539x |
| 255 | 30.036,1 | 3.866.922 | 2,0579x |
| 256 | 30.153,2 | 3.897.075,2 | 2,0618x |
| 257 | 30.270,3 | 3.927.345,5 | 2,0658x |
| 258 | 30.387,4 | 3.957.732,9 | 2,0698x |
| 259 | 30.504,5 | 3.988.237,4 | 2,0737x |
| 260 | 30.621,6 | 4.018.859 | 2,0777x |
| 261 | 30.738,7 | 4.049.597,7 | 2,0817x |
| 262 | 30.855,8 | 4.080.453,5 | 2,0856x |
| 263 | 30.972,9 | 4.111.426,4 | 2,0896x |
| 264 | 31.090 | 4.142.516,4 | 2,0936x |
| 265 | 31.207,1 | 4.173.723,5 | 2,0976x |
| 266 | 31.324,2 | 4.205.047,7 | 2,1015x |
| 267 | 31.441,3 | 4.236.489 | 2,1055x |
| 268 | 31.558,4 | 4.268.047,4 | 2,1095x |
| 269 | 31.675,5 | 4.299.722,9 | 2,1134x |
| 270 | 31.792,6 | 4.331.515,5 | 2,1174x |
| 271 | 31.909,7 | 4.363.425,2 | 2,1214x |
| 272 | 32.026,8 | 4.395.452 | 2,1253x |
| 273 | 32.143,9 | 4.427.595,9 | 2,1293x |
| 274 | 32.261 | 4.459.856,9 | 2,1333x |
| 275 | 32.378,1 | 4.492.235 | 2,1372x |
| 276 | 32.495,2 | 4.524.730,2 | 2,1412x |
| 277 | 32.612,3 | 4.557.342,5 | 2,1452x |
| 278 | 32.729,4 | 4.590.071,9 | 2,1491x |
| 279 | 32.846,5 | 4.622.918,4 | 2,1531x |
| 280 | 32.963,6 | 4.655.882 | 2,1571x |
| 281 | 33.080,7 | 4.688.962,7 | 2,1610x |
| 282 | 33.197,8 | 4.722.160,5 | 2,1650x |
| 283 | 33.314,9 | 4.755.475,4 | 2,1690x |
| 284 | 33.432 | 4.788.907,4 | 2,1729x |
| 285 | 33.549,1 | 4.822.456,5 | 2,1769x |
| 286 | 33.666,2 | 4.856.122,7 | 2,1809x |
| 287 | 33.783,3 | 4.889.906 | 2,1848x |
| 288 | 33.900,4 | 4.923.806,4 | 2,1888x |
| 289 | 34.017,5 | 4.957.823,9 | 2,1928x |
| 290 | 34.134,6 | 4.991.958,5 | 2,1968x |
| 291 | 34.251,7 | 5.026.210,2 | 2,2007x |
| 292 | 34.368,8 | 5.060.579 | 2,2047x |
| 293 | 34.485,9 | 5.095.064,9 | 2,2087x |
| 294 | 34.603 | 5.129.667,9 | 2,2126x |
| 295 | 34.720,1 | 5.164.388 | 2,2166x |
| 296 | 34.837,2 | 5.199.225,2 | 2,2206x |
| 297 | 34.954,3 | 5.234.179,5 | 2,2245x |
| 298 | 35.071,4 | 5.269.250,9 | 2,2285x |
| 299 | 35.188,5 | 5.304.439,4 | 2,2325x |
| 300 | 35.305,6 | 5.339.745 | 2,2364x |
| 301 | 35.422,7 | 5.375.167,7 | 2,2404x |
| 302 | 35.539,8 | 5.410.707,5 | 2,2444x |
| 303 | 35.656,9 | 5.446.364,4 | 2,2483x |
| 304 | 35.774 | 5.482.138,4 | 2,2523x |
| 305 | 35.891,1 | 5.518.029,5 | 2,2563x |
| 306 | 36.008,2 | 5.554.037,7 | 2,2602x |
| 307 | 36.125,3 | 5.590.163 | 2,2642x |
| 308 | 36.242,4 | 5.626.405,4 | 2,2682x |
| 309 | 36.359,5 | 5.662.764,9 | 2,2721x |
| 310 | 36.476,6 | 5.699.241,5 | 2,2761x |
| 311 | 36.593,7 | 5.735.835,2 | 2,2801x |
| 312 | 36.710,8 | 5.772.546 | 2,2840x |
| 313 | 36.827,9 | 5.809.373,9 | 2,2880x |
| 314 | 36.945 | 5.846.318,9 | 2,2920x |
| 315 | 37.062,1 | 5.883.381 | 2,2960x |
| 316 | 37.179,2 | 5.920.560,2 | 2,2999x |
| 317 | 37.296,3 | 5.957.856,5 | 2,3039x |
| 318 | 37.413,4 | 5.995.269,9 | 2,3079x |
| 319 | 37.530,5 | 6.032.800,4 | 2,3118x |
| 320 | 37.647,6 | 6.070.448 | 2,3158x |
| 321 | 37.764,7 | 6.108.212,7 | 2,3198x |
| 322 | 37.881,8 | 6.146.094,5 | 2,3237x |
| 323 | 37.998,9 | 6.184.093,4 | 2,3277x |
| 324 | 38.116 | 6.222.209,4 | 2,3317x |
| 325 | 38.233,1 | 6.260.442,5 | 2,3356x |
| 326 | 38.350,2 | 6.298.792,7 | 2,3396x |
| 327 | 38.467,3 | 6.337.260 | 2,3436x |
| 328 | 38.584,4 | 6.375.844,4 | 2,3475x |
| 329 | 38.701,5 | 6.414.545,9 | 2,3515x |
| 330 | 38.818,6 | 6.453.364,5 | 2,3555x |
| 331 | 38.935,7 | 6.492.300,2 | 2,3594x |
| 332 | 39.052,8 | 6.531.353 | 2,3634x |
| 333 | 39.169,9 | 6.570.522,9 | 2,3674x |
| 334 | 39.287 | 6.609.809,9 | 2,3713x |
| 335 | 39.404,1 | 6.649.214 | 2,3753x |
| 336 | 39.521,2 | 6.688.735,2 | 2,3793x |
| 337 | 39.638,3 | 6.728.373,5 | 2,3832x |
| 338 | 39.755,4 | 6.768.128,9 | 2,3872x |
| 339 | 39.872,5 | 6.808.001,4 | 2,3912x |
| 340 | 39.989,6 | 6.847.991 | 2,3952x |
| 341 | 40.106,7 | 6.888.097,7 | 2,3991x |
| 342 | 40.223,8 | 6.928.321,5 | 2,4031x |
| 343 | 40.340,9 | 6.968.662,4 | 2,4071x |
| 344 | 40.458 | 7.009.120,4 | 2,4110x |
| 345 | 40.575,1 | 7.049.695,5 | 2,4150x |
| 346 | 40.692,2 | 7.090.387,7 | 2,4190x |
| 347 | 40.809,3 | 7.131.197 | 2,4229x |
| 348 | 40.926,4 | 7.172.123,4 | 2,4269x |
| 349 | 41.043,5 | 7.213.166,9 | 2,4309x |
| 350 | 41.160,6 | 7.254.327,5 | 2,4348x |
| 351 | 41.277,7 | 7.295.605,2 | 2,4388x |
| 352 | 41.394,8 | 7.337.000 | 2,4428x |
| 353 | 41.511,9 | 7.378.511,9 | 2,4467x |
| 354 | 41.629 | 7.420.140,9 | 2,4507x |
| 355 | 41.746,1 | 7.461.887 | 2,4547x |
| 356 | 41.863,2 | 7.503.750,2 | 2,4586x |
| 357 | 41.980,3 | 7.545.730,5 | 2,4626x |
| 358 | 42.097,4 | 7.587.827,9 | 2,4666x |
| 359 | 42.214,5 | 7.630.042,4 | 2,4705x |
| 360 | 42.331,6 | 7.672.374 | 2,4745x |
| 361 | 42.448,7 | 7.714.822,7 | 2,4785x |
| 362 | 42.565,8 | 7.757.388,5 | 2,4824x |
| 363 | 42.682,9 | 7.800.071,4 | 2,4864x |
| 364 | 42.800 | 7.842.871,4 | 2,4904x |
| 365 | 42.917,1 | 7.885.788,5 | 2,4944x |
| 366 | 43.034,2 | 7.928.822,7 | 2,4983x |
| 367 | 43.151,3 | 7.971.974 | 2,5023x |
| 368 | 43.268,4 | 8.015.242,4 | 2,5063x |
| 369 | 43.385,5 | 8.058.627,9 | 2,5102x |
| 370 | 43.502,6 | 8.102.130,5 | 2,5142x |
| 371 | 43.619,7 | 8.145.750,2 | 2,5182x |
| 372 | 43.736,8 | 8.189.487 | 2,5221x |
| 373 | 43.853,9 | 8.233.340,9 | 2,5261x |
| 374 | 43.971 | 8.277.311,9 | 2,5301x |
| 375 | 44.088,1 | 8.321.400 | 2,5340x |
| 376 | 44.205,2 | 8.365.605,2 | 2,5380x |
| 377 | 44.322,3 | 8.409.927,5 | 2,5420x |
| 378 | 44.439,4 | 8.454.366,9 | 2,5459x |
| 379 | 44.556,5 | 8.498.923,4 | 2,5499x |
| 380 | 44.673,6 | 8.543.597 | 2,5539x |
| 381 | 44.790,7 | 8.588.387,7 | 2,5578x |
| 382 | 44.907,8 | 8.633.295,5 | 2,5618x |
| 383 | 45.024,9 | 8.678.320,4 | 2,5658x |
| 384 | 45.142 | 8.723.462,4 | 2,5697x |
| 385 | 45.259,1 | 8.768.721,5 | 2,5737x |
| 386 | 45.376,2 | 8.814.097,7 | 2,5777x |
| 387 | 45.493,3 | 8.859.591 | 2,5816x |
| 388 | 45.610,4 | 8.905.201,4 | 2,5856x |
| 389 | 45.727,5 | 8.950.928,9 | 2,5896x |
| 390 | 45.844,6 | 8.996.773,5 | 2,5936x |
| 391 | 45.961,7 | 9.042.735,2 | 2,5975x |
| 392 | 46.078,8 | 9.088.814 | 2,6015x |
| 393 | 46.195,9 | 9.135.009,9 | 2,6055x |
| 394 | 46.313 | 9.181.322,9 | 2,6094x |
| 395 | 46.430,1 | 9.227.753 | 2,6134x |
| 396 | 46.547,2 | 9.274.300,2 | 2,6174x |
| 397 | 46.664,3 | 9.320.964,5 | 2,6213x |
| 398 | 46.781,4 | 9.367.745,9 | 2,6253x |
| 399 | 46.898,5 | 9.414.644,4 | 2,6293x |
| 400 | 47.015,6 | 9.461.660 | 2,6332x |
| 401 | 47.132,7 | 9.508.792,7 | 2,6372x |
| 402 | 47.249,8 | 9.556.042,5 | 2,6412x |
| 403 | 47.366,9 | 9.603.409,4 | 2,6451x |
| 404 | 47.484 | 9.650.893,4 | 2,6491x |
| 405 | 47.601,1 | 9.698.494,5 | 2,6531x |
| 406 | 47.718,2 | 9.746.212,7 | 2,6570x |
| 407 | 47.835,3 | 9.794.048 | 2,6610x |
| 408 | 47.952,4 | 9.842.000,4 | 2,6650x |
| 409 | 48.069,5 | 9.890.069,9 | 2,6689x |
| 410 | 48.186,6 | 9.938.256,5 | 2,6729x |
| 411 | 48.303,7 | 9.986.560,2 | 2,6769x |
| 412 | 48.420,8 | 10.034.981 | 2,6808x |
| 413 | 48.537,9 | 10.083.518,9 | 2,6848x |
| 414 | 48.655 | 10.132.173,9 | 2,6888x |
| 415 | 48.772,1 | 10.180.946 | 2,6928x |
| 416 | 48.889,2 | 10.229.835,2 | 2,6967x |
| 417 | 49.006,3 | 10.278.841,5 | 2,7007x |
| 418 | 49.123,4 | 10.327.964,9 | 2,7047x |
| 419 | 49.240,5 | 10.377.205,4 | 2,7086x |
| 420 | 49.357,6 | 10.426.563 | 2,7126x |
| 421 | 49.474,7 | 10.476.037,7 | 2,7166x |
| 422 | 49.591,8 | 10.525.629,5 | 2,7205x |
| 423 | 49.708,9 | 10.575.338,4 | 2,7245x |
| 424 | 49.826 | 10.625.164,4 | 2,7285x |
| 425 | 49.943,1 | 10.675.107,5 | 2,7324x |
| 426 | 50.060,2 | 10.725.167,7 | 2,7364x |
| 427 | 50.177,3 | 10.775.345 | 2,7404x |
| 428 | 50.294,4 | 10.825.639,4 | 2,7443x |
| 429 | 50.411,5 | 10.876.050,9 | 2,7483x |
| 430 | 50.528,6 | 10.926.579,5 | 2,7523x |
| 431 | 50.645,7 | 10.977.225,2 | 2,7562x |
| 432 | 50.762,8 | 11.027.988 | 2,7602x |
| 433 | 50.879,9 | 11.078.867,9 | 2,7642x |
| 434 | 50.997 | 11.129.864,9 | 2,7681x |
| 435 | 51.114,1 | 11.180.979 | 2,7721x |
| 436 | 51.231,2 | 11.232.210,2 | 2,7761x |
| 437 | 51.348,3 | 11.283.558,5 | 2,7800x |
| 438 | 51.465,4 | 11.335.023,9 | 2,7840x |
| 439 | 51.582,5 | 11.386.606,4 | 2,7880x |
| 440 | 51.699,6 | 11.438.306 | 2,7920x |
| 441 | 51.816,7 | 11.490.122,7 | 2,7959x |
| 442 | 51.933,8 | 11.542.056,5 | 2,7999x |
| 443 | 52.050,9 | 11.594.107,4 | 2,8039x |
| 444 | 52.168 | 11.646.275,4 | 2,8078x |
| 445 | 52.285,1 | 11.698.560,5 | 2,8118x |
| 446 | 52.402,2 | 11.750.962,7 | 2,8158x |
| 447 | 52.519,3 | 11.803.482 | 2,8197x |
| 448 | 52.636,4 | 11.856.118,4 | 2,8237x |
| 449 | 52.753,5 | 11.908.871,9 | 2,8277x |
| 450 | 52.870,6 | 11.961.742,5 | 2,8316x |
| 451 | 52.987,7 | 12.014.730,2 | 2,8356x |
| 452 | 53.104,8 | 12.067.835 | 2,8396x |
| 453 | 53.221,9 | 12.121.056,9 | 2,8435x |
| 454 | 53.339 | 12.174.395,9 | 2,8475x |
| 455 | 53.456,1 | 12.227.852 | 2,8515x |
| 456 | 53.573,2 | 12.281.425,2 | 2,8554x |
| 457 | 53.690,3 | 12.335.115,5 | 2,8594x |
| 458 | 53.807,4 | 12.388.922,9 | 2,8634x |
| 459 | 53.924,5 | 12.442.847,4 | 2,8673x |
| 460 | 54.041,6 | 12.496.889 | 2,8713x |
| 461 | 54.158,7 | 12.551.047,7 | 2,8753x |
| 462 | 54.275,8 | 12.605.323,5 | 2,8792x |
| 463 | 54.392,9 | 12.659.716,4 | 2,8832x |
| 464 | 54.510 | 12.714.226,4 | 2,8872x |
| 465 | 54.627,1 | 12.768.853,5 | 2,8912x |
| 466 | 54.744,2 | 12.823.597,7 | 2,8951x |
| 467 | 54.861,3 | 12.878.459 | 2,8991x |
| 468 | 54.978,4 | 12.933.437,4 | 2,9031x |
| 469 | 55.095,5 | 12.988.532,9 | 2,9070x |
| 470 | 55.212,6 | 13.043.745,5 | 2,9110x |
| 471 | 55.329,7 | 13.099.075,2 | 2,9150x |
| 472 | 55.446,8 | 13.154.522 | 2,9189x |
| 473 | 55.563,9 | 13.210.085,9 | 2,9229x |
| 474 | 55.681 | 13.265.766,9 | 2,9269x |
| 475 | 55.798,1 | 13.321.565 | 2,9308x |
| 476 | 55.915,2 | 13.377.480,2 | 2,9348x |
| 477 | 56.032,3 | 13.433.512,5 | 2,9388x |
| 478 | 56.149,4 | 13.489.661,9 | 2,9427x |
| 479 | 56.266,5 | 13.545.928,4 | 2,9467x |
| 480 | 56.383,6 | 13.602.312 | 2,9507x |
| 481 | 56.500,7 | 13.658.812,7 | 2,9546x |
| 482 | 56.617,8 | 13.715.430,5 | 2,9586x |
| 483 | 56.734,9 | 13.772.165,4 | 2,9626x |
| 484 | 56.852 | 13.829.017,4 | 2,9665x |
| 485 | 56.969,1 | 13.885.986,5 | 2,9705x |
| 486 | 57.086,2 | 13.943.072,7 | 2,9745x |
| 487 | 57.203,3 | 14.000.276 | 2,9784x |
| 488 | 57.320,4 | 14.057.596,4 | 2,9824x |
| 489 | 57.437,5 | 14.115.033,9 | 2,9864x |
| 490 | 57.554,6 | 14.172.588,5 | 2,9904x |
| 491 | 57.671,7 | 14.230.260,2 | 2,9943x |
| 492 | 57.788,8 | 14.288.049 | 2,9983x |
| 493 | 57.905,9 | 14.345.954,9 | 3,0023x |
| 494 | 58.023 | 14.403.977,9 | 3,0062x |
| 495 | 58.140,1 | 14.462.118 | 3,0102x |
| 496 | 58.257,2 | 14.520.375,2 | 3,0142x |
| 497 | 58.374,3 | 14.578.749,5 | 3,0181x |
| 498 | 58.491,4 | 14.637.240,9 | 3,0221x |
| 499 | 58.608,5 | 14.695.849,4 | 3,0261x |
| 500 | 58.725,6 | 14.754.575 | 3,0300x |

### Anexo — Agilidade

| Nível | Custo do nível | Custo acumulado | Efeito |
|---:|---:|---:|---|
| 1 | 780,6 | 780,6 | Speed I |
| 2 | 1.561,2 | 2.341,8 | Speed II |

### Anexo — Cataclismo

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 975,8 | 975,8 | 0,1535% | 0,1535% |
| 2 | 1.366,1 | 2.341,9 | 0,3070% | 0,307% |
| 3 | 1.756,4 | 4.098,3 | 0,4605% | 0,4605% |
| 4 | 2.146,7 | 6.245 | 0,6140% | 0,614% |
| 5 | 2.537 | 8.782 | 0,7675% | 0,7675% |
| 6 | 2.927,3 | 11.709,3 | 0,9210% | 0,921% |
| 7 | 3.317,6 | 15.026,9 | 1,0745% | 1,075% |
| 8 | 3.707,9 | 18.734,8 | 1,2280% | 1,228% |
| 9 | 4.098,2 | 22.833 | 1,3815% | 1,382% |
| 10 | 4.488,5 | 27.321,5 | 1,5350% | 1,535% |
| 11 | 4.878,8 | 32.200,3 | 1,6885% | 1,689% |
| 12 | 5.269,1 | 37.469,4 | 1,8420% | 1,842% |
| 13 | 5.659,4 | 43.128,8 | 1,9955% | 1,996% |
| 14 | 6.049,7 | 49.178,5 | 2,1490% | 2,149% |
| 15 | 6.440 | 55.618,5 | 2,3025% | 2,303% |
| 16 | 6.830,3 | 62.448,8 | 2,4560% | 2,456% |
| 17 | 7.220,6 | 69.669,4 | 2,6095% | 2,61% |
| 18 | 7.610,9 | 77.280,3 | 2,7630% | 2,763% |
| 19 | 8.001,2 | 85.281,5 | 2,9165% | 2,917% |
| 20 | 8.391,5 | 93.673 | 3,0700% | 3,07% |
| 21 | 8.781,8 | 102.454,8 | 3,2235% | 3,224% |
| 22 | 9.172,1 | 111.626,9 | 3,3770% | 3,377% |
| 23 | 9.562,4 | 121.189,3 | 3,5305% | 3,531% |
| 24 | 9.952,7 | 131.142 | 3,6840% | 3,684% |
| 25 | 10.343 | 141.485 | 3,8375% | 3,838% |
| 26 | 10.733,3 | 152.218,3 | 3,9910% | 3,991% |
| 27 | 11.123,6 | 163.341,9 | 4,1445% | 4,145% |
| 28 | 11.513,9 | 174.855,8 | 4,2980% | 4,298% |
| 29 | 11.904,2 | 186.760 | 4,4515% | 4,452% |
| 30 | 12.294,5 | 199.054,5 | 4,6050% | 4,605% |
| 31 | 12.684,8 | 211.739,3 | 4,7585% | 4,759% |
| 32 | 13.075,1 | 224.814,4 | 4,9120% | 4,912% |
| 33 | 13.465,4 | 238.279,8 | 5,0655% | 5,066% |
| 34 | 13.855,7 | 252.135,5 | 5,2190% | 5,219% |
| 35 | 14.246 | 266.381,5 | 5,3725% | 5,373% |
| 36 | 14.636,3 | 281.017,8 | 5,5260% | 5,526% |
| 37 | 15.026,6 | 296.044,4 | 5,6795% | 5,68% |
| 38 | 15.416,9 | 311.461,3 | 5,8330% | 5,833% |
| 39 | 15.807,2 | 327.268,5 | 5,9865% | 5,987% |
| 40 | 16.197,5 | 343.466 | 6,1400% | 6,14% |
| 41 | 16.587,8 | 360.053,8 | 6,2935% | 6,294% |
| 42 | 16.978,1 | 377.031,9 | 6,4470% | 6,447% |
| 43 | 17.368,4 | 394.400,3 | 6,6005% | 6,601% |
| 44 | 17.758,7 | 412.159 | 6,7540% | 6,754% |
| 45 | 18.149 | 430.308 | 6,9075% | 6,908% |
| 46 | 18.539,3 | 448.847,3 | 7,0610% | 7,061% |
| 47 | 18.929,6 | 467.776,9 | 7,2145% | 7,215% |
| 48 | 19.319,9 | 487.096,8 | 7,3680% | 7,368% |
| 49 | 19.710,2 | 506.807 | 7,5215% | 7,522% |
| 50 | 20.100,5 | 526.907,5 | 7,6750% | 7,675% |
| 51 | 20.490,8 | 547.398,3 | 7,8285% | 7,829% |
| 52 | 20.881,1 | 568.279,4 | 7,9820% | 7,982% |
| 53 | 21.271,4 | 589.550,8 | 8,1355% | 8,136% |
| 54 | 21.661,7 | 611.212,5 | 8,2890% | 8,289% |
| 55 | 22.052 | 633.264,5 | 8,4425% | 8,442% |
| 56 | 22.442,3 | 655.706,8 | 8,5960% | 8,596% |
| 57 | 22.832,6 | 678.539,4 | 8,7495% | 8,75% |
| 58 | 23.222,9 | 701.762,3 | 8,9030% | 8,903% |
| 59 | 23.613,2 | 725.375,5 | 9,0565% | 9,057% |
| 60 | 24.003,5 | 749.379 | 9,2100% | 9,21% |
| 61 | 24.393,8 | 773.772,8 | 9,3635% | 9,363% |
| 62 | 24.784,1 | 798.556,9 | 9,5170% | 9,517% |
| 63 | 25.174,4 | 823.731,3 | 9,6705% | 9,67% |
| 64 | 25.564,7 | 849.296 | 9,8240% | 9,824% |
| 65 | 25.955 | 875.251 | 9,9775% | 9,978% |
| 66 | 26.345,3 | 901.596,3 | 10,1310% | 10,13% |
| 67 | 26.735,6 | 928.331,9 | 10,2845% | 10,28% |
| 68 | 27.125,9 | 955.457,8 | 10,4380% | 10,44% |
| 69 | 27.516,2 | 982.974 | 10,5915% | 10,59% |
| 70 | 27.906,5 | 1.010.880,5 | 10,7450% | 10,75% |
| 71 | 28.296,8 | 1.039.177,3 | 10,8985% | 10,9% |
| 72 | 28.687,1 | 1.067.864,4 | 11,0520% | 11,05% |
| 73 | 29.077,4 | 1.096.941,8 | 11,2055% | 11,21% |
| 74 | 29.467,7 | 1.126.409,5 | 11,3590% | 11,36% |
| 75 | 29.858 | 1.156.267,5 | 11,5125% | 11,51% |
| 76 | 30.248,3 | 1.186.515,8 | 11,6660% | 11,67% |
| 77 | 30.638,6 | 1.217.154,4 | 11,8195% | 11,82% |
| 78 | 31.028,9 | 1.248.183,3 | 11,9730% | 11,97% |
| 79 | 31.419,2 | 1.279.602,5 | 12,1265% | 12,13% |
| 80 | 31.809,5 | 1.311.412 | 12,2800% | 12,28% |
| 81 | 32.199,8 | 1.343.611,8 | 12,4335% | 12,43% |
| 82 | 32.590,1 | 1.376.201,9 | 12,5870% | 12,59% |
| 83 | 32.980,4 | 1.409.182,3 | 12,7405% | 12,74% |
| 84 | 33.370,7 | 1.442.553 | 12,8940% | 12,89% |
| 85 | 33.761 | 1.476.314 | 13,0475% | 13,05% |
| 86 | 34.151,3 | 1.510.465,3 | 13,2010% | 13,2% |
| 87 | 34.541,6 | 1.545.006,9 | 13,3545% | 13,35% |
| 88 | 34.931,9 | 1.579.938,8 | 13,5080% | 13,51% |
| 89 | 35.322,2 | 1.615.261 | 13,6615% | 13,66% |
| 90 | 35.712,5 | 1.650.973,5 | 13,8150% | 13,82% |
| 91 | 36.102,8 | 1.687.076,3 | 13,9685% | 13,97% |
| 92 | 36.493,1 | 1.723.569,4 | 14,1220% | 14,12% |
| 93 | 36.883,4 | 1.760.452,8 | 14,2755% | 14,28% |
| 94 | 37.273,7 | 1.797.726,5 | 14,4290% | 14,43% |
| 95 | 37.664 | 1.835.390,5 | 14,5825% | 14,58% |
| 96 | 38.054,3 | 1.873.444,8 | 14,7360% | 14,74% |
| 97 | 38.444,6 | 1.911.889,4 | 14,8895% | 14,89% |
| 98 | 38.834,9 | 1.950.724,3 | 15,0430% | 15,04% |
| 99 | 39.225,2 | 1.989.949,5 | 15,1965% | 15,2% |
| 100 | 39.615,5 | 2.029.565 | 15,3500% | 15,35% |
| 101 | 40.005,8 | 2.069.570,8 | 15,5035% | 15,5% |
| 102 | 40.396,1 | 2.109.966,9 | 15,6570% | 15,66% |
| 103 | 40.786,4 | 2.150.753,3 | 15,8105% | 15,81% |
| 104 | 41.176,7 | 2.191.930 | 15,9640% | 15,96% |
| 105 | 41.567 | 2.233.497 | 16,1175% | 16,12% |
| 106 | 41.957,3 | 2.275.454,3 | 16,2710% | 16,27% |
| 107 | 42.347,6 | 2.317.801,9 | 16,4245% | 16,42% |
| 108 | 42.737,9 | 2.360.539,8 | 16,5780% | 16,58% |
| 109 | 43.128,2 | 2.403.668 | 16,7315% | 16,73% |
| 110 | 43.518,5 | 2.447.186,5 | 16,8850% | 16,89% |
| 111 | 43.908,8 | 2.491.095,3 | 17,0385% | 17,04% |
| 112 | 44.299,1 | 2.535.394,4 | 17,1920% | 17,19% |
| 113 | 44.689,4 | 2.580.083,8 | 17,3455% | 17,35% |
| 114 | 45.079,7 | 2.625.163,5 | 17,4990% | 17,5% |
| 115 | 45.470 | 2.670.633,5 | 17,6525% | 17,65% |
| 116 | 45.860,3 | 2.716.493,8 | 17,8060% | 17,81% |
| 117 | 46.250,6 | 2.762.744,4 | 17,9595% | 17,96% |
| 118 | 46.640,9 | 2.809.385,3 | 18,1130% | 18,11% |
| 119 | 47.031,2 | 2.856.416,5 | 18,2665% | 18,27% |
| 120 | 47.421,5 | 2.903.838 | 18,4200% | 18,42% |
| 121 | 47.811,8 | 2.951.649,8 | 18,5735% | 18,57% |
| 122 | 48.202,1 | 2.999.851,9 | 18,7270% | 18,73% |
| 123 | 48.592,4 | 3.048.444,3 | 18,8805% | 18,88% |
| 124 | 48.982,7 | 3.097.427 | 19,0340% | 19,03% |
| 125 | 49.373 | 3.146.800 | 19,1875% | 19,19% |
| 126 | 49.763,3 | 3.196.563,3 | 19,3410% | 19,34% |
| 127 | 50.153,6 | 3.246.716,9 | 19,4945% | 19,49% |
| 128 | 50.543,9 | 3.297.260,8 | 19,6480% | 19,65% |
| 129 | 50.934,2 | 3.348.195 | 19,8015% | 19,8% |
| 130 | 51.324,5 | 3.399.519,5 | 19,9550% | 19,96% |
| 131 | 51.714,8 | 3.451.234,3 | 20,1085% | 20,11% |
| 132 | 52.105,1 | 3.503.339,4 | 20,2620% | 20,26% |
| 133 | 52.495,4 | 3.555.834,8 | 20,4155% | 20,42% |
| 134 | 52.885,7 | 3.608.720,5 | 20,5690% | 20,57% |
| 135 | 53.276 | 3.661.996,5 | 20,7225% | 20,72% |
| 136 | 53.666,3 | 3.715.662,8 | 20,8760% | 20,88% |
| 137 | 54.056,6 | 3.769.719,4 | 21,0295% | 21,03% |
| 138 | 54.446,9 | 3.824.166,3 | 21,1830% | 21,18% |
| 139 | 54.837,2 | 3.879.003,5 | 21,3365% | 21,34% |
| 140 | 55.227,5 | 3.934.231 | 21,4900% | 21,49% |
| 141 | 55.617,8 | 3.989.848,8 | 21,6435% | 21,64% |
| 142 | 56.008,1 | 4.045.856,9 | 21,7970% | 21,8% |
| 143 | 56.398,4 | 4.102.255,3 | 21,9505% | 21,95% |
| 144 | 56.788,7 | 4.159.044 | 22,1040% | 22,1% |
| 145 | 57.179 | 4.216.223 | 22,2575% | 22,26% |
| 146 | 57.569,3 | 4.273.792,3 | 22,4110% | 22,41% |
| 147 | 57.959,6 | 4.331.751,9 | 22,5645% | 22,56% |
| 148 | 58.349,9 | 4.390.101,8 | 22,7180% | 22,72% |
| 149 | 58.740,2 | 4.448.842 | 22,8715% | 22,87% |
| 150 | 59.130,5 | 4.507.972,5 | 23,0250% | 23,03% |
| 151 | 59.520,8 | 4.567.493,3 | 23,1785% | 23,18% |
| 152 | 59.911,1 | 4.627.404,4 | 23,3320% | 23,33% |
| 153 | 60.301,4 | 4.687.705,8 | 23,4855% | 23,49% |
| 154 | 60.691,7 | 4.748.397,5 | 23,6390% | 23,64% |
| 155 | 61.082 | 4.809.479,5 | 23,7925% | 23,79% |
| 156 | 61.472,3 | 4.870.951,8 | 23,9460% | 23,95% |
| 157 | 61.862,6 | 4.932.814,4 | 24,0995% | 24,1% |
| 158 | 62.252,9 | 4.995.067,3 | 24,2530% | 24,25% |
| 159 | 62.643,2 | 5.057.710,5 | 24,4065% | 24,41% |
| 160 | 63.033,5 | 5.120.744 | 24,5600% | 24,56% |
| 161 | 63.423,8 | 5.184.167,8 | 24,7135% | 24,71% |
| 162 | 63.814,1 | 5.247.981,9 | 24,8670% | 24,87% |
| 163 | 64.204,4 | 5.312.186,3 | 25,0205% | 25,02% |
| 164 | 64.594,7 | 5.376.781 | 25,1740% | 25,17% |
| 165 | 64.985 | 5.441.766 | 25,3275% | 25,33% |
| 166 | 65.375,3 | 5.507.141,3 | 25,4810% | 25,48% |
| 167 | 65.765,6 | 5.572.906,9 | 25,6345% | 25,63% |
| 168 | 66.155,9 | 5.639.062,8 | 25,7880% | 25,79% |
| 169 | 66.546,2 | 5.705.609 | 25,9415% | 25,94% |
| 170 | 66.936,5 | 5.772.545,5 | 26,0950% | 26,1% |
| 171 | 67.326,8 | 5.839.872,3 | 26,2485% | 26,25% |
| 172 | 67.717,1 | 5.907.589,4 | 26,4020% | 26,4% |
| 173 | 68.107,4 | 5.975.696,8 | 26,5555% | 26,56% |
| 174 | 68.497,7 | 6.044.194,5 | 26,7090% | 26,71% |
| 175 | 68.888 | 6.113.082,5 | 26,8625% | 26,86% |
| 176 | 69.278,3 | 6.182.360,8 | 27,0160% | 27,02% |
| 177 | 69.668,6 | 6.252.029,4 | 27,1695% | 27,17% |
| 178 | 70.058,9 | 6.322.088,3 | 27,3230% | 27,32% |
| 179 | 70.449,2 | 6.392.537,5 | 27,4765% | 27,48% |
| 180 | 70.839,5 | 6.463.377 | 27,6300% | 27,63% |
| 181 | 71.229,8 | 6.534.606,8 | 27,7835% | 27,78% |
| 182 | 71.620,1 | 6.606.226,9 | 27,9370% | 27,94% |
| 183 | 72.010,4 | 6.678.237,3 | 28,0905% | 28,09% |
| 184 | 72.400,7 | 6.750.638 | 28,2440% | 28,24% |
| 185 | 72.791 | 6.823.429 | 28,3975% | 28,4% |
| 186 | 73.181,3 | 6.896.610,3 | 28,5510% | 28,55% |
| 187 | 73.571,6 | 6.970.181,9 | 28,7045% | 28,7% |
| 188 | 73.961,9 | 7.044.143,8 | 28,8580% | 28,86% |
| 189 | 74.352,2 | 7.118.496 | 29,0115% | 29,01% |
| 190 | 74.742,5 | 7.193.238,5 | 29,1650% | 29,17% |
| 191 | 75.132,8 | 7.268.371,3 | 29,3185% | 29,32% |
| 192 | 75.523,1 | 7.343.894,4 | 29,4720% | 29,47% |
| 193 | 75.913,4 | 7.419.807,8 | 29,6255% | 29,63% |
| 194 | 76.303,7 | 7.496.111,5 | 29,7790% | 29,78% |
| 195 | 76.694 | 7.572.805,5 | 29,9325% | 29,93% |
| 196 | 77.084,3 | 7.649.889,8 | 30,0860% | 30,09% |
| 197 | 77.474,6 | 7.727.364,4 | 30,2395% | 30,24% |
| 198 | 77.864,9 | 7.805.229,3 | 30,3930% | 30,39% |
| 199 | 78.255,2 | 7.883.484,5 | 30,5465% | 30,55% |
| 200 | 78.645,5 | 7.962.130 | 30,7000% | 30,7% |
| 201 | 79.035,8 | 8.041.165,8 | 30,8535% | 30,85% |
| 202 | 79.426,1 | 8.120.591,9 | 31,0070% | 31,01% |
| 203 | 79.816,4 | 8.200.408,3 | 31,1605% | 31,16% |
| 204 | 80.206,7 | 8.280.615 | 31,3140% | 31,31% |
| 205 | 80.597 | 8.361.212 | 31,4675% | 31,47% |
| 206 | 80.987,3 | 8.442.199,3 | 31,6210% | 31,62% |
| 207 | 81.377,6 | 8.523.576,9 | 31,7745% | 31,77% |
| 208 | 81.767,9 | 8.605.344,8 | 31,9280% | 31,93% |
| 209 | 82.158,2 | 8.687.503 | 32,0815% | 32,08% |
| 210 | 82.548,5 | 8.770.051,5 | 32,2350% | 32,24% |
| 211 | 82.938,8 | 8.852.990,3 | 32,3885% | 32,39% |
| 212 | 83.329,1 | 8.936.319,4 | 32,5420% | 32,54% |
| 213 | 83.719,4 | 9.020.038,8 | 32,6955% | 32,7% |
| 214 | 84.109,7 | 9.104.148,5 | 32,8490% | 32,85% |
| 215 | 84.500 | 9.188.648,5 | 33,0025% | 33% |
| 216 | 84.890,3 | 9.273.538,8 | 33,1560% | 33,16% |
| 217 | 85.280,6 | 9.358.819,4 | 33,3095% | 33,31% |
| 218 | 85.670,9 | 9.444.490,3 | 33,4630% | 33,46% |
| 219 | 86.061,2 | 9.530.551,5 | 33,6165% | 33,62% |
| 220 | 86.451,5 | 9.617.003 | 33,7700% | 33,77% |
| 221 | 86.841,8 | 9.703.844,8 | 33,9235% | 33,92% |
| 222 | 87.232,1 | 9.791.076,9 | 34,0770% | 34,08% |
| 223 | 87.622,4 | 9.878.699,3 | 34,2305% | 34,23% |
| 224 | 88.012,7 | 9.966.712 | 34,3840% | 34,38% |
| 225 | 88.403 | 10.055.115 | 34,5375% | 34,54% |
| 226 | 88.793,3 | 10.143.908,3 | 34,6910% | 34,69% |
| 227 | 89.183,6 | 10.233.091,9 | 34,8445% | 34,84% |
| 228 | 89.573,9 | 10.322.665,8 | 34,9980% | 35% |
| 229 | 89.964,2 | 10.412.630 | 35,1515% | 35,15% |
| 230 | 90.354,5 | 10.502.984,5 | 35,3050% | 35,31% |
| 231 | 90.744,8 | 10.593.729,3 | 35,4585% | 35,46% |
| 232 | 91.135,1 | 10.684.864,4 | 35,6120% | 35,61% |
| 233 | 91.525,4 | 10.776.389,8 | 35,7655% | 35,77% |
| 234 | 91.915,7 | 10.868.305,5 | 35,9190% | 35,92% |
| 235 | 92.306 | 10.960.611,5 | 36,0725% | 36,07% |
| 236 | 92.696,3 | 11.053.307,8 | 36,2260% | 36,23% |
| 237 | 93.086,6 | 11.146.394,4 | 36,3795% | 36,38% |
| 238 | 93.476,9 | 11.239.871,3 | 36,5330% | 36,53% |
| 239 | 93.867,2 | 11.333.738,5 | 36,6865% | 36,69% |
| 240 | 94.257,5 | 11.427.996 | 36,8400% | 36,84% |
| 241 | 94.647,8 | 11.522.643,8 | 36,9935% | 36,99% |
| 242 | 95.038,1 | 11.617.681,9 | 37,1470% | 37,15% |
| 243 | 95.428,4 | 11.713.110,3 | 37,3005% | 37,3% |
| 244 | 95.818,7 | 11.808.929 | 37,4540% | 37,45% |
| 245 | 96.209 | 11.905.138 | 37,6075% | 37,61% |
| 246 | 96.599,3 | 12.001.737,3 | 37,7610% | 37,76% |
| 247 | 96.989,6 | 12.098.726,9 | 37,9145% | 37,91% |
| 248 | 97.379,9 | 12.196.106,8 | 38,0680% | 38,07% |
| 249 | 97.770,2 | 12.293.877 | 38,2215% | 38,22% |
| 250 | 98.160,5 | 12.392.037,5 | 38,3750% | 38,38% |
| 251 | 98.550,8 | 12.490.588,3 | 38,5285% | 38,53% |
| 252 | 98.941,1 | 12.589.529,4 | 38,6820% | 38,68% |
| 253 | 99.331,4 | 12.688.860,8 | 38,8355% | 38,84% |
| 254 | 99.721,7 | 12.788.582,5 | 38,9890% | 38,99% |
| 255 | 100.112 | 12.888.694,5 | 39,1425% | 39,14% |
| 256 | 100.502,3 | 12.989.196,8 | 39,2960% | 39,3% |
| 257 | 100.892,6 | 13.090.089,4 | 39,4495% | 39,45% |
| 258 | 101.282,9 | 13.191.372,3 | 39,6030% | 39,6% |
| 259 | 101.673,2 | 13.293.045,5 | 39,7565% | 39,76% |
| 260 | 102.063,5 | 13.395.109 | 39,9100% | 39,91% |
| 261 | 102.453,8 | 13.497.562,8 | 40,0635% | 40,06% |
| 262 | 102.844,1 | 13.600.406,9 | 40,2170% | 40,22% |
| 263 | 103.234,4 | 13.703.641,3 | 40,3705% | 40,37% |
| 264 | 103.624,7 | 13.807.266 | 40,5240% | 40,52% |
| 265 | 104.015 | 13.911.281 | 40,6775% | 40,68% |
| 266 | 104.405,3 | 14.015.686,3 | 40,8310% | 40,83% |
| 267 | 104.795,6 | 14.120.481,9 | 40,9845% | 40,98% |
| 268 | 105.185,9 | 14.225.667,8 | 41,1380% | 41,14% |
| 269 | 105.576,2 | 14.331.244 | 41,2915% | 41,29% |
| 270 | 105.966,5 | 14.437.210,5 | 41,4450% | 41,45% |
| 271 | 106.356,8 | 14.543.567,3 | 41,5985% | 41,6% |
| 272 | 106.747,1 | 14.650.314,4 | 41,7520% | 41,75% |
| 273 | 107.137,4 | 14.757.451,8 | 41,9055% | 41,91% |
| 274 | 107.527,7 | 14.864.979,5 | 42,0590% | 42,06% |
| 275 | 107.918 | 14.972.897,5 | 42,2125% | 42,21% |
| 276 | 108.308,3 | 15.081.205,8 | 42,3660% | 42,37% |
| 277 | 108.698,6 | 15.189.904,4 | 42,5195% | 42,52% |
| 278 | 109.088,9 | 15.298.993,3 | 42,6730% | 42,67% |
| 279 | 109.479,2 | 15.408.472,5 | 42,8265% | 42,83% |
| 280 | 109.869,5 | 15.518.342 | 42,9800% | 42,98% |
| 281 | 110.259,8 | 15.628.601,8 | 43,1335% | 43,13% |
| 282 | 110.650,1 | 15.739.251,9 | 43,2870% | 43,29% |
| 283 | 111.040,4 | 15.850.292,3 | 43,4405% | 43,44% |
| 284 | 111.430,7 | 15.961.723 | 43,5940% | 43,59% |
| 285 | 111.821 | 16.073.544 | 43,7475% | 43,75% |
| 286 | 112.211,3 | 16.185.755,3 | 43,9010% | 43,9% |
| 287 | 112.601,6 | 16.298.356,9 | 44,0545% | 44,05% |
| 288 | 112.991,9 | 16.411.348,8 | 44,2080% | 44,21% |
| 289 | 113.382,2 | 16.524.731 | 44,3615% | 44,36% |
| 290 | 113.772,5 | 16.638.503,5 | 44,5150% | 44,52% |
| 291 | 114.162,8 | 16.752.666,3 | 44,6685% | 44,67% |
| 292 | 114.553,1 | 16.867.219,4 | 44,8220% | 44,82% |
| 293 | 114.943,4 | 16.982.162,8 | 44,9755% | 44,98% |
| 294 | 115.333,7 | 17.097.496,5 | 45,1290% | 45,13% |
| 295 | 115.724 | 17.213.220,5 | 45,2825% | 45,28% |
| 296 | 116.114,3 | 17.329.334,8 | 45,4360% | 45,44% |
| 297 | 116.504,6 | 17.445.839,4 | 45,5895% | 45,59% |
| 298 | 116.894,9 | 17.562.734,3 | 45,7430% | 45,74% |
| 299 | 117.285,2 | 17.680.019,5 | 45,8965% | 45,9% |
| 300 | 117.675,5 | 17.797.695 | 46,0500% | 46,05% |
| 301 | 118.065,8 | 17.915.760,8 | 46,2035% | 46,2% |
| 302 | 118.456,1 | 18.034.216,9 | 46,3570% | 46,36% |
| 303 | 118.846,4 | 18.153.063,3 | 46,5105% | 46,51% |
| 304 | 119.236,7 | 18.272.300 | 46,6640% | 46,66% |
| 305 | 119.627 | 18.391.927 | 46,8175% | 46,82% |
| 306 | 120.017,3 | 18.511.944,3 | 46,9710% | 46,97% |
| 307 | 120.407,6 | 18.632.351,9 | 47,1245% | 47,12% |
| 308 | 120.797,9 | 18.753.149,8 | 47,2780% | 47,28% |
| 309 | 121.188,2 | 18.874.338 | 47,4315% | 47,43% |
| 310 | 121.578,5 | 18.995.916,5 | 47,5850% | 47,59% |
| 311 | 121.968,8 | 19.117.885,3 | 47,7385% | 47,74% |
| 312 | 122.359,1 | 19.240.244,4 | 47,8920% | 47,89% |
| 313 | 122.749,4 | 19.362.993,8 | 48,0455% | 48,05% |
| 314 | 123.139,7 | 19.486.133,5 | 48,1990% | 48,2% |
| 315 | 123.530 | 19.609.663,5 | 48,3525% | 48,35% |
| 316 | 123.920,3 | 19.733.583,8 | 48,5060% | 48,51% |
| 317 | 124.310,6 | 19.857.894,4 | 48,6595% | 48,66% |
| 318 | 124.700,9 | 19.982.595,3 | 48,8130% | 48,81% |
| 319 | 125.091,2 | 20.107.686,5 | 48,9665% | 48,97% |
| 320 | 125.481,5 | 20.233.168 | 49,1200% | 49,12% |
| 321 | 125.871,8 | 20.359.039,8 | 49,2735% | 49,27% |
| 322 | 126.262,1 | 20.485.301,9 | 49,4270% | 49,43% |
| 323 | 126.652,4 | 20.611.954,3 | 49,5805% | 49,58% |
| 324 | 127.042,7 | 20.738.997 | 49,7340% | 49,73% |
| 325 | 127.433 | 20.866.430 | 49,8875% | 49,89% |
| 326 | 127.823,3 | 20.994.253,3 | 50,0410% | 50,04% |
| 327 | 128.213,6 | 21.122.466,9 | 50,1945% | 50,19% |
| 328 | 128.603,9 | 21.251.070,8 | 50,3480% | 50,35% |
| 329 | 128.994,2 | 21.380.065 | 50,5015% | 50,5% |
| 330 | 129.384,5 | 21.509.449,5 | 50,6550% | 50,66% |
| 331 | 129.774,8 | 21.639.224,3 | 50,8085% | 50,81% |
| 332 | 130.165,1 | 21.769.389,4 | 50,9620% | 50,96% |
| 333 | 130.555,4 | 21.899.944,8 | 51,1155% | 51,12% |
| 334 | 130.945,7 | 22.030.890,5 | 51,2690% | 51,27% |
| 335 | 131.336 | 22.162.226,5 | 51,4225% | 51,42% |
| 336 | 131.726,3 | 22.293.952,8 | 51,5760% | 51,58% |
| 337 | 132.116,6 | 22.426.069,4 | 51,7295% | 51,73% |
| 338 | 132.506,9 | 22.558.576,3 | 51,8830% | 51,88% |
| 339 | 132.897,2 | 22.691.473,5 | 52,0365% | 52,04% |
| 340 | 133.287,5 | 22.824.761 | 52,1900% | 52,19% |
| 341 | 133.677,8 | 22.958.438,8 | 52,3435% | 52,34% |
| 342 | 134.068,1 | 23.092.506,9 | 52,4970% | 52,5% |
| 343 | 134.458,4 | 23.226.965,3 | 52,6505% | 52,65% |
| 344 | 134.848,7 | 23.361.814 | 52,8040% | 52,8% |
| 345 | 135.239 | 23.497.053 | 52,9575% | 52,96% |
| 346 | 135.629,3 | 23.632.682,3 | 53,1110% | 53,11% |
| 347 | 136.019,6 | 23.768.701,9 | 53,2645% | 53,26% |
| 348 | 136.409,9 | 23.905.111,8 | 53,4180% | 53,42% |
| 349 | 136.800,2 | 24.041.912 | 53,5715% | 53,57% |
| 350 | 137.190,5 | 24.179.102,5 | 53,7250% | 53,73% |
| 351 | 137.580,8 | 24.316.683,3 | 53,8785% | 53,88% |
| 352 | 137.971,1 | 24.454.654,4 | 54,0320% | 54,03% |
| 353 | 138.361,4 | 24.593.015,8 | 54,1855% | 54,19% |
| 354 | 138.751,7 | 24.731.767,5 | 54,3390% | 54,34% |
| 355 | 139.142 | 24.870.909,5 | 54,4925% | 54,49% |
| 356 | 139.532,3 | 25.010.441,8 | 54,6460% | 54,65% |
| 357 | 139.922,6 | 25.150.364,4 | 54,7995% | 54,8% |
| 358 | 140.312,9 | 25.290.677,3 | 54,9530% | 54,95% |
| 359 | 140.703,2 | 25.431.380,5 | 55,1065% | 55,11% |
| 360 | 141.093,5 | 25.572.474 | 55,2600% | 55,26% |
| 361 | 141.483,8 | 25.713.957,8 | 55,4135% | 55,41% |
| 362 | 141.874,1 | 25.855.831,9 | 55,5670% | 55,57% |
| 363 | 142.264,4 | 25.998.096,3 | 55,7205% | 55,72% |
| 364 | 142.654,7 | 26.140.751 | 55,8740% | 55,87% |
| 365 | 143.045 | 26.283.796 | 56,0275% | 56,03% |
| 366 | 143.435,3 | 26.427.231,3 | 56,1810% | 56,18% |
| 367 | 143.825,6 | 26.571.056,9 | 56,3345% | 56,33% |
| 368 | 144.215,9 | 26.715.272,8 | 56,4880% | 56,49% |
| 369 | 144.606,2 | 26.859.879 | 56,6415% | 56,64% |
| 370 | 144.996,5 | 27.004.875,5 | 56,7950% | 56,8% |
| 371 | 145.386,8 | 27.150.262,3 | 56,9485% | 56,95% |
| 372 | 145.777,1 | 27.296.039,4 | 57,1020% | 57,1% |
| 373 | 146.167,4 | 27.442.206,8 | 57,2555% | 57,26% |
| 374 | 146.557,7 | 27.588.764,5 | 57,4090% | 57,41% |
| 375 | 146.948 | 27.735.712,5 | 57,5625% | 57,56% |
| 376 | 147.338,3 | 27.883.050,8 | 57,7160% | 57,72% |
| 377 | 147.728,6 | 28.030.779,4 | 57,8695% | 57,87% |
| 378 | 148.118,9 | 28.178.898,3 | 58,0230% | 58,02% |
| 379 | 148.509,2 | 28.327.407,5 | 58,1765% | 58,18% |
| 380 | 148.899,5 | 28.476.307 | 58,3300% | 58,33% |
| 381 | 149.289,8 | 28.625.596,8 | 58,4835% | 58,48% |
| 382 | 149.680,1 | 28.775.276,9 | 58,6370% | 58,64% |
| 383 | 150.070,4 | 28.925.347,3 | 58,7905% | 58,79% |
| 384 | 150.460,7 | 29.075.808 | 58,9440% | 58,94% |
| 385 | 150.851 | 29.226.659 | 59,0975% | 59,1% |
| 386 | 151.241,3 | 29.377.900,3 | 59,2510% | 59,25% |
| 387 | 151.631,6 | 29.529.531,9 | 59,4045% | 59,4% |
| 388 | 152.021,9 | 29.681.553,8 | 59,5580% | 59,56% |
| 389 | 152.412,2 | 29.833.966 | 59,7115% | 59,71% |
| 390 | 152.802,5 | 29.986.768,5 | 59,8650% | 59,87% |
| 391 | 153.192,8 | 30.139.961,3 | 60,0185% | 60,02% |
| 392 | 153.583,1 | 30.293.544,4 | 60,1720% | 60,17% |
| 393 | 153.973,4 | 30.447.517,8 | 60,3255% | 60,33% |
| 394 | 154.363,7 | 30.601.881,5 | 60,4790% | 60,48% |
| 395 | 154.754 | 30.756.635,5 | 60,6325% | 60,63% |
| 396 | 155.144,3 | 30.911.779,8 | 60,7860% | 60,79% |
| 397 | 155.534,6 | 31.067.314,4 | 60,9395% | 60,94% |
| 398 | 155.924,9 | 31.223.239,3 | 61,0930% | 61,09% |
| 399 | 156.315,2 | 31.379.554,5 | 61,2465% | 61,25% |
| 400 | 156.705,5 | 31.536.260 | 61,4000% | 61,4% |
| 401 | 157.095,8 | 31.693.355,8 | 61,5535% | 61,55% |
| 402 | 157.486,1 | 31.850.841,9 | 61,7070% | 61,71% |
| 403 | 157.876,4 | 32.008.718,3 | 61,8605% | 61,86% |
| 404 | 158.266,7 | 32.166.985 | 62,0140% | 62,01% |
| 405 | 158.657 | 32.325.642 | 62,1675% | 62,17% |
| 406 | 159.047,3 | 32.484.689,3 | 62,3210% | 62,32% |
| 407 | 159.437,6 | 32.644.126,9 | 62,4745% | 62,47% |
| 408 | 159.827,9 | 32.803.954,8 | 62,6280% | 62,63% |
| 409 | 160.218,2 | 32.964.173 | 62,7815% | 62,78% |
| 410 | 160.608,5 | 33.124.781,5 | 62,9350% | 62,94% |
| 411 | 160.998,8 | 33.285.780,3 | 63,0885% | 63,09% |
| 412 | 161.389,1 | 33.447.169,4 | 63,2420% | 63,24% |
| 413 | 161.779,4 | 33.608.948,8 | 63,3955% | 63,4% |
| 414 | 162.169,7 | 33.771.118,5 | 63,5490% | 63,55% |
| 415 | 162.560 | 33.933.678,5 | 63,7025% | 63,7% |
| 416 | 162.950,3 | 34.096.628,8 | 63,8560% | 63,86% |
| 417 | 163.340,6 | 34.259.969,4 | 64,0095% | 64,01% |
| 418 | 163.730,9 | 34.423.700,3 | 64,1630% | 64,16% |
| 419 | 164.121,2 | 34.587.821,5 | 64,3165% | 64,32% |
| 420 | 164.511,5 | 34.752.333 | 64,4700% | 64,47% |
| 421 | 164.901,8 | 34.917.234,8 | 64,6235% | 64,62% |
| 422 | 165.292,1 | 35.082.526,9 | 64,7770% | 64,78% |
| 423 | 165.682,4 | 35.248.209,3 | 64,9305% | 64,93% |
| 424 | 166.072,7 | 35.414.282 | 65,0840% | 65,08% |
| 425 | 166.463 | 35.580.745 | 65,2375% | 65,24% |
| 426 | 166.853,3 | 35.747.598,3 | 65,3910% | 65,39% |
| 427 | 167.243,6 | 35.914.841,9 | 65,5445% | 65,54% |
| 428 | 167.633,9 | 36.082.475,8 | 65,6980% | 65,7% |
| 429 | 168.024,2 | 36.250.500 | 65,8515% | 65,85% |
| 430 | 168.414,5 | 36.418.914,5 | 66,0050% | 66,01% |
| 431 | 168.804,8 | 36.587.719,3 | 66,1585% | 66,16% |
| 432 | 169.195,1 | 36.756.914,4 | 66,3120% | 66,31% |
| 433 | 169.585,4 | 36.926.499,8 | 66,4655% | 66,47% |
| 434 | 169.975,7 | 37.096.475,5 | 66,6190% | 66,62% |
| 435 | 170.366 | 37.266.841,5 | 66,7725% | 66,77% |
| 436 | 170.756,3 | 37.437.597,8 | 66,9260% | 66,93% |
| 437 | 171.146,6 | 37.608.744,4 | 67,0795% | 67,08% |
| 438 | 171.536,9 | 37.780.281,3 | 67,2330% | 67,23% |
| 439 | 171.927,2 | 37.952.208,5 | 67,3865% | 67,39% |
| 440 | 172.317,5 | 38.124.526 | 67,5400% | 67,54% |
| 441 | 172.707,8 | 38.297.233,8 | 67,6935% | 67,69% |
| 442 | 173.098,1 | 38.470.331,9 | 67,8470% | 67,85% |
| 443 | 173.488,4 | 38.643.820,3 | 68,0005% | 68% |
| 444 | 173.878,7 | 38.817.699 | 68,1540% | 68,15% |
| 445 | 174.269 | 38.991.968 | 68,3075% | 68,31% |
| 446 | 174.659,3 | 39.166.627,3 | 68,4610% | 68,46% |
| 447 | 175.049,6 | 39.341.676,9 | 68,6145% | 68,61% |
| 448 | 175.439,9 | 39.517.116,8 | 68,7680% | 68,77% |
| 449 | 175.830,2 | 39.692.947 | 68,9215% | 68,92% |
| 450 | 176.220,5 | 39.869.167,5 | 69,0750% | 69,07% |
| 451 | 176.610,8 | 40.045.778,3 | 69,2285% | 69,23% |
| 452 | 177.001,1 | 40.222.779,4 | 69,3820% | 69,38% |
| 453 | 177.391,4 | 40.400.170,8 | 69,5355% | 69,54% |
| 454 | 177.781,7 | 40.577.952,5 | 69,6890% | 69,69% |
| 455 | 178.172 | 40.756.124,5 | 69,8425% | 69,84% |
| 456 | 178.562,3 | 40.934.686,8 | 69,9960% | 70% |
| 457 | 178.952,6 | 41.113.639,4 | 70,1495% | 70,15% |
| 458 | 179.342,9 | 41.292.982,3 | 70,3030% | 70,3% |
| 459 | 179.733,2 | 41.472.715,5 | 70,4565% | 70,46% |
| 460 | 180.123,5 | 41.652.839 | 70,6100% | 70,61% |
| 461 | 180.513,8 | 41.833.352,8 | 70,7635% | 70,76% |
| 462 | 180.904,1 | 42.014.256,9 | 70,9170% | 70,92% |
| 463 | 181.294,4 | 42.195.551,3 | 71,0705% | 71,07% |
| 464 | 181.684,7 | 42.377.236 | 71,2240% | 71,22% |
| 465 | 182.075 | 42.559.311 | 71,3775% | 71,38% |
| 466 | 182.465,3 | 42.741.776,3 | 71,5310% | 71,53% |
| 467 | 182.855,6 | 42.924.631,9 | 71,6845% | 71,68% |
| 468 | 183.245,9 | 43.107.877,8 | 71,8380% | 71,84% |
| 469 | 183.636,2 | 43.291.514 | 71,9915% | 71,99% |
| 470 | 184.026,5 | 43.475.540,5 | 72,1450% | 72,15% |
| 471 | 184.416,8 | 43.659.957,3 | 72,2985% | 72,3% |
| 472 | 184.807,1 | 43.844.764,4 | 72,4520% | 72,45% |
| 473 | 185.197,4 | 44.029.961,8 | 72,6055% | 72,61% |
| 474 | 185.587,7 | 44.215.549,5 | 72,7590% | 72,76% |
| 475 | 185.978 | 44.401.527,5 | 72,9125% | 72,91% |
| 476 | 186.368,3 | 44.587.895,8 | 73,0660% | 73,07% |
| 477 | 186.758,6 | 44.774.654,4 | 73,2195% | 73,22% |
| 478 | 187.148,9 | 44.961.803,3 | 73,3730% | 73,37% |
| 479 | 187.539,2 | 45.149.342,5 | 73,5265% | 73,53% |
| 480 | 187.929,5 | 45.337.272 | 73,6800% | 73,68% |
| 481 | 188.319,8 | 45.525.591,8 | 73,8335% | 73,83% |
| 482 | 188.710,1 | 45.714.301,9 | 73,9870% | 73,99% |
| 483 | 189.100,4 | 45.903.402,3 | 74,1405% | 74,14% |
| 484 | 189.490,7 | 46.092.893 | 74,2940% | 74,29% |
| 485 | 189.881 | 46.282.774 | 74,4475% | 74,45% |
| 486 | 190.271,3 | 46.473.045,3 | 74,6010% | 74,6% |
| 487 | 190.661,6 | 46.663.706,9 | 74,7545% | 74,75% |
| 488 | 191.051,9 | 46.854.758,8 | 74,9080% | 74,91% |
| 489 | 191.442,2 | 47.046.201 | 75,0615% | 75,06% |
| 490 | 191.832,5 | 47.238.033,5 | 75,2150% | 75,21% |
| 491 | 192.222,8 | 47.430.256,3 | 75,3685% | 75,37% |
| 492 | 192.613,1 | 47.622.869,4 | 75,5220% | 75,52% |
| 493 | 193.003,4 | 47.815.872,8 | 75,6755% | 75,68% |
| 494 | 193.393,7 | 48.009.266,5 | 75,8290% | 75,83% |
| 495 | 193.784 | 48.203.050,5 | 75,9825% | 75,98% |
| 496 | 194.174,3 | 48.397.224,8 | 76,1360% | 76,14% |
| 497 | 194.564,6 | 48.591.789,4 | 76,2895% | 76,29% |
| 498 | 194.954,9 | 48.786.744,3 | 76,4430% | 76,44% |
| 499 | 195.345,2 | 48.982.089,5 | 76,5965% | 76,6% |
| 500 | 195.735,5 | 49.177.825 | 76,7500% | 76,75% |

### Anexo — Laser

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.561 | 1.561 | 0,1266% | 0,1266% |
| 2 | 2.146,5 | 3.707,5 | 0,2532% | 0,2532% |
| 3 | 2.732 | 6.439,5 | 0,3798% | 0,3798% |
| 4 | 3.317,5 | 9.757 | 0,5064% | 0,5064% |
| 5 | 3.903 | 13.660 | 0,6330% | 0,633% |
| 6 | 4.488,5 | 18.148,5 | 0,7596% | 0,7596% |
| 7 | 5.074 | 23.222,5 | 0,8862% | 0,8862% |
| 8 | 5.659,5 | 28.882 | 1,0128% | 1,013% |
| 9 | 6.245 | 35.127 | 1,1394% | 1,139% |
| 10 | 6.830,5 | 41.957,5 | 1,2660% | 1,266% |
| 11 | 7.416 | 49.373,5 | 1,3926% | 1,393% |
| 12 | 8.001,5 | 57.375 | 1,5192% | 1,519% |
| 13 | 8.587 | 65.962 | 1,6458% | 1,646% |
| 14 | 9.172,5 | 75.134,5 | 1,7724% | 1,772% |
| 15 | 9.758 | 84.892,5 | 1,8990% | 1,899% |
| 16 | 10.343,5 | 95.236 | 2,0256% | 2,026% |
| 17 | 10.929 | 106.165 | 2,1522% | 2,152% |
| 18 | 11.514,5 | 117.679,5 | 2,2788% | 2,279% |
| 19 | 12.100 | 129.779,5 | 2,4054% | 2,405% |
| 20 | 12.685,5 | 142.465 | 2,5320% | 2,532% |
| 21 | 13.271 | 155.736 | 2,6586% | 2,659% |
| 22 | 13.856,5 | 169.592,5 | 2,7852% | 2,785% |
| 23 | 14.442 | 184.034,5 | 2,9118% | 2,912% |
| 24 | 15.027,5 | 199.062 | 3,0384% | 3,038% |
| 25 | 15.613 | 214.675 | 3,1650% | 3,165% |
| 26 | 16.198,5 | 230.873,5 | 3,2916% | 3,292% |
| 27 | 16.784 | 247.657,5 | 3,4182% | 3,418% |
| 28 | 17.369,5 | 265.027 | 3,5448% | 3,545% |
| 29 | 17.955 | 282.982 | 3,6714% | 3,671% |
| 30 | 18.540,5 | 301.522,5 | 3,7980% | 3,798% |
| 31 | 19.126 | 320.648,5 | 3,9246% | 3,925% |
| 32 | 19.711,5 | 340.360 | 4,0512% | 4,051% |
| 33 | 20.297 | 360.657 | 4,1778% | 4,178% |
| 34 | 20.882,5 | 381.539,5 | 4,3044% | 4,304% |
| 35 | 21.468 | 403.007,5 | 4,4310% | 4,431% |
| 36 | 22.053,5 | 425.061 | 4,5576% | 4,558% |
| 37 | 22.639 | 447.700 | 4,6842% | 4,684% |
| 38 | 23.224,5 | 470.924,5 | 4,8108% | 4,811% |
| 39 | 23.810 | 494.734,5 | 4,9374% | 4,937% |
| 40 | 24.395,5 | 519.130 | 5,0640% | 5,064% |
| 41 | 24.981 | 544.111 | 5,1906% | 5,191% |
| 42 | 25.566,5 | 569.677,5 | 5,3172% | 5,317% |
| 43 | 26.152 | 595.829,5 | 5,4438% | 5,444% |
| 44 | 26.737,5 | 622.567 | 5,5704% | 5,57% |
| 45 | 27.323 | 649.890 | 5,6970% | 5,697% |
| 46 | 27.908,5 | 677.798,5 | 5,8236% | 5,824% |
| 47 | 28.494 | 706.292,5 | 5,9502% | 5,95% |
| 48 | 29.079,5 | 735.372 | 6,0768% | 6,077% |
| 49 | 29.665 | 765.037 | 6,2034% | 6,203% |
| 50 | 30.250,5 | 795.287,5 | 6,3300% | 6,33% |
| 51 | 30.836 | 826.123,5 | 6,4566% | 6,457% |
| 52 | 31.421,5 | 857.545 | 6,5832% | 6,583% |
| 53 | 32.007 | 889.552 | 6,7098% | 6,71% |
| 54 | 32.592,5 | 922.144,5 | 6,8364% | 6,836% |
| 55 | 33.178 | 955.322,5 | 6,9630% | 6,963% |
| 56 | 33.763,5 | 989.086 | 7,0896% | 7,09% |
| 57 | 34.349 | 1.023.435 | 7,2162% | 7,216% |
| 58 | 34.934,5 | 1.058.369,5 | 7,3428% | 7,343% |
| 59 | 35.520 | 1.093.889,5 | 7,4694% | 7,469% |
| 60 | 36.105,5 | 1.129.995 | 7,5960% | 7,596% |
| 61 | 36.691 | 1.166.686 | 7,7226% | 7,723% |
| 62 | 37.276,5 | 1.203.962,5 | 7,8492% | 7,849% |
| 63 | 37.862 | 1.241.824,5 | 7,9758% | 7,976% |
| 64 | 38.447,5 | 1.280.272 | 8,1024% | 8,102% |
| 65 | 39.033 | 1.319.305 | 8,2290% | 8,229% |
| 66 | 39.618,5 | 1.358.923,5 | 8,3556% | 8,356% |
| 67 | 40.204 | 1.399.127,5 | 8,4822% | 8,482% |
| 68 | 40.789,5 | 1.439.917 | 8,6088% | 8,609% |
| 69 | 41.375 | 1.481.292 | 8,7354% | 8,735% |
| 70 | 41.960,5 | 1.523.252,5 | 8,8620% | 8,862% |
| 71 | 42.546 | 1.565.798,5 | 8,9886% | 8,989% |
| 72 | 43.131,5 | 1.608.930 | 9,1152% | 9,115% |
| 73 | 43.717 | 1.652.647 | 9,2418% | 9,242% |
| 74 | 44.302,5 | 1.696.949,5 | 9,3684% | 9,368% |
| 75 | 44.888 | 1.741.837,5 | 9,4950% | 9,495% |
| 76 | 45.473,5 | 1.787.311 | 9,6216% | 9,622% |
| 77 | 46.059 | 1.833.370 | 9,7482% | 9,748% |
| 78 | 46.644,5 | 1.880.014,5 | 9,8748% | 9,875% |
| 79 | 47.230 | 1.927.244,5 | 10,0014% | 10% |
| 80 | 47.815,5 | 1.975.060 | 10,1280% | 10,13% |
| 81 | 48.401 | 2.023.461 | 10,2546% | 10,25% |
| 82 | 48.986,5 | 2.072.447,5 | 10,3812% | 10,38% |
| 83 | 49.572 | 2.122.019,5 | 10,5078% | 10,51% |
| 84 | 50.157,5 | 2.172.177 | 10,6344% | 10,63% |
| 85 | 50.743 | 2.222.920 | 10,7610% | 10,76% |
| 86 | 51.328,5 | 2.274.248,5 | 10,8876% | 10,89% |
| 87 | 51.914 | 2.326.162,5 | 11,0142% | 11,01% |
| 88 | 52.499,5 | 2.378.662 | 11,1408% | 11,14% |
| 89 | 53.085 | 2.431.747 | 11,2674% | 11,27% |
| 90 | 53.670,5 | 2.485.417,5 | 11,3940% | 11,39% |
| 91 | 54.256 | 2.539.673,5 | 11,5206% | 11,52% |
| 92 | 54.841,5 | 2.594.515 | 11,6472% | 11,65% |
| 93 | 55.427 | 2.649.942 | 11,7738% | 11,77% |
| 94 | 56.012,5 | 2.705.954,5 | 11,9004% | 11,9% |
| 95 | 56.598 | 2.762.552,5 | 12,0270% | 12,03% |
| 96 | 57.183,5 | 2.819.736 | 12,1536% | 12,15% |
| 97 | 57.769 | 2.877.505 | 12,2802% | 12,28% |
| 98 | 58.354,5 | 2.935.859,5 | 12,4068% | 12,41% |
| 99 | 58.940 | 2.994.799,5 | 12,5334% | 12,53% |
| 100 | 59.525,5 | 3.054.325 | 12,6600% | 12,66% |
| 101 | 60.111 | 3.114.436 | 12,7866% | 12,79% |
| 102 | 60.696,5 | 3.175.132,5 | 12,9132% | 12,91% |
| 103 | 61.282 | 3.236.414,5 | 13,0398% | 13,04% |
| 104 | 61.867,5 | 3.298.282 | 13,1664% | 13,17% |
| 105 | 62.453 | 3.360.735 | 13,2930% | 13,29% |
| 106 | 63.038,5 | 3.423.773,5 | 13,4196% | 13,42% |
| 107 | 63.624 | 3.487.397,5 | 13,5462% | 13,55% |
| 108 | 64.209,5 | 3.551.607 | 13,6728% | 13,67% |
| 109 | 64.795 | 3.616.402 | 13,7994% | 13,8% |
| 110 | 65.380,5 | 3.681.782,5 | 13,9260% | 13,93% |
| 111 | 65.966 | 3.747.748,5 | 14,0526% | 14,05% |
| 112 | 66.551,5 | 3.814.300 | 14,1792% | 14,18% |
| 113 | 67.137 | 3.881.437 | 14,3058% | 14,31% |
| 114 | 67.722,5 | 3.949.159,5 | 14,4324% | 14,43% |
| 115 | 68.308 | 4.017.467,5 | 14,5590% | 14,56% |
| 116 | 68.893,5 | 4.086.361 | 14,6856% | 14,69% |
| 117 | 69.479 | 4.155.840 | 14,8122% | 14,81% |
| 118 | 70.064,5 | 4.225.904,5 | 14,9388% | 14,94% |
| 119 | 70.650 | 4.296.554,5 | 15,0654% | 15,07% |
| 120 | 71.235,5 | 4.367.790 | 15,1920% | 15,19% |
| 121 | 71.821 | 4.439.611 | 15,3186% | 15,32% |
| 122 | 72.406,5 | 4.512.017,5 | 15,4452% | 15,45% |
| 123 | 72.992 | 4.585.009,5 | 15,5718% | 15,57% |
| 124 | 73.577,5 | 4.658.587 | 15,6984% | 15,7% |
| 125 | 74.163 | 4.732.750 | 15,8250% | 15,83% |
| 126 | 74.748,5 | 4.807.498,5 | 15,9516% | 15,95% |
| 127 | 75.334 | 4.882.832,5 | 16,0782% | 16,08% |
| 128 | 75.919,5 | 4.958.752 | 16,2048% | 16,2% |
| 129 | 76.505 | 5.035.257 | 16,3314% | 16,33% |
| 130 | 77.090,5 | 5.112.347,5 | 16,4580% | 16,46% |
| 131 | 77.676 | 5.190.023,5 | 16,5846% | 16,58% |
| 132 | 78.261,5 | 5.268.285 | 16,7112% | 16,71% |
| 133 | 78.847 | 5.347.132 | 16,8378% | 16,84% |
| 134 | 79.432,5 | 5.426.564,5 | 16,9644% | 16,96% |
| 135 | 80.018 | 5.506.582,5 | 17,0910% | 17,09% |
| 136 | 80.603,5 | 5.587.186 | 17,2176% | 17,22% |
| 137 | 81.189 | 5.668.375 | 17,3442% | 17,34% |
| 138 | 81.774,5 | 5.750.149,5 | 17,4708% | 17,47% |
| 139 | 82.360 | 5.832.509,5 | 17,5974% | 17,6% |
| 140 | 82.945,5 | 5.915.455 | 17,7240% | 17,72% |
| 141 | 83.531 | 5.998.986 | 17,8506% | 17,85% |
| 142 | 84.116,5 | 6.083.102,5 | 17,9772% | 17,98% |
| 143 | 84.702 | 6.167.804,5 | 18,1038% | 18,1% |
| 144 | 85.287,5 | 6.253.092 | 18,2304% | 18,23% |
| 145 | 85.873 | 6.338.965 | 18,3570% | 18,36% |
| 146 | 86.458,5 | 6.425.423,5 | 18,4836% | 18,48% |
| 147 | 87.044 | 6.512.467,5 | 18,6102% | 18,61% |
| 148 | 87.629,5 | 6.600.097 | 18,7368% | 18,74% |
| 149 | 88.215 | 6.688.312 | 18,8634% | 18,86% |
| 150 | 88.800,5 | 6.777.112,5 | 18,9900% | 18,99% |
| 151 | 89.386 | 6.866.498,5 | 19,1166% | 19,12% |
| 152 | 89.971,5 | 6.956.470 | 19,2432% | 19,24% |
| 153 | 90.557 | 7.047.027 | 19,3698% | 19,37% |
| 154 | 91.142,5 | 7.138.169,5 | 19,4964% | 19,5% |
| 155 | 91.728 | 7.229.897,5 | 19,6230% | 19,62% |
| 156 | 92.313,5 | 7.322.211 | 19,7496% | 19,75% |
| 157 | 92.899 | 7.415.110 | 19,8762% | 19,88% |
| 158 | 93.484,5 | 7.508.594,5 | 20,0028% | 20% |
| 159 | 94.070 | 7.602.664,5 | 20,1294% | 20,13% |
| 160 | 94.655,5 | 7.697.320 | 20,2560% | 20,26% |
| 161 | 95.241 | 7.792.561 | 20,3826% | 20,38% |
| 162 | 95.826,5 | 7.888.387,5 | 20,5092% | 20,51% |
| 163 | 96.412 | 7.984.799,5 | 20,6358% | 20,64% |
| 164 | 96.997,5 | 8.081.797 | 20,7624% | 20,76% |
| 165 | 97.583 | 8.179.380 | 20,8890% | 20,89% |
| 166 | 98.168,5 | 8.277.548,5 | 21,0156% | 21,02% |
| 167 | 98.754 | 8.376.302,5 | 21,1422% | 21,14% |
| 168 | 99.339,5 | 8.475.642 | 21,2688% | 21,27% |
| 169 | 99.925 | 8.575.567 | 21,3954% | 21,4% |
| 170 | 100.510,5 | 8.676.077,5 | 21,5220% | 21,52% |
| 171 | 101.096 | 8.777.173,5 | 21,6486% | 21,65% |
| 172 | 101.681,5 | 8.878.855 | 21,7752% | 21,78% |
| 173 | 102.267 | 8.981.122 | 21,9018% | 21,9% |
| 174 | 102.852,5 | 9.083.974,5 | 22,0284% | 22,03% |
| 175 | 103.438 | 9.187.412,5 | 22,1550% | 22,15% |
| 176 | 104.023,5 | 9.291.436 | 22,2816% | 22,28% |
| 177 | 104.609 | 9.396.045 | 22,4082% | 22,41% |
| 178 | 105.194,5 | 9.501.239,5 | 22,5348% | 22,53% |
| 179 | 105.780 | 9.607.019,5 | 22,6614% | 22,66% |
| 180 | 106.365,5 | 9.713.385 | 22,7880% | 22,79% |
| 181 | 106.951 | 9.820.336 | 22,9146% | 22,91% |
| 182 | 107.536,5 | 9.927.872,5 | 23,0412% | 23,04% |
| 183 | 108.122 | 10.035.994,5 | 23,1678% | 23,17% |
| 184 | 108.707,5 | 10.144.702 | 23,2944% | 23,29% |
| 185 | 109.293 | 10.253.995 | 23,4210% | 23,42% |
| 186 | 109.878,5 | 10.363.873,5 | 23,5476% | 23,55% |
| 187 | 110.464 | 10.474.337,5 | 23,6742% | 23,67% |
| 188 | 111.049,5 | 10.585.387 | 23,8008% | 23,8% |
| 189 | 111.635 | 10.697.022 | 23,9274% | 23,93% |
| 190 | 112.220,5 | 10.809.242,5 | 24,0540% | 24,05% |
| 191 | 112.806 | 10.922.048,5 | 24,1806% | 24,18% |
| 192 | 113.391,5 | 11.035.440 | 24,3072% | 24,31% |
| 193 | 113.977 | 11.149.417 | 24,4338% | 24,43% |
| 194 | 114.562,5 | 11.263.979,5 | 24,5604% | 24,56% |
| 195 | 115.148 | 11.379.127,5 | 24,6870% | 24,69% |
| 196 | 115.733,5 | 11.494.861 | 24,8136% | 24,81% |
| 197 | 116.319 | 11.611.180 | 24,9402% | 24,94% |
| 198 | 116.904,5 | 11.728.084,5 | 25,0668% | 25,07% |
| 199 | 117.490 | 11.845.574,5 | 25,1934% | 25,19% |
| 200 | 118.075,5 | 11.963.650 | 25,3200% | 25,32% |
| 201 | 118.661 | 12.082.311 | 25,4466% | 25,45% |
| 202 | 119.246,5 | 12.201.557,5 | 25,5732% | 25,57% |
| 203 | 119.832 | 12.321.389,5 | 25,6998% | 25,7% |
| 204 | 120.417,5 | 12.441.807 | 25,8264% | 25,83% |
| 205 | 121.003 | 12.562.810 | 25,9530% | 25,95% |
| 206 | 121.588,5 | 12.684.398,5 | 26,0796% | 26,08% |
| 207 | 122.174 | 12.806.572,5 | 26,2062% | 26,21% |
| 208 | 122.759,5 | 12.929.332 | 26,3328% | 26,33% |
| 209 | 123.345 | 13.052.677 | 26,4594% | 26,46% |
| 210 | 123.930,5 | 13.176.607,5 | 26,5860% | 26,59% |
| 211 | 124.516 | 13.301.123,5 | 26,7126% | 26,71% |
| 212 | 125.101,5 | 13.426.225 | 26,8392% | 26,84% |
| 213 | 125.687 | 13.551.912 | 26,9658% | 26,97% |
| 214 | 126.272,5 | 13.678.184,5 | 27,0924% | 27,09% |
| 215 | 126.858 | 13.805.042,5 | 27,2190% | 27,22% |
| 216 | 127.443,5 | 13.932.486 | 27,3456% | 27,35% |
| 217 | 128.029 | 14.060.515 | 27,4722% | 27,47% |
| 218 | 128.614,5 | 14.189.129,5 | 27,5988% | 27,6% |
| 219 | 129.200 | 14.318.329,5 | 27,7254% | 27,73% |
| 220 | 129.785,5 | 14.448.115 | 27,8520% | 27,85% |
| 221 | 130.371 | 14.578.486 | 27,9786% | 27,98% |
| 222 | 130.956,5 | 14.709.442,5 | 28,1052% | 28,11% |
| 223 | 131.542 | 14.840.984,5 | 28,2318% | 28,23% |
| 224 | 132.127,5 | 14.973.112 | 28,3584% | 28,36% |
| 225 | 132.713 | 15.105.825 | 28,4850% | 28,48% |
| 226 | 133.298,5 | 15.239.123,5 | 28,6116% | 28,61% |
| 227 | 133.884 | 15.373.007,5 | 28,7382% | 28,74% |
| 228 | 134.469,5 | 15.507.477 | 28,8648% | 28,86% |
| 229 | 135.055 | 15.642.532 | 28,9914% | 28,99% |
| 230 | 135.640,5 | 15.778.172,5 | 29,1180% | 29,12% |
| 231 | 136.226 | 15.914.398,5 | 29,2446% | 29,24% |
| 232 | 136.811,5 | 16.051.210 | 29,3712% | 29,37% |
| 233 | 137.397 | 16.188.607 | 29,4978% | 29,5% |
| 234 | 137.982,5 | 16.326.589,5 | 29,6244% | 29,62% |
| 235 | 138.568 | 16.465.157,5 | 29,7510% | 29,75% |
| 236 | 139.153,5 | 16.604.311 | 29,8776% | 29,88% |
| 237 | 139.739 | 16.744.050 | 30,0042% | 30% |
| 238 | 140.324,5 | 16.884.374,5 | 30,1308% | 30,13% |
| 239 | 140.910 | 17.025.284,5 | 30,2574% | 30,26% |
| 240 | 141.495,5 | 17.166.780 | 30,3840% | 30,38% |
| 241 | 142.081 | 17.308.861 | 30,5106% | 30,51% |
| 242 | 142.666,5 | 17.451.527,5 | 30,6372% | 30,64% |
| 243 | 143.252 | 17.594.779,5 | 30,7638% | 30,76% |
| 244 | 143.837,5 | 17.738.617 | 30,8904% | 30,89% |
| 245 | 144.423 | 17.883.040 | 31,0170% | 31,02% |
| 246 | 145.008,5 | 18.028.048,5 | 31,1436% | 31,14% |
| 247 | 145.594 | 18.173.642,5 | 31,2702% | 31,27% |
| 248 | 146.179,5 | 18.319.822 | 31,3968% | 31,4% |
| 249 | 146.765 | 18.466.587 | 31,5234% | 31,52% |
| 250 | 147.350,5 | 18.613.937,5 | 31,6500% | 31,65% |
| 251 | 147.936 | 18.761.873,5 | 31,7766% | 31,78% |
| 252 | 148.521,5 | 18.910.395 | 31,9032% | 31,9% |
| 253 | 149.107 | 19.059.502 | 32,0298% | 32,03% |
| 254 | 149.692,5 | 19.209.194,5 | 32,1564% | 32,16% |
| 255 | 150.278 | 19.359.472,5 | 32,2830% | 32,28% |
| 256 | 150.863,5 | 19.510.336 | 32,4096% | 32,41% |
| 257 | 151.449 | 19.661.785 | 32,5362% | 32,54% |
| 258 | 152.034,5 | 19.813.819,5 | 32,6628% | 32,66% |
| 259 | 152.620 | 19.966.439,5 | 32,7894% | 32,79% |
| 260 | 153.205,5 | 20.119.645 | 32,9160% | 32,92% |
| 261 | 153.791 | 20.273.436 | 33,0426% | 33,04% |
| 262 | 154.376,5 | 20.427.812,5 | 33,1692% | 33,17% |
| 263 | 154.962 | 20.582.774,5 | 33,2958% | 33,3% |
| 264 | 155.547,5 | 20.738.322 | 33,4224% | 33,42% |
| 265 | 156.133 | 20.894.455 | 33,5490% | 33,55% |
| 266 | 156.718,5 | 21.051.173,5 | 33,6756% | 33,68% |
| 267 | 157.304 | 21.208.477,5 | 33,8022% | 33,8% |
| 268 | 157.889,5 | 21.366.367 | 33,9288% | 33,93% |
| 269 | 158.475 | 21.524.842 | 34,0554% | 34,06% |
| 270 | 159.060,5 | 21.683.902,5 | 34,1820% | 34,18% |
| 271 | 159.646 | 21.843.548,5 | 34,3086% | 34,31% |
| 272 | 160.231,5 | 22.003.780 | 34,4352% | 34,44% |
| 273 | 160.817 | 22.164.597 | 34,5618% | 34,56% |
| 274 | 161.402,5 | 22.325.999,5 | 34,6884% | 34,69% |
| 275 | 161.988 | 22.487.987,5 | 34,8150% | 34,82% |
| 276 | 162.573,5 | 22.650.561 | 34,9416% | 34,94% |
| 277 | 163.159 | 22.813.720 | 35,0682% | 35,07% |
| 278 | 163.744,5 | 22.977.464,5 | 35,1948% | 35,19% |
| 279 | 164.330 | 23.141.794,5 | 35,3214% | 35,32% |
| 280 | 164.915,5 | 23.306.710 | 35,4480% | 35,45% |
| 281 | 165.501 | 23.472.211 | 35,5746% | 35,57% |
| 282 | 166.086,5 | 23.638.297,5 | 35,7012% | 35,7% |
| 283 | 166.672 | 23.804.969,5 | 35,8278% | 35,83% |
| 284 | 167.257,5 | 23.972.227 | 35,9544% | 35,95% |
| 285 | 167.843 | 24.140.070 | 36,0810% | 36,08% |
| 286 | 168.428,5 | 24.308.498,5 | 36,2076% | 36,21% |
| 287 | 169.014 | 24.477.512,5 | 36,3342% | 36,33% |
| 288 | 169.599,5 | 24.647.112 | 36,4608% | 36,46% |
| 289 | 170.185 | 24.817.297 | 36,5874% | 36,59% |
| 290 | 170.770,5 | 24.988.067,5 | 36,7140% | 36,71% |
| 291 | 171.356 | 25.159.423,5 | 36,8406% | 36,84% |
| 292 | 171.941,5 | 25.331.365 | 36,9672% | 36,97% |
| 293 | 172.527 | 25.503.892 | 37,0938% | 37,09% |
| 294 | 173.112,5 | 25.677.004,5 | 37,2204% | 37,22% |
| 295 | 173.698 | 25.850.702,5 | 37,3470% | 37,35% |
| 296 | 174.283,5 | 26.024.986 | 37,4736% | 37,47% |
| 297 | 174.869 | 26.199.855 | 37,6002% | 37,6% |
| 298 | 175.454,5 | 26.375.309,5 | 37,7268% | 37,73% |
| 299 | 176.040 | 26.551.349,5 | 37,8534% | 37,85% |
| 300 | 176.625,5 | 26.727.975 | 37,9800% | 37,98% |
| 301 | 177.211 | 26.905.186 | 38,1066% | 38,11% |
| 302 | 177.796,5 | 27.082.982,5 | 38,2332% | 38,23% |
| 303 | 178.382 | 27.261.364,5 | 38,3598% | 38,36% |
| 304 | 178.967,5 | 27.440.332 | 38,4864% | 38,49% |
| 305 | 179.553 | 27.619.885 | 38,6130% | 38,61% |
| 306 | 180.138,5 | 27.800.023,5 | 38,7396% | 38,74% |
| 307 | 180.724 | 27.980.747,5 | 38,8662% | 38,87% |
| 308 | 181.309,5 | 28.162.057 | 38,9928% | 38,99% |
| 309 | 181.895 | 28.343.952 | 39,1194% | 39,12% |
| 310 | 182.480,5 | 28.526.432,5 | 39,2460% | 39,25% |
| 311 | 183.066 | 28.709.498,5 | 39,3726% | 39,37% |
| 312 | 183.651,5 | 28.893.150 | 39,4992% | 39,5% |
| 313 | 184.237 | 29.077.387 | 39,6258% | 39,63% |
| 314 | 184.822,5 | 29.262.209,5 | 39,7524% | 39,75% |
| 315 | 185.408 | 29.447.617,5 | 39,8790% | 39,88% |
| 316 | 185.993,5 | 29.633.611 | 40,0056% | 40,01% |
| 317 | 186.579 | 29.820.190 | 40,1322% | 40,13% |
| 318 | 187.164,5 | 30.007.354,5 | 40,2588% | 40,26% |
| 319 | 187.750 | 30.195.104,5 | 40,3854% | 40,39% |
| 320 | 188.335,5 | 30.383.440 | 40,5120% | 40,51% |
| 321 | 188.921 | 30.572.361 | 40,6386% | 40,64% |
| 322 | 189.506,5 | 30.761.867,5 | 40,7652% | 40,77% |
| 323 | 190.092 | 30.951.959,5 | 40,8918% | 40,89% |
| 324 | 190.677,5 | 31.142.637 | 41,0184% | 41,02% |
| 325 | 191.263 | 31.333.900 | 41,1450% | 41,15% |
| 326 | 191.848,5 | 31.525.748,5 | 41,2716% | 41,27% |
| 327 | 192.434 | 31.718.182,5 | 41,3982% | 41,4% |
| 328 | 193.019,5 | 31.911.202 | 41,5248% | 41,52% |
| 329 | 193.605 | 32.104.807 | 41,6514% | 41,65% |
| 330 | 194.190,5 | 32.298.997,5 | 41,7780% | 41,78% |
| 331 | 194.776 | 32.493.773,5 | 41,9046% | 41,9% |
| 332 | 195.361,5 | 32.689.135 | 42,0312% | 42,03% |
| 333 | 195.947 | 32.885.082 | 42,1578% | 42,16% |
| 334 | 196.532,5 | 33.081.614,5 | 42,2844% | 42,28% |
| 335 | 197.118 | 33.278.732,5 | 42,4110% | 42,41% |
| 336 | 197.703,5 | 33.476.436 | 42,5376% | 42,54% |
| 337 | 198.289 | 33.674.725 | 42,6642% | 42,66% |
| 338 | 198.874,5 | 33.873.599,5 | 42,7908% | 42,79% |
| 339 | 199.460 | 34.073.059,5 | 42,9174% | 42,92% |
| 340 | 200.045,5 | 34.273.105 | 43,0440% | 43,04% |
| 341 | 200.631 | 34.473.736 | 43,1706% | 43,17% |
| 342 | 201.216,5 | 34.674.952,5 | 43,2972% | 43,3% |
| 343 | 201.802 | 34.876.754,5 | 43,4238% | 43,42% |
| 344 | 202.387,5 | 35.079.142 | 43,5504% | 43,55% |
| 345 | 202.973 | 35.282.115 | 43,6770% | 43,68% |
| 346 | 203.558,5 | 35.485.673,5 | 43,8036% | 43,8% |
| 347 | 204.144 | 35.689.817,5 | 43,9302% | 43,93% |
| 348 | 204.729,5 | 35.894.547 | 44,0568% | 44,06% |
| 349 | 205.315 | 36.099.862 | 44,1834% | 44,18% |
| 350 | 205.900,5 | 36.305.762,5 | 44,3100% | 44,31% |
| 351 | 206.486 | 36.512.248,5 | 44,4366% | 44,44% |
| 352 | 207.071,5 | 36.719.320 | 44,5632% | 44,56% |
| 353 | 207.657 | 36.926.977 | 44,6898% | 44,69% |
| 354 | 208.242,5 | 37.135.219,5 | 44,8164% | 44,82% |
| 355 | 208.828 | 37.344.047,5 | 44,9430% | 44,94% |
| 356 | 209.413,5 | 37.553.461 | 45,0696% | 45,07% |
| 357 | 209.999 | 37.763.460 | 45,1962% | 45,2% |
| 358 | 210.584,5 | 37.974.044,5 | 45,3228% | 45,32% |
| 359 | 211.170 | 38.185.214,5 | 45,4494% | 45,45% |
| 360 | 211.755,5 | 38.396.970 | 45,5760% | 45,58% |
| 361 | 212.341 | 38.609.311 | 45,7026% | 45,7% |
| 362 | 212.926,5 | 38.822.237,5 | 45,8292% | 45,83% |
| 363 | 213.512 | 39.035.749,5 | 45,9558% | 45,96% |
| 364 | 214.097,5 | 39.249.847 | 46,0824% | 46,08% |
| 365 | 214.683 | 39.464.530 | 46,2090% | 46,21% |
| 366 | 215.268,5 | 39.679.798,5 | 46,3356% | 46,34% |
| 367 | 215.854 | 39.895.652,5 | 46,4622% | 46,46% |
| 368 | 216.439,5 | 40.112.092 | 46,5888% | 46,59% |
| 369 | 217.025 | 40.329.117 | 46,7154% | 46,72% |
| 370 | 217.610,5 | 40.546.727,5 | 46,8420% | 46,84% |
| 371 | 218.196 | 40.764.923,5 | 46,9686% | 46,97% |
| 372 | 218.781,5 | 40.983.705 | 47,0952% | 47,1% |
| 373 | 219.367 | 41.203.072 | 47,2218% | 47,22% |
| 374 | 219.952,5 | 41.423.024,5 | 47,3484% | 47,35% |
| 375 | 220.538 | 41.643.562,5 | 47,4750% | 47,48% |
| 376 | 221.123,5 | 41.864.686 | 47,6016% | 47,6% |
| 377 | 221.709 | 42.086.395 | 47,7282% | 47,73% |
| 378 | 222.294,5 | 42.308.689,5 | 47,8548% | 47,85% |
| 379 | 222.880 | 42.531.569,5 | 47,9814% | 47,98% |
| 380 | 223.465,5 | 42.755.035 | 48,1080% | 48,11% |
| 381 | 224.051 | 42.979.086 | 48,2346% | 48,23% |
| 382 | 224.636,5 | 43.203.722,5 | 48,3612% | 48,36% |
| 383 | 225.222 | 43.428.944,5 | 48,4878% | 48,49% |
| 384 | 225.807,5 | 43.654.752 | 48,6144% | 48,61% |
| 385 | 226.393 | 43.881.145 | 48,7410% | 48,74% |
| 386 | 226.978,5 | 44.108.123,5 | 48,8676% | 48,87% |
| 387 | 227.564 | 44.335.687,5 | 48,9942% | 48,99% |
| 388 | 228.149,5 | 44.563.837 | 49,1208% | 49,12% |
| 389 | 228.735 | 44.792.572 | 49,2474% | 49,25% |
| 390 | 229.320,5 | 45.021.892,5 | 49,3740% | 49,37% |
| 391 | 229.906 | 45.251.798,5 | 49,5006% | 49,5% |
| 392 | 230.491,5 | 45.482.290 | 49,6272% | 49,63% |
| 393 | 231.077 | 45.713.367 | 49,7538% | 49,75% |
| 394 | 231.662,5 | 45.945.029,5 | 49,8804% | 49,88% |
| 395 | 232.248 | 46.177.277,5 | 50,0070% | 50,01% |
| 396 | 232.833,5 | 46.410.111 | 50,1336% | 50,13% |
| 397 | 233.419 | 46.643.530 | 50,2602% | 50,26% |
| 398 | 234.004,5 | 46.877.534,5 | 50,3868% | 50,39% |
| 399 | 234.590 | 47.112.124,5 | 50,5134% | 50,51% |
| 400 | 235.175,5 | 47.347.300 | 50,6400% | 50,64% |
| 401 | 235.761 | 47.583.061 | 50,7666% | 50,77% |
| 402 | 236.346,5 | 47.819.407,5 | 50,8932% | 50,89% |
| 403 | 236.932 | 48.056.339,5 | 51,0198% | 51,02% |
| 404 | 237.517,5 | 48.293.857 | 51,1464% | 51,15% |
| 405 | 238.103 | 48.531.960 | 51,2730% | 51,27% |
| 406 | 238.688,5 | 48.770.648,5 | 51,3996% | 51,4% |
| 407 | 239.274 | 49.009.922,5 | 51,5262% | 51,53% |
| 408 | 239.859,5 | 49.249.782 | 51,6528% | 51,65% |
| 409 | 240.445 | 49.490.227 | 51,7794% | 51,78% |
| 410 | 241.030,5 | 49.731.257,5 | 51,9060% | 51,91% |
| 411 | 241.616 | 49.972.873,5 | 52,0326% | 52,03% |
| 412 | 242.201,5 | 50.215.075 | 52,1592% | 52,16% |
| 413 | 242.787 | 50.457.862 | 52,2858% | 52,29% |
| 414 | 243.372,5 | 50.701.234,5 | 52,4124% | 52,41% |
| 415 | 243.958 | 50.945.192,5 | 52,5390% | 52,54% |
| 416 | 244.543,5 | 51.189.736 | 52,6656% | 52,67% |
| 417 | 245.129 | 51.434.865 | 52,7922% | 52,79% |
| 418 | 245.714,5 | 51.680.579,5 | 52,9188% | 52,92% |
| 419 | 246.300 | 51.926.879,5 | 53,0454% | 53,05% |
| 420 | 246.885,5 | 52.173.765 | 53,1720% | 53,17% |
| 421 | 247.471 | 52.421.236 | 53,2986% | 53,3% |
| 422 | 248.056,5 | 52.669.292,5 | 53,4252% | 53,43% |
| 423 | 248.642 | 52.917.934,5 | 53,5518% | 53,55% |
| 424 | 249.227,5 | 53.167.162 | 53,6784% | 53,68% |
| 425 | 249.813 | 53.416.975 | 53,8050% | 53,81% |
| 426 | 250.398,5 | 53.667.373,5 | 53,9316% | 53,93% |
| 427 | 250.984 | 53.918.357,5 | 54,0582% | 54,06% |
| 428 | 251.569,5 | 54.169.927 | 54,1848% | 54,18% |
| 429 | 252.155 | 54.422.082 | 54,3114% | 54,31% |
| 430 | 252.740,5 | 54.674.822,5 | 54,4380% | 54,44% |
| 431 | 253.326 | 54.928.148,5 | 54,5646% | 54,56% |
| 432 | 253.911,5 | 55.182.060 | 54,6912% | 54,69% |
| 433 | 254.497 | 55.436.557 | 54,8178% | 54,82% |
| 434 | 255.082,5 | 55.691.639,5 | 54,9444% | 54,94% |
| 435 | 255.668 | 55.947.307,5 | 55,0710% | 55,07% |
| 436 | 256.253,5 | 56.203.561 | 55,1976% | 55,2% |
| 437 | 256.839 | 56.460.400 | 55,3242% | 55,32% |
| 438 | 257.424,5 | 56.717.824,5 | 55,4508% | 55,45% |
| 439 | 258.010 | 56.975.834,5 | 55,5774% | 55,58% |
| 440 | 258.595,5 | 57.234.430 | 55,7040% | 55,7% |
| 441 | 259.181 | 57.493.611 | 55,8306% | 55,83% |
| 442 | 259.766,5 | 57.753.377,5 | 55,9572% | 55,96% |
| 443 | 260.352 | 58.013.729,5 | 56,0838% | 56,08% |
| 444 | 260.937,5 | 58.274.667 | 56,2104% | 56,21% |
| 445 | 261.523 | 58.536.190 | 56,3370% | 56,34% |
| 446 | 262.108,5 | 58.798.298,5 | 56,4636% | 56,46% |
| 447 | 262.694 | 59.060.992,5 | 56,5902% | 56,59% |
| 448 | 263.279,5 | 59.324.272 | 56,7168% | 56,72% |
| 449 | 263.865 | 59.588.137 | 56,8434% | 56,84% |
| 450 | 264.450,5 | 59.852.587,5 | 56,9700% | 56,97% |
| 451 | 265.036 | 60.117.623,5 | 57,0966% | 57,1% |
| 452 | 265.621,5 | 60.383.245 | 57,2232% | 57,22% |
| 453 | 266.207 | 60.649.452 | 57,3498% | 57,35% |
| 454 | 266.792,5 | 60.916.244,5 | 57,4764% | 57,48% |
| 455 | 267.378 | 61.183.622,5 | 57,6030% | 57,6% |
| 456 | 267.963,5 | 61.451.586 | 57,7296% | 57,73% |
| 457 | 268.549 | 61.720.135 | 57,8562% | 57,86% |
| 458 | 269.134,5 | 61.989.269,5 | 57,9828% | 57,98% |
| 459 | 269.720 | 62.258.989,5 | 58,1094% | 58,11% |
| 460 | 270.305,5 | 62.529.295 | 58,2360% | 58,24% |
| 461 | 270.891 | 62.800.186 | 58,3626% | 58,36% |
| 462 | 271.476,5 | 63.071.662,5 | 58,4892% | 58,49% |
| 463 | 272.062 | 63.343.724,5 | 58,6158% | 58,62% |
| 464 | 272.647,5 | 63.616.372 | 58,7424% | 58,74% |
| 465 | 273.233 | 63.889.605 | 58,8690% | 58,87% |
| 466 | 273.818,5 | 64.163.423,5 | 58,9956% | 59% |
| 467 | 274.404 | 64.437.827,5 | 59,1222% | 59,12% |
| 468 | 274.989,5 | 64.712.817 | 59,2488% | 59,25% |
| 469 | 275.575 | 64.988.392 | 59,3754% | 59,38% |
| 470 | 276.160,5 | 65.264.552,5 | 59,5020% | 59,5% |
| 471 | 276.746 | 65.541.298,5 | 59,6286% | 59,63% |
| 472 | 277.331,5 | 65.818.630 | 59,7552% | 59,76% |
| 473 | 277.917 | 66.096.547 | 59,8818% | 59,88% |
| 474 | 278.502,5 | 66.375.049,5 | 60,0084% | 60,01% |
| 475 | 279.088 | 66.654.137,5 | 60,1350% | 60,14% |
| 476 | 279.673,5 | 66.933.811 | 60,2616% | 60,26% |
| 477 | 280.259 | 67.214.070 | 60,3882% | 60,39% |
| 478 | 280.844,5 | 67.494.914,5 | 60,5148% | 60,51% |
| 479 | 281.430 | 67.776.344,5 | 60,6414% | 60,64% |
| 480 | 282.015,5 | 68.058.360 | 60,7680% | 60,77% |
| 481 | 282.601 | 68.340.961 | 60,8946% | 60,89% |
| 482 | 283.186,5 | 68.624.147,5 | 61,0212% | 61,02% |
| 483 | 283.772 | 68.907.919,5 | 61,1478% | 61,15% |
| 484 | 284.357,5 | 69.192.277 | 61,2744% | 61,27% |
| 485 | 284.943 | 69.477.220 | 61,4010% | 61,4% |
| 486 | 285.528,5 | 69.762.748,5 | 61,5276% | 61,53% |
| 487 | 286.114 | 70.048.862,5 | 61,6542% | 61,65% |
| 488 | 286.699,5 | 70.335.562 | 61,7808% | 61,78% |
| 489 | 287.285 | 70.622.847 | 61,9074% | 61,91% |
| 490 | 287.870,5 | 70.910.717,5 | 62,0340% | 62,03% |
| 491 | 288.456 | 71.199.173,5 | 62,1606% | 62,16% |
| 492 | 289.041,5 | 71.488.215 | 62,2872% | 62,29% |
| 493 | 289.627 | 71.777.842 | 62,4138% | 62,41% |
| 494 | 290.212,5 | 72.068.054,5 | 62,5404% | 62,54% |
| 495 | 290.798 | 72.358.852,5 | 62,6670% | 62,67% |
| 496 | 291.383,5 | 72.650.236 | 62,7936% | 62,79% |
| 497 | 291.969 | 72.942.205 | 62,9202% | 62,92% |
| 498 | 292.554,5 | 73.234.759,5 | 63,0468% | 63,05% |
| 499 | 293.140 | 73.527.899,5 | 63,1734% | 63,17% |
| 500 | 293.725,5 | 73.821.625 | 63,3000% | 63,3% |

### Anexo — Encruzilhada

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.561 | 1.561 | 0,1266% | 0,1266% |
| 2 | 2.146,5 | 3.707,5 | 0,2532% | 0,2532% |
| 3 | 2.732 | 6.439,5 | 0,3798% | 0,3798% |
| 4 | 3.317,5 | 9.757 | 0,5064% | 0,5064% |
| 5 | 3.903 | 13.660 | 0,6330% | 0,633% |
| 6 | 4.488,5 | 18.148,5 | 0,7596% | 0,7596% |
| 7 | 5.074 | 23.222,5 | 0,8862% | 0,8862% |
| 8 | 5.659,5 | 28.882 | 1,0128% | 1,013% |
| 9 | 6.245 | 35.127 | 1,1394% | 1,139% |
| 10 | 6.830,5 | 41.957,5 | 1,2660% | 1,266% |
| 11 | 7.416 | 49.373,5 | 1,3926% | 1,393% |
| 12 | 8.001,5 | 57.375 | 1,5192% | 1,519% |
| 13 | 8.587 | 65.962 | 1,6458% | 1,646% |
| 14 | 9.172,5 | 75.134,5 | 1,7724% | 1,772% |
| 15 | 9.758 | 84.892,5 | 1,8990% | 1,899% |
| 16 | 10.343,5 | 95.236 | 2,0256% | 2,026% |
| 17 | 10.929 | 106.165 | 2,1522% | 2,152% |
| 18 | 11.514,5 | 117.679,5 | 2,2788% | 2,279% |
| 19 | 12.100 | 129.779,5 | 2,4054% | 2,405% |
| 20 | 12.685,5 | 142.465 | 2,5320% | 2,532% |
| 21 | 13.271 | 155.736 | 2,6586% | 2,659% |
| 22 | 13.856,5 | 169.592,5 | 2,7852% | 2,785% |
| 23 | 14.442 | 184.034,5 | 2,9118% | 2,912% |
| 24 | 15.027,5 | 199.062 | 3,0384% | 3,038% |
| 25 | 15.613 | 214.675 | 3,1650% | 3,165% |
| 26 | 16.198,5 | 230.873,5 | 3,2916% | 3,292% |
| 27 | 16.784 | 247.657,5 | 3,4182% | 3,418% |
| 28 | 17.369,5 | 265.027 | 3,5448% | 3,545% |
| 29 | 17.955 | 282.982 | 3,6714% | 3,671% |
| 30 | 18.540,5 | 301.522,5 | 3,7980% | 3,798% |
| 31 | 19.126 | 320.648,5 | 3,9246% | 3,925% |
| 32 | 19.711,5 | 340.360 | 4,0512% | 4,051% |
| 33 | 20.297 | 360.657 | 4,1778% | 4,178% |
| 34 | 20.882,5 | 381.539,5 | 4,3044% | 4,304% |
| 35 | 21.468 | 403.007,5 | 4,4310% | 4,431% |
| 36 | 22.053,5 | 425.061 | 4,5576% | 4,558% |
| 37 | 22.639 | 447.700 | 4,6842% | 4,684% |
| 38 | 23.224,5 | 470.924,5 | 4,8108% | 4,811% |
| 39 | 23.810 | 494.734,5 | 4,9374% | 4,937% |
| 40 | 24.395,5 | 519.130 | 5,0640% | 5,064% |
| 41 | 24.981 | 544.111 | 5,1906% | 5,191% |
| 42 | 25.566,5 | 569.677,5 | 5,3172% | 5,317% |
| 43 | 26.152 | 595.829,5 | 5,4438% | 5,444% |
| 44 | 26.737,5 | 622.567 | 5,5704% | 5,57% |
| 45 | 27.323 | 649.890 | 5,6970% | 5,697% |
| 46 | 27.908,5 | 677.798,5 | 5,8236% | 5,824% |
| 47 | 28.494 | 706.292,5 | 5,9502% | 5,95% |
| 48 | 29.079,5 | 735.372 | 6,0768% | 6,077% |
| 49 | 29.665 | 765.037 | 6,2034% | 6,203% |
| 50 | 30.250,5 | 795.287,5 | 6,3300% | 6,33% |
| 51 | 30.836 | 826.123,5 | 6,4566% | 6,457% |
| 52 | 31.421,5 | 857.545 | 6,5832% | 6,583% |
| 53 | 32.007 | 889.552 | 6,7098% | 6,71% |
| 54 | 32.592,5 | 922.144,5 | 6,8364% | 6,836% |
| 55 | 33.178 | 955.322,5 | 6,9630% | 6,963% |
| 56 | 33.763,5 | 989.086 | 7,0896% | 7,09% |
| 57 | 34.349 | 1.023.435 | 7,2162% | 7,216% |
| 58 | 34.934,5 | 1.058.369,5 | 7,3428% | 7,343% |
| 59 | 35.520 | 1.093.889,5 | 7,4694% | 7,469% |
| 60 | 36.105,5 | 1.129.995 | 7,5960% | 7,596% |
| 61 | 36.691 | 1.166.686 | 7,7226% | 7,723% |
| 62 | 37.276,5 | 1.203.962,5 | 7,8492% | 7,849% |
| 63 | 37.862 | 1.241.824,5 | 7,9758% | 7,976% |
| 64 | 38.447,5 | 1.280.272 | 8,1024% | 8,102% |
| 65 | 39.033 | 1.319.305 | 8,2290% | 8,229% |
| 66 | 39.618,5 | 1.358.923,5 | 8,3556% | 8,356% |
| 67 | 40.204 | 1.399.127,5 | 8,4822% | 8,482% |
| 68 | 40.789,5 | 1.439.917 | 8,6088% | 8,609% |
| 69 | 41.375 | 1.481.292 | 8,7354% | 8,735% |
| 70 | 41.960,5 | 1.523.252,5 | 8,8620% | 8,862% |
| 71 | 42.546 | 1.565.798,5 | 8,9886% | 8,989% |
| 72 | 43.131,5 | 1.608.930 | 9,1152% | 9,115% |
| 73 | 43.717 | 1.652.647 | 9,2418% | 9,242% |
| 74 | 44.302,5 | 1.696.949,5 | 9,3684% | 9,368% |
| 75 | 44.888 | 1.741.837,5 | 9,4950% | 9,495% |
| 76 | 45.473,5 | 1.787.311 | 9,6216% | 9,622% |
| 77 | 46.059 | 1.833.370 | 9,7482% | 9,748% |
| 78 | 46.644,5 | 1.880.014,5 | 9,8748% | 9,875% |
| 79 | 47.230 | 1.927.244,5 | 10,0014% | 10% |
| 80 | 47.815,5 | 1.975.060 | 10,1280% | 10,13% |
| 81 | 48.401 | 2.023.461 | 10,2546% | 10,25% |
| 82 | 48.986,5 | 2.072.447,5 | 10,3812% | 10,38% |
| 83 | 49.572 | 2.122.019,5 | 10,5078% | 10,51% |
| 84 | 50.157,5 | 2.172.177 | 10,6344% | 10,63% |
| 85 | 50.743 | 2.222.920 | 10,7610% | 10,76% |
| 86 | 51.328,5 | 2.274.248,5 | 10,8876% | 10,89% |
| 87 | 51.914 | 2.326.162,5 | 11,0142% | 11,01% |
| 88 | 52.499,5 | 2.378.662 | 11,1408% | 11,14% |
| 89 | 53.085 | 2.431.747 | 11,2674% | 11,27% |
| 90 | 53.670,5 | 2.485.417,5 | 11,3940% | 11,39% |
| 91 | 54.256 | 2.539.673,5 | 11,5206% | 11,52% |
| 92 | 54.841,5 | 2.594.515 | 11,6472% | 11,65% |
| 93 | 55.427 | 2.649.942 | 11,7738% | 11,77% |
| 94 | 56.012,5 | 2.705.954,5 | 11,9004% | 11,9% |
| 95 | 56.598 | 2.762.552,5 | 12,0270% | 12,03% |
| 96 | 57.183,5 | 2.819.736 | 12,1536% | 12,15% |
| 97 | 57.769 | 2.877.505 | 12,2802% | 12,28% |
| 98 | 58.354,5 | 2.935.859,5 | 12,4068% | 12,41% |
| 99 | 58.940 | 2.994.799,5 | 12,5334% | 12,53% |
| 100 | 59.525,5 | 3.054.325 | 12,6600% | 12,66% |
| 101 | 60.111 | 3.114.436 | 12,7866% | 12,79% |
| 102 | 60.696,5 | 3.175.132,5 | 12,9132% | 12,91% |
| 103 | 61.282 | 3.236.414,5 | 13,0398% | 13,04% |
| 104 | 61.867,5 | 3.298.282 | 13,1664% | 13,17% |
| 105 | 62.453 | 3.360.735 | 13,2930% | 13,29% |
| 106 | 63.038,5 | 3.423.773,5 | 13,4196% | 13,42% |
| 107 | 63.624 | 3.487.397,5 | 13,5462% | 13,55% |
| 108 | 64.209,5 | 3.551.607 | 13,6728% | 13,67% |
| 109 | 64.795 | 3.616.402 | 13,7994% | 13,8% |
| 110 | 65.380,5 | 3.681.782,5 | 13,9260% | 13,93% |
| 111 | 65.966 | 3.747.748,5 | 14,0526% | 14,05% |
| 112 | 66.551,5 | 3.814.300 | 14,1792% | 14,18% |
| 113 | 67.137 | 3.881.437 | 14,3058% | 14,31% |
| 114 | 67.722,5 | 3.949.159,5 | 14,4324% | 14,43% |
| 115 | 68.308 | 4.017.467,5 | 14,5590% | 14,56% |
| 116 | 68.893,5 | 4.086.361 | 14,6856% | 14,69% |
| 117 | 69.479 | 4.155.840 | 14,8122% | 14,81% |
| 118 | 70.064,5 | 4.225.904,5 | 14,9388% | 14,94% |
| 119 | 70.650 | 4.296.554,5 | 15,0654% | 15,07% |
| 120 | 71.235,5 | 4.367.790 | 15,1920% | 15,19% |
| 121 | 71.821 | 4.439.611 | 15,3186% | 15,32% |
| 122 | 72.406,5 | 4.512.017,5 | 15,4452% | 15,45% |
| 123 | 72.992 | 4.585.009,5 | 15,5718% | 15,57% |
| 124 | 73.577,5 | 4.658.587 | 15,6984% | 15,7% |
| 125 | 74.163 | 4.732.750 | 15,8250% | 15,83% |
| 126 | 74.748,5 | 4.807.498,5 | 15,9516% | 15,95% |
| 127 | 75.334 | 4.882.832,5 | 16,0782% | 16,08% |
| 128 | 75.919,5 | 4.958.752 | 16,2048% | 16,2% |
| 129 | 76.505 | 5.035.257 | 16,3314% | 16,33% |
| 130 | 77.090,5 | 5.112.347,5 | 16,4580% | 16,46% |
| 131 | 77.676 | 5.190.023,5 | 16,5846% | 16,58% |
| 132 | 78.261,5 | 5.268.285 | 16,7112% | 16,71% |
| 133 | 78.847 | 5.347.132 | 16,8378% | 16,84% |
| 134 | 79.432,5 | 5.426.564,5 | 16,9644% | 16,96% |
| 135 | 80.018 | 5.506.582,5 | 17,0910% | 17,09% |
| 136 | 80.603,5 | 5.587.186 | 17,2176% | 17,22% |
| 137 | 81.189 | 5.668.375 | 17,3442% | 17,34% |
| 138 | 81.774,5 | 5.750.149,5 | 17,4708% | 17,47% |
| 139 | 82.360 | 5.832.509,5 | 17,5974% | 17,6% |
| 140 | 82.945,5 | 5.915.455 | 17,7240% | 17,72% |
| 141 | 83.531 | 5.998.986 | 17,8506% | 17,85% |
| 142 | 84.116,5 | 6.083.102,5 | 17,9772% | 17,98% |
| 143 | 84.702 | 6.167.804,5 | 18,1038% | 18,1% |
| 144 | 85.287,5 | 6.253.092 | 18,2304% | 18,23% |
| 145 | 85.873 | 6.338.965 | 18,3570% | 18,36% |
| 146 | 86.458,5 | 6.425.423,5 | 18,4836% | 18,48% |
| 147 | 87.044 | 6.512.467,5 | 18,6102% | 18,61% |
| 148 | 87.629,5 | 6.600.097 | 18,7368% | 18,74% |
| 149 | 88.215 | 6.688.312 | 18,8634% | 18,86% |
| 150 | 88.800,5 | 6.777.112,5 | 18,9900% | 18,99% |
| 151 | 89.386 | 6.866.498,5 | 19,1166% | 19,12% |
| 152 | 89.971,5 | 6.956.470 | 19,2432% | 19,24% |
| 153 | 90.557 | 7.047.027 | 19,3698% | 19,37% |
| 154 | 91.142,5 | 7.138.169,5 | 19,4964% | 19,5% |
| 155 | 91.728 | 7.229.897,5 | 19,6230% | 19,62% |
| 156 | 92.313,5 | 7.322.211 | 19,7496% | 19,75% |
| 157 | 92.899 | 7.415.110 | 19,8762% | 19,88% |
| 158 | 93.484,5 | 7.508.594,5 | 20,0028% | 20% |
| 159 | 94.070 | 7.602.664,5 | 20,1294% | 20,13% |
| 160 | 94.655,5 | 7.697.320 | 20,2560% | 20,26% |
| 161 | 95.241 | 7.792.561 | 20,3826% | 20,38% |
| 162 | 95.826,5 | 7.888.387,5 | 20,5092% | 20,51% |
| 163 | 96.412 | 7.984.799,5 | 20,6358% | 20,64% |
| 164 | 96.997,5 | 8.081.797 | 20,7624% | 20,76% |
| 165 | 97.583 | 8.179.380 | 20,8890% | 20,89% |
| 166 | 98.168,5 | 8.277.548,5 | 21,0156% | 21,02% |
| 167 | 98.754 | 8.376.302,5 | 21,1422% | 21,14% |
| 168 | 99.339,5 | 8.475.642 | 21,2688% | 21,27% |
| 169 | 99.925 | 8.575.567 | 21,3954% | 21,4% |
| 170 | 100.510,5 | 8.676.077,5 | 21,5220% | 21,52% |
| 171 | 101.096 | 8.777.173,5 | 21,6486% | 21,65% |
| 172 | 101.681,5 | 8.878.855 | 21,7752% | 21,78% |
| 173 | 102.267 | 8.981.122 | 21,9018% | 21,9% |
| 174 | 102.852,5 | 9.083.974,5 | 22,0284% | 22,03% |
| 175 | 103.438 | 9.187.412,5 | 22,1550% | 22,15% |
| 176 | 104.023,5 | 9.291.436 | 22,2816% | 22,28% |
| 177 | 104.609 | 9.396.045 | 22,4082% | 22,41% |
| 178 | 105.194,5 | 9.501.239,5 | 22,5348% | 22,53% |
| 179 | 105.780 | 9.607.019,5 | 22,6614% | 22,66% |
| 180 | 106.365,5 | 9.713.385 | 22,7880% | 22,79% |
| 181 | 106.951 | 9.820.336 | 22,9146% | 22,91% |
| 182 | 107.536,5 | 9.927.872,5 | 23,0412% | 23,04% |
| 183 | 108.122 | 10.035.994,5 | 23,1678% | 23,17% |
| 184 | 108.707,5 | 10.144.702 | 23,2944% | 23,29% |
| 185 | 109.293 | 10.253.995 | 23,4210% | 23,42% |
| 186 | 109.878,5 | 10.363.873,5 | 23,5476% | 23,55% |
| 187 | 110.464 | 10.474.337,5 | 23,6742% | 23,67% |
| 188 | 111.049,5 | 10.585.387 | 23,8008% | 23,8% |
| 189 | 111.635 | 10.697.022 | 23,9274% | 23,93% |
| 190 | 112.220,5 | 10.809.242,5 | 24,0540% | 24,05% |
| 191 | 112.806 | 10.922.048,5 | 24,1806% | 24,18% |
| 192 | 113.391,5 | 11.035.440 | 24,3072% | 24,31% |
| 193 | 113.977 | 11.149.417 | 24,4338% | 24,43% |
| 194 | 114.562,5 | 11.263.979,5 | 24,5604% | 24,56% |
| 195 | 115.148 | 11.379.127,5 | 24,6870% | 24,69% |
| 196 | 115.733,5 | 11.494.861 | 24,8136% | 24,81% |
| 197 | 116.319 | 11.611.180 | 24,9402% | 24,94% |
| 198 | 116.904,5 | 11.728.084,5 | 25,0668% | 25,07% |
| 199 | 117.490 | 11.845.574,5 | 25,1934% | 25,19% |
| 200 | 118.075,5 | 11.963.650 | 25,3200% | 25,32% |
| 201 | 118.661 | 12.082.311 | 25,4466% | 25,45% |
| 202 | 119.246,5 | 12.201.557,5 | 25,5732% | 25,57% |
| 203 | 119.832 | 12.321.389,5 | 25,6998% | 25,7% |
| 204 | 120.417,5 | 12.441.807 | 25,8264% | 25,83% |
| 205 | 121.003 | 12.562.810 | 25,9530% | 25,95% |
| 206 | 121.588,5 | 12.684.398,5 | 26,0796% | 26,08% |
| 207 | 122.174 | 12.806.572,5 | 26,2062% | 26,21% |
| 208 | 122.759,5 | 12.929.332 | 26,3328% | 26,33% |
| 209 | 123.345 | 13.052.677 | 26,4594% | 26,46% |
| 210 | 123.930,5 | 13.176.607,5 | 26,5860% | 26,59% |
| 211 | 124.516 | 13.301.123,5 | 26,7126% | 26,71% |
| 212 | 125.101,5 | 13.426.225 | 26,8392% | 26,84% |
| 213 | 125.687 | 13.551.912 | 26,9658% | 26,97% |
| 214 | 126.272,5 | 13.678.184,5 | 27,0924% | 27,09% |
| 215 | 126.858 | 13.805.042,5 | 27,2190% | 27,22% |
| 216 | 127.443,5 | 13.932.486 | 27,3456% | 27,35% |
| 217 | 128.029 | 14.060.515 | 27,4722% | 27,47% |
| 218 | 128.614,5 | 14.189.129,5 | 27,5988% | 27,6% |
| 219 | 129.200 | 14.318.329,5 | 27,7254% | 27,73% |
| 220 | 129.785,5 | 14.448.115 | 27,8520% | 27,85% |
| 221 | 130.371 | 14.578.486 | 27,9786% | 27,98% |
| 222 | 130.956,5 | 14.709.442,5 | 28,1052% | 28,11% |
| 223 | 131.542 | 14.840.984,5 | 28,2318% | 28,23% |
| 224 | 132.127,5 | 14.973.112 | 28,3584% | 28,36% |
| 225 | 132.713 | 15.105.825 | 28,4850% | 28,48% |
| 226 | 133.298,5 | 15.239.123,5 | 28,6116% | 28,61% |
| 227 | 133.884 | 15.373.007,5 | 28,7382% | 28,74% |
| 228 | 134.469,5 | 15.507.477 | 28,8648% | 28,86% |
| 229 | 135.055 | 15.642.532 | 28,9914% | 28,99% |
| 230 | 135.640,5 | 15.778.172,5 | 29,1180% | 29,12% |
| 231 | 136.226 | 15.914.398,5 | 29,2446% | 29,24% |
| 232 | 136.811,5 | 16.051.210 | 29,3712% | 29,37% |
| 233 | 137.397 | 16.188.607 | 29,4978% | 29,5% |
| 234 | 137.982,5 | 16.326.589,5 | 29,6244% | 29,62% |
| 235 | 138.568 | 16.465.157,5 | 29,7510% | 29,75% |
| 236 | 139.153,5 | 16.604.311 | 29,8776% | 29,88% |
| 237 | 139.739 | 16.744.050 | 30,0042% | 30% |
| 238 | 140.324,5 | 16.884.374,5 | 30,1308% | 30,13% |
| 239 | 140.910 | 17.025.284,5 | 30,2574% | 30,26% |
| 240 | 141.495,5 | 17.166.780 | 30,3840% | 30,38% |
| 241 | 142.081 | 17.308.861 | 30,5106% | 30,51% |
| 242 | 142.666,5 | 17.451.527,5 | 30,6372% | 30,64% |
| 243 | 143.252 | 17.594.779,5 | 30,7638% | 30,76% |
| 244 | 143.837,5 | 17.738.617 | 30,8904% | 30,89% |
| 245 | 144.423 | 17.883.040 | 31,0170% | 31,02% |
| 246 | 145.008,5 | 18.028.048,5 | 31,1436% | 31,14% |
| 247 | 145.594 | 18.173.642,5 | 31,2702% | 31,27% |
| 248 | 146.179,5 | 18.319.822 | 31,3968% | 31,4% |
| 249 | 146.765 | 18.466.587 | 31,5234% | 31,52% |
| 250 | 147.350,5 | 18.613.937,5 | 31,6500% | 31,65% |
| 251 | 147.936 | 18.761.873,5 | 31,7766% | 31,78% |
| 252 | 148.521,5 | 18.910.395 | 31,9032% | 31,9% |
| 253 | 149.107 | 19.059.502 | 32,0298% | 32,03% |
| 254 | 149.692,5 | 19.209.194,5 | 32,1564% | 32,16% |
| 255 | 150.278 | 19.359.472,5 | 32,2830% | 32,28% |
| 256 | 150.863,5 | 19.510.336 | 32,4096% | 32,41% |
| 257 | 151.449 | 19.661.785 | 32,5362% | 32,54% |
| 258 | 152.034,5 | 19.813.819,5 | 32,6628% | 32,66% |
| 259 | 152.620 | 19.966.439,5 | 32,7894% | 32,79% |
| 260 | 153.205,5 | 20.119.645 | 32,9160% | 32,92% |
| 261 | 153.791 | 20.273.436 | 33,0426% | 33,04% |
| 262 | 154.376,5 | 20.427.812,5 | 33,1692% | 33,17% |
| 263 | 154.962 | 20.582.774,5 | 33,2958% | 33,3% |
| 264 | 155.547,5 | 20.738.322 | 33,4224% | 33,42% |
| 265 | 156.133 | 20.894.455 | 33,5490% | 33,55% |
| 266 | 156.718,5 | 21.051.173,5 | 33,6756% | 33,68% |
| 267 | 157.304 | 21.208.477,5 | 33,8022% | 33,8% |
| 268 | 157.889,5 | 21.366.367 | 33,9288% | 33,93% |
| 269 | 158.475 | 21.524.842 | 34,0554% | 34,06% |
| 270 | 159.060,5 | 21.683.902,5 | 34,1820% | 34,18% |
| 271 | 159.646 | 21.843.548,5 | 34,3086% | 34,31% |
| 272 | 160.231,5 | 22.003.780 | 34,4352% | 34,44% |
| 273 | 160.817 | 22.164.597 | 34,5618% | 34,56% |
| 274 | 161.402,5 | 22.325.999,5 | 34,6884% | 34,69% |
| 275 | 161.988 | 22.487.987,5 | 34,8150% | 34,82% |
| 276 | 162.573,5 | 22.650.561 | 34,9416% | 34,94% |
| 277 | 163.159 | 22.813.720 | 35,0682% | 35,07% |
| 278 | 163.744,5 | 22.977.464,5 | 35,1948% | 35,19% |
| 279 | 164.330 | 23.141.794,5 | 35,3214% | 35,32% |
| 280 | 164.915,5 | 23.306.710 | 35,4480% | 35,45% |
| 281 | 165.501 | 23.472.211 | 35,5746% | 35,57% |
| 282 | 166.086,5 | 23.638.297,5 | 35,7012% | 35,7% |
| 283 | 166.672 | 23.804.969,5 | 35,8278% | 35,83% |
| 284 | 167.257,5 | 23.972.227 | 35,9544% | 35,95% |
| 285 | 167.843 | 24.140.070 | 36,0810% | 36,08% |
| 286 | 168.428,5 | 24.308.498,5 | 36,2076% | 36,21% |
| 287 | 169.014 | 24.477.512,5 | 36,3342% | 36,33% |
| 288 | 169.599,5 | 24.647.112 | 36,4608% | 36,46% |
| 289 | 170.185 | 24.817.297 | 36,5874% | 36,59% |
| 290 | 170.770,5 | 24.988.067,5 | 36,7140% | 36,71% |
| 291 | 171.356 | 25.159.423,5 | 36,8406% | 36,84% |
| 292 | 171.941,5 | 25.331.365 | 36,9672% | 36,97% |
| 293 | 172.527 | 25.503.892 | 37,0938% | 37,09% |
| 294 | 173.112,5 | 25.677.004,5 | 37,2204% | 37,22% |
| 295 | 173.698 | 25.850.702,5 | 37,3470% | 37,35% |
| 296 | 174.283,5 | 26.024.986 | 37,4736% | 37,47% |
| 297 | 174.869 | 26.199.855 | 37,6002% | 37,6% |
| 298 | 175.454,5 | 26.375.309,5 | 37,7268% | 37,73% |
| 299 | 176.040 | 26.551.349,5 | 37,8534% | 37,85% |
| 300 | 176.625,5 | 26.727.975 | 37,9800% | 37,98% |
| 301 | 177.211 | 26.905.186 | 38,1066% | 38,11% |
| 302 | 177.796,5 | 27.082.982,5 | 38,2332% | 38,23% |
| 303 | 178.382 | 27.261.364,5 | 38,3598% | 38,36% |
| 304 | 178.967,5 | 27.440.332 | 38,4864% | 38,49% |
| 305 | 179.553 | 27.619.885 | 38,6130% | 38,61% |
| 306 | 180.138,5 | 27.800.023,5 | 38,7396% | 38,74% |
| 307 | 180.724 | 27.980.747,5 | 38,8662% | 38,87% |
| 308 | 181.309,5 | 28.162.057 | 38,9928% | 38,99% |
| 309 | 181.895 | 28.343.952 | 39,1194% | 39,12% |
| 310 | 182.480,5 | 28.526.432,5 | 39,2460% | 39,25% |
| 311 | 183.066 | 28.709.498,5 | 39,3726% | 39,37% |
| 312 | 183.651,5 | 28.893.150 | 39,4992% | 39,5% |
| 313 | 184.237 | 29.077.387 | 39,6258% | 39,63% |
| 314 | 184.822,5 | 29.262.209,5 | 39,7524% | 39,75% |
| 315 | 185.408 | 29.447.617,5 | 39,8790% | 39,88% |
| 316 | 185.993,5 | 29.633.611 | 40,0056% | 40,01% |
| 317 | 186.579 | 29.820.190 | 40,1322% | 40,13% |
| 318 | 187.164,5 | 30.007.354,5 | 40,2588% | 40,26% |
| 319 | 187.750 | 30.195.104,5 | 40,3854% | 40,39% |
| 320 | 188.335,5 | 30.383.440 | 40,5120% | 40,51% |
| 321 | 188.921 | 30.572.361 | 40,6386% | 40,64% |
| 322 | 189.506,5 | 30.761.867,5 | 40,7652% | 40,77% |
| 323 | 190.092 | 30.951.959,5 | 40,8918% | 40,89% |
| 324 | 190.677,5 | 31.142.637 | 41,0184% | 41,02% |
| 325 | 191.263 | 31.333.900 | 41,1450% | 41,15% |
| 326 | 191.848,5 | 31.525.748,5 | 41,2716% | 41,27% |
| 327 | 192.434 | 31.718.182,5 | 41,3982% | 41,4% |
| 328 | 193.019,5 | 31.911.202 | 41,5248% | 41,52% |
| 329 | 193.605 | 32.104.807 | 41,6514% | 41,65% |
| 330 | 194.190,5 | 32.298.997,5 | 41,7780% | 41,78% |
| 331 | 194.776 | 32.493.773,5 | 41,9046% | 41,9% |
| 332 | 195.361,5 | 32.689.135 | 42,0312% | 42,03% |
| 333 | 195.947 | 32.885.082 | 42,1578% | 42,16% |
| 334 | 196.532,5 | 33.081.614,5 | 42,2844% | 42,28% |
| 335 | 197.118 | 33.278.732,5 | 42,4110% | 42,41% |
| 336 | 197.703,5 | 33.476.436 | 42,5376% | 42,54% |
| 337 | 198.289 | 33.674.725 | 42,6642% | 42,66% |
| 338 | 198.874,5 | 33.873.599,5 | 42,7908% | 42,79% |
| 339 | 199.460 | 34.073.059,5 | 42,9174% | 42,92% |
| 340 | 200.045,5 | 34.273.105 | 43,0440% | 43,04% |
| 341 | 200.631 | 34.473.736 | 43,1706% | 43,17% |
| 342 | 201.216,5 | 34.674.952,5 | 43,2972% | 43,3% |
| 343 | 201.802 | 34.876.754,5 | 43,4238% | 43,42% |
| 344 | 202.387,5 | 35.079.142 | 43,5504% | 43,55% |
| 345 | 202.973 | 35.282.115 | 43,6770% | 43,68% |
| 346 | 203.558,5 | 35.485.673,5 | 43,8036% | 43,8% |
| 347 | 204.144 | 35.689.817,5 | 43,9302% | 43,93% |
| 348 | 204.729,5 | 35.894.547 | 44,0568% | 44,06% |
| 349 | 205.315 | 36.099.862 | 44,1834% | 44,18% |
| 350 | 205.900,5 | 36.305.762,5 | 44,3100% | 44,31% |
| 351 | 206.486 | 36.512.248,5 | 44,4366% | 44,44% |
| 352 | 207.071,5 | 36.719.320 | 44,5632% | 44,56% |
| 353 | 207.657 | 36.926.977 | 44,6898% | 44,69% |
| 354 | 208.242,5 | 37.135.219,5 | 44,8164% | 44,82% |
| 355 | 208.828 | 37.344.047,5 | 44,9430% | 44,94% |
| 356 | 209.413,5 | 37.553.461 | 45,0696% | 45,07% |
| 357 | 209.999 | 37.763.460 | 45,1962% | 45,2% |
| 358 | 210.584,5 | 37.974.044,5 | 45,3228% | 45,32% |
| 359 | 211.170 | 38.185.214,5 | 45,4494% | 45,45% |
| 360 | 211.755,5 | 38.396.970 | 45,5760% | 45,58% |
| 361 | 212.341 | 38.609.311 | 45,7026% | 45,7% |
| 362 | 212.926,5 | 38.822.237,5 | 45,8292% | 45,83% |
| 363 | 213.512 | 39.035.749,5 | 45,9558% | 45,96% |
| 364 | 214.097,5 | 39.249.847 | 46,0824% | 46,08% |
| 365 | 214.683 | 39.464.530 | 46,2090% | 46,21% |
| 366 | 215.268,5 | 39.679.798,5 | 46,3356% | 46,34% |
| 367 | 215.854 | 39.895.652,5 | 46,4622% | 46,46% |
| 368 | 216.439,5 | 40.112.092 | 46,5888% | 46,59% |
| 369 | 217.025 | 40.329.117 | 46,7154% | 46,72% |
| 370 | 217.610,5 | 40.546.727,5 | 46,8420% | 46,84% |
| 371 | 218.196 | 40.764.923,5 | 46,9686% | 46,97% |
| 372 | 218.781,5 | 40.983.705 | 47,0952% | 47,1% |
| 373 | 219.367 | 41.203.072 | 47,2218% | 47,22% |
| 374 | 219.952,5 | 41.423.024,5 | 47,3484% | 47,35% |
| 375 | 220.538 | 41.643.562,5 | 47,4750% | 47,48% |
| 376 | 221.123,5 | 41.864.686 | 47,6016% | 47,6% |
| 377 | 221.709 | 42.086.395 | 47,7282% | 47,73% |
| 378 | 222.294,5 | 42.308.689,5 | 47,8548% | 47,85% |
| 379 | 222.880 | 42.531.569,5 | 47,9814% | 47,98% |
| 380 | 223.465,5 | 42.755.035 | 48,1080% | 48,11% |
| 381 | 224.051 | 42.979.086 | 48,2346% | 48,23% |
| 382 | 224.636,5 | 43.203.722,5 | 48,3612% | 48,36% |
| 383 | 225.222 | 43.428.944,5 | 48,4878% | 48,49% |
| 384 | 225.807,5 | 43.654.752 | 48,6144% | 48,61% |
| 385 | 226.393 | 43.881.145 | 48,7410% | 48,74% |
| 386 | 226.978,5 | 44.108.123,5 | 48,8676% | 48,87% |
| 387 | 227.564 | 44.335.687,5 | 48,9942% | 48,99% |
| 388 | 228.149,5 | 44.563.837 | 49,1208% | 49,12% |
| 389 | 228.735 | 44.792.572 | 49,2474% | 49,25% |
| 390 | 229.320,5 | 45.021.892,5 | 49,3740% | 49,37% |
| 391 | 229.906 | 45.251.798,5 | 49,5006% | 49,5% |
| 392 | 230.491,5 | 45.482.290 | 49,6272% | 49,63% |
| 393 | 231.077 | 45.713.367 | 49,7538% | 49,75% |
| 394 | 231.662,5 | 45.945.029,5 | 49,8804% | 49,88% |
| 395 | 232.248 | 46.177.277,5 | 50,0070% | 50,01% |
| 396 | 232.833,5 | 46.410.111 | 50,1336% | 50,13% |
| 397 | 233.419 | 46.643.530 | 50,2602% | 50,26% |
| 398 | 234.004,5 | 46.877.534,5 | 50,3868% | 50,39% |
| 399 | 234.590 | 47.112.124,5 | 50,5134% | 50,51% |
| 400 | 235.175,5 | 47.347.300 | 50,6400% | 50,64% |
| 401 | 235.761 | 47.583.061 | 50,7666% | 50,77% |
| 402 | 236.346,5 | 47.819.407,5 | 50,8932% | 50,89% |
| 403 | 236.932 | 48.056.339,5 | 51,0198% | 51,02% |
| 404 | 237.517,5 | 48.293.857 | 51,1464% | 51,15% |
| 405 | 238.103 | 48.531.960 | 51,2730% | 51,27% |
| 406 | 238.688,5 | 48.770.648,5 | 51,3996% | 51,4% |
| 407 | 239.274 | 49.009.922,5 | 51,5262% | 51,53% |
| 408 | 239.859,5 | 49.249.782 | 51,6528% | 51,65% |
| 409 | 240.445 | 49.490.227 | 51,7794% | 51,78% |
| 410 | 241.030,5 | 49.731.257,5 | 51,9060% | 51,91% |
| 411 | 241.616 | 49.972.873,5 | 52,0326% | 52,03% |
| 412 | 242.201,5 | 50.215.075 | 52,1592% | 52,16% |
| 413 | 242.787 | 50.457.862 | 52,2858% | 52,29% |
| 414 | 243.372,5 | 50.701.234,5 | 52,4124% | 52,41% |
| 415 | 243.958 | 50.945.192,5 | 52,5390% | 52,54% |
| 416 | 244.543,5 | 51.189.736 | 52,6656% | 52,67% |
| 417 | 245.129 | 51.434.865 | 52,7922% | 52,79% |
| 418 | 245.714,5 | 51.680.579,5 | 52,9188% | 52,92% |
| 419 | 246.300 | 51.926.879,5 | 53,0454% | 53,05% |
| 420 | 246.885,5 | 52.173.765 | 53,1720% | 53,17% |
| 421 | 247.471 | 52.421.236 | 53,2986% | 53,3% |
| 422 | 248.056,5 | 52.669.292,5 | 53,4252% | 53,43% |
| 423 | 248.642 | 52.917.934,5 | 53,5518% | 53,55% |
| 424 | 249.227,5 | 53.167.162 | 53,6784% | 53,68% |
| 425 | 249.813 | 53.416.975 | 53,8050% | 53,81% |
| 426 | 250.398,5 | 53.667.373,5 | 53,9316% | 53,93% |
| 427 | 250.984 | 53.918.357,5 | 54,0582% | 54,06% |
| 428 | 251.569,5 | 54.169.927 | 54,1848% | 54,18% |
| 429 | 252.155 | 54.422.082 | 54,3114% | 54,31% |
| 430 | 252.740,5 | 54.674.822,5 | 54,4380% | 54,44% |
| 431 | 253.326 | 54.928.148,5 | 54,5646% | 54,56% |
| 432 | 253.911,5 | 55.182.060 | 54,6912% | 54,69% |
| 433 | 254.497 | 55.436.557 | 54,8178% | 54,82% |
| 434 | 255.082,5 | 55.691.639,5 | 54,9444% | 54,94% |
| 435 | 255.668 | 55.947.307,5 | 55,0710% | 55,07% |
| 436 | 256.253,5 | 56.203.561 | 55,1976% | 55,2% |
| 437 | 256.839 | 56.460.400 | 55,3242% | 55,32% |
| 438 | 257.424,5 | 56.717.824,5 | 55,4508% | 55,45% |
| 439 | 258.010 | 56.975.834,5 | 55,5774% | 55,58% |
| 440 | 258.595,5 | 57.234.430 | 55,7040% | 55,7% |
| 441 | 259.181 | 57.493.611 | 55,8306% | 55,83% |
| 442 | 259.766,5 | 57.753.377,5 | 55,9572% | 55,96% |
| 443 | 260.352 | 58.013.729,5 | 56,0838% | 56,08% |
| 444 | 260.937,5 | 58.274.667 | 56,2104% | 56,21% |
| 445 | 261.523 | 58.536.190 | 56,3370% | 56,34% |
| 446 | 262.108,5 | 58.798.298,5 | 56,4636% | 56,46% |
| 447 | 262.694 | 59.060.992,5 | 56,5902% | 56,59% |
| 448 | 263.279,5 | 59.324.272 | 56,7168% | 56,72% |
| 449 | 263.865 | 59.588.137 | 56,8434% | 56,84% |
| 450 | 264.450,5 | 59.852.587,5 | 56,9700% | 56,97% |
| 451 | 265.036 | 60.117.623,5 | 57,0966% | 57,1% |
| 452 | 265.621,5 | 60.383.245 | 57,2232% | 57,22% |
| 453 | 266.207 | 60.649.452 | 57,3498% | 57,35% |
| 454 | 266.792,5 | 60.916.244,5 | 57,4764% | 57,48% |
| 455 | 267.378 | 61.183.622,5 | 57,6030% | 57,6% |
| 456 | 267.963,5 | 61.451.586 | 57,7296% | 57,73% |
| 457 | 268.549 | 61.720.135 | 57,8562% | 57,86% |
| 458 | 269.134,5 | 61.989.269,5 | 57,9828% | 57,98% |
| 459 | 269.720 | 62.258.989,5 | 58,1094% | 58,11% |
| 460 | 270.305,5 | 62.529.295 | 58,2360% | 58,24% |
| 461 | 270.891 | 62.800.186 | 58,3626% | 58,36% |
| 462 | 271.476,5 | 63.071.662,5 | 58,4892% | 58,49% |
| 463 | 272.062 | 63.343.724,5 | 58,6158% | 58,62% |
| 464 | 272.647,5 | 63.616.372 | 58,7424% | 58,74% |
| 465 | 273.233 | 63.889.605 | 58,8690% | 58,87% |
| 466 | 273.818,5 | 64.163.423,5 | 58,9956% | 59% |
| 467 | 274.404 | 64.437.827,5 | 59,1222% | 59,12% |
| 468 | 274.989,5 | 64.712.817 | 59,2488% | 59,25% |
| 469 | 275.575 | 64.988.392 | 59,3754% | 59,38% |
| 470 | 276.160,5 | 65.264.552,5 | 59,5020% | 59,5% |
| 471 | 276.746 | 65.541.298,5 | 59,6286% | 59,63% |
| 472 | 277.331,5 | 65.818.630 | 59,7552% | 59,76% |
| 473 | 277.917 | 66.096.547 | 59,8818% | 59,88% |
| 474 | 278.502,5 | 66.375.049,5 | 60,0084% | 60,01% |
| 475 | 279.088 | 66.654.137,5 | 60,1350% | 60,14% |
| 476 | 279.673,5 | 66.933.811 | 60,2616% | 60,26% |
| 477 | 280.259 | 67.214.070 | 60,3882% | 60,39% |
| 478 | 280.844,5 | 67.494.914,5 | 60,5148% | 60,51% |
| 479 | 281.430 | 67.776.344,5 | 60,6414% | 60,64% |
| 480 | 282.015,5 | 68.058.360 | 60,7680% | 60,77% |
| 481 | 282.601 | 68.340.961 | 60,8946% | 60,89% |
| 482 | 283.186,5 | 68.624.147,5 | 61,0212% | 61,02% |
| 483 | 283.772 | 68.907.919,5 | 61,1478% | 61,15% |
| 484 | 284.357,5 | 69.192.277 | 61,2744% | 61,27% |
| 485 | 284.943 | 69.477.220 | 61,4010% | 61,4% |
| 486 | 285.528,5 | 69.762.748,5 | 61,5276% | 61,53% |
| 487 | 286.114 | 70.048.862,5 | 61,6542% | 61,65% |
| 488 | 286.699,5 | 70.335.562 | 61,7808% | 61,78% |
| 489 | 287.285 | 70.622.847 | 61,9074% | 61,91% |
| 490 | 287.870,5 | 70.910.717,5 | 62,0340% | 62,03% |
| 491 | 288.456 | 71.199.173,5 | 62,1606% | 62,16% |
| 492 | 289.041,5 | 71.488.215 | 62,2872% | 62,29% |
| 493 | 289.627 | 71.777.842 | 62,4138% | 62,41% |
| 494 | 290.212,5 | 72.068.054,5 | 62,5404% | 62,54% |
| 495 | 290.798 | 72.358.852,5 | 62,6670% | 62,67% |
| 496 | 291.383,5 | 72.650.236 | 62,7936% | 62,79% |
| 497 | 291.969 | 72.942.205 | 62,9202% | 62,92% |
| 498 | 292.554,5 | 73.234.759,5 | 63,0468% | 63,05% |
| 499 | 293.140 | 73.527.899,5 | 63,1734% | 63,17% |
| 500 | 293.725,5 | 73.821.625 | 63,3000% | 63,3% |

### Anexo — Ceifa

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.366 | 1.366 | 0,0997% | 0,0997% |
| 2 | 1.853,9 | 3.219,9 | 0,1994% | 0,1994% |
| 3 | 2.341,8 | 5.561,7 | 0,2991% | 0,2991% |
| 4 | 2.829,7 | 8.391,4 | 0,3988% | 0,3988% |
| 5 | 3.317,6 | 11.709 | 0,4985% | 0,4985% |
| 6 | 3.805,5 | 15.514,5 | 0,5982% | 0,5982% |
| 7 | 4.293,4 | 19.807,9 | 0,6979% | 0,6979% |
| 8 | 4.781,3 | 24.589,2 | 0,7976% | 0,7976% |
| 9 | 5.269,2 | 29.858,4 | 0,8973% | 0,8973% |
| 10 | 5.757,1 | 35.615,5 | 0,9970% | 0,997% |
| 11 | 6.245 | 41.860,5 | 1,0967% | 1,097% |
| 12 | 6.732,9 | 48.593,4 | 1,1964% | 1,196% |
| 13 | 7.220,8 | 55.814,2 | 1,2961% | 1,296% |
| 14 | 7.708,7 | 63.522,9 | 1,3958% | 1,396% |
| 15 | 8.196,6 | 71.719,5 | 1,4955% | 1,495% |
| 16 | 8.684,5 | 80.404 | 1,5952% | 1,595% |
| 17 | 9.172,4 | 89.576,4 | 1,6949% | 1,695% |
| 18 | 9.660,3 | 99.236,7 | 1,7946% | 1,795% |
| 19 | 10.148,2 | 109.384,9 | 1,8943% | 1,894% |
| 20 | 10.636,1 | 120.021 | 1,9940% | 1,994% |
| 21 | 11.124 | 131.145 | 2,0937% | 2,094% |
| 22 | 11.611,9 | 142.756,9 | 2,1934% | 2,193% |
| 23 | 12.099,8 | 154.856,7 | 2,2931% | 2,293% |
| 24 | 12.587,7 | 167.444,4 | 2,3928% | 2,393% |
| 25 | 13.075,6 | 180.520 | 2,4925% | 2,492% |
| 26 | 13.563,5 | 194.083,5 | 2,5922% | 2,592% |
| 27 | 14.051,4 | 208.134,9 | 2,6919% | 2,692% |
| 28 | 14.539,3 | 222.674,2 | 2,7916% | 2,792% |
| 29 | 15.027,2 | 237.701,4 | 2,8913% | 2,891% |
| 30 | 15.515,1 | 253.216,5 | 2,9910% | 2,991% |
| 31 | 16.003 | 269.219,5 | 3,0907% | 3,091% |
| 32 | 16.490,9 | 285.710,4 | 3,1904% | 3,19% |
| 33 | 16.978,8 | 302.689,2 | 3,2901% | 3,29% |
| 34 | 17.466,7 | 320.155,9 | 3,3898% | 3,39% |
| 35 | 17.954,6 | 338.110,5 | 3,4895% | 3,489% |
| 36 | 18.442,5 | 356.553 | 3,5892% | 3,589% |
| 37 | 18.930,4 | 375.483,4 | 3,6889% | 3,689% |
| 38 | 19.418,3 | 394.901,7 | 3,7886% | 3,789% |
| 39 | 19.906,2 | 414.807,9 | 3,8883% | 3,888% |
| 40 | 20.394,1 | 435.202 | 3,9880% | 3,988% |
| 41 | 20.882 | 456.084 | 4,0877% | 4,088% |
| 42 | 21.369,9 | 477.453,9 | 4,1874% | 4,187% |
| 43 | 21.857,8 | 499.311,7 | 4,2871% | 4,287% |
| 44 | 22.345,7 | 521.657,4 | 4,3868% | 4,387% |
| 45 | 22.833,6 | 544.491 | 4,4865% | 4,487% |
| 46 | 23.321,5 | 567.812,5 | 4,5862% | 4,586% |
| 47 | 23.809,4 | 591.621,9 | 4,6859% | 4,686% |
| 48 | 24.297,3 | 615.919,2 | 4,7856% | 4,786% |
| 49 | 24.785,2 | 640.704,4 | 4,8853% | 4,885% |
| 50 | 25.273,1 | 665.977,5 | 4,9850% | 4,985% |
| 51 | 25.761 | 691.738,5 | 5,0847% | 5,085% |
| 52 | 26.248,9 | 717.987,4 | 5,1844% | 5,184% |
| 53 | 26.736,8 | 744.724,2 | 5,2841% | 5,284% |
| 54 | 27.224,7 | 771.948,9 | 5,3838% | 5,384% |
| 55 | 27.712,6 | 799.661,5 | 5,4835% | 5,484% |
| 56 | 28.200,5 | 827.862 | 5,5832% | 5,583% |
| 57 | 28.688,4 | 856.550,4 | 5,6829% | 5,683% |
| 58 | 29.176,3 | 885.726,7 | 5,7826% | 5,783% |
| 59 | 29.664,2 | 915.390,9 | 5,8823% | 5,882% |
| 60 | 30.152,1 | 945.543 | 5,9820% | 5,982% |
| 61 | 30.640 | 976.183 | 6,0817% | 6,082% |
| 62 | 31.127,9 | 1.007.310,9 | 6,1814% | 6,181% |
| 63 | 31.615,8 | 1.038.926,7 | 6,2811% | 6,281% |
| 64 | 32.103,7 | 1.071.030,4 | 6,3808% | 6,381% |
| 65 | 32.591,6 | 1.103.622 | 6,4805% | 6,481% |
| 66 | 33.079,5 | 1.136.701,5 | 6,5802% | 6,58% |
| 67 | 33.567,4 | 1.170.268,9 | 6,6799% | 6,68% |
| 68 | 34.055,3 | 1.204.324,2 | 6,7796% | 6,78% |
| 69 | 34.543,2 | 1.238.867,4 | 6,8793% | 6,879% |
| 70 | 35.031,1 | 1.273.898,5 | 6,9790% | 6,979% |
| 71 | 35.519 | 1.309.417,5 | 7,0787% | 7,079% |
| 72 | 36.006,9 | 1.345.424,4 | 7,1784% | 7,178% |
| 73 | 36.494,8 | 1.381.919,2 | 7,2781% | 7,278% |
| 74 | 36.982,7 | 1.418.901,9 | 7,3778% | 7,378% |
| 75 | 37.470,6 | 1.456.372,5 | 7,4775% | 7,478% |
| 76 | 37.958,5 | 1.494.331 | 7,5772% | 7,577% |
| 77 | 38.446,4 | 1.532.777,4 | 7,6769% | 7,677% |
| 78 | 38.934,3 | 1.571.711,7 | 7,7766% | 7,777% |
| 79 | 39.422,2 | 1.611.133,9 | 7,8763% | 7,876% |
| 80 | 39.910,1 | 1.651.044 | 7,9760% | 7,976% |
| 81 | 40.398 | 1.691.442 | 8,0757% | 8,076% |
| 82 | 40.885,9 | 1.732.327,9 | 8,1754% | 8,175% |
| 83 | 41.373,8 | 1.773.701,7 | 8,2751% | 8,275% |
| 84 | 41.861,7 | 1.815.563,4 | 8,3748% | 8,375% |
| 85 | 42.349,6 | 1.857.913 | 8,4745% | 8,475% |
| 86 | 42.837,5 | 1.900.750,5 | 8,5742% | 8,574% |
| 87 | 43.325,4 | 1.944.075,9 | 8,6739% | 8,674% |
| 88 | 43.813,3 | 1.987.889,2 | 8,7736% | 8,774% |
| 89 | 44.301,2 | 2.032.190,4 | 8,8733% | 8,873% |
| 90 | 44.789,1 | 2.076.979,5 | 8,9730% | 8,973% |
| 91 | 45.277 | 2.122.256,5 | 9,0727% | 9,073% |
| 92 | 45.764,9 | 2.168.021,4 | 9,1724% | 9,172% |
| 93 | 46.252,8 | 2.214.274,2 | 9,2721% | 9,272% |
| 94 | 46.740,7 | 2.261.014,9 | 9,3718% | 9,372% |
| 95 | 47.228,6 | 2.308.243,5 | 9,4715% | 9,472% |
| 96 | 47.716,5 | 2.355.960 | 9,5712% | 9,571% |
| 97 | 48.204,4 | 2.404.164,4 | 9,6709% | 9,671% |
| 98 | 48.692,3 | 2.452.856,7 | 9,7706% | 9,771% |
| 99 | 49.180,2 | 2.502.036,9 | 9,8703% | 9,87% |
| 100 | 49.668,1 | 2.551.705 | 9,9700% | 9,97% |
| 101 | 50.156 | 2.601.861 | 10,0697% | 10,07% |
| 102 | 50.643,9 | 2.652.504,9 | 10,1694% | 10,17% |
| 103 | 51.131,8 | 2.703.636,7 | 10,2691% | 10,27% |
| 104 | 51.619,7 | 2.755.256,4 | 10,3688% | 10,37% |
| 105 | 52.107,6 | 2.807.364 | 10,4685% | 10,47% |
| 106 | 52.595,5 | 2.859.959,5 | 10,5682% | 10,57% |
| 107 | 53.083,4 | 2.913.042,9 | 10,6679% | 10,67% |
| 108 | 53.571,3 | 2.966.614,2 | 10,7676% | 10,77% |
| 109 | 54.059,2 | 3.020.673,4 | 10,8673% | 10,87% |
| 110 | 54.547,1 | 3.075.220,5 | 10,9670% | 10,97% |
| 111 | 55.035 | 3.130.255,5 | 11,0667% | 11,07% |
| 112 | 55.522,9 | 3.185.778,4 | 11,1664% | 11,17% |
| 113 | 56.010,8 | 3.241.789,2 | 11,2661% | 11,27% |
| 114 | 56.498,7 | 3.298.287,9 | 11,3658% | 11,37% |
| 115 | 56.986,6 | 3.355.274,5 | 11,4655% | 11,47% |
| 116 | 57.474,5 | 3.412.749 | 11,5652% | 11,57% |
| 117 | 57.962,4 | 3.470.711,4 | 11,6649% | 11,66% |
| 118 | 58.450,3 | 3.529.161,7 | 11,7646% | 11,76% |
| 119 | 58.938,2 | 3.588.099,9 | 11,8643% | 11,86% |
| 120 | 59.426,1 | 3.647.526 | 11,9640% | 11,96% |
| 121 | 59.914 | 3.707.440 | 12,0637% | 12,06% |
| 122 | 60.401,9 | 3.767.841,9 | 12,1634% | 12,16% |
| 123 | 60.889,8 | 3.828.731,7 | 12,2631% | 12,26% |
| 124 | 61.377,7 | 3.890.109,4 | 12,3628% | 12,36% |
| 125 | 61.865,6 | 3.951.975 | 12,4625% | 12,46% |
| 126 | 62.353,5 | 4.014.328,5 | 12,5622% | 12,56% |
| 127 | 62.841,4 | 4.077.169,9 | 12,6619% | 12,66% |
| 128 | 63.329,3 | 4.140.499,2 | 12,7616% | 12,76% |
| 129 | 63.817,2 | 4.204.316,4 | 12,8613% | 12,86% |
| 130 | 64.305,1 | 4.268.621,5 | 12,9610% | 12,96% |
| 131 | 64.793 | 4.333.414,5 | 13,0607% | 13,06% |
| 132 | 65.280,9 | 4.398.695,4 | 13,1604% | 13,16% |
| 133 | 65.768,8 | 4.464.464,2 | 13,2601% | 13,26% |
| 134 | 66.256,7 | 4.530.720,9 | 13,3598% | 13,36% |
| 135 | 66.744,6 | 4.597.465,5 | 13,4595% | 13,46% |
| 136 | 67.232,5 | 4.664.698 | 13,5592% | 13,56% |
| 137 | 67.720,4 | 4.732.418,4 | 13,6589% | 13,66% |
| 138 | 68.208,3 | 4.800.626,7 | 13,7586% | 13,76% |
| 139 | 68.696,2 | 4.869.322,9 | 13,8583% | 13,86% |
| 140 | 69.184,1 | 4.938.507 | 13,9580% | 13,96% |
| 141 | 69.672 | 5.008.179 | 14,0577% | 14,06% |
| 142 | 70.159,9 | 5.078.338,9 | 14,1574% | 14,16% |
| 143 | 70.647,8 | 5.148.986,7 | 14,2571% | 14,26% |
| 144 | 71.135,7 | 5.220.122,4 | 14,3568% | 14,36% |
| 145 | 71.623,6 | 5.291.746 | 14,4565% | 14,46% |
| 146 | 72.111,5 | 5.363.857,5 | 14,5562% | 14,56% |
| 147 | 72.599,4 | 5.436.456,9 | 14,6559% | 14,66% |
| 148 | 73.087,3 | 5.509.544,2 | 14,7556% | 14,76% |
| 149 | 73.575,2 | 5.583.119,4 | 14,8553% | 14,86% |
| 150 | 74.063,1 | 5.657.182,5 | 14,9550% | 14,96% |
| 151 | 74.551 | 5.731.733,5 | 15,0547% | 15,05% |
| 152 | 75.038,9 | 5.806.772,4 | 15,1544% | 15,15% |
| 153 | 75.526,8 | 5.882.299,2 | 15,2541% | 15,25% |
| 154 | 76.014,7 | 5.958.313,9 | 15,3538% | 15,35% |
| 155 | 76.502,6 | 6.034.816,5 | 15,4535% | 15,45% |
| 156 | 76.990,5 | 6.111.807 | 15,5532% | 15,55% |
| 157 | 77.478,4 | 6.189.285,4 | 15,6529% | 15,65% |
| 158 | 77.966,3 | 6.267.251,7 | 15,7526% | 15,75% |
| 159 | 78.454,2 | 6.345.705,9 | 15,8523% | 15,85% |
| 160 | 78.942,1 | 6.424.648 | 15,9520% | 15,95% |
| 161 | 79.430 | 6.504.078 | 16,0517% | 16,05% |
| 162 | 79.917,9 | 6.583.995,9 | 16,1514% | 16,15% |
| 163 | 80.405,8 | 6.664.401,7 | 16,2511% | 16,25% |
| 164 | 80.893,7 | 6.745.295,4 | 16,3508% | 16,35% |
| 165 | 81.381,6 | 6.826.677 | 16,4505% | 16,45% |
| 166 | 81.869,5 | 6.908.546,5 | 16,5502% | 16,55% |
| 167 | 82.357,4 | 6.990.903,9 | 16,6499% | 16,65% |
| 168 | 82.845,3 | 7.073.749,2 | 16,7496% | 16,75% |
| 169 | 83.333,2 | 7.157.082,4 | 16,8493% | 16,85% |
| 170 | 83.821,1 | 7.240.903,5 | 16,9490% | 16,95% |
| 171 | 84.309 | 7.325.212,5 | 17,0487% | 17,05% |
| 172 | 84.796,9 | 7.410.009,4 | 17,1484% | 17,15% |
| 173 | 85.284,8 | 7.495.294,2 | 17,2481% | 17,25% |
| 174 | 85.772,7 | 7.581.066,9 | 17,3478% | 17,35% |
| 175 | 86.260,6 | 7.667.327,5 | 17,4475% | 17,45% |
| 176 | 86.748,5 | 7.754.076 | 17,5472% | 17,55% |
| 177 | 87.236,4 | 7.841.312,4 | 17,6469% | 17,65% |
| 178 | 87.724,3 | 7.929.036,7 | 17,7466% | 17,75% |
| 179 | 88.212,2 | 8.017.248,9 | 17,8463% | 17,85% |
| 180 | 88.700,1 | 8.105.949 | 17,9460% | 17,95% |
| 181 | 89.188 | 8.195.137 | 18,0457% | 18,05% |
| 182 | 89.675,9 | 8.284.812,9 | 18,1454% | 18,15% |
| 183 | 90.163,8 | 8.374.976,7 | 18,2451% | 18,25% |
| 184 | 90.651,7 | 8.465.628,4 | 18,3448% | 18,34% |
| 185 | 91.139,6 | 8.556.768 | 18,4445% | 18,44% |
| 186 | 91.627,5 | 8.648.395,5 | 18,5442% | 18,54% |
| 187 | 92.115,4 | 8.740.510,9 | 18,6439% | 18,64% |
| 188 | 92.603,3 | 8.833.114,2 | 18,7436% | 18,74% |
| 189 | 93.091,2 | 8.926.205,4 | 18,8433% | 18,84% |
| 190 | 93.579,1 | 9.019.784,5 | 18,9430% | 18,94% |
| 191 | 94.067 | 9.113.851,5 | 19,0427% | 19,04% |
| 192 | 94.554,9 | 9.208.406,4 | 19,1424% | 19,14% |
| 193 | 95.042,8 | 9.303.449,2 | 19,2421% | 19,24% |
| 194 | 95.530,7 | 9.398.979,9 | 19,3418% | 19,34% |
| 195 | 96.018,6 | 9.494.998,5 | 19,4415% | 19,44% |
| 196 | 96.506,5 | 9.591.505 | 19,5412% | 19,54% |
| 197 | 96.994,4 | 9.688.499,4 | 19,6409% | 19,64% |
| 198 | 97.482,3 | 9.785.981,7 | 19,7406% | 19,74% |
| 199 | 97.970,2 | 9.883.951,9 | 19,8403% | 19,84% |
| 200 | 98.458,1 | 9.982.410 | 19,9400% | 19,94% |
| 201 | 98.946 | 10.081.356 | 20,0397% | 20,04% |
| 202 | 99.433,9 | 10.180.789,9 | 20,1394% | 20,14% |
| 203 | 99.921,8 | 10.280.711,7 | 20,2391% | 20,24% |
| 204 | 100.409,7 | 10.381.121,4 | 20,3388% | 20,34% |
| 205 | 100.897,6 | 10.482.019 | 20,4385% | 20,44% |
| 206 | 101.385,5 | 10.583.404,5 | 20,5382% | 20,54% |
| 207 | 101.873,4 | 10.685.277,9 | 20,6379% | 20,64% |
| 208 | 102.361,3 | 10.787.639,2 | 20,7376% | 20,74% |
| 209 | 102.849,2 | 10.890.488,4 | 20,8373% | 20,84% |
| 210 | 103.337,1 | 10.993.825,5 | 20,9370% | 20,94% |
| 211 | 103.825 | 11.097.650,5 | 21,0367% | 21,04% |
| 212 | 104.312,9 | 11.201.963,4 | 21,1364% | 21,14% |
| 213 | 104.800,8 | 11.306.764,2 | 21,2361% | 21,24% |
| 214 | 105.288,7 | 11.412.052,9 | 21,3358% | 21,34% |
| 215 | 105.776,6 | 11.517.829,5 | 21,4355% | 21,44% |
| 216 | 106.264,5 | 11.624.094 | 21,5352% | 21,54% |
| 217 | 106.752,4 | 11.730.846,4 | 21,6349% | 21,63% |
| 218 | 107.240,3 | 11.838.086,7 | 21,7346% | 21,73% |
| 219 | 107.728,2 | 11.945.814,9 | 21,8343% | 21,83% |
| 220 | 108.216,1 | 12.054.031 | 21,9340% | 21,93% |
| 221 | 108.704 | 12.162.735 | 22,0337% | 22,03% |
| 222 | 109.191,9 | 12.271.926,9 | 22,1334% | 22,13% |
| 223 | 109.679,8 | 12.381.606,7 | 22,2331% | 22,23% |
| 224 | 110.167,7 | 12.491.774,4 | 22,3328% | 22,33% |
| 225 | 110.655,6 | 12.602.430 | 22,4325% | 22,43% |
| 226 | 111.143,5 | 12.713.573,5 | 22,5322% | 22,53% |
| 227 | 111.631,4 | 12.825.204,9 | 22,6319% | 22,63% |
| 228 | 112.119,3 | 12.937.324,2 | 22,7316% | 22,73% |
| 229 | 112.607,2 | 13.049.931,4 | 22,8313% | 22,83% |
| 230 | 113.095,1 | 13.163.026,5 | 22,9310% | 22,93% |
| 231 | 113.583 | 13.276.609,5 | 23,0307% | 23,03% |
| 232 | 114.070,9 | 13.390.680,4 | 23,1304% | 23,13% |
| 233 | 114.558,8 | 13.505.239,2 | 23,2301% | 23,23% |
| 234 | 115.046,7 | 13.620.285,9 | 23,3298% | 23,33% |
| 235 | 115.534,6 | 13.735.820,5 | 23,4295% | 23,43% |
| 236 | 116.022,5 | 13.851.843 | 23,5292% | 23,53% |
| 237 | 116.510,4 | 13.968.353,4 | 23,6289% | 23,63% |
| 238 | 116.998,3 | 14.085.351,7 | 23,7286% | 23,73% |
| 239 | 117.486,2 | 14.202.837,9 | 23,8283% | 23,83% |
| 240 | 117.974,1 | 14.320.812 | 23,9280% | 23,93% |
| 241 | 118.462 | 14.439.274 | 24,0277% | 24,03% |
| 242 | 118.949,9 | 14.558.223,9 | 24,1274% | 24,13% |
| 243 | 119.437,8 | 14.677.661,7 | 24,2271% | 24,23% |
| 244 | 119.925,7 | 14.797.587,4 | 24,3268% | 24,33% |
| 245 | 120.413,6 | 14.918.001 | 24,4265% | 24,43% |
| 246 | 120.901,5 | 15.038.902,5 | 24,5262% | 24,53% |
| 247 | 121.389,4 | 15.160.291,9 | 24,6259% | 24,63% |
| 248 | 121.877,3 | 15.282.169,2 | 24,7256% | 24,73% |
| 249 | 122.365,2 | 15.404.534,4 | 24,8253% | 24,83% |
| 250 | 122.853,1 | 15.527.387,5 | 24,9250% | 24,92% |
| 251 | 123.341 | 15.650.728,5 | 25,0247% | 25,02% |
| 252 | 123.828,9 | 15.774.557,4 | 25,1244% | 25,12% |
| 253 | 124.316,8 | 15.898.874,2 | 25,2241% | 25,22% |
| 254 | 124.804,7 | 16.023.678,9 | 25,3238% | 25,32% |
| 255 | 125.292,6 | 16.148.971,5 | 25,4235% | 25,42% |
| 256 | 125.780,5 | 16.274.752 | 25,5232% | 25,52% |
| 257 | 126.268,4 | 16.401.020,4 | 25,6229% | 25,62% |
| 258 | 126.756,3 | 16.527.776,7 | 25,7226% | 25,72% |
| 259 | 127.244,2 | 16.655.020,9 | 25,8223% | 25,82% |
| 260 | 127.732,1 | 16.782.753 | 25,9220% | 25,92% |
| 261 | 128.220 | 16.910.973 | 26,0217% | 26,02% |
| 262 | 128.707,9 | 17.039.680,9 | 26,1214% | 26,12% |
| 263 | 129.195,8 | 17.168.876,7 | 26,2211% | 26,22% |
| 264 | 129.683,7 | 17.298.560,4 | 26,3208% | 26,32% |
| 265 | 130.171,6 | 17.428.732 | 26,4205% | 26,42% |
| 266 | 130.659,5 | 17.559.391,5 | 26,5202% | 26,52% |
| 267 | 131.147,4 | 17.690.538,9 | 26,6199% | 26,62% |
| 268 | 131.635,3 | 17.822.174,2 | 26,7196% | 26,72% |
| 269 | 132.123,2 | 17.954.297,4 | 26,8193% | 26,82% |
| 270 | 132.611,1 | 18.086.908,5 | 26,9190% | 26,92% |
| 271 | 133.099 | 18.220.007,5 | 27,0187% | 27,02% |
| 272 | 133.586,9 | 18.353.594,4 | 27,1184% | 27,12% |
| 273 | 134.074,8 | 18.487.669,2 | 27,2181% | 27,22% |
| 274 | 134.562,7 | 18.622.231,9 | 27,3178% | 27,32% |
| 275 | 135.050,6 | 18.757.282,5 | 27,4175% | 27,42% |
| 276 | 135.538,5 | 18.892.821 | 27,5172% | 27,52% |
| 277 | 136.026,4 | 19.028.847,4 | 27,6169% | 27,62% |
| 278 | 136.514,3 | 19.165.361,7 | 27,7166% | 27,72% |
| 279 | 137.002,2 | 19.302.363,9 | 27,8163% | 27,82% |
| 280 | 137.490,1 | 19.439.854 | 27,9160% | 27,92% |
| 281 | 137.978 | 19.577.832 | 28,0157% | 28,02% |
| 282 | 138.465,9 | 19.716.297,9 | 28,1154% | 28,12% |
| 283 | 138.953,8 | 19.855.251,7 | 28,2151% | 28,22% |
| 284 | 139.441,7 | 19.994.693,4 | 28,3148% | 28,31% |
| 285 | 139.929,6 | 20.134.623 | 28,4145% | 28,41% |
| 286 | 140.417,5 | 20.275.040,5 | 28,5142% | 28,51% |
| 287 | 140.905,4 | 20.415.945,9 | 28,6139% | 28,61% |
| 288 | 141.393,3 | 20.557.339,2 | 28,7136% | 28,71% |
| 289 | 141.881,2 | 20.699.220,4 | 28,8133% | 28,81% |
| 290 | 142.369,1 | 20.841.589,5 | 28,9130% | 28,91% |
| 291 | 142.857 | 20.984.446,5 | 29,0127% | 29,01% |
| 292 | 143.344,9 | 21.127.791,4 | 29,1124% | 29,11% |
| 293 | 143.832,8 | 21.271.624,2 | 29,2121% | 29,21% |
| 294 | 144.320,7 | 21.415.944,9 | 29,3118% | 29,31% |
| 295 | 144.808,6 | 21.560.753,5 | 29,4115% | 29,41% |
| 296 | 145.296,5 | 21.706.050 | 29,5112% | 29,51% |
| 297 | 145.784,4 | 21.851.834,4 | 29,6109% | 29,61% |
| 298 | 146.272,3 | 21.998.106,7 | 29,7106% | 29,71% |
| 299 | 146.760,2 | 22.144.866,9 | 29,8103% | 29,81% |
| 300 | 147.248,1 | 22.292.115 | 29,9100% | 29,91% |
| 301 | 147.736 | 22.439.851 | 30,0097% | 30,01% |
| 302 | 148.223,9 | 22.588.074,9 | 30,1094% | 30,11% |
| 303 | 148.711,8 | 22.736.786,7 | 30,2091% | 30,21% |
| 304 | 149.199,7 | 22.885.986,4 | 30,3088% | 30,31% |
| 305 | 149.687,6 | 23.035.674 | 30,4085% | 30,41% |
| 306 | 150.175,5 | 23.185.849,5 | 30,5082% | 30,51% |
| 307 | 150.663,4 | 23.336.512,9 | 30,6079% | 30,61% |
| 308 | 151.151,3 | 23.487.664,2 | 30,7076% | 30,71% |
| 309 | 151.639,2 | 23.639.303,4 | 30,8073% | 30,81% |
| 310 | 152.127,1 | 23.791.430,5 | 30,9070% | 30,91% |
| 311 | 152.615 | 23.944.045,5 | 31,0067% | 31,01% |
| 312 | 153.102,9 | 24.097.148,4 | 31,1064% | 31,11% |
| 313 | 153.590,8 | 24.250.739,2 | 31,2061% | 31,21% |
| 314 | 154.078,7 | 24.404.817,9 | 31,3058% | 31,31% |
| 315 | 154.566,6 | 24.559.384,5 | 31,4055% | 31,41% |
| 316 | 155.054,5 | 24.714.439 | 31,5052% | 31,51% |
| 317 | 155.542,4 | 24.869.981,4 | 31,6049% | 31,6% |
| 318 | 156.030,3 | 25.026.011,7 | 31,7046% | 31,7% |
| 319 | 156.518,2 | 25.182.529,9 | 31,8043% | 31,8% |
| 320 | 157.006,1 | 25.339.536 | 31,9040% | 31,9% |
| 321 | 157.494 | 25.497.030 | 32,0037% | 32% |
| 322 | 157.981,9 | 25.655.011,9 | 32,1034% | 32,1% |
| 323 | 158.469,8 | 25.813.481,7 | 32,2031% | 32,2% |
| 324 | 158.957,7 | 25.972.439,4 | 32,3028% | 32,3% |
| 325 | 159.445,6 | 26.131.885 | 32,4025% | 32,4% |
| 326 | 159.933,5 | 26.291.818,5 | 32,5022% | 32,5% |
| 327 | 160.421,4 | 26.452.239,9 | 32,6019% | 32,6% |
| 328 | 160.909,3 | 26.613.149,2 | 32,7016% | 32,7% |
| 329 | 161.397,2 | 26.774.546,4 | 32,8013% | 32,8% |
| 330 | 161.885,1 | 26.936.431,5 | 32,9010% | 32,9% |
| 331 | 162.373 | 27.098.804,5 | 33,0007% | 33% |
| 332 | 162.860,9 | 27.261.665,4 | 33,1004% | 33,1% |
| 333 | 163.348,8 | 27.425.014,2 | 33,2001% | 33,2% |
| 334 | 163.836,7 | 27.588.850,9 | 33,2998% | 33,3% |
| 335 | 164.324,6 | 27.753.175,5 | 33,3995% | 33,4% |
| 336 | 164.812,5 | 27.917.988 | 33,4992% | 33,5% |
| 337 | 165.300,4 | 28.083.288,4 | 33,5989% | 33,6% |
| 338 | 165.788,3 | 28.249.076,7 | 33,6986% | 33,7% |
| 339 | 166.276,2 | 28.415.352,9 | 33,7983% | 33,8% |
| 340 | 166.764,1 | 28.582.117 | 33,8980% | 33,9% |
| 341 | 167.252 | 28.749.369 | 33,9977% | 34% |
| 342 | 167.739,9 | 28.917.108,9 | 34,0974% | 34,1% |
| 343 | 168.227,8 | 29.085.336,7 | 34,1971% | 34,2% |
| 344 | 168.715,7 | 29.254.052,4 | 34,2968% | 34,3% |
| 345 | 169.203,6 | 29.423.256 | 34,3965% | 34,4% |
| 346 | 169.691,5 | 29.592.947,5 | 34,4962% | 34,5% |
| 347 | 170.179,4 | 29.763.126,9 | 34,5959% | 34,6% |
| 348 | 170.667,3 | 29.933.794,2 | 34,6956% | 34,7% |
| 349 | 171.155,2 | 30.104.949,4 | 34,7953% | 34,8% |
| 350 | 171.643,1 | 30.276.592,5 | 34,8950% | 34,89% |
| 351 | 172.131 | 30.448.723,5 | 34,9947% | 34,99% |
| 352 | 172.618,9 | 30.621.342,4 | 35,0944% | 35,09% |
| 353 | 173.106,8 | 30.794.449,2 | 35,1941% | 35,19% |
| 354 | 173.594,7 | 30.968.043,9 | 35,2938% | 35,29% |
| 355 | 174.082,6 | 31.142.126,5 | 35,3935% | 35,39% |
| 356 | 174.570,5 | 31.316.697 | 35,4932% | 35,49% |
| 357 | 175.058,4 | 31.491.755,4 | 35,5929% | 35,59% |
| 358 | 175.546,3 | 31.667.301,7 | 35,6926% | 35,69% |
| 359 | 176.034,2 | 31.843.335,9 | 35,7923% | 35,79% |
| 360 | 176.522,1 | 32.019.858 | 35,8920% | 35,89% |
| 361 | 177.010 | 32.196.868 | 35,9917% | 35,99% |
| 362 | 177.497,9 | 32.374.365,9 | 36,0914% | 36,09% |
| 363 | 177.985,8 | 32.552.351,7 | 36,1911% | 36,19% |
| 364 | 178.473,7 | 32.730.825,4 | 36,2908% | 36,29% |
| 365 | 178.961,6 | 32.909.787 | 36,3905% | 36,39% |
| 366 | 179.449,5 | 33.089.236,5 | 36,4902% | 36,49% |
| 367 | 179.937,4 | 33.269.173,9 | 36,5899% | 36,59% |
| 368 | 180.425,3 | 33.449.599,2 | 36,6896% | 36,69% |
| 369 | 180.913,2 | 33.630.512,4 | 36,7893% | 36,79% |
| 370 | 181.401,1 | 33.811.913,5 | 36,8890% | 36,89% |
| 371 | 181.889 | 33.993.802,5 | 36,9887% | 36,99% |
| 372 | 182.376,9 | 34.176.179,4 | 37,0884% | 37,09% |
| 373 | 182.864,8 | 34.359.044,2 | 37,1881% | 37,19% |
| 374 | 183.352,7 | 34.542.396,9 | 37,2878% | 37,29% |
| 375 | 183.840,6 | 34.726.237,5 | 37,3875% | 37,39% |
| 376 | 184.328,5 | 34.910.566 | 37,4872% | 37,49% |
| 377 | 184.816,4 | 35.095.382,4 | 37,5869% | 37,59% |
| 378 | 185.304,3 | 35.280.686,7 | 37,6866% | 37,69% |
| 379 | 185.792,2 | 35.466.478,9 | 37,7863% | 37,79% |
| 380 | 186.280,1 | 35.652.759 | 37,8860% | 37,89% |
| 381 | 186.768 | 35.839.527 | 37,9857% | 37,99% |
| 382 | 187.255,9 | 36.026.782,9 | 38,0854% | 38,09% |
| 383 | 187.743,8 | 36.214.526,7 | 38,1851% | 38,19% |
| 384 | 188.231,7 | 36.402.758,4 | 38,2848% | 38,28% |
| 385 | 188.719,6 | 36.591.478 | 38,3845% | 38,38% |
| 386 | 189.207,5 | 36.780.685,5 | 38,4842% | 38,48% |
| 387 | 189.695,4 | 36.970.380,9 | 38,5839% | 38,58% |
| 388 | 190.183,3 | 37.160.564,2 | 38,6836% | 38,68% |
| 389 | 190.671,2 | 37.351.235,4 | 38,7833% | 38,78% |
| 390 | 191.159,1 | 37.542.394,5 | 38,8830% | 38,88% |
| 391 | 191.647 | 37.734.041,5 | 38,9827% | 38,98% |
| 392 | 192.134,9 | 37.926.176,4 | 39,0824% | 39,08% |
| 393 | 192.622,8 | 38.118.799,2 | 39,1821% | 39,18% |
| 394 | 193.110,7 | 38.311.909,9 | 39,2818% | 39,28% |
| 395 | 193.598,6 | 38.505.508,5 | 39,3815% | 39,38% |
| 396 | 194.086,5 | 38.699.595 | 39,4812% | 39,48% |
| 397 | 194.574,4 | 38.894.169,4 | 39,5809% | 39,58% |
| 398 | 195.062,3 | 39.089.231,7 | 39,6806% | 39,68% |
| 399 | 195.550,2 | 39.284.781,9 | 39,7803% | 39,78% |
| 400 | 196.038,1 | 39.480.820 | 39,8800% | 39,88% |
| 401 | 196.526 | 39.677.346 | 39,9797% | 39,98% |
| 402 | 197.013,9 | 39.874.359,9 | 40,0794% | 40,08% |
| 403 | 197.501,8 | 40.071.861,7 | 40,1791% | 40,18% |
| 404 | 197.989,7 | 40.269.851,4 | 40,2788% | 40,28% |
| 405 | 198.477,6 | 40.468.329 | 40,3785% | 40,38% |
| 406 | 198.965,5 | 40.667.294,5 | 40,4782% | 40,48% |
| 407 | 199.453,4 | 40.866.747,9 | 40,5779% | 40,58% |
| 408 | 199.941,3 | 41.066.689,2 | 40,6776% | 40,68% |
| 409 | 200.429,2 | 41.267.118,4 | 40,7773% | 40,78% |
| 410 | 200.917,1 | 41.468.035,5 | 40,8770% | 40,88% |
| 411 | 201.405 | 41.669.440,5 | 40,9767% | 40,98% |
| 412 | 201.892,9 | 41.871.333,4 | 41,0764% | 41,08% |
| 413 | 202.380,8 | 42.073.714,2 | 41,1761% | 41,18% |
| 414 | 202.868,7 | 42.276.582,9 | 41,2758% | 41,28% |
| 415 | 203.356,6 | 42.479.939,5 | 41,3755% | 41,38% |
| 416 | 203.844,5 | 42.683.784 | 41,4752% | 41,48% |
| 417 | 204.332,4 | 42.888.116,4 | 41,5749% | 41,57% |
| 418 | 204.820,3 | 43.092.936,7 | 41,6746% | 41,67% |
| 419 | 205.308,2 | 43.298.244,9 | 41,7743% | 41,77% |
| 420 | 205.796,1 | 43.504.041 | 41,8740% | 41,87% |
| 421 | 206.284 | 43.710.325 | 41,9737% | 41,97% |
| 422 | 206.771,9 | 43.917.096,9 | 42,0734% | 42,07% |
| 423 | 207.259,8 | 44.124.356,7 | 42,1731% | 42,17% |
| 424 | 207.747,7 | 44.332.104,4 | 42,2728% | 42,27% |
| 425 | 208.235,6 | 44.540.340 | 42,3725% | 42,37% |
| 426 | 208.723,5 | 44.749.063,5 | 42,4722% | 42,47% |
| 427 | 209.211,4 | 44.958.274,9 | 42,5719% | 42,57% |
| 428 | 209.699,3 | 45.167.974,2 | 42,6716% | 42,67% |
| 429 | 210.187,2 | 45.378.161,4 | 42,7713% | 42,77% |
| 430 | 210.675,1 | 45.588.836,5 | 42,8710% | 42,87% |
| 431 | 211.163 | 45.799.999,5 | 42,9707% | 42,97% |
| 432 | 211.650,9 | 46.011.650,4 | 43,0704% | 43,07% |
| 433 | 212.138,8 | 46.223.789,2 | 43,1701% | 43,17% |
| 434 | 212.626,7 | 46.436.415,9 | 43,2698% | 43,27% |
| 435 | 213.114,6 | 46.649.530,5 | 43,3695% | 43,37% |
| 436 | 213.602,5 | 46.863.133 | 43,4692% | 43,47% |
| 437 | 214.090,4 | 47.077.223,4 | 43,5689% | 43,57% |
| 438 | 214.578,3 | 47.291.801,7 | 43,6686% | 43,67% |
| 439 | 215.066,2 | 47.506.867,9 | 43,7683% | 43,77% |
| 440 | 215.554,1 | 47.722.422 | 43,8680% | 43,87% |
| 441 | 216.042 | 47.938.464 | 43,9677% | 43,97% |
| 442 | 216.529,9 | 48.154.993,9 | 44,0674% | 44,07% |
| 443 | 217.017,8 | 48.372.011,7 | 44,1671% | 44,17% |
| 444 | 217.505,7 | 48.589.517,4 | 44,2668% | 44,27% |
| 445 | 217.993,6 | 48.807.511 | 44,3665% | 44,37% |
| 446 | 218.481,5 | 49.025.992,5 | 44,4662% | 44,47% |
| 447 | 218.969,4 | 49.244.961,9 | 44,5659% | 44,57% |
| 448 | 219.457,3 | 49.464.419,2 | 44,6656% | 44,67% |
| 449 | 219.945,2 | 49.684.364,4 | 44,7653% | 44,77% |
| 450 | 220.433,1 | 49.904.797,5 | 44,8650% | 44,86% |
| 451 | 220.921 | 50.125.718,5 | 44,9647% | 44,96% |
| 452 | 221.408,9 | 50.347.127,4 | 45,0644% | 45,06% |
| 453 | 221.896,8 | 50.569.024,2 | 45,1641% | 45,16% |
| 454 | 222.384,7 | 50.791.408,9 | 45,2638% | 45,26% |
| 455 | 222.872,6 | 51.014.281,5 | 45,3635% | 45,36% |
| 456 | 223.360,5 | 51.237.642 | 45,4632% | 45,46% |
| 457 | 223.848,4 | 51.461.490,4 | 45,5629% | 45,56% |
| 458 | 224.336,3 | 51.685.826,7 | 45,6626% | 45,66% |
| 459 | 224.824,2 | 51.910.650,9 | 45,7623% | 45,76% |
| 460 | 225.312,1 | 52.135.963 | 45,8620% | 45,86% |
| 461 | 225.800 | 52.361.763 | 45,9617% | 45,96% |
| 462 | 226.287,9 | 52.588.050,9 | 46,0614% | 46,06% |
| 463 | 226.775,8 | 52.814.826,7 | 46,1611% | 46,16% |
| 464 | 227.263,7 | 53.042.090,4 | 46,2608% | 46,26% |
| 465 | 227.751,6 | 53.269.842 | 46,3605% | 46,36% |
| 466 | 228.239,5 | 53.498.081,5 | 46,4602% | 46,46% |
| 467 | 228.727,4 | 53.726.808,9 | 46,5599% | 46,56% |
| 468 | 229.215,3 | 53.956.024,2 | 46,6596% | 46,66% |
| 469 | 229.703,2 | 54.185.727,4 | 46,7593% | 46,76% |
| 470 | 230.191,1 | 54.415.918,5 | 46,8590% | 46,86% |
| 471 | 230.679 | 54.646.597,5 | 46,9587% | 46,96% |
| 472 | 231.166,9 | 54.877.764,4 | 47,0584% | 47,06% |
| 473 | 231.654,8 | 55.109.419,2 | 47,1581% | 47,16% |
| 474 | 232.142,7 | 55.341.561,9 | 47,2578% | 47,26% |
| 475 | 232.630,6 | 55.574.192,5 | 47,3575% | 47,36% |
| 476 | 233.118,5 | 55.807.311 | 47,4572% | 47,46% |
| 477 | 233.606,4 | 56.040.917,4 | 47,5569% | 47,56% |
| 478 | 234.094,3 | 56.275.011,7 | 47,6566% | 47,66% |
| 479 | 234.582,2 | 56.509.593,9 | 47,7563% | 47,76% |
| 480 | 235.070,1 | 56.744.664 | 47,8560% | 47,86% |
| 481 | 235.558 | 56.980.222 | 47,9557% | 47,96% |
| 482 | 236.045,9 | 57.216.267,9 | 48,0554% | 48,06% |
| 483 | 236.533,8 | 57.452.801,7 | 48,1551% | 48,16% |
| 484 | 237.021,7 | 57.689.823,4 | 48,2548% | 48,25% |
| 485 | 237.509,6 | 57.927.333 | 48,3545% | 48,35% |
| 486 | 237.997,5 | 58.165.330,5 | 48,4542% | 48,45% |
| 487 | 238.485,4 | 58.403.815,9 | 48,5539% | 48,55% |
| 488 | 238.973,3 | 58.642.789,2 | 48,6536% | 48,65% |
| 489 | 239.461,2 | 58.882.250,4 | 48,7533% | 48,75% |
| 490 | 239.949,1 | 59.122.199,5 | 48,8530% | 48,85% |
| 491 | 240.437 | 59.362.636,5 | 48,9527% | 48,95% |
| 492 | 240.924,9 | 59.603.561,4 | 49,0524% | 49,05% |
| 493 | 241.412,8 | 59.844.974,2 | 49,1521% | 49,15% |
| 494 | 241.900,7 | 60.086.874,9 | 49,2518% | 49,25% |
| 495 | 242.388,6 | 60.329.263,5 | 49,3515% | 49,35% |
| 496 | 242.876,5 | 60.572.140 | 49,4512% | 49,45% |
| 497 | 243.364,4 | 60.815.504,4 | 49,5509% | 49,55% |
| 498 | 243.852,3 | 61.059.356,7 | 49,6506% | 49,65% |
| 499 | 244.340,2 | 61.303.696,9 | 49,7503% | 49,75% |
| 500 | 244.828,1 | 61.548.525 | 49,8500% | 49,85% |

### Anexo — Enxame

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 2.342 | 2.342 | 0,0256% | 0,0256% |
| 2 | 3.220,2 | 5.562,2 | 0,0512% | 0,0512% |
| 3 | 4.098,4 | 9.660,6 | 0,0768% | 0,0768% |
| 4 | 4.976,6 | 14.637,2 | 0,1024% | 0,1024% |
| 5 | 5.854,8 | 20.492 | 0,1280% | 0,128% |
| 6 | 6.733 | 27.225 | 0,1536% | 0,1536% |
| 7 | 7.611,2 | 34.836,2 | 0,1792% | 0,1792% |
| 8 | 8.489,4 | 43.325,6 | 0,2048% | 0,2048% |
| 9 | 9.367,6 | 52.693,2 | 0,2304% | 0,2304% |
| 10 | 10.245,8 | 62.939 | 0,2560% | 0,256% |
| 11 | 11.124 | 74.063 | 0,2816% | 0,2816% |
| 12 | 12.002,2 | 86.065,2 | 0,3072% | 0,3072% |
| 13 | 12.880,4 | 98.945,6 | 0,3328% | 0,3328% |
| 14 | 13.758,6 | 112.704,2 | 0,3584% | 0,3584% |
| 15 | 14.636,8 | 127.341 | 0,3840% | 0,384% |
| 16 | 15.515 | 142.856 | 0,4096% | 0,4096% |
| 17 | 16.393,2 | 159.249,2 | 0,4352% | 0,4352% |
| 18 | 17.271,4 | 176.520,6 | 0,4608% | 0,4608% |
| 19 | 18.149,6 | 194.670,2 | 0,4864% | 0,4864% |
| 20 | 19.027,8 | 213.698 | 0,5120% | 0,512% |
| 21 | 19.906 | 233.604 | 0,5376% | 0,5376% |
| 22 | 20.784,2 | 254.388,2 | 0,5632% | 0,5632% |
| 23 | 21.662,4 | 276.050,6 | 0,5888% | 0,5888% |
| 24 | 22.540,6 | 298.591,2 | 0,6144% | 0,6144% |
| 25 | 23.418,8 | 322.010 | 0,6400% | 0,64% |
| 26 | 24.297 | 346.307 | 0,6656% | 0,6656% |
| 27 | 25.175,2 | 371.482,2 | 0,6912% | 0,6912% |
| 28 | 26.053,4 | 397.535,6 | 0,7168% | 0,7168% |
| 29 | 26.931,6 | 424.467,2 | 0,7424% | 0,7424% |
| 30 | 27.809,8 | 452.277 | 0,7680% | 0,768% |
| 31 | 28.688 | 480.965 | 0,7936% | 0,7936% |
| 32 | 29.566,2 | 510.531,2 | 0,8192% | 0,8192% |
| 33 | 30.444,4 | 540.975,6 | 0,8448% | 0,8448% |
| 34 | 31.322,6 | 572.298,2 | 0,8704% | 0,8704% |
| 35 | 32.200,8 | 604.499 | 0,8960% | 0,896% |
| 36 | 33.079 | 637.578 | 0,9216% | 0,9216% |
| 37 | 33.957,2 | 671.535,2 | 0,9472% | 0,9472% |
| 38 | 34.835,4 | 706.370,6 | 0,9728% | 0,9728% |
| 39 | 35.713,6 | 742.084,2 | 0,9984% | 0,9984% |
| 40 | 36.591,8 | 778.676 | 1,0240% | 1,024% |
| 41 | 37.470 | 816.146 | 1,0496% | 1,05% |
| 42 | 38.348,2 | 854.494,2 | 1,0752% | 1,075% |
| 43 | 39.226,4 | 893.720,6 | 1,1008% | 1,101% |
| 44 | 40.104,6 | 933.825,2 | 1,1264% | 1,126% |
| 45 | 40.982,8 | 974.808 | 1,1520% | 1,152% |
| 46 | 41.861 | 1.016.669 | 1,1776% | 1,178% |
| 47 | 42.739,2 | 1.059.408,2 | 1,2032% | 1,203% |
| 48 | 43.617,4 | 1.103.025,6 | 1,2288% | 1,229% |
| 49 | 44.495,6 | 1.147.521,2 | 1,2544% | 1,254% |
| 50 | 45.373,8 | 1.192.895 | 1,2800% | 1,28% |
| 51 | 46.252 | 1.239.147 | 1,3056% | 1,306% |
| 52 | 47.130,2 | 1.286.277,2 | 1,3312% | 1,331% |
| 53 | 48.008,4 | 1.334.285,6 | 1,3568% | 1,357% |
| 54 | 48.886,6 | 1.383.172,2 | 1,3824% | 1,382% |
| 55 | 49.764,8 | 1.432.937 | 1,4080% | 1,408% |
| 56 | 50.643 | 1.483.580 | 1,4336% | 1,434% |
| 57 | 51.521,2 | 1.535.101,2 | 1,4592% | 1,459% |
| 58 | 52.399,4 | 1.587.500,6 | 1,4848% | 1,485% |
| 59 | 53.277,6 | 1.640.778,2 | 1,5104% | 1,51% |
| 60 | 54.155,8 | 1.694.934 | 1,5360% | 1,536% |
| 61 | 55.034 | 1.749.968 | 1,5616% | 1,562% |
| 62 | 55.912,2 | 1.805.880,2 | 1,5872% | 1,587% |
| 63 | 56.790,4 | 1.862.670,6 | 1,6128% | 1,613% |
| 64 | 57.668,6 | 1.920.339,2 | 1,6384% | 1,638% |
| 65 | 58.546,8 | 1.978.886 | 1,6640% | 1,664% |
| 66 | 59.425 | 2.038.311 | 1,6896% | 1,69% |
| 67 | 60.303,2 | 2.098.614,2 | 1,7152% | 1,715% |
| 68 | 61.181,4 | 2.159.795,6 | 1,7408% | 1,741% |
| 69 | 62.059,6 | 2.221.855,2 | 1,7664% | 1,766% |
| 70 | 62.937,8 | 2.284.793 | 1,7920% | 1,792% |
| 71 | 63.816 | 2.348.609 | 1,8176% | 1,818% |
| 72 | 64.694,2 | 2.413.303,2 | 1,8432% | 1,843% |
| 73 | 65.572,4 | 2.478.875,6 | 1,8688% | 1,869% |
| 74 | 66.450,6 | 2.545.326,2 | 1,8944% | 1,894% |
| 75 | 67.328,8 | 2.612.655 | 1,9200% | 1,92% |
| 76 | 68.207 | 2.680.862 | 1,9456% | 1,946% |
| 77 | 69.085,2 | 2.749.947,2 | 1,9712% | 1,971% |
| 78 | 69.963,4 | 2.819.910,6 | 1,9968% | 1,997% |
| 79 | 70.841,6 | 2.890.752,2 | 2,0224% | 2,022% |
| 80 | 71.719,8 | 2.962.472 | 2,0480% | 2,048% |
| 81 | 72.598 | 3.035.070 | 2,0736% | 2,074% |
| 82 | 73.476,2 | 3.108.546,2 | 2,0992% | 2,099% |
| 83 | 74.354,4 | 3.182.900,6 | 2,1248% | 2,125% |
| 84 | 75.232,6 | 3.258.133,2 | 2,1504% | 2,15% |
| 85 | 76.110,8 | 3.334.244 | 2,1760% | 2,176% |
| 86 | 76.989 | 3.411.233 | 2,2016% | 2,202% |
| 87 | 77.867,2 | 3.489.100,2 | 2,2272% | 2,227% |
| 88 | 78.745,4 | 3.567.845,6 | 2,2528% | 2,253% |
| 89 | 79.623,6 | 3.647.469,2 | 2,2784% | 2,278% |
| 90 | 80.501,8 | 3.727.971 | 2,3040% | 2,304% |
| 91 | 81.380 | 3.809.351 | 2,3296% | 2,33% |
| 92 | 82.258,2 | 3.891.609,2 | 2,3552% | 2,355% |
| 93 | 83.136,4 | 3.974.745,6 | 2,3808% | 2,381% |
| 94 | 84.014,6 | 4.058.760,2 | 2,4064% | 2,406% |
| 95 | 84.892,8 | 4.143.653 | 2,4320% | 2,432% |
| 96 | 85.771 | 4.229.424 | 2,4576% | 2,458% |
| 97 | 86.649,2 | 4.316.073,2 | 2,4832% | 2,483% |
| 98 | 87.527,4 | 4.403.600,6 | 2,5088% | 2,509% |
| 99 | 88.405,6 | 4.492.006,2 | 2,5344% | 2,534% |
| 100 | 89.283,8 | 4.581.290 | 2,5600% | 2,56% |
| 101 | 90.162 | 4.671.452 | 2,5856% | 2,586% |
| 102 | 91.040,2 | 4.762.492,2 | 2,6112% | 2,611% |
| 103 | 91.918,4 | 4.854.410,6 | 2,6368% | 2,637% |
| 104 | 92.796,6 | 4.947.207,2 | 2,6624% | 2,662% |
| 105 | 93.674,8 | 5.040.882 | 2,6880% | 2,688% |
| 106 | 94.553 | 5.135.435 | 2,7136% | 2,714% |
| 107 | 95.431,2 | 5.230.866,2 | 2,7392% | 2,739% |
| 108 | 96.309,4 | 5.327.175,6 | 2,7648% | 2,765% |
| 109 | 97.187,6 | 5.424.363,2 | 2,7904% | 2,79% |
| 110 | 98.065,8 | 5.522.429 | 2,8160% | 2,816% |
| 111 | 98.944 | 5.621.373 | 2,8416% | 2,842% |
| 112 | 99.822,2 | 5.721.195,2 | 2,8672% | 2,867% |
| 113 | 100.700,4 | 5.821.895,6 | 2,8928% | 2,893% |
| 114 | 101.578,6 | 5.923.474,2 | 2,9184% | 2,918% |
| 115 | 102.456,8 | 6.025.931 | 2,9440% | 2,944% |
| 116 | 103.335 | 6.129.266 | 2,9696% | 2,97% |
| 117 | 104.213,2 | 6.233.479,2 | 2,9952% | 2,995% |
| 118 | 105.091,4 | 6.338.570,6 | 3,0208% | 3,021% |
| 119 | 105.969,6 | 6.444.540,2 | 3,0464% | 3,046% |
| 120 | 106.847,8 | 6.551.388 | 3,0720% | 3,072% |
| 121 | 107.726 | 6.659.114 | 3,0976% | 3,098% |
| 122 | 108.604,2 | 6.767.718,2 | 3,1232% | 3,123% |
| 123 | 109.482,4 | 6.877.200,6 | 3,1488% | 3,149% |
| 124 | 110.360,6 | 6.987.561,2 | 3,1744% | 3,174% |
| 125 | 111.238,8 | 7.098.800 | 3,2000% | 3,2% |
| 126 | 112.117 | 7.210.917 | 3,2256% | 3,226% |
| 127 | 112.995,2 | 7.323.912,2 | 3,2512% | 3,251% |
| 128 | 113.873,4 | 7.437.785,6 | 3,2768% | 3,277% |
| 129 | 114.751,6 | 7.552.537,2 | 3,3024% | 3,302% |
| 130 | 115.629,8 | 7.668.167 | 3,3280% | 3,328% |
| 131 | 116.508 | 7.784.675 | 3,3536% | 3,354% |
| 132 | 117.386,2 | 7.902.061,2 | 3,3792% | 3,379% |
| 133 | 118.264,4 | 8.020.325,6 | 3,4048% | 3,405% |
| 134 | 119.142,6 | 8.139.468,2 | 3,4304% | 3,43% |
| 135 | 120.020,8 | 8.259.489 | 3,4560% | 3,456% |
| 136 | 120.899 | 8.380.388 | 3,4816% | 3,482% |
| 137 | 121.777,2 | 8.502.165,2 | 3,5072% | 3,507% |
| 138 | 122.655,4 | 8.624.820,6 | 3,5328% | 3,533% |
| 139 | 123.533,6 | 8.748.354,2 | 3,5584% | 3,558% |
| 140 | 124.411,8 | 8.872.766 | 3,5840% | 3,584% |
| 141 | 125.290 | 8.998.056 | 3,6096% | 3,61% |
| 142 | 126.168,2 | 9.124.224,2 | 3,6352% | 3,635% |
| 143 | 127.046,4 | 9.251.270,6 | 3,6608% | 3,661% |
| 144 | 127.924,6 | 9.379.195,2 | 3,6864% | 3,686% |
| 145 | 128.802,8 | 9.507.998 | 3,7120% | 3,712% |
| 146 | 129.681 | 9.637.679 | 3,7376% | 3,738% |
| 147 | 130.559,2 | 9.768.238,2 | 3,7632% | 3,763% |
| 148 | 131.437,4 | 9.899.675,6 | 3,7888% | 3,789% |
| 149 | 132.315,6 | 10.031.991,2 | 3,8144% | 3,814% |
| 150 | 133.193,8 | 10.165.185 | 3,8400% | 3,84% |
| 151 | 134.072 | 10.299.257 | 3,8656% | 3,866% |
| 152 | 134.950,2 | 10.434.207,2 | 3,8912% | 3,891% |
| 153 | 135.828,4 | 10.570.035,6 | 3,9168% | 3,917% |
| 154 | 136.706,6 | 10.706.742,2 | 3,9424% | 3,942% |
| 155 | 137.584,8 | 10.844.327 | 3,9680% | 3,968% |
| 156 | 138.463 | 10.982.790 | 3,9936% | 3,994% |
| 157 | 139.341,2 | 11.122.131,2 | 4,0192% | 4,019% |
| 158 | 140.219,4 | 11.262.350,6 | 4,0448% | 4,045% |
| 159 | 141.097,6 | 11.403.448,2 | 4,0704% | 4,07% |
| 160 | 141.975,8 | 11.545.424 | 4,0960% | 4,096% |
| 161 | 142.854 | 11.688.278 | 4,1216% | 4,122% |
| 162 | 143.732,2 | 11.832.010,2 | 4,1472% | 4,147% |
| 163 | 144.610,4 | 11.976.620,6 | 4,1728% | 4,173% |
| 164 | 145.488,6 | 12.122.109,2 | 4,1984% | 4,198% |
| 165 | 146.366,8 | 12.268.476 | 4,2240% | 4,224% |
| 166 | 147.245 | 12.415.721 | 4,2496% | 4,25% |
| 167 | 148.123,2 | 12.563.844,2 | 4,2752% | 4,275% |
| 168 | 149.001,4 | 12.712.845,6 | 4,3008% | 4,301% |
| 169 | 149.879,6 | 12.862.725,2 | 4,3264% | 4,326% |
| 170 | 150.757,8 | 13.013.483 | 4,3520% | 4,352% |
| 171 | 151.636 | 13.165.119 | 4,3776% | 4,378% |
| 172 | 152.514,2 | 13.317.633,2 | 4,4032% | 4,403% |
| 173 | 153.392,4 | 13.471.025,6 | 4,4288% | 4,429% |
| 174 | 154.270,6 | 13.625.296,2 | 4,4544% | 4,454% |
| 175 | 155.148,8 | 13.780.445 | 4,4800% | 4,48% |
| 176 | 156.027 | 13.936.472 | 4,5056% | 4,506% |
| 177 | 156.905,2 | 14.093.377,2 | 4,5312% | 4,531% |
| 178 | 157.783,4 | 14.251.160,6 | 4,5568% | 4,557% |
| 179 | 158.661,6 | 14.409.822,2 | 4,5824% | 4,582% |
| 180 | 159.539,8 | 14.569.362 | 4,6080% | 4,608% |
| 181 | 160.418 | 14.729.780 | 4,6336% | 4,634% |
| 182 | 161.296,2 | 14.891.076,2 | 4,6592% | 4,659% |
| 183 | 162.174,4 | 15.053.250,6 | 4,6848% | 4,685% |
| 184 | 163.052,6 | 15.216.303,2 | 4,7104% | 4,71% |
| 185 | 163.930,8 | 15.380.234 | 4,7360% | 4,736% |
| 186 | 164.809 | 15.545.043 | 4,7616% | 4,762% |
| 187 | 165.687,2 | 15.710.730,2 | 4,7872% | 4,787% |
| 188 | 166.565,4 | 15.877.295,6 | 4,8128% | 4,813% |
| 189 | 167.443,6 | 16.044.739,2 | 4,8384% | 4,838% |
| 190 | 168.321,8 | 16.213.061 | 4,8640% | 4,864% |
| 191 | 169.200 | 16.382.261 | 4,8896% | 4,89% |
| 192 | 170.078,2 | 16.552.339,2 | 4,9152% | 4,915% |
| 193 | 170.956,4 | 16.723.295,6 | 4,9408% | 4,941% |
| 194 | 171.834,6 | 16.895.130,2 | 4,9664% | 4,966% |
| 195 | 172.712,8 | 17.067.843 | 4,9920% | 4,992% |
| 196 | 173.591 | 17.241.434 | 5,0176% | 5,018% |
| 197 | 174.469,2 | 17.415.903,2 | 5,0432% | 5,043% |
| 198 | 175.347,4 | 17.591.250,6 | 5,0688% | 5,069% |
| 199 | 176.225,6 | 17.767.476,2 | 5,0944% | 5,094% |
| 200 | 177.103,8 | 17.944.580 | 5,1200% | 5,12% |
| 201 | 177.982 | 18.122.562 | 5,1456% | 5,146% |
| 202 | 178.860,2 | 18.301.422,2 | 5,1712% | 5,171% |
| 203 | 179.738,4 | 18.481.160,6 | 5,1968% | 5,197% |
| 204 | 180.616,6 | 18.661.777,2 | 5,2224% | 5,222% |
| 205 | 181.494,8 | 18.843.272 | 5,2480% | 5,248% |
| 206 | 182.373 | 19.025.645 | 5,2736% | 5,274% |
| 207 | 183.251,2 | 19.208.896,2 | 5,2992% | 5,299% |
| 208 | 184.129,4 | 19.393.025,6 | 5,3248% | 5,325% |
| 209 | 185.007,6 | 19.578.033,2 | 5,3504% | 5,35% |
| 210 | 185.885,8 | 19.763.919 | 5,3760% | 5,376% |
| 211 | 186.764 | 19.950.683 | 5,4016% | 5,402% |
| 212 | 187.642,2 | 20.138.325,2 | 5,4272% | 5,427% |
| 213 | 188.520,4 | 20.326.845,6 | 5,4528% | 5,453% |
| 214 | 189.398,6 | 20.516.244,2 | 5,4784% | 5,478% |
| 215 | 190.276,8 | 20.706.521 | 5,5040% | 5,504% |
| 216 | 191.155 | 20.897.676 | 5,5296% | 5,53% |
| 217 | 192.033,2 | 21.089.709,2 | 5,5552% | 5,555% |
| 218 | 192.911,4 | 21.282.620,6 | 5,5808% | 5,581% |
| 219 | 193.789,6 | 21.476.410,2 | 5,6064% | 5,606% |
| 220 | 194.667,8 | 21.671.078 | 5,6320% | 5,632% |
| 221 | 195.546 | 21.866.624 | 5,6576% | 5,658% |
| 222 | 196.424,2 | 22.063.048,2 | 5,6832% | 5,683% |
| 223 | 197.302,4 | 22.260.350,6 | 5,7088% | 5,709% |
| 224 | 198.180,6 | 22.458.531,2 | 5,7344% | 5,734% |
| 225 | 199.058,8 | 22.657.590 | 5,7600% | 5,76% |
| 226 | 199.937 | 22.857.527 | 5,7856% | 5,786% |
| 227 | 200.815,2 | 23.058.342,2 | 5,8112% | 5,811% |
| 228 | 201.693,4 | 23.260.035,6 | 5,8368% | 5,837% |
| 229 | 202.571,6 | 23.462.607,2 | 5,8624% | 5,862% |
| 230 | 203.449,8 | 23.666.057 | 5,8880% | 5,888% |
| 231 | 204.328 | 23.870.385 | 5,9136% | 5,914% |
| 232 | 205.206,2 | 24.075.591,2 | 5,9392% | 5,939% |
| 233 | 206.084,4 | 24.281.675,6 | 5,9648% | 5,965% |
| 234 | 206.962,6 | 24.488.638,2 | 5,9904% | 5,99% |
| 235 | 207.840,8 | 24.696.479 | 6,0160% | 6,016% |
| 236 | 208.719 | 24.905.198 | 6,0416% | 6,042% |
| 237 | 209.597,2 | 25.114.795,2 | 6,0672% | 6,067% |
| 238 | 210.475,4 | 25.325.270,6 | 6,0928% | 6,093% |
| 239 | 211.353,6 | 25.536.624,2 | 6,1184% | 6,118% |
| 240 | 212.231,8 | 25.748.856 | 6,1440% | 6,144% |
| 241 | 213.110 | 25.961.966 | 6,1696% | 6,17% |
| 242 | 213.988,2 | 26.175.954,2 | 6,1952% | 6,195% |
| 243 | 214.866,4 | 26.390.820,6 | 6,2208% | 6,221% |
| 244 | 215.744,6 | 26.606.565,2 | 6,2464% | 6,246% |
| 245 | 216.622,8 | 26.823.188 | 6,2720% | 6,272% |
| 246 | 217.501 | 27.040.689 | 6,2976% | 6,298% |
| 247 | 218.379,2 | 27.259.068,2 | 6,3232% | 6,323% |
| 248 | 219.257,4 | 27.478.325,6 | 6,3488% | 6,349% |
| 249 | 220.135,6 | 27.698.461,2 | 6,3744% | 6,374% |
| 250 | 221.013,8 | 27.919.475 | 6,4000% | 6,4% |
| 251 | 221.892 | 28.141.367 | 6,4256% | 6,426% |
| 252 | 222.770,2 | 28.364.137,2 | 6,4512% | 6,451% |
| 253 | 223.648,4 | 28.587.785,6 | 6,4768% | 6,477% |
| 254 | 224.526,6 | 28.812.312,2 | 6,5024% | 6,502% |
| 255 | 225.404,8 | 29.037.717 | 6,5280% | 6,528% |
| 256 | 226.283 | 29.264.000 | 6,5536% | 6,554% |
| 257 | 227.161,2 | 29.491.161,2 | 6,5792% | 6,579% |
| 258 | 228.039,4 | 29.719.200,6 | 6,6048% | 6,605% |
| 259 | 228.917,6 | 29.948.118,2 | 6,6304% | 6,63% |
| 260 | 229.795,8 | 30.177.914 | 6,6560% | 6,656% |
| 261 | 230.674 | 30.408.588 | 6,6816% | 6,682% |
| 262 | 231.552,2 | 30.640.140,2 | 6,7072% | 6,707% |
| 263 | 232.430,4 | 30.872.570,6 | 6,7328% | 6,733% |
| 264 | 233.308,6 | 31.105.879,2 | 6,7584% | 6,758% |
| 265 | 234.186,8 | 31.340.066 | 6,7840% | 6,784% |
| 266 | 235.065 | 31.575.131 | 6,8096% | 6,81% |
| 267 | 235.943,2 | 31.811.074,2 | 6,8352% | 6,835% |
| 268 | 236.821,4 | 32.047.895,6 | 6,8608% | 6,861% |
| 269 | 237.699,6 | 32.285.595,2 | 6,8864% | 6,886% |
| 270 | 238.577,8 | 32.524.173 | 6,9120% | 6,912% |
| 271 | 239.456 | 32.763.629 | 6,9376% | 6,938% |
| 272 | 240.334,2 | 33.003.963,2 | 6,9632% | 6,963% |
| 273 | 241.212,4 | 33.245.175,6 | 6,9888% | 6,989% |
| 274 | 242.090,6 | 33.487.266,2 | 7,0144% | 7,014% |
| 275 | 242.968,8 | 33.730.235 | 7,0400% | 7,04% |
| 276 | 243.847 | 33.974.082 | 7,0656% | 7,066% |
| 277 | 244.725,2 | 34.218.807,2 | 7,0912% | 7,091% |
| 278 | 245.603,4 | 34.464.410,6 | 7,1168% | 7,117% |
| 279 | 246.481,6 | 34.710.892,2 | 7,1424% | 7,142% |
| 280 | 247.359,8 | 34.958.252 | 7,1680% | 7,168% |
| 281 | 248.238 | 35.206.490 | 7,1936% | 7,194% |
| 282 | 249.116,2 | 35.455.606,2 | 7,2192% | 7,219% |
| 283 | 249.994,4 | 35.705.600,6 | 7,2448% | 7,245% |
| 284 | 250.872,6 | 35.956.473,2 | 7,2704% | 7,27% |
| 285 | 251.750,8 | 36.208.224 | 7,2960% | 7,296% |
| 286 | 252.629 | 36.460.853 | 7,3216% | 7,322% |
| 287 | 253.507,2 | 36.714.360,2 | 7,3472% | 7,347% |
| 288 | 254.385,4 | 36.968.745,6 | 7,3728% | 7,373% |
| 289 | 255.263,6 | 37.224.009,2 | 7,3984% | 7,398% |
| 290 | 256.141,8 | 37.480.151 | 7,4240% | 7,424% |
| 291 | 257.020 | 37.737.171 | 7,4496% | 7,45% |
| 292 | 257.898,2 | 37.995.069,2 | 7,4752% | 7,475% |
| 293 | 258.776,4 | 38.253.845,6 | 7,5008% | 7,501% |
| 294 | 259.654,6 | 38.513.500,2 | 7,5264% | 7,526% |
| 295 | 260.532,8 | 38.774.033 | 7,5520% | 7,552% |
| 296 | 261.411 | 39.035.444 | 7,5776% | 7,578% |
| 297 | 262.289,2 | 39.297.733,2 | 7,6032% | 7,603% |
| 298 | 263.167,4 | 39.560.900,6 | 7,6288% | 7,629% |
| 299 | 264.045,6 | 39.824.946,2 | 7,6544% | 7,654% |
| 300 | 264.923,8 | 40.089.870 | 7,6800% | 7,68% |
| 301 | 265.802 | 40.355.672 | 7,7056% | 7,706% |
| 302 | 266.680,2 | 40.622.352,2 | 7,7312% | 7,731% |
| 303 | 267.558,4 | 40.889.910,6 | 7,7568% | 7,757% |
| 304 | 268.436,6 | 41.158.347,2 | 7,7824% | 7,782% |
| 305 | 269.314,8 | 41.427.662 | 7,8080% | 7,808% |
| 306 | 270.193 | 41.697.855 | 7,8336% | 7,834% |
| 307 | 271.071,2 | 41.968.926,2 | 7,8592% | 7,859% |
| 308 | 271.949,4 | 42.240.875,6 | 7,8848% | 7,885% |
| 309 | 272.827,6 | 42.513.703,2 | 7,9104% | 7,91% |
| 310 | 273.705,8 | 42.787.409 | 7,9360% | 7,936% |
| 311 | 274.584 | 43.061.993 | 7,9616% | 7,962% |
| 312 | 275.462,2 | 43.337.455,2 | 7,9872% | 7,987% |
| 313 | 276.340,4 | 43.613.795,6 | 8,0128% | 8,013% |
| 314 | 277.218,6 | 43.891.014,2 | 8,0384% | 8,038% |
| 315 | 278.096,8 | 44.169.111 | 8,0640% | 8,064% |
| 316 | 278.975 | 44.448.086 | 8,0896% | 8,09% |
| 317 | 279.853,2 | 44.727.939,2 | 8,1152% | 8,115% |
| 318 | 280.731,4 | 45.008.670,6 | 8,1408% | 8,141% |
| 319 | 281.609,6 | 45.290.280,2 | 8,1664% | 8,166% |
| 320 | 282.487,8 | 45.572.768 | 8,1920% | 8,192% |
| 321 | 283.366 | 45.856.134 | 8,2176% | 8,218% |
| 322 | 284.244,2 | 46.140.378,2 | 8,2432% | 8,243% |
| 323 | 285.122,4 | 46.425.500,6 | 8,2688% | 8,269% |
| 324 | 286.000,6 | 46.711.501,2 | 8,2944% | 8,294% |
| 325 | 286.878,8 | 46.998.380 | 8,3200% | 8,32% |
| 326 | 287.757 | 47.286.137 | 8,3456% | 8,346% |
| 327 | 288.635,2 | 47.574.772,2 | 8,3712% | 8,371% |
| 328 | 289.513,4 | 47.864.285,6 | 8,3968% | 8,397% |
| 329 | 290.391,6 | 48.154.677,2 | 8,4224% | 8,422% |
| 330 | 291.269,8 | 48.445.947 | 8,4480% | 8,448% |
| 331 | 292.148 | 48.738.095 | 8,4736% | 8,474% |
| 332 | 293.026,2 | 49.031.121,2 | 8,4992% | 8,499% |
| 333 | 293.904,4 | 49.325.025,6 | 8,5248% | 8,525% |
| 334 | 294.782,6 | 49.619.808,2 | 8,5504% | 8,55% |
| 335 | 295.660,8 | 49.915.469 | 8,5760% | 8,576% |
| 336 | 296.539 | 50.212.008 | 8,6016% | 8,602% |
| 337 | 297.417,2 | 50.509.425,2 | 8,6272% | 8,627% |
| 338 | 298.295,4 | 50.807.720,6 | 8,6528% | 8,653% |
| 339 | 299.173,6 | 51.106.894,2 | 8,6784% | 8,678% |
| 340 | 300.051,8 | 51.406.946 | 8,7040% | 8,704% |
| 341 | 300.930 | 51.707.876 | 8,7296% | 8,73% |
| 342 | 301.808,2 | 52.009.684,2 | 8,7552% | 8,755% |
| 343 | 302.686,4 | 52.312.370,6 | 8,7808% | 8,781% |
| 344 | 303.564,6 | 52.615.935,2 | 8,8064% | 8,806% |
| 345 | 304.442,8 | 52.920.378 | 8,8320% | 8,832% |
| 346 | 305.321 | 53.225.699 | 8,8576% | 8,858% |
| 347 | 306.199,2 | 53.531.898,2 | 8,8832% | 8,883% |
| 348 | 307.077,4 | 53.838.975,6 | 8,9088% | 8,909% |
| 349 | 307.955,6 | 54.146.931,2 | 8,9344% | 8,934% |
| 350 | 308.833,8 | 54.455.765 | 8,9600% | 8,96% |
| 351 | 309.712 | 54.765.477 | 8,9856% | 8,986% |
| 352 | 310.590,2 | 55.076.067,2 | 9,0112% | 9,011% |
| 353 | 311.468,4 | 55.387.535,6 | 9,0368% | 9,037% |
| 354 | 312.346,6 | 55.699.882,2 | 9,0624% | 9,062% |
| 355 | 313.224,8 | 56.013.107 | 9,0880% | 9,088% |
| 356 | 314.103 | 56.327.210 | 9,1136% | 9,114% |
| 357 | 314.981,2 | 56.642.191,2 | 9,1392% | 9,139% |
| 358 | 315.859,4 | 56.958.050,6 | 9,1648% | 9,165% |
| 359 | 316.737,6 | 57.274.788,2 | 9,1904% | 9,19% |
| 360 | 317.615,8 | 57.592.404 | 9,2160% | 9,216% |
| 361 | 318.494 | 57.910.898 | 9,2416% | 9,242% |
| 362 | 319.372,2 | 58.230.270,2 | 9,2672% | 9,267% |
| 363 | 320.250,4 | 58.550.520,6 | 9,2928% | 9,293% |
| 364 | 321.128,6 | 58.871.649,2 | 9,3184% | 9,318% |
| 365 | 322.006,8 | 59.193.656 | 9,3440% | 9,344% |
| 366 | 322.885 | 59.516.541 | 9,3696% | 9,37% |
| 367 | 323.763,2 | 59.840.304,2 | 9,3952% | 9,395% |
| 368 | 324.641,4 | 60.164.945,6 | 9,4208% | 9,421% |
| 369 | 325.519,6 | 60.490.465,2 | 9,4464% | 9,446% |
| 370 | 326.397,8 | 60.816.863 | 9,4720% | 9,472% |
| 371 | 327.276 | 61.144.139 | 9,4976% | 9,498% |
| 372 | 328.154,2 | 61.472.293,2 | 9,5232% | 9,523% |
| 373 | 329.032,4 | 61.801.325,6 | 9,5488% | 9,549% |
| 374 | 329.910,6 | 62.131.236,2 | 9,5744% | 9,574% |
| 375 | 330.788,8 | 62.462.025 | 9,6000% | 9,6% |
| 376 | 331.667 | 62.793.692 | 9,6256% | 9,626% |
| 377 | 332.545,2 | 63.126.237,2 | 9,6512% | 9,651% |
| 378 | 333.423,4 | 63.459.660,6 | 9,6768% | 9,677% |
| 379 | 334.301,6 | 63.793.962,2 | 9,7024% | 9,702% |
| 380 | 335.179,8 | 64.129.142 | 9,7280% | 9,728% |
| 381 | 336.058 | 64.465.200 | 9,7536% | 9,754% |
| 382 | 336.936,2 | 64.802.136,2 | 9,7792% | 9,779% |
| 383 | 337.814,4 | 65.139.950,6 | 9,8048% | 9,805% |
| 384 | 338.692,6 | 65.478.643,2 | 9,8304% | 9,83% |
| 385 | 339.570,8 | 65.818.214 | 9,8560% | 9,856% |
| 386 | 340.449 | 66.158.663 | 9,8816% | 9,882% |
| 387 | 341.327,2 | 66.499.990,2 | 9,9072% | 9,907% |
| 388 | 342.205,4 | 66.842.195,6 | 9,9328% | 9,933% |
| 389 | 343.083,6 | 67.185.279,2 | 9,9584% | 9,958% |
| 390 | 343.961,8 | 67.529.241 | 9,9840% | 9,984% |
| 391 | 344.840 | 67.874.081 | 10,0096% | 10,01% |
| 392 | 345.718,2 | 68.219.799,2 | 10,0352% | 10,04% |
| 393 | 346.596,4 | 68.566.395,6 | 10,0608% | 10,06% |
| 394 | 347.474,6 | 68.913.870,2 | 10,0864% | 10,09% |
| 395 | 348.352,8 | 69.262.223 | 10,1120% | 10,11% |
| 396 | 349.231 | 69.611.454 | 10,1376% | 10,14% |
| 397 | 350.109,2 | 69.961.563,2 | 10,1632% | 10,16% |
| 398 | 350.987,4 | 70.312.550,6 | 10,1888% | 10,19% |
| 399 | 351.865,6 | 70.664.416,2 | 10,2144% | 10,21% |
| 400 | 352.743,8 | 71.017.160 | 10,2400% | 10,24% |
| 401 | 353.622 | 71.370.782 | 10,2656% | 10,27% |
| 402 | 354.500,2 | 71.725.282,2 | 10,2912% | 10,29% |
| 403 | 355.378,4 | 72.080.660,6 | 10,3168% | 10,32% |
| 404 | 356.256,6 | 72.436.917,2 | 10,3424% | 10,34% |
| 405 | 357.134,8 | 72.794.052 | 10,3680% | 10,37% |
| 406 | 358.013 | 73.152.065 | 10,3936% | 10,39% |
| 407 | 358.891,2 | 73.510.956,2 | 10,4192% | 10,42% |
| 408 | 359.769,4 | 73.870.725,6 | 10,4448% | 10,44% |
| 409 | 360.647,6 | 74.231.373,2 | 10,4704% | 10,47% |
| 410 | 361.525,8 | 74.592.899 | 10,4960% | 10,5% |
| 411 | 362.404 | 74.955.303 | 10,5216% | 10,52% |
| 412 | 363.282,2 | 75.318.585,2 | 10,5472% | 10,55% |
| 413 | 364.160,4 | 75.682.745,6 | 10,5728% | 10,57% |
| 414 | 365.038,6 | 76.047.784,2 | 10,5984% | 10,6% |
| 415 | 365.916,8 | 76.413.701 | 10,6240% | 10,62% |
| 416 | 366.795 | 76.780.496 | 10,6496% | 10,65% |
| 417 | 367.673,2 | 77.148.169,2 | 10,6752% | 10,68% |
| 418 | 368.551,4 | 77.516.720,6 | 10,7008% | 10,7% |
| 419 | 369.429,6 | 77.886.150,2 | 10,7264% | 10,73% |
| 420 | 370.307,8 | 78.256.458 | 10,7520% | 10,75% |
| 421 | 371.186 | 78.627.644 | 10,7776% | 10,78% |
| 422 | 372.064,2 | 78.999.708,2 | 10,8032% | 10,8% |
| 423 | 372.942,4 | 79.372.650,6 | 10,8288% | 10,83% |
| 424 | 373.820,6 | 79.746.471,2 | 10,8544% | 10,85% |
| 425 | 374.698,8 | 80.121.170 | 10,8800% | 10,88% |
| 426 | 375.577 | 80.496.747 | 10,9056% | 10,91% |
| 427 | 376.455,2 | 80.873.202,2 | 10,9312% | 10,93% |
| 428 | 377.333,4 | 81.250.535,6 | 10,9568% | 10,96% |
| 429 | 378.211,6 | 81.628.747,2 | 10,9824% | 10,98% |
| 430 | 379.089,8 | 82.007.837 | 11,0080% | 11,01% |
| 431 | 379.968 | 82.387.805 | 11,0336% | 11,03% |
| 432 | 380.846,2 | 82.768.651,2 | 11,0592% | 11,06% |
| 433 | 381.724,4 | 83.150.375,6 | 11,0848% | 11,08% |
| 434 | 382.602,6 | 83.532.978,2 | 11,1104% | 11,11% |
| 435 | 383.480,8 | 83.916.459 | 11,1360% | 11,14% |
| 436 | 384.359 | 84.300.818 | 11,1616% | 11,16% |
| 437 | 385.237,2 | 84.686.055,2 | 11,1872% | 11,19% |
| 438 | 386.115,4 | 85.072.170,6 | 11,2128% | 11,21% |
| 439 | 386.993,6 | 85.459.164,2 | 11,2384% | 11,24% |
| 440 | 387.871,8 | 85.847.036 | 11,2640% | 11,26% |
| 441 | 388.750 | 86.235.786 | 11,2896% | 11,29% |
| 442 | 389.628,2 | 86.625.414,2 | 11,3152% | 11,32% |
| 443 | 390.506,4 | 87.015.920,6 | 11,3408% | 11,34% |
| 444 | 391.384,6 | 87.407.305,2 | 11,3664% | 11,37% |
| 445 | 392.262,8 | 87.799.568 | 11,3920% | 11,39% |
| 446 | 393.141 | 88.192.709 | 11,4176% | 11,42% |
| 447 | 394.019,2 | 88.586.728,2 | 11,4432% | 11,44% |
| 448 | 394.897,4 | 88.981.625,6 | 11,4688% | 11,47% |
| 449 | 395.775,6 | 89.377.401,2 | 11,4944% | 11,49% |
| 450 | 396.653,8 | 89.774.055 | 11,5200% | 11,52% |
| 451 | 397.532 | 90.171.587 | 11,5456% | 11,55% |
| 452 | 398.410,2 | 90.569.997,2 | 11,5712% | 11,57% |
| 453 | 399.288,4 | 90.969.285,6 | 11,5968% | 11,6% |
| 454 | 400.166,6 | 91.369.452,2 | 11,6224% | 11,62% |
| 455 | 401.044,8 | 91.770.497 | 11,6480% | 11,65% |
| 456 | 401.923 | 92.172.420 | 11,6736% | 11,67% |
| 457 | 402.801,2 | 92.575.221,2 | 11,6992% | 11,7% |
| 458 | 403.679,4 | 92.978.900,6 | 11,7248% | 11,72% |
| 459 | 404.557,6 | 93.383.458,2 | 11,7504% | 11,75% |
| 460 | 405.435,8 | 93.788.894 | 11,7760% | 11,78% |
| 461 | 406.314 | 94.195.208 | 11,8016% | 11,8% |
| 462 | 407.192,2 | 94.602.400,2 | 11,8272% | 11,83% |
| 463 | 408.070,4 | 95.010.470,6 | 11,8528% | 11,85% |
| 464 | 408.948,6 | 95.419.419,2 | 11,8784% | 11,88% |
| 465 | 409.826,8 | 95.829.246 | 11,9040% | 11,9% |
| 466 | 410.705 | 96.239.951 | 11,9296% | 11,93% |
| 467 | 411.583,2 | 96.651.534,2 | 11,9552% | 11,96% |
| 468 | 412.461,4 | 97.063.995,6 | 11,9808% | 11,98% |
| 469 | 413.339,6 | 97.477.335,2 | 12,0064% | 12,01% |
| 470 | 414.217,8 | 97.891.553 | 12,0320% | 12,03% |
| 471 | 415.096 | 98.306.649 | 12,0576% | 12,06% |
| 472 | 415.974,2 | 98.722.623,2 | 12,0832% | 12,08% |
| 473 | 416.852,4 | 99.139.475,6 | 12,1088% | 12,11% |
| 474 | 417.730,6 | 99.557.206,2 | 12,1344% | 12,13% |
| 475 | 418.608,8 | 99.975.815 | 12,1600% | 12,16% |
| 476 | 419.487 | 100.395.302 | 12,1856% | 12,19% |
| 477 | 420.365,2 | 100.815.667,2 | 12,2112% | 12,21% |
| 478 | 421.243,4 | 101.236.910,6 | 12,2368% | 12,24% |
| 479 | 422.121,6 | 101.659.032,2 | 12,2624% | 12,26% |
| 480 | 422.999,8 | 102.082.032 | 12,2880% | 12,29% |
| 481 | 423.878 | 102.505.910 | 12,3136% | 12,31% |
| 482 | 424.756,2 | 102.930.666,2 | 12,3392% | 12,34% |
| 483 | 425.634,4 | 103.356.300,6 | 12,3648% | 12,36% |
| 484 | 426.512,6 | 103.782.813,2 | 12,3904% | 12,39% |
| 485 | 427.390,8 | 104.210.204 | 12,4160% | 12,42% |
| 486 | 428.269 | 104.638.473 | 12,4416% | 12,44% |
| 487 | 429.147,2 | 105.067.620,2 | 12,4672% | 12,47% |
| 488 | 430.025,4 | 105.497.645,6 | 12,4928% | 12,49% |
| 489 | 430.903,6 | 105.928.549,2 | 12,5184% | 12,52% |
| 490 | 431.781,8 | 106.360.331 | 12,5440% | 12,54% |
| 491 | 432.660 | 106.792.991 | 12,5696% | 12,57% |
| 492 | 433.538,2 | 107.226.529,2 | 12,5952% | 12,6% |
| 493 | 434.416,4 | 107.660.945,6 | 12,6208% | 12,62% |
| 494 | 435.294,6 | 108.096.240,2 | 12,6464% | 12,65% |
| 495 | 436.172,8 | 108.532.413 | 12,6720% | 12,67% |
| 496 | 437.051 | 108.969.464 | 12,6976% | 12,7% |
| 497 | 437.929,2 | 109.407.393,2 | 12,7232% | 12,72% |
| 498 | 438.807,4 | 109.846.200,6 | 12,7488% | 12,75% |
| 499 | 439.685,6 | 110.285.886,2 | 12,7744% | 12,77% |
| 500 | 440.563,8 | 110.726.450 | 12,8000% | 12,8% |

### Anexo — Espantalho

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 2.927 | 2.927 | 0,0187% | 0,0187% |
| 2 | 4.098 | 7.025 | 0,0374% | 0,0374% |
| 3 | 5.269 | 12.294 | 0,0561% | 0,0561% |
| 4 | 6.440 | 18.734 | 0,0748% | 0,0748% |
| 5 | 7.611 | 26.345 | 0,0935% | 0,0935% |
| 6 | 8.782 | 35.127 | 0,1122% | 0,1122% |
| 7 | 9.953 | 45.080 | 0,1309% | 0,1309% |
| 8 | 11.124 | 56.204 | 0,1496% | 0,1496% |
| 9 | 12.295 | 68.499 | 0,1683% | 0,1683% |
| 10 | 13.466 | 81.965 | 0,1870% | 0,187% |
| 11 | 14.637 | 96.602 | 0,2057% | 0,2057% |
| 12 | 15.808 | 112.410 | 0,2244% | 0,2244% |
| 13 | 16.979 | 129.389 | 0,2431% | 0,2431% |
| 14 | 18.150 | 147.539 | 0,2618% | 0,2618% |
| 15 | 19.321 | 166.860 | 0,2805% | 0,2805% |
| 16 | 20.492 | 187.352 | 0,2992% | 0,2992% |
| 17 | 21.663 | 209.015 | 0,3179% | 0,3179% |
| 18 | 22.834 | 231.849 | 0,3366% | 0,3366% |
| 19 | 24.005 | 255.854 | 0,3553% | 0,3553% |
| 20 | 25.176 | 281.030 | 0,3740% | 0,374% |
| 21 | 26.347 | 307.377 | 0,3927% | 0,3927% |
| 22 | 27.518 | 334.895 | 0,4114% | 0,4114% |
| 23 | 28.689 | 363.584 | 0,4301% | 0,4301% |
| 24 | 29.860 | 393.444 | 0,4488% | 0,4488% |
| 25 | 31.031 | 424.475 | 0,4675% | 0,4675% |
| 26 | 32.202 | 456.677 | 0,4862% | 0,4862% |
| 27 | 33.373 | 490.050 | 0,5049% | 0,5049% |
| 28 | 34.544 | 524.594 | 0,5236% | 0,5236% |
| 29 | 35.715 | 560.309 | 0,5423% | 0,5423% |
| 30 | 36.886 | 597.195 | 0,5610% | 0,561% |
| 31 | 38.057 | 635.252 | 0,5797% | 0,5797% |
| 32 | 39.228 | 674.480 | 0,5984% | 0,5984% |
| 33 | 40.399 | 714.879 | 0,6171% | 0,6171% |
| 34 | 41.570 | 756.449 | 0,6358% | 0,6358% |
| 35 | 42.741 | 799.190 | 0,6545% | 0,6545% |
| 36 | 43.912 | 843.102 | 0,6732% | 0,6732% |
| 37 | 45.083 | 888.185 | 0,6919% | 0,6919% |
| 38 | 46.254 | 934.439 | 0,7106% | 0,7106% |
| 39 | 47.425 | 981.864 | 0,7293% | 0,7293% |
| 40 | 48.596 | 1.030.460 | 0,7480% | 0,748% |
| 41 | 49.767 | 1.080.227 | 0,7667% | 0,7667% |
| 42 | 50.938 | 1.131.165 | 0,7854% | 0,7854% |
| 43 | 52.109 | 1.183.274 | 0,8041% | 0,8041% |
| 44 | 53.280 | 1.236.554 | 0,8228% | 0,8228% |
| 45 | 54.451 | 1.291.005 | 0,8415% | 0,8415% |
| 46 | 55.622 | 1.346.627 | 0,8602% | 0,8602% |
| 47 | 56.793 | 1.403.420 | 0,8789% | 0,8789% |
| 48 | 57.964 | 1.461.384 | 0,8976% | 0,8976% |
| 49 | 59.135 | 1.520.519 | 0,9163% | 0,9163% |
| 50 | 60.306 | 1.580.825 | 0,9350% | 0,935% |
| 51 | 61.477 | 1.642.302 | 0,9537% | 0,9537% |
| 52 | 62.648 | 1.704.950 | 0,9724% | 0,9724% |
| 53 | 63.819 | 1.768.769 | 0,9911% | 0,9911% |
| 54 | 64.990 | 1.833.759 | 1,0098% | 1,01% |
| 55 | 66.161 | 1.899.920 | 1,0285% | 1,029% |
| 56 | 67.332 | 1.967.252 | 1,0472% | 1,047% |
| 57 | 68.503 | 2.035.755 | 1,0659% | 1,066% |
| 58 | 69.674 | 2.105.429 | 1,0846% | 1,085% |
| 59 | 70.845 | 2.176.274 | 1,1033% | 1,103% |
| 60 | 72.016 | 2.248.290 | 1,1220% | 1,122% |
| 61 | 73.187 | 2.321.477 | 1,1407% | 1,141% |
| 62 | 74.358 | 2.395.835 | 1,1594% | 1,159% |
| 63 | 75.529 | 2.471.364 | 1,1781% | 1,178% |
| 64 | 76.700 | 2.548.064 | 1,1968% | 1,197% |
| 65 | 77.871 | 2.625.935 | 1,2155% | 1,216% |
| 66 | 79.042 | 2.704.977 | 1,2342% | 1,234% |
| 67 | 80.213 | 2.785.190 | 1,2529% | 1,253% |
| 68 | 81.384 | 2.866.574 | 1,2716% | 1,272% |
| 69 | 82.555 | 2.949.129 | 1,2903% | 1,29% |
| 70 | 83.726 | 3.032.855 | 1,3090% | 1,309% |
| 71 | 84.897 | 3.117.752 | 1,3277% | 1,328% |
| 72 | 86.068 | 3.203.820 | 1,3464% | 1,346% |
| 73 | 87.239 | 3.291.059 | 1,3651% | 1,365% |
| 74 | 88.410 | 3.379.469 | 1,3838% | 1,384% |
| 75 | 89.581 | 3.469.050 | 1,4025% | 1,403% |
| 76 | 90.752 | 3.559.802 | 1,4212% | 1,421% |
| 77 | 91.923 | 3.651.725 | 1,4399% | 1,44% |
| 78 | 93.094 | 3.744.819 | 1,4586% | 1,459% |
| 79 | 94.265 | 3.839.084 | 1,4773% | 1,477% |
| 80 | 95.436 | 3.934.520 | 1,4960% | 1,496% |
| 81 | 96.607 | 4.031.127 | 1,5147% | 1,515% |
| 82 | 97.778 | 4.128.905 | 1,5334% | 1,533% |
| 83 | 98.949 | 4.227.854 | 1,5521% | 1,552% |
| 84 | 100.120 | 4.327.974 | 1,5708% | 1,571% |
| 85 | 101.291 | 4.429.265 | 1,5895% | 1,59% |
| 86 | 102.462 | 4.531.727 | 1,6082% | 1,608% |
| 87 | 103.633 | 4.635.360 | 1,6269% | 1,627% |
| 88 | 104.804 | 4.740.164 | 1,6456% | 1,646% |
| 89 | 105.975 | 4.846.139 | 1,6643% | 1,664% |
| 90 | 107.146 | 4.953.285 | 1,6830% | 1,683% |
| 91 | 108.317 | 5.061.602 | 1,7017% | 1,702% |
| 92 | 109.488 | 5.171.090 | 1,7204% | 1,72% |
| 93 | 110.659 | 5.281.749 | 1,7391% | 1,739% |
| 94 | 111.830 | 5.393.579 | 1,7578% | 1,758% |
| 95 | 113.001 | 5.506.580 | 1,7765% | 1,777% |
| 96 | 114.172 | 5.620.752 | 1,7952% | 1,795% |
| 97 | 115.343 | 5.736.095 | 1,8139% | 1,814% |
| 98 | 116.514 | 5.852.609 | 1,8326% | 1,833% |
| 99 | 117.685 | 5.970.294 | 1,8513% | 1,851% |
| 100 | 118.856 | 6.089.150 | 1,8700% | 1,87% |
| 101 | 120.027 | 6.209.177 | 1,8887% | 1,889% |
| 102 | 121.198 | 6.330.375 | 1,9074% | 1,907% |
| 103 | 122.369 | 6.452.744 | 1,9261% | 1,926% |
| 104 | 123.540 | 6.576.284 | 1,9448% | 1,945% |
| 105 | 124.711 | 6.700.995 | 1,9635% | 1,964% |
| 106 | 125.882 | 6.826.877 | 1,9822% | 1,982% |
| 107 | 127.053 | 6.953.930 | 2,0009% | 2,001% |
| 108 | 128.224 | 7.082.154 | 2,0196% | 2,02% |
| 109 | 129.395 | 7.211.549 | 2,0383% | 2,038% |
| 110 | 130.566 | 7.342.115 | 2,0570% | 2,057% |
| 111 | 131.737 | 7.473.852 | 2,0757% | 2,076% |
| 112 | 132.908 | 7.606.760 | 2,0944% | 2,094% |
| 113 | 134.079 | 7.740.839 | 2,1131% | 2,113% |
| 114 | 135.250 | 7.876.089 | 2,1318% | 2,132% |
| 115 | 136.421 | 8.012.510 | 2,1505% | 2,151% |
| 116 | 137.592 | 8.150.102 | 2,1692% | 2,169% |
| 117 | 138.763 | 8.288.865 | 2,1879% | 2,188% |
| 118 | 139.934 | 8.428.799 | 2,2066% | 2,207% |
| 119 | 141.105 | 8.569.904 | 2,2253% | 2,225% |
| 120 | 142.276 | 8.712.180 | 2,2440% | 2,244% |
| 121 | 143.447 | 8.855.627 | 2,2627% | 2,263% |
| 122 | 144.618 | 9.000.245 | 2,2814% | 2,281% |
| 123 | 145.789 | 9.146.034 | 2,3001% | 2,3% |
| 124 | 146.960 | 9.292.994 | 2,3188% | 2,319% |
| 125 | 148.131 | 9.441.125 | 2,3375% | 2,338% |
| 126 | 149.302 | 9.590.427 | 2,3562% | 2,356% |
| 127 | 150.473 | 9.740.900 | 2,3749% | 2,375% |
| 128 | 151.644 | 9.892.544 | 2,3936% | 2,394% |
| 129 | 152.815 | 10.045.359 | 2,4123% | 2,412% |
| 130 | 153.986 | 10.199.345 | 2,4310% | 2,431% |
| 131 | 155.157 | 10.354.502 | 2,4497% | 2,45% |
| 132 | 156.328 | 10.510.830 | 2,4684% | 2,468% |
| 133 | 157.499 | 10.668.329 | 2,4871% | 2,487% |
| 134 | 158.670 | 10.826.999 | 2,5058% | 2,506% |
| 135 | 159.841 | 10.986.840 | 2,5245% | 2,525% |
| 136 | 161.012 | 11.147.852 | 2,5432% | 2,543% |
| 137 | 162.183 | 11.310.035 | 2,5619% | 2,562% |
| 138 | 163.354 | 11.473.389 | 2,5806% | 2,581% |
| 139 | 164.525 | 11.637.914 | 2,5993% | 2,599% |
| 140 | 165.696 | 11.803.610 | 2,6180% | 2,618% |
| 141 | 166.867 | 11.970.477 | 2,6367% | 2,637% |
| 142 | 168.038 | 12.138.515 | 2,6554% | 2,655% |
| 143 | 169.209 | 12.307.724 | 2,6741% | 2,674% |
| 144 | 170.380 | 12.478.104 | 2,6928% | 2,693% |
| 145 | 171.551 | 12.649.655 | 2,7115% | 2,712% |
| 146 | 172.722 | 12.822.377 | 2,7302% | 2,73% |
| 147 | 173.893 | 12.996.270 | 2,7489% | 2,749% |
| 148 | 175.064 | 13.171.334 | 2,7676% | 2,768% |
| 149 | 176.235 | 13.347.569 | 2,7863% | 2,786% |
| 150 | 177.406 | 13.524.975 | 2,8050% | 2,805% |
| 151 | 178.577 | 13.703.552 | 2,8237% | 2,824% |
| 152 | 179.748 | 13.883.300 | 2,8424% | 2,842% |
| 153 | 180.919 | 14.064.219 | 2,8611% | 2,861% |
| 154 | 182.090 | 14.246.309 | 2,8798% | 2,88% |
| 155 | 183.261 | 14.429.570 | 2,8985% | 2,899% |
| 156 | 184.432 | 14.614.002 | 2,9172% | 2,917% |
| 157 | 185.603 | 14.799.605 | 2,9359% | 2,936% |
| 158 | 186.774 | 14.986.379 | 2,9546% | 2,955% |
| 159 | 187.945 | 15.174.324 | 2,9733% | 2,973% |
| 160 | 189.116 | 15.363.440 | 2,9920% | 2,992% |
| 161 | 190.287 | 15.553.727 | 3,0107% | 3,011% |
| 162 | 191.458 | 15.745.185 | 3,0294% | 3,029% |
| 163 | 192.629 | 15.937.814 | 3,0481% | 3,048% |
| 164 | 193.800 | 16.131.614 | 3,0668% | 3,067% |
| 165 | 194.971 | 16.326.585 | 3,0855% | 3,086% |
| 166 | 196.142 | 16.522.727 | 3,1042% | 3,104% |
| 167 | 197.313 | 16.720.040 | 3,1229% | 3,123% |
| 168 | 198.484 | 16.918.524 | 3,1416% | 3,142% |
| 169 | 199.655 | 17.118.179 | 3,1603% | 3,16% |
| 170 | 200.826 | 17.319.005 | 3,1790% | 3,179% |
| 171 | 201.997 | 17.521.002 | 3,1977% | 3,198% |
| 172 | 203.168 | 17.724.170 | 3,2164% | 3,216% |
| 173 | 204.339 | 17.928.509 | 3,2351% | 3,235% |
| 174 | 205.510 | 18.134.019 | 3,2538% | 3,254% |
| 175 | 206.681 | 18.340.700 | 3,2725% | 3,273% |
| 176 | 207.852 | 18.548.552 | 3,2912% | 3,291% |
| 177 | 209.023 | 18.757.575 | 3,3099% | 3,31% |
| 178 | 210.194 | 18.967.769 | 3,3286% | 3,329% |
| 179 | 211.365 | 19.179.134 | 3,3473% | 3,347% |
| 180 | 212.536 | 19.391.670 | 3,3660% | 3,366% |
| 181 | 213.707 | 19.605.377 | 3,3847% | 3,385% |
| 182 | 214.878 | 19.820.255 | 3,4034% | 3,403% |
| 183 | 216.049 | 20.036.304 | 3,4221% | 3,422% |
| 184 | 217.220 | 20.253.524 | 3,4408% | 3,441% |
| 185 | 218.391 | 20.471.915 | 3,4595% | 3,46% |
| 186 | 219.562 | 20.691.477 | 3,4782% | 3,478% |
| 187 | 220.733 | 20.912.210 | 3,4969% | 3,497% |
| 188 | 221.904 | 21.134.114 | 3,5156% | 3,516% |
| 189 | 223.075 | 21.357.189 | 3,5343% | 3,534% |
| 190 | 224.246 | 21.581.435 | 3,5530% | 3,553% |
| 191 | 225.417 | 21.806.852 | 3,5717% | 3,572% |
| 192 | 226.588 | 22.033.440 | 3,5904% | 3,59% |
| 193 | 227.759 | 22.261.199 | 3,6091% | 3,609% |
| 194 | 228.930 | 22.490.129 | 3,6278% | 3,628% |
| 195 | 230.101 | 22.720.230 | 3,6465% | 3,647% |
| 196 | 231.272 | 22.951.502 | 3,6652% | 3,665% |
| 197 | 232.443 | 23.183.945 | 3,6839% | 3,684% |
| 198 | 233.614 | 23.417.559 | 3,7026% | 3,703% |
| 199 | 234.785 | 23.652.344 | 3,7213% | 3,721% |
| 200 | 235.956 | 23.888.300 | 3,7400% | 3,74% |
| 201 | 237.127 | 24.125.427 | 3,7587% | 3,759% |
| 202 | 238.298 | 24.363.725 | 3,7774% | 3,777% |
| 203 | 239.469 | 24.603.194 | 3,7961% | 3,796% |
| 204 | 240.640 | 24.843.834 | 3,8148% | 3,815% |
| 205 | 241.811 | 25.085.645 | 3,8335% | 3,834% |
| 206 | 242.982 | 25.328.627 | 3,8522% | 3,852% |
| 207 | 244.153 | 25.572.780 | 3,8709% | 3,871% |
| 208 | 245.324 | 25.818.104 | 3,8896% | 3,89% |
| 209 | 246.495 | 26.064.599 | 3,9083% | 3,908% |
| 210 | 247.666 | 26.312.265 | 3,9270% | 3,927% |
| 211 | 248.837 | 26.561.102 | 3,9457% | 3,946% |
| 212 | 250.008 | 26.811.110 | 3,9644% | 3,964% |
| 213 | 251.179 | 27.062.289 | 3,9831% | 3,983% |
| 214 | 252.350 | 27.314.639 | 4,0018% | 4,002% |
| 215 | 253.521 | 27.568.160 | 4,0205% | 4,021% |
| 216 | 254.692 | 27.822.852 | 4,0392% | 4,039% |
| 217 | 255.863 | 28.078.715 | 4,0579% | 4,058% |
| 218 | 257.034 | 28.335.749 | 4,0766% | 4,077% |
| 219 | 258.205 | 28.593.954 | 4,0953% | 4,095% |
| 220 | 259.376 | 28.853.330 | 4,1140% | 4,114% |
| 221 | 260.547 | 29.113.877 | 4,1327% | 4,133% |
| 222 | 261.718 | 29.375.595 | 4,1514% | 4,151% |
| 223 | 262.889 | 29.638.484 | 4,1701% | 4,17% |
| 224 | 264.060 | 29.902.544 | 4,1888% | 4,189% |
| 225 | 265.231 | 30.167.775 | 4,2075% | 4,208% |
| 226 | 266.402 | 30.434.177 | 4,2262% | 4,226% |
| 227 | 267.573 | 30.701.750 | 4,2449% | 4,245% |
| 228 | 268.744 | 30.970.494 | 4,2636% | 4,264% |
| 229 | 269.915 | 31.240.409 | 4,2823% | 4,282% |
| 230 | 271.086 | 31.511.495 | 4,3010% | 4,301% |
| 231 | 272.257 | 31.783.752 | 4,3197% | 4,32% |
| 232 | 273.428 | 32.057.180 | 4,3384% | 4,338% |
| 233 | 274.599 | 32.331.779 | 4,3571% | 4,357% |
| 234 | 275.770 | 32.607.549 | 4,3758% | 4,376% |
| 235 | 276.941 | 32.884.490 | 4,3945% | 4,395% |
| 236 | 278.112 | 33.162.602 | 4,4132% | 4,413% |
| 237 | 279.283 | 33.441.885 | 4,4319% | 4,432% |
| 238 | 280.454 | 33.722.339 | 4,4506% | 4,451% |
| 239 | 281.625 | 34.003.964 | 4,4693% | 4,469% |
| 240 | 282.796 | 34.286.760 | 4,4880% | 4,488% |
| 241 | 283.967 | 34.570.727 | 4,5067% | 4,507% |
| 242 | 285.138 | 34.855.865 | 4,5254% | 4,525% |
| 243 | 286.309 | 35.142.174 | 4,5441% | 4,544% |
| 244 | 287.480 | 35.429.654 | 4,5628% | 4,563% |
| 245 | 288.651 | 35.718.305 | 4,5815% | 4,582% |
| 246 | 289.822 | 36.008.127 | 4,6002% | 4,6% |
| 247 | 290.993 | 36.299.120 | 4,6189% | 4,619% |
| 248 | 292.164 | 36.591.284 | 4,6376% | 4,638% |
| 249 | 293.335 | 36.884.619 | 4,6563% | 4,656% |
| 250 | 294.506 | 37.179.125 | 4,6750% | 4,675% |
| 251 | 295.677 | 37.474.802 | 4,6937% | 4,694% |
| 252 | 296.848 | 37.771.650 | 4,7124% | 4,712% |
| 253 | 298.019 | 38.069.669 | 4,7311% | 4,731% |
| 254 | 299.190 | 38.368.859 | 4,7498% | 4,75% |
| 255 | 300.361 | 38.669.220 | 4,7685% | 4,769% |
| 256 | 301.532 | 38.970.752 | 4,7872% | 4,787% |
| 257 | 302.703 | 39.273.455 | 4,8059% | 4,806% |
| 258 | 303.874 | 39.577.329 | 4,8246% | 4,825% |
| 259 | 305.045 | 39.882.374 | 4,8433% | 4,843% |
| 260 | 306.216 | 40.188.590 | 4,8620% | 4,862% |
| 261 | 307.387 | 40.495.977 | 4,8807% | 4,881% |
| 262 | 308.558 | 40.804.535 | 4,8994% | 4,899% |
| 263 | 309.729 | 41.114.264 | 4,9181% | 4,918% |
| 264 | 310.900 | 41.425.164 | 4,9368% | 4,937% |
| 265 | 312.071 | 41.737.235 | 4,9555% | 4,956% |
| 266 | 313.242 | 42.050.477 | 4,9742% | 4,974% |
| 267 | 314.413 | 42.364.890 | 4,9929% | 4,993% |
| 268 | 315.584 | 42.680.474 | 5,0116% | 5,012% |
| 269 | 316.755 | 42.997.229 | 5,0303% | 5,03% |
| 270 | 317.926 | 43.315.155 | 5,0490% | 5,049% |
| 271 | 319.097 | 43.634.252 | 5,0677% | 5,068% |
| 272 | 320.268 | 43.954.520 | 5,0864% | 5,086% |
| 273 | 321.439 | 44.275.959 | 5,1051% | 5,105% |
| 274 | 322.610 | 44.598.569 | 5,1238% | 5,124% |
| 275 | 323.781 | 44.922.350 | 5,1425% | 5,143% |
| 276 | 324.952 | 45.247.302 | 5,1612% | 5,161% |
| 277 | 326.123 | 45.573.425 | 5,1799% | 5,18% |
| 278 | 327.294 | 45.900.719 | 5,1986% | 5,199% |
| 279 | 328.465 | 46.229.184 | 5,2173% | 5,217% |
| 280 | 329.636 | 46.558.820 | 5,2360% | 5,236% |
| 281 | 330.807 | 46.889.627 | 5,2547% | 5,255% |
| 282 | 331.978 | 47.221.605 | 5,2734% | 5,273% |
| 283 | 333.149 | 47.554.754 | 5,2921% | 5,292% |
| 284 | 334.320 | 47.889.074 | 5,3108% | 5,311% |
| 285 | 335.491 | 48.224.565 | 5,3295% | 5,33% |
| 286 | 336.662 | 48.561.227 | 5,3482% | 5,348% |
| 287 | 337.833 | 48.899.060 | 5,3669% | 5,367% |
| 288 | 339.004 | 49.238.064 | 5,3856% | 5,386% |
| 289 | 340.175 | 49.578.239 | 5,4043% | 5,404% |
| 290 | 341.346 | 49.919.585 | 5,4230% | 5,423% |
| 291 | 342.517 | 50.262.102 | 5,4417% | 5,442% |
| 292 | 343.688 | 50.605.790 | 5,4604% | 5,46% |
| 293 | 344.859 | 50.950.649 | 5,4791% | 5,479% |
| 294 | 346.030 | 51.296.679 | 5,4978% | 5,498% |
| 295 | 347.201 | 51.643.880 | 5,5165% | 5,517% |
| 296 | 348.372 | 51.992.252 | 5,5352% | 5,535% |
| 297 | 349.543 | 52.341.795 | 5,5539% | 5,554% |
| 298 | 350.714 | 52.692.509 | 5,5726% | 5,573% |
| 299 | 351.885 | 53.044.394 | 5,5913% | 5,591% |
| 300 | 353.056 | 53.397.450 | 5,6100% | 5,61% |
| 301 | 354.227 | 53.751.677 | 5,6287% | 5,629% |
| 302 | 355.398 | 54.107.075 | 5,6474% | 5,647% |
| 303 | 356.569 | 54.463.644 | 5,6661% | 5,666% |
| 304 | 357.740 | 54.821.384 | 5,6848% | 5,685% |
| 305 | 358.911 | 55.180.295 | 5,7035% | 5,704% |
| 306 | 360.082 | 55.540.377 | 5,7222% | 5,722% |
| 307 | 361.253 | 55.901.630 | 5,7409% | 5,741% |
| 308 | 362.424 | 56.264.054 | 5,7596% | 5,76% |
| 309 | 363.595 | 56.627.649 | 5,7783% | 5,778% |
| 310 | 364.766 | 56.992.415 | 5,7970% | 5,797% |
| 311 | 365.937 | 57.358.352 | 5,8157% | 5,816% |
| 312 | 367.108 | 57.725.460 | 5,8344% | 5,834% |
| 313 | 368.279 | 58.093.739 | 5,8531% | 5,853% |
| 314 | 369.450 | 58.463.189 | 5,8718% | 5,872% |
| 315 | 370.621 | 58.833.810 | 5,8905% | 5,891% |
| 316 | 371.792 | 59.205.602 | 5,9092% | 5,909% |
| 317 | 372.963 | 59.578.565 | 5,9279% | 5,928% |
| 318 | 374.134 | 59.952.699 | 5,9466% | 5,947% |
| 319 | 375.305 | 60.328.004 | 5,9653% | 5,965% |
| 320 | 376.476 | 60.704.480 | 5,9840% | 5,984% |
| 321 | 377.647 | 61.082.127 | 6,0027% | 6,003% |
| 322 | 378.818 | 61.460.945 | 6,0214% | 6,021% |
| 323 | 379.989 | 61.840.934 | 6,0401% | 6,04% |
| 324 | 381.160 | 62.222.094 | 6,0588% | 6,059% |
| 325 | 382.331 | 62.604.425 | 6,0775% | 6,078% |
| 326 | 383.502 | 62.987.927 | 6,0962% | 6,096% |
| 327 | 384.673 | 63.372.600 | 6,1149% | 6,115% |
| 328 | 385.844 | 63.758.444 | 6,1336% | 6,134% |
| 329 | 387.015 | 64.145.459 | 6,1523% | 6,152% |
| 330 | 388.186 | 64.533.645 | 6,1710% | 6,171% |
| 331 | 389.357 | 64.923.002 | 6,1897% | 6,19% |
| 332 | 390.528 | 65.313.530 | 6,2084% | 6,208% |
| 333 | 391.699 | 65.705.229 | 6,2271% | 6,227% |
| 334 | 392.870 | 66.098.099 | 6,2458% | 6,246% |
| 335 | 394.041 | 66.492.140 | 6,2645% | 6,265% |
| 336 | 395.212 | 66.887.352 | 6,2832% | 6,283% |
| 337 | 396.383 | 67.283.735 | 6,3019% | 6,302% |
| 338 | 397.554 | 67.681.289 | 6,3206% | 6,321% |
| 339 | 398.725 | 68.080.014 | 6,3393% | 6,339% |
| 340 | 399.896 | 68.479.910 | 6,3580% | 6,358% |
| 341 | 401.067 | 68.880.977 | 6,3767% | 6,377% |
| 342 | 402.238 | 69.283.215 | 6,3954% | 6,395% |
| 343 | 403.409 | 69.686.624 | 6,4141% | 6,414% |
| 344 | 404.580 | 70.091.204 | 6,4328% | 6,433% |
| 345 | 405.751 | 70.496.955 | 6,4515% | 6,452% |
| 346 | 406.922 | 70.903.877 | 6,4702% | 6,47% |
| 347 | 408.093 | 71.311.970 | 6,4889% | 6,489% |
| 348 | 409.264 | 71.721.234 | 6,5076% | 6,508% |
| 349 | 410.435 | 72.131.669 | 6,5263% | 6,526% |
| 350 | 411.606 | 72.543.275 | 6,5450% | 6,545% |
| 351 | 412.777 | 72.956.052 | 6,5637% | 6,564% |
| 352 | 413.948 | 73.370.000 | 6,5824% | 6,582% |
| 353 | 415.119 | 73.785.119 | 6,6011% | 6,601% |
| 354 | 416.290 | 74.201.409 | 6,6198% | 6,62% |
| 355 | 417.461 | 74.618.870 | 6,6385% | 6,639% |
| 356 | 418.632 | 75.037.502 | 6,6572% | 6,657% |
| 357 | 419.803 | 75.457.305 | 6,6759% | 6,676% |
| 358 | 420.974 | 75.878.279 | 6,6946% | 6,695% |
| 359 | 422.145 | 76.300.424 | 6,7133% | 6,713% |
| 360 | 423.316 | 76.723.740 | 6,7320% | 6,732% |
| 361 | 424.487 | 77.148.227 | 6,7507% | 6,751% |
| 362 | 425.658 | 77.573.885 | 6,7694% | 6,769% |
| 363 | 426.829 | 78.000.714 | 6,7881% | 6,788% |
| 364 | 428.000 | 78.428.714 | 6,8068% | 6,807% |
| 365 | 429.171 | 78.857.885 | 6,8255% | 6,826% |
| 366 | 430.342 | 79.288.227 | 6,8442% | 6,844% |
| 367 | 431.513 | 79.719.740 | 6,8629% | 6,863% |
| 368 | 432.684 | 80.152.424 | 6,8816% | 6,882% |
| 369 | 433.855 | 80.586.279 | 6,9003% | 6,9% |
| 370 | 435.026 | 81.021.305 | 6,9190% | 6,919% |
| 371 | 436.197 | 81.457.502 | 6,9377% | 6,938% |
| 372 | 437.368 | 81.894.870 | 6,9564% | 6,956% |
| 373 | 438.539 | 82.333.409 | 6,9751% | 6,975% |
| 374 | 439.710 | 82.773.119 | 6,9938% | 6,994% |
| 375 | 440.881 | 83.214.000 | 7,0125% | 7,013% |
| 376 | 442.052 | 83.656.052 | 7,0312% | 7,031% |
| 377 | 443.223 | 84.099.275 | 7,0499% | 7,05% |
| 378 | 444.394 | 84.543.669 | 7,0686% | 7,069% |
| 379 | 445.565 | 84.989.234 | 7,0873% | 7,087% |
| 380 | 446.736 | 85.435.970 | 7,1060% | 7,106% |
| 381 | 447.907 | 85.883.877 | 7,1247% | 7,125% |
| 382 | 449.078 | 86.332.955 | 7,1434% | 7,143% |
| 383 | 450.249 | 86.783.204 | 7,1621% | 7,162% |
| 384 | 451.420 | 87.234.624 | 7,1808% | 7,181% |
| 385 | 452.591 | 87.687.215 | 7,1995% | 7,2% |
| 386 | 453.762 | 88.140.977 | 7,2182% | 7,218% |
| 387 | 454.933 | 88.595.910 | 7,2369% | 7,237% |
| 388 | 456.104 | 89.052.014 | 7,2556% | 7,256% |
| 389 | 457.275 | 89.509.289 | 7,2743% | 7,274% |
| 390 | 458.446 | 89.967.735 | 7,2930% | 7,293% |
| 391 | 459.617 | 90.427.352 | 7,3117% | 7,312% |
| 392 | 460.788 | 90.888.140 | 7,3304% | 7,33% |
| 393 | 461.959 | 91.350.099 | 7,3491% | 7,349% |
| 394 | 463.130 | 91.813.229 | 7,3678% | 7,368% |
| 395 | 464.301 | 92.277.530 | 7,3865% | 7,387% |
| 396 | 465.472 | 92.743.002 | 7,4052% | 7,405% |
| 397 | 466.643 | 93.209.645 | 7,4239% | 7,424% |
| 398 | 467.814 | 93.677.459 | 7,4426% | 7,443% |
| 399 | 468.985 | 94.146.444 | 7,4613% | 7,461% |
| 400 | 470.156 | 94.616.600 | 7,4800% | 7,48% |
| 401 | 471.327 | 95.087.927 | 7,4987% | 7,499% |
| 402 | 472.498 | 95.560.425 | 7,5174% | 7,517% |
| 403 | 473.669 | 96.034.094 | 7,5361% | 7,536% |
| 404 | 474.840 | 96.508.934 | 7,5548% | 7,555% |
| 405 | 476.011 | 96.984.945 | 7,5735% | 7,574% |
| 406 | 477.182 | 97.462.127 | 7,5922% | 7,592% |
| 407 | 478.353 | 97.940.480 | 7,6109% | 7,611% |
| 408 | 479.524 | 98.420.004 | 7,6296% | 7,63% |
| 409 | 480.695 | 98.900.699 | 7,6483% | 7,648% |
| 410 | 481.866 | 99.382.565 | 7,6670% | 7,667% |
| 411 | 483.037 | 99.865.602 | 7,6857% | 7,686% |
| 412 | 484.208 | 100.349.810 | 7,7044% | 7,704% |
| 413 | 485.379 | 100.835.189 | 7,7231% | 7,723% |
| 414 | 486.550 | 101.321.739 | 7,7418% | 7,742% |
| 415 | 487.721 | 101.809.460 | 7,7605% | 7,761% |
| 416 | 488.892 | 102.298.352 | 7,7792% | 7,779% |
| 417 | 490.063 | 102.788.415 | 7,7979% | 7,798% |
| 418 | 491.234 | 103.279.649 | 7,8166% | 7,817% |
| 419 | 492.405 | 103.772.054 | 7,8353% | 7,835% |
| 420 | 493.576 | 104.265.630 | 7,8540% | 7,854% |
| 421 | 494.747 | 104.760.377 | 7,8727% | 7,873% |
| 422 | 495.918 | 105.256.295 | 7,8914% | 7,891% |
| 423 | 497.089 | 105.753.384 | 7,9101% | 7,91% |
| 424 | 498.260 | 106.251.644 | 7,9288% | 7,929% |
| 425 | 499.431 | 106.751.075 | 7,9475% | 7,948% |
| 426 | 500.602 | 107.251.677 | 7,9662% | 7,966% |
| 427 | 501.773 | 107.753.450 | 7,9849% | 7,985% |
| 428 | 502.944 | 108.256.394 | 8,0036% | 8,004% |
| 429 | 504.115 | 108.760.509 | 8,0223% | 8,022% |
| 430 | 505.286 | 109.265.795 | 8,0410% | 8,041% |
| 431 | 506.457 | 109.772.252 | 8,0597% | 8,06% |
| 432 | 507.628 | 110.279.880 | 8,0784% | 8,078% |
| 433 | 508.799 | 110.788.679 | 8,0971% | 8,097% |
| 434 | 509.970 | 111.298.649 | 8,1158% | 8,116% |
| 435 | 511.141 | 111.809.790 | 8,1345% | 8,135% |
| 436 | 512.312 | 112.322.102 | 8,1532% | 8,153% |
| 437 | 513.483 | 112.835.585 | 8,1719% | 8,172% |
| 438 | 514.654 | 113.350.239 | 8,1906% | 8,191% |
| 439 | 515.825 | 113.866.064 | 8,2093% | 8,209% |
| 440 | 516.996 | 114.383.060 | 8,2280% | 8,228% |
| 441 | 518.167 | 114.901.227 | 8,2467% | 8,247% |
| 442 | 519.338 | 115.420.565 | 8,2654% | 8,265% |
| 443 | 520.509 | 115.941.074 | 8,2841% | 8,284% |
| 444 | 521.680 | 116.462.754 | 8,3028% | 8,303% |
| 445 | 522.851 | 116.985.605 | 8,3215% | 8,322% |
| 446 | 524.022 | 117.509.627 | 8,3402% | 8,34% |
| 447 | 525.193 | 118.034.820 | 8,3589% | 8,359% |
| 448 | 526.364 | 118.561.184 | 8,3776% | 8,378% |
| 449 | 527.535 | 119.088.719 | 8,3963% | 8,396% |
| 450 | 528.706 | 119.617.425 | 8,4150% | 8,415% |
| 451 | 529.877 | 120.147.302 | 8,4337% | 8,434% |
| 452 | 531.048 | 120.678.350 | 8,4524% | 8,452% |
| 453 | 532.219 | 121.210.569 | 8,4711% | 8,471% |
| 454 | 533.390 | 121.743.959 | 8,4898% | 8,49% |
| 455 | 534.561 | 122.278.520 | 8,5085% | 8,509% |
| 456 | 535.732 | 122.814.252 | 8,5272% | 8,527% |
| 457 | 536.903 | 123.351.155 | 8,5459% | 8,546% |
| 458 | 538.074 | 123.889.229 | 8,5646% | 8,565% |
| 459 | 539.245 | 124.428.474 | 8,5833% | 8,583% |
| 460 | 540.416 | 124.968.890 | 8,6020% | 8,602% |
| 461 | 541.587 | 125.510.477 | 8,6207% | 8,621% |
| 462 | 542.758 | 126.053.235 | 8,6394% | 8,639% |
| 463 | 543.929 | 126.597.164 | 8,6581% | 8,658% |
| 464 | 545.100 | 127.142.264 | 8,6768% | 8,677% |
| 465 | 546.271 | 127.688.535 | 8,6955% | 8,696% |
| 466 | 547.442 | 128.235.977 | 8,7142% | 8,714% |
| 467 | 548.613 | 128.784.590 | 8,7329% | 8,733% |
| 468 | 549.784 | 129.334.374 | 8,7516% | 8,752% |
| 469 | 550.955 | 129.885.329 | 8,7703% | 8,77% |
| 470 | 552.126 | 130.437.455 | 8,7890% | 8,789% |
| 471 | 553.297 | 130.990.752 | 8,8077% | 8,808% |
| 472 | 554.468 | 131.545.220 | 8,8264% | 8,826% |
| 473 | 555.639 | 132.100.859 | 8,8451% | 8,845% |
| 474 | 556.810 | 132.657.669 | 8,8638% | 8,864% |
| 475 | 557.981 | 133.215.650 | 8,8825% | 8,883% |
| 476 | 559.152 | 133.774.802 | 8,9012% | 8,901% |
| 477 | 560.323 | 134.335.125 | 8,9199% | 8,92% |
| 478 | 561.494 | 134.896.619 | 8,9386% | 8,939% |
| 479 | 562.665 | 135.459.284 | 8,9573% | 8,957% |
| 480 | 563.836 | 136.023.120 | 8,9760% | 8,976% |
| 481 | 565.007 | 136.588.127 | 8,9947% | 8,995% |
| 482 | 566.178 | 137.154.305 | 9,0134% | 9,013% |
| 483 | 567.349 | 137.721.654 | 9,0321% | 9,032% |
| 484 | 568.520 | 138.290.174 | 9,0508% | 9,051% |
| 485 | 569.691 | 138.859.865 | 9,0695% | 9,07% |
| 486 | 570.862 | 139.430.727 | 9,0882% | 9,088% |
| 487 | 572.033 | 140.002.760 | 9,1069% | 9,107% |
| 488 | 573.204 | 140.575.964 | 9,1256% | 9,126% |
| 489 | 574.375 | 141.150.339 | 9,1443% | 9,144% |
| 490 | 575.546 | 141.725.885 | 9,1630% | 9,163% |
| 491 | 576.717 | 142.302.602 | 9,1817% | 9,182% |
| 492 | 577.888 | 142.880.490 | 9,2004% | 9,2% |
| 493 | 579.059 | 143.459.549 | 9,2191% | 9,219% |
| 494 | 580.230 | 144.039.779 | 9,2378% | 9,238% |
| 495 | 581.401 | 144.621.180 | 9,2565% | 9,257% |
| 496 | 582.572 | 145.203.752 | 9,2752% | 9,275% |
| 497 | 583.743 | 145.787.495 | 9,2939% | 9,294% |
| 498 | 584.914 | 146.372.409 | 9,3126% | 9,313% |
| 499 | 586.085 | 146.958.494 | 9,3313% | 9,331% |
| 500 | 587.256 | 147.545.750 | 9,3500% | 9,35% |

### Anexo — Trevo

| Nível | Custo do nível | Custo acumulado | Chance | Exibido na lore |
|---:|---:|---:|---:|---:|
| 1 | 1.952 | 1.952 | 0,0001% | 0,0000815% |
| 2 | 2.732,6 | 4.684,6 | 0,0002% | 0,000163% |
| 3 | 3.513,2 | 8.197,8 | 0,0002% | 0,0002445% |
| 4 | 4.293,8 | 12.491,6 | 0,0003% | 0,000326% |
| 5 | 5.074,4 | 17.566 | 0,0004% | 0,0004075% |
| 6 | 5.855 | 23.421 | 0,0005% | 0,000489% |
| 7 | 6.635,6 | 30.056,6 | 0,0006% | 0,0005705% |
| 8 | 7.416,2 | 37.472,8 | 0,0007% | 0,000652% |
| 9 | 8.196,8 | 45.669,6 | 0,0007% | 0,0007335% |
| 10 | 8.977,4 | 54.647 | 0,0008% | 0,000815% |
| 11 | 9.758 | 64.405 | 0,0009% | 0,0008965% |
| 12 | 10.538,6 | 74.943,6 | 0,0010% | 0,000978% |
| 13 | 11.319,2 | 86.262,8 | 0,0011% | 0,00106% |
| 14 | 12.099,8 | 98.362,6 | 0,0011% | 0,001141% |
| 15 | 12.880,4 | 111.243 | 0,0012% | 0,001223% |
| 16 | 13.661 | 124.904 | 0,0013% | 0,001304% |
| 17 | 14.441,6 | 139.345,6 | 0,0014% | 0,001386% |
| 18 | 15.222,2 | 154.567,8 | 0,0015% | 0,001467% |
| 19 | 16.002,8 | 170.570,6 | 0,0015% | 0,001549% |
| 20 | 16.783,4 | 187.354 | 0,0016% | 0,00163% |
| 21 | 17.564 | 204.918 | 0,0017% | 0,001712% |
| 22 | 18.344,6 | 223.262,6 | 0,0018% | 0,001793% |
| 23 | 19.125,2 | 242.387,8 | 0,0019% | 0,001875% |
| 24 | 19.905,8 | 262.293,6 | 0,0020% | 0,001956% |
| 25 | 20.686,4 | 282.980 | 0,0020% | 0,002038% |
| 26 | 21.467 | 304.447 | 0,0021% | 0,002119% |
| 27 | 22.247,6 | 326.694,6 | 0,0022% | 0,002201% |
| 28 | 23.028,2 | 349.722,8 | 0,0023% | 0,002282% |
| 29 | 23.808,8 | 373.531,6 | 0,0024% | 0,002364% |
| 30 | 24.589,4 | 398.121 | 0,0024% | 0,002445% |
| 31 | 25.370 | 423.491 | 0,0025% | 0,002527% |
| 32 | 26.150,6 | 449.641,6 | 0,0026% | 0,002608% |
| 33 | 26.931,2 | 476.572,8 | 0,0027% | 0,00269% |
| 34 | 27.711,8 | 504.284,6 | 0,0028% | 0,002771% |
| 35 | 28.492,4 | 532.777 | 0,0029% | 0,002853% |
| 36 | 29.273 | 562.050 | 0,0029% | 0,002934% |
| 37 | 30.053,6 | 592.103,6 | 0,0030% | 0,003016% |
| 38 | 30.834,2 | 622.937,8 | 0,0031% | 0,003097% |
| 39 | 31.614,8 | 654.552,6 | 0,0032% | 0,003179% |
| 40 | 32.395,4 | 686.948 | 0,0033% | 0,00326% |
| 41 | 33.176 | 720.124 | 0,0033% | 0,003342% |
| 42 | 33.956,6 | 754.080,6 | 0,0034% | 0,003423% |
| 43 | 34.737,2 | 788.817,8 | 0,0035% | 0,003505% |
| 44 | 35.517,8 | 824.335,6 | 0,0036% | 0,003586% |
| 45 | 36.298,4 | 860.634 | 0,0037% | 0,003668% |
| 46 | 37.079 | 897.713 | 0,0037% | 0,003749% |
| 47 | 37.859,6 | 935.572,6 | 0,0038% | 0,003831% |
| 48 | 38.640,2 | 974.212,8 | 0,0039% | 0,003912% |
| 49 | 39.420,8 | 1.013.633,6 | 0,0040% | 0,003994% |
| 50 | 40.201,4 | 1.053.835 | 0,0041% | 0,004075% |
| 51 | 40.982 | 1.094.817 | 0,0042% | 0,004157% |
| 52 | 41.762,6 | 1.136.579,6 | 0,0042% | 0,004238% |
| 53 | 42.543,2 | 1.179.122,8 | 0,0043% | 0,00432% |
| 54 | 43.323,8 | 1.222.446,6 | 0,0044% | 0,004401% |
| 55 | 44.104,4 | 1.266.551 | 0,0045% | 0,004483% |
| 56 | 44.885 | 1.311.436 | 0,0046% | 0,004564% |
| 57 | 45.665,6 | 1.357.101,6 | 0,0046% | 0,004646% |
| 58 | 46.446,2 | 1.403.547,8 | 0,0047% | 0,004727% |
| 59 | 47.226,8 | 1.450.774,6 | 0,0048% | 0,004809% |
| 60 | 48.007,4 | 1.498.782 | 0,0049% | 0,00489% |
| 61 | 48.788 | 1.547.570 | 0,0050% | 0,004972% |
| 62 | 49.568,6 | 1.597.138,6 | 0,0051% | 0,005053% |
| 63 | 50.349,2 | 1.647.487,8 | 0,0051% | 0,005135% |
| 64 | 51.129,8 | 1.698.617,6 | 0,0052% | 0,005216% |
| 65 | 51.910,4 | 1.750.528 | 0,0053% | 0,005298% |
| 66 | 52.691 | 1.803.219 | 0,0054% | 0,005379% |
| 67 | 53.471,6 | 1.856.690,6 | 0,0055% | 0,005461% |
| 68 | 54.252,2 | 1.910.942,8 | 0,0055% | 0,005542% |
| 69 | 55.032,8 | 1.965.975,6 | 0,0056% | 0,005624% |
| 70 | 55.813,4 | 2.021.789 | 0,0057% | 0,005705% |
| 71 | 56.594 | 2.078.383 | 0,0058% | 0,005787% |
| 72 | 57.374,6 | 2.135.757,6 | 0,0059% | 0,005868% |
| 73 | 58.155,2 | 2.193.912,8 | 0,0059% | 0,00595% |
| 74 | 58.935,8 | 2.252.848,6 | 0,0060% | 0,006031% |
| 75 | 59.716,4 | 2.312.565 | 0,0061% | 0,006113% |
| 76 | 60.497 | 2.373.062 | 0,0062% | 0,006194% |
| 77 | 61.277,6 | 2.434.339,6 | 0,0063% | 0,006276% |
| 78 | 62.058,2 | 2.496.397,8 | 0,0064% | 0,006357% |
| 79 | 62.838,8 | 2.559.236,6 | 0,0064% | 0,006439% |
| 80 | 63.619,4 | 2.622.856 | 0,0065% | 0,00652% |
| 81 | 64.400 | 2.687.256 | 0,0066% | 0,006602% |
| 82 | 65.180,6 | 2.752.436,6 | 0,0067% | 0,006683% |
| 83 | 65.961,2 | 2.818.397,8 | 0,0068% | 0,006765% |
| 84 | 66.741,8 | 2.885.139,6 | 0,0068% | 0,006846% |
| 85 | 67.522,4 | 2.952.662 | 0,0069% | 0,006928% |
| 86 | 68.303 | 3.020.965 | 0,0070% | 0,007009% |
| 87 | 69.083,6 | 3.090.048,6 | 0,0071% | 0,007091% |
| 88 | 69.864,2 | 3.159.912,8 | 0,0072% | 0,007172% |
| 89 | 70.644,8 | 3.230.557,6 | 0,0073% | 0,007254% |
| 90 | 71.425,4 | 3.301.983 | 0,0073% | 0,007335% |
| 91 | 72.206 | 3.374.189 | 0,0074% | 0,007417% |
| 92 | 72.986,6 | 3.447.175,6 | 0,0075% | 0,007498% |
| 93 | 73.767,2 | 3.520.942,8 | 0,0076% | 0,00758% |
| 94 | 74.547,8 | 3.595.490,6 | 0,0077% | 0,007661% |
| 95 | 75.328,4 | 3.670.819 | 0,0077% | 0,007743% |
| 96 | 76.109 | 3.746.928 | 0,0078% | 0,007824% |
| 97 | 76.889,6 | 3.823.817,6 | 0,0079% | 0,007906% |
| 98 | 77.670,2 | 3.901.487,8 | 0,0080% | 0,007987% |
| 99 | 78.450,8 | 3.979.938,6 | 0,0081% | 0,008069% |
| 100 | 79.231,4 | 4.059.170 | 0,0082% | 0,00815% |
| 101 | 80.012 | 4.139.182 | 0,0082% | 0,008232% |
| 102 | 80.792,6 | 4.219.974,6 | 0,0083% | 0,008313% |
| 103 | 81.573,2 | 4.301.547,8 | 0,0084% | 0,008395% |
| 104 | 82.353,8 | 4.383.901,6 | 0,0085% | 0,008476% |
| 105 | 83.134,4 | 4.467.036 | 0,0086% | 0,008558% |
| 106 | 83.915 | 4.550.951 | 0,0086% | 0,008639% |
| 107 | 84.695,6 | 4.635.646,6 | 0,0087% | 0,008721% |
| 108 | 85.476,2 | 4.721.122,8 | 0,0088% | 0,008802% |
| 109 | 86.256,8 | 4.807.379,6 | 0,0089% | 0,008884% |
| 110 | 87.037,4 | 4.894.417 | 0,0090% | 0,008965% |
| 111 | 87.818 | 4.982.235 | 0,0090% | 0,009047% |
| 112 | 88.598,6 | 5.070.833,6 | 0,0091% | 0,009128% |
| 113 | 89.379,2 | 5.160.212,8 | 0,0092% | 0,00921% |
| 114 | 90.159,8 | 5.250.372,6 | 0,0093% | 0,009291% |
| 115 | 90.940,4 | 5.341.313 | 0,0094% | 0,009373% |
| 116 | 91.721 | 5.433.034 | 0,0095% | 0,009454% |
| 117 | 92.501,6 | 5.525.535,6 | 0,0095% | 0,009536% |
| 118 | 93.282,2 | 5.618.817,8 | 0,0096% | 0,009617% |
| 119 | 94.062,8 | 5.712.880,6 | 0,0097% | 0,009699% |
| 120 | 94.843,4 | 5.807.724 | 0,0098% | 0,00978% |
| 121 | 95.624 | 5.903.348 | 0,0099% | 0,009862% |
| 122 | 96.404,6 | 5.999.752,6 | 0,0099% | 0,009943% |
| 123 | 97.185,2 | 6.096.937,8 | 0,0100% | 0,01002% |
| 124 | 97.965,8 | 6.194.903,6 | 0,0101% | 0,01011% |
| 125 | 98.746,4 | 6.293.650 | 0,0102% | 0,01019% |
| 126 | 99.527 | 6.393.177 | 0,0103% | 0,01027% |
| 127 | 100.307,6 | 6.493.484,6 | 0,0104% | 0,01035% |
| 128 | 101.088,2 | 6.594.572,8 | 0,0104% | 0,01043% |
| 129 | 101.868,8 | 6.696.441,6 | 0,0105% | 0,01051% |
| 130 | 102.649,4 | 6.799.091 | 0,0106% | 0,0106% |
| 131 | 103.430 | 6.902.521 | 0,0107% | 0,01068% |
| 132 | 104.210,6 | 7.006.731,6 | 0,0108% | 0,01076% |
| 133 | 104.991,2 | 7.111.722,8 | 0,0108% | 0,01084% |
| 134 | 105.771,8 | 7.217.494,6 | 0,0109% | 0,01092% |
| 135 | 106.552,4 | 7.324.047 | 0,0110% | 0,011% |
| 136 | 107.333 | 7.431.380 | 0,0111% | 0,01108% |
| 137 | 108.113,6 | 7.539.493,6 | 0,0112% | 0,01117% |
| 138 | 108.894,2 | 7.648.387,8 | 0,0112% | 0,01125% |
| 139 | 109.674,8 | 7.758.062,6 | 0,0113% | 0,01133% |
| 140 | 110.455,4 | 7.868.518 | 0,0114% | 0,01141% |
| 141 | 111.236 | 7.979.754 | 0,0115% | 0,01149% |
| 142 | 112.016,6 | 8.091.770,6 | 0,0116% | 0,01157% |
| 143 | 112.797,2 | 8.204.567,8 | 0,0117% | 0,01165% |
| 144 | 113.577,8 | 8.318.145,6 | 0,0117% | 0,01174% |
| 145 | 114.358,4 | 8.432.504 | 0,0118% | 0,01182% |
| 146 | 115.139 | 8.547.643 | 0,0119% | 0,0119% |
| 147 | 115.919,6 | 8.663.562,6 | 0,0120% | 0,01198% |
| 148 | 116.700,2 | 8.780.262,8 | 0,0121% | 0,01206% |
| 149 | 117.480,8 | 8.897.743,6 | 0,0121% | 0,01214% |
| 150 | 118.261,4 | 9.016.005 | 0,0122% | 0,01223% |
| 151 | 119.042 | 9.135.047 | 0,0123% | 0,01231% |
| 152 | 119.822,6 | 9.254.869,6 | 0,0124% | 0,01239% |
| 153 | 120.603,2 | 9.375.472,8 | 0,0125% | 0,01247% |
| 154 | 121.383,8 | 9.496.856,6 | 0,0126% | 0,01255% |
| 155 | 122.164,4 | 9.619.021 | 0,0126% | 0,01263% |
| 156 | 122.945 | 9.741.966 | 0,0127% | 0,01271% |
| 157 | 123.725,6 | 9.865.691,6 | 0,0128% | 0,0128% |
| 158 | 124.506,2 | 9.990.197,8 | 0,0129% | 0,01288% |
| 159 | 125.286,8 | 10.115.484,6 | 0,0130% | 0,01296% |
| 160 | 126.067,4 | 10.241.552 | 0,0130% | 0,01304% |
| 161 | 126.848 | 10.368.400 | 0,0131% | 0,01312% |
| 162 | 127.628,6 | 10.496.028,6 | 0,0132% | 0,0132% |
| 163 | 128.409,2 | 10.624.437,8 | 0,0133% | 0,01328% |
| 164 | 129.189,8 | 10.753.627,6 | 0,0134% | 0,01337% |
| 165 | 129.970,4 | 10.883.598 | 0,0134% | 0,01345% |
| 166 | 130.751 | 11.014.349 | 0,0135% | 0,01353% |
| 167 | 131.531,6 | 11.145.880,6 | 0,0136% | 0,01361% |
| 168 | 132.312,2 | 11.278.192,8 | 0,0137% | 0,01369% |
| 169 | 133.092,8 | 11.411.285,6 | 0,0138% | 0,01377% |
| 170 | 133.873,4 | 11.545.159 | 0,0139% | 0,01386% |
| 171 | 134.654 | 11.679.813 | 0,0139% | 0,01394% |
| 172 | 135.434,6 | 11.815.247,6 | 0,0140% | 0,01402% |
| 173 | 136.215,2 | 11.951.462,8 | 0,0141% | 0,0141% |
| 174 | 136.995,8 | 12.088.458,6 | 0,0142% | 0,01418% |
| 175 | 137.776,4 | 12.226.235 | 0,0143% | 0,01426% |
| 176 | 138.557 | 12.364.792 | 0,0143% | 0,01434% |
| 177 | 139.337,6 | 12.504.129,6 | 0,0144% | 0,01443% |
| 178 | 140.118,2 | 12.644.247,8 | 0,0145% | 0,01451% |
| 179 | 140.898,8 | 12.785.146,6 | 0,0146% | 0,01459% |
| 180 | 141.679,4 | 12.926.826 | 0,0147% | 0,01467% |
| 181 | 142.460 | 13.069.286 | 0,0148% | 0,01475% |
| 182 | 143.240,6 | 13.212.526,6 | 0,0148% | 0,01483% |
| 183 | 144.021,2 | 13.356.547,8 | 0,0149% | 0,01491% |
| 184 | 144.801,8 | 13.501.349,6 | 0,0150% | 0,015% |
| 185 | 145.582,4 | 13.646.932 | 0,0151% | 0,01508% |
| 186 | 146.363 | 13.793.295 | 0,0152% | 0,01516% |
| 187 | 147.143,6 | 13.940.438,6 | 0,0152% | 0,01524% |
| 188 | 147.924,2 | 14.088.362,8 | 0,0153% | 0,01532% |
| 189 | 148.704,8 | 14.237.067,6 | 0,0154% | 0,0154% |
| 190 | 149.485,4 | 14.386.553 | 0,0155% | 0,01549% |
| 191 | 150.266 | 14.536.819 | 0,0156% | 0,01557% |
| 192 | 151.046,6 | 14.687.865,6 | 0,0156% | 0,01565% |
| 193 | 151.827,2 | 14.839.692,8 | 0,0157% | 0,01573% |
| 194 | 152.607,8 | 14.992.300,6 | 0,0158% | 0,01581% |
| 195 | 153.388,4 | 15.145.689 | 0,0159% | 0,01589% |
| 196 | 154.169 | 15.299.858 | 0,0160% | 0,01597% |
| 197 | 154.949,6 | 15.454.807,6 | 0,0161% | 0,01606% |
| 198 | 155.730,2 | 15.610.537,8 | 0,0161% | 0,01614% |
| 199 | 156.510,8 | 15.767.048,6 | 0,0162% | 0,01622% |
| 200 | 157.291,4 | 15.924.340 | 0,0163% | 0,0163% |
| 201 | 158.072 | 16.082.412 | 0,0164% | 0,01638% |
| 202 | 158.852,6 | 16.241.264,6 | 0,0165% | 0,01646% |
| 203 | 159.633,2 | 16.400.897,8 | 0,0165% | 0,01654% |
| 204 | 160.413,8 | 16.561.311,6 | 0,0166% | 0,01663% |
| 205 | 161.194,4 | 16.722.506 | 0,0167% | 0,01671% |
| 206 | 161.975 | 16.884.481 | 0,0168% | 0,01679% |
| 207 | 162.755,6 | 17.047.236,6 | 0,0169% | 0,01687% |
| 208 | 163.536,2 | 17.210.772,8 | 0,0170% | 0,01695% |
| 209 | 164.316,8 | 17.375.089,6 | 0,0170% | 0,01703% |
| 210 | 165.097,4 | 17.540.187 | 0,0171% | 0,01712% |
| 211 | 165.878 | 17.706.065 | 0,0172% | 0,0172% |
| 212 | 166.658,6 | 17.872.723,6 | 0,0173% | 0,01728% |
| 213 | 167.439,2 | 18.040.162,8 | 0,0174% | 0,01736% |
| 214 | 168.219,8 | 18.208.382,6 | 0,0174% | 0,01744% |
| 215 | 169.000,4 | 18.377.383 | 0,0175% | 0,01752% |
| 216 | 169.781 | 18.547.164 | 0,0176% | 0,0176% |
| 217 | 170.561,6 | 18.717.725,6 | 0,0177% | 0,01769% |
| 218 | 171.342,2 | 18.889.067,8 | 0,0178% | 0,01777% |
| 219 | 172.122,8 | 19.061.190,6 | 0,0178% | 0,01785% |
| 220 | 172.903,4 | 19.234.094 | 0,0179% | 0,01793% |
| 221 | 173.684 | 19.407.778 | 0,0180% | 0,01801% |
| 222 | 174.464,6 | 19.582.242,6 | 0,0181% | 0,01809% |
| 223 | 175.245,2 | 19.757.487,8 | 0,0182% | 0,01817% |
| 224 | 176.025,8 | 19.933.513,6 | 0,0183% | 0,01826% |
| 225 | 176.806,4 | 20.110.320 | 0,0183% | 0,01834% |
| 226 | 177.587 | 20.287.907 | 0,0184% | 0,01842% |
| 227 | 178.367,6 | 20.466.274,6 | 0,0185% | 0,0185% |
| 228 | 179.148,2 | 20.645.422,8 | 0,0186% | 0,01858% |
| 229 | 179.928,8 | 20.825.351,6 | 0,0187% | 0,01866% |
| 230 | 180.709,4 | 21.006.061 | 0,0187% | 0,01875% |
| 231 | 181.490 | 21.187.551 | 0,0188% | 0,01883% |
| 232 | 182.270,6 | 21.369.821,6 | 0,0189% | 0,01891% |
| 233 | 183.051,2 | 21.552.872,8 | 0,0190% | 0,01899% |
| 234 | 183.831,8 | 21.736.704,6 | 0,0191% | 0,01907% |
| 235 | 184.612,4 | 21.921.317 | 0,0192% | 0,01915% |
| 236 | 185.393 | 22.106.710 | 0,0192% | 0,01923% |
| 237 | 186.173,6 | 22.292.883,6 | 0,0193% | 0,01932% |
| 238 | 186.954,2 | 22.479.837,8 | 0,0194% | 0,0194% |
| 239 | 187.734,8 | 22.667.572,6 | 0,0195% | 0,01948% |
| 240 | 188.515,4 | 22.856.088 | 0,0196% | 0,01956% |
| 241 | 189.296 | 23.045.384 | 0,0196% | 0,01964% |
| 242 | 190.076,6 | 23.235.460,6 | 0,0197% | 0,01972% |
| 243 | 190.857,2 | 23.426.317,8 | 0,0198% | 0,0198% |
| 244 | 191.637,8 | 23.617.955,6 | 0,0199% | 0,01989% |
| 245 | 192.418,4 | 23.810.374 | 0,0200% | 0,01997% |
| 246 | 193.199 | 24.003.573 | 0,0200% | 0,02005% |
| 247 | 193.979,6 | 24.197.552,6 | 0,0201% | 0,02013% |
| 248 | 194.760,2 | 24.392.312,8 | 0,0202% | 0,02021% |
| 249 | 195.540,8 | 24.587.853,6 | 0,0203% | 0,02029% |
| 250 | 196.321,4 | 24.784.175 | 0,0204% | 0,02038% |
| 251 | 197.102 | 24.981.277 | 0,0205% | 0,02046% |
| 252 | 197.882,6 | 25.179.159,6 | 0,0205% | 0,02054% |
| 253 | 198.663,2 | 25.377.822,8 | 0,0206% | 0,02062% |
| 254 | 199.443,8 | 25.577.266,6 | 0,0207% | 0,0207% |
| 255 | 200.224,4 | 25.777.491 | 0,0208% | 0,02078% |
| 256 | 201.005 | 25.978.496 | 0,0209% | 0,02086% |
| 257 | 201.785,6 | 26.180.281,6 | 0,0209% | 0,02095% |
| 258 | 202.566,2 | 26.382.847,8 | 0,0210% | 0,02103% |
| 259 | 203.346,8 | 26.586.194,6 | 0,0211% | 0,02111% |
| 260 | 204.127,4 | 26.790.322 | 0,0212% | 0,02119% |
| 261 | 204.908 | 26.995.230 | 0,0213% | 0,02127% |
| 262 | 205.688,6 | 27.200.918,6 | 0,0214% | 0,02135% |
| 263 | 206.469,2 | 27.407.387,8 | 0,0214% | 0,02143% |
| 264 | 207.249,8 | 27.614.637,6 | 0,0215% | 0,02152% |
| 265 | 208.030,4 | 27.822.668 | 0,0216% | 0,0216% |
| 266 | 208.811 | 28.031.479 | 0,0217% | 0,02168% |
| 267 | 209.591,6 | 28.241.070,6 | 0,0218% | 0,02176% |
| 268 | 210.372,2 | 28.451.442,8 | 0,0218% | 0,02184% |
| 269 | 211.152,8 | 28.662.595,6 | 0,0219% | 0,02192% |
| 270 | 211.933,4 | 28.874.529 | 0,0220% | 0,02201% |
| 271 | 212.714 | 29.087.243 | 0,0221% | 0,02209% |
| 272 | 213.494,6 | 29.300.737,6 | 0,0222% | 0,02217% |
| 273 | 214.275,2 | 29.515.012,8 | 0,0222% | 0,02225% |
| 274 | 215.055,8 | 29.730.068,6 | 0,0223% | 0,02233% |
| 275 | 215.836,4 | 29.945.905 | 0,0224% | 0,02241% |
| 276 | 216.617 | 30.162.522 | 0,0225% | 0,02249% |
| 277 | 217.397,6 | 30.379.919,6 | 0,0226% | 0,02258% |
| 278 | 218.178,2 | 30.598.097,8 | 0,0227% | 0,02266% |
| 279 | 218.958,8 | 30.817.056,6 | 0,0227% | 0,02274% |
| 280 | 219.739,4 | 31.036.796 | 0,0228% | 0,02282% |
| 281 | 220.520 | 31.257.316 | 0,0229% | 0,0229% |
| 282 | 221.300,6 | 31.478.616,6 | 0,0230% | 0,02298% |
| 283 | 222.081,2 | 31.700.697,8 | 0,0231% | 0,02306% |
| 284 | 222.861,8 | 31.923.559,6 | 0,0231% | 0,02315% |
| 285 | 223.642,4 | 32.147.202 | 0,0232% | 0,02323% |
| 286 | 224.423 | 32.371.625 | 0,0233% | 0,02331% |
| 287 | 225.203,6 | 32.596.828,6 | 0,0234% | 0,02339% |
| 288 | 225.984,2 | 32.822.812,8 | 0,0235% | 0,02347% |
| 289 | 226.764,8 | 33.049.577,6 | 0,0236% | 0,02355% |
| 290 | 227.545,4 | 33.277.123 | 0,0236% | 0,02364% |
| 291 | 228.326 | 33.505.449 | 0,0237% | 0,02372% |
| 292 | 229.106,6 | 33.734.555,6 | 0,0238% | 0,0238% |
| 293 | 229.887,2 | 33.964.442,8 | 0,0239% | 0,02388% |
| 294 | 230.667,8 | 34.195.110,6 | 0,0240% | 0,02396% |
| 295 | 231.448,4 | 34.426.559 | 0,0240% | 0,02404% |
| 296 | 232.229 | 34.658.788 | 0,0241% | 0,02412% |
| 297 | 233.009,6 | 34.891.797,6 | 0,0242% | 0,02421% |
| 298 | 233.790,2 | 35.125.587,8 | 0,0243% | 0,02429% |
| 299 | 234.570,8 | 35.360.158,6 | 0,0244% | 0,02437% |
| 300 | 235.351,4 | 35.595.510 | 0,0245% | 0,02445% |
| 301 | 236.132 | 35.831.642 | 0,0245% | 0,02453% |
| 302 | 236.912,6 | 36.068.554,6 | 0,0246% | 0,02461% |
| 303 | 237.693,2 | 36.306.247,8 | 0,0247% | 0,02469% |
| 304 | 238.473,8 | 36.544.721,6 | 0,0248% | 0,02478% |
| 305 | 239.254,4 | 36.783.976 | 0,0249% | 0,02486% |
| 306 | 240.035 | 37.024.011 | 0,0249% | 0,02494% |
| 307 | 240.815,6 | 37.264.826,6 | 0,0250% | 0,02502% |
| 308 | 241.596,2 | 37.506.422,8 | 0,0251% | 0,0251% |
| 309 | 242.376,8 | 37.748.799,6 | 0,0252% | 0,02518% |
| 310 | 243.157,4 | 37.991.957 | 0,0253% | 0,02527% |
| 311 | 243.938 | 38.235.895 | 0,0253% | 0,02535% |
| 312 | 244.718,6 | 38.480.613,6 | 0,0254% | 0,02543% |
| 313 | 245.499,2 | 38.726.112,8 | 0,0255% | 0,02551% |
| 314 | 246.279,8 | 38.972.392,6 | 0,0256% | 0,02559% |
| 315 | 247.060,4 | 39.219.453 | 0,0257% | 0,02567% |
| 316 | 247.841 | 39.467.294 | 0,0258% | 0,02575% |
| 317 | 248.621,6 | 39.715.915,6 | 0,0258% | 0,02584% |
| 318 | 249.402,2 | 39.965.317,8 | 0,0259% | 0,02592% |
| 319 | 250.182,8 | 40.215.500,6 | 0,0260% | 0,026% |
| 320 | 250.963,4 | 40.466.464 | 0,0261% | 0,02608% |
| 321 | 251.744 | 40.718.208 | 0,0262% | 0,02616% |
| 322 | 252.524,6 | 40.970.732,6 | 0,0262% | 0,02624% |
| 323 | 253.305,2 | 41.224.037,8 | 0,0263% | 0,02632% |
| 324 | 254.085,8 | 41.478.123,6 | 0,0264% | 0,02641% |
| 325 | 254.866,4 | 41.732.990 | 0,0265% | 0,02649% |
| 326 | 255.647 | 41.988.637 | 0,0266% | 0,02657% |
| 327 | 256.427,6 | 42.245.064,6 | 0,0267% | 0,02665% |
| 328 | 257.208,2 | 42.502.272,8 | 0,0267% | 0,02673% |
| 329 | 257.988,8 | 42.760.261,6 | 0,0268% | 0,02681% |
| 330 | 258.769,4 | 43.019.031 | 0,0269% | 0,0269% |
| 331 | 259.550 | 43.278.581 | 0,0270% | 0,02698% |
| 332 | 260.330,6 | 43.538.911,6 | 0,0271% | 0,02706% |
| 333 | 261.111,2 | 43.800.022,8 | 0,0271% | 0,02714% |
| 334 | 261.891,8 | 44.061.914,6 | 0,0272% | 0,02722% |
| 335 | 262.672,4 | 44.324.587 | 0,0273% | 0,0273% |
| 336 | 263.453 | 44.588.040 | 0,0274% | 0,02738% |
| 337 | 264.233,6 | 44.852.273,6 | 0,0275% | 0,02747% |
| 338 | 265.014,2 | 45.117.287,8 | 0,0275% | 0,02755% |
| 339 | 265.794,8 | 45.383.082,6 | 0,0276% | 0,02763% |
| 340 | 266.575,4 | 45.649.658 | 0,0277% | 0,02771% |
| 341 | 267.356 | 45.917.014 | 0,0278% | 0,02779% |
| 342 | 268.136,6 | 46.185.150,6 | 0,0279% | 0,02787% |
| 343 | 268.917,2 | 46.454.067,8 | 0,0280% | 0,02795% |
| 344 | 269.697,8 | 46.723.765,6 | 0,0280% | 0,02804% |
| 345 | 270.478,4 | 46.994.244 | 0,0281% | 0,02812% |
| 346 | 271.259 | 47.265.503 | 0,0282% | 0,0282% |
| 347 | 272.039,6 | 47.537.542,6 | 0,0283% | 0,02828% |
| 348 | 272.820,2 | 47.810.362,8 | 0,0284% | 0,02836% |
| 349 | 273.600,8 | 48.083.963,6 | 0,0284% | 0,02844% |
| 350 | 274.381,4 | 48.358.345 | 0,0285% | 0,02853% |
| 351 | 275.162 | 48.633.507 | 0,0286% | 0,02861% |
| 352 | 275.942,6 | 48.909.449,6 | 0,0287% | 0,02869% |
| 353 | 276.723,2 | 49.186.172,8 | 0,0288% | 0,02877% |
| 354 | 277.503,8 | 49.463.676,6 | 0,0289% | 0,02885% |
| 355 | 278.284,4 | 49.741.961 | 0,0289% | 0,02893% |
| 356 | 279.065 | 50.021.026 | 0,0290% | 0,02901% |
| 357 | 279.845,6 | 50.300.871,6 | 0,0291% | 0,0291% |
| 358 | 280.626,2 | 50.581.497,8 | 0,0292% | 0,02918% |
| 359 | 281.406,8 | 50.862.904,6 | 0,0293% | 0,02926% |
| 360 | 282.187,4 | 51.145.092 | 0,0293% | 0,02934% |
| 361 | 282.968 | 51.428.060 | 0,0294% | 0,02942% |
| 362 | 283.748,6 | 51.711.808,6 | 0,0295% | 0,0295% |
| 363 | 284.529,2 | 51.996.337,8 | 0,0296% | 0,02958% |
| 364 | 285.309,8 | 52.281.647,6 | 0,0297% | 0,02967% |
| 365 | 286.090,4 | 52.567.738 | 0,0297% | 0,02975% |
| 366 | 286.871 | 52.854.609 | 0,0298% | 0,02983% |
| 367 | 287.651,6 | 53.142.260,6 | 0,0299% | 0,02991% |
| 368 | 288.432,2 | 53.430.692,8 | 0,0300% | 0,02999% |
| 369 | 289.212,8 | 53.719.905,6 | 0,0301% | 0,03007% |
| 370 | 289.993,4 | 54.009.899 | 0,0302% | 0,03016% |
| 371 | 290.774 | 54.300.673 | 0,0302% | 0,03024% |
| 372 | 291.554,6 | 54.592.227,6 | 0,0303% | 0,03032% |
| 373 | 292.335,2 | 54.884.562,8 | 0,0304% | 0,0304% |
| 374 | 293.115,8 | 55.177.678,6 | 0,0305% | 0,03048% |
| 375 | 293.896,4 | 55.471.575 | 0,0306% | 0,03056% |
| 376 | 294.677 | 55.766.252 | 0,0306% | 0,03064% |
| 377 | 295.457,6 | 56.061.709,6 | 0,0307% | 0,03073% |
| 378 | 296.238,2 | 56.357.947,8 | 0,0308% | 0,03081% |
| 379 | 297.018,8 | 56.654.966,6 | 0,0309% | 0,03089% |
| 380 | 297.799,4 | 56.952.766 | 0,0310% | 0,03097% |
| 381 | 298.580 | 57.251.346 | 0,0311% | 0,03105% |
| 382 | 299.360,6 | 57.550.706,6 | 0,0311% | 0,03113% |
| 383 | 300.141,2 | 57.850.847,8 | 0,0312% | 0,03121% |
| 384 | 300.921,8 | 58.151.769,6 | 0,0313% | 0,0313% |
| 385 | 301.702,4 | 58.453.472 | 0,0314% | 0,03138% |
| 386 | 302.483 | 58.755.955 | 0,0315% | 0,03146% |
| 387 | 303.263,6 | 59.059.218,6 | 0,0315% | 0,03154% |
| 388 | 304.044,2 | 59.363.262,8 | 0,0316% | 0,03162% |
| 389 | 304.824,8 | 59.668.087,6 | 0,0317% | 0,0317% |
| 390 | 305.605,4 | 59.973.693 | 0,0318% | 0,03179% |
| 391 | 306.386 | 60.280.079 | 0,0319% | 0,03187% |
| 392 | 307.166,6 | 60.587.245,6 | 0,0319% | 0,03195% |
| 393 | 307.947,2 | 60.895.192,8 | 0,0320% | 0,03203% |
| 394 | 308.727,8 | 61.203.920,6 | 0,0321% | 0,03211% |
| 395 | 309.508,4 | 61.513.429 | 0,0322% | 0,03219% |
| 396 | 310.289 | 61.823.718 | 0,0323% | 0,03227% |
| 397 | 311.069,6 | 62.134.787,6 | 0,0324% | 0,03236% |
| 398 | 311.850,2 | 62.446.637,8 | 0,0324% | 0,03244% |
| 399 | 312.630,8 | 62.759.268,6 | 0,0325% | 0,03252% |
| 400 | 313.411,4 | 63.072.680 | 0,0326% | 0,0326% |
| 401 | 314.192 | 63.386.872 | 0,0327% | 0,03268% |
| 402 | 314.972,6 | 63.701.844,6 | 0,0328% | 0,03276% |
| 403 | 315.753,2 | 64.017.597,8 | 0,0328% | 0,03284% |
| 404 | 316.533,8 | 64.334.131,6 | 0,0329% | 0,03293% |
| 405 | 317.314,4 | 64.651.446 | 0,0330% | 0,03301% |
| 406 | 318.095 | 64.969.541 | 0,0331% | 0,03309% |
| 407 | 318.875,6 | 65.288.416,6 | 0,0332% | 0,03317% |
| 408 | 319.656,2 | 65.608.072,8 | 0,0333% | 0,03325% |
| 409 | 320.436,8 | 65.928.509,6 | 0,0333% | 0,03333% |
| 410 | 321.217,4 | 66.249.727 | 0,0334% | 0,03342% |
| 411 | 321.998 | 66.571.725 | 0,0335% | 0,0335% |
| 412 | 322.778,6 | 66.894.503,6 | 0,0336% | 0,03358% |
| 413 | 323.559,2 | 67.218.062,8 | 0,0337% | 0,03366% |
| 414 | 324.339,8 | 67.542.402,6 | 0,0337% | 0,03374% |
| 415 | 325.120,4 | 67.867.523 | 0,0338% | 0,03382% |
| 416 | 325.901 | 68.193.424 | 0,0339% | 0,0339% |
| 417 | 326.681,6 | 68.520.105,6 | 0,0340% | 0,03399% |
| 418 | 327.462,2 | 68.847.567,8 | 0,0341% | 0,03407% |
| 419 | 328.242,8 | 69.175.810,6 | 0,0341% | 0,03415% |
| 420 | 329.023,4 | 69.504.834 | 0,0342% | 0,03423% |
| 421 | 329.804 | 69.834.638 | 0,0343% | 0,03431% |
| 422 | 330.584,6 | 70.165.222,6 | 0,0344% | 0,03439% |
| 423 | 331.365,2 | 70.496.587,8 | 0,0345% | 0,03447% |
| 424 | 332.145,8 | 70.828.733,6 | 0,0346% | 0,03456% |
| 425 | 332.926,4 | 71.161.660 | 0,0346% | 0,03464% |
| 426 | 333.707 | 71.495.367 | 0,0347% | 0,03472% |
| 427 | 334.487,6 | 71.829.854,6 | 0,0348% | 0,0348% |
| 428 | 335.268,2 | 72.165.122,8 | 0,0349% | 0,03488% |
| 429 | 336.048,8 | 72.501.171,6 | 0,0350% | 0,03496% |
| 430 | 336.829,4 | 72.838.001 | 0,0350% | 0,03505% |
| 431 | 337.610 | 73.175.611 | 0,0351% | 0,03513% |
| 432 | 338.390,6 | 73.514.001,6 | 0,0352% | 0,03521% |
| 433 | 339.171,2 | 73.853.172,8 | 0,0353% | 0,03529% |
| 434 | 339.951,8 | 74.193.124,6 | 0,0354% | 0,03537% |
| 435 | 340.732,4 | 74.533.857 | 0,0355% | 0,03545% |
| 436 | 341.513 | 74.875.370 | 0,0355% | 0,03553% |
| 437 | 342.293,6 | 75.217.663,6 | 0,0356% | 0,03562% |
| 438 | 343.074,2 | 75.560.737,8 | 0,0357% | 0,0357% |
| 439 | 343.854,8 | 75.904.592,6 | 0,0358% | 0,03578% |
| 440 | 344.635,4 | 76.249.228 | 0,0359% | 0,03586% |
| 441 | 345.416 | 76.594.644 | 0,0359% | 0,03594% |
| 442 | 346.196,6 | 76.940.840,6 | 0,0360% | 0,03602% |
| 443 | 346.977,2 | 77.287.817,8 | 0,0361% | 0,0361% |
| 444 | 347.757,8 | 77.635.575,6 | 0,0362% | 0,03619% |
| 445 | 348.538,4 | 77.984.114 | 0,0363% | 0,03627% |
| 446 | 349.319 | 78.333.433 | 0,0363% | 0,03635% |
| 447 | 350.099,6 | 78.683.532,6 | 0,0364% | 0,03643% |
| 448 | 350.880,2 | 79.034.412,8 | 0,0365% | 0,03651% |
| 449 | 351.660,8 | 79.386.073,6 | 0,0366% | 0,03659% |
| 450 | 352.441,4 | 79.738.515 | 0,0367% | 0,03668% |
| 451 | 353.222 | 80.091.737 | 0,0368% | 0,03676% |
| 452 | 354.002,6 | 80.445.739,6 | 0,0368% | 0,03684% |
| 453 | 354.783,2 | 80.800.522,8 | 0,0369% | 0,03692% |
| 454 | 355.563,8 | 81.156.086,6 | 0,0370% | 0,037% |
| 455 | 356.344,4 | 81.512.431 | 0,0371% | 0,03708% |
| 456 | 357.125 | 81.869.556 | 0,0372% | 0,03716% |
| 457 | 357.905,6 | 82.227.461,6 | 0,0372% | 0,03725% |
| 458 | 358.686,2 | 82.586.147,8 | 0,0373% | 0,03733% |
| 459 | 359.466,8 | 82.945.614,6 | 0,0374% | 0,03741% |
| 460 | 360.247,4 | 83.305.862 | 0,0375% | 0,03749% |
| 461 | 361.028 | 83.666.890 | 0,0376% | 0,03757% |
| 462 | 361.808,6 | 84.028.698,6 | 0,0377% | 0,03765% |
| 463 | 362.589,2 | 84.391.287,8 | 0,0377% | 0,03773% |
| 464 | 363.369,8 | 84.754.657,6 | 0,0378% | 0,03782% |
| 465 | 364.150,4 | 85.118.808 | 0,0379% | 0,0379% |
| 466 | 364.931 | 85.483.739 | 0,0380% | 0,03798% |
| 467 | 365.711,6 | 85.849.450,6 | 0,0381% | 0,03806% |
| 468 | 366.492,2 | 86.215.942,8 | 0,0381% | 0,03814% |
| 469 | 367.272,8 | 86.583.215,6 | 0,0382% | 0,03822% |
| 470 | 368.053,4 | 86.951.269 | 0,0383% | 0,03831% |
| 471 | 368.834 | 87.320.103 | 0,0384% | 0,03839% |
| 472 | 369.614,6 | 87.689.717,6 | 0,0385% | 0,03847% |
| 473 | 370.395,2 | 88.060.112,8 | 0,0385% | 0,03855% |
| 474 | 371.175,8 | 88.431.288,6 | 0,0386% | 0,03863% |
| 475 | 371.956,4 | 88.803.245 | 0,0387% | 0,03871% |
| 476 | 372.737 | 89.175.982 | 0,0388% | 0,03879% |
| 477 | 373.517,6 | 89.549.499,6 | 0,0389% | 0,03888% |
| 478 | 374.298,2 | 89.923.797,8 | 0,0390% | 0,03896% |
| 479 | 375.078,8 | 90.298.876,6 | 0,0390% | 0,03904% |
| 480 | 375.859,4 | 90.674.736 | 0,0391% | 0,03912% |
| 481 | 376.640 | 91.051.376 | 0,0392% | 0,0392% |
| 482 | 377.420,6 | 91.428.796,6 | 0,0393% | 0,03928% |
| 483 | 378.201,2 | 91.806.997,8 | 0,0394% | 0,03936% |
| 484 | 378.981,8 | 92.185.979,6 | 0,0394% | 0,03945% |
| 485 | 379.762,4 | 92.565.742 | 0,0395% | 0,03953% |
| 486 | 380.543 | 92.946.285 | 0,0396% | 0,03961% |
| 487 | 381.323,6 | 93.327.608,6 | 0,0397% | 0,03969% |
| 488 | 382.104,2 | 93.709.712,8 | 0,0398% | 0,03977% |
| 489 | 382.884,8 | 94.092.597,6 | 0,0399% | 0,03985% |
| 490 | 383.665,4 | 94.476.263 | 0,0399% | 0,03994% |
| 491 | 384.446 | 94.860.709 | 0,0400% | 0,04002% |
| 492 | 385.226,6 | 95.245.935,6 | 0,0401% | 0,0401% |
| 493 | 386.007,2 | 95.631.942,8 | 0,0402% | 0,04018% |
| 494 | 386.787,8 | 96.018.730,6 | 0,0403% | 0,04026% |
| 495 | 387.568,4 | 96.406.299 | 0,0403% | 0,04034% |
| 496 | 388.349 | 96.794.648 | 0,0404% | 0,04042% |
| 497 | 389.129,6 | 97.183.777,6 | 0,0405% | 0,04051% |
| 498 | 389.910,2 | 97.573.687,8 | 0,0406% | 0,04059% |
| 499 | 390.690,8 | 97.964.378,6 | 0,0407% | 0,04067% |
| 500 | 391.471,4 | 98.355.850 | 0,0408% | 0,04075% |

