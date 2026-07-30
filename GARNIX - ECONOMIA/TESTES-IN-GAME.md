# TESTES IN-GAME — o que ainda falta medir

Os **8 testes do protocolo V1–V8 estão fechados** (resultados e evidências em [09-VERIFICACAO.md](09-VERIFICACAO.md)). Este arquivo agora lista só o que **ainda falta cronometrar**, em ordem de risco.

**A regra que justifica cada teste:** o V5-A mostrou que minha estimativa de mineração manual estava **7× errada** (eu supunha 10.000 blocos/h; o real é 70.000). Cada número abaixo tem o mesmo potencial de erro, e cada um move uma fase inteira.

Me manda os números crus, não precisa formatar.

---

## ⭐ M1 — Kills por hora de UM bloco de spawner · **o mais importante** · 5 minutos

**Por que:** é o número que sustenta os **dois eixos ao mesmo tempo**. Dele saem os requisitos de cabeça dos 20 ranks (e portanto o ritmo de prestígio), o valor das dracmas e o `drops.coins.amount` dos 20 spawners. Um erro de 3× move os três juntos.

Meu modelo diz: `kills/h por bloco = min(spawners no bloco, teto do mob-stack) × 3600/delay`.

### Preparação
1. Um bloco de spawner **sozinho** no terreno (sem outros por perto — `stack-radius: 5`).
2. Anote quantos **itens de spawner** você juntou nele e qual o `delay` atual.
3. Lâmina com `massacre` alto, para não ser ele o gargalo.
4. Colete os drops acumulados antes de começar, para zerar.

### Medição
Autoclique no mob por **5 minutos cronometrados**, sem parar.

### O que me mandar
- Itens de spawner no bloco: ____
- `delay` do bloco: ____
- **Mobs abatidos em 5 min** (a lâmina mostra em "Mobs abatidos"): ____
- Coins e dracmas acumulados no período: ____
- CPS aproximado do autoclick: ____

> **O que eu faço com isso:** se o medido divergir do modelo por um fator k, divido os requisitos de cabeça por k e multiplico o `drops.coins.amount` por k. É uma constante no gerador.

---

## ⭐ M2 — Colheita de cacto por hora · 10 minutos

**Por que:** é o termo que falta para derivar o `sell-price` do cacto. Sem ele a sexta via é chute. Você já deu as duas pontas (`randomTickSpeed 8`, `growth.cactus-modifier: 20000`, farms de 25–40k no dedicado e 5–15k no casual), mas a taxa efetiva depende de como a farm é montada.

### ⚠️ Não meça "quanto acumula em 10 minutos"

Era como eu tinha escrito, e **não funciona**: com o `initial-limit` em 1.500, o armazém enche e o excedente **se perde**. A medição leria 1.500 qualquer que fosse a taxa real — o teste mediria o limite, não a colheita.

A pergunta certa é a inversa: **quanto tempo o armazém leva para encher.** Aí o limite deixa de ser o inimigo e vira o instrumento — ele é uma quantidade que você já conhece com exatidão.

### Preparação
1. Uma farm de cacto **pequena e contada** — 50 a 150 colunas. Pequena de propósito: numa farm grande 1.500 enche em segundos e o cronômetro não pega.
2. Armazém **vazio**.
3. Autosell **desligado**.
4. Anote o `initial-limit` em vigor (hoje 1.500).

### Medição
Cronometre do zero até o armazém bater no limite. Se encher em menos de 1 minuto, **arranque metade dos cactos** e repita — a taxa escala com o número de colunas, então uma farm menor só torna a leitura mais precisa.

### O que me mandar
- Colunas de cacto plantadas: ____
- Altura das colunas (2, 3, 4 blocos?): ____
- Limite do armazém no teste: ____
- **Tempo até encher:** ____

### A conta
```
colheita/h = limite ÷ tempo_em_horas
por coluna = colheita/h ÷ colunas
```

Com isso eu extrapolo para qualquer tamanho de farm.

> **O que trava nisso:** o `sell-price` do cacto (`alvo de renda do tier ÷ colheita/h`) e o preço da areia, que assume 3 blocos por coluna — se a coluna útil for 2 ou 4, o número de areias por plot muda e o preço com ele.

---

## M3 — Teste de carga · **antes do lançamento**

Decide quantos jogadores o dedicado aguenta, e é o único teste que pode obrigar a mexer nas chances dos encantes de classe D/E.

| # | Cenário | O que medir |
|---|---|---|
**L1** | 50 · 100 · 250 contas no perfil real (2 AFK + 1 ativa), árvore de encantes no máximo | pacotes/tick e TPS |
**L2** | lote de 25–30 bosses invocados juntos (`boss-stack-radius: 5`) | TPS no pico |

> **Se o TPS cair:** o ajuste é **baixar a chance da classe alta e subir o payoff por proc** — nunca baixar o payoff, porque isso desmonta a curva de tiers.

---

## M4 — Conferências de que o config pegou · 5 min cada

Não são medições, são checagens.

| # | O que conferir | Como |
|---|---|---|
**C-a** | O drop de **dracmas** do spawner cai | mate mobs e veja `/dracmas` mexer (chance de 1%, então mate bastante) |
**C-b** | A trilha `spawner-stack` **agora entrega throughput** | compare kills/min antes e depois de subir um nível |
**C-c** | O nível de `mob-stack` (ilimitado) deixa a pilha passar de 512 | fique ~1 min sem matar e olhe a nametag |
**C-d** | `machines.buy.a` é concedida no rank 6 | chegue ao rank 6 e veja a máquina A aparecer em `/maquinas` |
**C-e** | O **C6** funciona: `prestige.rewards` roda no nível certo | prestigie numa conta de teste e veja se `machines.buy.d` foi concedida |
**C-f** | O `release:` escalonado bloqueia spawner de dia futuro | tente comprar o spawner 20 antes do dia 20 |

---

## Como isso volta para o plano

Cada medição vira uma linha em [metrics.csv](metrics.csv) (meta vs medido). Divergência acima de **±25%** significa que a fase correspondente não fecha e eu regero os arquivos com a constante corrigida.
