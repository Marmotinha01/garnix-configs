# 14 — FAZENDA E PESCA (Fase 4)

As duas vias que faltavam. Cada uma tinha um problema estrutural diferente, e nenhum dos dois era de calibragem — eram de **onde a amplitude podia morar**.

| Via | Fatia da renda | Conta | Estado |
|---|---|---|---|
**Fazenda** | 18% | ativa (3h/dia) | ✅ aplicada |
**Pesca** | 7% | AFK 1 (24h/dia) | ✅ aplicada |

---

## 1. A fazenda

### O que ela tinha

| # | Problema |
|---|---|
1 | **Nível de fazenda não aumentava renda nenhuma.** Do nível 50 ao 100 o jogador não ganhava nada, enquanto na mineração o bloco ia de `coins 5.7` a `coins 11.1` |
2 | `base: 100.0, growth: 2.2` dava **1,7 hora** para o nível 100. A mineração leva 40–50h |
3 | Amplitude total: 70× (tipos de planta) × 39× (prosperity) = **2.730×**, contra as ~15,6 ordens que a curva de tiers pede |
4 | `prosperity` no teto valia **3,03×** contra os 14,91× do `fortunate` |
5 | A árvore de encantes custava **162× menos** que a de gemas da mineração pelo mesmo slot |

O nº 1 é o que motivou o **C2**: os 4 tipos de planta são 4 por um teto da 1.8 (trigo, cenoura, batata, nether wart são as únicas usáveis num sistema de plot), não por escolha de config. Sem uma escada por nível não havia onde guardar as ordens de grandeza.

### O teto físico é REAL — diferente da mina

```
22.735 posições (data.yml)  ÷  regrow-delay-seconds: 20  =  4,09×10⁶ colheitas/h
```

Na mina o `reset-cooldown` é contornável saindo e voltando; aqui o regrow é **por posição** e não tem como burlar.

### ⚠️ E o manual da fazenda NÃO é o da mina

Medido pelo dono no teste do anti-nuker:

> *"um jogador consegue quebrar no máximo **10–15 blocos** da farm sem encantamentos na enxada, não é igual à mina pois é mais difícil quebrar na área da fazenda — **não pela velocidade e sim pelo terreno meio irregular**"*

| | blocos/s | por hora |
|---|---|---|
Mina (V5-A) | 19,4 | **70.000** |
**Fazenda** | **12,5** | **45.000** |

Eu tinha assumido que os dois eram iguais. São **0,64×**, e isso move duas coisas: a árvore de AoE precisa cobrir `4,09×10⁶ ÷ 45.000 =` **90,9×** em vez de 58,5×, e o valor por colheita no nível 0 sobe 1,56× (menos colheitas para o mesmo alvo).

### 🚩 O fly é um P2W fora do orçamento de multiplicadores

> *"Na mina TODOS os jogadores têm fly, então ajuda bastante. Na fazenda só jogadores VIP, então é mais fácil para quem tem fly quebrar."*

Os 12,5 blocos/s medidos são de **quem não tem fly**. Um VIP voando na fazenda chega perto dos 19,4/s da mina — ou seja **~1,55× de throughput**, e isso **não passa pelo teto de 100×**: é vantagem de movimentação, não de multiplicador.

Somado ao bônus de VIP (35% contra os 20% do rank 20), o VIP tem **~1,74×** na fazenda. É P2W real e perceptível, e está dentro do "perceptível e não humilhante" do plano — mas precisa estar escrito, porque **nenhum orçamento de multiplicador o captura**.

**A calibragem mira o jogador SEM fly** (45.000/h). Mesmo princípio do sustentado-vs-pico: o alvo do tier descreve o jogador normal, e a vantagem de quem paga é upside.

A árvore de AoE foi calibrada **contra o teto físico**, não contra a sensação:

| Encante | Efeito | Blocos | Chance no nível 500 | Blocos por colheita |
|---|---|---|---|---|
`cataclysm` | `squareHarvest` raio 2 | 25 | **76,73%** | 19,18 |
`reap` | `playerHarvest` raio 4 | 81 | **49,85%** | 40,38 |
`laser` | `lineHarvest` raio 6, 4 cardinais | 24 | **63,29%** | 15,19 |
`crossroads` | `lineHarvest` raio 6, 4 diagonais | 24 | **63,29%** | 15,19 |

A árvore soma **90,9×** sobre os 45.000 manuais — exatamente `4,09×10⁶ ÷ 45.000`. Nem um a mais: acima disso a chance só queimaria CPU sem gerar colheita.

⚠️ **São chances altas** (76% no `cataclysm`). A 12,5 colheitas manuais/s isso dá ~9,6 procs/s por jogador. O AoE do farm é barato (`flat: one column lookup per (x,z), no Y sweep`), e o `enchant-max-simultaneous-global: 80` é a trava — mas isto entra no teste de carga **L1** com prioridade.

### Os números aplicados

| Campo | Valor |
|---|---|
`max-level` | **300** (era 100), espelhando a mineração |
Curva de XP | geométrica, `base: 11992.1`, `growth: 1.02216` |
Tempo por nível | **10,3 min, plano** · nível 300 no **dia 20** |
`payout-multiplier` (C2) | **3,93× a cada 15 níveis**, 21 degraus |
Tipos de planta | abrem nos níveis **60 / 150 / 240** (eram 5 / 20 / 50) |
Multiplicadores | pico `prosperity 17,22× × aditivos 4,48 × enxame 1,296` = **100,0×** · sustentado **55,36×** |
Árvore de encantes | ×1,95 → mesmo esforço da árvore de gemas |
`max-level` dos encantes | **500**, como a mineração |

O multiplicador **volta a 1 a cada planta nova**, então a escada fica legível: o jogador vê "×3,9 por degrau" dentro de cada planta em vez de um número gigante e opaco.

### ⚠️ Dois erros meus na escada, e por que o segundo era pior

**Primeiro:** espalhei a escada geometricamente entre valor(T1) e valor(T20), supondo que bastava ligar as duas pontas. Não basta — o throughput (AoE) e a pilha de multiplicadores **também** crescem com o nível, então o produto dos três estourava o alvo em até **200× no meio da temporada**, mesmo com as pontas fechando em 0%.

**Segundo, ao corrigir:** modelei a pilha crescendo **linear** com o nível (1 → 100), o que a faz valer 6× já no nível 15 — mais rápido que a própria curva de tiers. Resultado: o valor exigido *caía*, e o degrau saía com multiplicador **0,82**.

> **Subir de nível faria o jogador ganhar menos.** Ele sentiria isso no primeiro dia, e é o tipo de coisa que nenhum teste de banda pega, porque as pontas fechavam.

**A forma certa é a mesma da mineração:** ancorar nas duas pontas (nível 0 sem nada, nível 300 com o SUSTENTADO) e interpolar geométrico puro. Quem ainda não comprou os multiplicadores fica abaixo do alvo — e isso é o desenho, não erro: **comprar multiplicador é como o jogador se mantém na curva.**

Conferido: valor por colheita **sempre crescente**, erro de arredondamento **0,034%**.

---

## 2. A pesca

### Por que ela é o caso especial

A pilha de multiplicadores da pesca **não alcança coins**, e não tem conserto por config:

| | |
|---|---|
`config.yml` | `currency: corais` — a renda imediata é em corais |
skins | `currency-bonus` empurra corais |
armaduras | o `tier-v` da pesca dá `corais` + `xp`, **sem chave `coins`** |
boosters | `booster-types: corais/xp/both` |

Então não adianta procurar um multiplicador de coins aqui: **não existe**. A pesca vira o que o plano previa — **o equipamento compra ACESSO, não multiplicador**.

### O gate 2D

**20 recompensas de coins**, cada uma com dois portões:

| Portão | O que faz |
|---|---|
`required-level: N` | a escada de 20 níveis da vara |
`weight` = teto da skin ⌈N/2⌉ | a skin **anterior** não alcança a recompensa |

Nível 1 pede a vara `default` (peso 3); nível 20 pede a `tempestita` (peso 130). Valores de **50,1** a **2,12×10¹⁷** por fisgada, resolvidos por recorrência — a recompensa nova entrega **o que falta** depois das anteriores, que continuam no pool. Erro máximo **0,38%**.

As chances: as 5 recompensas originais somam 100, e cada recompensa de coins entra com 10. No nível 20 o pool é 300 e a mais nova pega 3,3% — as antigas continuam saindo e a nova não domina sozinha.

### A curva de XP estava 5× curta

157.500 XP no total é menos de **4 dias** numa conta AFK pescando 24h. A escada inteira das 20 recompensas esgotaria no dia 4 e os outros 16 dias não abririam nada.

Esticada para **1 nível por dia**: 23,9h cada, plano, nível 20 no **dia 19,9**. A razão de `1,0398` por nível acompanha o crescimento das fisgadas/h (240 → 504 com `speed 5` e `double 40%`).

### O `shop.yml` era um exploit de uma linha

```yaml
spawner-limit:  cost 1500 corais  ->  spawner givelimite {player} 1500
```

Câmbio **1:1** com o item nº 1 do Ranking de Apelões. A pesca rende ~2,19 milhões de corais na temporada, ou seja isso comprava **~2,19 milhões** de limite de spawner — várias ordens acima de qualquer necessidade real, já que um bloco comporta no máximo 512 itens.

**Novo câmbio: 1.100 corais = 1 de limite**, derivado de `2,19×10⁶ ÷ ~2.000` (o teto útil com folga). `maquinaslimite` entra pelo mesmo câmbio — as duas são moedas de contagem pura.

⚠️ **Os três lotes (1/10/100) têm exatamente o mesmo câmbio.** Desconto por volume aqui seria auto-anulável: o produto não tem gate nem contador por jogador, então o mais barato por unidade dominaria e os outros dois virariam decoração.

### ⚠️ Correção de uma nota minha no plano

Eu tinha escrito: *"valor no campo `currency:`, que é string entre quotes, **nunca em `amount:`**, que é inteiro cru"*. **Errado nas duas metades:**

| | Real |
|---|---|
`Reward.java:71-72` | `amount` → `new BigDecimal(getString(...))` — **seguro** |
`Reward.java:82-83` | `currency` → idem |
o que `currency:` faz | sobrescreve a renda imediata, que é em **corais** — não serviria para coins de jeito nenhum |

O caminho certo é `type: CURRENCY` + `currency-id: coins` + `amount` **entre aspas** (sem aspas um inteiro grande vira `BigInteger` e o `getString` devolve nulo).

---

## 3. As skins — a assimetria fechada

✅ **Regra do dono:** *"não quero que as 3 últimas skins de pesca, fazenda e mina sejam forjáveis (as 3 mais raras)"*.

Semântica confirmada em `SkinManager.getNextSkin`: **`forgeable: true` na skin X significa "7 de X forjam a PRÓXIMA declarada"**. Então a skin mais alta que a forja alcança é a seguinte ao último `true`.

**A fazenda estava violando a regra** e eu não tinha percebido: ela tinha **9 skins**, a forja chegava em `esmeralda`, e só **2** ficavam fora (`cristal`, `marfim`).

Criei a 10ª (`ametista`) e a escada passou a espelhar a da mineração degrau a degrau:

| Posição | Mineração | Fazenda | Pesca | Bônus |
|---|---|---|---|---|
6 (teto de forja) | rubi | ambar | abissita | +20% |
7 (a forja alcança) | quartzo | esmeralda | serenita | +28% |
**8** | jade | **ametista** 🆕 | oceanita | **+38%** |
**9** | safira | cristal | perola | **+50%** |
**10** | mithril | marfim | tempestita | **+65%** |

Ajustei `esmeralda` 30 → 28 e `cristal` 45 → 50 para os degraus baterem. Agora as **três vias têm 10 skins e exatamente 3 fora da forja** — e a regra "vender as 3 mais raras no site" passa a valer igualmente nas três.

⏳ **O nome `ametista` é provisório** — o dono define o final.

---

## 4. O que ainda falta na Fase 4

| # | Pendência |
|---|---|
1 | **Armaduras** das três vias (60 arquivos) — a escada de bônus já está certa, falta **rota e preço**, que é a Fase 4b dos itens |
2 | Os 3 encantes de livro da pesca (`speed`, `luck`, `double`) **não têm custo em config** — são 100% book-only, então dependem inteiramente das tabelas de loot da Fase 5 |
3 | O nome final da skin `ametista` |
