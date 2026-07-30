# 04 — PARIDADE SITE ↔ IN-GAME (Fase 7)

A sua regra, dita várias vezes: **tudo que se vende no site é obtenível jogando, alguns itens por rotas muito mais difíceis.** Este documento é o que torna essa regra verificável em vez de nominal — para cada um dos **42 produtos** do cash-shop, qual é a rota in-game e quanto ela custa em esforço.

O critério de aprovação é mecânico: **se um produto do site não tiver linha aqui, ele não pode existir.**

---

## As 4 faixas e quem alcança cada uma

Ancoradas no orçamento real de cash, não em intuição. Um free acumula na temporada **560–700** (dailies 360–500 + eventos ~200) e o teto de exagero de um whale é **500.000** ([08-CASH.md](08-CASH.md)).

| Faixa | Preço | Quem alcança | Produtos |
|---|---|---|---|
**A** | 50–500 | free chega, 1–2 na temporada | 9 |
**B** | 500–3.000 | free dedicado chega em **um** item se guardar tudo | 6 |
**C** | 3.000–20.000 | pagante | 21 |
**D** | 20.000–100.000 | whale | 6 |

Conferência do teto: garnix (100k) + combustível infinito (60k) + matadora (45k) + vaga (25k) + pilhagem III (18k) + máquina de cash (15k) + caixa garnix (15k) = **278k**, e ainda sobra para limites e skins. Fecha com "500.000 é o exagero absoluto".

---

## A tabela de paridade

### Boosters — faixa A

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
6 boosters 3× de 1h (um por via) | 200–250 | faixa **Lendário/Mítico−** de caixa e boss | jackpot. In-game o 3× existe **só em 5m e 10m** — a força máxima está nos dois lados, o que muda é a duração |

> É a separação mais limpa do plano: **o in-game entrega a sensação, o site entrega o efeito.** E como o tempo empilha sem teto entre boosters de mesmo multiplicador, seis compras de 1h valem exatamente seis horas — nada se perde.

### Limites — faixas A a C

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
Venda Automática | 250 | drop raro de caixa | contorna o `initial-limit` do armazém, que é o gargalo do cacto — por isso é legitimamente premium |
Limite de Armazém +500 | 800 | `/armazem givelimititem` em recompensa | médio |
Limite de Máquinas +1 | 1.500 | recompensa e marcos de prestígio (12 marcos) | **grátis pela escada de prestígio** — 12 máquinas ao longo dela |
**Limite de Spawners +1** | 4.000 | `/pesca` → corais, com câmbio decrescente e teto diário | **deliberadamente lento.** É o item nº 1 do Ranking de Apelões: multiplica a única via sem teto físico |

### Caixas — faixas A a C

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
Lote de 25 chaves rankup | 150 | rankup, dailies, eventos | abundante |
Caixa II (mineração · fazenda · pesca) | 900 | in-game **beeem raro** | é o canal premium de armadura e skin |
Caixa Garnix | 15.000 | jackpot absoluto | ~1 a cada 3 dias de crate no endgame |

> ⛔ **Armadura nunca é vendida direta**, por decisão sua. Ela existe só via caixa — então **quem paga compra CHANCE, não a peça**. É o que dá à armadura o papel de "equipamento que só quem joga tem completo".

### Skins — faixa C

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
jade · opala · oceanita | 3.500 | caixa | as 3 últimas de cada via **não são forjáveis**, por decisão sua |
safira · cristal · pérola | 6.000 | caixa | idem |
mithril · marfim · tempestita | 12.000 | jackpot de caixa | o item de status da temporada, +65% de renda |

### Livros — faixas B e C

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
Massacre IV · V | 2.500 · 8.000 | crate/caixa de banda alta | throughput de kill → cabeças |
Ceifador III | 6.000 | idem | 75% de instakill |
Pilhagem I · II · III | 5.000 · 10.000 · 18.000 | jackpot de crate | **o livro mais apelão do servidor** — 2,0× de drop direto na via sem teto |
Speed V · Double V · Luck V | 3.500 cada | caixa de pesca | os níveis **1–4 são 100% in-game**: sem isso a pesca de quem não paga fica inviável |

> **A taxa de faucet de livro é o freio da temporada.** Livro não tem preço em coins, então se cai fácil o multiplicador vem cedo e a curva de tiers desanda. Por isso o site vende só o topo.

### Míticos — faixas A a D

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
Torre de Cacto (4 andares) | 300 | item raro de crate/caixa | poupa horas de trabalho manual |
Máquina de Cash | 15.000 | **rara, jogando** — não existe na loja de máquinas | por decisão sua: *"o jogador vai comprar no site ou conseguir jogando de forma rara"* |
Vaga de Visitante | 25.000 | jackpot | o VIP pago entrega no máximo 2 das 5 vagas; **as outras 3 só saem daqui** |
Matadora Hit-Kill | 45.000 | boss de banda alta | converte volume de chave de boss em volume de recompensa |
**Combustível Infinito** | 60.000 | jackpot da caixa `garnix` | **o item mais raro do servidor** |

> O combustível infinito é o melhor produto de site do plano e não precisa de teto: **só funciona em uma máquina por vez**, então o jogador o põe na melhor que tem e o valor dele cresce junto — nunca fica obsoleto, nunca compensa ter dois.

### VIPs — faixa D

| Produto | Site | Rota in-game | Esforço |
|---|---|---|---|
Celestial 30d | 20.000 | **grátis 3 dias** na primeira vinculação de Discord · `/fragmentos` → tag-vip | o VIP de entrada |
Imortal 30d | 35.000 | fragmentos | — |
Supremo 30d | 60.000 | fragmentos | +1 vaga de visitante |
Garnix 30d | 100.000 | fragmentos | +2 vagas |

> O VIP é a **única fonte de desconto** do servidor — rank só dá ganho. É o que faz o P2W ser perceptível sem ser humilhante: um sem-VIP ganha quase o mesmo por hora, mas o VIP compra mais barato e avança ~meio dia antes.
>
> Vendido como **papel** (item negociável), então tem mercado in-game também.

---

## O que NÃO vai para o site, e por quê

| Item | Por quê |
|---|---|
**Armadura** (60 peças) | decisão sua. Só via caixa — é o equipamento de quem joga |
**`fortunate` / `prosperity`** e a árvore de encantes | é a recompensa do jogador dedicado. Comprado com gemas/sementes, que são **lineares no tempo** |
**Cabeças** | são o gate de tempo de todo o rank e prestígio. Vender cabeça seria vender rank |
**Coins** | a moeda exponencial não pode ter torneira de dinheiro real, ou os dois eixos viram um |
**Homes, market, leilão, linhas de baú** | são exclusivamente vantagem de VIP e **nunca** distribuídos como recompensa — os valores atuais já estão certos e não foram tocados |

---

## A verificação

Rodei o gerador do cash-shop com uma checagem que resolve cada comando contra o arquivo que ele referencia — caixa, crate, máquina, skin, encante e VIP. **42 de 42 conferidos.**

Isso importa mais aqui que em qualquer outro lugar do repo: **os plugins não validam comando de produto.** Um id errado num `commands:` simplesmente não faz nada — e num produto pago isso é o jogador pagando e não recebendo.

Três armadilhas reais que a checagem pegou, todas de ordem de argumento:

| Certo | Errado que eu quase escrevi |
|---|---|
`/caixas give <caixa> <jogador> <qtd>` | jogador primeiro |
`/crates givekey <crate> <jogador> <qtd>` | jogador primeiro |
**`/lamina givebook`** | `/spawner givebook` — a lâmina tem comando próprio |
