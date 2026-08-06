# GARNIX — Máquinas

> Escopo: `GarnixMachines/machines/*.yml` — **15 compráveis** + **8 especiais**. Reescrito em **06/08/2026** contra a [tabela-mestra.md](tabela-mestra.md).
> Fatia da via: **26,1% da renda diária da casa** — a segunda maior, atrás só dos spawners.

## A regra que define a máquina

✅ Decisão do dono: *"seria bom máquinas sempre serem um pouco superior aos spawners desde sempre, pois precisam de combustível"*.

```
combustível = 8% da renda da máquina   (fuels.yml)
máquina rende +20% BRUTO por bloco que um spawner do mesmo dia
             − 8% de combustível
             = +10% LÍQUIDO
```

É **por bloco**. Na fatia total os spawners lideram (28,9% contra 26,1%) porque são 20 contra 15 — e é isso que resolve os dias 1 e 2, quando máquina nenhuma existe.

```
custo  = 0,15 × casa/dia(D) ÷ 64          conjunto de 64 = 15% da renda do dia
amount = 1,20 × (0,289 × casa/dia(D) ÷ D) ÷ (8.640 × 64)
         └ renda diária de um spawner naquele dia ┘   └ ciclos/dia × stack ┘
```

⚠️ `chance` nas máquinas é **fração 0.0–1.0** (`MachineDrop.java:40`), convenção **oposta** à dos spawners (0–100). Escrever `5` aqui significa "sempre", não "5%".

## ✅ Nenhuma máquina de coins depende de prestígio

✅ Decisão do dono (06/08/2026): *"eu não quero requisito de prestígio para comprar máquinas de coins mais"*.

Antes, 12 das 15 eram liberadas por marcos de prestígio (1 → 320 voltas). Isso tinha um efeito de calendário que o dono queria eliminar: **o primeiro prestígio só acontece por volta do dia 10**, porque exige chegar ao rank 20, que exige cabeça de SPIDER — spawner que só abre no dia 10. Enquanto o gate fosse prestígio, os dias 4 a 9 não tinham como receber máquina nenhuma.

Agora **as 15 são gate de rank**, e o rank casa com o dia de release. O bloco `prestige.rewards` do `GarnixRankUP/config.yml` ficou só com as vagas de visitante.

## As 15 compráveis

| Dia | Data | Máquina | Gate | Custo | Amount/ciclo |
|---|---|---|---|---|---|
| 3 | 16/08 | Carvão | Rank 3 | 133.000 | 11,8 |
| 4 | 17/08 | Pedra | Rank 4 | 816.000 | 54,6 |
| 5 | 18/08 | Ferro | Rank 5 | 5.020.000 | 268 |
| 6 | 19/08 | Ouro | Rank 6 | 3,08×10⁷ | 1.380 |
| 7 | 20/08 | Redstone | Rank 7 | 1,89×10⁸ | 7.240 |
| 8 | 21/08 | Lápis-Lazúli | Rank 8 | 1,16×10⁹ | 39.000 |
| 9 | 22/08 | Diamante | Rank 9 | 7,16×10⁹ | 213.000 |
| 10 | 23/08 | Esmeralda | Rank 10 | 4,40×10¹⁰ | 1,18×10⁶ |
| 11 | 24/08 | Obsidiana | Rank 11 | 2,70×10¹¹ | 6,58×10⁶ |
| 13 | 26/08 | Quartzo | Rank 13 | 1,02×10¹³ | 2,10×10⁸ |
| 14 | 27/08 | Titânio | Rank 14 | 6,28×10¹³ | 1,20×10⁹ |
| 16 | 29/08 | Rubi | Rank 16 | 2,37×10¹⁵ | 3,97×10¹⁰ |
| 17 | 30/08 | Safira | Rank 17 | 1,46×10¹⁶ | 2,29×10¹¹ |
| 19 | 01/09 | Platina | Rank 19 | 5,50×10¹⁷ | 7,75×10¹² |
| 20 | 02/09 | Adamantita | Rank 20 | 3,38×10¹⁸ | 4,53×10¹³ |

Todas com **ciclo de 10s** e stack-alvo de **64 por bloco**. Os dias 12, 15, 18 não têm máquina — são 15 lançamentos em 18 dias.

## As 8 especiais — sem data, desde o dia 1

✅ Decisão do dono: *"as máquinas especiais não tem data para liberar, elas serão liberadas desde o começo do servidor"*. São exatamente as que **não vendem na loja** (`shop: false`), e todas estão com `release: ''`.

**Isso é seguro porque nenhuma delas produz coins** — todas entregam contagem, que não infla com a curva exponencial. A rota é site ou loot, nunca a loja.

| Máquina | Ciclo | Produz (1 unidade) | Por dia |
|---|---|---|---|
Combustível | 60s | 2 L | 2.880 L |
Cash | 432s | 0,01 cash | **2,00 cash** |
Limite de Spawners | 3600s | 1 `spawnerslimite` | 24 |
Limite de Máquinas | 3600s | 1 `maquinaslimite` | 24 |
Dracmas | 10s | 5,66 dracmas | 48.902 |
Gemas · Sementes · Corais | 10s | 0,01 de cada | 86,4 |

⚠️ **O ciclo da Máquina de Cash é 432s e não 10s de propósito.** O saldo tem 2 casas decimais (`AccountRepository:99-105`), então `0.01` é o menor valor que sobrevive ao depósito — com ciclo curto o `amount` cairia abaixo do piso e seria truncado. `86400 / 432 = 200 ciclos × 0,01 = 2,00 cash/dia` exato.

⚠️ **Regra para a Fase 7:** o preço da Máquina de Cash no site tem que ser **maior** que o cash que ela produz até o fim da temporada. Senão comprar a máquina sai mais barato que comprar o cash direto, e ela vira um desconto na própria loja.

## O combustível

Consumo é **1 litro por ciclo, por BLOCO** — não por máquina empilhada. Empilhar 64 num bloco custa o mesmo que empilhar 1, e isso é intencional: recompensa consolidar.

```
máquinas A–O e as de moeda secundária · ciclo 10s   →  8.640 L/dia por bloco
Máquina de Combustível                · ciclo 60s   →  1.440 L/dia
Máquina de Cash                       · ciclo 432s  →    200 L/dia
Máquinas de Limite                    · ciclo 3600s →     24 L/dia
```

### ✅ A Máquina de Combustível foi recalibrada em 06/08/2026

✅ Régua do dono: *"combustível não deve ser algo raro nem impossível para ficar alimentando as máquinas, porém não é comum o jogador acumular grandes quantias para ficar usando infinitamente sem precisar do combustível infinito, mas ele deve sim sempre ter em mãos"*.

Isso vira uma regra só: **oferta ≈ consumo**. Sem folga não dá para estocar; sem déficit as máquinas não param.

```
consumo endgame (15 de coins + 4 secundárias + especiais) ..  165.848 L/dia
recompensas (crates, caixas, bosses, a ~1.572 chaves/dia) ..   30.000 L/dia
────────────────────────────────────────────────────────────────────────────
a máquina precisa cobrir ...................................  135.848 L/dia
com stack 64 e ciclo de 60s  →  amount 1,47, chance 1.0
```

🚩 **Ela estava em 28% do consumo, e o erro era de leitura do `chance`.** Estava `chance: 0.1` com `amount: 2` — e `chance` nas máquinas é **fração**, então ela produzia em 10% dos ciclos: **18.432 L/dia** contra os 165.848 necessários. O jogador com o parque completo ficava sem combustível **72% do tempo**. O comentário antigo do arquivo (*"~53% do consumo de 4 blocos"*) media contra 4 blocos, não contra o parque inteiro, e por isso o buraco passou.

A chance foi para **1.0** e o valor para o `amount`: produção constante é mais legível que uma loteria por ciclo, e o número vira a alavanca única. Resultado: a máquina cobre **82%** e as recompensas os outros 18% — que é o que mantém as tabelas de loot relevantes em vez de decorativas.

⚠️ **Não existe capacidade máxima de tanque.** `MachineInfoMenu.java:368` faz `Math.min(newTotal, Long.MAX_VALUE)` — o jogador estoca litros sem limite. Se um teto for desejado, é código.

### Por que o infinito vale exatamente 8%

O valor do combustível infinito **é** o custo do comum. Se o comum for barato demais o infinito não vale nada; se for caro demais o infinito vira obrigatório e o P2W passa de perceptível a punitivo. Os 8% são o ponto: +8% líquido para sempre na melhor máquina, mais o alívio de nunca reabastecer.

E como o infinito só funciona em **uma** máquina por vez, o jogador o aplica na melhor que tem — então o valor dele **cresce junto com o jogador** e ele nunca fica obsoleto.
