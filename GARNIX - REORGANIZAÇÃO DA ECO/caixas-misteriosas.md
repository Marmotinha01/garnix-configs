# GARNIX — Tabela de Recompensas das Caixas Misteriosas

> Escopo: `GarnixMysteryBoxes/boxes/*.yml` — 18 caixas. Levantamento do estado **atual**, sem alteração aplicada.
> Base para (1) reajustar a chance conforme a raridade do item e (2) corrigir as quantias de economia.

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml — é peso de sorteio, normalizado pelo total do arquivo.
- **Chance** é o peso convertido em porcentagem real (`peso ÷ total do arquivo`).
- A caixa **É** o item físico: botão direito abre **x1**, shift + direito abre **x4** (4 sorteios independentes).
- **Nenhuma caixa tem `azar`** — toda abertura entrega alguma coisa. É a diferença estrutural para as crates.
- **Robô não age em caixa.** O `boost-threshold` é exclusivo das crates (`Crate.java:126-137`); aqui a chance é sempre a da coluna.
- A ordem abaixo é a do menu `/caixas` (campo `weight`, do menor para o maior).

### Panorama

| # | Caixa | Arquivo | `weight` | Total de peso | Nº de prêmios | Peso = %? |
|---:|---|---|---:|---:|---:|:-:|
| 1 | Mineração [Tier I] | `mineracao-i.yml` | 10 | 100 | 27 | sim |
| 2 | Farm [Tier I] | `farm-i.yml` | 20 | 100 | 24 | sim |
| 3 | Pesca [Tier I] | `pesca-i.yml` | 30 | 100 | 24 | sim |
| 4 | Skins [Tier I] | `skins-i.yml` | 40 | 301,5 | 16 | **não** |
| 5 | Runas | `runas.yml` | 50 | 100 | 20 | sim |
| 6 | Recursos | `recursos.yml` | 60 | 100 | 39 | sim |
| 7 | Bosses [Tier I] | `bosses-i.yml` | 70 | 96,75 | 20 | **não** |
| 8 | Chaves | `chaves.yml` | 80 | 600 | 30 | **não** |
| 9 | Mineração [Tier II] | `mineracao-ii.yml` | 90 | 100 | 25 | sim |
| 10 | Farm [Tier II] | `farm-ii.yml` | 100 | 100 | 22 | sim |
| 11 | Pesca [Tier II] | `pesca-ii.yml` | 110 | 100 | 22 | sim |
| 12 | Skins [Tier II] | `skins-ii.yml` | 120 | 300 | 12 | **não** |
| 13 | Bosses [Tier II] | `bosses-ii.yml` | 130 | 98,25 | 15 | **não** |
| 14 | Boosters | `boosters.yml` | 140 | 90 | 75 | **não** |
| 15 | Máquinas | `maquinas.yml` | 150 | 100 | 8 | sim |
| 16 | Robôs | `robos.yml` | 160 | 100 | 5 | sim |
| 17 | Caixas | `caixas.yml` | 170 | 159 | 30 | **não** |
| 18 | Garnix | `garnix.yml` | 180 | 100 | 20 | sim |

---

## 1. Caixa Mineração [Tier I] — `mineracao-i.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Mineração [Tier I] | armadura | 5,5 | 5,5% | 1 |
| Peitoral Mineração [Tier I] | armadura | 5,5 | 5,5% | 1 |
| Calça Mineração [Tier I] | armadura | 5,5 | 5,5% | 1 |
| Bota Mineração [Tier I] | armadura | 5,5 | 5,5% | 1 |
| Capacete Mineração [Tier II] | armadura | 4,5 | 4,5% | 1 |
| Peitoral Mineração [Tier II] | armadura | 4,5 | 4,5% | 1 |
| Calça Mineração [Tier II] | armadura | 4,5 | 4,5% | 1 |
| Bota Mineração [Tier II] | armadura | 4,5 | 4,5% | 1 |
| Capacete Mineração [Tier III] | armadura | 2,75 | 2,75% | 1 |
| Peitoral Mineração [Tier III] | armadura | 2,75 | 2,75% | 1 |
| Calça Mineração [Tier III] | armadura | 2,75 | 2,75% | 1 |
| Bota Mineração [Tier III] | armadura | 2,75 | 2,75% | 1 |
| Forja de Skins | utilitário | 8 | 8% | 1 |
| Explosivo 2x2 | utilitário | 7 | 7% | 1 |
| Explosivo 4x4 | utilitário | 3 | 3% | 1 |
| Britadeira | utilitário | 2,5 | 2,5% | 1 |
| Skin de Pedra | skin | 5 | 5% | 1 |
| Skin de Ferro | skin | 4 | 4% | 1 |
| Skin de Ouro | skin | 2,5 | 2,5% | 1 |
| Skin de Diamante | skin | 2 | 2% | 1 |
| Gemas | economia | 4,5 | 4,5% | 1.000 |
| Livro de Ceifador | livro | 2,5 | 2,5% | 1 |
| Livro de Massacre | livro | 2,5 | 2,5% | 1 |
| Livro de Pilhagem | livro | 2,5 | 2,5% | 1 |
| Booster de Mineração 2x 5m | booster | 1,5 | 1,5% | 1 |
| Booster de Mineração 2x 10m | booster | 1 | 1% | 1 |
| Caixa Mineração [Tier II] | caixa | 0,5 | 0,5% | 1 |

---

## 2. Caixa Farm [Tier I] — `farm-i.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Farm [Tier I] | armadura | 6,75 | 6,75% | 1 |
| Peitoral Farm [Tier I] | armadura | 6,75 | 6,75% | 1 |
| Calça Farm [Tier I] | armadura | 6,75 | 6,75% | 1 |
| Bota Farm [Tier I] | armadura | 6,75 | 6,75% | 1 |
| Capacete Farm [Tier II] | armadura | 5 | 5% | 1 |
| Peitoral Farm [Tier II] | armadura | 5 | 5% | 1 |
| Calça Farm [Tier II] | armadura | 5 | 5% | 1 |
| Bota Farm [Tier II] | armadura | 5 | 5% | 1 |
| Capacete Farm [Tier III] | armadura | 3,25 | 3,25% | 1 |
| Peitoral Farm [Tier III] | armadura | 3,25 | 3,25% | 1 |
| Calça Farm [Tier III] | armadura | 3,25 | 3,25% | 1 |
| Bota Farm [Tier III] | armadura | 3,25 | 3,25% | 1 |
| Forja de Skins | utilitário | 9,5 | 9,5% | 1 |
| Skin de Pedra | skin | 5 | 5% | 1 |
| Skin de Ferro | skin | 4 | 4% | 1 |
| Skin de Ouro | skin | 3 | 3% | 1 |
| Skin de Diamante | skin | 2 | 2% | 1 |
| Sementes | economia | 6 | 6% | 1.000 |
| Livro de Ceifador | livro | 2,5 | 2,5% | 1 |
| Livro de Massacre | livro | 2,5 | 2,5% | 1 |
| Livro de Pilhagem | livro | 2,5 | 2,5% | 1 |
| Booster de Fazenda 2x 5m | booster | 1,5 | 1,5% | 1 |
| Booster de Fazenda 2x 10m | booster | 1 | 1% | 1 |
| Caixa Farm [Tier II] | caixa | 0,5 | 0,5% | 1 |

---

## 3. Caixa Pesca [Tier I] — `pesca-i.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Pesca [Tier I] | armadura | 6 | 6% | 1 |
| Peitoral Pesca [Tier I] | armadura | 6 | 6% | 1 |
| Calça Pesca [Tier I] | armadura | 6 | 6% | 1 |
| Bota Pesca [Tier I] | armadura | 6 | 6% | 1 |
| Capacete Pesca [Tier II] | armadura | 5,25 | 5,25% | 1 |
| Peitoral Pesca [Tier II] | armadura | 5,25 | 5,25% | 1 |
| Calça Pesca [Tier II] | armadura | 5,25 | 5,25% | 1 |
| Bota Pesca [Tier II] | armadura | 5,25 | 5,25% | 1 |
| Capacete Pesca [Tier III] | armadura | 3 | 3% | 1 |
| Peitoral Pesca [Tier III] | armadura | 3 | 3% | 1 |
| Calça Pesca [Tier III] | armadura | 3 | 3% | 1 |
| Bota Pesca [Tier III] | armadura | 3 | 3% | 1 |
| Forja de Skins | utilitário | 9 | 9% | 1 |
| Skin de Coral | skin | 5,5 | 5,5% | 1 |
| Skin de Escama | skin | 4,5 | 4,5% | 1 |
| Skin de Prata | skin | 3 | 3% | 1 |
| Skin de Turquesa | skin | 2 | 2% | 1 |
| Corais | economia | 5,5 | 5,5% | 1.000 |
| Livro de Cobiça | livro | 3 | 3% | 1 |
| Livro de Maré | livro | 3 | 3% | 1 |
| Livro de Correnteza | livro | 3 | 3% | 1 |
| Booster de Pesca 2x 5m | booster | 2,5 | 2,5% | 1 |
| Booster de Pesca 2x 10m | booster | 1,5 | 1,5% | 1 |
| Caixa Pesca [Tier II] | caixa | 0,5 | 0,5% | 1 |

---

## 4. Caixa Skins [Tier I] — `skins-i.yml`

Total do arquivo: **301,5** — três blocos de 100 (uma profissão cada) + 1,5 da Caixa Skins II. **Peso não é porcentagem aqui.**

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Skin de Pedra (Mineração) | mineração | 30 | 9,95% | 1 |
| Skin de Ferro (Mineração) | mineração | 25 | 8,29% | 1 |
| Skin de Ouro (Mineração) | mineração | 20 | 6,63% | 1 |
| Skin de Diamante (Mineração) | mineração | 15 | 4,98% | 1 |
| Skin de Rubi (Mineração) | mineração | 10 | 3,32% | 1 |
| Skin de Pedra (Farm) | farm | 30 | 9,95% | 1 |
| Skin de Ferro (Farm) | farm | 25 | 8,29% | 1 |
| Skin de Ouro (Farm) | farm | 20 | 6,63% | 1 |
| Skin de Diamante (Farm) | farm | 15 | 4,98% | 1 |
| Skin de Âmbar (Farm) | farm | 10 | 3,32% | 1 |
| Skin de Coral (Pesca) | pesca | 30 | 9,95% | 1 |
| Skin de Escama (Pesca) | pesca | 25 | 8,29% | 1 |
| Skin de Prata (Pesca) | pesca | 20 | 6,63% | 1 |
| Skin de Turquesa (Pesca) | pesca | 15 | 4,98% | 1 |
| Skin de Abissita (Pesca) | pesca | 10 | 3,32% | 1 |
| Caixa Skins [Tier II] | caixa | 1,5 | 0,5% | 1 |

Cada profissão tem **33,17%** de chance de sair.

---

## 5. Caixa Runas — `runas.yml`

As 4 runas com pesos idênticos: 25 (12) · 50 (7) · 100 (4) · 250 (1,5) · 500 (0,5). Cada runa soma **25%**.

| Runa | 25 un. | 50 un. | 100 un. | 250 un. | 500 un. |
|---|---:|---:|---:|---:|---:|
| Sagrada | 12% | 7% | 4% | 1,5% | 0,5% |
| Eterna | 12% | 7% | 4% | 1,5% | 0,5% |
| Divina | 12% | 7% | 4% | 1,5% | 0,5% |
| Primal | 12% | 7% | 4% | 1,5% | 0,5% |

Entregue via `runas give ... 1` (armazenamento virtual — não ocupa slot na abertura).

---

## 6. Caixa Recursos — `recursos.yml`

Escala literal **25 · 50 · 100** em todo recurso, por decisão do dono. O que varia entre eles é a chance, não a quantia.

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Coins | economia | 5,5 | 5,5% | 25 |
| Coins | economia | 3 | 3% | 50 |
| Coins | economia | 1,5 | 1,5% | 100 |
| Gemas | economia | 3,5 | 3,5% | 25 |
| Gemas | economia | 2,5 | 2,5% | 50 |
| Gemas | economia | 1,5 | 1,5% | 100 |
| Sementes | economia | 3,5 | 3,5% | 25 |
| Sementes | economia | 2,5 | 2,5% | 50 |
| Sementes | economia | 1,5 | 1,5% | 100 |
| Corais | economia | 3,5 | 3,5% | 25 |
| Corais | economia | 2,5 | 2,5% | 50 |
| Corais | economia | 1,5 | 1,5% | 100 |
| Dracmas | economia | 3,5 | 3,5% | 25 |
| Dracmas | economia | 2,5 | 2,5% | 50 |
| Dracmas | economia | 1,5 | 1,5% | 100 |
| Combustível | recurso | 6 | 6% | 25L |
| Combustível | recurso | 3 | 3% | 50L |
| Combustível | recurso | 1,5 | 1,5% | 100L |
| Limite de Armazém | limite | 5 | 5% | 25 |
| Limite de Armazém | limite | 2,5 | 2,5% | 50 |
| Limite de Armazém | limite | 1 | 1% | 100 |
| Limite de Máquinas | limite | 2,5 | 2,5% | 25 |
| Limite de Máquinas | limite | 1 | 1% | 50 |
| Limite de Máquinas | limite | 0,5 | 0,5% | 100 |
| Limite de Spawners | limite | 2,5 | 2,5% | 25 |
| Limite de Spawners | limite | 1 | 1% | 50 |
| Limite de Spawners | limite | 0,5 | 0,5% | 100 |
| Runa Sagrada | runa | 3 | 3% | 25 |
| Runa Sagrada | runa | 1,5 | 1,5% | 50 |
| Runa Eterna | runa | 3 | 3% | 25 |
| Runa Eterna | runa | 1,5 | 1,5% | 50 |
| Runa Divina | runa | 3 | 3% | 25 |
| Runa Divina | runa | 1,5 | 1,5% | 50 |
| Runa Primal | runa | 3 | 3% | 25 |
| Runa Primal | runa | 1,5 | 1,5% | 50 |
| Ativador de Baú | utilitário | 5 | 5% | 1 |
| Limpador de Terreno | utilitário | 5 | 5% | 1 |
| Reset de KDR | utilitário | 2,5 | 2,5% | 1 |
| Caixa Runas | caixa | 2,5 | 2,5% | 1 |

**Somatório por família:** secundárias 30% · runas 18% · combustível 10,5% · coins 10% · limite de armazém 8,5% · ativador 5% · limpador 5% · limite de máquinas 4% · limite de spawners 4% · caixa runas 2,5% · reset de KDR 2,5%.

---

## 7. Caixa Bosses [Tier I] — `bosses-i.yml`

Total do arquivo: **96,75**. **Peso não é porcentagem aqui.**

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Boss Colosso | boss | 18 | 18,6% | 1 stack |
| Boss Inferno | boss | 14 | 14,47% | 1 stack |
| Boss Arauto | boss | 10 | 10,34% | 1 stack |
| Boss Colosso | boss | 9 | 9,3% | 3 stacks |
| Boss Inferno | boss | 7 | 7,24% | 3 stacks |
| Boss Titã | boss | 6 | 6,2% | 1 stack |
| Boss Arauto | boss | 5 | 5,17% | 3 stacks |
| Boss Colosso | boss | 4,5 | 4,65% | 5 stacks |
| Boss Inferno | boss | 3,5 | 3,62% | 5 stacks |
| Boss Titã | boss | 3 | 3,1% | 3 stacks |
| Boss Devorador | boss | 3 | 3,1% | 1 stack |
| Boss Arauto | boss | 2,5 | 2,58% | 5 stacks |
| Boss Titã | boss | 1,5 | 1,55% | 5 stacks |
| Boss Devorador | boss | 1,5 | 1,55% | 3 stacks |
| Boss Devorador | boss | 0,75 | 0,78% | 5 stacks |
| Matadora Bruta | espada | 3 | 3,1% | 1 |
| Matadora Sombria | espada | 1,5 | 1,55% | 1 |
| Matadora Ancestral | espada | 0,5 | 0,52% | 1 |
| Livro de Kill-Stack | livro | 2 | 2,07% | 1 |
| Caixa Bosses [Tier II] | caixa | 0,5 | 0,52% | 1 |

---

## 8. Caixa Chaves — `chaves.yml`

Total do arquivo: **600** — seis blocos de 100 (uma crate cada). **Peso não é porcentagem aqui.** Cada crate tem **16,67%** de sair.

| Chave | x3 (peso 45) | x5 (peso 27) | x10 (peso 16) | x15 (peso 9) | x30 (peso 3) |
|---|---:|---:|---:|---:|---:|
| Mineração | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |
| Farm | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |
| Pesca | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |
| Bosses | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |
| VIP | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |
| RankUP | 7,5% | 4,5% | 2,667% | 1,5% | 0,5% |

Média de chaves por abertura: **6,5**.

---

## 9. Caixa Mineração [Tier II] — `mineracao-ii.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Mineração [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Peitoral Mineração [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Calça Mineração [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Bota Mineração [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Capacete Mineração [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Peitoral Mineração [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Calça Mineração [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Bota Mineração [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Capacete Mineração [Tier V] | armadura | 3 | 3% | 1 |
| Peitoral Mineração [Tier V] | armadura | 3 | 3% | 1 |
| Calça Mineração [Tier V] | armadura | 3 | 3% | 1 |
| Bota Mineração [Tier V] | armadura | 3 | 3% | 1 |
| Skin de Rubi | skin | 8 | 8% | 1 |
| Skin de Quartzo | skin | 6 | 6% | 1 |
| Skin de Jade | skin | 4 | 4% | 1 |
| Skin de Safira | skin | 3 | 3% | 1 |
| Skin de Mithril | skin | 2,5 | 2,5% | 1 |
| Explosivo 6x6 | utilitário | 4,5 | 4,5% | 1 |
| Explosivo 8x8 | utilitário | 2,5 | 2,5% | 1 |
| Britadeira | utilitário | 2,5 | 2,5% | 3 |
| Livro de Ceifador | livro | 3 | 3% | 1 |
| Livro de Massacre | livro | 3 | 3% | 1 |
| Livro de Pilhagem | livro | 3 | 3% | 1 |
| Booster de Mineração 2x 15m | booster | 3 | 3% | 1 |
| Booster de Mineração 2x 30m | booster | 2 | 2% | 1 |

**Não entrega economia nenhuma** — ao contrário do Tier I, que dá 1.000 gemas.

---

## 10. Caixa Farm [Tier II] — `farm-ii.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Farm [Tier III] | armadura | 6,25 | 6,25% | 1 |
| Peitoral Farm [Tier III] | armadura | 6,25 | 6,25% | 1 |
| Calça Farm [Tier III] | armadura | 6,25 | 6,25% | 1 |
| Bota Farm [Tier III] | armadura | 6,25 | 6,25% | 1 |
| Capacete Farm [Tier IV] | armadura | 5 | 5% | 1 |
| Peitoral Farm [Tier IV] | armadura | 5 | 5% | 1 |
| Calça Farm [Tier IV] | armadura | 5 | 5% | 1 |
| Bota Farm [Tier IV] | armadura | 5 | 5% | 1 |
| Capacete Farm [Tier V] | armadura | 3,25 | 3,25% | 1 |
| Peitoral Farm [Tier V] | armadura | 3,25 | 3,25% | 1 |
| Calça Farm [Tier V] | armadura | 3,25 | 3,25% | 1 |
| Bota Farm [Tier V] | armadura | 3,25 | 3,25% | 1 |
| Skin de Âmbar | skin | 9,5 | 9,5% | 1 |
| Skin de Esmeralda | skin | 7 | 7% | 1 |
| Skin de Ametista | skin | 5 | 5% | 1 |
| Skin de Cristal | skin | 4 | 4% | 1 |
| Skin de Marfim | skin | 2,5 | 2,5% | 1 |
| Livro de Ceifador | livro | 3 | 3% | 1 |
| Livro de Massacre | livro | 3 | 3% | 1 |
| Livro de Pilhagem | livro | 3 | 3% | 1 |
| Booster de Fazenda 2x 15m | booster | 3 | 3% | 1 |
| Booster de Fazenda 2x 30m | booster | 2 | 2% | 1 |

**Não entrega economia nenhuma** — ao contrário do Tier I, que dá 1.000 sementes.

---

## 11. Caixa Pesca [Tier II] — `pesca-ii.yml`

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Capacete Pesca [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Peitoral Pesca [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Calça Pesca [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Bota Pesca [Tier III] | armadura | 5,75 | 5,75% | 1 |
| Capacete Pesca [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Peitoral Pesca [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Calça Pesca [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Bota Pesca [Tier IV] | armadura | 4,5 | 4,5% | 1 |
| Capacete Pesca [Tier V] | armadura | 3 | 3% | 1 |
| Peitoral Pesca [Tier V] | armadura | 3 | 3% | 1 |
| Calça Pesca [Tier V] | armadura | 3 | 3% | 1 |
| Bota Pesca [Tier V] | armadura | 3 | 3% | 1 |
| Skin de Abissita | skin | 9,5 | 9,5% | 1 |
| Skin de Serenita | skin | 7 | 7% | 1 |
| Skin de Oceanita | skin | 5 | 5% | 1 |
| Skin de Pérola | skin | 4 | 4% | 1 |
| Skin de Tempestita | skin | 2,5 | 2,5% | 1 |
| Livro de Cobiça | livro | 4 | 4% | 1 |
| Livro de Maré | livro | 4 | 4% | 1 |
| Livro de Correnteza | livro | 4 | 4% | 1 |
| Booster de Pesca 2x 15m | booster | 4,5 | 4,5% | 1 |
| Booster de Pesca 2x 30m | booster | 2,5 | 2,5% | 1 |

**Não entrega economia nenhuma** — ao contrário do Tier I, que dá 1.000 corais.

---

## 12. Caixa Skins [Tier II] — `skins-ii.yml`

Total do arquivo: **300** — três blocos de 100. **Peso não é porcentagem aqui.** Cada profissão tem **33,33%**.

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Skin de Quartzo (Mineração) | mineração | 48 | 16% | 1 |
| Skin de Jade (Mineração) | mineração | 30 | 10% | 1 |
| Skin de Safira (Mineração) | mineração | 16 | 5,33% | 1 |
| Skin de Mithril (Mineração) | mineração | 6 | 2% | 1 |
| Skin de Esmeralda (Farm) | farm | 48 | 16% | 1 |
| Skin de Ametista (Farm) | farm | 30 | 10% | 1 |
| Skin de Cristal (Farm) | farm | 16 | 5,33% | 1 |
| Skin de Marfim (Farm) | farm | 6 | 2% | 1 |
| Skin de Serenita (Pesca) | pesca | 48 | 16% | 1 |
| Skin de Oceanita (Pesca) | pesca | 30 | 10% | 1 |
| Skin de Pérola (Pesca) | pesca | 16 | 5,33% | 1 |
| Skin de Tempestita (Pesca) | pesca | 6 | 2% | 1 |

---

## 13. Caixa Bosses [Tier II] — `bosses-ii.yml`

Total do arquivo: **98,25**. **Peso não é porcentagem aqui.**

| Item | Grupo | Peso | Chance | Quantia |
|---|---|---:|---:|---:|
| Boss Arauto | boss | 20 | 20,36% | 1 stack |
| Boss Titã | boss | 14 | 14,25% | 1 stack |
| Boss Arauto | boss | 10 | 10,18% | 3 stacks |
| Boss Devorador | boss | 9 | 9,16% | 1 stack |
| Boss Titã | boss | 7 | 7,12% | 3 stacks |
| Boss Arauto | boss | 5 | 5,09% | 5 stacks |
| Boss Devorador | boss | 4,5 | 4,58% | 3 stacks |
| Boss Titã | boss | 3,5 | 3,56% | 5 stacks |
| Boss Devorador | boss | 2,25 | 2,29% | 5 stacks |
| Livro de Kill-Stack | livro | 8 | 8,14% | 1 |
| Livro de Kill-Stack | livro | 4 | 4,07% | 2 |
| Matadora Sombria | espada | 6 | 6,11% | 1 |
| Matadora Ancestral | espada | 3 | 3,05% | 1 |
| Matadora Rúnica | espada | 1,5 | 1,53% | 1 |
| Matadora Abissal | espada | 0,5 | 0,51% | 1 |

---

## 14. Caixa Boosters — `boosters.yml`

Total do arquivo: **90** — 15 famílias × 6 de peso. **Peso não é porcentagem aqui.** Toda família tem exatamente **6,67%** e a distribuição interna é idêntica nas 15.

| Família | 2x 15m (peso 2) | 2x 30m (peso 1,5) | 2x 1h (peso 1) | 3x 5m (peso 1) | 3x 10m (peso 0,5) |
|---|---:|---:|---:|---:|---:|
| Mineração — Coins | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Mineração — Gemas | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Mineração — XP | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Mineração — Ambos | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Fazenda — Coins | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Fazenda — Sementes | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Fazenda — XP | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Fazenda — Ambos | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Pesca — Corais | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Pesca — XP | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Pesca — Ambos | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Máquina — Drops | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Spawner — Drops | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Spawner — Cabeças | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |
| Armazém — Venda | 2,222% | 1,667% | 1,111% | 1,111% | 0,556% |

Todos entregam **quantia 1**. Total de 75 prêmios distintos.

---

## 15. Caixa Máquinas — `maquinas.yml`

| Item | Peso | Chance | Quantia |
|---|---:|---:|---:|
| Máquina de Sementes | 20 | 20% | 1 |
| Máquina de Corais | 20 | 20% | 1 |
| Máquina de Gemas | 20 | 20% | 1 |
| Máquina de Dracmas | 15 | 15% | 1 |
| Máquina de Combustível | 12 | 12% | 1 |
| Máquina de Cash | 8 | 8% | 1 |
| Máquina de L. de Spawners | 2,5 | 2,5% | 1 |
| Máquina de L. de Máquinas | 2,5 | 2,5% | 1 |

---

## 16. Caixa Robôs — `robos.yml`

| Item | Peso | Chance | Quantia |
|---|---:|---:|---:|
| Robô Comum | 45 | 45% | 1 |
| Robô Raro | 30 | 30% | 1 |
| Robô Épico | 18 | 18% | 1 |
| Robô Lendário | 6 | 6% | 1 |
| Robô Mítico | 1 | 1% | 1 |

---

## 17. Caixa Caixas — `caixas.yml`

Total do arquivo: **159**. **Peso não é porcentagem aqui.** Toda caixa aparece duas vezes: x1 e x2.

| Item | Peso x1 | Chance x1 | Peso x2 | Chance x2 | Família |
|---|---:|---:|---:|---:|---:|
| Caixa Mineração [Tier I] | 12 | 7,547% | 6 | 3,774% | 11,32% |
| Caixa Farm [Tier I] | 12 | 7,547% | 6 | 3,774% | 11,32% |
| Caixa Pesca [Tier I] | 12 | 7,547% | 6 | 3,774% | 11,32% |
| Caixa Skins [Tier I] | 12 | 7,547% | 6 | 3,774% | 11,32% |
| Caixa Bosses [Tier I] | 12 | 7,547% | 6 | 3,774% | 11,32% |
| Caixa Mineração [Tier II] | 6 | 3,774% | 3 | 1,887% | 5,66% |
| Caixa Farm [Tier II] | 6 | 3,774% | 3 | 1,887% | 5,66% |
| Caixa Pesca [Tier II] | 6 | 3,774% | 3 | 1,887% | 5,66% |
| Caixa Skins [Tier II] | 6 | 3,774% | 3 | 1,887% | 5,66% |
| Caixa Bosses [Tier II] | 6 | 3,774% | 3 | 1,887% | 5,66% |
| Caixa Máquinas | 3,5 | 2,201% | 1,5 | 0,943% | 3,14% |
| Caixa Boosters | 3,5 | 2,201% | 1,5 | 0,943% | 3,14% |
| Caixa Runas | 3,5 | 2,201% | 1,5 | 0,943% | 3,14% |
| Caixa Recursos | 3,5 | 2,201% | 1,5 | 0,943% | 3,14% |
| Caixa Garnix | 3 | 1,887% | 1 | 0,629% | 2,52% |

---

## 18. Caixa Garnix — `garnix.yml`

A caixa de topo — item de 15.000 de cash do site.

| Item | Peso | Chance | Quantia |
|---|---:|---:|---:|
| Máquina de L. de Spawners | 19,25 | 19,25% | 5 |
| Máquina de L. de Máquinas | 19,25 | 19,25% | 5 |
| Máquina de Cash | 16,25 | 16,25% | 3 |
| Vaga de Visitante | 9 | 9% | 1 |
| Robô Lendário | 9 | 9% | 1 |
| Torre de Cacto [15 Andares] | 9 | 9% | 1 |
| Caixa Caixas | 2,5 | 2,5% | 25 |
| Caixa Skins [Tier II] | 2,5 | 2,5% | 15 |
| Skin de Tempestita | 2,5 | 2,5% | 1 |
| Torre de Cacto [30 Andares] | 2,5 | 2,5% | 1 |
| Livro de Kill-Stack | 2,5 | 2,5% | 3 |
| Papel VIP IMORTAL [3 Dias] | 2,5 | 2,5% | 1 |
| Venda Automática | 0,5 | 0,5% | 1 |
| Skin de Mithril | 0,5 | 0,5% | 1 |
| Skin de Marfim | 0,5 | 0,5% | 1 |
| Robô Mítico | 0,5 | 0,5% | 1 |
| Papel VIP SUPREMO [2 Dias] | 0,5 | 0,5% | 1 |
| Papel VIP GARNIX [1 Dia] | 0,25 | 0,25% | 1 |
| Combustível Infinito | 0,25 | 0,25% | 1 |
| Matadora Hit-Kill | 0,25 | 0,25% | 1 |

---

## 19. Economias entregues pelas caixas

Só **4 das 18 caixas** entregam moeda:

| Caixa | Moeda | Quantia | Chance de sair moeda |
|---|---|---:|---:|
| Mineração [Tier I] | Gemas | 1.000 | 4,5% |
| Farm [Tier I] | Sementes | 1.000 | 6% |
| Pesca [Tier I] | Corais | 1.000 | 5,5% |
| Recursos | Coins | 25 / 50 / 100 | 10% |
| Recursos | Gemas | 25 / 50 / 100 | 7,5% |
| Recursos | Sementes | 25 / 50 / 100 | 7,5% |
| Recursos | Corais | 25 / 50 / 100 | 7,5% |
| Recursos | Dracmas | 25 / 50 / 100 | 7,5% |

Pontos para a refatoração:

1. **A mesma moeda tem duas escalas incompatíveis.** A Caixa Mineração I dá **1.000 gemas**; a Caixa Recursos dá **25, 50 ou 100 gemas**. São 10x a 40x de diferença para a mesma moeda, entre duas caixas do mesmo jogo.
2. **As caixas Tier II não dão economia nenhuma** — o Tier I dá 1.000 da secundária e o Tier II, que é mais raro e mais caro, dá zero.
3. **Nenhuma caixa dá cash.** A única fonte de cash em caixa é a *Máquina* de Cash (garnix.yml e maquinas.yml), que é item, não moeda.
4. **Coins só aparece na Caixa Recursos**, em 25/50/100 — abaixo da crate de profissão, que já paga 250/500/1.000.
5. **A escala de limite não conversa com a das crates.** A Caixa Recursos dá 25 · 50 · 100 de qualquer limite; a crate de profissão dá 1 · 3 · 5 e a VIP/RankUP 5 · 15 · 30 · 50. Os bosses ainda usam armazém 500 / máquinas 1 / spawners 1.
6. **Sete arquivos não somam 100 de peso** (`skins-i` 301,5 · `skins-ii` 300 · `chaves` 600 · `bosses-i` 96,75 · `bosses-ii` 98,25 · `boosters` 90 · `caixas` 159): nesses, o número no yml **não** é a porcentagem que sai.
