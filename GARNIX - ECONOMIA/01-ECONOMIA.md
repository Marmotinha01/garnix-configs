# 01 — ECONOMIA (documento mestre)

Fonte da verdade da economia da temporada. **Todo número de todo `.yml` de plugin deriva daqui.** Se um valor num plugin não puder ser explicado por uma linha deste arquivo, ele está errado.

Última atualização: **29/07/2026**

---

## 1. Parâmetros da temporada

| Parâmetro | Valor |
|---|---|
Duração | **20 dias**, reset total ao fim |
Tiers | **20**, um por dia — **tier N = dia N** |
Crescimento | **8× por dia** (17 ordens em 19 saltos) |
Teto de coins | **1,44×10²¹ (sextilhões)** no dia 20, para o jogador dedicado |
T1 (dia 1) | **10⁴** — o teto físico de um jogador novo |
Banda casual (1h/dia) | 10¹²–10¹⁵ |
Banda hardcore (8h/dia) | até ~10²³ |
Cash de um free na temporada | **400**, 560 se vinculado, ~860 com eventos, ~960 com a máquina de cash |
Cash de um whale | teto de exagero **500.000** |
Jogadores esperados | 100–250, funcionando com 50 |
Contas por IP | **3** — 2 AFK + 1 ativa |
Razão ativo : AFK | **20 : 1** por hora |

**Fórmula mestre:**

```
renda diária da casa no tier N  =  10.000 × 8^(N-1)
```

Onde "casa" = as 3 contas de um jogador somadas.

**O crescimento não foi escolhido, foi derivado das duas pontas — e as duas são físicas.** Um jogador novo minera ~3.000 blocos/hora à mão a 1 coin/bloco, ou seja ~9.000 coins numa sessão de 3h: **a casa faz ~10⁴ no dia 1 e isso não é negociável.** O teto pedido é 10²¹. Então `log(10²¹/10⁴) = 17 ordens` em **19 saltos** = 0,895 ordem/dia = **7,94×**, arredondado para **8×**.

Tabela completa e todos os valores derivados em [02-TIERS.md](02-TIERS.md).

---

## 2. Os dois eixos independentes

A decisão estrutural do plano. Duas escadas que não se misturam — é isso que faz "sextilhões de coins" e "500 de prestígio" caberem na mesma temporada de 20 dias.

| | **Eixo COINS** | **Eixo CABEÇAS** |
|---|---|---|
Natureza | exponencial, 8×/dia | linear no tempo de kill |
Amplitude | 17 ordens, até 1,44×10²¹ | contagem, cresce com throughput |
Escada | 20 tiers | 20 ranks → prestígio → 20 ranks → ∞ |
Onde é gasto | spawners, máquinas, loja, combustível, limites, consumíveis | **rank e prestígio, nada mais** |
Teto | sextilhões no dia 20 | centenas de prestígios |
Quem trava | renda | **tempo** |

O custo do rank é dominado por **cabeças**. Coins entram só de forma simbólica — **2% da renda diária do tier**, com teto de `1×10¹⁸` a partir do rank 19.

**Por que isso importa:**

1. **Riqueza não compra rank.** Um whale com 10²¹ coins não sobe um rank mais rápido que um free — falta tempo de kill.
2. **A escada pode ser reescalada centenas de vezes** sem tocar na curva de coins, porque nunca esteve nela.
3. **É literalmente o tema.** RankUP Heads: cabeça é a moeda do rank, não decoração temática.
4. **Alivia o `Long.MAX`.** Só o preço do spawner em T19–T20 ainda estoura (ver C1).

---

## 3. Arquitetura de moedas

Exatamente **uma** moeda carrega o exponencial. É isso que torna o resto tratável.

| Moeda | Classe | Amplitude | Papel |
|---|---|---|---|
`coins` | **Exponencial** | 17 ordens | spawners, máquinas, loja, combustível, limites |
`gemas` | Linear | 3–4 ordens | encantes de **mineração** |
`sementes` | Linear | 3–4 ordens | encantes de **farm** |
`corais` | Linear | 3–4 ordens | progressão de **pesca**: vara, skins, livros, limites |
`dracmas` | Linear | 3–4 ordens | secundária dos **spawners**: 3 trilhas de upgrade, livros da lâmina, **requisito de compra do spawner** |
`spawnerslimite` / `maquinaslimite` | Contagem | inteiros | termo de **quantidade** — nunca tierar |
`cash` | Premium, mão-fixada | 10²–10⁵ | ver §8 |
**Cabeças** | Item, não moeda | contagem | **gate do rank e do prestígio** |

Moeda linear = oferta proporcional ao **tempo jogado**, não ao tier. Nunca deve passar de sufixo M/B.

### Lei: coins não pode ditar o servidor

**Coins compram a entrada. A moeda secundária compra a profundidade.** Nenhuma quantidade de coins maximiza qualquer via sozinha.

| Via | Entrada (coins) | Profundidade (coins não compram) |
|---|---|---|
Mineração | acesso à mina, resets | **gemas** → os 15 encantes |
Fazenda | upgrade de planta | **sementes** → os 10 encantes |
Pesca | vara | **corais** → skins, livros, limites |
Spawners | preço do spawner | **dracmas** → 3 trilhas de upgrade + livros |
Cacto | compra de cacto | **reinvestimento** → tirar do armazém e plantar |

### O triplo portão do spawner

Comprar o spawner N exige três coisas de naturezas diferentes:

| Portão | Natureza | O que impede |
|---|---|---|
Rank N | permissão | pular a escada |
Coins do tier N | exponencial | comprar antes de ter renda para sustentar |
**Dracmas** | **linear no tempo de kill** | **comprar todos os 20 de uma vez** |

O terceiro é o mais importante: dracmas não escalam com riqueza. Um jogador que ganhou muito coins — vendendo cabeças, apostando, comprando no site — **não converte isso em spawners**, porque falta tempo de kill.

**Calibração:** custo em dracmas do spawner N ≈ **0,8–1,2 dia de kill de uma conta AFK no tier N−1**. Plano ou quase plano; **nunca geométrico**, senão vira um segundo exponencial em cima do primeiro.

---

## 4. Modelo de 3 contas

Padrão real: conta A AFK (pesca + torre de cacto), conta B AFK (farm + autoclick nos spawners), conta C ativa (mina, fazenda, PvP, eventos).

O **captcha não afeta o ganho AFK** — ele existe só no ato de comprar, para impedir macro, e quem compra é a conta principal. AFK segue com 24h efetivas.

| Conta | Tempo | Peso/h | Unidades/dia | % da casa |
|---|---|---|---|---|
AFK 1 (pesca + cacto) | 24h | 1× | 24u | 22% |
AFK 2 (farm + cabeças) | 24h | 1× | 24u | 22% |
**Ativa** | 3h | **20×** | 60u | **56%** |
| | | | **108u** | 100% |

```
renda(N)                = 10.000 × 8^(N-1)
1u                      = renda(N) / 108
AFK por hora, por conta = renda(N) / 108
Ativo por hora          = renda(N) / 5,4
Passivo por hora        = renda(N) / 24    (roda 24h, só a partir do T7)
```

Sanidade nas duas pontas: no dia 1 (T1) o ativo rende ~1.850 coins/h (≈0,5 bloco/s a 1 coin/bloco) e o AFK ~93/h. No dia 20 (T20) o ativo rende 2,67×10²⁰/h e o AFK 1,33×10¹⁹/h.

---

## 5. As vias e seus tetos de throughput

Seis vias, todas pareadas. Os tetos abaixo foram calculados dos configs e **precisam ser confirmados no teste V5** — nenhum deles é para mexer antes de medir.

| Via | Teto teórico | Governado por | Moeda secundária |
|---|---|---|---|
**Mineração** | 1,6×10⁷ blocos/h | região da mina (135.700 blocos) ÷ `reset-cooldown: 30` | gemas |
**Farm** | 4,1×10⁶ colheitas/h | 22.735 posições ÷ `regrow-delay-seconds: 20` | sementes |
**Pesca** | ~504 fisgadas/h | `fishing-base-interval-seconds: 15` − speed 5, × `double` 40% | corais |
**Spawners** | **sem teto físico** | `s.limite` × `mob-stack` ÷ `delay` | dracmas |
**Máquinas** | por limite | `m.limite` × produção da banda | — |
**Cacto** | espaço do plot | limite do armazém + velocidade do autosell | — |

São **4,5 ordens de magnitude** de diferença entre mineração e pesca. A equivalência vem de valores por evento que diferem na direção oposta.

**A pesca é o caso especial:** a pilha de multiplicadores dela não alcança coins (`armors/*/tier-v.yml` da pesca dá `corais` + `xp`, sem chave `coins`). Então na pesca **o equipamento compra ACESSO, não multiplicador** — 20 recompensas de coins em `rewards.yml`, cada uma com `required-level: N` e `weight` calibrado para exigir a skin ⌈N/2⌉. Valor no campo `currency:` (string), **nunca em `amount:`** (int cru).

**O passivo não começa no dia 1.** Nos primeiros tiers o jogador não tem capital para spawner e a conta daria valor de drop sub-inteiro. Passivo realmente começa no **T7**, e por isso o alvo dele é `renda(N)/24` por hora (roda 24h) em vez de `/3`. Quem investe no T7 empata no T10 e termina levemente à frente — justo, porque roda 24h contra 3h.

---

## 6. Orçamento de multiplicadores — teto de 100×

O número que trava tudo. Percentuais **somam entre si**; multiplicadores nomeados **multiplicam**.

```
valor = base × enchant × (1 + Σpercent/100) × frenzy × booster × (1 + vip/100)
```

⚠️ Isso é inferência da forma dos configs + um comentário em `GarnixFishing/skins.yml` ("% **somado** aos corais"). **O teste V3 confirma.** Se for multiplicativo, este orçamento inteiro é recalculado.

### Via de mineração (referência)

| Fonte | Máximo | Tipo |
|---|---|---|
Armadura T-V (4 peças × 12%) | +48% | somado |
Skin de topo | +65% | somado |
Bônus de rank 20 | +20% | somado |
Bônus VIP garnix | +15% | somado |
| **subtotal percentual** | **+148% → 2,48×** | |
`fortunate` nível 100 | **7,98×** | multiplicativo |
Frenzy (uptime real, não 2,0 nominal) | 1,5× | multiplicativo |
**Booster 3×** | **3,0×** | multiplicativo |
| **TOTAL** | **≈100×** | ✅ exatamente no teto |

### Via passiva

| Fonte | Máximo | Tipo |
|---|---|---|
Rank 20 + VIP garnix | +35% → 1,35× | somado |
`pilhagem` 3 (livro) | 2,0× | multiplicativo |
Booster de drops 3× | 3,0× | multiplicativo |
| **TOTAL de valor** | **≈8,1×** | ✅ |

`massacre` e `ceifador` são **throughput**, não valor — entram no cálculo de cabeças/h.

### Por que o teto é 100× e não 1.000×

A restrição vem **de baixo**, não de cima. Se a pilha valesse 1.000×, o bloco do T1 teria que valer 0,001 coin — arredonda para zero e a primeira hora de jogo não paga nada. Com teto 100×, T1 = **1 coin exato**, que é o que o arquivo já diz.

### Correções que fecham o orçamento

| Arquivo | Hoje | Alvo | Resultado |
|---|---|---|---|
`GarnixMining/enchants/fortunate.yml` `increase-multiplier` | **1.0** (→100×) | **0.07** | 7,98× |
`GarnixFarm/enchants/prosperity.yml` `increase-multiplier` | **0.02** (→3,03×) | **0.07** | 7,98× |
`GarnixMining/enchants/gemmed.yml` `increase-multiplier` | **1.0** (→100×) | **0.02** | 3,03× (mantém gemas linear) |
`GarnixFarm/enchants/fertility.yml` | 0.02 | manter | 3,03× |

O `0.07` — e não `0.13` — é o que abre espaço para o booster de 3× **e** para o +25% do prestígio 500. Com `0.08` o total ia a 110×: foi o simulador que pegou.

### Escalas de bônus

**VIP** (celestial é o **mais básico**; hierarquia real: celestial < imortal < supremo < garnix). Não acumulam — vale o maior.

| VIP | ganho | desconto | vagas de mina |
|---|---|---|---|
celestial (entrada) | +4% | −3% | 0 |
imortal | +7% | −6% | 0 |
supremo | +11% | −10% | +1 |
garnix (topo) | +15% | −15% | +2 |
investidor (parceria) | +15% | — | +3 |

**Rank** — só ganho, **nunca desconto**. Desconto é a proposta de valor exclusiva do VIP.

| Rank | ganho cumulativo |
|---|---|
1 → 20 | **+1% por rank → +20%** |

Linear e chato de propósito: previsível, sempre visível, nunca é a razão de alguém disparar ou travar. **Não tierar** — se crescesse geometricamente, dobraria o exponencial que já está no valor-base.

**Prestígio** — **+0,05% por prestígio**, somado. No prestígio 500 dá +25%. O que carrega a recompensa são os **marcos**, não cada volta.

**Onde isso mora tecnicamente:** `GarnixSpawners/ranks.yml` e `GarnixMachines/ranks.yml` já são tabelas indexadas por permissão. Ranks entram nelas com `permission: rankup.rank.<n>` e `discount: 0`. Sem código novo.

### Armadura e skins

**Armadura** — 5 tiers × 4 peças × 3 vias = 60 arquivos. Mesmo valor nas 4 peças do tier (lore idêntico, conta fácil de fazer de cabeça). Secundária ≈ ⅔ do primário.

| Tier | por peça | conjunto |
|---|---|---|
T-I | +2% | +8% |
T-II | +4% | +16% |
T-III | +6,5% | +26% |
T-IV | +9% | +36% |
T-V | **+12%** | **+48%** |

**Skins** — escada com corrente de forja (7 iguais → a próxima).

| Faixa | Bônus | Rota |
|---|---|---|
1 (default) | 0% | inicial |
2–6 | +3% → +25% | forjável + caixa |
7 (teto de forja) | +32% | fim da corrente forjável |
8–10 | +42% / +53% / **+65%** | caixa, e as 3 também **direto no site** |

**Armadura NUNCA é vendida no site** — só via caixa. Quem paga compra *chance*, não a peça.

⚠️ Farm tem **9** skins, mineração e pesca têm **10**. **Criar a 10ª de farm** (≈+40%) para as 3 vias ficarem simétricas acima do teto de forja.

---

## 7. Orçamento de sinks

Cada tier absorve **60–75%** da renda de um dia daquele tier.

| Sink | % da renda do tier |
|---|---|
Spawner N + 3 trilhas de upgrade (coins **e dracmas**) | **35%** |
Máquinas A–O + upgrades | **15%** |
Limites (s.limite, m.limite, armazém) | 10% |
Combustível comum | **8%** |
Consumíveis (bombas, drill, chaves, boosters) | 5% |
Rank N+1 (parte em coins — simbólica) | **2%** |
Sobra carregada pro dia seguinte | 25% |

Duas propriedades que tornam isso robusto:

1. **Não dá para travar ninguém.** Mesmo a 75% de absorção, a renda de amanhã é 8× a de hoje. Quem gastou demais recupera numa sessão. Não existe espiral.
2. **Não dá para entesourar.** Carregar 25% do tier N é **3% da renda do tier N+1** — quase invisível. É o argumento mais forte a favor dos 8×/dia uniformes: a 3×/dia, a poupança de ontem valeria 33% de hoje e entesourar seria a jogada ótima.

**O corolário importa mais que o preço: sink tem que ser GATEADO, não só caro.** Um sink precificado no tier N é 10% de um dia no N+1 e 1% no N+2 — de graça. Todo sink precisa de trava junto do preço: permissão de rank, `mine-level-unlock`, `require: {level, crops}`, `release:` do spawner, `required-level` da recompensa de pesca.

O coins-shop de 273 produtos é o exemplo do contrário — 208 deles custam `2500` fixo, então a loja de blocos inteira é grátis a partir do dia 4. Está tudo bem (é QoL), mas **não conta como sink**.

**Taxa de 10% é o único sink universal.** Vale em `send`, market, leilão, baú-loja, coinflip (do lucro) e — após a correção — duelos e bolão. Está num campo por moeda (`currencies/<id>.yml → send.tax.percentage`), então é um botão só para ajustar liquidez.

---

## 8. Orçamento de cash

| Fonte | Hoje | Alvo |
|---|---|---|
`DailyRewards/membro.yml` | `cash add 50` → 900/temporada | **20/dia** → 400 ✅ |
`vinculado.yml` (Discord) | 50 | **+8/dia**, permanente |
Dailies VIP | 100–500/dia | **40 (celestial) → 120 (garnix)** |
**21 eventos** | `cash add 5000–15000` | ⏸️ Fase 7. Cash só em subconjunto difícil, **10–40** |
Conquistas / marcos raros | não existe | 25–100, gate duro |
Máquina de Cash | não existe | **3–8/dia, limite de 1 por conta** |

**Totais de temporada:** free ~400 · free vinculado ~550 · free vinculado e ativo em eventos ~750–1.100 · garnix ~2.500 · whale (site) teto de exagero 500.000.

### Faixas do cash-shop

| Faixa | Preço | Alcance | Conteúdo |
|---|---|---|---|
A | 50–500 | free chega | consumíveis, 1 chave, cosmético, booster curto |
B | 500–3.000 | free dedicado chega em 1 item | caixa II, skin média, +1 limite |
C | 3.000–20.000 | pagante | booster 3× longo, combustível infinito, máquinas especiais |
D | 20.000–100.000 | whale | VIP, bundles de temporada |

**Âncora que vale manter:** o `pacote-lendario` a 500 cash do `cash-shop/example.yml` = exatamente uma temporada de grind free. É um preço deliberado e bom.

### Vínculo Discord

Primeira vinculação dá **Celestial por 3 dias**, 1× por conta de Discord, à prova de unlink/relink. Praticamente todo jogador ativo vai vincular, então **os dias 1–3 têm o servidor inteiro com o VIP de entrada ativo**.

Duas consequências no cálculo:

1. Dias 1–3 são T1–T3, onde a renda da casa vai de 10² a 10⁴. O bônus custa quase nada em coins absolutos (~10⁴ nos 3 dias) e vale muito em sensação. **É o melhor lugar possível para dar VIP de graça.**
2. **T1–T3 devem ser calibrados COM o bônus ligado**, não sem — senão os 3 primeiros dias vêm inflados e o dia 4 parece punição quando o VIP expira.

---

## 9. As cinco leis de projeto

### Lei 1 — Dois eixos independentes
Coins fazem os 20 tiers. Cabeças fazem rank e prestígio. Não se misturam. Ver §2.

### Lei 2 — Coins não pode ditar o servidor
Coins compram a entrada; a secundária compra a profundidade. Ver §3.

### Lei 3 — Nunca pode compensar ficar parado

O modo mais comum de uma economia de RankUP morrer: o jogador descobre que comprar 400 spawners de galinha rende mais que subir de tier. Isso é resolvido por **desigualdade matemática**, não por boa vontade.

| | Multiplicador máximo |
|---|---|
Empilhamento total de um spawner (`mob-stack 3` × `spawner-stack 512`) | **1.536×** |
Ganho de valor por tier | **8× por tier** |

Como `8³ = 512 < 1.536 < 4.096 = 8⁴`:

> **Empilhar um spawner ao máximo vale ~3,53 tiers. Estar 4 tiers atrás não é compensável por upgrade nenhum.**

Folga bem calibrada: investir em upgrade te deixa socar ~3,5 tiers acima do seu — recompensa real e sentida — mas nunca substitui progredir. `mob-stack` e `spawner-stack` passam a ser **números críticos**: qualquer mudança neles muda esse 3,53.

Somam-se a isso três travas:
- **Escassez de slot** — `s.limite` é linear e cobrado em dracmas. Cada slot deve conter o melhor spawner possível.
- **Portão de cabeças** — rank N+1 exige cabeça de mob N, e só o spawner N produz. Parado no tier 3 você não passa do rank 12, logo não compra spawner novo. **Ficar parado não é estratégia lenta, é beco sem saída.**
- **Bônus de rank e prestígio** — só existem subindo. Quem fica parado não perde nada hoje, mas para de ganhar coisa nova para sempre.

Vale igual para as máquinas A–O: cada uma vive na sua banda e é superada; a trilha de upgrade vale ~3 bandas.

**A armadilha que o simulador achou: o vale de substituição.**

Se os slots forem **escassos e fixos**, o jogador precisa **trocar** um spawner maxado do tier N por um **nu** do tier N+1 no mesmo slot. Isso deixa aquele slot **192× pior** (`empilhamento 1.536 ÷ ganho por tier 8`) até ser re-empilhado.

> **Consequência de projeto: o `spawnerslimite` PRECISA crescer durante a temporada.** O jogador tem que poder **adicionar** spawner, não trocar. Com slots fixos, subir de tier vira punição — e seria exatamente a estagnação que esta lei existe para evitar.

Isso não contradiz "slots são escassos": eles seguem escassos **em cada momento** (comprados com dracmas, que são tempo), mas o total precisa crescer ao longo dos 20 dias. Escassez de fluxo, não de estoque.

**Verificação:** o simulador roda, para cada tier N de 1 a 19, *"melhor renda ficando em N vs. renda subindo para N+1"*, e reporta o vale de substituição. Se em qualquer N a resposta for "ficar", a fase não fecha.

### Lei 4 — Número grande e frequente na tela

O jogador quer ver **quantias elevadas e evolução contínua**, mesmo quando o progresso real é pequeno. **Volume e frequência são requisitos de projeto.** Entre "poucos eventos grandes" e "muitos eventos frequentes", escolher muitos — a raridade fica na **cauda**, não no corpo.

| Sistema | Como entrega |
|---|---|
Coins | 8×/dia = o número **muda de casa quase todo dia** |
Chaves | ~5.000/dia no endgame, recheio em 88% das aberturas |
Bosses | **~250–300/dia**, empilhados em lotes de 20–30 |
Ranks | +1% × 20, mais prestígio infinito |
Prestígio | marcos em 10, 25, 50, 100, 250, 500 |
Armadura e skins | 20 trocas de peça por via + 10 degraus de skin |
Encantes | 100 níveis, compra em lote de +1/+10/+25/+50 já pronta |
Cacto | cresce por reinvestimento — a farm fica **visivelmente** maior a cada sessão |

O contraponto que impede inflação: **sensação e poder são eixos separados.** Os números crescem muito e sempre; o poder cresce devagar e com teto de 100×.

### Lei 5 — Nenhum item ativável sem rota e sem preço

Auditoria completa: **~212 itens ativáveis, 162 (76%) sem nenhuma rota**, e o repo inteiro tem **6 preços de item definidos**. Se um item não deve chegar ao jogador, ele **sai do config** — não fica como comando de admin. Item de admin sem preço é exatamente como economias de servidor vazam. Ver [10-ITENS.md](10-ITENS.md).

---

## 10. Escada de raridade — a régua única

| Nível | Itens |
|---|---|
**Mítico** | combustível infinito |
**Mítico −** | matadora hit-kill · vaga de visitante · livro `pilhagem` 3 · livro `massacre` 5 |
**Lendário** | máquinas especiais · booster 3× · as 3 skins mais raras · armadura T-V · **caixa II** |
**Épico** | livros de classe C/D · armadura T-III/T-IV · skin média · booster 2× |
**Raro** | chave de boss · livros de classe A/B · armadura T-I/T-II · item cacto · torre de cacto |
**Comum** | combustível comum · consumíveis · bombas · moedas secundárias |

---

## 11. Riscos técnicos conhecidos

| # | Risco | Mitigação |
|---|---|---|
**R1** | `Long.MAX` = 9,22×10¹⁸. Campos de spawner/máquina/crate/shop são **inteiros YAML crus**. SnakeYAML promove para BigInteger e `getLong()` **trunca mod 2⁶⁴ sem log nenhum** | **C1** (aprovado). Teto de 1×10¹⁸ em tudo que não passar por C1 |
**R2** | O formatter `SUFFIX` é **hardcoded** — não existe tabela de sufixos em nenhum YAML. Se para em quintilhão, 10²¹ quebra o render, que roda a cada tick | **V1** antes de qualquer coisa. Se falhar e C3 não sair, o teto desce um dia |
**R3** | `GarnixCore/messages.yml` só declara os tipos `string/int/double/...`. `int` trunca acima de 2,1×10⁹; `double` perde precisão acima de 9×10¹⁵ | **Nunca usar `coins add {player} <valor>` para payout escalado por tier.** Sempre `type: CURRENCY` + `currency-id` + `amount`. Comando fica só para chaves, XP, itens e cash |
**R4** | Cash, limites e cabeças seguem negociáveis (decisão do dono) | Taxa de 10% é o freio. Simulador mede concentração com 50 e 250 jogadores |
**R5** | `bet.max-amount: 1.0E63` é um double — no T20 o ULP é ~131.072, apostas são silenciosamente arredondadas | Bug de precisão, corrigir junto com C1 |
**R6** | `gems` vs `gemas` — os 20 spawners usam a chave `gems`, o ID é `gemas` | **V4**. Resolvido por projeto: upgrades passam a custar **dracmas** |
**R7** | Carga de infra: encantes de classe D/E + ~30.000 spawns de boss/dia em lotes | `enchant-animation-budget: 0 → 10.000`, `max-simultaneous` por encante, **C8** |
**R8** | Credenciais vivas no git: MySQL/MongoDB/Redis/ipinfo em `GarnixCore/config.yml`, token Hyren em `GarnixStoreActivation/config.yml` | Fora do escopo econômico, mas **rotacionar antes do lançamento** |

---

## 12. Bugs de config encontrados na auditoria

| Achado | Onde | Efeito |
|---|---|---|
`annihilation base-chance: 60` (irmãos usam 0,15–2,5) | `GarnixMining/enchants/annihilation.yml` | destrói a camada inteira 60% das vezes **no nível 1** |
`fortunate`/`gemmed` `increase-multiplier: 1.0` | `GarnixMining/enchants/` | 100× no cap, 33× mais forte que o equivalente do farm |
Platô de XP nos níveis 70–76 (1,2%/nível contra 12%) | `GarnixMining/levels.yml` | 6 níveis quase grátis no meio da escada |
`mob-stack` nível 2 e 3 **ambos com `value: 3`** | os 20 `GarnixSpawners/spawners/*.yml` | o nível 3 custa 4× e não dá nada |
`rank`/`order` dos spawners sem efeito econômico | idem | "Rank 20" custa e rende igual ao "Rank 1" |
`SLIME.yml` com `order: 12` e `rank: "[Rank 5]"` | idem | display divergente da ordem |
`clover` aponta `key-id: "fazenda"`, a crate é `farm.yml` | `GarnixFarm/enchants/clover.yml` | chave de farm pode não estar sendo entregue |
Lore do robô promete `×2.0` em raras, arquivo sem `boost-multiplier` | `GarnixCrates/robots.yml` | a lore mente para o jogador |
`givevaga` (config) vs `giveslot` (messages) | `GarnixMining` | nomes divergentes para o mesmo comando |
`crate givevirtualkey` (singular) vs `/crates` documentado | os 20 `GarnixRankUP/ranks/*.yml` | os 19 rankups podem falhar ao dar a chave |
Farm XP total = 7,98×10⁷ → **1,7 hora** para o nível 100 | `GarnixFarm/levels.yml` | mineração leva 40–50h. `base: 100 → 3000` |
Árvore de farm 162× mais barata que a de mineração | `GarnixFarm/enchants/` | 3,96×10⁶ sementes contra 6,42×10⁸ gemas |
OnTime: 15 marcos **pagando idêntico**, 15d e 30d inalcançáveis | `GarnixOnTime/rewards/` | 1h paga o mesmo que 30d. Reescalar para 1h→15d |
`machines/CASH.yml` com `shop: false` e drops copiados de WOOD | `GarnixMachines` | armadilha esperando um typo |
`discounts.yml` desalinhado das outras tabelas de VIP | `GarnixServerShops` | três escalas diferentes, uma invertida |
Lore dos 4 VIPs anuncia `−10%/+10%` | `GarnixVips/vips/` | não corresponde a nenhuma tabela |
`GarnixFishing`: `max-weight` de 22 a 130 **não desbloqueia nada** | `rewards.yml` só usa pesos 1/1/2/4/8 | 40+ de headroom sobrando |
`GarnixFragments`: 3 moedas com loja funcional e **zero faucet** | `fragments.yml` | a loja existe, a moeda não é gerada |
`crates/vip.yml`: item existe, crate existe, **rota zero** | `GarnixCrates` | resolvido: chave para todos os online a cada ativação de VIP |
`dracmas` totalmente morta | `GarnixCurrencies` | resolvido: secundária dos spawners |
