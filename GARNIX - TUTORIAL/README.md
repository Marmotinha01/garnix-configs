# Menu `/tutorial`

> Referência de conteúdo do menu `/tutorial` (`GarnixEssentials/custom-menus/tutorial.yml`).
> **Implementado em 08/08/2026** — 29 ícones. Este documento é a fonte do texto de cada um: mexeu aqui, mexa lá.

## Princípio

O tutorial **não é índice dos 40 plugins** e **não é lista de passos**. Ele explica **o que cada sistema é e como funciona**, para o jogador entender as regras do servidor — não para ser conduzido pela mão.

O que ele precisa deixar claro acima de tudo é o loop mestre, que está literalmente codificado na estrutura dos arquivos:

```
rank N  →  libera spawner N  →  heads de mob N  →  rank N+1
```

## A grade

Quatro linhas na **ordem da jornada**, não por família de plugin — o jogador lê de cima para baixo na mesma sequência em que vai encostar em cada sistema.

| Linha | Slots | Tema | Ícones |
|---|---|---|---|
2 | 10–16 | comece aqui | Terreno · Ranks · Mineração · Fazenda · Pesca · Spawners · Máquinas |
3 | 19–25 | sua renda | Cacto e Armazém · Moedas · Limites · Loja · Encantamentos · Skins · Armaduras |
4 | 28–34 | mais recompensa | Caixas · Runas · Eventos · Bosses · Diárias · Duelos · Prestígio |
5 | 38–42 | entre jogadores | Clãs · Mercado · Leilão · Loja de Baú · Correio |
6 | 48–50 | rodapé | Warps · Regras · Discord |

A linha 5 tem cinco ícones e fica **centralizada** (colunas 2 a 6); as outras três têm sete e ocupam as colunas 1 a 7. Só assim as quatro ficam simétricas numa grade de 9 de largura.

## Ícone informativo

Cinco sistemas **não têm menu próprio** — Terreno, Moedas, Limites, Encantamentos, Skins e Armaduras. Eles seguem a regra do repo para ícone não-clicável: sem CTA, e um rodapé em `&7` no lugar dela dizendo onde a coisa mora. Clicar não faz nada, e isso é o comportamento correto.

⚠️ **Terreno é informativo por outro motivo:** o plugin de terreno é **externo** e os comandos dele não estão neste repositório. Escrever `/plot auto` seria um chute, e comando errado num tutorial é pior que comando nenhum. Quando os comandos forem confirmados, o ícone ganha bloco de comandos e CTA.

---

## O conteúdo de cada ícone

### 1. Terreno

É onde spawner, máquina, cacto, fazenda e boss acontecem — sem terreno o jogador não faz nada. É o primeiro passo, e por isso abre o menu.

### 2. Ranks e Heads

- Existem **20 ranks com nome de mob** e **20 spawners dos mesmos 20 mobs**, na mesma ordem.
- Subir de rank custa **coins + heads do mob anterior**. Ex.: o rank Aranha pede `head BAT 10000` — head de Morcego, o rank de baixo (`GarnixRankUP/ranks/aranha.yml`).
- Head vem de **matar o mob no spawner**, e o spawner de cada mob **só é liberado pelo rank daquele mob** (`spawner.buy.<mob>`). É isso que fecha o ciclo.
- Head é **item negociável** — dá para comprar de outro jogador em vez de farmar. Coins não substituem o rank, mas head comprada sim.
- Cada rank dá **bônus permanente de ganho**.

> ⚠️ **Head não cai no chão, e drop também não.** Os dois ficam **guardados no spawner**: o drop é vendido de lá, e a head o jogador retira para o `/heads` (`GarnixSpawners/messages.yml` → *"Você armazenou x{amount} heads de {display}. (/heads)"*). Uma versão anterior da lore dizia "só cai matando o mob", o que descrevia errado a mecânica.

> ⚠️ **O termo visível é "Heads", não "Cabeças"** — é o que o repo usa em 15 dos 18 textos de jogador.

### 3. Mineração

Paga **coins + gemas**. Gemas compram os encantes da picareta — e coins não compram gema.

### 4. Fazenda

Irmã da mina: mesma mecânica, mesma escada de encantes. Paga **coins + sementes**.

### 5. Pesca

A via mais diferente das outras:

- **Vara própria**, com nível, XP, skin e encantes só dela, que sobe pescando.
- Fisga sozinha — é a via que **roda com o jogador parado**, por isso costuma ficar na conta secundária.
- Paga **corais** + coins.
- Corais compram na **loja da pesca**: chave de pesca, fly temporário, limite de armazém, Caixa Runas e Caixa Boosters.

> ⚠️ **Corrigido em 08/08/2026.** Este documento dizia que corais compram *"aumento de limite de spawner e máquina — a única via que converte em limite jogando"*. Os dois produtos **saíram da loja em 06/08/2026** pela régua do dono (*"só itens úteis e que não impactam de maneira forte na economia"*), junto com a chave de boss e a Caixa Recursos. A lore do ícone nunca chegou a carregar a versão errada.

> O contraste que ensina: mina e fazenda pagam muito e exigem o jogador na frente do PC; pesca paga pouco por fisgada mas nunca para.

### 6. Spawners

Paga **coins + dracmas + heads**. Dracmas pagam as trilhas de upgrade do spawner e os livros da espada. É a renda que roda com o jogador AFK, e a **única via sem teto físico** — o que faz do limite de spawner o item nº 1 do Ranking de Apelões.

Os mobs nascem e morrem sozinhos e **nada cai no chão**: o drop é vendido direto do spawner e a head fica guardada nele até o jogador retirar.

### 7. Máquinas

Produzem sozinhas, consomem **combustível**, e cada uma faz algo que nenhuma outra faz. Precisam de **limite de máquina** para serem colocadas.

### 8. Cacto e Armazém

Via de primeira classe pareada com as outras: cresce por reinvestimento, vende **só em coins**, e a expansão sai do próprio armazém. O **autosell** vende antes de encher; estoque cheio para de render.

### 9. Moedas

São **8** (`GarnixCurrencies/currencies/`):

| Moeda | Símbolo | Vem de |
|---|---|---|
| **Coins** | `$` | tudo — minerar, colher, pescar, vender no armazém e na loja |
| **Gemas** | `۞` | minerar |
| **Sementes** | `❋` | colher na fazenda |
| **Corais** | `✶` | pescar |
| **Dracmas** | `✆` | matar mobs de spawner |
| **Cash** | `❂` | recompensa diária, vínculo do Discord, eventos e site |
| **S. Limite** | `∞` | drop de crate, boss e Caixa Recursos |
| **M. Limite** | `∞` | mesma coisa, para máquinas |

Vale dizer que **só coins chega a números gigantes** — as outras ficam pequenas a temporada inteira **de propósito**, não é bug. É o que impede quem tem muito coin de comprar tudo.

> ✅ **Regra do dono (08/08/2026): toda moeda citada na lore vai na cor dela**, em qualquer lugar — inclusive no meio de uma linha `&7`, onde a cor volta para `&7` logo depois. As cores saem de `GarnixCurrencies/currencies/<id>.yml`, bloco `colors`:
>
> | Moeda | Símbolo | Nome |
> |---|---|---|
> | coins | `&2$` | `&a` |
> | gemas | `&d۞` | `&d` |
> | sementes | `&5❋` | `&5` |
> | corais | `&3✶` | `&3` |
> | dracmas | `&e✆` | `&e` |
> | cash | `&6❂` | `&6` |
> | s.limite | `&b∞` | `&b` |
> | m.limite | `&9∞` | `&9` |
>
> ⚠️ **`coins` é a única em que as duas cores diferem.** O erro fácil é escrever `&2coins`, que é a cor do cifrão e não a do nome.
>
> O conectivo entre duas moedas vai em `&7`, e substantivo que não é moeda (head, chave, runa) vai em `&f` — o formato canônico é ` &8 ▪ &fCusto: &acoins &7e &fheads `.

### 10. Os três limites

- **S. Limite** — quantos spawners podem estar colocados. Começa em **1**.
- **M. Limite** — quantas máquinas. Começa em **1**.
- **Armazém** — capacidade de estoque do terreno, começa em **3.000** (`GarnixWarehouse/config.yml`), sobe com o item *Limite de Armazém*, e o autosell vende sozinho antes de encher.

> A ideia que fecha a seção: **slot vazio não rende, e limite não se compra em volume** — cada slot tem que ter o melhor spawner que o jogador conseguir pagar. É por isso que subir de tier vale mais que ter muitos spawners fracos.

### 11. Loja do Servidor

`/loja`, pago em **coins**. É o primeiro sink de coins de quem está começando.

### 12. Encantamentos

Aumentam quanto cada bloco ou colheita rende. **Mina paga em gemas, fazenda em sementes**, e a pesca usa livros da vara. É o aviso contraintuitivo nº 2 do tutorial: cada via tem uma moeda que coins não compram, e quem ignora isso até o dia 10 perde a curva.

### 13. Skins

São **10 por via**, a de topo dá **+65%** de renda, e **7 iguais forjam a próxima**. As **3 mais raras não são forjáveis** — só caixa ou site.

### 14. Armaduras

**5 tiers**, 4 peças cada, e o conjunto T-V dá **+48%**. **Nunca vendidas no site** — quem paga compra chance, não a peça.

### 15. Caixas e Chaves

Dois sistemas com nome parecido e menus diferentes, e o jogador confunde:

- **Chave** abre uma crate física no mundo (`/crates`).
- **Caixa** é item que se clica na mão (`/caixas`).

### 16. Runas

São **4**, e cada uma vem de um lugar diferente **de propósito** (`GarnixFragments/runas.yml`):

| Runa | Vem de |
|---|---|
| **Sagrada** | bosses |
| **Eterna** | crates e caixas misteriosas |
| **Divina** | eventos de chat |
| **Primal** | eventos presenciais (PvP) |

- Runa **não é moeda do `/saldo`** — é item.
- Gasta na **loja de runas**, e quase todo item lá custa **dois tipos ao mesmo tempo**. Não dá para comprar nada bom fazendo só uma coisa.
- **Runa não inflaciona.** 500 runas valem o mesmo no dia 3 e no dia 20, enquanto coins multiplicam por ~6,6 todo dia. É por isso que ela compra o que coin nenhum compra.

> É o ponto mais valioso do tutorial inteiro para o jogador que só olha o saldo de coins.

> ✅ **Destravado em 07/08/2026.** Até essa data divina e primal **não tinham fonte nenhuma** — os 9 eventos de chat davam só Chave VIP e os 14 presenciais só cash e Chave VIP. As quatro runas saíam dos mesmos três lugares, e a tabela acima era ficção. Hoje os eventos entregam as duas (silenciosamente, por `givevirtual` — nenhuma mensagem de evento anuncia a runa).

### 17. Eventos

**26 rodadas por dia** disparadas pelos schedules do Pterodactyl: 16 de chat e 10 de arena. Pagam Chave VIP, cash e runa. Nada no jogo diz o horário, então quem não sabe que existem perde o maior canal de Chave VIP do servidor.

### 18. Bosses

Invoca no próprio terreno com chave de boss. Pagam **runa sagrada**, cash, limites e combustível.

### 19. Diárias e Tempo Online

`/recompensas` e `/tempo`. Um free acumula **360 a 500 de cash** na temporada só por logar — é o que faz ele chegar num item de faixa B.

### 20. Duelos e CoinFlip

Aposta de moeda entre jogadores. Não mexe em progressão, mas é onde coin troca de mão — e o perdedor não recupera.

### 21. Prestígio

Volta ao rank 1, a escada fica **linearmente mais cara**, e o único custo real são os **20 kits de rank**, que voltam à estaca zero. Todo o resto é patrimônio e fica: heads, dracmas, equipamento, spawners colocados e as permissões de compra.

### 22. Clãs

Grupo com tag própria, chat fechado (`/c`), aliados (`/ally`) e vantagem em área de PvP.

### 23 a 25. Mercado, Leilão e Loja de Baú

Os três canais de troca entre jogadores. O que importa dizer: **head é negociável**, então comprar head de outro jogador é rota legítima de rank — e quase ninguém percebe isso sozinho.

### 26. Correio

Por onde chega o que foi comprado no site e o que a staff entrega. Não perde por inventário cheio.

### 27 a 29. Warps, Regras e Discord

Rodapé. Reaproveitam `/warps`, `/regras` e `/discord` (`GarnixEssentials/custom-commands.yml`). O ícone de Discord carrega o **Celestial grátis de 3 dias** do vínculo — que é a única menção a VIP no menu inteiro.

---

## Fora do tutorial, de propósito

**VIP e Cash**, punições, anti-nuker, chat, baús, scoreboard, encantes de classe D/E e armadura/skin por tier individual.

✅ **Decisão do dono (08/08/2026): VIP fica de fora.** VIP em tutorial soa como vitrine, e o Celestial grátis do vínculo do Discord já se vende sozinho no rodapé.

## Dois avisos que a lore precisa dar

Contraintuitivos, e o jogador só descobre errando:

1. **Coins não sobem rank** — evita acumular 3 dias achando que compra o rank.
2. **Cada via tem uma moeda que coins não compram** — evita ignorar gemas/sementes/corais/dracmas até o dia 10.

## Manutenção

⚠️ **Todo comando do menu foi conferido no código-fonte** (`CommandBuilder.create` e `aliases`), não nos `messages.yml`. Se um plugin renomear o comando raiz, o ícone para de funcionar **em silêncio** — o menu não valida destino.

⚠️ **Os números da lore saem do config e envelhecem.** Confira ao mexer: 20 ranks, 10 skins por via, 5 tiers de armadura, +65% da skin de topo, +48% do conjunto T-V, 16 rodadas de chat e 10 de arena por dia, armazém em 3.000, limites começando em 1.

⚠️ **Pendência aberta:** os comandos do plugin de terreno. Enquanto não vierem, o ícone de Terreno fica informativo.
