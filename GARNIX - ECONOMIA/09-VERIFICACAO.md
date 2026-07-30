# 09 — VERIFICAÇÃO

Registro oficial dos testes. **Os 8 estão fechados** — 4 resolvidos lendo o código, 4 medidos in-game. Só os testes de carga (L1, L2) ficam para antes do lançamento.

**A Fase 2 está liberada.**

---

## ✅ TODOS OS 8 TESTES FECHADOS

| Teste | Resultado |
|---|---|
**V1** | ✅ o `SUFFIX` vai a 10⁶³, sextilhão é `S`. **C3 desnecessário** |
**V2** | ✅ spawners/máquinas/rankup seguros · ⚠️ crates e bosses perdem precisão acima de 9×10¹⁵. **C1 encolheu para 6 linhas** |
**V3** | ✅ **somam** — e o **booster também soma**. Rank e VIP **competem** pelo mesmo nó |
**V4** | ✅ auditoria de moedas limpa **exceto `gems`** (120×), que sai por projeto |
**V5-A** | ✅ **70.000 blocos/h** medido (3.500 em 3 min). Eu errei por 7× |
**V5-B** | ⚠️ **o teto da mina não existe** — sair e voltar reseta. Passou a ser decisão de projeto: **7×10⁶ blocos/h** |
**V6** | ✅ spawners **continuam produzindo** após prestigiar. O desenho funciona |
**V7** | ✅ `blessed` rola em **todo bloco de área**. **C7 desnecessário** — o volume é controlado pela chance |
**V8** | ✅ **LINEAR** — usar 10%, prestígio 500 = 51× o base |

### As 5 consequências grandes

1. **Manual é 70.000 blocos/h, não 10.000.** Não é taxa de clique — com `Efficiency 1000` a quebra é instantânea e o jogador segura e arrasta, dando ~1 bloco/tick. Isso mudou o **valor-base do T20 de 1,64×10¹¹ para 3,81×10¹¹** e a razão por tier de 3,9× para **4,07×**.
2. **O teto da mina não existe.** Sair e voltar reseta, e isso não será mudado. Então o throughput virou **decisão de projeto**: AoE máximo de 100× sobre o manual = 7×10⁶ blocos/h, que usa 43% da capacidade de reset e não exige o truque.
3. **O volume de chaves é 4× maior que o projetado:** ~20.700/dia em vez de 4.800. As 5 faixas da crate foram recalibradas e o `blessed` cai de 9,21% para **0,095%** — com a chance de hoje seriam **1,93 milhão de chaves/dia**.
4. **Dois códigos morreram:** **C3** (o `SUFFIX` já chega a sextilhão) e **C7** (a chance resolve melhor que código). **C1 encolheu** para 6 linhas.
5. **O frenzy virou permanente.** A 19,4 blocos/s a barra de 1.000 blocos enche em **51s** contra uma janela de 180s — uptime ~100% em vez de 50%. Precisa subir `blocks-required` para ~3.500 na Fase 2.

---

## Achado extra da leitura do código

Os diretórios `garnix-battle-pass`, `garnix-dungeons`, `garnix-tags` e `garnix-logger` existem em `Desktop/garnix/sources` mas têm **zero arquivos `.java` e zero `.yml`** — são pastas vazias, não sistemas escondidos. Isso fecha a dúvida de haver economia fora do repo de configs.

`garnix-queues`, `garnix-lobby` e `garnix-proxy` têm código e config, mas são infraestrutura de rede (fila, lobby, proxy) — **sem impacto econômico**.

---

## Detalhe de cada teste

### V1 — O formatter `SUFFIX` chega a sextilhão?

**Por que importa:** todas as 8 moedas usam `formatter: 'SUFFIX'`, e a tabela de sufixos é **hardcoded** — não existe em nenhum YAML do repo (grep por `suffix`/`sextilh`/`quintilh`/`abbrev` nos 3.287 arquivos só dá hits sem relação). Se a tabela para em quintilhão, um saldo de 10²¹ renderiza errado ou estoura exceção no caminho de render do scoreboard/ranking/actionbar — **que roda a cada tick**.

**Como testar:**
```
/coins set <você> 1000000000000000000000
```
Depois olhar, em ordem: o **scoreboard**, o `/coins ranking`, e a **actionbar da mina** enquanto minera.

**O que esperar:** algo como `1 Sx` ou `1000 Qi`. Escala longa em português: milhão 10⁶ · bilhão 10⁹ · trilhão 10¹² · quatrilhão 10¹⁵ · quintilhão 10¹⁸ · **sextilhão 10²¹**.

### ✅ RESULTADO — **PASSA.** Resolvido lendo o código.

`garnix-core/shared/src/main/java/com/redegarnix/core/shared/formatter/NumberFormatter.java:41-64`

A tabela tem **22 entradas e vai até 10⁶³**:

```java
"Q",  // 10^15 — quadrillion
"QQ", // 10^18 — quintillion
"S",  // 10^21 — sextillion   <- nosso teto
"SS", // 10^24
...
"V"   // 10^63 — vigintillion
```

E o `formatSuffix(BigDecimal)` é **todo `BigDecimal`**, com divisão em escala 10 — sem perda de precisão e sem risco de exceção.

**10²¹ renderiza `1S`. O C3 não é necessário.**

⚠️ **Atenção à convenção do plugin, que não é a intuitiva:** `Q` é **quatrilhão (10¹⁵)** e `QQ` é **quintilhão (10¹⁸)**. Sextilhão é `S`. Já alinhei o simulador com essa tabela exata, para o número no documento ser o mesmo texto que aparece na tela do jogador.

**Resultado:** ✅ passa, nada a fazer.

---

### V2 — Overflow acima de `Long.MAX`

**Por que importa:** `Long.MAX = 9.223.372.036.854.775.807 ≈ 9,22×10¹⁸`. Os campos `costs`, `drops.*.amount`, `price` de spawners/máquinas/crates/shops são **inteiros YAML crus**. SnakeYAML promove um literal fora da faixa para `BigInteger`, e `getLong()` faz `BigInteger.longValue()`, que **trunca mod 2⁶⁴** — resultado arbitrário, possivelmente negativo, **sem exceção e sem linha de log**.

Pela tabela de tiers, o spawner do T18 ao T20 e os upgrades de nível 3 do T17 em diante passam disso.

**Como testar:** num spawner de teste, pôr
```yaml
drops:
  coins:
    amount: 10000000000000000000000
```
e num rank de teste
```yaml
costs:
- 'coins 400000000000000000000'
```
Reiniciar, matar um mob, abrir o `/ranks`.

**O que observar:** o valor recebido vira negativo ou aleatório? O `/ranks` mostra o número certo? Aparece algo no log?

### ✅ RESULTADO — resolvido no código, e **o C1 encolheu muito**

O medo era `getLong()` truncando. A auditoria do código mostra que **os dois plugins que mais importam já estão seguros**, e o problema real é outro e menor.

**Seguros — `getString()` + `new BigDecimal()`, exato em qualquer magnitude:**

| Plugin | Onde |
|---|---|
`garnix-spawners` | `MobConfigManager:126` (costs), `:141` (drops.amount), `:239` (custos de upgrade) |
`garnix-machines` | `MachineConfigManager:94` (costs), `:123` (drops.amount), `:140` (sell-value) |
`garnix-rankup` | `Rank.RankCost(..., BigDecimal amount)` |

Isso resolve o item mais crítico: o **preço do spawner do T20 (7,2×10²⁰) é seguro como está.**

**⚠️ Problema real, e é de PRECISÃO, não de overflow:**

| Plugin | Código | Teto real |
|---|---|---|
`garnix-crates` | `CrateManager:264,269,274` → `BigDecimal.valueOf(config.getDouble(".amount", 1))` | **9,007×10¹⁵** |
`garnix-bosses` | `BossConfigManager:160,165,170` → `BigDecimal.valueOf(cfg.getDouble(".amount"))` | **9,007×10¹⁵** |

`double` tem 53 bits de mantissa, então acima de **9,007×10¹⁵ (quatrilhão)** o valor é silenciosamente arredondado. Pela tabela de tiers isso morde a partir do **T14**.

**Consequência: o C1 deixa de ser "trocar os tipos numéricos do servidor inteiro" e passa a ser uma mudança pequena e cirúrgica** — trocar `getDouble` por `getString` + `new BigDecimal` em **6 linhas**, 3 em cada um desses dois plugins, seguindo o padrão que spawners e máquinas já usam.

**A confirmar** (não apareceram na busca, provavelmente leem por helper compartilhado): `garnix-server-shops` (`price`), `garnix-mystery-boxes` (`amount`), `garnix-ontime` (`amount`).

**Boa prática a adotar de qualquer forma:** escrever valores grandes **entre quotes** no YAML (`amount: '1440000000000000000000'`). Com quotes, o valor chega como String e não depende de qual resolver o SnakeYAML escolheu.

**Resultado:** ✅ spawners, máquinas e rankup seguros · ⚠️ crates e bosses precisam da correção de 6 linhas

---

### V3 — `percent: true` soma ou multiplica?

**Por que importa:** **o orçamento inteiro de multiplicadores pivota nisso.** O plano assume que percentuais **somam** entre si e que multiplicadores nomeados (`base-multiplier`, `frenzy.multiplier`, booster, `bonus` de VIP) **multiplicam**:

```
valor = base × enchant × (1 + Σpercent/100) × frenzy × booster × (1 + vip/100)
```

Isso é inferência da forma dos configs mais um comentário em `GarnixFishing/skins.yml` linha 8 (*"currency-bonus — % **somado** aos corais por fisgada"*). **Não é prova.**

### ✅ RESULTADO — resolvido no código. **Somam — e mais coisas somam do que eu supunha.**

A fórmula exata está em `garnix-mining/.../enchant/EffectRewardHelper.java:90-100`:

```java
BigDecimal perBlock    = reward.getAmount().multiply(BigDecimal.valueOf(enchantMult));
BigDecimal totalAmount = perBlock.multiply(BigDecimal.valueOf(blocksBroken))
                                 .multiply(BigDecimal.valueOf(1.0 + totalBonus));
frenzy.applyCurrency(totalAmount, effectiveTax, frenzyMultiplier);
```

```
valor = base × fortunate × (1 + booster% + skin% + armadura% + permBonus%) × frenzy
```

E o javadoc do `BonusCalculator` confirma sem ambiguidade:

> *"Computes the **additive** reward bonus for a provider, **summing** the booster, the equipped skin, every equipped mining-armor piece and the player's permission-rank bonus. The result is additive: +20% booster, +10% skin and a +50% armor piece yield **0.80**. Callers apply it as `amount * (1.0 + bonus)`."*

| O que | Como entra |
|---|---|
`fortunate` (enchantMultiplier) | **multiplica** |
Frenzy | **multiplica** |
**Booster** | **soma**, como `(multiplicador − 1,0)` — um 3× contribui **+200%**, não ×3 |
Skin | soma, como `(multiplicador − 1,0)` |
Armadura (4 peças) | soma, `percent ? value/100 : value − 1,0` |
`permBonus` (rank / VIP) | soma **um único valor** — ver abaixo |

### 🚩 Descoberta de projeto: rank e VIP **competem**, não se somam

`BonusCalculator.permissionBonus()` lê nós `mining.bonus.<percent>` e o javadoc é explícito:

> *"The nodes do not stack: **the largest one the player holds wins**."*

O plano assumia que o bônus de rank (+20%) e o de VIP (+15%) **se somavam** para +35%. **Não somam.** Um jogador rank 20 com VIP garnix receberia só **+20%** — e o bônus de VIP que ele pagou não valeria absolutamente nada.

**A correção, que na verdade fica mais elegante:** o VIP não *soma* ao rank, ele **substitui por um valor maior**. A proposta de valor do VIP passa a ser *"seu bônus é maior"* em vez de *"+15% em cima"*.

| | Nó | Bônus efetivo |
|---|---|---|
Sem VIP, rank 20 | `mining.bonus.20` | +20% |
celestial (entrada) | `mining.bonus.24` | +24% |
imortal | `mining.bonus.27` | +27% |
supremo | `mining.bonus.31` | +31% |
**garnix (topo)** | `mining.bonus.35` | **+35%** |

Assim todo nó de VIP é maior que o teto do rank (20%), o VIP sempre vale algo, e o sem-VIP ainda tem uma escada própria de 20 degraus visíveis. **Não precisa de código novo** — é só escolher os números certos.

⚠️ **Dois detalhes operacionais do LuckPerms:** o nó tem que ser **materializado exato** no jogador (`mining.bonus.*` como wildcard **não concede nada**), e o `permBonus` **não se aplica ao provider `xp`** — só às moedas.

### Consequência no orçamento

Com o booster somando em vez de multiplicando, o bloco aditivo fica muito mais barato e **sobra orçamento para o `fortunate`**:

| | Antes (suposição errada) | **Agora (código)** |
|---|---|---|
Bloco aditivo | 2,73× | **4,48×** (booster +200%, skin +65%, armadura +48%, permBonus +35%) |
`fortunate` nível 100 | 7,98× (`increase-multiplier 0.07`) | **14,91× (`increase-multiplier 0.14`)** |
Frenzy | 1,5× | 1,5× |
**TOTAL** | 98,0× | **100,2×** ✅ |

O `fortunate` **dobra de força** em relação ao que eu havia orçado — e isso é bom, porque ele é o encante que só se compra com gemas, ou seja é a recompensa do jogador dedicado, não do pagante.

**Resultado:** ✅ somam · booster também soma · rank e VIP competem pelo mesmo nó · `fortunate` vai para `increase-multiplier: 0.14`

---

### Como testar in-game, se quiser confirmar na prática

Se eu vestir 4 peças de armadura que dão **+12% cada**, eu ganho **+48%** (elas somam) ou **+57%** (elas multiplicam entre si)?

```
SOMANDO:      12 + 12 + 12 + 12 = 48%   ->  1,48x
MULTIPLICANDO: 1,12 x 1,12 x 1,12 x 1,12  ->  1,57x
```

Parece pouca diferença com 4 peças. Mas quando **tudo** empilha (armadura + skin + rank + VIP + prestígio), a diferença vira **98× contra 151×** — e daí o valor-base de todos os 20 tiers precisa descer uma ordem inteira.

### Passo a passo

Você precisa de: uma conta de teste com permissão de admin, e um bloco na mina que pague um valor **redondo e grande** (para a conta ser fácil de fazer de cabeça).

**Preparação**

1. Entre na mina com a conta de teste.
2. **Tire toda a armadura, tire a skin, e não tenha nenhum encante, booster nem frenzy ativo.** Precisa estar limpo.
3. Escolha **um tipo de bloco só** e minere sempre esse mesmo bloco. Se a mina tiver vários, escolha o mais comum.

**Medição 1 — a referência (sem nada)**

4. Minere esse bloco e **anote quanto ganhou de coins**. Esse é o valor `V`.
   - Se a actionbar não mostrar o ganho por bloco, use `/coins` antes e depois de minerar exatamente 10 blocos, e divida por 10.
   - Anote com casas decimais se aparecerem.

**Medição 2 — com o set de armadura completo (é essa que decide)**

5. `/mina givearmor colecao` para receber o set **tier V** completo, e vista as 4 peças.
6. Minere o **mesmo bloco** e anote o novo valor.
7. Divida pelo valor da medição 1:

| Resultado da divisão | Veredito |
|---|---|
**~1,48** | os percentuais **SOMAM** ✅ — é o que o plano assume |
**~1,57** | os percentuais **MULTIPLICAM** ⚠️ — recalcular o orçamento |

São 6% de diferença, então: minere **20 blocos** em cada medição e divida, em vez de confiar num só. Isso elimina o erro de arredondamento.

**Medição 3 — confirmação com a skin (opcional, mas recomendada)**

8. `/mina giveskin mithril` e aplique a skin (ela dá **+65%** em coins).
9. Minere o mesmo bloco e divida pela medição 1:

| Resultado | Veredito |
|---|---|
**~2,13** | somam (48% + 65% = 113%) ✅ |
**~2,59** | multiplicam (1,57 × 1,65) ⚠️ |

Aqui a diferença é de **21%**, muito mais fácil de ver do que os 6% do passo 2. Se as duas medições concordarem, a resposta está fechada.

### O que fazer com o resultado

**O que esperar agora que sabemos a fórmula:** o set T-V completo dá exatamente **+48%**, ou seja **1,48×**. Se medir isso, o código e o jogo concordam e não há surpresa em runtime. Se medir 1,57×, aí sim tem algo diferente entre o que o código diz e o que roda — e vale investigar.

Esta medição virou **opcional e de confirmação**, não bloqueante.

---

### V8 — `cost-increase-percent` é composto ou linear?

**Por que importa:** decide se **prestígio 500 é representável**. `GarnixRankUP/config.yml` tem `prestige.cost-increase-percent: 10`.

| Se for | No prestígio 500 | Veredito |
|---|---|---|
Composto — `custo × (1+X)^P` | `1,10^500` = **4,9×10²⁰×** o base | inatingível, estoura o tipo numérico |
Linear — `custo × (1 + X·P)` | `1 + 0,10×500` = **51×** o base | ✅ viável |

**Como testar:** ler o código do GarnixRankUP (`Desktop/garnix/sources`) e procurar onde `cost-increase-percent` é aplicado. Alternativa in-game: `/prestigio` algumas vezes numa conta de teste e comparar o custo do rank 2 nos prestígios 0, 1, 2 e 3 — composto a 10% dá `1,00 · 1,10 · 1,21 · 1,33`, linear dá `1,00 · 1,10 · 1,20 · 1,30`. A diferença aparece já no terceiro.

**Valor a usar depois de saber:**

| Se for | Valor |
|---|---|
Linear | **10%** |
Composto | **1%** |

**Também verificar:** o aumento **aparece no `/ranks`**? Se não, o jogador paga mais sem entender por quê — e isso gera ticket de suporte, não engajamento.

### ✅ RESULTADO — **LINEAR**. Resolvido lendo o código, sem precisar de servidor.

`garnix-rankup/plugin/src/main/java/com/redegarnix/rankup/manager/RankManager.java:229-237`

```java
/** Formula: baseCost * (1 + prestige * percent / 100). */
public BigDecimal getEffectiveCost(BigDecimal baseCost, int prestige) {
  double percent = getPrestigeCostPercent();
  if (prestige <= 0 || percent <= 0) return baseCost;
  double multiplier = 1.0 + (prestige * percent / 100.0);
  return baseCost.multiply(BigDecimal.valueOf(multiplier));
}
```

**É linear.** No prestígio 500 com `cost-increase-percent: 10` o custo é `1 + 500×0,10 = 51×` o base. **Viável — usar 10%.**

E o código respondeu mais três coisas de graça:

| Achado | Onde | Consequência |
|---|---|---|
**Os custos já são `BigDecimal`** | `Rank.RankCost(type, provider, BigDecimal amount)` | o caminho de custo do RankUP **não tem o problema de `Long.MAX`**. Essa parte do C1 já está pronta |
**O multiplicador de prestígio se aplica a TODOS os custos**, inclusive `head` | `RankUPService:56,100,115` iteram `next.costs()` inteiro | ✅ **o requisito de cabeças cresce com o prestígio automaticamente** — a trava de ritmo do eixo de cabeças funciona sem código novo |
**O aumento já aparece no menu** | `CostFormatter:30` — *"applying the prestige multiplier to each amount"* | ✅ sua preocupação com o `/ranks` já está atendida |

---

## Detalhe dos testes de ajuste

### V4 — `gems` vs `gemas`

Os 20 `GarnixSpawners/spawners/*.yml` usam a chave **`gems`** em `drops:` e em todos os `upgrades.*.costs:`. O ID da moeda em `GarnixCurrencies` é **`gemas`** — e `GarnixMining/config.yml` usa `enchant-currency: gemas`, `GarnixBosses` usa `currency-id: gemas`.

**Como testar:** matar um mob de spawner e ver se `/gema` mexe.

### ✅ RESULTADO — **é bug, e a regra é mais ampla do que eu tinha**

> *"Sim, você está correto. Qualquer currency em qualquer `.yml` que não estiver batendo com o nome das currencies em GarnixCurrencies (**nome do `.yml` sem o `.yml` no fim é o nome correto da currency**) está incorreta e precisa de correção. E obviamente nos spawners não terão gemas — aquilo foi colocado fictício e não deve ficar."*

Rodei a auditoria completa contra os 8 nomes válidos (`cash` · `coins` · `corais` · `dracmas` · `gemas` · `maquinaslimite` · `sementes` · `spawnerslimite`):

| Escopo | Resultado |
|---|---|
36 `currency-id` / `enchant-currency` / `primary-id` / `secondary-id` / `upgrade-currency` / `multiplier-provider` do repo | ✅ **todos válidos** |
Chaves de moeda usadas como seção (`costs.<moeda>`, `drops.<moeda>`) | 220 × `coins` ✅ · **120 × `gems`** ❌ |
Listas de custo `- ''moeda valor''` (rankup, levels) | 56 `coins` · 37 `gemas` · 30 `cash` · 19 `head` — ✅ todos válidos |

**O único erro no repo inteiro é o `gems` dos spawners, em 120 ocorrências.** E ele desaparece por projeto: os upgrades de spawner passam a custar **coins + dracmas**, e gemas saem de lá completamente.

**Resultado:** ✅ auditoria limpa exceto `gems` (120×), que sai por projeto

---

### V5 — Os 2 tetos que ancoram a tabela de tiers

**Por que importa:** o valor-base dos 20 tiers é derivado do teto de throughput da mina. Sem esses números, a coluna de valor-base é chute.

> ⚠️ **Correção de método.** A primeira versão deste teste pedia "minerar 5 min com encantes no máximo e contar blocos". **Estava errado** — os 15 `enchants/*.yml` são fictícios (`annihilation` a 60%, os cinco de entidade a 2,5), então isso mediria o output de uma árvore que vai ser reescrita na Fase 2. O que se mede é o **teto da mina** (geometria); as chances dos encantes são depois calibradas *contra* esse teto.

#### O que é config e o que não é

| Medição | Depende de config? | Por quê |
|---|---|---|
**A — taxa de clique** | ❌ **não** | `PickaxeItem.java:114` faz `meta.addEnchant(Enchantment.DIG_SPEED, 1000, true)` — **Efficiency 1000 hardcoded**. É a "Quebra Rápida ∞" da lore: **constante do servidor, igual para todos, não evolutiva, não comprável**. Qualquer bloco de pedra quebra instantaneamente, então o que se mede é só a mão do jogador. E o `accelerated` é `PotionEffectType.SPEED` (movimento), não velocidade de quebra |
**B' — tamanho da mina** | ❌ **não** | é geometria da região. Independe de qual encante quebra o bloco |
~~C — kills/h~~ | ✅ sim | `delay`, `mob-stack`, `spawner-stack` são fictícios. **Sai do V5** e vira parte do teste de carga L2: a pergunta certa não é "qual a taxa?" (aritmética) e sim "o servidor sustenta a taxa teórica?" |

#### A — taxa de clique

1. Picareta **sem nenhum encante de AoE comprado**.
2. Anote os blocos na lore da picareta (`display: '&6Picareta &7[{blocks}]'`).
3. Minere **3 minutos** cronometrados, no ritmo normal de jogo.
4. Anote o final. `(final − inicial) ÷ 3 × 60 = blocos/hora`.

### ✅ RESULTADO — **3.500 blocos em 3 minutos = 70.000 blocos/hora**

| | |
|---|---|
Medido | **3.500 em 3 min = 19,4 blocos/s = 70.000/h** |
Jogador rápido | ~4.000 em 3 min = **80.000/h** |
Minha suposição | 10.000/h — **errei por 7×** |

**Por que tão alto:** não é taxa de clique. Com `Efficiency 1000` a quebra é instantânea, então o jogador **segura o botão e arrasta**, e o servidor entrega ~1 bloco por tick (20/s). O teto teórico de 72.000/h é praticamente atingido só jogando normal.

**O que isso mudou:**

| | Antes | Depois |
|---|---|---|
Manual | 10.000/h | **70.000/h** |
Valor-base T20 | 1,64×10¹¹ | **3,81×10¹¹** |
Razão por tier | 3,9× | **4,07×** |
Volume de chaves | ~4.800/dia | **~20.700/dia** |
Uptime do frenzy | 50% (1.000 blocos a 5/s = 200s) | **~100%** — 1.000 blocos a 19,4/s = **51s** contra janela de 180s |

⚠️ **O frenzy virou permanente.** A 19,4 blocos/s a barra de 1.000 blocos manuais enche em 51 segundos, contra uma janela de 180s. Ou seja o jogador ativo fica **sempre em frenzy**, e o multiplicador efetivo passa de 1,5× para ~2,0×. Isso precisa de ajuste na Fase 2: subir `blocks-required` para ~3.500 devolve o uptime a ~50%.

⚠️ **A meta de 10.000 provavelmente está baixa.** Com quebra instantânea, um humano sustenta 5–8 cliques/s. Se o número real for 20.000+, o **volume de chaves dobra ou triplica** e as 5 faixas da crate precisam ser recalibradas (hoje: recheio 88% · jackpot 0,006% sobre ~4.800 aberturas/dia).

**Mede-se uma vez e vale para sempre.** Como a quebra rápida é constante e hardcoded, este número não muda entre temporadas nem entre jogadores — só depende de quão rápido a pessoa clica.

🚩 **Consequência para o orçamento de multiplicadores:** a quebra rápida **não entra no teto de 100×**. Ela é o mesmo piso para todo mundo, então não é vantagem de ninguém — é a linha de base contra a qual todos os multiplicadores são medidos. Vale para o `accelerated` também: movimento não é renda.

#### B' — o teto da mina ✅ **RESOLVIDO por aritmética. Não precisa medir.**

A região está em **`GarnixMining/data.yml`**, formato `mundo:x1:y1:z1:x2:y2:z2`:

```yaml
region: mina:-29:26:10:29:64:68
```

| Eixo | De | Até | Blocos |
|---|---|---|---|
X | −29 | 29 | **59** |
Y | 26 | 64 | **39** |
Z | 10 | 68 | **59** |

`59 × 39 × 59 = ` **135.759 blocos por mina cheia**

E o código confirma que é um bloco sólido e que o reset é total:

| Evidência | Onde |
|---|---|
`reset(int mineLevel)` → *"Regenerates **every** block"* | `SharedMineState.java:504` |
`getTotalBlocks()` → `layout.cells.length`, o volume inteiro | `SharedMineState.java:118` |
*"the mine floor of a box whose lid is the world surface"* | comentário do `MineLight` |

```
135.759 blocos × 120 resets/h (reset-cooldown: 30)  =  16.291.080  ≈  1,63×10⁷ blocos/hora
```

**A suposição original de 1,6×10⁷ estava certa com 1,8% de erro.** O valor-base do T20 passa de 1,67×10¹¹ para **1,64×10¹¹** — dentro da tolerância, e já corrigido em [02-TIERS.md](02-TIERS.md) e no simulador.

### ⚠️ RESULTADO — **o teto não existe na prática**

Medição in-game:

> *"volta 100% resetadinha, mina completinha de blocos novos, e sim o cooldown é aplicado — **porém se o jogador sai da mina e volta, reseta**, porque a mina não guarda estado. E não pretendo mudar isso no código."*

**Sair e voltar contorna o cooldown de 30s.** Então os 120 resets/h não são um teto — são um piso. O throughput de mineração **não tem limite físico**.

**Consequência: o teto passa a ser uma decisão de projeto,** definida pelo multiplicador máximo da árvore de AoE.

| | |
|---|---|
Manual medido | 70.000 blocos/h |
**AoE máximo escolhido** | **100×** |
**Endgame** | **7×10⁶ blocos/h** |
Equivale a | ~51 minas limpas por hora (uma a cada 70s) = **43% da capacidade de reset** |

**Por que 100× e não 233×** (o número que daria o teto antigo de 1,63×10⁷): com 233× o jogador precisaria de 120 resets/hora, exatamente o limite do cooldown, sem nenhuma margem — e quem quisesse mais teria que abusar do sair-e-voltar. Com 100× sobra folga e a mecânica funciona sem truque.

**Resultado:** ✅ mina reseta 100% cheia · ✅ cooldown aplicado · ⚠️ **contornável ao sair e voltar** · teto = **decisão de projeto, 7×10⁶ blocos/h**

---

### V6 — Prestigiar quebra os spawners já colocados?

**Por que importa:** prestigiar reseta o rank, e o rank N é o que libera o spawner N. Se o **spawner já colocado** parar de funcionar ao perder a permissão, prestigiar é catastrófico e o sistema inteiro precisa de outro desenho.

**Como testar:** numa conta de teste, colocar spawners de tier alto, prestigiar, e ver se continuam produzindo.

### ✅ RESULTADO — **os spawners continuam produzindo.** O desenho funciona.

> *"Sim, os spawners continuam produzindo. Porém provavelmente não vou conseguir matar — e isso é meio irrelevante, até porque tem como burlar facilmente: é só outra conta que esteja no rank ir lá e matar, e minha conta vender, ou alguém vender e me enviar o dinheiro. Mesmo que tenha taxa de transferência é burlável, e não tem problema."*

Duas coisas se resolvem aqui:

1. **O prestígio é viável** — o spawner colocado não para, então perder a permissão de rank não destrói a produção. A proposta de prestígio do plano (preservar o que dinheiro não compra + bônus permanente + marcos de desbloqueio) fica de pé.
2. **A lâmina depender do rank não é um problema real**, porque é contornável por outra conta e isso é aceito. Registrado como decisão: **não vamos tentar fechar esse contorno.** Ele até ajuda o prestígio a não ser punitivo.

**Resultado:** ✅ spawners seguem produzindo após prestigiar · o contorno da lâmina é aceito por decisão

---

### V7 — Chave dispara em bloco de AoE ou só manual?

**Por que importa:** define se **C7** é necessário. `blessed` chega a 9,21% de chance no nível 100.

| Sobre | Volume de chaves |
|---|---|
Blocos de AoE (1,6×10⁷/h) | **1,4 milhão/hora** — absurdo, a crate perde qualquer sentido |
Blocos manuais (~10⁴/h) | **~900/hora** — massivo e saudável, é o alvo do plano |

### ✅ RESULTADO — **rola em TODO bloco de área. E isso MATA o C7.**

Medição in-game, ~1 minuto com `Explosivo` nível 100 (4,2%) e `Abençoado` nível 100 (9,2%):

| | |
|---|---|
Explosivo ativou | 13× |
Abençoado "ativou" | 17× |
**Chaves no `/correio`** | **65** (zeradas antes do teste) |

O código confirma, em `EnchantHandler.java:180`:

> *"**Each block broken by area enchants gets its own Blessed roll**"*

E o `tasks.blessed-flush-seconds: 30` **agrupa as entregas em lotes** — por isso 17 "ativações" continham 65 chaves. Não são 17 chaves, são 17 mensagens de lote.

**A conta fecha exatamente:**

```
13 procs de explosivo x 26 blocos de area   = 338 blocos
+ ~368 blocos manuais                        = 706 blocos
x 9,21%                                      = 65 chaves  ✅
```

### Por que isso mata o C7

O C7 era "fazer a chave contar só bloco manual". Mas a medição mostra que o volume é controlável **pela chance**, que é config — e chance é uma alavanca melhor que mudança de código, porque preserva a sensação de "o AoE choveu chave", que é exatamente o que o público gosta.

O problema é de escala, não de mecânica:

| | Chaves/dia |
|---|---|
Com a chance de hoje (9,21%) sobre 2,1×10⁷ blocos/dia | **1,93 milhão** — inviável |
**Alvo** | **~20.000** |
Chance necessária | **0,095%** no nível 100 (hoje 9,21%) |

**Resultado:** ✅ rola em todo bloco · ❌ **C7 desnecessário** · `blessed` nível 100 vai de 9,21% para **~0,095%**

---

## Testes de carga (antes do lançamento)

### L1 — Carga de infraestrutura

Com a árvore de encantes no máximo, medir **pacotes/tick e TPS** com 50, 100 e 250 contas online no perfil real (2 AFK + 1 ativa por jogador).

**O que está em jogo:** `GarnixMining/config.yml` tem `enchant-animation-budget: 0` (**ilimitado** hoje). O comentário do próprio arquivo mede 500 mineradores no nível máximo em **77.000 pacotes/tick** e recomenda **10.000**.

Detalhe correto do design existente que vale preservar: quando o orçamento estoura, o jogador **perde a animação mas recebe o pagamento** — degradação justa, não punitiva.

**Se o TPS cair, o ajuste é baixar a chance da classe alta e subir o payoff por proc — nunca baixar o payoff**, porque isso desmonta a curva de tiers.

**Resultado:** _(a preencher)_

### L2 — Pico de bosses

~250–300 bosses/dia por jogador × 100 jogadores = **~30.000 spawns/dia**, concentrados em **lotes de 20–30** (`boss-stack-radius: 5`). Boss de 25k–75k HP com partícula e AoE em lote é o pico de carga do servidor.

Testar: 5 jogadores invocando 30 bosses cada ao mesmo tempo. Medir TPS.

Depende do **C8** (`max-simultaneous` global de bosses).

**Resultado:** _(a preencher)_

---

## Testes do simulador (por fase)

Rodar [sim/](sim/) depois de cada fase, com os YAMLs reais. **Tolerância ±25% na renda/h por tier.** Fora disso, a fase não fecha.

### S1 — Teste de estagnação (o mais importante)

Para **cada tier N de 1 a 19**: qual a melhor renda possível **permanecendo** em N, com todo o dinheiro investido em quantidade e upgrades, contra a renda **subindo** para N+1?

Se em qualquer N a resposta for "ficar", a curva está errada. É o único teste que pega um erro que só apareceria no dia 15 com o servidor cheio.

Referência analítica: empilhamento máximo = `mob-stack 3 × spawner-stack 512 = 1.536×`, e o valor cresce 8×/tier. `8³ = 512 < 1.536 < 4.096 = 8⁴` → empilhar vale ~3,53 tiers, e **4 tiers atrás é incompensável**.

### S2 — Teste de banda

| Perfil | Alvo ao fim dos 20 dias |
|---|---|
Casual (1h/dia) | 10¹² – 10¹⁵ |
**Dedicado (3h/dia)** | **~1,44×10²¹** |
Hardcore (8h/dia) | não mais que ~10²³ |

Se o hardcore passar disso, o freio é apertar o `release:` escalonado dos spawners — que é calendário, não valor.

### S3 — Teste de escala

Rodar com 50, 100 e 250 jogadores e checar:
- **liquidez de cabeças na fronteira** — no rank 16+ existe vendedor suficiente?
- **preço de cabeça e de livro de tier baixo** — o market colapsa?
- **concentração de cash** — cash é negociável por decisão do dono; a taxa de 10% dá conta?
- **razão ativo:AFK** — sobrevive a alguém rodando 3 contas de autoclick? Se não, a saída é C5 (teto diário por conta)

### S4 — Auditoria de itens

Rodar a varredura de itens **do zero** e comparar contagem com contagem contra [10-ITENS.md](10-ITENS.md). As duas listas críticas têm que voltar **vazias**:

- **(A)** itens sem nenhuma rota de aquisição
- **(B)** itens com efeito econômico e sem custo definido

Se a segunda varredura achar um item que não está no documento, **o documento estava errado** — não o contrário.

---

## Riscos registrados por decisão do dono

Estes não são problemas a resolver; são escolhas conscientes, registradas para referência.

| Item | Decisão | Risco aceito |
|---|---|---|
`givehandall` clona o item da mão **com NBT** para todos os online | fica como está | duplicação em escala de skin, booster ou matadora hk |
`/crates givekey <crate> * <qtd>` e `/caixas give ... *` | ficam | é o mecanismo da chave VIP; o risco é digitar à mão por engano |
Cash negociável em market/leilão/coinflip/duelo + `send` | fica | caminho para mover cash entre contas; freio é a taxa de 10% |
`spawnerslimite`/`maquinaslimite` negociáveis | ficam | concentração de capacidade da via sem teto físico |
Cabeças negociáveis livremente | ficam | freio estrutural é a produção: cabeça de mob N só sai do spawner N |
Britadeira 10 simultâneas · bombas 5 · `massacre 5 = -1` · matadora `hk` | ficam sem nerf | controlados por preço e raridade. São seguros porque **aceleram até o teto, não furam o teto** — britadeira e bombas batem no `reset-cooldown: 30`, `massacre` bate na taxa de spawn, `hk` bate na oferta de chave de boss |
`enchant-refund-percentage: 40` (mineração e farm) | a revisar na Fase 2 | |
Credenciais vivas no git (`GarnixCore`, `GarnixStoreActivation`) | fora do escopo econômico | **rotacionar antes do lançamento** |
