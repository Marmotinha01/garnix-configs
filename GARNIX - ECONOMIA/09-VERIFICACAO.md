# 09 — VERIFICAÇÃO

Protocolo de testes in-game. **Nenhum `.yml` de plugin é editado antes de V1, V2, V3 e V8 estarem respondidos** — cada um deles pode mover o teto da temporada ou invalidar o orçamento de multiplicadores.

Preencha a coluna **Resultado** conforme for testando. Este arquivo é o registro oficial.

---

## Fase 0 — Testes que podem mover o teto

### V1 — O formatter `SUFFIX` chega a sextilhão?

**Por que importa:** todas as 8 moedas usam `formatter: 'SUFFIX'`, e a tabela de sufixos é **hardcoded** — não existe em nenhum YAML do repo (grep por `suffix`/`sextilh`/`quintilh`/`abbrev` nos 3.287 arquivos só dá hits sem relação). Se a tabela para em quintilhão, um saldo de 10²¹ renderiza errado ou estoura exceção no caminho de render do scoreboard/ranking/actionbar — **que roda a cada tick**.

**Como testar:**
```
/coins set <você> 1000000000000000000000
```
Depois olhar, em ordem: o **scoreboard**, o `/coins ranking`, e a **actionbar da mina** enquanto minera.

**O que esperar:** algo como `1 Sx` ou `1000 Qi`. Escala longa em português: milhão 10⁶ · bilhão 10⁹ · trilhão 10¹² · quatrilhão 10¹⁵ · quintilhão 10¹⁸ · **sextilhão 10²¹**.

| | |
|---|---|
**Se renderizar certo** | ✅ segue o plano como está |
**Se parar em Q/Qi** | o teto desce para ~10¹⁸ e a tabela de tiers recua ~1 tier, **ou** aprovamos o **C3** (tabela de sufixos configurável) |
**Se der exceção** | C3 vira obrigatório antes de qualquer coisa |

**Resultado:** _(a preencher)_

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

| | |
|---|---|
**Se truncar** | confirma que **C1** é obrigatório (já aprovado). Nada acima de 10¹⁸ pode ser escrito antes de C1 estar no ar |
**Se funcionar** | ótimo — mas confirmar **também** o caminho de `costs:` do RankUP, que é string parseada à mão e pode usar `Long.parseLong` |

**Resultado:** _(a preencher)_

---

### V3 — `percent: true` soma ou multiplica?

**Por que importa:** **o orçamento inteiro de multiplicadores pivota nisso.** O plano assume que percentuais **somam** entre si e que multiplicadores nomeados (`base-multiplier`, `frenzy.multiplier`, booster, `bonus` de VIP) **multiplicam**:

```
valor = base × enchant × (1 + Σpercent/100) × frenzy × booster × (1 + vip/100)
```

Isso é inferência da forma dos configs mais um comentário em `GarnixFishing/skins.yml` linha 8 (*"currency-bonus — % **somado** aos corais por fisgada"*). **Não é prova.**

**Como testar** — três leituras da actionbar, mesmo bloco, mesma mina:

| Passo | Equipar | Leitura esperada se **somar** | Se **multiplicar** |
|---|---|---|---|
1 | nada (referência) | `V` | `V` |
2 | set T-V completo (4 peças × 12%) | `V × 1,48` | `V × 1,12⁴ = V × 1,57` |
3 | + skin Mithril (+65%) | `V × 2,13` | `V × 1,57 × 1,65 = V × 2,59` |
4 | + `fortunate` nível 1 | multiplica por ~1,05 nos dois casos | idem |

O passo 2 já separa os dois casos: **1,48 contra 1,57**. Uma diferença de 6% — então vale usar um bloco de valor alto e conferir com calma, ou repetir a leitura.

| | |
|---|---|
**Se somar** | ✅ orçamento de 100× vale como está |
**Se multiplicar** | recalcular o orçamento inteiro. A pilha fica ~1.039× em vez de ~100×, e o valor-base de todos os 20 tiers desce ~1 ordem |

**Resultado:** _(a preencher)_

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

**Resultado:** _(a preencher)_

---

## Fase 0 — Testes que ajustam números sem mover o teto

### V4 — `gems` vs `gemas`

Os 20 `GarnixSpawners/spawners/*.yml` usam a chave **`gems`** em `drops:` e em todos os `upgrades.*.costs:`. O ID da moeda em `GarnixCurrencies` é **`gemas`** — e `GarnixMining/config.yml` usa `enchant-currency: gemas`, `GarnixBosses` usa `currency-id: gemas`.

**Como testar:** matar um mob de spawner e ver se `/gema` mexe.

**Resultado esperado:** provavelmente **não mexe**, e todo drop e todo custo de upgrade em gema dos spawners está falhando em silêncio hoje.

**Resolvido por projeto:** os upgrades de spawner passam a custar **dracmas**, não gemas. Então este teste é informativo, não bloqueante — mas vale saber se é bug ou alias.

**Resultado:** _(a preencher)_

---

### V5 — Cronometrar os 4 tetos de throughput

**Por que importa:** são os quatro números que a equivalência entre vias depende. Os valores abaixo saíram do cálculo dos configs e **nenhum deve ser alterado antes de medir**.

| Via | Teto calculado | Como cheguei | Como medir |
|---|---|---|---|
Mineração | **1,6×10⁷ blocos/h** | região `mina:-29:26:10:29:64:68` = 59×39×59 ≈ 135.700 blocos ÷ `reset-cooldown: 30` | minerar 5 min com encantes no máximo e contar blocos; e cronometrar quantos resets/h a mina aguenta |
Farm | **4,1×10⁶ colheitas/h** | 22.735 posições no `data.yml` ÷ `regrow-delay-seconds: 20` | contar posições reais do plot e cronometrar 5 min de colheita |
Pesca | **~504 fisgadas/h** | `fishing-base-interval-seconds: 15` − speed 5 = 10s, × `double` 40% | cronometrar 20 fisgadas com vara no máximo |
Passivo | **sem teto físico** | `s.limite` × `mob-stack 3` ÷ `delay 4s` | contar mobs/min de 1 spawner com stack cheio |

**Medir também, porque entram no cálculo:**
- **blocos manuais/hora** de um jogador ativo (o plano assume ~10.000/h) — é o que governa o volume de chaves e o uptime do frenzy
- **kills/hora** de uma conta com autoclick — é o que governa a taxa de cabeças, ou seja o ritmo de rank e prestígio

**Resultado:** ver [metrics.csv](metrics.csv)

---

### V6 — Prestigiar quebra os spawners já colocados?

**Por que importa:** prestigiar reseta o rank, e o rank N é o que libera o spawner N. Se o **spawner já colocado** parar de funcionar ao perder a permissão, prestigiar é catastrófico e o sistema inteiro precisa de outro desenho.

**Como testar:** numa conta de teste, colocar spawners de tier alto, prestigiar, e ver se continuam produzindo.

| | |
|---|---|
**Se continuarem** | ✅ o desenho de prestígio do plano funciona |
**Se pararem** | prestígio precisa de outra mecânica — provavelmente uma permissão persistente de "já teve o rank N", concedida via C6 |

**Resultado:** _(a preencher)_

---

### V7 — Chave dispara em bloco de AoE ou só manual?

**Por que importa:** define se **C7** é necessário. `blessed` chega a 9,21% de chance no nível 100.

| Sobre | Volume de chaves |
|---|---|
Blocos de AoE (1,6×10⁷/h) | **1,4 milhão/hora** — absurdo, a crate perde qualquer sentido |
Blocos manuais (~10⁴/h) | **~900/hora** — massivo e saudável, é o alvo do plano |

**Como testar:** com `blessed` em nível alto, quebrar um bloco que dispare AoE grande (`annihilation` ou `colapse`) e ver se chove chave ou se vem no máximo uma.

O plugin já tem o conceito: o frenzy conta `blocks-required: 1000` **só de blocos manuais, excluindo encantes, drill e bombas**. C7 é fazer a mesma regra valer para chave.

**Resultado:** _(a preencher)_

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
