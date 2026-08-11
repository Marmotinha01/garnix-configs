# 04 — PARIDADE SITE ↔ IN-GAME

A sua regra, dita várias vezes: **tudo que se vende no site é obtenível jogando, alguns itens por rotas muito mais difíceis.** Este documento é o que torna essa regra verificável em vez de nominal — para cada produto pago, qual é a rota in-game e quanto ela custa em esforço.

O critério de aprovação é mecânico: **se um produto pago não tiver linha aqui, ele não pode existir.**

Reescrito em **11/08/2026**, quando o catálogo foi redecidido do zero. O que mudou em relação à versão anterior está no fim, em [O que saiu do plano antigo](#o-que-saiu-do-plano-antigo).

---

## O câmbio — 1.000 cash = R$ 1,00

Não foi inventado: o plano anterior já precificava os quatro VIPs em **20.000 · 35.000 · 60.000 · 100.000** cash, e os pontos de preço naturais desses mesmos VIPs no mercado BR são **R$ 19,90 · 34,90 · 59,90 · 99,90**. A razão bate nos quatro degraus, então o câmbio estava implícito no orçamento desde o começo.

Conferência nas duas pontas: o teto de exagero de um whale (500.000 cash) vira **R$ 500 na temporada**, e o orçamento de um free (400–960 cash) vira menos de R$ 1. É o esperado — **o free não alcança o site pelo cash, ele alcança pelo drop.** A paridade nunca foi de preço, é de rota.

### As três regras de preço

| Regra | Valor |
|---|---|
| Produto **no site** | preço base = cash ÷ 1.000 |
| Produto **nos dois canais** | cash-shop cobra **+25%** sobre o base |
| **Pacote de cash** | bônus por volume, de +5% a +40% |

O +25% existe para os dois canais não se canibalizarem. Se o item avulso no site fosse mais barato que comprar cash e gastar na loja, ninguém compraria cash; se fosse muito mais caro, ninguém compraria o item. Com a regra atual, **o site é o caminho mais curto e o pacote de cash é o mais barato por unidade para quem se compromete com volume.**

| Pacote | Cash | Bônus |
|---|---|---|
| R$ 5 | 5.000 | — |
| R$ 10 | 10.500 | +5% |
| R$ 25 | 27.500 | +10% |
| R$ 50 | 60.000 | +20% |
| R$ 100 | 130.000 | +30% |
| R$ 250 | 350.000 | +40% |

---

## Os três baldes

| Só no cash shop | Nos dois canais | Só no site |
|---|---|---|
| Chaves RankUP | os 6 boosters 3× 1h | Cash |
| Torre de Cacto | as 8 caixas | os 5 VIPs |
| Limite de Armazém · Máquinas · Spawners | Venda Automática | Combustível Infinito |
| Explosivo 2×2 | Limpador de Terreno | Matadora Hit-Kill |
| as 3 Matadoras (Ancestral · Rúnica · Abissal) | Explosivo 4×4 · 6×6 · 8×8 | as 9 skins de topo |
| Robô Mítico avulso | Britadeira | Robô Lendário · Mítico |
| | Máquina de Cash | Vaga da Mina |
| | | Máquina de L. de Spawners · de Máquinas |

O padrão continua o mesmo do plano original: **o site vende velocidade e conveniência; o jogo vende as mesmas coisas por sorte ou por tempo.**

---

## A tabela de paridade — cash shop

**32 produtos em 5 categorias**, com os ícones nos slots 11–15 do menu (centrados no 13).

### Boosters — faixa A · `cash-shop/boosters.yml`

| Produto | Cash | Rota in-game | Esforço |
|---|---|---|---|
| 6 boosters 3× de 1h (um por via) | 250 · 313 | caixa `boosters`, crates e bosses | jackpot. In-game o 3× existe **só em 5m e 10m** — a força máxima está nos dois lados, o que muda é a duração |

> É a separação mais limpa do plano: **o in-game entrega a sensação, o site entrega o efeito.** E como o tempo empilha sem teto entre boosters de mesmo multiplicador, seis compras de 1h valem exatamente seis horas — nada se perde.

### Caixas — faixas A a D · `cash-shop/caixas.yml`

| Produto | Cash | Rota in-game | Esforço |
|---|---|---|---|
| Chaves RankUP ×25 | 150 | rankup, dailies, eventos | abundante |
| Mineração · Farm · Pesca [Tier II] | 1.125 | crate da via, caixa `caixas`, `Fishing/rewards.yml` | é o canal premium de armadura e skin |
| Caixa Boosters | 1.250 | crate rankup e vip, loja da pesca, loja de fragmentos, os 5 bosses | a mais acessível das oito |
| Caixa Robôs | 1.250 | crate rankup, bosses `arauto` · `devorador` · `tita` | ver a nota do valor esperado abaixo |
| Caixa Skins [Tier II] | 1.750 | crate vip, caixa `garnix` (2,5%) | — |
| Caixa Bosses [Tier II] | 2.250 | crate bosses, caixas `bosses-i` e `bosses-ii`, os 5 bosses | — |
| Caixa Caixas | 3.750 | crate rankup e vip, caixa `garnix` (2,5%), boss `devorador` · `tita` | — |
| Caixa Garnix | 18.750 | jackpot absoluto, boss `devorador` | ~1 a cada 3 dias de crate no endgame |
| Robô Mítico avulso | 6.000 | caixa `robos` (2%), caixa `garnix` (0,5%) | — |

> ⛔ **Armadura nunca é vendida direta**, por decisão sua. Ela existe só via caixa — então **quem paga compra CHANCE, não a peça**. É o que dá à armadura o papel de "equipamento que só quem joga tem completo".
>
> ⚠️ **A Caixa Robôs a 1.250 foi conferida, não estimada.** Com 35/32/22/9/**2**% em `MysteryBoxes/boxes/robos.yml`, o valor esperado de uma abertura fica em **~870 cash**. Ela é a única rota de cash para o Robô Mítico depois que o robô avulso virou produto de site, e a esse preço não vira atalho mais barato que o próprio Mítico a 6.000.

### Terreno — faixas A a D · `cash-shop/terreno.yml`

Substituiu a antiga categoria "Limites". O recorte é por **lugar** e não por natureza: tudo aqui vive dentro do plot.

| Produto | Cash | Rota in-game | Esforço |
|---|---|---|---|
| Torre de Cacto (4 andares) | 300 | loja de fragmentos (5 · 10 · 15 andares), caixa `garnix` (9% de 15, 2,5% de 30) | poupa horas de trabalho manual |
| Venda Automática | 313 | caixa `garnix` (2,5%) | contorna o `initial-limit` do armazém, que é o gargalo do cacto — por isso é legitimamente premium |
| Limpador de Terreno | 375 | loja de fragmentos, 90 eterna | o mais barato dos dois lados. Impacto econômico **zero**: só remove `DIRT`/`GRASS` do próprio plot |
| Limite de Armazém +500 | 800 | crates e Caixa Recursos | médio. Tem teto físico (o plot) |
| Limite de Máquinas +1 | 1.500 | crates VIP e RankUP, marcos de prestígio | a crate RankUP entrega **5,7** ao longo dos 20 ranks |
| Limite de Spawners +1 | 4.000 | crate, boss e Caixa Recursos — `0,032`/chave VIP · `0,039`/chave RankUP · `0,011`/chave de via | **deliberadamente lento.** É o item nº 1 do Ranking de Apelões: multiplica a única via sem teto físico |
| Máquina de Cash | 31.250 | caixa `garnix` (16,25%, lote de 3) | 25.000 base × 1,25 |

> ⚠️ **O limite de spawner não tem mais rota de COMPRA in-game.** A loja da pesca vendia limite de spawner e de máquina por corais, e os dois saíram em 06/08/2026 pela sua régua — *"só itens úteis e que não impactam de maneira forte na economia"*. Uma via AFK de 24h não pode financiar a via sem teto. O que sobrou de limite por corais é o do **armazém**, que tem teto físico.
>
> As crates VIP e RankUP davam o limite de spawner em lotes de `5·15·30·50` e `15·30·50·100` — o mesmo tamanho do limite de armazém, que vale 800 cash contra os 4.000 daqui. Os dois lotes desceram para `1·3·5·10` e o total da temporada caiu para **~27**.
>
> ⚠️ **A Máquina de Cash comprada com cash é moeda comprando moeda.** A conta fecha: 2 cash/dia contra 31.250 de custo dá payback de ~15.500 dias. É item de status, não loop. **Só não pode nunca baratear.**

### Mineração — faixas A a C · `cash-shop/mineracao.yml`

| Produto | Cash | Rota in-game | Esforço |
|---|---|---|---|
| Explosivo 2×2 | 500 | loja de fragmentos (150 eterna), caixa `mineracao-i`, crate `mineracao` | abundante |
| Explosivo 4×4 | 1.125 | loja de fragmentos (300 eterna + 120 sagrada), caixa `mineracao-i`, crate | fácil |
| Explosivo 6×6 | 2.500 | caixa `mineracao-ii`, crate `mineracao` | ⚠️ **não sai na loja de fragmentos** — a escada de lá para no 4×4 |
| Explosivo 8×8 | 5.000 | caixa `mineracao-ii`, crate `mineracao` | idem |
| Britadeira | 10.000 | loja de fragmentos (1.000 eterna + 700 sagrada + 400 divina + 500 primal), caixas `mineracao-i` e `-ii`, crate | **o maior throughput do jogo** — quebra a coluna inteira, 3×3 por nível |

> Os preços saem da proporção da loja de fragmentos, não de intuição. A britadeira é de longe o item mais caro daquele menu — os 400 de divina sozinhos são **43% de toda a renda de divina da temporada**. Daí os 10.000, contra os 1.125 do 4×4.

### Bosses — faixas C e D · `cash-shop/bosses.yml`

| Produto | Cash | Rota in-game | Esforço |
|---|---|---|---|
| Matadora Ancestral (1.500 dano) | 4.000 | caixas `bosses-i` e `bosses-ii` | médio |
| Matadora Rúnica (4.000 dano) | 10.000 | caixa `bosses-ii` | difícil |
| Matadora Abissal (9.000 dano) | 20.000 | caixa `bosses-ii` | o teto do cash shop |

> A **Hit-Kill é exclusiva do site** — o cash shop vai até a Abissal e para. A escada in-game acompanha: `bosses-i` entrega até a Ancestral, `bosses-ii` até a Abissal, e a HK só sai da caixa `garnix` a **0,25%**.

---

## A tabela de paridade — site

| Produto | BRL | Rota in-game | Esforço |
|---|---|---|---|
| VIP Investidor 30d | 199,90 | ⚠️ **nenhuma** — ver [A exceção](#a-exceção) | — |
| VIP Garnix 30d | 99,90 | papel de 1d na caixa `garnix` (0,25%) | o mais raro dos papéis |
| VIP Supremo 30d | 59,90 | papel de 2d na caixa `garnix` (0,5%) | +1 vaga de visitante |
| VIP Imortal 30d | 34,90 | papel de 3d na caixa `garnix` (2,5%) | — |
| VIP Celestial 30d | 19,90 | **grátis 3 dias** na primeira vinculação de Discord | o VIP de entrada |
| Combustível Infinito | 59,90 | caixa `garnix` (**0,25%**) | **o item mais raro do servidor**, empatado com a Matadora HK |
| Máquina de L. de Spawners | 49,90 | caixa `garnix` (19,25%, lote de 5) | ver a nota abaixo |
| Coleção de Skins (as 9) | 49,90 | caixas de via II, caixa `skins-ii`, caixa `garnix` (0,5% cada) | as 3 últimas de cada via **não são forjáveis**, por decisão sua |
| Matadora Hit-Kill | 44,90 | caixa `garnix` (**0,25%**) | converte volume de chave de boss em volume de recompensa |
| Trio Caixa Garnix | 39,90 | — | — |
| 10× Explosivo 8×8 | 39,90 | — | — |
| 5× Britadeira | 34,90 | — | — |
| Máquina de L. de Máquinas | 29,90 | caixa `garnix` (19,25%, lote de 5) | teto físico do plot limita o uso |
| Máquina de Cash | 24,90 | caixa `garnix` (16,25%, lote de 3) | — |
| Vaga da Mina | 24,90 | caixa `mineracao-ii`, caixa `garnix` (9%) | o VIP pago entrega no máximo 3 das 5 vagas; as outras só saem daqui |
| Pacote de Skins (uma via) | 19,90 | idem coleção | — |
| 10× Explosivo 6×6 | 19,90 | — | — |
| 10× Caixa Bosses II | 17,90 | — | — |
| Caixa Garnix · 5× Caixa Caixas | 14,90 | — | — |
| 10× Caixa Skins II | 13,90 | — | — |
| Pacote Booster Completo (60) | 12,90 | — | — |
| 5× Venda Automática | 9,90 | — | — |
| 10× Caixa Robôs | 9,90 | — | — |
| Dupla de Robôs (Lendário + Mítico) | 8,90 | caixa `robos` (9% e 2%), caixa `garnix` (9% e 0,5%) | — |
| 10× Caixa Tier II · 10× Explosivo 4×4 | 8,90 | — | — |
| 10× Caixa Boosters · Britadeira avulsa | 7,90 | — | — |
| Robô Mítico | 5,90 | caixa `robos` (2%), caixa `garnix` (0,5%) | — |
| 10× Booster (uma via) · 10× Limpador | 4,90 | — | — |

O ticket mínimo do site é **R$ 4,90**. Vários produtos convertidos ficariam em R$ 0,30–3,00 avulsos, o que ninguém processa por PIX — por isso eles são vendidos em pacote. As linhas com "—" na rota são pacotes de itens que já têm linha própria acima.

> ⚠️ **A Máquina de L. de Spawners é o produto mais sensível do site.** Com `delay: 3600s` ela rende 1 limite por hora, para sempre — **480 por temporada** por unidade, e a caixa `garnix` entrega **lotes de 5**. Contra os ~27 de todas as rotas de drop somadas, e contra os 4.000 cash que um limite avulso custa.
>
> Registrado em 11/08/2026 como **decisão sua manter assim**: *"os players não querem pouco limite nas caixas"*. Nenhum ajuste de `delay`, de lote ou de teto por conta foi aplicado. Se um dia a concentração de spawner aparecer no simulador, o botão é o `delay` em `GarnixMachines/machines/limite-spawners.yml`.

---

## A exceção

**O VIP Investidor é o único produto pago do catálogo sem linha de paridade.** Ele não sai de caixa nenhuma, não sai de crate, não sai de fragmento, e — por decisão sua de 11/08/2026 — **não recebe `paper-icon`**, então nem como papel negociável ele existe. A entrega é direta no grupo do LuckPerms pelo `GarnixStoreActivation`.

Registrado como escolha consciente, não como pendência. É a única linha do documento que reprova pelo próprio critério dele.

Vale notar o que isso implica: ele é o **topo real** da hierarquia (weight 120 contra 110 do Garnix, −20% de desconto contra −15%, +22% de ganhos contra +20%, 20 homes contra 15, 6 terrenos contra 5, 3 slots de mina contra 2) e é o único VIP que um jogador **não pode experimentar de graça**.

---

## O que NÃO vai para canal nenhum

| Item | Por quê |
|---|---|
| **Armadura** (60 peças) | decisão sua. Só via caixa — é o equipamento de quem joga |
| **Livros** (pesca · lâmina · kill-stack) | decisão sua de 11/08/2026. São os únicos livros do servidor, e os três saíram. Mineração e fazenda não usam livro: os encantes de lá são comprados no menu com gemas/sementes |
| **`fortunate` / `prosperity`** e a árvore de encantes | é a recompensa do jogador dedicado. Comprado com gemas/sementes, que são **lineares no tempo** |
| **Cabeças** | são o gate de tempo de todo o rank e prestígio. Vender cabeça seria vender rank |
| **Coins** | a moeda exponencial não pode ter torneira de dinheiro real, ou os dois eixos viram um |
| **Homes, market, leilão, linhas de baú** | são exclusivamente vantagem de VIP e **nunca** distribuídos como recompensa |

---

## O que saiu do plano antigo

A versão anterior deste documento descrevia 42 produtos numa estrutura diferente. O que mudou, e por decisão de quem:

| Mudança | Motivo |
|---|---|
| **VIPs saíram do cash shop** | decisão sua: VIP não se compra com cash, só com dinheiro no site |
| **Skins saíram do cash shop** | idem — as 9 de topo viraram exclusivas do site |
| **Livros saíram inteiramente** | decisão sua. A categoria ficou vazia: os únicos livros do servidor são os de pesca, lâmina e kill-stack, e os três foram excluídos |
| **Robôs saíram do cash shop** | só o Robô Mítico avulso ficou, dentro da categoria Caixas |
| **Combustível Infinito e Matadora HK** | de faixa C/D do cash shop para exclusivos do site |
| **"Limites" virou "Terreno"** | o recorte passou a ser por lugar, e absorveu limpador, torre e máquina de cash |
| **Nasceu a categoria "Mineração"** | os 4 explosivos e a britadeira não tinham onde morar |
| **Nasceu o câmbio 1.000:1 e o +25%** | o plano antigo não tinha regra ligando os dois canais |
| ⚠️ **A linha "VIP → `GarnixFragments` → tag-vip" foi removida** | **não existe.** Não há nada de VIP na loja de fragmentos. As rotas reais são o papel na caixa `garnix` e os 3 dias de Celestial na vinculação de Discord |
| ⚠️ **A "Vaga de Visitante" foi renomeada para "Vaga da Mina"** | ela mora em `GarnixMining/config.yml` (`visitor-slots-max: 5`, item de `/mina giveslot`), não em `GarnixVips` |

---

## A verificação

Os **32 produtos do cash shop** foram conferidos resolvendo cada `commands:` contra o arquivo que ele referencia — caixa, crate, robô, bomba, skin, máquina e matadora. **32 de 32.**

Isso importa mais aqui que em qualquer outro lugar do repo: **os plugins não validam comando de produto.** Um id errado num `commands:` simplesmente não faz nada — e num produto pago isso é o jogador pagando e não recebendo.

Armadilhas de ordem de argumento, todas reais:

| Certo | Errado que é fácil escrever |
|---|---|
| `/caixas give <caixa> <jogador> <qtd>` | jogador primeiro |
| `/crates givekey <crate> <jogador> <qtd>` | jogador primeiro |
| `/crates giverobot <robo> <jogador> <qtd>` | jogador primeiro |
| `/maquina give <jogador> <tipo> <stack> <qtd>` | o primeiro int é o **stack**, o segundo é sempre 1 |
| `/boss give sword <jogador> <variante> [qtd]` | `/matadora give` — o `/matadora` só abre o menu |
| `/lamina givebook` | `/spawner givebook` — a lâmina tem comando próprio |

> ⚠️ **O `/boss` é `playerOnly()` e mesmo assim funciona na loja.** O `CommandHandler` do core avalia o tipo de sender **depois** de resolver o subcomando (`CommandHandler:195`), e o `give sword` não declara `playerOnly` — então o console passa. Isso importa porque a loja despacha tudo como console (`PurchaseService:227`). Se um dia o `playerOnly` subir para o subcomando, os três produtos da categoria Bosses param de entregar **sem erro visível para o jogador**.
