# GARNIX — Tabela de Recompensas das Caixas Misteriosas

> Escopo: `GarnixMysteryBoxes/boxes/*.yml` — 18 caixas. Retrato do estado atual dos arquivos.

## Como ler

- **Peso** é o valor literal do campo `chance:` no yml. **As 18 caixas somam 100**, então o peso É a porcentagem — não existe conversão a fazer.
- **`id`** é a chave da recompensa dentro do yml, para achar a linha exata na hora de editar.
- A caixa **É** o item físico: botão direito abre **x1**, shift + direito abre **x4** (4 sorteios independentes).
- **Nenhuma caixa tem `azar`** — toda abertura entrega alguma coisa. É a diferença estrutural para as crates.
- **Robô não age em caixa.** O `boost-threshold` é exclusivo das crates (`Crate.java:126-137`); aqui a chance é sempre a da coluna.
- A ordem abaixo é a do menu `/caixas` (campo `weight`, do menor para o maior).

### Panorama

| # | Caixa | Arquivo | `weight` | Total de peso | Nº de prêmios |
|---:|---|---|---:|---:|---:|
| 1 | Mineração [Tier I] | `mineracao-i.yml` | 10 | 100 | 27 |
| 2 | Farm [Tier I] | `farm-i.yml` | 20 | 100 | 24 |
| 3 | Pesca [Tier I] | `pesca-i.yml` | 30 | 100 | 24 |
| 4 | Skins [Tier I] | `skins-i.yml` | 40 | 100 | 16 |
| 5 | Runas | `runas.yml` | 50 | 100 | 24 |
| 6 | Recursos | `recursos.yml` | 60 | 100 | 42 |
| 7 | Bosses [Tier I] | `bosses-i.yml` | 70 | 100 | 20 |
| 8 | Chaves | `chaves.yml` | 80 | 100 | 30 |
| 9 | Mineração [Tier II] | `mineracao-ii.yml` | 90 | 100 | 33 |
| 10 | Farm [Tier II] | `farm-ii.yml` | 100 | 100 | 29 |
| 11 | Pesca [Tier II] | `pesca-ii.yml` | 110 | 100 | 29 |
| 12 | Skins [Tier II] | `skins-ii.yml` | 120 | 100 | 13 |
| 13 | Bosses [Tier II] | `bosses-ii.yml` | 130 | 100 | 16 |
| 14 | Boosters | `boosters.yml` | 140 | 100 | 75 |
| 15 | Máquinas | `maquinas.yml` | 150 | 100 | 8 |
| 16 | Robôs | `robos.yml` | 160 | 100 | 5 |
| 17 | Caixas | `caixas.yml` | 170 | 100 | 34 |
| 18 | Garnix | `garnix.yml` | 180 | 100 | 20 |

---

## 1. Caixa Mineração [Tier I] — `mineracao-i.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Mineração [Tier II] | `armadura-ii-capacete` | armadura | 5,28% | 1 |
| Peitoral Mineração [Tier II] | `armadura-ii-peitoral` | armadura | 5,28% | 1 |
| Calça Mineração [Tier II] | `armadura-ii-calca` | armadura | 5,28% | 1 |
| Bota Mineração [Tier II] | `armadura-ii-bota` | armadura | 5,28% | 1 |
| Capacete Mineração [Tier III] | `armadura-iii-capacete` | armadura | 1,54% | 1 |
| Peitoral Mineração [Tier III] | `armadura-iii-peitoral` | armadura | 1,54% | 1 |
| Calça Mineração [Tier III] | `armadura-iii-calca` | armadura | 1,54% | 1 |
| Bota Mineração [Tier III] | `armadura-iii-bota` | armadura | 1,54% | 1 |
| Skin de Ferro | `skin-ferro` | skin | 4,84% | 1 |
| Skin de Ouro | `skin-ouro` | skin | 3,08% | 1 |
| Skin de Diamante | `skin-diamante` | skin | 1,76% | 1 |
| Forja de Skins | `forja` | utilitário | 5,72% | 1 |
| Coins | `coins-750` | economia | 7,04% | 750 |
| Coins | `coins-1500` | economia | 4,22% | 1.500 |
| Coins | `coins-3000` | economia | 2,82% | 3.000 |
| Gemas | `gemas-450` | economia | 7,04% | 450 |
| Gemas | `gemas-900` | economia | 4,22% | 900 |
| Gemas | `gemas-1800` | economia | 2,82% | 1.800 |
| Explosivo | `bomba-2x2` | utilitário | 6% | 1 |
| Explosivo | `bomba-4x4` | utilitário | 4% | 1 |
| Britadeira | `britadeira` | utilitário | 2% | 1 |
| Booster de Mineração | `booster-2x-5m` | booster | 3,52% | 1 |
| Booster de Mineração | `booster-2x-10m` | booster | 2,2% | 1 |
| Livro de Ceifador | `livro-ceifador` | livro | 3,52% | 1 |
| Livro de Massacre | `livro-massacre` | livro | 3,52% | 1 |
| Livro de Pilhagem | `livro-pilhagem` | livro | 3,52% | 1 |
| Caixa Mineração [Tier II] | `caixa-mineracao-ii` | caixa | 0,88% | 1 |

---

## 2. Caixa Farm [Tier I] — `farm-i.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Farm [Tier II] | `armadura-ii-capacete` | armadura | 6% | 1 |
| Peitoral Farm [Tier II] | `armadura-ii-peitoral` | armadura | 6% | 1 |
| Calça Farm [Tier II] | `armadura-ii-calca` | armadura | 6% | 1 |
| Bota Farm [Tier II] | `armadura-ii-bota` | armadura | 6% | 1 |
| Capacete Farm [Tier III] | `armadura-iii-capacete` | armadura | 1,75% | 1 |
| Peitoral Farm [Tier III] | `armadura-iii-peitoral` | armadura | 1,75% | 1 |
| Calça Farm [Tier III] | `armadura-iii-calca` | armadura | 1,75% | 1 |
| Bota Farm [Tier III] | `armadura-iii-bota` | armadura | 1,75% | 1 |
| Skin de Ferro | `skin-ferro` | skin | 5,5% | 1 |
| Skin de Ouro | `skin-ouro` | skin | 3,5% | 1 |
| Skin de Diamante | `skin-diamante` | skin | 2% | 1 |
| Forja de Skins | `forja` | utilitário | 6,5% | 1 |
| Coins | `coins-750` | economia | 8% | 750 |
| Coins | `coins-1500` | economia | 4,8% | 1.500 |
| Coins | `coins-3000` | economia | 3,2% | 3.000 |
| Sementes | `sementes-450` | economia | 8% | 450 |
| Sementes | `sementes-900` | economia | 4,8% | 900 |
| Sementes | `sementes-1800` | economia | 3,2% | 1.800 |
| Booster de Fazenda | `booster-2x-5m` | booster | 4% | 1 |
| Booster de Fazenda | `booster-2x-10m` | booster | 2,5% | 1 |
| Livro de Ceifador | `livro-ceifador` | livro | 4% | 1 |
| Livro de Massacre | `livro-massacre` | livro | 4% | 1 |
| Livro de Pilhagem | `livro-pilhagem` | livro | 4% | 1 |
| Caixa Farm [Tier II] | `caixa-farm-ii` | caixa | 1% | 1 |

---

## 3. Caixa Pesca [Tier I] — `pesca-i.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Pesca [Tier II] | `armadura-ii-capacete` | armadura | 6% | 1 |
| Peitoral Pesca [Tier II] | `armadura-ii-peitoral` | armadura | 6% | 1 |
| Calça Pesca [Tier II] | `armadura-ii-calca` | armadura | 6% | 1 |
| Bota Pesca [Tier II] | `armadura-ii-bota` | armadura | 6% | 1 |
| Capacete Pesca [Tier III] | `armadura-iii-capacete` | armadura | 1,75% | 1 |
| Peitoral Pesca [Tier III] | `armadura-iii-peitoral` | armadura | 1,75% | 1 |
| Calça Pesca [Tier III] | `armadura-iii-calca` | armadura | 1,75% | 1 |
| Bota Pesca [Tier III] | `armadura-iii-bota` | armadura | 1,75% | 1 |
| Skin de Escama | `skin-escama` | skin | 5,5% | 1 |
| Skin de Prata | `skin-prata` | skin | 3,5% | 1 |
| Skin de Turquesa | `skin-turquesa` | skin | 2% | 1 |
| Forja de Skins | `forja` | utilitário | 6,5% | 1 |
| Coins | `coins-750` | economia | 8% | 750 |
| Coins | `coins-1500` | economia | 4,8% | 1.500 |
| Coins | `coins-3000` | economia | 3,2% | 3.000 |
| Corais | `corais-450` | economia | 8% | 450 |
| Corais | `corais-900` | economia | 4,8% | 900 |
| Corais | `corais-1800` | economia | 3,2% | 1.800 |
| Booster de Pesca | `booster-2x-5m` | booster | 4% | 1 |
| Booster de Pesca | `booster-2x-10m` | booster | 2,5% | 1 |
| Livro de Cobiça | `livro-fartura` | livro | 4% | 1 |
| Livro de Maré | `livro-faro` | livro | 4% | 1 |
| Livro de Correnteza | `livro-correnteza` | livro | 4% | 1 |
| Caixa Pesca [Tier II] | `caixa-pesca-ii` | caixa | 1% | 1 |

---

## 4. Caixa Skins [Tier I] — `skins-i.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Skin de Pedra | `mineracao-pedra` | skin | 11,4% | 1 |
| Skin de Ferro | `mineracao-ferro` | skin | 8,4% | 1 |
| Skin de Ouro | `mineracao-ouro` | skin | 5,4% | 1 |
| Skin de Diamante | `mineracao-diamante` | skin | 3,3% | 1 |
| Skin de Rubi | `mineracao-rubi` | skin | 1,5% | 1 |
| Skin de Pedra | `farm-pedra` | skin | 11,4% | 1 |
| Skin de Ferro | `farm-ferro` | skin | 8,4% | 1 |
| Skin de Ouro | `farm-ouro` | skin | 5,4% | 1 |
| Skin de Diamante | `farm-diamante` | skin | 3,3% | 1 |
| Skin de Âmbar | `farm-ambar` | skin | 1,5% | 1 |
| Skin de Coral | `pesca-coral` | skin | 14,82% | 1 |
| Skin de Escama | `pesca-escama` | skin | 10,92% | 1 |
| Skin de Prata | `pesca-prata` | skin | 7,02% | 1 |
| Skin de Turquesa | `pesca-turquesa` | skin | 4,29% | 1 |
| Skin de Abissita | `pesca-abissita` | skin | 1,95% | 1 |
| Caixa Skins [Tier II] | `caixa-skins-ii` | caixa | 1% | 1 |

---

## 5. Caixa Runas — `runas.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Runa Sagrada | `sagrada-25` | runa | 11% | 25 |
| Runa Sagrada | `sagrada-50` | runa | 6,5% | 50 |
| Runa Sagrada | `sagrada-75` | runa | 4% | 75 |
| Runa Sagrada | `sagrada-100` | runa | 2,5% | 100 |
| Runa Sagrada | `sagrada-250` | runa | 0,75% | 250 |
| Runa Sagrada | `sagrada-500` | runa | 0,25% | 500 |
| Runa Eterna | `eterna-25` | runa | 11% | 25 |
| Runa Eterna | `eterna-50` | runa | 6,5% | 50 |
| Runa Eterna | `eterna-75` | runa | 4% | 75 |
| Runa Eterna | `eterna-100` | runa | 2,5% | 100 |
| Runa Eterna | `eterna-250` | runa | 0,75% | 250 |
| Runa Eterna | `eterna-500` | runa | 0,25% | 500 |
| Runa Divina | `divina-25` | runa | 11% | 25 |
| Runa Divina | `divina-50` | runa | 6,5% | 50 |
| Runa Divina | `divina-75` | runa | 4% | 75 |
| Runa Divina | `divina-100` | runa | 2,5% | 100 |
| Runa Divina | `divina-250` | runa | 0,75% | 250 |
| Runa Divina | `divina-500` | runa | 0,25% | 500 |
| Runa Primal | `primal-25` | runa | 11% | 25 |
| Runa Primal | `primal-50` | runa | 6,5% | 50 |
| Runa Primal | `primal-75` | runa | 4% | 75 |
| Runa Primal | `primal-100` | runa | 2,5% | 100 |
| Runa Primal | `primal-250` | runa | 0,75% | 250 |
| Runa Primal | `primal-500` | runa | 0,25% | 500 |

---

## 6. Caixa Recursos — `recursos.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Gemas | `gemas-300` | economia | 3,5% | 300 |
| Gemas | `gemas-600` | economia | 2,5% | 600 |
| Gemas | `gemas-1200` | economia | 1,5% | 1.200 |
| Sementes | `sementes-300` | economia | 3,5% | 300 |
| Sementes | `sementes-600` | economia | 2,5% | 600 |
| Sementes | `sementes-1200` | economia | 1,5% | 1.200 |
| Corais | `corais-300` | economia | 3,5% | 300 |
| Corais | `corais-600` | economia | 2,5% | 600 |
| Corais | `corais-1200` | economia | 1,5% | 1.200 |
| Dracmas | `dracmas-1000` | economia | 3,5% | 1.000 |
| Dracmas | `dracmas-2000` | economia | 2,5% | 2.000 |
| Dracmas | `dracmas-4000` | economia | 1,5% | 4.000 |
| Runa Sagrada | `sagrada-25` | runa | 3% | 25 |
| Runa Sagrada | `sagrada-50` | runa | 1,5% | 50 |
| Runa Eterna | `eterna-25` | runa | 3% | 25 |
| Runa Eterna | `eterna-50` | runa | 1,5% | 50 |
| Runa Divina | `divina-25` | runa | 3% | 25 |
| Runa Divina | `divina-50` | runa | 1,5% | 50 |
| Runa Primal | `primal-25` | runa | 3% | 25 |
| Runa Primal | `primal-50` | runa | 1,5% | 50 |
| Coins | `coins-2000` | economia | 5,5% | 2.000 |
| Coins | `coins-4000` | economia | 3% | 4.000 |
| Coins | `coins-8000` | economia | 1,5% | 8.000 |
| Combustível | `combustivel-2000` | utilitário | 6% | 2.000 |
| Combustível | `combustivel-4000` | utilitário | 3% | 4.000 |
| Combustível | `combustivel-8000` | utilitário | 1,5% | 8.000 |
| Limite de Armazém | `lim-armazem-30` | utilitário | 4,8% | 30 |
| Limite de Armazém | `lim-armazem-50` | utilitário | 2,4% | 50 |
| Limite de Armazém | `lim-armazem-100` | utilitário | 1,2% | 100 |
| Limite de Armazém | `lim-armazem-150` | utilitário | 0,6% | 150 |
| Ativador de Baú | `ativador-bau` | utilitário | 5,5% | 1 |
| Limpador de Terreno | `limpador-terreno` | utilitário | 5,5% | 1 |
| Limite de Máquinas | `lim-maquina-30` | utilitário | 2,4% | 30 |
| Limite de Máquinas | `lim-maquina-50` | utilitário | 1,2% | 50 |
| Limite de Máquinas | `lim-maquina-100` | utilitário | 0,6% | 100 |
| Limite de Máquinas | `lim-maquina-150` | utilitário | 0,3% | 150 |
| Limite de Spawners | `lim-spawner-30` | utilitário | 0,8% | 30 |
| Limite de Spawners | `lim-spawner-50` | utilitário | 0,4% | 50 |
| Limite de Spawners | `lim-spawner-100` | utilitário | 0,2% | 100 |
| Limite de Spawners | `lim-spawner-150` | utilitário | 0,1% | 150 |
| Caixa Runas | `caixa-runas` | caixa | 3% | 1 |
| Reset de KDR | `reset-kdr` | utilitário | 2,5% | 1 |

---

## 7. Caixa Bosses [Tier I] — `bosses-i.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Boss Colosso | `boss-colosso` | boss | 18% | 1 |
| Boss Colosso | `boss-colosso-x3` | boss | 9% | 3 |
| Boss Colosso | `boss-colosso-x5` | boss | 4,5% | 5 |
| Boss Inferno | `boss-inferno` | boss | 14% | 1 |
| Boss Inferno | `boss-inferno-x3` | boss | 7% | 3 |
| Boss Inferno | `boss-inferno-x5` | boss | 3,5% | 5 |
| Boss Arauto | `boss-arauto` | boss | 10% | 1 |
| Boss Arauto | `boss-arauto-x3` | boss | 5% | 3 |
| Boss Arauto | `boss-arauto-x5` | boss | 2,5% | 5 |
| Boss Titã | `boss-tita` | boss | 6% | 1 |
| Boss Titã | `boss-tita-x3` | boss | 3% | 3 |
| Boss Titã | `boss-tita-x5` | boss | 1,5% | 5 |
| Boss Devorador | `boss-devorador` | boss | 3% | 1 |
| Boss Devorador | `boss-devorador-x3` | boss | 1,5% | 3 |
| Boss Devorador | `boss-devorador-x5` | boss | 0,75% | 5 |
| Matadora Bruta | `matadora-bruta` | matadora | 3,75% | 1 |
| Matadora Sombria | `matadora-sombria` | matadora | 2,5% | 1 |
| Matadora Ancestral | `matadora-ancestral` | matadora | 0,5% | 1 |
| Livro de Kill-Stack | `livro-killstack` | livro | 3% | 1 |
| Caixa Bosses [Tier II] | `caixa-bosses-ii` | caixa | 1% | 1 |

---

## 8. Caixa Chaves — `chaves.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Chave Mineração | `mineracao-x3` | chave | 9,9% | 3 |
| Chave Mineração | `mineracao-x5` | chave | 5,94% | 5 |
| Chave Mineração | `mineracao-x10` | chave | 3,52% | 10 |
| Chave Mineração | `mineracao-x15` | chave | 1,98% | 15 |
| Chave Mineração | `mineracao-x30` | chave | 0,66% | 30 |
| Chave Farm | `farm-x3` | chave | 9,9% | 3 |
| Chave Farm | `farm-x5` | chave | 5,94% | 5 |
| Chave Farm | `farm-x10` | chave | 3,52% | 10 |
| Chave Farm | `farm-x15` | chave | 1,98% | 15 |
| Chave Farm | `farm-x30` | chave | 0,66% | 30 |
| Chave Pesca | `pesca-x3` | chave | 9,9% | 3 |
| Chave Pesca | `pesca-x5` | chave | 5,94% | 5 |
| Chave Pesca | `pesca-x10` | chave | 3,52% | 10 |
| Chave Pesca | `pesca-x15` | chave | 1,98% | 15 |
| Chave Pesca | `pesca-x30` | chave | 0,66% | 30 |
| Chave Bosses | `bosses-x3` | chave | 7,65% | 3 |
| Chave Bosses | `bosses-x5` | chave | 4,59% | 5 |
| Chave Bosses | `bosses-x10` | chave | 2,72% | 10 |
| Chave Bosses | `bosses-x15` | chave | 1,53% | 15 |
| Chave Bosses | `bosses-x30` | chave | 0,51% | 30 |
| Chave VIP | `vip-x3` | chave | 4,5% | 3 |
| Chave VIP | `vip-x5` | chave | 2,7% | 5 |
| Chave VIP | `vip-x10` | chave | 1,6% | 10 |
| Chave VIP | `vip-x15` | chave | 0,9% | 15 |
| Chave VIP | `vip-x30` | chave | 0,3% | 30 |
| Chave RankUP | `rankup-x3` | chave | 3,15% | 3 |
| Chave RankUP | `rankup-x5` | chave | 1,89% | 5 |
| Chave RankUP | `rankup-x10` | chave | 1,12% | 10 |
| Chave RankUP | `rankup-x15` | chave | 0,63% | 15 |
| Chave RankUP | `rankup-x30` | chave | 0,21% | 30 |

---

## 9. Caixa Mineração [Tier II] — `mineracao-ii.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Mineração [Tier III] | `armadura-iii-capacete` | armadura | 5,16% | 1 |
| Peitoral Mineração [Tier III] | `armadura-iii-peitoral` | armadura | 5,16% | 1 |
| Calça Mineração [Tier III] | `armadura-iii-calca` | armadura | 5,16% | 1 |
| Bota Mineração [Tier III] | `armadura-iii-bota` | armadura | 5,16% | 1 |
| Capacete Mineração [Tier IV] | `armadura-iv-capacete` | armadura | 2,15% | 1 |
| Peitoral Mineração [Tier IV] | `armadura-iv-peitoral` | armadura | 2,15% | 1 |
| Calça Mineração [Tier IV] | `armadura-iv-calca` | armadura | 2,15% | 1 |
| Bota Mineração [Tier IV] | `armadura-iv-bota` | armadura | 2,15% | 1 |
| Capacete Mineração [Tier V] | `armadura-v-capacete` | armadura | 0,86% | 1 |
| Peitoral Mineração [Tier V] | `armadura-v-peitoral` | armadura | 0,86% | 1 |
| Calça Mineração [Tier V] | `armadura-v-calca` | armadura | 0,86% | 1 |
| Bota Mineração [Tier V] | `armadura-v-bota` | armadura | 0,86% | 1 |
| Skin de Rubi | `skin-rubi` | skin | 8,6% | 1 |
| Skin de Quartzo | `skin-quartzo` | skin | 6,45% | 1 |
| Skin de Jade | `skin-jade` | skin | 3,22% | 1 |
| Skin de Safira | `skin-safira` | skin | 0,86% | 1 |
| Skin de Mithril | `skin-mithril` | skin | 0,22% | 1 |
| Explosivo | `bomba-6x6` | utilitário | 6% | 1 |
| Explosivo | `bomba-8x8` | utilitário | 4% | 1 |
| Britadeira | `britadeira` | utilitário | 2% | 3 |
| Coins | `coins-1250` | economia | 4,3% | 1.250 |
| Coins | `coins-2500` | economia | 2,58% | 2.500 |
| Coins | `coins-5000` | economia | 1,72% | 5.000 |
| Gemas | `gemas-750` | economia | 4,3% | 750 |
| Gemas | `gemas-1500` | economia | 2,58% | 1.500 |
| Gemas | `gemas-3000` | economia | 1,72% | 3.000 |
| Vaga de Visitante | `vaga` | utilitário | 2% | 1 |
| Booster de Mineração | `booster-2x-15m` | booster | 3,66% | 1 |
| Booster de Mineração | `booster-2x-30m` | booster | 2,36% | 1 |
| Livro de Ceifador | `livro-ceifador` | livro | 3,01% | 1 |
| Livro de Massacre | `livro-massacre` | livro | 3,01% | 1 |
| Livro de Pilhagem | `livro-pilhagem` | livro | 3,01% | 1 |
| Caixa Mineração [Tier II] | `caixa-mineracao-ii-x2` | caixa | 1,72% | 2 |

---

## 10. Caixa Farm [Tier II] — `farm-ii.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Farm [Tier III] | `armadura-iii-capacete` | armadura | 6% | 1 |
| Peitoral Farm [Tier III] | `armadura-iii-peitoral` | armadura | 6% | 1 |
| Calça Farm [Tier III] | `armadura-iii-calca` | armadura | 6% | 1 |
| Bota Farm [Tier III] | `armadura-iii-bota` | armadura | 6% | 1 |
| Capacete Farm [Tier IV] | `armadura-iv-capacete` | armadura | 2,5% | 1 |
| Peitoral Farm [Tier IV] | `armadura-iv-peitoral` | armadura | 2,5% | 1 |
| Calça Farm [Tier IV] | `armadura-iv-calca` | armadura | 2,5% | 1 |
| Bota Farm [Tier IV] | `armadura-iv-bota` | armadura | 2,5% | 1 |
| Capacete Farm [Tier V] | `armadura-v-capacete` | armadura | 1% | 1 |
| Peitoral Farm [Tier V] | `armadura-v-peitoral` | armadura | 1% | 1 |
| Calça Farm [Tier V] | `armadura-v-calca` | armadura | 1% | 1 |
| Bota Farm [Tier V] | `armadura-v-bota` | armadura | 1% | 1 |
| Skin de Âmbar | `skin-ambar` | skin | 10% | 1 |
| Skin de Esmeralda | `skin-esmeralda` | skin | 7,5% | 1 |
| Skin de Ametista | `skin-ametista` | skin | 3,75% | 1 |
| Skin de Cristal | `skin-cristal` | skin | 1% | 1 |
| Skin de Marfim | `skin-marfim` | skin | 0,25% | 1 |
| Coins | `coins-1250` | economia | 5% | 1.250 |
| Coins | `coins-2500` | economia | 3% | 2.500 |
| Coins | `coins-5000` | economia | 2% | 5.000 |
| Sementes | `sementes-750` | economia | 5% | 750 |
| Sementes | `sementes-1500` | economia | 3% | 1.500 |
| Sementes | `sementes-3000` | economia | 2% | 3.000 |
| Booster de Fazenda | `booster-2x-15m` | booster | 4,25% | 1 |
| Booster de Fazenda | `booster-2x-30m` | booster | 2,75% | 1 |
| Livro de Ceifador | `livro-ceifador` | livro | 3,5% | 1 |
| Livro de Massacre | `livro-massacre` | livro | 3,5% | 1 |
| Livro de Pilhagem | `livro-pilhagem` | livro | 3,5% | 1 |
| Caixa Farm [Tier II] | `caixa-farm-ii-x2` | caixa | 2% | 2 |

---

## 11. Caixa Pesca [Tier II] — `pesca-ii.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Capacete Pesca [Tier III] | `armadura-iii-capacete` | armadura | 6% | 1 |
| Peitoral Pesca [Tier III] | `armadura-iii-peitoral` | armadura | 6% | 1 |
| Calça Pesca [Tier III] | `armadura-iii-calca` | armadura | 6% | 1 |
| Bota Pesca [Tier III] | `armadura-iii-bota` | armadura | 6% | 1 |
| Capacete Pesca [Tier IV] | `armadura-iv-capacete` | armadura | 2,5% | 1 |
| Peitoral Pesca [Tier IV] | `armadura-iv-peitoral` | armadura | 2,5% | 1 |
| Calça Pesca [Tier IV] | `armadura-iv-calca` | armadura | 2,5% | 1 |
| Bota Pesca [Tier IV] | `armadura-iv-bota` | armadura | 2,5% | 1 |
| Capacete Pesca [Tier V] | `armadura-v-capacete` | armadura | 1% | 1 |
| Peitoral Pesca [Tier V] | `armadura-v-peitoral` | armadura | 1% | 1 |
| Calça Pesca [Tier V] | `armadura-v-calca` | armadura | 1% | 1 |
| Bota Pesca [Tier V] | `armadura-v-bota` | armadura | 1% | 1 |
| Skin de Abissita | `skin-abissita` | skin | 10% | 1 |
| Skin de Serenita | `skin-serenita` | skin | 7,5% | 1 |
| Skin de Oceanita | `skin-oceanita` | skin | 3,75% | 1 |
| Skin de Pérola | `skin-perola` | skin | 1% | 1 |
| Skin de Tempestita | `skin-tempestita` | skin | 0,25% | 1 |
| Coins | `coins-1250` | economia | 5% | 1.250 |
| Coins | `coins-2500` | economia | 3% | 2.500 |
| Coins | `coins-5000` | economia | 2% | 5.000 |
| Corais | `corais-750` | economia | 5% | 750 |
| Corais | `corais-1500` | economia | 3% | 1.500 |
| Corais | `corais-3000` | economia | 2% | 3.000 |
| Booster de Pesca | `booster-2x-15m` | booster | 4,25% | 1 |
| Booster de Pesca | `booster-2x-30m` | booster | 2,75% | 1 |
| Livro de Cobiça | `livro-fartura` | livro | 3,5% | 1 |
| Livro de Maré | `livro-faro` | livro | 3,5% | 1 |
| Livro de Correnteza | `livro-correnteza` | livro | 3,5% | 1 |
| Caixa Pesca [Tier II] | `caixa-pesca-ii-x2` | caixa | 2% | 2 |

---

## 12. Caixa Skins [Tier II] — `skins-ii.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Skin de Quartzo | `mineracao-quartzo` | skin | 16,5% | 1 |
| Skin de Jade | `mineracao-jade` | skin | 9,6% | 1 |
| Skin de Safira | `mineracao-safira` | skin | 3,3% | 1 |
| Skin de Mithril | `mineracao-mithril` | skin | 0,6% | 1 |
| Skin de Esmeralda | `farm-esmeralda` | skin | 16,5% | 1 |
| Skin de Ametista | `farm-ametista` | skin | 9,6% | 1 |
| Skin de Cristal | `farm-cristal` | skin | 3,3% | 1 |
| Skin de Marfim | `farm-marfim` | skin | 0,6% | 1 |
| Skin de Serenita | `pesca-serenita` | skin | 20,9% | 1 |
| Skin de Oceanita | `pesca-oceanita` | skin | 12,16% | 1 |
| Skin de Pérola | `pesca-perola` | skin | 4,18% | 1 |
| Skin de Tempestita | `pesca-tempestita` | skin | 0,76% | 1 |
| Caixa Skins [Tier II] | `caixa-skins-ii-x2` | caixa | 2% | 2 |

---

## 13. Caixa Bosses [Tier II] — `bosses-ii.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Boss Arauto | `boss-arauto` | boss | 20% | 1 |
| Boss Arauto | `boss-arauto-x3` | boss | 10% | 3 |
| Boss Arauto | `boss-arauto-x5` | boss | 5% | 5 |
| Boss Titã | `boss-tita` | boss | 14% | 1 |
| Boss Titã | `boss-tita-x3` | boss | 7% | 3 |
| Boss Titã | `boss-tita-x5` | boss | 3,5% | 5 |
| Boss Devorador | `boss-devorador` | boss | 9% | 1 |
| Boss Devorador | `boss-devorador-x3` | boss | 4,5% | 3 |
| Boss Devorador | `boss-devorador-x5` | boss | 2,25% | 5 |
| Livro de Kill-Stack | `livro-killstack` | livro | 8% | 1 |
| Livro de Kill-Stack | `livro-killstack-x2` | livro | 4% | 2 |
| Matadora Sombria | `matadora-sombria` | matadora | 6% | 1 |
| Matadora Ancestral | `matadora-ancestral` | matadora | 3% | 1 |
| Matadora Rúnica | `matadora-runica` | matadora | 1,5% | 1 |
| Matadora Abissal | `matadora-abissal` | matadora | 0,25% | 1 |
| Caixa Bosses [Tier II] | `caixa-bosses-ii-x2` | caixa | 2% | 2 |

---

## 14. Caixa Boosters — `boosters.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Booster de Mineração | `mina-coins-2x-15m` | booster | 4% | 1 |
| Booster de Mineração | `mina-coins-2x-30m` | booster | 3% | 1 |
| Booster de Mineração | `mina-coins-2x-1h` | booster | 1,5% | 1 |
| Booster de Mineração | `mina-coins-3x-5m` | booster | 2,5% | 1 |
| Booster de Mineração | `mina-coins-3x-10m` | booster | 1% | 1 |
| Booster de Mineração | `mina-gemas-2x-15m` | booster | 2,7% | 1 |
| Booster de Mineração | `mina-gemas-2x-30m` | booster | 2% | 1 |
| Booster de Mineração | `mina-gemas-2x-1h` | booster | 1% | 1 |
| Booster de Mineração | `mina-gemas-3x-5m` | booster | 1,65% | 1 |
| Booster de Mineração | `mina-gemas-3x-10m` | booster | 0,65% | 1 |
| Booster de Mineração | `mina-xp-2x-15m` | booster | 2,7% | 1 |
| Booster de Mineração | `mina-xp-2x-30m` | booster | 2% | 1 |
| Booster de Mineração | `mina-xp-2x-1h` | booster | 1% | 1 |
| Booster de Mineração | `mina-xp-3x-5m` | booster | 1,65% | 1 |
| Booster de Mineração | `mina-xp-3x-10m` | booster | 0,65% | 1 |
| Booster de Mineração | `mina-both-2x-15m` | booster | 1,35% | 1 |
| Booster de Mineração | `mina-both-2x-30m` | booster | 1% | 1 |
| Booster de Mineração | `mina-both-2x-1h` | booster | 0,5% | 1 |
| Booster de Mineração | `mina-both-3x-5m` | booster | 0,85% | 1 |
| Booster de Mineração | `mina-both-3x-10m` | booster | 0,3% | 1 |
| Booster de Fazenda | `fazenda-coins-2x-15m` | booster | 4% | 1 |
| Booster de Fazenda | `fazenda-coins-2x-30m` | booster | 3% | 1 |
| Booster de Fazenda | `fazenda-coins-2x-1h` | booster | 1,5% | 1 |
| Booster de Fazenda | `fazenda-coins-3x-5m` | booster | 2,5% | 1 |
| Booster de Fazenda | `fazenda-coins-3x-10m` | booster | 1% | 1 |
| Booster de Fazenda | `fazenda-sementes-2x-15m` | booster | 2,7% | 1 |
| Booster de Fazenda | `fazenda-sementes-2x-30m` | booster | 2% | 1 |
| Booster de Fazenda | `fazenda-sementes-2x-1h` | booster | 1% | 1 |
| Booster de Fazenda | `fazenda-sementes-3x-5m` | booster | 1,65% | 1 |
| Booster de Fazenda | `fazenda-sementes-3x-10m` | booster | 0,65% | 1 |
| Booster de Fazenda | `fazenda-xp-2x-15m` | booster | 2,7% | 1 |
| Booster de Fazenda | `fazenda-xp-2x-30m` | booster | 2% | 1 |
| Booster de Fazenda | `fazenda-xp-2x-1h` | booster | 1% | 1 |
| Booster de Fazenda | `fazenda-xp-3x-5m` | booster | 1,65% | 1 |
| Booster de Fazenda | `fazenda-xp-3x-10m` | booster | 0,65% | 1 |
| Booster de Fazenda | `fazenda-both-2x-15m` | booster | 1,35% | 1 |
| Booster de Fazenda | `fazenda-both-2x-30m` | booster | 1% | 1 |
| Booster de Fazenda | `fazenda-both-2x-1h` | booster | 0,5% | 1 |
| Booster de Fazenda | `fazenda-both-3x-5m` | booster | 0,85% | 1 |
| Booster de Fazenda | `fazenda-both-3x-10m` | booster | 0,3% | 1 |
| Booster de Pesca | `pesca-corais-2x-15m` | booster | 2,7% | 1 |
| Booster de Pesca | `pesca-corais-2x-30m` | booster | 2% | 1 |
| Booster de Pesca | `pesca-corais-2x-1h` | booster | 1% | 1 |
| Booster de Pesca | `pesca-corais-3x-5m` | booster | 1,65% | 1 |
| Booster de Pesca | `pesca-corais-3x-10m` | booster | 0,65% | 1 |
| Booster de Pesca | `pesca-xp-2x-15m` | booster | 2,7% | 1 |
| Booster de Pesca | `pesca-xp-2x-30m` | booster | 2% | 1 |
| Booster de Pesca | `pesca-xp-2x-1h` | booster | 1% | 1 |
| Booster de Pesca | `pesca-xp-3x-5m` | booster | 1,65% | 1 |
| Booster de Pesca | `pesca-xp-3x-10m` | booster | 0,65% | 1 |
| Booster de Pesca | `pesca-both-2x-15m` | booster | 1,35% | 1 |
| Booster de Pesca | `pesca-both-2x-30m` | booster | 1% | 1 |
| Booster de Pesca | `pesca-both-2x-1h` | booster | 0,5% | 1 |
| Booster de Pesca | `pesca-both-3x-5m` | booster | 0,85% | 1 |
| Booster de Pesca | `pesca-both-3x-10m` | booster | 0,3% | 1 |
| Booster de Máquina | `maquina-drops-2x-15m` | booster | 1,35% | 1 |
| Booster de Máquina | `maquina-drops-2x-30m` | booster | 1% | 1 |
| Booster de Máquina | `maquina-drops-2x-1h` | booster | 0,5% | 1 |
| Booster de Máquina | `maquina-drops-3x-5m` | booster | 0,85% | 1 |
| Booster de Máquina | `maquina-drops-3x-10m` | booster | 0,3% | 1 |
| Booster de Spawner | `spawner-drops-2x-15m` | booster | 1,35% | 1 |
| Booster de Spawner | `spawner-drops-2x-30m` | booster | 1% | 1 |
| Booster de Spawner | `spawner-drops-2x-1h` | booster | 0,5% | 1 |
| Booster de Spawner | `spawner-drops-3x-5m` | booster | 0,85% | 1 |
| Booster de Spawner | `spawner-drops-3x-10m` | booster | 0,3% | 1 |
| Booster de Spawner | `spawner-heads-2x-15m` | booster | 1,35% | 1 |
| Booster de Spawner | `spawner-heads-2x-30m` | booster | 1% | 1 |
| Booster de Spawner | `spawner-heads-2x-1h` | booster | 0,5% | 1 |
| Booster de Spawner | `spawner-heads-3x-5m` | booster | 0,85% | 1 |
| Booster de Spawner | `spawner-heads-3x-10m` | booster | 0,3% | 1 |
| Booster de Armazém | `armazem-venda-2x-15m` | booster | 1,35% | 1 |
| Booster de Armazém | `armazem-venda-2x-30m` | booster | 1% | 1 |
| Booster de Armazém | `armazem-venda-2x-1h` | booster | 0,5% | 1 |
| Booster de Armazém | `armazem-venda-3x-5m` | booster | 0,85% | 1 |
| Booster de Armazém | `armazem-venda-3x-10m` | booster | 0,3% | 1 |

---

## 15. Caixa Máquinas — `maquinas.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Máquina de Sementes | `sementes` | máquina | 22% | 1 |
| Máquina de Corais | `corais` | máquina | 22% | 1 |
| Máquina de Gemas | `gemas` | máquina | 22% | 1 |
| Máquina de Dracmas | `dracmas` | máquina | 15% | 1 |
| Máquina de Combustível | `combustivel` | máquina | 12% | 1 |
| Máquina de Cash | `cash` | máquina | 2% | 1 |
| Máquina de L. de Spawners | `limite-spawners` | máquina | 2,5% | 1 |
| Máquina de L. de Máquinas | `limite-maquinas` | máquina | 2,5% | 1 |

---

## 16. Caixa Robôs — `robos.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Robô Comum | `comum` | robô | 35% | 1 |
| Robô Raro | `raro` | robô | 32% | 1 |
| Robô Épico | `epico` | robô | 22% | 1 |
| Robô Lendário | `lendario` | robô | 9% | 1 |
| Robô Mítico | `mitico` | robô | 2% | 1 |

---

## 17. Caixa Caixas — `caixas.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Caixa Mineração [Tier I] | `mineracao-i` | caixa | 7,33% | 1 |
| Caixa Mineração [Tier I] | `mineracao-i-x2` | caixa | 3,67% | 2 |
| Caixa Farm [Tier I] | `farm-i` | caixa | 7% | 1 |
| Caixa Farm [Tier I] | `farm-i-x2` | caixa | 3,5% | 2 |
| Caixa Pesca [Tier I] | `pesca-i` | caixa | 6,67% | 1 |
| Caixa Pesca [Tier I] | `pesca-i-x2` | caixa | 3,33% | 2 |
| Caixa Skins [Tier I] | `skins-i` | caixa | 6% | 1 |
| Caixa Skins [Tier I] | `skins-i-x2` | caixa | 3% | 2 |
| Caixa Runas | `runas` | caixa | 5,33% | 1 |
| Caixa Runas | `runas-x2` | caixa | 2,67% | 2 |
| Caixa Recursos | `recursos` | caixa | 5% | 1 |
| Caixa Recursos | `recursos-x2` | caixa | 2,5% | 2 |
| Caixa Bosses [Tier I] | `bosses-i` | caixa | 4,67% | 1 |
| Caixa Bosses [Tier I] | `bosses-i-x2` | caixa | 2,33% | 2 |
| Caixa Chaves | `chaves` | caixa | 4,33% | 1 |
| Caixa Chaves | `chaves-x2` | caixa | 2,17% | 2 |
| Caixa Mineração [Tier II] | `mineracao-ii` | caixa | 3,67% | 1 |
| Caixa Mineração [Tier II] | `mineracao-ii-x2` | caixa | 1,83% | 2 |
| Caixa Farm [Tier II] | `farm-ii` | caixa | 3,33% | 1 |
| Caixa Farm [Tier II] | `farm-ii-x2` | caixa | 1,67% | 2 |
| Caixa Pesca [Tier II] | `pesca-ii` | caixa | 3% | 1 |
| Caixa Pesca [Tier II] | `pesca-ii-x2` | caixa | 1,5% | 2 |
| Caixa Skins [Tier II] | `skins-ii` | caixa | 2,67% | 1 |
| Caixa Skins [Tier II] | `skins-ii-x2` | caixa | 1,33% | 2 |
| Caixa Bosses [Tier II] | `bosses-ii` | caixa | 2,33% | 1 |
| Caixa Bosses [Tier II] | `bosses-ii-x2` | caixa | 1,17% | 2 |
| Caixa Boosters | `boosters` | caixa | 2% | 1 |
| Caixa Boosters | `boosters-x2` | caixa | 1% | 2 |
| Caixa Máquinas | `maquinas` | caixa | 1,67% | 1 |
| Caixa Máquinas | `maquinas-x2` | caixa | 0,83% | 2 |
| Caixa Robôs | `robos` | caixa | 1% | 1 |
| Caixa Robôs | `robos-x2` | caixa | 0,5% | 2 |
| Caixa Garnix | `garnix` | caixa | 0,67% | 1 |
| Caixa Garnix | `garnix-x2` | caixa | 0,33% | 2 |

---

## 18. Caixa Garnix — `garnix.yml`

| Item | `id` | Grupo | Peso / Chance | Quantia |
|---|---|---|---:|---:|
| Máquina de L. de Spawners | `maquina-limite-spawners` | máquina | 19,25% | 5 |
| Máquina de L. de Máquinas | `maquina-limite-maquinas` | máquina | 19,25% | 5 |
| Máquina de Cash | `maquina-cash` | máquina | 18,25% | 3 |
| Vaga de Visitante | `vaga` | utilitário | 9% | 1 |
| Robô Lendário | `robo-lendario` | robô | 9% | 1 |
| Torre de Cacto [15 Andares] | `torre-cacto-15` | utilitário | 9% | 1 |
| Caixa Caixas | `caixas` | caixa | 2,5% | 25 |
| Caixa Skins [Tier II] | `skins-ii` | caixa | 2,5% | 15 |
| Torre de Cacto [30 Andares] | `torre-cacto-30` | utilitário | 2,5% | 1 |
| Livro de Kill-Stack | `livro-killstack` | livro | 2,5% | 3 |
| Papel VIP IMORTAL | `papel-imortal` | utilitário | 2,5% | 1 |
| Venda Automática | `venda-automatica` | utilitário | 0,5% | 1 |
| Skin de Mithril | `skin-mithril` | skin | 0,5% | 1 |
| Skin de Marfim | `skin-marfim` | skin | 0,5% | 1 |
| Skin de Tempestita | `skin-tempestita` | skin | 0,5% | 1 |
| Robô Mítico | `robo-mitico` | robô | 0,5% | 1 |
| Papel VIP SUPREMO | `papel-supremo` | utilitário | 0,5% | 1 |
| Papel VIP GARNIX | `papel-garnix` | utilitário | 0,25% | 1 |
| Combustível Infinito | `combustivel-inf` | utilitário | 0,25% | 1 |
| Matadora Hit-Kill | `matadora-hk` | matadora | 0,25% | 1 |

---

## 19. Economias entregues pelas caixas

**7 das 18 caixas** entregam moeda. Toda moeda sai em escada de três degraus, com os pesos repartidos em 50/30/20 dentro da família.

| Caixa | Moeda | Quantia | Chance de sair essa moeda |
|---|---|---|---:|
| Mineração [Tier I] | Coins | 750 / 1.500 / 3.000 | 14,08% |
| Mineração [Tier I] | Gemas | 450 / 900 / 1.800 | 14,08% |
| Farm [Tier I] | Coins | 750 / 1.500 / 3.000 | 16% |
| Farm [Tier I] | Sementes | 450 / 900 / 1.800 | 16% |
| Pesca [Tier I] | Coins | 750 / 1.500 / 3.000 | 16% |
| Pesca [Tier I] | Corais | 450 / 900 / 1.800 | 16% |
| Mineração [Tier II] | Coins | 1.250 / 2.500 / 5.000 | 8,6% |
| Mineração [Tier II] | Gemas | 750 / 1.500 / 3.000 | 8,6% |
| Farm [Tier II] | Coins | 1.250 / 2.500 / 5.000 | 10% |
| Farm [Tier II] | Sementes | 750 / 1.500 / 3.000 | 10% |
| Pesca [Tier II] | Coins | 1.250 / 2.500 / 5.000 | 10% |
| Pesca [Tier II] | Corais | 750 / 1.500 / 3.000 | 10% |
| Recursos | Coins | 2.000 / 4.000 / 8.000 | 10% |
| Recursos | Dracmas | 1.000 / 2.000 / 4.000 | 7,5% |
| Recursos | Gemas | 300 / 600 / 1.200 | 7,5% |
| Recursos | Sementes | 300 / 600 / 1.200 | 7,5% |
| Recursos | Corais | 300 / 600 / 1.200 | 7,5% |

### De onde vem cada escada

| Origem | Escada | Quem usa |
|---|---|---|
| Crate de linha (250 · 500 · 1.000 coins, 150 · 300 · 600 secundária) | **×3** | as três caixas Tier I |
| A mesma crate | **×5** | as três caixas Tier II |
| Crate RankUP, tirando o degrau mais baixo e somando um mais alto | — | Caixa Recursos |

A moeda é o **filler** das caixas de linha: 30% do peso na Tier I e 20% na Tier II, porque a Tier II é comprada e quem paga quer item. Dentro de cada família a escada é 50/30/20 e não o 60/30/10 da crate — com 60/30/10 o degrau de cima ficaria mais raro que a skin de topo, e moeda nunca pode ser mais rara que item.

### Pontos em aberto

1. **Nenhuma caixa dá cash.** A única rota de cash em caixa é a *Máquina* de Cash (`garnix.yml` e `maquinas.yml`), que é item, não moeda.
2. **Dracmas só sai na Caixa Recursos.** As três caixas de linha dão coins + a secundária da própria linha; a moeda de boss não entra em nenhuma delas.
3. **O limite de spawner continua desproporcional.** A Caixa Recursos entrega 30 · 50 · 100 · 150 dele, e a 150 vale 600.000 no cash shop. A razão 6:3:1 entre armazém, máquina e spawner compensa parte disso, mas não fecha a conta — está registrado no cabeçalho do `recursos.yml` que o caminho, se virar problema, é tirar o item da caixa, não afinar mais o peso.
4. **As máquinas de limite da Caixa Garnix são o maior valor por abertura do servidor.** Cinco de cada, produzindo 1 limite por hora cada uma: 120 limites de spawner e 120 de máquina por dia, para sempre. Decisão consciente do dono — a Garnix é a caixa mais rara e o prêmio dela é desproporcional de propósito.
